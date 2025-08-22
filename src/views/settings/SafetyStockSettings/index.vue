<template>
  <div class="safety-stock-settings">
    <div class="page-header">
      <h2>Safety Stock Settings</h2>
      <p class="page-description">Manage safety stock configurations at different levels: global, channel, store, and SKU</p>
    </div>



    <!-- 过滤器和操作栏 -->
    <el-card class="filter-card">
      <div class="filter-row">
        <div class="filter-left">
          <el-select
            v-model="queryParams.level"
            placeholder="Select Level"
            clearable
            style="width: 150px; margin-right: 12px;"
            @change="loadConfigs"
          >
            <el-option label="Global Config" value="global" />
            <el-option label="Channel Config" value="channel" />
            <el-option label="Store Config" value="store" />
            <el-option label="SKU Config" value="sku" />
          </el-select>

          <el-select
            v-model="queryParams.status"
            placeholder="Select Status"
            clearable
            style="width: 120px; margin-right: 12px;"
            @change="loadConfigs"
          >
            <el-option label="Active" value="active" />
            <el-option label="Inactive" value="inactive" />
          </el-select>

          <el-select
            v-model="queryParams.channelId"
            placeholder="Select Channel"
            clearable
            filterable
            style="width: 180px; margin-right: 12px;"
            @change="loadConfigs"
          >
            <el-option
              v-for="channel in channels"
              :key="channel.id"
              :label="channel.name"
              :value="channel.id"
            />
          </el-select>

          <el-input
            v-model="queryParams.keyword"
            placeholder="Search SKU or description"
            clearable
            style="width: 200px; margin-right: 12px;"
            @keyup.enter="loadConfigs"
            @clear="loadConfigs"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>

          <el-button type="primary" @click="loadConfigs">
            <el-icon><Search /></el-icon>
            Search
          </el-button>
        </div>

        <div class="filter-right">
          <el-button
            type="success"
            @click="showCreateDialog"
          >
            <el-icon><Plus /></el-icon>
            New Config
          </el-button>

          <el-dropdown @command="handleBatchAction" trigger="click">
            <el-button>
              Batch Actions
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="enable" :disabled="!hasSelection">Enable</el-dropdown-item>
                <el-dropdown-item command="disable" :disabled="!hasSelection">Disable</el-dropdown-item>
                <el-dropdown-item command="delete" :disabled="!hasSelection" divided>Delete</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-button @click="loadConfigs">
            <el-icon><Refresh /></el-icon>
            Refresh
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 配置列表 -->
    <el-card class="table-card">
      <el-table
        v-loading="tableLoading"
        :data="configList"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column type="selection" width="50" />
        
        <el-table-column label="Name" min-width="180">
          <template #default="{ row }">
            <div class="config-title">
              {{ row.name }}
              <el-tag
                :type="getLevelTagType(row.level)"
                size="small"
                style="margin-left: 8px;"
              >
                {{ getLevelText(row.level) }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Channel/Store" min-width="180">
          <template #default="{ row }">
            <template v-if="row.channelScope === 'specific'">
              <div>
                <el-tag size="small" type="info">
                  {{ row.channelIds?.length === 1 ? row.channelNames?.[0] : `${row.channelIds?.length} channels` }}
                </el-tag>
              </div>
              <div v-if="row.storeScope === 'specific'" style="margin-top: 4px;">
                <el-tag size="small" type="success">
                  {{ row.storeIds?.length === 1 ? row.storeNames?.[0] : `${row.storeIds?.length} stores` }}
                </el-tag>
              </div>
            </template>
            <el-tag v-else size="small" type="info">All Channels</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Safety Stock" width="150" align="center">
          <template #default="{ row }">
            {{ row.minStockQuantity }}
            <el-tag 
              v-if="row.minStockType" 
              :type="row.minStockType === 'percentage' ? 'warning' : 'info'"
              size="small"
              style="margin-left: 4px;"
            >
              {{ row.minStockType === 'percentage' ? '%' : 'Qty' }}
            </el-tag>
            <div class="alert-at">
              Alert at {{ row.alertThreshold }}%
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Deduct From" width="150">
          <template #default="{ row }">
            <div class="deduction-settings">
              <el-tag
                v-if="row.deductions?.includes('fulfillment')"
                type="success"
                size="small"
                style="margin-right: 4px;"
              >
                Fulfillment
              </el-tag>
              <el-tag
                v-if="row.deductions?.includes('sync')"
                type="success"
                size="small"
              >
                Channel
              </el-tag>
              <el-tag
                v-if="!row.deductions?.length"
                type="info"
                size="small"
              >
                None
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="Status" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="active"
              inactive-value="inactive"
              @change="toggleStatus(row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="Updated At" width="180">
          <template #default="{ row }">
            <div>{{ formatDateTime(row.updatedAt) }}</div>
            <div class="text-muted">by {{ row.updatedBy }}</div>
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="120" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="editConfig(row)"
            >
              Edit
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteConfig(row)"
            >
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadConfigs"
          @current-change="loadConfigs"
        />
      </div>
    </el-card>

    <!-- 创建/编辑对话框 -->
    <SafetyStockConfigDialog
      v-model:visible="dialogVisible"
      :config-data="currentConfig"
      :is-edit="isEdit"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
 import {
   Search,
   Plus,
   ArrowDown,
   Refresh
 } from '@element-plus/icons-vue'
 import { safetyStockApi, safetyStockBaseApi } from '@/api/safetyStock'
 import type {
   SafetyStockConfig,
   SafetyStockQueryParams,
   SafetyStockLevel,
   ChannelOption
 } from '@/types/safetyStock'
import SafetyStockConfigDialog from './components/SafetyStockConfigDialog.vue'

 // 响应式数据
 const tableLoading = ref(false)
 const configList = ref<SafetyStockConfig[]>([])
 const total = ref(0)
 const selectedConfigs = ref<SafetyStockConfig[]>([])
 const channels = ref<ChannelOption[]>([])

// 查询参数
const queryParams = reactive<SafetyStockQueryParams>({
  level: undefined,
  status: undefined,
  channelId: undefined,
  keyword: '',
  page: 1,
  pageSize: 20
})

// 对话框相关
const dialogVisible = ref(false)
const currentConfig = ref<Partial<SafetyStockConfig>>({})
const isEdit = ref(false)

// 计算属性
const hasSelection = computed(() => selectedConfigs.value.length > 0)

 // 方法
 const loadChannels = async () => {
  try {
    const response = await safetyStockBaseApi.getChannels()
    channels.value = response.data
  } catch (error) {
    console.error('Failed to load channels:', error)
  }
}

 const loadConfigs = async () => {
   tableLoading.value = true
   try {
     const response = await safetyStockApi.getSafetyStockConfigs(queryParams)
     configList.value = response.data.data
     total.value = response.data.total
   } catch (error) {
     ElMessage.error('Failed to load configurations')
   } finally {
     tableLoading.value = false
   }
 }

const getLevelTagType = (level: SafetyStockLevel) => {
  const types = {
    global: 'info',
    channel: 'primary',
    store: 'success',
    sku: 'warning'
  }
  return types[level] || 'info'
}

 const getLevelText = (level: SafetyStockLevel) => {
   const texts = {
     global: 'Global',
     channel: 'Channel',
     store: 'Store',
     sku: 'SKU'
   }
   return texts[level] || level
 }

const formatDateTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('zh-CN')
}

const handleSelectionChange = (selection: SafetyStockConfig[]) => {
  selectedConfigs.value = selection
}

const showCreateDialog = () => {
  currentConfig.value = {}
  isEdit.value = false
  dialogVisible.value = true
}

const editConfig = (config: SafetyStockConfig) => {
  currentConfig.value = { ...config }
  isEdit.value = true
  dialogVisible.value = true
}

 const deleteConfig = async (config: SafetyStockConfig) => {
   try {
     await ElMessageBox.confirm(
       `Are you sure to delete this ${getLevelText(config.level)} level safety stock configuration?`,
       'Confirm Delete',
       {
         confirmButtonText: 'Confirm',
         cancelButtonText: 'Cancel',
         type: 'warning'
       }
     )
     
     await safetyStockApi.deleteSafetyStockConfig(config.id!)
     ElMessage.success('Delete successful')
     await loadConfigs()
   } catch (error: any) {
     if (error !== 'cancel') {
       ElMessage.error('Delete failed')
     }
   }
 }

 const toggleStatus = async (config: SafetyStockConfig) => {
   try {
     await safetyStockApi.toggleSafetyStockConfig(config.id!, config.status)
     ElMessage.success('Status updated successfully')
   } catch (error) {
     // 恢复状态
     config.status = config.status === 'active' ? 'inactive' : 'active'
     ElMessage.error('Failed to update status')
   }
 }

 const handleBatchAction = async (action: string) => {
   if (!hasSelection.value) return
   
   const ids = selectedConfigs.value.map(c => c.id!)
   const actionTexts = {
     enable: 'enable',
     disable: 'disable',
     delete: 'delete'
   }
   
   try {
     await ElMessageBox.confirm(
       `Are you sure to ${actionTexts[action as keyof typeof actionTexts]} the selected ${ids.length} configurations?`,
       'Batch Action Confirmation',
       {
         confirmButtonText: 'Confirm',
         cancelButtonText: 'Cancel',
         type: 'warning'
       }
     )
     
     await safetyStockApi.batchOperateSafetyStockConfig({
       action: action as any,
       ids
     })
     
     ElMessage.success(`Batch ${actionTexts[action as keyof typeof actionTexts]} successful`)
     await loadConfigs()
   } catch (error: any) {
     if (error !== 'cancel') {
       ElMessage.error(`Batch ${actionTexts[action as keyof typeof actionTexts]} failed`)
     }
   }
 }

 const handleDialogSuccess = () => {
   dialogVisible.value = false
   loadConfigs()
 }

 // 生命周期
 onMounted(() => {
   loadChannels()
   loadConfigs()
 })
</script>

<style scoped lang="scss">
.safety-stock-settings {
  padding: 20px;

  .page-header {
    margin-bottom: 20px;
    
    h2 {
      margin: 0 0 8px 0;
      color: #303133;
      font-size: 24px;
      font-weight: 600;
    }
    
    .page-description {
      margin: 0;
      color: #606266;
      font-size: 14px;
    }
  }

  .filter-card {
    margin-bottom: 20px;
    
    .filter-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .filter-left {
        display: flex;
        align-items: center;
      }
      
      .filter-right {
        display: flex;
        align-items: center;
        gap: 12px;
      }
    }
  }

  .table-card {
    .config-details {
      .config-title {
        font-weight: 500;
        color: #303133;
        margin-bottom: 4px;
      }

      .config-scope {
        font-size: 13px;
        color: #606266;
        margin-top: 4px;

        .scope-label {
          color: #909399;
        }
      }
    }

    .alert-at {
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
    }

    .deduction-settings {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    
    .text-muted {
      font-size: 12px;
      color: #909399;
    }
    
    .pagination-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }
}

:deep(.el-card__body) {
  position: relative;
}
</style>
