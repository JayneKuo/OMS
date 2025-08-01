<template>
  <div class="mapping-settings">
    <div class="mapping-header">
      <div class="header-left">
        <div class="entity-selector">
          <h3>Entity Mappings <el-tooltip content="Help information about entity mappings"><el-icon><QuestionFilled /></el-icon></el-tooltip></h3>
          <el-select 
            v-model="selectedEntity" 
            placeholder="Select entity"
            @change="handleEntityChange"
          >
            <el-option label="Fulfillments" value="fulfillments" />
            <el-option label="Orders" value="orders" />
            <el-option label="Products" value="products" />
            <el-option label="Inventory" value="inventory" />
          </el-select>
        </div>
        <div class="direction-selector">
          <el-radio-group 
            v-model="mappingDirection" 
            size="small"
            @change="handleDirectionChange"
          >
            <el-radio-button label="from">
              <el-icon><ArrowRight /></el-icon>
              From {{ channelName }}
            </el-radio-button>
            <el-radio-button label="to">
              <el-icon><ArrowRight /></el-icon>
              To {{ channelName }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="header-right">
        <el-button type="info" plain @click="handleTestMapping">
          <el-icon><Monitor /></el-icon>
          Test
        </el-button>
        <el-button type="primary" @click="handleAddMapping">
          <el-icon><Plus /></el-icon>
          Add mapping
        </el-button>
        <el-button link>
          <el-icon><More /></el-icon>
        </el-button>
      </div>
    </div>

    <div class="mapping-filters">
      <el-radio-group v-model="filterType" size="small">
        <el-radio label="all">All mappings ({{ mappings.length }})</el-radio>
        <el-radio label="custom">Custom mappings ({{ customMappings.length }})</el-radio>
      </el-radio-group>
      <el-checkbox v-model="includeDisabled">Include disabled</el-checkbox>
    </div>

    <div class="mapping-list">
      <div v-for="mapping in filteredMappings" :key="mapping.id" class="mapping-item">
        <div class="mapping-row">
          <div class="mapping-badge">
            <span>Baseline</span>
          </div>
          <div class="mapping-field">
            <el-select v-model="mapping.sourceField" :placeholder="mapping.sourcePlaceholder">
              <el-option
                v-for="field in sourceFields"
                :key="field.value"
                :label="field.label"
                :value="field.value"
              />
            </el-select>
          </div>
          <div class="mapping-arrows">
            <el-icon><ArrowRight /></el-icon>
          </div>
          <div class="mapping-field">
            <el-select v-model="mapping.targetField" :placeholder="mapping.targetPlaceholder">
              <el-option
                v-for="field in targetFields"
                :key="field.value"
                :label="field.label"
                :value="field.value"
              />
            </el-select>
          </div>
          <div class="mapping-actions">
            <el-tooltip content="Copy mapping">
              <el-button link @click="handleCopyMapping(mapping)">
                <el-icon><CopyDocument /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="Delete mapping">
              <el-button link @click="handleDeleteMapping(mapping)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
        </div>
        <div class="mapping-advanced" v-show="mapping.showAdvanced">
          <el-button link class="advanced-toggle" @click="mapping.showAdvanced = !mapping.showAdvanced">
            Set advanced options
            <el-icon><ArrowDown /></el-icon>
          </el-button>
          <div class="advanced-content" v-if="mapping.showAdvanced">
            <!-- Advanced mapping options -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  QuestionFilled,
  ArrowRight,
  ArrowDown,
  Monitor,
  Plus,
  More,
  CopyDocument,
  Delete
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  channelName: string
}>()

const selectedEntity = ref('fulfillments')
const mappingDirection = ref('from')
const filterType = ref('all')
const includeDisabled = ref(false)

// 添加事件处理函数
const handleEntityChange = (value: string) => {
  console.log('Selected entity:', value)
  // 这里可以根据选择的实体类型加载相应的字段选项
}

const handleDirectionChange = (value: string) => {
  console.log('Mapping direction:', value)
  // 这里可以根据映射方向更新字段选项
}

const handleAddMapping = () => {
  mappings.value.push({
    id: Date.now(),
    sourceField: '',
    targetField: '',
    sourcePlaceholder: 'Select source field',
    targetPlaceholder: 'Select target field',
    showAdvanced: false,
    isCustom: true,
    isEnabled: true
  })
  ElMessage.success('New mapping added')
}

const handleCopyMapping = (mapping: any) => {
  const newMapping = { ...mapping }
  newMapping.id = Date.now()
  newMapping.isCustom = true
  mappings.value.push(newMapping)
  ElMessage.success('Mapping copied')
}

const handleDeleteMapping = (mapping: any) => {
  const index = mappings.value.findIndex(m => m.id === mapping.id)
  if (index > -1) {
    mappings.value.splice(index, 1)
    ElMessage.success('Mapping deleted')
  }
}

const handleTestMapping = () => {
  ElMessage.info('Testing mappings...')
  // 这里可以添加测试映射的逻辑
}

// 示例数据
const mappings = ref([
  {
    id: 1,
    sourceField: 'shipmentId',
    targetField: 'ShipmentId',
    sourcePlaceholder: 'shipmentId',
    targetPlaceholder: 'ShipmentId',
    showAdvanced: false,
    isCustom: false,
    isEnabled: true
  },
  {
    id: 2,
    sourceField: 'extFulfillmentId',
    targetField: 'External Fulfillment Id',
    sourcePlaceholder: 'extFulfillmentId',
    targetPlaceholder: 'External Fulfillment Id',
    showAdvanced: false,
    isCustom: true,
    isEnabled: true
  },
  {
    id: 3,
    sourceField: 'tracking_numbers',
    targetField: 'Tracking Number',
    sourcePlaceholder: 'Shipment Tracking Numbers',
    targetPlaceholder: 'Tracking Number',
    showAdvanced: false,
    isCustom: false,
    isEnabled: false
  }
])

const sourceFields = ref([
  { label: 'shipmentId', value: 'shipmentId' },
  { label: 'extFulfillmentId', value: 'extFulfillmentId' },
  { label: 'tracking_numbers', value: 'tracking_numbers' }
])

const targetFields = ref([
  { label: 'ShipmentId', value: 'ShipmentId' },
  { label: 'External Fulfillment Id', value: 'External Fulfillment Id' },
  { label: 'Tracking Number', value: 'Tracking Number' }
])

const customMappings = computed(() => 
  mappings.value.filter(m => m.isCustom)
)

const filteredMappings = computed(() => {
  let filtered = mappings.value
  if (filterType.value === 'custom') {
    filtered = filtered.filter(m => m.isCustom)
  }
  if (!includeDisabled.value) {
    filtered = filtered.filter(m => m.isEnabled)
  }
  return filtered
})
</script>

<style lang="scss" scoped>
.mapping-settings {
  .mapping-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;

    .header-left {
      .entity-selector {
        margin-bottom: 16px;

        h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 500;

          .el-icon {
            font-size: 14px;
            color: var(--el-text-color-secondary);
            cursor: help;
          }
        }

        .el-select {
          width: 200px;
        }
      }

      .direction-selector {
        .el-radio-group {
          display: flex;
          gap: 8px;
        }
      }
    }

    .header-right {
      display: flex;
      gap: 8px;
      align-items: center;

      .el-button {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }

  .mapping-filters {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 24px;
    padding: 16px;
    background: var(--el-fill-color-light);
    border-radius: 8px;

    .el-radio-group {
      display: flex;
      gap: 16px;
    }
  }

  .mapping-list {
    .mapping-item {
      margin-bottom: 16px;
      background: var(--el-bg-color-overlay);
      border-radius: 8px;
      border: 1px solid var(--el-border-color-lighter);

      .mapping-row {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;

        .mapping-badge {
          span {
            padding: 2px 8px;
            font-size: 12px;
            color: var(--el-text-color-regular);
            background: var(--el-fill-color);
            border-radius: 4px;
          }
        }

        .mapping-field {
          flex: 1;

          .el-select {
            width: 100%;
          }
        }

        .mapping-arrows {
          color: var(--el-text-color-secondary);
        }

        .mapping-actions {
          display: flex;
          gap: 8px;

          .el-button {
            color: var(--el-text-color-regular);

            &:hover {
              color: var(--el-color-primary);
            }
          }
        }
      }

      .mapping-advanced {
        border-top: 1px solid var(--el-border-color-lighter);
        padding: 12px 16px;

        .advanced-toggle {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--el-text-color-regular);
          font-size: 13px;

          &:hover {
            color: var(--el-color-primary);
          }

          .el-icon {
            font-size: 12px;
            transition: transform 0.3s;
          }

          &.is-active .el-icon {
            transform: rotate(180deg);
          }
        }
      }
    }
  }
}
</style> 