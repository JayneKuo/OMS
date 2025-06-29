<template>
  <el-dialog
    v-model="dialogVisible"
    title="选择销售订单"
    width="900px"
    @close="handleClose"
  >
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="请输入订单号或客户名称搜索"
        clearable
        @input="handleSearch"
        style="width: 300px"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      
      <el-select
        v-model="statusFilter"
        placeholder="订单状态"
        clearable
        style="width: 150px; margin-left: 10px"
        @change="handleSearch"
      >
        <el-option label="已发货" value="shipped" />
        <el-option label="运输中" value="in_transit" />
      </el-select>
    </div>

    <!-- 订单列表 -->
    <el-table
      :data="filteredOrders"
      v-loading="loading"
      @row-click="handleRowClick"
      :row-class-name="getRowClassName"
      class="order-table"
    >
      <el-table-column type="selection" width="55" />
      
      <el-table-column prop="orderNo" label="订单号" width="150" />
      
      <el-table-column prop="channelOrderNo" label="渠道订单号" width="150" />
      
      <el-table-column prop="recipient" label="收件人" width="120" />
      
      <el-table-column prop="country" label="目的地" width="100" />
      
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag 
            :type="getStatusType(row.status)"
            size="small"
          >
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="orderDate" label="订单日期" width="120">
        <template #default="{ row }">
          {{ formatDate(row.orderDate) }}
        </template>
      </el-table-column>
      
      <el-table-column prop="grandTotal" label="订单金额" width="100">
        <template #default="{ row }">
          ${{ row.grandTotal.toFixed(2) }}
        </template>
      </el-table-column>
      
      <el-table-column prop="truckingNo" label="物流单号" min-width="150">
        <template #default="{ row }">
          <span v-if="row.truckingNo" class="trucking-no">
            {{ row.truckingNo }}
          </span>
          <span v-else class="no-trucking">-</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button 
          type="primary" 
          @click="handleConfirm"
          :disabled="!selectedOrder"
        >
          确认选择
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'

// Props
interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': [orderData: any]
}>()

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref('')
const selectedOrder = ref<any>(null)

// 计算属性
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

// 模拟订单数据 - 只显示有trucking NO的订单
const orders = ref([
  {
    id: '1',
    orderNo: 'SO202401001',
    channelOrderNo: 'AMZ-001',
    recipient: '张三',
    country: 'CN',
    status: 'shipped',
    orderDate: '2024-01-15',
    grandTotal: 299.99,
    truckingNo: '1234567890123',
    recipientInfo: {
      name: '张三',
      address: '北京市朝阳区建国路88号SOHO现代城',
      phone: '13888888888',
      email: 'zhangsan@email.com'
    }
  },
  {
    id: '2',
    orderNo: 'SO202401002',
    channelOrderNo: 'AMZ-002',
    recipient: '李四',
    country: 'CN',
    status: 'in_transit',
    orderDate: '2024-01-14',
    grandTotal: 199.99,
    truckingNo: '9876543210987',
    recipientInfo: {
      name: '李四',
      address: '上海市浦东新区陆家嘴金融区',
      phone: '13999999999',
      email: 'lisi@email.com'
    }
  },
  {
    id: '3',
    orderNo: 'SO202401003',
    channelOrderNo: 'AMZ-003',
    recipient: '王五',
    country: 'CN',
    status: 'shipped',
    orderDate: '2024-01-13',
    grandTotal: 99.99,
    truckingNo: '5555666677778',
    recipientInfo: {
      name: '王五',
      address: '广州市天河区珠江新城',
      phone: '13777777777',
      email: 'wangwu@email.com'
    }
  }
])

// 筛选后的订单数据
const filteredOrders = computed(() => {
  let result = orders.value

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(order => 
      order.orderNo.toLowerCase().includes(keyword) ||
      order.channelOrderNo.toLowerCase().includes(keyword) ||
      order.recipient.toLowerCase().includes(keyword)
    )
  }

  // 状态筛选
  if (statusFilter.value) {
    result = result.filter(order => order.status === statusFilter.value)
  }

  return result
})

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: computed(() => filteredOrders.value.length)
})

// 方法
const handleSearch = () => {
  pagination.currentPage = 1
}

const handleRowClick = (row: any) => {
  selectedOrder.value = row
}

const getRowClassName = ({ row }: { row: any }) => {
  return selectedOrder.value?.id === row.id ? 'selected-row' : ''
}

const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    'shipped': 'success',
    'in_transit': 'warning'
  }
  return statusMap[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    'shipped': '已发货',
    'in_transit': '运输中'
  }
  return statusMap[status] || status
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const handleSizeChange = (val: number) => {
  pagination.pageSize = val
}

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
}

const handleClose = () => {
  selectedOrder.value = null
  searchKeyword.value = ''
  statusFilter.value = ''
  emit('update:modelValue', false)
}

const handleConfirm = () => {
  if (selectedOrder.value) {
    emit('confirm', {
      orderNo: selectedOrder.value.orderNo,
      recipient: selectedOrder.value.recipientInfo
    })
    handleClose()
  }
}

onMounted(() => {
  // 这里可以加载真实的订单数据
})
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.order-table {
  margin-bottom: 20px;
}

:deep(.selected-row) {
  background-color: #e6f7ff !important;
}

:deep(.selected-row:hover) {
  background-color: #e6f7ff !important;
}

.trucking-no {
  color: #409eff;
  font-weight: 500;
}

.no-trucking {
  color: #c0c4cc;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-table__row) {
  cursor: pointer;
}
</style> 