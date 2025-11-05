<template>
  <div class="shipping-account-add-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <el-button link @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
          Back
        </el-button>
        <h1>{{ isEdit ? 'Edit' : 'Add' }} Shipping Account</h1>
      </div>
    </div>

    <!-- Form -->
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="180px"
      label-position="left"
    >
      <!-- Basic Information -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <el-icon class="section-icon"><Document /></el-icon>
            <span class="section-title">Basic Information</span>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="* Carrier" prop="carrier">
              <el-select v-model="formData.carrier" placeholder="Select Carrier">
                <el-option
                  v-for="carrier in CARRIER_OPTIONS"
                  :key="carrier.value"
                  :label="carrier.label"
                  :value="carrier.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="* Account No" prop="accountNo">
              <el-input v-model="formData.accountNo" placeholder="Enter Account No" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Name" prop="name">
              <el-input v-model="formData.name" placeholder="Enter Contact Name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Company" prop="company">
              <el-input v-model="formData.company" placeholder="Enter Company Name" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- API Configuration -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <el-icon class="section-icon"><Key /></el-icon>
            <span class="section-title">API Configuration</span>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Api Client ID" prop="apiClientId">
              <el-input v-model="formData.apiClientId" placeholder="Enter Api Client ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Api Client Password" prop="apiClientPassword">
              <el-input
                v-model="formData.apiClientPassword"
                type="password"
                placeholder="Enter Api Client Password"
                show-password
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Api Token" prop="apiToken">
              <el-input v-model="formData.apiToken" placeholder="Enter Api Token" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Track Api Key" prop="trackApiKey">
              <el-input v-model="formData.trackApiKey" placeholder="Enter Track Api Key" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Track Api Secret" prop="trackApiSecret">
              <el-input
                v-model="formData.trackApiSecret"
                type="password"
                placeholder="Enter Track Api Secret"
                show-password
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- Address Information -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <el-icon class="section-icon"><Location /></el-icon>
            <span class="section-title">Address Information</span>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Address 1" prop="address1">
              <el-input v-model="formData.address1" placeholder="Enter Street Address" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Address 2" prop="address2">
              <el-input v-model="formData.address2" placeholder="Apartment, Suite, etc. (Optional)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="City" prop="city">
              <el-input v-model="formData.city" placeholder="Enter City" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="State / Province" prop="stateProvince">
              <el-input v-model="formData.stateProvince" placeholder="Enter State or Province" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Zip Code" prop="zipCode">
              <el-input v-model="formData.zipCode" placeholder="Enter Zip/Postal Code" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Country / Region" prop="countryRegion">
              <el-input v-model="formData.countryRegion" placeholder="Enter Country or Region" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Phone" prop="phone">
              <el-input v-model="formData.phone" placeholder="Enter Phone Number" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- Additional Settings -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <el-icon class="section-icon"><Setting /></el-icon>
            <span class="section-title">Additional Settings</span>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Smart Post Hub Id" prop="smartPostHubId">
              <el-input v-model="formData.smartPostHubId" placeholder="Enter Smart Post Hub Id (Optional)" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Return Account Number" prop="returnAccountNumber">
              <el-input v-model="formData.returnAccountNumber" placeholder="Enter Return Account Number (Optional)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Is Return Account" prop="isReturn">
              <el-switch 
                v-model="formData.isReturn"
                active-text="Yes"
                inactive-text="No"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <el-button @click="handleCancel">Cancel</el-button>
      <el-button type="primary" :loading="saving" @click="handleSubmit">
        {{ isEdit ? 'Update' : 'Add' }} Shipping Account
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft, Document, Key, Location, Setting } from '@element-plus/icons-vue'
import type { ShippingAccount } from './types'
import { CARRIER_OPTIONS } from './types'

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()
const saving = ref(false)

// Check if editing
const isEdit = computed(() => !!route.params.id)

// Form data
const formData = reactive<ShippingAccount>({
  carrier: '',
  accountNo: '',
  apiClientId: '',
  apiClientPassword: '',
  apiToken: '',
  trackApiKey: '',
  trackApiSecret: '',
  name: '',
  company: '',
  address1: '',
  address2: '',
  city: '',
  countryRegion: '',
  stateProvince: '',
  zipCode: '',
  phone: '',
  smartPostHubId: '',
  returnAccountNumber: '',
  isReturn: false
})

// Form rules
const rules: FormRules = {
  carrier: [
    { required: true, message: 'Please select carrier', trigger: 'change' }
  ],
  accountNo: [
    { required: true, message: 'Please enter account no', trigger: 'blur' }
  ]
}

// Load data if editing
const loadData = async () => {
  if (!isEdit.value) return
  
  try {
    // TODO: Replace with actual API call
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock data
    Object.assign(formData, {
      carrier: 'fedex',
      accountNo: '123456789',
      apiClientId: 'client123',
      apiClientPassword: 'password123',
      apiToken: 'token123',
      trackApiKey: 'track_key_123',
      trackApiSecret: 'track_secret_123',
      name: 'John Smith',
      company: 'ABC Company',
      address1: '123 Main St',
      address2: 'Suite 100',
      city: 'New York',
      countryRegion: 'US',
      stateProvince: 'NY',
      zipCode: '10001',
      phone: '212-555-0123',
      smartPostHubId: 'HUB123',
      returnAccountNumber: 'RET123',
      isReturn: false
    })
  } catch (error) {
    console.error('Failed to load shipping account:', error)
    ElMessage.error('Failed to load shipping account')
  }
}

// Handle back
const handleBack = () => {
  router.back()
}

// Handle cancel
const handleCancel = () => {
  router.push('/system-settings/shipping-account')
}

// Handle submit
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    saving.value = true
    
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success(`Shipping account ${isEdit.value ? 'updated' : 'added'} successfully`)
    router.push('/system-settings/shipping-account')
  } catch (error) {
    console.error('Validation failed:', error)
  } finally {
    saving.value = false
  }
}

// Initialize
onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.shipping-account-add-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #ffffff;
    }
  }
}

.form-section {
  margin-bottom: 20px;
  border: 1px solid #e4e7ed;
  
  :deep(.el-card__header) {
    background-color: transparent;
    padding: 16px 20px;
    border-bottom: 1px solid #e4e7ed;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 8px;

    .section-icon {
      font-size: 18px;
      color: #ffffff;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
    }
  }

  :deep(.el-card__body) {
    padding: 24px 20px;
  }

  :deep(.el-form-item) {
    margin-bottom: 20px;
  }

  :deep(.el-input),
  :deep(.el-select) {
    width: 100%;
  }
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 0;
}
</style>

