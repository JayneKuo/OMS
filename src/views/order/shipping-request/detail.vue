<template>
  <div class="shipping-request-detail">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button link @click="router.back()">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <h1>{{ requestData?.requestNo || 'Loading...' }}</h1>
        <span v-if="requestData" :class="['status-badge', getStatusClass(requestData.status)]">
          {{ getStatusLabel(requestData.status) }}
        </span>
      </div>
      <div class="header-right">
        <el-dropdown trigger="click" @command="handleActionCommand">
          <el-button type="primary">
            Actions
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item 
                v-if="requestData?.status === StatusEnum.Allocated" 
                command="request_quote"
              >
                Request Carrier Quote
              </el-dropdown-item>
              <el-dropdown-item 
                v-if="requestData?.status === StatusEnum.PendingApproval" 
                command="approve"
              >
                Approve Request
              </el-dropdown-item>
              <el-dropdown-item 
                v-if="requestData?.status === StatusEnum.PendingApproval" 
                command="reject"
              >
                Reject Request
              </el-dropdown-item>
              <el-dropdown-item command="print_label">Print Shipping Label</el-dropdown-item>
              <el-dropdown-item command="update_status">Update Status</el-dropdown-item>
              <el-dropdown-item command="assign_carrier">Assign Carrier</el-dropdown-item>
              <el-dropdown-item command="add_tracking">Add Tracking Number</el-dropdown-item>
              <el-dropdown-item divided command="cancel">Cancel Request</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <el-scrollbar class="content-scrollbar">
      <div class="content-wrapper">
        <!-- 基础信息卡片 -->
        <el-card class="info-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">Basic Information</span>
            </div>
          </template>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Request No.</span>
              <span class="value">{{ requestData?.requestNo }}</span>
            </div>
            <div class="info-item">
              <span class="label">Status</span>
              <span class="value">
                <span :class="['status-tag', getStatusClass(requestData?.status)]">
                  {{ getStatusLabel(requestData?.status) }}
                </span>
              </span>
            </div>
            <div class="info-item">
              <span class="label">Order No.</span>
              <span class="value">
                <div v-if="requestData?.orderNos && requestData.orderNos.length > 0" class="order-nos-list">
                  <span v-for="(orderNo, idx) in requestData.orderNos" :key="idx" class="order-no-item">
                    {{ orderNo }}
                  </span>
                </div>
                <span v-else>-</span>
              </span>
            </div>
            <div class="info-item">
              <span class="label">DN No.</span>
              <span class="value">{{ requestData?.dnNo || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Channel</span>
              <span class="value">{{ requestData?.channel || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Channel Name</span>
              <span class="value">{{ requestData?.channelName || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Channel Sales Order No.</span>
              <span class="value">{{ requestData?.channelSalesOrderNo || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Reference No.</span>
              <span class="value">{{ requestData?.referenceNo || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Warehouse</span>
              <span class="value">{{ requestData?.warehouse }}</span>
            </div>
            <div class="info-item">
              <span class="label">Shipping Carrier</span>
              <span class="value">{{ requestData?.shippingCarrier || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Tracking Number</span>
              <span class="value tracking-number">
                {{ requestData?.trackingNumber || '-' }}
                <el-button v-if="requestData?.trackingNumber" link size="small" @click="copyTracking">
                  <el-icon><CopyDocument /></el-icon>
                </el-button>
              </span>
            </div>
            <div class="info-item">
              <span class="label">Created Date</span>
              <span class="value">{{ requestData?.createdDate }}</span>
            </div>
            <div class="info-item">
              <span class="label">Expected Ship Date</span>
              <span class="value">{{ requestData?.expectedShipDate }}</span>
            </div>
            <div class="info-item">
              <span class="label">Actual Ship Date</span>
              <span class="value">{{ requestData?.actualShipDate || '-' }}</span>
            </div>
            <div class="info-item full-width" v-if="requestData?.notes">
              <span class="label">Notes</span>
              <span class="value">{{ requestData?.notes }}</span>
            </div>
          </div>
        </el-card>

        <!-- Carrier 询价卡片 (仅在询价中和待审核状态显示) -->
        <el-card 
          v-if="requestData && [StatusEnum.CarrierQuoting, StatusEnum.PendingApproval].includes(requestData.status)" 
          class="info-card quotes-card" 
          shadow="never"
        >
          <template #header>
            <div class="card-header">
              <span class="card-title">Carrier Quotes</span>
              <el-button 
                v-if="requestData?.status === StatusEnum.CarrierQuoting" 
                type="primary" 
                size="small"
                @click="handleRefreshQuotes"
              >
                Refresh Quotes
              </el-button>
            </div>
          </template>
          <div class="quotes-list">
            <div 
              v-for="quote in requestData?.carrierQuotes" 
              :key="quote.id"
              class="quote-item"
              :class="{ selected: quote.selected }"
              @click="handleSelectQuote(quote)"
            >
              <div class="quote-header">
                <div class="quote-carrier">
                  <el-icon v-if="quote.selected" class="check-icon"><CircleCheck /></el-icon>
                  <span class="carrier-name">{{ quote.carrier }}</span>
                </div>
                <div class="quote-cost">${{ quote.estimatedCost.toFixed(2) }}</div>
              </div>
              <div class="quote-details">
                <span class="detail-item">Service: {{ quote.service }}</span>
                <span class="detail-item">Method: {{ quote.method }}</span>
                <span class="detail-item">Est. Days: {{ quote.estimatedDays }}</span>
              </div>
              <div class="quote-validity">
                Valid until: {{ quote.validUntil }}
              </div>
            </div>
          </div>
          <div v-if="requestData?.status === StatusEnum.CarrierQuoting" class="quote-actions">
            <el-button type="primary" :disabled="!hasSelectedQuote" @click="handleSubmitForApproval">
              Submit for Approval
            </el-button>
          </div>
        </el-card>

         <!-- 审核信息卡片 (仅在待审核状态或有审核记录时显示) -->
         <el-card 
           v-if="requestData?.approvalStatus || requestData?.status === StatusEnum.PendingApproval" 
           class="info-card approval-card" 
           shadow="never"
         >
          <template #header>
            <div class="card-header">
              <span class="card-title">Approval Information</span>
            </div>
          </template>
          <div v-if="requestData?.approvalStatus" class="info-grid">
            <div class="info-item">
              <span class="label">Approval Status</span>
              <span class="value">
                <el-tag 
                  :type="requestData.approvalStatus === 'approved' ? 'success' : requestData.approvalStatus === 'rejected' ? 'danger' : 'warning'"
                >
                  {{ requestData.approvalStatus?.toUpperCase() }}
                </el-tag>
              </span>
            </div>
            <div class="info-item" v-if="requestData.approvedBy">
              <span class="label">Approved By</span>
              <span class="value">{{ requestData.approvedBy }}</span>
            </div>
            <div class="info-item" v-if="requestData.approvedDate">
              <span class="label">Approved Date</span>
              <span class="value">{{ requestData.approvedDate }}</span>
            </div>
            <div class="info-item full-width" v-if="requestData.rejectionReason">
              <span class="label">Rejection Reason</span>
              <span class="value">{{ requestData.rejectionReason }}</span>
            </div>
          </div>
          <div v-else-if="requestData?.status === StatusEnum.PendingApproval" class="approval-pending-message">
            <el-alert 
              title="Pending Approval" 
              type="warning" 
              description="This shipping request is waiting for approval. Please review the carrier quote and approve or reject the request."
              :closable="false"
            />
          </div>
          <div v-if="requestData?.status === StatusEnum.PendingApproval" class="approval-actions">
            <el-button type="success" @click="handleApprove">Approve & Push to WMS</el-button>
            <el-button type="danger" @click="handleReject">Reject</el-button>
          </div>
        </el-card>

        <!-- 收件人信息卡片 -->
        <el-card class="info-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">Recipient Information</span>
            </div>
          </template>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Name</span>
              <span class="value">{{ requestData?.recipientName }}</span>
            </div>
            <div class="info-item">
              <span class="label">Phone</span>
              <span class="value">{{ requestData?.recipientPhone }}</span>
            </div>
            <div class="info-item full-width">
              <span class="label">Destination</span>
              <span class="value">{{ requestData?.destination }}</span>
            </div>
          </div>
        </el-card>

        <!-- Allocation Orders 卡片 -->
        <el-card class="info-card allocation-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                Allocation Orders ({{ allocationOrders.length }})
              </span>
              <el-button link size="small" @click="expandAll = !expandAll">
                {{ expandAll ? 'Collapse All' : 'Expand All' }}
              </el-button>
            </div>
          </template>

          <div class="allocation-orders-list">
            <div
              v-for="order in allocationOrders"
              :key="order.id"
              class="allocation-order-item"
            >
              <div class="order-header" @click="toggleOrder(order.id)">
                <div class="order-header-left">
                  <el-icon class="expand-icon" :class="{ expanded: expandedOrders.includes(order.id) }">
                    <ArrowRight />
                  </el-icon>
                  <span class="order-no">{{ order.orderNo }}</span>
                  <el-tag size="small" type="info">{{ order.status }}</el-tag>
                  <span class="original-order">
                    <el-icon><Link /></el-icon>
                    Original Order: {{ order.originalOrderNo }}
                  </span>
                </div>
                <div class="order-header-right">
                  <span class="item-count">{{ order.items.length }} items ({{ order.totalQuantity }} qty)</span>
                </div>
              </div>

              <el-collapse-transition>
                <div v-show="expandAll || expandedOrders.includes(order.id)" class="order-content">
                  <!-- 订单信息 -->
                  <div class="order-info-section">
                    <div class="info-row">
                      <div class="info-col">
                        <span class="info-label">Channel:</span>
                        <span class="info-value">{{ order.channel }}</span>
                      </div>
                      <div class="info-col">
                        <span class="info-label">Channel Name:</span>
                        <span class="info-value">{{ order.channelName }}</span>
                      </div>
                      <div class="info-col">
                        <span class="info-label">Allocated Date:</span>
                        <span class="info-value">{{ order.allocatedDate }}</span>
                      </div>
                    </div>
                    <div class="info-row">
                      <div class="info-col">
                        <span class="info-label">Warehouse:</span>
                        <span class="info-value">{{ order.warehouse }}</span>
                      </div>
                      <div class="info-col">
                        <span class="info-label">Shipping Method:</span>
                        <span class="info-value">{{ order.shippingMethod }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 商品列表 -->
                  <div class="items-section">
                    <div class="items-header">
                      <span>Items</span>
                    </div>
                    <el-table :data="order.items" class="items-table">
                      <el-table-column label="Product" min-width="200">
                        <template #default="{ row }">
                          <div class="product-cell">
                            <el-image
                              v-if="row.imageUrl"
                              :src="row.imageUrl"
                              fit="cover"
                              class="product-image"
                            >
                              <template #error>
                                <div class="image-placeholder">
                                  <el-icon><Picture /></el-icon>
                                </div>
                              </template>
                            </el-image>
                            <div class="product-info">
                              <div class="product-name">{{ row.productName }}</div>
                              <div class="product-sku">SKU: {{ row.sku }}</div>
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="quantity" label="Quantity" width="100" align="right" />
                      <el-table-column prop="allocatedQuantity" label="Allocated" width="100" align="right" />
                      <el-table-column prop="unitPrice" label="Unit Price" width="120" align="right">
                        <template #default="{ row }">
                          {{ formatCurrency(row.unitPrice) }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="totalPrice" label="Total" width="120" align="right">
                        <template #default="{ row }">
                          {{ formatCurrency(row.totalPrice) }}
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>

                  <!-- 收件人信息 -->
                  <div class="recipient-section">
                    <div class="section-title">Recipient Information</div>
                    <div class="recipient-info">
                      <div class="info-row">
                        <div class="info-col">
                          <span class="info-label">Name:</span>
                          <span class="info-value">{{ order.recipientName }}</span>
                        </div>
                        <div class="info-col">
                          <span class="info-label">Phone:</span>
                          <span class="info-value">{{ order.recipientPhone }}</span>
                        </div>
                        <div class="info-col">
                          <span class="info-label">Email:</span>
                          <span class="info-value">{{ order.recipientEmail }}</span>
                        </div>
                      </div>
                      <div class="info-row">
                        <div class="info-col full">
                          <span class="info-label">Address:</span>
                          <span class="info-value">
                            {{ order.recipientAddress }}, 
                            {{ order.recipientCity }}, 
                            {{ order.recipientState }} 
                            {{ order.recipientZip }}, 
                            {{ order.recipientCountry }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-collapse-transition>
            </div>
          </div>
        </el-card>

        <!-- 汇总信息卡片 -->
        <el-card class="info-card summary-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">Summary</span>
            </div>
          </template>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-label">Total Allocation Orders</div>
              <div class="summary-value">{{ allocationOrders.length }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Total Items</div>
              <div class="summary-value">{{ requestData?.totalItems }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Total Quantity</div>
              <div class="summary-value">{{ requestData?.totalQuantity }}</div>
            </div>
          </div>
        </el-card>
      </div>
    </el-scrollbar>

    <!-- 指定承运商对话框 -->
    <el-dialog
      v-model="showAssignCarrierDialog"
      title="Assign Carrier & Shipping Method"
      width="600px"
      destroy-on-close
    >
      <el-form :model="carrierForm" label-position="top">
        <el-form-item label="Carrier" required>
          <el-select
            v-model="carrierForm.carrier"
            placeholder="Select carrier"
            style="width: 100%"
          >
            <el-option label="FedEx" value="FedEx" />
            <el-option label="UPS" value="UPS" />
            <el-option label="USPS" value="USPS" />
            <el-option label="DHL" value="DHL" />
            <el-option label="SF Express" value="SF Express" />
            <el-option label="Canada Post" value="Canada Post" />
          </el-select>
        </el-form-item>

        <el-form-item label="Shipping Method" required>
          <el-select
            v-model="carrierForm.shippingMethod"
            placeholder="Select shipping method"
            style="width: 100%"
          >
            <el-option label="Ground" value="Ground" />
            <el-option label="Express" value="Express" />
            <el-option label="Overnight" value="Overnight" />
            <el-option label="2-Day" value="2-Day" />
            <el-option label="Standard" value="Standard" />
            <el-option label="Priority" value="Priority" />
          </el-select>
        </el-form-item>

        <el-form-item label="Shipping Service" required>
          <el-select
            v-model="carrierForm.shippingService"
            placeholder="Select shipping service"
            style="width: 100%"
          >
            <el-option label="Home Delivery" value="Home Delivery" />
            <el-option label="Business Delivery" value="Business Delivery" />
            <el-option label="Signature Required" value="Signature Required" />
            <el-option label="No Signature" value="No Signature" />
            <el-option label="Saturday Delivery" value="Saturday Delivery" />
          </el-select>
        </el-form-item>

        <el-form-item label="Notes">
          <el-input
            v-model="carrierForm.notes"
            type="textarea"
            :rows="3"
            placeholder="Enter any additional notes"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showAssignCarrierDialog = false">Cancel</el-button>
        <el-button type="primary" @click="handleSaveCarrier">Save</el-button>
      </template>
    </el-dialog>

    <!-- 拒绝原因对话框 -->
    <el-dialog
      v-model="showRejectDialog"
      title="Reject Request"
      width="500px"
      destroy-on-close
    >
      <el-form label-position="top">
        <el-form-item label="Rejection Reason" required>
          <el-input
            v-model="rejectionReason"
            type="textarea"
            :rows="4"
            placeholder="Please provide a reason for rejection"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showRejectDialog = false">Cancel</el-button>
        <el-button type="danger" @click="handleConfirmReject">Confirm Reject</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ArrowLeft,
  ArrowDown,
  ArrowRight,
  CopyDocument,
  Link,
  Picture,
  CircleCheck
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ShippingRequestItem, AllocationOrderDetail, ShippingRequestStatus, CarrierQuote } from './types'
import { ShippingRequestStatus as StatusEnum } from './types'

const router = useRouter()
const route = useRoute()

const requestData = ref<ShippingRequestItem | null>(null)
const allocationOrders = ref<AllocationOrderDetail[]>([])
const expandedOrders = ref<string[]>([])
const expandAll = ref(false)

// 对话框控制
const showAssignCarrierDialog = ref(false)
const showRejectDialog = ref(false)
const rejectionReason = ref('')

// 承运商表单
const carrierForm = ref({
  carrier: '',
  shippingMethod: '',
  shippingService: '',
  notes: ''
})

// 模拟数据
const mockRequestData: ShippingRequestItem = {
  id: '1',
  requestNo: 'SR-10001',
  status: StatusEnum.PendingApproval,
  allocationOrderCount: 3,
  allocationOrders: ['AO-20001', 'AO-20002', 'AO-20003'],
  orderNos: ['SO-30001', 'SO-30002', 'SO-30003'],
  dnNo: 'DN-40001',
  channel: 'Shopify',
  channelName: 'My Shopify Store',
  channelSalesOrderNo: 'CSO-50001',
  referenceNo: 'REF-60001',
  warehouse: 'Warehouse A',
  shippingCarrier: 'FedEx',
  trackingNumber: 'TN1234567890',
  totalItems: 8,
  totalQuantity: 25,
  createdDate: '10/28/2025 10:30 AM',
  expectedShipDate: '10/30/2025',
  actualShipDate: '',
  destination: 'Los Angeles, CA 90001',
  recipientName: 'John Doe',
  recipientPhone: '+1-555-1234',
  notes: 'Express shipping required. Handle with care.',
  updatedDate: '10/28/2025 03:45 PM',
  carrierQuotes: [
    {
      id: '1',
      carrier: 'FedEx',
      service: 'Ground',
      method: 'Standard',
      estimatedCost: 125.50,
      estimatedDays: 5,
      quoteDate: '10/28/2025',
      validUntil: '10/30/2025',
      selected: true
    },
    {
      id: '2',
      carrier: 'UPS',
      service: 'Ground',
      method: 'Standard',
      estimatedCost: 135.00,
      estimatedDays: 4,
      quoteDate: '10/28/2025',
      validUntil: '10/30/2025',
      selected: false
    },
    {
      id: '3',
      carrier: 'USPS',
      service: 'Priority Mail',
      method: 'Standard',
      estimatedCost: 95.00,
      estimatedDays: 7,
      quoteDate: '10/28/2025',
      validUntil: '10/30/2025',
      selected: false
    }
  ],
  selectedQuoteId: '1',
  approvalStatus: 'pending'
}

const mockAllocationOrders: AllocationOrderDetail[] = [
  {
    id: '1',
    orderNo: 'AO-20001',
    originalOrderNo: '#5001',
    status: 'Allocated',
    channel: 'Shopify',
    channelName: 'UNIS Store',
    totalQuantity: 10,
    allocatedDate: '10/27/2025 02:30 PM',
    warehouse: 'Warehouse A',
    shippingMethod: 'FedEx Ground',
    recipientName: 'John Doe',
    recipientAddress: '123 Main Street',
    recipientCity: 'Los Angeles',
    recipientState: 'CA',
    recipientZip: '90001',
    recipientCountry: 'United States',
    recipientPhone: '+1-555-1234',
    recipientEmail: 'john.doe@example.com',
    items: [
      {
        id: '1',
        sku: 'SKU-001',
        productName: 'Product Name 1',
        quantity: 5,
        allocatedQuantity: 5,
        unitPrice: 29.99,
        totalPrice: 149.95,
        imageUrl: ''
      },
      {
        id: '2',
        sku: 'SKU-002',
        productName: 'Product Name 2',
        quantity: 5,
        allocatedQuantity: 5,
        unitPrice: 39.99,
        totalPrice: 199.95,
        imageUrl: ''
      }
    ]
  },
  {
    id: '2',
    orderNo: 'AO-20002',
    originalOrderNo: '#5002',
    status: 'Allocated',
    channel: 'Amazon',
    channelName: 'Amazon US',
    totalQuantity: 8,
    allocatedDate: '10/27/2025 03:15 PM',
    warehouse: 'Warehouse A',
    shippingMethod: 'FedEx Ground',
    recipientName: 'John Doe',
    recipientAddress: '123 Main Street',
    recipientCity: 'Los Angeles',
    recipientState: 'CA',
    recipientZip: '90001',
    recipientCountry: 'United States',
    recipientPhone: '+1-555-1234',
    recipientEmail: 'john.doe@example.com',
    items: [
      {
        id: '3',
        sku: 'SKU-003',
        productName: 'Product Name 3',
        quantity: 3,
        allocatedQuantity: 3,
        unitPrice: 49.99,
        totalPrice: 149.97,
        imageUrl: ''
      },
      {
        id: '4',
        sku: 'SKU-004',
        productName: 'Product Name 4',
        quantity: 5,
        allocatedQuantity: 5,
        unitPrice: 19.99,
        totalPrice: 99.95,
        imageUrl: ''
      }
    ]
  },
  {
    id: '3',
    orderNo: 'AO-20003',
    originalOrderNo: '#5003',
    status: 'Allocated',
    channel: 'eBay',
    channelName: 'eBay Store',
    totalQuantity: 7,
    allocatedDate: '10/27/2025 04:00 PM',
    warehouse: 'Warehouse A',
    shippingMethod: 'FedEx Ground',
    recipientName: 'John Doe',
    recipientAddress: '123 Main Street',
    recipientCity: 'Los Angeles',
    recipientState: 'CA',
    recipientZip: '90001',
    recipientCountry: 'United States',
    recipientPhone: '+1-555-1234',
    recipientEmail: 'john.doe@example.com',
    items: [
      {
        id: '5',
        sku: 'SKU-005',
        productName: 'Product Name 5',
        quantity: 2,
        allocatedQuantity: 2,
        unitPrice: 59.99,
        totalPrice: 119.98,
        imageUrl: ''
      },
      {
        id: '6',
        sku: 'SKU-006',
        productName: 'Product Name 6',
        quantity: 5,
        allocatedQuantity: 5,
        unitPrice: 24.99,
        totalPrice: 124.95,
        imageUrl: ''
      }
    ]
  }
]

onMounted(() => {
  loadData()
})

const loadData = async () => {
  // TODO: 从API加载数据
  requestData.value = mockRequestData
  allocationOrders.value = mockAllocationOrders
}

const toggleOrder = (orderId: string) => {
  const index = expandedOrders.value.indexOf(orderId)
  if (index > -1) {
    expandedOrders.value.splice(index, 1)
  } else {
    expandedOrders.value.push(orderId)
  }
}

const hasSelectedQuote = computed(() => {
  return requestData.value?.carrierQuotes?.some(q => q.selected) || false
})

const handleSelectQuote = (quote: CarrierQuote) => {
  if (requestData.value && requestData.value.carrierQuotes) {
    requestData.value.carrierQuotes.forEach(q => {
      q.selected = q.id === quote.id
    })
    requestData.value.selectedQuoteId = quote.id
  }
}

const handleRefreshQuotes = async () => {
  ElMessage.info('Refreshing carrier quotes...')
  // TODO: 调用API刷新报价
}

const handleSubmitForApproval = async () => {
  if (!requestData.value) return
  
  try {
    // TODO: 调用API提交审核
    requestData.value.status = StatusEnum.PendingApproval
    requestData.value.approvalStatus = 'pending'
    ElMessage.success('Request submitted for approval')
  } catch (error) {
    ElMessage.error('Failed to submit for approval')
  }
}

const handleApprove = async () => {
  if (!requestData.value) return
  
  try {
    // TODO: 调用API审核通过并推送WMS
    requestData.value.status = StatusEnum.Allocated
    requestData.value.approvalStatus = 'approved'
    requestData.value.approvedBy = 'Current User'
    requestData.value.approvedDate = new Date().toLocaleString()
    
    ElMessage.success('Request approved and pushed to WMS, status changed to Allocated')
  } catch (error) {
    ElMessage.error('Failed to approve request')
  }
}

const handleReject = async () => {
  if (!requestData.value) return
  showRejectDialog.value = true
}

const handleActionCommand = (command: string) => {
  switch (command) {
    case 'request_quote':
      // TODO: 请求询价
      if (requestData.value) {
        requestData.value.status = StatusEnum.CarrierQuoting
      }
      ElMessage.info('Requesting carrier quotes...')
      break
    case 'approve':
      handleApprove()
      break
    case 'reject':
      handleReject()
      break
    case 'print_label':
      ElMessage.info('Printing shipping label...')
      break
    case 'update_status':
      ElMessage.info('Updating status...')
      break
    case 'assign_carrier':
      // 打开指定承运商对话框
      if (requestData.value) {
        carrierForm.value = {
          carrier: requestData.value.shippingCarrier || '',
          shippingMethod: '',
          shippingService: '',
          notes: ''
        }
      }
      showAssignCarrierDialog.value = true
      break
    case 'add_tracking':
      ElMessage.info('Adding tracking number...')
      break
    case 'cancel':
      ElMessage.warning('Cancelling request...')
      break
  }
}

const handleSaveCarrier = async () => {
  if (!carrierForm.value.carrier || !carrierForm.value.shippingMethod || !carrierForm.value.shippingService) {
    ElMessage.warning('Please fill in all required fields')
    return
  }

  try {
    // TODO: 调用API保存承运商信息
    if (requestData.value) {
      requestData.value.shippingCarrier = carrierForm.value.carrier
      // 可以添加 shippingMethod 和 shippingService 到 ShippingRequestItem 接口
    }
    
    ElMessage.success('Carrier information saved successfully')
    showAssignCarrierDialog.value = false
  } catch (error) {
    ElMessage.error('Failed to save carrier information')
  }
}

const handleConfirmReject = async () => {
  if (!rejectionReason.value.trim()) {
    ElMessage.warning('Please provide a rejection reason')
    return
  }

  if (!requestData.value) return

  try {
    // TODO: 调用API拒绝审核
    requestData.value.approvalStatus = 'rejected'
    requestData.value.rejectionReason = rejectionReason.value
    requestData.value.status = StatusEnum.CarrierQuoting // 退回到询价状态
    
    ElMessage.success('Request rejected')
    showRejectDialog.value = false
    rejectionReason.value = ''
  } catch (error) {
    ElMessage.error('Failed to reject request')
  }
}

const copyTracking = () => {
  if (requestData.value?.trackingNumber) {
    navigator.clipboard.writeText(requestData.value.trackingNumber)
    ElMessage.success('Tracking number copied to clipboard')
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const getStatusClass = (status?: ShippingRequestStatus) => {
  if (!status) return ''
  const statusMap: Record<string, string> = {
    // 前置状态
    [StatusEnum.Allocated]: 'status-allocated',
    [StatusEnum.CarrierQuoting]: 'status-carrier-quoting',
    [StatusEnum.PendingApproval]: 'status-pending-approval',
    
    // WMS 处理流程
    [StatusEnum.WarehouseReceived]: 'status-warehouse-received',
    [StatusEnum.Committed]: 'status-committed',
    [StatusEnum.Planning]: 'status-planning',
    [StatusEnum.Planned]: 'status-planned',
    [StatusEnum.Picking]: 'status-picking',
    [StatusEnum.Picked]: 'status-picked',
    [StatusEnum.Packing]: 'status-packing',
    [StatusEnum.Packed]: 'status-packed',
    [StatusEnum.Loading]: 'status-loading',
    [StatusEnum.Loaded]: 'status-loaded',
    
    // 发货状态
    [StatusEnum.PartialShip]: 'status-partial-ship',
    [StatusEnum.Shipped]: 'status-shipped',
    [StatusEnum.InTransit]: 'status-in-transit',
    [StatusEnum.Delivered]: 'status-delivered',
    
    // 异常状态
    [StatusEnum.Exception]: 'status-exception',
    [StatusEnum.Cancelled]: 'status-cancelled'
  }
  return statusMap[status] || ''
}

const getStatusLabel = (status?: ShippingRequestStatus) => {
  if (!status) return ''
  const labelMap: Record<string, string> = {
    // 前置状态
    [StatusEnum.Allocated]: 'Allocated',
    [StatusEnum.CarrierQuoting]: 'Carrier Quoting',
    [StatusEnum.PendingApproval]: 'Pending Approval',
    
    // WMS 处理流程
    [StatusEnum.WarehouseReceived]: 'Warehouse Received',
    [StatusEnum.Committed]: 'Committed',
    [StatusEnum.Planning]: 'Planning',
    [StatusEnum.Planned]: 'Planned',
    [StatusEnum.Picking]: 'Picking',
    [StatusEnum.Picked]: 'Picked',
    [StatusEnum.Packing]: 'Packing',
    [StatusEnum.Packed]: 'Packed',
    [StatusEnum.Loading]: 'Loading',
    [StatusEnum.Loaded]: 'Loaded',
    
    // 发货状态
    [StatusEnum.PartialShip]: 'Partial Ship',
    [StatusEnum.Shipped]: 'Shipped',
    [StatusEnum.InTransit]: 'In Transit',
    [StatusEnum.Delivered]: 'Delivered',
    
    // 异常状态
    [StatusEnum.Exception]: 'Exception',
    [StatusEnum.Cancelled]: 'Cancelled'
  }
  return labelMap[status] || status
}
</script>

<style lang="scss" scoped>
.shipping-request-detail {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1a1d21;
  color: #fff;
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
      
      h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 500;
        color: #fff;
      }
      
  .status-badge,
  .priority-badge {
    display: inline-flex;
    align-items: center;
    height: 28px;
    padding: 0 12px;
    border-radius: 14px;
    font-size: 13px;
    font-weight: 500;
  }
  
  .status-badge {
    &.status-allocated {
      background: rgba(24, 144, 255, 0.1);
      color: #1890ff;
    }

    &.status-carrier-quoting {
      background: rgba(250, 173, 20, 0.1);
      color: #faad14;
    }

    &.status-pending-approval {
      background: rgba(255, 171, 0, 0.1);
      color: #ffab00;
    }
    
    &.status-warehouse-received {
      background: rgba(24, 144, 255, 0.1);
      color: #1890ff;
    }
    
    &.status-picked {
      background: rgba(82, 196, 26, 0.1);
      color: #52c41a;
    }
    
    &.status-packed {
      background: rgba(82, 196, 26, 0.1);
      color: #52c41a;
    }

    &.status-loaded {
      background: rgba(82, 196, 26, 0.1);
      color: #52c41a;
    }
    
    &.status-shipped {
      background: rgba(0, 102, 255, 0.1);
      color: #0066ff;
    }

    &.status-partially-shipped {
      background: rgba(250, 173, 20, 0.1);
      color: #faad14;
    }

    &.status-short-shipped {
      background: rgba(250, 140, 22, 0.1);
      color: #fa8c16;
    }

    &.status-in-transit {
      background: rgba(0, 102, 255, 0.1);
      color: #0066ff;
    }
    
    &.status-delivered {
      background: rgba(82, 196, 26, 0.1);
      color: #52c41a;
    }
    
    &.status-exception {
      background: rgba(255, 77, 79, 0.1);
      color: #ff4d4f;
    }
    
    &.status-cancelled {
      background: rgba(140, 140, 140, 0.1);
      color: #8c8c8c;
    }
  }

    }
    
    .header-right {
      .el-button--primary {
        background: #0066ff;
        border-color: #0066ff;

        &:hover {
          background: #1a75ff;
          border-color: #1a75ff;
        }
      }
    }
  }

  .content-scrollbar {
    flex: 1;
    
    :deep(.el-scrollbar__view) {
      height: 100%;
    }
  }

  .content-wrapper {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .info-card {
    background: #1e2227;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;

    :deep(.el-card__header) {
      background: #1a1d21;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding: 16px 20px;
    }

    :deep(.el-card__body) {
      padding: 20px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .card-title {
        font-size: 16px;
        font-weight: 500;
        color: #fff;
      }
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px 24px;

      .info-item {
        display: flex;
        flex-direction: column;
        gap: 8px;

        &.full-width {
          grid-column: 1 / -1;
        }

        .label {
          font-size: 12px;
          color: #8b949e;
        }

        .value {
          font-size: 14px;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 8px;

          &.tracking-number {
            font-family: 'Roboto Mono', monospace;
          }
        }
      }
    }
  }

  .allocation-card {
    .allocation-orders-list {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .allocation-order-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        overflow: hidden;

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          cursor: pointer;
          transition: background 0.2s;

          &:hover {
            background: rgba(255, 255, 255, 0.04);
          }

          .order-header-left {
            display: flex;
            align-items: center;
            gap: 12px;

            .expand-icon {
              color: #8b949e;
              transition: transform 0.2s;
              font-size: 16px;

              &.expanded {
                transform: rotate(90deg);
              }
            }

            .order-no {
              font-size: 14px;
              font-weight: 500;
              color: #0066ff;
            }

            .original-order {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 13px;
              color: #8b949e;

              .el-icon {
                font-size: 14px;
              }
            }
          }

          .order-header-right {
            .item-count {
              font-size: 13px;
              color: #8b949e;
            }
          }
        }

        .order-content {
          padding: 16px;
          background: rgba(255, 255, 255, 0.01);

          .order-info-section {
            margin-bottom: 16px;

            .info-row {
              display: flex;
              gap: 24px;
              margin-bottom: 12px;

              &:last-child {
                margin-bottom: 0;
              }

              .info-col {
                flex: 1;
                display: flex;
                gap: 8px;

                .info-label {
                  font-size: 13px;
                  color: #8b949e;
                }

                .info-value {
                  font-size: 13px;
                  color: #fff;
                }
              }
            }
          }

          .items-section {
            margin-bottom: 16px;

            .items-header {
              font-size: 14px;
              font-weight: 500;
              color: #fff;
              margin-bottom: 12px;
            }

            .items-table {
              :deep(.el-table) {
                background: transparent;

                th {
                  background: rgba(255, 255, 255, 0.02);
                  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                  color: #8b949e;
                }

                td {
                  background: transparent;
                  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                  color: #fff;
                }

                tr:hover > td {
                  background: rgba(255, 255, 255, 0.02) !important;
                }
              }

              .product-cell {
                display: flex;
                align-items: center;
                gap: 12px;

                .product-image {
                  width: 48px;
                  height: 48px;
                  border-radius: 4px;
                  overflow: hidden;

                  .image-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.05);
                    color: #8b949e;
                  }
                }

                .product-info {
                  flex: 1;

                  .product-name {
                    font-size: 14px;
                    color: #fff;
                    margin-bottom: 4px;
                  }

                  .product-sku {
                    font-size: 12px;
                    color: #8b949e;
                  }
                }
              }
            }
          }

          .recipient-section {
            .section-title {
              font-size: 14px;
              font-weight: 500;
              color: #fff;
              margin-bottom: 12px;
            }

            .recipient-info {
              .info-row {
                display: flex;
                gap: 24px;
                margin-bottom: 12px;

                &:last-child {
                  margin-bottom: 0;
                }

                .info-col {
                  flex: 1;
                  display: flex;
                  gap: 8px;

                  &.full {
                    flex: 1 1 100%;
                  }

                  .info-label {
                    font-size: 13px;
                    color: #8b949e;
                  }

                  .info-value {
                    font-size: 13px;
                    color: #fff;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .quotes-card {
    .quotes-list {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .quote-item {
        padding: 16px;
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.02);
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          border-color: rgba(0, 102, 255, 0.3);
          background: rgba(255, 255, 255, 0.04);
        }

        &.selected {
          border-color: #0066ff;
          background: rgba(0, 102, 255, 0.05);

          .quote-carrier {
            color: #0066ff;
          }
        }

        .quote-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;

          .quote-carrier {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 16px;
            font-weight: 500;

            .check-icon {
              color: #0066ff;
              font-size: 20px;
            }

            .carrier-name {
              color: #fff;
            }
          }

          .quote-cost {
            font-size: 18px;
            font-weight: 600;
            color: #52c41a;
          }
        }

        .quote-details {
          display: flex;
          gap: 16px;
          margin-bottom: 8px;

          .detail-item {
            font-size: 13px;
            color: #8b949e;
          }
        }

        .quote-validity {
          font-size: 12px;
          color: #8b949e;
        }
      }
    }

    .quote-actions {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
  }

  .approval-card {
    .approval-pending-message {
      margin-bottom: 16px;
    }

    .approval-actions {
      margin-top: 16px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
  }

  .summary-card {
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;

      .summary-item {
        text-align: center;
        padding: 16px;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 8px;

        .summary-label {
          font-size: 13px;
          color: #8b949e;
          margin-bottom: 8px;
        }

        .summary-value {
          font-size: 24px;
          font-weight: 600;
          color: #0066ff;
        }
      }
    }
  }

  .status-tag,
  .priority-tag {
    display: inline-flex;
    align-items: center;
    height: 24px;
    padding: 0 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }

  .status-tag {
    &.status-allocated {
      background: rgba(24, 144, 255, 0.1);
      color: #1890ff;
    }

    &.status-carrier-quoting {
      background: rgba(250, 173, 20, 0.1);
      color: #faad14;
    }

    &.status-pending-approval {
      background: rgba(255, 171, 0, 0.1);
      color: #ffab00;
    }
    
    &.status-warehouse-received {
      background: rgba(24, 144, 255, 0.1);
      color: #1890ff;
    }
    
    &.status-picked {
      background: rgba(82, 196, 26, 0.1);
      color: #52c41a;
    }
    
    &.status-packed {
      background: rgba(82, 196, 26, 0.1);
      color: #52c41a;
    }

    &.status-loaded {
      background: rgba(82, 196, 26, 0.1);
      color: #52c41a;
    }
    
    &.status-shipped {
      background: rgba(0, 102, 255, 0.1);
      color: #0066ff;
    }

    &.status-partially-shipped {
      background: rgba(250, 173, 20, 0.1);
      color: #faad14;
    }

    &.status-short-shipped {
      background: rgba(250, 140, 22, 0.1);
      color: #fa8c16;
    }

    &.status-in-transit {
      background: rgba(0, 102, 255, 0.1);
      color: #0066ff;
    }
    
    &.status-delivered {
      background: rgba(82, 196, 26, 0.1);
      color: #52c41a;
    }
    
    &.status-exception {
      background: rgba(255, 77, 79, 0.1);
      color: #ff4d4f;
    }
    
    &.status-cancelled {
      background: rgba(140, 140, 140, 0.1);
      color: #8c8c8c;
    }
  }

  .order-nos-list {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .order-no-item {
      font-size: 13px;
      color: #8b949e;
      line-height: 1.4;
    }
  }
}

:deep(.el-dropdown-menu) {
  background: #1a1d21;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px;

  .el-dropdown-menu__item {
    color: #8b949e;
    font-size: 13px;
    padding: 8px 16px;
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
    }
  }
}
</style>

