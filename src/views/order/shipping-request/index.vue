<template>
  <div class="shipping-request">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1>Shipping Requests</h1>
        <el-tooltip content="Help">
          <el-icon class="help-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="header-right">
        <div class="action-buttons">
          <el-dropdown trigger="click">
            <el-button type="primary">
              Export
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="export_excel">Export to Excel</el-dropdown-item>
                <el-dropdown-item command="export_csv">Export to CSV</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown trigger="click" @command="handleCreateCommand">
            <el-button type="primary">
              Create
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="new_request">New Shipping Request</el-dropdown-item>
                <el-dropdown-item command="merge_orders">Merge Allocation Orders</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 搜索和过滤器区域 -->
    <search-form @search="handleSearch" />

    <!-- 状态标签页和工具栏 -->
    <div class="status-toolbar">
      <div class="status-tabs">
        <div class="tab-list">
          <div
            v-for="tab in tabs"
            :key="tab.value"
            class="tab-item"
            :class="{ active: activeStatus === tab.value }"
            @click="activeStatus = tab.value"
          >
            <div class="tab-content">
              <span class="tab-label">{{ tab.label }}</span>
              <span class="count-tag" :class="tab.tagType">{{ tab.count }}</span>
            </div>
            <div class="tab-line" />
          </div>
        </div>
      </div>

      <div class="toolbar-actions">
        <el-tooltip content="Refresh" placement="top">
          <el-button class="action-btn" @click="refreshTable">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="Customize Columns" placement="top">
          <el-button class="action-btn" @click="showColumnSettings = true">
            <el-icon><Grid /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <!-- 批量操作工具栏 -->
    <div v-if="selectedRows.length > 0" class="selection-toolbar">
      <div class="selection-info">
        <el-checkbox
          v-model="isAllSelected"
          :indeterminate="isIndeterminate"
          @change="handleSelectAll"
        >
          <span class="selection-text">{{ selectedRows.length }} selected</span>
        </el-checkbox>
      </div>
      <div class="action-buttons">
        <el-button-group>
          <el-button @click="handleBatchAction('approve')">
            <el-icon><CircleCheck /></el-icon>
            Batch Approve
          </el-button>
          <el-button @click="handleBatchAction('assignCarrier')">
            <el-icon><Van /></el-icon>
            Assign Carrier
          </el-button>
          <el-button @click="handleBatchAction('printLabels')">
            <el-icon><Printer /></el-icon>
            Print Labels
          </el-button>
          <el-button @click="handleBatchAction('updateStatus')">
            <el-icon><Edit /></el-icon>
            Update Status
          </el-button>
        </el-button-group>
        <el-button link @click="clearSelection">
          Clear Selection
        </el-button>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-section">
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="tableData"
        :size="displayMode"
        :row-class-name="getRowClassName"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        @row-click="handleRowClick"
        row-key="id"
        class="request-table"
        :header-cell-style="{
          background: '#1a1d21',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          color: '#8b949e',
          padding: '4px 8px',
          fontWeight: 500,
          fontSize: '12px'
        }"
        :cell-style="{
          padding: '4px 8px',
          fontSize: '13px'
        }"
        height="100%"
      >
        <!-- 选择列 -->
        <el-table-column 
          type="selection"
          width="40"
          fixed="left"
          align="center"
        />
        
        <!-- Request No. 列 -->
        <el-table-column 
          prop="requestNo"
          label="Request No."
          min-width="160"
          fixed="left"
          sortable
          align="left"
        >
          <template #default="{ row }">
            <div class="request-no-cell">
              <span class="request-no-link" @click="handleRequestClick(row)">{{ row.requestNo }}</span>
              <el-popover
                v-if="row.isMerged"
                placement="top"
                :width="280"
                trigger="hover"
              >
                <template #reference>
                  <el-tag 
                    type="warning" 
                    size="small" 
                    class="merged-tag"
                    @click.stop="handleMergedTagClick(row)"
                  >
                    <el-icon><Connection /></el-icon>
                    {{ row.mergedOrderCount }}
                  </el-tag>
                </template>
                <div class="merged-requests-popover">
                  <div class="popover-title">Merged from {{ row.mergedOrderCount }} requests:</div>
                  <div class="request-list">
                    <div 
                      v-for="reqId in row.mergedRequestIds" 
                      :key="reqId"
                      class="request-item"
                      @click="handleMergedRequestClick(reqId)"
                    >
                      <el-icon class="link-icon"><Link /></el-icon>
                      <span class="request-id">{{ reqId }}</span>
                    </div>
                  </div>
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        
        <template v-for="col in visibleColumns.filter(col => col.key !== 'requestNo')" :key="col.key">
          <el-table-column
            :prop="col.key"
            :label="col.label"
            :min-width="col.minWidth"
            :fixed="col.fixed"
            :sortable="col.sortable"
            :sort-orders="['ascending', 'descending']"
            :align="getColumnAlign(col.key)"
          >
            <template #default="{ row }">
              <div :class="['cell-content', `cell-${col.key}`]">
                <template v-if="col.key === 'status'">
                  <span :class="['status-tag', getStatusClass(row.status)]">
                    {{ getStatusLabel(row.status) }}
                  </span>
                </template>
                <template v-else-if="col.key === 'orderNos'">
                  <div class="order-nos-list">
                    <span v-for="(orderNo, idx) in row.orderNos" :key="idx" class="order-no-item">
                      {{ orderNo }}
                    </span>
                  </div>
                </template>
                <template v-else>
                  {{ row[col.key] || '-' }}
                </template>
              </div>
            </template>
          </el-table-column>
        </template>

        <!-- 操作列 -->
        <el-table-column
          label="Actions"
          width="180"
          fixed="right"
          align="center"
        >
          <template #default="{ row }">
            <div class="action-buttons-cell">
              <el-button
                v-if="row.status === ShippingRequestStatus.PendingApproval"
                type="success"
                size="small"
                link
                @click.stop="handleQuickApprove(row)"
              >
                Approve
              </el-button>
              <el-button
                v-if="row.status === ShippingRequestStatus.PendingApproval"
                type="danger"
                size="small"
                link
                @click.stop="handleQuickReject(row)"
              >
                Reject
              </el-button>
              <el-button
                v-if="[ShippingRequestStatus.Allocated, ShippingRequestStatus.WarehouseReceived].includes(row.status)"
                type="primary"
                size="small"
                link
                @click.stop="handleQuickAssignCarrier(row)"
              >
                Assign
              </el-button>
              <el-button
                type="info"
                size="small"
                link
                @click.stop="handleRequestClick(row)"
              >
                View
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 25, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :small="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <!-- 列设置抽屉 -->
      <el-drawer
        v-model="showColumnSettings"
        title="Columns"
        size="320px"
        direction="rtl"
        :show-close="false"
        class="column-settings-drawer"
      >
        <template #header>
          <div class="drawer-header">
            <span class="drawer-title">Columns</span>
            <el-button link @click="showColumnSettings = false">
              <el-icon class="close-icon"><Close /></el-icon>
            </el-button>
          </div>
        </template>

        <div class="column-settings">
          <div class="columns-list">
            <draggable
              v-model="columnsList"
              :item-key="'key'"
              handle=".drag-handle"
              @end="handleColumnSort"
            >
              <template #item="{ element }">
                <div class="column-item">
                  <el-checkbox 
                    v-model="element.visible"
                    @change="handleColumnVisibilityChange"
                  >
                    {{ element.label }}
                  </el-checkbox>
                  <el-icon class="drag-handle"><Rank /></el-icon>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </el-drawer>
    </div>

    <!-- 合并订单对话框 -->
    <el-dialog
      v-model="showMergeDialog"
      title="Merge Allocation Orders"
      width="900px"
      destroy-on-close
    >
      <div class="merge-dialog-content">
        <el-alert
          title="Select multiple allocation orders to merge into one shipping request"
          type="info"
          :closable="false"
          show-icon
          class="mb-4"
        />
        
        <el-table
          ref="mergeTableRef"
          :data="availableAllocationOrders"
          @selection-change="handleMergeSelectionChange"
          max-height="400"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="orderNo" label="Allocation Order No." width="160" />
          <el-table-column prop="originalOrderNo" label="Original Order No." width="160" />
          <el-table-column prop="warehouse" label="Warehouse" width="120" />
          <el-table-column prop="items" label="Items" width="80">
            <template #default="{ row }">
              {{ row.totalQuantity }} items
            </template>
          </el-table-column>
          <el-table-column prop="destination" label="Destination" min-width="150" />
        </el-table>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showMergeDialog = false">Cancel</el-button>
          <el-button
            type="primary"
            :disabled="selectedMergeOrders.length < 2"
            @click="handleConfirmMerge"
          >
            Merge {{ selectedMergeOrders.length }} Orders
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 审核对话框（含询价信息） -->
    <el-dialog
      v-model="showQuickApproveDialog"
      title="Review & Approve Shipping Request"
      width="800px"
      destroy-on-close
    >
      <div v-if="currentApprovalItem" class="approval-dialog-content">
        <!-- 基本信息 -->
        <div class="approval-info-section">
          <div class="info-row">
            <div class="info-label">Request No.:</div>
            <div class="info-value">{{ currentApprovalItem.requestNo }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Warehouse:</div>
            <div class="info-value">{{ currentApprovalItem.warehouse }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Destination:</div>
            <div class="info-value">{{ currentApprovalItem.destination }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Total Items:</div>
            <div class="info-value">{{ currentApprovalItem.totalItems }} items / {{ currentApprovalItem.totalQuantity }} qty</div>
          </div>
        </div>

        <el-divider />

        <!-- 承运商询价信息 -->
        <div class="carrier-quotes-section">
          <div class="section-title">Carrier Quotes</div>
          <div v-if="currentApprovalItem.carrierQuotes && currentApprovalItem.carrierQuotes.length > 0" class="quotes-grid">
            <div
              v-for="quote in currentApprovalItem.carrierQuotes"
              :key="quote.id"
              class="quote-card"
              :class="{ 'selected': selectedQuoteId === quote.id }"
              @click="selectedQuoteId = quote.id"
            >
              <div class="quote-header">
                <div class="quote-carrier">
                  <el-icon v-if="selectedQuoteId === quote.id" class="check-icon" color="#52c41a">
                    <CircleCheck />
                  </el-icon>
                  <span class="carrier-name">{{ quote.carrier }}</span>
                </div>
                <div class="quote-cost">${{ quote.estimatedCost.toFixed(2) }}</div>
              </div>
              <div class="quote-details">
                <div class="detail-item">
                  <span class="detail-label">Service:</span>
                  <span class="detail-value">{{ quote.service }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Method:</span>
                  <span class="detail-value">{{ quote.method }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Est. Days:</span>
                  <span class="detail-value">{{ quote.estimatedDays }} days</span>
                </div>
              </div>
              <div class="quote-footer">
                <span class="validity-text">Valid until: {{ quote.validUntil }}</span>
              </div>
            </div>
          </div>
          <el-empty
            v-else
            description="No carrier quotes available"
            :image-size="100"
          />
        </div>

        <!-- 手动指定承运商选项 -->
        <div class="manual-assign-section">
          <el-checkbox v-model="useManualAssign" @change="handleManualAssignChange">
            Manually specify carrier information
          </el-checkbox>
          
          <div v-if="useManualAssign" class="manual-assign-form">
            <el-form :model="manualCarrierForm" label-position="top">
              <el-row :gutter="16">
                <el-col :span="8">
                  <el-form-item label="Carrier" required>
                    <el-select v-model="manualCarrierForm.carrier" placeholder="Select carrier" style="width: 100%">
                      <el-option label="FedEx" value="FedEx" />
                      <el-option label="UPS" value="UPS" />
                      <el-option label="USPS" value="USPS" />
                      <el-option label="DHL" value="DHL" />
                      <el-option label="SF Express" value="SF Express" />
                      <el-option label="Canada Post" value="Canada Post" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="Shipping Method" required>
                    <el-select v-model="manualCarrierForm.shippingMethod" placeholder="Select method" style="width: 100%">
                      <el-option label="Ground" value="Ground" />
                      <el-option label="Express" value="Express" />
                      <el-option label="Overnight" value="Overnight" />
                      <el-option label="2-Day" value="2-Day" />
                      <el-option label="Standard" value="Standard" />
                      <el-option label="Priority" value="Priority" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="Shipping Service" required>
                    <el-select v-model="manualCarrierForm.shippingService" placeholder="Select service" style="width: 100%">
                      <el-option label="Home Delivery" value="Home Delivery" />
                      <el-option label="Business Delivery" value="Business Delivery" />
                      <el-option label="Signature Required" value="Signature Required" />
                      <el-option label="No Signature" value="No Signature" />
                      <el-option label="Saturday Delivery" value="Saturday Delivery" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              
              <!-- 询价按钮 -->
              <el-row>
                <el-col :span="24">
                  <el-button 
                    type="info" 
                    :loading="isRequestingQuoteForManual"
                    :disabled="!canRequestQuoteForManual"
                    @click="handleRequestQuoteForManual"
                  >
                    Request Quote for This Configuration
                  </el-button>
                </el-col>
              </el-row>

              <!-- 询价结果展示 -->
              <div v-if="manualQuoteResult" class="manual-quote-result">
                <el-divider>Quote Result</el-divider>
                <div class="quote-result-card">
                  <div class="result-header">
                    <span class="carrier-name">{{ manualQuoteResult.carrier }} - {{ manualQuoteResult.service }}</span>
                    <span class="quote-cost">${{ manualQuoteResult.estimatedCost.toFixed(2) }}</span>
                  </div>
                  <div class="result-details">
                    <div class="detail-row">
                      <span class="label">Method:</span>
                      <span class="value">{{ manualQuoteResult.method }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="label">Estimated Days:</span>
                      <span class="value">{{ manualQuoteResult.estimatedDays }} days</span>
                    </div>
                    <div class="detail-row">
                      <span class="label">Valid Until:</span>
                      <span class="value">{{ manualQuoteResult.validUntil }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-form>
          </div>
        </div>

        <!-- 拒绝原因区域 -->
        <div v-if="showRejectReasonInApproval" class="reject-reason-section">
          <el-form-item label="Rejection Reason" required>
            <el-input
              v-model="quickRejectReason"
              type="textarea"
              :rows="3"
              placeholder="Please provide a reason for rejection"
            />
          </el-form-item>
        </div>
      </div>

      <template #footer>
        <div class="approval-dialog-footer">
          <el-button @click="showQuickApproveDialog = false">Cancel</el-button>
          <el-button 
            type="danger" 
            @click="handleToggleRejectReason"
          >
            {{ showRejectReasonInApproval ? 'Cancel Reject' : 'Reject' }}
          </el-button>
          <el-button 
            v-if="showRejectReasonInApproval"
            type="danger"
            @click="handleConfirmRejectFromApproval"
          >
            Confirm Reject
          </el-button>
          <el-button 
            v-else
            type="success" 
            :disabled="!canApprove"
            @click="handleConfirmApprove"
          >
            Approve & Push to WMS
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 快速指定承运商对话框 -->
    <el-dialog
      v-model="showQuickAssignDialog"
      title="Assign Carrier & Shipping Method"
      width="600px"
      destroy-on-close
    >
      <el-form :model="quickCarrierForm" label-position="top">
        <el-form-item label="Request No.">
          <el-input :value="currentApprovalItem?.requestNo" disabled />
        </el-form-item>
        
        <el-form-item label="Carrier" required>
          <el-select
            v-model="quickCarrierForm.carrier"
            placeholder="Select carrier"
            style="width: 100%"
          >
            <el-option label="FedEx" value="FedEx" />
            <el-option label="UPS" value="UPS" />
            <el-option label="USPS" value="USPS" />
            <el-option label="DHL" value="DHL" />
            <el-option label="SF Express" value="SF Express" />
            <el-option label="Canada Post" value="Canada Post" />
          </el-select>
        </el-form-item>

        <el-form-item label="Shipping Method" required>
          <el-select
            v-model="quickCarrierForm.shippingMethod"
            placeholder="Select shipping method"
            style="width: 100%"
          >
            <el-option label="Ground" value="Ground" />
            <el-option label="Express" value="Express" />
            <el-option label="Overnight" value="Overnight" />
            <el-option label="2-Day" value="2-Day" />
            <el-option label="Standard" value="Standard" />
            <el-option label="Priority" value="Priority" />
          </el-select>
        </el-form-item>

        <el-form-item label="Shipping Service" required>
          <el-select
            v-model="quickCarrierForm.shippingService"
            placeholder="Select shipping service"
            style="width: 100%"
          >
            <el-option label="Home Delivery" value="Home Delivery" />
            <el-option label="Business Delivery" value="Business Delivery" />
            <el-option label="Signature Required" value="Signature Required" />
            <el-option label="No Signature" value="No Signature" />
            <el-option label="Saturday Delivery" value="Saturday Delivery" />
          </el-select>
        </el-form-item>

        <el-form-item label="Notes">
          <el-input
            v-model="quickCarrierForm.notes"
            type="textarea"
            :rows="3"
            placeholder="Enter any additional notes"
          />
        </el-form-item>

        <!-- 询价按钮 -->
        <el-form-item>
          <el-button 
            type="info" 
            :loading="isRequestingQuoteForAssign"
            :disabled="!canRequestQuoteForAssign"
            @click="handleRequestQuoteForAssign"
          >
            Request Quote for Selected Options
          </el-button>
        </el-form-item>

        <!-- 询价结果展示 -->
        <div v-if="assignQuoteResult" class="assign-quote-result">
          <el-divider>Quote Result</el-divider>
          <div class="quote-result-card">
            <div class="result-header">
              <span class="carrier-name">{{ assignQuoteResult.carrier }} - {{ assignQuoteResult.service }}</span>
              <span class="quote-cost">${{ assignQuoteResult.estimatedCost.toFixed(2) }}</span>
            </div>
            <div class="result-details">
              <div class="detail-row">
                <span class="label">Method:</span>
                <span class="value">{{ assignQuoteResult.method }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Estimated Days:</span>
                <span class="value">{{ assignQuoteResult.estimatedDays }} days</span>
              </div>
              <div class="detail-row">
                <span class="label">Valid Until:</span>
                <span class="value">{{ assignQuoteResult.validUntil }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="showQuickAssignDialog = false">Cancel</el-button>
        <el-button type="primary" @click="handleConfirmAssignCarrier">Save & Apply</el-button>
      </template>
    </el-dialog>

    <!-- 批量审核对话框 -->
    <el-dialog
      v-model="showBatchApproveDialog"
      title="Batch Approve Shipping Requests"
      width="600px"
      destroy-on-close
    >
      <el-alert
        :title="`Approve ${selectedRows.length} shipping request(s)?`"
        type="success"
        description="This will approve all selected requests and automatically push them to WMS."
        :closable="false"
        show-icon
      />
      <div style="margin-top: 16px;">
        <div style="font-weight: 500; margin-bottom: 8px;">Selected Requests:</div>
        <el-tag
          v-for="item in selectedRows"
          :key="item.id"
          style="margin: 4px;"
        >
          {{ item.requestNo }}
        </el-tag>
      </div>
      <template #footer>
        <el-button @click="showBatchApproveDialog = false">Cancel</el-button>
        <el-button type="success" @click="handleConfirmBatchApprove">
          Approve {{ selectedRows.length }} Request(s)
        </el-button>
      </template>
    </el-dialog>

    <!-- 批量指定承运商对话框 -->
    <el-dialog
      v-model="showBatchAssignDialog"
      title="Batch Assign Carrier & Shipping Method"
      width="600px"
      destroy-on-close
    >
      <el-form :model="batchCarrierForm" label-position="top">
        <el-alert
          :title="`Assign carrier for ${selectedRows.length} shipping request(s)`"
          type="info"
          :closable="false"
          show-icon
          style="margin-bottom: 16px;"
        />
        
        <el-form-item label="Carrier" required>
          <el-select
            v-model="batchCarrierForm.carrier"
            placeholder="Select carrier"
            style="width: 100%"
          >
            <el-option label="FedEx" value="FedEx" />
            <el-option label="UPS" value="UPS" />
            <el-option label="USPS" value="USPS" />
            <el-option label="DHL" value="DHL" />
            <el-option label="SF Express" value="SF Express" />
            <el-option label="Canada Post" value="Canada Post" />
          </el-select>
        </el-form-item>

        <el-form-item label="Shipping Method" required>
          <el-select
            v-model="batchCarrierForm.shippingMethod"
            placeholder="Select shipping method"
            style="width: 100%"
          >
            <el-option label="Ground" value="Ground" />
            <el-option label="Express" value="Express" />
            <el-option label="Overnight" value="Overnight" />
            <el-option label="2-Day" value="2-Day" />
            <el-option label="Standard" value="Standard" />
            <el-option label="Priority" value="Priority" />
          </el-select>
        </el-form-item>

        <el-form-item label="Shipping Service" required>
          <el-select
            v-model="batchCarrierForm.shippingService"
            placeholder="Select shipping service"
            style="width: 100%"
          >
            <el-option label="Home Delivery" value="Home Delivery" />
            <el-option label="Business Delivery" value="Business Delivery" />
            <el-option label="Signature Required" value="Signature Required" />
            <el-option label="No Signature" value="No Signature" />
            <el-option label="Saturday Delivery" value="Saturday Delivery" />
          </el-select>
        </el-form-item>

        <el-form-item label="Notes">
          <el-input
            v-model="batchCarrierForm.notes"
            type="textarea"
            :rows="3"
            placeholder="Enter any additional notes"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBatchAssignDialog = false">Cancel</el-button>
        <el-button type="primary" @click="handleConfirmBatchAssignCarrier">
          Apply to {{ selectedRows.length }} Request(s)
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import { 
  QuestionFilled,
  ArrowDown,
  Refresh,
  Grid,
  Close,
  Rank,
  Edit,
  Van,
  Printer,
  CircleCheck,
  Connection,
  Link
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { 
  DEFAULT_COLUMNS, 
  type ShippingRequestItem, 
  type ShippingRequestColumn,
  type AllocationOrderDetail,
  ShippingRequestStatus
} from './types'
import SearchForm from './components/SearchForm.vue'
import type { SearchCondition } from './types'

const router = useRouter()

// 模拟数据
const mockData: ShippingRequestItem[] = Array.from({ length: 25 }, (_, index) => {
  const orderCount = Math.floor(Math.random() * 3) + 1
  const statusIndex = index % 10
  const status = [
    ShippingRequestStatus.Allocated,
    ShippingRequestStatus.PendingApproval,
    ShippingRequestStatus.WarehouseReceived,
    ShippingRequestStatus.Committed,
    ShippingRequestStatus.Picked,
    ShippingRequestStatus.Packed,
    ShippingRequestStatus.Loaded,
    ShippingRequestStatus.PartialShip,
    ShippingRequestStatus.Shipped,
    ShippingRequestStatus.Cancelled
  ][statusIndex]

  // 为待审核状态的请求生成承运商报价
  const carrierQuotes = (statusIndex === 1) ? [
    {
      id: `${index}-1`,
      carrier: 'FedEx',
      service: 'FedEx Ground',
      method: 'Ground',
      estimatedCost: 12.99 + index * 0.5,
      estimatedDays: 5,
      quoteDate: '10/28/2025',
      validUntil: '11/04/2025',
      selected: false
    },
    {
      id: `${index}-2`,
      carrier: 'UPS',
      service: 'UPS Ground',
      method: 'Ground',
      estimatedCost: 13.99 + index * 0.5,
      estimatedDays: 4,
      quoteDate: '10/28/2025',
      validUntil: '11/04/2025',
      selected: false
    },
    {
      id: `${index}-3`,
      carrier: 'USPS',
      service: 'Priority Mail',
      method: 'Priority',
      estimatedCost: 9.99 + index * 0.5,
      estimatedDays: 3,
      quoteDate: '10/28/2025',
      validUntil: '11/04/2025',
      selected: false
    },
    {
      id: `${index}-4`,
      carrier: 'DHL',
      service: 'DHL Express',
      method: 'Express',
      estimatedCost: 18.99 + index * 0.5,
      estimatedDays: 2,
      quoteDate: '10/28/2025',
      validUntil: '11/04/2025',
      selected: false
    }
  ] : undefined

  const isMerged = index % 4 === 0 // 每4个有1个是合并订单
  const mergedOrderCount = isMerged ? Math.floor(Math.random() * 3) + 2 : 1
  const mergedRequestIds = isMerged 
    ? Array.from({ length: mergedOrderCount }, (_, i) => `SR-${20000 + index * 10 + i}`)
    : undefined
  
  return {
    id: String(index + 1),
    requestNo: `SR-${10000 + index}`,
    status,
    isMerged,
    mergedOrderCount: isMerged ? mergedOrderCount : undefined,
    mergedRequestIds,
    orderNos: Array.from({ length: isMerged ? mergedOrderCount : orderCount }, (_, i) => `SO-${30000 + index * 3 + i}`),
    dnNo: `DN-${40000 + index}`,
    channel: ['Shopify', 'Amazon', 'eBay', 'WooCommerce'][index % 4],
    channelName: ['My Shopify Store', 'Amazon US', 'eBay Store', 'WooCommerce Site'][index % 4],
    channelSalesOrderNo: `CSO-${50000 + index}`,
    referenceNo: `REF-${60000 + index}`,
    warehouse: ['Warehouse A', 'Warehouse B', 'Warehouse C'][index % 3],
    shippingCarrier: ['FedEx', 'UPS', 'USPS', 'DHL'][index % 4],
    trackingNumber: index % 2 === 0 ? `TN${1000000000 + index}` : '-',
    totalItems: Math.floor(Math.random() * 10) + 1,
    totalQuantity: Math.floor(Math.random() * 50) + 5,
    createdDate: '10/28/2025 10:30 AM',
    expectedShipDate: '10/30/2025',
    actualShipDate: index % 2 === 0 ? '10/29/2025 02:15 PM' : '-',
    destination: ['Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Houston, TX'][index % 4],
    recipientName: `Customer ${index + 1}`,
    recipientPhone: `+1-555-${String(1000 + index).padStart(4, '0')}`,
    notes: index % 3 === 0 ? 'Express shipping required' : '',
    updatedDate: '10/28/2025 03:45 PM',
    carrierQuotes,
    approvalStatus: statusIndex === 1 ? 'pending' : undefined
  }
});

// 模拟可用的Allocation Orders
const availableAllocationOrders = ref<any[]>(
  Array.from({ length: 10 }, (_, index) => ({
    id: String(index + 1),
    orderNo: `AO-${30000 + index}`,
    originalOrderNo: `#${5000 + index}`,
    warehouse: 'Warehouse A',
    totalQuantity: Math.floor(Math.random() * 10) + 1,
    destination: 'Los Angeles, CA 90001'
  }))
);

// 状态管理
const loading = ref(false)
const selectedRows = ref<ShippingRequestItem[]>([])
const showColumnSettings = ref(false)
const showMergeDialog = ref(false)
const showQuickApproveDialog = ref(false)
const showQuickRejectDialog = ref(false)
const showQuickAssignDialog = ref(false)
const showBatchApproveDialog = ref(false)
const showBatchAssignDialog = ref(false)
const displayMode = ref('comfortable')

// 当前操作的项目
const currentApprovalItem = ref<ShippingRequestItem | null>(null)
const quickRejectReason = ref('')
const selectedQuoteId = ref<string>('')
const showRejectReasonInApproval = ref(false)
const useManualAssign = ref(false)

// 询价相关状态
const isRequestingQuoteForAssign = ref(false)
const isRequestingQuoteForManual = ref(false)
const assignQuoteResult = ref<any>(null)
const manualQuoteResult = ref<any>(null)

// 手动指定承运商表单
const manualCarrierForm = ref({
  carrier: '',
  shippingMethod: '',
  shippingService: ''
})

// 快速指定承运商表单
const quickCarrierForm = ref({
  carrier: '',
  shippingMethod: '',
  shippingService: '',
  notes: ''
})

// 计算属性：是否可以询价（快速指定）
const canRequestQuoteForAssign = computed(() => {
  return quickCarrierForm.value.carrier && 
         quickCarrierForm.value.shippingMethod && 
         quickCarrierForm.value.shippingService
})

// 计算属性：是否可以询价（手动指定）
const canRequestQuoteForManual = computed(() => {
  return manualCarrierForm.value.carrier && 
         manualCarrierForm.value.shippingMethod && 
         manualCarrierForm.value.shippingService
})

// 批量指定承运商表单
const batchCarrierForm = ref({
  carrier: '',
  shippingMethod: '',
  shippingService: '',
  notes: ''
})
const columnsList = ref(DEFAULT_COLUMNS)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(mockData.length)
const tableRef = ref()
const mergeTableRef = ref()
const selectedMergeOrders = ref<any[]>([])

// 状态标签页
const activeStatus = ref('all')
const tabs = [
  { label: 'All Requests', value: 'all', count: 125, tagType: 'default' },
  { label: 'Allocated', value: ShippingRequestStatus.Allocated, count: 25, tagType: 'info' },
  { label: 'Pending Approval', value: ShippingRequestStatus.PendingApproval, count: 8, tagType: 'warning' },
  { label: 'Warehouse Received', value: ShippingRequestStatus.WarehouseReceived, count: 15, tagType: 'primary' },
  { label: 'Committed', value: ShippingRequestStatus.Committed, count: 12, tagType: 'primary' },
  { label: 'Picked', value: ShippingRequestStatus.Picked, count: 18, tagType: 'primary' },
  { label: 'Packed', value: ShippingRequestStatus.Packed, count: 10, tagType: 'primary' },
  { label: 'Loaded', value: ShippingRequestStatus.Loaded, count: 5, tagType: 'primary' },
  { label: 'Partially Shipped', value: ShippingRequestStatus.PartialShip, count: 8, tagType: 'warning' },
  { label: 'Shipped', value: ShippingRequestStatus.Shipped, count: 20, tagType: 'success' },
  { label: 'Cancelled', value: ShippingRequestStatus.Cancelled, count: 6, tagType: 'info' }
]

// 监听状态变化
watch(activeStatus, (newStatus) => {
  console.log('Status changed:', newStatus)
  refreshTable()
})

// 计算属性
const visibleColumns = computed(() => {
  return columnsList.value.filter(col => col.visible)
})

const tableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return mockData.slice(start, end)
})

const isAllSelected = computed({
  get: () => selectedRows.value.length > 0 && selectedRows.value.length === tableData.value.length,
  set: (val) => {
    if (tableRef.value) {
      val ? tableRef.value.toggleAllSelection() : tableRef.value.clearSelection()
    }
  }
})

const isIndeterminate = computed(() => {
  return selectedRows.value.length > 0 && selectedRows.value.length < tableData.value.length
})

// 方法
const handleSelectionChange = (rows: ShippingRequestItem[]) => {
  selectedRows.value = rows
}

const handleMergeSelectionChange = (selection: any[]) => {
  selectedMergeOrders.value = selection
}

const handleSortChange = ({ prop, order }: { prop: string, order: string }) => {
  console.log('Sort changed:', prop, order)
}

const handleSearch = (condition: SearchCondition) => {
  console.log('Search condition:', condition)
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const refreshTable = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('Table refreshed')
  }, 1000)
}

const handleColumnSort = () => {
  saveColumnSettings()
}

const handleColumnVisibilityChange = () => {
  saveColumnSettings()
}

const saveColumnSettings = () => {
  localStorage.setItem('shippingRequestColumns', JSON.stringify({
    columns: columnsList.value,
    displayMode: displayMode.value
  }))
}

const handleSelectAll = (val: boolean) => {
  if (tableRef.value) {
    val ? tableRef.value.toggleAllSelection() : tableRef.value.clearSelection()
  }
}

const clearSelection = () => {
  if (tableRef.value) {
    tableRef.value.clearSelection()
  }
}

const getRowClassName = ({ row }: { row: ShippingRequestItem }) => {
  return selectedRows.value.some(selected => selected.id === row.id) ? 'selected-row' : ''
}

const handleRowClick = (row: ShippingRequestItem) => {
  // 点击行不选择,只点击详情号跳转
}

const handleRequestClick = (row: ShippingRequestItem) => {
  router.push(`/order/shipping-request/${row.id}`)
}

// 点击合并标签 - 显示合并详情弹窗或导航到合并订单管理页
const handleMergedTagClick = (row: ShippingRequestItem) => {
  // 可以跳转到专门的合并订单详情页或显示更多信息
  ElMessage.info(`This request merged ${row.mergedOrderCount} orders. Click on individual request IDs to view details.`)
}

// 点击合并的单个 request ID
const handleMergedRequestClick = (requestId: string) => {
  // 根据 requestId 查找对应的订单并跳转
  ElMessage.success(`Navigating to ${requestId}`)
  // TODO: 实际应用中需要根据 requestId 找到对应的 ID 并跳转
  // router.push(`/order/shipping-request/${id}`)
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

const handleCreateCommand = (command: string) => {
  switch (command) {
    case 'new_request':
      ElMessage.info('Creating new shipping request...')
      break
    case 'merge_orders':
      showMergeDialog.value = true
      break
  }
}

const handleConfirmMerge = () => {
  ElMessage.success(`Successfully merged ${selectedMergeOrders.value.length} allocation orders`)
  showMergeDialog.value = false
  refreshTable()
}

const handleBatchAction = (action: string) => {
  console.log('Batch action:', action, selectedRows.value)
  
  switch (action) {
    case 'approve':
      // 检查是否都是待审核状态
      const pendingItems = selectedRows.value.filter(
        item => item.status === ShippingRequestStatus.PendingApproval
      )
      if (pendingItems.length === 0) {
        ElMessage.warning('No requests in pending approval status')
        return
      }
      if (pendingItems.length < selectedRows.value.length) {
        ElMessage.warning('Some selected requests are not in pending approval status')
      }
      showBatchApproveDialog.value = true
      break
    case 'assignCarrier':
      showBatchAssignDialog.value = true
      break
    default:
      ElMessage.success(`${action} executed successfully`)
  }
}

// 计算属性：是否可以审核
const canApprove = computed(() => {
  if (useManualAssign.value) {
    // 如果使用手动指定，需要填写完整的承运商信息
    return manualCarrierForm.value.carrier && 
           manualCarrierForm.value.shippingMethod && 
           manualCarrierForm.value.shippingService
  } else {
    // 如果使用询价，需要选择一个报价
    return selectedQuoteId.value !== '' || 
           (currentApprovalItem.value?.carrierQuotes && currentApprovalItem.value.carrierQuotes.length === 0)
  }
})

// 快速审核
const handleQuickApprove = (row: ShippingRequestItem) => {
  currentApprovalItem.value = row
  selectedQuoteId.value = row.selectedQuoteId || (row.carrierQuotes?.[0]?.id || '')
  showRejectReasonInApproval.value = false
  useManualAssign.value = false
  quickRejectReason.value = ''
  manualCarrierForm.value = {
    carrier: '',
    shippingMethod: '',
    shippingService: ''
  }
  showQuickApproveDialog.value = true
}

// 切换拒绝原因显示
const handleToggleRejectReason = () => {
  showRejectReasonInApproval.value = !showRejectReasonInApproval.value
  if (showRejectReasonInApproval.value) {
    quickRejectReason.value = ''
  }
}

// 手动指定承运商选项变化
const handleManualAssignChange = (value: boolean) => {
  if (value) {
    selectedQuoteId.value = ''
    manualQuoteResult.value = null
  } else {
    manualCarrierForm.value = {
      carrier: '',
      shippingMethod: '',
      shippingService: ''
    }
    manualQuoteResult.value = null
  }
}

// 为快速指定请求询价
const handleRequestQuoteForAssign = async () => {
  if (!canRequestQuoteForAssign.value) {
    ElMessage.warning('Please fill in all carrier information')
    return
  }

  isRequestingQuoteForAssign.value = true
  
  try {
    // TODO: 调用实际的询价API
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟询价结果
    const basePrice = Math.random() * 10 + 10
    const daysMap: Record<string, number> = {
      'Ground': 5,
      'Express': 2,
      'Overnight': 1,
      '2-Day': 2,
      'Standard': 4,
      'Priority': 3
    }
    
    assignQuoteResult.value = {
      id: Date.now().toString(),
      carrier: quickCarrierForm.value.carrier,
      service: `${quickCarrierForm.value.carrier} ${quickCarrierForm.value.shippingMethod}`,
      method: quickCarrierForm.value.shippingMethod,
      estimatedCost: Math.round(basePrice * 100) / 100,
      estimatedDays: daysMap[quickCarrierForm.value.shippingMethod] || 3,
      quoteDate: new Date().toLocaleDateString(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      selected: false
    }
    
    ElMessage.success('Quote received successfully')
  } catch (error) {
    ElMessage.error('Failed to request quote')
  } finally {
    isRequestingQuoteForAssign.value = false
  }
}

// 为手动指定请求询价
const handleRequestQuoteForManual = async () => {
  if (!canRequestQuoteForManual.value) {
    ElMessage.warning('Please fill in all carrier information')
    return
  }

  isRequestingQuoteForManual.value = true
  
  try {
    // TODO: 调用实际的询价API
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟询价结果
    const basePrice = Math.random() * 10 + 10
    const daysMap: Record<string, number> = {
      'Ground': 5,
      'Express': 2,
      'Overnight': 1,
      '2-Day': 2,
      'Standard': 4,
      'Priority': 3
    }
    
    manualQuoteResult.value = {
      id: Date.now().toString(),
      carrier: manualCarrierForm.value.carrier,
      service: `${manualCarrierForm.value.carrier} ${manualCarrierForm.value.shippingMethod}`,
      method: manualCarrierForm.value.shippingMethod,
      estimatedCost: Math.round(basePrice * 100) / 100,
      estimatedDays: daysMap[manualCarrierForm.value.shippingMethod] || 3,
      quoteDate: new Date().toLocaleDateString(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      selected: false
    }
    
    ElMessage.success('Quote received successfully')
  } catch (error) {
    ElMessage.error('Failed to request quote')
  } finally {
    isRequestingQuoteForManual.value = false
  }
}

// 快速拒绝
const handleQuickReject = (row: ShippingRequestItem) => {
  currentApprovalItem.value = row
  quickRejectReason.value = ''
  showQuickRejectDialog.value = true
}

// 快速指定承运商
const handleQuickAssignCarrier = (row: ShippingRequestItem) => {
  currentApprovalItem.value = row
  quickCarrierForm.value = {
    carrier: row.shippingCarrier || '',
    shippingMethod: '',
    shippingService: '',
    notes: ''
  }
  assignQuoteResult.value = null
  showQuickAssignDialog.value = true
}

// 确认审核通过
const handleConfirmApprove = async () => {
  if (!currentApprovalItem.value) return

  // 验证
  if (useManualAssign.value) {
    if (!manualCarrierForm.value.carrier || !manualCarrierForm.value.shippingMethod || !manualCarrierForm.value.shippingService) {
      ElMessage.warning('Please fill in all carrier information')
      return
    }
  } else {
    if (!selectedQuoteId.value && currentApprovalItem.value.carrierQuotes && currentApprovalItem.value.carrierQuotes.length > 0) {
      ElMessage.warning('Please select a carrier quote')
      return
    }
  }

  try {
    // TODO: 调用API审核通过
    currentApprovalItem.value.status = ShippingRequestStatus.Allocated
    currentApprovalItem.value.approvalStatus = 'approved'
    currentApprovalItem.value.approvedBy = 'Current User'
    currentApprovalItem.value.approvedDate = new Date().toLocaleString()
    
    // 保存选择的报价或手动指定的承运商信息
    if (useManualAssign.value) {
      currentApprovalItem.value.shippingCarrier = manualCarrierForm.value.carrier
      // TODO: 保存 shippingMethod 和 shippingService
    } else if (selectedQuoteId.value) {
      currentApprovalItem.value.selectedQuoteId = selectedQuoteId.value
      const selectedQuote = currentApprovalItem.value.carrierQuotes?.find(q => q.id === selectedQuoteId.value)
      if (selectedQuote) {
        currentApprovalItem.value.shippingCarrier = selectedQuote.carrier
      }
    }

    ElMessage.success(`Request ${currentApprovalItem.value.requestNo} approved and pushed to WMS`)
    showQuickApproveDialog.value = false
    currentApprovalItem.value = null
    selectedQuoteId.value = ''
    refreshTable()
  } catch (error) {
    ElMessage.error('Failed to approve request')
  }
}

// 从审核对话框确认拒绝
const handleConfirmRejectFromApproval = async () => {
  if (!currentApprovalItem.value || !quickRejectReason.value.trim()) {
    ElMessage.warning('Please provide a rejection reason')
    return
  }

  try {
    // TODO: 调用API拒绝
    currentApprovalItem.value.approvalStatus = 'rejected'
    currentApprovalItem.value.rejectionReason = quickRejectReason.value
    currentApprovalItem.value.status = ShippingRequestStatus.Allocated

    ElMessage.success(`Request ${currentApprovalItem.value.requestNo} rejected`)
    showQuickApproveDialog.value = false
    currentApprovalItem.value = null
    quickRejectReason.value = ''
    showRejectReasonInApproval.value = false
    refreshTable()
  } catch (error) {
    ElMessage.error('Failed to reject request')
  }
}

// 确认拒绝
const handleConfirmReject = async () => {
  if (!currentApprovalItem.value || !quickRejectReason.value.trim()) {
    ElMessage.warning('Please provide a rejection reason')
    return
  }

  try {
    // TODO: 调用API拒绝
    currentApprovalItem.value.approvalStatus = 'rejected'
    currentApprovalItem.value.rejectionReason = quickRejectReason.value
    currentApprovalItem.value.status = ShippingRequestStatus.Allocated

    ElMessage.success(`Request ${currentApprovalItem.value.requestNo} rejected`)
    showQuickRejectDialog.value = false
    currentApprovalItem.value = null
    quickRejectReason.value = ''
    refreshTable()
  } catch (error) {
    ElMessage.error('Failed to reject request')
  }
}

// 确认指定承运商
const handleConfirmAssignCarrier = async () => {
  if (!currentApprovalItem.value) return
  
  if (!quickCarrierForm.value.carrier || !quickCarrierForm.value.shippingMethod || !quickCarrierForm.value.shippingService) {
    ElMessage.warning('Please fill in all required fields')
    return
  }

  try {
    // TODO: 调用API保存承运商信息
    currentApprovalItem.value.shippingCarrier = quickCarrierForm.value.carrier

    ElMessage.success(`Carrier assigned to ${currentApprovalItem.value.requestNo}`)
    showQuickAssignDialog.value = false
    currentApprovalItem.value = null
    refreshTable()
  } catch (error) {
    ElMessage.error('Failed to assign carrier')
  }
}

// 批量审核通过
const handleConfirmBatchApprove = async () => {
  try {
    // TODO: 调用API批量审核
    const pendingItems = selectedRows.value.filter(
      item => item.status === ShippingRequestStatus.PendingApproval
    )

    pendingItems.forEach(item => {
      item.status = ShippingRequestStatus.Allocated
      item.approvalStatus = 'approved'
      item.approvedBy = 'Current User'
      item.approvedDate = new Date().toLocaleString()
    })

    ElMessage.success(`${pendingItems.length} request(s) approved and pushed to WMS`)
    showBatchApproveDialog.value = false
    clearSelection()
    refreshTable()
  } catch (error) {
    ElMessage.error('Failed to approve requests')
  }
}

// 批量指定承运商
const handleConfirmBatchAssignCarrier = async () => {
  if (!batchCarrierForm.value.carrier || !batchCarrierForm.value.shippingMethod || !batchCarrierForm.value.shippingService) {
    ElMessage.warning('Please fill in all required fields')
    return
  }

  try {
    // TODO: 调用API批量保存承运商信息
    selectedRows.value.forEach(item => {
      item.shippingCarrier = batchCarrierForm.value.carrier
    })

    ElMessage.success(`Carrier assigned to ${selectedRows.value.length} request(s)`)
    showBatchAssignDialog.value = false
    clearSelection()
    refreshTable()
  } catch (error) {
    ElMessage.error('Failed to assign carrier')
  }
}

const getColumnAlign = (key: string) => {
  return 'left'
}

const getStatusClass = (status: ShippingRequestStatus) => {
  const statusMap: Record<string, string> = {
    // 前置状态
    [ShippingRequestStatus.Allocated]: 'status-allocated',
    [ShippingRequestStatus.PendingApproval]: 'status-pending-approval',
    
    // WMS 处理流程
    [ShippingRequestStatus.WarehouseReceived]: 'status-warehouse-received',
    [ShippingRequestStatus.Committed]: 'status-committed',
    [ShippingRequestStatus.Picked]: 'status-picked',
    [ShippingRequestStatus.Packed]: 'status-packed',
    [ShippingRequestStatus.Loaded]: 'status-loaded',
    
    // 发货状态
    [ShippingRequestStatus.PartialShip]: 'status-partial-ship',
    [ShippingRequestStatus.Shipped]: 'status-shipped',
    
    // 异常状态
    [ShippingRequestStatus.Cancelled]: 'status-cancelled'
  }
  return statusMap[status] || ''
}

const getStatusLabel = (status: ShippingRequestStatus) => {
  const labelMap: Record<string, string> = {
    // 前置状态
    [ShippingRequestStatus.Allocated]: 'Allocated',
    [ShippingRequestStatus.PendingApproval]: 'Pending Approval',
    
    // WMS 处理流程
    [ShippingRequestStatus.WarehouseReceived]: 'Warehouse Received',
    [ShippingRequestStatus.Committed]: 'Committed',
    [ShippingRequestStatus.Picked]: 'Picked',
    [ShippingRequestStatus.Packed]: 'Packed',
    [ShippingRequestStatus.Loaded]: 'Loaded',
    
    // 发货状态
    [ShippingRequestStatus.PartialShip]: 'Partially Shipped',
    [ShippingRequestStatus.Shipped]: 'Shipped',
    
    // 异常状态
    [ShippingRequestStatus.Cancelled]: 'Cancelled'
  }
  return labelMap[status] || status
}

// 生命周期钩子
onMounted(() => {
  const saved = localStorage.getItem('shippingRequestColumns')
  if (saved) {
    try {
      const settings = JSON.parse(saved)
      if (settings.columns) {
        const defaultColumns = DEFAULT_COLUMNS
        defaultColumns.forEach(col => {
          const savedCol = settings.columns.find((saved: ShippingRequestColumn) => saved.key === col.key)
          if (savedCol) {
            col.visible = savedCol.visible
          }
        })
        columnsList.value = defaultColumns
      }
      displayMode.value = settings.displayMode || 'comfortable'
    } catch (error) {
      console.error('Failed to load column settings:', error)
      columnsList.value = DEFAULT_COLUMNS
    }
  } else {
    columnsList.value = DEFAULT_COLUMNS
  }
})

onUnmounted(() => {
  // 清理工作
})
</script>

<style lang="scss" scoped>
.shipping-request {
  padding: 24px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1a1d21;
  color: #fff;
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      
      h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 500;
        color: #fff;
      }
      
      .help-icon {
        color: #8b949e;
        cursor: pointer;
        
        &:hover {
          color: #7c4dff;
        }
      }
    }
    
    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;

      .action-buttons {
        display: flex;
        align-items: center;
        gap: 8px;

        .el-button {
          height: 32px;
          padding: 0 12px;
          font-weight: normal;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;

          &.el-button--primary {
            background: #0066ff;
            border-color: #0066ff;
            padding: 0 16px;

            &:hover {
              background: #1a75ff;
              border-color: #1a75ff;
            }
          }

          .el-icon {
            font-size: 14px;
          }
        }
      }
    }
  }

  .status-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    background: #1e2227;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);

    .status-tabs {
      flex: 1;
      overflow-x: auto;
      overflow-y: hidden;
      
      &::-webkit-scrollbar {
        display: none;
      }

      .tab-list {
        display: flex;
        min-width: min-content;
        height: 48px;
        padding: 0 8px;

        .tab-item {
          position: relative;
          padding: 0 24px;
          cursor: pointer;
          user-select: none;
          white-space: nowrap;
          
          &:hover {
            .tab-content {
              .tab-label {
                color: #fff;
              }
            }
          }

          .tab-content {
            height: 48px;
            display: flex;
            align-items: center;
            gap: 8px;

            .tab-label {
              color: #8b949e;
              font-size: 13px;
              font-weight: 500;
              transition: color 0.2s;
            }

            .count-tag {
              padding: 0 8px;
              height: 20px;
              min-width: 20px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              border-radius: 10px;
              font-size: 12px;
              font-weight: 500;
              background: rgba(255, 255, 255, 0.04);
              color: #8b949e;

              &.warning {
                background: rgba(255, 171, 0, 0.1);
                color: #ffab00;
              }

              &.danger {
                background: rgba(255, 77, 79, 0.1);
                color: #ff4d4f;
              }

              &.success {
                background: rgba(82, 196, 26, 0.1);
                color: #52c41a;
              }

              &.info {
                background: rgba(24, 144, 255, 0.1);
                color: #1890ff;
              }
            }
          }

          .tab-line {
            position: absolute;
            bottom: 0;
            left: 24px;
            right: 24px;
            height: 2px;
            background: transparent;
            transition: background-color 0.2s;
          }

          &.active {
            .tab-content {
              .tab-label {
                color: #0066ff;
              }

              .count-tag {
                background: rgba(0, 102, 255, 0.1);
                color: #0066ff;
              }
            }

            .tab-line {
              background: #0066ff;
            }
          }
        }
      }
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 1px;
      padding-right: 8px;
      border-left: 1px solid rgba(255, 255, 255, 0.1);

      .action-btn {
        height: 48px;
        width: 48px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        color: #8b949e;
        transition: all 0.2s;

        &:hover {
          background: rgba(255, 255, 255, 0.04);
          color: #fff;
        }

        .el-icon {
          font-size: 18px;
        }
      }
    }
  }

  .selection-toolbar {
    background: #7c4dff;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    
    .selection-info {
      :deep(.el-checkbox) {
        --el-checkbox-text-color: white;
        --el-checkbox-input-border-color: white;
        --el-checkbox-checked-input-border-color: white;
        --el-checkbox-checked-bg-color: white;
        --el-checkbox-checked-icon-color: #7c4dff;
      }

      .selection-text {
        font-weight: 500;
      }
    }
    
    .action-buttons {
      display: flex;
      gap: 8px;
      align-items: center;
      
      .el-button-group {
        .el-button {
          color: white;
          border-color: rgba(255, 255, 255, 0.3);
          background: transparent;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 6px;

          &:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: white;
          }

          .el-icon {
            font-size: 16px;
          }
        }
      }

      .el-button--text {
        color: rgba(255, 255, 255, 0.8);
        
        &:hover {
          color: white;
        }
      }
    }
  }
  
  .table-section {
    flex: 1;
    background: #1e2227;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
    min-height: 500px;
    
    :deep(.el-table) {
      flex: 1;
      background: transparent;
      border: none;
      overflow: auto;
      
      &::before,
      &::after {
        display: none;
      }
      
      th {
        background: #1a1d21 !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        color: #8b949e;
        font-size: 12px;
        font-weight: 500;
        height: 40px;
      }
      
      td {
        background: transparent;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        color: #fff;
        height: 48px;
        padding: 8px 0;
      }
      
      tr {
        background: transparent;
        
        &:hover > td {
          background: rgba(255, 255, 255, 0.02) !important;
        }
      }
    }
    
    .pagination-container {
      margin-top: 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      min-height: 32px;
      width: 100%;
      box-sizing: border-box;
      background: #1e2227;
      
      :deep(.el-pagination) {
        --el-pagination-button-bg-color: transparent;
        --el-pagination-hover-color: #0066ff;
        --el-pagination-text-color: #8b949e;
        white-space: nowrap;
        
        .el-pagination__total {
          color: #8b949e;
          font-size: 13px;
        }
        
        button {
          height: 32px;
          min-width: 32px;
          
          &:not(:disabled):hover {
            color: #0066ff;
          }
        }
        
        .el-pager {
          li {
            height: 32px;
            min-width: 32px;
            line-height: 32px;
            background: transparent;
            color: #8b949e;
            font-size: 13px;
            
            &:hover {
              color: #0066ff;
            }
            
            &.is-active {
              color: #0066ff;
              background: rgba(0, 102, 255, 0.1);
            }
          }
        }
      }
    }
  }

  .column-settings {
    height: 100%;
    padding: 16px 20px;
    
    .columns-list {
      height: 100%;
      overflow-y: auto;
      margin: 0 -20px;
      padding: 0 20px;

      .column-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        margin-bottom: 4px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.1);
        
        &:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }

        :deep(.el-checkbox) {
          --el-checkbox-checked-bg-color: #0066ff;
          --el-checkbox-checked-input-border-color: #0066ff;
          --el-checkbox-text-color: #fff;
          --el-checkbox-input-border-color: rgba(255, 255, 255, 0.3);

          .el-checkbox__label {
            font-size: 13px;
          }
        }

        .drag-handle {
          color: #8b949e;
          font-size: 16px;
          cursor: move;

          &:hover {
            color: #fff;
          }
        }
      }
    }
  }
}

.request-table {
  .request-no-cell {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .merged-tag {
      height: 20px;
      padding: 0 6px;
      font-size: 11px;
      border: none;
      background: rgba(255, 171, 0, 0.1);
      color: #ffab00;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        background: rgba(255, 171, 0, 0.2);
        transform: scale(1.05);
      }
      
      .el-icon {
        font-size: 12px;
      }
    }
  }
  
  .request-no-link {
    color: #0066ff;
    cursor: pointer;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
    
    &:hover {
      color: #1a75ff;
      text-decoration: underline;
    }
  }

  .status-tag {
    display: inline-flex;
    align-items: center;
    height: 24px;
    padding: 0 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    
    &.status-allocated {
      background: rgba(24, 144, 255, 0.1);
      color: #1890ff;
    }

    &.status-pending-approval {
      background: rgba(255, 171, 0, 0.1);
      color: #ffab00;
    }
    
    &.status-warehouse-received {
      background: rgba(24, 144, 255, 0.1);
      color: #1890ff;
    }

    &.status-committed {
      background: rgba(82, 196, 26, 0.1);
      color: #52c41a;
    }
    
    &.status-picked {
      background: rgba(82, 196, 26, 0.1);
      color: #52c41a;
    }
    
    &.status-packed {
      background: rgba(82, 196, 26, 0.1);
      color: #52c41a;
    }

    &.status-loaded {
      background: rgba(82, 196, 26, 0.1);
      color: #52c41a;
    }

    &.status-partial-ship {
      background: rgba(250, 173, 20, 0.1);
      color: #faad14;
    }
    
    &.status-shipped {
      background: rgba(0, 102, 255, 0.1);
      color: #0066ff;
    }
    
    &.status-cancelled {
      background: rgba(140, 140, 140, 0.1);
      color: #8c8c8c;
    }
  }


  .count-badge {
    color: #8b949e;
    font-size: 12px;
  }

  .order-nos-list {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .order-no-item {
      color: #8b949e;
      font-size: 12px;
      line-height: 1.4;
    }
  }

  .number {
    font-family: 'Roboto Mono', monospace;
    color: #fff;
    font-weight: 500;
  }

  .cell-content {
    display: flex;
    align-items: center;
    min-height: 32px;
  }
}

:deep(.column-settings-drawer) {
  .el-drawer__header {
    margin-bottom: 0;
    padding: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .drawer-header {
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .drawer-title {
      font-size: 16px;
      font-weight: 500;
      color: #fff;
    }

    .close-icon {
      font-size: 18px;
      color: #8b949e;
      cursor: pointer;

      &:hover {
        color: #fff;
      }
    }
  }
}

.merge-dialog-content {
  padding: 0 20px;

  .mb-4 {
    margin-bottom: 16px;
  }
}

.dialog-footer {
  padding: 20px 0 0;
  text-align: right;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.el-dropdown-menu) {
  background: #1a1d21;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px;

  .el-dropdown-menu__item {
    color: #8b949e;
    font-size: 13px;
    padding: 8px 16px;
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
    }
  }
}

// 操作列按钮样式
.action-buttons-cell {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;

  .el-button {
    font-size: 12px;
    padding: 0;
  }
}

// Order Nos 列表样式
.order-nos-list {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .order-no-item {
    color: #8b949e;
    font-size: 12px;
    line-height: 1.4;
  }
}

// 审核对话框样式
.approval-dialog-content {
  .approval-info-section {
    background: rgba(255, 255, 255, 0.02);
    padding: 16px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);

    .info-row {
      display: flex;
      align-items: center;
      padding: 8px 0;

      &:not(:last-child) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }

      .info-label {
        min-width: 120px;
        color: #8b949e;
        font-size: 13px;
      }

      .info-value {
        color: #fff;
        font-size: 14px;
        font-weight: 500;
      }
    }
  }

  .carrier-quotes-section {
    margin-top: 20px;

    .section-title {
      font-size: 15px;
      font-weight: 600;
      color: #fff;
      margin-bottom: 12px;
    }

    .quotes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 12px;
      max-height: 300px;
      overflow-y: auto;
      padding: 4px;

      .quote-card {
        background: rgba(255, 255, 255, 0.02);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 12px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.05);
        }

        &.selected {
          border-color: #52c41a;
          background: rgba(82, 196, 26, 0.1);
        }

        .quote-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;

          .quote-carrier {
            display: flex;
            align-items: center;
            gap: 6px;

            .check-icon {
              font-size: 18px;
            }

            .carrier-name {
              font-size: 14px;
              font-weight: 600;
              color: #fff;
            }
          }

          .quote-cost {
            font-size: 16px;
            font-weight: 700;
            color: #52c41a;
          }
        }

        .quote-details {
          margin-bottom: 8px;

          .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            font-size: 12px;

            .detail-label {
              color: #8b949e;
            }

            .detail-value {
              color: #fff;
            }
          }
        }

        .quote-footer {
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);

          .validity-text {
            font-size: 11px;
            color: #8b949e;
          }
        }
      }
    }
  }

  .manual-assign-section {
    margin-top: 20px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);

    .manual-assign-form {
      margin-top: 16px;
    }
  }

  .reject-reason-section {
    margin-top: 20px;
    padding: 16px;
    background: rgba(255, 138, 0, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(255, 138, 0, 0.3);
  }
}

.approval-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

// 询价结果卡片样式（快速指定和手动指定）
.assign-quote-result,
.manual-quote-result {
  margin-top: 16px;

  .quote-result-card {
    background: rgba(82, 196, 26, 0.05);
    border: 1px solid rgba(82, 196, 26, 0.3);
    border-radius: 8px;
    padding: 16px;

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      .carrier-name {
        font-size: 15px;
        font-weight: 600;
        color: #fff;
      }

      .quote-cost {
        font-size: 20px;
        font-weight: 700;
        color: #52c41a;
      }
    }

    .result-details {
      .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 0;
        font-size: 13px;

        .label {
          color: #8b949e;
        }

        .value {
          color: #fff;
          font-weight: 500;
        }
      }
    }
  }
}

// 合并请求 Popover 样式
.merged-requests-popover {
  .popover-title {
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .request-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: 200px;
    overflow-y: auto;

    .request-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: rgba(0, 102, 255, 0.1);
        border-color: rgba(0, 102, 255, 0.3);

        .request-id {
          color: #0066ff;
        }

        .link-icon {
          color: #0066ff;
        }
      }

      .link-icon {
        font-size: 14px;
        color: #8b949e;
        transition: color 0.2s;
      }

      .request-id {
        font-size: 13px;
        color: #fff;
        font-weight: 500;
        transition: color 0.2s;
      }
    }

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
}
</style>

