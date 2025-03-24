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
                    <div class="warehouse-info">
                      <span class="warehouse-name">{{ wh.label }}</span>
                      <el-tag size="small" :type="getWmsTagType(wh.wmsType)" class="wms-tag">
                        {{ wh.wmsType.toUpperCase() }}
                      </el-tag>
                    </div>
                    <div class="warehouse-stock-info">
                      <template v-for="item in orderItems" :key="item.sku">
                        <el-tag size="small" :type="getStockTagType(wh.stockInfo?.[item.sku] || 0, item.quantity)">
                          {{ item.sku }}: {{ wh.stockInfo?.[item.sku] || 0 }}/{{ item.quantity }}
                        </el-tag>
                      </template>
                    </div>
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
                        <div class="warehouse-info">
                          <span class="warehouse-name">{{ warehouse.label }}</span>
                          <el-tag size="small" :type="getWmsTagType(warehouse.wmsType)" class="wms-tag">
                            {{ warehouse.wmsType.toUpperCase() }}
                          </el-tag>
                        </div>
                        <div class="warehouse-stock-info">
                          <template v-for="item in orderItems" :key="item.sku">
                            <el-tag size="small" :type="getStockTagType(warehouse.stockInfo?.[item.sku] || 0, item.quantity)">
                              {{ item.sku }}: {{ warehouse.stockInfo?.[item.sku] || 0 }}/{{ item.quantity }}
                            </el-tag>
                          </template>
                        </div>
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
                      @change="(value: string) => handleSkuChange(whIndex, $index, value)"
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
                      @change="(value: number) => handleQuantityChange(whIndex, $index, value)"
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

    <!-- Hold Dialog -->
    <el-dialog
      v-model="holdDialogVisible"
      title="Hold Order"
      width="500px"
      destroy-on-close
    >
      <el-form ref="holdFormRef" :model="holdForm" label-width="120px">
        <el-form-item 
          label="Hold Mode" 
          required
          :rules="[{ required: true, message: 'Please select hold mode' }]"
        >
          <el-radio-group v-model="holdForm.mode">
            <el-radio label="permanent">Permanent Hold</el-radio>
            <el-radio label="temporary">Custom Period</el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="holdForm.mode === 'temporary'">
          <el-form-item 
            label="Time Period"
            required
            :rules="[{ required: true, message: 'Please select time period' }]"
          >
            <el-date-picker
              v-model="holdForm.timeRange"
              type="datetimerange"
              range-separator="to"
              start-placeholder="Start Time"
              end-placeholder="End Time"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss"
              :default-time="defaultTime"
              :disabled-date="disabledDate"
              :shortcuts="dateShortcuts"
              style="width: 100%"
              @change="handleTimeRangeChange"
            />
          </el-form-item>
        </template>

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
      width="1000px"
      destroy-on-close
    >
      <el-alert
        v-if="!canCancelOrder"
        type="error"
        :closable="false"
        show-icon
        title="Cannot cancel this order"
        description="Orders that have been shipped or partially shipped cannot be cancelled."
      />
      
      <template v-else>
        <el-form ref="cancelFormRef" :model="cancelForm" label-width="120px">
          <!-- 分配后显示取消模式选择 -->
          <template v-if="isAllocated">
            <el-form-item label="Cancel Mode" required>
              <el-radio-group v-model="cancelForm.mode">
                <el-radio label="whole">Cancel Entire Order</el-radio>
                <el-radio label="partial">Cancel Selected Warehouses</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>

          <!-- 部分取消时显示仓库选择 -->
          <template v-if="isAllocated && cancelForm.mode === 'partial'">
            <div class="sub-orders-section">
              <div class="section-title">Select Warehouses to Cancel</div>
              <el-table 
                :data="cancelableSubOrders" 
                @selection-change="handleSelectionChange"
                border
                v-if="cancelableSubOrders.length > 0"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column label="Sub-Order No." prop="subOrderNo" width="150" />
                <el-table-column label="Status" prop="status" width="120">
                  <template #default="{ row }">
                    <el-tag>{{ row.status }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="Warehouse" min-width="200">
                  <template #default="{ row }">
                    <div class="warehouse-cell">
                      <span>{{ row.warehouse.split(' (')[0] }}</span>
                      <el-tag 
                        size="small" 
                        :type="getWmsTypeFromWarehouse(row.warehouse)"
                      >
                        {{ row.warehouse.match(/\((.*?)\)/)?.[1] || 'OTHER' }}
                      </el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Product" prop="product" min-width="150" />
                <el-table-column label="Quantity" prop="quantity" width="100" align="right" />
              </el-table>
              <el-empty v-else description="No Cancellable Sub-Orders" />
            </div>
          </template>

          <!-- WMS警告提示 -->
          <template v-if="needCallWMS">
            <el-alert
              type="warning"
              :closable="false"
              show-icon
              title="WMS Cancellation Required"
              description="This order is being processed in WMS. The system will attempt to cancel it in WMS first."
              style="margin-bottom: 16px"
            />
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
      </template>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelDialogVisible = false">Back</el-button>
          <el-button 
            type="primary" 
            :disabled="!canCancelOrder || (cancelForm.mode === 'partial' && cancelForm.selectedSubOrders.length === 0)"
            @click="handleCancelConfirm"
          >
            Confirm Cancel
          </el-button>
        </div>
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
        <!-- 重开模式选择 -->
        <el-form-item label="Reopen Mode" required>
          <el-radio-group v-model="reopenForm.mode" class="inline-radio-group">
            <el-radio label="whole">
              <div class="mode-option">
                <span class="mode-title">Reopen Entire Order</span>
                <el-tooltip effect="dark" placement="right">
                  <template #content>
                    <div class="mode-tooltip">
                      <p>Reopen the entire order, including:</p>
                      <ul>
                        <li>All exception sub-orders will be reopened and set to Allocated status</li>
                        <li>Main order status will be updated based on fulfillment mode</li>
                        <li>Best for orders that need to reprocess all exception sub-orders</li>
                      </ul>
                    </div>
                  </template>
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
            </el-radio>
            <el-radio 
              label="partial" 
              :disabled="!hasExceptionSubOrders"
            >
              <div class="mode-option">
                <span class="mode-title">Reopen Selected Sub-Orders</span>
                <el-tooltip effect="dark" placement="right">
                  <template #content>
                    <div class="mode-tooltip">
                      <p>Selectively reopen specific sub-orders:</p>
                      <ul>
                        <li>Choose which exception sub-orders to reopen</li>
                        <li>Selected sub-orders will be set to Allocated status</li>
                        <li>Main order status updates based on remaining exceptions</li>
                      </ul>
                    </div>
                  </template>
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
              <el-tag 
                v-if="!hasExceptionSubOrders" 
                size="small" 
                type="info" 
                style="margin-left: 8px"
              >
                No exception sub-orders
              </el-tag>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 子单选择 -->
        <template v-if="reopenForm.mode === 'partial'">
          <div class="sub-orders-section">
            <div class="section-header">
              <div class="section-title">Select Sub-Orders to Reopen</div>
              <div class="selection-info">
                Selected: {{ reopenForm.selectedSubOrders.length }} / {{ exceptionSubOrders.length }}
              </div>
            </div>
            <el-table 
              :data="exceptionSubOrders" 
              @selection-change="handleReopenSelectionChange"
              border
              v-if="exceptionSubOrders.length > 0"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column label="Sub-Order No." prop="subOrderNo" width="150" />
              <el-table-column label="Status" prop="status" width="120">
                <template #default="{ row }">
                  <el-tag type="danger">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="Warehouse" prop="warehouse" min-width="150" />
              <el-table-column label="Product" prop="product" min-width="150" />
              <el-table-column label="Quantity" prop="quantity" width="100" align="right" />
            </el-table>
            <el-empty v-else description="No Exception Sub-Orders" />
          </div>
        </template>

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
        <el-button 
          type="primary" 
          :disabled="!canReopenOrder"
          @click="handleReopenConfirm"
        >
          Confirm
        </el-button>
      </template>
    </el-dialog>

    <!-- 解除分仓确认对话框 -->
    <el-dialog
      v-model="deallocateDialogVisible"
      title="Deallocate Order"
      width="1000px"
      destroy-on-close
    >
      <div class="warning-message">
        <el-alert
          title="Warning"
          type="warning"
          :closable="false"
          show-icon
        >
          <p>This action will remove the warehouse allocation for the selected order(s).</p>
          <p>Please confirm the warehouses you want to deallocate.</p>
        </el-alert>
      </div>

      <el-form ref="deallocateFormRef" :model="deallocateForm" label-width="120px">
        <!-- 分配后显示解除模式选择 -->
        <template v-if="isAllocated">
          <el-form-item label="Deallocate Mode" required>
            <el-radio-group v-model="deallocateForm.mode" class="inline-radio-group">
              <el-radio label="whole">Deallocate Entire Order</el-radio>
              <el-radio label="partial">Deallocate Selected Warehouses</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>

        <!-- 部分解除时显示仓库选择 -->
        <template v-if="isAllocated && deallocateForm.mode === 'partial'">
          <div class="sub-orders-section">
            <div class="section-title">Select Warehouses to Deallocate</div>
            <el-table 
              :data="deallocatableSubOrders" 
              @selection-change="handleDeallocateSelectionChange"
              border
              v-if="deallocatableSubOrders.length > 0"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column label="Sub-Order No." prop="subOrderNo" width="150" />
              <el-table-column label="Status" prop="status" width="120">
                <template #default="{ row }">
                  <el-tag>{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="Warehouse" min-width="200">
                <template #default="{ row }">
                  <div class="warehouse-cell">
                    <span>{{ row.warehouse.split(' (')[0] }}</span>
                    <el-tag 
                      size="small" 
                      :type="getWmsTypeFromWarehouse(row.warehouse)"
                    >
                      {{ row.warehouse.match(/\((.*?)\)/)?.[1] || 'OTHER' }}
                    </el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Product" prop="product" min-width="150" />
              <el-table-column label="Quantity" prop="quantity" width="100" align="right" />
            </el-table>
            <el-empty v-else description="No Deallocatable Sub-Orders" />
          </div>
        </template>

        <!-- WMS警告提示 -->
        <template v-if="needCallWMS">
          <el-alert
            type="warning"
            :closable="false"
            show-icon
            title="WMS Deallocation Required"
            description="This order is being processed in WMS. The system will attempt to deallocate it in WMS first."
            style="margin-bottom: 16px"
          />
        </template>

        <el-form-item 
          label="Reason" 
          required
          :rules="[{ required: true, message: 'Please select a reason' }]"
        >
          <el-select v-model="deallocateForm.reason" placeholder="Select Reason">
            <el-option
              v-for="item in DEALLOCATE_REASONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

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
        <el-button @click="deallocateDialogVisible = false">Back</el-button>
        <el-button 
          type="primary" 
          :disabled="!canDeallocate || (deallocateForm.mode === 'partial' && deallocateForm.selectedSubOrders.length === 0)"
          @click="handleDeallocateConfirm"
        >
          Confirm Deallocate
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch, nextTick } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import {
  OrderStatus,
  OrderAction,
  SubOrderStatus,
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
  stockInfo: Record<string, number> // 每个SKU的库存信息
  wmsType: 'wmsv1' | 'wmsv2' | 'other' // 添加WMS类型
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
const deallocateFormRef = ref<FormInstance>()

// Props and emits
const props = defineProps<{
  currentOrder?: any
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
  mode: 'permanent',
  timeRange: [] as string[],
  reason: '',
  remarks: ''
})

const cancelForm = reactive({
  mode: 'whole' as 'whole' | 'partial',
  reason: '',
  remarks: '',
  selectedSubOrders: [] as string[]
})

const reopenForm = reactive({
  mode: 'whole' as 'whole' | 'partial',
  reason: '',
  remarks: '',
  selectedSubOrders: [] as string[]
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
  { 
    value: 'WH001', 
    label: 'Shanghai Warehouse', 
    stockInfo: {
      'SKU001': 100,
      'SKU002': 50,
      'SKU003': 30,
      'SKU004': 80
    },
    wmsType: 'wmsv1'
  },
  { 
    value: 'WH002', 
    label: 'Beijing Warehouse', 
    stockInfo: {
      'SKU001': 80,
      'SKU002': 40,
      'SKU003': 20,
      'SKU004': 60
    },
    wmsType: 'wmsv2'
  },
  { 
    value: 'WH003', 
    label: 'Guangzhou Warehouse', 
    stockInfo: {
      'SKU001': 60,
      'SKU002': 30,
      'SKU003': 15,
      'SKU004': 40
    },
    wmsType: 'other'
  }
])

const warehouseAllocations = ref<WarehouseAllocation[]>([])

// 修改模拟订单数据
const mockCurrentOrder = ref({
  id: 'ORD001',
  status: 'Allocated',
  items: [
    {
      sku: 'SKU001',
      productName: 'iPhone 14 Pro Max',
      quantity: 10
    },
    {
      sku: 'SKU002',
      productName: 'AirPods Pro 2nd Gen',
      quantity: 5
    }
  ],
  subOrders: [
    {
      id: 'SUB001',
      subOrderNo: 'SO001-001',
      status: 'Allocated',
      warehouse: 'Shanghai Warehouse (WMS V1)',
      quantity: 5,
      product: 'iPhone 14 Pro Max'
    },
    {
      id: 'SUB002',
      subOrderNo: 'SO001-002',
      status: 'Allocated',
      warehouse: 'Beijing Warehouse (WMS V2)',
      quantity: 5,
      product: 'iPhone 14 Pro Max'
    },
    {
      id: 'SUB003',
      subOrderNo: 'SO001-003',
      status: 'Allocated',
      warehouse: 'Shanghai Warehouse (WMS V1)',
      quantity: 3,
      product: 'AirPods Pro 2nd Gen'
    },
    {
      id: 'SUB004',
      subOrderNo: 'SO001-004',
      status: 'Allocated',
      warehouse: 'Guangzhou Warehouse (Other WMS)',
      quantity: 2,
      product: 'AirPods Pro 2nd Gen'
    }
  ]
})

// 确保在开发环境中使用模拟数据
const currentOrderData = computed(() => {
  if (import.meta.env.DEV) {
    console.log('Using mock data in DEV mode')
    return mockCurrentOrder.value
  }
  return props.currentOrder
})

// 修改 watch
watch(() => currentOrderData.value, (newOrder) => {
  console.log('Order Data Changed:', newOrder)
  if (newOrder?.items) {
    orderItems.value = newOrder.items.map(item => ({
      sku: item.sku,
      productName: item.productName,
      quantity: item.quantity,
      remainingQuantity: item.quantity
    }))
  }
}, { immediate: true, deep: true })

// 修改 cancelableSubOrders 计算属性
const cancelableSubOrders = computed(() => {
  const subOrders = currentOrderData.value?.subOrders || []
  console.log('Computing cancelable sub-orders:', subOrders)
  return subOrders.filter(sub => 
    sub.status !== 'Shipped' && 
    sub.status !== 'Short Shipped'
  )
})

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
  return currentOrderData.value?.subOrders && currentOrderData.value.subOrders.length > 0
})

const canCancelOrder = computed(() => {
  if (!currentOrderData.value) return false
  
  // 已发货状态不可取消
  if (currentOrderData.value.status === 'Shipped') return false
  
  // 检查子订单状态
  if (currentOrderData.value.subOrders?.some(
    sub => sub.status === 'Shipped' || sub.status === 'Short Shipped'
  )) {
    return false
  }
  
  return true
})

const needCallWMS = computed(() => {
  if (!currentOrderData.value) return false
  return currentOrderData.value.status === 'Warehouse Processing'
})

const isAllocated = computed(() => {
  if (!currentOrderData.value) return false
  return ['Allocated', 'Exception', 'Deallocated', 'Warehouse Processing'].includes(currentOrderData.value.status)
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
      // If permanent hold, clear time range
      if (holdForm.mode === 'permanent') {
        holdForm.timeRange = []
      }
      
      emit('hold', {
        ...holdForm,
        orderId: props.currentOrder?.id,
        startTime: holdForm.timeRange[0] || null,
        endTime: holdForm.timeRange[1] || null
      })
      holdDialogVisible.value = false
      
      // Reset form
      holdForm.mode = 'permanent'
      holdForm.timeRange = []
      holdForm.reason = ''
      holdForm.remarks = ''
    }
  })
}

const handleCancelConfirm = async () => {
  if (!cancelFormRef.value) return
  
  await cancelFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        // 如果需要调用WMS
        if (needCallWMS.value) {
          // 调用WMS取消接口
          await cancelInWMS({
            orderId: props.currentOrder?.id,
            mode: cancelForm.mode,
            subOrders: cancelForm.selectedSubOrders
          })
        }

        // 更新订单状态为Cancelling
        await updateOrderStatus(props.currentOrder?.id, 'Cancelling')

        // 发送取消请求
        emit('cancel', {
          ...cancelForm,
          orderId: props.currentOrder?.id,
          mode: cancelForm.mode,
          subOrders: cancelForm.selectedSubOrders
        })

        ElMessage.success('Order cancellation initiated')
        cancelDialogVisible.value = false
      } catch (error) {
        console.error('Cancel failed:', error)
        ElMessage.error('Failed to cancel order')
      } finally {
        loading.value = false
      }
    }
  })
}

// WMS取消接口调用
const cancelInWMS = async (params: {
  orderId?: string
  mode: 'whole' | 'partial'
  subOrders: string[]
}) => {
  // TODO: 实现WMS取消接口调用
  // 这里模拟API调用
  return new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
}

// 更新订单状态
const updateOrderStatus = async (orderId?: string, status?: string) => {
  // TODO: 实现更新订单状态接口调用
  // 这里模拟API调用
  return new Promise((resolve) => {
    setTimeout(resolve, 500)
  })
}

const handleReopenConfirm = async () => {
  if (!reopenFormRef.value) return
  
  await reopenFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        const currentOrder = props.currentOrder
        if (!currentOrder) throw new Error('No order selected')

        // 检查履约模式
        const fulfillmentMode = currentOrder.fulfillmentMode
        const requireWarehouse = fulfillmentMode === 'Manual' || fulfillmentMode === 'Auto Allocate'

        // 检查是否有子单
        const hasSubOrders = currentOrder.subOrders && currentOrder.subOrders.length > 0
        const exceptionSubOrders = hasSubOrders ? 
          currentOrder.subOrders.filter((sub: SubOrder) => sub.status === SubOrderStatus.Exception) : 
          []
        const hasExceptionSubOrders = exceptionSubOrders.length > 0

        // 确定新状态和要处理的子单
        let newStatus
        let subOrdersToReopen: string[] = []

        if (reopenForm.mode === 'whole') {
          // 整单重开时，如果有异常子单，全部重开
          if (hasExceptionSubOrders) {
            subOrdersToReopen = exceptionSubOrders.map(sub => sub.subOrderNo)
          }
          // 根据履约模式决定新状态
          newStatus = requireWarehouse ? OrderStatus.Imported : OrderStatus.Pending
        } else {
          // 部分重开时，只重开选中的子单
          subOrdersToReopen = reopenForm.selectedSubOrders
          // 检查是否还有未选择的异常子单
          const hasRemainingExceptionSubOrders = exceptionSubOrders.some(
            sub => !reopenForm.selectedSubOrders.includes(sub.subOrderNo)
          )
          // 如果还有未处理的异常子单，保持Exception状态
          newStatus = hasRemainingExceptionSubOrders ? 
            OrderStatus.Exception : 
            (requireWarehouse ? OrderStatus.Imported : OrderStatus.Pending)
        }

        // 更新订单状态
        await updateOrderStatus(currentOrder.id, newStatus)

        emit('reopen', {
          ...reopenForm,
          orderId: currentOrder.id,
          newStatus,
          requireWarehouse,
          subOrdersToReopen
        })

        ElMessage.success('Order reopened successfully')
        reopenDialogVisible.value = false

        // 重置表单
        reopenForm.mode = 'whole'
        reopenForm.reason = ''
        reopenForm.remarks = ''
        reopenForm.selectedSubOrders = []
      } catch (error) {
        console.error('Reopen failed:', error)
        ElMessage.error('Failed to reopen order')
      } finally {
        loading.value = false
      }
    }
  })
}

const handleDeallocateConfirm = async () => {
  if (!deallocateFormRef.value) return
  
  loading.value = true
  try {
    // 如果需要调用WMS
    if (needCallWMS.value) {
      await deallocateInWMS({
        orderId: props.currentOrder?.id,
        mode: deallocateForm.mode,
        reason: deallocateForm.reason,
        subOrders: deallocateForm.selectedSubOrders
      })
    }

    const newStatus = deallocateForm.mode === 'whole' ? 
      OrderStatus.Deallocated : 
      OrderStatus.Exception

    await updateOrderStatus(props.currentOrder?.id, newStatus)

    emit('deallocate', {
      ...deallocateForm,
      orderId: props.currentOrder?.id,
      mode: deallocateForm.mode,
      reason: deallocateForm.reason,
      subOrders: deallocateForm.selectedSubOrders
    })

    ElMessage.success('Order deallocation successful')
    deallocateDialogVisible.value = false

    // 重置表单
    deallocateForm.mode = 'whole'
    deallocateForm.reason = ''
    deallocateForm.remarks = ''
    deallocateForm.selectedSubOrders = []
  } catch (error) {
    console.error('Deallocate failed:', error)
    ElMessage.error('Failed to deallocate order')
  } finally {
    loading.value = false
  }
}

// WMS解除分仓接口调用
const deallocateInWMS = async (params: {
  orderId?: string
  mode: 'whole' | 'partial'
  reason: string
  subOrders: string[]
}) => {
  // TODO: 实现WMS解除分仓接口调用
  // 这里模拟API调用
  return new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
}

// Dialog open methods
const openAllocateDialog = () => {
  allocateDialogVisible.value = true
}

const openHoldDialog = () => {
  holdDialogVisible.value = true
}

const openCancelDialog = () => {
  console.log('Opening Cancel Dialog...'); // 添加调试日志
  cancelForm.mode = isAllocated.value ? 'partial' : 'whole'
  cancelForm.selectedSubOrders = []
  cancelForm.reason = ''
  cancelForm.remarks = ''
  cancelDialogVisible.value = true
  
  // 强制更新数据
  nextTick(() => {
    console.log('Dialog Opened, Sub Orders:', cancelableSubOrders.value); // 添加调试日志
  })
}

const openReopenDialog = () => {
  reopenDialogVisible.value = true
}

const openDeallocateDialog = () => {
  deallocateForm.mode = isAllocated.value ? 'partial' : 'whole'
  deallocateForm.selectedSubOrders = []
  deallocateForm.remarks = ''
  deallocateDialogVisible.value = true
  
  // 强制更新数据
  nextTick(() => {
    console.log('Dialog Opened, Sub Orders:', deallocatableSubOrders.value)
  })
}

// Expose methods to parent
defineExpose({
  openAllocateDialog,
  openHoldDialog,
  openCancelDialog,
  openReopenDialog,
  openDeallocateDialog
})

// 添加新的方法用于确定库存标签的类型
const getStockTagType = (stock: number, required: number) => {
  if (stock >= required) return 'success'
  if (stock > 0) return 'warning'
  return 'danger'
}

// 添加获取WMS标签类型的方法
const getWmsTagType = (wmsType: string) => {
  switch (wmsType) {
    case 'wmsv1':
      return 'success'
    case 'wmsv2':
      return 'warning'
    default:
      return 'info'
  }
}

// 添加 API 接口类型定义
interface WarehouseApiResponse {
  id: string
  name: string
  stockInfo: Record<string, number>
  wmsType: 'wmsv1' | 'wmsv2' | 'other'
}

// 修改仓库数据获取函数
const fetchWarehouseData = async () => {
  try {
    // 这里需要调用后端API获取仓库及其库存信息
    const response = await fetch('/api/warehouses/stock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        skus: orderItems.value.map(item => item.sku)
      })
    })
    
    const data = await response.json() as WarehouseApiResponse[]
    
    warehouses.value = data.map(wh => ({
      value: wh.id,
      label: wh.name,
      stockInfo: wh.stockInfo,
      wmsType: wh.wmsType
    }))
  } catch (error) {
    console.error('Failed to fetch warehouse data:', error)
    ElMessage.error('Failed to load warehouse data')
  }
}

// 修改表格的selection-change事件处理
interface SubOrderRow {
  subOrderNo: string
  [key: string]: any
}

const handleSelectionChange = (rows: SubOrderRow[]) => {
  cancelForm.selectedSubOrders = rows.map(r => r.subOrderNo)
}

// 添加获取WMS类型的辅助方法
const getWmsTypeFromWarehouse = (warehouse: string) => {
  if (warehouse.includes('WMS V1')) return 'success'
  if (warehouse.includes('WMS V2')) return 'warning'
  return 'info'
}

// 在 script setup 的开头添加
const isDev = import.meta.env.DEV
console.log('Development mode:', isDev)

// 修改初始化函数
const initializeData = () => {
  console.log('Initializing data...')
  if (isDev) {
    console.log('Mock order data:', mockCurrentOrder.value)
    // 强制使用模拟数据
    orderItems.value = mockCurrentOrder.value.items.map(item => ({
      sku: item.sku,
      productName: item.productName,
      quantity: item.quantity,
      remainingQuantity: item.quantity
    }))
  }
}

// 修改组件挂载逻辑
onMounted(() => {
  console.log('Component mounted')
  initializeData()
})

// 添加调试信息到模板
const debugInfo = computed(() => ({
  isDev,
  hasCurrentOrder: !!currentOrderData.value,
  subOrdersCount: currentOrderData.value?.subOrders?.length || 0,
  cancelableSubOrdersCount: cancelableSubOrders.value.length
}))

// Default time for time picker
const defaultTime = [
  new Date(new Date().setHours(0, 0, 0, 0)),
  new Date(new Date().setHours(23, 59, 59, 999))
]

// Date shortcuts for time picker
const dateShortcuts = [
  {
    text: '1 Day',
    value: () => {
      const end = new Date()
      const start = new Date()
      end.setTime(end.getTime() + 3600 * 1000 * 24)
      return [start, end]
    }
  },
  {
    text: '1 Week',
    value: () => {
      const end = new Date()
      const start = new Date()
      end.setTime(end.getTime() + 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '1 Month',
    value: () => {
      const end = new Date()
      const start = new Date()
      end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  }
]

// Disable dates before today
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7
}

// Handle time range change
const handleTimeRangeChange = (val: string[]) => {
  if (val && val.length === 2) {
    const start = new Date(val[0])
    const end = new Date(val[1])
    
    // Validate time range
    if (start >= end) {
      ElMessage.warning('End time must be greater than start time')
      holdForm.timeRange = []
      return
    }
    
    if (start < new Date()) {
      ElMessage.warning('Start time cannot be earlier than current time')
      holdForm.timeRange = []
      return
    }
  }
}

// Deallocate form data
const deallocatableSubOrders = computed(() => {
  if (!currentOrderData.value?.subOrders) return []
  return currentOrderData.value.subOrders.filter(
    sub => ['Allocated', 'Exception'].includes(sub.status)
  )
})

// 是否可以解除分仓
const canDeallocate = computed(() => {
  if (!currentOrderData.value) return false
  
  // 已发货状态不可解除分仓
  if (currentOrderData.value.status === 'Shipped') return false
  
  // 检查子订单状态
  if (currentOrderData.value.subOrders?.some(
    sub => sub.status === 'Shipped' || sub.status === 'Short Shipped'
  )) {
    return false
  }
  
  return true
})

// 处理解除分仓子订单选择
const handleDeallocateSelectionChange = (selection: any[]) => {
  deallocateForm.selectedSubOrders = selection.map(item => item.subOrderNo)
}

// 在script setup部分添加DEALLOCATE_REASONS常量
const DEALLOCATE_REASONS = [
  { value: 'stock_adjustment', label: '库存调整' },
  { value: 'system_error', label: '系统错误' },
  { value: 'warehouse_issue', label: '仓库问题' },
  { value: 'reallocation', label: '需要重新分配' },
  { value: 'other', label: '其他原因' }
]

// 计算是否有异常子单
const hasExceptionSubOrders = computed(() => {
  return props.currentOrder?.subOrders?.some(
    (sub: SubOrder) => sub.status === SubOrderStatus.Exception
  ) ?? false
})

// 获取异常状态的子单
const exceptionSubOrders = computed(() => {
  return props.currentOrder?.subOrders?.filter(
    (sub: SubOrder) => sub.status === SubOrderStatus.Exception
  ) ?? []
})

// 判断是否可以重开
const canReopenOrder = computed(() => {
  if (reopenForm.mode === 'whole') {
    return true
  }
  return reopenForm.selectedSubOrders?.length > 0
})

// 处理子单选择变更
const handleReopenSelectionChange = (rows: SubOrder[]) => {
  reopenForm.selectedSubOrders = rows.map(row => row.subOrderNo)
}
</script>

<style lang="scss" scoped>
.action-dialogs {
  :deep(.el-dialog__body) {
    padding: 20px;
  }

  // 添加取消弹窗的样式
  :deep(.el-dialog) {
    min-width: 800px;  // 设置最小宽度
    
    .sub-orders-section {
      margin: 20px 0;
      
      .section-title {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 16px;
      }
      
      .el-table {
        margin-bottom: 20px;
      }
    }
  }

  .mode-option {
    display: flex;
    align-items: center;
    gap: 8px;

    .mode-title {
      font-weight: 500;
    }

    .el-icon {
      color: var(--el-text-color-secondary);
      cursor: help;
    }
  }

  .mode-tooltip {
    max-width: 300px;
    
    p {
      margin: 0 0 8px;
      font-weight: 500;
    }

    ul {
      margin: 0;
      padding-left: 16px;

      li {
        margin-bottom: 4px;
        color: var(--el-text-color-regular);

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .section-title {
      font-size: 16px;
      font-weight: 500;
    }

    .selection-info {
      color: var(--el-text-color-secondary);
      font-size: 14px;
    }
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

.warehouse-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.warehouse-name {
  font-weight: 500;
}

.wms-tag {
  text-transform: uppercase;
}

.warehouse-stock-info {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.warehouse-stock-info .el-tag {
  margin-right: 4px;
  margin-bottom: 4px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.warehouse-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .el-tag {
    text-transform: uppercase;
  }
}

.inline-radio-group {
  display: inline-flex !important;
  gap: 20px;
}
</style> 