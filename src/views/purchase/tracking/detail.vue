<!-- src/views/purchase/tracking/detail.vue -->
<template>
  <div class="purchase-order-tracking-detail">
    <!-- Header Navigation -->
    <div class="page-header">
      <div class="left-section">
        <el-button link class="back-button">
          <el-icon><ArrowLeft /></el-icon>
          Back to List
        </el-button>
        <h1 class="po-number">Purchase Order #PO-2024-001</h1>
        <el-tag type="success" class="priority-tag">High Priority</el-tag>
        <el-tag type="primary" class="status-tag">In Progress - Export & Customs</el-tag>
          </div>
      <div class="right-section">
        <el-button>
          <el-icon><View /></el-icon>
          Show Details
            </el-button>
        <el-button>
              <el-icon><Download /></el-icon>
          Export Report
            </el-button>
        <el-button type="primary" class="refresh-button">
          <el-icon><Refresh /></el-icon>
          Refresh
        </el-button>
        </div>
      </div>

    <!-- Status Cards -->
    <div class="status-cards">
      <div class="status-card delivery">
        <div class="card-label">On-Time Delivery</div>
        <div class="card-value">On Track</div>
        <div class="card-metric">Industry: 76%</div>
        <el-icon class="trend-icon"><TrendCharts /></el-icon>
            </div>

      <div class="status-card quality">
        <div class="card-label">Quality Score</div>
        <div class="card-value">A+</div>
        <div class="card-metric">Target: 95%</div>
        <el-icon class="check-icon"><CircleCheck /></el-icon>
            </div>

      <div class="status-card cost">
        <div class="card-label">Cost Variance</div>
        <div class="card-value">$0</div>
        <div class="card-metric">Budget: $18,500</div>
        <el-icon class="money-icon"><Money /></el-icon>
            </div>

      <div class="status-card risk">
        <div class="card-label">Risk Level</div>
        <div class="card-value">Low</div>
        <div class="card-metric">Acceptable: <25%</div>
        <el-icon class="info-icon"><InfoFilled /></el-icon>
          </div>
        </div>

    <!-- Progress Timeline -->
    <div class="progress-section">
      <h2>Procurement Fulfillment Progress</h2>
      <div class="timeline">
        <div class="timeline-item completed">
          <div class="icon-wrapper">
            <el-icon><Document /></el-icon>
            </div>
          <div class="content">
            <div class="title">PO Created</div>
            <div class="time">Jan 15, 9:00 AM</div>
            </div>
            </div>

        <div class="timeline-item completed">
          <div class="icon-wrapper">
            <el-icon><Check /></el-icon>
            </div>
          <div class="content">
            <div class="title">PO Confirmed</div>
            <div class="time">Jan 16, 2:15 PM</div>
          </div>
        </div>

        <div class="timeline-item completed">
          <div class="icon-wrapper">
            <el-icon><Tools /></el-icon>
          </div>
          <div class="content">
            <div class="title">Pre-Production</div>
            <div class="time">Jan 20, 10:00 AM</div>
      </div>
    </div>

        <div class="timeline-item completed">
          <div class="icon-wrapper">
            <el-icon><Setting /></el-icon>
            </div>
          <div class="content">
            <div class="title">In Production</div>
            <div class="time">Feb 06, 8:00 AM</div>
            </div>
          </div>

        <div class="timeline-item completed">
          <div class="icon-wrapper">
            <el-icon><Box /></el-icon>
            </div>
          <div class="content">
            <div class="title">Post-Production</div>
            <div class="time">Feb 25, 3:00 PM</div>
          </div>
        </div>

        <div class="timeline-item current">
          <div class="icon-wrapper">
            <el-icon><Ship /></el-icon>
          </div>
          <div class="content">
            <div class="title">Export & Customs</div>
            <div class="time">Mar 02, 9:30 AM</div>
          </div>
        </div>

        <div class="timeline-item">
          <div class="icon-wrapper">
            <el-icon><Van /></el-icon>
            </div>
          <div class="content">
            <div class="title">International Transit</div>
            <div class="status">Pending</div>
            </div>
            </div>

        <div class="timeline-item">
          <div class="icon-wrapper">
            <el-icon><TakeawayBox /></el-icon>
          </div>
          <div class="content">
            <div class="title">Import & Delivery</div>
            <div class="status">Pending</div>
        </div>
        </div>

        <div class="timeline-item">
          <div class="icon-wrapper">
            <el-icon><Document /></el-icon>
          </div>
          <div class="content">
            <div class="title">Received (GRN)</div>
            <div class="status">Pending</div>
      </div>
    </div>

        <div class="timeline-item">
          <div class="icon-wrapper">
            <el-icon><Wallet /></el-icon>
          </div>
          <div class="content">
            <div class="title">Invoiced & Payment</div>
            <div class="status">Pending</div>
            </div>
        </div>
      </div>
    </div>

    <!-- Info Cards -->
    <div class="info-cards">
      <div class="info-card supplier">
        <div class="card-header">
          <el-icon><House /></el-icon>
          <h3>Supplier & Commercial Details</h3>
        </div>
        <div class="card-content">
          <div class="info-group">
            <div class="info-item">
              <label>Supplier Name:</label>
              <span>Shenzhen Technology Co., Ltd</span>
            </div>
            <div class="info-item">
              <label>Supplier Code:</label>
              <span>SUP-001</span>
            </div>
          </div>
          <div class="info-group">
            <div class="info-item">
              <label>Contact Person:</label>
              <span>Manager Li Wei</span>
            </div>
            <div class="info-item">
              <label>Supplier Rating:</label>
              <el-tag type="success" size="small">A+ Supplier</el-tag>
            </div>
          </div>
          <div class="contact-info">
            <div class="contact-item">
              <el-icon><Phone /></el-icon>
              <span>+86 138-0013-8000</span>
            </div>
            <div class="contact-item">
              <el-icon><Message /></el-icon>
              <span>li.wei@sztech.com</span>
            </div>
          </div>
          <div class="payment-info">
            <div class="info-item">
              <label>Total Amount:</label>
              <span class="amount">$18,500.00</span>
            </div>
            <div class="info-item">
              <label>Payment Terms:</label>
              <span>T/T 30% Advance ($5,550), 70% Before Shipment ($12,950)</span>
          </div>
        </div>
      </div>
    </div>

      <div class="info-card shipping">
        <div class="card-header">
          <el-icon><Ship /></el-icon>
          <h3>Shipping & Logistics Details</h3>
            </div>
        <div class="card-content">
          <div class="info-group">
            <div class="info-item">
              <label>Origin Port:</label>
              <span>Shenzhen Port, China</span>
            </div>
            <div class="info-item">
              <label>Destination Port:</label>
              <span>Los Angeles Port, USA</span>
          </div>
              </div>
          <div class="info-group">
            <div class="info-item">
              <label>Vessel Name:</label>
              <span>COSCO SHIPPING UNIVERSE</span>
            </div>
            <div class="info-item">
              <label>Booking No:</label>
              <span>COSU7834567890</span>
            </div>
          </div>
          <div class="info-group">
            <div class="info-item">
              <label>ETD:</label>
              <span>March 05, 2024</span>
            </div>
            <div class="info-item">
              <label>ETA:</label>
              <span>March 25, 2024</span>
            </div>
          </div>
          <div class="info-group">
            <div class="info-item">
              <label>Container Type:</label>
              <span>40ft Standard Container</span>
            </div>
            <div class="info-item">
              <label>Forwarder:</label>
              <span>COSCO Shipping Lines</span>
            </div>
          </div>
        </div>
          </div>
        </div>

    <!-- Process Tabs -->
    <div class="process-tabs">
      <el-tabs v-model="activeTab">
        <!-- PO Created Tab -->
        <el-tab-pane label="PO Created" name="created">
          <div class="process-content">
            <div class="section-header">
              <h3>PO Created: Internal Order & Approval</h3>
              <div class="progress-info">
                <span class="percentage">100%</span>
                <span class="status">Overall Progress</span>
                <span class="etc">ETC: Jan 15, 2024</span>
                    </div>
            </div>

            <!-- Purchase Requisition -->
            <div class="requisition-section">
              <div class="section-title">
                            <el-icon><Document /></el-icon>
                <h4>Purchase Requisition</h4>
                <el-tag type="success">Completed</el-tag>
                <div class="progress">100%</div>
                          </div>
              <div class="requisition-info">
                <div class="info-item">
                  <label>Document No:</label>
                  <span>PR-2024-001</span>
                          </div>
                <div class="info-item">
                  <label>Created:</label>
                  <span>Jan 10, 2024</span>
                          </div>
                <div class="info-item">
                  <label>Amount:</label>
                  <span>$18,500.00</span>
                          </div>
                <div class="info-item">
                  <label>Approver:</label>
                  <span>Sarah Johnson</span>
                          </div>
                          </div>
                      </div>

            <!-- Process Flow -->
            <div class="process-flow">
              <h5>Process Flow</h5>
              <div class="flow-steps">
                <div class="flow-step completed">
                  <div class="step-icon">
                    <el-icon><Check /></el-icon>
                        </div>
                  <div class="step-content">
                    <div class="step-title">Requirement Analysis</div>
                    <div class="step-info">
                      <span class="date">Date: Jan 10, 9:00 AM</span>
                      <span class="handler">Handler: John Smith</span>
                          </div>
                      </div>
                        </div>

                <div class="flow-step completed">
                  <div class="step-icon">
                    <el-icon><Check /></el-icon>
                      </div>
                  <div class="step-content">
                    <div class="step-title">Budget Approval</div>
                    <div class="step-info">
                      <span class="date">Date: Jan 12, 2:00 PM</span>
                      <span class="handler">Handler: Finance Dept</span>
                    </div>
                  </div>
                </div>

                <div class="flow-step completed">
                  <div class="step-icon">
                    <el-icon><Check /></el-icon>
                  </div>
                  <div class="step-content">
                    <div class="step-title">Supplier Selection</div>
                    <div class="step-info">
                      <span class="date">Date: Jan 14, 10:00 AM</span>
                      <span class="handler">Handler: Procurement</span>
                    </div>
              </div>
            </div>

                <div class="flow-step completed">
                  <div class="step-icon">
                    <el-icon><Check /></el-icon>
                    </div>
                  <div class="step-content">
                    <div class="step-title">PO Creation</div>
                    <div class="step-info">
                      <span class="date">Date: Jan 15, 9:00 AM</span>
                      <span class="handler">Handler: John Smith</span>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- PO Confirmed Tab -->
        <el-tab-pane label="PO Confirmed" name="confirmed">
          <div class="process-content">
            <div class="section-header">
              <h3>PO Confirmed: Supplier Order Confirmation</h3>
              <div class="progress-info">
                <span class="percentage">100%</span>
                <span class="status">Overall Progress</span>
                <span class="etc">ETC: Jan 16, 2024</span>
              </div>
            </div>

            <!-- Supplier Confirmation Section -->
            <div class="section-block">
              <div class="section-title">
                <el-icon><Document /></el-icon>
                <h4>Supplier Confirmation</h4>
                <el-tag type="success">Completed</el-tag>
                <div class="progress">100%</div>
              </div>
              <div class="section-info">
                      <div class="info-item">
                  <label>Document No:</label>
                  <span>SC-2024-001</span>
                        </div>
                <div class="info-item">
                  <label>Created:</label>
                  <span>Jan 16, 2024</span>
                      </div>
                      <div class="info-item">
                  <label>Supplier:</label>
                  <span>Shenzhen Technology Co., Ltd</span>
                        </div>
                      </div>
                    </div>

            <!-- Process Flow -->
            <div class="process-flow">
              <h5>Process Flow</h5>
              <div class="flow-steps">
                <div class="flow-step completed">
                  <div class="step-icon">
                    <el-icon><Check /></el-icon>
                        </div>
                  <div class="step-content">
                    <div class="step-title">PO Receipt</div>
                    <div class="step-info">
                      <span class="date">Date: Jan 16, 9:00 AM</span>
                      <span class="handler">Handler: Supplier Sales</span>
                        </div>
                      </div>
                    </div>

                <div class="flow-step completed">
                  <div class="step-icon">
                    <el-icon><Check /></el-icon>
                  </div>
                  <div class="step-content">
                    <div class="step-title">Technical Specs Check</div>
                    <div class="step-info">
                      <span class="date">Date: Jan 16, 11:00 AM</span>
                      <span class="handler">Handler: Supplier Eng.</span>
                    </div>
                  </div>
                </div>

                <div class="flow-step completed">
                  <div class="step-icon">
                    <el-icon><Check /></el-icon>
                  </div>
                  <div class="step-content">
                    <div class="step-title">Delivery Schedule Confirm</div>
                    <div class="step-info">
                      <span class="date">Date: Jan 16, 1:00 PM</span>
                      <span class="handler">Handler: Supplier Prod.</span>
                    </div>
                  </div>
                </div>

                <div class="flow-step completed">
                  <div class="step-icon">
                    <el-icon><Check /></el-icon>
                  </div>
                  <div class="step-content">
                    <div class="step-title">Order Confirmation</div>
                    <div class="step-info">
                      <span class="date">Date: Jan 16, 2:15 PM</span>
                      <span class="handler">Handler: Supplier</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contract Review Section -->
            <div class="section-block">
              <div class="section-title">
                <el-icon><Document /></el-icon>
                <h4>Contract Review</h4>
                <el-tag type="success">Completed</el-tag>
                <div class="progress">100%</div>
              </div>
              <div class="section-info">
                      <div class="info-item">
                  <label>Document No:</label>
                  <span>CR-2024-001</span>
                        </div>
                <div class="info-item">
                  <label>Created:</label>
                  <span>Jan 16, 2024</span>
                      </div>
              </div>
            </div>

            <!-- Contract Review Process Flow -->
            <div class="process-flow">
              <h5>Process Flow</h5>
              <div class="flow-steps">
                <div class="flow-step completed">
                  <div class="step-icon">
                    <el-icon><Check /></el-icon>
                  </div>
                  <div class="step-content">
                    <div class="step-title">Terms Review</div>
                    <div class="step-info">
                      <span class="date">Date: Jan 16, 2:30 PM</span>
                      <span class="handler">Handler: Legal Dept</span>
                    </div>
                  </div>
                </div>

                <div class="flow-step completed">
                  <div class="step-icon">
                    <el-icon><Check /></el-icon>
                  </div>
                  <div class="step-content">
                    <div class="step-title">Compliance Check</div>
                    <div class="step-info">
                      <span class="date">Date: Jan 16, 3:00 PM</span>
                      <span class="handler">Handler: Compliance Officer</span>
                    </div>
                  </div>
                </div>

                <div class="flow-step completed">
                  <div class="step-icon">
                    <el-icon><Check /></el-icon>
                  </div>
                  <div class="step-content">
                    <div class="step-title">Final Sign-off</div>
                    <div class="step-info">
                      <span class="date">Date: Jan 16, 3:30 PM</span>
                      <span class="handler">Handler: Procurement Mgr</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- Export & Customs Tab -->
        <el-tab-pane label="Export & Customs" name="export">
          <div class="process-content">
            <div class="section-header">
              <h3>Export & Customs: Export Booking & Clearance</h3>
              <div class="progress-info">
                <span class="percentage">75%</span>
                <span class="status">Overall Progress</span>
                <span class="etc">ETC: Mar 04, 2024</span>
              </div>
            </div>

            <!-- Export Documentation Section -->
            <div class="section-block">
              <div class="section-title">
                <el-icon><Document /></el-icon>
                <h4>Export Documentation</h4>
                <el-tag type="primary">Processing</el-tag>
                <div class="progress">75%</div>
              </div>
              <div class="section-info">
                      <div class="info-item">
                  <label>Document No:</label>
                  <span>EXP-2024-001</span>
                        </div>
                <div class="info-item">
                  <label>Created:</label>
                  <span>Mar 02, 2024</span>
                      </div>
                <div class="info-item">
                  <label>Broker:</label>
                  <span>Shenzhen Logistics Co.</span>
                    </div>
                  </div>
                </div>

            <!-- Export Documentation Process Flow -->
            <div class="process-flow">
              <h5>Process Flow</h5>
              <div class="flow-steps">
                <div class="flow-step completed">
                  <div class="step-icon">
                    <el-icon><Check /></el-icon>
                    </div>
                  <div class="step-content">
                    <div class="step-title">Commercial Invoice</div>
                    <div class="step-info">
                      <div class="doc-number">INV-2024-001</div>
                      <div class="date">Date: Mar 02, 9:30 AM</div>
                      <div class="handler">Handler: Export Clerk</div>
                      <div class="amount">Amount: $18,500.00</div>
                      <div class="remark">Original commercial invoice with company seal</div>
                  </div>
                        </div>
                      </div>

                <div class="flow-step completed">
                  <div class="step-icon">
                    <el-icon><Check /></el-icon>
                    </div>
                  <div class="step-content">
                    <div class="step-title">Packing List</div>
                    <div class="step-info">
                      <div class="doc-number">PL-2024-001</div>
                      <div class="date">Date: Mar 02, 10:15 AM</div>
                      <div class="handler">Handler: Shipping Clerk</div>
                      <div class="packages">Packages: 3 cartons, 18.5kg total</div>
                      <div class="remark">Detailed packing list with item breakdown</div>
                  </div>
                </div>
              </div>

                <div class="flow-step completed">
                  <div class="step-icon">
                    <el-icon><Check /></el-icon>
            </div>
                  <div class="step-content">
                    <div class="step-title">Certificate of Origin</div>
                    <div class="step-info">
                      <div class="doc-number">CO-2024-001</div>
                      <div class="date">Date: Mar 02, 11:00 AM</div>
                      <div class="handler">Handler: Trade Specialist</div>
                      <div class="remark">Form A certificate for preferential tariff</div>
          </div>
        </div>
      </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- Add other stage tabs -->
        <el-tab-pane label="Pre-Production" name="pre-production">
          <!-- Pre-Production content -->
        </el-tab-pane>

        <el-tab-pane label="In Production" name="in-production">
          <!-- In Production content -->
        </el-tab-pane>

        <el-tab-pane label="Post-Production" name="post-production">
          <!-- Post-Production content -->
        </el-tab-pane>

        <el-tab-pane label="International Transit" name="transit">
          <!-- International Transit content -->
        </el-tab-pane>

        <el-tab-pane label="Import & Delivery" name="import">
          <!-- Import & Delivery content -->
        </el-tab-pane>

        <el-tab-pane label="Received (GRN)" name="received">
          <!-- Received content -->
        </el-tab-pane>

        <el-tab-pane label="Invoiced & Payment" name="invoiced">
          <!-- Invoiced & Payment content -->
        </el-tab-pane>

        <el-tab-pane label="Purchase Items" name="items">
          <!-- Purchase Items content -->
        </el-tab-pane>

        <el-tab-pane label="Document Summary" name="documents">
          <!-- Document Summary content -->
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Check,
  Loading,
  Clock,
  Warning,
  ArrowDown,
  Document,
  Plus,
  Download,
  Printer,
  Timer,
  User,
  Van,
  Box,
  Ship,
  Stamp,
  Location,
  TrendCharts,
  Money,
  CircleCheck,
  ArrowLeft,
  View,
  Refresh,
  Tools,
  Setting,
  TakeawayBox,
  Phone,
  Message,
  Wallet,
  InfoFilled,
  House // 替换 Office 为 House
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'

interface Document {
  docType: string;      // 单据类型
  docNumber: string;    // 单据编号
  docDate: string;      // 单据日期
  status: string;       // 单据状态
  handler: string;      // 处理人
  remarks?: string;     // 备注
  attachments?: string[]; // 附件列表
}

interface TransportInfo {
  carrier?: string;     // 承运商
  vessel?: string;      // 船舶号
  voyage?: string;      // 航次号
  containerNo?: string; // 集装箱号
  seal?: string;       // 封条号
  bookingNo?: string;  // 订舱号
  blNo?: string;       // 提单号
  eta?: string;        // 预计到达时间
  etd?: string;        // 预计出发时间
  port?: {
    loading?: string;   // 装货港
    discharge?: string; // 卸货港
  }
}

interface CustomsInfo {
  declarationNo?: string;  // 报关单号
  inspectionNo?: string;   // 报检单号
  customsStatus?: string;  // 海关状态
  clearanceDate?: string;  // 清关日期
  dutyAmount?: string;     // 税费金额
}

interface SubProcess {
  id: number;
  name: string;
  status: 'completed' | 'processing' | 'pending' | 'error';
  startTime?: string;
  endTime?: string;
  duration?: string;
  operator: string;
  progress?: number;
  documents: Document[];
  remarks?: string;
  alerts?: {
    type: 'info' | 'warning' | 'error';
    message: string;
  }[];
  referenceNo?: string;    // 引用单号
  transportInfo?: TransportInfo; // 运输信息
  customsInfo?: CustomsInfo;    // 报关信息
  location?: string;      // 当前位置
  nextAction?: string;    // 下一步操作
  cost?: {               // 费用信息
    amount: number;
    currency: string;
    status: string;
  };
}

interface MainStage {
  id: number;
  name: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  startDate?: string;
  endDate?: string;
  duration?: string;
  expanded: boolean;
  progress: number;
  subprocesses: SubProcess[];
  keyMetrics: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'stable';
  }[];
}

// 示例数据
const poData = ref({
  poNumber: 'PO-2024-001',
  status: {
    type: 'warning',
    text: 'In Production'
  },
  supplier: 'ABC Electronics Ltd.',
  createdAt: '2024-03-15',
  eta: '2024-05-20',
  owner: 'John Smith',
  amount: '125,000.00',
  currency: 'USD',
  paymentTerms: 'Net 60',
  incoterms: 'FOB Shanghai',
  currentStage: {
    type: 'production',
    icon: 'Loading',
    name: 'In Production',
    description: 'Assembly in progress - 65% completed',
    lastUpdate: '2024-03-20 14:30',
    eta: '2024-04-15',
    handler: 'Tom Wilson',
    alerts: [
      {
        type: 'warning',
        message: 'Quality inspection pending for batch #A123'
      }
    ],
    metrics: [
      {
        label: 'Production Progress',
        value: '65%',
        trend: 'up'
      },
      {
        label: 'Quality Pass Rate',
        value: '98.5%',
        trend: 'stable'
      }
    ]
  }
})

const mainStages = ref<MainStage[]>([
  {
    id: 1,
    name: 'PO Created',
    description: 'Purchase Order Creation & Approval',
    status: 'completed',
    startDate: '2024-03-15',
    endDate: '2024-03-15',
    duration: '5h 30m',
    expanded: true,
    progress: 100,
    keyMetrics: [
      {
        label: 'Approval Time',
        value: '2h 15m',
        trend: 'down'
      }
    ],
    subprocesses: [
      {
        id: 101,
        name: 'Draft Created',
        status: 'completed',
        startTime: '2024-03-15 09:00',
        endTime: '2024-03-15 10:30',
        operator: 'John Smith',
        documents: [
          {
            docType: 'PO Draft',
            docNumber: 'DRAFT-2024001',
            docDate: '2024-03-15 09:00',
            status: 'Completed',
            handler: 'John Smith',
            attachments: ['draft_po.pdf']
          }
        ],
        remarks: 'Initial PO draft created with 15 line items'
      },
      {
        id: 102,
        name: 'Item/Qty Completed',
        status: 'completed',
        startTime: '2024-03-15 10:30',
        endTime: '2024-03-15 11:00',
        operator: 'John Smith',
        documents: [
          {
            docType: 'Item List',
            docNumber: 'IL-2024001',
            docDate: '2024-03-15 10:30',
            status: 'Completed',
            handler: 'John Smith',
            attachments: ['item_list.xlsx']
          }
        ]
      },
      {
        id: 103,
        name: 'PO Number Assigned',
        status: 'completed',
        startTime: '2024-03-15 11:00',
        endTime: '2024-03-15 11:30',
        operator: 'System',
        documents: [
          {
            docType: 'PO Number',
            docNumber: 'PO-2024001',
            docDate: '2024-03-15 11:00',
            status: 'Completed',
            handler: 'System',
            attachments: []
          }
        ],
        remarks: 'System automatically assigned PO number'
      },
      {
        id: 104,
        name: 'Submitted for Approval',
        status: 'completed',
        startTime: '2024-03-15 11:30',
        endTime: '2024-03-15 12:00',
        operator: 'John Smith',
        documents: [
          {
            docType: 'Approval Request',
            docNumber: 'AR-2024001',
            docDate: '2024-03-15 11:30',
            status: 'Completed',
            handler: 'John Smith',
            attachments: ['approval_request.pdf']
          }
        ],
        remarks: 'Submitted for final approval'
      },
      {
        id: 105,
        name: 'Approved',
        status: 'completed',
        startTime: '2024-03-15 14:00',
        endTime: '2024-03-15 14:30',
        operator: 'Sarah Chen',
        documents: [
          {
            docType: 'Approval Decision',
            docNumber: 'AD-2024001',
            docDate: '2024-03-15 14:00',
            status: 'Completed',
            handler: 'Sarah Chen',
            attachments: ['approval_decision.pdf']
          }
        ],
        remarks: 'PO approved by purchasing manager'
      }
    ]
  },
  {
    id: 2,
    name: 'PO Confirmed',
    description: 'Supplier Confirmation & Negotiation',
    status: 'completed',
    startDate: '2024-03-16',
    endDate: '2024-03-16',
    duration: '3h 30m',
    expanded: false,
    progress: 100,
    keyMetrics: [
      {
        label: 'Negotiation Time',
        value: '2h 15m',
        trend: 'down'
      }
    ],
    subprocesses: [
      {
        id: 201,
        name: 'PO Sent to Supplier',
        status: 'completed',
        startTime: '2024-03-15 15:00',
        endTime: '2024-03-15 16:00',
        operator: 'System',
        documents: [
          {
            docType: 'PO Shipment',
            docNumber: 'PS-2024001',
            docDate: '2024-03-15 15:00',
            status: 'Completed',
            handler: 'System',
            attachments: ['po_shipment.pdf']
          }
        ],
        remarks: 'System automatically sent PO to supplier'
      },
      {
        id: 202,
        name: 'Supplier Acknowledged',
        status: 'completed',
        startTime: '2024-03-16 09:00',
        endTime: '2024-03-16 09:30',
        operator: 'Supplier',
        documents: [
          {
            docType: 'PO Acknowledgment',
            docNumber: 'PA-2024001',
            docDate: '2024-03-16 09:00',
            status: 'Completed',
            handler: 'Supplier',
            attachments: ['supplier_acknowledgment.pdf']
          }
        ],
        remarks: 'Supplier acknowledged receipt of PO'
      },
      {
        id: 203,
        name: 'Negotiation / Change Request',
        status: 'completed',
        startTime: '2024-03-16 11:00',
        endTime: '2024-03-16 12:00',
        operator: 'Tom Wilson',
        documents: [
          {
            docType: 'Change Request',
            docNumber: 'CR-2024001',
            docDate: '2024-03-16 11:00',
            status: 'Completed',
            handler: 'Tom Wilson',
            attachments: ['change_request.pdf']
          }
        ],
        remarks: 'Price and delivery date negotiation completed'
      },
      {
        id: 204,
        name: 'Confirmed',
        status: 'completed',
        startTime: '2024-03-16 14:00',
        endTime: '2024-03-16 14:30',
        operator: 'Supplier',
        documents: [
          {
            docType: 'Supplier Confirmation',
            docNumber: 'SC-2024001',
            docDate: '2024-03-16 14:00',
            status: 'Completed',
            handler: 'Supplier',
            attachments: ['supplier_confirmation.pdf']
          }
        ],
        remarks: 'Supplier formally confirmed the order'
      },
      {
        id: 205,
        name: 'Delivery Date Locked',
        status: 'completed',
        startTime: '2024-03-16 15:00',
        endTime: '2024-03-16 15:30',
        operator: 'Tom Wilson',
        documents: [
          {
            docType: 'Delivery Date Lock',
            docNumber: 'DDL-2024001',
            docDate: '2024-03-16 15:00',
            status: 'Completed',
            handler: 'Tom Wilson',
            attachments: []
          }
        ],
        remarks: 'Final delivery date confirmed'
      }
    ]
  },
  {
    id: 3,
    name: 'Pre-Production',
    description: 'Factory Preparation',
    status: 'completed',
    startDate: '2024-03-18',
    endDate: '2024-03-18',
    duration: '2h',
    expanded: false,
    progress: 100,
    keyMetrics: [
      {
        label: 'Material Sourcing Time',
        value: '1h 30m',
        trend: 'down'
      }
    ],
    subprocesses: [
      {
        id: 301,
        name: 'Raw Material Sourcing',
        status: 'completed',
        startTime: '2024-03-18 09:00',
        endTime: '2024-03-18 10:30',
        operator: 'Supplier',
        documents: [
          {
            docType: 'Material Order',
            docNumber: 'MO-2024001',
            docDate: '2024-03-18 09:00',
            status: 'Completed',
            handler: 'Supplier',
            attachments: ['material_order.pdf']
          }
        ],
        remarks: 'Raw material sourcing process initiated'
      },
      {
        id: 302,
        name: 'Material ETA Confirmed',
        status: 'completed',
        startTime: '2024-03-18 14:00',
        endTime: '2024-03-18 14:30',
        operator: 'Supplier',
        documents: [
          {
            docType: 'Material ETA',
            docNumber: 'ETA-2024001',
            docDate: '2024-03-18 14:00',
            status: 'Completed',
            handler: 'Supplier',
            attachments: ['material_eta.pdf']
          }
        ],
        remarks: 'Material ETA confirmed by supplier'
      },
      {
        id: 303,
        name: 'Production Scheduled',
        status: 'completed',
        startTime: '2024-03-18 16:00',
        endTime: '2024-03-18 16:30',
        operator: 'Supplier',
        documents: [
          {
            docType: 'Production Schedule',
            docNumber: 'PS-2024001',
            docDate: '2024-03-18 16:00',
            status: 'Completed',
            handler: 'Supplier',
            attachments: ['production_schedule.pdf']
          }
        ],
        remarks: 'Production schedule confirmed by supplier'
      }
    ]
  },
  {
    id: 4,
    name: 'In Production',
    description: 'Actual Production Process',
    status: 'current',
    startDate: '2024-03-20',
    expanded: true,
    progress: 70, // Example progress
    subprocesses: [
      {
        id: 401,
        name: 'Material Ready',
        status: 'completed',
        startTime: '2024-03-20 09:00',
        endTime: '2024-03-20 10:00',
        operator: 'Supplier',
        documents: [
          {
            docType: 'Material Check',
            docNumber: 'MC-2024001',
            docDate: '2024-03-20 09:00',
            status: 'Completed',
            handler: 'Supplier',
            attachments: ['material_check.pdf']
          }
        ],
        remarks: 'All materials ready for production'
      },
      {
        id: 402,
        name: 'Cutting / Preprocessing',
        status: 'completed',
        startTime: '2024-03-20 10:00',
        endTime: '2024-03-20 12:00',
        operator: 'Production Team',
        documents: [
          {
            docType: 'Cutting Report',
            docNumber: 'CR-2024001',
            docDate: '2024-03-20 10:00',
            status: 'Completed',
            handler: 'Production Team',
            attachments: ['cutting_report.pdf']
          }
        ],
        remarks: 'Material pre-processing completed'
      },
      {
        id: 403,
        name: 'Assembly',
        status: 'processing',
        startTime: '2024-03-20 12:00',
        endTime: null, // Still in progress
        operator: 'Production Team',
        documents: [],
        remarks: 'Assembly in progress'
      },
      {
        id: 404,
        name: 'In-Process QA',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'QC Team',
        documents: [],
        remarks: 'In-process quality inspection pending'
      },
      {
        id: 405,
        name: 'Final QA',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'QC Team',
        documents: [],
        remarks: 'Final quality inspection pending'
      }
    ]
  },
  {
    id: 5,
    name: 'Post-Production',
    description: 'Packaging, Inspection, & Shipping',
    status: 'pending',
    expanded: false,
    progress: 0,
    subprocesses: [
      {
        id: 501,
        name: 'Packaging',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Production Team',
        documents: [],
        remarks: 'Packaging pending'
      },
      {
        id: 502,
        name: 'Palletizing',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Warehouse Team',
        documents: [],
        remarks: 'Palletizing pending'
      },
      {
        id: 503,
        name: 'Storage Ready',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Warehouse Team',
        documents: [],
        remarks: 'Storage ready pending'
      },
      {
        id: 504,
        name: 'Shipment Booking Requested',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Logistics Team',
        documents: [],
        remarks: 'Shipment booking requested'
      }
    ]
  },
  {
    id: 6,
    name: 'Export & Customs',
    description: 'Export Booking & Clearance',
    status: 'pending',
    expanded: false,
    progress: 0,
    subprocesses: [
      {
        id: 601,
        name: 'Booking Confirmed',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Logistics Team',
        documents: [],
        remarks: 'Booking confirmed pending'
      },
      {
        id: 602,
        name: 'Docs Prepared',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Documentation Team',
        documents: [],
        remarks: 'Documentation pending'
      },
      {
        id: 603,
        name: 'Customs Declaration Submitted',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Customs Team',
        documents: [],
        remarks: 'Customs declaration pending'
      },
      {
        id: 604,
        name: 'Inspection (if any)',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Customs',
        documents: [],
        remarks: 'Customs inspection pending'
      },
      {
        id: 605,
        name: 'Customs Cleared',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Customs Team',
        documents: [],
        remarks: 'Customs clearance pending'
      },
      {
        id: 606,
        name: 'Loaded on Vessel',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Carrier',
        documents: [],
        remarks: 'Loading on vessel pending'
      }
    ]
  },
  {
    id: 7,
    name: 'International Transit',
    description: 'International Transport',
    status: 'pending',
    expanded: false,
    progress: 0,
    subprocesses: [
      {
        id: 701,
        name: 'Departure Confirmed',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Carrier',
        documents: [],
        remarks: 'Departure confirmed pending'
      },
      {
        id: 702,
        name: 'In Transit',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Carrier',
        documents: [],
        remarks: 'In transit pending'
      },
      {
        id: 703,
        name: 'Arrived at Destination Port',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Carrier',
        documents: [],
        remarks: 'Arrival at destination port pending'
      }
    ]
  },
  {
    id: 8,
    name: 'Import & Delivery',
    description: 'Customs Clearance + Domestic Delivery',
    status: 'pending',
    expanded: false,
    progress: 0,
    subprocesses: [
      {
        id: 801,
        name: 'Import Declaration Submitted',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Customs Team',
        documents: [],
        remarks: 'Import declaration pending'
      },
      {
        id: 802,
        name: 'Duties Paid',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Finance Team',
        documents: [],
        remarks: 'Duties pending'
      },
      {
        id: 803,
        name: 'Customs Cleared',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Customs Team',
        documents: [],
        remarks: 'Customs clearance pending'
      },
      {
        id: 804,
        name: 'Domestic Delivery Arranged',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Logistics Team',
        documents: [],
        remarks: 'Domestic delivery arranged'
      },
      {
        id: 805,
        name: 'Dispatched',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Carrier',
        documents: [],
        remarks: 'Dispatch pending'
      },
      {
        id: 806,
        name: 'Delivered to DC',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Carrier',
        documents: [],
        remarks: 'Delivery to DC pending'
      }
    ]
  },
  {
    id: 9,
    name: 'Received (GRN)',
    description: 'Warehouse Receipt, Inspection, & Exception Handling',
    status: 'pending',
    expanded: false,
    progress: 0,
    subprocesses: [
      {
        id: 901,
        name: 'GRN Created',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Warehouse Team',
        documents: [],
        remarks: 'GRN creation pending'
      },
      {
        id: 902,
        name: 'Quantity Checked',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Warehouse Team',
        documents: [],
        remarks: 'Quantity check pending'
      },
      {
        id: 903,
        name: 'Quality Inspection',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'QC Team',
        documents: [],
        remarks: 'Quality inspection pending'
      },
      {
        id: 904,
        name: 'Exceptions Handled',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Warehouse Team',
        documents: [],
        remarks: 'Exception handling pending'
      },
      {
        id: 905,
        name: 'GRN Closed',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Warehouse Team',
        documents: [],
        remarks: 'GRN closure pending'
      }
    ]
  },
  {
    id: 10,
    name: 'Invoiced & Payment',
    description: 'Invoice Receipt & Settlement',
    status: 'pending',
    expanded: false,
    progress: 0,
    subprocesses: [
      {
        id: 1001,
        name: 'Invoice Received',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Finance Team',
        documents: [],
        remarks: 'Invoice receipt pending'
      },
      {
        id: 1002,
        name: '3-Way Match',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Finance Team',
        documents: [],
        remarks: '3-way match pending'
      },
      {
        id: 1003,
        name: 'Approved for Payment',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Finance Manager',
        documents: [],
        remarks: 'Payment approval pending'
      },
      {
        id: 1004,
        name: 'Payment Scheduled',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Finance Team',
        documents: [],
        remarks: 'Payment scheduling pending'
      },
      {
        id: 1005,
        name: 'Payment Released',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Finance Team',
        documents: [],
        remarks: 'Payment release pending'
      }
    ]
  }
])

// Active tab
const activeTab = ref('created')

// Route
const route = useRoute()

onMounted(() => {
  // Get tracking number from route params
  const trackingNumber = route.params.id
  // TODO: Fetch actual data using tracking number
  console.log('Tracking Number:', trackingNumber)
})

// Helper functions
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTime = (time: string) => {
  return new Date(time).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })
}

const formatDateTime = (datetime: string) => {
  return `${formatDate(datetime)} ${formatTime(datetime)}`
}

const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    completed: 'success',
    processing: 'primary',
    pending: 'info',
    error: 'danger'
  }
  return statusMap[status] || 'info'
}

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    completed: 'Completed',
    processing: 'In Progress',
    pending: 'Pending',
    error: 'Error'
  }
  return statusMap[status] || status
}

// 切换阶段展开/折叠
const toggleStage = (stageId: number) => {
  const stage = mainStages.value.find(s => s.id === stageId)
  if (stage) {
    stage.expanded = !stage.expanded
  }
}

// 处理文件上传
const handleFileChange = (subprocessId: number, file: UploadFile) => {
  // TODO: 实现文件上传逻辑
  ElMessage.success(`File ${file.name} selected, ready to upload`)
}

// 查看附件
const viewAttachments = (attachment: string) => {
  // 实现查看附件的逻辑
  console.log('View attachment:', attachment)
}

// Utility functions
const getProgressLineClass = (currentStatus: string, nextStatus: string) => {
  if (currentStatus === 'completed') {
    return nextStatus === 'completed' ? 'completed' : 'in-progress'
  }
  return 'pending'
}

const getTrendIcon = (trend: string) => {
  const iconMap = {
    up: 'ArrowUp',
    down: 'ArrowDown',
    stable: 'Minus'
  }
  return iconMap[trend as keyof typeof iconMap]
}

const getDocStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    'Completed': 'success',
    'In Progress': 'primary',
    'Pending': 'info',
    'Error': 'danger'
  }
  return statusMap[status] || 'info'
}

const getOperatorAvatar = (operator: string) => {
  // 这里可以实现获取操作员头像的逻辑
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${operator}`
}

const viewProcessDetails = (processId: number) => {
  // 实现查看详情的逻辑
  console.log('View process details:', processId)
}

const viewAttachment = (attachment: string) => {
  // 实现查看附件的逻辑
  console.log('View attachment:', attachment)
}

// Add new state for tracking current subprocess
const currentSubprocessIndex = ref(0)

// Add helper functions
const getCompletedDocsCount = (documents: Document[] = []) => {
  return documents.filter(doc => doc.status === 'Completed').length
}

const formatAlertType = (type: string) => {
  const typeMap: Record<string, string> = {
    'info': 'Information',
    'warning': 'Warning',
    'error': 'Error'
  }
  return typeMap[type] || type
}

// Add helper function for progress status
const getProgressStatus = (status: string) => {
  const statusMap: Record<string, 'success' | 'warning' | 'exception'> = {
    'completed': 'success',
    'processing': 'warning',
    'error': 'exception'
  }
  return statusMap[status]
}
</script>

<style scoped lang="scss">
.purchase-order-tracking-detail {
  padding: 24px;
  background: var(--el-bg-color);
  min-height: 100vh;

  // Header Navigation Styles
  .page-header {
      display: flex;
      justify-content: space-between;
    align-items: center;
      margin-bottom: 24px;
    padding: 16px 0;
    border-bottom: 1px solid var(--el-border-color-lighter);

    .left-section {
        display: flex;
        align-items: center;
        gap: 16px;

      .back-button {
        .el-icon {
          margin-right: 6px;
        }
          }

      .po-number {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            line-height: 1.2;
          }

      .priority-tag {
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 500;
        }

        .status-tag {
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
        }
      }

    .right-section {
        display: flex;
        gap: 12px;

        .el-button {
          .el-icon {
            margin-right: 6px;
          }
        }
      }
    }

  // Status Cards Styles
  .status-cards {
      display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 24px;

    .status-card {
      background: var(--el-bg-color-overlay);
      border-radius: 8px;
      padding: 20px;
      border: 1px solid var(--el-border-color-lighter);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }

      .card-label {
        font-size: 14px;
        color: var(--el-text-color-secondary);
        margin-bottom: 8px;
      }

      .card-value {
        font-size: 28px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .card-metric {
              font-size: 13px;
              color: var(--el-text-color-secondary);
        margin-bottom: 16px;
      }

      .trend-icon, .check-icon, .money-icon, .info-icon {
        font-size: 24px;
        color: var(--el-color-primary);
            }

      &.delivery {
        background: linear-gradient(135deg, rgba(var(--el-color-success-rgb), 0.1), rgba(var(--el-color-success-rgb), 0.05));
        border-color: var(--el-color-success-light-5);
        
        .card-value {
          color: var(--el-color-success);
        }
      }

      &.quality {
        background: linear-gradient(135deg, rgba(var(--el-color-primary-rgb), 0.1), rgba(var(--el-color-primary-rgb), 0.05));
        border-color: var(--el-color-primary-light-5);
        
        .card-value {
          color: var(--el-color-primary);
    }
  }

      &.cost {
        background: linear-gradient(135deg, rgba(var(--el-color-info-rgb), 0.1), rgba(var(--el-color-info-rgb), 0.05));
        border-color: var(--el-color-info-light-5);
      }

      &.risk {
        background: linear-gradient(135deg, rgba(var(--el-color-warning-rgb), 0.1), rgba(var(--el-color-warning-rgb), 0.05));
        border-color: var(--el-color-warning-light-5);
      }
    }
  }

  // Progress Timeline Styles
  .progress-section {
    margin-bottom: 24px;
    padding: 24px;
    background: var(--el-bg-color-overlay);
    border-radius: 8px;
    border: 1px solid var(--el-border-color-lighter);

    h2 {
      font-size: 20px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 16px;
    }

    .timeline {
      display: flex;
      align-items: center;
      gap: 20px;
    position: relative;
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--el-border-color-lighter);

    &::before {
      content: '';
      position: absolute;
      top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 2px;
        height: 100%;
        background: var(--el-border-color-lighter);
      z-index: 1;
    }

      .timeline-item {
        flex: 1;
      display: flex;
      align-items: center;
          position: relative;
        z-index: 2;

        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--el-bg-color);
          border: 2px solid var(--el-border-color);
          z-index: 1;
        }

        &.completed {
          &::before {
            background: var(--el-color-success);
            border-color: var(--el-color-success);
        }
        }

        &.current {
          &::before {
            background: var(--el-color-primary);
            border-color: var(--el-color-primary);
          }
        }

        .icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--el-bg-color);
        display: flex;
          align-items: center;
          justify-content: center;
          color: var(--el-color-primary);
          border: 2px solid var(--el-border-color);
          z-index: 1;
          margin-right: 16px;
        }

        .content {
          display: flex;
          flex-direction: column;
          gap: 4px;

          .title {
            font-size: 15px;
            font-weight: 500;
            color: var(--el-text-color-primary);
          }

          .time {
          font-size: 13px;
            color: var(--el-text-color-secondary);
          }

          .status {
            font-size: 13px;
            color: var(--el-text-color-secondary);
          }
        }
      }
    }
  }

  // Info Cards Styles
  .info-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 20px;
    margin-bottom: 24px;

    .info-card {
      background: var(--el-bg-color);
      border-radius: 8px;
      border: 1px solid var(--el-border-color-lighter);
      padding: 20px;
      display: flex;
      flex-direction: column;

      .card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--el-border-color-lighter);

        .el-icon {
          font-size: 20px;
          color: var(--el-color-primary);
        }

        h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--el-text-color-primary);
      }
    }

      .card-content {
        .info-group {
        display: flex;
        justify-content: space-between;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--el-border-color-lighter);

          .info-item {
          display: flex;
          align-items: center;
            gap: 12px;
            font-size: 14px;
            color: var(--el-text-color-regular);

          .label {
            font-size: 13px;
              color: var(--el-text-color-secondary);
            }

            .value {
              font-size: 14px;
              font-weight: 500;
              color: var(--el-text-color-primary);
            }
          }
        }

        .contact-info {
      display: flex;
      flex-direction: column;
          gap: 8px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--el-border-color-lighter);

          .contact-item {
        display: flex;
        align-items: center;
        gap: 12px;
            font-size: 14px;
            color: var(--el-text-color-regular);

            .el-icon {
              font-size: 16px;
            }
          }
        }

        .payment-info {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--el-border-color-lighter);

          .info-item {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: var(--el-text-color-regular);

            .label {
              font-size: 13px;
            color: var(--el-text-color-secondary);
          }

            .amount {
              font-size: 14px;
              font-weight: 500;
              color: var(--el-text-color-primary);
        }
          }
        }
      }
        }
      }

  // Process Tabs Styles
  .process-tabs {
    .el-tabs__header {
      margin-bottom: 24px;
        }

    .el-tabs__content {
      padding: 0 20px;
        }

    .process-content {
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--el-border-color-lighter);

        h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .progress-info {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: var(--el-text-color-secondary);

          .percentage {
            font-size: 18px;
              font-weight: 600;
            color: var(--el-color-primary);
          }

          .etc {
            font-size: 14px;
            }
          }
        }

      .requisition-section {
        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--el-border-color-lighter);

              .el-icon {
            font-size: 20px;
                color: var(--el-color-primary);
          }

          h4 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: var(--el-text-color-primary);
          }

          .el-tag {
            font-size: 12px;
        }

          .progress {
            font-size: 14px;
            color: var(--el-text-color-secondary);
          }
        }

        .requisition-info {
          .info-item {
          display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: var(--el-text-color-regular);

            .label {
              font-size: 13px;
              color: var(--el-text-color-secondary);
              }

            .value {
              font-size: 14px;
              font-weight: 500;
              color: var(--el-text-color-primary);
            }
          }
        }
      }

      .process-flow {
        h5 {
          font-size: 16px;
          font-weight: 600;
          color: var(--el-text-color-primary);
          margin-bottom: 12px;
            }

        .flow-steps {
              display: flex;
              flex-direction: column;
          gap: 12px;

          .flow-step {
            display: flex;
              align-items: center;
              gap: 12px;

            .step-icon {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: var(--el-bg-color);
                display: flex;
                align-items: center;
                justify-content: center;
              color: var(--el-color-primary);
              border: 2px solid var(--el-border-color);
              z-index: 1;
                }

            .step-content {
              flex: 1;
                  display: flex;
              flex-direction: column;
                    gap: 4px;

              .step-title {
                      font-size: 14px;
                font-weight: 500;
                color: var(--el-text-color-primary);
                }

              .step-info {
                  display: flex;
                justify-content: space-between;
                  font-size: 12px;
                  color: var(--el-text-color-secondary);

                .date {
                  font-size: 12px;
                  }

                .handler {
                    font-size: 12px;
                }
              }
            }

            &.completed {
              .step-icon {
                background: var(--el-color-success);
                border-color: var(--el-color-success);
                color: white;
              }

              .step-title {
                color: var(--el-color-success);
              }
            }

            &.current {
              .step-icon {
                background: var(--el-color-primary);
                border-color: var(--el-color-primary);
                color: white;
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.2);
              }

              .step-title {
                color: var(--el-color-primary);
              }
            }
          }
        }
              }
            }
          }
        }

// Add these new styles
.section-block {
  background: var(--el-bg-color-overlay);
              border-radius: 8px;
              border: 1px solid var(--el-border-color-lighter);
  padding: 20px;
  margin-bottom: 24px;

  .section-title {
                display: flex;
                align-items: center;
    gap: 12px;
                margin-bottom: 16px;
                padding-bottom: 12px;
                border-bottom: 1px solid var(--el-border-color-lighter);

    h4 {
      margin: 0;
      font-size: 16px;
                  font-weight: 600;
                  color: var(--el-text-color-primary);
      flex: 1;
              }

    .el-tag {
      margin-right: 12px;
    }

    .progress {
      font-size: 14px;
                      color: var(--el-text-color-secondary);
    }
  }

  .section-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;

    .info-item {
                    display: flex;
      justify-content: space-between;
      font-size: 14px;
      
      label {
        color: var(--el-text-color-secondary);
                    }

      span {
                        color: var(--el-text-color-primary);
        font-weight: 500;
                    }
                  }
                }
              }

.flow-steps {
  .flow-step {
    .step-info {
      .doc-number {
        color: var(--el-color-primary);
        font-weight: 500;
        margin-bottom: 4px;
      }

      .date, .handler, .amount, .packages, .remark {
        font-size: 12px;
                  color: var(--el-text-color-secondary);
        margin-bottom: 2px;
      }
    }
  }
}

// Responsive Design
@media (max-width: 1200px) {
  .purchase-order-tracking-detail {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      }

    .status-cards {
      grid-template-columns: 1fr;
    }

    .progress-section .timeline {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;

      &::before {
        left: 0;
        transform: none;
        width: 100%;
        height: 2px;
        }

        .timeline-item {
        width: 100%;
        &::before {
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }

    .info-cards {
      grid-template-columns: 1fr;
    }

    .process-tabs .el-tabs__header {
      margin-bottom: 16px;
    }

    .process-tabs .el-tabs__content {
      padding: 0 10px;
    }
  }
}

@media (max-width: 768px) {
  .purchase-order-tracking-detail {
    padding: 16px;

    .page-header {
      padding: 16px;
      .left-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
      .right-section {
          width: 100%;
        flex-direction: column;
        gap: 12px;
      }
    }

    .status-cards {
      padding: 16px;
    }

    .progress-section {
      padding: 16px;
    }

    .info-cards {
          padding: 16px;
        }

    .process-tabs .el-tabs__header {
      margin-bottom: 12px;
    }

    .process-tabs .el-tabs__content {
      padding: 0 8px;
    }
  }
}
</style> 