<template>
  <div class="purchase-order-detail">
    <!-- 顶部导航栏 -->
    <div class="detail-header">
      <div class="header-main">
        <div class="left-section">
          <el-button link @click="$router.back()">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <div class="order-info-section">
            <div class="title-section">
            <h2 class="order-id">#{{ orderNo }}</h2>
          <el-tag 
            :type="getStatusType(orderStatus)" 
            size="small" 
            effect="plain"
          >
            {{ getStatusLabel(orderStatus) }}
          </el-tag>
        </div>
            <div class="order-meta">
              <div class="meta-item">
              <span class="label">Ordered:</span>
                <span class="value">{{ formatDate(orderDate) }}</span>
            </div>
              <div class="meta-item">
              <span class="label">Expected Arrival:</span>
                <span class="value">{{ formatDate(requiredDate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="header-actions">
        <el-button 
          class="edit-button"
          @click="toggleEdit"
        >
          <el-icon><EditPen /></el-icon>
          Edit
        </el-button>
        <el-dropdown @command="handleAction">
          <el-button>
            Actions
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="createArrival">
                <el-icon><Van /></el-icon>
                Create Arrival
              </el-dropdown-item>
              <el-dropdown-item command="markComplete">
                <el-icon><Check /></el-icon>
                Mark Complete
              </el-dropdown-item>
            </el-dropdown-menu>
      </template>
        </el-dropdown>
        <el-button 
          type="primary" 
          class="ship-button"
          @click="handleCreateArrival"
        >
          <el-icon><Van /></el-icon>
          Create Arrival
        </el-button>
      </div>
    </div>

    <!-- 采购流程进度条 -->
    <div class="purchase-flow">
      <div class="flow-timeline">
        <!-- 连接线 -->
        <div class="timeline-lines">
          <div class="connecting-line">
            <div 
              class="line-active" 
              :style="{ width: `${(currentStepIndex / (purchaseSteps.length - 1)) * 100}%` }"
            />
          </div>
        </div>
        <!-- 节点 -->
        <div 
          v-for="(step, index) in purchaseSteps" 
          :key="step.key"
          class="timeline-item"
          :class="{
            'is-active': index <= currentStepIndex,
            'is-current': index === currentStepIndex
          }"
        >
          <div class="timeline-node">
            <div class="timeline-icon">
              <el-icon class="custom-icon" v-if="step.icon">
                <component :is="step.icon" />
              </el-icon>
              <span v-else class="step-number">{{ index + 1 }}</span>
            </div>
            <div class="step-info">
              <span class="step-title">{{ step.title }}</span>
              <span class="step-time">{{ formatFlowDate(step.time) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="detail-content">
      <!-- 左侧主要内容 -->
      <div class="main-section">
        <!-- 订单详情Tab区域 -->
        <div class="order-details-section">
          <el-tabs v-model="activeTab" type="border-card" class="order-tabs">
            <!-- Items Tab -->
            <el-tab-pane label="Items" name="items">
              <div class="tab-content">
                <!-- 在表格部分 -->
<div class="table-container">
  <el-table :data="mockItems" style="width: 100%" :summary-method="getSummaries" show-summary>
    <el-table-column label="PRODUCT" min-width="200">
      <template #default="{ row }">
        <div class="product-info">
          <div class="product-name">
            <span class="name-text">{{ row.name }}</span>
          </div>
          <div class="product-details">
            <div class="detail-line">SKU: {{ row.sku }}</div>
            <div class="detail-line">PO Line: {{ row.poLine }}</div>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="QTY" min-width="80" align="right">
      <template #default="{ row }">
        <span>{{ row.quantity }}</span>
      </template>
    </el-table-column>
    <el-table-column label="SHIPPED" min-width="100" align="center">
      <template #default="{ row }">
        <div class="dispatch-info">
          <span>{{ row.shipped }} / {{ row.quantity }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="RECEIVED" min-width="100" align="center">
      <template #default="{ row }">
        <div class="dispatch-info">
          <span>{{ row.received }} / {{ row.quantity }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="UNIT PRICE" min-width="100" align="right">
      <template #default="{ row }">
        <span>${{ row.price.toFixed(2) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="UOM" min-width="80" align="center">
      <template #default="{ row }">
        <span>{{ row.uom }}</span>
      </template>
    </el-table-column>
    <el-table-column label="LOT NO." min-width="100" align="center">
      <template #default="{ row }">
        <span>{{ row.lotNo || '-' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="SN PRODUCT" min-width="100" align="center">
      <template #default="{ row }">
        <span>{{ row.snProduct || '-' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="SN LIST" min-width="100" align="center">
      <template #default="{ row }">
        <el-button 
          v-if="row.snList?.length" 
          type="primary" 
          link 
          size="small"
          @click="handleViewSnList(row)"
        >
          View ({{ row.snList.length }})
        </el-button>
        <span v-else>-</span>
      </template>
    </el-table-column>
    <el-table-column label="PRICE" min-width="100" align="right">
      <template #default="{ row }">
        <span>${{ (row.quantity * row.price).toFixed(2) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="TOTAL" min-width="100" align="right">
      <template #default="{ row }">
        <span>${{ (row.quantity * row.price).toFixed(2) }}</span>
      </template>
    </el-table-column>
  </el-table>

  <!-- SN List Dialog -->
  <el-dialog
    v-model="snListDialogVisible"
    title="Serial Number List"
    width="500px"
    class="sn-list-dialog"
  >
    <div class="sn-list-content">
      <div class="sn-item" v-for="sn in currentSnList" :key="sn">
        {{ sn }}
      </div>
    </div>
  </el-dialog>
</div>

                </div>
              </el-tab-pane>

            <!-- Arrivals Tab -->
            <el-tab-pane label="Arrivals" name="arrivals">
              <div class="tab-content arrivals-layout">
                <!-- 左侧列表 -->
                <div class="left-panel">
                  <div class="panel-header">
                    <h3>Arrival Orders</h3>
                  </div>
                  <div class="arrivals-list">
                    <div 
                      v-for="arrival in arrivals" 
                      :key="arrival.id"
                      class="arrival-item"
                      :class="{ active: selectedArrival?.id === arrival.id }"
                      @click="handleSelectArrival(arrival)"
                    >
                      <div class="arrival-header">
                        <span class="arrival-no">{{ arrival.arrivalNo }}</span>
                        <el-tag :type="getStatusType(arrival.status)" size="small">
                          {{ arrival.status }}
                        </el-tag>
                      </div>
                      <div class="arrival-info">
                        <div class="info-item">
                          <span class="label">Destination:</span>
                          <span class="value">{{ arrival.warehouse || 'Warehouse A' }}</span>
                        </div>
                        <div class="info-item">
                          <span class="label">Expected Date:</span>
                          <span class="value">{{ formatDate(arrival.expectedDate) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 右侧详情 -->
                <div class="right-panel" v-if="selectedArrival">
                  <div class="panel-header">
                    <div class="header-title">
                      <h3>{{ selectedArrival.arrivalNo }}</h3>
                      <el-tag :type="getStatusType(selectedArrival.status)" size="small">
                        {{ selectedArrival.status }}
                      </el-tag>
                    </div>
                    <div class="header-actions">
                      <el-button 
                        type="primary" 
                        @click="handleCreateReceipt(selectedArrival)"
                      >
                          Create Receipt
                        </el-button>
                    </div>
                  </div>

                  <!-- 进度条 -->
                  <div class="progress-section">
                    <el-steps :active="getProgressStep(selectedArrival.status)" finish-status="success">
                      <el-step title="Created" />
                      <el-step title="In Transit" />
                      <el-step title="Arrived" />
                      <el-step title="Received" />
                    </el-steps>
                  </div>

                  <!-- 信息卡片 -->
                  <div class="info-cards">
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <div class="info-card">
                          <h4>Basic Information</h4>
                          <div class="card-content">
                            <div class="info-item">
                              <span class="label">Created At:</span>
                              <span class="value">{{ formatDate(selectedArrival.createdAt) }}</span>
                            </div>
                            <div class="info-item">
                              <span class="label">Updated At:</span>
                              <span class="value">{{ formatDate(selectedArrival.updatedAt) }}</span>
                            </div>
                            <div class="info-item">
                              <span class="label">Total Weight:</span>
                              <span class="value">{{ selectedArrival.totalWeight || '0 lb' }}</span>
                            </div>
                            <div class="info-item">
                              <span class="label">External Article ID:</span>
                              <span class="value">{{ selectedArrival.externalArticleId || '-' }}</span>
                            </div>
                            <div class="info-item">
                              <span class="label">Sender's Name:</span>
                              <span class="value">{{ selectedArrival.senderName || '-' }}</span>
                            </div>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="info-card">
                          <h4>Shipping Information</h4>
                          <div class="card-content">
                            <div class="info-item">
                              <span class="label">Shipping Carrier:</span>
                              <span class="value">{{ selectedArrival.shippingCarrier || '-' }}</span>
                            </div>
                            <div class="info-item">
                              <span class="label">Shipping Method:</span>
                              <span class="value">{{ selectedArrival.shippingMethod || '-' }}</span>
                            </div>
                            <div class="info-item">
                              <span class="label">BOL:</span>
                              <span class="value">{{ selectedArrival.bol || '-' }}</span>
                            </div>
                            <div class="info-item">
                              <span class="label">Seal:</span>
                              <span class="value">{{ selectedArrival.seal || '-' }}</span>
                            </div>
                            <div class="info-item">
                              <span class="label">Trailer Number:</span>
                              <span class="value">{{ selectedArrival.trailerNumber || '-' }}</span>
                            </div>
                            <div class="info-item">
                              <span class="label">Trailer Size:</span>
                              <span class="value">{{ selectedArrival.trailerSize || '-' }}</span>
                            </div>
                            <div class="info-item">
                              <span class="label">Trailer Type:</span>
                              <span class="value">{{ selectedArrival.trailerType || '-' }}</span>
                            </div>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="info-card">
                          <h4>Container Information</h4>
                          <div class="card-content">
                            <div class="info-item">
                              <span class="label">Container Number:</span>
                              <span class="value">{{ selectedArrival.containerNumber || '-' }}</span>
                            </div>
                            <div class="info-item">
                              <span class="label">Container Size:</span>
                              <span class="value">{{ selectedArrival.containerSize || '-' }}</span>
                            </div>
                            <div class="info-item">
                              <span class="label">Container Type:</span>
                              <span class="value">{{ selectedArrival.containerType || '-' }}</span>
                            </div>
                            <div class="info-item">
                              <span class="label">Expected Arrival:</span>
                              <span class="value">{{ formatDate(selectedArrival.expectedArrivalDate) || '-' }}</span>
                            </div>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </div>

                  <!-- 商品列表 -->
                  <div class="items-section">
                    <h4>Items</h4>
                    <el-table :data="selectedArrival.items || mockItems" style="width: 100%">
                      <el-table-column label="Pipe17 SKU" prop="sku" min-width="120" />
                      <el-table-column label="Item Name" prop="name" min-width="200" />
                      <el-table-column label="Qty on ASN" prop="quantity" width="120" align="right" />
                      <el-table-column label="Qty Received" prop="received" width="120" align="right" />
                      <el-table-column label="Quantity Unit" prop="uom" width="120" align="center" />
                      <el-table-column label="Lot Number" prop="lotNo" width="120" />
                      <el-table-column label="Pallet Quantity" prop="palletQty" width="120" align="right" />
                      <el-table-column label="UPC" prop="upc" width="120" />
                      <el-table-column label="Purchase ID" prop="purchaseId" width="120" />
        </el-table>
                  </div>
                </div>

                <!-- 空状态 -->
                <div class="right-panel empty-state" v-else>
                  <el-empty description="Select an arrival to view details" />
      </div>
        </div>
            </el-tab-pane>

            <!-- Receipts Tab -->
            <el-tab-pane label="Receipts" name="receipts">
              <div class="tab-content arrivals-layout">
                <!-- 左侧列表 -->
                <div class="left-panel">
                  <div class="panel-header">
                    <h3>Receipt Orders</h3>
                  </div>
                  <div class="arrivals-list">
                    <div 
                      v-for="receipt in receipts" 
                      :key="receipt.id"
                      class="arrival-item"
                      :class="{ active: selectedReceipt?.id === receipt.id }"
                      @click="handleSelectReceipt(receipt)"
                    >
                      <div class="arrival-header">
                        <span class="arrival-no">{{ receipt.receiptNo }}</span>
                        <el-tag :type="getStatusType(receipt.status)" size="small">
                          {{ receipt.status }}
                        </el-tag>
                      </div>
                      <div class="arrival-info">
                        <div class="info-item">
                          <span class="label">Receipt ID:</span>
                          <span class="value">{{ receipt.id }}</span>
                        </div>
                        <div class="info-item">
                          <span class="label">Warehouse:</span>
                          <span class="value">{{ receipt.warehouse || 'Warehouse A' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 右侧详情 -->
                <div class="right-panel" v-if="selectedReceipt">
                  <div class="panel-header">
                    <div class="header-title">
                      <h3>{{ selectedReceipt.receiptNo }}</h3>
                      <el-tag :type="getStatusType(selectedReceipt.status)" size="small">
                        {{ selectedReceipt.status }}
                      </el-tag>
                    </div>
                  </div>

                  <!-- 基本信息卡片 -->
                  <div class="info-cards">
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <div class="info-card">
                          <h4>Basic Information</h4>
                          <div class="card-content">
                            <div class="info-item">
                              <span class="label">Created At:</span>
                              <span class="value">{{ formatDate(selectedReceipt.createdAt) }}</span>
                            </div>
                            <div class="info-item">
                              <span class="label">Updated At:</span>
                              <span class="value">{{ formatDate(selectedReceipt.updatedAt) }}</span>
                            </div>
                            <div class="info-item">
                              <span class="label">External Article ID:</span>
                              <span class="value">{{ selectedReceipt.externalArticleId || '-' }}</span>
                            </div>
                            <div class="info-item">
                              <span class="label">Shipping Carrier:</span>
                              <span class="value">{{ selectedReceipt.shippingCarrier || '-' }}</span>
                            </div>
                            <div class="info-item">
                              <span class="label">Shipping Class:</span>
                              <span class="value">{{ selectedReceipt.shippingClass || '-' }}</span>
                            </div>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="info-card">
                          <h4>Additional Information</h4>
                          <div class="card-content">
                            <div class="info-item">
                              <span class="label">P.O. Request ID:</span>
                              <span class="value">{{ selectedReceipt.poRequestId || '-' }}</span>
                            </div>
                            <div class="info-item">
                              <span class="label">Incotems:</span>
                              <span class="value">{{ selectedReceipt.incoterms || '-' }}</span>
                            </div>
                            <div class="info-item">
                              <span class="label">Expected Arrival Date:</span>
                              <span class="value">{{ formatDate(selectedReceipt.expectedArrivalDate) }}</span>
                            </div>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </div>

                  <!-- 商品列表 -->
                  <div class="items-section">
                    <h4>Items</h4>
                    <el-table :data="selectedReceipt.items || []" style="width: 100%">
                      <el-table-column label="Pipe17 SKU" prop="sku" min-width="120" />
                      <el-table-column label="Item Name" prop="name" min-width="200" />
                      <el-table-column label="Quantity" prop="quantity" width="100" align="right" />
                      <el-table-column label="Quantity Unit" prop="quantityUnit" width="120" align="center" />
        </el-table>
                    <div class="table-footer">
                      <span>Total Qty: {{ selectedReceipt.totalQuantity || 0 }}</span>
                    </div>
                  </div>
                </div>

                <!-- 空状态 -->
                <div class="right-panel empty-state" v-else>
                  <el-empty description="Select a receipt to view details" />
      </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- 右侧信息栏 -->
      <div class="side-section">
        <div class="info-tabs-wrapper">
          <el-tabs v-model="activeInfoTab" class="info-tabs">
            <el-tab-pane label="Order Information" name="order">
              <div class="info-content">
                <!-- 基本订单信息 -->
                <div class="info-group">
                  <div class="group-title">Order Details</div>
                  <div class="info-item">
                    <span class="label">Status:</span>
                    <span class="value">{{ getStatusLabel(orderStatus) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Priority:</span>
                    <span class="value">{{ priority || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Type:</span>
                    <span class="value">{{ type || '-' }}</span>
                  </div>
                </div>
                
                <!-- 时间信息 -->
                <div class="info-group">
                  <div class="group-title">Dates</div>
                  <div class="info-item">
                    <span class="label">Request Date:</span>
                    <span class="value">{{ formatDate(orderDate) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Required Date:</span>
                    <span class="value">{{ formatDate(requiredDate) }}</span>
                  </div>
                </div>

                <!-- 设施信息 -->
                <div class="info-group">
                  <div class="group-title">Facility</div>
                  <div class="info-item">
                    <span class="label">Facility Name:</span>
                    <span class="value">{{ facility || '-' }}</span>
                  </div>
                </div>

                <!-- 联系人信息 -->
                <div class="info-group">
                  <div class="group-title">Contact Information</div>
                  <div class="info-item">
                    <span class="label">Contact Name:</span>
                    <span class="value">{{ contactName.first }} {{ contactName.middle ? contactName.middle + ' ' : ''}}{{ contactName.last }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Email:</span>
                    <span class="value">{{ contactEmail || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Phone Number:</span>
                    <span class="value">{{ formatPhoneNumber(contactPhone) }}</span>
                  </div>
                </div>

                <!-- 地址信息 -->
                <div class="info-group">
                  <div class="group-title">Shipping Address</div>
                  <div class="info-item">
                    <span class="label">Address Line 1:</span>
                    <span class="value">{{ contactAddress.street }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Address Line 2:</span>
                    <span class="value">{{ contactAddress.unit || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">City:</span>
                    <span class="value">{{ contactAddress.city }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">State:</span>
                    <span class="value">{{ contactAddress.state }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">ZIP Code:</span>
                    <span class="value">{{ contactAddress.zipCode }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Country:</span>
                    <span class="value">{{ contactAddress.country }}</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="Supplier Information" name="supplier">
              <div class="info-content">
                <!-- 基本供应商信息 -->
                <div class="info-group">
                  <div class="group-title">Company Details</div>
                  <div class="info-item">
                    <span class="label">Company Name:</span>
                    <span class="value">{{ supplierInfo.companyName }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Business Email:</span>
                    <span class="value">{{ supplierInfo.email }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Phone Number:</span>
                    <span class="value">{{ formatPhoneNumber(supplierInfo.phone) }}</span>
                  </div>
                </div>

                <!-- 供应商地址 -->
                <div class="info-group">
                  <div class="group-title">Business Address</div>
                  <div class="info-item">
                    <span class="label">Address Line 1:</span>
                    <span class="value">{{ supplierInfo.address.street }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Address Line 2:</span>
                    <span class="value">{{ supplierInfo.address.unit || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">City:</span>
                    <span class="value">{{ supplierInfo.address.city }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">State:</span>
                    <span class="value">{{ supplierInfo.address.state }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">ZIP Code:</span>
                    <span class="value">{{ supplierInfo.address.zipCode }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Country:</span>
                    <span class="value">{{ supplierInfo.address.country }}</span>
                  </div>
                </div>

                <!-- 额外信息 -->
                <div class="info-group">
                  <div class="group-title">Additional Information</div>
                  <div class="info-item">
                    <span class="label">Supplier Notes:</span>
                    <span class="value">{{ supplierInfo.notes || '-' }}</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, 
  InfoFilled, 
  ArrowDown, 
  Van, 
  Check, 
  EditPen,
  Document,
  Tickets,
  Box,
  Finished
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 基本数据
const orderNo = ref('PO00184716')
const orderStatus = ref('processing')
const showInfoDialog = ref(false)
const activeTab = ref('items')
const activeInfoTab = ref('order')

// 订单信息
const orderDate = ref('2024-02-16T08:30:00')
const requiredDate = ref('2024-02-25T16:00:00')
const priority = ref('High')
const facility = ref('Warehouse A')
const type = ref('Standard')

// 更新数据结构
const contactName = ref({
  first: 'John',
  middle: 'Robert',
  last: 'Doe'
})

const contactEmail = ref('john.doe@example.com')
const contactPhone = ref('5551234567')
const contactAddress = ref({
  street: '123 Main Street',
  unit: 'Suite 405',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  country: 'United States'
})

// 供应商信息
const supplierInfo = ref({
  companyName: 'ABC Supplier Co., Ltd.',
  email: 'sales@abcsupplier.com',
  phone: '5550123456',
  address: {
    street: '456 Oak Avenue',
    unit: 'Floor 7',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'United States'
  },
  notes: 'Fast delivery preferred'
})

// 更新模拟数据
const mockItems = ref([
  {
    sku: 'SN001234567',
    name: '蓝色连衣裙',
    poLine: 'PO-001',
    quantity: 2,
    shipped: 1,
    received: 1,
    price: 199.99,
    uom: 'PCS',
    lotNo: 'LOT20240301',
    snProduct: 'Required',
    snList: ['SN0001', 'SN0002']
  },
  {
    sku: 'SN001234568',
    name: '白色衬衫',
    poLine: 'PO-002',
    quantity: 1,
    shipped: 1,
    received: 1,
    price: 299.99,
    uom: 'PCS',
    lotNo: 'LOT20240302',
    snProduct: '-',
    snList: []
  },
  {
    sku: 'SN001234569',
    name: '黑色运动鞋',
    poLine: 'PO-003',
    quantity: 1,
    shipped: 0,
    received: 0,
    price: 499.99,
    uom: 'PAIR',
    lotNo: 'LOT20240303',
    snProduct: 'Required',
    snList: ['SN0003']
  }
])

// SN List Dialog
const snListDialogVisible = ref(false)
const currentSnList = ref<string[]>([])

const handleViewSnList = (row: any) => {
  currentSnList.value = row.snList
  snListDialogVisible.value = true
}

// 更新汇总方法
const getSummaries = (param: { columns: any[], data: any[] }) => {
  const { columns, data } = param
  const sums: any[] = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = 'Total'
      return
    }
    
    const values = data.map(item => {
      switch (column.label) {
        case 'QTY':
          return item.quantity
        case 'SHIPPED':
          return item.shipped
        case 'RECEIVED':
          return item.received
        case 'PRICE':
        case 'TOTAL':
          return item.quantity * item.price
        default:
          return null
      }
    })

    if (values.every(value => value === null)) {
      sums[index] = ''
    } else {
      const sum = values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)
      
      if (['PRICE', 'TOTAL'].includes(column.label)) {
        sums[index] = `$${sum.toFixed(2)}`
      } else {
        sums[index] = sum
      }
    }
  })
  return sums
}

// 更新订单总金额计算
const totalAmount = computed(() => {
  return mockItems.value.reduce((total, item) => {
    return total + (item.quantity * item.price)
  }, 0)
})

// 添加新的数据和方法
const selectedArrival = ref<any>(null)

const handleSelectArrival = (arrival: any) => {
  selectedArrival.value = arrival
}

const getProgressStep = (status: string) => {
  const stepMap: Record<string, number> = {
    'created': 1,
    'in_transit': 2,
    'arrived': 3,
    'received': 4
  }
  return stepMap[status] || 1
}

// 更新arrivals数据结构
const arrivals = ref([
  {
    id: 'ARR001',
    arrivalNo: 'ARR-2024-001',
    status: 'arrived',
    createdAt: '2024-02-20T10:00:00',
    updatedAt: '2024-02-20T10:43:00',
    totalWeight: '1000 lb',
    externalArticleId: 'ASN-PO-0003-1',
    senderName: 'ABC Supplier',
    shippingCarrier: 'FedEx Freight',
    shippingMethod: 'LTL',
    bol: 'BOL123456',
    seal: 'SEAL789',
    trailerNumber: 'TR123456',
    trailerSize: '53ft',
    trailerType: 'Dry Van',
    containerNumber: 'CONT123456',
    containerSize: '40ft',
    containerType: 'Standard',
    expectedArrivalDate: '2024-02-25T16:00:00',
    warehouse: 'Warehouse A',
    items: [
      {
        sku: 'SKU001',
        name: 'Test Product',
        quantity: 1000,
        received: 1000,
        uom: 'each',
        lotNo: 'LOT20240220',
        palletQty: 10,
        upc: '123456789012',
        purchaseId: 'PO123456'
      }
    ]
  },
  {
    id: 'ARR002',
    arrivalNo: 'ARR-2024-002', 
    status: 'in_transit',
    expectedDate: '2024-03-01T16:00:00',
    warehouse: 'Warehouse B',
    carrier: 'UPS',
    trackingNo: 'UPS987654321',
    dock: 'Dock 2',
    createdAt: '2024-02-22T14:30:00'
  }
])

// 收货单数据
const receipts = ref([
  {
    id: 'REC001',
    receiptNo: 'REC-2024-001',
    status: 'completed',
    warehouse: 'Warehouse A',
    createdAt: '2024-02-17T17:40:00',
    updatedAt: '2024-02-17T17:43:00',
    externalArticleId: 'ASN-PO-0003-1',
    shippingCarrier: 'eee',
    shippingClass: 'Standard',
    poRequestId: 'P.O. Shipping Request ID',
    incoterms: '-',
    expectedArrivalDate: '2024-02-17T17:43:00',
    totalQuantity: 1000,
    items: [
      {
        sku: 'SKU001',
        name: 'SKU001',
        quantity: 1000,
        quantityUnit: 'each'
      }
    ]
  }
])

// 添加Receipt相关的数据和方法
const selectedReceipt = ref<any>(null)

const handleSelectReceipt = (receipt: any) => {
  selectedReceipt.value = receipt
}

// 格式化函数
const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    draft: 'info',
    confirmed: 'warning',
    processing: 'primary',
    completed: 'success',
    cancelled: 'danger',
    arrived: 'success',
    pending: 'warning'
  }
  return typeMap[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    draft: 'Draft',
    confirmed: 'Confirmed',
    processing: 'Processing',
    completed: 'Completed',
    cancelled: 'Cancelled',
    arrived: 'Arrived',
    pending: 'Pending'
  }
  return labelMap[status] || status
}

// 事件处理函数
const handleAction = (command: string) => {
  switch (command) {
    case 'createArrival':
      handleCreateArrival()
      break
    case 'markComplete':
      ElMessage.success('Marked as complete')
      break
  }
}

const handleCreateArrival = () => {
  router.push(`/purchase/arrivals/create?purchaseOrderId=${orderNo.value}`)
}

const handleViewArrival = (arrival: any) => {
  router.push(`/purchase/arrivals/${arrival.id}`)
}

const handleCreateReceipt = (arrival: any) => {
  router.push(`/purchase/receipts/create?arrivalId=${arrival.id}`)
}

const handleViewReceipt = (receipt: any) => {
  router.push(`/purchase/receipts/${receipt.id}`)
}

const toggleEdit = () => {
  ElMessage.info('Edit functionality coming soon')
}

const formatPhoneNumber = (phone: string) => {
  if (!phone) return '-'
  // 移除所有非数字字符
  const cleaned = phone.replace(/\D/g, '')
  // 格式化为: (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

// 获取采购流程进度
const getPurchaseFlowStep = (status: string) => {
  const stepMap: Record<string, number> = {
    'draft': 1,      // 采购申请
    'confirmed': 2,  // 采购订单
    'processing': 3, // 运输中
    'arrived': 4,    // 到货
    'completed': 5   // 签收入库
  }
  return stepMap[status] || 1
}

// 添加流程时间数据
const purchaseRequestDate = ref('2024-02-15T10:30:00')
const shippingDate = ref('2024-02-17T14:20:00')
const arrivalDate = ref('2024-02-25T09:00:00')
const receiptDate = ref('2024-02-25T15:00:00')

// 格式化流程时间
const formatFlowDate = (dateStr: string | null) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 采购流程步骤定义
const purchaseSteps = computed(() => [
  {
    key: 'request',
    title: 'Purchase Request',
    time: purchaseRequestDate.value,
    icon: 'Document',
    status: 'completed'
  },
  {
    key: 'order',
    title: 'Purchase Order',
    time: orderDate.value,
    icon: 'Tickets',
    status: orderStatus.value === 'draft' ? 'pending' : 'completed'
  },
  {
    key: 'shipping',
    title: 'In Transit',
    time: shippingDate.value,
    icon: 'Van',
    status: orderStatus.value === 'processing' ? 'active' : 'pending'
  },
  {
    key: 'arrival',
    title: 'Arrival',
    time: arrivalDate.value,
    icon: 'Box',
    status: orderStatus.value === 'arrived' ? 'active' : 'pending'
  },
  {
    key: 'receipt',
    title: 'Receipt',
    time: receiptDate.value,
    icon: 'Finished',
    status: orderStatus.value === 'completed' ? 'active' : 'pending'
  }
])

// 获取当前步骤索引
const currentStepIndex = computed(() => {
  const statusMap = {
    'draft': 0,
    'confirmed': 1,
    'processing': 2,
    'arrived': 3,
    'completed': 4
  }
  return statusMap[orderStatus.value] || 0
})

// 初始化
onMounted(() => {
  const orderId = route.params.id as string
  console.log('Loading purchase order:', orderId)
  
  // 默认选中第一条到货单和收货单
  if (arrivals.value.length > 0) {
    selectedArrival.value = arrivals.value[0]
  }
  if (receipts.value.length > 0) {
    selectedReceipt.value = receipts.value[0]
  }
})

// 监听标签页切换，确保切换到对应标签时有选中项
watch(() => activeTab.value, (newTab) => {
  if (newTab === 'arrivals' && !selectedArrival.value && arrivals.value.length > 0) {
    selectedArrival.value = arrivals.value[0]
  }
  if (newTab === 'receipts' && !selectedReceipt.value && receipts.value.length > 0) {
    selectedReceipt.value = receipts.value[0]
  }
})
</script>

<style lang="scss" scoped>
.purchase-order-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #0A0A0F 0%, #141420 100%);
  color: #fff;

  .detail-header {
    padding: 32px 48px;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .header-main {
      flex: 1;

      .left-section {
        display: flex;
    align-items: center;
        gap: 12px;
        margin-bottom: 20px;
        flex-wrap: wrap;

        .order-info-section {
      display: flex;
      align-items: center;
          gap: 8px;

          .title-section {
            display: flex;
            align-items: center;
            gap: 12px;

          .order-id {
        margin: 0;
            font-size: 32px;
            font-weight: 600;
            background: linear-gradient(135deg, #fff, rgba(255, 255, 255, 0.6));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.5px;
              line-height: 1;
            }

            .el-tag {
              height: 24px;
              padding: 0 12px;
              border-radius: 12px;
            font-size: 12px;
              font-weight: 500;
              border: none;
              letter-spacing: 0.2px;
            }
          }

          .order-meta {
            display: flex;
            gap: 24px;
            padding-left: 2px;
            
            .meta-item {
              display: flex;
              align-items: center;
              gap: 8px;
              
              .label {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.5);
              }
              
              .value {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.9);
                font-family: 'Roboto Mono', monospace;
              }
            }
          }
        }

        .el-tag {
          height: 32px;
          padding: 0 20px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          letter-spacing: 0.2px;
          
          &.el-tag--primary {
            background: rgba(64, 158, 255, 0.15);
            color: #409EFF;
            box-shadow: 0 0 20px rgba(64, 158, 255, 0.15);
          }
        }
      }

      .order-info {
        margin-top: 12px;

        .info-line {
          display: flex;
          gap: 32px;
          flex-wrap: wrap;

          .info-item {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .label {
              font-size: 12px;
              color: rgba(255, 255, 255, 0.6);
              font-weight: 500;
            }

            .value {
              font-size: 14px;
              color: rgba(255, 255, 255, 0.9);
        font-weight: 600;
            }
          }
        }
      }
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;

      .edit-button {
        height: 40px;
        padding: 0 24px;
        background: rgba(99, 102, 241, 0.1);
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 20px;
        color: #6366F1;
        font-weight: 500;
        
        &:hover {
          background: rgba(99, 102, 241, 0.2);
          transform: translateY(-2px);
        }
      }

      .ship-button {
        height: 40px;
        padding: 0 24px;
        background: linear-gradient(135deg, #6366F1, #8B5CF6);
        border: none;
        border-radius: 20px;
        color: #fff;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.6);
        }
      }

      .el-button {
        height: 40px;
        padding: 0 20px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        color: rgba(255, 255, 255, 0.8);
        font-weight: 500;
        
        &:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
      }
    }
  }

  .detail-content {
    display: flex;
    gap: 32px;
    padding: 32px 48px;
    margin: 0 auto;

    .main-section {
      flex: 1;

      .order-details-section {
        .order-tabs {
          background: transparent;
          border: none;

          :deep(.el-tabs__header) {
            margin: 0;
            padding: 0;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 12px 12px 0 0;
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-bottom: none;

            .el-tabs__nav-wrap {
              &::after {
                display: none;
              }
            }

            .el-tabs__nav {
              border: none;
            }

            .el-tabs__item {
              padding: 16px 24px;
              height: auto;
              color: rgba(255, 255, 255, 0.6);
              font-size: 14px;
              font-weight: 500;
              border: none;
              transition: all 0.3s ease;

              &:hover {
                color: rgba(255, 255, 255, 0.9);
              }

              &.is-active {
                color: #6366F1;
                background: rgba(99, 102, 241, 0.1);
              }
            }
          }

          :deep(.el-tabs__content) {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 0 0 12px 12px;
            padding: 24px;

            .tab-content {
              .table-container {
                :deep(.el-table) {
                  background: transparent;
                  
                  &::before {
                    display: none;
                  }

                  .el-table__header-wrapper {
                    th {
                      background: rgba(255, 255, 255, 0.03);
                      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                      color: rgba(255, 255, 255, 0.7);
                      font-weight: 600;
                      padding: 12px 8px;
                    }
                  }

                  .el-table__body-wrapper {
                    tr {
                      background: transparent;
                      
                      &:hover > td {
                        background: rgba(255, 255, 255, 0.03);
                      }

                      td {
                        background: transparent;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
                        color: rgba(255, 255, 255, 0.9);
                        padding: 16px 8px;
                        transition: background 0.3s ease;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    .side-section {
      width: 400px;
      flex-shrink: 0;

      .info-tabs-wrapper {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }

      .info-tabs {
        :deep(.el-tabs__header) {
          margin: 0;
          padding: 0;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);

          .el-tabs__nav-wrap::after {
            display: none;
          }

          .el-tabs__nav {
            width: 100%;
            border: none;
          }

          .el-tabs__nav-scroll {
            .el-tabs__nav {
              display: flex;
              width: 100%;

              .el-tabs__item {
                flex: 1;
                text-align: center;
                padding: 0;
              }
            }
          }

          .el-tabs__item {
            height: 48px;
            line-height: 48px;
            color: rgba(255, 255, 255, 0.6);
            border: none;
            font-size: 14px;
            font-weight: 500;
            padding: 0;

            &.is-active {
              color: #6366F1;
              background: rgba(99, 102, 241, 0.1);
            }

            &:hover {
              color: rgba(255, 255, 255, 0.8);
            }
          }
        }

        :deep(.el-tabs__content) {
          padding: 24px;
        }

        :deep(.el-tabs__active-bar) {
          background-color: #6366F1;
          height: 3px;
        }
      }

      .info-content {
        .info-group {
          &:first-child {
            margin-top: 0;
          }
        }
      }
    }
  }

  @media (max-width: 1400px) {
    .detail-content {
      flex-direction: column;
      padding: 24px;

      .side-section {
        width: 100%;
      }
    }

    .detail-header {
      padding: 24px;
      flex-direction: column;
      align-items: stretch;

      .header-actions {
        margin-top: 16px;
        justify-content: flex-start;
      }
    }
  }
}

.table-container {
  :deep(.el-table__footer) {
    background: rgba(255, 255, 255, 0.05);
    
    td {
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.9);
      font-weight: 600;
      
      &:first-child {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}

.table-container {
  :deep(.el-table) {
    background: transparent;
    
    &::before {
      display: none;
    }
    
    th {
      background-color: rgba(255, 255, 255, 0.02);
      color: rgba(255, 255, 255, 0.7);
      font-weight: 600;
      padding: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      
      .cell {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }
    
    td {
      background-color: transparent;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      color: rgba(255, 255, 255, 0.9);
      padding: 12px 8px;
      
      .cell {
        font-size: 14px;
      }
    }

    .el-table__footer {
      background-color: rgba(255, 255, 255, 0.02);
      
      td {
        background-color: rgba(255, 255, 255, 0.02);
        color: rgba(255, 255, 255, 0.9);
        font-weight: 600;
        
        &:first-child {
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }

    .el-table__inner-wrapper::before {
      display: none;
    }
  }

  .product-info {
    .product-name {
      margin-bottom: 4px;
      
      .name-text {
        font-size: 14px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.9);
      }
    }
    
    .product-details {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      
      .detail-line {
        line-height: 1.5;
      }
    }
  }

  .dispatch-info {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
  }

  .discount {
    color: #F56C6C;
  }
}

.sn-list-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
    max-height: 400px;
    overflow-y: auto;
  }

  .sn-list-content {
    .sn-item {
      padding: 8px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      color: rgba(255, 255, 255, 0.9);
      font-family: monospace;

      &:last-child {
        border-bottom: none;
      }
    }
  }
}

.info-group {
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }

  .group-title {
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
}

.arrivals-layout {
  display: flex;
  gap: 24px;
  height: calc(100vh - 300px);
  min-height: 600px;

  .left-panel {
    width: 300px;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .panel-header {
      padding: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);

      h3 {
        margin: 0;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.9);
      }
    }

    .arrivals-list {
      flex: 1;
      overflow-y: auto;
      padding: 12px;

      .arrival-item {
        padding: 16px;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 8px;
        cursor: pointer;
        margin-bottom: 8px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.04);
          transform: translateY(-2px);
        }

        &.active {
          background: rgba(99, 102, 241, 0.1);
          border-color: rgba(99, 102, 241, 0.2);
        }

        .arrival-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;

          .arrival-no {
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
          }
        }

        .arrival-info {
          .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
            font-size: 12px;

            .label {
              color: rgba(255, 255, 255, 0.5);
            }

            .value {
              color: rgba(255, 255, 255, 0.8);
            }
          }
        }
      }
    }
  }

  .right-panel {
    flex: 1;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    overflow-y: auto;
    padding: 24px;

    &.empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      .header-title {
        display: flex;
        align-items: center;
        gap: 12px;

        h3 {
          margin: 0;
          font-size: 20px;
          color: rgba(255, 255, 255, 0.9);
        }
      }
    }

    .progress-section {
      margin-bottom: 32px;
      padding: 24px;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 12px;
    }

    .items-section {
      margin-bottom: 32px;

      h4 {
        margin: 0 0 16px;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.9);
      }
    }

    .info-cards {
      .info-card {
        background: rgba(255, 255, 255, 0.02);
        border-radius: 12px;
        padding: 16px;
        height: 100%;

        h4 {
          margin: 0 0 12px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
        }

        .card-content {
          .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 13px;
            line-height: 1.4;

            .label {
              color: rgba(255, 255, 255, 0.5);
              margin-right: 12px;
              flex-shrink: 0;
              width: 120px;
            }

            .value {
              color: rgba(255, 255, 255, 0.8);
              text-align: right;
              flex: 1;
            }

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }
  }
}

.table-footer {
  margin-top: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  text-align: right;
}

.purchase-flow {
  padding: 32px 0;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 24px;

  .flow-timeline {
    position: relative;
    margin: 0 48px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0;

    .timeline-lines {
      position: absolute;
      top: 22px;
      left: 22px; // 从第一个节点中心开始
      right: 22px; // 到最后一个节点中心结束
      transform: translateY(-50%);
      z-index: 0;

      .connecting-line {
        position: relative;
        height: 2px;
        background: rgba(255, 255, 255, 0.1);
        overflow: hidden;

        .line-active {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, #6366F1 0%, rgba(99, 102, 241, 0.8) 100%);
          transition: width 0.3s ease;
        }
      }
    }

    .timeline-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 1;

      .timeline-node {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 120px;

        .timeline-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          transition: all 0.3s ease;

          .custom-icon {
            width: 24px;
            height: 24px;
            color: rgba(255, 255, 255, 0.6);
            transition: all 0.3s ease;
          }

          .step-number {
            font-size: 16px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.6);
          }
        }

        .step-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 4px;

          .step-title {
            font-size: 14px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.6);
            transition: color 0.3s ease;
            white-space: nowrap;
          }

          .step-time {
            font-size: 12px;
            font-family: 'Roboto Mono', monospace;
            color: rgba(255, 255, 255, 0.4);
            white-space: nowrap;
          }
        }
      }

      &.is-active {
        .timeline-icon {
          background: rgba(99, 102, 241, 0.1);
          border-color: #6366F1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);

          .custom-icon {
            color: #6366F1;
            filter: drop-shadow(0 2px 4px rgba(99, 102, 241, 0.2));
          }

          .step-number {
            color: #6366F1;
          }
        }

        .step-info {
          .step-title {
            color: rgba(255, 255, 255, 0.9);
          }

          .step-time {
            color: rgba(255, 255, 255, 0.6);
          }
        }
      }

      &.is-current {
        .timeline-icon {
          animation: pulse 2s infinite;
        }
      }
    }
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
}
</style> 