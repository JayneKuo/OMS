<template>
  <div class="email-logs-container">
    <div class="page-header">
      <h2>Exception Logs</h2>
      <div class="header-actions">
        <el-tooltip content="Refresh" placement="top">
          <span class="icon-button" @click="refreshData">
            <el-icon><Refresh /></el-icon>
          </span>
        </el-tooltip>
        <el-tooltip content="Batch Send Email" placement="top">
          <span class="icon-button success-icon" @click="showBatchSendDialog">
            <el-icon><Message /></el-icon>
          </span>
        </el-tooltip>
      </div>
    </div>

    <!-- Search Filter Area -->
    <div class="search-area">
      <el-form :model="searchForm" inline>
        <el-form-item label="Time Range">
          <el-date-picker
            v-model="searchForm.timeRange"
            type="daterange"
            range-separator="to"
            start-placeholder="Start Date"
            end-placeholder="End Date"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="Issue Type">
          <el-select 
            v-model="searchForm.issueType" 
            placeholder="Select Issue Type" 
            clearable
            style="min-width: 180px;"
          >
            <el-option label="Inventory Issue" value="inventory" />
            <el-option label="Order Issue" value="order" />
            <el-option label="Logistics Issue" value="logistics" />
            <el-option label="System Error" value="system" />
            <el-option label="Other Issues" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="Status">
          <el-select 
            v-model="searchForm.status" 
            placeholder="Select Status" 
            clearable
            style="min-width: 180px;"
          >
            <el-option label="Unresolved" value="unsolved" />
            <el-option label="Resolved" value="solved" />
          </el-select>
        </el-form-item>
        <el-form-item label="Email Status">
          <el-select 
            v-model="searchForm.emailSent" 
            placeholder="Email Status" 
            clearable
            style="min-width: 180px;"
          >
            <el-option label="Sent" value="sent" />
            <el-option label="Unsent" value="unsent" />
            <el-option label="Failed" value="failed" />
          </el-select>
        </el-form-item>
        <el-form-item label="Channel">
          <el-select 
            v-model="searchForm.channel" 
            placeholder="Select Channel" 
            clearable
            style="min-width: 180px;"
          >
            <el-option label="Amazon" value="amazon" />
            <el-option label="Shopify" value="shopify" />
            <el-option label="Walmart" value="walmart" />
            <el-option label="eBay" value="ebay" />
            <el-option label="Other" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="Keyword">
          <el-input 
            v-model="searchForm.keyword" 
            placeholder="Order ID/System ID/Description" 
            style="min-width: 250px;"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">Search</el-button>
          <el-button @click="resetSearch">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Table Display Area -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="channel" label="Channel" width="120" />
      <el-table-column prop="channelOrderId" label="Channel Order NO." width="180" show-overflow-tooltip />
      <el-table-column prop="systemOrderId" label="OMS Order NO." width="180" show-overflow-tooltip>
        <template #default="scope">
          <el-link 
            type="primary" 
            @click="navigateToOrderDetail(scope.row.systemOrderId)"
            :underline="false"
            class="order-link"
          >
            {{ scope.row.systemOrderId }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="issueType" label="Issue Type" width="120">
        <template #default="scope">
          <el-tag :type="getIssueTypeTag(scope.row.issueType)">
            {{ getIssueTypeLabel(scope.row.issueType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="Description" min-width="200" show-overflow-tooltip />
      <el-table-column prop="status" label="Status" width="120">
        <template #default="scope">
          <el-tag :type="getStatusTag(scope.row.status)">
            {{ getStatusLabel(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="emailSent" label="Email Status" width="100">
        <template #default="scope">
          <el-tag :type="getEmailSentTag(scope.row.emailSent)">
            {{ getEmailSentLabel(scope.row.emailSent) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastSendTime" label="Update Time" width="180" sortable>
        <template #default="scope">
          {{ formatDateTime(scope.row.lastSendTime || scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="120" fixed="right">
        <template #default="scope">
          <div class="action-buttons">
            <el-tooltip content="View Details" placement="top">
              <span class="icon-button primary-icon" @click="viewDetails(scope.row)">
                <el-icon><Document /></el-icon>
              </span>
            </el-tooltip>
            <el-tooltip content="Send Email" placement="top" v-if="scope.row.emailSent === 'unsent'">
              <span 
                class="icon-button success-icon"
                @click="sendEmail(scope.row)"
              >
                <el-icon><Message /></el-icon>
              </span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- Detail Dialog -->
    <el-dialog
      v-model="detailDialogVisible"
      title="Exception Log Detail"
      width="60%"
    >
      <div v-if="currentDetail" class="log-detail">
        <div class="detail-item">
          <span class="label">Created Time:</span>
          <span>{{ formatDateTime(currentDetail.createTime) }}</span>
        </div>
        <div class="detail-item" v-if="currentDetail.lastSendTime && currentDetail.lastSendTime !== currentDetail.createTime">
          <span class="label">Updated Time:</span>
          <span>{{ formatDateTime(currentDetail.lastSendTime) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Channel:</span>
          <span>{{ currentDetail.channel }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Channel Order NO.:</span>
          <span>{{ currentDetail.channelOrderId }}</span>
        </div>
        <div class="detail-item">
          <span class="label">OMS Order NO.:</span>
          <el-link 
            v-if="currentDetail?.systemOrderId" 
            type="primary" 
            @click="navigateToOrderDetail(currentDetail.systemOrderId)"
            :underline="false"
            class="order-link"
          >
            {{ currentDetail.systemOrderId }}
          </el-link>
          <span v-else>-</span>
        </div>
        <div class="detail-item">
          <span class="label">Issue Type:</span>
          <el-tag :type="getIssueTypeTag(currentDetail.issueType)">
            {{ getIssueTypeLabel(currentDetail.issueType) }}
          </el-tag>
        </div>
        <div class="detail-item">
          <span class="label">Description:</span>
          <div class="description-content">{{ currentDetail.description }}</div>
        </div>
        <div class="detail-item">
          <span class="label">Status:</span>
          <el-tag :type="getStatusTag(currentDetail.status)">
            {{ getStatusLabel(currentDetail.status) }}
          </el-tag>
        </div>
        <div class="detail-item">
          <span class="label">Email Status:</span>
          <el-tag :type="getEmailSentTag(currentDetail.emailSent)">
            {{ getEmailSentLabel(currentDetail.emailSent) }}
          </el-tag>
        </div>
        <div class="detail-item" v-if="currentDetail.recipients">
          <span class="label">Recipients:</span>
          <span>{{ currentDetail.recipients }}</span>
        </div>
        <div class="detail-item" v-if="currentDetail.emailContent">
          <span class="label">Email Content:</span>
          <div class="email-content" v-html="currentDetail.emailContent"></div>
        </div>
        <div class="detail-item" v-if="currentDetail.emailHistory && currentDetail.emailHistory.length > 0">
          <span class="label">Send History:</span>
          <div class="email-history">
            <div class="history-item" v-for="(history, index) in currentDetail.emailHistory" :key="index">
              <div class="history-time">{{ formatDateTime(history.sendTime) }}</div>
              <div class="history-status">
                <el-tag :type="getEmailSentTag(history.status)" size="small">
                  {{ getEmailSentLabel(history.status) }}
                </el-tag>
              </div>
              <div class="history-recipients" v-if="history.recipients">Recipients: {{ history.recipients }}</div>
            </div>
          </div>
        </div>
        <div class="detail-item" v-if="currentDetail.resolveTime">
          <span class="label">Resolve Time:</span>
          <span>{{ formatDateTime(currentDetail.resolveTime) }}</span>
        </div>
        <div class="detail-item" v-if="currentDetail.resolveNote">
          <span class="label">Resolution:</span>
          <div class="resolve-note">{{ currentDetail.resolveNote }}</div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-tooltip content="Close" placement="top">
            <span class="icon-button" @click="detailDialogVisible = false">
              <el-icon><Close /></el-icon>
            </span>
          </el-tooltip>
          <el-tooltip content="Send Email" placement="top" v-if="currentDetail && currentDetail.emailSent === 'unsent'">
            <span 
              class="icon-button success-icon"
              @click="sendEmail(currentDetail!)"
            >
              <el-icon><Message /></el-icon>
            </span>
          </el-tooltip>
          <el-tooltip content="Resend" placement="top" v-if="currentDetail && currentDetail.emailSent !== 'unsent'">
            <span 
              class="icon-button success-icon"
              @click="sendEmail(currentDetail!)"
            >
              <el-icon><RefreshRight /></el-icon>
            </span>
          </el-tooltip>
        </span>
      </template>
    </el-dialog>

    <!-- Resolve Issue Dialog -->
    <el-dialog
      v-model="resolveDialogVisible"
      title="Mark Issue as Resolved"
      width="50%"
    >
      <el-form :model="resolveForm" label-width="120px">
        <el-form-item label="Resolution">
          <el-input
            v-model="resolveForm.resolveNote"
            type="textarea"
            :rows="4"
            placeholder="Enter resolution or handling result"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-tooltip content="Cancel" placement="top">
            <span class="icon-button" @click="resolveDialogVisible = false">
              <el-icon><Close /></el-icon>
            </span>
          </el-tooltip>
          <el-tooltip content="Confirm" placement="top">
            <span class="icon-button primary-icon" @click="confirmResolve">
              <el-icon><Check /></el-icon>
            </span>
          </el-tooltip>
        </span>
      </template>
    </el-dialog>

    <!-- Send Email Dialog -->
    <el-dialog
      v-model="emailDialogVisible"
      title="Send Email Notification"
      width="60%"
    >
      <el-form :model="emailForm" label-width="120px">
        <el-form-item label="Recipients">
          <el-select
            v-model="emailForm.recipientList"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="Enter recipient emails, press Enter to add multiple"
            style="width: 100%"
          >
            <el-option
              v-for="item in commonRecipients"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="CC">
          <el-select
            v-model="emailForm.ccList"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="Enter CC emails, press Enter to add multiple"
            style="width: 100%"
          >
            <el-option
              v-for="item in commonRecipients"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Subject">
          <el-input v-model="emailForm.subject" placeholder="Enter email subject" />
        </el-form-item>
        <el-form-item label="Content">
          <el-input
            v-model="emailForm.content"
            type="textarea"
            :rows="8"
            placeholder="Enter email content"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-tooltip content="Cancel" placement="top">
            <span class="icon-button" @click="emailDialogVisible = false">
              <el-icon><Close /></el-icon>
            </span>
          </el-tooltip>
          <el-tooltip content="Send" placement="top">
            <span class="icon-button primary-icon" @click="confirmSendEmail">
              <el-icon><Message /></el-icon>
            </span>
          </el-tooltip>
        </span>
      </template>
    </el-dialog>

    <!-- Batch Send Email Dialog -->
    <el-dialog
      v-model="batchEmailDialogVisible"
      title="Batch Send Email Notifications"
      width="50%"
    >
      <div class="batch-email-content">
        <p>You are about to send email notifications for the following exceptions:</p>
        <div class="batch-summary">
          <p v-if="selectedRows.length > 0">{{ selectedRows.length }} records selected</p>
          <p v-else>No records selected, will send to all unresolved issues without emails</p>
          
          <el-alert
            v-if="computedSendList.length === 0"
            title="No records match the criteria for sending"
            type="warning"
            :closable="false"
            style="margin-top: 10px;"
          />
          
          <div v-else class="type-summary">
            <h4>Summary by Type:</h4>
            <ul>
              <li v-for="(count, type) in getIssueTypeCounts()" :key="type">
                {{ getIssueTypeLabel(type) }}: {{ count }} record(s)
              </li>
            </ul>
          </div>
        </div>
        
        <div class="batch-options" v-if="computedSendList.length > 0">
          <p>Default recipients will be used based on issue type. You can also set unified recipients:</p>
          <el-form>
            <el-form-item label="Unified Recipients">
              <el-select
                v-model="batchEmailForm.recipientList"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="Leave empty to use default recipients, press Enter to add multiple"
                style="width: 100%"
              >
                <el-option
                  v-for="item in commonRecipients"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Unified CC">
              <el-select
                v-model="batchEmailForm.ccList"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="Optional, press Enter to add multiple CC addresses"
                style="width: 100%"
              >
                <el-option
                  v-for="item in commonRecipients"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-tooltip content="Cancel" placement="top">
            <span class="icon-button" @click="batchEmailDialogVisible = false">
              <el-icon><Close /></el-icon>
            </span>
          </el-tooltip>
          <el-tooltip content="Send" placement="top">
            <span 
              class="icon-button primary-icon" 
              @click="confirmBatchSend"
              :class="{ 'disabled-icon': computedSendList.length === 0 }"
            >
              <el-icon><Message /></el-icon>
            </span>
          </el-tooltip>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getEmailLogsList, markLogAsSolved, sendEmailNotification } from '@/api/emailLogs'
import type { LogItem } from '@/api/emailLogs'
import { useRouter } from 'vue-router'
import { Document, Message, Close, Check, Refresh, RefreshRight } from '@element-plus/icons-vue'

// 状态和引用
const loading = ref(false)
const tableData = ref<LogItem[]>([])
const selectedRows = ref<LogItem[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const detailDialogVisible = ref(false)
const resolveDialogVisible = ref(false)
const emailDialogVisible = ref(false)
const batchEmailDialogVisible = ref(false)
const currentDetail = ref<LogItem | null>(null)
const currentItemId = ref('')
const router = useRouter()

// 搜索表单
const searchForm = reactive({
  timeRange: [],
  issueType: '',
  status: '',
  emailSent: '',
  channel: '',
  keyword: ''
})

// 解决问题表单
const resolveForm = reactive({
  resolveNote: ''
})

// 发送邮件表单
const emailForm = reactive({
  recipients: '',
  cc: '',
  recipientList: [] as string[],
  ccList: [] as string[],
  subject: '',
  content: ''
})

// 批量发送邮件表单
const batchEmailForm = reactive({
  recipients: '',
  cc: '',
  recipientList: [] as string[],
  ccList: [] as string[]
})

// 常用联系人列表
const commonRecipients = [
  { label: 'Warehouse Admin', value: 'warehouse@example.com' },
  { label: 'Order Service', value: 'orders@example.com' },
  { label: 'Logistics Dept', value: 'logistics@example.com' },
  { label: 'IT Support', value: 'it-support@example.com' },
  { label: 'Customer Support', value: 'support@example.com' }
]

// 生命周期钩子
onMounted(() => {
  fetchData()
})

// 获取数据
const fetchData = async () => {
  loading.value = true
  
  try {
    // 构建搜索参数
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      startTime: searchForm.timeRange && searchForm.timeRange.length > 0 ? searchForm.timeRange[0] : '',
      endTime: searchForm.timeRange && searchForm.timeRange.length > 0 ? searchForm.timeRange[1] : '',
      issueType: searchForm.issueType,
      status: searchForm.status,
      emailSent: searchForm.emailSent,
      channel: searchForm.channel,
      keyword: searchForm.keyword
    }
    
    // 调用API获取数据
    const res = await getEmailLogsList(params)
    tableData.value = res.data
    total.value = res.total
  } catch (error) {
    console.error('Failed to get email logs:', error)
    ElMessage.error('Failed to get email logs')
  } finally {
    loading.value = false
  }
}

// 搜索方法
const search = () => {
  currentPage.value = 1
  fetchData()
}

// 重置搜索
const resetSearch = () => {
  // 重置搜索表单
  searchForm.timeRange = []
  searchForm.issueType = ''
  searchForm.status = ''
  searchForm.emailSent = ''
  searchForm.channel = ''
  searchForm.keyword = ''
  
  // 重新加载数据
  currentPage.value = 1
  fetchData()
}

// 刷新数据
const refreshData = () => {
  fetchData()
}

// 查看详情
const viewDetails = (row: LogItem) => {
  currentDetail.value = { ...row }
  detailDialogVisible.value = true
}

// 标记为已解决
const markAsSolved = (row: LogItem) => {
  currentItemId.value = row.id
  resolveForm.resolveNote = ''
  resolveDialogVisible.value = true
}

// 标记为已解决（在详情对话框中）
const markAsSolvedInDialog = () => {
  if (currentDetail.value) {
    currentItemId.value = currentDetail.value.id
    resolveForm.resolveNote = ''
    resolveDialogVisible.value = true
  }
}

// 确认解决
const confirmResolve = async () => {
  if (!resolveForm.resolveNote.trim()) {
    ElMessage.warning('Please enter a resolution')
    return
  }
  
  loading.value = true
  try {
    // 调用API
    await markLogAsSolved(currentItemId.value, {
      resolveNote: resolveForm.resolveNote
    })
    
    // 更新本地数据
    const index = tableData.value.findIndex(item => item.id === currentItemId.value)
    if (index !== -1) {
      tableData.value[index].status = 'solved'
      tableData.value[index].resolveTime = new Date().toISOString()
      tableData.value[index].resolveNote = resolveForm.resolveNote
      
      // 如果当前正在查看这个项目的详情，也更新详情
      if (currentDetail.value && currentDetail.value.id === currentItemId.value) {
        currentDetail.value.status = 'solved'
        currentDetail.value.resolveTime = new Date().toISOString()
        currentDetail.value.resolveNote = resolveForm.resolveNote
      }
    }
    
    ElMessage.success('Issue marked as resolved')
    resolveDialogVisible.value = false
  } catch (error) {
    console.error('Failed to mark issue as resolved:', error)
    ElMessage.error('Operation failed, please try again')
  } finally {
    loading.value = false
  }
}

// 发送邮件
const sendEmail = (row: LogItem) => {
  currentItemId.value = row.id
  
  // 如果邮件已发送过且有内容，则使用之前的内容作为模板
  if (row.emailSent !== 'unsent' && row.emailContent) {
    // 预填邮件表单
    emailForm.subject = `System Exception Notification: ${getIssueTypeLabel(row.issueType)}`
    
    // 将HTML格式转回普通文本
    emailForm.content = row.emailContent.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '')
    
    // 使用之前的收件人信息，并转换为数组
    if (row.recipients) {
      emailForm.recipientList = row.recipients.split(',').map(email => email.trim());
    } else {
      emailForm.recipientList = [getDefaultRecipientsByIssueType(row.issueType)];
    }
  } else {
    // 使用默认模板
    emailForm.subject = `System Exception Notification: ${getIssueTypeLabel(row.issueType)}`
    emailForm.content = `System detected the following exception:\n\nIssue Type: ${getIssueTypeLabel(row.issueType)}\nDescription: ${row.description}\n\nChannel: ${row.channel}\nChannel Order NO.: ${row.channelOrderId}\nOMS Order NO.: ${row.systemOrderId}\n\nPlease address this issue promptly.`
    emailForm.recipientList = [getDefaultRecipientsByIssueType(row.issueType)];
  }
  
  emailForm.ccList = [];
  emailDialogVisible.value = true
}

// 重新发送邮件
const resendEmail = (row: LogItem) => {
  // 预填邮件表单
  currentItemId.value = row.id
  
  // 如果有之前的内容，则使用之前的内容
  emailForm.subject = row.emailContent 
    ? `System Exception Notification: ${getIssueTypeLabel(row.issueType)}` 
    : `System Exception Notification: ${getIssueTypeLabel(row.issueType)}`
  
  // 获取之前的内容，如果有的话
  if (row.emailContent) {
    // 将HTML格式转回普通文本
    emailForm.content = row.emailContent.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '')
  } else {
    // 使用默认模板
    emailForm.content = `System detected the following exception:\n\nIssue Type: ${getIssueTypeLabel(row.issueType)}\nDescription: ${row.description}\n\nChannel: ${row.channel}\nChannel Order NO.: ${row.channelOrderId}\nOMS Order NO.: ${row.systemOrderId}\n\nPlease address this issue promptly.`
  }
  
  // 之前的收件人信息
  emailForm.recipients = row.recipients || getDefaultRecipientsByIssueType(row.issueType)
  emailForm.cc = ''
  
  emailDialogVisible.value = true
}

// 确认发送邮件
const confirmSendEmail = async () => {
  if (emailForm.recipientList.length === 0) {
    ElMessage.warning('Please enter at least one recipient email')
    return
  }
  
  if (!emailForm.subject.trim()) {
    ElMessage.warning('Please enter an email subject')
    return
  }
  
  if (!emailForm.content.trim()) {
    ElMessage.warning('Please enter email content')
    return
  }
  
  // 将数组转换为逗号分隔的字符串
  emailForm.recipients = emailForm.recipientList.join(',');
  emailForm.cc = emailForm.ccList.join(',');
  
  loading.value = true
  try {
    // 调用API发送邮件
    await sendEmailNotification(currentItemId.value, {
      recipients: emailForm.recipients,
      cc: emailForm.cc,
      subject: emailForm.subject,
      content: emailForm.content
    })
    
    // 更新本地数据
    const index = tableData.value.findIndex(item => item.id === currentItemId.value)
    if (index !== -1) {
      tableData.value[index].emailSent = 'sent'
      tableData.value[index].recipients = emailForm.recipients
      tableData.value[index].emailContent = emailForm.content.replace(/\n/g, '<br>')
      tableData.value[index].lastSendTime = new Date().toISOString()
      
      // 如果当前没有邮件历史记录，创建一个空数组
      if (!tableData.value[index].emailHistory) {
        tableData.value[index].emailHistory = []
      }
      
      // 添加新的发送记录
      tableData.value[index].emailHistory.push({
        sendTime: new Date().toISOString(),
        status: 'sent',
        recipients: emailForm.recipients
      })
      
      // 如果当前正在查看这个项目的详情，也更新详情
      if (currentDetail.value && currentDetail.value.id === currentItemId.value) {
        currentDetail.value.emailSent = 'sent'
        currentDetail.value.recipients = emailForm.recipients
        currentDetail.value.emailContent = emailForm.content.replace(/\n/g, '<br>')
        currentDetail.value.lastSendTime = new Date().toISOString()
        
        if (!currentDetail.value.emailHistory) {
          currentDetail.value.emailHistory = []
        }
        
        currentDetail.value.emailHistory.push({
          sendTime: new Date().toISOString(),
          status: 'sent',
          recipients: emailForm.recipients
        })
      }
    }
    
    ElMessage.success('Email sent')
    emailDialogVisible.value = false
  } catch (error) {
    console.error('Failed to send email:', error)
    ElMessage.error('Failed to send email, please try again')
  } finally {
    loading.value = false
  }
}

// 处理多选变化
const handleSelectionChange = (rows: LogItem[]) => {
  selectedRows.value = rows
}

// 计算实际要发送的列表
const computedSendList = computed(() => {
  // 如果有选择的行，则使用选择的行中未发送且未解决的记录
  if (selectedRows.value.length > 0) {
    return selectedRows.value.filter(
      row => row.emailSent === 'unsent' && row.status === 'unsolved'
    )
  }
  
  // 否则返回所有未发送且未解决的记录
  return tableData.value.filter(
    row => row.emailSent === 'unsent' && row.status === 'unsolved'
  )
})

// 按问题类型统计数量
const getIssueTypeCounts = () => {
  const counts: Record<string, number> = {}
  computedSendList.value.forEach(issue => {
    if (!counts[issue.issueType]) {
      counts[issue.issueType] = 0
    }
    counts[issue.issueType]++
  })
  return counts
}

// 显示批量发送对话框
const showBatchSendDialog = () => {
  batchEmailForm.recipientList = []
  batchEmailForm.ccList = []
  batchEmailDialogVisible.value = true
}

// 确认批量发送
const confirmBatchSend = async () => {
  if (computedSendList.value.length === 0) {
    ElMessage.warning('No records match the criteria for sending')
    return
  }
  
  // 将多选列表转换为字符串
  batchEmailForm.recipients = batchEmailForm.recipientList.join(',');
  batchEmailForm.cc = batchEmailForm.ccList.join(',');
  
  loading.value = true
  try {
    // 跟踪成功和失败的数量
    let successCount = 0
    let failCount = 0
    
    // 依次发送邮件
    for (const issue of computedSendList.value) {
      try {
        // 构建邮件内容
        const emailData = {
          recipients: batchEmailForm.recipients || getDefaultRecipientsByIssueType(issue.issueType),
          cc: batchEmailForm.cc || '',
          subject: `System Exception Notification: ${getIssueTypeLabel(issue.issueType)}`,
          content: `System detected the following exception:\n\nIssue Type: ${getIssueTypeLabel(issue.issueType)}\nDescription: ${issue.description}\n\nChannel: ${issue.channel}\nChannel Order NO.: ${issue.channelOrderId}\nOMS Order NO.: ${issue.systemOrderId}\n\nPlease address this issue promptly.`
        }
        
        // 发送邮件
        await sendEmailNotification(issue.id, emailData)
        successCount++
        
        // 更新本地数据
        const index = tableData.value.findIndex(item => item.id === issue.id)
        if (index !== -1) {
          tableData.value[index].emailSent = 'sent'
          tableData.value[index].lastSendTime = new Date().toISOString()
        }
      } catch (error) {
        console.error(`Failed to send email (ID: ${issue.id}):`, error)
        failCount++
      }
    }
    
    // 显示结果消息
    if (successCount > 0 && failCount === 0) {
      ElMessage.success(`Successfully sent ${successCount} notification emails`)
    } else if (successCount > 0 && failCount > 0) {
      ElMessage.warning(`Successfully sent ${successCount} emails, ${failCount} failed`)
    } else {
      ElMessage.error(`All emails failed to send`)
    }
    
    // 关闭对话框并刷新数据
    batchEmailDialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error('Batch email sending failed:', error)
    ElMessage.error('Batch email sending failed')
  } finally {
    loading.value = false
  }
}

// 根据问题类型获取默认收件人
const getDefaultRecipientsByIssueType = (issueType: string) => {
  const recipientsMap: Record<string, string> = {
    'inventory': 'warehouse@example.com',
    'order': 'orders@example.com',
    'logistics': 'logistics@example.com',
    'system': 'it-support@example.com',
    'other': 'support@example.com'
  }
  
  return recipientsMap[issueType] || 'support@example.com'
}

// 分页方法
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

// 辅助格式化方法
const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 获取问题类型标签
const getIssueTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    'inventory': 'Inventory Issue',
    'order': 'Order Issue',
    'logistics': 'Logistics Issue',
    'system': 'System Error',
    'other': 'Other Issues'
  }
  return typeMap[type] || type
}

// 获取问题类型对应的标签类型
const getIssueTypeTag = (type: string) => {
  const typeTagMap: Record<string, string> = {
    'inventory': 'warning',
    'order': 'danger',
    'logistics': 'info',
    'system': 'error',
    'other': ''
  }
  return typeTagMap[type] || ''
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    'unsolved': 'Unresolved',
    'solved': 'Resolved'
  }
  return statusMap[status] || status
}

// 获取状态对应的标签类型
const getStatusTag = (status: string) => {
  const statusTagMap: Record<string, string> = {
    'unsolved': 'danger',
    'solved': 'success'
  }
  return statusTagMap[status] || ''
}

// 获取邮件发送状态标签
const getEmailSentLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    'sent': 'Sent',
    'unsent': 'Unsent',
    'failed': 'Failed'
  }
  return statusMap[status] || status
}

// 获取邮件发送状态对应的标签类型
const getEmailSentTag = (status: string) => {
  const statusTagMap: Record<string, string> = {
    'sent': 'success',
    'unsent': 'info',
    'failed': 'danger'
  }
  return statusTagMap[status] || ''
}

// 添加导航到订单详情页的方法
const navigateToOrderDetail = (systemOrderId: string) => {
  if (!systemOrderId) return
  router.push(`/order/sales/${systemOrderId}`)
}
</script>

<style scoped lang="scss">
.email-logs-container {
  padding: 24px;
  min-height: 100vh;
  background: var(--bg-dark);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h2 {
    font-size: 24px;
    font-weight: 500;
    margin: 0;
    color: var(--text-primary);
  }
}

.search-area {
  background-color: var(--card);
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid var(--border);
  
  :deep(.el-form-item) {
    margin-right: 16px;
    margin-bottom: 16px;
  }
  
  :deep(.el-select) {
    width: 100%;
  }
  
  :deep(.el-date-editor.el-input) {
    min-width: 350px;
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.log-detail {
  padding: 16px;
  background-color: #1a1d1f;
  color: #ffffff;
}

.detail-item {
  margin-bottom: 16px;
  display: flex;
  
  .label {
    font-weight: bold;
    min-width: 140px;
    display: inline-block;
    color: #a0a5b1;
  }
}

.description-content, .email-content, .resolve-note {
  margin-top: 5px;
  padding: 12px;
  background-color: #242830;
  border-radius: 4px;
  white-space: pre-line;
  color: #ffffff;
  border: 1px solid #2c2e33;
  flex: 1;
}

.email-content {
  max-height: 200px;
  overflow-y: auto;
}

.email-history {
  flex: 1;
  margin-top: 5px;
  
  .history-item {
    padding: 12px;
    background-color: #242830;
    border-radius: 4px;
    margin-bottom: 8px;
    border: 1px solid #2c2e33;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .history-time {
      font-weight: 500;
      margin-bottom: 6px;
    }
    
    .history-status {
      display: inline-block;
      margin-right: 12px;
    }
    
    .history-recipients {
      margin-top: 6px;
      color: #a0a5b1;
      font-size: 0.9em;
    }
  }
}

:deep(.el-table) {
  background-color: var(--card);
  color: var(--text-primary);
  
  .el-table__header th {
    background-color: var(--header);
    color: var(--text-secondary);
  }
  
  .el-table__row {
    background-color: var(--card);
    
    &:hover > td {
      background-color: var(--hover);
    }
  }
  
  .el-table__cell {
    border-bottom: 1px solid var(--border);
  }
}

:deep(.el-button) {
  &.el-button--primary {
    background-color: var(--primary);
    border-color: var(--primary);
    
    &:hover {
      background-color: var(--primary-light);
      border-color: var(--primary-light);
    }
  }
}

:deep(.el-input__wrapper),
:deep(.el-textarea__wrapper) {
  background-color: var(--input);
  box-shadow: 0 0 0 1px var(--border) inset;
  
  &:hover {
    box-shadow: 0 0 0 1px var(--primary-light) inset;
  }
  
  &.is-focus {
    box-shadow: 0 0 0 1px var(--primary) inset;
  }
}

:deep(.el-dialog) {
  background-color: #1a1d1f !important;
  border-radius: 4px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.8);
  border: 1px solid #2c2e33;
  opacity: 1 !important;
  
  &::before {
    display: none !important;
  }
  
  .el-dialog__wrapper {
    opacity: 1 !important;
  }
  
  .el-dialog__header {
    margin-right: 0;
    border-bottom: 1px solid #2c2e33;
    background-color: #1a1d1f !important;
    padding: 16px 20px;
  }
  
  .el-dialog__title {
    color: #ffffff;
    font-weight: 500;
  }
  
  .el-dialog__headerbtn {
    color: #ffffff;
  }
  
  .el-dialog__body {
    color: #ffffff;
    background-color: #1a1d1f !important;
    padding: 20px;
  }
  
  .el-dialog__footer {
    border-top: 1px solid #2c2e33;
    background-color: #1a1d1f !important;
    padding: 16px 20px;
  }
}

:deep(.el-select) {
  .el-input__wrapper {
    background-color: var(--input) !important;
  }
}

:deep(.el-date-editor) {
  .el-input__wrapper {
    background-color: var(--input) !important;
  }
}

:deep(.el-pagination) {
  .el-pagination__total {
    color: var(--text-secondary);
  }
  
  .el-pagination__jump {
    color: var(--text-secondary);
  }
  
  .el-input__wrapper {
    background-color: var(--input) !important;
  }
  
  .btn-prev,
  .btn-next {
    background-color: var(--input);
    color: var(--text-secondary);
  }
  
  .el-pager li {
    background-color: var(--input);
    color: var(--text-secondary);
    
    &.is-active {
      color: var(--primary);
      font-weight: bold;
    }
  }
}

:deep(.el-overlay) {
  background-color: rgba(0, 0, 0, 0.7) !important;
}

.order-link {
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.icon-button {
  cursor: pointer;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  .el-icon {
    font-size: 18px;
  }
  
  &:hover {
    opacity: 0.8;
  }
}

.primary-icon {
  color: var(--el-color-primary);
}

.success-icon {
  color: var(--el-color-success);
}

.disabled-icon {
  opacity: 0.5;
  cursor: not-allowed !important;
}

.batch-email-content {
  font-size: 14px;
  
  .batch-summary {
    margin: 15px 0;
    background-color: #242830;
    border-radius: 4px;
    padding: 15px;
    border: 1px solid #2c2e33;
    
    p {
      margin-top: 0;
      margin-bottom: 10px;
    }
  }
  
  .type-summary {
    margin-top: 15px;
    
    h4 {
      margin-top: 0;
      margin-bottom: 10px;
      font-weight: 500;
    }
    
    ul {
      list-style: none;
      padding-left: 10px;
      margin: 0;
    }
    
    li {
      padding: 4px 0;
    }
  }
  
  .batch-options {
    margin-top: 20px;
  }
}
</style> 