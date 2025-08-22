<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? 'Edit Safety Stock Config' : 'New Safety Stock Config'"
    width="700px"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      size="default"
    >
      <!-- Basic Info -->
      <el-form-item label="Config Name" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="Enter config name, e.g.: Amazon Best Sellers Safety Stock"
          style="width: 100%;"
        />
      </el-form-item>

      <!-- Channel Selection -->
      <el-form-item label="Channel" prop="channelScope">
        <div style="display: flex; gap: 8px; align-items: center;">
          <el-radio-group v-model="formData.channelScope" @change="handleChannelScopeChange" style="margin-right: 16px;">
            <el-radio label="all">All Channels</el-radio>
            <el-radio label="specific">Select Channels</el-radio>
          </el-radio-group>
          <el-select
            v-if="formData.channelScope === 'specific'"
            v-model="formData.channelIds"
            multiple
            filterable
            style="flex: 1;"
            @change="handleChannelsChange"
            placeholder="Select channels"
          >
            <el-option
              v-for="channel in channels"
              :key="channel.id"
              :label="channel.name"
              :value="channel.id"
            />
          </el-select>
        </div>
      </el-form-item>

      <!-- Store Selection -->
      <el-form-item 
        v-if="formData.channelScope === 'specific' && formData.channelIds?.length" 
        label="Stores" 
        prop="storeIds"
      >
        <div style="display: flex; gap: 8px; align-items: center;">
          <el-radio-group v-model="formData.storeScope" @change="handleStoreScopeChange" style="margin-right: 16px;">
            <el-radio label="all">All Stores</el-radio>
            <el-radio label="specific">Select Stores</el-radio>
          </el-radio-group>
          <el-select
            v-if="formData.storeScope === 'specific'"
            v-model="formData.storeIds"
            multiple
            filterable
            style="flex: 1;"
            placeholder="Select stores"
          >
            <el-option
              v-for="store in availableStores"
              :key="store.id"
              :label="store.name"
              :value="store.id"
            />
          </el-select>
        </div>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Safety Stock" prop="minStockQuantity">
            <div style="display: flex; gap: 8px;">
              <el-input-number
                v-model="formData.minStockQuantity"
                :min="0"
                controls-position="right"
                style="width: 120px;"
              />
              <el-select
                v-model="formData.minStockType"
                style="width: 80px;"
              >
                <el-option label="Qty" value="quantity" />
                <el-option label="%" value="percentage" />
              </el-select>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Alert At" prop="alertThreshold">
            <div style="display: flex; align-items: center; gap: 8px;">
              <el-input-number
                v-model="formData.alertThreshold"
                :min="1"
                :max="100"
                controls-position="right"
                style="width: 120px;"
              />
              <span>%</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Deduct From" prop="deductions">
            <el-checkbox-group v-model="formData.deductions">
              <el-checkbox label="unified_fulfillment">Unified Fulfillment</el-checkbox>
              <el-checkbox label="per_warehouse_fulfillment">Per Warehouse Fulfillment</el-checkbox>
              <el-checkbox label="sync">Channel Sync</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Status" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio label="active">Active</el-radio>
              <el-radio label="inactive">Inactive</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="Description" prop="description">
        <el-input
          v-model="formData.description"
          placeholder="Optional description..."
        />
      </el-form-item>
    </el-form>

    <!-- Action Buttons -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="handleSubmit"
        >
          {{ isEdit ? 'Save' : 'Create' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Delete, Goods, InfoFilled } from '@element-plus/icons-vue'
import { safetyStockApi, safetyStockBaseApi } from '@/api/safetyStock'
import type {
  FlexibleSafetyStockConfig,
  SafetyStockStatus,
  AlertType,
  ChannelScopeType,
  StoreScopeType,
  ChannelOption,
  StoreOption,
  SkuOption
} from '@/types/safetyStock'

// Props
interface Props {
  visible: boolean
  configData: Partial<FlexibleSafetyStockConfig>
  isEdit: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  configData: () => ({}),
  isEdit: false
})

// Emits
const emit = defineEmits<{
  'update:visible': [visible: boolean]
  success: []
}>()

// 响应式数据
const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const skuSearchLoading = ref(false)

const channels = ref<ChannelOption[]>([])
const stores = ref<StoreOption[]>([])
const availableSkus = ref<SkuOption[]>([])

// 表单数据
const formData = reactive<Partial<FlexibleSafetyStockConfig>>({
  name: '',
  status: 'active' as SafetyStockStatus,
  channelScope: 'all' as ChannelScopeType,
  storeScope: 'all' as StoreScopeType,
  channelIds: [],
  storeIds: [],
  specialSkus: [],
  specialSkuConfigs: {},
  minStockQuantity: 100,
  minStockType: 'quantity', // 新增：库存类型（quantity | percentage）
  maxStockQuantity: undefined,
  maxStockType: 'quantity', // 新增：库存类型（quantity | percentage）
  alertType: ['low_stock'] as AlertType[],
  alertThreshold: 20,
  disableWmsSync: false,
  disableThirdPartySync: false,
  priority: 1,
  description: ''
})

// 计算属性
const dialogVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value)
})

const availableStores = computed(() => {
  if (!formData.channelIds?.length) return []
  return stores.value.filter(store => formData.channelIds?.includes(store.channelId))
})

// 表单验证规则
const formRules = reactive<FormRules>({
  name: [
    { required: true, message: 'Please enter config name', trigger: 'blur' },
    { min: 2, max: 50, message: 'Config name length should be 2-50 characters', trigger: 'blur' }
  ],
  channelScope: [{ required: true, message: 'Please select channel scope', trigger: 'change' }],
  channelIds: [
    {
      validator: (rule, value, callback) => {
        if (formData.channelScope === 'specific' && (!value || value.length === 0)) {
          callback(new Error('Please select at least one channel'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  storeScope: [
    {
      validator: (rule, value, callback) => {
        if (formData.channelScope === 'specific' && formData.channelIds?.length && !value) {
          callback(new Error('Please select store scope'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  storeIds: [
    {
      validator: (rule, value, callback) => {
        if (formData.storeScope === 'specific' && (!value || value.length === 0)) {
          callback(new Error('Please select at least one store'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  minStockQuantity: [
    { required: true, message: 'Please enter minimum stock quantity', trigger: 'blur' },
    { type: 'number', min: 0, message: 'Minimum stock cannot be less than 0', trigger: 'blur' }
  ],
  maxStockQuantity: [
    {
      validator: (rule, value, callback) => {
        if (value && value <= formData.minStockQuantity) {
          callback(new Error('Maximum stock must be greater than minimum stock'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  alertType: [
    { required: true, type: 'array', min: 1, message: 'Please select at least one alert type', trigger: 'change' }
  ],
  alertThreshold: [
    { required: true, message: 'Please enter alert threshold', trigger: 'blur' },
    { type: 'number', min: 1, max: 100, message: 'Alert threshold range: 1-100', trigger: 'blur' }
  ]
})

// 方法
const loadChannels = async () => {
  try {
    const response = await safetyStockBaseApi.getChannels()
    channels.value = response.data
  } catch (error) {
    console.error('Failed to load channels:', error)
  }
}

const loadStores = async (channelId?: string) => {
  try {
    const response = await safetyStockBaseApi.getStores(channelId)
    stores.value = response.data
  } catch (error) {
    console.error('Failed to load stores:', error)
  }
}

const searchSkus = async (keyword: string) => {
  if (!keyword) {
    availableSkus.value = []
    return
  }

  skuSearchLoading.value = true
  try {
    const response = await safetyStockBaseApi.searchSkus({
      keyword,
      storeId: formData.storeId as string,
      channelId: formData.channelId as string,
      pageSize: 20
    })
    availableSkus.value = response.data.data
  } catch (error) {
    console.error('Failed to search SKUs:', error)
  } finally {
    skuSearchLoading.value = false
  }
}

const handleChannelScopeChange = () => {
  // 清空渠道相关字段
  formData.channelIds = []
  formData.storeIds = []
  formData.storeScope = 'all'
  
  // 重新验证表单
  nextTick(() => {
    formRef.value?.clearValidate(['channelIds', 'storeScope', 'storeIds'])
  })
}

const handleChannelsChange = () => {
  // 清空店铺相关字段
  formData.storeIds = []
  formData.storeScope = 'all'
  
  // 加载选中渠道下的店铺
  if (formData.channelIds?.length) {
    loadStores()
  }
  
  nextTick(() => {
    formRef.value?.clearValidate(['storeScope', 'storeIds'])
  })
}

const handleStoreScopeChange = () => {
  // 清空店铺选择
  formData.storeIds = []
  
  nextTick(() => {
    formRef.value?.clearValidate(['storeIds'])
  })
}

// 添加特殊SKU
const addSpecialSku = async () => {
  try {
    const { value: sku } = await ElMessageBox.prompt(
      'Please enter SKU code',
      'Add Special SKU',
      {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        inputPattern: /^.{1,50}$/,
        inputErrorMessage: 'SKU code cannot be empty and must not exceed 50 characters'
      }
    )
    
    if (sku && !formData.specialSkus?.includes(sku)) {
      if (!formData.specialSkus) formData.specialSkus = []
      if (!formData.specialSkuConfigs) formData.specialSkuConfigs = {}
      
      formData.specialSkus.push(sku)
      formData.specialSkuConfigs[sku] = {
        minStockQuantity: formData.minStockQuantity || 100,
        minStockType: 'quantity',
        maxStockQuantity: formData.maxStockQuantity,
        maxStockType: 'quantity',
        alertType: [...(formData.alertType || ['low_stock'])],
        alertThreshold: formData.alertThreshold || 20,
        disableWmsSync: formData.disableWmsSync || false,
        disableThirdPartySync: formData.disableThirdPartySync || false
      }
    } else if (formData.specialSkus?.includes(sku)) {
      ElMessage.warning('This SKU already exists')
    }
  } catch (error) {
    // 用户取消操作
  }
}

// 移除特殊SKU
const removeSpecialSku = (index: number) => {
  if (formData.specialSkus && formData.specialSkuConfigs) {
    const sku = formData.specialSkus[index]
    formData.specialSkus.splice(index, 1)
    delete formData.specialSkuConfigs[sku]
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch (error) {
    return
  }

  submitLoading.value = true
  try {
    if (props.isEdit && formData.id) {
      // 更新配置
      await safetyStockApi.updateSafetyStockConfig({
        id: formData.id,
        data: formData
      })
      ElMessage.success('Configuration updated successfully')
    } else {
      // 创建配置
      await safetyStockApi.createSafetyStockConfig({
        level: formData.level!,
        configs: [formData]
      })
      ElMessage.success('Configuration created successfully')
    }
    
    emit('success')
  } catch (error: any) {
    ElMessage.error(error.message || (props.isEdit ? 'Update failed' : 'Create failed'))
  } finally {
    submitLoading.value = false
  }
}

const handleClose = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    name: '',
    status: 'active' as SafetyStockStatus,
    channelScope: 'all' as ChannelScopeType,
    storeScope: 'all' as StoreScopeType,
    channelIds: [],
    storeIds: [],
    specialSkus: [],
    specialSkuConfigs: {},
    minStockQuantity: 100,
    minStockType: 'quantity',
    maxStockQuantity: undefined,
    maxStockType: 'quantity',
    alertType: ['low_stock'] as AlertType[],
    alertThreshold: 20,
    disableWmsSync: false,
    disableThirdPartySync: false,
    priority: 1,
    description: ''
  })
  availableSkus.value = []
  emit('update:visible', false)
}

// 监听props变化
watch(() => props.configData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    Object.assign(formData, newData)
    
    // 如果是编辑SKU配置，预加载SKU选项
    if (newData.level === 'sku' && newData.sku) {
      availableSkus.value = [{
        sku: newData.sku,
        productId: newData.productId || '',
        productName: newData.productName || '',
        category: newData.category || '',
        brand: newData.brand || '',
        status: 'active'
      }]
    }
  }
}, { immediate: true, deep: true })

watch(() => props.visible, (visible) => {
  if (visible) {
    loadChannels()
    loadStores()
  }
})
</script>

<style scoped lang="scss">
.dialog-footer {
  text-align: center;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>
