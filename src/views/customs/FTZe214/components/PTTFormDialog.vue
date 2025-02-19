<template>
  <el-dialog
    v-model="dialogVisible"
    title="Generate PTT"
    width="60%"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-position="top"
      class="ptt-form"
    >
      <!-- Basic Information -->
      <div class="form-section">
        <div class="section-title">BASIC INFORMATION</div>
        <div class="form-row">
          <el-form-item 
            label="Admission Number" 
            prop="admissionNumber" 
            required
          >
            <el-input 
              v-model="formData.admissionNumber" 
              placeholder="e.g. 214-2024-000123"
              disabled
            />
          </el-form-item>
          <el-form-item 
            label="FTZ Number" 
            prop="ftzNumber" 
            required
          >
            <el-input 
              v-model="formData.ftzNumber" 
              placeholder="e.g. FTZ 2025"
            />
          </el-form-item>
          <el-form-item 
            label="Port of Entry" 
            prop="portOfEntry" 
            required
          >
            <div class="custom-select" v-click-outside="() => handleClickOutside('portOfEntry')">
              <div class="select-trigger" :class="{ 'is-focus': showPortOfEntryDropdown }">
                <input
                  v-model="portOfEntrySearch"
                  :placeholder="formData.portOfEntry ? PORT_OF_ENTRY.find(p => p.value === formData.portOfEntry)?.label : 'Select Port of Entry'"
                  @input="handleSearchInput('portOfEntry')"
                  @click.stop="toggleDropdown('portOfEntry')"
                  @focus="toggleDropdown('portOfEntry')"
                />
                <div class="select-icons">
                  <el-icon 
                    class="clear-icon" 
                    v-show="portOfEntrySearch || formData.portOfEntry" 
                    @click.stop="clearSelect('portOfEntry')"
                  >
                    <CircleClose />
                  </el-icon>
                  <el-icon :class="{ 'is-reverse': showPortOfEntryDropdown }"><ArrowDown /></el-icon>
                </div>
              </div>
              <div class="select-dropdown" v-show="showPortOfEntryDropdown" @click.stop>
                <div 
                  v-for="port in filteredPortOfEntryOptions"
                  :key="port.value"
                  class="select-option" 
                  @click.stop="handleSelectOption('portOfEntry', port.value)"
                  :class="{ active: formData.portOfEntry === port.value }"
                >
                  {{ port.label }}
                </div>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item 
            label="Carrier SCAC" 
            prop="carrierScac" 
            required
          >
            <el-input 
              v-model="formData.carrierScac" 
              placeholder="e.g. MSCU"
              @input="handleScacInput"
            />
          </el-form-item>
          <el-form-item 
            label="Container Number" 
            prop="containerNumber"
          >
            <el-input 
              v-model="formData.containerNumber" 
              placeholder="e.g. MSCU1234567"
            />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item 
            label="Transfer Type" 
            prop="transferType" 
            required
          >
            <div class="custom-select" v-click-outside="() => handleClickOutside('transferType')">
              <div class="select-trigger" :class="{ 'is-focus': showTransferTypeDropdown }">
                <input
                  v-model="transferTypeSearch"
                  :placeholder="formData.transferType ? TRANSFER_TYPES.find(t => t.value === formData.transferType)?.label : 'Select Transfer Type'"
                  @input="handleSearchInput('transferType')"
                  @click.stop="toggleDropdown('transferType')"
                  @focus="toggleDropdown('transferType')"
                />
                <div class="select-icons">
                  <el-icon 
                    class="clear-icon" 
                    v-show="transferTypeSearch || formData.transferType" 
                    @click.stop="clearSelect('transferType')"
                  >
                    <CircleClose />
                  </el-icon>
                  <el-icon :class="{ 'is-reverse': showTransferTypeDropdown }"><ArrowDown /></el-icon>
                </div>
              </div>
              <div class="select-dropdown" v-show="showTransferTypeDropdown" @click.stop>
                <div 
                  v-for="type in TRANSFER_TYPES"
                  :key="type.value"
                  class="select-option" 
                  @click.stop="handleSelectOption('transferType', type.value)"
                  :class="{ active: formData.transferType === type.value }"
                >
                  <div class="option-content">
                    <span>{{ type.label }}</span>
                    <span class="option-description">{{ type.description }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item 
            v-if="formData.transferType === 'in_bond'"
            label="In-Bond Number" 
            prop="inBondNumber"
            required
          >
            <el-input 
              v-model="formData.inBondNumber" 
              placeholder="e.g. 123456789"
            />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item 
            label="Estimated Arrival Date" 
            prop="estimatedArrivalDate" 
            required
          >
            <el-date-picker
              v-model="formData.estimatedArrivalDate"
              type="date"
              placeholder="Select Estimated Arrival Date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
              :disabled-date="disablePastDates"
            />
          </el-form-item>
          <el-form-item 
            label="PTT Justification" 
            prop="pttJustification"
          >
            <el-input 
              v-model="formData.pttJustification" 
              type="textarea"
              :rows="3"
              placeholder="Enter special instructions or justification (optional)"
            />
          </el-form-item>
        </div>
      </div>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit">Submit</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, watch } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { CircleClose, ArrowDown } from '@element-plus/icons-vue'
import { PORT_OF_ENTRY } from '../types/form'
import { vClickOutside } from '@/directives/clickOutside'

// 定义传输类型选项
const TRANSFER_TYPES = [
  { value: 'in_bond', label: 'In-Bond', description: 'CBP monitored transfer' },
  { value: 'non_bonded', label: 'Non-Bonded', description: 'Cleared cargo transfer' }
] as const

type TransferType = typeof TRANSFER_TYPES[number]['value']

// 表单数据接口
interface PTTFormData {
  admissionNumber: string
  ftzNumber: string
  portOfEntry: string
  carrierScac: string
  containerNumber: string
  transferType: TransferType | ''
  inBondNumber: string
  estimatedArrivalDate: string
  pttJustification: string
}

interface Props {
  visible: boolean
  e214Data: {
    admissionNumber: string
    ftzNumber: string
    portOfEntry: string
    carrierScac?: string
    containerNumber?: string
    transferType?: TransferType | ''
    inBondNumber?: string
    estimatedArrivalDate?: string
  }
}

// 验证到达日期
const validateArrivalDate = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('Estimated Arrival Date is required'))
    return
  }
  
  const selectedDate = new Date(value)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (selectedDate < today) {
    callback(new Error('Estimated Arrival Date cannot be in the past'))
  } else {
    callback()
  }
}

// 表单验证规则
const formRules = {
  admissionNumber: [
    { required: true, message: 'Admission Number is required for PTT application', trigger: 'blur' },
    { pattern: /^214-\d{4}-\d{6}$/, message: 'Invalid Admission Number format (e.g. 214-2024-000123)', trigger: 'blur' }
  ],
  ftzNumber: [
    { required: true, message: 'FTZ Number is required', trigger: 'blur' },
    { pattern: /^FTZ\s*\d+$/, message: 'Invalid FTZ Number format (e.g. FTZ 2025)', trigger: 'blur' }
  ],
  portOfEntry: [
    { required: true, message: 'Port of Entry is required', trigger: 'blur' }
  ],
  carrierScac: [
    { required: true, message: 'Carrier SCAC is required', trigger: 'blur' },
    { min: 4, max: 4, message: 'SCAC code must be exactly 4 characters', trigger: 'blur' },
    { pattern: /^[A-Z]{4}$/, message: 'SCAC code must be 4 uppercase letters', trigger: 'blur' }
  ],
  transferType: [
    { required: true, message: 'Transfer Type is required', trigger: 'change' }
  ],
  estimatedArrivalDate: [
    { required: true, message: 'Estimated Arrival Date is required', trigger: 'change' },
    { validator: validateArrivalDate, trigger: 'change' }
  ]
}

const props = defineProps<Props>()
const emit = defineEmits(['update:visible', 'submit'])

// 表单引用
const formRef = ref<FormInstance>()

// 对话框可见性
const dialogVisible = ref(false)

// 下拉框状态
const showPortOfEntryDropdown = ref(false)
const showTransferTypeDropdown = ref(false)

// 搜索输入
const portOfEntrySearch = ref('')
const transferTypeSearch = ref('')

// 过滤选项
const filteredPortOfEntryOptions = computed(() => {
  return PORT_OF_ENTRY.filter(port =>
    port.label.toLowerCase().includes(portOfEntrySearch.value.toLowerCase())
  )
})

// 表单数据
const formData = ref<PTTFormData>({
  admissionNumber: '',
  ftzNumber: '',
  portOfEntry: '',
  carrierScac: '',
  containerNumber: '',
  transferType: '',
  inBondNumber: '',
  estimatedArrivalDate: '',
  pttJustification: ''
})

// 监听visible属性变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
})

// 监听对话框可见性变化
watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal)
})

// 监听e214Data变化以自动填充
watch(() => props.e214Data, (newVal) => {
  if (newVal) {
    formData.value = {
      admissionNumber: newVal.admissionNumber,
      ftzNumber: newVal.ftzNumber || '',
      portOfEntry: newVal.portOfEntry || '',
      carrierScac: newVal.carrierScac || '',
      containerNumber: newVal.containerNumber || '',
      transferType: newVal.transferType || '',
      inBondNumber: newVal.inBondNumber || '',
      estimatedArrivalDate: newVal.estimatedArrivalDate || '',
      pttJustification: ''
    }
  }
}, { immediate: true, deep: true })

// 禁用过去的日期
const disablePastDates = (date: Date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date.getTime() < today.getTime()
}

// 处理SCAC输入
const handleScacInput = (value: string) => {
  formData.value.carrierScac = value.toUpperCase()
}

// 处理下拉框事件
const handleClickOutside = (type: string) => {
  switch (type) {
    case 'portOfEntry':
      showPortOfEntryDropdown.value = false
      break
    case 'transferType':
      showTransferTypeDropdown.value = false
      break
  }
}

const toggleDropdown = (type: string) => {
  switch (type) {
    case 'portOfEntry':
      showPortOfEntryDropdown.value = !showPortOfEntryDropdown.value
      showTransferTypeDropdown.value = false
      break
    case 'transferType':
      showTransferTypeDropdown.value = !showTransferTypeDropdown.value
      showPortOfEntryDropdown.value = false
      break
  }
}

const handleSearchInput = (type: string) => {
  switch (type) {
    case 'portOfEntry':
      showPortOfEntryDropdown.value = true
      break
    case 'transferType':
      showTransferTypeDropdown.value = true
      break
  }
}

const handleSelectOption = (field: string, value: string) => {
  switch (field) {
    case 'portOfEntry':
      formData.value.portOfEntry = value
      portOfEntrySearch.value = ''
      showPortOfEntryDropdown.value = false
      break
    case 'transferType':
      formData.value.transferType = value as TransferType
      transferTypeSearch.value = ''
      showTransferTypeDropdown.value = false
      if (value !== 'in_bond') {
        formData.value.inBondNumber = ''
      }
      break
  }
}

const clearSelect = (type: string) => {
  switch (type) {
    case 'portOfEntry':
      formData.value.portOfEntry = ''
      portOfEntrySearch.value = ''
      break
    case 'transferType':
      formData.value.transferType = ''
      transferTypeSearch.value = ''
      break
  }
}

// 处理关闭
const handleClose = () => {
  formRef.value?.resetFields()
  dialogVisible.value = false
}

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    emit('submit', formData.value)
    handleClose()
  } catch (error) {
    ElMessage.error('Please fill in all required fields')
  }
}
</script>

<style lang="scss" scoped>
.ptt-form {
  .form-section {
    background-color: var(--el-bg-color);
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 24px;

    .section-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-primary);
      margin-bottom: 24px;
      text-transform: uppercase;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.custom-select {
  position: relative;
  width: 100%;

  .select-trigger {
    position: relative;
    width: 100%;
    height: 40px;
    border: 1px solid transparent;
    border-radius: 4px;
    background: var(--el-fill-color-light);
    transition: all 0.15s ease-in-out;
    cursor: pointer;

    &:hover {
      border-color: var(--el-border-color-hover);
      background: var(--el-fill-color-darker);
    }

    &.is-focus {
      border-color: var(--primary-color);
      background: var(--el-fill-color-darker);
    }

    input {
      width: 100%;
      height: 100%;
      padding: 0 64px 0 12px;
      border: none;
      background: transparent;
      color: var(--el-text-color-primary);
      font-size: 14px;
      cursor: pointer;

      &:focus {
        outline: none;
      }

      &::placeholder {
        color: var(--el-text-color-placeholder);
      }
    }

    .select-icons {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      gap: 4px;

      .clear-icon {
        color: var(--el-text-color-secondary);
        cursor: pointer;
        font-size: 16px;
        padding: 2px;
        border-radius: 50%;
        transition: all 0.3s;
        opacity: 0;

        &:hover {
          color: var(--el-text-color-primary);
        }
      }

      .el-icon {
        font-size: 16px;
        color: var(--el-text-color-secondary);
        transition: transform 0.3s;

        &.is-reverse {
          transform: rotate(180deg);
        }
      }
    }

    &:hover .clear-icon {
      opacity: 1;
    }
  }

  .select-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color-darker);
    border-radius: 4px;
    box-shadow: var(--el-box-shadow-light);
    z-index: 10;
    max-height: 200px;
    overflow-y: auto;

    .select-option {
      padding: 8px 12px;
      cursor: pointer;
      font-size: 14px;
      color: var(--el-text-color-regular);
      transition: all 0.15s ease-in-out;

      &:hover {
        background: var(--el-fill-color-light);
      }

      &.active {
        color: var(--primary-color);
        background: rgba(99, 102, 241, 0.1);
      }

      .option-content {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .option-description {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
}
</style> 