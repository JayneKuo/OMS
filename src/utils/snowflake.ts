/**
 * 雪花算法ID生成器
 * 64位ID结构：1位符号位 + 41位时间戳 + 5位数据中心ID + 5位机器ID + 12位序列号
 */
class SnowflakeIdGenerator {
  private readonly twepoch = 1704067200000n // 2024-01-01 00:00:00 UTC 作为起始时间戳
  private readonly datacenterIdBits = 5n
  private readonly workerIdBits = 5n
  private readonly sequenceBits = 12n
  
  private readonly maxDatacenterId = -1n ^ (-1n << this.datacenterIdBits) // 31
  private readonly maxWorkerId = -1n ^ (-1n << this.workerIdBits) // 31
  private readonly sequenceMask = -1n ^ (-1n << this.sequenceBits) // 4095
  
  private readonly workerIdShift = this.sequenceBits // 12
  private readonly datacenterIdShift = this.sequenceBits + this.workerIdBits // 17
  private readonly timestampLeftShift = this.sequenceBits + this.workerIdBits + this.datacenterIdBits // 22
  
  private sequence = 0n
  private lastTimestamp = -1n
  
  constructor(
    private readonly datacenterId: bigint = 1n,
    private readonly workerId: bigint = 1n
  ) {
    if (datacenterId > this.maxDatacenterId || datacenterId < 0n) {
      throw new Error(`datacenterId can't be greater than ${this.maxDatacenterId} or less than 0`)
    }
    if (workerId > this.maxWorkerId || workerId < 0n) {
      throw new Error(`workerId can't be greater than ${this.maxWorkerId} or less than 0`)
    }
  }
  
  /**
   * 生成下一个ID
   */
  nextId(): string {
    let timestamp = this.currentTimestamp()
    
    // 如果当前时间小于上一次ID生成的时间戳，说明系统时钟回退过，抛出异常
    if (timestamp < this.lastTimestamp) {
      const offset = this.lastTimestamp - timestamp
      throw new Error(`Clock moved backwards. Refusing to generate id for ${offset} milliseconds`)
    }
    
    // 如果是同一时间生成的，则进行毫秒内序列
    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & this.sequenceMask
      // 毫秒内序列溢出
      if (this.sequence === 0n) {
        // 阻塞到下一个毫秒，获得新的时间戳
        timestamp = this.tilNextMillis(this.lastTimestamp)
      }
    } else {
      // 时间戳改变，毫秒内序列重置
      this.sequence = 0n
    }
    
    // 上次生成ID的时间戳
    this.lastTimestamp = timestamp
    
    // 移位并通过或运算拼到一起组成64位的ID
    const id = ((timestamp - this.twepoch) << this.timestampLeftShift) |
               (this.datacenterId << this.datacenterIdShift) |
               (this.workerId << this.workerIdShift) |
               this.sequence
    
    return id.toString()
  }
  
  /**
   * 获取当前时间戳（毫秒）
   */
  private currentTimestamp(): bigint {
    return BigInt(Date.now())
  }
  
  /**
   * 阻塞到下一个毫秒，直到获得新的时间戳
   */
  private tilNextMillis(lastTimestamp: bigint): bigint {
    let timestamp = this.currentTimestamp()
    while (timestamp <= lastTimestamp) {
      timestamp = this.currentTimestamp()
    }
    return timestamp
  }
}

// 创建默认实例（可以根据实际部署情况配置datacenterId和workerId）
// 这里使用环境变量或默认值，实际项目中应该从配置中心获取
const getDatacenterId = (): bigint => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DATACENTER_ID) {
    return BigInt(import.meta.env.VITE_DATACENTER_ID)
  }
  return 1n
}

const getWorkerId = (): bigint => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WORKER_ID) {
    return BigInt(import.meta.env.VITE_WORKER_ID)
  }
  // 使用浏览器指纹或随机数作为workerId（实际项目中应该从服务器获取）
  const storedWorkerId = localStorage.getItem('snowflake_worker_id')
  if (storedWorkerId) {
    return BigInt(storedWorkerId)
  }
  const workerId = BigInt(Math.floor(Math.random() * 31) + 1)
  localStorage.setItem('snowflake_worker_id', workerId.toString())
  return workerId
}

const snowflake = new SnowflakeIdGenerator(getDatacenterId(), getWorkerId())

/**
 * 生成雪花算法ID
 */
export function generateSnowflakeId(): string {
  return snowflake.nextId()
}

/**
 * 生成Load NO
 * 格式：LD + YYYYMMDD + 序号（3位）
 * 例如：LD20250101001
 */
export function generateLoadNo(): string {
  const now = new Date()
  const dateStr = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0')
  
  // 从localStorage获取当日序号，如果没有则从1开始
  const storageKey = `load_no_sequence_${dateStr}`
  const lastSequence = parseInt(localStorage.getItem(storageKey) || '0', 10)
  const nextSequence = lastSequence + 1
  
  // 保存序号到localStorage（实际项目中应该从服务器获取）
  localStorage.setItem(storageKey, nextSequence.toString())
  
  const sequenceStr = String(nextSequence).padStart(3, '0')
  return `LD${dateStr}${sequenceStr}`
}

