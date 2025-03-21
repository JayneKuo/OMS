<template>
  <div class="action-dialogs">
    <!-- Warehouse Allocation Dialog -->
    <el-dialog
      v-model="allocateDialogVisible"
      title="Warehouse Allocation"
      width="1000px"
      :close-on-click-modal="false"
      @open="handleDialogOpen"
    >
      <div class="warehouse-allocation">
        <!-- Allocation Mode Selection -->
        <el-radio-group v-model="allocateForm.mode" class="allocation-mode">
          <el-radio label="whole">Whole Order Allocation</el-radio>
          <el-radio label="sku">SKU-based Allocation</el-radio>
        </el-radio-group>

        <!-- Order Items Summary -->
        <div class="order-summary">
          <h3>Order Items</h3>
          <el-table :data="orderItems" border style="margin: 16px 0">
            <el-table-column prop="sku" label="SKU" width="120" />
            <el-table-column prop="productName" label="Product Name" min-width="200" />
            <el-table-column prop="quantity" label="Total Quantity" width="120" align="right" />
            <el-table-column label="Allocated" width="120" align="right">
              <template #default="{ row }">
                {{ row.quantity - row.remainingQuantity }}
              </template>
            </el-table-column>
            <el-table-column prop="remainingQuantity" label="Remaining" width="120" align="right">
              <template #default="{ row }">
                <el-tag :type="row.remainingQuantity > 0 ? 'danger' : 'success'">
                  {{ row.remainingQuantity }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- Whole Order Allocation -->
        <template v-if="allocateForm.mode === 'whole'">
          <el-form :model="allocateForm" label-width="120px">
            <el-form-item 
              label="Warehouse"
              required
              :rules="[{ required: true, message: 'Please select a warehouse' }]"
            >
              <el-select
                v-model="allocateForm.warehouse"
                placeholder="Select Warehouse"
                style="width: 100%"
              >
                <el-option
                  v-for="wh in warehouses"
                  :key="wh.value"
                  :label="wh.label"
                  :value="wh.value"
                >
                  <div class="warehouse-option">
                    <span>{{ wh.label }}</span>
                    <el-tag size="small" type="info">Stock: {{ wh.availableQty }}</el-tag>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <!-- SKU-based Allocation -->
        <template v-else>
          <!-- Warehouse Selection -->
          <div class="warehouse-section">
            <div class="section-header">
              <h3>Warehouse Selection</h3>
              <el-button type="primary" @click="handleAddWarehouse" :disabled="!canAddWarehouse">
                Add Warehouse
              </el-button>
            </div>
          </div>

          <!-- Warehouse Allocations -->
          <div v-for="(wh, whIndex) in warehouseAllocations" :key="whIndex" class="warehouse-allocation-card">
            <el-card>
              <template #header>
                <div class="warehouse-header">
                  <el-select
                    v-model="wh.warehouseId"
                    placeholder="Select Warehouse"
                    style="width: 300px"
                    :disabled="wh.items.length > 0"
                    @change="() => handleWarehouseChange(whIndex)"
                  >
                    <el-option
                      v-for="warehouse in availableWarehouses(whIndex)"
                      :key="warehouse.value"
                      :label="warehouse.label"
                      :value="warehouse.value"
                    >
                      <div class="warehouse-option">
                        <span>{{ warehouse.label }}</span>
                        <el-tag size="small" type="info">Stock: {{ warehouse.availableQty }}</el-tag>
                      </div>
                    </el-option>
                  </el-select>
                  
                  <div class="warehouse-actions">
                    <el-button 
                      type="primary" 
                      link 
                      @click="() => handleAddSkuToWarehouse(whIndex)"
                      :disabled="!wh.warehouseId || !hasAvailableSkus(whIndex)"
                    >
                      Add SKU
                    </el-button>
                    <el-button 
                      type="danger" 
                      link 
                      @click="() => handleRemoveWarehouse(whIndex)"
                      :disabled="wh.items.length > 0"
                    >
                      Remove Warehouse
                    </el-button>
                  </div>
                </div>
              </template>

              <!-- SKU Allocation Table -->
              <el-table :data="wh.items" border>
                <el-table-column label="SKU" min-width="250">
                  <template #default="{ row, $index }">
                    <el-select
                      v-model="row.sku"
                      placeholder="Select SKU"
                      style="width: 100%"
                      @change="(value) => handleSkuChange(whIndex, $index, value)"
                    >
                      <el-option
                        v-for="item in getAvailableSkus(whIndex, $index)"
                        :key="item.sku"
                        :label="item.productName"
                        :value="item.sku"
                      >
                        <div class="sku-option">
                          <span>{{ item.productName }}</span>
                          <el-tag size="small" :type="item.remainingQuantity > 0 ? 'success' : 'warning'">
                            Available: {{ item.remainingQuantity }}
                          </el-tag>
                        </div>
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>

                <el-table-column label="Available" width="120" align="center">
                  <template #default="{ row }">
                    {{ getSkuAvailableQuantity(row.sku) }}
                  </template>
                </el-table-column>

                <el-table-column label="Quantity" width="200">
                  <template #default="{ row, $index }">
                    <el-input-number
                      v-model="row.quantity"
                      :min="1"
                      :max="getMaxQuantity(row.sku)"
                      :controls="false"
                      style="width: 100%"
                      @change="(value) => handleQuantityChange(whIndex, $index, value)"
                    />
                  </template>
                </el-table-column>

                <el-table-column label="Actions" width="100" align="center">
                  <template #default="{ $index }">
                    <el-button 
                      type="danger" 
                      link
                      @click="() => handleRemoveSku(whIndex, $index)"
                    >
                      Remove
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>

              <!-- Warehouse Summary -->
              <div class="warehouse-summary" v-if="wh.items.length > 0">
                <div class="summary-item">
                  <span>Total SKUs:</span>
                  <el-tag size="small">{{ wh.items.length }}</el-tag>
                </div>
                <div class="summary-item">
                  <span>Total Quantity:</span>
                  <el-tag size="small" type="success">{{ getTotalQuantity(wh.items) }}</el-tag>
                </div>
              </div>
            </el-card>
          </div>
        </template>

        <!-- Remarks -->
        <el-form-item label="Remarks" style="margin-top: 16px">
          <el-input
            v-model="allocateForm.remarks"
            type="textarea"
            :rows="3"
            placeholder="Enter remarks (optional)"
          />
        </el-form-item>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="allocateDialogVisible = false">Cancel</el-button>
          <el-button 
            type="primary" 
            :loading="loading"
            :disabled="!isAllocationValid"
            @click="handleAllocateConfirm"
          >
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 挂起对话框 -->
    <el-dialog
      v-model="holdDialogVisible"
      title="Hold Order"
      width="500px"
      destroy-on-close
    >
      <el-form ref="holdFormRef" :model="holdForm" label-width="100px">
        <el-form-item 
          label="Reason" 
          required
          :rules="[{ required: true, message: 'Please select a reason' }]"
        >
          <el-select v-model="holdForm.reason" placeholder="Select Reason">
            <el-option
              v-for="item in HOLD_REASONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Remarks">
          <el-input
            v-model="holdForm.remarks"
            type="textarea"
            rows="3"
            placeholder="Enter additional remarks"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="holdDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleHoldConfirm">Confirm</el-button>
      </template>
    </el-dialog>

    <!-- 取消对话框 -->
    <el-dialog
      v-model="cancelDialogVisible"
      title="Cancel Order"
      width="500px"
      destroy-on-close
    >
      <el-form ref="cancelFormRef" :model="cancelForm" label-width="100px">
        <!-- 子单信息 -->
        <template v-if="hasSubOrders">
          <div class="sub-orders-section">
            <div class="section-title">Sub-Orders to Cancel</div>
            <el-table :data="currentOrder?.subOrders" border>
              <el-table-column type="selection" width="55" />
              <el-table-column label="Sub-Order No." prop="subOrderNo" />
              <el-table-column label="Status" prop="status">
                <template #default="{ row }">
                  <el-tag>{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="Warehouse" prop="warehouse" />
            </el-table>
          </div>
        </template>

        <el-form-item 
          label="Reason" 
          required
          :rules="[{ required: true, message: 'Please select a reason' }]"
        >
          <el-select v-model="cancelForm.reason" placeholder="Select Reason">
            <el-option
              v-for="item in CANCEL_REASONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Remarks">
          <el-input
            v-model="cancelForm.remarks"
            type="textarea"
            rows="3"
            placeholder="Enter additional remarks"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleCancelConfirm">Confirm</el-button>
      </template>
    </el-dialog>

    <!-- 重开对话框 -->
    <el-dialog
      v-model="reopenDialogVisible"
      title="Reopen Order"
      width="500px"
      destroy-on-close
    >
      <el-form ref="reopenFormRef" :model="reopenForm" label-width="100px">
        <el-form-item 
          label="Reason" 
          required
          :rules="[{ required: true, message: 'Please select a reason' }]"
        >
          <el-select v-model="reopenForm.reason" placeholder="Select Reason">
            <el-option
              v-for="item in REOPEN_REASONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Remarks">
          <el-input
            v-model="reopenForm.remarks"
            type="textarea"
            rows="3"
            placeholder="Enter additional remarks"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reopenDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleReopenConfirm">Confirm</el-button>
      </template>
    </el-dialog>

    <!-- 解除分仓确认对话框 -->
    <el-dialog
      v-model="deallocateDialogVisible"
      title="Deallocate Order"
      width="500px"
      destroy-on-close
    >
      <div class="warning-message">
        <el-alert
          title="Warning"
          type="warning"
          :closable="false"
          show-icon
        >
          <p>Are you sure you want to deallocate this order?</p>
          <p>This action will remove the warehouse allocation for the selected order(s).</p>
        </el-alert>
      </div>
      
      <!-- 子单信息 -->
      <template v-if="hasSubOrders">
        <div class="sub-orders-section">
          <div class="section-title">Sub-Orders to Deallocate</div>
          <el-table :data="currentOrder?.subOrders" border>
            <el-table-column type="selection" width="55" />
            <el-table-column label="Sub-Order No." prop="subOrderNo" />
            <el-table-column label="Status" prop="status">
              <template #default="{ row }">
                <el-tag>{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Warehouse" prop="warehouse" />
          </el-table>
        </div>
      </template>

      <el-form :model="deallocateForm" label-width="100px">
        <el-form-item label="Remarks">
          <el-input
            v-model="deallocateForm.remarks"
            type="textarea"
            rows="3"
            placeholder="Enter remarks if any"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="deallocateDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleDeallocateConfirm">Confirm</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import {
  FulfillmentMode,
  WAREHOUSE_OPTIONS,
  HOLD_REASONS,
  CANCEL_REASONS,
  REOPEN_REASONS,
  type OrderItem,
  type SubOrder
} from '../types'

// Types
interface OrderSku {
  sku: string
  productName: string
  quantity: number
  remainingQuantity: number
}

interface Warehouse {
  value: string
  label: string
  availableQty: number
}

interface WarehouseAllocation {
  warehouseId: string
  items: Array<{
    sku: string
    quantity: number
  }>
}

// Form refs
const holdFormRef = ref<FormInstance>()
const cancelFormRef = ref<FormInstance>()
const reopenFormRef = ref<FormInstance>()

// Props and emits
const props = defineProps<{
  currentOrder?: {
    id: string
    items: Array<{
      sku: string
      productName: string
      quantity: number
    }>
    subOrders?: Array<SubOrder>
  }
}>()

const emit = defineEmits<{
  (e: 'allocate', data: any): void
  (e: 'hold', data: any): void
  (e: 'cancel', data: any): void
  (e: 'reopen', data: any): void
  (e: 'deallocate', data: any): void
}>()

// State
const loading = ref(false)
const allocateDialogVisible = ref(false)
const holdDialogVisible = ref(false)
const cancelDialogVisible = ref(false)
const reopenDialogVisible = ref(false)
const deallocateDialogVisible = ref(false)

// Form data
const allocateForm = reactive({
  mode: 'whole' as 'whole' | 'sku',
  warehouse: '',
  remarks: ''
})

const holdForm = reactive({
  reason: '',
  remarks: ''
})

const cancelForm = reactive({
  reason: '',
  remarks: '',
  selectedSubOrders: []
})

const reopenForm = reactive({
  reason: '',
  remarks: ''
})

const deallocateForm = reactive({
  remarks: '',
  selectedSubOrders: []
})

// Data
const orderItems = ref<OrderSku[]>([
  {
    sku: 'SKU001',
    productName: 'iPhone 14 Pro Max',
    quantity: 10,
    remainingQuantity: 10
  },
  {
    sku: 'SKU002',
    productName: 'AirPods Pro 2nd Gen',
    quantity: 5,
    remainingQuantity: 5
  },
  {
    sku: 'SKU003',
    productName: 'MacBook Pro 16"',
    quantity: 3,
    remainingQuantity: 3
  },
  {
    sku: 'SKU004',
    productName: 'iPad Pro 12.9"',
    quantity: 8,
    remainingQuantity: 8
  }
])

const warehouses = ref<Warehouse[]>([
  { value: 'WH001', label: 'Shanghai Warehouse', availableQty: 100 },
  { value: 'WH002', label: 'Beijing Warehouse', availableQty: 150 },
  { value: 'WH003', label: 'Guangzhou Warehouse', availableQty: 200 }
])

const warehouseAllocations = ref<WarehouseAllocation[]>([])

// Watch for changes in currentOrder
watch(
  () => props.currentOrder?.items,
  (newItems) => {
    if (newItems) {
      orderItems.value = newItems.map(item => ({
        sku: item.sku,
        productName: item.productName,
        quantity: item.quantity,
        remainingQuantity: item.quantity
      }))
    }
  },
  { immediate: true }
)

// Computed
const canAddWarehouse = computed(() => {
  const usedWarehouses = new Set(warehouseAllocations.value.map(wh => wh.warehouseId))
  return warehouses.value.some(wh => !usedWarehouses.has(wh.value))
})

const isAllocationValid = computed(() => {
  if (allocateForm.mode === 'whole') {
    return !!allocateForm.warehouse
  }

  // For SKU-based allocation
  if (warehouseAllocations.value.length === 0) {
    return false
  }

  // Check if all warehouses have valid selections
  const hasValidWarehouses = warehouseAllocations.value.every(wh => {
    return wh.warehouseId && wh.items.length > 0 && 
           wh.items.every(item => item.sku && item.quantity > 0)
  })

  // Check if all SKUs are fully allocated
  const allSkusAllocated = orderItems.value.every(item => item.remainingQuantity === 0)

  return hasValidWarehouses && allSkusAllocated
})

const hasSubOrders = computed(() => {
  return props.currentOrder?.subOrders && props.currentOrder.subOrders.length > 0
})

// Methods
const handleDialogOpen = () => {
  // Reset form
  allocateForm.mode = 'whole'
  allocateForm.warehouse = ''
  allocateForm.remarks = ''
  
  // Reset allocations
  warehouseAllocations.value = []
  
  // Reset order items
  if (props.currentOrder?.items) {
    orderItems.value = props.currentOrder.items.map(item => ({
      sku: item.sku,
      productName: item.productName,
      quantity: item.quantity,
      remainingQuantity: item.quantity
    }))
  }
}

const availableWarehouses = (currentIndex: number) => {
  const usedWarehouses = new Set(
    warehouseAllocations.value
      .filter((_, index) => index !== currentIndex)
      .map(wh => wh.warehouseId)
  )
  return warehouses.value.filter(wh => !usedWarehouses.has(wh.value))
}

const handleAddWarehouse = () => {
  warehouseAllocations.value.push({
    warehouseId: '',
    items: []
  })
}

const handleRemoveWarehouse = (index: number) => {
  const warehouse = warehouseAllocations.value[index]
  if (warehouse.items.length > 0) {
    ElMessage.warning('Please remove all SKUs first')
    return
  }
  warehouseAllocations.value.splice(index, 1)
}

const handleWarehouseChange = (warehouseIndex: number) => {
  const warehouse = warehouseAllocations.value[warehouseIndex]
  if (!warehouse) return
  
  // Reset items when warehouse changes
  warehouse.items = []
}

const hasAvailableSkus = (warehouseIndex: number) => {
  return getAvailableSkus(warehouseIndex).length > 0
}

const getAvailableSkus = (warehouseIndex: number, currentSkuIndex: number = -1) => {
  const warehouse = warehouseAllocations.value[warehouseIndex]
  if (!warehouse) return []

  return orderItems.value.filter(item => {
    // If it's the current SKU being edited, include it
    if (currentSkuIndex >= 0) {
      const currentItem = warehouse.items[currentSkuIndex]
      if (currentItem && currentItem.sku === item.sku) {
        return true
      }
    }

    // Check if SKU is already allocated in this warehouse
    const isAlreadyInWarehouse = warehouse.items.some(
      (wi, index) => index !== currentSkuIndex && wi.sku === item.sku
    )

    // Include SKU if it's not already in this warehouse and has remaining quantity
    return !isAlreadyInWarehouse && item.remainingQuantity > 0
  })
}

const handleAddSkuToWarehouse = (warehouseIndex: number) => {
  const warehouse = warehouseAllocations.value[warehouseIndex]
  if (!warehouse?.warehouseId) {
    ElMessage.warning('Please select a warehouse first')
    return
  }

  // Get available SKUs for this warehouse
  const availableSkus = getAvailableSkus(warehouseIndex)
  if (availableSkus.length === 0) {
    ElMessage.warning('No SKUs available to allocate')
    return
  }

  // Add new SKU item with default values
  warehouse.items.push({
    sku: availableSkus[0].sku, // Set first available SKU as default
    quantity: 1 // Set default quantity to 1
  })

  // Update remaining quantity
  const orderItem = orderItems.value.find(item => item.sku === availableSkus[0].sku)
  if (orderItem) {
    orderItem.remainingQuantity -= 1
  }
}

const handleRemoveSku = (warehouseIndex: number, skuIndex: number) => {
  const warehouse = warehouseAllocations.value[warehouseIndex]
  if (!warehouse) return

  const item = warehouse.items[skuIndex]
  if (item.sku) {
    const orderItem = orderItems.value.find(oi => oi.sku === item.sku)
    if (orderItem) {
      orderItem.remainingQuantity += (item.quantity || 0)
    }
  }

  warehouse.items.splice(skuIndex, 1)
}

const handleSkuChange = (warehouseIndex: number, itemIndex: number, newSku: string) => {
  const warehouse = warehouseAllocations.value[warehouseIndex]
  if (!warehouse) return

  const item = warehouse.items[itemIndex]
  if (!item) return

  // Return old quantity if exists
  if (item.sku) {
    const oldOrderItem = orderItems.value.find(oi => oi.sku === item.sku)
    if (oldOrderItem) {
      oldOrderItem.remainingQuantity += (item.quantity || 0)
    }
  }

  // Set new SKU and default quantity
  item.sku = newSku
  item.quantity = 1

  // Update remaining quantity for new SKU
  const newOrderItem = orderItems.value.find(oi => oi.sku === newSku)
  if (newOrderItem) {
    newOrderItem.remainingQuantity -= 1
  }
}

const getSkuAvailableQuantity = (sku: string) => {
  const orderItem = orderItems.value.find(item => item.sku === sku)
  return orderItem ? orderItem.remainingQuantity : 0
}

const getMaxQuantity = (sku: string) => {
  const orderItem = orderItems.value.find(item => item.sku === sku)
  return orderItem ? orderItem.remainingQuantity : 0
}

const handleQuantityChange = (warehouseIndex: number, itemIndex: number, newQuantity: number) => {
  const warehouse = warehouseAllocations.value[warehouseIndex]
  if (!warehouse) return

  const item = warehouse.items[itemIndex]
  if (!item || !item.sku) return

  const oldQuantity = item.quantity || 0
  const orderItem = orderItems.value.find(oi => oi.sku === item.sku)

  if (orderItem) {
    const diff = newQuantity - oldQuantity
    const newRemaining = orderItem.remainingQuantity - diff
    
    if (newRemaining < 0) {
      ElMessage.warning('Quantity exceeds available amount')
      item.quantity = oldQuantity
      return
    }

    orderItem.remainingQuantity = newRemaining
    item.quantity = newQuantity
  }
}

const getTotalQuantity = (items: Array<{ quantity: number }>) => {
  return items.reduce((sum, item) => sum + (item.quantity || 0), 0)
}

const handleAllocateConfirm = async () => {
  if (allocateForm.mode === 'whole') {
    if (!allocateForm.warehouse) {
      ElMessage.error('Please select a warehouse')
      return
    }
  } else {
    // Validate SKU allocations
    const hasUnallocatedSku = orderItems.value.some(item => item.remainingQuantity > 0)
    if (hasUnallocatedSku) {
      ElMessage.error('Please complete all SKU allocations')
      return
    }

    const hasEmptyWarehouse = warehouseAllocations.value.some(wh => 
      !wh.warehouseId || wh.items.length === 0 || wh.items.some(item => !item.sku || !item.quantity)
    )
    if (hasEmptyWarehouse) {
      ElMessage.error('Please complete all warehouse allocations')
      return
    }
  }

  loading.value = true
  try {
    const allocationData = allocateForm.mode === 'whole' 
      ? {
          mode: 'whole',
          warehouse: allocateForm.warehouse,
          remarks: allocateForm.remarks
        }
      : {
          mode: 'sku',
          allocations: warehouseAllocations.value.map(wh => ({
            warehouseId: wh.warehouseId,
            items: wh.items.map(item => ({
              sku: item.sku,
              quantity: item.quantity
            }))
          })),
          remarks: allocateForm.remarks
        }

    emit('allocate', allocationData)
    ElMessage.success('Allocation successful')
    allocateDialogVisible.value = false
  } catch (error) {
    console.error('Allocation failed:', error)
    ElMessage.error('Allocation failed')
  } finally {
    loading.value = false
  }
}

const handleHoldConfirm = async () => {
  if (!holdFormRef.value) return
  
  await holdFormRef.value.validate((valid: boolean) => {
    if (valid) {
      emit('hold', {
        ...holdForm,
        orderId: props.currentOrder?.id
      })
      holdDialogVisible.value = false
    }
  })
}

const handleCancelConfirm = async () => {
  if (!cancelFormRef.value) return
  
  await cancelFormRef.value.validate((valid: boolean) => {
    if (valid) {
      emit('cancel', {
        ...cancelForm,
        orderId: props.currentOrder?.id
      })
      cancelDialogVisible.value = false
    }
  })
}

const handleReopenConfirm = async () => {
  if (!reopenFormRef.value) return
  
  await reopenFormRef.value.validate((valid: boolean) => {
    if (valid) {
      emit('reopen', {
        ...reopenForm,
        orderId: props.currentOrder?.id
      })
      reopenDialogVisible.value = false
    }
  })
}

const handleDeallocateConfirm = () => {
  emit('deallocate', {
    ...deallocateForm,
    orderId: props.currentOrder?.id
  })
  deallocateDialogVisible.value = false
}

// Dialog open methods
const openAllocateDialog = () => {
  allocateDialogVisible.value = true
}

const openHoldDialog = () => {
  holdDialogVisible.value = true
}

const openCancelDialog = () => {
  cancelDialogVisible.value = true
}

const openReopenDialog = () => {
  reopenDialogVisible.value = true
}

const openDeallocateDialog = () => {
  deallocateDialogVisible.value = true
}

// Expose methods to parent
defineExpose({
  openAllocateDialog,
  openHoldDialog,
  openCancelDialog,
  openReopenDialog,
  openDeallocateDialog
})
</script>

<style lang="scss" scoped>
.action-dialogs {
  :deep(.el-dialog__body) {
    padding: 20px;
  }
}

.allocation-mode {
  margin-bottom: 16px;
}

.order-summary {
  margin-bottom: 24px;

  h3 {
    margin: 0 0 8px;
    font-size: 16px;
  }
}

.warehouse-section {
  margin-bottom: 16px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h3 {
      margin: 0;
      font-size: 16px;
    }
  }
}

.warehouse-allocation-card {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  .warehouse-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .warehouse-actions {
      display: flex;
      gap: 12px;
    }
  }

  .warehouse-summary {
    margin-top: 16px;
    display: flex;
    gap: 24px;

    .summary-item {
      display: flex;
      align-items: center;
      gap: 8px;

      span {
        font-size: 14px;
        color: #606266;
      }
    }
  }
}

.warehouse-option,
.sku-option {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .el-tag {
    margin-left: 8px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style> 