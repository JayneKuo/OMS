<template>
  <div class="order-line-section">
    <div class="section-header">
      <h3>Order Line</h3>
      <div class="header-actions">
        <el-button type="primary" @click="handleImportOrders">
          IMPORT ORDERS
        </el-button>
        <el-button @click="showBatchProNoDialog = true" :disabled="orderLines.length === 0">
          BATCH UPDATE PRO NO
        </el-button>
        <el-button type="primary" @click="showShippingRequestSelector = true">
          ADD ORDER/LINES
        </el-button>
      </div>
    </div>

    <div class="toolbar">
      <el-checkbox v-model="enableLoadSequence" style="margin-left: auto;">
        Enable Load Sequence
      </el-checkbox>
    </div>

    <el-table
      :data="orderLines"
      border
      style="width: 100%"
      :header-cell-style="{ background: '#f5f7fa', color: '#333' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        v-if="enableLoadSequence"
        label="Sequence"
        width="100"
        align="center"
      >
        <template #default="{ row, $index }">
          <el-input-number
            v-model="row.sequence"
            :min="1"
            size="small"
            @change="handleSequenceChange($index)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="Order-DN"
        min-width="180"
      >
        <template #default="{ row }">
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-weight: 600;">{{ row.requestNo }}</span>
            <span style="font-size: 12px; color: #8b949e;">DN: {{ row.dnNo || '-' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="customer"
        label="Customer"
        min-width="160"
      />
      <el-table-column
        prop="status"
        label="Status"
        min-width="120"
      >
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)" size="small">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="shipTo"
        label="Ship To"
        min-width="200"
      />
      <el-table-column
        prop="referenceNo"
        label="Reference No."
        min-width="140"
      />
      <el-table-column
        prop="deliveryRequestDate"
        label="Delivery Request Date"
        min-width="160"
      />
      <el-table-column
        prop="purchaseOrderNo"
        label="Purchase Order No."
        min-width="150"
      />
      <el-table-column
        prop="totalQuantity"
        label="Estimated Weight"
        min-width="130"
        align="right"
      >
        <template #default="{ row }">
          {{ row.totalQuantity ? `${row.totalQuantity} Pound` : '0 Pound' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="proNo"
        label="Pro No"
        min-width="120"
      >
        <template #default="{ row }">
          <el-input
            v-model="row.proNo"
            placeholder="Enter Pro No"
            size="small"
            @change="handleProNoChange($index)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="Actions"
        width="150"
        fixed="right"
        align="center"
      >
        <template #default="{ row, $index }">
          <el-button
            type="primary"
            link
            size="small"
            @click="handleViewDetail(row)"
          >
            View
          </el-button>
          <el-button
            type="danger"
            link
            size="small"
            @click="handleRemoveOrder($index)"
          >
            Remove
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Shipping Request 选择器 -->
    <ShippingRequestSelector
      v-model="showShippingRequestSelector"
      :exclude-request-nos="existingRequestNos"
      :mode="mode"
      :customer-id="customerId"
      :ship-from="shipFrom"
      @confirm="handleShippingRequestSelected"
    />

    <!-- 批量修改PRO NO对话框 -->
    <el-dialog
      v-model="showBatchProNoDialog"
      title="Batch Update Pro No"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="batchProNoForm" label-width="120px">
        <el-form-item label="Pro No">
          <el-input
            v-model="batchProNoForm.proNo"
            placeholder="Enter Pro No (leave empty to clear)"
            clearable
            @input="handleProNoInput"
          />
          <div style="margin-top: 8px; font-size: 12px; color: #909399;">
            <el-checkbox v-model="batchProNoForm.clearProNo">
              Clear Pro No
            </el-checkbox>
          </div>
        </el-form-item>

        <!-- 显示将要更新的订单行数量 -->
        <el-alert
          type="info"
          :closable="false"
          style="margin-top: 10px;"
        >
          <template #title>
            <span>
              {{ targetOrderLines.length }} order line(s) will be updated
              <span v-if="selectedRows.length > 0" style="color: #909399;">
                ({{ selectedRows.length }} selected)
              </span>
            </span>
          </template>
        </el-alert>
      </el-form>
      <template #footer>
        <el-button @click="showBatchProNoDialog = false">Cancel</el-button>
        <el-button
          type="primary"
          @click="handleBatchUpdateProNo"
          :disabled="targetOrderLines.length === 0 || (!batchProNoForm.proNo && !batchProNoForm.clearProNo)"
        >
          Update ({{ targetOrderLines.length }})
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { OrderLine } from '../types'
import type { ShippingRequestItem } from '../../shipping-request/types'
import { ElMessage } from 'element-plus'
import ShippingRequestSelector from './ShippingRequestSelector.vue'

interface Props {
  modelValue: OrderLine[]
  mode?: string
  customerId?: string
  shipFrom?: any
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'CUSTOMER',
  customerId: '',
  shipFrom: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: OrderLine[]]
  'import-orders': []
}>()

const enableLoadSequence = ref(false)
const orderLines = ref<OrderLine[]>(props.modelValue || [])
const showShippingRequestSelector = ref(false)
const selectedRows = ref<OrderLine[]>([])
const showBatchProNoDialog = ref(false)
const batchProNoForm = ref({
  proNo: '',
  clearProNo: false
})

// 计算目标订单行：如果有选中的行，则只更新选中的行；否则更新所有行
const targetOrderLines = computed(() => {
  return selectedRows.value.length > 0 ? selectedRows.value : orderLines.value
})

// 监听 props 变化，同步更新 orderLines
watch(() => props.modelValue, (newVal) => {
  orderLines.value = newVal || []
}, { deep: true, immediate: true })

// 获取已存在的 request numbers 以便在选择器中排除
const existingRequestNos = computed(() => {
  return orderLines.value.map(line => line.requestNo || '').filter(Boolean)
})

const handleImportOrders = () => {
  emit('import-orders')
}

const handleSequenceChange = (index: number) => {
  emit('update:modelValue', orderLines.value)
}

const handleProNoChange = (index: number) => {
  emit('update:modelValue', orderLines.value)
}

const handleSelectionChange = (selection: OrderLine[]) => {
  selectedRows.value = selection
}

const handleProNoInput = () => {
  // 如果输入了PRO NO，自动取消"清空"选项
  if (batchProNoForm.value.proNo) {
    batchProNoForm.value.clearProNo = false
  }
}

const handleBatchUpdateProNo = () => {
  const targetRows = targetOrderLines.value

  if (targetRows.length === 0) {
    ElMessage.warning('No order lines to update')
    return
  }

  // 如果选择清空，则清空PRO NO
  if (batchProNoForm.value.clearProNo) {
    targetRows.forEach(row => {
      row.proNo = ''
    })
    emit('update:modelValue', orderLines.value)
    ElMessage.success(`Successfully cleared Pro No for ${targetRows.length} order line(s)`)
  } else if (batchProNoForm.value.proNo) {
    // 批量设置PRO NO
    targetRows.forEach(row => {
      row.proNo = batchProNoForm.value.proNo
    })
    emit('update:modelValue', orderLines.value)
    ElMessage.success(`Successfully updated Pro No for ${targetRows.length} order line(s)`)
  } else {
    ElMessage.warning('Please enter Pro No or select "Clear Pro No"')
    return
  }
  
  // 重置表单并关闭对话框
  batchProNoForm.value = {
    proNo: '',
    clearProNo: false
  }
  showBatchProNoDialog.value = false
}

const handleViewDetail = (row: OrderLine) => {
  ElMessage.info(`View order: ${row.orderNo}`)
}

const handleRemoveOrder = (index: number) => {
  orderLines.value.splice(index, 1)
  emit('update:modelValue', orderLines.value)
  ElMessage.success('Order removed')
}

const handleShippingRequestSelected = (requests: ShippingRequestItem[]) => {
  // 将选中的 Shipping Requests 转换为 Order Lines，提取所有有用字段
  const newOrderLines: OrderLine[] = requests.map((req, index) => ({
    id: req.id,
    sequence: orderLines.value.length + index + 1,
    // 从 Shipping Request 映射字段
    requestNo: req.requestNo,
    orderNo: req.orderNos?.[0] || req.requestNo,
    dnNo: req.dnNo,
    customer: req.channelName,
    channel: req.channel,
    referenceNo: req.referenceNo,
    purchaseOrderNo: req.channelSalesOrderNo,
    warehouse: req.warehouse,
    carrier: req.shippingCarrier,
    trackingNumber: req.trackingNumber && req.trackingNumber !== '-' ? req.trackingNumber : undefined,
    totalItems: req.totalItems,
    totalQuantity: req.totalQuantity,
    shipTo: req.destination,
    recipientName: req.recipientName,
    recipientPhone: req.recipientPhone,
    deliveryRequestDate: req.expectedShipDate,
    status: 'DRAFT',
    proNo: '',
    items: []
  }))

  orderLines.value.push(...newOrderLines)
  emit('update:modelValue', orderLines.value)
  ElMessage.success(`Successfully added ${requests.length} order(s)`)
}

const getStatusType = (status: string) => {
  const statusMap: Record<string, any> = {
    'DRAFT': 'info',
    'SUBMITTED': 'warning',
    'CONFIRMED': 'success',
    'IN_TRANSIT': 'primary',
    'DELIVERED': 'success',
    'CANCELLED': 'danger'
  }
  return statusMap[status] || 'info'
}
</script>

<style scoped lang="scss">
.order-line-section {
  margin-top: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
  }

  .header-actions {
    display: flex;
    gap: 8px;
  }
}

.toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background-color: #2d3139;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

:deep(.el-table) {
  background-color: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;

  th.el-table__cell {
    background-color: #2d3139 !important;
    color: #8b949e !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  }

  td.el-table__cell {
    background-color: transparent !important;
    color: #8b949e !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  }

  .el-button {
    padding: 4px 8px;
  }
}
</style>

