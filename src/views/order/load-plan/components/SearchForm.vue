<template>
  <div class="search-form">
    <el-form :model="searchParams" label-width="120px">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-form-item label="Plan NO">
            <el-input
              v-model="searchParams.planNo"
              placeholder="Enter plan NO"
              clearable
              @keyup.enter="handleSearch"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Plan Name">
            <el-input
              v-model="searchParams.planName"
              placeholder="Enter plan name"
              clearable
              @keyup.enter="handleSearch"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Customer">
            <el-select
              v-model="searchParams.customerId"
              placeholder="Select customer"
              clearable
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="item in customers"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Carrier">
            <el-select
              v-model="searchParams.carrierId"
              placeholder="Select carrier"
              clearable
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="item in carriers"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="6">
          <el-form-item label="Mode">
            <el-select
              v-model="searchParams.mode"
              placeholder="Select mode"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in LOAD_PLAN_MODES"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Status">
            <el-select
              v-model="searchParams.status"
              placeholder="Select status"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in LOAD_PLAN_STATUS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Planned Ship Date">
            <el-date-picker
              v-model="searchParams.plannedShipDateRange"
              type="daterange"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Created Date">
            <el-date-picker
              v-model="searchParams.createdDateRange"
              type="daterange"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="24" class="button-group">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            Search
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshLeft /></el-icon>
            Reset
          </el-button>
          <el-button link type="primary" @click="toggleAdvanced">
            {{ showAdvanced ? 'Hide' : 'Show' }} Advanced Search
            <el-icon>
              <component :is="showAdvanced ? 'ArrowUp' : 'ArrowDown'" />
            </el-icon>
          </el-button>
        </el-col>
      </el-row>

      <div v-if="showAdvanced" class="advanced-search">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="Load Type">
              <el-select
                v-model="searchParams.loadType"
                placeholder="Select load type"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in LOAD_PLAN_TYPES"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Ship From City">
              <el-input
                v-model="searchParams.shipFromCity"
                placeholder="Enter city"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Ship To City">
              <el-input
                v-model="searchParams.shipToCity"
                placeholder="Enter city"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Planned Delivery Date">
              <el-date-picker
                v-model="searchParams.plannedDeliveryDateRange"
                type="daterange"
                range-separator="To"
                start-placeholder="Start date"
                end-placeholder="End date"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, RefreshLeft, ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { LOAD_PLAN_MODES, LOAD_PLAN_TYPES, LOAD_PLAN_STATUS, type LoadPlanSearchParams } from '../types'

const emit = defineEmits<{
  search: [params: LoadPlanSearchParams]
  reset: []
}>()

const showAdvanced = ref(false)

const searchParams = reactive<LoadPlanSearchParams>({
  planNo: '',
  planName: '',
  customerId: '',
  carrierId: '',
  mode: '',
  loadType: '',
  status: '',
  plannedShipDateRange: null,
  plannedDeliveryDateRange: null,
  createdDateRange: null,
  shipFromCity: '',
  shipToCity: ''
})

// Mock data - 实际使用时从API获取
const customers = ref([
  { label: 'Customer A', value: '1' },
  { label: 'Customer B', value: '2' },
  { label: 'Customer C', value: '3' }
])

const carriers = ref([
  { label: 'FedEx', value: '1' },
  { label: 'UPS', value: '2' },
  { label: 'DHL', value: '3' },
  { label: 'USPS', value: '4' }
])

const handleSearch = () => {
  emit('search', { ...searchParams })
}

const handleReset = () => {
  Object.keys(searchParams).forEach(key => {
    const k = key as keyof LoadPlanSearchParams
    if (k.includes('Range') || k === 'plannedShipDateRange' || k === 'plannedDeliveryDateRange' || k === 'createdDateRange') {
      (searchParams as any)[k] = null
    } else {
      (searchParams as any)[k] = ''
    }
  })
  emit('reset')
}

const toggleAdvanced = () => {
  showAdvanced.value = !showAdvanced.value
}
</script>

<style scoped lang="scss">
.search-form {
  padding: 20px;
  background-color: #1e2227;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 16px;

  :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #8b949e;
  }

  :deep(.el-input__wrapper) {
    background-color: #2d3139;
    box-shadow: none;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  :deep(.el-input__inner) {
    color: #fff;
  }

  :deep(.el-select) {
    .el-input__wrapper {
      background-color: #2d3139;
    }
  }

  :deep(.el-date-editor) {
    background-color: #2d3139;
  }

  .button-group {
    display: flex;
    gap: 12px;
    
    .el-button {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }

  .advanced-search {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px dashed rgba(255, 255, 255, 0.1);
  }
}
</style>

