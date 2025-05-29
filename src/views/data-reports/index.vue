<!-- 数据报表主页面 -->
<template>
  <div class="data-reports">
    <div class="page-header">
      <h2>数据报表</h2>
      <div class="global-filters">
        <el-select v-model="globalPlatform" placeholder="选择平台" class="filter-item">
          <el-option v-for="item in platforms" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        
        <el-date-picker
          v-model="globalDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :shortcuts="dateShortcuts"
          class="filter-item"
        />

        <el-button type="primary" @click="refreshData">
          <el-icon><Refresh /></el-icon>刷新数据
        </el-button>
      </div>
    </div>

    <div class="reports-container">
      <el-row :gutter="24">
        <el-col :span="24">
          <TrendAnalysis />
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <ConversionAnalysis />
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <RefundAnalysis />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import TrendAnalysis from './components/analysis/TrendAnalysis.vue'
import ConversionAnalysis from './components/analysis/ConversionAnalysis.vue'
import RefundAnalysis from './components/analysis/RefundAnalysis.vue'

// 平台选项
const platforms = [
  { label: '全部平台', value: 'all' },
  { label: '天猫', value: 'tmall' },
  { label: '京东', value: 'jd' },
  { label: '抖音', value: 'douyin' },
  { label: '自营商城', value: 'self' }
]

// 日期快捷选项
const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

const globalPlatform = ref('all')
const globalDateRange = ref(null)

// 刷新数据
const refreshData = () => {
  // TODO: 实现数据刷新逻辑
}
</script>

<style lang="scss" scoped>
.data-reports {
  padding: 24px;
  background: #1e1e1e;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    font-size: 24px;
    color: #e0e6ed;
    margin: 0;
  }
}

.global-filters {
  display: flex;
  gap: 16px;
  align-items: center;

  .filter-item {
    width: 200px;
  }
}

.reports-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style> 