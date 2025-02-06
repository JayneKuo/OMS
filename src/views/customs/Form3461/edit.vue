<template>
  <div class="form3461-edit-page">
    <div class="page-content">
      <div class="fixed-header">
        <div class="back-button" @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
          <span>Back</span>
        </div>
        <div class="title">{{ pageTitle }}</div>
      </div>

      <div class="content-wrapper">
        <el-form 
          ref="formRef"
          :model="formData"
          :rules="!isViewMode ? formRules : {}"
          label-position="top"
          class="form-container"
          :disabled="isViewMode"
        >
          <!-- Entry Information -->
          <div class="form-section">
            <div class="section-title">ENTRY INFORMATION</div>
            <div class="form-row">
              <el-form-item label="Port of Entry" prop="portOfEntry" required>
                <el-input v-model="formData.portOfEntry" placeholder="Enter Port Code" />
              </el-form-item>
              <el-form-item label="Entry Number" prop="entryNumber" required>
                <el-input v-model="formData.entryNumber" placeholder="XXX-XXXXXXX-X" />
              </el-form-item>
              <el-form-item label="Entry Type" prop="entryType" required>
                <el-select v-model="formData.entryType" placeholder="Select Entry Type">
                  <el-option
                    v-for="item in ENTRY_TYPES"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="Entry Date" prop="entryDate" required>
                <el-date-picker
                  v-model="formData.entryDate"
                  type="date"
                  placeholder="YYYY/MM/DD"
                  format="YYYY/MM/DD"
                />
              </el-form-item>
              <el-form-item label="Port Code" prop="portCode" required>
                <el-input v-model="formData.portCode" placeholder="XXXX" />
              </el-form-item>
              <el-form-item label="Importer Number" prop="importerNumber" required>
                <el-input v-model="formData.importerNumber" placeholder="Enter Importer Number" />
              </el-form-item>
            </div>
          </div>

          <!-- Importer/Consignee Information -->
          <div class="form-section">
            <div class="section-title">IMPORTER/CONSIGNEE INFORMATION</div>
            <div class="form-row">
              <el-form-item label="Importer Number" prop="importerNumberConsignee" required>
                <el-input v-model="formData.importerNumberConsignee" placeholder="Enter Importer Number" />
              </el-form-item>
              <el-form-item label="Importer/Consignee Name" prop="importerConsigneeName" required>
                <el-input v-model="formData.importerConsigneeName" placeholder="Enter Importer/Consignee Name" />
              </el-form-item>
            </div>
          </div>

          <!-- Port/Location Information -->
          <div class="form-section">
            <div class="section-title">PORT/LOCATION INFORMATION</div>
            <div class="form-row">
              <el-form-item label="Port of Entry" prop="portOfEntryLocation" required>
                <el-input v-model="formData.portOfEntryLocation" placeholder="Enter Port Code" />
              </el-form-item>
              <el-form-item label="Port of Unlading" prop="portOfUnlading">
                <el-input v-model="formData.portOfUnlading" placeholder="Enter Port of Unlading" />
              </el-form-item>
              <el-form-item label="Arrival Date" prop="arrivalDate">
                <el-date-picker
                  v-model="formData.arrivalDate"
                  type="date"
                  placeholder="YYYY/MM/DD"
                  format="YYYY/MM/DD"
                />
              </el-form-item>
            </div>
          </div>

          <!-- Broker/Filer Information -->
          <div class="form-section">
            <div class="section-title">BROKER/FILER INFORMATION</div>
            <div class="form-row">
              <el-form-item label="Broker/Filer Number" prop="brokerNumber">
                <el-input v-model="formData.brokerNumber" placeholder="XXX-XXXXXX" />
              </el-form-item>
              <el-form-item label="Bond Type" prop="bondType">
                <el-select v-model="formData.bondType" placeholder="Select Bond Type">
                  <el-option
                    v-for="item in BOND_TYPES"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
          </div>

          <!-- Ultimate Consignee Information -->
          <div class="form-section">
            <div class="section-title">ULTIMATE CONSIGNEE INFORMATION</div>
            <div class="form-row">
              <el-form-item label="Consignee Number" prop="consigneeNumber">
                <el-input v-model="formData.consigneeNumber" placeholder="XX-XXXXXXX" />
              </el-form-item>
              <el-form-item label="Importer Number" prop="importerNumberUltimate" required>
                <el-input v-model="formData.importerNumberUltimate" placeholder="XX-XXXXXXX" />
              </el-form-item>
            </div>
          </div>

          <!-- Transportation Information -->
          <div class="form-section">
            <div class="section-title">TRANSPORTATION INFORMATION</div>
            <div class="form-row">
              <el-form-item label="Mode of Transportation" prop="transportationMode">
                <el-select
                  v-model="formData.transportationMode"
                  multiple
                  placeholder="Select modes"
                  class="full-width-tags"
                >
                  <el-option
                    v-for="mode in transportModes"
                    :key="mode.value"
                    :label="mode.label"
                    :value="mode.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Vessel Name" prop="vesselName">
                <el-input v-model="formData.vesselName" placeholder="Enter Vessel Name" />
              </el-form-item>
              <el-form-item label="Voyage/Flight Number" prop="voyageNumber">
                <el-input v-model="formData.voyageNumber" placeholder="Enter Voyage/Flight Number" />
              </el-form-item>
            </div>
          </div>

          <!-- Line Items -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-title">LINE ITEMS</div>
              <el-button 
                v-if="!isViewMode"
                type="primary" 
                class="add-line-btn" 
                @click="addLineItem"
              >Add Line Item</el-button>
            </div>
            <div class="line-items-container">
              <div v-for="(item, index) in formData.lineItems" :key="index" class="line-item">
                <div class="line-item-row">
                  <div class="line-item-col">
                    <label class="line-item-label">Description<span class="required">*</span></label>
                    <el-input v-model="item.description" placeholder="Enter Description" />
                  </div>
                  <div class="line-item-col">
                    <label class="line-item-label">HTS Number<span class="required">*</span></label>
                    <el-input v-model="item.htsNumber" placeholder="Enter HTS Number" />
                  </div>
                  <div class="line-item-col">
                    <label class="line-item-label">Quantity<span class="required">*</span></label>
                    <el-input-number v-model="item.quantity" :min="0" controls-position="right" placeholder="0" />
                  </div>
                  <div class="line-item-col">
                    <label class="line-item-label">Value (USD)<span class="required">*</span></label>
                    <el-input-number v-model="item.value" :min="0" :precision="2" controls-position="right" placeholder="0" />
                  </div>
                </div>
                <div v-if="!isViewMode" class="remove-line-item">
                  <span class="remove-text" @click="removeLineItem(index)">Remove Line Item</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Header Reference Information -->
          <div class="form-section">
            <div class="section-title">HEADER REFERENCE INFORMATION</div>
            <div class="form-row">
              <el-form-item label="Reference Number" prop="referenceNumber">
                <el-input v-model="formData.referenceNumber" placeholder="Enter Reference Number" />
              </el-form-item>
              <el-form-item label="Self-Filing Certification" prop="selfFilingCertification">
                <el-radio-group v-model="formData.selfFilingCertification">
                  <el-radio :label="true">Yes</el-radio>
                  <el-radio :label="false">No</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>

          <!-- Form Actions -->
          <div v-if="!isViewMode" class="form-actions">
            <el-button @click="handleCancel">Cancel</el-button>
            <el-button type="primary" @click="handleSubmit">Submit</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ENTRY_TYPES, BOND_TYPES } from './types/index'

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()

// 根据路由名称判断当前模式
const isCreateMode = route.name === 'CreateForm3461'
const isEditMode = route.name === 'EditForm3461'
const isViewMode = route.name === 'ViewForm3461'

// 设置页面标题
const pageTitle = isCreateMode 
  ? 'Create Form 3461 Entry/Immediate Delivery'
  : isEditMode 
    ? 'Edit Form 3461 Entry/Immediate Delivery'
    : 'View Form 3461 Entry/Immediate Delivery'

interface LineItem {
  description: string
  htsNumber: string
  quantity: number
  value: number
}

interface FormData {
  portOfEntry: string
  entryNumber: string
  entryType: string
  entryDate: string
  portCode: string
  importerNumber: string
  importerNumberConsignee: string
  importerConsigneeName: string
  portOfEntryLocation: string
  portOfUnlading: string
  arrivalDate: string
  brokerNumber: string
  bondType: string
  consigneeNumber: string
  importerNumberUltimate: string
  transportationMode: string[]
  vesselName: string
  voyageNumber: string
  lineItems: LineItem[]
  referenceNumber: string
  selfFilingCertification: boolean
}

const formData = ref<FormData>({
  portOfEntry: '',
  entryNumber: '',
  entryType: '',
  entryDate: '',
  portCode: '',
  importerNumber: '',
  importerNumberConsignee: '',
  importerConsigneeName: '',
  portOfEntryLocation: '',
  portOfUnlading: '',
  arrivalDate: '',
  brokerNumber: '',
  bondType: '',
  consigneeNumber: '',
  importerNumberUltimate: '',
  transportationMode: [],
  vesselName: '',
  voyageNumber: '',
  lineItems: [],
  referenceNumber: '',
  selfFilingCertification: false
})

const transportModes = [
  { value: '1', label: 'Vessel' },
  { value: '2', label: 'Rail' },
  { value: '3', label: 'Truck' },
  { value: '4', label: 'Air' },
  { value: '5', label: 'Mail' },
  { value: '6', label: 'Passenger' },
  { value: '7', label: 'Fixed Transport' }
]

const formRules = {
  portOfEntry: [{ required: true, message: 'Port of Entry is required', trigger: 'blur' }],
  entryNumber: [{ required: true, message: 'Entry Number is required', trigger: 'blur' }],
  entryType: [{ required: true, message: 'Entry Type is required', trigger: 'blur' }],
  entryDate: [{ required: true, message: 'Entry Date is required', trigger: 'change' }],
  portCode: [{ required: true, message: 'Port Code is required', trigger: 'blur' }],
  importerNumber: [{ required: true, message: 'Importer Number is required', trigger: 'blur' }],
  importerNumberConsignee: [{ required: true, message: 'Importer Number is required', trigger: 'blur' }],
  importerConsigneeName: [{ required: true, message: 'Importer/Consignee Name is required', trigger: 'blur' }],
  importerNumberUltimate: [{ required: true, message: 'Ultimate Importer Number is required', trigger: 'blur' }]
}

// 加载表单数据
const loadFormData = async (id: string) => {
  try {
    // TODO: 调用API获取表单数据
    const response = await fetch(`/api/form3461/${id}`)
    const data = await response.json()
    formData.value = data
  } catch (error) {
    console.error('Failed to load form data:', error)
    // TODO: 显示错误提示
  }
}

// 在组件挂载时加载数据
onMounted(async () => {
  if (isEditMode || isViewMode) {
    const id = route.params.id as string
    await loadFormData(id)
  }
})

const handleBack = () => {
  router.back()
}

const handleCancel = () => {
  router.back()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        if (isCreateMode) {
          // 创建新表单
          await fetch('/api/form3461', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData.value)
          })
        } else if (isEditMode) {
          // 更新表单
          const id = route.params.id
          await fetch(`/api/form3461/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData.value)
          })
        }
        router.push('/customs/form3461')
      } catch (error) {
        console.error('Failed to save form:', error)
        // TODO: 显示错误提示
      }
    } else {
      console.error('Form validation failed:', fields)
    }
  })
}

const addLineItem = () => {
  formData.value.lineItems.push({
    description: '',
    htsNumber: '',
    quantity: 0,
    value: 0
  })
}

const removeLineItem = (index: number) => {
  formData.value.lineItems.splice(index, 1)
}
</script>

<style lang="scss" scoped>
.form3461-edit-page {
  min-height: 100vh;
  background: #000000;
  
  .page-content {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    
    .fixed-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 24px;
      background: #1A1D1F;

      .back-button {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        color: #fff;
        font-size: 14px;
        
        .el-icon {
          font-size: 16px;
        }

        &:hover {
          opacity: 0.8;
        }
      }

      .title {
        font-size: 16px;
        font-weight: 500;
        color: #fff;
      }
    }

    .content-wrapper {
      padding: 24px;
      background: #000000;
    }
  }

  .form-container {
    .form-section {
      background: #1A1D1F;
      border-radius: 4px;
      padding: 20px;
      margin-bottom: 20px;

      .section-title {
        color: #fff;
        font-size: 12px;
        margin-bottom: 20px;
        font-weight: 500;
      }

      .form-row {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-bottom: 16px;

        :deep(.el-form-item) {
          margin-bottom: 0;
          
          .el-form-item__label {
            color: #fff;
            font-size: 12px;
            padding-bottom: 8px;
          }

          .el-input__wrapper {
            background-color: #1E2127 !important;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: none;
            
            .el-input__inner {
              color: #fff;
              height: 32px;
              font-size: 12px;
              
              &::placeholder {
                color: rgba(255, 255, 255, 0.3);
              }
            }
          }

          .el-input-number {
            width: 100%;
            
            .el-input__wrapper {
              padding: 0 8px;
            }
          }

          .el-select {
            width: 100%;
          }

          .el-date-editor {
            width: 100%;
          }

          .el-radio-group {
            .el-radio {
              margin-right: 20px;
              
              .el-radio__label {
                color: #fff;
              }
            }
          }
        }
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .add-line-btn {
          background: #6b4fff;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          font-size: 14px;
          
          &:hover {
            background: #7c4dff;
          }
        }
      }

      .line-items-container {
        .line-item {
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 16px;

          &:last-child {
            margin-bottom: 0;
            border-bottom: none;
          }

          .line-item-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
          }

          .line-item-col {
            .line-item-label {
              display: block;
              color: #fff;
              font-size: 12px;
              margin-bottom: 8px;

              .required {
                color: #ff4d4f;
                margin-left: 4px;
              }
            }

            :deep(.el-input) {
              .el-input__wrapper {
                background-color: #1E2127 !important;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: none !important;

                .el-input__inner {
                  color: #fff;
                  height: 32px;
                  font-size: 12px;

                  &::placeholder {
                    color: rgba(255, 255, 255, 0.3);
                  }
                }
              }
            }
          }

          .remove-line-item {
            text-align: left;
            margin-top: 12px;

            .remove-text {
              color: #ff4d4f;
              font-size: 12px;
              cursor: pointer;

              &:hover {
                color: #ff7875;
              }
            }
          }
        }
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;

      .el-button {
        min-width: 80px;
        
        &--default {
          background: #1E2127;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        
        &--primary {
          background: #6b4fff;
          border-color: #6b4fff;
          
          &:hover {
            background: #7c4dff;
            border-color: #7c4dff;
          }
        }
      }
    }
  }

  :deep(.el-select) {
    &.full-width-tags {
      .el-select__tags {
        flex-wrap: wrap;
        max-width: 100%;
        height: auto;
        padding: 2px;
        
        .el-tag {
          margin: 2px 4px 2px 0;
          height: 24px;
          padding: 0 8px;
          background-color: rgba(107, 79, 255, 0.1);
          border-color: rgba(107, 79, 255, 0.2);
          color: #6b4fff;
          
          .el-tag__close {
            color: #6b4fff;
            
            &:hover {
              background-color: #6b4fff;
              color: #fff;
            }
          }
        }
      }
    }
  }
}

:deep(.el-select__popper.el-popper) {
  background: #1E2127 !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  
  .el-select-dropdown__item {
    color: #fff !important;
    background: #1E2127 !important;
    
    &:hover {
      background: #282C34 !important;
    }
    
    &.selected {
      background: #6b4fff !important;
    }
  }

  .el-popper__arrow::before {
    background: #1E2127 !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
  }
}
</style> 