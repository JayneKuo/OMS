<template>
  <div class="return-order-create">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="140px"
      class="return-form"
    >
      <!-- Basic Information -->
      <el-card class="form-card">
        <template #header>
          <div class="card-header">
            <span>Basic Information</span>
          </div>
        </template>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Sales Order" prop="originalOrderNo">
              <el-select
                v-model="formData.originalOrderNo"
                placeholder="Search order by number"
                filterable
                remote
                :remote-method="searchOrders"
                :loading="loading"
                class="w-full"
                @change="handleOrderSelect"
              >
                <el-option
                  v-for="order in orderOptions"
                  :key="order.value"
                  :label="order.label"
                  :value="order.value"
                >
                  <div class="order-option">
                    <div class="order-no">{{ order.value }}</div>
                    <div class="order-info">
                      <span>{{ order.customerName }}</span>
                      <span>{{ order.channelOrderNo }}</span>
                    </div>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Return Type" prop="returnType">
              <el-select
                v-model="formData.returnType"
                placeholder="Select return type"
                clearable
                class="w-full"
              >
                <el-option
                  v-for="type in returnTypeOptions"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Return Reason" prop="reason">
              <el-select
                v-model="formData.reason"
                placeholder="Select reason"
                clearable
                class="w-full"
              >
                <el-option
                  v-for="reason in returnReasonOptions"
                  :key="reason.value"
                  :label="reason.label"
                  :value="reason.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Channel" prop="channel.type">
              <el-select
                v-model="formData.channel.type"
                placeholder="Select channel"
                clearable
                class="w-full"
                disabled
              >
                <el-option
                  v-for="channel in channelOptions"
                  :key="channel.value"
                  :label="channel.label"
                  :value="channel.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Store" prop="channel.storeName">
              <el-input
                v-model="formData.channel.storeName"
                placeholder="Store name"
                clearable
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Channel Order No." prop="channel.platformOrderNo">
              <el-input
                v-model="formData.channel.platformOrderNo"
                placeholder="Channel order number"
                clearable
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Warehouse" prop="facilityId">
              <el-select
                v-model="formData.facilityId"
                placeholder="Select warehouse"
                clearable
                class="w-full"
              >
                <el-option
                  v-for="facility in facilityOptions"
                  :key="facility.value"
                  :label="facility.label"
                  :value="facility.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Reference" prop="reference">
              <el-input
                v-model="formData.reference"
                placeholder="Enter reference number"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Original PO" prop="originalPO">
              <el-input
                v-model="formData.originalPO"
                placeholder="Enter original PO"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Original SO" prop="originalSO">
              <el-input
                v-model="formData.originalSO"
                placeholder="Enter original SO"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="WMS SN" prop="wmsSN">
              <el-input
                v-model="formData.wmsSN"
                placeholder="Enter WMS SN"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Source" prop="source">
              <el-select
                v-model="formData.source"
                placeholder="Select source"
                clearable
                class="w-full"
              >
                <el-option
                  v-for="source in sourceOptions"
                  :key="source.value"
                  :label="source.label"
                  :value="source.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- Customer Information -->
      <el-card class="form-card">
        <template #header>
          <div class="card-header">
            <span>Customer Information</span>
          </div>
        </template>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="First Name" prop="firstName">
              <el-input
                v-model="formData.firstName"
                placeholder="First name"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Last Name" prop="lastName">
              <el-input
                v-model="formData.lastName"
                placeholder="Last name"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Email" prop="customerEmail">
              <el-input
                v-model="formData.customerEmail"
                placeholder="Email address"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Phone" prop="customerPhone">
              <el-input
                v-model="formData.customerPhone"
                placeholder="Phone number"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="Street Address" prop="streetAddress">
              <el-input
                v-model="formData.streetAddress"
                placeholder="Street address"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="City" prop="city">
              <el-input
                v-model="formData.city"
                placeholder="City"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="State" prop="state">
              <el-select
                v-model="formData.state"
                placeholder="Select state"
                clearable
                class="w-full"
              >
                <el-option
                  v-for="state in stateOptions"
                  :key="state.value"
                  :label="state.label"
                  :value="state.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="ZIP Code" prop="zipCode">
              <el-input
                v-model="formData.zipCode"
                placeholder="ZIP code"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- Return Items -->
      <el-card class="form-card">
        <template #header>
          <div class="card-header">
            <span>Return Items</span>
          </div>
        </template>
        
        <el-table :data="formData.items" border stripe>
          <el-table-column type="index" width="50" label="#" />
          <el-table-column prop="productId" label="Product ID" min-width="120">
            <template #default="{ row }">
              {{ row.productId }}
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="Product Name" min-width="200">
            <template #default="{ row }">
              {{ row.productName }}
            </template>
          </el-table-column>
          <el-table-column prop="sku" label="SKU" min-width="150">
            <template #default="{ row }">
              {{ row.sku }}
            </template>
          </el-table-column>
          <el-table-column prop="originalQty" label="Original Qty" width="120">
            <template #default="{ row }">
              <el-tooltip
                :content="`Maximum return quantity: ${row.originalQty}`"
                placement="top"
              >
                <span>{{ row.originalQty }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="Return Qty" width="150">
            <template #default="{ $index }">
              <el-form-item
                :prop="'items.' + $index + '.quantity'"
                :rules="rules.quantity"
                class="mb-0"
              >
                <el-tooltip
                  :content="`Enter quantity (1-${formData.items[$index].originalQty})`"
                  placement="top"
                >
                  <el-input-number
                    v-model="formData.items[$index].quantity"
                    :min="1"
                    :max="formData.items[$index].originalQty"
                    :precision="0"
                    controls-position="right"
                    class="w-full"
                    @change="validateReturnQuantity($index)"
                  />
                </el-tooltip>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="Return Reason" min-width="150">
            <template #default="{ $index }">
              <el-form-item
                :prop="'items.' + $index + '.reason'"
                :rules="rules.itemReason"
                class="mb-0"
              >
                <el-select
                  v-model="formData.items[$index].reason"
                  placeholder="Select reason"
                  clearable
                  class="w-full"
                >
                  <el-option
                    v-for="reason in returnReasonOptions"
                    :key="reason.value"
                    :label="reason.label"
                    :value="reason.value"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="condition" label="Condition" min-width="150">
            <template #default="{ $index }">
              <el-form-item
                :prop="'items.' + $index + '.condition'"
                :rules="rules.condition"
                class="mb-0"
              >
                <el-select
                  v-model="formData.items[$index].condition"
                  placeholder="Select condition"
                  clearable
                  class="w-full"
                >
                  <el-option
                    v-for="condition in conditionOptions"
                    :key="condition.value"
                    :label="condition.label"
                    :value="condition.value"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="notes" label="Notes" min-width="200">
            <template #default="{ $index }">
              <el-form-item
                :prop="'items.' + $index + '.notes'"
                class="mb-0"
              >
                <el-input
                  v-model="formData.items[$index].notes"
                  placeholder="Add notes"
                  clearable
                />
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- Shipment Information -->
      <el-card class="form-card">
        <template #header>
          <div class="card-header">
            <span>Shipment Information</span>
            <el-button type="primary" plain size="small" @click="addShipment">
              <el-icon><Plus /></el-icon> Add Shipment
            </el-button>
          </div>
        </template>
        
        <div v-for="(shipment, index) in formData.shipments" :key="index" class="shipment-item">
          <div class="shipment-header">
            <h4>Shipment #{{ index + 1 }}</h4>
            <el-button type="danger" plain size="small" @click="removeShipment(index)" :disabled="index === 0">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item :label="'Ship Method'" :prop="`shipments.${index}.shipMethod`">
                <el-select
                  v-model="shipment.shipMethod"
                  placeholder="Select shipping method"
                  clearable
                  class="w-full"
                >
                  <el-option
                    v-for="method in shipMethodOptions"
                    :key="method.value"
                    :label="method.label"
                    :value="method.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="'Carrier'" :prop="`shipments.${index}.carrier`">
                <el-input
                  v-model="shipment.carrier"
                  placeholder="Enter carrier"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="'Tracking Number'" :prop="`shipments.${index}.trackingNumber`">
                <el-input
                  v-model="shipment.trackingNumber"
                  placeholder="Enter tracking number"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item :label="'BOL'" :prop="`shipments.${index}.bol`">
                <el-input
                  v-model="shipment.bol"
                  placeholder="Enter BOL"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="'ETA'" :prop="`shipments.${index}.eta`">
                <el-date-picker
                  v-model="shipment.eta"
                  type="date"
                  placeholder="Select ETA"
                  format="MM/DD/YYYY"
                  value-format="MM/DD/YYYY"
                  class="w-full"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item :label="'Return Items'" :prop="`shipments.${index}.items`">
            <el-checkbox-group v-model="shipment.items">
              <el-checkbox 
                v-for="item in formData.items" 
                :key="item.id" 
                :label="item.id"
                :disabled="isItemAssignedToOtherShipment(item.id, index)"
              >
                {{ item.productName }} ({{ item.sku }})
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </el-card>

      <!-- Form Actions -->
      <div class="form-actions">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit">Submit</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import {
  ReturnType,
  ReturnStatus,
  ReturnReason,
  ReturnItemStatus,
  ShipMethod,
  Source,
  ChannelType,
  type ReturnOrder,
  type ReturnItem,
  type Channel,
  type ReturnHistory,
  type Shipment
} from './types'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const orderOptions = ref<{ value: string; label: string; customerName: string; channelOrderNo: string }[]>([])

interface CreateReturnOrderForm extends Omit<ReturnOrder, 'returnOrderNo' | 'createdAt' | 'updatedAt'> {
  returnOrderNo?: string;
  shipments: Shipment[];
}

interface Shipment {
  shipMethod?: ShipMethod;
  carrier: string;
  trackingNumber: string;
  bol: string;
  eta: string;
  items: string[]; // Array of item IDs
}

// Form data
const formData = reactive<CreateReturnOrderForm>({
  returnOrderNo: '',
  originalOrderNo: '',
  status: ReturnStatus.Initiated,
  returnType: undefined,
  reason: undefined,
  reference: '',
  channel: {
    type: undefined,
    storeName: '',
    storeId: '',
    platformOrderNo: '',
    accountId: ''
  },
  firstName: '',
  lastName: '',
  customerEmail: '',
  customerPhone: '',
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  items: [],
  facilityId: '',
  gracePeriod: 45,
  shipMethod: undefined,
  shipments: [
    {
      shipMethod: undefined,
      carrier: '',
      trackingNumber: '',
      bol: '',
      eta: '',
      items: []
    }
  ],
  originalPO: '',
  originalSO: '',
  wmsSN: '',
  source: undefined,
})

// Options
const returnTypeOptions = [
  { label: 'Refund', value: ReturnType.Refund },
  { label: 'Exchange', value: ReturnType.Exchange }
]

const returnReasonOptions = [
  { label: 'Quality Issue', value: ReturnReason.QualityIssue },
  { label: 'Wrong Size', value: ReturnReason.WrongSize },
  { label: 'Wrong Item', value: ReturnReason.WrongItem },
  { label: 'Defective', value: ReturnReason.Defective },
  { label: 'Not As Described', value: ReturnReason.NotAsDescribed },
  { label: 'Better Price', value: ReturnReason.BetterPrice },
  { label: 'Other', value: ReturnReason.Other }
]

const channelOptions = [
  { label: 'Amazon', value: ChannelType.AMAZON },
  { label: 'eBay', value: ChannelType.EBAY },
  { label: 'Walmart', value: ChannelType.WALMART },
  { label: 'Shopify', value: ChannelType.SHOPIFY }
]

const conditionOptions = [
  { label: 'New - Sealed', value: 'New Sealed' },
  { label: 'New with Tags', value: 'New with Tags' },
  { label: 'New without Tags', value: 'New without Tags' },
  { label: 'Used - Like New', value: 'Used - Like New' },
  { label: 'Used - Very Good', value: 'Used - Very Good' },
  { label: 'Used - Good', value: 'Used - Good' },
  { label: 'Used - Acceptable', value: 'Used - Acceptable' },
  { label: 'Damaged', value: 'Damaged' }
]

const facilityOptions = [
  { label: 'New York Warehouse', value: 'WH-NY-001' },
  { label: 'Los Angeles Warehouse', value: 'WH-LA-001' },
  { label: 'Chicago Warehouse', value: 'WH-CH-001' },
  { label: 'Miami Warehouse', value: 'WH-MI-001' }
]

const stateOptions = [
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'Delaware', value: 'DE' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Michigan', value: 'MI' },
  { label: 'Minnesota', value: 'MN' },
  { label: 'Mississippi', value: 'MS' },
  { label: 'Missouri', value: 'MO' },
  { label: 'Montana', value: 'MT' },
  { label: 'Nebraska', value: 'NE' },
  { label: 'Nevada', value: 'NV' },
  { label: 'New Hampshire', value: 'NH' },
  { label: 'New Jersey', value: 'NJ' },
  { label: 'New Mexico', value: 'NM' },
  { label: 'New York', value: 'NY' },
  { label: 'North Carolina', value: 'NC' },
  { label: 'North Dakota', value: 'ND' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'Utah', value: 'UT' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Washington', value: 'WA' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'Wyoming', value: 'WY' }
]

// Options data
const shipMethodOptions = [
  { label: 'USPS Parcel', value: ShipMethod.USPSParcel },
  { label: 'FedEx/UPS/LTL', value: ShipMethod.FedExUPSLTL },
  { label: 'Customer Drop-off', value: ShipMethod.CustomerDropOff },
  { label: 'Unknown', value: ShipMethod.Unknown }
]

const sourceOptions = [
  { label: 'WMS', value: Source.WMS },
  { label: 'Client Portal', value: Source.ClientPortal },
  { label: 'Voice ASR', value: Source.VoiceASR },
  { label: 'Web Service Inquiry', value: Source.WebServiceInquiry },
  { label: 'Manual Create', value: Source.ManualCreate },
  { label: 'System Log', value: Source.SystemLog }
]

// Validation functions
const validateQuantity = (rule: any, value: number, callback: Function) => {
  const index = parseInt(rule.field.match(/\d+/)[0])
  const item = formData.items[index]
  if (value > item.originalQty) {
    callback(new Error(`Cannot exceed original quantity (${item.originalQty})`))
  } else {
    callback()
  }
}

const validateReturnQuantity = (index: number) => {
  const item = formData.items[index]
  if (item.quantity > item.originalQty) {
    item.quantity = item.originalQty
    ElMessage.warning(`Return quantity cannot exceed original quantity (${item.originalQty})`)
  } else if (item.quantity < 1) {
    item.quantity = 1
    ElMessage.warning('Return quantity must be at least 1')
  }
}

// Form validation rules
const rules = {
  originalOrderNo: [
    { required: true, message: 'Please select sales order', trigger: 'change' }
  ],
  returnType: [
    { required: true, message: 'Please select return type', trigger: 'change' }
  ],
  reason: [
    { required: true, message: 'Please select return reason', trigger: 'change' }
  ],
  'channel.type': [
    { required: true, message: 'Please select channel', trigger: 'change' }
  ],
  firstName: [
    { required: true, message: 'Please enter first name', trigger: 'blur' }
  ],
  lastName: [
    { required: true, message: 'Please enter last name', trigger: 'blur' }
  ],
  customerEmail: [
    { required: true, message: 'Please enter email address', trigger: 'blur' },
    { type: 'email', message: 'Please enter valid email address', trigger: 'blur' }
  ],
  customerPhone: [
    { required: true, message: 'Please enter phone number', trigger: 'blur' }
  ],
  streetAddress: [
    { required: true, message: 'Please enter street address', trigger: 'blur' }
  ],
  city: [
    { required: true, message: 'Please enter city', trigger: 'blur' }
  ],
  state: [
    { required: true, message: 'Please select state', trigger: 'change' }
  ],
  zipCode: [
    { required: true, message: 'Please enter ZIP code', trigger: 'blur' },
    { pattern: /^\d{5}(-\d{4})?$/, message: 'Please enter valid ZIP code', trigger: 'blur' }
  ],
  facilityId: [
    { required: true, message: 'Please select warehouse', trigger: 'change' }
  ],
  quantity: [
    { required: true, message: 'Please enter quantity', trigger: 'blur' },
    { type: 'number', min: 1, message: 'Quantity must be at least 1', trigger: 'blur' },
    { validator: validateQuantity, trigger: 'blur' }
  ],
  itemReason: [
    { required: true, message: 'Please select return reason', trigger: 'change' }
  ],
  condition: [
    { required: true, message: 'Please select condition', trigger: 'change' }
  ]
}

// Mock data for testing
const mockOrders = [
  {
    orderNo: 'SO-20240315-001',
    customerName: 'John Smith',
    channelOrderNo: 'AMZ-12345',
    channel: {
      type: ChannelType.AMAZON,
      storeName: 'US Main Store',
      storeId: 'ST001',
      platformOrderNo: 'AMZ-12345',
      accountId: 'ACC001'
    },
    firstName: 'John',
    lastName: 'Smith',
    customerEmail: 'john.smith@example.com',
    customerPhone: '(555) 123-4567',
    streetAddress: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    facilityId: 'WH-NY-001',
    items: [
      {
        id: 'ITEM001',
        productId: 'P001',
        productName: 'Nike Air Max 2024',
        sku: 'NK-AM24-001',
        quantity: 2,
        originalPrice: 199.99,
        refundPrice: 199.99,
        status: ReturnItemStatus.Pending
      },
      {
        id: 'ITEM002',
        productId: 'P002',
        productName: 'Adidas Ultra Boost',
        sku: 'AD-UB24-001',
        quantity: 1,
        originalPrice: 179.99,
        refundPrice: 179.99,
        status: ReturnItemStatus.Pending
      }
    ]
  },
  {
    orderNo: 'SO-20240315-002',
    customerName: 'Sarah Johnson',
    channelOrderNo: 'WMT-67890',
    channel: {
      type: ChannelType.WALMART,
      storeName: 'Walmart Online',
      storeId: 'ST002',
      platformOrderNo: 'WMT-67890',
      accountId: 'ACC002'
    },
    firstName: 'Sarah',
    lastName: 'Johnson',
    customerEmail: 'sarah.j@example.com',
    customerPhone: '(555) 987-6543',
    streetAddress: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    facilityId: 'WH-LA-001',
    items: [
      {
        id: 'ITEM003',
        productId: 'P003',
        productName: 'Apple AirPods Pro',
        sku: 'AP-APP-001',
        quantity: 1,
        originalPrice: 249.99,
        refundPrice: 249.99,
        status: ReturnItemStatus.Pending
      }
    ]
  }
]

// Search orders with mock data
const searchOrders = async (query: string) => {
  if (query.length < 3) return
  
  loading.value = true
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const filteredOrders = mockOrders.filter(order => 
      order.orderNo.toLowerCase().includes(query.toLowerCase()) ||
      order.channelOrderNo.toLowerCase().includes(query.toLowerCase())
    )
    
    orderOptions.value = filteredOrders.map(order => ({
      value: order.orderNo,
      label: `${order.orderNo} - ${order.firstName} ${order.lastName}`,
      customerName: `${order.firstName} ${order.lastName}`,
      channelOrderNo: order.channelOrderNo
    }))
  } catch (error) {
    console.error('Failed to search orders:', error)
    ElMessage.error('Failed to search orders')
  } finally {
    loading.value = false
  }
}

// Handle order selection with mock data
const handleOrderSelect = async (orderNo: string) => {
  if (!orderNo) return
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const order = mockOrders.find(o => o.orderNo === orderNo)
    if (!order) {
      throw new Error('Order not found')
    }
    
    // Fill form data with order information
    formData.channel = order.channel
    formData.firstName = order.firstName
    formData.lastName = order.lastName
    formData.customerEmail = order.customerEmail
    formData.customerPhone = order.customerPhone
    formData.streetAddress = order.streetAddress
    formData.city = order.city
    formData.state = order.state
    formData.zipCode = order.zipCode
    formData.facilityId = order.facilityId
    
    // Fill items with order items
    formData.items = order.items.map(item => {
      const returnItem: ReturnItem = {
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        quantity: 1,
        originalQty: item.quantity,
        originalPrice: item.originalPrice,
        refundPrice: item.refundPrice,
        reason: ReturnReason.Other,
        condition: 'New Sealed',
        status: ReturnItemStatus.Pending,
        notes: '',
        images: []
      }
      return returnItem
    })
  } catch (error) {
    console.error('Failed to get order details:', error)
    ElMessage.error('Failed to get order details')
  }
}

// Submit form
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    // TODO: Call API to create return order
    ElMessage.success('Return order created successfully')
    router.push('/return')
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}

// Cancel creation
const handleCancel = () => {
  router.back()
}

// Shipment management functions
const addShipment = () => {
  formData.shipments.push({
    shipMethod: undefined,
    carrier: '',
    trackingNumber: '',
    bol: '',
    eta: '',
    items: []
  })
}

const removeShipment = (index: number) => {
  formData.shipments.splice(index, 1)
}

const isItemAssignedToOtherShipment = (itemId: string, currentShipmentIndex: number) => {
  return formData.shipments.some((shipment, index) => 
    index !== currentShipmentIndex && shipment.items.includes(itemId)
  )
}
</script>

<style lang="scss" scoped>
.return-order-create {
  padding: 20px;
  
  .form-card {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 40px;
  }
  
  :deep(.el-form-item) {
    margin-bottom: 18px;
    
    &.mb-0 {
      margin-bottom: 0;
    }
  }
  
  :deep(.w-full) {
    width: 100%;
  }
  
  .order-option {
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    .order-no {
      font-weight: 500;
    }
    
    .order-info {
      display: flex;
      gap: 8px;
      font-size: 12px;
      color: var(--el-text-color-secondary);
      
      span {
        &:not(:last-child)::after {
          content: '|';
          margin-left: 8px;
          color: var(--el-border-color);
        }
      }
    }
  }

  .shipment-item {
    border: 1px solid var(--el-border-color-light);
    border-radius: 4px;
    padding: 20px;
    margin-bottom: 20px;

    .shipment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h4 {
        margin: 0;
        color: var(--el-text-color-primary);
      }
    }
  }
}
</style> 