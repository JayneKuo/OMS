<template>
  <el-card class="filter-panel">
    <el-form :model="form" label-width="100px" @submit.prevent>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="客户：">
            <el-select v-model="form.customers" multiple filterable placeholder="请选择客户">
              <el-option v-for="item in customerOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="渠道：">
            <el-select v-model="form.channels" multiple filterable placeholder="请选择渠道">
              <el-option v-for="item in channelOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="SKU：">
            <el-select v-model="form.skus" multiple filterable placeholder="请选择SKU">
              <el-option :label="'全部商品'" :value="'ALL'" />
              <el-option v-for="item in skuOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="时间周期：">
            <el-date-picker
              v-model="form.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 10px;">
        <el-col :span="6">
          <el-form-item label="预测周期：">
            <el-select v-model="form.forecastPeriod" placeholder="请选择预测周期">
              <el-option label="未来7天" value="7" />
              <el-option label="未来15天" value="15" />
              <el-option label="未来30天" value="30" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <div class="filter-actions">
            <el-button type="primary" @click="onSearch">查询现状</el-button>
            <el-button type="success" @click="onPredict">生成预测</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const emit = defineEmits(['search', 'predict'])
const form = ref({
  customers: [],
  channels: [],
  skus: [],
  dateRange: [],
  forecastPeriod: '7'
})
// TODO: 这里的选项应由父组件/接口传入
const customerOptions = ref([
  { label: '客户A', value: 'A' },
  { label: '客户B', value: 'B' }
])
const channelOptions = ref([
  { label: '天猫', value: 'tmall' },
  { label: '京东', value: 'jd' }
])
const skuOptions = ref([
  { label: 'SKU001', value: 'SKU001' },
  { label: 'SKU002', value: 'SKU002' }
])
const onSearch = () => {
  emit('search', { ...form.value })
}
const onPredict = () => {
  emit('predict', { ...form.value })
}
</script>
<style scoped>
.filter-panel {
  margin-bottom: 20px;
  border-radius: 8px;
}
.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style> 