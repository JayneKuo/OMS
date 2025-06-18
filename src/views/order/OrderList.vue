<template>
  <div class="order-list">
    <!-- 搜索表单 -->
    <el-form :model="searchForm" class="search-form" inline>
      <el-form-item label="订单号">
        <el-input v-model="searchForm.orderId" placeholder="请输入订单号" clearable />
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="status in orderStatuses"
            :key="status.value"
            :label="status.label"
            :value="status.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="searchForm.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 订单列表 -->
    <el-table
      v-loading="loading"
      :data="orderList"
      border
      stripe
      class="order-table"
    >
      <el-table-column prop="orderId" label="订单号" min-width="180">
        <template #default="{ row }">
          <el-link type="primary" @click="handleOrderClick(row)">
            {{ row.orderId }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <order-status-tag
            :status="row.status"
            clickable
            @click="handleStatusClick(row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="customerName" label="客户名称" min-width="120" />
      <el-table-column prop="amount" label="订单金额" width="120">
        <template #default="{ row }">
          {{ formatAmount(row.amount) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleOrderClick(row)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStatusStore } from '@/stores/orderStatus'
import { OrderStatus } from '@/types/order'
import OrderStatusTag from '@/components/OrderStatusTag.vue'
import type { OrderData } from '@/types/queryToolTypes'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const orderStatusStore = useOrderStatusStore()

// 搜索表单
const searchForm = reactive({
  orderId: '',
  status: '',
  dateRange: [] as string[]
})

// 订单状态选项
const orderStatuses = [
  { value: OrderStatus.Imported, label: '已导入' },
  { value: OrderStatus.Allocated, label: '已分配' },
  { value: OrderStatus['Warehouse Processing'], label: '仓库处理中' },
  { value: OrderStatus.Shipped, label: '已发货' },
  { value: OrderStatus.InTransit, label: '运输中' },
  { value: OrderStatus.Delivered, label: '已送达' },
  { value: OrderStatus.Completed, label: '已完成' },
  { value: OrderStatus.Pending, label: '待处理' },
  { value: OrderStatus.Exception, label: '异常' },
  { value: OrderStatus.Deallocated, label: '已取消分配' },
  { value: OrderStatus.Cancelling, label: '取消中' },
  { value: OrderStatus.Canceled, label: '已取消' },
  { value: OrderStatus.UpdateFailed, label: '更新失败' }
]

// 列表数据
const loading = ref(false)
const orderList = ref<OrderData[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 格式化金额
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY'
  }).format(amount)
}

// 格式化时间
const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 搜索
const handleSearch = async () => {
  loading.value = true
  try {
    // TODO: 调用搜索API
    // const { data, total: totalCount } = await searchOrders({
    //   ...searchForm,
    //   page: currentPage.value,
    //   pageSize: pageSize.value
    // })
    // orderList.value = data
    // total.value = totalCount
  } catch (error) {
    console.error('搜索订单失败:', error)
  } finally {
    loading.value = false
  }
}

// 重置搜索
const handleReset = () => {
  searchForm.orderId = ''
  searchForm.status = ''
  searchForm.dateRange = []
  currentPage.value = 1
  handleSearch()
}

// 分页
const handleSizeChange = (size: number) => {
  pageSize.value = size
  handleSearch()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  handleSearch()
}

// 点击订单
const handleOrderClick = (order: OrderData) => {
  // 更新状态store
  orderStatusStore.updateStatus(order.status as OrderStatus)
  // 跳转到详情页
  router.push(`/order/detail/${order.systemOrderId}`)
}

// 点击状态标签
const handleStatusClick = (order: OrderData) => {
  // 如果是更新失败状态，显示更新失败详情
  if (order.status === OrderStatus.UpdateFailed) {
    ElMessageBox.alert(
      `<div class="update-failed-info">
        <p><strong>更新失败原因：</strong>${order.errorReason || '未知错误'}</p>
        <p><strong>更新内容：</strong>${order.updateContent || '无'}</p>
        <p><strong>处理建议：</strong></p>
        <ul>
          <li>检查WMS系统状态</li>
          <li>确认更新内容是否合规</li>
          <li>联系技术支持处理</li>
        </ul>
      </div>`,
      '更新失败详情',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        callback: () => {
          handleOrderClick(order)
        }
      }
    )
  } else {
    handleOrderClick(order)
  }
}

// 初始化
onMounted(() => {
  handleSearch()
})
</script>

<style lang="scss" scoped>
.order-list {
  padding: 24px;

  .search-form {
    margin-bottom: 24px;
    padding: 24px;
    background: var(--el-bg-color);
    border-radius: 8px;
  }

  .order-table {
    margin-bottom: 24px;
  }

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    padding: 16px 0;
  }
}

:deep(.update-failed-info) {
  p {
    margin: 8px 0;
    line-height: 1.5;
  }

  strong {
    color: #F43F5E;
  }

  ul {
    margin: 4px 0;
    padding-left: 20px;

    li {
      margin: 4px 0;
      color: #666;
    }
  }
}
</style> 