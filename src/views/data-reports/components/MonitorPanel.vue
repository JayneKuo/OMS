<!-- 实时监控面板组件 -->
<template>
  <div class="monitor-panel">
    <!-- 顶部四个监控卡片 -->
    <el-row :gutter="24" class="monitor-cards">
      <!-- 销量监控卡片 -->
      <el-col :span="6">
        <div class="monitor-card">
          <div class="card-header">
            <div class="title-wrapper">
              <span class="title">实时销量</span>
              <el-tooltip
                effect="dark"
                placement="right"
                popper-class="custom-tooltip"
                :show-after="100"
                :content="statisticsRules.sales">
                <el-icon class="help-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
            <el-tooltip
              effect="dark"
              placement="top"
              popper-class="custom-tooltip"
              :show-after="100"
              :content="`昨日同期：${formatNumber(compareData.sales.yesterday)}
较昨日${getTrendText(props.data.sales, compareData.sales.yesterday).text}`">
              <el-tag 
                size="small" 
                :type="getTrendText(props.data.sales, compareData.sales.yesterday).type"
                class="trend-tag">
                {{ getTrendText(props.data.sales, compareData.sales.yesterday).text }}
              </el-tag>
            </el-tooltip>
          </div>
          <div class="main-value">{{ formatNumber(props.data.sales) }}</div>
          <div class="compare-row">
            <div class="compare-item">
              <el-tooltip
                effect="dark"
                placement="right"
                popper-class="custom-tooltip"
                :show-after="100"
                :content="getCompareTooltip(
                  'yearOnYear',
                  props.data.sales,
                  compareData.sales.lastYear,
                  props.data.salesYearOnYear
                )">
                <span class="label cursor-help">同比</span>
              </el-tooltip>
              <span class="value" :class="getValueClass(props.data.salesYearOnYear)">
                {{ formatChange(props.data.salesYearOnYear) }}
              </span>
            </div>
            <div class="compare-item">
              <el-tooltip
                effect="dark"
                placement="right"
                popper-class="custom-tooltip"
                :show-after="100"
                :content="getCompareTooltip(
                  'monthOnMonth',
                  props.data.sales,
                  compareData.sales.lastMonth,
                  props.data.salesMonthOnMonth
                )">
                <span class="label cursor-help">环比</span>
              </el-tooltip>
              <span class="value" :class="getValueClass(props.data.salesMonthOnMonth)">
                {{ formatChange(props.data.salesMonthOnMonth) }}
              </span>
            </div>
          </div>
          
          <!-- 渠道分布 -->
          <div class="channel-distribution">
            <div class="channel-list">
              <div v-for="channel in channelData" :key="channel.name" class="channel-item">
                <div class="channel-info">
                  <span class="channel-name">{{ channel.name }}</span>
                  <div class="value-info">
                    <span class="channel-value">{{ formatNumber(channel.sales) }}</span>
                    <span class="trend-value" :class="getValueClass(channel.yearOnYear)">
                      {{ formatChange(channel.yearOnYear) }}
                    </span>
                  </div>
                </div>
                <el-progress 
                  :percentage="(channel.sales / props.data.sales * 100).toFixed(1)"
                  :color="channel.color"
                  :format="formatPercentage"
                  :stroke-width="4" />
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 流量监控卡片 -->
      <el-col :span="6">
        <div class="monitor-card">
          <div class="card-header">
            <div class="title-wrapper">
              <span class="title">实时流量</span>
              <el-tooltip
                effect="dark"
                placement="top"
                :content="statisticsRules.traffic"
                class="help-tooltip">
                <el-icon class="help-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
            <el-tooltip
              effect="dark"
              placement="top"
              :content="`昨日同期：${formatNumber(compareData.traffic.yesterday)}
较昨日${getTrendText(props.data.traffic, compareData.traffic.yesterday).text}`">
              <el-tag 
                size="small" 
                :type="getTrendText(props.data.traffic, compareData.traffic.yesterday).type"
                class="trend-tag">
                {{ getTrendText(props.data.traffic, compareData.traffic.yesterday).text }}
              </el-tag>
            </el-tooltip>
          </div>
          <div class="main-value">{{ formatNumber(props.data.traffic) }}</div>
          <div class="compare-row">
            <div class="compare-item">
              <el-tooltip
                effect="dark"
                placement="right"
                popper-class="custom-tooltip"
                :show-after="100"
                :content="getCompareTooltip(
                  'yearOnYear',
                  props.data.traffic,
                  compareData.traffic.lastYear,
                  props.data.trafficYearOnYear
                )">
                <span class="label cursor-help">同比</span>
              </el-tooltip>
              <span class="value" :class="getValueClass(props.data.trafficYearOnYear)">
                {{ formatChange(props.data.trafficYearOnYear) }}
              </span>
            </div>
            <div class="compare-item">
              <el-tooltip
                effect="dark"
                placement="right"
                popper-class="custom-tooltip"
                :show-after="100"
                :content="getCompareTooltip(
                  'monthOnMonth',
                  props.data.traffic,
                  compareData.traffic.lastMonth,
                  props.data.trafficMonthOnMonth
                )">
                <span class="label cursor-help">环比</span>
              </el-tooltip>
              <span class="value" :class="getValueClass(props.data.trafficMonthOnMonth)">
                {{ formatChange(props.data.trafficMonthOnMonth) }}
              </span>
            </div>
          </div>

          <!-- 渠道分布 -->
          <div class="channel-distribution">
            <div class="channel-list">
              <div v-for="channel in channelData" :key="channel.name" class="channel-item">
                <div class="channel-info">
                  <span class="channel-name">{{ channel.name }}</span>
                  <div class="value-info">
                    <span class="channel-value">{{ formatNumber(channel.traffic) }}</span>
                    <span class="trend-value" :class="getValueClass(channel.trafficTrend)">
                      {{ formatChange(channel.trafficTrend) }}
                    </span>
                  </div>
                </div>
                <el-progress 
                  :percentage="(channel.traffic / props.data.traffic * 100).toFixed(1)"
                  :color="channel.color"
                  :format="formatPercentage"
                  :stroke-width="4" />
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 退款监控卡片 -->
      <el-col :span="6">
        <div class="monitor-card">
          <div class="card-header">
            <div class="title-wrapper">
              <span class="title">实时退款</span>
              <el-tooltip
                effect="dark"
                placement="top"
                :content="statisticsRules.refund"
                class="help-tooltip">
                <el-icon class="help-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
            <el-tooltip
              effect="dark"
              placement="top"
              :content="`昨日同期：${formatNumber(compareData.refund.yesterday)}
较昨日${getTrendText(props.data.refundAmount, compareData.refund.yesterday).text}`">
              <el-tag 
                size="small" 
                :type="getTrendText(props.data.refundAmount, compareData.refund.yesterday).type"
                class="trend-tag">
                {{ getTrendText(props.data.refundAmount, compareData.refund.yesterday).text }}
              </el-tag>
            </el-tooltip>
          </div>
          <div class="main-value">¥{{ formatNumber(props.data.refundAmount) }}</div>
          <div class="compare-row">
            <div class="compare-item">
              <el-tooltip
                effect="dark"
                placement="right"
                popper-class="custom-tooltip"
                :show-after="100"
                :content="getCompareTooltip(
                  'yearOnYear',
                  props.data.refundAmount,
                  compareData.refund.lastYear,
                  props.data.refundYearOnYear
                )">
                <span class="label cursor-help">同比</span>
              </el-tooltip>
              <span class="value" :class="getValueClass(-props.data.refundYearOnYear)">
                {{ formatChange(props.data.refundYearOnYear) }}
              </span>
            </div>
            <div class="compare-item">
              <el-tooltip
                effect="dark"
                placement="right"
                popper-class="custom-tooltip"
                :show-after="100"
                :content="getCompareTooltip(
                  'monthOnMonth',
                  props.data.refundAmount,
                  compareData.refund.lastMonth,
                  props.data.refundMonthOnMonth
                )">
                <span class="label cursor-help">环比</span>
              </el-tooltip>
              <span class="value" :class="getValueClass(-props.data.refundMonthOnMonth)">
                {{ formatChange(props.data.refundMonthOnMonth) }}
              </span>
            </div>
          </div>

          <!-- 渠道分布 -->
          <div class="channel-distribution">
            <div class="channel-list">
              <div v-for="channel in channelData" :key="channel.name" class="channel-item">
                <div class="channel-info">
                  <span class="channel-name">{{ channel.name }}</span>
                  <div class="value-info">
                    <span class="refund-amount">¥{{ formatNumber(channel.refundAmount) }}</span>
                    <span class="refund-rate">({{ (channel.refundAmount / (channel.sales * 100)).toFixed(1) }}%)</span>
                  </div>
                </div>
                <el-progress 
                  :percentage="(channel.refundAmount / props.data.refundAmount * 100).toFixed(1)"
                  :color="channel.color"
                  :format="formatPercentage"
                  :stroke-width="4" />
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 转化率监控卡片 -->
      <el-col :span="6">
        <div class="monitor-card">
          <div class="card-header">
            <div class="title-wrapper">
              <span class="title">实时转化率</span>
              <el-tooltip
                effect="dark"
                placement="top"
                :content="statisticsRules.conversion"
                class="help-tooltip">
                <el-icon class="help-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
            <el-tooltip
              effect="dark"
              placement="top"
              :content="`昨日同期：${formatNumber(compareData.conversion.yesterday)}%
较昨日${getTrendText(props.data.conversionRate, compareData.conversion.yesterday).text}`">
              <el-tag 
                size="small" 
                :type="getTrendText(props.data.conversionRate, compareData.conversion.yesterday).type"
                class="trend-tag">
                {{ getTrendText(props.data.conversionRate, compareData.conversion.yesterday).text }}
              </el-tag>
            </el-tooltip>
          </div>
          <div class="main-value">{{ props.data.conversionRate }}%</div>
          <div class="compare-row">
            <div class="compare-item">
              <el-tooltip
                effect="dark"
                placement="right"
                popper-class="custom-tooltip"
                :show-after="100"
                :content="getCompareTooltip(
                  'yearOnYear',
                  props.data.conversionRate,
                  compareData.conversion.lastYear,
                  props.data.conversionYearOnYear
                )">
                <span class="label cursor-help">同比</span>
              </el-tooltip>
              <span class="value" :class="getValueClass(props.data.conversionYearOnYear)">
                {{ formatChange(props.data.conversionYearOnYear) }}
              </span>
            </div>
            <div class="compare-item">
              <el-tooltip
                effect="dark"
                placement="right"
                popper-class="custom-tooltip"
                :show-after="100"
                :content="getCompareTooltip(
                  'monthOnMonth',
                  props.data.conversionRate,
                  compareData.conversion.lastMonth,
                  props.data.conversionMonthOnMonth
                )">
                <span class="label cursor-help">环比</span>
              </el-tooltip>
              <span class="value" :class="getValueClass(props.data.conversionMonthOnMonth)">
                {{ formatChange(props.data.conversionMonthOnMonth) }}
              </span>
            </div>
          </div>

          <!-- 渠道分布 -->
          <div class="channel-distribution">
            <div class="channel-list">
              <div v-for="channel in channelData" :key="channel.name" class="channel-item">
                <div class="channel-info">
                  <span class="channel-name">{{ channel.name }}</span>
                  <div class="value-info">
                    <span class="channel-value">{{ channel.orderRate }}%</span>
                    <span class="trend-value" :class="getValueClass(channel.orderRateTrend)">
                      {{ formatChange(channel.orderRateTrend) }}
                    </span>
                  </div>
                </div>
                <div class="conversion-steps">
                  <div class="step">
                    <span class="step-label">访客数</span>
                    <span class="step-value">{{ formatNumber(channel.traffic) }}</span>
                  </div>
                  <div class="step">
                    <span class="step-label">加购率</span>
                    <span class="step-value">{{ channel.cartRate }}%</span>
                  </div>
                  <div class="step">
                    <span class="step-label">下单率</span>
                    <span class="step-value">{{ channel.orderRate }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 渠道销售趋势图 -->
    <div class="trend-section">
      <div class="section-header">
        <h3>渠道销售趋势</h3>
        <div class="header-actions">
          <el-select v-model="trendTimeRange" size="small" placeholder="时间范围">
            <el-option label="按小时" value="hour" />
            <el-option label="按天" value="day" />
          </el-select>
          <el-select v-model="selectedChannels" size="small" multiple placeholder="选择渠道" collapse-tags>
            <el-option v-for="channel in channels" :key="channel.value" :label="channel.label" :value="channel.value" />
          </el-select>
          <el-select v-model="selectedWarehouses" size="small" multiple placeholder="选择仓库" collapse-tags>
            <el-option v-for="warehouse in warehouses" :key="warehouse.value" :label="warehouse.label" :value="warehouse.value" />
          </el-select>
          <el-radio-group v-model="trendMetric" size="small">
            <el-radio-button label="amount">销售额</el-radio-button>
            <el-radio-button label="orders">订单数</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="chart-container" ref="trendChartRef"></div>
    </div>

    <!-- 渠道GMV占比图 -->
    <div class="gmv-section">
      <div class="section-header">
        <h3>渠道GMV占比</h3>
        <div class="header-actions">
          <el-select v-model="gmvTimeRange" size="small" placeholder="时间范围">
            <el-option label="今天" value="today" />
            <el-option label="近7天" value="7d" />
            <el-option label="近30天" value="30d" />
          </el-select>
          <el-select v-model="selectedGmvWarehouses" size="small" multiple placeholder="选择仓库" collapse-tags>
            <el-option v-for="warehouse in warehouses" :key="warehouse.value" :label="warehouse.label" :value="warehouse.value" />
          </el-select>
          <el-radio-group v-model="gmvChartType" size="small">
            <el-radio-button label="pie">饼图</el-radio-button>
            <el-radio-button label="bar">条形图</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="chart-container" ref="gmvChartRef"></div>
    </div>

    <!-- 转化漏斗图 -->
    <div class="funnel-section">
      <div class="section-header">
        <h3>转化漏斗分析</h3>
        <div class="header-actions">
          <el-select v-model="selectedFunnelChannel" size="small" placeholder="选择渠道">
            <el-option label="全部渠道" value="all" />
            <el-option v-for="channel in channels" :key="channel.value" :label="channel.label" :value="channel.value" />
          </el-select>
          <el-select v-model="selectedFunnelWarehouse" size="small" placeholder="选择仓库">
            <el-option label="全部仓库" value="all" />
            <el-option v-for="warehouse in warehouses" :key="warehouse.value" :label="warehouse.label" :value="warehouse.value" />
          </el-select>
          <el-button size="small" type="primary" @click="showLossAnalysis">
            流失分析
          </el-button>
        </div>
      </div>
      <div class="chart-container" ref="funnelChartRef"></div>
    </div>

    <!-- 流失分析弹窗 -->
    <el-dialog
      v-model="lossAnalysisVisible"
      title="流失分析详情"
      width="60%"
      class="loss-analysis-dialog"
      :close-on-click-modal="false">
      <div class="loss-analysis-content">
        <div class="loss-step" v-for="(step, index) in lossAnalysisData" :key="index">
          <h4>{{ step.name }}</h4>
          <div class="loss-reasons">
            <div class="reason-item" v-for="(reason, idx) in step.reasons" :key="idx">
              <span class="reason-name">{{ reason.name }}</span>
              <el-progress 
                :percentage="reason.percentage" 
                :color="reason.color"
                :format="(p) => `${p}% (${formatNumber(reason.count)}人)`" />
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 用户画像概览 -->
    <div class="profile-section">
      <div class="section-header">
        <h3>用户画像概览</h3>
        <div class="header-actions">
          <el-select v-model="selectedProfileChannel" size="small" placeholder="选择渠道">
            <el-option label="全部渠道" value="all" />
            <el-option v-for="channel in channels" :key="channel.value" :label="channel.label" :value="channel.value" />
          </el-select>
          <el-radio-group v-model="profileMetric" size="small">
            <el-radio-button label="age">年龄分布</el-radio-button>
            <el-radio-button label="gender">性别分布</el-radio-button>
            <el-radio-button label="region">地域分布</el-radio-button>
            <el-radio-button label="device">设备分布</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="profile-charts">
        <div class="chart-container" ref="profileChartRef"></div>
        <div class="profile-summary">
          <div class="summary-item" v-for="(item, index) in profileSummary" :key="index">
            <div class="summary-label">{{ item.label }}</div>
            <div class="summary-value">{{ item.value }}</div>
            <div class="summary-trend" :class="getValueClass(item.trend)">
              {{ formatChange(item.trend) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 库存预警总览 -->
    <div class="inventory-alert-section">
      <div class="section-header">
        <h3>库存预警总览</h3>
        <div class="header-actions">
          <el-select v-model="selectedAlertChannel" size="small" placeholder="选择渠道">
            <el-option label="全部渠道" value="all" />
            <el-option v-for="channel in channels" :key="channel.value" :label="channel.label" :value="channel.value" />
          </el-select>
          <el-select v-model="selectedAlertWarehouse" size="small" placeholder="选择仓库">
            <el-option label="全部仓库" value="all" />
            <el-option v-for="warehouse in warehouses" :key="warehouse.value" :label="warehouse.label" :value="warehouse.value" />
          </el-select>
        </div>
      </div>
      <div class="alert-cards">
        <div class="alert-card" v-for="(alert, index) in alertData" :key="index" @click="showAlertDetail(alert.type)">
          <div class="alert-header">
            <span class="alert-title">{{ alert.title }}</span>
            <el-tag :type="alert.trend >= 0 ? 'danger' : 'success'" size="small">
              {{ formatChange(alert.trend) }}
            </el-tag>
          </div>
          <div class="alert-value">{{ alert.value }}</div>
          <div class="alert-info">
            <span class="alert-label">占比</span>
            <span class="alert-percentage">{{ alert.percentage }}%</span>
          </div>
          <div class="alert-chart" :ref="el => alertChartRefs[index] = el"></div>
        </div>
      </div>
    </div>

    <!-- 预警详情弹窗 -->
    <el-dialog
      v-model="alertDetailVisible"
      :title="selectedAlertType ? alertTypeMap[selectedAlertType].title : ''"
      width="80%"
      class="alert-detail-dialog"
      :close-on-click-modal="false">
      <div class="alert-detail-content">
        <el-table
          :data="alertDetailData"
          style="width: 100%"
          height="500"
          border>
          <el-table-column prop="sku" label="SKU编码" width="120" />
          <el-table-column prop="name" label="商品名称" min-width="200" show-overflow-tooltip />
          <el-table-column prop="stock" label="当前库存" width="100" align="right">
            <template #default="{ row }">
              {{ formatNumber(row.stock) }}
            </template>
          </el-table-column>
          <el-table-column prop="dailySales" label="日均销量" width="100" align="right">
            <template #default="{ row }">
              {{ formatNumber(row.dailySales) }}
            </template>
          </el-table-column>
          <el-table-column prop="daysToSoldOut" label="预计售罄天数" width="120" align="right">
            <template #default="{ row }">
              {{ row.daysToSoldOut }}天
            </template>
          </el-table-column>
          <el-table-column prop="expiryDays" label="保质期剩余天数" width="120" align="right">
            <template #default="{ row }">
              {{ row.expiryDays }}天
            </template>
          </el-table-column>
          <el-table-column prop="channel" label="所属渠道" width="100" />
          <el-table-column prop="warehouse" label="所属仓库" width="100" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="small" type="primary" @click="handleReplenishment(row)">补货</el-button>
              <el-button size="small" type="warning" @click="handlePromotion(row)">促销</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 销售渠道分析 -->
    <div class="channel-analysis-section">
      <div class="section-header">
        <h3>销售渠道分析</h3>
        <div class="header-actions">
          <el-radio-group v-model="channelTimeRange" size="small">
            <el-radio-button label="today">今日</el-radio-button>
            <el-radio-button label="week">近7天</el-radio-button>
            <el-radio-button label="month">近30天</el-radio-button>
          </el-radio-group>
          <el-select v-model="selectedChannelMetric" size="small" style="margin-left: 16px;">
            <el-option label="销售额" value="sales" />
            <el-option label="订单量" value="orders" />
            <el-option label="客单价" value="avgOrder" />
            <el-option label="新客占比" value="newCustomer" />
          </el-select>
        </div>
      </div>
      <div class="channel-analysis-content">
        <div class="channel-map" ref="channelMapRef"></div>
        <div class="channel-ranking">
          <div class="ranking-header">
            <span>渠道排名</span>
            <el-tooltip content="点击渠道名称可在地图中高亮显示" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
          <div class="ranking-list">
            <div 
              v-for="(channel, index) in channelRanking" 
              :key="channel.name"
              class="ranking-item"
              @mouseenter="highlightChannel(channel.name)"
              @mouseleave="clearHighlight()">
              <div class="ranking-info">
                <span class="ranking-number">{{ index + 1 }}</span>
                <span class="channel-name">{{ channel.name }}</span>
              </div>
              <div class="ranking-data">
                <span class="value">{{ formatNumber(channel.value) }}</span>
                <span class="trend" :class="channel.trend >= 0 ? 'up' : 'down'">
                  {{ formatChange(channel.trend) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="channel-metrics">
        <div class="metric-card" v-for="metric in channelMetrics" :key="metric.label">
          <div class="metric-header">
            <span class="metric-label">{{ metric.label }}</span>
            <el-tag size="small" :type="metric.status">{{ metric.tag }}</el-tag>
          </div>
          <div class="metric-value">{{ metric.value }}</div>
          <div class="metric-chart" ref="metricChartRefs"></div>
        </div>
      </div>
    </div>

    <!-- 商品分析 -->
    <div class="product-analysis-section">
      <div class="section-header">
        <h3>商品分析</h3>
        <div class="header-actions">
          <el-radio-group v-model="productTimeRange" size="small">
            <el-radio-button label="today">今日</el-radio-button>
            <el-radio-button label="week">近7天</el-radio-button>
            <el-radio-button label="month">近30天</el-radio-button>
          </el-radio-group>
          <el-select v-model="selectedProductCategory" size="small" style="margin-left: 16px;">
            <el-option label="全部品类" value="all" />
            <el-option v-for="category in productCategories" :key="category.value" :label="category.label" :value="category.value" />
          </el-select>
        </div>
      </div>
      <div class="product-analysis-content">
        <div class="product-metrics">
          <div class="metric-group">
            <div class="metric-title">商品概况</div>
            <div class="metric-cards">
              <div class="metric-card" v-for="metric in productOverview" :key="metric.label">
                <div class="metric-label">{{ metric.label }}</div>
                <div class="metric-value">{{ metric.value }}</div>
                <div class="metric-trend" :class="metric.trend >= 0 ? 'up' : 'down'">
                  {{ formatChange(metric.trend) }}
                </div>
              </div>
            </div>
          </div>
          <div class="metric-group">
            <div class="metric-title">商品效率</div>
            <div class="metric-cards">
              <div class="metric-card" v-for="metric in productEfficiency" :key="metric.label">
                <div class="metric-label">{{ metric.label }}</div>
                <div class="metric-value">{{ metric.value }}</div>
                <div class="metric-trend" :class="metric.trend >= 0 ? 'up' : 'down'">
                  {{ formatChange(metric.trend) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="product-distribution">
          <div class="distribution-header">
            <span>商品分布</span>
            <el-radio-group v-model="distributionType" size="small">
              <el-radio-button label="category">品类</el-radio-button>
              <el-radio-button label="price">价格带</el-radio-button>
              <el-radio-button label="lifecycle">生命周期</el-radio-button>
            </el-radio-group>
          </div>
          <div class="distribution-chart" ref="distributionChartRef"></div>
        </div>
      </div>
      <div class="product-table">
        <div class="table-header">
          <span>商品明细</span>
          <el-input
            v-model="productSearchKeyword"
            placeholder="搜索商品名称/编码"
            prefix-icon="Search"
            size="small"
            style="width: 200px;"
          />
        </div>
        <el-table
          :data="productList"
          style="width: 100%"
          height="300"
          border>
          <el-table-column prop="code" label="商品编码" width="120" />
          <el-table-column prop="name" label="商品名称" min-width="200" show-overflow-tooltip />
          <el-table-column prop="category" label="品类" width="100" />
          <el-table-column prop="price" label="售价" width="100" align="right">
            <template #default="{ row }">
              ¥{{ formatNumber(row.price, 2) }}
            </template>
          </el-table-column>
          <el-table-column prop="sales" label="销量" width="100" align="right">
            <template #default="{ row }">
              {{ formatNumber(row.sales) }}
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="销售额" width="120" align="right">
            <template #default="{ row }">
              ¥{{ formatNumber(row.amount) }}
            </template>
          </el-table-column>
          <el-table-column prop="profit" label="毛利率" width="100" align="right">
            <template #default="{ row }">
              {{ row.profit }}%
            </template>
          </el-table-column>
          <el-table-column prop="conversion" label="转化率" width="100" align="right">
            <template #default="{ row }">
              {{ row.conversion }}%
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 营销活动分析 -->
    <div class="marketing-analysis-section">
      <div class="section-header">
        <h3>营销活动分析</h3>
        <div class="header-actions">
          <el-radio-group v-model="marketingTimeRange" size="small">
            <el-radio-button label="today">今日</el-radio-button>
            <el-radio-button label="week">近7天</el-radio-button>
            <el-radio-button label="month">近30天</el-radio-button>
          </el-radio-group>
          <el-select v-model="selectedMarketingType" size="small" style="margin-left: 16px;">
            <el-option label="全部活动" value="all" />
            <el-option v-for="type in marketingTypes" :key="type.value" :label="type.label" :value="type.value" />
          </el-select>
        </div>
      </div>
      <div class="marketing-analysis-content">
        <div class="marketing-overview">
          <div class="overview-header">
            <span>活动概览</span>
            <el-tooltip content="点击活动名称可查看详情" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
          <div class="overview-cards">
            <div class="overview-card" v-for="metric in marketingOverview" :key="metric.label">
              <div class="metric-label">{{ metric.label }}</div>
              <div class="metric-value">{{ metric.value }}</div>
              <div class="metric-trend" :class="metric.trend >= 0 ? 'up' : 'down'">
                {{ formatChange(metric.trend) }}
              </div>
            </div>
          </div>
        </div>
        <div class="marketing-performance">
          <div class="performance-header">
            <span>活动效果</span>
            <el-radio-group v-model="performanceMetric" size="small">
              <el-radio-button label="gmv">GMV</el-radio-button>
              <el-radio-button label="roi">ROI</el-radio-button>
              <el-radio-button label="conversion">转化率</el-radio-button>
            </el-radio-group>
          </div>
          <div class="performance-chart" ref="performanceChartRef"></div>
        </div>
      </div>
      <div class="marketing-table">
        <div class="table-header">
          <span>活动明细</span>
          <el-input
            v-model="marketingSearchKeyword"
            placeholder="搜索活动名称"
            prefix-icon="Search"
            size="small"
            style="width: 200px;"
          />
        </div>
        <el-table
          :data="marketingList"
          style="width: 100%"
          height="300"
          border>
          <el-table-column prop="name" label="活动名称" min-width="200" show-overflow-tooltip />
          <el-table-column prop="type" label="活动类型" width="100">
            <template #default="{ row }">
              <el-tag :type="getActivityType(row.type)">{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getActivityStatus(row.status)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间" width="160" />
          <el-table-column prop="endTime" label="结束时间" width="160" />
          <el-table-column prop="budget" label="预算" width="120" align="right">
            <template #default="{ row }">
              ¥{{ formatNumber(row.budget) }}
            </template>
          </el-table-column>
          <el-table-column prop="cost" label="消耗" width="120" align="right">
            <template #default="{ row }">
              ¥{{ formatNumber(row.cost) }}
            </template>
          </el-table-column>
          <el-table-column prop="gmv" label="GMV" width="120" align="right">
            <template #default="{ row }">
              ¥{{ formatNumber(row.gmv) }}
            </template>
          </el-table-column>
          <el-table-column prop="roi" label="ROI" width="100" align="right">
            <template #default="{ row }">
              {{ row.roi }}
            </template>
          </el-table-column>
          <el-table-column prop="conversion" label="转化率" width="100" align="right">
            <template #default="{ row }">
              {{ row.conversion }}%
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, ComputedRef, onMounted, watch, onUnmounted } from 'vue'
import { QuestionFilled, Check, Location } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

// 统计规则说明
const statisticsRules = {
  sales: '统计今日0点至当前的销售总额',
  traffic: '统计今日0点至当前的总访问量',
  refund: '统计今日0点至当前的退款总额',
  conversion: '统计今日0点至当前的平均转化率'
}

// Props类型定义
interface Props {
  data: {
    sales: number
    salesYearOnYear: number
    salesMonthOnMonth: number
    traffic: number
    trafficYearOnYear: number
    trafficMonthOnMonth: number
    refundAmount: number
    refundYearOnYear: number
    refundMonthOnMonth: number
    conversionRate: number
    conversionYearOnYear: number
    conversionMonthOnMonth: number
  }
}

const props = defineProps<Props>()

// 格式化趋势显示
const formatTrend = (trend: number, inverse: boolean = false) => {
  const value = inverse ? -trend : trend
  return {
    type: value >= 0 ? 'success' : 'danger',
    text: `${value >= 0 ? '上升' : '下降'} ${Math.abs(value)}%`
  }
}

// 工具函数
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const formatChange = (change: number) => {
  return (change >= 0 ? '+' : '') + change.toFixed(2) + '%'
}

const getValueClass = (value: number | string | unknown): string => {
  if (typeof value !== 'number') return ''
  return value >= 0 ? 'positive' : 'negative'
}

// 渠道数据接口
interface ChannelData {
  name: string
  sales: number
  yearOnYear: number
  monthOnMonth: number
  color: string
  traffic: number
  trafficTrend: number
  pv: number
  pvTrend: number
  cartRate: number
  cartRateTrend: number
  orderRate: number
  orderRateTrend: number
  refundAmount: number
  refundReasons: {
    name: string
    count: number
    percentage: number
    color: string
  }[]
}

// 图表数据类型
interface TrendData {
  date: string
  value: number
  [key: string]: any
}

// 指标类型定义
interface MetricDefinition {
  key: keyof ChannelData;
  label: string;
  type: 'number' | 'percentage' | 'currency';
  description: string;
  showTrend: boolean;
  trendKey?: keyof ChannelData;
  showProgress?: boolean;
}

// 对比指标定义
const comparisonMetrics: MetricDefinition[] = [
  {
    key: 'sales',
    label: '销量',
    type: 'number',
    description: '当前小时订单总件数',
    showTrend: true,
    trendKey: 'yearOnYear',
    showProgress: true
  },
  {
    key: 'traffic',
    label: '流量',
    type: 'number',
    description: '当前小时PV总和',
    showTrend: true,
    trendKey: 'trafficTrend',
    showProgress: true
  },
  {
    key: 'orderRate',
    label: '转化率',
    type: 'percentage',
    description: '访客转化为订单的比率',
    showTrend: true,
    trendKey: 'orderRateTrend',
    showProgress: true
  },
  {
    key: 'cartRate',
    label: '加购率',
    type: 'percentage',
    description: '访客加购商品的比率',
    showTrend: true,
    trendKey: 'cartRateTrend',
    showProgress: true
  },
  {
    key: 'refundAmount',
    label: '退款金额',
    type: 'currency',
    description: '当前小时退款总额',
    showTrend: false,
    showProgress: true
  }
]

// 模拟渠道数据
const channelData = ref<ChannelData[]>([
  {
    name: '天猫',
    sales: 2500,
    yearOnYear: 15.2,
    monthOnMonth: 8.5,
    color: '#ff6b81',
    traffic: 15000,
    trafficTrend: 12.5,
    pv: 45000,
    pvTrend: 10.2,
    cartRate: 25.5,
    cartRateTrend: 5.2,
    orderRate: 12.3,
    orderRateTrend: 3.5,
    refundAmount: 12500,
    refundReasons: [
      { name: '尺码不合适', count: 25, percentage: 35, color: '#ff6b81' },
      { name: '质量问题', count: 18, percentage: 25, color: '#ff9f43' },
      { name: '款式与图片不符', count: 15, percentage: 20, color: '#54a0ff' },
      { name: '其他', count: 14, percentage: 20, color: '#8395a7' }
    ]
  },
  {
    name: '京东',
    sales: 1800,
    yearOnYear: 12.8,
    monthOnMonth: 5.2,
    color: '#54a0ff',
    traffic: 12000,
    trafficTrend: 8.5,
    pv: 36000,
    pvTrend: 7.8,
    cartRate: 22.5,
    cartRateTrend: 3.8,
    orderRate: 10.5,
    orderRateTrend: 2.8,
    refundAmount: 8500,
    refundReasons: [
      { name: '尺码不合适', count: 20, percentage: 30, color: '#ff6b81' },
      { name: '质量问题', count: 15, percentage: 25, color: '#ff9f43' },
      { name: '款式与图片不符', count: 12, percentage: 20, color: '#54a0ff' },
      { name: '其他', count: 15, percentage: 25, color: '#8395a7' }
    ]
  },
  {
    name: '抖音',
    sales: 1200,
    yearOnYear: 25.5,
    monthOnMonth: 15.8,
    color: '#ff9f43',
    traffic: 8000,
    trafficTrend: 18.5,
    pv: 24000,
    pvTrend: 15.8,
    cartRate: 28.5,
    cartRateTrend: 8.8,
    orderRate: 15.5,
    orderRateTrend: 6.8,
    refundAmount: 5500,
    refundReasons: [
      { name: '尺码不合适', count: 15, percentage: 25, color: '#ff6b81' },
      { name: '质量问题', count: 12, percentage: 20, color: '#ff9f43' },
      { name: '款式与图片不符', count: 18, percentage: 30, color: '#54a0ff' },
      { name: '其他', count: 15, percentage: 25, color: '#8395a7' }
    ]
  }
])

// 渠道图表相关
const channelChartType = ref('sales')
const channelChartTitle = computed(() => {
  const typeText = {
    sales: '销量',
    conversion: '转化率',
    refund: '退款率'
  }[channelChartType.value]
  return `渠道${typeText}趋势`
})

// 渠道详情弹窗
const channelDetailVisible = ref(false)
const selectedChannel = ref<ChannelData | null>(null)
const timeRange = ref('today')

// 打开渠道详情
const openChannelDetail = (channel: ChannelData) => {
  selectedChannel.value = channel
  channelDetailVisible.value = true
}

// 渠道趋势图表数据
const channelChartData = computed<TrendData[]>(() => {
  // 模拟24小时数据
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0')
    return {
      date: `${hour}:00`,
      value: Math.floor(Math.random() * 1000),
      天猫: Math.floor(Math.random() * 500),
      京东: Math.floor(Math.random() * 300),
      抖音: Math.floor(Math.random() * 200)
    }
  })
})

// 选中渠道的趋势数据
const selectedChannelTrendData = computed<TrendData[]>(() => {
  if (!selectedChannel.value) return []
  
  const days = timeRange.value === 'today' ? 24 : 
               timeRange.value === '7d' ? 7 : 30
  
  return Array.from({ length: days }, (_, i) => ({
    date: timeRange.value === 'today' ? 
          `${i.toString().padStart(2, '0')}:00` :
          `${(days - i).toString()}天前`,
    value: Math.floor(Math.random() * 1000)
  }))
})

// 对比数据
const selectedChannelCompareData = computed<TrendData[]>(() => {
  if (!selectedChannel.value) return []
  
  return selectedChannelTrendData.value.map(item => ({
    date: item.date,
    value: Math.floor(item.value * 0.8) // 模拟同期数据
  }))
})

// 退款趋势数据
const selectedChannelRefundData = computed<TrendData[]>(() => {
  if (!selectedChannel.value) return []
  
  const days = timeRange.value === 'today' ? 24 : 
               timeRange.value === '7d' ? 7 : 30
  
  return Array.from({ length: days }, (_, i) => ({
    date: timeRange.value === 'today' ? 
          `${i.toString().padStart(2, '0')}:00` :
          `${(days - i).toString()}天前`,
    value: Math.floor(Math.random() * 5000) // 退款金额
  }))
})

// 格式化百分比
const formatPercentage = (percentage: number): string => `${percentage}%`

// 选中的渠道
const selectedChannels = ref<string[]>([])

// 切换渠道选择
const toggleChannel = (channelName: string) => {
  const index = selectedChannels.value.indexOf(channelName)
  if (index === -1) {
    selectedChannels.value.push(channelName)
  } else {
    selectedChannels.value.splice(index, 1)
  }
}

// 获取选中渠道的数据
const selectedChannelData = computed(() => {
  return channelData.value.filter(channel => 
    selectedChannels.value.includes(channel.name)
  )
})

// 对比数据
const comparisonData = computed(() => comparisonMetrics)

// 格式化指标值
const formatMetricValue = (type: string, value: number | string | unknown): string => {
  if (typeof value !== 'number') return '-'
  
  switch (type) {
    case 'currency':
      return `¥${formatNumber(value)}`
    case 'percentage':
      return `${value}%`
    case 'number':
    default:
      return formatNumber(value)
  }
}

// 获取值的颜色类名
const getValueColorClass = (type: string, value: number | string | unknown): string => {
  if (typeof value !== 'number') return ''
  
  if (type === 'currency') {
    return 'currency-value'
  }
  return ''
}

// 添加getProgressPercentage方法
const getProgressPercentage = (metricKey: keyof ChannelData, channel: ChannelData): number => {
  const total = channelData.value.reduce((sum, ch) => sum + (ch[metricKey] as number), 0);
  return total > 0 ? Number(((channel[metricKey] as number) / total * 100).toFixed(1)) : 0;
};

// 对比数据接口
interface CompareData {
  yesterday: number
  lastWeek: number
  lastMonth: number
  lastYear: number
}

interface CompareDataMap {
  sales: CompareData
  traffic: CompareData
  refund: CompareData
  conversion: CompareData
}

// 模拟数据生成函数
const generateCompareData = (current: number): CompareData => {
  return {
    yesterday: current * 0.9,  // 昨天同期数据
    lastWeek: current * 0.85,  // 上周同期数据
    lastMonth: current * 0.8,  // 上月同期数据
    lastYear: current * 0.7    // 去年同期数据
  }
}

// 计算趋势文本
interface TrendResult {
  trend: string
  type: 'success' | 'danger'
  text: string
  compare: string
}

const getTrendText = (current: number, compare: number): TrendResult => {
  const trend = ((current - compare) / compare * 100).toFixed(1)
  const isUp = Number(trend) >= 0
  return {
    trend,
    type: isUp ? 'success' : 'danger',
    text: `${isUp ? '上升' : '下降'} ${Math.abs(Number(trend))}%`,
    compare: compare.toFixed(1)
  }
}

// 模拟对比数据
const compareData = computed(() => {
  const data = {
    sales: generateCompareData(props.data.sales),
    traffic: generateCompareData(props.data.traffic),
    refund: generateCompareData(props.data.refundAmount),
    conversion: generateCompareData(props.data.conversionRate)
  }
  return data
})

// 获取同环比提示内容
const getCompareTooltip = (type: 'yearOnYear' | 'monthOnMonth', current: number, compare: number, change: number) => {
  const isYearOnYear = type === 'yearOnYear'
  const periodText = isYearOnYear ? '去年同期' : '上月同期'
  const trendText = change >= 0 ? '增长' : '下降'
  const timeText = isYearOnYear ? '2023年' : '上月'
  const currentTimeText = isYearOnYear ? '2024年' : '本月'
  
  return `${periodText}数据明细：
• 时间：${timeText}同日同时段
• 数值：${formatNumber(compare)}
• 计算基准：${periodText}0时至当前时间累计值

当前数据明细：
• 时间：${currentTimeText}当前时段
• 数值：${formatNumber(current)}
• 计算基准：今日0时至当前时间累计值

${trendText}分析：
• 变化幅度：${Math.abs(change).toFixed(1)}%
• 变化值：${formatNumber(Math.abs(current - compare))}
• 计算方式：(当前值 - ${periodText}值) / ${periodText}值 × 100%

${statisticsRules[type]}`
}

// 渠道销售趋势图相关
const trendChartRef = ref<HTMLElement | null>(null)
let trendChart: echarts.ECharts | null = null
const trendTimeRange = ref('hour')
const trendMetric = ref('amount')
const selectedWarehouses = ref<string[]>(['north', 'south'])

// 渠道和仓库选项
const channels = [
  { label: '天猫', value: 'tmall' },
  { label: '京东', value: 'jd' },
  { label: '抖音', value: 'douyin' },
  { label: '门店', value: 'store' }
]

const warehouses = [
  { label: '北仓', value: 'north' },
  { label: '华南仓', value: 'south' }
]

// 初始化趋势图
const initTrendChart = () => {
  if (!trendChartRef.value) return
  
  trendChart = echarts.init(trendChartRef.value)
  updateTrendChart()
  
  // 监听点击事件
  trendChart.on('click', (params) => {
    console.log('点击了数据点:', params)
    // TODO: 实现查看订单明细的逻辑
  })
}

// 更新趋势图数据
const updateTrendChart = () => {
  if (!trendChart) return

  // 生成模拟数据
  const generateData = () => {
    const timePoints = trendTimeRange.value === 'hour' ? 24 : 7
    const data: Record<string, any[]> = {}
    
    selectedChannels.value.forEach(channel => {
      data[channel] = Array.from({ length: timePoints }, (_, i) => {
        const time = trendTimeRange.value === 'hour' 
          ? `${i.toString().padStart(2, '0')}:00`
          : `${i + 1}日`
        return {
          time,
          value: Math.floor(Math.random() * 10000),
          orders: Math.floor(Math.random() * 100)
        }
      })
    })
    
    return data
  }

  const data = generateData()
  const series = selectedChannels.value.map(channel => ({
    name: channels.find(c => c.value === channel)?.label,
    type: 'line',
    smooth: true,
    emphasis: {
      focus: 'series'
    },
    data: data[channel].map(item => ({
      value: trendMetric.value === 'amount' ? item.value : item.orders,
      time: item.time,
      orders: item.orders,
      amount: item.value
    }))
  }))

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const time = params[0].data.time
        let html = `${time}<br/>`
        params.forEach((param: any) => {
          html += `${param.seriesName}: ${
            trendMetric.value === 'amount' 
              ? `¥${param.data.amount.toLocaleString()}`
              : `${param.data.orders}单`
          }<br/>`
        })
        return html
      }
    },
    legend: {
      data: selectedChannels.value.map(channel => 
        channels.find(c => c.value === channel)?.label
      ),
      textStyle: {
        color: '#909399'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data[selectedChannels.value[0]].map(item => item.time),
      axisLine: {
        lineStyle: {
          color: '#4c4d4f'
        }
      },
      axisLabel: {
        color: '#909399'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#4c4d4f'
        }
      },
      axisLabel: {
        color: '#909399',
        formatter: (value: number) => 
          trendMetric.value === 'amount'
            ? `¥${value.toLocaleString()}`
            : value
      },
      splitLine: {
        lineStyle: {
          color: '#2c3036'
        }
      }
    },
    series
  }

  trendChart.setOption(option)
}

// 监听筛选条件变化
watch([trendTimeRange, trendMetric, selectedChannels, selectedWarehouses], () => {
  updateTrendChart()
})

// GMV占比图相关
const gmvChartRef = ref<HTMLElement | null>(null)
let gmvChart: echarts.ECharts | null = null
const gmvTimeRange = ref('today')
const gmvChartType = ref('pie')
const selectedGmvWarehouses = ref<string[]>(['north', 'south'])

// 初始化GMV占比图
const initGmvChart = () => {
  if (!gmvChartRef.value) return
  
  gmvChart = echarts.init(gmvChartRef.value)
  updateGmvChart()
  
  // 监听点击事件
  gmvChart.on('click', (params) => {
    console.log('点击了渠道:', params)
    // TODO: 实现筛选全局图表的逻辑
  })
}

// 更新GMV占比图数据
const updateGmvChart = () => {
  if (!gmvChart) return

  // 生成模拟数据
  const generateGmvData = () => {
    return channels.map(channel => ({
      name: channel.label,
      value: Math.floor(Math.random() * 100000),
      percentage: 0
    })).sort((a, b) => b.value - a.value).slice(0, 10)
  }

  const data = generateGmvData()
  const total = data.reduce((sum, item) => sum + item.value, 0)
  data.forEach(item => {
    item.percentage = Number((item.value / total * 100).toFixed(1))
  })

  const option: EChartsOption = gmvChartType.value === 'pie' ? {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const { name, value, percentage } = params.data
        return `${name}<br/>GMV: ¥${value.toLocaleString()}<br/>占比: ${percentage}%`
      }
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'middle',
      textStyle: {
        color: '#909399'
      }
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderColor: '#23272e',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {d}%',
        color: '#e0e6ed'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '14',
          fontWeight: 'bold'
        }
      },
      data: data
    }]
  } : {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const { name, value, percentage } = params[0].data
        return `${name}<br/>GMV: ¥${value.toLocaleString()}<br/>占比: ${percentage}%`
      }
    },
    grid: {
      left: '3%',
      right: '15%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#4c4d4f'
        }
      },
      axisLabel: {
        color: '#909399',
        formatter: (value: number) => `¥${value.toLocaleString()}`
      },
      splitLine: {
        lineStyle: {
          color: '#2c3036'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: data.map(item => item.name),
      axisLine: {
        lineStyle: {
          color: '#4c4d4f'
        }
      },
      axisLabel: {
        color: '#909399'
      }
    },
    series: [{
      type: 'bar',
      data: data,
      label: {
        show: true,
        position: 'right',
        formatter: '{c} ({d}%)',
        color: '#e0e6ed'
      }
    }]
  }

  gmvChart.setOption(option)
}

// 监听筛选条件变化
watch([gmvTimeRange, gmvChartType, selectedGmvWarehouses], () => {
  updateGmvChart()
})

// 转化漏斗图相关
const funnelChartRef = ref<HTMLElement | null>(null)
let funnelChart: echarts.ECharts | null = null
const selectedFunnelChannel = ref('all')
const selectedFunnelWarehouse = ref('all')
const lossAnalysisVisible = ref(false)

// 流失分析数据
interface LossReason {
  name: string
  count: number
  percentage: number
  color: string
}

interface LossStep {
  name: string
  reasons: LossReason[]
}

const lossAnalysisData = ref<LossStep[]>([
  {
    name: '浏览到加购流失',
    reasons: [
      { name: '价格因素', count: 2500, percentage: 35, color: '#ff6b81' },
      { name: '商品款式', count: 1800, percentage: 25, color: '#ff9f43' },
      { name: '库存不足', count: 1500, percentage: 20, color: '#54a0ff' },
      { name: '其他原因', count: 1200, percentage: 20, color: '#8395a7' }
    ]
  },
  {
    name: '加购到下单流失',
    reasons: [
      { name: '放弃支付', count: 1500, percentage: 40, color: '#ff6b81' },
      { name: '优惠券问题', count: 1000, percentage: 30, color: '#ff9f43' },
      { name: '物流时效', count: 800, percentage: 20, color: '#54a0ff' },
      { name: '其他原因', count: 700, percentage: 10, color: '#8395a7' }
    ]
  },
  {
    name: '下单到支付流失',
    reasons: [
      { name: '支付失败', count: 800, percentage: 45, color: '#ff6b81' },
      { name: '重复下单', count: 500, percentage: 30, color: '#ff9f43' },
      { name: '其他原因', count: 400, percentage: 25, color: '#8395a7' }
    ]
  }
])

// 初始化转化漏斗图
const initFunnelChart = () => {
  if (!funnelChartRef.value) return
  
  funnelChart = echarts.init(funnelChartRef.value)
  updateFunnelChart()
}

// 更新转化漏斗图数据
const updateFunnelChart = () => {
  if (!funnelChart) return

  // 生成模拟数据
  const generateFunnelData = () => {
    const baseValue = Math.floor(Math.random() * 50000) + 50000
    return [
      { value: baseValue, name: '浏览人数', conversion: 100 },
      { value: Math.floor(baseValue * 0.6), name: '加购人数', conversion: 60 },
      { value: Math.floor(baseValue * 0.3), name: '下单人数', conversion: 30 },
      { value: Math.floor(baseValue * 0.2), name: '支付人数', conversion: 20 }
    ]
  }

  const data = generateFunnelData()

  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const { name, value, conversion } = params.data
        return `${name}<br/>人数: ${formatNumber(value)}<br/>转化率: ${conversion}%`
      }
    },
    legend: {
      data: data.map(item => item.name),
      top: 'bottom',
      textStyle: {
        color: '#909399'
      }
    },
    series: [{
      name: '转化漏斗',
      type: 'funnel',
      left: '10%',
      top: 60,
      bottom: 60,
      width: '80%',
      min: 0,
      max: data[0].value,
      minSize: '0%',
      maxSize: '100%',
      sort: 'descending',
      gap: 2,
      label: {
        show: true,
        position: 'right',
        formatter: (params: any) => {
          return `${params.name}: ${formatNumber(params.value)}人\n转化率: ${params.data.conversion}%`
        },
        color: '#e0e6ed'
      },
      labelLine: {
        length: 10,
        lineStyle: {
          color: '#4c4d4f'
        }
      },
      itemStyle: {
        borderColor: '#23272e',
        borderWidth: 2
      },
      emphasis: {
        label: {
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      data: data
    }]
  }

  funnelChart.setOption(option)
}

// 显示流失分析
const showLossAnalysis = () => {
  lossAnalysisVisible.value = true
}

// 监听筛选条件变化
watch([selectedFunnelChannel, selectedFunnelWarehouse], () => {
  updateFunnelChart()
})

// 用户画像相关
const profileChartRef = ref<HTMLElement | null>(null)
let profileChart: echarts.ECharts | null = null
const selectedProfileChannel = ref('all')
const profileMetric = ref('age')

// 用户画像数据
interface ProfileData {
  age: {
    label: string
    value: number
    trend: number
  }[]
  gender: {
    label: string
    value: number
    trend: number
  }[]
  region: {
    label: string
    value: number
    trend: number
  }[]
  device: {
    label: string
    value: number
    trend: number
  }[]
}

const profileData: ProfileData = {
  age: [
    { label: '18岁以下', value: 5, trend: -2.5 },
    { label: '18-24岁', value: 25, trend: 5.8 },
    { label: '25-34岁', value: 40, trend: 8.2 },
    { label: '35-44岁', value: 20, trend: 3.5 },
    { label: '45岁以上', value: 10, trend: -1.2 }
  ],
  gender: [
    { label: '女性', value: 65, trend: 4.5 },
    { label: '男性', value: 35, trend: -4.5 }
  ],
  region: [
    { label: '华东', value: 35, trend: 5.2 },
    { label: '华南', value: 25, trend: 3.8 },
    { label: '华北', value: 20, trend: -2.1 },
    { label: '西南', value: 12, trend: 1.5 },
    { label: '其他', value: 8, trend: -0.8 }
  ],
  device: [
    { label: 'iOS', value: 45, trend: 6.5 },
    { label: 'Android', value: 40, trend: 4.2 },
    { label: 'PC', value: 12, trend: -5.8 },
    { label: '其他', value: 3, trend: -1.2 }
  ]
}

// 用户画像概要数据
const profileSummary = computed(() => {
  const data = profileData[profileMetric.value]
  const maxItem = data.reduce((max, item) => 
    item.value > max.value ? item : max
  , data[0])
  
  return [
    {
      label: '主力人群',
      value: maxItem.label,
      trend: maxItem.trend
    },
    {
      label: '人群占比',
      value: `${maxItem.value}%`,
      trend: maxItem.trend
    },
    {
      label: '月度变化',
      value: formatChange(maxItem.trend),
      trend: maxItem.trend
    }
  ]
})

// 初始化用户画像图表
const initProfileChart = () => {
  if (!profileChartRef.value) return
  
  profileChart = echarts.init(profileChartRef.value)
  updateProfileChart()
}

// 更新用户画像图表
const updateProfileChart = () => {
  if (!profileChart) return

  const data = profileData[profileMetric.value]
  const colors = ['#ff6b81', '#ff9f43', '#54a0ff', '#8395a7', '#a8e6cf']

  const option: EChartsOption = profileMetric.value === 'region' ? {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const { name, value, data } = params
        return `${name}<br/>占比: ${value}%<br/>同比: ${formatChange(data.trend)}`
      }
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'middle',
      textStyle: {
        color: '#909399'
      }
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderColor: '#23272e',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {c}%',
        color: '#e0e6ed'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '14',
          fontWeight: 'bold'
        }
      },
      data: data.map((item, index) => ({
        name: item.label,
        value: item.value,
        itemStyle: {
          color: colors[index]
        }
      }))
    }]
  } : {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const { name, value, data } = params[0]
        return `${name}<br/>占比: ${value}%<br/>同比: ${formatChange(data.trend)}`
      }
    },
    grid: {
      left: '3%',
      right: '15%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#4c4d4f'
        }
      },
      axisLabel: {
        color: '#909399',
        formatter: '{value}%'
      },
      splitLine: {
        lineStyle: {
          color: '#2c3036'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: data.map(item => item.label),
      axisLine: {
        lineStyle: {
          color: '#4c4d4f'
        }
      },
      axisLabel: {
        color: '#909399'
      }
    },
    series: [{
      type: 'bar',
      data: data.map((item, index) => ({
        value: item.value,
        itemStyle: {
          color: colors[index]
        },
        ...item
      })),
      label: {
        show: true,
        position: 'right',
        formatter: '{c}%',
        color: '#e0e6ed'
      }
    }]
  }

  profileChart.setOption(option)
}

// 监听筛选条件变化
watch([selectedProfileChannel, profileMetric], () => {
  updateProfileChart()
})

// 库存预警相关
const selectedAlertChannel = ref('all')
const selectedAlertWarehouse = ref('all')
const alertDetailVisible = ref(false)
const selectedAlertType = ref<string | null>(null)
const alertChartRefs = ref<(HTMLElement | null)[]>([])

// 预警类型映射
const alertTypeMap = {
  tight: { title: '紧张库存', color: '#ff9f43' },
  soldOut: { title: '即将售罄', color: '#ff6b81' },
  expiry: { title: '临期商品', color: '#54a0ff' },
  empty: { title: '已售罄', color: '#8395a7' }
}

// 预警数据
const alertData = ref([
  {
    type: 'tight',
    title: '紧张库存SKU',
    value: '125',
    percentage: 15.8,
    trend: 5.2,
    data: [30, 28, 25, 35, 32, 28, 30]
  },
  {
    type: 'soldOut',
    title: '即将售罄SKU',
    value: '68',
    percentage: 8.5,
    trend: -2.8,
    data: [15, 18, 20, 16, 14, 12, 15]
  },
  {
    type: 'expiry',
    title: '临期SKU',
    value: '42',
    percentage: 5.2,
    trend: 1.5,
    data: [8, 10, 12, 9, 8, 10, 12]
  },
  {
    type: 'empty',
    title: '已售罄SKU',
    value: '36',
    percentage: 4.5,
    trend: -1.2,
    data: [10, 8, 6, 8, 9, 7, 6]
  }
])

// 预警详情数据
const alertDetailData = ref([
  {
    sku: 'SKU001',
    name: '2024春季新款连衣裙',
    stock: 85,
    dailySales: 30,
    daysToSoldOut: 3,
    expiryDays: 180,
    channel: '天猫',
    warehouse: '北仓'
  },
  {
    sku: 'SKU002',
    name: '2024春季新款半身裙',
    stock: 120,
    dailySales: 25,
    daysToSoldOut: 5,
    expiryDays: 180,
    channel: '京东',
    warehouse: '华南仓'
  }
  // ... 更多数据
])

// 初始化预警趋势小图
const initAlertCharts = () => {
  alertData.value.forEach((alert, index) => {
    const chartEl = alertChartRefs.value[index]
    if (!chartEl) return
    
    const chart = echarts.init(chartEl)
    const option: EChartsOption = {
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      xAxis: {
        type: 'category',
        show: false
      },
      yAxis: {
        type: 'value',
        show: false
      },
      series: [{
        type: 'line',
        data: alert.data,
        symbol: 'none',
        smooth: true,
        lineStyle: {
          color: alertTypeMap[alert.type as keyof typeof alertTypeMap].color
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: alertTypeMap[alert.type as keyof typeof alertTypeMap].color + '40'
            },
            {
              offset: 1,
              color: alertTypeMap[alert.type as keyof typeof alertTypeMap].color + '00'
            }
          ])
        }
      }]
    }
    chart.setOption(option)
  })
}

// 显示预警详情
const showAlertDetail = (type: string) => {
  selectedAlertType.value = type
  alertDetailVisible.value = true
}

// 处理补货
const handleReplenishment = (row: any) => {
  console.log('补货', row)
  // TODO: 实现补货逻辑
}

// 处理促销
const handlePromotion = (row: any) => {
  console.log('促销', row)
  // TODO: 实现促销逻辑
}

// 监听筛选条件变化
watch([selectedAlertChannel, selectedAlertWarehouse], () => {
  // TODO: 更新预警数据
})

onMounted(() => {
  initTrendChart()
  initGmvChart()
  initFunnelChart()
  initProfileChart()
  initAlertCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  gmvChart?.dispose()
  funnelChart?.dispose()
  profileChart?.dispose()
})

// 更新handleResize函数
const handleResize = () => {
  trendChart?.resize()
  gmvChart?.resize()
  funnelChart?.resize()
  profileChart?.resize()
}

// 销售渠道分析相关
const channelTimeRange = ref('today')
const selectedChannelMetric = ref('sales')
const channelMapRef = ref<HTMLElement | null>(null)
const metricChartRefs = ref<(HTMLElement | null)[]>([])

// 渠道排名数据
const channelRanking = ref([
  { name: '天猫', value: 125800, trend: 5.2 },
  { name: '京东', value: 98500, trend: 3.8 },
  { name: '抖音', value: 75600, trend: 12.5 },
  { name: '小红书', value: 45200, trend: -2.3 },
  { name: '快手', value: 32100, trend: 8.9 }
])

// 渠道指标数据
const channelMetrics = ref([
  {
    label: '线上渠道占比',
    value: '68.5%',
    tag: '良好',
    status: 'success',
    data: [65, 68, 62, 65, 70, 68, 69]
  },
  {
    label: '新渠道增速',
    value: '+15.2%',
    tag: '优秀',
    status: 'success',
    data: [10, 12, 15, 13, 16, 15, 15]
  },
  {
    label: '渠道获客成本',
    value: '¥35.6',
    tag: '需优化',
    status: 'warning',
    data: [38, 36, 35, 37, 34, 36, 35]
  },
  {
    label: '渠道复购率',
    value: '32.8%',
    tag: '正常',
    status: '',
    data: [30, 31, 33, 32, 34, 33, 33]
  }
])

// 初始化渠道地图
const initChannelMap = () => {
  if (!channelMapRef.value) return
  
  const chart = echarts.init(channelMapRef.value)
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'center',
      textStyle: {
        color: '#909399'
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#23272e',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '女装' },
          { value: 735, name: '男装' },
          { value: 580, name: '童装' },
          { value: 484, name: '运动' },
          { value: 300, name: '配饰' }
        ]
      }
    ]
  }
  chart.setOption(option)
}

// 商品分析相关
const productTimeRange = ref('today')
const selectedProductCategory = ref('all')
const distributionType = ref('category')
const productSearchKeyword = ref('')
const distributionChartRef = ref<HTMLElement | null>(null)

// 商品品类
const productCategories = [
  { label: '女装', value: 'women' },
  { label: '男装', value: 'men' },
  { label: '童装', value: 'kids' },
  { label: '运动', value: 'sports' },
  { label: '配饰', value: 'accessories' }
]

// 商品概况
const productOverview = ref([
  {
    label: '在售商品数',
    value: '1,256',
    trend: 5.2
  },
  {
    label: '新品数',
    value: '125',
    trend: 15.8
  },
  {
    label: '动销商品数',
    value: '856',
    trend: -2.3
  },
  {
    label: '商品上新率',
    value: '12.5%',
    trend: 3.6
  }
])

// 商品效率
const productEfficiency = ref([
  {
    label: '平均售价',
    value: '¥258.5',
    trend: 2.8
  },
  {
    label: '平均毛利率',
    value: '45.2%',
    trend: -1.5
  },
  {
    label: '商品转化率',
    value: '15.8%',
    trend: 3.2
  },
  {
    label: '复购率',
    value: '35.6%',
    trend: 4.5
  }
])

// 商品列表
const productList = ref([
  {
    code: 'SKU001',
    name: '2024春季新款连衣裙',
    category: '女装',
    price: 299.00,
    sales: 1256,
    amount: 375544,
    profit: 48.5,
    conversion: 15.8,
    status: '热销'
  },
  {
    code: 'SKU002',
    name: '2024春季新款半身裙',
    category: '女装',
    price: 199.00,
    sales: 986,
    amount: 196214,
    profit: 42.3,
    conversion: 12.5,
    status: '正常'
  }
  // ... 更多数据
])

// 初始化分布图表
const initDistributionChart = () => {
  if (!distributionChartRef.value) return
  
  const chart = echarts.init(distributionChartRef.value)
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'center',
      textStyle: {
        color: '#909399'
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#23272e',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '女装' },
          { value: 735, name: '男装' },
          { value: 580, name: '童装' },
          { value: 484, name: '运动' },
          { value: 300, name: '配饰' }
        ]
      }
    ]
  }
  chart.setOption(option)
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    '热销': 'success',
    '正常': '',
    '滞销': 'warning',
    '清仓': 'danger'
  }
  return typeMap[status] || ''
}

// 监听筛选条件变化
watch([productTimeRange, selectedProductCategory, distributionType], () => {
  // TODO: 更新商品分析数据
})

// 监听搜索关键词变化
watch(productSearchKeyword, () => {
  // TODO: 搜索商品
})

onMounted(() => {
  // ... existing code ...
  initDistributionChart()
})

onUnmounted(() => {
  // ... existing code ...
  const distributionChart = echarts.getInstanceByDom(distributionChartRef.value!)
  distributionChart?.dispose()
})

// ... existing code ...

// 营销活动分析相关
const marketingTimeRange = ref('today')
const selectedMarketingType = ref('all')
const performanceMetric = ref('gmv')
const marketingSearchKeyword = ref('')
const performanceChartRef = ref<HTMLElement | null>(null)

// 活动类型
const marketingTypes = [
  { label: '满减活动', value: 'discount' },
  { label: '优惠券', value: 'coupon' },
  { label: '限时特价', value: 'flash' },
  { label: '新品首发', value: 'new' },
  { label: '会员专享', value: 'vip' }
]

// 活动概览
const marketingOverview = ref([
  {
    label: '进行中活动',
    value: '8',
    trend: 2
  },
  {
    label: '活动GMV',
    value: '¥125.8万',
    trend: 15.8
  },
  {
    label: '活动ROI',
    value: '3.56',
    trend: -0.8
  },
  {
    label: '活动转化率',
    value: '25.6%',
    trend: 5.2
  }
])

// 活动列表
const marketingList = ref([
  {
    name: '618大促活动',
    type: '满减活动',
    status: '进行中',
    startTime: '2024-06-01 00:00:00',
    endTime: '2024-06-18 23:59:59',
    budget: 100000,
    cost: 58600,
    gmv: 258000,
    roi: 4.4,
    conversion: 25.8
  },
  {
    name: '新品首发特惠',
    type: '新品首发',
    status: '已结束',
    startTime: '2024-05-15 00:00:00',
    endTime: '2024-05-31 23:59:59',
    budget: 50000,
    cost: 48500,
    gmv: 156000,
    roi: 3.2,
    conversion: 18.5
  }
  // ... 更多数据
])

// 初始化效果图表
const initPerformanceChart = () => {
  if (!performanceChartRef.value) return
  
  const chart = echarts.init(performanceChartRef.value)
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['618大促', '新品首发', '会员日', '双11预热', '年终特惠'],
      axisLabel: {
        color: '#909399'
      },
      axisLine: {
        lineStyle: {
          color: '#4c4d4f'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#909399',
        formatter: (value: number) => formatNumber(value)
      },
      splitLine: {
        lineStyle: {
          color: '#4c4d4f'
        }
      }
    },
    series: [
      {
        type: 'bar',
        data: [258000, 156000, 98000, 85000, 65000],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#ff9f43' },
            { offset: 1, color: '#ff6b81' }
          ])
        },
        barWidth: '60%'
      }
    ]
  }
  chart.setOption(option)
}

// 获取活动类型样式
const getActivityType = (type: string) => {
  const typeMap: Record<string, string> = {
    '满减活动': 'success',
    '优惠券': 'warning',
    '限时特价': 'danger',
    '新品首发': 'info',
    '会员专享': ''
  }
  return typeMap[type] || ''
}

// 获取活动状态样式
const getActivityStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    '进行中': 'success',
    '未开始': 'info',
    '已结束': '',
    '已暂停': 'warning'
  }
  return statusMap[status] || ''
}

// 监听筛选条件变化
watch([marketingTimeRange, selectedMarketingType, performanceMetric], () => {
  // TODO: 更新营销活动数据
})

// 监听搜索关键词变化
watch(marketingSearchKeyword, () => {
  // TODO: 搜索活动
})

onMounted(() => {
  // ... existing code ...
  initPerformanceChart()
})

onUnmounted(() => {
  // ... existing code ...
  const performanceChart = echarts.getInstanceByDom(performanceChartRef.value!)
  performanceChart?.dispose()
})

// ... existing code ...
</script>

<style lang="scss" scoped>
.monitor-panel {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.monitor-cards {
  flex-shrink: 0;
}

.monitor-card {
  background: #23272e;
  border-radius: 8px;
  padding: 20px;
  height: 460px;
  display: flex;
  flex-direction: column;
}

.card-header {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title {
  font-size: 14px;
  color: #909399;
}

.help-icon {
  font-size: 14px;
  color: #909399;
  cursor: help;
  transition: color 0.3s ease;

  &:hover {
    color: #e0e6ed;
  }
}

.trend-tag {
  font-size: 12px;
  cursor: help;
}

.cursor-help {
  cursor: help;
}

.main-value {
  flex-shrink: 0;
  font-size: 28px;
  font-weight: 600;
  color: #e0e6ed;
  margin-bottom: 16px;
}

.compare-row {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.compare-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 4px;
  position: relative;
  
  &.cursor-help {
    cursor: help;
    padding-bottom: 1px;
    border-bottom: 1px dashed rgba(144, 147, 153, 0.3);
  }
}

.value {
  font-size: 14px;
  &.positive {
    color: #67c23a;
  }
  &.negative {
    color: #f56c6c;
  }
}

.channel-distribution {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  border-top: 1px solid #4c4d4f;
  overflow-y: auto;
}

.channel-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #4c4d4f;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.channel-item {
  flex-shrink: 0;
  background: #2a2e35;
  border-radius: 6px;
  padding: 12px;
}

.channel-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.channel-name {
  font-size: 13px;
  color: #909399;
}

.value-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.channel-value {
  font-size: 14px;
  color: #e0e6ed;
  font-weight: 500;
}

.trend-value {
  font-size: 12px;
  &.positive {
    color: #67c23a;
  }
  &.negative {
    color: #f56c6c;
  }
}

.refund-amount {
  font-size: 14px;
  color: #f56c6c;
}

.refund-rate {
  font-size: 12px;
  color: #909399;
}

.conversion-steps {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.step-label {
  font-size: 12px;
  color: #909399;
}

.step-value {
  font-size: 13px;
  color: #e0e6ed;
}

:deep(.el-progress-bar__outer) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-progress__text) {
  color: #909399 !important;
}

/* 渠道详情弹窗样式 */
.channel-detail-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
  }
}

.detail-section {
  padding: 24px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.detail-header h3 {
  font-size: 16px;
  color: #e0e6ed;
  margin: 0;
}

.conversion-metrics {
  background: #2a2e35;
  border-radius: 8px;
  padding: 20px;
}

.metric-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.metric-label {
  width: 100px;
  font-size: 13px;
  color: #909399;
}

.metric-value {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  color: #e0e6ed;
}

.metric-trend {
  font-size: 13px;
  &.positive {
    color: #67c23a;
  }
  &.negative {
    color: #f56c6c;
  }
}

.refund-reasons {
  background: #2a2e35;
  border-radius: 8px;
  padding: 20px;
}

.reason-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reason-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reason-name {
  font-size: 13px;
  color: #909399;
}

.reason-value {
  font-size: 14px;
  color: #e0e6ed;
}

.conversion-funnel {
  margin-bottom: 24px;
}

.conversion-funnel h4 {
  font-size: 14px;
  color: #e0e6ed;
  margin: 0 0 16px;
}

.conversion-metrics {
  background: #2a2e35;
  border-radius: 8px;
  padding: 20px;
}

.metric-name {
  color: #e0e6ed;
  margin-right: 8px;
}

.metric-value {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  
  .currency-value {
    color: #f56c6c;
  }
  
  .trend {
    font-size: 12px;
    
    &.positive {
      color: #67c23a;
    }
    
    &.negative {
      color: #f56c6c;
    }
  }
}

.help-tooltip {
  max-width: 300px;
  line-height: 1.5;
  white-space: pre-line;
}

.trend-tag {
  cursor: help;
}

.label {
  cursor: help;
}

/* 自定义tooltip样式 */
:deep(.el-popper.is-dark) {
  width: 200px !important;
  min-height: 50px;
  height: auto;
  padding: 16px !important;
  line-height: 1.6;
  white-space: pre-line;
  font-size: 13px;
  background: #2a2e35 !important;
  border: 1px solid #4c4d4f !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);

  .el-popper__arrow::before {
    background: #2a2e35 !important;
    border: 1px solid #4c4d4f !important;
  }
}

/* 确保所有可hover的元素样式统一 */
.cursor-help,
.trend-tag,
.help-icon,
.label {
  cursor: help;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
}

.trend-section {
  background: #23272e;
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    font-size: 16px;
    color: #e0e6ed;
    margin: 0;
  }
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.chart-container {
  height: 400px;
  width: 100%;
}

:deep(.el-select) {
  .el-input__wrapper {
    background-color: #2c3036;
    box-shadow: none;
    border: 1px solid #4c4d4f;
  }
  
  .el-input__inner {
    color: #e0e6ed;
  }
}

:deep(.el-radio-button__inner) {
  background-color: #2c3036;
  border-color: #4c4d4f;
  color: #909399;

  &:hover {
    color: #e0e6ed;
  }
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #409eff;
  border-color: #409eff;
  color: #ffffff;
  box-shadow: -1px 0 0 0 #409eff;
}

.gmv-section {
  background: #23272e;
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
}

.funnel-section {
  background: #23272e;
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
}

.loss-analysis-dialog {
  :deep(.el-dialog__body) {
    padding: 24px;
  }
}

.loss-analysis-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.loss-step {
  h4 {
    font-size: 14px;
    color: #e0e6ed;
    margin: 0 0 16px;
  }
}

.loss-reasons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reason-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reason-name {
  width: 100px;
  font-size: 13px;
  color: #909399;
}

:deep(.el-progress) {
  flex: 1;
  
  .el-progress-bar__outer {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
  
  .el-progress__text {
    color: #909399 !important;
  }
}

.profile-section {
  background: #23272e;
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
}

.profile-charts {
  display: flex;
  gap: 24px;
}

.profile-summary {
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #2a2e35;
  border-radius: 6px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-label {
  font-size: 13px;
  color: #909399;
}

.summary-value {
  font-size: 16px;
  color: #e0e6ed;
  font-weight: 500;
}

.summary-trend {
  font-size: 12px;
  &.positive {
    color: #67c23a;
  }
  &.negative {
    color: #f56c6c;
  }
}

.inventory-alert-section {
  background: #23272e;
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
}

.alert-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 20px;
}

.alert-card {
  background: #2a2e35;
  border-radius: 6px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.alert-title {
  font-size: 13px;
  color: #909399;
}

.alert-value {
  font-size: 24px;
  font-weight: 600;
  color: #e0e6ed;
  margin-bottom: 8px;
}

.alert-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.alert-label {
  font-size: 12px;
  color: #909399;
}

.alert-percentage {
  font-size: 13px;
  color: #e0e6ed;
}

.alert-chart {
  height: 40px;
  width: 100%;
}

.alert-detail-dialog {
  :deep(.el-dialog__body) {
    padding: 24px;
  }
}

:deep(.el-table) {
  background-color: #2a2e35;
  color: #e0e6ed;
  
  .el-table__header {
    background-color: #23272e;
    
    th {
      background-color: #23272e;
      color: #909399;
      border-bottom: 1px solid #4c4d4f;
    }
  }
  
  .el-table__body {
    tr {
      background-color: #2a2e35;
      
      &:hover > td {
        background-color: #363b44;
      }
    }
    
    td {
      border-bottom: 1px solid #4c4d4f;
    }
  }
}

.product-analysis-section {
  background: #23272e;
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
}

.product-analysis-content {
  display: flex;
  gap: 24px;
  margin-top: 20px;
}

.product-metrics {
  width: 300px;
}

.metric-group {
  background: #2a2e35;
  border-radius: 6px;
  padding: 16px;
  
  & + .metric-group {
    margin-top: 16px;
  }
}

.metric-title {
  font-size: 14px;
  color: #e0e6ed;
  margin-bottom: 16px;
}

.metric-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.metric-card {
  padding: 12px;
  background: #363b44;
  border-radius: 4px;
}

.metric-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 16px;
  font-weight: 600;
  color: #e0e6ed;
  margin-bottom: 4px;
}

.metric-trend {
  font-size: 12px;
  
  &.up {
    color: #67c23a;
  }
  
  &.down {
    color: #f56c6c;
  }
}

.product-distribution {
  flex: 1;
  background: #2a2e35;
  border-radius: 6px;
  padding: 16px;
}

.distribution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  span {
    font-size: 14px;
    color: #e0e6ed;
  }
}

.distribution-chart {
  height: 300px;
}

.product-table {
  margin-top: 24px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  span {
    font-size: 14px;
    color: #e0e6ed;
  }
}

.marketing-analysis-section {
  background: #23272e;
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
}

.marketing-analysis-content {
  display: flex;
  gap: 24px;
  margin-top: 20px;
}

.marketing-overview {
  width: 300px;
  background: #2a2e35;
  border-radius: 6px;
  padding: 16px;
}

.overview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  
  span {
    font-size: 14px;
    color: #e0e6ed;
  }
  
  .el-icon {
    color: #909399;
    cursor: help;
  }
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.overview-card {
  padding: 12px;
  background: #363b44;
  border-radius: 4px;
}

.marketing-performance {
  flex: 1;
  background: #2a2e35;
  border-radius: 6px;
  padding: 16px;
}

.performance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  span {
    font-size: 14px;
    color: #e0e6ed;
  }
}

.performance-chart {
  height: 300px;
}

.marketing-table {
  margin-top: 24px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  span {
    font-size: 14px;
    color: #e0e6ed;
  }
}
</style> 