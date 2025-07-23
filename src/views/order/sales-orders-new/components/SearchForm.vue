<template>
  <div class="search-form">
    <el-form :model="searchForm" @submit.prevent="handleSearch">
      <!-- Order NO 输入框 -->
      <el-form-item label="Order NO">
        <el-select
          v-model="searchForm.orderNos"
          multiple
          filterable
          allow-create
          default-first-option
          :reserve-keyword="false"
          placeholder="Enter order numbers"
          class="w-full"
          @keyup.enter="handleOrderNoEnter"
        >
          <el-option
            v-for="item in searchForm.orderNos"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>

      <!-- Channel Order NO 输入框 -->
      <el-form-item label="Channel Order NO">
        <el-select
          v-model="searchForm.channelOrderNos"
          multiple
          filterable
          allow-create
          default-first-option
          :reserve-keyword="false"
          placeholder="Enter channel order numbers"
          class="w-full"
          @keyup.enter="handleChannelOrderNoEnter"
        >
          <el-option
            v-for="item in searchForm.channelOrderNos"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>

      <!-- 状态多选 -->
      <el-form-item label="Status">
        <el-select
          v-model="searchForm.statuses"
          multiple
          placeholder="Select statuses"
          class="w-full"
        >
          <el-option
            v-for="status in Object.values(OrderStatus)"
            :key="status"
            :label="status"
            :value="status"
          />
        </el-select>
      </el-form-item>

      <!-- 渠道多选 -->
      <el-form-item label="Channel">
        <el-select
          v-model="searchForm.channels"
          multiple
          placeholder="Select channels"
          class="w-full"
        >
          <el-option
            v-for="channel in Object.values(ChannelType)"
            :key="channel"
            :label="channel"
            :value="channel"
          />
        </el-select>
      </el-form-item>

      <!-- 异常类型多选 -->
      <el-form-item label="Exception Type">
        <el-select
          v-model="searchForm.exceptionTypes"
          multiple
          placeholder="Select exception types"
          class="w-full"
        >
          <el-option
            v-for="type in Object.values(ExceptionType)"
            :key="type"
            :label="type"
            :value="type"
          />
        </el-select>
      </el-form-item>

      <!-- 时间范围选择 -->
      <el-form-item label="Date Range">
        <el-date-picker
          v-model="searchForm.dateRange"
          type="daterange"
          range-separator="to"
          start-placeholder="Start date"
          end-placeholder="End date"
          class="w-full"
        />
      </el-form-item>

      <!-- 搜索按钮 -->
      <el-form-item>
        <el-button type="primary" @click="handleSearch">Search</el-button>
        <el-button @click="handleReset">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { OrderStatus, ChannelType, ExceptionType, type SearchCondition } from '../types'

const emit = defineEmits<{
  (e: 'search', condition: SearchCondition): void
}>()

// 搜索表单数据
const searchForm = ref<SearchCondition>({
  orderNos: [],
  channelOrderNos: [],
  statuses: [OrderStatus.All],
  channels: [],
  exceptionTypes: [],
  dateRange: null
})

// 处理 Order NO 回车事件
const handleOrderNoEnter = (e: KeyboardEvent) => {
  const input = e.target as HTMLInputElement
  const value = input.value.trim()
  if (value) {
    // 处理逗号分隔的多个订单号
    const orders = value.split(',').map(o => o.trim()).filter(Boolean)
    searchForm.value.orderNos.push(...orders)
    input.value = ''
  }
}

// 处理 Channel Order NO 回车事件
const handleChannelOrderNoEnter = (e: KeyboardEvent) => {
  const input = e.target as HTMLInputElement
  const value = input.value.trim()
  if (value) {
    // 处理逗号分隔的多个订单号
    const orders = value.split(',').map(o => o.trim()).filter(Boolean)
    searchForm.value.channelOrderNos.push(...orders)
    input.value = ''
  }
}

// 搜索
const handleSearch = () => {
  emit('search', { ...searchForm.value })
}

// 重置
const handleReset = () => {
  searchForm.value = {
    orderNos: [],
    channelOrderNos: [],
    statuses: [OrderStatus.All],
    channels: [],
    exceptionTypes: [],
    dateRange: null
  }
}
</script>

<style lang="scss" scoped>
.search-form {
  padding: 16px;
  background: #1e2227;
  border-radius: 8px;
  margin-bottom: 16px;

  :deep(.el-form) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;

    .el-form-item {
      margin-bottom: 0;

      .el-form-item__label {
        color: #8b949e;
        font-size: 13px;
      }

      .el-input__wrapper,
      .el-select {
        width: 100%;
      }

      .el-input__wrapper {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: none;

        &:hover {
          border-color: #0066ff;
        }

        &.is-focus {
          border-color: #0066ff;
          box-shadow: 0 0 0 1px #0066ff;
        }
      }

      .el-select {
        .el-input.is-focus .el-input__wrapper {
          border-color: #0066ff;
          box-shadow: 0 0 0 1px #0066ff;
        }
      }
    }

    .el-button {
      height: 32px;
      padding: 0 16px;
      font-size: 13px;

      &.el-button--primary {
        background: #0066ff;
        border-color: #0066ff;

        &:hover {
          background: #1a75ff;
          border-color: #1a75ff;
        }
      }
    }
  }
}

// 工具类
.w-full {
  width: 100%;
}
</style> 