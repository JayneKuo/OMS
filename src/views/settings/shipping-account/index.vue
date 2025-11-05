<template>
  <div class="shipping-account-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <h1>Shipping Accounts</h1>
        <p class="subtitle">Manage your shipping carrier accounts</p>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleAddAccount">
          <el-icon><Plus /></el-icon>
          Add Shipping Account
        </el-button>
      </div>
    </div>

    <!-- Search Form -->
    <el-card class="search-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="Carrier">
          <el-select v-model="filterForm.carrier" placeholder="Select Carrier" clearable style="width: 200px">
            <el-option
              v-for="carrier in CARRIER_OPTIONS"
              :key="carrier.value"
              :label="carrier.label"
              :value="carrier.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Account No">
          <el-input v-model="filterForm.accountNo" placeholder="Enter Account No" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="filterForm.name" placeholder="Enter Name" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            Search
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshLeft /></el-icon>
            Reset
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Data Table -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        stripe
      >
        <el-table-column prop="carrier" label="Carrier" width="140" fixed="left">
          <template #default="{ row }">
            <el-tag type="primary">{{ getCarrierLabel(row.carrier) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="accountNo" label="Account No" width="160" />
        <el-table-column prop="name" label="Contact Name" width="140" />
        <el-table-column prop="company" label="Company" min-width="180" show-overflow-tooltip />
        <el-table-column label="Location" width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <span v-if="row.city || row.stateProvince">
              {{ [row.city, row.stateProvince].filter(Boolean).join(', ') }}
            </span>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="Phone" width="150" />
        <el-table-column label="Return Account" width="130" align="center">
          <template #default="{ row }">
            <el-tag :type="row.isReturn ? 'success' : 'info'" size="small">
              {{ row.isReturn ? 'Yes' : 'No' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Created" width="120">
          <template #default="{ row }">
            <span class="text-muted">{{ row.createdAt }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              Edit
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, RefreshLeft, Edit, Delete } from '@element-plus/icons-vue'
import type { ShippingAccount, ShippingAccountFilter } from './types'
import { CARRIER_OPTIONS } from './types'

const router = useRouter()
const loading = ref(false)
const tableData = ref<ShippingAccount[]>([])

// Filter form
const filterForm = reactive<ShippingAccountFilter>({
  carrier: '',
  accountNo: '',
  name: '',
  company: ''
})

// Pagination
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

// Get carrier label
const getCarrierLabel = (value: string) => {
  const carrier = CARRIER_OPTIONS.find(c => c.value === value)
  return carrier ? carrier.label : value
}

// Load data
const loadData = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    // Simulating API call with mock data
    await new Promise(resolve => setTimeout(resolve, 500))
    
    tableData.value = [
      {
        id: 1,
        carrier: 'fedex',
        accountNo: '123456789',
        apiClientId: 'client123',
        apiClientPassword: '********',
        apiToken: '********',
        trackApiKey: '********',
        trackApiSecret: '********',
        name: 'John Smith',
        company: 'ABC Company',
        address1: '123 Main St',
        address2: 'Suite 100',
        city: 'New York',
        countryRegion: 'US',
        stateProvince: 'NY',
        zipCode: '10001',
        phone: '212-555-0123',
        smartPostHubId: 'HUB123',
        returnAccountNumber: 'RET123',
        isReturn: false,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15'
      },
      {
        id: 2,
        carrier: 'ups',
        accountNo: '987654321',
        apiClientId: 'client456',
        apiClientPassword: '********',
        apiToken: '********',
        trackApiKey: '********',
        trackApiSecret: '********',
        name: 'Jane Doe',
        company: 'XYZ Corp',
        address1: '456 Oak Ave',
        address2: '',
        city: 'Los Angeles',
        countryRegion: 'US',
        stateProvince: 'CA',
        zipCode: '90001',
        phone: '310-555-0456',
        smartPostHubId: '',
        returnAccountNumber: 'RET456',
        isReturn: true,
        createdAt: '2024-02-20',
        updatedAt: '2024-02-20'
      }
    ]
    
    pagination.total = tableData.value.length
  } catch (error) {
    console.error('Failed to load shipping accounts:', error)
    ElMessage.error('Failed to load shipping accounts')
  } finally {
    loading.value = false
  }
}

// Handle search
const handleSearch = () => {
  pagination.currentPage = 1
  loadData()
}

// Handle reset
const handleReset = () => {
  filterForm.carrier = ''
  filterForm.accountNo = ''
  filterForm.name = ''
  filterForm.company = ''
  handleSearch()
}

// Handle add
const handleAddAccount = () => {
  router.push('/system-settings/shipping-account/add')
}

// Handle edit
const handleEdit = (row: ShippingAccount) => {
  router.push(`/system-settings/shipping-account/edit/${row.id}`)
}

// Handle delete
const handleDelete = async (row: ShippingAccount) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete shipping account "${row.accountNo}"?`,
      'Confirm Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    
    // TODO: Replace with actual API call
    ElMessage.success('Shipping account deleted successfully')
    loadData()
  } catch (error) {
    // User cancelled
  }
}

// Handle page size change
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadData()
}

// Handle page change
const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  loadData()
}

// Initialize
onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.shipping-account-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .header-left {
    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #ffffff;
    }

    .subtitle {
      margin: 4px 0 0;
      font-size: 14px;
      color: #ffffff;
      opacity: 0.8;
    }
  }
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}

.text-muted {
  color: #909399;
  font-size: 13px;
}
</style>

