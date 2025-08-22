<template>
  <div class="mapping-info">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="mapping-form"
    >
      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <div class="left">
              <span>映射管理</span>
              <el-tag :type="hasErrors ? 'danger' : hasWarnings ? 'warning' : 'success'">
                {{ hasErrors ? '有错误' : hasWarnings ? '有警告' : '正常' }}
              </el-tag>
              <el-tag :type="getSyncStatusType(syncStatus)">
                {{ getSyncStatusText(syncStatus) }}
              </el-tag>
            </div>
            <div class="right">
              <el-button-group>
                <el-button
                  type="primary"
                  link
                  :icon="Setting"
                  @click="settingsDialogVisible = true"
                >
                  设置
                </el-button>
                <el-button
                  type="primary"
                  link
                  :icon="TrendCharts"
                  @click="analyticsDialogVisible = true"
                >
                  分析
                </el-button>
                <el-button
                  type="warning"
                  link
                  :icon="Warning"
                  @click="validationDialogVisible = true"
                  v-if="hasErrors || hasWarnings"
                >
                  验证
                </el-button>
              </el-button-group>
            </div>
          </div>
        </template>

        <el-tabs v-model="activeTab">
          <el-tab-pane label="系统映射" name="system">
        <el-row :gutter="20">
          <el-col :span="12">
                <el-form-item label="WMS编码" prop="systemMapping.wmsCode">
                  <el-input
                    v-model="form.systemMapping.wmsCode"
                    placeholder="请输入WMS系统编码"
                  >
                    <template #append>
                      <el-button @click="handleVerifyCode('wms')">验证</el-button>
                    </template>
                  </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
                <el-form-item label="ERP编码" prop="systemMapping.erpCode">
                  <el-input
                    v-model="form.systemMapping.erpCode"
                    placeholder="请输入ERP系统编码"
                  >
                    <template #append>
                      <el-button @click="handleVerifyCode('erp')">验证</el-button>
                    </template>
                  </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
                <el-form-item label="供应商编码" prop="systemMapping.supplierCode">
                  <el-input
                    v-model="form.systemMapping.supplierCode"
                    placeholder="请输入供应商系统编码"
                  >
                    <template #append>
                      <el-button @click="handleVerifyCode('supplier')">验证</el-button>
                    </template>
                  </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
                <el-form-item label="制造商编码" prop="systemMapping.manufacturerCode">
                  <el-input
                    v-model="form.systemMapping.manufacturerCode"
                    placeholder="请输入制造商编码"
                  >
                    <template #append>
                      <el-button @click="handleVerifyCode('manufacturer')">验证</el-button>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="映射类型" prop="systemMapping.mappingType">
                  <el-select
                    v-model="form.systemMapping.mappingType"
                    placeholder="请选择映射类型"
                  >
                    <el-option label="手动映射" value="manual" />
                    <el-option label="自动映射" value="auto" />
                    <el-option label="规则映射" value="rule-based" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="映射方向" prop="systemMapping.direction">
                  <el-select
                    v-model="form.systemMapping.direction"
                    placeholder="请选择映射方向"
                  >
                    <el-option label="导入" value="import" />
                    <el-option label="导出" value="export" />
                    <el-option label="双向" value="bidirectional" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="同步状态" prop="systemMapping.syncStatus">
                  <el-tag :type="getMappingStatusType(form.systemMapping.syncStatus)">
                    {{ getMappingStatusText(form.systemMapping.syncStatus) }}
                  </el-tag>
                  <div class="sync-info" v-if="form.systemMapping.lastSyncTime">
                    <small>上次同步: {{ formatDate(form.systemMapping.lastSyncTime) }}</small>
                    <small>下次同步: {{ formatDate(form.systemMapping.nextSyncTime) }}</small>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-alert
              v-if="form.systemMapping.syncErrors?.length"
              type="error"
              show-icon
              :closable="false"
              class="sync-errors"
            >
              <template #title>同步错误</template>
              <template #default>
                <ul class="error-list">
                  <li v-for="(error, index) in form.systemMapping.syncErrors" :key="index">
                    {{ error }}
                  </li>
                </ul>
              </template>
            </el-alert>
          </el-tab-pane>

          <el-tab-pane label="同步设置" name="sync">
            <el-form-item label="自动同步" prop="autoSync">
              <el-switch v-model="form.autoSync" />
            </el-form-item>

            <template v-if="form.autoSync">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="同步频率" prop="syncSchedule.frequency">
                    <el-select
                      v-model="form.syncSchedule.frequency"
                      placeholder="请选择同步频率"
                    >
                      <el-option label="实时" value="realtime" />
                      <el-option label="每小时" value="hourly" />
                      <el-option label="每天" value="daily" />
                      <el-option label="每周" value="weekly" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="开始时间" prop="syncSchedule.startTime">
                    <el-time-picker
                      v-model="form.syncSchedule.startTime"
                      placeholder="请选择开始时间"
                      format="HH:mm"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="结束时间" prop="syncSchedule.endTime">
                    <el-time-picker
                      v-model="form.syncSchedule.endTime"
                      placeholder="请选择结束时间"
                      format="HH:mm"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item
                label="同步日期"
                prop="syncSchedule.daysOfWeek"
                v-if="form.syncSchedule.frequency === 'weekly'"
              >
                <el-checkbox-group v-model="form.syncSchedule.daysOfWeek">
                  <el-checkbox :label="1">周一</el-checkbox>
                  <el-checkbox :label="2">周二</el-checkbox>
                  <el-checkbox :label="3">周三</el-checkbox>
                  <el-checkbox :label="4">周四</el-checkbox>
                  <el-checkbox :label="5">周五</el-checkbox>
                  <el-checkbox :label="6">周六</el-checkbox>
                  <el-checkbox :label="0">周日</el-checkbox>
                </el-checkbox-group>
              </el-form-item>

              <el-divider>错误处理</el-divider>

              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="重试次数" prop="errorHandling.retryCount">
                    <el-input-number
                      v-model="form.errorHandling.retryCount"
                      :min="0"
                      :max="10"
                      placeholder="请输入重试次数"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="重试延迟(秒)" prop="errorHandling.retryDelay">
                    <el-input-number
                      v-model="form.errorHandling.retryDelay"
                      :min="0"
                      :max="3600"
                      placeholder="请输入重试延迟"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="错误通知" prop="errorHandling.notifyOnError">
                    <el-switch v-model="form.errorHandling.notifyOnError" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item
                label="通知邮箱"
                prop="errorHandling.notifyEmails"
                v-if="form.errorHandling.notifyOnError"
              >
                <el-select
                  v-model="form.errorHandling.notifyEmails"
                  multiple
                  filterable
                  allow-create
                  placeholder="请输入通知邮箱"
                >
                  <el-option
                    v-for="email in form.errorHandling.notifyEmails"
                    :key="email"
                    :label="email"
                    :value="email"
                  />
                </el-select>
              </el-form-item>

              <el-divider>日志设置</el-divider>

              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="日志级别" prop="logging.level">
                    <el-select
                      v-model="form.logging.level"
                      placeholder="请选择日志级别"
                    >
                      <el-option label="错误" value="error" />
                      <el-option label="警告" value="warning" />
                      <el-option label="信息" value="info" />
                      <el-option label="调试" value="debug" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="保留天数" prop="logging.retention">
                    <el-input-number
                      v-model="form.logging.retention"
                      :min="1"
                      :max="365"
                      placeholder="请输入保留天数"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="导出格式" prop="logging.exportFormat">
                    <el-select
                      v-model="form.logging.exportFormat"
                      placeholder="请选择导出格式"
                    >
                      <el-option label="JSON" value="json" />
                      <el-option label="CSV" value="csv" />
                    </el-select>
            </el-form-item>
          </el-col>
        </el-row>
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>渠道映射</span>
            <el-button type="primary" link :icon="Plus" @click="handleAddMapping">
              添加映射
            </el-button>
          </div>
        </template>

        <el-table :data="form.channelMappings" border style="width: 100%">
          <el-table-column label="渠道" prop="channel" width="180">
            <template #default="{ row }">
              <el-select v-model="row.channel" placeholder="请选择渠道">
                <el-option label="Amazon" value="amazon" />
                <el-option label="Shopify" value="shopify" />
                <el-option label="eBay" value="ebay" />
                <el-option label="Walmart" value="walmart" />
                <el-option label="WooCommerce" value="woocommerce" />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="店铺" prop="store" width="200">
            <template #default="{ row }">
              <el-select
                v-model="row.store"
                placeholder="请选择店铺"
                :loading="storeSearchLoading"
              >
                <el-option
                  v-for="store in getStoreOptions(row.channel)"
                  :key="store.id"
                  :label="store.name"
                  :value="store.id"
                />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="商品ID" prop="productId">
            <template #default="{ row }">
              <el-input v-model="row.productId" placeholder="请输入渠道商品ID" />
            </template>
          </el-table-column>

          <el-table-column label="SKU" prop="sku" width="180">
            <template #default="{ row }">
              <el-input v-model="row.sku" placeholder="请输入渠道SKU" />
            </template>
          </el-table-column>

          <el-table-column label="状态" prop="status" width="120">
            <template #default="{ row }">
              <el-tag :type="getMappingStatusType(row.status)">
                {{ getMappingStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row, $index }">
              <el-button-group>
                <el-tooltip content="同步" placement="top">
                  <el-button
                    type="primary"
                    link
                    :icon="Refresh"
                    @click="handleSyncMapping(row)"
                  />
                </el-tooltip>
                <el-tooltip content="查看" placement="top">
                  <el-button
                    type="info"
                    link
                    :icon="View"
                    @click="handleViewMapping(row)"
                  />
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-button
                    type="danger"
                    link
                    :icon="Delete"
                    @click="handleRemoveMapping($index)"
                  />
                </el-tooltip>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>属性映射</span>
            <el-button type="primary" link :icon="Plus" @click="handleAddAttribute">
              添加属性
            </el-button>
          </div>
        </template>

        <el-table :data="form.attributeMappings" border style="width: 100%">
          <el-table-column label="属性名称" prop="name">
            <template #default="{ row }">
              <el-input v-model="row.name" placeholder="请输入属性名称" />
            </template>
          </el-table-column>

          <el-table-column label="Amazon" width="180">
            <template #default="{ row }">
              <el-input v-model="row.amazon" placeholder="Amazon属性" />
            </template>
          </el-table-column>

          <el-table-column label="Shopify" width="180">
            <template #default="{ row }">
              <el-input v-model="row.shopify" placeholder="Shopify属性" />
            </template>
          </el-table-column>

          <el-table-column label="eBay" width="180">
            <template #default="{ row }">
              <el-input v-model="row.ebay" placeholder="eBay属性" />
            </template>
          </el-table-column>

          <el-table-column label="Walmart" width="180">
            <template #default="{ row }">
              <el-input v-model="row.walmart" placeholder="Walmart属性" />
            </template>
          </el-table-column>

          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ $index }">
              <el-button
                type="danger"
                link
                :icon="Delete"
                @click="handleRemoveAttribute($index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-form>

    <!-- 分析对话框 -->
    <el-dialog
      v-model="analyticsDialogVisible"
      title="映射分析"
      width="80%"
      :close-on-click-modal="false"
    >
      <el-tabs>
        <el-tab-pane label="同步概览">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-card class="analytics-card">
                <template #header>
                  <div class="card-header">
                    <span>同步总数</span>
                  </div>
                </template>
                <div class="analytics-value">
                  {{ form.analytics?.syncCount || 0 }}
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="analytics-card">
                <template #header>
                  <div class="card-header">
                    <span>错误数</span>
                  </div>
                </template>
                <div class="analytics-value error">
                  {{ form.analytics?.errorCount || 0 }}
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="analytics-card">
                <template #header>
                  <div class="card-header">
                    <span>成功率</span>
                  </div>
                </template>
                <div class="analytics-value">
                  {{ ((form.analytics?.successRate || 0) * 100).toFixed(2) }}%
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="analytics-card">
                <template #header>
                  <div class="card-header">
                    <span>平均耗时</span>
                  </div>
                </template>
                <div class="analytics-value">
                  {{ formatDuration(form.analytics?.averageSyncTime || 0) }}
                </div>
              </el-card>
            </el-col>
          </el-row>

          <el-divider>最近同步</el-divider>

          <el-descriptions
            v-if="form.analytics?.lastSync"
            :column="3"
            border
          >
            <el-descriptions-item label="同步时间">
              {{ formatDate(form.analytics.lastSync.time) }}
            </el-descriptions-item>
            <el-descriptions-item label="耗时">
              {{ formatDuration(form.analytics.lastSync.duration) }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getMappingStatusType(form.analytics.lastSync.status)">
                {{ getMappingStatusText(form.analytics.lastSync.status) }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>

          <el-alert
            v-if="form.analytics?.lastSync?.errors?.length"
            type="error"
            show-icon
            :closable="false"
            class="sync-errors"
          >
            <template #title>同步错误</template>
            <template #default>
              <ul class="error-list">
                <li v-for="(error, index) in form.analytics.lastSync.errors" :key="index">
                  {{ error }}
                </li>
              </ul>
            </template>
          </el-alert>

          <el-divider>渠道统计</el-divider>

          <el-table :data="form.analytics?.channelStats || []">
            <el-table-column label="渠道" prop="channel" />
            <el-table-column label="同步次数" prop="syncCount" />
            <el-table-column label="错误数" prop="errorCount" />
            <el-table-column label="成功率" prop="successRate">
              <template #default="{ row }">
                {{ (row.successRate * 100).toFixed(2) }}%
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="趋势分析">
          <div class="trend-chart">
            <!-- TODO: 添加趋势图表 -->
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 验证对话框 -->
    <el-dialog
      v-model="validationDialogVisible"
      title="映射验证"
      width="70%"
      :close-on-click-modal="false"
    >
      <el-table :data="form.validations || []">
        <el-table-column label="字段" prop="field" />
        <el-table-column label="渠道" prop="channel" />
        <el-table-column label="错误" prop="errors">
          <template #default="{ row }">
            <el-tag
              v-for="(error, index) in row.errors"
              :key="index"
              type="danger"
              class="validation-tag"
            >
              {{ error }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="警告" prop="warnings">
          <template #default="{ row }">
            <el-tag
              v-for="(warning, index) in row.warnings"
              :key="index"
              type="warning"
              class="validation-tag"
            >
              {{ warning }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="建议" prop="suggestions">
          <template #default="{ row }">
            <el-tag
              v-for="(suggestion, index) in row.suggestions"
              :key="index"
              type="info"
              class="validation-tag"
            >
              {{ suggestion }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 设置对话框 -->
    <el-dialog
      v-model="settingsDialogVisible"
      title="映射设置"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-tabs>
        <el-tab-pane label="模板管理">
          <div class="template-list">
            <div class="template-header">
              <h4>映射模板</h4>
              <el-button
                type="primary"
                link
                :icon="Plus"
                @click="handleAddTemplate"
              >
                添加模板
              </el-button>
            </div>

            <el-table :data="form.templates || []">
              <el-table-column label="模板名称" prop="name" />
              <el-table-column label="渠道" prop="channel" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作" width="200">
                <template #default="{ row }">
                  <el-button-group>
                    <el-button
                      type="primary"
                      link
                      @click="handleApplyTemplate(row)"
                    >
                      应用
                    </el-button>
                    <el-button
                      type="primary"
                      link
                      @click="handleEditTemplate(row)"
                    >
                      编辑
                    </el-button>
                    <el-button
                      type="danger"
                      link
                      @click="handleRemoveTemplate(row)"
                    >
                      删除
                    </el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane label="导入导出">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card shadow="never">
                <template #header>
                  <div class="card-header">
                    <span>导入映射</span>
                  </div>
                </template>
                <el-upload
                  class="upload-area"
                  drag
                  action="/api/mapping/import"
                  :on-success="handleImportSuccess"
                  :on-error="handleImportError"
                >
                  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                  <div class="el-upload__text">
                    将文件拖到此处，或<em>点击上传</em>
                  </div>
                  <template #tip>
                    <div class="el-upload__tip">
                      支持 .json 或 .csv 格式文件
                    </div>
                  </template>
                </el-upload>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="never">
                <template #header>
                  <div class="card-header">
                    <span>导出映射</span>
                  </div>
                </template>
                <div class="export-area">
                  <el-form-item label="导出格式">
                    <el-radio-group v-model="exportFormat">
                      <el-radio label="json">JSON</el-radio>
                      <el-radio label="csv">CSV</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-button
                    type="primary"
                    :icon="Download"
                    @click="handleExport"
                  >
                    导出映射
                  </el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import {
  Plus,
  Delete,
  Refresh,
  View,
  Setting,
  TrendCharts,
  Upload,
  Download
} from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus';
import type {
  MappingSettings,
  MappingStatus,
  MappingDirection,
  MappingType,
  SyncFrequency,
  SystemMapping,
  ChannelMapping,
  AttributeMapping,
  MappingTemplate,
  MappingValidation,
  MappingAnalytics
} from '@/types/mapping';

const props = defineProps<{
  form: MappingSettings
}>();

// 标签页状态
const activeTab = ref('system');
const templateDialogVisible = ref(false);
const analyticsDialogVisible = ref(false);
const settingsDialogVisible = ref(false);
const validationDialogVisible = ref(false);

// 计算属性
const hasErrors = computed(() => {
  return form.validations?.some(v => v.errors.length > 0);
});

const hasWarnings = computed(() => {
  return form.validations?.some(v => v.warnings.length > 0);
});

const syncStatus = computed(() => {
  const now = new Date();
  const nextSync = form.syncSchedule?.startTime ? new Date(form.syncSchedule.startTime) : null;
  
  if (!nextSync) return 'inactive';
  if (nextSync > now) return 'scheduled';
  return 'active';
});

const emit = defineEmits(['update:form']);

const formRef = ref<FormInstance>();
const form = reactive(props.form);

// 模拟数据
const storeSearchLoading = ref(false);
const storeOptions = {
  amazon: [
    { id: 'US', name: '美国站' },
    { id: 'UK', name: '英国站' },
    { id: 'DE', name: '德国站' },
  ],
  shopify: [
    { id: 'STORE1', name: '商店1' },
    { id: 'STORE2', name: '商店2' },
  ],
  ebay: [
    { id: 'US', name: '美国站' },
    { id: 'UK', name: '英国站' },
  ],
};

// 表单验证规则
const rules = {
  wmsCode: [{ required: true, message: '请输入WMS系统编码', trigger: 'blur' }],
  erpCode: [{ required: true, message: '请输入ERP系统编码', trigger: 'blur' }],
};

// 获取店铺选项
const getStoreOptions = (channel: string) => {
  return storeOptions[channel] || [];
};

// 获取映射状态类型
const getMappingStatusType = (status: string) => {
  const types = {
    ACTIVE: 'success',
    INACTIVE: 'info',
    ERROR: 'danger',
    SYNCING: 'warning'
  };
  return types[status] || 'info';
};

// 获取映射状态标签
const getMappingStatusLabel = (status: string) => {
  const labels = {
    ACTIVE: '已激活',
    INACTIVE: '未激活',
    ERROR: '错误',
    SYNCING: '同步中'
  };
  return labels[status] || status;
};

// 添加渠道映射
const handleAddMapping = () => {
  if (!form.channelMappings) {
    form.channelMappings = [];
  }
  form.channelMappings.push({
    channel: '',
    store: '',
    productId: '',
    sku: '',
    status: 'INACTIVE'
  });
};

// 删除渠道映射
const handleRemoveMapping = (index: number) => {
  form.channelMappings.splice(index, 1);
};

// 同步映射
const handleSyncMapping = async (row: any) => {
  // TODO: 实现同步逻辑
};

// 查看映射
const handleViewMapping = (row: any) => {
  // TODO: 实现查看逻辑
};

// 添加属性映射
const handleAddAttribute = () => {
  if (!form.attributeMappings) {
    form.attributeMappings = [];
  }
  form.attributeMappings.push({
    name: '',
    amazon: '',
    shopify: '',
    ebay: '',
    walmart: ''
  });
};

// 删除属性映射
const handleRemoveAttribute = (index: number) => {
  form.attributeMappings.splice(index, 1);
};

// 暴露验证方法给父组件
defineExpose({
  validate: () => formRef.value?.validate()
});
</script>

<style scoped>
.mapping-info {
  height: 100%;
  overflow-y: auto;
}

.mapping-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-card {
  :deep(.el-card__header) {
    padding: 12px 20px;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;

  .left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

:deep(.el-form-item) {
  margin-bottom: 18px;

  &:last-child {
    margin-bottom: 0;
  }
}

:deep(.el-button-group) {
  display: inline-flex;
  gap: 8px;
}

.sync-info {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  small {
    color: var(--el-text-color-secondary);
  }
}

.sync-errors {
  margin-top: 16px;

  .error-list {
    margin: 8px 0 0;
    padding-left: 20px;

    li {
      margin-bottom: 4px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.analytics-card {
  .analytics-value {
    font-size: 24px;
    font-weight: 500;
    text-align: center;
    padding: 16px 0;

    &.error {
      color: var(--el-color-danger);
    }
  }
}

.validation-tag {
  margin: 4px;
}

.template-list {
  .template-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h4 {
      margin: 0;
    }
  }
}

.upload-area {
  :deep(.el-upload) {
    width: 100%;
  }

  :deep(.el-upload-dragger) {
    width: 100%;
  }
}

.export-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;

  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}
</style>
