<template>
  <div class="email-logs-container">
    <div class="page-header">
      <h2>异常日志 Exception Logs</h2>
      <div class="header-actions">
        <el-tooltip content="刷新" placement="top">
          <span class="icon-button" @click="refreshData">
            <el-icon><Refresh /></el-icon>
          </span>
        </el-tooltip>
        <el-tooltip content="批量发送邮件" placement="top">
          <span class="icon-button success-icon" @click="showBatchSendDialog">
            <el-icon><Message /></el-icon>
          </span>
        </el-tooltip>
      </div>
    </div>

    <!-- Search Filter Area -->
    <div class="search-area">
      <el-form :model="searchForm" inline>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="问题类型">
          <el-select 
            v-model="searchForm.issueType" 
            placeholder="选择问题类型" 
            clearable
            style="min-width: 180px;"
          >
            <el-option label="库存异常" value="inventory" />
            <el-option label="订单异常" value="order" />
            <el-option label="物流异常" value="logistics" />
            <el-option label="系统错误" value="system" />
            <el-option label="其他问题" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="解决状态">
          <el-select 
            v-model="searchForm.status" 
            placeholder="选择状态" 
            clearable
            style="min-width: 180px;"
          >
            <el-option label="未解决" value="unsolved" />
            <el-option label="已解决" value="solved" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮件状态">
          <el-select 
            v-model="searchForm.emailSent" 
            placeholder="邮件发送状态" 
            clearable
            style="min-width: 180px;"
          >
            <el-option label="已发送" value="sent" />
            <el-option label="未发送" value="unsent" />
            <el-option label="发送失败" value="failed" />
          </el-select>
        </el-form-item>
        <el-form-item label="渠道">
          <el-select 
            v-model="searchForm.channel" 
            placeholder="选择渠道" 
            clearable
            style="min-width: 180px;"
          >
            <el-option label="Amazon" value="amazon" />
            <el-option label="Shopify" value="shopify" />
            <el-option label="Walmart" value="walmart" />
            <el-option label="eBay" value="ebay" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input 
            v-model="searchForm.keyword" 
            placeholder="订单ID/系统ID/描述" 
            style="min-width: 250px;"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
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
      <el-table-column prop="channel" label="渠道" width="120" />
      <el-table-column prop="channelOrderId" label="渠道订单ID" width="180" show-overflow-tooltip />
      <el-table-column prop="systemOrderId" label="OMS ID" width="180" show-overflow-tooltip>
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
      <el-table-column prop="issueType" label="问题类型" width="120">
        <template #default="scope">
          <el-tag :type="getIssueTypeTag(scope.row.issueType)">
            {{ getIssueTypeLabel(scope.row.issueType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="问题描述" min-width="200" show-overflow-tooltip />
      <el-table-column prop="status" label="解决状态" width="120">
        <template #default="scope">
          <el-tag :type="getStatusTag(scope.row.status)">
            {{ getStatusLabel(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="emailSent" label="邮件状态" width="100">
        <template #default="scope">
          <el-tag :type="getEmailSentTag(scope.row.emailSent)">
            {{ getEmailSentLabel(scope.row.emailSent) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastSendTime" label="更新时间" width="180" sortable>
        <template #default="scope">
          {{ formatDateTime(scope.row.lastSendTime || scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="scope">
          <div class="action-buttons">
            <el-tooltip content="查看详情" placement="top">
              <span class="icon-button primary-icon" @click="viewDetails(scope.row)">
                <el-icon><Document /></el-icon>
              </span>
            </el-tooltip>
            <el-tooltip content="发送邮件" placement="top" v-if="scope.row.emailSent === 'unsent'">
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
      title="异常日志详情 Exception Log Detail"
      width="60%"
    >
      <div v-if="currentDetail" class="log-detail">
        <div class="detail-item">
          <span class="label">创建时间:</span>
          <span>{{ formatDateTime(currentDetail.createTime) }}</span>
        </div>
        <div class="detail-item" v-if="currentDetail.lastSendTime && currentDetail.lastSendTime !== currentDetail.createTime">
          <span class="label">更新时间:</span>
          <span>{{ formatDateTime(currentDetail.lastSendTime) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">渠道:</span>
          <span>{{ currentDetail.channel }}</span>
        </div>
        <div class="detail-item">
          <span class="label">渠道订单ID:</span>
          <span>{{ currentDetail.channelOrderId }}</span>
        </div>
        <div class="detail-item">
          <span class="label">OMS ID:</span>
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
          <span class="label">问题类型:</span>
          <el-tag :type="getIssueTypeTag(currentDetail.issueType)">
            {{ getIssueTypeLabel(currentDetail.issueType) }}
          </el-tag>
        </div>
        <div class="detail-item">
          <span class="label">问题描述:</span>
          <div class="description-content">{{ currentDetail.description }}</div>
        </div>
        <div class="detail-item">
          <span class="label">解决状态:</span>
          <el-tag :type="getStatusTag(currentDetail.status)">
            {{ getStatusLabel(currentDetail.status) }}
          </el-tag>
        </div>
        <div class="detail-item">
          <span class="label">邮件状态:</span>
          <el-tag :type="getEmailSentTag(currentDetail.emailSent)">
            {{ getEmailSentLabel(currentDetail.emailSent) }}
          </el-tag>
        </div>
        <div class="detail-item" v-if="currentDetail.recipients">
          <span class="label">收件人:</span>
          <span>{{ currentDetail.recipients }}</span>
        </div>
        <div class="detail-item" v-if="currentDetail.emailContent">
          <span class="label">邮件内容:</span>
          <div class="email-content" v-html="currentDetail.emailContent"></div>
        </div>
        <div class="detail-item" v-if="currentDetail.emailHistory && currentDetail.emailHistory.length > 0">
          <span class="label">发送历史记录:</span>
          <div class="email-history">
            <div class="history-item" v-for="(history, index) in currentDetail.emailHistory" :key="index">
              <div class="history-time">{{ formatDateTime(history.sendTime) }}</div>
              <div class="history-status">
                <el-tag :type="getEmailSentTag(history.status)" size="small">
                  {{ getEmailSentLabel(history.status) }}
                </el-tag>
              </div>
              <div class="history-recipients" v-if="history.recipients">收件人: {{ history.recipients }}</div>
            </div>
          </div>
        </div>
        <div class="detail-item" v-if="currentDetail.resolveTime">
          <span class="label">解决时间:</span>
          <span>{{ formatDateTime(currentDetail.resolveTime) }}</span>
        </div>
        <div class="detail-item" v-if="currentDetail.resolveNote">
          <span class="label">解决方案:</span>
          <div class="resolve-note">{{ currentDetail.resolveNote }}</div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-tooltip content="关闭" placement="top">
            <span class="icon-button" @click="detailDialogVisible = false">
              <el-icon><Close /></el-icon>
            </span>
          </el-tooltip>
          <el-tooltip content="发送邮件" placement="top" v-if="currentDetail && currentDetail.emailSent === 'unsent'">
            <span 
              class="icon-button success-icon"
              @click="sendEmail(currentDetail!)"
            >
              <el-icon><Message /></el-icon>
            </span>
          </el-tooltip>
          <el-tooltip content="重新发送" placement="top" v-if="currentDetail && currentDetail.emailSent !== 'unsent'">
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
      title="标记问题为已解决"
      width="50%"
    >
      <el-form :model="resolveForm" label-width="120px">
        <el-form-item label="解决方案">
          <el-input
            v-model="resolveForm.resolveNote"
            type="textarea"
            :rows="4"
            placeholder="请输入解决方案或处理结果"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-tooltip content="取消" placement="top">
            <span class="icon-button" @click="resolveDialogVisible = false">
              <el-icon><Close /></el-icon>
            </span>
          </el-tooltip>
          <el-tooltip content="确认" placement="top">
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
      title="发送邮件通知"
      width="60%"
    >
      <el-form :model="emailForm" label-width="120px">
        <el-form-item label="收件人">
          <el-select
            v-model="emailForm.recipientList"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入收件人邮箱，按Enter键添加多个"
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
        <el-form-item label="抄送">
          <el-select
            v-model="emailForm.ccList"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入抄送邮箱，按Enter键添加多个"
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
        <el-form-item label="主题">
          <el-input v-model="emailForm.subject" placeholder="请输入邮件主题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="emailForm.content"
            type="textarea"
            :rows="8"
            placeholder="请输入邮件内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-tooltip content="取消" placement="top">
            <span class="icon-button" @click="emailDialogVisible = false">
              <el-icon><Close /></el-icon>
            </span>
          </el-tooltip>
          <el-tooltip content="发送" placement="top">
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
      title="批量发送邮件通知"
      width="50%"
    >
      <div class="batch-email-content">
        <p>您将要批量发送以下异常的邮件通知：</p>
        <div class="batch-summary">
          <p v-if="selectedRows.length > 0">已选择 {{ selectedRows.length }} 条记录</p>
          <p v-else>未选择任何记录，将发送所有未解决且未发送邮件的异常</p>
          
          <el-alert
            v-if="computedSendList.length === 0"
            title="没有符合条件的记录可发送"
            type="warning"
            :closable="false"
            style="margin-top: 10px;"
          />
          
          <div v-else class="type-summary">
            <h4>按类型统计：</h4>
            <ul>
              <li v-for="(count, type) in getIssueTypeCounts()" :key="type">
                {{ getIssueTypeLabel(type) }}: {{ count }} 条
              </li>
            </ul>
          </div>
        </div>
        
        <div class="batch-options" v-if="computedSendList.length > 0">
          <p>默认将为每种问题类型使用相应的收件人。您也可以设置统一的收件人：</p>
          <el-form>
            <el-form-item label="统一收件人">
              <el-select
                v-model="batchEmailForm.recipientList"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="留空则使用默认收件人配置，按Enter键添加多个邮箱"
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
            <el-form-item label="统一抄送">
              <el-select
                v-model="batchEmailForm.ccList"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="可选，按Enter键添加多个抄送地址"
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
          <el-tooltip content="取消" placement="top">
            <span class="icon-button" @click="batchEmailDialogVisible = false">
              <el-icon><Close /></el-icon>
            </span>
          </el-tooltip>
          <el-tooltip content="发送" placement="top">
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
  { label: '仓库管理员', value: 'warehouse@example.com' },
  { label: '订单客服', value: 'orders@example.com' },
  { label: '物流部门', value: 'logistics@example.com' },
  { label: 'IT支持', value: 'it-support@example.com' },
  { label: '客户支持', value: 'support@example.com' }
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
    console.error('获取邮件日志失败：', error)
    ElMessage.error('获取邮件日志失败')
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
    ElMessage.warning('请输入解决方案')
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
    
    ElMessage.success('问题已标记为已解决')
    resolveDialogVisible.value = false
  } catch (error) {
    console.error('标记问题已解决失败：', error)
    ElMessage.error('操作失败，请重试')
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
    emailForm.subject = `系统异常通知: ${getIssueTypeLabel(row.issueType)}`
    
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
    emailForm.subject = `系统异常通知: ${getIssueTypeLabel(row.issueType)}`
    emailForm.content = `系统检测到以下异常：\n\n问题类型: ${getIssueTypeLabel(row.issueType)}\n描述: ${row.description}\n\n渠道: ${row.channel}\n渠道订单ID: ${row.channelOrderId}\n系统订单ID: ${row.systemOrderId}\n\n请尽快处理该问题。`
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
    ? `系统异常通知: ${getIssueTypeLabel(row.issueType)}` 
    : `系统异常通知: ${getIssueTypeLabel(row.issueType)}`
  
  // 获取之前的内容，如果有的话
  if (row.emailContent) {
    // 将HTML格式转回普通文本
    emailForm.content = row.emailContent.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '')
  } else {
    // 使用默认模板
    emailForm.content = `系统检测到以下异常：\n\n问题类型: ${getIssueTypeLabel(row.issueType)}\n描述: ${row.description}\n\n渠道: ${row.channel}\n渠道订单ID: ${row.channelOrderId}\n系统订单ID: ${row.systemOrderId}\n\n请尽快处理该问题。`
  }
  
  // 之前的收件人信息
  emailForm.recipients = row.recipients || getDefaultRecipientsByIssueType(row.issueType)
  emailForm.cc = ''
  
  emailDialogVisible.value = true
}

// 确认发送邮件
const confirmSendEmail = async () => {
  if (emailForm.recipientList.length === 0) {
    ElMessage.warning('请输入至少一个收件人邮箱')
    return
  }
  
  if (!emailForm.subject.trim()) {
    ElMessage.warning('请输入邮件主题')
    return
  }
  
  if (!emailForm.content.trim()) {
    ElMessage.warning('请输入邮件内容')
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
    
    ElMessage.success('邮件已发送')
    emailDialogVisible.value = false
  } catch (error) {
    console.error('发送邮件失败：', error)
    ElMessage.error('发送邮件失败，请重试')
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
    ElMessage.warning('没有符合条件的记录可发送')
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
          subject: `系统异常通知: ${getIssueTypeLabel(issue.issueType)}`,
          content: `系统检测到以下异常：\n\n问题类型: ${getIssueTypeLabel(issue.issueType)}\n描述: ${issue.description}\n\n渠道: ${issue.channel}\n渠道订单ID: ${issue.channelOrderId}\n系统订单ID: ${issue.systemOrderId}\n\n请尽快处理该问题。`
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
        console.error(`发送邮件失败 (ID: ${issue.id}):`, error)
        failCount++
      }
    }
    
    // 显示结果消息
    if (successCount > 0 && failCount === 0) {
      ElMessage.success(`成功发送了 ${successCount} 条异常通知邮件`)
    } else if (successCount > 0 && failCount > 0) {
      ElMessage.warning(`成功发送了 ${successCount} 条邮件，${failCount} 条发送失败`)
    } else {
      ElMessage.error(`所有邮件发送失败`)
    }
    
    // 关闭对话框并刷新数据
    batchEmailDialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error('批量发送邮件失败：', error)
    ElMessage.error('批量发送邮件失败')
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
    'inventory': '库存异常',
    'order': '订单异常',
    'logistics': '物流异常',
    'system': '系统错误',
    'other': '其他问题'
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
    'unsolved': '未解决',
    'solved': '已解决'
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
    'sent': '已发送',
    'unsent': '未发送',
    'failed': '发送失败'
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