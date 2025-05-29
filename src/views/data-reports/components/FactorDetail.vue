<template>
  <div class="factor-detail">
    <template v-if="topFactors && topFactors.length">
      <div class="factors-title">主要影响因子</div>
      <div v-for="(factor, index) in topFactors" :key="factor.name" class="factor-item">
        <div class="factor-header">
          <div class="factor-rank-name">
            <span class="factor-rank">{{ index + 1 }}</span>
            <span class="factor-name">{{ factor.name }}</span>
          </div>
          <span class="factor-value">{{ factor.value }}%</span>
        </div>
        <div class="factor-desc">{{ factor.detail }}</div>
      </div>
    </template>
    <template v-else>
      <div class="factor-title">{{ factor || '请选择因子' }}</div>
      <div class="factor-desc">{{ detail || '暂无详细说明' }}</div>
    </template>
  </div>
</template>

<script setup lang="ts">
interface Factor {
  name: string
  value: number
  detail: string
}

const props = defineProps<{
  factor: string
  detail: string
  topFactors?: Factor[]
}>()
</script>

<style scoped>
.factor-detail {
  height: 100%;
  padding: 0 16px;
}

.factors-title {
  font-size: 16px;
  font-weight: 600;
  color: #67c23a;
  margin-bottom: 20px;
}

.factor-item {
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
}

.factor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.factor-rank-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.factor-rank {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #67c23a;
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.factor-name {
  font-size: 14px;
  font-weight: 500;
  color: #e0e6ed;
}

.factor-value {
  font-size: 14px;
  color: #67c23a;
  font-weight: 500;
}

.factor-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}

/* 兼容旧版展示 */
.factor-title {
  font-size: 16px;
  font-weight: 600;
  color: #67c23a;
  margin-bottom: 8px;
}
</style> 