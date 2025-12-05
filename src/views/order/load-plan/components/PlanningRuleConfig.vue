<template>
  <div class="planning-rule-config">
    <el-form :model="ruleData" label-width="160px">
      <!-- 基本信息 -->
      <div class="form-section">
        <div class="section-title">Basic Information</div>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Rule Name" required>
              <el-input v-model="ruleData.name" placeholder="Enter rule name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Priority">
              <el-input-number
                v-model="ruleData.priority"
                :min="0"
                :max="999"
                placeholder="0-999"
                style="width: 100%"
              />
              <div class="form-tip">Higher number = higher priority</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="Description">
              <el-input
                v-model="ruleData.description"
                type="textarea"
                :rows="2"
                placeholder="Enter rule description"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Status">
              <el-switch
                v-model="ruleData.enabled"
                active-text="Enabled"
                inactive-text="Disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Auto Execute">
              <el-switch
                v-model="ruleData.autoExecute"
                active-text="Yes"
                inactive-text="No"
              />
              <div class="form-tip">Automatically execute approved plans</div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 订单筛选规则 -->
      <div class="form-section">
        <div class="section-title">Order Filter Rules</div>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Customers">
              <el-select
                v-model="ruleData.orderFilters.customers"
                multiple
                filterable
                placeholder="Select customers (optional)"
                style="width: 100%"
              >
                <el-option
                  v-for="customer in customers"
                  :key="customer.value"
                  :label="customer.label"
                  :value="customer.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Warehouses">
              <el-select
                v-model="ruleData.orderFilters.warehouses"
                multiple
                filterable
                placeholder="Select warehouses (optional)"
                style="width: 100%"
              >
                <el-option
                  v-for="warehouse in warehouses"
                  :key="warehouse.value"
                  :label="warehouse.label"
                  :value="warehouse.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Carriers">
              <el-select
                v-model="ruleData.orderFilters.carriers"
                multiple
                filterable
                placeholder="Select carriers (optional)"
                style="width: 100%"
              >
                <el-option
                  v-for="carrier in carriers"
                  :key="carrier.value"
                  :label="carrier.label"
                  :value="carrier.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Channels">
              <el-select
                v-model="ruleData.orderFilters.channels"
                multiple
                filterable
                placeholder="Select channels (optional)"
                style="width: 100%"
              >
                <el-option label="Website" value="website" />
                <el-option label="App" value="app" />
                <el-option label="Third Party" value="third_party" />
                <el-option label="Offline" value="offline" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Ship To Regions">
              <el-select
                v-model="ruleData.orderFilters.shipToRegions"
                multiple
                filterable
                placeholder="Select regions"
                style="width: 100%"
              >
                <el-option label="NY" value="NY" />
                <el-option label="CA" value="CA" />
                <el-option label="TX" value="TX" />
                <el-option label="FL" value="FL" />
                <el-option label="IL" value="IL" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Ship To Cities">
              <el-select
                v-model="ruleData.orderFilters.shipToCities"
                multiple
                filterable
                allow-create
                placeholder="Select or enter cities"
                style="width: 100%"
              >
                <el-option label="New York" value="New York" />
                <el-option label="Los Angeles" value="Los Angeles" />
                <el-option label="Chicago" value="Chicago" />
                <el-option label="Houston" value="Houston" />
                <el-option label="Phoenix" value="Phoenix" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Ship To Zip Codes">
              <el-select
                v-model="ruleData.orderFilters.shipToZipCodes"
                multiple
                filterable
                allow-create
                placeholder="Select or enter zip codes"
                style="width: 100%"
              >
                <el-option label="10001" value="10001" />
                <el-option label="90001" value="90001" />
                <el-option label="60601" value="60601" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Delivery Date Range">
              <div style="display: flex; gap: 8px; align-items: center;">
                <span>From</span>
                <el-input-number
                  v-model="ruleData.orderFilters.deliveryDateRange.daysFromNow"
                  :min="0"
                  placeholder="Days"
                  style="width: 100px"
                />
                <span>days from now</span>
              </div>
              <div style="display: flex; gap: 8px; align-items: center; margin-top: 8px;">
                <span>Max</span>
                <el-input-number
                  v-model="ruleData.orderFilters.deliveryDateRange.maxDays"
                  :min="1"
                  placeholder="Days"
                  style="width: 100px"
                />
                <span>days</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Created Date Range">
              <div style="display: flex; gap: 8px; align-items: center;">
                <span>From</span>
                <el-input-number
                  v-model="ruleData.orderFilters.createdDateRange.daysFromNow"
                  :min="0"
                  placeholder="Days"
                  style="width: 100px"
                />
                <span>days from now</span>
              </div>
              <div style="display: flex; gap: 8px; align-items: center; margin-top: 8px;">
                <span>Max</span>
                <el-input-number
                  v-model="ruleData.orderFilters.createdDateRange.maxDays"
                  :min="1"
                  placeholder="Days"
                  style="width: 100px"
                />
                <span>days</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="Min Order Qty">
              <el-input-number
                v-model="ruleData.orderFilters.minOrderQuantity"
                :min="1"
                placeholder="Min"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Max Order Qty">
              <el-input-number
                v-model="ruleData.orderFilters.maxOrderQuantity"
                :min="1"
                placeholder="Max"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Min Order Amount">
              <el-input-number
                v-model="ruleData.orderFilters.minOrderAmount"
                :min="0"
                :precision="2"
                placeholder="Min $"
                style="width: 100%"
              >
                <template #prepend>$</template>
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Max Order Amount">
              <el-input-number
                v-model="ruleData.orderFilters.maxOrderAmount"
                :min="0"
                :precision="2"
                placeholder="Max $"
                style="width: 100%"
              >
                <template #prepend>$</template>
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Order Statuses">
              <el-select
                v-model="ruleData.orderFilters.orderStatuses"
                multiple
                placeholder="Select order statuses"
                style="width: 100%"
              >
                <el-option label="Allocated" value="Allocated" />
                <el-option label="Warehouse Received" value="WarehouseReceived" />
                <el-option label="Planned" value="Planned" />
                <el-option label="Picked" value="Picked" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Order Tags">
              <el-select
                v-model="ruleData.orderFilters.orderTags"
                multiple
                filterable
                allow-create
                placeholder="Select or create tags"
                style="width: 100%"
              >
                <el-option label="Urgent" value="urgent" />
                <el-option label="Fragile" value="fragile" />
                <el-option label="Express" value="express" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="SKU Categories">
              <el-select
                v-model="ruleData.orderFilters.skuCategories"
                multiple
                filterable
                placeholder="Select SKU categories"
                style="width: 100%"
              >
                <el-option label="Electronics" value="electronics" />
                <el-option label="Clothing" value="clothing" />
                <el-option label="Food" value="food" />
                <el-option label="Books" value="books" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="SKU Brands">
              <el-select
                v-model="ruleData.orderFilters.skuBrands"
                multiple
                filterable
                placeholder="Select SKU brands"
                style="width: 100%"
              >
                <el-option label="Brand A" value="brand-a" />
                <el-option label="Brand B" value="brand-b" />
                <el-option label="Brand C" value="brand-c" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="SKU List">
              <el-select
                v-model="ruleData.orderFilters.skuList"
                multiple
                filterable
                allow-create
                placeholder="Select or enter SKUs"
                style="width: 100%"
              >
                <el-option label="SKU-001" value="SKU-001" />
                <el-option label="SKU-002" value="SKU-002" />
                <el-option label="SKU-003" value="SKU-003" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Custom Expression">
              <el-input
                v-model="ruleData.orderFilters.customExpression"
                type="textarea"
                :rows="2"
                placeholder="Custom filter expression (optional)"
              />
              <div class="form-tip">Advanced: Use custom expression for complex filtering</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Exclude Customers">
              <el-select
                v-model="ruleData.orderFilters.excludeCustomers"
                multiple
                filterable
                placeholder="Exclude these customers"
                style="width: 100%"
              >
                <el-option
                  v-for="customer in customers"
                  :key="customer.value"
                  :label="customer.label"
                  :value="customer.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Exclude Carriers">
              <el-select
                v-model="ruleData.orderFilters.excludeCarriers"
                multiple
                filterable
                placeholder="Exclude these carriers"
                style="width: 100%"
              >
                <el-option
                  v-for="carrier in carriers"
                  :key="carrier.value"
                  :label="carrier.label"
                  :value="carrier.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 分组规则 -->
      <div class="form-section">
        <div class="section-title">Grouping Rules</div>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Group By" required>
              <el-select
                v-model="ruleData.groupingRules.groupBy"
                placeholder="Select grouping method"
                style="width: 100%"
              >
                <el-option label="Customer" value="customer" />
                <el-option label="Carrier" value="carrier" />
                <el-option label="Warehouse" value="warehouse" />
                <el-option label="Destination" value="destination" />
                <el-option label="Delivery Date" value="deliveryDate" />
                <el-option label="Custom" value="custom" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Max Orders Per Group">
              <el-input-number
                v-model="ruleData.groupingRules.maxOrdersPerGroup"
                :min="1"
                placeholder="Unlimited if empty"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Max Weight (kg)">
              <el-input-number
                v-model="ruleData.groupingRules.maxWeightPerGroup"
                :min="0"
                :precision="2"
                placeholder="Unlimited"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Max Volume (m³)">
              <el-input-number
                v-model="ruleData.groupingRules.maxVolumePerGroup"
                :min="0"
                :precision="2"
                placeholder="Unlimited"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Max Pallets">
              <el-input-number
                v-model="ruleData.groupingRules.maxPalletsPerGroup"
                :min="0"
                placeholder="Unlimited"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Allow Cross Customer">
              <el-switch
                v-model="ruleData.groupingRules.allowCrossCustomer"
                active-text="Yes"
                inactive-text="No"
              />
              <div class="form-tip">Allow grouping orders from different customers</div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 计划生成规则 -->
      <div class="form-section">
        <div class="section-title">Plan Generation Rules</div>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Default Mode" required>
              <el-select
                v-model="ruleData.planRules.defaultMode"
                placeholder="Select mode"
                style="width: 100%"
              >
                <el-option label="CENTRAL" value="CENTRAL" />
                <el-option label="CUSTOMER" value="CUSTOMER" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Default Load Type" required>
              <el-select
                v-model="ruleData.planRules.defaultLoadType"
                placeholder="Select load type"
                style="width: 100%"
              >
                <el-option label="LTL" value="LTL" />
                <el-option label="FTL" value="FTL" />
                <el-option label="PARCEL" value="PARCEL" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Default Freight Term">
              <el-select
                v-model="ruleData.planRules.defaultFreightTerm"
                placeholder="Select freight term"
                style="width: 100%"
              >
                <el-option
                  v-for="term in FREIGHT_TERMS"
                  :key="term.value"
                  :label="term.label"
                  :value="term.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Carrier Selection">
              <el-select
                v-model="ruleData.planRules.carrierSelectionRule.type"
                placeholder="Select method"
                style="width: 100%"
              >
                <el-option label="Auto" value="auto" />
                <el-option label="Preferred" value="preferred" />
                <el-option label="Cheapest" value="cheapest" />
                <el-option label="Fastest" value="fastest" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="ruleData.planRules.carrierSelectionRule.type === 'preferred'" :span="12">
            <el-form-item label="Preferred Carriers">
              <el-select
                v-model="ruleData.planRules.carrierSelectionRule.preferredCarriers"
                multiple
                filterable
                placeholder="Select preferred carriers"
                style="width: 100%"
              >
                <el-option
                  v-for="carrier in carriers"
                  :key="carrier.value"
                  :label="carrier.label"
                  :value="carrier.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Plan Name Template">
              <el-input
                v-model="ruleData.planRules.planNameTemplate"
                placeholder="e.g., Plan - {customer} - {date}"
              />
              <div class="form-tip">Available variables: {customer}, {carrier}, {date}, {warehouse}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Auto Calculate Freight">
              <el-switch
                v-model="ruleData.planRules.autoCalculateFreight"
                active-text="Yes"
                inactive-text="No"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Ship Date Offset">
              <el-input-number
                v-model="ruleData.planRules.planDateRule.shipDateOffset"
                :min="0"
                placeholder="Days"
                style="width: 100%"
              />
              <div class="form-tip">Days from today for planned ship date</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Delivery Date Offset">
              <el-input-number
                v-model="ruleData.planRules.planDateRule.deliveryDateOffset"
                :min="0"
                placeholder="Days"
                style="width: 100%"
              />
              <div class="form-tip">Days from ship date for planned delivery date</div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { PlanningRule } from '../types'
import { FREIGHT_TERMS } from '../types'

interface Props {
  modelValue: PlanningRule
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: PlanningRule]
}>()

const ruleData = reactive<PlanningRule>({
  ...props.modelValue,
  orderFilters: {
    customers: [],
    warehouses: [],
    carriers: [],
    channels: [],
    shipToRegions: [],
    shipToCities: [],
    shipToZipCodes: [],
    deliveryDateRange: {
      daysFromNow: 0,
      maxDays: 30
    },
    createdDateRange: {
      daysFromNow: 0,
      maxDays: 30
    },
    orderStatuses: [],
    minOrderQuantity: undefined,
    maxOrderQuantity: undefined,
    minOrderAmount: undefined,
    maxOrderAmount: undefined,
    skuCategories: [],
    skuBrands: [],
    skuList: [],
    orderTags: [],
    excludeCustomers: [],
    excludeCarriers: [],
    excludeWarehouses: [],
    customExpression: undefined,
    ...props.modelValue.orderFilters
  },
  groupingRules: {
    ...props.modelValue.groupingRules
  },
  planRules: {
    ...props.modelValue.planRules,
    planDateRule: {
      shipDateOffset: 1,
      deliveryDateOffset: 3,
      ...props.modelValue.planRules.planDateRule
    },
    carrierSelectionRule: {
      type: 'auto',
      ...props.modelValue.planRules.carrierSelectionRule
    }
  }
})

// Mock data
const customers = [
  { label: 'Customer A', value: '1' },
  { label: 'Customer B', value: '2' },
  { label: 'Customer C', value: '3' }
]

const carriers = [
  { label: 'FedEx', value: '1' },
  { label: 'UPS', value: '2' },
  { label: 'DHL', value: '3' },
  { label: 'USPS', value: '4' }
]

const warehouses = [
  { label: 'Warehouse A', value: 'WH-A' },
  { label: 'Warehouse B', value: 'WH-B' },
  { label: 'Warehouse C', value: 'WH-C' }
]

// 监听变化并同步到父组件
watch(() => ruleData, (newVal) => {
  emit('update:modelValue', { ...newVal })
}, { deep: true })
</script>

<style scoped lang="scss">
.planning-rule-config {
  padding: 20px;
}

.form-section {
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.form-tip {
  font-size: 12px;
  color: #8b949e;
  margin-top: 4px;
}

:deep(.el-form-item__label) {
  color: #8b949e;
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  background-color: #2d3139;
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

:deep(.el-textarea__inner) {
  background-color: #2d3139;
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #fff;
}
</style>

