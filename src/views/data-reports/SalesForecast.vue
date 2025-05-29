<!-- 实时数据页面 -->
<template>
  <div class="sales-forecast">
    <!-- 四个数据卡片 -->
    <div class="overview-cards">
      <el-tooltip 
        placement="top" 
        effect="dark"
        :content="getTooltipContent('totalSales')"
        raw-content>
        <div class="overview-card">
          <div class="card-header">
            <span class="card-title">总销售额</span>
            <el-icon class="card-icon"><Money /></el-icon>
          </div>
          <div class="card-value">¥{{ formatNumber(realtimeData.totalSales) }}</div>
          <div class="card-trend">
            <span class="trend-label">同比</span>
            <span :class="getTrendClass(realtimeData.salesYoY)">
              {{ formatTrend(realtimeData.salesYoY) }}
            </span>
            <span class="trend-separator">|</span>
            <span class="trend-label">环比</span>
            <span :class="getTrendClass(realtimeData.salesMoM)">
              {{ formatTrend(realtimeData.salesMoM) }}
            </span>
          </div>
        </div>
      </el-tooltip>

      <el-tooltip 
        placement="top" 
        effect="dark"
        :content="getTooltipContent('totalOrders')"
        raw-content>
        <div class="overview-card">
          <div class="card-header">
            <span class="card-title">总订单数</span>
            <el-icon class="card-icon"><Document /></el-icon>
          </div>
          <div class="card-value">{{ formatNumber(realtimeData.totalOrders) }}</div>
          <div class="card-trend">
            <span class="trend-label">同比</span>
            <span :class="getTrendClass(realtimeData.ordersYoY)">
              {{ formatTrend(realtimeData.ordersYoY) }}
            </span>
            <span class="trend-separator">|</span>
            <span class="trend-label">环比</span>
            <span :class="getTrendClass(realtimeData.ordersMoM)">
              {{ formatTrend(realtimeData.ordersMoM) }}
            </span>
          </div>
        </div>
      </el-tooltip>

      <el-tooltip 
        placement="top" 
        effect="dark"
        :content="getTooltipContent('avgOrderValue')"
        raw-content>
        <div class="overview-card">
          <div class="card-header">
            <span class="card-title">客单价</span>
            <el-icon class="card-icon"><Wallet /></el-icon>
          </div>
          <div class="card-value">¥{{ formatNumber(realtimeData.avgOrderValue) }}</div>
          <div class="card-trend">
            <span class="trend-label">同比</span>
            <span :class="getTrendClass(realtimeData.aovYoY)">
              {{ formatTrend(realtimeData.aovYoY) }}
            </span>
            <span class="trend-separator">|</span>
            <span class="trend-label">环比</span>
            <span :class="getTrendClass(realtimeData.aovMoM)">
              {{ formatTrend(realtimeData.aovMoM) }}
            </span>
          </div>
        </div>
      </el-tooltip>

      <el-tooltip 
        placement="top" 
        effect="dark"
        :content="getTooltipContent('conversionRate')"
        raw-content>
        <div class="overview-card">
          <div class="card-header">
            <span class="card-title">转化率</span>
            <el-icon class="card-icon"><TrendCharts /></el-icon>
          </div>
          <div class="card-value">{{ realtimeData.conversionRate }}%</div>
          <div class="card-trend">
            <span class="trend-label">同比</span>
            <span :class="getTrendClass(realtimeData.conversionYoY)">
              {{ formatTrend(realtimeData.conversionYoY) }}
            </span>
            <span class="trend-separator">|</span>
            <span class="trend-label">环比</span>
            <span :class="getTrendClass(realtimeData.conversionMoM)">
              {{ formatTrend(realtimeData.conversionMoM) }}
            </span>
          </div>
        </div>
      </el-tooltip>
    </div>

    <!-- 渠道销售趋势 -->
    <div class="channel-sales-section">
      <div class="section-header">
        <h3 class="section-title">渠道销售趋势</h3>
      </div>

      <!-- 搜索筛选条件 -->
      <div class="filter-panel">
        <el-form :inline="true" size="small">
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :shortcuts="dateShortcuts"
              @change="handleDateChange"
            />
          </el-form-item>
          <el-form-item label="渠道">
            <el-select 
              v-model="selectedChannels" 
              multiple 
              collapse-tags 
              placeholder="选择渠道"
              @change="handleDataChange">
              <el-option 
                v-for="channel in channels" 
                :key="channel.value" 
                :label="channel.label" 
                :value="channel.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="展示方式">
            <el-radio-group v-model="displayMode" @change="handleDisplayModeChange">
              <el-radio-button label="merge">合并展示</el-radio-button>
              <el-radio-button label="group">分组展示</el-radio-button>
                  </el-radio-group>
          </el-form-item>
          <el-form-item label="指标">
            <el-checkbox-group v-model="selectedMetrics" @change="handleMetricsChange">
              <el-checkbox label="sales">销售额</el-checkbox>
              <el-checkbox label="orders">订单数</el-checkbox>
              <el-checkbox label="conversion">转化率</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>

      <!-- 图表区域 -->
      <div class="chart-container" ref="chartRef"></div>

      <!-- 渠道GMV占比图 -->
      <div class="gmv-chart-section">
        <div class="gmv-header">
          <div class="gmv-title">渠道GMV占比</div>
          <div class="gmv-controls">
            <el-radio-group v-model="gmvTimeRange" size="small" @change="updateGMVChart">
              <el-radio-button label="today">今天</el-radio-button>
              <el-radio-button label="7days">7天</el-radio-button>
              <el-radio-button label="30days">30天</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
        <div class="gmv-chart-container">
          <div class="pie-chart" ref="pieChartRef"></div>
          <div class="bar-chart" ref="barChartRef"></div>
        </div>
      </div>

      <!-- 转化漏斗图 -->
      <div class="funnel-chart-section">
        <div class="funnel-header">
          <div class="funnel-title">转化漏斗分析</div>
          <div class="funnel-controls">
            <el-radio-group v-model="funnelTimeRange" size="small" @change="updateFunnelChart">
              <el-radio-button label="today">今天</el-radio-button>
              <el-radio-button label="7days">7天</el-radio-button>
              <el-radio-button label="30days">30天</el-radio-button>
            </el-radio-group>
            <el-select v-model="funnelChannel" size="small" placeholder="选择渠道" @change="updateFunnelChart" style="margin-left: 16px; width: 120px;">
              <el-option label="全部渠道" value="all" />
              <el-option label="天猫" value="tmall" />
              <el-option label="京东" value="jd" />
              <el-option label="抖音" value="douyin" />
              <el-option label="线下门店" value="store" />
              </el-select>
            </div>
              </div>
        <div class="funnel-chart-container">
          <div class="funnel-chart" ref="funnelChartRef"></div>
          <div class="funnel-stats">
            <div class="stats-item" v-for="(stat, index) in funnelStats" :key="index">
              <div class="stats-label">{{ stat.label }}</div>
              <div class="stats-value">{{ formatNumber(stat.value) }}人</div>
              <div class="stats-rate" v-if="stat.rate">
                <span :class="getTrendClass(stat.rate)">{{ stat.rate }}%</span>
            </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 库存预警总览 -->
      <div class="inventory-alert-section">
        <div class="alert-header">
          <div class="alert-title">库存预警总览</div>
          <div class="alert-controls">
            <el-select v-model="alertChannel" size="small" placeholder="选择渠道" @change="updateInventoryAlerts" style="width: 120px; margin-right: 16px;">
              <el-option label="全部渠道" value="all" />
              <el-option label="天猫" value="tmall" />
              <el-option label="京东" value="jd" />
              <el-option label="抖音" value="douyin" />
              <el-option label="线下门店" value="store" />
            </el-select>
            <el-select v-model="alertWarehouse" size="small" placeholder="选择仓库" @change="updateInventoryAlerts" style="width: 120px;">
              <el-option label="全部仓库" value="all" />
              <el-option label="华东仓" value="east" />
              <el-option label="华北仓" value="north" />
              <el-option label="华南仓" value="south" />
            </el-select>
          </div>
        </div>
        
        <div class="alert-cards">
          <el-tooltip 
            placement="top" 
            effect="dark"
            :content="getInventoryTooltip('tense')"
            raw-content>
            <div class="alert-card tense" @click="jumpToDetail('tense')">
              <div class="card-icon">
                <el-icon><Warning /></el-icon>
              </div>
              <div class="card-content">
                <div class="card-value">{{ inventoryAlerts.tenseCount }}</div>
                <div class="card-label">紧张库存SKU</div>
                <div class="card-trend">
                  <span class="trend-text">占比 {{ inventoryAlerts.tensePercent }}%</span>
                  <span :class="getTrendClass(inventoryAlerts.tenseTrend)">
                    <el-icon v-if="inventoryAlerts.tenseTrend >= 0"><ArrowUp /></el-icon>
                    <el-icon v-else><ArrowDown /></el-icon>
                    {{ Math.abs(inventoryAlerts.tenseTrend) }}%
                  </span>
                </div>
              </div>
            </div>
          </el-tooltip>

          <el-tooltip 
            placement="top" 
            effect="dark"
            :content="getInventoryTooltip('outOfStock')"
            raw-content>
            <div class="alert-card out-of-stock" @click="jumpToDetail('outOfStock')">
              <div class="card-icon">
                <el-icon><Clock /></el-icon>
              </div>
              <div class="card-content">
                <div class="card-value">{{ inventoryAlerts.outOfStockCount }}</div>
                <div class="card-label">即将售罄SKU</div>
                <div class="card-trend">
                  <span class="trend-text">占比 {{ inventoryAlerts.outOfStockPercent }}%</span>
                  <span :class="getTrendClass(inventoryAlerts.outOfStockTrend)">
                    <el-icon v-if="inventoryAlerts.outOfStockTrend >= 0"><ArrowUp /></el-icon>
                    <el-icon v-else><ArrowDown /></el-icon>
                    {{ Math.abs(inventoryAlerts.outOfStockTrend) }}%
                  </span>
            </div>
              </div>
            </div>
          </el-tooltip>

          <el-tooltip 
            placement="top" 
            effect="dark"
            :content="getInventoryTooltip('expiring')"
            raw-content>
            <div class="alert-card expiring" @click="jumpToDetail('expiring')">
              <div class="card-icon">
                <el-icon><Timer /></el-icon>
              </div>
              <div class="card-content">
                <div class="card-value">{{ inventoryAlerts.expiringCount }}</div>
                <div class="card-label">临期SKU</div>
                <div class="card-trend">
                  <span class="trend-text">占比 {{ inventoryAlerts.expiringPercent }}%</span>
                  <span :class="getTrendClass(inventoryAlerts.expiringTrend)">
                    <el-icon v-if="inventoryAlerts.expiringTrend >= 0"><ArrowUp /></el-icon>
                    <el-icon v-else><ArrowDown /></el-icon>
                    {{ Math.abs(inventoryAlerts.expiringTrend) }}%
                </span>
              </div>
              </div>
              </div>
          </el-tooltip>

          <el-tooltip 
            placement="top" 
            effect="dark"
            :content="getInventoryTooltip('soldOut')"
            raw-content>
            <div class="alert-card sold-out" @click="jumpToDetail('soldOut')">
              <div class="card-icon">
                <el-icon><CircleClose /></el-icon>
                  </div>
              <div class="card-content">
                <div class="card-value">{{ inventoryAlerts.soldOutCount }}</div>
                <div class="card-label">已售罄SKU</div>
                <div class="card-trend">
                  <span class="trend-text">占比 {{ inventoryAlerts.soldOutPercent }}%</span>
                  <span :class="getTrendClass(inventoryAlerts.soldOutTrend)">
                    <el-icon v-if="inventoryAlerts.soldOutTrend >= 0"><ArrowUp /></el-icon>
                    <el-icon v-else><ArrowDown /></el-icon>
                    {{ Math.abs(inventoryAlerts.soldOutTrend) }}%
                  </span>
                  </div>
                  </div>
                </div>
          </el-tooltip>
              </div>
        
        <div class="alert-summary">
          <div class="summary-text">
            <el-icon><InfoFilled /></el-icon>
            库存风险提醒：当前共有 <strong>{{ getTotalRiskCount() }}</strong> 个SKU存在库存风险，建议及时处理
            </div>
          <el-button type="primary" size="small" @click="jumpToDetail('all')">
            查看详细报告
          </el-button>
        </div>
      </div>

              </div>

    <!-- 用户画像模块 -->
    <div class="module-section">
      <div class="module-header">
        <h3 class="module-title">
          <el-icon><User /></el-icon>
          用户画像概览
        </h3>
        <div class="module-controls">
          <el-radio-group v-model="profileTimeRange" @change="updateProfileCharts">
            <el-radio-button label="today">今日</el-radio-button>
            <el-radio-button label="7days">近7天</el-radio-button>
            <el-radio-button label="30days">近30天</el-radio-button>
          </el-radio-group>
          <el-select v-model="profileChannel" @change="updateProfileCharts" style="width: 120px; margin-left: 12px;">
            <el-option label="全渠道" value="all" />
            <el-option label="天猫" value="tmall" />
            <el-option label="京东" value="jd" />
            <el-option label="抖音" value="douyin" />
            <el-option label="门店" value="store" />
          </el-select>
              </div>
                  </div>
      
      <!-- 用户画像统计卡片 -->
      <div class="profile-stats">
        <div v-for="stat in profileStats" :key="stat.label" class="profile-stat-card">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-desc">{{ stat.desc }}</div>
                  </div>
                  </div>
      
      <!-- 用户画像图表 -->
      <div class="profile-charts">
        <div class="chart-row">
          <div class="chart-item">
            <h4 class="chart-title">年龄分布</h4>
            <div ref="ageChartRef" class="chart-container"></div>
                </div>
          <div class="chart-item">
            <h4 class="chart-title">性别分布</h4>
            <div ref="genderChartRef" class="chart-container"></div>
              </div>
            </div>
        <div class="chart-row">
          <div class="chart-item">
            <h4 class="chart-title">地域分布</h4>
            <div ref="regionChartRef" class="chart-container"></div>
          </div>
          <div class="chart-item">
            <h4 class="chart-title">设备分布</h4>
            <div ref="deviceChartRef" class="chart-container"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 风险库存明细表 -->
    <div class="module-section">
      <div class="module-header">
        <h3 class="module-title">
          <el-icon><WarningFilled /></el-icon>
          风险库存明细表
        </h3>
        <div class="module-controls">
          <el-input
            v-model="inventorySearchKeyword"
            placeholder="搜索SKU编码或商品名"
            size="small"
            style="width: 200px; margin-right: 12px;"
            @change="handleInventoryFilterChange"
          />
          <el-select
            v-model="inventoryAlertType"
            multiple
            collapse-tags
            placeholder="选择预警类型"
            size="small"
            style="width: 160px; margin-right: 12px;"
            @change="handleInventoryFilterChange"
          >
            <el-option label="紧张库存" value="tense" />
            <el-option label="即将售罄" value="outOfStock" />
            <el-option label="临期商品" value="expiring" />
            <el-option label="已售罄" value="soldOut" />
          </el-select>
          <el-select
            v-model="inventoryChannelFilter"
            multiple
            collapse-tags
            placeholder="选择渠道"
            size="small"
            style="width: 160px; margin-right: 12px;"
            @change="handleInventoryFilterChange"
          >
            <el-option label="全部渠道" value="all" />
            <el-option label="天猫" value="tmall" />
            <el-option label="京东" value="jd" />
            <el-option label="抖音" value="douyin" />
            <el-option label="线下门店" value="store" />
          </el-select>
          <el-select
            v-model="inventoryWarehouseFilter"
            multiple
            collapse-tags
            placeholder="选择仓库"
            size="small"
            style="width: 160px; margin-right: 12px;"
            @change="handleInventoryFilterChange"
          >
            <el-option label="全部仓库" value="all" />
            <el-option label="华东仓" value="east" />
            <el-option label="华北仓" value="north" />
            <el-option label="华南仓" value="south" />
          </el-select>
          <el-select
            v-model="inventoryStockStatus"
            placeholder="选择库存状态"
            size="small"
            style="width: 120px; margin-right: 12px;"
            @change="handleInventoryFilterChange"
          >
            <el-option label="全部" value="all" />
            <el-option label="风险库存" value="risk" />
            <el-option label="正常库存" value="normal" />
          </el-select>
          <el-button type="primary" size="small" @click="exportInventoryData">
            导出数据
          </el-button>
        </div>
      </div>
      <div class="module-content">
        <el-table
          :data="filteredInventoryData"
          border
          stripe
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="SKU编码" prop="skuCode" width="120" />
          <el-table-column label="商品名" prop="productName" width="180">
            <template #default="{ row }">
              <div class="product-info">
                <img :src="row.productImage" alt="商品图片" class="product-image" />
                <span class="product-name">{{ row.productName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="当前库存" prop="currentStock" width="100">
            <template #default="{ row }">
              <span :class="getStockLevelClass(row.currentStock, row.safeStock)">
                {{ row.currentStock }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="日均销量" prop="dailyAvgSales" width="100" />
          <el-table-column label="预计售罄天数" prop="estimatedDays" width="120">
            <template #default="{ row }">
              <span :class="getEstimatedDaysClass(row.estimatedDays)">
                {{ row.estimatedDays }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="保质期剩余天数" prop="expiryDays" width="120">
            <template #default="{ row }">
              <span :class="getExpiryDaysClass(row.expiryDays)">
                {{ row.expiryDays }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="预警类型" prop="alertTypes" width="120">
            <template #default="{ row }">
              <el-tag
                v-for="type in row.alertTypes"
                :key="type"
                :type="getAlertTagType(type)"
                size="small"
                style="margin-right: 4px;"
              >
                {{ getAlertTypeName(type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="所属渠道" prop="channel" width="100" />
          <el-table-column label="仓库" prop="warehouse" width="100" />
          <el-table-column label="操作" fixed="right" width="180">
            <template #default="{ row }">
              <el-button
                type="primary"
                size="small"
                @click.stop="viewSkuDetail(row.skuCode)"
              >
                查看详情
              </el-button>
              <el-dropdown @command="handleMoreAction">
                <el-button size="small">
                  更多操作
                  <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="`restock-${row.skuCode}`">
                      生成补货建议
                    </el-dropdown-item>
                    <el-dropdown-item :command="`promotion-${row.skuCode}`">
                      生成促销方案
                    </el-dropdown-item>
                    <el-dropdown-item :command="`offshelf-${row.skuCode}`">
                      下架商品
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrapper">
          <el-pagination
            :current-page="inventoryCurrentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="inventoryPageSize"
            :total="inventoryTotalCount"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleInventoryPageSizeChange"
            @current-change="handleInventoryCurrentPageChange"
          />
          <el-button
            type="primary"
            size="small"
            @click="batchOperation"
            :disabled="selectedInventoryItems.length === 0"
          >
            批量操作
          </el-button>
        </div>
      </div>
    </div>

    <!-- 热销 & 滞销商品榜单 -->
    <div class="movers-section">
      <div class="module-header">
        <h3 class="module-title">
          <el-icon><TrendCharts /></el-icon>
          热销 & 滞销商品榜单
        </h3>
        <div class="module-controls">
          <el-radio-group v-model="moversTimeRange" size="small" @change="updateMoversData">
            <el-radio-button label="7">近7天</el-radio-button>
            <el-radio-button label="30">近30天</el-radio-button>
            <el-radio-button label="90">近90天</el-radio-button>
          </el-radio-group>
          <el-select 
            v-model="moversChannel" 
            size="small" 
            placeholder="选择渠道"
            @change="updateMoversData"
            style="width: 120px; margin-left: 12px;">
            <el-option label="全部渠道" value="all" />
            <el-option label="天猫" value="tmall" />
            <el-option label="京东" value="jd" />
            <el-option label="抖音" value="douyin" />
            <el-option label="线下门店" value="store" />
          </el-select>
          <el-select 
            v-model="moversWarehouse" 
            size="small" 
            placeholder="选择仓库"
            @change="updateMoversData"
            style="width: 120px; margin-left: 12px;">
            <el-option label="全部仓库" value="all" />
            <el-option label="华东仓" value="east" />
            <el-option label="华北仓" value="north" />
            <el-option label="华南仓" value="south" />
          </el-select>
        </div>
      </div>

      <div class="movers-container">
        <!-- 热销商品榜单 -->
        <div class="best-movers">
          <h4 class="list-title">热销商品 Top 10</h4>
          <el-table :data="bestMovers" stripe style="width: 100%">
            <el-table-column type="index" width="50" />
            <el-table-column prop="skuCode" label="SKU" width="100">
              <template #default="{ row }">
                <el-tooltip placement="top" :content="`点击查看 ${row.skuCode} 销售明细`">
                  <span class="sku-link" @click="viewSkuDetail(row.skuCode)">{{ row.skuCode }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="productName" label="商品名称" min-width="150" show-overflow-tooltip>
              <template #default="{ row }">
                <div class="product-info">
                  <img :src="row.productImage" :alt="row.productName" class="product-image" />
                  <span class="product-name">
                    {{ row.productName }}
                    <el-icon v-if="row.isStarred" class="star-icon" color="#f7ba2a"><Star /></el-icon>
                  </span>
                  <div class="product-name-tooltip">{{ row.productName }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="sales" label="销量" width="100" sortable>
              <template #default="{ row }">
                <el-tooltip placement="top" effect="dark" raw-content>
                  <template #content>
                    <div class="sales-trend">
                      <div class="trend-title">销量趋势</div>
                      <div class="trend-chart" ref="trendChartRef"></div>
                    </div>
                  </template>
                  <span class="sales-value">{{ row.sales }}件</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="当前库存" width="100" sortable>
              <template #default="{ row }">
                <span :class="getStockLevelClass(row.stock, row.safeStock)">{{ row.stock }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="turnoverDays" label="周转天数" width="100" sortable>
              <template #default="{ row }">
                <span :class="getTurnoverClass(row.turnoverDays)">{{ row.turnoverDays }}天</span>
              </template>
            </el-table-column>
            <el-table-column prop="channel" label="渠道" width="100">
              <template #default="{ row }">
                <div class="channel-info">
                  <span class="channel-dot" :style="{ backgroundColor: channelColors[row.channelCode] }"></span>
                  {{ row.channel }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="warehouse" label="仓库" width="100" />
            <el-table-column width="80" fixed="right">
              <template #default="{ row }">
                <el-button 
                  type="primary" 
                  link 
                  @click="toggleStar(row)"
                  :icon="row.isStarred ? 'Star' : 'StarFilled'"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 滞销商品榜单 -->
        <div class="slow-movers">
          <h4 class="list-title">滞销商品清单</h4>
          <el-table :data="slowMovers" stripe style="width: 100%">
            <el-table-column type="index" width="50" />
            <el-table-column prop="skuCode" label="SKU" width="100">
              <template #default="{ row }">
                <el-tooltip placement="top" :content="`点击查看 ${row.skuCode} 销售明细`">
                  <span class="sku-link" @click="viewSkuDetail(row.skuCode)">{{ row.skuCode }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="productName" label="商品名称" min-width="150" show-overflow-tooltip>
              <template #default="{ row }">
                <div class="product-info">
                  <img :src="row.productImage" :alt="row.productName" class="product-image" />
                  <span class="product-name">
                    {{ row.productName }}
                    <el-tag v-if="row.needClearance" size="small" type="warning">建议清货</el-tag>
                  </span>
                  <div class="product-name-tooltip">{{ row.productName }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="sales" label="30日销量" width="100" sortable>
              <template #default="{ row }">
                <el-tooltip placement="top" effect="dark" raw-content>
                  <template #content>
                    <div class="sales-trend">
                      <div class="trend-title">销量趋势</div>
                      <div class="trend-chart" ref="trendChartRef"></div>
                    </div>
                  </template>
                  <span class="sales-value low-sales">{{ row.sales }}件</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="当前库存" width="100" sortable>
              <template #default="{ row }">
                <span :class="getStockLevelClass(row.stock, row.safeStock)">{{ row.stock }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="turnoverDays" label="周转天数" width="100" sortable>
              <template #default="{ row }">
                <span :class="getTurnoverClass(row.turnoverDays)">{{ row.turnoverDays }}天</span>
              </template>
            </el-table-column>
            <el-table-column prop="channel" label="渠道" width="100">
              <template #default="{ row }">
                <div class="channel-info">
                  <span class="channel-dot" :style="{ backgroundColor: channelColors[row.channelCode] }"></span>
                  {{ row.channel }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="warehouse" label="仓库" width="100" />
            <el-table-column width="120" fixed="right">
              <template #default="{ row }">
                <el-button 
                  type="warning" 
                  size="small"
                  @click="handleClearance(row)"
                >
                  制定清货
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
        </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import * as echarts from 'echarts'
import { Money, Document, Wallet, TrendCharts, User, Warning, Clock, Timer, CircleClose, InfoFilled, ArrowUp, ArrowDown, WarningFilled, ArrowDown as ArrowDownIcon, Star, StarFilled } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

// 类型定义
interface ChannelData {
  time: string
  channel: keyof typeof channelColors
  sales: number
  orders: number
  conversion: number
  avgOrderValue: number
}

interface TableRowData {
  channel: string
  channelCode: keyof typeof channelColors
  sales: number
  salesPercent: number
  orders: number
  conversion: number
  avgOrderValue: number
  yoy: number
}

interface InventoryItem {
  skuCode: string
  productName: string
  productImage: string
  currentStock: number
  safeStock: number
  dailyAvgSales: number
  estimatedDays: number
  expiryDays: number
  alertTypes: string[]
  channel: string
  channelCode: keyof typeof channelColors
  warehouse: string
  stockHistory: {
    day7: number
    day3: number
    day1: number
  }
  stockTrend: number
}

interface MoverItem {
  skuCode: string
  productName: string
  productImage: string
  sales: number
  stock: number
  safeStock: number
  turnoverDays: number
  channel: string
  channelCode: 'tmall' | 'jd' | 'douyin' | 'store'
  warehouse: string
  isStarred?: boolean
  needClearance?: boolean
  salesTrend?: number[]
}

// 常量定义
const channelColors = {
  tmall: '#ff6b81',
  jd: '#45aaf2',
  douyin: '#2ecc71',
  store: '#fed330'
} as const

const channels = [
  { label: '天猫', value: 'tmall' },
  { label: '京东', value: 'jd' },
  { label: '抖音', value: 'douyin' },
  { label: '线下门店', value: 'store' }
]

const warehouses = [
  { label: '全部仓库', value: 'all' },
  { label: '华东仓', value: 'east' },
  { label: '华北仓', value: 'north' },
  { label: '华南仓', value: 'south' }
]

const dateShortcuts = [
  {
    text: '今天',
    value: () => {
      const today = new Date()
      return [today, today]
    }
  },
  {
    text: '最近7天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
      return [start, end]
    }
  },
  {
    text: '最近30天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
      return [start, end]
    }
  },
  {
    text: '最近90天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 89)
      return [start, end]
    }
  }
]

// 组件状态
const chartRef = ref<HTMLDivElement>()
const pieChartRef = ref<HTMLDivElement>()
const barChartRef = ref<HTMLDivElement>()
const funnelChartRef = ref<HTMLDivElement>()
const dateRange = ref<[Date, Date]>([
  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  new Date()
])
const selectedChannels = ref<(keyof typeof channelColors)[]>(['tmall', 'jd', 'douyin', 'store'])
const displayMode = ref<'merge' | 'group'>('merge')
const selectedMetrics = ref<string[]>(['sales', 'orders'])
const gmvTimeRange = ref<'today' | '7days' | '30days'>('30days')
const selectedWarehouse = ref<'all' | 'east' | 'north' | 'south'>('all')
const globalChannelFilter = ref<string | null>(null)

// 漏斗图相关状态
const funnelTimeRange = ref<'today' | '7days' | '30days'>('30days')
const funnelChannel = ref<'all' | 'tmall' | 'jd' | 'douyin' | 'store'>('all')
const funnelStats = ref([
  { label: '浏览人数', value: 125000, rate: null },
  { label: '加购人数', value: 25000, rate: 20.0 },
  { label: '下单人数', value: 8750, rate: 35.0 },
  { label: '支付人数', value: 7875, rate: 90.0 }
])

// 用户画像相关状态
const ageChartRef = ref<HTMLDivElement>()
const genderChartRef = ref<HTMLDivElement>()
const regionChartRef = ref<HTMLDivElement>()
const deviceChartRef = ref<HTMLDivElement>()
const profileTimeRange = ref<'today' | '7days' | '30days'>('30days')
const profileChannel = ref<'all' | 'tmall' | 'jd' | 'douyin' | 'store'>('all')
const profileStats = ref([
  { label: '主力年龄段', value: '25-35岁', desc: '占比42.5%' },
  { label: '主要性别', value: '女性用户', desc: '占比68.2%' },
  { label: '核心地域', value: '一二线城市', desc: '占比76.8%' }
])

// 库存预警相关状态
const alertChannel = ref<'all' | 'tmall' | 'jd' | 'douyin' | 'store'>('all')
const alertWarehouse = ref<'all' | 'east' | 'north' | 'south'>('all')
const inventoryAlerts = ref({
  tenseCount: 156,
  tensePercent: 12.5,
  tenseTrend: 8.2,
  outOfStockCount: 89,
  outOfStockPercent: 7.1,
  outOfStockTrend: -3.5,
  expiringCount: 45,
  expiringPercent: 3.6,
  expiringTrend: 15.8,
  soldOutCount: 23,
  soldOutPercent: 1.8,
  soldOutTrend: -12.3
})

// 实时数据
const realtimeData = ref({
  totalSales: 1250000,
  salesYoY: 15.8,
  salesMoM: 8.2,
  totalOrders: 3420,
  ordersYoY: 12.5,
  ordersMoM: 5.7,
  avgOrderValue: 365.5,
  aovYoY: 2.8,
  aovMoM: 2.3,
  conversionRate: 3.45,
  conversionYoY: 0.8,
  conversionMoM: 0.5
})

// 渠道明细数据
const channelDetailData = ref<TableRowData[]>([
  {
    channel: '天猫',
    channelCode: 'tmall',
    sales: 1235689,
    salesPercent: 48.5,
    orders: 1589,
    conversion: 3.2,
    avgOrderValue: 778,
    yoy: 18.5
  },
  {
    channel: '京东',
    channelCode: 'jd',
    sales: 856432,
    salesPercent: 33.2,
    orders: 1102,
    conversion: 2.8,
    avgOrderValue: 777,
    yoy: 12.3
  },
  {
    channel: '抖音',
    channelCode: 'douyin',
    sales: 325678,
    salesPercent: 12.8,
    orders: 425,
    conversion: 4.5,
    avgOrderValue: 766,
    yoy: 45.6
  },
  {
    channel: '门店',
    channelCode: 'store',
    sales: 150633,
    salesPercent: 5.5,
    orders: 140,
    conversion: 2.1,
    avgOrderValue: 1076,
    yoy: -5.2
  }
])

// 图表实例
let chart: echarts.ECharts | null = null
let pieChart: echarts.ECharts | null = null
let barChart: echarts.ECharts | null = null
let funnelChart: echarts.ECharts | null = null
let ageChart: echarts.ECharts | null = null
let genderChart: echarts.ECharts | null = null
let regionChart: echarts.ECharts | null = null
let deviceChart: echarts.ECharts | null = null

// 实时数据更新定时器
let realtimeTimer: NodeJS.Timeout | null = null

// 获取提示内容
const getTooltipContent = (type: string) => {
  const tooltips: Record<string, string> = {
    totalSales: `
      <div style="line-height: 1.6;">
        <strong>总销售额</strong><br/>
        <span style="color: #909399;">计算公式：</span>所有渠道销售金额之和<br/>
        <span style="color: #909399;">数据来源：</span>实时订单数据<br/>
        <span style="color: #909399;">更新频率：</span>每5分钟更新一次<br/>
        <br/>
        <span style="color: #909399;">同比：</span>与去年同期相比的增长率<br/>
        <span style="color: #909399;">环比：</span>与上月同期相比的增长率
      </div>
    `,
    totalOrders: `
      <div style="line-height: 1.6;">
        <strong>总订单数</strong><br/>
        <span style="color: #909399;">计算公式：</span>所有渠道订单数量之和<br/>
        <span style="color: #909399;">数据来源：</span>实时订单数据<br/>
        <span style="color: #909399;">更新频率：</span>每5分钟更新一次<br/>
        <br/>
        <span style="color: #909399;">同比：</span>与去年同期相比的增长率<br/>
        <span style="color: #909399;">环比：</span>与上月同期相比的增长率
      </div>
    `,
    avgOrderValue: `
      <div style="line-height: 1.6;">
        <strong>客单价</strong><br/>
        <span style="color: #909399;">计算公式：</span>总销售额 ÷ 总订单数<br/>
        <span style="color: #909399;">数据来源：</span>实时订单数据<br/>
        <span style="color: #909399;">更新频率：</span>每5分钟更新一次<br/>
        <br/>
        <span style="color: #909399;">同比：</span>与去年同期相比的增长率<br/>
        <span style="color: #909399;">环比：</span>与上月同期相比的增长率
      </div>
    `,
    conversionRate: `
      <div style="line-height: 1.6;">
        <strong>转化率</strong><br/>
        <span style="color: #909399;">计算公式：</span>订单数 ÷ 访问人数 × 100%<br/>
        <span style="color: #909399;">数据来源：</span>实时访问和订单数据<br/>
        <span style="color: #909399;">更新频率：</span>每5分钟更新一次<br/>
        <br/>
        <span style="color: #909399;">同比：</span>与去年同期相比的变化（百分点）<br/>
        <span style="color: #909399;">环比：</span>与上月同期相比的变化（百分点）
      </div>
    `
  }
  return tooltips[type] || ''
}

// 格式化趋势值
const formatTrend = (value: number) => {
  return (value >= 0 ? '+' : '') + value.toFixed(1) + '%'
}

// 获取趋势样式类
const getTrendClass = (value: number) => {
  return value >= 0 ? 'positive' : 'negative'
}

// 生成图表数据
function generateChartData(): ChannelData[] {
  const data: ChannelData[] = []
  const days = Math.floor((dateRange.value[1].getTime() - dateRange.value[0].getTime()) / (24 * 60 * 60 * 1000))
  
  // 渠道基础数据
  const channelBaseData = {
    tmall: { baseSales: 150000, variance: 0.2, trend: 0.15, weekendBoost: 1.3, conversion: 3.2 },
    jd: { baseSales: 120000, variance: 0.15, trend: 0.1, weekendBoost: 1.2, conversion: 2.8 },
    douyin: { baseSales: 80000, variance: 0.3, trend: 0.25, weekendBoost: 1.4, conversion: 4.5 },
    store: { baseSales: 50000, variance: 0.1, trend: -0.05, weekendBoost: 0.9, conversion: 2.1 }
  }

  for (let i = 0; i < days; i++) {
    const date = new Date(dateRange.value[0].getTime() + i * 24 * 60 * 60 * 1000)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    
    Object.entries(channelBaseData).forEach(([channel, config]) => {
      let baseSales = config.baseSales
      baseSales *= (1 + config.trend * i / days)
      if (isWeekend) baseSales *= config.weekendBoost
      
      const variance = baseSales * config.variance
      const sales = Math.floor(baseSales + (Math.random() * variance - variance / 2))
      
      const avgOrderValue = channel === 'store' ? 1000 : channel === 'tmall' ? 800 : channel === 'jd' ? 750 : 600
      const orders = Math.floor(sales / avgOrderValue)
      const conversion = config.conversion * (0.9 + Math.random() * 0.2)
      
    data.push({
        time: dayjs(date).format('YYYY-MM-DD'),
        channel: channel as keyof typeof channelColors,
        sales,
        orders,
        conversion,
        avgOrderValue
      })
    })
  }
  
  return data
}

// 更新图表
function updateChart() {
  if (!chart) return
  
  const chartData = generateChartData()
  const filteredData = chartData.filter(item => selectedChannels.value.includes(item.channel))
  
  // 按时间分组数据
  const groupedData = filteredData.reduce((acc, curr) => {
    if (!acc[curr.time]) acc[curr.time] = {}
    if (!acc[curr.time][curr.channel]) acc[curr.time][curr.channel] = curr
    return acc
  }, {} as Record<string, Record<string, ChannelData>>)

  const times = Object.keys(groupedData).sort()
  const series: any[] = []

  if (displayMode.value === 'merge') {
    // 合并展示模式
    if (selectedMetrics.value.includes('sales')) {
      const salesData = times.map(time => 
        Object.values(groupedData[time]).reduce((sum, data) => sum + data.sales, 0)
      )
      series.push({
        name: '销售额',
        type: 'line',
        data: salesData,
        smooth: true,
        lineStyle: { width: 2 },
        itemStyle: { color: '#67c23a' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(103, 194, 58, 0.2)' },
            { offset: 1, color: 'rgba(103, 194, 58, 0)' }
          ])
        }
      })
    }
    
    if (selectedMetrics.value.includes('orders')) {
      const ordersData = times.map(time => 
        Object.values(groupedData[time]).reduce((sum, data) => sum + data.orders, 0)
      )
      series.push({
        name: '订单数',
        type: 'line',
        data: ordersData,
        smooth: true,
        lineStyle: { width: 2 },
        itemStyle: { color: '#409eff' }
      })
    }
  } else {
    // 分组展示模式
    selectedChannels.value.forEach(channel => {
      if (selectedMetrics.value.includes('sales')) {
        const salesData = times.map(time => groupedData[time][channel]?.sales || 0)
        series.push({
          name: `${channels.find(c => c.value === channel)?.label}-销售额`,
          type: 'line',
          data: salesData,
          smooth: true,
          lineStyle: { width: 2 },
          itemStyle: { color: channelColors[channel] }
        })
      }
    })
  }

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        if (!Array.isArray(params)) return ''
        const time = params[0].axisValue
        let html = `<div style="margin-bottom:8px">${time}</div>`
        
        params.forEach(param => {
          const value = param.seriesName.includes('销售额') ? `¥${formatNumber(param.value)}` : formatNumber(param.value)
          html += `
            <div style="margin: 3px 0">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${param.color};margin-right:5px"></span>
              <span>${param.seriesName}：${value}</span>
            </div>`
        })
        return html
      }
    },
    legend: {
      data: series.map(s => s.name),
      textStyle: { color: '#909399' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: times,
      axisLine: { lineStyle: { color: '#4c4d4f' } },
      axisLabel: { 
        color: '#909399',
        formatter: (value: string) => dayjs(value).format('MM-DD')
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#4c4d4f' } },
      axisLabel: { 
        color: '#909399',
        formatter: (value: number) => {
          if (selectedMetrics.value.includes('sales')) {
            return `${(value / 10000).toFixed(0)}w`
          }
          return formatNumber(value)
        }
      },
      splitLine: { lineStyle: { color: '#2c3036' } }
    },
    series,
    dataZoom: [{
      type: 'inside',
      start: 0,
      end: 100
    }, {
      type: 'slider',
      height: 20,
      bottom: 0,
      start: 0,
      end: 100,
      borderColor: 'transparent',
      backgroundColor: '#2c3036',
      fillerColor: '#40444b',
      handleStyle: { color: '#67c23a' },
      textStyle: { color: '#909399' }
    }]
  }

  chart.setOption(option as any)
}

// 事件处理函数
function handleDateChange() { updateChart() }
function handleDataChange() { updateChart() }
function handleDisplayModeChange() { updateChart() }
function handleMetricsChange() { updateChart() }
function exportData() { ElMessage.success('数据导出成功') }

// GMV相关函数
function generateGMVData() {
  const baseData = channelDetailData.value.map(item => ({
    name: item.channel,
    value: item.sales,
    channelCode: item.channelCode
  }))
  
  // 根据时间范围调整数据
  const timeMultiplier = gmvTimeRange.value === 'today' ? 0.3 : 
                        gmvTimeRange.value === '7days' ? 0.7 : 1
  
  return baseData.map(item => ({
    ...item,
    value: Math.round(item.value * timeMultiplier)
  }))
}

function updateGMVChart() {
  updatePieChart()
  updateBarChart()
}

function updatePieChart() {
  if (!pieChart) return
  
  const data = generateGMVData()
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const percent = ((params.value / total) * 100).toFixed(1)
        return `
          <div style="line-height: 1.6;">
            <strong>${params.name}</strong><br/>
            <span style="color: #909399;">销售额：</span>¥${formatNumber(params.value)}<br/>
            <span style="color: #909399;">占比：</span>${percent}%<br/>
            <span style="color: #909399;">点击筛选该渠道</span>
          </div>
        `
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: '#909399' }
    },
    series: [{
      name: 'GMV占比',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#23272e',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold',
          color: '#e0e6ed'
        }
      },
      labelLine: {
        show: false
      },
      data: data.map(item => ({
        name: item.name,
        value: item.value,
        itemStyle: { color: channelColors[item.channelCode] }
      }))
    }]
  }
  
  pieChart.setOption(option as any)
}

function updateBarChart() {
  if (!barChart) return
  
  const data = generateGMVData().sort((a, b) => b.value - a.value).slice(0, 10)
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const item = params[0]
        const percent = ((item.value / total) * 100).toFixed(1)
        return `
          <div style="line-height: 1.6;">
            <strong>${item.name}</strong><br/>
            <span style="color: #909399;">销售额：</span>¥${formatNumber(item.value)}<br/>
            <span style="color: #909399;">占比：</span>${percent}%
          </div>
        `
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#4c4d4f' } },
      axisLabel: { 
        color: '#909399',
        formatter: (value: number) => `${(value / 10000).toFixed(0)}w`
      },
      splitLine: { lineStyle: { color: '#2c3036' } }
    },
    yAxis: {
      type: 'category',
      data: data.map(item => item.name),
      axisLine: { lineStyle: { color: '#4c4d4f' } },
      axisLabel: { color: '#909399' }
    },
    series: [{
      name: 'GMV',
      type: 'bar',
      data: data.map(item => ({
        value: item.value,
        itemStyle: { 
          color: channelColors[item.channelCode],
          borderRadius: [0, 4, 4, 0]
        }
      })),
      barWidth: '60%'
    }]
  }
  
  barChart.setOption(option as any)
}

function handleChartClick(channelName: string) {
  globalChannelFilter.value = globalChannelFilter.value === channelName ? null : channelName
  
  // 更新渠道筛选
  if (globalChannelFilter.value) {
    const channel = channels.find(c => c.label === channelName)
    if (channel) {
      selectedChannels.value = [channel.value as keyof typeof channelColors]
    }
    } else {
    selectedChannels.value = ['tmall', 'jd', 'douyin', 'store']
  }
  
  updateChart()
  updateGMVChart()
  
  ElMessage.info(globalChannelFilter.value ? `已筛选到${channelName}渠道` : '已取消渠道筛选')
}

// 漏斗图相关函数
function generateFunnelData() {
  const baseData = {
    all: { browse: 125000, cart: 25000, order: 8750, pay: 7875 },
    tmall: { browse: 45000, cart: 9500, order: 3200, pay: 2950 },
    jd: { browse: 35000, cart: 7200, order: 2450, pay: 2280 },
    douyin: { browse: 28000, cart: 5800, order: 2100, pay: 1890 },
    store: { browse: 17000, cart: 2500, order: 1000, pay: 755 }
  }
  
  const channelData = baseData[funnelChannel.value] || baseData.all
  
  // 根据时间范围调整数据
  const timeMultiplier = funnelTimeRange.value === 'today' ? 0.15 : 
                        funnelTimeRange.value === '7days' ? 0.6 : 1
  
  return {
    browse: Math.round(channelData.browse * timeMultiplier),
    cart: Math.round(channelData.cart * timeMultiplier),
    order: Math.round(channelData.order * timeMultiplier),
    pay: Math.round(channelData.pay * timeMultiplier)
  }
}

function updateFunnelChart() {
  if (!funnelChart) return
  
  const data = generateFunnelData()
  const funnelData = [
    { value: data.browse, name: '浏览人数' },
    { value: data.cart, name: '加购人数' },
    { value: data.order, name: '下单人数' },
    { value: data.pay, name: '支付人数' }
  ]
  
  // 更新统计数据
  funnelStats.value = [
    { label: '浏览人数', value: data.browse, rate: null },
    { label: '加购人数', value: data.cart, rate: Number(((data.cart / data.browse) * 100).toFixed(1)) },
    { label: '下单人数', value: data.order, rate: Number(((data.order / data.cart) * 100).toFixed(1)) },
    { label: '支付人数', value: data.pay, rate: Number(((data.pay / data.order) * 100).toFixed(1)) }
  ]
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const index = funnelData.findIndex(item => item.name === params.name)
        const rate = index > 0 ? funnelStats.value[index].rate : null
        return `
          <div style="line-height: 1.6;">
            <strong>${params.name}</strong><br/>
            <span style="color: #909399;">人数：</span>${formatNumber(params.value)}人<br/>
            ${rate ? `<span style="color: #909399;">转化率：</span>${rate}%<br/>` : ''}
            <span style="color: #909399;">占比：</span>${((params.value / data.browse) * 100).toFixed(1)}%
          </div>
        `
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
      max: data.browse,
      minSize: '0%',
      maxSize: '100%',
      sort: 'descending',
      gap: 2,
      label: {
        show: true,
        position: 'inside',
        formatter: (params: any) => {
          const rate = params.dataIndex > 0 ? 
            `\n${funnelStats.value[params.dataIndex].rate}%` : ''
          return `${params.name}\n${formatNumber(params.value)}人${rate}`
        },
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
      },
      labelLine: {
        length: 10,
        lineStyle: {
          width: 1,
          type: 'solid'
        }
      },
      itemStyle: {
        borderColor: '#23272e',
        borderWidth: 1
      },
      emphasis: {
        label: {
          fontSize: 16
        }
      },
      data: funnelData.map((item, index) => ({
        ...item,
        itemStyle: {
          color: index === 0 ? '#67c23a' : 
                 index === 1 ? '#409eff' : 
                 index === 2 ? '#e6a23c' : '#f56c6c'
        }
      }))
    }]
  }
  
  funnelChart.setOption(option as any)
}

// 用户画像相关函数
function generateProfileData() {
  const baseData = {
    all: {
      age: { '18-25': 15000, '25-35': 42000, '35-45': 28000, '45-55': 12000, '55+': 3000 },
      gender: { '男性': 32000, '女性': 68000 },
      region: { '一线城市': 45000, '二线城市': 32000, '三线城市': 18000, '其他': 5000 },
      device: { 'iOS': 38000, 'Android': 52000, 'PC': 8000, '其他': 2000 }
    },
    tmall: {
      age: { '18-25': 8000, '25-35': 22000, '35-45': 12000, '45-55': 5000, '55+': 1000 },
      gender: { '男性': 15000, '女性': 33000 },
      region: { '一线城市': 25000, '二线城市': 15000, '三线城市': 6000, '其他': 2000 },
      device: { 'iOS': 20000, 'Android': 25000, 'PC': 2000, '其他': 1000 }
    },
    jd: {
      age: { '18-25': 4000, '25-35': 12000, '35-45': 10000, '45-55': 4000, '55+': 1000 },
      gender: { '男性': 12000, '女性': 19000 },
      region: { '一线城市': 12000, '二线城市': 11000, '三线城市': 6000, '其他': 2000 },
      device: { 'iOS': 12000, 'Android': 16000, 'PC': 2000, '其他': 1000 }
    },
    douyin: {
      age: { '18-25': 2500, '25-35': 6000, '35-45': 4000, '45-55': 2000, '55+': 500 },
      gender: { '男性': 4000, '女性': 11000 },
      region: { '一线城市': 6000, '二线城市': 5000, '三线城市': 3000, '其他': 1000 },
      device: { 'iOS': 5000, 'Android': 8000, 'PC': 1000, '其他': 1000 }
    },
    store: {
      age: { '18-25': 500, '25-35': 2000, '35-45': 2000, '45-55': 1000, '55+': 500 },
      gender: { '男性': 1000, '女性': 5000 },
      region: { '一线城市': 2000, '二线城市': 1000, '三线城市': 3000, '其他': 0 },
      device: { 'iOS': 1000, 'Android': 3000, 'PC': 3000, '其他': 0 }
    }
  }
  
  const channelData = baseData[profileChannel.value] || baseData.all
  
  // 根据时间范围调整数据
  const timeMultiplier = profileTimeRange.value === 'today' ? 0.15 : 
                        profileTimeRange.value === '7days' ? 0.6 : 1
  
  return {
    age: Object.fromEntries(
      Object.entries(channelData.age).map(([key, value]) => [key, Math.round(value * timeMultiplier)])
    ),
    gender: Object.fromEntries(
      Object.entries(channelData.gender).map(([key, value]) => [key, Math.round(value * timeMultiplier)])
    ),
    region: Object.fromEntries(
      Object.entries(channelData.region).map(([key, value]) => [key, Math.round(value * timeMultiplier)])
    ),
    device: Object.fromEntries(
      Object.entries(channelData.device).map(([key, value]) => [key, Math.round(value * timeMultiplier)])
    )
  }
}

function updateProfileCharts() {
  updateAgeChart()
  updateGenderChart()
  updateRegionChart()
  updateDeviceChart()
  updateProfileStats()
}

function updateAgeChart() {
  if (!ageChart) return
  
  const data = generateProfileData()
  const ageData = Object.entries(data.age).map(([name, value]) => ({ name, value }))
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const item = params[0]
        const total = Object.values(data.age).reduce((sum: number, val: any) => sum + val, 0)
        const percent = ((item.value / total) * 100).toFixed(1)
        return `
          <div style="line-height: 1.6;">
            <strong>${item.name}岁</strong><br/>
            <span style="color: #909399;">用户数：</span>${formatNumber(item.value)}人<br/>
            <span style="color: #909399;">占比：</span>${percent}%
          </div>
        `
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
      data: ageData.map(item => item.name),
      axisLine: { lineStyle: { color: '#4c4d4f' } },
      axisLabel: { color: '#909399' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#4c4d4f' } },
      axisLabel: { 
        color: '#909399',
        formatter: (value: number) => `${(value / 1000).toFixed(0)}k`
      },
      splitLine: { lineStyle: { color: '#2c3036' } }
    },
    series: [{
      name: '用户数',
      type: 'bar',
      data: ageData.map((item, index) => ({
        value: item.value,
        itemStyle: { 
          color: ['#67c23a', '#409eff', '#e6a23c', '#f56c6c', '#909399'][index],
          borderRadius: [4, 4, 0, 0]
        }
      })),
      barWidth: '60%'
    }]
  }
  
  ageChart.setOption(option as any)
}

function updateGenderChart() {
  if (!genderChart) return
  
  const data = generateProfileData()
  const genderData = Object.entries(data.gender).map(([name, value]) => ({ name, value }))
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const total = Object.values(data.gender).reduce((sum: number, val: any) => sum + val, 0)
        const percent = ((params.value / total) * 100).toFixed(1)
  return `
          <div style="line-height: 1.6;">
            <strong>${params.name}</strong><br/>
            <span style="color: #909399;">用户数：</span>${formatNumber(params.value)}人<br/>
            <span style="color: #909399;">占比：</span>${percent}%
    </div>
  `
}
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: '#909399' }
    },
    series: [{
      name: '性别分布',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#23272e',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold',
          color: '#e0e6ed'
        }
      },
      labelLine: {
        show: false
      },
      data: genderData.map((item, index) => ({
        name: item.name,
        value: item.value,
        itemStyle: { color: index === 0 ? '#409eff' : '#f56c6c' }
      }))
    }]
  }
  
  genderChart.setOption(option as any)
}

function updateRegionChart() {
  if (!regionChart) return
  
  const data = generateProfileData()
  const regionData = Object.entries(data.region).map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const item = params[0]
        const total = Object.values(data.region).reduce((sum: number, val: any) => sum + val, 0)
        const percent = ((item.value / total) * 100).toFixed(1)
        return `
          <div style="line-height: 1.6;">
            <strong>${item.name}</strong><br/>
            <span style="color: #909399;">用户数：</span>${formatNumber(item.value)}人<br/>
            <span style="color: #909399;">占比：</span>${percent}%
          </div>
        `
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#4c4d4f' } },
      axisLabel: { 
        color: '#909399',
        formatter: (value: number) => `${(value / 1000).toFixed(0)}k`
      },
      splitLine: { lineStyle: { color: '#2c3036' } }
    },
    yAxis: {
      type: 'category',
      data: regionData.map(item => item.name),
      axisLine: { lineStyle: { color: '#4c4d4f' } },
      axisLabel: { color: '#909399' }
    },
    series: [{
      name: '用户数',
      type: 'bar',
      data: regionData.map((item, index) => ({
        value: item.value,
        itemStyle: { 
          color: ['#67c23a', '#409eff', '#e6a23c', '#f56c6c'][index],
          borderRadius: [0, 4, 4, 0]
        }
      })),
      barWidth: '60%'
    }]
  }
  
  regionChart.setOption(option as any)
}

function updateDeviceChart() {
  if (!deviceChart) return
  
  const data = generateProfileData()
  const deviceData = Object.entries(data.device).map(([name, value]) => ({ name, value }))
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const total = Object.values(data.device).reduce((sum: number, val: any) => sum + val, 0)
        const percent = ((params.value / total) * 100).toFixed(1)
        return `
          <div style="line-height: 1.6;">
            <strong>${params.name}</strong><br/>
            <span style="color: #909399;">用户数：</span>${formatNumber(params.value)}人<br/>
            <span style="color: #909399;">占比：</span>${percent}%
          </div>
        `
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: '#909399' }
    },
    series: [{
      name: '设备分布',
      type: 'pie',
      radius: '70%',
      center: ['60%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#23272e',
        borderWidth: 2
      },
      label: {
        show: true,
        position: 'outside',
        formatter: '{b}: {d}%',
        color: '#909399'
      },
      labelLine: {
        show: true,
        lineStyle: { color: '#4c4d4f' }
      },
      data: deviceData.map((item, index) => ({
        name: item.name,
        value: item.value,
        itemStyle: { color: ['#67c23a', '#409eff', '#e6a23c', '#f56c6c'][index] }
      }))
    }]
  }
  
  deviceChart.setOption(option as any)
}

function updateProfileStats() {
  const data = generateProfileData()
  
  // 计算主力年龄段
  const ageEntries = Object.entries(data.age)
  const maxAge = ageEntries.reduce((max, current) => current[1] > max[1] ? current : max)
  const totalAge = Object.values(data.age).reduce((sum: number, val: any) => sum + val, 0)
  const agePercent = ((maxAge[1] / totalAge) * 100).toFixed(1)
  
  // 计算主要性别
  const genderEntries = Object.entries(data.gender)
  const maxGender = genderEntries.reduce((max, current) => current[1] > max[1] ? current : max)
  const totalGender = Object.values(data.gender).reduce((sum: number, val: any) => sum + val, 0)
  const genderPercent = ((maxGender[1] / totalGender) * 100).toFixed(1)
  
  // 计算核心地域（一二线城市占比）
  const tier1And2 = (data.region['一线城市'] || 0) + (data.region['二线城市'] || 0)
  const totalRegion = Object.values(data.region).reduce((sum: number, val: any) => sum + val, 0)
  const regionPercent = ((tier1And2 / totalRegion) * 100).toFixed(1)
  
  profileStats.value = [
    { label: '主力年龄段', value: `${maxAge[0]}岁`, desc: `占比${agePercent}%` },
    { label: '主要性别', value: maxGender[0], desc: `占比${genderPercent}%` },
    { label: '核心地域', value: '一二线城市', desc: `占比${regionPercent}%` }
  ]
}

// 工具函数
function formatNumber(num: number): string {
  return new Intl.NumberFormat('zh-CN').format(Math.round(num))
}

function formatChange(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}

function getValueClass(value: number): string {
  return value >= 0 ? 'positive' : 'negative'
}

// 实时数据更新
const updateRealtimeData = () => {
  const baseData = {
    totalSales: 1250000,
    totalOrders: 3420,
    avgOrderValue: 365.5,
    conversionRate: 3.45
  }
  
  realtimeData.value = {
    totalSales: Math.round(baseData.totalSales * (1 + (Math.random() - 0.5) * 0.1)),
    salesYoY: 15.8 + (Math.random() - 0.5) * 2,
    salesMoM: 8.2 + (Math.random() - 0.5) * 2,
    totalOrders: Math.round(baseData.totalOrders * (1 + (Math.random() - 0.5) * 0.1)),
    ordersYoY: 12.5 + (Math.random() - 0.5) * 2,
    ordersMoM: 5.7 + (Math.random() - 0.5) * 2,
    avgOrderValue: Math.round(baseData.avgOrderValue * (1 + (Math.random() - 0.5) * 0.1) * 100) / 100,
    aovYoY: 2.8 + (Math.random() - 0.5) * 2,
    aovMoM: 2.3 + (Math.random() - 0.5) * 2,
    conversionRate: Math.round(baseData.conversionRate * (1 + (Math.random() - 0.5) * 0.1) * 100) / 100,
    conversionYoY: 0.8 + (Math.random() - 0.5) * 0.5,
    conversionMoM: 0.5 + (Math.random() - 0.5) * 0.5
  }
}

// 生命周期
onMounted(() => {
  // 初始化主图表
  if (chartRef.value) {
    chart = echarts.init(chartRef.value, 'dark')
    window.addEventListener('resize', () => chart?.resize())
    updateChart()
  }
  
  // 初始化GMV图表
  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value, 'dark')
    pieChart.on('click', (params: any) => handleChartClick(params.name))
  }
  
  if (barChartRef.value) {
    barChart = echarts.init(barChartRef.value, 'dark')
    barChart.on('click', (params: any) => handleChartClick(params.name))
  }
  
  // 初始化漏斗图
  if (funnelChartRef.value) {
    funnelChart = echarts.init(funnelChartRef.value, 'dark')
    updateFunnelChart()
  }
  
  // 初始化用户画像图表
  if (ageChartRef.value) {
    ageChart = echarts.init(ageChartRef.value, 'dark')
  }
  if (genderChartRef.value) {
    genderChart = echarts.init(genderChartRef.value, 'dark')
  }
  if (regionChartRef.value) {
    regionChart = echarts.init(regionChartRef.value, 'dark')
  }
  if (deviceChartRef.value) {
    deviceChart = echarts.init(deviceChartRef.value, 'dark')
  }
  
  // 更新用户画像图表
  updateProfileCharts()
  
  // 添加窗口大小变化监听
  window.addEventListener('resize', () => {
    chart?.resize()
    pieChart?.resize()
    barChart?.resize()
    funnelChart?.resize()
    ageChart?.resize()
    genderChart?.resize()
    regionChart?.resize()
    deviceChart?.resize()
  })
  
  // 更新所有图表
  updateGMVChart()
  updateFunnelChart()
  
  // 初始化库存预警数据
  updateInventoryAlerts()
  
  // 启动实时数据更新
  realtimeTimer = setInterval(updateRealtimeData, 30000)
})

onUnmounted(() => {
  if (realtimeTimer) {
    clearInterval(realtimeTimer)
  }
  chart?.dispose()
  pieChart?.dispose()
  barChart?.dispose()
  funnelChart?.dispose()
  ageChart?.dispose()
  genderChart?.dispose()
  regionChart?.dispose()
  deviceChart?.dispose()
})

// 库存预警相关函数
function generateInventoryAlertData() {
  const baseData = {
    all: {
      tense: { count: 156, percent: 12.5, trend: 8.2 },
      outOfStock: { count: 89, percent: 7.1, trend: -3.5 },
      expiring: { count: 45, percent: 3.6, trend: 15.8 },
      soldOut: { count: 23, percent: 1.8, trend: -12.3 }
    },
    tmall: {
      tense: { count: 68, percent: 13.2, trend: 12.5 },
      outOfStock: { count: 35, percent: 6.8, trend: -2.1 },
      expiring: { count: 18, percent: 3.5, trend: 18.9 },
      soldOut: { count: 9, percent: 1.7, trend: -8.7 }
    },
    jd: {
      tense: { count: 42, percent: 11.8, trend: 5.6 },
      outOfStock: { count: 28, percent: 7.9, trend: -4.2 },
      expiring: { count: 15, percent: 4.2, trend: 22.3 },
      soldOut: { count: 7, percent: 2.0, trend: -15.6 }
    },
    douyin: {
      tense: { count: 32, percent: 12.1, trend: 3.8 },
      outOfStock: { count: 18, percent: 6.8, trend: -1.9 },
      expiring: { count: 8, percent: 3.0, trend: 8.7 },
      soldOut: { count: 5, percent: 1.9, trend: -18.2 }
    },
    store: {
      tense: { count: 14, percent: 11.9, trend: 15.2 },
      outOfStock: { count: 8, percent: 6.8, trend: -6.8 },
      expiring: { count: 4, percent: 3.4, trend: 12.5 },
      soldOut: { count: 2, percent: 1.7, trend: -25.0 }
    }
  }
  
  const channelData = baseData[alertChannel.value] || baseData.all
  
  // 根据仓库筛选调整数据
  const warehouseMultiplier = alertWarehouse.value === 'all' ? 1 : 
                              alertWarehouse.value === 'east' ? 0.4 : 
                              alertWarehouse.value === 'north' ? 0.35 : 0.25
  
  return {
    tense: {
      count: Math.round(channelData.tense.count * warehouseMultiplier),
      percent: Number((channelData.tense.percent * warehouseMultiplier).toFixed(1)),
      trend: channelData.tense.trend
    },
    outOfStock: {
      count: Math.round(channelData.outOfStock.count * warehouseMultiplier),
      percent: Number((channelData.outOfStock.percent * warehouseMultiplier).toFixed(1)),
      trend: channelData.outOfStock.trend
    },
    expiring: {
      count: Math.round(channelData.expiring.count * warehouseMultiplier),
      percent: Number((channelData.expiring.percent * warehouseMultiplier).toFixed(1)),
      trend: channelData.expiring.trend
    },
    soldOut: {
      count: Math.round(channelData.soldOut.count * warehouseMultiplier),
      percent: Number((channelData.soldOut.percent * warehouseMultiplier).toFixed(1)),
      trend: channelData.soldOut.trend
    }
  }
}

function updateInventoryAlerts() {
  const data = generateInventoryAlertData()
  
  inventoryAlerts.value = {
    tenseCount: data.tense.count,
    tensePercent: data.tense.percent,
    tenseTrend: data.tense.trend,
    outOfStockCount: data.outOfStock.count,
    outOfStockPercent: data.outOfStock.percent,
    outOfStockTrend: data.outOfStock.trend,
    expiringCount: data.expiring.count,
    expiringPercent: data.expiring.percent,
    expiringTrend: data.expiring.trend,
    soldOutCount: data.soldOut.count,
    soldOutPercent: data.soldOut.percent,
    soldOutTrend: data.soldOut.trend
  }
}

function getInventoryTooltip(type: string) {
  const tooltips: Record<string, string> = {
    tense: `
      <div style="line-height: 1.6;">
        <strong>紧张库存SKU</strong><br/>
        <span style="color: #909399;">计算逻辑：</span>库存 ≤ 安全库存<br/>
        <span style="color: #909399;">风险等级：</span>中等风险<br/>
        <span style="color: #909399;">建议操作：</span>及时补货，调整安全库存<br/>
        <br/>
        <span style="color: #909399;">上周同比：</span>${inventoryAlerts.value.tenseTrend >= 0 ? '+' : ''}${inventoryAlerts.value.tenseTrend}%<br/>
        <span style="color: #909399;">点击查看：</span>详细SKU清单
      </div>
    `,
    outOfStock: `
      <div style="line-height: 1.6;">
        <strong>即将售罄SKU</strong><br/>
        <span style="color: #909399;">计算逻辑：</span>库存 / 日均销量 ≤ 3天<br/>
        <span style="color: #909399;">风险等级：</span>高风险<br/>
        <span style="color: #909399;">建议操作：</span>紧急补货，暂停推广<br/>
        <br/>
        <span style="color: #909399;">上周同比：</span>${inventoryAlerts.value.outOfStockTrend >= 0 ? '+' : ''}${inventoryAlerts.value.outOfStockTrend}%<br/>
        <span style="color: #909399;">点击查看：</span>详细SKU清单
      </div>
    `,
    expiring: `
      <div style="line-height: 1.6;">
        <strong>临期SKU</strong><br/>
        <span style="color: #909399;">计算逻辑：</span>保质期 ≤ 30天<br/>
        <span style="color: #909399;">风险等级：</span>中等风险<br/>
        <span style="color: #909399;">建议操作：</span>促销清仓，调整采购计划<br/>
        <br/>
        <span style="color: #909399;">上周同比：</span>${inventoryAlerts.value.expiringTrend >= 0 ? '+' : ''}${inventoryAlerts.value.expiringTrend}%<br/>
        <span style="color: #909399;">点击查看：</span>详细SKU清单
      </div>
    `,
    soldOut: `
      <div style="line-height: 1.6;">
        <strong>已售罄SKU</strong><br/>
        <span style="color: #909399;">计算逻辑：</span>库存=0 且7天内有浏览<br/>
        <span style="color: #909399;">风险等级：</span>极高风险<br/>
        <span style="color: #909399;">建议操作：</span>立即补货，下架商品<br/>
        <br/>
        <span style="color: #909399;">上周同比：</span>${inventoryAlerts.value.soldOutTrend >= 0 ? '+' : ''}${inventoryAlerts.value.soldOutTrend}%<br/>
        <span style="color: #909399;">点击查看：</span>详细SKU清单
      </div>
    `
  }
  return tooltips[type] || ''
}

function getTotalRiskCount() {
  return inventoryAlerts.value.tenseCount + 
         inventoryAlerts.value.outOfStockCount + 
         inventoryAlerts.value.expiringCount + 
         inventoryAlerts.value.soldOutCount
}

function jumpToDetail(type: string) {
  const messages: Record<string, string> = {
    tense: '跳转到紧张库存SKU详细页面',
    outOfStock: '跳转到即将售罄SKU详细页面',
    expiring: '跳转到临期SKU详细页面',
    soldOut: '跳转到已售罄SKU详细页面',
    all: '跳转到库存预警详细报告页面'
  }
  
  ElMessage.info(messages[type] || '跳转到库存详细页面')
  
  // 这里可以添加实际的路由跳转逻辑
  // router.push({ name: 'InventoryDetail', params: { type } })
}

// 监听器
watch([dateRange, selectedChannels, displayMode, selectedMetrics], () => {
  updateChart()
  updateGMVChart()
  updateFunnelChart()
})

watch([profileTimeRange, profileChannel], () => {
  updateProfileCharts()
})

// 监听库存预警筛选条件变化
watch([alertChannel, alertWarehouse], () => {
  updateInventoryAlerts()
})

// 库存明细数据
const inventoryData = ref<InventoryItem[]>([
  {
    skuCode: 'SKU001',
    productName: '高端护肤套装',
    productImage: '/images/products/skincare-set.jpg',
    currentStock: 85,
    safeStock: 100,
    dailyAvgSales: 12,
    estimatedDays: 7,
    expiryDays: 180,
    alertTypes: ['tense', 'outOfStock'],
    channel: '天猫',
    channelCode: 'tmall',
    warehouse: '华东仓',
    stockHistory: {
      day7: 150,
      day3: 120,
      day1: 95
    },
    stockTrend: -15.5
  },
  {
    skuCode: 'SKU002',
    productName: '有机山茶油',
    productImage: '/images/products/tea-oil.jpg',
    currentStock: 25,
    safeStock: 50,
    dailyAvgSales: 8,
    estimatedDays: 3,
    expiryDays: 360,
    alertTypes: ['tense', 'outOfStock'],
    channel: '京东',
    channelCode: 'jd',
    warehouse: '华南仓',
    stockHistory: {
      day7: 60,
      day3: 45,
      day1: 30
    },
    stockTrend: -25.0
  },
  {
    skuCode: 'SKU003',
    productName: '益生菌冲剂',
    productImage: '/images/products/probiotics.jpg',
    currentStock: 0,
    safeStock: 80,
    dailyAvgSales: 15,
    estimatedDays: 0,
    expiryDays: 90,
    alertTypes: ['soldOut'],
    channel: '抖音',
    channelCode: 'douyin',
    warehouse: '华北仓',
    stockHistory: {
      day7: 45,
      day3: 20,
      day1: 5
    },
    stockTrend: -100.0
  },
  {
    skuCode: 'SKU004',
    productName: '维生素C片',
    productImage: '/images/products/vitamin-c.jpg',
    currentStock: 120,
    safeStock: 60,
    dailyAvgSales: 5,
    estimatedDays: 24,
    expiryDays: 25,
    alertTypes: ['expiring'],
    channel: '天猫',
    channelCode: 'tmall',
    warehouse: '华东仓',
    stockHistory: {
      day7: 150,
      day3: 135,
      day1: 125
    },
    stockTrend: -5.2
  },
  {
    skuCode: 'SKU005',
    productName: '蓝莓叶黄素',
    productImage: '/images/products/blueberry.jpg',
    currentStock: 200,
    safeStock: 100,
    dailyAvgSales: 3,
    estimatedDays: 67,
    expiryDays: 15,
    alertTypes: ['expiring'],
    channel: '线下门店',
    channelCode: 'store',
    warehouse: '华南仓',
    stockHistory: {
      day7: 220,
      day3: 210,
      day1: 205
    },
    stockTrend: -2.8
  }
])

// 库存明细表相关计算属性
const filteredInventoryData = computed(() => {
  let result = inventoryData.value

  // 按预警类型筛选
  if (inventoryAlertType.value.length > 0) {
    result = result.filter(item => 
      inventoryAlertType.value.some(type => item.alertTypes.includes(type))
    )
  }

  // 按渠道筛选
  if (inventoryChannelFilter.value.length > 0) {
    result = result.filter(item => 
      inventoryChannelFilter.value.includes(item.channelCode)
    )
  }

  // 按仓库筛选
  if (inventoryWarehouseFilter.value.length > 0) {
    result = result.filter(item => 
      inventoryWarehouseFilter.value.includes(item.warehouse)
    )
  }

  // 按库存状态筛选
  if (inventoryStockStatus.value !== 'all') {
    result = result.filter(item => {
      const isRisk = item.currentStock < item.safeStock || 
                    item.estimatedDays <= 7 || 
                    item.expiryDays <= 30
      return inventoryStockStatus.value === 'risk' ? isRisk : !isRisk
    })
  }

  // 关键词搜索
  if (inventorySearchKeyword.value) {
    const keyword = inventorySearchKeyword.value.toLowerCase()
    result = result.filter(item => 
      item.skuCode.toLowerCase().includes(keyword) || 
      item.productName.toLowerCase().includes(keyword)
    )
  }

  inventoryTotalCount.value = result.length
  
  // 分页
  const start = (inventoryCurrentPage.value - 1) * inventoryPageSize.value
  const end = start + inventoryPageSize.value
  return result.slice(start, end)
})

// 库存明细表相关方法
const handleInventoryFilterChange = () => {
  inventoryCurrentPage.value = 1
}

const handleInventoryPageSizeChange = (size: number) => {
  inventoryPageSize.value = size
  inventoryCurrentPage.value = 1
}

const handleInventoryCurrentPageChange = (page: number) => {
  inventoryCurrentPage.value = page
}

const handleSelectionChange = (selection: InventoryItem[]) => {
  selectedInventoryItems.value = selection
}

const handleRowClick = (row: InventoryItem) => {
  console.log('Row clicked:', row)
}

const viewSkuDetail = (skuCode: string) => {
  console.log('View SKU detail:', skuCode)
}

const exportInventoryData = () => {
  ElMessage.success('开始导出数据...')
  // TODO: 实现导出逻辑
}

const batchOperation = () => {
  if (selectedInventoryItems.value.length === 0) {
    ElMessage.warning('请先选择要操作的商品')
    return
  }
  // TODO: 实现批量操作逻辑
}

const handleRestock = (row: InventoryItem) => {
  ElMessage.success(`正在为 ${row.productName} 生成补货建议...`)
  // TODO: 实现补货建议逻辑
}

const handlePromotion = (row: InventoryItem) => {
  ElMessage.success(`正在为 ${row.productName} 生成促销方案...`)
  // TODO: 实现促销方案逻辑
}

const handleOffShelf = (row: InventoryItem) => {
  ElMessage.warning(`确定要下架 ${row.productName} 吗？`)
  // TODO: 实现下架逻辑
}

const handleMoreAction = (command: string) => {
  const [action, skuCode] = command.split('-')
  console.log('More action:', action, skuCode)
  // TODO: 实现更多操作逻辑
}

// 样式相关方法
const getStockLevelClass = (currentStock: number, safeStock: number) => {
  return currentStock < safeStock ? 'stock-warning' : 'stock-normal'
}

const getStockTrendClass = (trend: number) => {
  return trend >= 0 ? 'trend-up' : 'trend-down'
}

const getEstimatedDaysClass = (days: number) => {
  if (days === 0) return 'days-sold-out'
  if (days <= 3) return 'days-critical'
  if (days <= 7) return 'days-warning'
  return 'days-normal'
}

const getExpiryDaysClass = (days: number) => {
  if (days <= 0) return 'expiry-expired'
  if (days <= 30) return 'expiry-critical'
  if (days <= 90) return 'expiry-warning'
  return 'expiry-normal'
}

const getAlertTagType = (alertType: string) => {
  const types: Record<string, string> = {
    tense: 'warning',
    outOfStock: 'danger',
    expiring: 'warning',
    soldOut: 'info'
  }
  return types[alertType] || 'info'
}

const getAlertTypeName = (alertType: string) => {
  const names: Record<string, string> = {
    tense: '紧张库存',
    outOfStock: '即将售罄',
    expiring: '临期商品',
    soldOut: '已售罄'
  }
  return names[alertType] || alertType
}

// 库存明细表相关状态
const inventoryAlertType = ref<string[]>([])
const inventoryChannelFilter = ref<string[]>([])
const inventoryWarehouseFilter = ref<string[]>([])
const inventoryStockStatus = ref<'all' | 'risk' | 'normal'>('all')
const inventorySearchKeyword = ref<string>('')
const inventoryCurrentPage = ref<number>(1)
const inventoryPageSize = ref<number>(20)
const inventoryTotalCount = ref<number>(0)
const selectedInventoryItems = ref<InventoryItem[]>([])

// 榜单相关状态
const moversTimeRange = ref('30')
const moversChannel = ref('all')
const moversWarehouse = ref('all')
const bestMovers = ref<MoverItem[]>([
  {
    skuCode: 'SKU001',
    productName: '高端护肤套装(补水保湿精华水+乳液+面霜)',
    productImage: '/images/products/skincare-set.jpg',
    sales: 1200,
    stock: 85,
    safeStock: 100,
    turnoverDays: 7,
    channel: '天猫',
    channelCode: 'tmall',
    warehouse: '华东仓',
    isStarred: true,
    salesTrend: [80, 95, 110, 85, 120, 150, 130]
  },
  {
    skuCode: 'SKU002',
    productName: '蓝莓叶黄素护眼片(60片装/瓶)',
    productImage: '/images/products/eye-health.jpg',
    sales: 980,
    stock: 120,
    safeStock: 80,
    turnoverDays: 12,
    channel: '京东',
    channelCode: 'jd',
    warehouse: '华北仓',
    isStarred: false,
    salesTrend: [70, 85, 95, 110, 125, 140, 120]
  },
  {
    skuCode: 'SKU003',
    productName: '益生菌冲剂(30袋/盒,儿童型)',
    productImage: '/images/products/probiotics.jpg',
    sales: 850,
    stock: 95,
    safeStock: 60,
    turnoverDays: 10,
    channel: '抖音',
    channelCode: 'douyin',
    warehouse: '华南仓',
    isStarred: true,
    salesTrend: [60, 75, 90, 85, 95, 110, 105]
  },
  {
    skuCode: 'SKU004',
    productName: '维生素C咀嚼片(100片装,橙味)',
    productImage: '/images/products/vitamin-c.jpg',
    sales: 780,
    stock: 150,
    safeStock: 100,
    turnoverDays: 15,
    channel: '天猫',
    channelCode: 'tmall',
    warehouse: '华东仓',
    isStarred: false,
    salesTrend: [50, 65, 80, 95, 85, 90, 95]
  },
  {
    skuCode: 'SKU005',
    productName: '胶原蛋白粉(30袋/盒,日本进口)',
    productImage: '/images/products/collagen.jpg',
    sales: 720,
    stock: 80,
    safeStock: 60,
    turnoverDays: 9,
    channel: '京东',
    channelCode: 'jd',
    warehouse: '华北仓',
    isStarred: true,
    salesTrend: [45, 55, 70, 85, 95, 85, 90]
  },
  {
    skuCode: 'SKU006',
    productName: '钙片(120片装,儿童补钙型)',
    productImage: '/images/products/calcium.jpg',
    sales: 680,
    stock: 110,
    safeStock: 80,
    turnoverDays: 14,
    channel: '抖音',
    channelCode: 'douyin',
    warehouse: '华南仓',
    isStarred: false,
    salesTrend: [40, 50, 65, 75, 85, 90, 85]
  },
  {
    skuCode: 'SKU007',
    productName: '深海鱼油软胶囊(90粒装)',
    productImage: '/images/products/fish-oil.jpg',
    sales: 650,
    stock: 75,
    safeStock: 50,
    turnoverDays: 11,
    channel: '天猫',
    channelCode: 'tmall',
    warehouse: '华东仓',
    isStarred: true,
    salesTrend: [35, 45, 60, 70, 80, 75, 80]
  },
  {
    skuCode: 'SKU008',
    productName: '蛋白质粉(500g装,增肌健身型)',
    productImage: '/images/products/protein.jpg',
    sales: 620,
    stock: 90,
    safeStock: 70,
    turnoverDays: 13,
    channel: '京东',
    channelCode: 'jd',
    warehouse: '华北仓',
    isStarred: false,
    salesTrend: [30, 40, 55, 65, 75, 70, 75]
  },
  {
    skuCode: 'SKU009',
    productName: '维生素B族片剂(60片装)',
    productImage: '/images/products/vitamin-b.jpg',
    sales: 580,
    stock: 65,
    safeStock: 40,
    turnoverDays: 8,
    channel: '抖音',
    channelCode: 'douyin',
    warehouse: '华南仓',
    isStarred: true,
    salesTrend: [25, 35, 50, 60, 70, 65, 70]
  },
  {
    skuCode: 'SKU010',
    productName: '葡萄籽精华胶囊(90粒装)',
    productImage: '/images/products/grape-seed.jpg',
    sales: 550,
    stock: 85,
    safeStock: 60,
    turnoverDays: 12,
    channel: '天猫',
    channelCode: 'tmall',
    warehouse: '华东仓',
    isStarred: false,
    salesTrend: [20, 30, 45, 55, 65, 60, 65]
  }
])

const slowMovers = ref<MoverItem[]>([
  {
    skuCode: 'SKU099',
    productName: '限定款香水(樱花季节限定版,30ml)',
    productImage: '/images/products/perfume.jpg',
    sales: 2,
    stock: 156,
    safeStock: 30,
    turnoverDays: 180,
    channel: '京东',
    channelCode: 'jd',
    warehouse: '华南仓',
    needClearance: true,
    salesTrend: [5, 3, 2, 1, 0, 1, 2]
  },
  {
    skuCode: 'SKU098',
    productName: '手工皂礼盒(玫瑰精油,3块装)',
    productImage: '/images/products/soap.jpg',
    sales: 1,
    stock: 89,
    safeStock: 20,
    turnoverDays: 150,
    channel: '天猫',
    channelCode: 'tmall',
    warehouse: '华东仓',
    needClearance: true,
    salesTrend: [4, 2, 1, 0, 1, 0, 1]
  },
  {
    skuCode: 'SKU097',
    productName: '草本足浴包(艾草+当归,10包装)',
    productImage: '/images/products/foot-bath.jpg',
    sales: 3,
    stock: 120,
    safeStock: 25,
    turnoverDays: 160,
    channel: '抖音',
    channelCode: 'douyin',
    warehouse: '华北仓',
    needClearance: true,
    salesTrend: [6, 4, 3, 2, 1, 1, 0]
  },
  {
    skuCode: 'SKU096',
    productName: '养生茶礼盒(红枣枸杞,20包装)',
    productImage: '/images/products/tea.jpg',
    sales: 2,
    stock: 78,
    safeStock: 15,
    turnoverDays: 140,
    channel: '天猫',
    channelCode: 'tmall',
    warehouse: '华南仓',
    needClearance: true,
    salesTrend: [3, 2, 1, 1, 0, 1, 1]
  },
  {
    skuCode: 'SKU095',
    productName: '护手霜套装(玫瑰+薰衣草,2支装)',
    productImage: '/images/products/hand-cream.jpg',
    sales: 1,
    stock: 95,
    safeStock: 20,
    turnoverDays: 170,
    channel: '京东',
    channelCode: 'jd',
    warehouse: '华东仓',
    needClearance: true,
    salesTrend: [4, 3, 1, 0, 0, 1, 0]
  },
  {
    skuCode: 'SKU094',
    productName: '面膜礼盒(蜂蜜补水,10片装)',
    productImage: '/images/products/mask.jpg',
    sales: 2,
    stock: 110,
    safeStock: 25,
    turnoverDays: 155,
    channel: '抖音',
    channelCode: 'douyin',
    warehouse: '华北仓',
    needClearance: true,
    salesTrend: [5, 3, 2, 1, 1, 0, 1]
  },
  {
    skuCode: 'SKU093',
    productName: '精油套装(薰衣草+茶树,10ml*2)',
    productImage: '/images/products/essential-oil.jpg',
    sales: 1,
    stock: 85,
    safeStock: 15,
    turnoverDays: 165,
    channel: '天猫',
    channelCode: 'tmall',
    warehouse: '华南仓',
    needClearance: true,
    salesTrend: [3, 2, 1, 0, 1, 0, 0]
  },
  {
    skuCode: 'SKU092',
    productName: '美甲工具套装(限定樱花粉)',
    productImage: '/images/products/nail-kit.jpg',
    sales: 2,
    stock: 92,
    safeStock: 20,
    turnoverDays: 145,
    channel: '京东',
    channelCode: 'jd',
    warehouse: '华东仓',
    needClearance: true,
    salesTrend: [4, 3, 2, 1, 0, 1, 1]
  },
  {
    skuCode: 'SKU091',
    productName: '香薰蜡烛(海洋香型,8oz)',
    productImage: '/images/products/candle.jpg',
    sales: 1,
    stock: 75,
    safeStock: 15,
    turnoverDays: 175,
    channel: '抖音',
    channelCode: 'douyin',
    warehouse: '华北仓',
    needClearance: true,
    salesTrend: [3, 1, 1, 0, 0, 1, 0]
  },
  {
    skuCode: 'SKU090',
    productName: '护发精油(摩洛哥油,100ml)',
    productImage: '/images/products/hair-oil.jpg',
    sales: 2,
    stock: 88,
    safeStock: 20,
    turnoverDays: 158,
    channel: '天猫',
    channelCode: 'tmall',
    warehouse: '华南仓',
    needClearance: true,
    salesTrend: [4, 2, 2, 1, 0, 1, 1]
  }
])

// 榜单相关方法
const updateMoversData = () => {
  // TODO: 根据筛选条件更新数据
  console.log('Updating movers data...')
}

const toggleStar = (row: MoverItem) => {
  row.isStarred = !row.isStarred
  ElMessage.success(`${row.isStarred ? '已标星' : '已取消标星'}: ${row.productName}`)
}

const handleClearance = (row: MoverItem) => {
  ElMessage.success(`正在为 ${row.productName} 制定清货方案...`)
}

const getTurnoverClass = (days: number) => {
  if (days > 90) return 'turnover-high'
  if (days > 45) return 'turnover-medium'
  return 'turnover-normal'
}
</script>

<style scoped>
.sales-forecast {
  padding: 20px;
  background-color: var(--el-bg-color-page, #141414);
  min-height: 100vh;
  color: var(--el-text-color-primary);
}

/* 四个卡片样式 */
.overview-cards {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 20px;
}

.overview-card {
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 20px;
  flex: 1;
  height: 140px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-title {
    font-size: 14px;
  color: var(--el-text-color-secondary);
}

.card-icon {
  font-size: 20px;
  color: var(--el-color-primary);
}

.card-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
}

.card-trend {
  font-size: 13px;
  display: flex;
  align-items: center;
}

.trend-label {
  margin-right: 8px;
  color: var(--el-text-color-secondary);
}

.trend-separator {
  margin: 0 8px;
  color: var(--el-text-color-secondary);
}

.positive {
  color: var(--el-color-success);
}

.negative {
  color: var(--el-color-danger);
}

/* 渠道销售趋势区域 */
.channel-sales-section {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 20px;
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
    font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
}

/* 搜索筛选面板 */
.filter-panel {
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

/* 图表容器 */
.chart-container {
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 20px;
  height: 400px;
  margin-bottom: 24px;
}

/* 渠道GMV占比图 */
.gmv-chart-section {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.gmv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.gmv-title {
  font-size: 16px;
    font-weight: 600;
  color: var(--el-text-color-primary);
}

.gmv-controls {
  display: flex;
  align-items: center;
}

.gmv-controls .el-radio-group {
  margin-right: 16px;
}

.gmv-controls .el-select {
  margin-left: 16px;
  width: 120px;
}

.gmv-chart-container {
  display: flex;
  justify-content: space-between;
}

.pie-chart {
  width: 48%;
  height: 300px;
}

.bar-chart {
  width: 48%;
  height: 300px;
}

/* 转化漏斗图 */
.funnel-chart-section {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.funnel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.funnel-title {
  font-size: 16px;
      font-weight: 600;
  color: var(--el-text-color-primary);
}

.funnel-controls {
  display: flex;
  align-items: center;
}

.funnel-chart-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.funnel-chart {
  width: 65%;
  height: 400px;
}

.funnel-stats {
  width: 30%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-left: 20px;
}

.stats-item {
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.stats-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.stats-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.stats-rate {
  font-size: 12px;
}

/* 渠道明细表格 */
.channel-detail {
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.channel-name {
  display: flex;
  align-items: center;
}

.channel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.percent-bar {
  position: relative;
  width: 100%;
  height: 20px;
  background: var(--el-bg-color);
  border-radius: 10px;
  overflow: hidden;
}

.bar-inner {
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.bar-text {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  font-size: 12px;
}

/* Element Plus 样式覆盖 */
:deep(.el-form--inline .el-form-item) {
  margin-right: 20px;
}

:deep(.el-radio-button__inner) {
  background: var(--el-bg-color);
  border-color: var(--el-border-color);
  color: var(--el-text-color-regular);
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: #ffffff;
}

:deep(.el-select) {
  width: 200px;
}

:deep(.el-form-item__label) {
  color: var(--el-text-color-regular);
}

:deep(.el-table) {
  background-color: transparent;
  color: var(--el-text-color-primary);
}

:deep(.el-table th) {
  background-color: var(--el-bg-color);
  color: var(--el-text-color-regular);
  border-bottom: 1px solid var(--el-border-color);
}

:deep(.el-table td) {
  background-color: var(--el-bg-color-overlay);
  border-bottom: 1px solid var(--el-border-color);
}

:deep(.el-table--border) {
  border: 1px solid var(--el-border-color);
}

:deep(.el-table--border th), :deep(.el-table--border td) {
  border-right: 1px solid var(--el-border-color);
}

:deep(.el-button) {
  background: var(--el-bg-color);
  border-color: var(--el-border-color);
  color: var(--el-text-color-regular);
}

:deep(.el-button.el-button--primary) {
  background: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: #ffffff;
}

:deep(.el-checkbox) {
  margin-right: 20px;
}

:deep(.el-checkbox__label) {
  color: var(--el-text-color-regular);
}

/* 用户画像概览 */
.user-profile-section {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.profile-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.profile-controls {
  display: flex;
  align-items: center;
}

.profile-controls .el-radio-group {
  margin-right: 16px;
}

.profile-controls .el-select {
  margin-left: 16px;
  width: 120px;
}

.profile-charts-grid {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.profile-chart-item {
  width: 24%;
}

.chart-title {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.age-chart, .gender-chart, .region-chart, .device-chart {
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 20px;
  height: 300px;
}

.profile-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.profile-stat-card {
  flex: 1;
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.profile-stat-card .stat-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.profile-stat-card .stat-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.profile-stat-card .stat-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.profile-charts {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart-row {
  display: flex;
  gap: 16px;
}

.chart-item {
  flex: 1;
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 20px;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
}

.chart-container {
  height: 280px;
}

/* 用户画像模块 */
.module-section {
  padding: 0 0 24px 0;
  margin-bottom: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0;
}

.module-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.module-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.module-content {
  margin-top: 20px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.product-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.product-name {
  font-size: 14px;
  color: #303133;
}

.stock-warning {
  color: #e6a23c;
  font-weight: 600;
}

.stock-normal {
  color: #67c23a;
  font-weight: 600;
}

.trend-up {
  color: #67c23a;
}

.trend-down {
  color: #f56c6c;
}

.days-sold-out {
  color: #909399;
  font-weight: 600;
}

.days-critical {
  color: #f56c6c;
  font-weight: 600;
}

.days-warning {
  color: #e6a23c;
  font-weight: 600;
}

.days-normal {
  color: #67c23a;
  font-weight: 600;
}

.expiry-expired {
  color: #f56c6c;
  font-weight: 600;
}

.expiry-critical {
  color: #e6a23c;
  font-weight: 600;
}

.expiry-warning {
  color: #e6a23c;
  font-weight: 600;
}

.expiry-normal {
  color: #67c23a;
  font-weight: 600;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 0 20px;
}

.stock-trend-tooltip {
  padding: 8px;
  line-height: 1.6;
}

.channel-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.channel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

/* 库存预警总览 */
.inventory-alert-section {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.alert-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.alert-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.alert-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.alert-card {
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.alert-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.alert-card.tense {
  border-left: 4px solid #e6a23c;
}

.alert-card.out-of-stock {
  border-left: 4px solid #f56c6c;
}

.alert-card.expiring {
  border-left: 4px solid #909399;
}

.alert-card.sold-out {
  border-left: 4px solid #f56c6c;
}

.alert-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.alert-card-title {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

.alert-card-icon {
  font-size: 18px;
}

.alert-card.tense .alert-card-icon {
  color: #e6a23c;
}

.alert-card.out-of-stock .alert-card-icon {
  color: #f56c6c;
}

.alert-card.expiring .alert-card-icon {
  color: #909399;
}

.alert-card.sold-out .alert-card-icon {
  color: #f56c6c;
}

.alert-card-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.alert-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alert-card-percent {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.alert-card-trend {
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 2px;
}

.alert-card-trend.positive {
  color: var(--el-color-danger);
}

.alert-card-trend.negative {
  color: var(--el-color-success);
}

.alert-summary {
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.alert-summary-title {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.alert-summary-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--el-color-warning);
  margin-bottom: 8px;
}

.alert-summary-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

/* 库存明细表样式 */
.inventory-detail-section {
  padding: 0 0 24px 0;
  margin-bottom: 24px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.detail-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-controls {
  display: flex;
  gap: 12px;
}

.inventory-filter-panel {
  margin-bottom: 24px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
}

.inventory-table-container {
  margin-top: 24px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.product-name {
  font-size: 14px;
  color: #303133;
}

.sku-code-link {
  color: #409eff;
  cursor: pointer;
  text-decoration: none;
}

.sku-code-link:hover {
  color: #66b1ff;
  text-decoration: underline;
}

.stock-warning {
  color: #e6a23c;
  font-weight: 600;
}

.stock-normal {
  color: #67c23a;
  font-weight: 600;
}

.trend-up {
  color: #67c23a;
}

.trend-down {
  color: #f56c6c;
}

.days-sold-out {
  color: #909399;
  font-weight: 600;
}

.days-critical {
  color: #f56c6c;
  font-weight: 600;
}

.days-warning {
  color: #e6a23c;
  font-weight: 600;
}

.days-normal {
  color: #67c23a;
  font-weight: 600;
}

.expiry-expired {
  color: #f56c6c;
  font-weight: 600;
}

.expiry-critical {
  color: #e6a23c;
  font-weight: 600;
}

.expiry-warning {
  color: #e6a23c;
  font-weight: 600;
}

.expiry-normal {
  color: #67c23a;
  font-weight: 600;
}

.alert-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.alert-tag {
  margin: 2px;
}

.channel-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.channel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.operation-buttons {
  display: flex;
  gap: 8px;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding: 0 20px;
}

.stock-trend-tooltip {
  padding: 12px;
  line-height: 1.6;
}

.stock-trend-tooltip strong {
  display: block;
  margin-bottom: 8px;
  color: #303133;
}

.stock-trend-tooltip div {
  color: #606266;
  margin: 4px 0;
}

/* 响应式布局 */
@media screen and (max-width: 1200px) {
  .inventory-filter-panel :deep(.el-form--inline .el-form-item) {
    margin-right: 12px;
    margin-bottom: 12px;
  }
  
  .operation-buttons {
    flex-direction: column;
  }
}

@media screen and (max-width: 768px) {
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .detail-controls {
    width: 100%;
    justify-content: flex-end;
  }
  
  .inventory-filter-panel {
    padding: 12px;
  }
  
  .inventory-filter-panel :deep(.el-form--inline) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }
  
  .inventory-filter-panel :deep(.el-form--inline .el-form-item) {
    margin-right: 0;
    margin-bottom: 0;
  }
}

/* 热销滞销榜单样式 */
.movers-section {
  padding: 0 0 24px 0;
  margin-bottom: 24px;
}

.movers-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 20px;
}

.best-movers,
.slow-movers {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.list-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.sku-link {
  color: var(--el-color-primary);
  cursor: pointer;
  text-decoration: none;
}

.sku-link:hover {
  text-decoration: underline;
}

.sales-value {
  font-weight: 600;
}

.sales-value.low-sales {
  color: var(--el-color-danger);
}

.turnover-high {
  color: var(--el-color-danger);
  font-weight: 600;
}

.turnover-medium {
  color: var(--el-color-warning);
  font-weight: 600;
}

.turnover-normal {
  color: var(--el-color-success);
  font-weight: 600;
}

.star-icon {
  margin-left: 4px;
  vertical-align: middle;
}

.sales-trend {
  padding: 12px;
  width: 200px;
}

.trend-title {
  font-size: 14px;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.trend-chart {
  height: 60px;
}

@media screen and (max-width: 1200px) {
  .movers-container {
    grid-template-columns: 1fr;
  }
}

/* 修改商品名称样式 */
.product-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  max-height: 2.8em;
  position: relative;
}

.product-info {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  position: relative;
}

.product-info:hover .product-name-tooltip {
  display: block;
}

.product-name-tooltip {
  display: none;
  position: absolute;
  left: 48px; /* 图片宽度(40px) + gap(8px) */
  top: 100%;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 12px;
  color: var(--el-text-color-primary);
  white-space: normal;
  word-break: break-all;
  max-width: 300px;
  z-index: 10;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

/* 风险库存明细表样式 */
.module-section {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0; /* 确保flex布局正常工作 */
}

.module-content {
  flex: 1;
  overflow: auto; /* 添加滚动条 */
  min-height: 0; /* 确保flex布局正常工作 */
}

/* 确保表格填充可用空间 */
.module-content :deep(.el-table) {
  height: 100%;
}

/* 确保表格内容可以滚动 */
.module-content :deep(.el-table__body-wrapper) {
  overflow-y: auto;
}
</style> 