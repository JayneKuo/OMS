<template>
  <div class="email-config-container">
    <div class="page-header">
      <div class="header-content">
        <h1>Email Configuration</h1>
      </div>
    </div>
    
    <!-- Tab选项卡 -->
    <el-tabs v-model="activeTab" class="config-tabs">
      <el-tab-pane label="Email Contacts" name="contacts">
        <div class="contacts-wrapper">
          <div class="contacts-header">
            <div class="header-actions">
              <el-button @click="downloadImportTemplate" type="info">
                <el-icon><Download /></el-icon>Download Template
              </el-button>
              <el-upload
                class="import-upload"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleImportFile"
                accept=".xlsx,.csv"
              >
                <el-button type="success">
                  <el-icon><Upload /></el-icon>Import Contacts
                </el-button>
              </el-upload>
              <el-button type="primary" @click="openAddContactDialog">
                <el-icon><Plus /></el-icon>Add Contact
              </el-button>
            </div>
          </div>
          
          <!-- 联系人列表 -->
          <div class="contacts-table-wrapper">
            <el-table 
              :data="contactsList" 
              v-loading="contactsLoading" 
              stripe 
              class="dark-table"
            >
              <el-table-column label="Email" min-width="180">
                <template #default="{ row }">
                  <div class="email-info">
                    <span class="email">{{ row.email }}</span>
                  </div>
                </template>
              </el-table-column>
              
              <el-table-column label="Name" min-width="120">
                <template #default="{ row }">
                  <div class="name-info">
                    <span class="name">{{ row.name }}</span>
                  </div>
                </template>
              </el-table-column>
              
              <el-table-column label="Status" width="100" align="center">
                <template #default="{ row }">
                  <el-switch
                    v-model="row.status"
                    @change="(val: boolean) => updateContactStatus(row, val)"
                    inline-prompt
                    :active-text="'On'"
                    :inactive-text="'Off'"
                  />
                </template>
              </el-table-column>
              
              <el-table-column label="Actions" width="160" fixed="right" align="center">
                <template #default="{ row }">
                  <div class="action-buttons">
                    <el-button type="primary" circle size="small" @click="openEditContactDialog(row)">
                      <el-icon><Edit /></el-icon>
                    </el-button>
                    <el-button type="danger" circle size="small" @click="showDeleteContactConfirm(row)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- 空数据提示 -->
            <el-empty
              v-if="contactsList.length === 0 && !contactsLoading"
              description="No contacts"
              :image-size="100"
            >
              <el-button type="primary" @click="openAddContactDialog">Add Contact</el-button>
            </el-empty>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="Notification Settings" name="notifications">
        <!-- 通知类型选择部分 -->
        <div class="settings-section">
          <div class="section-icon">
            <el-icon><Notification /></el-icon>
          </div>
          <div class="section-title">Notification Types</div>
          <div class="section-desc">Select event types for email notifications</div>
          
          <div class="notification-types">
            <div class="actions-row">
              <el-button text type="primary" @click="selectAllTypes">Select All</el-button>
              <el-button text type="primary" @click="clearAllTypes">Clear</el-button>
            </div>
            
            <div class="type-list">
              <div 
                v-for="type in filteredNotificationTypes" 
                :key="type.code"
                class="type-item"
                :class="{ 'is-selected': selectedTypes.includes(type.code) }"
                @click="toggleTypeItem(type.code)"
              >
                <el-checkbox 
                  :model-value="selectedTypes.includes(type.code)"
                  @change="(val:boolean) => toggleTypeSelection(type.code, val)"
                />
                <div class="type-info">
                  <div class="type-name">{{ type.nameEn }}</div>
                  <div class="type-desc">{{ getTypeTooltip(type) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 发送设置部分 -->
        <div class="settings-section">
          <div class="section-icon">
            <el-icon><Message /></el-icon>
          </div>
          <div class="section-title">Sending Settings</div>
          <div class="section-desc">Configure how and when notification emails are sent</div>
          
          <div class="setting-row">
            <div class="setting-name">Send Mode</div>
            <div class="setting-value">
              <el-radio-group v-model="emailForm.notificationSetting.mode">
                <el-radio label="realtime">Real-time</el-radio>
                <el-radio label="scheduled">Scheduled</el-radio>
              </el-radio-group>
            </div>
          </div>
          
          <div class="setting-row" v-if="emailForm.notificationSetting.mode === 'scheduled'">
            <div class="setting-name">Send Times</div>
            <div class="setting-value">
              <div class="time-list">
                <div class="time-item" v-for="(time, index) in scheduledTimes" :key="index">
                  <el-time-picker 
                    v-model="scheduledTimes[index]" 
                    format="HH:mm"
                    placeholder="Select time"
                  />
                  <el-button 
                    type="danger" 
                    circle 
                    size="small" 
                    @click="removeScheduledTime(index)"
                    :disabled="scheduledTimes.length <= 1"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
              <el-button 
                type="primary" 
                plain 
                @click="addScheduledTime" 
                class="add-time-btn"
              >
                <el-icon><Plus /></el-icon>Add Time
              </el-button>
            </div>
          </div>
        </div>
        
        <!-- 重发设置部分 -->
        <div class="settings-section">
          <div class="section-icon">
            <el-icon><RefreshRight /></el-icon>
          </div>
          <div class="section-title">Resend Settings</div>
          <div class="section-desc">Configure rules for resending unresolved notifications</div>
          
          <div class="setting-row">
            <div class="setting-name">Enable Resend</div>
            <div class="setting-value">
              <el-switch
                v-model="emailForm.resendConfig.enabled"
                inline-prompt
                :active-text="'On'"
                :inactive-text="'Off'"
                @change="toggleResend"
              />
            </div>
          </div>
          
          <template v-if="emailForm.resendConfig.enabled">
            <div class="setting-row">
              <div class="setting-name">Resend Mode</div>
              <div class="setting-value">
                <el-radio-group v-model="emailForm.resendConfig.mode">
                  <el-radio label="interval">Interval</el-radio>
                  <el-radio label="nextday">Next Day</el-radio>
                  <el-radio label="endday">End of Day</el-radio>
                </el-radio-group>
              </div>
            </div>
            
            <div class="setting-row" v-if="emailForm.resendConfig.mode === 'interval'">
              <div class="setting-name">Interval</div>
              <div class="setting-value">
                <div class="input-with-unit">
                  <el-input-number 
                    v-model="emailForm.resendConfig.intervalHours" 
                    :min="1" 
                    :max="24"
                    size="default"
                  />
                  <span class="unit">hours</span>
                </div>
              </div>
            </div>
            
            <div class="setting-row" v-if="emailForm.resendConfig.mode === 'nextday'">
              <div class="setting-name">Next Day Time</div>
              <div class="setting-value">
                <el-time-picker
                  v-model="nextdayTime"
                  format="HH:mm"
                  placeholder="Select time"
                  @change="updateSpecifiedTime"
                />
              </div>
            </div>
            
            <div class="setting-row">
              <div class="setting-name">Max Retries</div>
              <div class="setting-value">
                <div class="input-with-unit">
                  <el-input-number 
                    v-model="emailForm.resendConfig.maxResendTimes" 
                    :min="0" 
                    :max="10"
                    size="default"
                  />
                  <span class="unit">times</span>
                </div>
              </div>
            </div>
            
            <div class="setting-row">
              <div class="setting-name">Unresolved Only</div>
              <div class="setting-value">
                <el-checkbox 
                  v-model="emailForm.resendConfig.onlyForUnresolved"
                >
                  Only resend for unresolved issues
                </el-checkbox>
              </div>
            </div>
          </template>
        </div>
        
        <!-- 保存按钮 -->
        <el-button 
          type="primary" 
          @click="saveEmail" 
          :loading="submitting"
          class="save-btn"
        >
          Save Settings
        </el-button>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 添加/编辑联系人对话框 -->
    <el-dialog
      v-model="contactDialogVisible"
      :title="isContactEdit ? 'Edit Contact' : 'Add Contact'"
      width="550px"
      destroy-on-close
    >
      <el-form
        ref="contactFormRef"
        :model="contactForm"
        :rules="contactRules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="Email" prop="email">
          <div class="email-input-wrapper">
            <el-input 
              v-model="contactForm.email" 
              placeholder="Enter email address" 
              class="email-input"
              :class="{ 'is-error': contactEmailTestResult?.status === 'error' }"
            />
            <div v-if="contactEmailTestResult?.status === 'error'" class="input-error-message">
              <el-icon><WarningFilled /></el-icon> {{ contactEmailTestResult.message }}
            </div>
            <div v-else-if="contactEmailTestResult?.status === 'success'" class="input-success-message">
              <el-icon><CircleCheckFilled /></el-icon> {{ contactEmailTestResult.message }}
            </div>
            <div v-else-if="contactEmailTestResult?.status === 'pending'" class="input-pending-message">
              <el-icon class="is-loading"><Clock /></el-icon> {{ contactEmailTestResult.message }}
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="Name" prop="name">
          <el-input 
            v-model="contactForm.name" 
            placeholder="Enter contact name" 
            class="name-input"
          />
        </el-form-item>
        
        <el-form-item label="Status" class="status-form-item">
          <el-switch
            v-model="contactForm.status"
            inline-prompt
            :active-text="'On'"
            :inactive-text="'Off'"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="contactDialogVisible = false">Cancel</el-button>
          <el-button 
            type="primary" 
            @click="testContactEmail" 
            :loading="contactTesting"
            :class="{ 'highlight-button': !contactTestPassed }"
          >
            Test
          </el-button>
          <el-button 
            type="primary" 
            @click="saveContact" 
            :loading="contactSubmitting"
            :disabled="!contactTestPassed"
          >
            Save
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 删除确认对话框 -->
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
          <span class="delete-warning">No more notifications will be sent.</span>
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelDelete">Cancel</el-button>
          <el-button type="danger" @click="confirmDelete">Delete</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 删除联系人确认对话框 -->
    <el-dialog
      v-model="deleteContactConfirmVisible"
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
          Are you sure you want to delete this contact?
          <br /><br />
          <span class="delete-warning">This may affect notifications if this contact is used in existing configurations.</span>
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelDeleteContact">Cancel</el-button>
          <el-button type="danger" @click="confirmDeleteContact">Delete</el-button>
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
  Loading,
  RefreshRight,
  Download,
  Upload
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
  testEmailConfig as apiTestEmailConfig,
  getEmailContacts,
  addEmailContact,
  updateEmailContact,
  deleteEmailContact,
  updateContactStatus as apiUpdateContactStatus,
  testContact as apiTestContact
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
  contacts: EmailContact[] // 直接使用联系人对象列表
  status: boolean
  notificationTypes: string[]
  notificationSetting: {
    mode: 'realtime' | 'scheduled'
    scheduledTimes?: string[] // 定时发送时间点，格式 ["HH:MM"]
  },
  resendConfig: ResendConfig
}

// 联系人接口
interface ContactData {
  id?: string
  email: string
  name: string
  status: boolean
}

// 联系人表单数据
interface ContactFormData {
  id?: string
  email: string
  name: string
  status: boolean
}

// 自定义通知类型列表
const customNotificationTypes: CustomNotificationType[] = [
  { 
    code: 'order_update_failed', 
    name: 'Order Update Failed',
    nameEn: 'Order Update Failed',
    category: 'Order Issues',
    scenario: 'Failed to update third-party order product information or address'
  },
  { 
    code: 'order_creation_failed', 
    name: 'Order Creation Failed',
    nameEn: 'Order Creation Failed',
    category: 'Order Issues',
    scenario: 'New order creation failed, e.g., insufficient inventory, product does not exist, etc.'
  },
  { 
    code: 'dispatch_failed', 
    name: 'Dispatch Failed',
    nameEn: 'Dispatch Failed',
    category: 'Dispatch Issues',
    scenario: 'Issues occurred during the dispatch process'
  },
  { 
    code: 'dc_sync_error', 
    name: 'DC Sync Error',
    nameEn: 'DC Sync Error',
    category: 'Integration Issues',
    scenario: 'DC data sync missing critical fields'
  }
];

// Tab页状态
const activeTab = ref('contacts'); // 默认显示联系人标签页

// 邮件配置状态变量
const loading = ref(false)
const submitting = ref(false)
const testing = ref(false)
const testPassed = ref(false)
const emailList = ref<EmailConfig[]>([])
const emailDialogVisible = ref(false)
const isEdit = ref(false)
const selectedTypes = ref<string[]>([])
const scheduledTimes = ref<string[]>(['09:00'])

// 联系人管理状态变量
const contactsLoading = ref(false)
const contactSubmitting = ref(false)
const contactTesting = ref(false)
const contactTestPassed = ref(false)
const contactsList = ref<ContactData[]>([])
const contactDialogVisible = ref(false)
const isContactEdit = ref(false)
const contactEmailTestResult = ref<{
  status: 'success' | 'error' | 'pending',
  message: string
} | null>(null)

// 其他状态变量
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
// 联系人删除确认对话框
const deleteContactConfirmVisible = ref(false)
const currentDeletingContact = ref<ContactData | null>(null)

// 用于次日指定时间的时间选择器
const nextdayTime = ref<string>('09:00')

// 表单相关
const emailFormRef = ref<FormInstance>()
const emailForm = reactive<EmailFormData>({
  contacts: [{ email: '', name: '' }], // 初始化为一个空联系人
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

// 联系人表单相关
const contactFormRef = ref<FormInstance>()
const contactForm = reactive<ContactFormData>({
  email: '',
  name: '',
  status: true
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

// 联系人表单验证规则
const contactRules = reactive<FormRules>({
  email: [
    { required: true, message: 'Please enter an email address', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email format', trigger: 'blur' }
  ],
  name: [
    { required: true, message: 'Please enter the contact name', trigger: 'blur' }
  ]
})

// 过滤通知类型
const filteredNotificationTypes = computed(() => {
  return customNotificationTypes;
})

// 类型映射，用于checkbox绑定
const typesMap = ref<Record<string, boolean>>({})

// 生命周期钩子
onMounted(() => {
  fetchEmailList()
  fetchContactsList()
  // 默认设置一个配置
  initDefaultEmailConfig()
})

// 初始化默认配置
const initDefaultEmailConfig = () => {
  // 默认选中指定的通知类型
  const defaultSelectedTypes = [
    'order_update_failed',    // 订单更新失败
    'order_creation_failed',  // 订单创建失败
    'dispatch_failed',        // Dispatch失败
    'dc_sync_error'           // DC同步错误
  ]
  selectedTypes.value = [...defaultSelectedTypes]
  emailForm.notificationTypes = [...selectedTypes.value]
  
  // 初始化类型映射
  customNotificationTypes.forEach(type => {
    typesMap.value[type.code] = selectedTypes.value.includes(type.code)
  })
  
  // 初始化一个默认联系人
  if (emailForm.contacts.length === 0) {
    emailForm.contacts = [{ email: '', name: '' }]
  }
  
  // 尝试从现有配置加载，如果有
  if (emailList.value.length > 0) {
    const existingConfig = emailList.value[0]
    isEdit.value = true
    emailForm.id = existingConfig.id
    
    // 设置联系人
    if (existingConfig.contacts && existingConfig.contacts.length > 0) {
      emailForm.contacts = [...existingConfig.contacts]
    }
    
    emailForm.status = existingConfig.status
    emailForm.notificationTypes = existingConfig.notificationTypes.map(t => t.code)
    selectedTypes.value = [...emailForm.notificationTypes]
    
    // 设置通知设置
    emailForm.notificationSetting = { 
      ...existingConfig.notificationSetting 
    }
    
    // 设置调度时间
    if (existingConfig.notificationSetting.mode === 'scheduled' && existingConfig.notificationSetting.scheduledTimes) {
      scheduledTimes.value = [...existingConfig.notificationSetting.scheduledTimes]
    }
    
    // 设置重发配置
    if (existingConfig.resendConfig) {
      emailForm.resendConfig = { ...existingConfig.resendConfig }
      if (existingConfig.resendConfig.mode === 'nextday' && existingConfig.resendConfig.specifiedTime) {
        nextdayTime.value = existingConfig.resendConfig.specifiedTime
      }
    }
  }
}

// 获取邮箱列表数据
const fetchEmailList = async () => {
  loading.value = true
  try {
    // 调用API获取数据
    emailList.value = await getEmailConfigs()
  } catch (error) {
    console.error('获取邮件配置列表失败:', error)
    ElMessage.error('获取邮件配置列表失败')
  } finally {
    loading.value = false
  }
}

// 获取联系人列表数据
const fetchContactsList = async () => {
  contactsLoading.value = true
  try {
    // 调用API获取联系人数据
    contactsList.value = await getEmailContacts()
  } catch (error) {
    console.error('获取联系人列表失败:', error)
    ElMessage.error('获取联系人列表失败')
  } finally {
    contactsLoading.value = false
  }
}

// 打开添加联系人对话框
const openAddContactDialog = () => {
  isContactEdit.value = false
  contactForm.email = ''
  contactForm.name = ''
  contactForm.status = true
  
  if (contactForm.id) {
    delete contactForm.id
  }
  
  // 重置测试状态
  contactTestPassed.value = false
  contactEmailTestResult.value = null
  
  contactDialogVisible.value = true
}

// 打开编辑联系人对话框
const openEditContactDialog = (row: ContactData) => {
  isContactEdit.value = true
  contactForm.id = row.id
  contactForm.email = row.email
  contactForm.name = row.name
  contactForm.status = row.status
  
  // 重置测试状态
  contactTestPassed.value = false
  contactEmailTestResult.value = null
  
  contactDialogVisible.value = true
}

// 保存联系人
const saveContact = async () => {
  if (!contactFormRef.value) return
  
  if (!contactTestPassed.value) {
    // 提示测试邮箱
    ElMessage.warning('请先测试邮箱配置')
    return
  }
  
  await contactFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    contactSubmitting.value = true
    try {
      let savedContact: ContactData
      
      if (isContactEdit.value && contactForm.id) {
        // 更新现有联系人
        savedContact = await updateEmailContact({
          id: contactForm.id,
          email: contactForm.email,
          name: contactForm.name,
          status: contactForm.status
        })
        
        // 更新本地数据
        const index = contactsList.value.findIndex(item => item.id === savedContact.id)
        if (index > -1) {
          contactsList.value[index] = savedContact
        }
        
        ElMessage.success('联系人信息更新成功')
      } else {
        // 添加新联系人
        savedContact = await addEmailContact({
          email: contactForm.email,
          name: contactForm.name,
          status: contactForm.status
        })
        
        // 更新本地数据
        contactsList.value.unshift(savedContact)
        
        ElMessage.success('联系人添加成功')
      }
      
      contactDialogVisible.value = false
    } catch (error) {
      console.error('保存联系人失败:', error)
      ElMessage.error('保存失败，请重试')
    } finally {
      contactSubmitting.value = false
    }
  })
}

// 更新联系人状态
const updateContactStatus = async (row: ContactData, status: boolean) => {
  try {
    // 调用API更新状态，确保 id 不为 undefined
    if (row.id) {
      await apiUpdateContactStatus(row.id, status)
      
      // 更新本地数据
      row.status = status
      
      if (status) {
        ElMessage.success(`Contact enabled`)
      } else {
        ElMessage.warning(`Contact disabled, will not receive notifications`)
      }
    }
  } catch (error) {
    console.error('Failed to update contact status:', error)
    ElMessage.error('Status update failed')
    // 恢复原状态
    row.status = !status
  }
}

// 显示删除联系人确认对话框
const showDeleteContactConfirm = (row: ContactData) => {
  currentDeletingContact.value = row
  deleteContactConfirmVisible.value = true
}

// 确认删除联系人
const confirmDeleteContact = async () => {
  if (!currentDeletingContact.value) return
  
  try {
    // 调用API删除数据
    await deleteEmailContact(currentDeletingContact.value.id!)
    
    // 更新本地数据
    contactsList.value = contactsList.value.filter(item => item.id !== currentDeletingContact.value!.id)
    
    ElMessage.success('联系人删除成功')
    deleteContactConfirmVisible.value = false
    currentDeletingContact.value = null
  } catch (error) {
    console.error('删除联系人失败:', error)
    ElMessage.error('删除失败，请重试')
    deleteContactConfirmVisible.value = false
    currentDeletingContact.value = null
  }
}

// 取消删除联系人
const cancelDeleteContact = () => {
  deleteContactConfirmVisible.value = false
  currentDeletingContact.value = null
}

// 测试联系人邮箱
const testContactEmail = async () => {
  if (!contactForm.email) {
    ElMessage.warning('请输入邮箱地址')
    return
  }
  
  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(contactForm.email)) {
    contactEmailTestResult.value = {
      status: 'error',
      message: '邮箱格式不正确'
    }
    contactTestPassed.value = false
    return
  }
  
  // 设置为测试中状态
  contactEmailTestResult.value = {
    status: 'pending',
    message: '测试中...'
  }
  contactTesting.value = true
  
  try {
    // 调用API测试邮箱
    await apiTestContact({
      email: contactForm.email,
      name: contactForm.name || '测试用户'
    })
    
    // 测试成功
    contactEmailTestResult.value = {
      status: 'success',
      message: '邮箱有效，测试通过'
    }
    contactTestPassed.value = true
  } catch (error) {
    console.error('测试邮箱失败:', error)
    contactEmailTestResult.value = {
      status: 'error',
      message: '邮箱测试失败'
    }
    contactTestPassed.value = false
  } finally {
    contactTesting.value = false
  }
}

// 打开添加邮箱对话框
const openAddEmailDialog = () => {
  isEdit.value = false
  emailForm.contacts = [{ email: '', name: '' }] // 初始化为一个空联系人
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
  
  scheduledTimes.value = ['09:00']
  emailDialogVisible.value = true
}

// 打开编辑邮箱对话框
const openEditEmailDialog = (row: EmailConfig) => {
  isEdit.value = true
  const typeCodes = row.notificationTypes.map(t => t.code)
  
  // 设置联系人
  if (row.contacts && row.contacts.length > 0) {
    emailForm.contacts = [...row.contacts]
  } else {
    emailForm.contacts = [{ email: '', name: '' }]
  }
  
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
  
  selectedTypes.value = typeCodes
  emailDialogVisible.value = true
}

// 添加联系人
const addContact = () => {
  emailForm.contacts.push({ email: '', name: '' })
}

// 删除联系人
const removeContact = (index: number) => {
  if (emailForm.contacts.length > 1) {
    emailForm.contacts.splice(index, 1)
  }
}

// 保存邮箱配置
const saveEmail = async () => {
  if (!emailFormRef.value) return
  
  await emailFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.warning('请填写完整的配置信息')
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
      
      // 验证联系人字段
      const selectedContacts = emailForm.contacts.filter(contact => 
        contact.email.trim() !== '' && contact.name.trim() !== ''
      )
      
      if (selectedContacts.length === 0) {
        ElMessage.warning('请添加至少一个有效的联系人')
        submitting.value = false
        return
      }
      
      let savedConfig: EmailConfig
      
      if (isEdit.value && emailForm.id) {
        // 更新现有配置
        savedConfig = await updateEmailConfig({
          id: emailForm.id,
          contacts: selectedContacts,
          status: emailForm.status,
          notificationTypes: notificationTypeObjects,
          notificationSetting: emailForm.notificationSetting,
          resendConfig: emailForm.resendConfig,
          createdTime: emailList.value.find(e => e.id === emailForm.id)?.createdTime || new Date().toISOString(),
          updatedTime: new Date().toISOString()
        })
        
        // 更新本地数据
        const index = emailList.value.findIndex(item => item.id === savedConfig.id)
        if (index > -1) {
          emailList.value[index] = savedConfig
        } else {
          // 如果之前没有这个配置，添加到列表
          emailList.value.unshift(savedConfig)
        }
        
        ElMessage.success('邮件配置更新成功')
      } else {
        // 添加新配置
        savedConfig = await addEmailConfig({
          contacts: selectedContacts,
          status: emailForm.status,
          notificationTypes: notificationTypeObjects,
          notificationSetting: emailForm.notificationSetting,
          resendConfig: emailForm.resendConfig
        })
        
        // 更新本地数据
        emailList.value = [savedConfig] // 只保留一个配置
        isEdit.value = true
        emailForm.id = savedConfig.id
        
        ElMessage.success('邮件配置保存成功')
      }
      
    } catch (error) {
      console.error('保存邮件配置失败:', error)
      ElMessage.error('保存失败，请重试')
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
    
    if (status) {
      ElMessage.success(`邮件配置已启用`)
    } else {
      ElMessage.warning(`邮件配置已禁用，不会再发送通知到这些邮箱`)
    }
  } catch (error) {
    console.error('更新邮件状态失败:', error)
    ElMessage.error('状态更新失败')
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
    
    ElMessage.success('邮件配置删除成功')
    deleteConfirmVisible.value = false
    currentDeletingEmail.value = null
  } catch (error) {
    console.error('删除邮件配置失败:', error)
    ElMessage.error('删除失败，请重试')
    deleteConfirmVisible.value = false
    currentDeletingEmail.value = null
  }
}

// 取消删除
const cancelDelete = () => {
  deleteConfirmVisible.value = false
  currentDeletingEmail.value = null
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
    if (!selectedTypes.value.includes(code)) {
      selectedTypes.value.push(code)
    }
  } else {
    const index = selectedTypes.value.indexOf(code)
    if (index !== -1) {
      selectedTypes.value.splice(index, 1)
    }
  }
  typesMap.value[code] = checked
  emailForm.notificationTypes = [...selectedTypes.value]
}

// 点击类型项切换选中状态
const toggleTypeItem = (code: string) => {
  const newValue = !typesMap.value[code]
  typesMap.value[code] = newValue
  toggleTypeSelection(code, newValue)
}

// 全选所有通知类型
const selectAllTypes = () => {
  selectedTypes.value = customNotificationTypes.map(t => t.code)
  emailForm.notificationTypes = [...selectedTypes.value]
  // 更新类型映射
  customNotificationTypes.forEach(type => {
    typesMap.value[type.code] = true
  })
}

// 清除所有选择
const clearAllTypes = () => {
  selectedTypes.value = []
  emailForm.notificationTypes = []
  // 更新类型映射
  customNotificationTypes.forEach(type => {
    typesMap.value[type.code] = false
  })
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

// 生成通知类型的提示信息
const getTypeTooltip = (type: any) => {
  return type.scenario || '无使用场景描述'
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

// 联系人批量导入相关
const handleImportFile = (file: any) => {
  if (!file) return
  
  const formData = new FormData()
  formData.append('file', file.raw)
  
  // 显示导入中状态
  contactsLoading.value = true
  
  // 模拟导入处理
  setTimeout(() => {
    // 这里应该调用实际的API进行批量导入
    // 例如: importContactsFromFile(formData)
    
    // 模拟导入成功效果
    ElMessage.success('Successfully imported contacts from file')
    fetchContactsList() // 重新加载联系人列表
  }, 1500)
}

// 下载导入模板
const downloadImportTemplate = () => {
  // 在实际应用中，这里应该是从服务器下载模板文件
  // 这里以创建一个简单的CSV文件为例进行模拟
  
  const template = 'email,name,status\nuser1@example.com,User 1,true\nuser2@example.com,User 2,false'
  const blob = new Blob([template], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  
  // 创建下载链接
  const link = document.createElement('a')
  link.href = url
  link.download = 'contacts_import_template.csv'
  document.body.appendChild(link)
  link.click()
  
  // 清理
  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 0)
  
  ElMessage.success('Template downloaded successfully')
}
</script>

<style lang="scss" scoped>
.email-config-container {
  padding: 16px;
  min-height: 100vh;
  background-color: #17171F;
  color: #ffffff;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h1 {
    font-size: 20px;
    font-weight: 500;
    margin: 0;
    color: #ffffff;
  }
}

.config-tabs {
  :deep(.el-tabs__header) {
    border-bottom: none;
    margin-bottom: 16px;
  }
  
  :deep(.el-tabs__item) {
    color: rgba(255, 255, 255, 0.6);
    
    &.is-active {
      color: #ffffff;
    }
  }
  
  :deep(.el-tabs__active-bar) {
    background-color: #8C65F6;
  }
}

.settings-section {
  position: relative;
  margin-bottom: 28px;
  padding-top: 8px;
}

.section-icon {
  position: absolute;
  left: 0;
  top: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #8C65F6;
  
  .el-icon {
    color: #fff;
    font-size: 14px;
  }
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  margin-left: 32px;
  margin-bottom: 8px;
}

.section-desc {
  margin-left: 32px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 16px;
}

.notification-types {
  margin-left: 32px;
}

.actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-bottom: 12px;
}

.type-list {
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.type-item {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  &.is-selected {
    background-color: rgba(140, 101, 246, 0.1);
  }
  
  .el-checkbox {
    margin-right: 8px;
    margin-top: 2px;
  }
}

.type-info {
  flex: 1;
}

.type-name {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 4px;
}

.type-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.setting-row {
  display: flex;
  margin-bottom: 20px;
  margin-left: 32px;
}

.setting-name {
  width: 120px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 32px;
}

.setting-value {
  flex: 1;
}

.time-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.time-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .unit {
    color: rgba(255, 255, 255, 0.7);
  }
}

.add-time-btn {
  margin-top: 8px;
}

.save-btn {
  margin-left: 32px;
  margin-top: 24px;
  background-color: #8C65F6;
  border-color: #8C65F6;
  
  &:hover {
    background-color: #9B78FF;
    border-color: #9B78FF;
  }
}

// 覆盖Element Plus暗色主题
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #8C65F6;
  border-color: #8C65F6;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: #8C65F6;
  border-color: #8C65F6;
}

:deep(.el-radio__label) {
  color: rgba(255, 255, 255, 0.8);
}

:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #8C65F6;
}

:deep(.el-checkbox__label) {
  color: rgba(255, 255, 255, 0.8);
}

:deep(.el-switch.is-checked .el-switch__core) {
  background-color: #8C65F6;
  border-color: #8C65F6;
}

:deep(.el-button--text) {
  color: #8C65F6;
}

.contacts-wrapper {
  margin-bottom: 24px;
}

.contacts-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.import-upload {
  display: inline-block;
}

.contacts-table-wrapper {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

:deep(.dark-table) {
  background-color: transparent;
  color: #ffffff;
  
  .el-table__header-wrapper th {
    background-color: rgba(140, 101, 246, 0.1);
    color: rgba(255, 255, 255, 0.9);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .el-table__row {
    background-color: transparent;
    
    &:hover > td {
      background-color: rgba(255, 255, 255, 0.05) !important;
    }
    
    td {
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.8);
    }
  }
  
  .el-table__empty-block {
    background-color: transparent;
  }
  
  .el-table__empty-text {
    color: rgba(255, 255, 255, 0.5);
  }
}

:deep(.el-empty__description) {
  color: rgba(255, 255, 255, 0.5);
}

.email-info, .name-info {
  color: #ffffff;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style> 




