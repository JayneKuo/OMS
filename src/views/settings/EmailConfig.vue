<template>
  <div class="email-config-container">
    <div class="page-header">
      <div class="header-content">
        <h1>Email Configuration</h1>
      </div>
      <el-button type="primary" @click="openAddEmailDialog">
        <el-icon><Plus /></el-icon>Add Email
      </el-button>
    </div>
    
    <!-- Email List -->
    <el-card class="email-list-card">
      <el-table :data="emailList" v-loading="loading" stripe>
        <el-table-column label="Contacts" min-width="180">
          <template #default="{ row }">
            <div class="contacts-info">
              <div v-for="(contact, index) in row.contacts" :key="index" class="contact-item">
                <div class="email-info">
                  <span class="email">{{ contact.email }}</span>
                  <span class="name">{{ contact.name }}</span>
                </div>
              </div>
              <div v-if="!row.contacts || row.contacts.length === 0" class="no-contacts">
                No contacts set
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="Notification Settings" min-width="240">
          <template #default="{ row }">
            <div class="notification-settings">
              <div class="notification-type-tags">
                <!-- Real-time sending -->
                <div v-if="row.notificationSetting.mode === 'realtime'" class="send-setting">
                  <el-icon class="send-icon"><Bell /></el-icon>
                  <span class="send-text">Real-time</span>
                </div>
                
                <!-- Scheduled sending -->
                <div v-else-if="row.notificationSetting.mode === 'scheduled'" class="time-points">
                  <div class="time-points-title">
                    <el-icon class="send-icon scheduled"><Clock /></el-icon>
                    <span class="send-text scheduled">Scheduled: </span>
                  </div>
                  <div class="time-points-list">
                    <div v-for="(time, index) in row.notificationSetting.scheduledTimes" 
                         :key="index" 
                         class="time-point">
                      <el-icon class="time-icon"><Timer /></el-icon>
                      <span class="time-text">{{ time }}</span>
                    </div>
                    <div v-if="!row.notificationSetting.scheduledTimes || row.notificationSetting.scheduledTimes.length === 0" 
                         class="no-time-point">
                      No send time points
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="main-types">
                <el-tag
                  v-for="type in row.notificationTypes"
                  :key="type.code"
                  type="primary"
                  size="small"
                  effect="plain"
                  class="notification-tag"
                >
                  {{ type.nameEn || type.name }}
                </el-tag>
                <div v-if="!row.notificationTypes || row.notificationTypes.length === 0" class="no-types">
                  No notification types set
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="Status" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              @change="(val: boolean) => updateEmailStatus(row, val)"
              inline-prompt
              :active-text="'On'"
              :inactive-text="'Off'"
            />
          </template>
        </el-table-column>
        
        <el-table-column label="Actions" width="160" fixed="right" align="center">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button type="primary" circle size="small" @click="openEditEmailDialog(row)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button type="danger" circle size="small" @click="showDeleteConfirm(row)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- Empty data prompt -->
      <el-empty
        v-if="emailList.length === 0 && !loading"
        description="No email configurations"
      >
        <el-button type="primary" @click="openAddEmailDialog">Add Email</el-button>
      </el-empty>
    </el-card>
    
    <!-- Add/Edit Email Dialog -->
    <el-dialog
      v-model="emailDialogVisible"
      :title="isEdit ? 'Edit Email' : 'Add Email'"
      width="550px"
      destroy-on-close
    >
      <el-form
        ref="emailFormRef"
        :model="emailForm"
        :rules="emailRules"
        label-width="80px"
        label-position="left"
      >
        <!-- Contact List -->
        <el-form-item label="Contacts" prop="contacts" class="contacts-form-item">
          <div class="contacts-list">
            <div 
              v-for="(contact, index) in emailForm.contacts" 
              :key="index"
              class="contact-item"
              :class="{ 
                'error-highlight': emailTestResults && emailTestResults[index]?.status === 'error',
                'success-highlight': emailTestResults && emailTestResults[index]?.status === 'success',
                'pending-highlight': emailTestResults && emailTestResults[index]?.status === 'pending'
              }"
            >
              <div class="contact-inputs">
                <div class="email-input-wrapper">
                  <el-input 
                    v-model="contact.email" 
                    placeholder="Enter email address" 
                    class="email-input"
                    :class="{ 'is-error': emailTestResults && emailTestResults[index]?.status === 'error' }"
                  />
                  <div v-if="emailTestResults && emailTestResults[index]?.status === 'error'" class="input-error-message">
                    <el-icon><WarningFilled /></el-icon> {{ emailTestResults[index]?.message }}
                  </div>
                  <div v-else-if="emailTestResults && emailTestResults[index]?.status === 'success'" class="input-success-message">
                    <el-icon><CircleCheckFilled /></el-icon> {{ emailTestResults[index]?.message }}
                  </div>
                  <div v-else-if="emailTestResults && emailTestResults[index]?.status === 'pending'" class="input-pending-message">
                    <el-icon class="is-loading"><Clock /></el-icon> {{ emailTestResults[index]?.message }}
                  </div>
                </div>
                <el-input 
                  v-model="contact.name" 
                  placeholder="Enter recipient name" 
                  class="name-input"
                />
                <div class="contact-actions">
                  <el-button 
                    type="danger" 
                    circle 
                    size="small" 
                    @click="removeContact(index)"
                    :disabled="emailForm.contacts.length <= 1"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
            
            <div class="add-contact-btn">
              <el-button type="primary" @click="addContact">
                <el-icon><Plus /></el-icon>Add Email Contact
              </el-button>
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="Settings" class="notification-setting-item">
          <div class="setting-form">
            <el-radio-group v-model="emailForm.notificationSetting.mode" class="mode-group">
              <el-radio label="realtime">Real-time</el-radio>
              <el-radio label="scheduled">Scheduled</el-radio>
            </el-radio-group>
            
            <!-- Scheduled sending settings -->
            <div v-if="emailForm.notificationSetting.mode === 'scheduled'" class="scheduled-settings">
              <div class="send-time-title">Send Time</div>
                  <div class="scheduled-times">
                <div 
                  v-for="(time, index) in scheduledTimes" 
                  :key="index" 
                  class="time-item"
                >
                  <div class="time-icon-wrapper">
                    <el-icon class="time-icon"><Clock /></el-icon>
                  </div>
                      <el-time-picker 
                    v-model="scheduledTimes[index]" 
                        format="HH:mm"
                        placeholder="Select time"
                        style="width: 120px"
                      />
                      <el-button 
                        type="danger" 
                        circle 
                        size="small" 
                        @click="removeScheduledTime(index)"
                        class="remove-time-btn"
                    :disabled="scheduledTimes.length <= 1"
                      >
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                    
                <div class="add-time-wrapper">
                  <el-button 
                    type="primary" 
                    @click="addScheduledTime" 
                    class="add-time-btn"
                    plain
                  >
                      <el-icon><Plus /></el-icon>Add Time Point
                    </el-button>
                  </div>
              </div>
            </div>
          </div>
        </el-form-item>
        
        <!-- 添加重发配置 -->
        <el-form-item label="Resend" class="resend-setting-item">
          <div class="resend-form">
            <el-switch
              v-model="emailForm.resendConfig.enabled"
              inline-prompt
              :active-text="'On'"
              :inactive-text="'Off'"
              @change="toggleResend"
            />
            
            <div v-if="emailForm.resendConfig.enabled" class="resend-settings">
              <div class="resend-mode">
                <el-radio-group v-model="emailForm.resendConfig.mode" class="resend-mode-group">
                  <el-radio label="interval">Interval Resend</el-radio>
                  <el-radio label="nextday">Next Day Specific Time</el-radio>
                  <el-radio label="endday">End of Day</el-radio>
                </el-radio-group>
              </div>
              
              <!-- 间隔重发设置 -->
              <div v-if="emailForm.resendConfig.mode === 'interval'" class="interval-settings">
                <div class="interval-hours">
                  <span class="setting-label">Interval Hours:</span>
                  <el-input-number 
                    v-model="emailForm.resendConfig.intervalHours" 
                    :min="1" 
                    :max="24"
                    size="small"
                  />
                  <span class="unit">hours later</span>
                </div>
              </div>
              
              <!-- 次日指定时间设置 -->
              <div v-if="emailForm.resendConfig.mode === 'nextday'" class="nextday-settings">
                <div class="specified-time">
                  <span class="setting-label">Next Day Time:</span>
                  <el-time-picker
                    v-model="nextdayTime"
                    format="HH:mm"
                    placeholder="Select time"
                    @change="updateSpecifiedTime"
                    style="width: 120px"
                  />
                </div>
              </div>
              
              <!-- 通用设置 -->
              <div class="common-settings">
                <div class="max-resend">
                  <span class="setting-label">Max Retries:</span>
                  <el-input-number 
                    v-model="emailForm.resendConfig.maxResendTimes" 
                    :min="0" 
                    :max="10"
                    size="small"
                  />
                  <span class="unit">times (0 means unlimited)</span>
                </div>
                
                <div class="only-unresolved">
                  <el-checkbox v-model="emailForm.resendConfig.onlyForUnresolved">
                    Only resend unresolved issues
                  </el-checkbox>
                  <el-tooltip content="When enabled, only issues marked as unresolved will be resent">
                    <el-icon class="info-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="Types" prop="notificationTypes">
          <div class="notification-tag-selection">
            <div class="selection-actions">
              <div class="selected-count">
                <span class="count">{{ selectedTypes.length }}</span> Selected
              </div>
              <div class="action-buttons">
                <el-button text type="primary" size="small" @click="selectAllTypes" style="color: #6a55f8;">
                  <el-icon><Check /></el-icon> Select All
                </el-button>
                <el-button text type="danger" size="small" @click="clearAllTypes">
                  <el-icon><Delete /></el-icon> Clear
                </el-button>
            </div>
            </div>
            
            <!-- Display all notification types -->
            <div class="all-notification-types">
              <el-check-tag
                v-for="type in filteredNotificationTypes"
                :key="type.code"
                :checked="selectedTypes.includes(type.code)"
                @change="(checked: boolean) => toggleTypeSelection(type.code, checked)"
                class="notification-check-tag"
              >
                <span>{{ type.nameEn }}</span>
                <el-popover
                  placement="top"
                  :width="250"
                  trigger="hover"
                  :content="getTypeTooltip(type)"
                  :popper-style="{ padding: '8px 12px', fontSize: '13px', lineHeight: '1.4', color: 'white', backgroundColor: '#6a55f8', borderRadius: '4px' }"
                  :offset="8"
                  :show-after="50"
                  :hide-after="100"
                >
                  <template #reference>
                    <el-icon class="info-icon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
              </el-check-tag>
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="Status" class="status-form-item">
          <el-switch
            v-model="emailForm.status"
            inline-prompt
            :active-text="'On'"
            :inactive-text="'Off'"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="emailDialogVisible = false">Cancel</el-button>
          <el-button 
            type="primary" 
            @click="testEmailConfig" 
            :loading="testing"
            :class="{ 'highlight-button': !testPassed }"
          >
            Test
          </el-button>
          <el-button 
            type="primary" 
            @click="saveEmail" 
            :loading="submitting"
            :disabled="!testPassed"
          >
            Save
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- Delete Confirmation Dialog -->
    <el-dialog
      v-model="deleteConfirmVisible"
      title="Confirm Delete"
      width="420px"
      :center="true"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      destroy-on-close
    >
      <div class="delete-confirm-content">
        <el-icon class="delete-icon"><WarningFilled /></el-icon>
        <p class="delete-message">
          Are you sure you want to delete this email configuration? 
          <br /><br />
          <span class="delete-warning">No further notifications will be sent.</span>
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelDelete">Cancel</el-button>
          <el-button type="danger" @click="confirmDelete">Delete</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { 
  Plus, 
  Edit, 
  QuestionFilled, 
  Timer, 
  Delete, 
  InfoFilled, 
  Message, 
  Notification, 
  Clock, 
  Bell, 
  Check, 
  CircleCheckFilled, 
  WarningFilled,
  Loading
} from '@element-plus/icons-vue'
import { format } from 'date-fns'
import { 
  NotificationType, 
  EmailConfig, 
  EmailContact,
  ResendConfig
} from '@/types/notification'
import { 
  getEmailConfigs, 
  updateEmailConfig, 
  addEmailConfig, 
  updateNotificationTypes, 
  deleteEmailConfig, 
  updateEmailStatus as apiUpdateEmailStatus,
  testEmailConfig as apiTestEmailConfig 
} from '@/services/notification'

// 自定义通知类型，按照需求表格定义
interface CustomNotificationType extends Partial<NotificationType> {
  code: string
  name: string
  nameEn: string
  category: string
  scenario: string
}

// 表单数据接口
interface EmailFormData {
  id?: string
  contacts: EmailContact[] // 改为contacts数组，支持多个邮箱和接收人
  status: boolean
  notificationTypes: string[]
  notificationSetting: {
    mode: 'realtime' | 'scheduled'
    scheduledTimes?: string[] // 定时发送时间点，格式 ["HH:MM"]
  },
  resendConfig: ResendConfig
}

// 新的单条联系人表单数据
interface ContactFormData {
  email: string
  name: string
}

// 自定义通知类型列表
const customNotificationTypes: CustomNotificationType[] = [
  { 
    code: 'order_update_failed', 
    name: '订单更新失败',
    nameEn: 'Order Update Failed',
    category: '订单更新失败',
    scenario: 'Failed to update third-party order product information or address'
  },
  { 
    code: 'order_creation_failed', 
    name: '订单创建失败',
    nameEn: 'Order Creation Failed',
    category: '订单创建失败',
    scenario: 'New order creation failed, e.g., insufficient inventory, product does not exist, etc.'
  },
  { 
    code: 'dispatch_failed', 
    name: 'dispatch失败',
    nameEn: 'Dispatch Failed',
    category: 'dispatch失败',
    scenario: 'Issues occurred during the dispatch process'
  },
  { 
    code: 'system_error', 
    name: '系统异常',
    nameEn: 'System Error',
    category: '系统异常',
    scenario: 'Internal system errors, such as API failures, missing configurations, etc.'
  },
  { 
    code: 'external_system_error', 
    name: '外部系统异常（WMS等）',
    nameEn: 'External System Error (WMS)',
    category: '系统异常',
    scenario: 'WMS order creation failure, fulfillment failure'
  },
  { 
    code: 'dc_sync_error', 
    name: 'DC回传失败',
    nameEn: 'DC Sync Error',
    category: 'DC回传失败',
    scenario: 'DC data sync missing critical fields'
  }
];

// 状态变量
const loading = ref(false)
const submitting = ref(false)
const testing = ref(false)
const testPassed = ref(false)
const emailList = ref<EmailConfig[]>([])
const emailDialogVisible = ref(false)
const isEdit = ref(false)
const selectedTypes = ref<string[]>([])
const scheduledTimes = ref<string[]>(['09:00'])
// 记录无效邮箱的索引
const invalidEmailIndex = ref<number | null>(null)
// 错误信息
const errorMessage = ref('')
// 有效邮箱索引列表
const validEmailIndices = ref<number[]>([])
// 邮箱测试结果状态
const emailTestResults = ref<Array<{
  index: number,
  status: 'success' | 'error' | 'pending',
  message: string
}>>([])
// 删除确认对话框
const deleteConfirmVisible = ref(false)
const currentDeletingEmail = ref<EmailConfig | null>(null)

// 用于次日指定时间的时间选择器
const nextdayTime = ref<string>('09:00')

// 表单相关
const emailFormRef = ref<FormInstance>()
const emailForm = reactive<EmailFormData>({
  contacts: [{ email: '', name: '' }], // 初始化一个空联系人
  status: true,
  notificationTypes: [],
  notificationSetting: {
    mode: 'realtime'
  },
  resendConfig: {
    enabled: false,
    mode: 'interval',
    intervalHours: 4,
    maxResendTimes: 3,
    onlyForUnresolved: true
  }
})

// 表单验证规则
const emailRules = reactive<FormRules>({
  contacts: [
    { 
      type: 'array', 
      required: true, 
      message: 'Please add at least one contact', 
      trigger: 'change' 
    }
  ],
  notificationTypes: [
    { 
      type: 'array', 
      required: true, 
      message: 'Please select at least one notification type', 
      trigger: 'change' 
    }
  ]
})

// 过滤通知类型
const filteredNotificationTypes = computed(() => {
  return customNotificationTypes;
})

// 生命周期钩子
onMounted(() => {
  fetchEmailList()
})

// 获取邮箱列表数据
const fetchEmailList = async () => {
  loading.value = true
  try {
    // 调用API获取数据
    emailList.value = await getEmailConfigs()
  } catch (error) {
    console.error('Failed to fetch email list:', error)
    ElMessage.error('Failed to fetch email list')
  } finally {
    loading.value = false
  }
}

// 打开添加邮箱对话框
const openAddEmailDialog = () => {
  isEdit.value = false
  emailForm.contacts = [{ email: '', name: '' }]
  emailForm.status = true
  // 默认选中指定的通知类型
  const defaultSelectedTypes = [
    'order_update_failed',    // Order update failed
    'order_creation_failed',  // Order creation failed
    'dispatch_failed',        // Dispatch failed
    'dc_sync_error'           // DC sync error
  ]
  selectedTypes.value = [...defaultSelectedTypes]
  emailForm.notificationTypes = [...selectedTypes.value]
  
  emailForm.notificationSetting = {
    mode: 'realtime'
  }
  
  // 初始化重发配置
  emailForm.resendConfig = {
    enabled: false,
    mode: 'interval',
    intervalHours: 4,
    maxResendTimes: 3,
    onlyForUnresolved: true
  }
  nextdayTime.value = '09:00'
  
  if (emailForm.id) {
    delete emailForm.id
  }
  
  // 重置测试状态
  testPassed.value = false
  invalidEmailIndex.value = null
  errorMessage.value = ''
  validEmailIndices.value = []
  emailTestResults.value = []
  
  scheduledTimes.value = ['09:00']
  emailDialogVisible.value = true
}

// 打开编辑邮箱对话框
const openEditEmailDialog = (row: EmailConfig) => {
  isEdit.value = true
  const typeCodes = row.notificationTypes.map(t => t.code)
  
  // 填充联系人
  emailForm.contacts = row.contacts || [{ email: '', name: '' }]
  emailForm.id = row.id
  emailForm.status = row.status
  emailForm.notificationTypes = typeCodes
  
  // 转换旧的通知设置为新的结构
  emailForm.notificationSetting = {
    mode: 'realtime'
  }
  
  // 如果有旧的notificationFrequency，转换为新结构
  if ('notificationFrequency' in row) {
    const freq = (row as any).notificationFrequency
    if (freq && freq.mode === 'scheduled') {
      emailForm.notificationSetting = {
        mode: 'scheduled',
        scheduledTimes: freq.scheduled?.times || ['09:00']
      }
      scheduledTimes.value = [...(freq.scheduled?.times || ['09:00'])]
    } else if (freq && freq.mode === 'digest') {
      // 将digest模式转为scheduled
      let time = '12:00'
      if (freq.digest?.time) {
        time = freq.digest.time
      }
      emailForm.notificationSetting = {
        mode: 'scheduled',
        scheduledTimes: [time]
      }
      scheduledTimes.value = [time]
    } else {
      scheduledTimes.value = ['09:00']
    }
  } else {
    scheduledTimes.value = ['09:00']
  }
  
  // 填充重发配置
  if (row.resendConfig) {
    emailForm.resendConfig = { ...row.resendConfig }
    if (row.resendConfig.mode === 'nextday' && row.resendConfig.specifiedTime) {
      nextdayTime.value = row.resendConfig.specifiedTime
    }
  } else {
    // 如果没有重发配置，设置默认值
    emailForm.resendConfig = {
      enabled: false,
      mode: 'interval',
      intervalHours: 4,
      maxResendTimes: 3,
      onlyForUnresolved: true
    }
    nextdayTime.value = '09:00'
  }
  
  // 重置测试状态
  testPassed.value = false
  invalidEmailIndex.value = null
  errorMessage.value = ''
  validEmailIndices.value = []
  emailTestResults.value = []
  
  selectedTypes.value = typeCodes
  emailDialogVisible.value = true
}

// 保存邮箱配置
const saveEmail = async () => {
  if (!emailFormRef.value) return
  
  if (!testPassed.value) {
    // 不使用吐司提示，但需要高亮第一个邮箱让用户知道需要测试
    if (emailForm.contacts.length > 0) {
      invalidEmailIndex.value = 0
      errorMessage.value = 'Please test the email configuration first'
    }
    return
  }
  
  await emailFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    // 验证联系人信息
    if (!validateContacts()) {
      return
    }
    
    submitting.value = true
    try {
      // 准备保存的数据
      const notificationTypeObjects = customNotificationTypes
        .filter(type => selectedTypes.value.includes(type.code))
        .map(({ code, name, category }) => ({ 
          code, 
          name, 
          category 
        } as NotificationType))
      
      let savedConfig: EmailConfig
      
      if (isEdit.value && emailForm.id) {
        // 更新现有配置
        savedConfig = await updateEmailConfig({
          id: emailForm.id,
          contacts: emailForm.contacts,
          status: emailForm.status,
          notificationTypes: notificationTypeObjects,
          notificationSetting: emailForm.notificationSetting,
          createdTime: emailList.value.find(e => e.id === emailForm.id)?.createdTime || new Date().toISOString(),
          updatedTime: new Date().toISOString()
        })
        
        // 更新本地数据
        const index = emailList.value.findIndex(item => item.id === savedConfig.id)
        if (index > -1) {
          emailList.value[index] = savedConfig
        }
        
        // 仅限列表页显示成功信息
        ElMessage.success('Email information updated successfully')
      } else {
        // 添加新配置
        savedConfig = await addEmailConfig({
          contacts: emailForm.contacts,
          status: emailForm.status,
          notificationTypes: notificationTypeObjects,
          notificationSetting: emailForm.notificationSetting
        })
        
        // 更新本地数据
        emailList.value.unshift(savedConfig)
        
        // 仅限列表页显示成功信息
        ElMessage.success('Email added successfully')
      }
      
      emailDialogVisible.value = false
    } catch (error) {
      console.error('Failed to save email configuration:', error)
      // 显示保存失败错误在表单中
      errorMessage.value = 'Save failed, please try again'
      invalidEmailIndex.value = 0
    } finally {
      submitting.value = false
    }
  })
}

// 更新邮箱状态
const updateEmailStatus = async (row: EmailConfig, status: boolean) => {
  try {
    // 调用API更新状态
    await apiUpdateEmailStatus(row.id, status)
    
    // 更新本地数据
    row.status = status
    row.updatedTime = new Date().toISOString()
    
    // 保留列表页的成功/警告提示
    if (status) {
      ElMessage.success(`Email enabled successfully`)
    } else {
      ElMessage.warning(`Email disabled. Notifications will no longer be sent to these addresses`)
    }
  } catch (error) {
    console.error('Failed to update email status:', error)
    // 保留列表页的错误提示
    ElMessage.error('Status update failed')
    // 恢复原状态
    row.status = !status
  }
}

// 显示删除确认对话框
const showDeleteConfirm = (row: EmailConfig) => {
  currentDeletingEmail.value = row
  deleteConfirmVisible.value = true
}

// 确认删除
const confirmDelete = async () => {
  if (!currentDeletingEmail.value) return
  
  try {
    // 调用API删除数据
    await deleteEmailConfig(currentDeletingEmail.value.id)
    
    // 更新本地数据
    emailList.value = emailList.value.filter(item => item.id !== currentDeletingEmail.value!.id)
    
    ElMessage.success('Email configuration deleted')
    deleteConfirmVisible.value = false
    currentDeletingEmail.value = null
  } catch (error) {
    console.error('Failed to delete email configuration:', error)
    ElMessage.error('Delete failed, please try again')
    deleteConfirmVisible.value = false
    currentDeletingEmail.value = null
  }
}

// 取消删除
const cancelDelete = () => {
  deleteConfirmVisible.value = false
  currentDeletingEmail.value = null
}

// 删除邮箱配置
const deleteEmail = async (row: EmailConfig) => {
  try {
    // 调用API删除数据
    await deleteEmailConfig(row.id)
    
    // 更新本地数据
    emailList.value = emailList.value.filter(item => item.id !== row.id)
    
    ElMessage.success('Email configuration deleted')
  } catch (error) {
    console.error('Failed to delete email configuration:', error)
    ElMessage.error('Delete failed, please try again')
  }
}

// 格式化日期时间
const formatDateTime = (dateString: string) => {
  try {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss')
  } catch {
    return dateString
  }
}

// 标签类型选择相关方法
// 切换通知类型选择
const toggleTypeSelection = (code: string, checked: boolean) => {
  if (checked) {
    selectedTypes.value.push(code)
  } else {
    const index = selectedTypes.value.indexOf(code)
    if (index !== -1) {
      selectedTypes.value.splice(index, 1)
    }
  }
  emailForm.notificationTypes = [...selectedTypes.value]
}

// 全选所有通知类型
const selectAllTypes = () => {
  selectedTypes.value = customNotificationTypes.map(t => t.code)
  emailForm.notificationTypes = [...selectedTypes.value]
}

// 清除所有选择
const clearAllTypes = () => {
  selectedTypes.value = []
  emailForm.notificationTypes = []
}

// 获取通知类型名称
const getNotificationName = (code: string) => {
  const type = customNotificationTypes.find(t => t.code === code)
  return type?.nameEn || code
}

// 获取通知类型描述
const getNotificationDescription = (code: string) => {
  const type = customNotificationTypes.find(t => t.code === code)
  return type?.scenario || ''
}

// 测试单个邮箱
const testSingleEmail = async (email: string, name: string, index: number) => {
  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      status: 'error' as const,
      message: 'Invalid email format'
    }
  }

  try {
    // 调用API测试单个邮箱配置
    await apiTestEmailConfig({
      emails: [email],
      names: [name || 'Test User']
    })
    
    return {
      status: 'success' as const,
      message: 'Email valid and test passed'
    }
  } catch (error) {
    console.error(`Failed to test email ${email}:`, error)
    return {
      status: 'error' as const,
      message: 'Email test failed'
    }
  }
}

// 测试邮箱配置
const testEmailConfig = async () => {
  if (emailForm.contacts.length === 0 || !emailForm.contacts[0].email) {
    errorMessage.value = 'Please enter at least one email address'
    invalidEmailIndex.value = 0
    return
  }
  
  // 重置测试状态
  validEmailIndices.value = []
  
  // 初始化所有邮箱的测试状态为pending
  emailTestResults.value = emailForm.contacts.map((_, index) => ({
    index,
    status: 'pending' as const,
    message: 'Testing...'
  }))
  
  // 验证格式并收集所有有效邮箱
  const validContacts: {index: number, email: string, name: string}[] = []
  
  // 先进行基本验证
  for (let i = 0; i < emailForm.contacts.length; i++) {
    const contact = emailForm.contacts[i]
    
    // 验证姓名和邮箱是否填写
    if (!contact.email || !contact.name) {
      emailTestResults.value[i] = {
        index: i,
        status: 'error',
        message: 'Email and name required'
      }
      continue
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contact.email)) {
      emailTestResults.value[i] = {
        index: i,
        status: 'error',
        message: 'Invalid email format'
      }
      continue
    }
    
    // 收集有效的联系人进行测试
    validContacts.push({
      index: i,
      email: contact.email,
      name: contact.name
    })
  }
  
  // 如果没有有效的联系人，直接返回
  if (validContacts.length === 0) {
    testPassed.value = false
    return
  }
  
  testing.value = true
  
  try {
    // 测试每个有效的邮箱
    for (const contact of validContacts) {
      // 显示测试进行中的状态
      emailTestResults.value[contact.index] = {
        index: contact.index,
        status: 'pending',
        message: 'Testing...'
      }
      
      const result = await testSingleEmail(contact.email, contact.name, contact.index)
      
      // 更新测试结果
      emailTestResults.value[contact.index] = {
        index: contact.index,
        status: result.status,
        message: result.message
      }
      
      // 如果测试通过，添加到有效邮箱列表
      if (result.status === 'success') {
        validEmailIndices.value.push(contact.index)
      }
    }
    
    // 如果所有邮箱都测试通过，设置总体测试通过
    if (validEmailIndices.value.length === emailForm.contacts.length) {
      testPassed.value = true
    } else {
      testPassed.value = false
    }
  } catch (error) {
    console.error('Failed to test emails:', error)
    testPassed.value = false
  } finally {
    testing.value = false
  }
}

// 添加联系人
const addContact = () => {
  emailForm.contacts.push({ email: '', name: '' })
  // 添加联系人后需要重新测试
  testPassed.value = false
  validEmailIndices.value = []
  emailTestResults.value = []
}

// 删除联系人
const removeContact = (index: number) => {
  // 保证至少有一个联系人
  if (emailForm.contacts.length > 1) {
    emailForm.contacts.splice(index, 1)
    // 更新测试结果数组
    emailTestResults.value = emailTestResults.value.filter(result => result.index !== index)
    emailTestResults.value.forEach(result => {
      if (result.index > index) {
        result.index--
      }
    })
    
    // 更新有效邮箱索引
    validEmailIndices.value = validEmailIndices.value.filter(i => i !== index)
    validEmailIndices.value = validEmailIndices.value.map(i => i > index ? i - 1 : i)
    
    // 如果删除了无效邮箱，可能需要重新评估测试状态
    if (validEmailIndices.value.length === emailForm.contacts.length) {
      testPassed.value = true
    } else {
      testPassed.value = false
    }
  }
}

// 监听联系人信息变化
watch(() => emailForm.contacts, () => {
  // 联系人变化时重置测试状态
  testPassed.value = false
  invalidEmailIndex.value = null
  errorMessage.value = ''
  validEmailIndices.value = []
  emailTestResults.value = []
}, { deep: true })

// 验证联系人信息
const validateContacts = () => {
  // 验证是否有联系人
  if (emailForm.contacts.length === 0) {
    errorMessage.value = 'Please add at least one contact'
    return false
  }
  
  // 验证每个联系人的邮箱和姓名
  for (let i = 0; i < emailForm.contacts.length; i++) {
    const contact = emailForm.contacts[i]
    if (!contact.email || !contact.name) {
      errorMessage.value = 'Please fill in complete contact email and name'
      invalidEmailIndex.value = i
      return false
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contact.email)) {
      errorMessage.value = `Invalid email format`
      invalidEmailIndex.value = i
      return false
    }
  }
  
  return true
}

// 生成通知类型的提示信息
const getTypeTooltip = (type: any) => {
  return type.scenario || 'No usage scenario description'
}

// 添加定时发送时间点
const addScheduledTime = () => {
  scheduledTimes.value.push('12:00')
  syncScheduledTimes()
}

// 删除定时发送时间点
const removeScheduledTime = (index: number) => {
  scheduledTimes.value.splice(index, 1)
  syncScheduledTimes()
}

// 同步定时发送时间到表单
const syncScheduledTimes = () => {
  emailForm.notificationSetting.scheduledTimes = [...scheduledTimes.value]
}

// 切换重发开关
const toggleResend = (enabled: boolean) => {
  if (enabled && !emailForm.resendConfig.intervalHours) {
    emailForm.resendConfig.intervalHours = 4
  }
}

// 更新次日指定时间
const updateSpecifiedTime = () => {
  emailForm.resendConfig.specifiedTime = nextdayTime.value
}
</script>

<style lang="scss" scoped>
.email-config-container {
  padding: 24px;
  min-height: 100vh;
  background: var(--bg-dark);
  
  /* Override Element Plus default colors */
  --el-color-primary: #6a55f8;
  --el-color-primary-light-3: #8c7af9;
  --el-color-primary-light-5: #b0a2fa;
  --el-color-primary-light-7: #d5ccff;
  --el-color-primary-light-9: #f3f0ff;
  --el-color-primary-dark-2: #5a46d6;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h1 {
    font-size: 24px;
    font-weight: 500;
    margin: 0;
    color: var(--text-primary);
  }
}

.email-list-card {
  margin-bottom: 24px;
}

/* Contact list display style */
.contacts-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  padding: 12px;
  border-radius: 4px;
  transition: all 0.3s;
}

.email-info {
  display: flex;
  flex-direction: column;
}

.email {
  font-weight: bold;
}

.name {
  color: var(--text-secondary);
  font-size: 12px;
}

.no-contacts {
  color: var(--text-secondary);
  font-style: italic;
}

/* Form contact style */
.contacts-form-item {
  margin-bottom: 20px;
}

.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
  
.contact-item {
    display: flex;
  align-items: flex-start;
  gap: 8px;
    
  .contact-inputs {
      display: flex;
    flex: 1;
    gap: 12px;
    flex-direction: row;
    align-items: center;
    
    .email-input {
      flex: 3;
    }
    
    .name-input {
      flex: 2;
    }
  }
  
  .contact-actions {
    display: flex;
    align-items: center;
    margin-left: 4px;
  }
}

.add-contact-btn {
  margin-top: 16px;
}

.notification-settings {
  display: flex;
  flex-direction: column;

  .notification-type-tags {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;

    .send-setting {
      display: flex;
      align-items: center;
      margin-right: 12px;
      
      .send-icon {
        margin-right: 4px;
        color: #6a55f8;
        font-size: 16px;
      }
      
      .send-text {
        font-weight: 600;
        color: #6a55f8;
      }
    }
    
    .time-points {
      display: flex;
      flex-direction: column;
      width: 100%;
      
      .time-points-title {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        
        .send-icon {
          margin-right: 4px;
          color: #67c23a;
          font-size: 16px;
        }
        
        .send-text {
          font-weight: 600;
          color: #67c23a;
        }
      }
      
      .time-points-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-left: 20px;
        
        .time-point {
          display: flex;
          align-items: center;
          padding: 2px 8px;
          background-color: #f0f9eb;
          border-radius: 4px;
          
          .time-icon {
            font-size: 14px;
            color: #67c23a;
            margin-right: 4px;
          }
          
          .time-text {
            font-size: 13px;
            color: #67c23a;
          }
        }
        
        .no-time-point {
          font-size: 13px;
          color: #909399;
          font-style: italic;
        }
      }
    }
  }
  
  .main-types {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .notification-tag {
    margin-bottom: 4px;
    background-color: #ecf5ff;
    color: #409eff;
    border-color: #d9ecff;
  }
  
  .no-types {
    font-size: 13px;
    color: #909399;
    font-style: italic;
  }
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

/* Notification type category style */
.notification-tag-selection {
  width: 100%;
}

.selection-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.selected-count {
  margin-left: 16px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  
  .count {
    color: #6a55f8;
    font-weight: 500;
  }
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.all-notification-types {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0;
  background-color: transparent;
  border: none;
}

.notification-check-tag {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  background-color: #f9f9f9;
  color: #606266;
  cursor: pointer;
  transition: all 0.15s;
    display: flex;
    align-items: center;
  border: 1px solid transparent;
  box-shadow: none;
  margin-bottom: 6px;
  
  &:hover {
    background-color: #f3f0ff;
    color: #6a55f8;
    border-color: transparent;
  }
  
  .info-icon {
    margin-left: 5px;
    font-size: 14px;
    color: #aaa;
    cursor: help;
    transition: color 0.2s;
    
    &:hover {
      color: #6a55f8;
    }
  }
}

.notification-check-tag.is-checked {
  background-color: #6a55f8;
  border-color: transparent;
  color: white;
  box-shadow: none;
}

/* Tooltip style */
:deep(.el-popover) {
  max-width: 250px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(106, 85, 248, 0.2);
  border: none;
}

/* 错误高亮样式 */
.error-highlight {
  position: relative;
  padding: 8px;
  border-radius: 4px;
  background-color: rgba(245, 108, 108, 0.1);
  border: 1px dashed #f56c6c;
}

.success-highlight {
  position: relative;
  padding: 8px;
  border-radius: 4px;
  background-color: rgba(103, 194, 58, 0.1);
  border: 1px dashed #67c23a;
}

.is-error {
  .el-input__wrapper {
    box-shadow: 0 0 0 1px #f56c6c inset !important;
  }
}

/* 高亮按钮样式 */
.highlight-button {
  background-color: #e6a23c !important;
  border-color: #e6a23c !important;
  color: white !important;
  box-shadow: 0 0 12px rgba(230, 162, 60, 0.4) !important;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(230, 162, 60, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(230, 162, 60, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(230, 162, 60, 0);
  }
}

/* 按钮组样式 */
.dialog-footer {
  display: flex;
  gap: 10px;
  
  .el-button {
    flex: 1;
  }
}

/* 联系人输入区域布局优化 */
.contact-inputs {
  display: flex;
  flex: 1;
  gap: 12px;
  flex-direction: row;
  align-items: center;
  
  .email-input {
    flex: 3;
  }
  
  .name-input {
    flex: 2;
  }
}

.contact-actions {
  display: flex;
  align-items: center;
  margin-left: 4px;
}

.email-input-wrapper {
  position: relative;
  flex: 3;
  
  .input-error-message {
    position: absolute;
    font-size: 12px;
    color: #f56c6c;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
    
    .el-icon {
      font-size: 14px;
    }
  }
  
  .input-success-message {
    position: absolute;
    font-size: 12px;
    color: #67c23a;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
    
    .el-icon {
      font-size: 14px;
    }
  }
  
  .input-pending-message {
    position: absolute;
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
    
    .el-icon {
      font-size: 14px;
    }
  }
}

/* 按钮内的加载动画 */
.is-loading {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 待处理高亮样式 */
.pending-highlight {
  position: relative;
  padding: 8px;
  border-radius: 4px;
  background-color: rgba(144, 147, 153, 0.1);
  border: 1px dashed #909399;
}

.delete-confirm-content {
  display: flex;
  align-items: flex-start;
  padding: 20px 0;
  
  .delete-icon {
    font-size: 26px;
    color: #f56c6c;
    margin-right: 16px;
    margin-top: 4px;
  }
  
  .delete-message {
    font-size: 16px;
    line-height: 1.6;
    margin: 0;
    color: #303133;
    
    .delete-warning {
      color: #f56c6c;
      font-weight: 500;
    }
  }
}

// 重发设置样式
.resend-setting-item {
  margin-top: 16px;
  margin-bottom: 16px;
}

.resend-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.resend-settings {
  padding: 16px;
  border-radius: 4px;
  background-color: transparent;
  margin-top: 12px;
}

.resend-mode {
  margin-bottom: 16px;
}

.resend-mode-group {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 20px;
}

.interval-settings,
.nextday-settings,
.common-settings {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.interval-hours,
.specified-time,
.max-resend,
.only-unresolved {
  display: flex;
  align-items: center;
  gap: 8px;
}

.setting-label {
  min-width: 100px;
  margin-right: 8px;
}

.unit {
  margin-left: 8px;
  color: var(--text-secondary);
}

.info-icon {
  color: #6a55f8;
  cursor: pointer;
  margin-left: 4px;
}
</style> 
