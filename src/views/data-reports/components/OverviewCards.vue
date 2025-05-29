<template>
  <el-row :gutter="20" class="overview-cards">
    <el-col :span="6">
      <el-card class="overview-card">
        <div class="card-title">
          总销量
          <el-tooltip effect="dark" :content="formulaMap.sales">
            <el-icon style="margin-left:4px;cursor:pointer;"><InfoFilled /></el-icon>
          </el-tooltip>
        </div>
        <div class="card-value">{{ overviewData.sales || overviewData.forecastSales || 0 }}</div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card class="overview-card">
        <div class="card-title">
          转化率
          <el-tooltip effect="dark" :content="formulaMap.conversionRate">
            <el-icon style="margin-left:4px;cursor:pointer;"><InfoFilled /></el-icon>
          </el-tooltip>
        </div>
        <div class="card-value">{{ overviewData.conversionRate || overviewData.forecastConversionRate || 0 }}%</div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card class="overview-card">
        <div class="card-title">
          流量
          <el-tooltip effect="dark" :content="formulaMap.traffic">
            <el-icon style="margin-left:4px;cursor:pointer;"><InfoFilled /></el-icon>
          </el-tooltip>
        </div>
        <div class="card-value">{{ overviewData.traffic || overviewData.forecastTraffic || 0 }}</div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card class="overview-card">
        <div class="card-title">
          客单价
          <el-tooltip effect="dark" :content="formulaMap.avgOrderValue">
            <el-icon style="margin-left:4px;cursor:pointer;"><InfoFilled /></el-icon>
          </el-tooltip>
        </div>
        <div class="card-value">{{ overviewData.avgOrderValue || overviewData.forecastAvgOrderValue || 0 }}</div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'
const props = defineProps<{ overviewData: any, formulaMap: Record<string, string> }>()
</script>
<style scoped>
.overview-cards {
  margin-bottom: 20px;
}
.overview-card {
  border-radius: 8px;
  text-align: center;
  background: #23272e;
  color: #e0e6ed;
}
.card-title {
  font-size: 14px;
  color: #8a919f;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}
.card-value {
  font-size: 24px;
  font-weight: 600;
}
</style> 