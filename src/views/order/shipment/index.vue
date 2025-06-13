<template>
  <div class="shipment-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>运单管理</h2>
      <el-button 
        type="primary" 
        :icon="Plus" 
        @click="showCreateDialog = true"
      >
        创建运单
      </el-button>
    </div>

    <!-- 筛选条件 -->
    <el-card class="filter-card" shadow="never">
      <el-form :model="filterForm" inline>
        <el-form-item label="运单号">
          <el-input 
            v-model="filterForm.shipmentNo" 
            placeholder="请输入运单号"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        
        <el-form-item label="销售订单号">
          <el-input 
            v-model="filterForm.salesOrderNo" 
            placeholder="请输入销售订单号"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        
        <el-form-item label="物流单号">
          <el-input 
            v-model="filterForm.truckingNo" 
            placeholder="请输入物流单号"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        
        <el-form-item label="状态">
          <el-select 
            v-model="filterForm.status" 
            placeholder="选择状态"
            multiple
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="status in Object.values(ShipmentStatus)"
              :key="status"
              :label="SHIPMENT_STATUS_CONFIG[status].label"
              :value="status"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="承运商">
          <el-select 
            v-model="filterForm.carrier" 
            placeholder="选择承运商"
            multiple
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="carrier in CARRIER_OPTIONS"
              :key="carrier.value"
              :label="carrier.label"
              :value="carrier.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 250px"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never">
      <el-table 
        :data="tableData" 
        v-loading="loading"
        @row-click="handleRowClick"
        stripe
        :row-class-name="getRowClassName"
      >
        <el-table-column label="运单号" width="140" fixed="left">
          <template #default="{ row }">
            <el-link 
              type="primary" 
              @click.stop="handleShipmentNoClick(row)"
              class="number-link"
            >
              {{ row.shipmentNo }}
            </el-link>
          </template>
        </el-table-column>
        
        <el-table-column label="销售订单号" width="130">
          <template #default="{ row }">
            <el-link 
              type="success" 
              @click.stop="handleSalesOrderClick(row)"
              class="number-link"
            >
              {{ row.salesOrderNo }}
            </el-link>
          </template>
        </el-table-column>
        
        <el-table-column label="物流单号" width="140">
          <template #default="{ row }">
            <el-link 
              type="warning" 
              @click.stop="handleTrackingNoClick(row)"
              class="number-link"
            >
              {{ row.truckingNo }}
            </el-link>
          </template>
        </el-table-column>
        
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag 
              :type="getStatusTagType(row.status)"
              effect="dark"
              size="small"
            >
              {{ SHIPMENT_STATUS_CONFIG[row.status].label }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="channel" label="CHANNEL" width="100" />
        <el-table-column prop="channelName" label="CHANNEL NAME" width="140" />
        <el-table-column label="DISPATCHED NO" width="130">
          <template #default="{ row }">
            <span class="number-highlight">{{ row.dispatchedNo }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="CHANNEL SALES ORDER NO." width="180">
          <template #default="{ row }">
            <span class="number-highlight">{{ row.channelSalesOrderNo }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="shipDate" label="SHIP DATE" width="120">
          <template #default="{ row }">
            {{ formatDate(row.shipDate) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="carrier" label="承运商" width="90">
          <template #default="{ row }">
            {{ getCarrierLabel(row.carrier) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="createDate" label="创建时间" width="150">
          <template #default="{ row }">
            {{ formatDate(row.createDate) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="updateDate" label="更新时间" width="150">
          <template #default="{ row }">
            {{ formatDate(row.updateDate) }}
          </template>
        </el-table-column>
        

      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 创建/编辑运单对话框 -->
    <CreateShipmentDialog 
      v-model="showCreateDialog"
      :shipment-data="editingShipment"
      @confirm="handleCreateOrUpdate"
    />

    <!-- 运单详情对话框 -->
    <ShipmentDetailDialog 
      v-model="showDetailDialog"
      :shipment="selectedShipment"
    />

    <!-- 物流追踪对话框 -->
    <ShipmentTrackingDialog 
      v-model="showTrackingDialog"
      :shipment="selectedShipment"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { 
  ShipmentItem, 
  ShipmentFilter, 
  ShipmentStatus,
  SHIPMENT_STATUS_CONFIG,
  CARRIER_OPTIONS
} from './types'
import CreateShipmentDialog from './components/CreateShipmentDialog.vue'
import ShipmentDetailDialog from './components/ShipmentDetailDialog.vue'
import ShipmentTrackingDialog from './components/ShipmentTrackingDialog.vue'
import { mockShipmentData } from '../../../data/mockShipmentData'

// 路由
const router = useRouter()

// 响应式数据
const loading = ref(false)
const tableData = ref<ShipmentItem[]>([])
const showCreateDialog = ref(false)
const showDetailDialog = ref(false)
const showTrackingDialog = ref(false)
const selectedShipment = ref<ShipmentItem | null>(null)
const editingShipment = ref<ShipmentItem | null>(null)

// 筛选表单
const filterForm = reactive<ShipmentFilter>({
  shipmentNo: '',
  salesOrderNo: '',
  truckingNo: '',
  status: [],
  carrier: [],
  dateRange: undefined,
  recipient: ''
})

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

// 初始化页面数据
onMounted(() => {
  loadShipmentData()
})

// 加载运单数据
const loadShipmentData = async () => {
  loading.value = true
  try {
    // 这里应该调用API获取数据，暂时使用模拟数据
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = mockShipmentData
    pagination.total = mockShipmentData.length
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  pagination.currentPage = 1
  loadShipmentData()
}

// 重置筛选条件
const handleReset = () => {
  Object.assign(filterForm, {
    shipmentNo: '',
    salesOrderNo: '',
    truckingNo: '',
    status: [],
    carrier: [],
    dateRange: undefined,
    recipient: ''
  })
  handleSearch()
}

// 行点击处理
const handleRowClick = (row: ShipmentItem) => {
  selectedShipment.value = row
  showDetailDialog.value = true
}

// 运单号点击 - 跳转详情页
const handleShipmentNoClick = (row: ShipmentItem) => {
  router.push(`/order/shipment/${row.shipmentNo}`)
}

// 销售订单号点击 - 跳转销售订单详情
const handleSalesOrderClick = (row: ShipmentItem) => {
  // 这里可以跳转到销售订单详情页面
  // router.push(`/order/sales/${row.salesOrderNo}`)
  ElMessage.info(`跳转到销售订单详情: ${row.salesOrderNo}`)
}

// 物流单号点击 - 物流追踪
const handleTrackingNoClick = (row: ShipmentItem) => {
  selectedShipment.value = row
  showTrackingDialog.value = true
}



// 创建或更新运单
const handleCreateOrUpdate = () => {
  ElMessage.success(editingShipment.value ? '更新成功' : '创建成功')
  editingShipment.value = null
  loadShipmentData()
}

// 分页处理
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  loadShipmentData()
}

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
  loadShipmentData()
}

// 工具函数
const getCarrierLabel = (carrier: string) => {
  const option = CARRIER_OPTIONS.find(item => item.value === carrier)
  return option?.label || carrier
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 获取状态标签类型
const getStatusTagType = (status: ShipmentStatus) => {
  const typeMap: Record<ShipmentStatus, string> = {
    [ShipmentStatus.New]: 'info',
    [ShipmentStatus.InTransit]: 'warning',
    [ShipmentStatus.Delivered]: 'success',
    [ShipmentStatus.Closed]: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取行类名
const getRowClassName = ({ row, rowIndex }: { row: ShipmentItem, rowIndex: number }) => {
  return 'table-row'
}
</script>

<style scoped>
.shipment-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.filter-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

/* 表格样式优化 */
:deep(.el-table) {
  background-color: transparent;
  
  .el-table__header-wrapper {
    background-color: #1e2227;
    
    th {
      background-color: #1e2227 !important;
      color: #8b949e !important;
      font-weight: 600;
      border-bottom: 1px solid #2d3139;
    }
  }
  
  .el-table__body-wrapper {
    .el-table__row {
      background-color: #1a1d21;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: #252830 !important;
        
        .el-tag {
          box-shadow: 0 0 8px rgba(124, 77, 255, 0.3);
        }
      }
      
      &.table-row {
        td {
          border-bottom: 1px solid #2d3139;
          color: #e6edf3;
          padding: 12px 0;
          
          .cell {
            padding: 0 12px;
          }
        }
      }
    }
    
    .el-table__row--striped {
      background-color: #1c1f24 !important;
      
      &:hover {
        background-color: #252830 !important;
      }
    }
  }
}

/* 状态标签样式 */
:deep(.el-tag) {
  border: none;
  font-weight: 500;
  
  &.el-tag--info {
    background-color: #606266;
    color: #fff;
  }
  
  &.el-tag--warning {
    background-color: #e6a23c;
    color: #fff;
  }
  
  &.el-tag--success {
    background-color: #67c23a;
    color: #fff;
  }
  
  &.el-tag--danger {
    background-color: #f56c6c;
    color: #fff;
  }
}

/* 单号链接样式 */
.number-link {
  font-weight: 600;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    text-shadow: 0 0 8px currentColor;
  }
}

/* 单号高亮样式 */
.number-highlight {
  font-weight: 600;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  color: #7c4dff;
  background: linear-gradient(135deg, rgba(124, 77, 255, 0.1), rgba(124, 77, 255, 0.05));
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(124, 77, 255, 0.2);
  display: inline-block;
}

/* Element Plus 链接组件样式覆盖 */
:deep(.el-link) {
  &.el-link--primary {
    color: #409eff;
    
    &:hover {
      color: #66b1ff;
    }
  }
  
  &.el-link--success {
    color: #67c23a;
    
    &:hover {
      color: #85ce61;
    }
  }
  
  &.el-link--warning {
    color: #e6a23c;
    
    &:hover {
      color: #ebb563;
    }
  }
}
</style> 