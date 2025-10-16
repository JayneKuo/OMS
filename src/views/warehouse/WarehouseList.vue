<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <h1>Warehouse List</h1>
        <p class="subtitle">Manage warehouses and their WMS version assignments</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus" @click="showAddWarehouse">Add Warehouse</el-button>
        <el-button 
          type="primary" 
          plain 
          :icon="Setting"
          @click="showBatchConfig">
          Batch Configure
        </el-button>
        <el-button type="default" :icon="Refresh" @click="refreshData">Refresh</el-button>
        <el-button 
          type="danger" 
          plain 
          :icon="Delete"
          @click="showDeleteWarehouse"
          :disabled="!canDeleteWarehouses">
          Delete Selected
        </el-button>
      </div>
    </div>

    <el-table 
      :data="warehouseList" 
      style="width: 100%"
      border
      stripe
      row-key="rank"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName">
      <el-table-column type="selection" width="50" />
      <el-table-column width="50">
        <template #default>
          <el-icon class="drag-handle"><Operation /></el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="rank" label="RANK" width="80" align="center">
        <template #default="{ row }">
          <span class="rank-number">{{ row.rank }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="warehouse" label="WAREHOUSE" width="150" />
      <el-table-column prop="accountingCode" label="ACCOUNTING CODE" width="180" />
      <el-table-column prop="city" label="CITY" width="120" />
      <el-table-column prop="state" label="STATE" width="100" />
      <el-table-column prop="country" label="COUNTRY" width="120" />
      <el-table-column prop="address1" label="ADDRESS 1" min-width="200" />
      <el-table-column prop="zipCode" label="ZIP CODE" width="120" />
      <el-table-column prop="contactName" label="CONTACT NAME" width="150" />
      <el-table-column prop="contactEmail" label="CONTACT EMAIL" width="180" />
      <el-table-column prop="contactPhone" label="CONTACT PHONE" width="150" />
       <el-table-column prop="wms" label="WMS" width="150">
         <template #default="{ row }">
           <div class="wms-cell">
             <el-select 
               v-model="row.wmsVersion" 
               placeholder="Select WMS Version"
               :disabled="row.loading"
               @change="handleWmsChange(row)">
               <el-option 
                 v-for="version in getAvailableWmsVersions(row)"
                 :key="version.value === null ? 'unassigned' : version.value"
                 :label="version.label"
                 :value="version.value"
                 :disabled="version.disabled"
               />
             </el-select>
           </div>
         </template>
       </el-table-column>
      <el-table-column label="ORDER FULFILLMENT" width="150" align="center">
        <template #default="{ row }">
          <el-tooltip
            :content="!row.wmsVersion ? 'Please specify WMS version first' : ''"
            placement="top"
            :disabled="!!row.wmsVersion"
          >
            <div>
              <el-switch
                v-model="row.enableFulfillment"
                @change="handleFulfillmentChange(row)"
                :loading="row.loading"
                :disabled="!row.wmsVersion"
                :model-value="row.wmsVersion ? row.enableFulfillment : false"
              />
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="INVENTORY SYNC" width="150" align="center">
        <template #default="{ row }">
          <el-tooltip
            :content="!row.wmsVersion ? 'Please specify WMS version first' : ''"
            placement="top"
            :disabled="!!row.wmsVersion"
          >
            <div>
              <el-switch
                v-model="row.enableInventorySync"
                @change="handleInventorySyncChange(row)"
                :loading="row.loading"
                :disabled="!row.wmsVersion"
                :model-value="row.wmsVersion ? row.enableInventorySync : false"
              />
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- Add Warehouse Dialog -->
    <el-dialog
      v-model="addWarehouseVisible"
      title="Add Warehouse"
      width="800px"
      :close-on-click-modal="false">
      <div class="add-warehouse-content">
        <!-- Warehouse Type Selection -->
        <div class="warehouse-type-selection">
          <el-radio-group v-model="addWarehouseForm.type" @change="handleWarehouseTypeChange">
            <el-radio-button value="local">Local Warehouse</el-radio-button>
            <el-radio-button value="integration">Integration</el-radio-button>
          </el-radio-group>
        </div>

        <!-- Local Warehouse Form -->
        <div v-if="addWarehouseForm.type === 'local'" class="warehouse-form">
          <h4>Local Warehouse Information</h4>
          <el-form 
            ref="localFormRef"
            :model="addWarehouseForm.local" 
            :rules="localWarehouseRules"
            label-width="140px" 
            class="local-warehouse-form">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Warehouse Name" prop="warehouse" required>
                  <el-input v-model="addWarehouseForm.local.warehouse" placeholder="Enter warehouse name" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Accounting Code" prop="accountingCode" required>
                  <el-input v-model="addWarehouseForm.local.accountingCode" placeholder="Enter accounting code" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="City" prop="city" required>
                  <el-input v-model="addWarehouseForm.local.city" placeholder="Enter city" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="State" prop="state" required>
                  <el-input v-model="addWarehouseForm.local.state" placeholder="Enter state" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Country" prop="country" required>
                  <el-input v-model="addWarehouseForm.local.country" placeholder="Enter country" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Address" prop="address1" required>
              <el-input v-model="addWarehouseForm.local.address1" placeholder="Enter detailed address" />
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="ZIP Code" prop="zipCode" required>
                  <el-input v-model="addWarehouseForm.local.zipCode" placeholder="Enter ZIP code" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Contact Name" prop="contactName" required>
                  <el-input v-model="addWarehouseForm.local.contactName" placeholder="Enter contact name" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Contact Email" prop="contactEmail" required>
                  <el-input v-model="addWarehouseForm.local.contactEmail" placeholder="Enter contact email" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Contact Phone" prop="contactPhone" required>
                  <el-input v-model="addWarehouseForm.local.contactPhone" placeholder="Enter contact phone" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

         <!-- Integration Form -->
         <div v-if="addWarehouseForm.type === 'integration'" class="warehouse-form">

           <!-- Available Integrated Warehouses -->
           <div v-if="availableIntegratedWarehouses.length > 0" class="integrated-warehouses">
             <h5>Available Integrated Warehouses</h5>
             <p class="section-description">
               Select from warehouses that are already integrated and connected to add them to your warehouse list.
             </p>
             <div class="integrated-warehouse-grid">
               <div 
                 v-for="warehouse in availableIntegratedWarehouses" 
                 :key="warehouse.id"
                 class="integrated-warehouse-card"
                 :class="{ 'selected': selectedIntegratedWarehouse?.id === warehouse.id }"
                 @click="selectIntegratedWarehouse(warehouse)">
                 <div class="warehouse-content">
                   <div class="warehouse-main-info">
                     <h6 class="warehouse-name">{{ warehouse.name }}</h6>
                     <p class="warehouse-provider">{{ warehouse.provider }}</p>
                   </div>
                   <div class="warehouse-status">
                     <el-tag 
                       :type="getConnectionStatusType(warehouse.connectionStatus)"
                       size="small">
                       {{ getConnectionStatusText(warehouse.connectionStatus) }}
                     </el-tag>
                   </div>
                 </div>
                 <div class="warehouse-location">
                   <i class="el-icon-location"></i>
                   <span>{{ warehouse.location }}</span>
                 </div>
                 <div class="selection-indicator" v-if="selectedIntegratedWarehouse?.id === warehouse.id">
                   <i class="el-icon-check"></i>
                 </div>
               </div>
             </div>
           </div>

           <!-- Empty State for Integrated Warehouses -->
           <div v-else class="empty-integrated-warehouses">
             <div class="empty-content">
               <div class="empty-icon">
                 <i class="el-icon-box"></i>
               </div>
               <h5>No Integrated Warehouses Available</h5>
               <p class="empty-description">
                 You don't have any integrated warehouses yet. Connect with warehouse service providers to expand your fulfillment network.
               </p>
             </div>
           </div>

        </div>
      </div>
      
       <template #footer>
         <span class="dialog-footer">
           <el-button @click="cancelAddWarehouse">Cancel</el-button>
           <el-button 
             v-if="addWarehouseForm.type === 'local'"
             type="primary" 
             @click="handleAddWarehouse"
             :loading="addWarehouseLoading"
             :disabled="!canAddWarehouse">
             Add Warehouse
           </el-button>
           <template v-else-if="addWarehouseForm.type === 'integration'">
             <el-button 
               class="purple-button"
               @click="addSelectedIntegratedWarehouse"
               :loading="addingIntegratedWarehouse"
               :disabled="!selectedIntegratedWarehouse">
               <i class="el-icon-plus"></i> Add Warehouse
             </el-button>
             <el-button 
               type="warning" 
               @click="navigateToIntegrations">
               <i class="el-icon-setting"></i> Create New Connection
             </el-button>
           </template>
         </span>
       </template>
    </el-dialog>

    <!-- Batch Configuration Dialog -->
    <el-dialog
      v-model="batchConfigVisible"
      title="Batch WMS Configuration"
      width="500px">
      <div class="batch-config-content">
        <div class="selected-info">
          <p>Selected Warehouses: {{ selectedWarehouses.length }}</p>
          <el-alert
            v-if="hasConfiguredWarehouses"
            type="warning"
            :closable="false"
            show-icon>
            Some selected warehouses already have WMS configuration. Their settings will be overwritten.
          </el-alert>
        </div>
        <el-form :model="batchForm" label-width="120px" class="batch-form">
          <el-form-item label="WMS Version">
            <el-select v-model="batchForm.wmsVersion" placeholder="Select WMS Version">
              <el-option label="WMS V1" value="WMS V1" />
              <el-option label="WMS V2" value="WMS V2" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batchConfigVisible = false">Cancel</el-button>
          <el-button 
            type="primary" 
            @click="handleBatchConfig"
            :loading="batchConfigLoading"
            :disabled="!batchForm.wmsVersion || selectedWarehouses.length === 0">
            Apply Configuration
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Delete Warehouse Dialog -->
    <el-dialog
      v-model="deleteWarehouseVisible"
      title="Delete Warehouses"
      width="600px"
      :close-on-click-modal="false">
      <div class="delete-warehouse-content">
        <el-alert
          type="warning"
          :closable="false"
          show-icon>
          <template #title>
            Warning: This action cannot be undone
          </template>
          You are about to delete {{ selectedLocalWarehouses.length }} warehouse(s). This will permanently remove all warehouse data.
        </el-alert>
        
        <div class="warehouse-list-to-delete">
          <h4>Warehouses to be deleted:</h4>
          <div class="warehouse-items">
            <div 
              v-for="warehouse in selectedLocalWarehouses" 
              :key="warehouse.rank"
              class="warehouse-item">
              <div class="warehouse-info">
                <span class="warehouse-name">{{ warehouse.warehouse }}</span>
                <span class="warehouse-code">{{ warehouse.accountingCode }}</span>
              </div>
              <div class="warehouse-location">
                {{ warehouse.city }}, {{ warehouse.state }}, {{ warehouse.country }}
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="selectedIntegratedWarehouses.length > 0" class="integrated-warning">
          <el-alert
            type="info"
            :closable="false"
            show-icon>
            <template #title>
              Integrated warehouses cannot be deleted
            </template>
            {{ selectedIntegratedWarehouses.length }} integrated warehouse(s) are selected but will not be deleted. To remove integrated warehouses, please disconnect them through their respective integration settings.
          </el-alert>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteWarehouseVisible = false">Cancel</el-button>
          <el-button 
            type="danger" 
            @click="handleDeleteWarehouses"
            :loading="deleteWarehouseLoading"
            :disabled="selectedLocalWarehouses.length === 0">
            Delete {{ selectedLocalWarehouses.length }} Warehouse(s)
          </el-button>
        </span>
      </template>
    </el-dialog>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Plus, Refresh, Operation, Setting, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import Sortable from 'sortablejs'

interface Warehouse {
  rank: number
  warehouse: string
  accountingCode: string
  city: string
  state: string
  country: string
  address1: string
  zipCode: string
  contactName: string
  contactEmail: string
  contactPhone: string
  wmsVersion?: string | null
  availableVersions: string[]
  loading?: boolean
  isAvailable?: boolean
  lastStatusCheck?: Date
  statusCheckResult?: {
    connected: boolean
    lastSuccessful: Date
    errorMessage?: string
  }
  enableFulfillment: boolean
  enableInventorySync: boolean
  isIntegrated?: boolean
  integrationDate?: Date
  integrationStatus?: 'connected' | 'disconnected' | 'error'
}

interface BatchConfigForm {
  wmsVersion: string | null
}

interface LocalWarehouseForm {
  warehouse: string
  accountingCode: string
  city: string
  state: string
  country: string
  address1: string
  zipCode: string
  contactName: string
  contactEmail: string
  contactPhone: string
}

interface IntegrationForm {
  selectedProviderId: string
}

interface AddWarehouseForm {
  type: 'local' | 'integration'
  local: LocalWarehouseForm
  integration: IntegrationForm
}

interface IntegratedWarehouse {
  id: string
  name: string
  provider: string
  icon: string
  location: string
  capacity: string
  features: string[]
  connectionStatus: 'connected' | 'disconnected' | 'error'
  integrationDate: Date
  warehouseCode: string
  contactInfo: {
    name: string
    email: string
    phone: string
  }
}


interface ConnectionTestResult {
  success: boolean
  message: string
}

// Router instance
const router = useRouter()

// Mock data
const warehouseList = ref<Warehouse[]>([
  {
    rank: 1,
    warehouse: 'ShipBob East Coast',
    accountingCode: 'SB-001',
    city: 'New York',
    state: 'NY',
    country: 'US',
    address1: 'ShipBob Fulfillment Center - 123 Logistics Ave',
    zipCode: '10001',
    contactName: 'ShipBob Support',
    contactEmail: 'support@shipbob.com',
    contactPhone: '(855) 742-7262',
    wmsVersion: null, // 设为 null 因为连接已断开
    availableVersions: ['ShipBob'],
    loading: false,
    enableFulfillment: false, // 断开连接时禁用
    enableInventorySync: false, // 断开连接时禁用
    isIntegrated: true,
    integrationDate: new Date('2024-01-15'),
    integrationStatus: 'disconnected' // 设为断开连接状态
  },
  {
    rank: 6,
    warehouse: 'Roanoke',
    accountingCode: '869',
    city: 'Beijing',
    state: 'CA',
    country: 'US',
    address1: '159, Row 18, Progressive Way',
    zipCode: '90001',
    contactName: 'John Smith',
    contactEmail: 'john.smith@roanoke.com',
    contactPhone: '(555) 123-4567',
    wmsVersion: 'V1',
    availableVersions: ['V1'],
    loading: false,
    enableFulfillment: true,
    enableInventorySync: true
  },
  {
    rank: 7,
    warehouse: 'Fontana',
    accountingCode: '931',
    city: 'Fontana',
    state: 'CA',
    country: 'US',
    address1: '10681 Production Ave',
    zipCode: '92337',
    contactName: 'Sarah Johnson',
    contactEmail: 'sarah.j@fontana.com',
    contactPhone: '(555) 234-5678',
    wmsVersion: 'V2',
    availableVersions: ['V1', 'V2'],
    enableFulfillment: false,
    enableInventorySync: true
  },
  {
    rank: 8,
    warehouse: 'Joliet',
    accountingCode: '890',
    city: 'Elwood',
    state: 'IL',
    country: 'US',
    address1: '3901 S Brandon Rd',
    zipCode: '60421',
    contactName: 'Mike Wilson',
    contactEmail: 'mike.w@joliet.com',
    contactPhone: '(555) 345-6789',
    wmsVersion: 'V1',
    availableVersions: ['V1', 'V2']
  },
  {
    rank: 9,
    warehouse: 'Valley View',
    accountingCode: '889',
    city: 'Buena Park',
    state: 'CA',
    country: 'US',
    address1: '6800 Valley View St #11',
    zipCode: '90620',
    contactName: 'Lisa Brown',
    contactEmail: 'lisa.b@valleyview.com',
    contactPhone: '(555) 456-7890',
    wmsVersion: 'V1',
    availableVersions: ['V1']
  },
  {
    rank: 10,
    warehouse: 'Vista',
    accountingCode: '112',
    city: 'Sparks',
    state: 'NV',
    country: 'US',
    address1: '250 Vista Blvd Ste 101',
    zipCode: '89434',
    contactName: 'David Miller',
    contactEmail: 'david.m@vista.com',
    contactPhone: '(555) 567-8901',
    wmsVersion: 'V2',
    availableVersions: ['V1', 'V2']
  }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(warehouseList.value.length)

const selectedWarehouses = ref<Warehouse[]>([])
const batchConfigVisible = ref(false)
const batchConfigLoading = ref(false)
const batchForm = ref<BatchConfigForm>({
  wmsVersion: null
})

// Delete Warehouse related reactive data
const deleteWarehouseVisible = ref(false)
const deleteWarehouseLoading = ref(false)

// Add Warehouse related reactive data
const addWarehouseVisible = ref(false)
const addWarehouseLoading = ref(false)
// Available integrated warehouses (mock data)
const availableIntegratedWarehouses = ref<IntegratedWarehouse[]>([
  {
    id: 'shipbob-nyc-001',
    name: 'ShipBob NYC Fulfillment Center',
    provider: 'ShipBob',
    icon: '📦',
    location: 'New York, NY',
    capacity: '50K+ orders/month',
    features: ['Same-day fulfillment', 'Real-time inventory', 'Returns processing'],
    connectionStatus: 'connected',
    integrationDate: new Date('2024-01-15'),
    warehouseCode: 'SB-NYC-001',
    contactInfo: {
      name: 'ShipBob NYC Support',
      email: 'nyc-support@shipbob.com',
      phone: '(212) 555-0123'
    }
  },
  {
    id: 'shipbob-la-002',
    name: 'ShipBob LA Distribution Center',
    provider: 'ShipBob',
    icon: '📦',
    location: 'Los Angeles, CA',
    capacity: '75K+ orders/month',
    features: ['2-day shipping', 'Bulk storage', 'Custom packaging'],
    connectionStatus: 'connected',
    integrationDate: new Date('2024-02-10'),
    warehouseCode: 'SB-LA-002',
    contactInfo: {
      name: 'ShipBob LA Support',
      email: 'la-support@shipbob.com',
      phone: '(323) 555-0456'
    }
  },
  {
    id: 'amazon-fba-east',
    name: 'Amazon FBA East Coast',
    provider: 'Amazon FBA',
    icon: '📱',
    location: 'Multiple Locations',
    capacity: 'Unlimited',
    features: ['Prime eligibility', 'Global reach', 'Customer service'],
    connectionStatus: 'connected',
    integrationDate: new Date('2024-01-20'),
    warehouseCode: 'AMZ-FBA-EAST',
    contactInfo: {
      name: 'Amazon FBA Support',
      email: 'fba-support@amazon.com',
      phone: '(800) 280-4331'
    }
  },
  {
    id: 'rakuten-chi-001',
    name: 'Rakuten Chicago Hub',
    provider: 'Rakuten Super Logistics',
    icon: '🛍️',
    location: 'Chicago, IL',
    capacity: '30K+ orders/month',
    features: ['Multi-channel', 'Analytics dashboard', 'Returns management'],
    connectionStatus: 'disconnected',
    integrationDate: new Date('2024-03-05'),
    warehouseCode: 'RSL-CHI-001',
    contactInfo: {
      name: 'Rakuten Chicago Team',
      email: 'chicago@rakuten.com',
      phone: '(312) 555-0789'
    }
  },
  {
    id: 'deliverr-tx-001',
    name: 'Deliverr Texas Distribution Hub',
    provider: 'Deliverr',
    icon: '⚡',
    location: 'Dallas, TX',
    capacity: '40K+ orders/month',
    features: ['2-day delivery', 'Inventory optimization', 'Multi-channel sync'],
    connectionStatus: 'connected',
    integrationDate: new Date('2024-02-25'),
    warehouseCode: 'DLV-TX-001',
    contactInfo: {
      name: 'Deliverr Texas Team',
      email: 'texas@deliverr.com',
      phone: '(214) 555-0987'
    }
  },
  {
    id: 'shipstation-west',
    name: 'ShipStation West Coast Hub',
    provider: 'ShipStation',
    icon: '🚢',
    location: 'Seattle, WA',
    capacity: '60K+ shipments/month',
    features: ['Multi-carrier shipping', 'Automation rules', 'Branded tracking'],
    connectionStatus: 'connected',
    integrationDate: new Date('2024-03-10'),
    warehouseCode: 'SS-WEST-001',
    contactInfo: {
      name: 'ShipStation West Support',
      email: 'west@shipstation.com',
      phone: '(206) 555-0654'
    }
  }
])

const selectedIntegratedWarehouse = ref<IntegratedWarehouse | null>(null)
const addingIntegratedWarehouse = ref(false)


const addWarehouseForm = ref<AddWarehouseForm>({
  type: 'local',
  local: {
    warehouse: '',
    accountingCode: '',
    city: '',
    state: '',
    country: '',
    address1: '',
    zipCode: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  },
  integration: {
    selectedProviderId: ''
  }
})

// Form validation rules
const localWarehouseRules = {
  warehouse: [{ required: true, message: 'Please enter warehouse name', trigger: 'blur' }],
  accountingCode: [{ required: true, message: 'Please enter accounting code', trigger: 'blur' }],
  city: [{ required: true, message: 'Please enter city', trigger: 'blur' }],
  state: [{ required: true, message: 'Please enter state', trigger: 'blur' }],
  country: [{ required: true, message: 'Please enter country', trigger: 'blur' }],
  address1: [{ required: true, message: 'Please enter address', trigger: 'blur' }],
  zipCode: [{ required: true, message: 'Please enter ZIP code', trigger: 'blur' }],
  contactName: [{ required: true, message: 'Please enter contact name', trigger: 'blur' }],
  contactEmail: [
    { required: true, message: 'Please enter contact email', trigger: 'blur' },
    { type: 'email', message: 'Please enter valid email format', trigger: 'blur' }
  ],
  contactPhone: [{ required: true, message: 'Please enter contact phone', trigger: 'blur' }]
}

const hasConfiguredWarehouses = computed(() => {
  return selectedWarehouses.value.some(warehouse => warehouse.wmsVersion !== null)
})

const canAddWarehouse = computed(() => {
  if (addWarehouseForm.value.type === 'local') {
    const form = addWarehouseForm.value.local
    return !!(form.warehouse && form.accountingCode && form.city && 
             form.state && form.country && form.address1 && form.zipCode &&
             form.contactName && form.contactEmail && form.contactPhone)
  } else {
    // Integration type doesn't need the Add Warehouse button
    return false
  }
})

// Computed properties for delete functionality
const selectedLocalWarehouses = computed(() => {
  return selectedWarehouses.value.filter(warehouse => !warehouse.isIntegrated)
})

const selectedIntegratedWarehouses = computed(() => {
  return selectedWarehouses.value.filter(warehouse => warehouse.isIntegrated)
})

const canDeleteWarehouses = computed(() => {
  return selectedLocalWarehouses.value.length > 0
})

const tableRowClassName = () => {
  return 'draggable-row'
}

// Add initialization function
const initializeFirstWarehouse = async () => {
  const firstWarehouse = warehouseList.value[0]
  if (!firstWarehouse) return

  firstWarehouse.loading = true
  
  try {
    // Simulate API call that fails
    await new Promise(resolve => setTimeout(resolve, 1000))
    throw new Error('Failed to initialize WMS version V1 for warehouse Roanoke')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : 'Failed to initialize WMS version')
    firstWarehouse.wmsVersion = null
  } finally {
    firstWarehouse.loading = false
  }
}

// Update onMounted to include initialization
onMounted(() => {
  
  // Initialize sortable
  const tbody = document.querySelector('.el-table__body-wrapper tbody') as HTMLElement
  if (tbody) {
    new Sortable(tbody, {
      handle: '.drag-handle',
      animation: 150,
      onEnd(evt: Sortable.SortableEvent) {
        const newIndex = evt.newIndex
        const oldIndex = evt.oldIndex
        
        if (typeof newIndex !== 'number' || typeof oldIndex !== 'number') return
        
        const list = [...warehouseList.value]
        const [movedItem] = list.splice(oldIndex, 1)
        list.splice(newIndex, 0, movedItem)
        
        // Update ranks
        list.forEach((item, index) => {
          item.rank = index + 1
        })
        
        warehouseList.value = list
        
        // Call API to update ranks
        updateWarehouseRanks(list)
      }
    })
  }

  // Simulate failed initialization for first warehouse
  initializeFirstWarehouse()
})

const updateWarehouseRanks = async (list: Warehouse[]) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('Warehouse order updated successfully')
  } catch (error) {
    ElMessage.error('Failed to update warehouse order')
  }
}

const getAvailableWmsVersions = (warehouse: Warehouse) => {
  const options = [
    {
      value: null,
      label: 'Unassigned',
      disabled: false
    }
  ]
  
  // 为每个可用版本创建选项
  warehouse.availableVersions.forEach(version => {
    let label = version === 'Local' ? 'Local Warehouse' : version
    
    // 如果是集成仓库且连接状态不是 connected，添加未连接提示
    if (warehouse.isIntegrated && warehouse.integrationStatus !== 'connected') {
      label += ' (Disconnected)'
    }
    
    options.push({
      value: version,
      label: label,
      disabled: warehouse.isIntegrated && warehouse.integrationStatus !== 'connected'
    })
  })
  
  return options
}

const refreshData = () => {
  // Refresh data logic here
  ElMessage.success('Data refreshed successfully')
}

const handleWmsChange = async (row: Warehouse) => {
  row.loading = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 如果是集成仓库且连接状态不是 connected，自动设为 unassigned
    if (row.isIntegrated && row.integrationStatus !== 'connected') {
      row.wmsVersion = null
      row.enableFulfillment = false
      row.enableInventorySync = false
      ElMessage.warning(`${row.warehouse} is disconnected. WMS version has been set to unassigned.`)
      return
    }
    
    if (row.wmsVersion === null) {
      // Reset fulfillment and inventory sync when WMS is unassigned
      row.enableFulfillment = false
      row.enableInventorySync = false
      ElMessage.success(`Successfully unassigned warehouse version from ${row.warehouse}`)
      return
    }
    
    // Check if version is available for the warehouse
    if (!row.availableVersions.includes(row.wmsVersion!)) {
      throw new Error(`Warehouse version ${row.wmsVersion} is not available for warehouse ${row.warehouse}`)
    }
    
    const versionLabel = row.wmsVersion === 'Local' ? 'Local Warehouse' : row.wmsVersion
    ElMessage.success(`Successfully updated ${row.warehouse} to warehouse version ${versionLabel}`)
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : 'Failed to update WMS version')
    // Revert to previous version or unassigned
    row.wmsVersion = null
    // Reset fulfillment and inventory sync on error
    row.enableFulfillment = false
    row.enableInventorySync = false
  } finally {
    row.loading = false
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  // Reload data with new page size
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // Reload data for new page
}

const handleSelectionChange = (selection: Warehouse[]) => {
  selectedWarehouses.value = selection
}

const showBatchConfig = () => {
  if (selectedWarehouses.value.length === 0) {
    ElMessage.warning('Please select warehouses to configure')
    return
  }
  batchConfigVisible.value = true
}

const handleBatchConfig = async () => {
  if (!batchForm.value.wmsVersion || selectedWarehouses.value.length === 0) return

  batchConfigLoading.value = true
  const version = batchForm.value.wmsVersion
  const warehouses = selectedWarehouses.value

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update warehouses
    for (const warehouse of warehouses) {
      warehouse.wmsVersion = version
      warehouse.isAvailable = true
      warehouse.lastStatusCheck = new Date()
      warehouse.statusCheckResult = {
        connected: true,
        lastSuccessful: new Date(),
      }
    }

    ElMessage.success(`Successfully configured ${warehouses.length} warehouses to WMS ${version}`)
    batchConfigVisible.value = false
    batchForm.value.wmsVersion = null
  } catch (error) {
    ElMessage.error('Failed to apply batch configuration')
  } finally {
    batchConfigLoading.value = false
  }
}

const handleFulfillmentChange = async (row: Warehouse) => {
  // If no WMS version, ensure switch is off and return
  if (!row.wmsVersion) {
    row.enableFulfillment = false
    ElMessage.warning('Please specify WMS version first')
    return
  }

  row.loading = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success(`${row.warehouse} order fulfillment has been ${row.enableFulfillment ? 'enabled' : 'disabled'}`)
  } catch (error) {
    ElMessage.error('Failed to update order fulfillment status')
    // Revert to previous state
    row.enableFulfillment = !row.enableFulfillment
  } finally {
    row.loading = false
  }
}

const handleInventorySyncChange = async (row: Warehouse) => {
  // If no WMS version, ensure switch is off and return
  if (!row.wmsVersion) {
    row.enableInventorySync = false
    ElMessage.warning('Please specify WMS version first')
    return
  }

  row.loading = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success(`${row.warehouse} inventory sync has been ${row.enableInventorySync ? 'enabled' : 'disabled'}`)
  } catch (error) {
    ElMessage.error('Failed to update inventory sync status')
    // Revert to previous state
    row.enableInventorySync = !row.enableInventorySync
  } finally {
    row.loading = false
  }
}

// Add Warehouse related functions
const showAddWarehouse = () => {
  addWarehouseVisible.value = true
  resetAddWarehouseForm()
}

const cancelAddWarehouse = () => {
  addWarehouseVisible.value = false
  resetAddWarehouseForm()
}

const resetAddWarehouseForm = () => {
  addWarehouseForm.value = {
    type: 'local',
    local: {
      warehouse: '',
      accountingCode: '',
      city: '',
      state: '',
      country: '',
      address1: '',
      zipCode: '',
      contactName: '',
      contactEmail: '',
      contactPhone: ''
    },
    integration: {
      selectedProviderId: ''
    }
  }
  selectedIntegratedWarehouse.value = null
}

const handleWarehouseTypeChange = () => {
  // Reset form when switching types, but keep the type selection
  selectedIntegratedWarehouse.value = null
}

// Integrated warehouse selection methods
const selectIntegratedWarehouse = (warehouse: IntegratedWarehouse) => {
  if (warehouse.connectionStatus !== 'connected') {
    ElMessage.warning('Only connected warehouses can be added. Please check the connection status.')
    return
  }
  selectedIntegratedWarehouse.value = warehouse
}

const addSelectedIntegratedWarehouse = async () => {
  if (!selectedIntegratedWarehouse.value) return
  
  addingIntegratedWarehouse.value = true
  
  try {
    const warehouse = selectedIntegratedWarehouse.value
    
    // Check if warehouse is already in the list
    const existingWarehouse = warehouseList.value.find(w => 
      w.isIntegrated && w.accountingCode === warehouse.warehouseCode
    )
    
    if (existingWarehouse) {
      ElMessage.warning(`Warehouse "${warehouse.name}" is already in your warehouse list`)
      return
    }
    
    // Create new warehouse entry
    const newWarehouse: Warehouse = {
      rank: warehouseList.value.length + 1,
      warehouse: warehouse.name,
      accountingCode: warehouse.warehouseCode,
      city: warehouse.location.split(',')[0] || 'N/A',
      state: warehouse.location.split(',')[1]?.trim() || 'N/A',
      country: 'US',
      address1: `${warehouse.provider} Integration - ${warehouse.location}`,
      zipCode: '00000',
      contactName: warehouse.contactInfo.name,
      contactEmail: warehouse.contactInfo.email,
      contactPhone: warehouse.contactInfo.phone,
      wmsVersion: warehouse.provider,
      availableVersions: [warehouse.provider],
      loading: false,
      enableFulfillment: true,
      enableInventorySync: true,
      isIntegrated: true,
      integrationDate: warehouse.integrationDate,
      integrationStatus: warehouse.connectionStatus
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    warehouseList.value.push(newWarehouse)
    total.value = warehouseList.value.length
    
    ElMessage({
      message: `🎉 Successfully added "${warehouse.name}" to your warehouse list!`,
      type: 'success',
      duration: 5000,
      showClose: true
    })
    
    // Close dialog and reset form
    addWarehouseVisible.value = false
    resetAddWarehouseForm()
    
  } catch (error) {
    ElMessage.error('Failed to add integrated warehouse. Please try again.')
  } finally {
    addingIntegratedWarehouse.value = false
  }
}

// Navigation methods
const navigateToIntegrations = () => {
  router.push('/integration/connections')
}

// Connection status helpers
const getConnectionStatusType = (status: string) => {
  switch (status) {
    case 'connected':
      return 'success'
    case 'error':
      return 'danger'
    case 'disconnected':
      return 'warning'
    default:
      return 'info'
  }
}

const getConnectionStatusText = (status: string) => {
  switch (status) {
    case 'connected':
      return 'Connected'
    case 'error':
      return 'Connection Error'
    case 'disconnected':
      return 'Disconnected'
    default:
      return 'Unknown'
  }
}

// Integration status helpers
const getIntegrationTagType = (status?: string) => {
  switch (status) {
    case 'connected':
      return 'success'
    case 'error':
      return 'danger'
    case 'disconnected':
      return 'warning'
    default:
      return 'info'
  }
}

const getIntegrationStatusText = (status?: string) => {
  switch (status) {
    case 'connected':
      return 'Connected'
    case 'error':
      return 'Error'
    case 'disconnected':
      return 'Disconnected'
    default:
      return 'Unknown'
  }
}



const handleAddWarehouse = async () => {
  // This function now only handles local warehouses
  if (addWarehouseForm.value.type !== 'local') {
    ElMessage.warning('Integration warehouses are handled through the Connect process')
    return
  }
  
  addWarehouseLoading.value = true
  
  try {
    // Create local warehouse
    const form = addWarehouseForm.value.local
    const newWarehouse: Warehouse = {
      rank: warehouseList.value.length + 1,
      warehouse: form.warehouse,
      accountingCode: form.accountingCode,
      city: form.city,
      state: form.state,
      country: form.country,
      address1: form.address1,
      zipCode: form.zipCode,
      contactName: form.contactName,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
      wmsVersion: 'Local', // 本地仓库版本标识为 Local
      availableVersions: ['Local'],
      loading: false,
      enableFulfillment: true, // 本地仓库默认启用订单履行
      enableInventorySync: true // 本地仓库默认启用库存同步
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    warehouseList.value.push(newWarehouse)
    total.value = warehouseList.value.length
    
    ElMessage.success(`Local warehouse "${form.warehouse}" added successfully`)
    
    addWarehouseVisible.value = false
    resetAddWarehouseForm()
    
  } catch (error) {
    ElMessage.error('Failed to add warehouse, please try again')
  } finally {
    addWarehouseLoading.value = false
  }
}

// Delete Warehouse related functions
const showDeleteWarehouse = () => {
  if (selectedWarehouses.value.length === 0) {
    ElMessage.warning('Please select warehouses to delete')
    return
  }
  
  if (selectedLocalWarehouses.value.length === 0) {
    ElMessage.warning('Only local warehouses can be deleted. Integrated warehouses must be disconnected through their integration settings.')
    return
  }
  
  deleteWarehouseVisible.value = true
}

const handleDeleteWarehouses = async () => {
  if (selectedLocalWarehouses.value.length === 0) return
  
  deleteWarehouseLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Get the warehouse names for success message
    const deletedNames = selectedLocalWarehouses.value.map(w => w.warehouse)
    
    // Remove selected local warehouses from the list
    const warehousesToDelete = selectedLocalWarehouses.value
    warehousesToDelete.forEach(warehouseToDelete => {
      const index = warehouseList.value.findIndex(w => w.rank === warehouseToDelete.rank)
      if (index > -1) {
        warehouseList.value.splice(index, 1)
      }
    })
    
    // Update ranks for remaining warehouses
    warehouseList.value.forEach((warehouse, index) => {
      warehouse.rank = index + 1
    })
    
    // Update total count
    total.value = warehouseList.value.length
    
    // Clear selection
    selectedWarehouses.value = []
    
    ElMessage.success(`Successfully deleted ${deletedNames.length} warehouse(s): ${deletedNames.join(', ')}`)
    
    deleteWarehouseVisible.value = false
    
  } catch (error) {
    ElMessage.error('Failed to delete warehouses, please try again')
  } finally {
    deleteWarehouseLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 32px;
  min-height: 100vh;
  background: var(--bg-dark);
}

.page-header {
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  
  h1 {
    font-size: 32px;
    font-weight: 500;
    margin: 0;
    color: var(--text-primary);
  }
  
  .subtitle {
    margin: 8px 0 0;
    color: var(--text-secondary);
    font-size: 14px;
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.draggable-row {
  cursor: move;
}

.drag-handle {
  cursor: move;
  color: var(--text-secondary);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  
  &:hover {
    color: var(--text-primary);
  }
}

.rank-number {
  display: inline-block;
  font-weight: 500;
}


:deep(.el-table) {
  --el-table-border-color: var(--border-color);
  --el-table-header-bg-color: var(--bg-darker);
  --el-table-row-hover-bg-color: var(--bg-darker);
  
  th {
    background-color: var(--bg-darker) !important;
    color: var(--text-primary);
    font-weight: 500;
  }
  
  td {
    color: var(--text-secondary);
  }
  
  .draggable-row.sortable-ghost {
    background-color: var(--el-color-primary-light-9);
    opacity: 0.5;
  }
  
  .draggable-row.sortable-chosen {
    background-color: var(--el-color-primary-light-8);
  }
}

.batch-config-content {
  .selected-info {
    margin-bottom: 20px;
    
    p {
      margin: 0 0 10px;
      font-weight: 500;
    }
  }
  
  .batch-form {
    margin-top: 20px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  
  .purple-button {
    background: #8B5CF6;
    border-color: #8B5CF6;
    color: white;
    
    &:hover {
      background: #7C3AED;
      border-color: #7C3AED;
    }
    
    &:focus {
      background: #7C3AED;
      border-color: #7C3AED;
    }
    
    &:disabled {
      background: #D1D5DB;
      border-color: #D1D5DB;
      color: #9CA3AF;
      
      &:hover {
        background: #D1D5DB;
        border-color: #D1D5DB;
      }
    }
    
    &.is-loading {
      background: #8B5CF6;
      border-color: #8B5CF6;
    }
  }
}

// Add Warehouse Dialog Styles
.add-warehouse-content {
  .warehouse-type-selection {
    margin-bottom: 24px;
    text-align: center;
  }
  
  .warehouse-form {
    h4 {
      margin: 0 0 20px;
      color: var(--text-primary);
      font-weight: 500;
    }
    
    h5 {
      margin: 20px 0 12px;
      color: var(--text-primary);
      font-weight: 500;
    }
  }
  
  .local-warehouse-form {
    .el-form-item {
      margin-bottom: 20px;
    }
  }
   
   .integrated-warehouses {
     margin-bottom: 32px;
     
     h5 {
       margin: 0 0 8px;
       color: var(--text-primary);
       font-weight: 500;
       font-size: 16px;
     }
     
     .section-description {
       color: var(--text-secondary);
       margin-bottom: 20px;
       font-size: 14px;
       line-height: 1.5;
     }
     
     .integrated-warehouse-grid {
       display: grid;
       grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
       gap: 20px;
       margin-bottom: 24px;
     }
     
     .integrated-warehouse-card {
       position: relative;
       border: 2px solid var(--border-color);
       border-radius: 12px;
       padding: 24px;
       background: var(--bg-darker);
       cursor: pointer;
       transition: all 0.3s ease;
       min-height: 120px;
       display: flex;
       flex-direction: column;
       justify-content: space-between;
       
       &:hover {
         border-color: var(--el-color-primary-light-3);
         box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
         transform: translateY(-2px);
       }
       
       &.selected {
         border-color: var(--el-color-primary);
         background: var(--el-color-primary-light-9);
         box-shadow: 0 4px 16px rgba(64, 158, 255, 0.2);
         transform: translateY(-2px);
       }
       
       .warehouse-content {
         display: flex;
         justify-content: space-between;
         align-items: flex-start;
         margin-bottom: 16px;
         flex: 1;
       }
       
       .warehouse-main-info {
         flex: 1;
         
         .warehouse-name {
           margin: 0 0 6px;
           font-size: 18px;
           font-weight: 600;
           color: var(--text-primary);
           line-height: 1.3;
         }
         
         .warehouse-provider {
           margin: 0;
           font-size: 14px;
           color: var(--text-secondary);
           font-weight: 500;
         }
       }
       
       .warehouse-status {
         margin-left: 12px;
         
         .el-tag {
           font-size: 11px;
           height: 24px;
           line-height: 22px;
           font-weight: 500;
         }
       }
       
       .warehouse-location {
         display: flex;
         align-items: center;
         gap: 6px;
         font-size: 13px;
         color: var(--text-secondary);
         margin-top: auto;
         
         i {
           font-size: 14px;
           color: var(--el-color-primary);
         }
         
         span {
           font-weight: 500;
         }
       }
       
       .selection-indicator {
         position: absolute;
         top: -8px;
         right: -8px;
         width: 28px;
         height: 28px;
         border-radius: 50%;
         background: var(--el-color-success);
         color: white;
         display: flex;
         align-items: center;
         justify-content: center;
         font-size: 16px;
         font-weight: bold;
         border: 3px solid var(--bg-dark);
         box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
         z-index: 10;
       }
     }
     
   }
   
   .empty-integrated-warehouses {
     text-align: center;
     padding: 80px 40px;
     background: linear-gradient(135deg, var(--bg-darker) 0%, var(--bg-dark) 100%);
     border-radius: 16px;
     border: 2px dashed var(--border-color);
     margin-bottom: 24px;
     
     .empty-content {
       max-width: 450px;
       margin: 0 auto;
       
       .empty-icon {
         margin-bottom: 24px;
         
         i {
           font-size: 72px;
           color: var(--el-color-primary-light-5);
           opacity: 0.8;
         }
       }
       
       h5 {
         margin: 0 0 16px;
         font-size: 22px;
         font-weight: 600;
         color: var(--text-primary);
       }
       
       .empty-description {
         margin: 0 0 32px;
         color: var(--text-secondary);
         line-height: 1.6;
         font-size: 15px;
       }
       
       .el-button {
         padding: 12px 24px;
         font-size: 14px;
         font-weight: 500;
         border-radius: 8px;
       }
     }
   }
   
  
  .warehouse-option {
    .warehouse-name {
      font-weight: 500;
      color: var(--text-primary);
    }
    
    .warehouse-details {
      font-size: 12px;
      color: var(--text-secondary);
      margin-top: 2px;
    }
  }
  
  .warehouse-preview {
    margin-top: 24px;
    padding: 16px;
    background: var(--bg-darker);
    border-radius: 6px;
    border: 1px solid var(--border-color);
  }
}

// Delete Warehouse Dialog Styles
.delete-warehouse-content {
  .warehouse-list-to-delete {
    margin: 24px 0;
    
    h4 {
      margin: 0 0 16px;
      color: var(--text-primary);
      font-weight: 500;
      font-size: 16px;
    }
    
    .warehouse-items {
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      background: var(--bg-darker);
      
      .warehouse-item {
        padding: 12px 16px;
        border-bottom: 1px solid var(--border-color);
        
        &:last-child {
          border-bottom: none;
        }
        
        .warehouse-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 4px;
          
          .warehouse-name {
            font-weight: 500;
            color: var(--text-primary);
          }
          
          .warehouse-code {
            font-size: 12px;
            color: var(--text-secondary);
            background: var(--bg-dark);
            padding: 2px 8px;
            border-radius: 4px;
          }
        }
        
        .warehouse-location {
          font-size: 13px;
          color: var(--text-secondary);
        }
      }
    }
  }
  
  .integrated-warning {
    margin-top: 20px;
  }
}

:deep(.el-radio-button) {
  .el-radio-button__inner {
    border-color: var(--border-color);
    color: var(--text-secondary);
    background: var(--bg-darker);
    
    &:hover {
      color: var(--el-color-primary);
    }
  }
  
  &.is-active .el-radio-button__inner {
    background: var(--el-color-primary);
    border-color: var(--el-color-primary);
    color: white;
  }
}

:deep(.el-descriptions) {
  .el-descriptions__header {
    margin-bottom: 12px;
  }
  
  .el-descriptions-item__label {
    color: var(--text-secondary);
    font-weight: 500;
  }
  
  .el-descriptions-item__content {
    color: var(--text-primary);
  }
}
</style> 