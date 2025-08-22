<template>
  <div class="customer-analysis">
    <el-row :gutter="20">
      <!-- 统计卡片 -->
      <el-col :span="6" v-for="stat in statsCards" :key="stat.title">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: stat.color }">
              <component :is="stat.icon" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-title">{{ stat.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 客户增长趋势 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>客户增长趋势</span>
          </template>
          <div ref="growthChart" style="height: 300px;"></div>
        </el-card>
      </el-col>

      <!-- 客户等级分布 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>客户等级分布</span>
          </template>
          <div ref="levelChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 消费分析 -->
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>客户消费分析</span>
          </template>
          <div ref="consumeChart" style="height: 400px;"></div>
        </el-card>
      </el-col>

      <!-- 活跃度分析 -->
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>客户活跃度</span>
          </template>
          <div class="activity-list">
            <div v-for="item in activityData" :key="item.type" class="activity-item">
              <div class="activity-label">{{ item.type }}</div>
              <div class="activity-progress">
                <el-progress 
                  :percentage="item.percentage" 
                  :color="item.color"
                  :show-text="false"
                />
                <span class="activity-value">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { User, ShoppingCart, TrendCharts, DataLine } from '@element-plus/icons-vue'

// 统计卡片数据
const statsCards = ref([
  {
    title: '总客户数',
    value: '12,345',
    icon: User,
    color: '#409EFF'
  },
  {
    title: '活跃客户',
    value: '8,234',
    icon: TrendCharts,
    color: '#67C23A'
  },
  {
    title: '新增客户',
    value: '456',
    icon: DataLine,
    color: '#E6A23C'
  },
  {
    title: '消费客户',
    value: '6,789',
    icon: ShoppingCart,
    color: '#F56C6C'
  }
])

// 活跃度数据
const activityData = ref([
  { type: '日活跃', percentage: 85, value: '10,456', color: '#409EFF' },
  { type: '周活跃', percentage: 72, value: '8,890', color: '#67C23A' },
  { type: '月活跃', percentage: 68, value: '8,401', color: '#E6A23C' },
  { type: '季度活跃', percentage: 45, value: '5,567', color: '#F56C6C' }
])

// 图表引用
const growthChart = ref()
const levelChart = ref()
const consumeChart = ref()

// 初始化客户增长趋势图
const initGrowthChart = () => {
  const chart = echarts.init(growthChart.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['新增客户', '活跃客户']
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '新增客户',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210, 320, 290, 350, 400, 456],
        smooth: true,
        itemStyle: {
          color: '#409EFF'
        }
      },
      {
        name: '活跃客户',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330, 310, 420, 390, 450, 500, 520],
        smooth: true,
        itemStyle: {
          color: '#67C23A'
        }
      }
    ]
  }
  chart.setOption(option)
}

// 初始化客户等级分布图
const initLevelChart = () => {
  const chart = echarts.init(levelChart.value)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '客户等级',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: '钻石会员' },
          { value: 735, name: '金牌会员' },
          { value: 580, name: '银牌会员' },
          { value: 484, name: '普通会员' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  chart.setOption(option)
}

// 初始化消费分析图
const initConsumeChart = () => {
  const chart = echarts.init(consumeChart.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    legend: {
      data: ['消费金额', '消费次数', '客单价']
    },
    xAxis: [
      {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '消费金额',
        min: 0,
        max: 250,
        interval: 50,
        axisLabel: {
          formatter: '{value} 万'
        }
      },
      {
        type: 'value',
        name: '消费次数',
        min: 0,
        max: 25,
        interval: 5,
        axisLabel: {
          formatter: '{value} 次'
        }
      }
    ],
    series: [
      {
        name: '消费金额',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value + ' 万元'
          }
        },
        data: [20, 49, 70, 232, 256, 767, 135, 162, 32, 20, 64, 33]
      },
      {
        name: '消费次数',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value + ' 次'
          }
        },
        data: [26, 59, 90, 264, 287, 707, 175, 182, 48, 18, 60, 27]
      },
      {
        name: '客单价',
        type: 'line',
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function (value) {
            return value + ' 元'
          }
        },
        data: [20, 23, 24, 21, 19, 18, 17, 16, 15, 14, 13, 12]
      }
    ]
  }
  chart.setOption(option)
}

onMounted(async () => {
  await nextTick()
  initGrowthChart()
  initLevelChart()
  initConsumeChart()
})
</script>

<style scoped>
.customer-analysis {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  margin-right: 15px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.activity-list {
  padding: 20px 0;
}

.activity-item {
  margin-bottom: 20px;
}

.activity-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.activity-progress {
  display: flex;
  align-items: center;
}

.activity-progress .el-progress {
  flex: 1;
  margin-right: 10px;
}

.activity-value {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  min-width: 60px;
  text-align: right;
}
</style>
