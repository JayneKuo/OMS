<template>
  <el-form
    ref="formRef"
    :model="formModel"
    label-width="100px"
    class="search-form"
  >
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="Admission No.">
          <el-input
            v-model="formModel.admissionNo"
            placeholder="请输入报关单号"
            clearable
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Port Code">
          <el-input
            v-model="formModel.portCode"
            placeholder="请输入港口代码"
            clearable
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="FTZ No.">
          <el-input
            v-model="formModel.ftzNo"
            placeholder="请输入自贸区编号"
            clearable
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Status">
          <el-select
            v-model="formModel.status"
            placeholder="请选择状态"
            clearable
            style="width: 100%"
          >
            <el-option label="Pending" value="Pending" />
            <el-option label="Approved" value="Approved" />
            <el-option label="Rejected" value="Rejected" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="Date Range">
          <el-date-picker
            v-model="formModel.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <div class="form-buttons">
          <el-button
            type="primary"
            :loading="loading"
            @click="handleSearch"
          >
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  formModel: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['search', 'reset'])

const handleSearch = () => {
  emit('search')
}

const handleReset = () => {
  emit('reset')
}
</script>

<style lang="scss" scoped>
.search-form {
  width: 100%;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  height: 100%;
  align-items: center;
}
</style> 