<template>
  <div class="inventory-detail">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1>{{ skuInfo.name }}</h1>
          <div class="sku-info">
            <span class="label">SKU</span>
            <span class="value">{{ skuInfo.sku }}</span>
          </div>
        </div>
        <div class="location-section">
          <span class="label">Location</span>
          <el-select v-model="selectedLocation" placeholder="Select Location" class="location-select">
            <el-option
              v-for="loc in locationOptions"
              :key="loc.value"
              :label="loc.label"
              :value="loc.value"
            >
              <div class="location-option">
                <span>{{ loc.label }}</span>
                <el-tag size="small" :type="loc.status === 'Active' ? 'success' : 'warning'">
                  {{ loc.status }}
                </el-tag>
              </div>
            </el-option>
          </el-select>
          <el-button link type="primary" class="view-location-btn">
            View location
          </el-button>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleLockInventory">
          <el-icon><Lock /></el-icon>Lock Inventory
        </el-button>
        <el-button type="primary" @click="handleCopy">
          <el-icon><CopyDocument /></el-icon>Copy
        </el-button>
        <el-button type="primary" @click="handleSync">
          <el-icon><Refresh /></el-icon>Sync
        </el-button>
        <el-button type="danger" @click="handleDelete">
          <el-icon><Delete /></el-icon>Delete
        </el-button>
      </div>
    </div>

    <!-- 库存状态卡片 -->
    <div class="inventory-status">
      <div class="status-item" v-for="(item, index) in statusItems" :key="index">
        <div class="status-header">
          <span class="status-label">{{ item.label }}</span>
          <el-icon v-if="item.editable" class="edit-icon" @click="handleEdit(item)">
            <Edit />
          </el-icon>
        </div>
        <div class="status-value" :class="{ negative: item.value < 0 }">
          {{ item.value }}
        </div>
      </div>
    </div>

    <!-- 趋势图 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>Inventory Activities</span>
          <div class="header-actions">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              @change="handleDateChange"
            />
          </div>
        </div>
      </template>
      <div class="chart-filters">
        <div class="filter-row">
          <el-select v-model="eventType" placeholder="Event Type" clearable>
            <el-option label="All Events" value="" />
            <el-option label="Fulfill" value="fulfill" />
            <el-option label="Release" value="release" />
            <el-option label="Ship" value="ship" />
          </el-select>
          <el-select v-model="inventoryId" placeholder="Inventory ID" clearable>
            <el-option v-for="id in inventoryIds" :key="id" :label="id" :value="id" />
          </el-select>
          <el-select v-model="entityId" placeholder="Entity ID" clearable>
            <el-option v-for="id in entityIds" :key="id" :label="id" :value="id" />
          </el-select>
          <el-select v-model="available" placeholder="Available" clearable>
            <el-option label="All" value="" />
            <el-option label="Yes" value="yes" />
            <el-option label="No" value="no" />
          </el-select>
          <el-select v-model="onHand" placeholder="On Hand" clearable>
            <el-option label="All" value="" />
            <el-option label="Yes" value="yes" />
            <el-option label="No" value="no" />
          </el-select>
        </div>
        <div class="metrics-row">
          <el-checkbox-group v-model="selectedMetrics">
            <el-checkbox label="onHand">On Hand</el-checkbox>
            <el-checkbox label="committed">Committed</el-checkbox>
            <el-checkbox label="available">Available</el-checkbox>
            <el-checkbox label="future">Future</el-checkbox>
            <el-checkbox label="committedFuture">Committed Future</el-checkbox>
            <el-checkbox label="inbound">Inbound</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="chart-container">
        <el-empty v-if="!chartData.length" description="No data available" />
        <div v-else ref="chartRef" style="width: 100%; height: 400px"></div>
      </div>
    </el-card>

    <!-- 事件记录表格 -->
    <el-card class="event-history">
      <template #header>
        <div class="card-header">
          <h3 class="section-title">Event History</h3>
        </div>
      </template>

      <div class="filter-section">
        <div class="filter-row">
          <div class="date-range">
            <el-date-picker
              v-model="eventFilters.dateRange[0]"
              type="date"
              placeholder="Start date"
              class="date-picker"
              :clearable="true"
              value-format="YYYY-MM-DD"
              @change="handleSearch"
            />
            <span class="date-separator">to</span>
            <el-date-picker
              v-model="eventFilters.dateRange[1]"
              type="date"
              placeholder="End date"
              class="date-picker"
              :clearable="true"
              value-format="YYYY-MM-DD"
              @change="handleSearch"
            />
          </div>
          <el-select 
            v-model="eventFilters.eventType" 
            placeholder="Event Type"
            clearable
            class="dark-select"
          >
            <el-option 
              v-for="option in eventTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          <el-select 
            v-model="eventFilters.inventoryId" 
            placeholder="Inventory ID"
            clearable
            class="dark-select"
          >
            <el-option 
              v-for="id in inventoryIds"
              :key="id"
              :label="id"
              :value="id"
            />
          </el-select>
          <el-select 
            v-model="eventFilters.entityId" 
            placeholder="Entity ID"
            clearable
            class="dark-select"
          >
            <el-option 
              v-for="id in entityIds"
              :key="id"
              :label="id"
              :value="id"
            />
          </el-select>
          <el-select 
            v-model="eventFilters.available" 
            placeholder="Available"
            clearable
            class="dark-select"
          >
            <el-option label="Yes" value="yes" />
            <el-option label="No" value="no" />
          </el-select>
          <el-select 
            v-model="eventFilters.onHand" 
            placeholder="On Hand"
            clearable
            class="dark-select"
          >
            <el-option label="Yes" value="yes" />
            <el-option label="No" value="no" />
          </el-select>
        </div>
      </div>

      <el-table :data="eventList" style="width: 100%">
        <el-table-column prop="date" label="Date" width="150">
          <template #default="{ row }">
            {{ formatDate(row.date) }}
          </template>
        </el-table-column>
        <el-table-column prop="event" label="Event">
          <template #default="{ row }">
            <span>{{ row.event }} </span>
            <el-link type="primary" v-if="row.id">#{{ row.id }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="onHand" label="On Hand" align="right" />
        <el-table-column prop="committed" label="Committed" align="right" />
        <el-table-column prop="available" label="Available" align="right" />
        <el-table-column prop="future" label="Future" align="right" />
        <el-table-column prop="committedFuture" label="Comm. Future" align="right" />
        <el-table-column prop="inbound" label="Inbound" align="right" />
        <el-table-column prop="unavailable" label="Unavailable" align="right" />
        <el-table-column fixed="right" label="" width="80">
          <template #default>
            <el-button link type="primary">View JSON</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Lock Inventory Dialog -->
    <el-dialog
      v-model="showLockDialog"
      title="Lock inventory"
      width="600px"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <div class="lock-dialog-content">
        <p class="description">
          Locking inventory is used when you want to stop ingesting new changes for this inventory record. Manual adjustments will still be allowed.
        </p>

        <div class="lock-options">
          <el-radio-group v-model="lockForm.lockType">
            <el-radio
              v-for="option in lockTypeOptions"
              :key="option.value"
              :label="option.value"
              class="lock-option"
            >
              {{ option.label }}
            </el-radio>
          </el-radio-group>
        </div>

        <div v-if="lockForm.lockType === 'manual'" class="manual-inputs">
          <div class="input-group">
            <div class="input-item">
              <span class="label">On Hand</span>
              <el-input-number 
                v-model="lockForm.onHand" 
                :min="0"
                controls-position="right"
              />
            </div>
            <div class="input-item">
              <span class="label">Committed</span>
              <el-input-number 
                v-model="lockForm.committed" 
                :min="0"
                controls-position="right"
              />
            </div>
            <div class="input-item">
              <span class="label">Unavailable</span>
              <el-input-number 
                v-model="lockForm.unavailable" 
                :min="0"
                controls-position="right"
              />
            </div>
            <div class="input-item">
              <span class="label">Available (Calculated)</span>
              <el-input-number 
                v-model="lockForm.available" 
                :min="0"
                controls-position="right"
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showLockDialog = false">Cancel</el-button>
          <el-button type="primary" @click="confirmLock">Confirm</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Back as ArrowLeft,
  Lock,
  DocumentCopy as CopyDocument,
  RefreshRight as Refresh,
  Delete,
  EditPen as Edit
} from '@element-plus/icons-vue'
import type { MessageBoxData } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { VChart } from 'vue-echarts'
import { Download } from '@element-plus/icons-vue'

// 类型定义
interface ChartDataItem {
  date: string
  inventoryId?: string
  entityId?: string
  onHand: number
  committed: number
  available: number
  future: number
  committedFuture: number
  inbound: number
}

const router = useRouter()
const route = useRoute()

// SKU基本信息
const skuInfo = ref({
  sku: route.params.id,
  name: 'Camera',
  location: 'UNIS - 890'
})

// 库存状态数据
const statusItems = ref([
  { label: 'On Hand', value: 0, editable: true },
  { label: 'Committed', value: 0, editable: false },
  { label: 'Available', value: -1, editable: false },
  { label: 'Future', value: 0, editable: true },
  { label: 'Committed Future', value: 0, editable: false },
  { label: 'Inbound', value: 0, editable: true },
  { label: 'Unavailable', value: 0, editable: true }
])

// 图表相关
const chartRef = ref<HTMLElement>()
const dateRange = ref([])
const selectedMetrics = ref(['onHand', 'committed', 'available'])

// 图表配置和数据
const chartOption = computed(() => ({
  title: {
    text: 'Inventory Activities',
    left: 'left',
    top: '10px',
    textStyle: {
      color: 'var(--el-text-color-primary)',
      fontSize: 14,
      fontWeight: 'normal'
    }
  },
  tooltip: {
    trigger: 'axis',
    formatter: (params: any) => {
      const date = params[0].axisValue;
      let html = `${date}<br/>`;
      params.forEach((item: any) => {
        html += `${item.marker}${item.seriesName}: ${item.value}<br/>`;
      });
      return html;
    }
  },
  legend: {
    data: ['On Hand', 'Committed', 'Available', 'Future', 'Committed Future', 'Inbound'],
    bottom: '0',
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8,
    textStyle: {
      color: 'var(--el-text-color-regular)',
      fontSize: 12
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    top: '40px',
    bottom: '30px',
    containLabel: true
  },
  xAxis: {
    type: 'time',
    boundaryGap: false,
    axisLine: {
      lineStyle: {
        color: 'var(--el-border-color-lighter)'
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: 'var(--el-text-color-regular)',
      formatter: (value: string) => {
        return dayjs(value).format('MM/DD')
      }
    },
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: 'var(--el-text-color-regular)'
    },
    splitLine: {
      lineStyle: {
        color: 'var(--el-border-color-lighter)',
        type: 'dashed'
      }
    }
  },
  series: [
    {
      name: 'On Hand',
      type: 'line',
      symbol: 'circle',
      symbolSize: 6,
      sampling: 'average',
      itemStyle: {
        color: '#FF6B6B'
      },
      lineStyle: {
        width: 2
      },
      emphasis: {
        focus: 'series'
      },
      data: chartData.value.map(item => [item.date, item.onHand])
    },
    {
      name: 'Committed',
      type: 'line',
      symbol: 'circle',
      symbolSize: 6,
      sampling: 'average',
      itemStyle: {
        color: '#4ECDC4'
      },
      lineStyle: {
        width: 2
      },
      emphasis: {
        focus: 'series'
      },
      data: chartData.value.map(item => [item.date, item.committed])
    },
    {
      name: 'Available',
      type: 'line',
      symbol: 'circle',
      symbolSize: 6,
      sampling: 'average',
      itemStyle: {
        color: '#FFD93D'
      },
      lineStyle: {
        width: 2
      },
      emphasis: {
        focus: 'series'
      },
      data: chartData.value.map(item => [item.date, item.available])
    },
    {
      name: 'Future',
      type: 'line',
      symbol: 'circle',
      symbolSize: 6,
      sampling: 'average',
      itemStyle: {
        color: '#6C5CE7'
      },
      lineStyle: {
        width: 2
      },
      emphasis: {
        focus: 'series'
      },
      data: chartData.value.map(item => [item.date, item.future])
    },
    {
      name: 'Committed Future',
      type: 'line',
      symbol: 'circle',
      symbolSize: 6,
      sampling: 'average',
      itemStyle: {
        color: '#A8E6CF'
      },
      lineStyle: {
        width: 2
      },
      emphasis: {
        focus: 'series'
      },
      data: chartData.value.map(item => [item.date, item.committedFuture])
    },
    {
      name: 'Inbound',
      type: 'line',
      symbol: 'circle',
      symbolSize: 6,
      sampling: 'average',
      itemStyle: {
        color: '#FF8B94'
      },
      lineStyle: {
        width: 2
      },
      emphasis: {
        focus: 'series'
      },
      data: chartData.value.map(item => [item.date, item.inbound])
    }
  ]
}))

// 模拟图表数据
const mockChartData = [
  {
    date: '2024-07-18',
    onHand: 1,
    committed: 1,
    available: 0,
    future: 0,
    committedFuture: 0,
    inbound: 0
  },
  {
    date: '2024-07-19',
    onHand: 1,
    committed: 1,
    available: 0,
    future: 0,
    committedFuture: 0,
    inbound: 0
  },
  {
    date: '2024-07-21',
    onHand: 0,
    committed: 0,
    available: 0,
    future: 0,
    committedFuture: 0,
    inbound: 0
  },
  {
    date: '2024-07-22',
    onHand: 0,
    committed: 1,
    available: -1,
    future: 0,
    committedFuture: 0,
    inbound: 0
  }
]

// 模拟库存流水数据 - 倒序排列，展示完整的库存变化逻辑
const mockEventList = [
  {
    date: '2024-07-24 14:30',
    event: 'Fulfill',
    id: '1944',
    onHand: 1,    // 扣减实际库存
    committed: 0,  // 清除预占
    available: 1,
    future: 0,
    committedFuture: 0,
    inbound: 0,
    unavailable: 0
  },
  {
    date: '2024-07-24 09:18',
    event: 'Ship',
    id: '1944',
    onHand: 2,    // 发货前状态
    committed: 1,  // 已预占
    available: 1,
    future: 0,
    committedFuture: 0,
    inbound: 0,
    unavailable: 0
  },
  {
    date: '2024-07-24 09:15',
    event: 'Lock',
    id: '1944',
    onHand: 2,    // 初始库存
    committed: 1,  // 锁定预占
    available: 1,  // 剩余可用
    future: 0,
    committedFuture: 0,
    inbound: 0,
    unavailable: 0
  },
  {
    date: '2024-07-23 17:46',
    event: 'Fulfill',
    id: '1943',
    onHand: 0,    // 无实物库存
    committed: 0,  // 清除预占
    available: -1, // 负可用
    future: 0,
    committedFuture: 0,
    inbound: 0,
    unavailable: 0
  },
  {
    date: '2024-07-22 08:29',
    event: 'Release',
    id: '1943',
    onHand: 0,    // 无实物库存
    committed: 1,  // 保持预占
    available: -1, // 负可用
    future: 0,
    committedFuture: 0,
    inbound: 0,
    unavailable: 0
  },
  {
    date: '2024-07-22 08:28',
    event: 'Lock',
    id: '1943',
    onHand: 0,    // 无实物库存
    committed: 1,  // 锁定预占
    available: -1, // 负可用
    future: 0,
    committedFuture: 0,
    inbound: 0,
    unavailable: 0
  },
  {
    date: '2024-07-21 16:56',
    event: 'Shipcancelrestock',
    id: '1942',
    onHand: 0,    // 库存已出
    committed: 0,  // 清除预占
    available: 0,  // 可用为0
    future: 0,
    committedFuture: 0,
    inbound: 0,
    unavailable: 0
  },
  {
    date: '2024-07-18 10:29',
    event: 'Ship',
    id: '1942',
    onHand: 1,    // 发货前状态
    committed: 1,  // 已预占
    available: -1, // 超卖
    future: 0,
    committedFuture: 0,
    inbound: 0,
    unavailable: 0
  },
  {
    date: '2024-07-18 10:26',
    event: 'Lock',
    id: '1942',
    onHand: 1,    // 初始库存
    committed: 1,  // 锁定预占
    available: 0,  // 无可用
    future: 0,
    committedFuture: 0,
    inbound: 0,
    unavailable: 0
  }
]

// 更新事件列表数据
const eventList = ref(mockEventList)

// 更新图表数据，根据事件列表生成趋势数据
const generateChartData = () => {
  const chartData = []
  mockEventList.forEach(event => {
    chartData.push({
      date: event.date,
      onHand: event.onHand,
      committed: event.committed,
      available: event.available,
      future: event.future,
      committedFuture: event.committedFuture,
      inbound: event.inbound,
      unavailable: event.unavailable
    })
  })
  return chartData
}

// 初始化图表数据
const chartData = ref(generateChartData())

// 更新图表数据的方法
const updateChartData = () => {
  // TODO: 调用API获取实际数据
  chartData.value = mockChartData
}

// 事件记录
const eventType = ref('')

// 新增筛选条件
const inventoryId = ref('')
const entityId = ref('')
const available = ref('')
const onHand = ref('')

// 库存流水的筛选条件
const eventFilters = ref({
  dateRange: [],
  eventType: '',
  inventoryId: '',
  entityId: '',
  available: '',
  onHand: ''
})

// 事件类型选项
const eventTypeOptions = [
  { label: 'Lock', value: 'lock' },
  { label: 'Release', value: 'release' },
  { label: 'Ship', value: 'ship' },
  { label: 'Fulfill', value: 'fulfill' },
  { label: 'Shipcancelrestock', value: 'shipcancelrestock' }
]

// 模拟数据
const inventoryIds = ref(['1942', '1943', '1944'])
const entityIds = ref(['E1942', 'E1943', 'E1944'])

// 位置选项
const locationOptions = [
  { 
    label: 'UNIS - 890 [Source: Inlet]',
    value: 'UNIS-890',
    status: 'Active'
  },
  // 可以添加更多位置选项
]

const selectedLocation = ref('UNIS-890')

// 添加锁定库存的对话框组件
const showLockDialog = ref(false)
const lockForm = ref({
  lockType: 'keep',
  onHand: 0,
  committed: 0,
  unavailable: 0,
  available: 0
})

// 锁定类型选项
const lockTypeOptions = [
  { label: 'Keep current inventory levels', value: 'keep' },
  { label: 'Clear on hand inventory', value: 'clearOnHand' },
  { label: 'Clear available inventory', value: 'clearAvailable' },
  { label: 'Manually set inventory levels', value: 'manual' }
]

// 方法
const handleEdit = (item: any) => {
  // TODO: 实现编辑逻辑
  ElMessage.info('编辑功能开发中')
}

// 处理锁定库存
const handleLockInventory = () => {
  showLockDialog.value = true
}

// 确认锁定
const confirmLock = async () => {
  try {
    // TODO: 调用API锁定库存
    ElMessage.success('Inventory locked successfully')
    showLockDialog.value = false
  } catch (error) {
    ElMessage.error('Failed to lock inventory')
  }
}

const handleCopy = () => {
  // TODO: 实现复制逻辑
  ElMessage.success('复制成功')
}

const handleSync = () => {
  // TODO: 实现同步逻辑
  ElMessage.success('同步成功')
}

const handleDelete = () => {
  ElMessageBox.confirm(
    '确定要删除该SKU吗？此操作不可恢复。',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error',
    }
  ).then(() => {
    ElMessage.success('删除成功')
    router.back()
  }).catch(() => {
    // 用户取消删除
  })
}

const handleDateChange = () => {
  // TODO: 实现日期变更逻辑
  updateChart()
}

const getEventTagType = (event: string) => {
  const types: Record<string, string> = {
    'Fulfill': 'success',
    'Release': 'warning',
    'Ship': 'info'
  }
  return types[event] || 'default'
}

const viewEventDetail = (row: any) => {
  ElMessageBox.alert(JSON.stringify(row, null, 2), 'Event Detail', {
    confirmButtonText: 'OK'
  })
}

// 图表初始化
const initChart = () => {
  if (!chartRef.value) return
  
  const chart = echarts.init(chartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      }
    },
    legend: {
      data: ['On Hand', 'Committed', 'Available', 'Future', 'Committed Future', 'Inbound']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.value.map(item => item.date)
    },
    yAxis: {
      type: 'value'
    },
    series: selectedMetrics.value.map(metric => ({
      name: metric.charAt(0).toUpperCase() + metric.slice(1),
      type: 'line',
      data: chartData.value.map(item => item[metric as keyof ChartDataItem])
    }))
  }
  
  chart.setOption(option)
}

// 更新图表方法
const updateChart = () => {
  if (!chartRef.value) return
  
  // 根据筛选条件过滤数据
  const filteredData = chartData.value.filter(item => {
    if (inventoryId.value && !item.inventoryId?.includes(inventoryId.value)) return false
    if (entityId.value && !item.entityId?.includes(entityId.value)) return false
    if (available.value) {
      if (available.value === 'yes' && item.available <= 0) return false
      if (available.value === 'no' && item.available > 0) return false
    }
    if (onHand.value) {
      if (onHand.value === 'yes' && item.onHand <= 0) return false
      if (onHand.value === 'no' && item.onHand > 0) return false
    }
    return true
  })

  const chart = echarts.init(chartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      }
    },
    legend: {
      data: selectedMetrics.value.map(metric => 
        metric.charAt(0).toUpperCase() + metric.slice(1)
      )
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: filteredData.map(item => item.date)
    },
    yAxis: {
      type: 'value'
    },
    series: selectedMetrics.value.map(metric => ({
      name: metric.charAt(0).toUpperCase() + metric.slice(1),
      type: 'line',
      data: filteredData.map(item => item[metric as keyof ChartDataItem] || 0)
    }))
  }
  
  chart.setOption(option)
}

// 监听选中指标变化
watch(selectedMetrics, () => {
  updateChart()
})

// 监听筛选条件变化
watch([inventoryId, entityId, available, onHand], () => {
  updateChart()
})

// 日期格式化
const formatDate = (date: string) => {
  return dayjs(date).format('MM/DD/YYYY HH:mm')
}

onMounted(() => {
  initChart()
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    if (!chartRef.value) return
    const chart = echarts.getInstanceByDom(chartRef.value)
    chart?.resize()
  })
})
</script>

<style lang="scss" scoped>
.inventory-detail {
  padding: 24px;
  background-color: var(--el-bg-color);
  min-height: 100vh;

  .page-header {
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .header-content {
      .title-section {
        margin-bottom: 16px;

        h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 500;
          color: var(--el-text-color-primary);
        }

        .sku-info {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 8px;

          .label {
            color: var(--el-text-color-secondary);
            font-size: 14px;
          }

          .value {
            color: var(--el-text-color-primary);
            font-size: 14px;
            font-weight: 500;
          }
        }
      }

      .location-section {
        display: flex;
        align-items: center;
        gap: 12px;

        .label {
          color: var(--el-text-color-secondary);
          font-size: 14px;
        }

        .location-select {
          width: 240px;
        }

        .view-location-btn {
          padding: 0;
        }
      }
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }

  .inventory-status {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
    margin-bottom: 24px;

    .status-item {
      background-color: var(--el-bg-color-overlay);
      border-radius: 4px;
      padding: 16px;
      box-shadow: var(--el-box-shadow-light);

      .status-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .status-label {
          color: var(--el-text-color-secondary);
          font-size: 14px;
        }

        .edit-icon {
          cursor: pointer;
          color: var(--el-text-color-secondary);
          font-size: 16px;

          &:hover {
            color: var(--el-text-color-primary);
          }
        }
      }

      .status-value {
        font-size: 24px;
        font-weight: 500;
        color: var(--el-text-color-primary);

        &.negative {
          color: var(--el-color-danger);
        }
      }
    }
  }

  .chart-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chart-filters {
      margin-bottom: 20px;
      
      .filter-row {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
        
        .el-select {
          width: 180px;
        }
      }
      
      .metrics-row {
        .el-checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
      }
    }

    .chart-container {
      min-height: 400px;
      border: 1px solid var(--el-border-color-light);
      border-radius: 4px;
      padding: 16px;
    }
  }

  .event-history {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0;

      .section-title {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }
    }

    .filter-section {
      margin-bottom: 24px;

      .filter-row {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;

        .date-range {
          display: flex;
          align-items: center;
          gap: 4px;

          .date-picker {
            width: 130px;
          }

          .date-separator {
            color: var(--el-text-color-regular);
            padding: 0 4px;
          }
        }

        .dark-select {
          width: 160px;
          :deep(.el-input__wrapper) {
            background-color: var(--el-fill-color-darker);
            box-shadow: none;
            border-radius: 4px;

            &.is-focus {
              box-shadow: 0 0 0 1px var(--el-color-primary) inset;
            }
          }
        }
      }
    }
  }

  :deep(.location-option) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .lock-dialog-content {
    .description {
      color: var(--el-text-color-regular);
      margin-bottom: 24px;
      line-height: 1.5;
    }

    .lock-options {
      margin-bottom: 24px;

      .lock-option {
        display: block;
        margin-bottom: 12px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .manual-inputs {
      .input-group {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }

      .input-item {
        .label {
          display: block;
          color: var(--el-text-color-regular);
          margin-bottom: 8px;
        }

        :deep(.el-input-number) {
          width: 100%;
        }
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style> 