<template>
  <div class="return-table">
    <el-table
      v-loading="loading"
      :data="data"
      border
      style="width: 100%"
    >
      <!-- 基础信息 -->
      <el-table-column
        prop="hdr"
        label="系统跟踪号"
        width="120"
      />
      <el-table-column
        prop="facilityId"
        label="仓库"
        width="120"
      />
      <el-table-column
        prop="rma"
        label="RMA号"
        width="150"
      />
      <el-table-column
        prop="reference"
        label="关联单号"
        width="150"
      />
      <el-table-column
        prop="status"
        label="状态"
        width="120"
      >
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 来源信息 -->
      <el-table-column
        prop="sourceSystem.type"
        label="来源系统"
        width="120"
      />
      <el-table-column
        prop="sourceSystem.orderNo"
        label="来源单号"
        width="150"
      />
      <el-table-column
        prop="returnParty"
        label="退货方"
        width="120"
      />
      <el-table-column
        prop="shipMethod"
        label="退货方式"
        width="120"
      />

      <!-- 物流信息 -->
      <el-table-column
        prop="shipment.carrier"
        label="承运商"
        width="120"
      />
      <el-table-column
        prop="shipment.trackingNumber"
        label="跟踪号"
        width="150"
      />
      <el-table-column
        prop="shipment.eta"
        label="预计到达时间"
        width="120"
      >
        <template #default="{ row }">
          {{ formatDate(row.shipment?.eta) }}
        </template>
      </el-table-column>

      <!-- 系统集成 -->
      <el-table-column
        prop="systemMapping.rms.status"
        label="RMS状态"
        width="120"
      />
      <el-table-column
        prop="systemMapping.rms.closedTime"
        label="RMA关闭时间"
        width="150"
      >
        <template #default="{ row }">
          {{ formatDateTime(row.systemMapping?.rms?.closedTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="systemMapping.wms.dnNumber"
        label="WMS出库单"
        width="150"
      />

      <!-- 操作信息 -->
      <el-table-column
        prop="createBy"
        label="创建人"
        width="120"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="150"
      >
        <template #default="{ row }">
          {{ formatDateTime(row.createTime) }}
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
      >
        <template #default="{ row }">
          <el-button-group>
            <el-button
              v-for="action in getAvailableActions(row)"
              :key="action.type"
              :type="action.buttonType"
              size="small"
              @click="handleAction(action.type, row)"
            >
              {{ action.label }}
            </el-button>
          </el-button-group>
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
import { ref, computed } from 'vue'
import type { ReturnOrder } from '../../types'
import { useReturnStatus } from '../../composables/useReturnStatus'
import { formatDate, formatDateTime } from '@/utils/date'

const props = defineProps<{
  data: ReturnOrder[]
  loading: boolean
  total: number
}>()

const emit = defineEmits<{
  (e: 'action', type: string, row: ReturnOrder): void
  (e: 'page-change', page: number): void
  (e: 'size-change', size: number): void
}>()

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 状态管理
const { getStatusLabel, getStatusColor } = useReturnStatus(null)

// 获取状态类型
const getStatusType = (status: string) => {
  const color = getStatusColor(status)
  switch (color) {
    case 'success': return ''
    case 'warning': return 'warning'
    case 'danger': return 'danger'
    default: return 'info'
  }
}

// 获取可用操作
const getAvailableActions = (row: ReturnOrder) => {
  const actions = []

  // 查看详情
  actions.push({
    type: 'view',
    label: '查看',
    buttonType: 'primary'
  })

  // 根据状态添加其他操作按钮
  if (row.status === 'DRAFT' || row.status === 'PENDING_REVIEW') {
    actions.push({
      type: 'edit',
      label: '编辑',
      buttonType: 'warning'
    })
  }

  if (row.status !== 'COMPLETED' && row.status !== 'CANCELLED') {
    actions.push({
      type: 'process',
      label: '处理',
      buttonType: 'success'
    })
  }

  return actions
}

// 处理操作
const handleAction = (type: string, row: ReturnOrder) => {
  emit('action', type, row)
}

// 处理分页
const handleSizeChange = (size: number) => {
  emit('size-change', size)
}

const handleCurrentChange = (page: number) => {
  emit('page-change', page)
}
</script>

<style lang="scss" scoped>
.return-table {
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style> 