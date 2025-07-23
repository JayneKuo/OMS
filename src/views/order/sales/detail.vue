<template>
  <div class="order-detail">
    <!-- 顶部导航栏 -->
    <div class="detail-header">
      <div class="header-main">
        <div class="left-section">
          <el-button link @click="$router.back()">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <h2 class="order-id">#{{ orderNo }}</h2>
          <el-tag 
            :type="getStatusType(orderStatus)" 
            size="small" 
            effect="plain"
          >
            {{ getStatusLabel(orderStatus) }}
          </el-tag>
        </div>

        <!-- 订单信息区域 -->
        <div class="order-info">
          <!-- 渠道路径 -->
          <div class="channel-flow">
            <span class="flow-item">Amazon</span>
            <el-icon class="arrow"><ArrowRight /></el-icon>
            <span class="flow-item">Shopify</span>
            <el-icon class="arrow"><ArrowRight /></el-icon>
            <span class="flow-item">OMS</span>
            <el-tag class="store-name">{{ platformInfo.currentChannel }}</el-tag>
          </div>
          
          <!-- 信息卡片区域 -->
          <div class="info-cards">
            <!-- Internal Info -->
            <div class="info-card">
              <div class="info-content">
                <div class="info-item">
                  <span class="label">Ingested</span>
                  <span class="value">{{ formatDate(orderBasicInfo.importDate) }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Updated</span>
                  <span class="value">{{ formatDate(orderBasicInfo.lastUpdateDate) }}</span>
                </div>
              </div>
            </div>

            <!-- External Source Info -->
            <div class="info-card">
              <div class="info-content">
                <div class="info-item">
                  <span class="label">Ordered</span>
                  <span class="value">{{ formatDate(orderBasicInfo.orderDate) }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Ship by Date</span>
                  <span class="value">{{ formatDate(orderBasicInfo.shipByDate) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="header-actions">
        <template v-if="isEditing">
          <el-button 
            class="cancel-button"
            @click="cancelEdit"
          >
            <el-icon><Close /></el-icon>
            Cancel
          </el-button>
          <el-button 
            class="edit-button"
            type="success"
            @click="toggleEdit"
          >
            <el-icon><Check /></el-icon>
            Save
          </el-button>
        </template>
        <template v-else>
          <el-button 
            class="edit-button"
            @click="toggleEdit"
          >
            <el-icon><EditPen /></el-icon>
            Edit
          </el-button>
        </template>
        <el-dropdown @command="handleAction">
          <el-button>
            Actions
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- Common Operations (Always Visible) -->
              <el-dropdown-item command="rawData">
                <el-icon><Document /></el-icon>
                Raw Data
              </el-dropdown-item>

              <!-- Status Related Operations -->
              <template v-if="hasAvailableActions">
                <el-dropdown-item divided></el-dropdown-item>
                <template v-for="action in availableActions" :key="action">
                  <el-dropdown-item :command="action">
                    <el-icon>
                      <component :is="getActionIcon(action)" />
                    </el-icon>
                    {{ getActionLabel(action) }}
                  </el-dropdown-item>
                </template>
              </template>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button 
          type="primary" 
          class="ship-button"
          :disabled="!canShipOrder || isEditing"
          @click="handleShipOrder"
        >
          <el-icon><Van /></el-icon>
          Ship Order
        </el-button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="detail-content">
      <!-- 左侧主要内容 -->
      <div class="main-section">


        <!-- 订单详情Tab区域 -->
        <div class="order-details-section">
          <div class="section-header">
            <h3>Order Details</h3>
            <div class="actions" v-if="isEditing && activeTab === 'items'">
              <el-button type="primary" link @click="handleAddProduct">
                <el-icon><Plus /></el-icon>
                Add Product
              </el-button>
        </div>
          </div>
          
          <el-tabs v-model="activeTab" type="border-card" class="order-tabs">
            <!-- Items Tab -->
            <el-tab-pane label="Items" name="items">
              <div class="tab-content">
                <div class="table-actions" v-if="isEditing">
                  <el-button type="primary" link @click="handleAddProduct">
                    <el-icon><Plus /></el-icon>
                    添加商品
                  </el-button>
                </div>
                <OrderItemsTable
                  :products="enhancedProducts"
                  :cancelled-products="cancelledProducts"
                  :returned-products="returnedProducts"
                  :exchanged-products="exchangedProducts"
                  :is-editing="isEditing"
                  @update:products="handleProductsUpdate"
                  @delete-product="handleDeleteProduct"
                  @quantity-change="handleShouldDispatchQuantityChange"
                />
              </div>
            </el-tab-pane>

            <!-- Dispatched Details Tab -->
            <el-tab-pane label="Allocation Order" name="dispatched">
              <DispatchDetails :dispatches="dispatchedDetails" />
            </el-tab-pane>

            <!-- Packages Tab -->
            <el-tab-pane label="Packages" name="packages">
              <div class="tab-content">
                <div class="table-container">
                  <el-table 
                    :data="packages" 
                    style="width: 100%;"
                    :expand-row-keys="expandedPackages"
                    row-key="packageId"
                  >
                    <el-table-column type="expand" width="50">
                      <template #default="{ row }">
                        <div class="expanded-items-section">
                          <div class="items-title">
                            <el-icon><Box /></el-icon>
                            <span>商品明细 (共{{ row.items.length }}个商品，{{ row.items.reduce((sum, item) => sum + item.quantity, 0) }}件)</span>
                          </div>
                          <div class="items-table-container">
                            <el-table :data="row.items" size="small" style="width: 100%;">
                              <el-table-column label="SKU" width="120" align="center">
                                <template #default="{ row: item }">
                                  <span>{{ item.sku }}</span>
                                </template>
                              </el-table-column>
                              <el-table-column label="商品名称" min-width="200">
                                <template #default="{ row: item }">
                                  <span class="item-name">{{ item.name || 'Product Name' }}</span>
                                </template>
                              </el-table-column>
                              <el-table-column label="SN NO." width="130" align="center">
                                <template #default="{ row: item }">
                                  <span class="number-highlight">{{ item.snCode || 'SN' + Math.random().toString().substr(2,8) }}</span>
                                </template>
                              </el-table-column>
                              <el-table-column label="Lot NO." width="120" align="center">
                                <template #default="{ row: item }">
                                  <span class="number-highlight">{{ item.lotNo || 'LOT' + Math.random().toString().substr(2,6) }}</span>
                                </template>
                              </el-table-column>
                              <el-table-column label="数量" width="80" align="center">
                                <template #default="{ row: item }">
                                  <span class="item-quantity">{{ item.quantity }}</span>
                                </template>
                              </el-table-column>
                              <el-table-column label="单位" width="80" align="center">
                                <template #default="{ row: item }">
                                  <span class="item-uom">{{ item.uom || 'PCS' }}</span>
                                </template>
                              </el-table-column>
                            </el-table>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <!-- 按照指定顺序排列的列 -->
                    <el-table-column label="Shipment NO." width="160" align="center">
                      <template #default="{ row }">
                        <span class="number-highlight">{{ row.shipmentNo }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="Pallet NO." width="140" align="center">
                      <template #default="{ row }">
                        <span>{{ row.palletNo }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="Package NO." width="150" align="center">
                      <template #default="{ row }">
                        <span>{{ row.packageId }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="Master Tracking NO." width="180" align="center">
                      <template #default="{ row }">
                        <span>{{ row.masterTrackingNumber }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="Tracking NO." width="160" align="center">
                      <template #default="{ row }">
                        <el-link 
                          v-if="row.trackingNumber"
                          type="primary" 
                          @click="handleTrackingClick(row.trackingNumber)"
                          class="tracking-link number-highlight"
                        >
                          {{ row.trackingNumber }}
                        </el-link>
                        <span v-else class="no-tracking">-</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="Carrier" width="130" align="center">
                      <template #default="{ row }">
                        <span>{{ row.carrier }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="Service" width="150" align="center">
                      <template #default="{ row }">
                        <span>{{ row.service }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="Weight" width="110" align="center">
                      <template #default="{ row }">
                        <span class="weight-display">{{ row.weight }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="Dimensions" width="150" align="center">
                      <template #default="{ row }">
                        <span class="dimensions-display">{{ row.dimensions }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 订单时间线 -->
        <div class="timeline-section">
          <div class="section-header">
                            <h3>Order Timeline</h3>
            <div class="actions">
              <el-button link type="primary" @click="showFullTimeline = !showFullTimeline">
                {{ showFullTimeline ? 'Collapse' : 'View Full Records' }}
              </el-button>
            </div>
          </div>
          
          <!-- 动态分类Tab -->
          <div class="timeline-filters">
            <el-tabs v-model="activeTimelineTab" type="card" class="timeline-tabs">
              <el-tab-pane label="All" name="all">
                <template #label>
                  <span class="tab-label">
                    <el-icon><List /></el-icon>
                    All
                    <el-badge :value="activities.length" class="tab-badge" />
                  </span>
                </template>
              </el-tab-pane>
              <el-tab-pane label="Dispatch" name="dispatch">
                <template #label>
                  <span class="tab-label">
                    <el-icon><Van /></el-icon>
                    Dispatch
                    <el-badge :value="getFilteredActivities('dispatch').length" class="tab-badge" />
                  </span>
                </template>
              </el-tab-pane>
              <el-tab-pane label="Update" name="update">
                <template #label>
                  <span class="tab-label">
                    <el-icon><EditPen /></el-icon>
                    Update
                    <el-badge :value="getFilteredActivities('update').length" class="tab-badge" />
                  </span>
                </template>
              </el-tab-pane>
              <el-tab-pane label="WMS" name="wms">
                <template #label>
                  <span class="tab-label">
                    <el-icon><Box /></el-icon>
                    WMS
                    <el-badge :value="getFilteredActivities('wms').length" class="tab-badge" />
                  </span>
                </template>
              </el-tab-pane>
              <el-tab-pane label="Logistics" name="logistics">
                <template #label>
                  <span class="tab-label">
                    <el-icon><Van /></el-icon>
                    Logistics
                    <el-badge :value="getFilteredActivities('logistics').length" class="tab-badge" />
                  </span>
                </template>
              </el-tab-pane>
              <el-tab-pane label="Customer" name="customer">
                <template #label>
                  <span class="tab-label">
                    <el-icon><User /></el-icon>
                    Customer
                    <el-badge :value="getFilteredActivities('customer').length" class="tab-badge" />
                  </span>
                </template>
              </el-tab-pane>
            </el-tabs>
            
            <!-- 高级筛选 -->
            <div class="advanced-filters">
              <el-button-group class="filter-buttons">
                <el-button 
                  v-for="filter in quickFilters" 
                  :key="filter.key"
                  :type="selectedFilters.includes(filter.key) ? 'primary' : ''"
                  :plain="!selectedFilters.includes(filter.key)"
                  size="small"
                  @click="toggleFilter(filter.key)"
                >
                  <el-icon><component :is="filter.icon" /></el-icon>
                  {{ filter.label }}
                  <el-badge :value="getFilterCount(filter.key)" class="filter-badge" />
                </el-button>
              </el-button-group>
              
              <el-button 
                v-if="selectedFilters.length > 0"
                type="danger" 
                link 
                size="small"
                @click="clearFilters"
              >
                <el-icon><RefreshLeft /></el-icon>
                Clear Filters
              </el-button>
            </div>
          </div>
          
          <!-- 分页后的时间轴 -->
          <div v-if="filteredPaginatedActivities.length > 0" class="timeline-content">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in filteredPaginatedActivities"
                :key="activity.timestamp + index"
                :timestamp="formatTimelineDate(activity.timestamp)"
                :type="activity.type"
                :icon="getTimelineIcon(activity.icon)"
              >
              <div class="timeline-item-content">
                <!-- 紧凑的头部信息 -->
                <div class="timeline-header">
                  <div class="header-main">
                    <h4 class="timeline-title">{{ activity.title }}</h4>
                    <el-tag 
                      :type="activity.type" 
                      size="small" 
                      effect="plain"
                      class="action-type-tag"
                    >
                      {{ activity.actionType }}
                    </el-tag>
                  </div>
                  <div class="header-meta">
                    <span class="actor">{{ activity.actor || activity.operator }}</span>
                    <span v-if="activity.object" class="object">{{ activity.object }}</span>
                  </div>
                </div>
                
                <!-- 内容描述 -->
                <p class="timeline-content">{{ activity.content }}</p>
                
                <!-- 来源/说明 -->
                <div v-if="activity.reason" class="timeline-reason">
                  <el-icon><InfoFilled /></el-icon>
                  <span>{{ activity.reason }}</span>
                </div>

                <!-- 紧凑的详情展开 -->
                <div v-if="activity.details && Object.keys(activity.details).length > 0" class="timeline-details">
                  <el-button 
                    link 
                    size="small"
                    @click="toggleDetails(currentPage * pageSize + index)"
                    class="details-toggle"
                  >
                    <el-icon>
                      <component :is="expandedItems.includes(currentPage * pageSize + index) ? 'ArrowUp' : 'More'" />
                    </el-icon>
                    Details
                  </el-button>
                  
                  <el-collapse-transition>
                    <div 
                      v-if="expandedItems.includes(currentPage * pageSize + index)" 
                      class="details-content"
                    >
                      <div class="detail-row" v-for="(value, key) in activity.details" :key="key">
                        <span class="detail-label">{{ formatDetailLabel(key) }}</span>
                        <span 
                          class="detail-value"
                          :class="{
                            'success': key.includes('result') && value === '通过',
                            'highlight': key.includes('amount') || key.includes('price') || key.includes('cost'),
                            'error': key.includes('error') || key.includes('fail'),
                            'code': key.includes('code') || key.includes('id') || key.includes('number')
                          }"
                        >
                          {{ typeof value === 'object' ? JSON.stringify(value) : value }}
                        </span>
                      </div>
                    </div>
                  </el-collapse-transition>
                </div>
              </div>
            </el-timeline-item>
            </el-timeline>
          </div>
          
          <!-- 无数据提示 -->
          <div v-else class="no-timeline-data">
            <el-empty description="No timeline records found for current filter conditions" />
          </div>
          
          <!-- 分页控件 -->
          <div v-if="!showFullTimeline && filteredActivities.length > pageSize" class="timeline-pagination">
                          <el-pagination
                background
                layout="prev, pager, next"
                :total="filteredActivities.length"
                :page-size="pageSize"
                :current-page="currentPage"
                @current-change="handlePageChange"
                small
              />
          </div>
        </div>
      </div>

      <!-- 右侧信息栏 -->
      <div class="side-section">
        <!-- Tab切换的信息卡片 -->
        <div class="info-card tab-card">
          <el-tabs type="border-card" class="custom-tabs">
            <el-tab-pane label="Basic Info">
              <div class="tab-content">
                <!-- 客户信息卡片 -->
                <div class="info-section">
                  <div class="section-title">
                    <div class="title-content">
                      <h4>客户信息</h4>
                    </div>
                  </div>
                  <div class="customer-info">
                    <div class="address-info">
                      <div class="address-section">
                        <div class="section-header">
                          <h5>收货地址</h5>
                          <el-button 
                            v-if="isEditing" 
                            type="primary" 
                            link 
                            class="edit-btn"
                            @click="handleEditShippingAddress"
                          >
                            <el-icon><EditPen /></el-icon>
                            编辑
                          </el-button>
                        </div>
                        <div class="address-content">
                          <template v-if="isEditing">
                            <el-form :model="customerInfo.shippingAddress" label-position="top">
                              <el-form-item label="收件人">
                                <el-input v-model="customerInfo.name" />
                              </el-form-item>
                              <el-form-item label="电话">
                                <el-input v-model="customerInfo.phone" />
                              </el-form-item>
                              <el-form-item label="地址行1">
                                <el-input v-model="customerInfo.shippingAddress.line1" />
                              </el-form-item>
                              <el-form-item label="地址行2">
                                <el-input v-model="customerInfo.shippingAddress.line2" />
                              </el-form-item>
                              <el-form-item label="城市">
                                <el-input v-model="customerInfo.shippingAddress.city" />
                              </el-form-item>
                              <el-form-item label="州/省">
                                <el-input v-model="customerInfo.shippingAddress.state" />
                              </el-form-item>
                              <el-form-item label="国家">
                                <el-input v-model="customerInfo.shippingAddress.country" />
                              </el-form-item>
                              <el-form-item label="邮编">
                                <el-input v-model="customerInfo.shippingAddress.zipCode" />
                              </el-form-item>
                            </el-form>
                          </template>
                          <template v-else>
                            <p class="name">{{ customerInfo.name }}</p>
                            <p class="phone">{{ customerInfo.phone }}</p>
                            <p>{{ customerInfo.shippingAddress.line1 }}</p>
                            <p>{{ customerInfo.shippingAddress.line2 }}</p>
                            <p>{{ customerInfo.shippingAddress.city }}, {{ customerInfo.shippingAddress.state }}</p>
                            <p>{{ customerInfo.shippingAddress.country }} {{ customerInfo.shippingAddress.zipCode }}</p>
                          </template>
                        </div>
                      </div>
                      <div class="address-section">
                        <div class="section-header">
                          <h5>账单地址</h5>
                          <el-button 
                            v-if="isEditing" 
                            type="primary" 
                            link 
                            class="edit-btn"
                            @click="handleEditBillingAddress"
                          >
                            <el-icon><EditPen /></el-icon>
                            编辑
                          </el-button>
                        </div>
                        <div class="address-content">
                          <template v-if="isEditing">
                            <el-form :model="customerInfo.billingAddress" label-position="top">
                              <el-form-item label="收件人">
                                <el-input v-model="customerInfo.name" />
                              </el-form-item>
                              <el-form-item label="电话">
                                <el-input v-model="customerInfo.phone" />
                              </el-form-item>
                              <el-form-item label="地址行1">
                                <el-input v-model="customerInfo.billingAddress.line1" />
                              </el-form-item>
                              <el-form-item label="地址行2">
                                <el-input v-model="customerInfo.billingAddress.line2" />
                              </el-form-item>
                              <el-form-item label="城市">
                                <el-input v-model="customerInfo.billingAddress.city" />
                              </el-form-item>
                              <el-form-item label="州/省">
                                <el-input v-model="customerInfo.billingAddress.state" />
                              </el-form-item>
                              <el-form-item label="国家">
                                <el-input v-model="customerInfo.billingAddress.country" />
                              </el-form-item>
                              <el-form-item label="邮编">
                                <el-input v-model="customerInfo.billingAddress.zipCode" />
                              </el-form-item>
                            </el-form>
                          </template>
                          <template v-else>
                            <p class="name">{{ customerInfo.name }}</p>
                            <p class="phone">{{ customerInfo.phone }}</p>
                            <p>{{ customerInfo.billingAddress.line1 }}</p>
                            <p>{{ customerInfo.billingAddress.line2 }}</p>
                            <p>{{ customerInfo.billingAddress.city }}, {{ customerInfo.billingAddress.state }}</p>
                            <p>{{ customerInfo.billingAddress.country }} {{ customerInfo.billingAddress.zipCode }}</p>
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 平台信息卡片 -->
                <div class="info-section">
                  <div class="section-title">
                    <h4>平台信息</h4>
                    <el-tag type="info" effect="plain">{{ platformInfo.sourceChannel.split('→')[1].trim() }}</el-tag>
                  </div>
                  <div class="info-list">
          <div class="info-item">
                      <span class="label">渠道中转路径</span>
                      <span class="value">{{ platformInfo.sourceChannel }}</span>
          </div>
          <div class="info-item">
                      <span class="label">渠道订单号</span>
                      <span class="value">{{ platformInfo.channelSalesOrderNo }}</span>
          </div>
          <div class="info-item">
                      <span class="label">原始平台</span>
                      <span class="value">{{ platformInfo.originalOrderSource }}</span>
          </div>
          <div class="info-item">
                      <span class="label">原始平台订单号</span>
                      <span class="value">{{ platformInfo.originalOrderId }}</span>
          </div>
          <div class="info-item">
                      <span class="label">采购订单号</span>
                      <span class="value">{{ platformInfo.purchaseOrderId }}</span>
          </div>
                    <div class="info-item">
                      <span class="label">引用编号 / 参考号</span>
                      <span class="value">{{ platformInfo.referenceNo }}</span>
        </div>
      </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="物流信息">
              <div class="tab-content">
                <!-- 物流与发货信息卡片 -->
                <div class="info-section">
                  <div class="section-title">
                    <h4>物流与发货信息</h4>
                    <el-tag type="primary" effect="plain">{{ shippingInfo.shipMethod }}</el-tag>
        </div>
                  <div class="info-list">
          <div class="info-item">
                      <span class="label">发货方式</span>
                      <span class="value">{{ shippingInfo.shipMethod }}</span>
          </div>
          <div class="info-item">
                      <span class="label">承运商</span>
                      <span class="value">{{ shippingInfo.carrier }}</span>
          </div>
                    <div class="info-item">
                      <span class="label">配送服务等级</span>
                      <span class="value">{{ shippingInfo.deliveryService }}</span>
          </div>
                    <div class="info-item tracking-numbers">
                      <span class="label">追踪单号</span>
                      <div class="tracking-list">
                        <div v-for="(tracking, index) in shippingInfo.trackingInfo" 
                             :key="index" 
                             class="tracking-item"
                        >
                          <div class="tracking-item-header">
                            <span class="sub-order">子单号: {{ tracking.subOrderNo }}</span>
                            <span class="carrier">{{ tracking.carrier }}</span>
                          </div>
                          <el-link 
                            type="primary" 
                            @click="showTrackingDetails(tracking)"
                            class="tracking-number"
                          >
                            {{ tracking.trackingNumber }}
                          </el-link>
                        </div>
                      </div>
                    </div>
                    <div class="info-item">
                      <span class="label">原始发运编码</span>
                      <span class="value">{{ shippingInfo.originalShippingCode }}</span>
                    </div>
        </div>
      </div>

                <!-- 发货时间信息卡片 -->
                <div class="info-section">
                  <div class="section-title">
                    <h4>发货时间信息</h4>
                    <el-tag 
                      :type="isOverdue ? 'danger' : 'success'" 
                      effect="plain"
                    >
                      {{ isOverdue ? '已超时' : '正常' }}
                    </el-tag>
        </div>
                  <div class="info-list">
          <div class="info-item">
                      <span class="label">请求发货时间</span>
                      <span class="value highlight-warning">{{ shippingTimeline.requestedShipDate }}</span>
          </div>
          <div class="info-item">
                      <span class="label">预计发货时间</span>
                      <span class="value">{{ shippingTimeline.estimatedShippingDate }}</span>
          </div>
                    <div class="info-item">
                      <span class="label">装车日期</span>
                      <span class="value">{{ shippingTimeline.loadedDate || '-' }}</span>
          </div>
                    <div class="info-item">
                      <span class="label">实际发货时间</span>
                      <span class="value highlight-success">{{ shippingTimeline.shipDate || '-' }}</span>
        </div>
      </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="支付信息">
              <div class="tab-content">
                <div class="info-section">
                  <div class="section-title">
                    <div class="title-content">
                      <h4>支付信息</h4>
                      <el-tag 
                        :type="paymentInfo.status === 'paid' ? 'success' : paymentInfo.status === 'pending' ? 'warning' : 'danger'" 
                        effect="plain"
                        class="status-tag"
                      >
                        {{ paymentInfo.statusText }}
          </el-tag>
        </div>
                  </div>

                  <!-- 金额信息 -->
                  <div class="amount-list">
          <div class="info-item">
                      <span class="label">商品小计</span>
                      <span class="value">${{ paymentInfo.subtotal.toFixed(2) }}</span>
          </div>
          <div class="info-item">
                      <span class="label">折扣金额</span>
                      <span class="value discount">-${{ paymentInfo.discount.toFixed(2) }}</span>
          </div>
          <div class="info-item">
                      <span class="label">运费</span>
                      <span class="value">${{ paymentInfo.shippingCost.toFixed(2) }}</span>
          </div>
          <div class="info-item">
                      <span class="label">税额</span>
                      <span class="value">${{ paymentInfo.tax.toFixed(2) }}</span>
          </div>
                    <div class="info-item total">
                      <span class="label">应付总额</span>
                      <span class="value">${{ paymentInfo.total.toFixed(2) }}</span>
                    </div>
                  </div>

                  <!-- 支付详情 -->
                  <div class="payment-details">
                    <div class="info-group">
          <div class="info-item">
                        <span class="label">支付时间</span>
                        <span class="value highlight">{{ paymentInfo.paymentTime }}</span>
          </div>
          <div class="info-item">
                        <span class="label">支付流水号</span>
                        <span class="value">{{ paymentInfo.transactionId }}</span>
          </div>
                      <div class="info-item">
                        <span class="label">发票号</span>
                        <span class="value">{{ paymentInfo.invoiceNo }}</span>
        </div>
      </div>
    </div>

                  <!-- 操作按钮 -->
                  <div class="action-group">
                    <el-button 
                      type="primary" 
                      link
                      @click="handleViewInvoice"
                    >
                      <el-icon><Document /></el-icon>
                      查看发票
                    </el-button>
                    <el-button 
                      type="primary" 
                      link
                      @click="handleDownloadInvoice"
                    >
                      <el-icon><Download /></el-icon>
                      下载发票
                    </el-button>
                    </div>
        </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="订单备注">
              <div class="tab-content">
                <div class="info-section">
                  <div class="section-title">
                    <div class="title-content">
                      <h4>订单备注</h4>
                      <el-button 
                        v-if="!isEditingNotes" 
                        type="primary" 
                        link 
                        class="edit-btn"
                        @click="startEditNotes"
                      >
                        <el-icon><EditPen /></el-icon>
                        编辑
                      </el-button>
                    </div>
                  </div>

                  <!-- 内部备注 -->
                  <div class="notes-section">
                    <div class="notes-header">
                      <h5>内部备注</h5>
                      <span class="notes-desc">仅内部可见</span>
                    </div>
                    <div class="notes-content">
                      <template v-if="isEditingNotes">
                        <el-input 
                          v-model="orderNotes.internal"
                          type="textarea"
                          :rows="4"
                          placeholder="添加内部备注..."
                          class="notes-textarea"
                        />
                      </template>
                      <template v-else>
                        <p v-if="orderNotes.internal" class="notes-text">{{ orderNotes.internal }}</p>
                        <p v-else class="empty-notes">暂无内部备注</p>
                      </template>
                    </div>
                  </div>

                  <!-- 客户备注 -->
                  <div class="notes-section">
                    <div class="notes-header">
                      <h5>客户备注</h5>
                      <span class="notes-desc">客户可见</span>
                    </div>
                    <div class="notes-content">
                      <template v-if="isEditingNotes">
                        <el-input 
                          v-model="orderNotes.customer"
                          type="textarea"
                          :rows="3"
                          placeholder="添加客户备注..."
                          class="notes-textarea"
                        />
                      </template>
                      <template v-else>
                        <p v-if="orderNotes.customer" class="notes-text">{{ orderNotes.customer }}</p>
                        <p v-else class="empty-notes">暂无客户备注</p>
                      </template>
                    </div>
                  </div>



                  <!-- 编辑按钮 -->
                  <div v-if="isEditingNotes" class="notes-actions">
                    <el-button 
                      type="primary" 
                      @click="saveNotes"
                    >
                      <el-icon><Check /></el-icon>
                      保存
                    </el-button>
                    <el-button @click="cancelEditNotes">取消</el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane v-if="returnInfo.isReturn" label="退货信息">
              <div class="tab-content">
                <div class="section-title">
                  <h4>退货信息</h4>
                  <el-tag type="warning" effect="plain">退货单</el-tag>
          </div>
                <div class="info-list">
                  <div class="info-item">
                    <span class="label">退货发起平台</span>
                    <span class="value">{{ returnInfo.returnSource }}</span>
        </div>
                  <div class="info-item">
                    <span class="label">退货类型</span>
                    <span class="value">{{ returnInfo.returnType }}</span>
      </div>
                  <div class="info-item">
                    <span class="label">退货编号</span>
                    <span class="value">{{ returnInfo.returnReferenceNo }}</span>
      </div>
                  <div class="info-item">
                    <span class="label">关联原始订单</span>
                    <span class="value">{{ returnInfo.originOrderId }}</span>
    </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>

  <!-- 物流跟踪详情弹窗 -->
  <el-dialog
    v-model="trackingDialogVisible"
    :title="`物流跟踪详情 - ${selectedTracking.trackingNumber}`"
    width="800px"
    class="tracking-dialog"
  >
    <div class="tracking-detail-content">
      <!-- 基本信息 -->
      <div class="tracking-header">
        <div class="tracking-info">
          <div class="info-row">
            <span class="label">运单号:</span>
            <span class="value">{{ selectedTracking.trackingNumber }}</span>
          </div>
          <div class="info-row">
            <span class="label">承运商:</span>
            <span class="value">{{ selectedTracking.carrier }}</span>
          </div>
          <div class="info-row">
            <span class="label">子单号:</span>
            <span class="value">{{ selectedTracking.subOrderNo }}</span>
          </div>
          <div class="info-row">
            <span class="label">当前状态:</span>
            <el-tag :type="getTrackingStatusType(selectedTracking.currentStatus)" size="small">
              {{ selectedTracking.currentStatus }}
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 物流时间轴 -->
      <div class="tracking-timeline">
        <h4>物流轨迹</h4>
        <el-timeline>
          <el-timeline-item
            v-for="(event, index) in selectedTracking.trackingEvents"
            :key="index"
            :timestamp="`${event.date} ${event.time}`"
            :type="getTimelineEventType(event.status)"
            :icon="getTimelineEventIcon(event.status)"
            :color="getTimelineEventColor(event.status)"
          >
            <div class="timeline-event">
              <div class="event-header">
                <h5 class="event-status">{{ event.status }}</h5>
                <span class="event-location">{{ event.location }}</span>
              </div>
              <p class="event-description">{{ event.description }}</p>
              <div class="event-meta" v-if="event.facility">
                <span class="facility">设施: {{ event.facility }}</span>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button 
          type="primary" 
          @click="openCarrierTracking(selectedTracking)"
        >
          <el-icon><Link /></el-icon>
          查看承运商官网
        </el-button>
        <el-button @click="trackingDialogVisible = false">关闭</el-button>
  </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  EditPen, 
  Document, 
  Download, 
  ArrowDown, 
  ArrowUp,
  Location, 
  Edit, 
  Plus, 
  Delete, 
  Van,
  CircleClose,
  VideoPlay,
  CirclePlus,
  Remove,
  SwitchButton,
  Connection,
  Close,
  Check,
  Warning,
  Loading,
  More,
  Refresh,
  Timer,
  User,
  Box,
  DataBoard,
  CreditCard,
  InfoFilled,
  Lock,
  Calendar,
  Tools,
  CollectionTag,
  PhoneFilled,
  RemoveFilled,
  Operation,
  Select,
  Upload,
  Position,
  RefreshLeft,
  Back,
  CircleCheck
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { OrderAction, STATUS_CONFIG } from './types'
import { OrderStatus } from '@/types/order'
import DispatchDetails from './components/DispatchDetails.vue'
import OrderItemsTable from './components/OrderItemsTable.vue'

// 定义 DispatchedDetail 接口
interface DispatchItem {
  sku: string
  name?: string
  quantity: number
  fulfilledQuantity?: number
}

interface DispatchedDetail {
  dispatchId: string
  warehouse: string
  warehouseCode: string
  status: string
  carrier: string
  trackingNumber?: string
  trackingUrl?: string
  shipDate?: string
  estimatedDelivery?: string
  orderTime?: string
  reviewTime?: string
  cancelTime?: string
  items: DispatchItem[]
}

const route = useRoute()
const currentOrderStatus = ref<OrderStatus>(OrderStatus.Pending) // 设置为Pending状态用于测试
const showInfoDialog = ref(false) // 控制信息弹窗的显示状态

// 订单状态（与currentOrderStatus保持一致，用于状态标签显示）
const orderStatus = computed(() => currentOrderStatus.value)

// 初始化订单状态
onMounted(() => {
  const status = route.query.status as string
  if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
    currentOrderStatus.value = status as OrderStatus
  }
})



// 商品数据
interface Product {
  id: string;
  name: string;
  category: string;
  status: string;
  quantity: number;
  uom: string; // 计量单位
  price: number;
  discount: number; // 折扣
  tax: number;
  amount: number;
  snCode: string; // SN编码
  remarks: string; // 商品备注
  color: string;
}

// 先定义customerInfo的类型
interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  shippingAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    phone: string;
  };
  billingAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    phone: string;
  };
}

interface BackupData {
  products: Product[] | null;
  customerInfo: CustomerInfo | null;
}

const products = ref<Product[]>([
  {
    id: 'P001',
    name: 'Item name',
    category: '{{category}} {{type}} {{size}}',
    status: 'Ready',
    quantity: 1,
    uom: 'PCS',
    price: 20.00,
    discount: 0.00,
    tax: 3.00,
    amount: 60.00,
    snCode: 'SN001234567',
    remarks: '备注信息1',
    color: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)'
  },
  {
    id: 'P002',
    name: 'Item name',
    category: '{{category}} {{type}} {{size}}',
    status: 'Packaging',
    quantity: 5,
    uom: 'PCS',
    price: 20.00,
    discount: 2.00,
    tax: 3.00,
    amount: 20.00,
    snCode: 'SN001234568',
    remarks: '备注信息2',
    color: 'linear-gradient(45deg, #FFE66D, #4ECDC4)'
  }
])

// 增强商品数据结构
interface EnhancedProduct {
  id: string;
  name: string;
  category: string;
  snCode: string;
  uom: string;
  price: number;
  discount: number; // 折扣金额
  tax: number; // 税费
  color: string;
  originalQuantity: number; // 原始购买数量
  shouldDispatchQuantity: number; // 应发货数量
  dispatchedQuantity: number; // 已下发数量
  shippedQuantity: number; // 已shipped数量
  fulfillmentQuantity: number; // 当前需要履约的数量
  cancelledQuantity: number; // 已取消数量
  returnedQuantity: number; // 已退货数量
  exchangedQuantity: number; // 已换货数量
  refundedQuantity: number; // 已退款数量
  productStatus: string; // 商品状态：待发货、已取消、已退款、已退货
  fulfillmentStatus: string; // 履约状态：NO_FULFILLMENT|HOLD|TO_BE_DISPATCHED|DISPATCHED|PARTIALLY_DISPATCHED|CANCELED|PARTIALLY_SHIPPED|SHIPPED|SHORT_SHIPPED
  hasOperations: boolean; // 是否有操作历史
  operationTypes: string[]; // 操作类型列表
  history: ProductHistoryRecord[]; // 操作历史
  isExchangeProduct?: boolean; // 是否为换货商品
  originalProductId?: string; // 原商品ID（换货商品使用）
  holdReason?: string; // Hold 原因
}

// 商品操作历史记录
interface ProductHistoryRecord {
  type: string; // cancel, return, exchange, refund
  action: string; // 操作描述
  beforeQuantity: number; // 操作前数量
  afterQuantity: number; // 操作后数量
  reason: string; // 操作原因
  time: string; // 操作时间
}

// 展开的商品列表
const expandedProducts = ref<string[]>([])

// 增强商品数据
const enhancedProducts = computed<EnhancedProduct[]>(() => {
  return [
    {
      id: 'P001',
      name: '蓝色连衣裙',
      category: '女装 | 连衣裙 | M码',
      snCode: 'SN001234567',
      uom: 'PCS',
      price: 89.99,
      discount: 5.00, // 折扣金额
      tax: 8.10, // 税费
      color: 'linear-gradient(45deg, #3B82F6, #1E40AF)',
      originalQuantity: 3, // 购买数量
      cancelledQuantity: 1, // 取消数量
      returnedQuantity: 0, // 退货数量
      exchangedQuantity: 0, // 换货数量（退回的数量）
      refundedQuantity: 0, // 退款数量
      dispatchedQuantity: 1, // 已下发数量
      shippedQuantity: 1, // 已shipped数量
      // 应发货数量 = 购买数量 - 取消数量 - 退款数量 - 退货数量 - 换货数量
      shouldDispatchQuantity: 3 - 1 - 0 - 0 - 0, // = 2
      fulfillmentQuantity: 2,
      productStatus: '待发货',
      fulfillmentStatus: 'PARTIALLY_SHIPPED',
      hasOperations: true,
      operationTypes: ['cancel'],
      history: [
        {
          type: 'cancel',
          action: '客户取消部分数量',
          beforeQuantity: 3,
          afterQuantity: 2,
          reason: '客户主动取消，不需要此商品',
          time: '2024-02-16 14:30:00'
        }
      ]
    },
    {
      id: 'P002',
      name: '红色T恤',
      category: '男装 | T恤 | L码',
      snCode: 'SN001234568',
      uom: 'PCS',
      price: 29.99,
      discount: 0.00, // 无折扣
      tax: 2.70, // 税费
      color: 'linear-gradient(45deg, #EF4444, #DC2626)',
      originalQuantity: 5, // 购买数量
      cancelledQuantity: 0, // 取消数量
      returnedQuantity: 2, // 退货数量
      exchangedQuantity: 0, // 换货数量（退回的数量）
      refundedQuantity: 0, // 退款数量
      dispatchedQuantity: 3, // 已下发数量
      shippedQuantity: 2, // 已shipped数量
      // 应发货数量 = 购买数量 - 取消数量 - 退款数量 - 退货数量 - 换货数量
      shouldDispatchQuantity: 5 - 0 - 0 - 2 - 0, // = 3
      fulfillmentQuantity: 3,
      productStatus: '已退货',
      fulfillmentStatus: 'DISPATCHED',
      hasOperations: true,
      operationTypes: ['return'],
      history: [
        {
          type: 'return',
          action: '客户申请退货',
          beforeQuantity: 5,
          afterQuantity: 3,
          reason: '商品存在质量问题，线头较多',
          time: '2024-02-18 10:15:00'
        }
      ]
    },
    {
      id: 'P003',
      name: '黑色运动鞋',
      category: '鞋类 | 运动鞋 | 42码',
      snCode: 'SN001234569',
      uom: 'PAIR',
      price: 199.99,
      discount: 20.00, // 折扣金额
      tax: 18.00, // 税费
      color: 'linear-gradient(45deg, #374151, #111827)',
      originalQuantity: 2, // 购买数量
      cancelledQuantity: 0, // 取消数量
      returnedQuantity: 0, // 退货数量
      exchangedQuantity: 1, // 换货数量（退回的数量）
      refundedQuantity: 0, // 退款数量
      dispatchedQuantity: 1, // 已下发数量
      shippedQuantity: 0, // 已shipped数量
      // 应发货数量 = 购买数量 - 取消数量 - 退款数量 - 退货数量 - 换货数量
      shouldDispatchQuantity: 2 - 0 - 0 - 0 - 1, // = 1
      fulfillmentQuantity: 1,
      productStatus: '待发货',
      fulfillmentStatus: 'DISPATCHED',
      hasOperations: true,
      operationTypes: ['exchange'],
      history: [
        {
          type: 'exchange',
          action: '客户申请换货',
          beforeQuantity: 2,
          afterQuantity: 1,
          reason: '尺码不合适，需要换大一码（原商品退回）',
          time: '2024-02-17 16:20:00'
        }
      ]
    },
    {
      id: 'P003-EX', // 换货商品ID
      name: '黑色运动鞋',
      category: '鞋类 | 运动鞋 | 43码', // 换大一码
      snCode: 'SN001234569-EX',
      uom: 'PAIR',
      price: 199.99,
      discount: 20.00, // 折扣金额（继承原商品）
      tax: 18.00, // 税费（继承原商品）
      color: 'linear-gradient(45deg, #374151, #111827)',
      originalQuantity: 1, // 换货新增数量
      cancelledQuantity: 0, // 取消数量
      returnedQuantity: 0, // 退货数量
      exchangedQuantity: 0, // 换货数量（退回的数量）
      refundedQuantity: 0, // 退款数量
      dispatchedQuantity: 0, // 已下发数量
      shippedQuantity: 0, // 已shipped数量
      // 应发货数量 = 购买数量 - 取消数量 - 退款数量 - 退货数量 - 换货数量
      shouldDispatchQuantity: 1 - 0 - 0 - 0 - 0, // = 1
      fulfillmentQuantity: 1,
      productStatus: '待发货',
      fulfillmentStatus: 'TO_BE_DISPATCHED',
      hasOperations: true,
      operationTypes: ['exchange_new'],
      isExchangeProduct: true, // 标记为换货商品
      originalProductId: 'P003', // 关联原商品ID
      history: [
        {
          type: 'exchange_new',
          action: '换货新商品生成',
          beforeQuantity: 0,
          afterQuantity: 1,
          reason: '客户换货：42码换43码',
          time: '2024-02-17 16:20:00'
        }
      ]
    },
    {
      id: 'P004',
      name: '白色衬衫',
      category: '男装 | 衬衫 | XL码',
      snCode: 'SN001234570',
      uom: 'PCS',
      price: 79.99,
      discount: 10.00, // 折扣金额
      tax: 7.20, // 税费
      color: 'linear-gradient(45deg, #F8FAFC, #E2E8F0)',
      originalQuantity: 2, // 购买数量
      cancelledQuantity: 0, // 取消数量
      returnedQuantity: 0, // 退货数量
      exchangedQuantity: 0, // 换货数量（退回的数量）
      refundedQuantity: 0, // 退款数量
      dispatchedQuantity: 0, // 已下发数量
      shippedQuantity: 0, // 已shipped数量
      // 应发货数量 = 购买数量 - 取消数量 - 退款数量 - 退货数量 - 换货数量
      shouldDispatchQuantity: 2 - 0 - 0 - 0 - 0, // = 2
      fulfillmentQuantity: 2,
      productStatus: '待发货',
      fulfillmentStatus: 'TO_BE_DISPATCHED',
      hasOperations: false,
      operationTypes: [],
      history: []
    },
    {
      id: 'P005',
      name: '绿色运动裤',
      category: '运动服 | 运动裤 | L码',
      snCode: 'SN001234571',
      uom: 'PCS',
      price: 49.99,
      discount: 0.00, // 无折扣
      tax: 4.50, // 税费
      color: 'linear-gradient(45deg, #34D399, #10B981)',
      originalQuantity: 3, // 购买数量
      cancelledQuantity: 0, // 取消数量
      returnedQuantity: 0, // 退货数量
      exchangedQuantity: 0, // 换货数量（退回的数量）
      refundedQuantity: 0, // 退款数量
      dispatchedQuantity: 0, // 已下发数量
      shippedQuantity: 0, // 已shipped数量
      // 应发货数量 = 购买数量 - 取消数量 - 退款数量 - 退货数量 - 换货数量
      shouldDispatchQuantity: 3 - 0 - 0 - 0 - 0, // = 3
      fulfillmentQuantity: 3,
      productStatus: '待发货',
      fulfillmentStatus: 'TO_BE_DISPATCHED',
      hasOperations: false,
      operationTypes: [],
      history: [],
      holdReason: '库存不足，等待补货 (ETA: 2024-02-25)'
    },
    {
      id: 'P006',
      name: '蓝色牛仔裤',
      category: '男装 | 牛仔裤 | 32码',
      snCode: 'SN001234572',
      uom: 'PCS',
      price: 69.99,
      discount: 5.00, // 折扣金额
      tax: 6.30, // 税费
      color: 'linear-gradient(45deg, #3B82F6, #1E40AF)',
      originalQuantity: 2, // 购买数量
      cancelledQuantity: 0, // 取消数量
      returnedQuantity: 0, // 退货数量
      exchangedQuantity: 0, // 换货数量（退回的数量）
      refundedQuantity: 0, // 退款数量
      dispatchedQuantity: 0, // 已下发数量
      shippedQuantity: 0, // 已shipped数量
      // 应发货数量 = 购买数量 - 取消数量 - 退款数量 - 退货数量 - 换货数量
      shouldDispatchQuantity: 2 - 0 - 0 - 0 - 0, // = 2
      fulfillmentQuantity: 2,
      productStatus: '待发货',
      fulfillmentStatus: 'TO_BE_DISPATCHED',
      hasOperations: false,
      operationTypes: [],
      history: [],
      holdReason: '质检不通过，等待品控确认'
    },
    {
      id: 'P007',
      name: '红色运动套装',
      category: '运动服 | 运动套装 | M码',
      snCode: 'SN001234573',
      uom: 'SET',
      price: 99.99,
      discount: 10.00, // 折扣金额
      tax: 9.00, // 税费
      color: 'linear-gradient(45deg, #EF4444, #DC2626)',
      originalQuantity: 1, // 购买数量
      cancelledQuantity: 0, // 取消数量
      returnedQuantity: 0, // 退货数量
      exchangedQuantity: 0, // 换货数量（退回的数量）
      refundedQuantity: 0, // 退款数量
      dispatchedQuantity: 0, // 已下发数量
      shippedQuantity: 0, // 已shipped数量
      // 应发货数量 = 购买数量 - 取消数量 - 退款数量 - 退货数量 - 换货数量
      shouldDispatchQuantity: 1 - 0 - 0 - 0 - 0, // = 1
      fulfillmentQuantity: 1,
      productStatus: '待发货',
      fulfillmentStatus: 'TO_BE_DISPATCHED',
      hasOperations: false,
      operationTypes: [],
      history: [],
      holdReason: 'Order matched pre-sale rule: Product will continue fulfillment after Sep 09, 2025 09:00 AM (Pre-sale Activity Rule #PS20240001)'
    }
  ]
})

// 取消商品数据结构
interface CancelledProduct extends Product {
  cancelReason: string;
  cancelTime: string;
}

// 退货商品数据结构
interface ReturnedProduct extends Product {
  returnQuantity: number;
  returnReason: string;
  returnStatus: string;
  returnTime: string;
}

// 换货商品数据结构
interface ExchangedProduct {
  id: string;
  originalProduct: Product;
  newProduct: Product;
  exchangeReason: string;
  exchangeStatus: string;
  exchangeTime: string;
  priceDifference: number;
}

// 取消商品列表
const cancelledProducts = ref<CancelledProduct[]>([
  {
    id: 'CP001',
    name: '蓝色连衣裙',
    category: '女装 | 连衣裙 | M码',
    status: 'Cancelled',
    quantity: 2,
    uom: 'PCS',
    price: 89.99,
    discount: 5.00,
    tax: 8.10,
    amount: 179.98,
    snCode: 'SN001234569',
    remarks: '客户要求取消',
    color: 'linear-gradient(45deg, #3B82F6, #1E40AF)',
    cancelReason: '客户主动取消，不需要此商品',
    cancelTime: '2024-02-16 14:30:00'
  }
])

// 退货商品列表
const returnedProducts = ref<ReturnedProduct[]>([
  {
    id: 'RP001',
    name: '红色T恤',
    category: '男装 | T恤 | L码',
    status: 'Returned',
    quantity: 3,
    uom: 'PCS',
    price: 29.99,
    discount: 0.00,
    tax: 2.70,
    amount: 89.97,
    snCode: 'SN001234570',
    remarks: '质量问题退货',
    color: 'linear-gradient(45deg, #EF4444, #DC2626)',
    returnQuantity: 1,
    returnReason: '商品存在质量问题，线头较多',
    returnStatus: '退款完成',
    returnTime: '2024-02-18 10:15:00'
  }
])

// 换货商品列表
const exchangedProducts = ref<ExchangedProduct[]>([
  {
    id: 'EP001',
    originalProduct: {
      id: 'OP001',
      name: '黑色运动鞋',
      category: '鞋类 | 运动鞋 | 42码',
      status: 'Exchanged',
      quantity: 1,
      uom: 'PAIR',
      price: 199.99,
      discount: 20.00,
      tax: 18.00,
      amount: 179.99,
      snCode: 'SN001234571',
      remarks: '换码',
      color: 'linear-gradient(45deg, #374151, #111827)'
    },
    newProduct: {
      id: 'NP001',
      name: '黑色运动鞋',
      category: '鞋类 | 运动鞋 | 43码',
      status: 'Ready',
      quantity: 1,
      uom: 'PAIR',
      price: 199.99,
      discount: 20.00,
      tax: 18.00,
      amount: 179.99,
      snCode: 'SN001234572',
      remarks: '换大一码',
      color: 'linear-gradient(45deg, #374151, #111827)'
    },
    exchangeReason: '尺码不合适，需要换大一码',
    exchangeStatus: '换货完成',
    exchangeTime: '2024-02-17 16:20:00',
    priceDifference: 0.00
  }
])

// Dispatched Details 数据
interface DispatchedDetail {
  dispatchId: string;
  warehouse: string;
  warehouseCode: string;
  status: string;
  carrier: string;
  trackingNumber?: string;
  trackingUrl?: string;
  shipDate?: string;
  estimatedDelivery?: string;
  items: {
    sku: string;
    quantity: number;
  }[];
  allocatedTime?: string;
  receivedTime?: string;
  committedTime?: string;
  pickedTime?: string;
  packedTime?: string;
  loadedTime?: string;
  partiallyShippedTime?: string;
  shippedTime?: string;
  shortShippedTime?: string;
  cancelTime?: string;
}

const dispatchedDetails = ref<DispatchedDetail[]>([
  {
    dispatchId: 'D002',
    warehouse: 'Valley View',
    warehouseCode: 'VV001',
    status: 'Warehouse Cancelled',
    carrier: '顺丰快递',
    trackingNumber: undefined,
    trackingUrl: undefined,
    // 时间线节点时间 - 展示在 Packed 状态下被仓库取消
    allocatedTime: '2024-02-17 10:48:00',
    receivedTime: '2024-02-17 11:00:00',
    committedTime: '2024-02-17 11:15:00',
    pickedTime: '2024-02-17 11:30:00',
    packedTime: '2024-02-17 11:45:00',
    loadedTime: undefined,
    partiallyShippedTime: undefined,
    shippedTime: undefined,
    shortShippedTime: undefined,
    cancelTime: '2024-02-17 11:50:00',
    // 其他时间
    shipDate: undefined,
    estimatedDelivery: '2024-02-20 16:00:00',
    items: [
      { 
        sku: 'SKU002',
        name: 'iPhone 15 Pro Max',
        quantity: 1,
        fulfilledQuantity: 0
      }
    ]
  },
  {
    dispatchId: 'D003',
    warehouse: 'Valley View',
    warehouseCode: 'VV001',
    status: 'Cancelled',
    carrier: '顺丰快递',
    trackingNumber: undefined,
    trackingUrl: undefined,
    // 时间线节点时间 - 展示在 Allocated 状态下被取消
    allocatedTime: '2024-02-17 10:48:00',
    receivedTime: undefined,
    committedTime: undefined,
    pickedTime: undefined,
    packedTime: undefined,
    loadedTime: undefined,
    partiallyShippedTime: undefined,
    shippedTime: undefined,
    shortShippedTime: undefined,
    cancelTime: '2024-02-17 10:55:00',
    // 其他时间
    shipDate: undefined,
    estimatedDelivery: '2024-02-20 16:00:00',
    items: [
      { 
        sku: 'SKU003',
        name: 'iPhone 15',
        quantity: 1,
        fulfilledQuantity: 0
      }
    ]
  },
  {
    dispatchId: 'D001',
    warehouse: 'Valley View',
    warehouseCode: 'VV001',
    status: 'Allocated',
    carrier: '顺丰快递',
    trackingNumber: undefined,
    trackingUrl: undefined,
    // 时间线节点时间
    allocatedTime: '2024-02-17 10:48:00',
    receivedTime: undefined,
    committedTime: undefined,
    pickedTime: undefined,
    packedTime: undefined,
    loadedTime: undefined,
    partiallyShippedTime: undefined,
    shippedTime: undefined,
    shortShippedTime: undefined,
    cancelTime: undefined,
    // 其他时间
    shipDate: undefined,
    estimatedDelivery: '2024-02-20 16:00:00',
    items: [
      { 
        sku: 'SKU001',
        name: 'iPhone 15 Pro',
        quantity: 1,
        fulfilledQuantity: 0
      }
    ]
  },
  {
    dispatchId: 'D002',
    warehouse: 'Valley View',
    warehouseCode: 'VV001',
    status: 'Warehouse Received',
    carrier: null,
    trackingNumber: null,
    trackingUrl: null,
    shipDate: null,
    estimatedDelivery: '2024-02-20 16:00:00',
    orderTime: '2024-02-17 09:30:00',
    reviewTime: '2024-02-17 09:35:00',
    cancelTime: null,
    items: [
      { 
        sku: 'SKU002',
        name: 'AirPods Pro',
        quantity: 2,
        fulfilledQuantity: 0
      }
    ]
  },
  {
    dispatchId: 'D003',
    warehouse: 'Valley View',
    warehouseCode: 'VV001',
    status: 'Picked',
    carrier: '',
    trackingNumber: undefined,
    trackingUrl: undefined,
    shipDate: undefined,
    estimatedDelivery: '2024-02-19 16:00:00',
    orderTime: '2024-02-17 08:20:00',
    reviewTime: '2024-02-17 08:25:00',
    cancelTime: undefined,
    items: [
      { 
        sku: 'SKU003',
        name: 'MacBook Pro',
        quantity: 1,
        fulfilledQuantity: 0
      }
    ]
  },
  {
    dispatchId: 'D004',
    warehouse: 'Valley View',
    warehouseCode: 'VV001',
    status: 'Packed',
    carrier: '顺丰快递',
    trackingNumber: null,
    trackingUrl: null,
    shipDate: null,
    estimatedDelivery: '2024-02-19 16:00:00',
    orderTime: '2024-02-17 07:15:00',
    reviewTime: '2024-02-17 07:20:00',
    cancelTime: null,
    items: [
      { 
        sku: 'SKU004',
        name: 'iPad Pro',
        quantity: 1,
        fulfilledQuantity: 0
      }
    ]
  },
  {
    dispatchId: 'D005',
    warehouse: 'Valley View',
    warehouseCode: 'VV001',
    status: 'Shipped',
    carrier: '顺丰快递',
    trackingNumber: 'SF7234567890',
    trackingUrl: 'https://www.sf-express.com/tracking',
    shipDate: '2024-02-17 14:30:00',
    estimatedDelivery: '2024-02-18 16:00:00',
    orderTime: '2024-02-17 06:00:00',
    reviewTime: '2024-02-17 06:05:00',
    cancelTime: null,
    items: [
      { 
        sku: 'SKU005',
        name: 'Apple Watch',
        quantity: 1,
        fulfilledQuantity: 1
      }
    ]
  },
  {
    dispatchId: 'D006',
    warehouse: 'Valley View',
    warehouseCode: 'VV001',
    status: 'Exception',
    carrier: '',
    trackingNumber: undefined,
    trackingUrl: undefined,
    shipDate: undefined,
    estimatedDelivery: '2024-02-19 16:00:00',
    orderTime: '2024-02-17 05:00:00',
    reviewTime: '2024-02-17 05:05:00',
    cancelTime: undefined,
    items: [
      { 
        sku: 'SKU006',
        name: 'Magic Keyboard',
        quantity: 1,
        fulfilledQuantity: 0
      }
    ]
  },
  {
    dispatchId: 'D007',
    warehouse: 'Valley View',
    warehouseCode: 'VV001',
    status: 'On Hold',
    carrier: null,
    trackingNumber: null,
    trackingUrl: null,
    shipDate: null,
    estimatedDelivery: '2024-02-20 16:00:00',
    orderTime: '2024-02-17 04:00:00',
    reviewTime: '2024-02-17 04:05:00',
    cancelTime: null,
    items: [
      { 
        sku: 'SKU007',
        name: 'Magic Mouse',
        quantity: 1,
        fulfilledQuantity: 0
      }
    ]
  },
  {
    dispatchId: 'D008',
    warehouse: 'Valley View',
    warehouseCode: 'VV001',
    status: 'Cancelled',
    carrier: null,
    trackingNumber: null,
    trackingUrl: null,
    shipDate: null,
    estimatedDelivery: '2024-02-19 16:00:00',
    orderTime: '2024-02-17 03:00:00',
    reviewTime: '2024-02-17 03:05:00',
    cancelTime: '2024-02-17 03:30:00',
    items: [
      { 
        sku: 'SKU008',
        name: 'AirTag',
        quantity: 4,
        fulfilledQuantity: 0
      }
    ]
  }
])

// Packages 数据
interface Package {
  packageId: string;
  dispatchId: string;
  shipmentNo: string;
  palletNo: string;
  carrier: string;
  service: string;
  masterTrackingNumber: string;
  status: string;
  weight: string;
  dimensions: string;
  trackingNumber?: string;
  trackingUrl?: string;
  lastUpdate: string;
  items: {
    sku?: string;
    name: string;
    quantity: number;
  }[];
}

const packages = ref<Package[]>([
  {
    packageId: 'PKG789-01',
    dispatchId: 'D789',
    shipmentNo: 'SHP2024021801',
    palletNo: 'PLT-SH-001',
    carrier: '顺丰速运',
    service: 'SF Standard',
    masterTrackingNumber: 'MST7234567890',
    status: 'Shipped',
    weight: '2.3kg',
    dimensions: '35×25×15cm',
    trackingNumber: 'SF7234567890',
    trackingUrl: 'https://www.sf-express.com/tracking',
    lastUpdate: '2024-02-18 14:30:00',
    items: [
      { sku: 'SKU-001', name: '蓝色连衣裙', quantity: 2 },
      { sku: 'SKU-002', name: '红色T恤', quantity: 1 }
    ]
  },
  {
    packageId: 'PKG789-02',
    dispatchId: 'D789',
    shipmentNo: 'SHP2024021802',
    palletNo: 'PLT-SH-001',
    carrier: '顺丰速运',
    service: 'SF Standard',
    masterTrackingNumber: 'MST7234567890',
    status: 'Shipped',
    weight: '1.8kg',
    dimensions: '25×20×12cm',
    trackingNumber: 'SF7234567890',
    trackingUrl: 'https://www.sf-express.com/tracking',
    lastUpdate: '2024-02-18 14:30:00',
    items: [
      { sku: 'SKU-003', name: '黑色牛仔裤', quantity: 3 }
    ]
  },
  {
    packageId: 'PKG456-01',
    dispatchId: 'D456',
    shipmentNo: 'SHP2024021703',
    palletNo: 'PLT-BJ-002',
    carrier: '中通快递',
    service: 'ZTO Express',
    masterTrackingNumber: 'MST8876543210',
    status: 'Shipped',
    weight: '1.5kg',
    dimensions: '30×25×10cm',
    trackingNumber: 'ZTO8876543210',
    trackingUrl: 'https://www.zto.com/tracking',
    lastUpdate: '2024-02-18 10:00:00',
    items: [
      { sku: 'SKU-004', name: '白色衬衫', quantity: 1 },
      { sku: 'SKU-005', name: '灰色西装', quantity: 2 }
    ]
  },
  {
    packageId: 'PKG321-01',
    dispatchId: 'D321',
    shipmentNo: 'SHP2024021604',
    palletNo: 'PLT-GZ-003',
    carrier: '申通快递',
    service: 'STO Standard',
    masterTrackingNumber: 'MST5544332211',
    status: 'Shipped',
    weight: '3.2kg',
    dimensions: '40×30×20cm',
    trackingNumber: 'STO5544332211',
    trackingUrl: 'https://www.sto.cn/tracking',
    lastUpdate: '2024-02-17 16:45:00',
    items: [
      { sku: 'SKU-006', name: '运动鞋套装', quantity: 4 }
    ]
  }
])

// 支付信息
const payment = ref({
  subtotal: 2950.00,
  discount: 0.00,
  shippingCost: 8.00,
  tax: 679.00,
  total: 3637.00
})

// 客户信息
const customer = ref({
  name: 'Dunder Mufflin LTD.',
  email: 'hello@dundermufflin.com',
  phone: '(724) 234-848-9434',
  shippingAddress: {
    line1: '1226 University Drive',
    line2: 'Burr Ridge 3507 Vine Street',
    city: 'Chicago',
    state: 'Illinois',
    country: 'United States',
    zipCode: '60527',
    phone: '(724) 234-848-9434'
  },
  billingAddress: {
    line1: '1226 University Drive',
    line2: 'Burr Ridge 3507 Vine Street',
    city: 'Chicago',
    state: 'Illinois',
    country: 'United States',
    zipCode: '60527',
    phone: '(724) 234-848-9434'
  }
})

// 基于标准化动作类型的订单动态时间轴数据 - 包含订单拆单和多dispatch场景
const activities = ref([
  // === 客户签收阶段 ===
  {
    timestamp: '2024-02-18 14:30:00',
    node: 'Delivered',
    actionType: 'Complete',
    title: '客户签收完成',
    content: 'Dispatch #D789 最后一个包裹已签收，订单履约完成',
    actor: '顺丰快递员',
    object: '订单 #SO00184716',
    type: 'success',
    icon: 'complete',
    details: {
      dispatchId: 'D789',
      packageId: 'PKG789-02',
      signedBy: '张女士',
      signedTime: '2024-02-18 14:30:00',
      deliveryAddress: '上海市浦东新区张江高科技园区祖冲之路887号',
      totalPackages: 2,
      completedPackages: 2
    },
    reason: '正常履约完成'
  },
  {
    timestamp: '2024-02-18 11:15:00',
    node: 'Delivered',
    actionType: 'Complete',
    title: '包裹签收',
    content: 'Dispatch #D789 包裹1已签收（高端手表）',
    actor: '顺丰快递员',
    object: 'dispatch #D789, 包裹 PKG789-01',
    type: 'success',
    icon: 'complete',
    details: {
      dispatchId: 'D789',
      packageId: 'PKG789-01',
      trackingNumber: 'SF7234567890',
      signedBy: '张女士',
      signedTime: '2024-02-18 11:15:00',
      items: ['高端手表 x1'],
      packageWeight: '0.8kg'
    },
    reason: '客户签收'
  },
  
  // === 到达配送站点 ===
  {
    timestamp: '2024-02-18 08:45:00',
    node: 'DC Arrival',
    actionType: 'DC Arrival',
    title: '到达配送站点',
    content: 'Dispatch #D789 所有包裹到达上海浦东配送站',
    actor: '顺丰配送站（系统回传）',
    object: 'dispatch #D789',
    type: 'primary',
    icon: 'dc-arrival',
    details: {
      dispatchId: 'D789',
      dcLocation: '上海浦东配送站',
      dcCode: 'SF-PD-001',
      arrivalTime: '2024-02-18 08:45:00',
      packages: [
        { packageId: 'PKG789-01', status: '待配送', weight: '0.8kg' },
        { packageId: 'PKG789-02', status: '待配送', weight: '1.2kg' }
      ],
      courierAssigned: '李师傅',
      estimatedDelivery: '2024-02-18 14:00:00'
    },
    reason: '准备配送'
  },

  // === 运输中 ===  
  {
    timestamp: '2024-02-17 22:30:00',
    node: 'In Transit',
    actionType: 'In Transit',
    title: '运输中',
    content: 'Dispatch #D789 通过杭州中转站，预计明日到达上海',
    actor: '顺丰物流（GPS跟踪）',
    object: 'dispatch #D789',
    type: 'primary',
    icon: 'shipped',
    details: {
      dispatchId: 'D789',
      currentLocation: '杭州中转站',
      vehicle: '苏A12345',
      transitStatus: '运输中',
      estimatedArrival: '2024-02-18 06:00:00',
      route: '上海仓 → 杭州中转站 → 上海浦东配送站'
    },
    reason: '正常运输'
  },

  // === Dispatch #D456 发货 ===
  {
    timestamp: '2024-02-17 15:45:00',
    node: 'Shipped',
    actionType: 'Shipped',
    title: '仓库发货',
    content: 'Dispatch #D456 从北京仓发出，中通快递',
    actor: 'WMS-北京仓（API回传）',
    object: 'dispatch #D456',
    type: 'success',
    icon: 'shipped',
    details: {
      dispatchId: 'D456',
      warehouse: 'WMS-北京仓',
      carrier: '中通快递', 
      trackingNumber: 'ZTO8876543210',
      packages: [
        { packageId: 'PKG456-01', items: '蓝色连衣裙 x1', weight: '0.5kg' }
      ],
      estimatedDelivery: '2024-02-19 16:00:00'
    },
    reason: '发货成功'
  },

  // === Dispatch #D789 发货 ===
  {
    timestamp: '2024-02-17 14:30:00',
    node: 'Shipped',
    actionType: 'Shipped',
    title: '仓库发货',
    content: 'Dispatch #D789 从上海仓发出，2个包裹，顺丰快递',
    actor: 'WMS-上海仓（API回传）',
    object: 'dispatch #D789',
    type: 'success',
    icon: 'shipped',
    details: {
      dispatchId: 'D789',
      warehouse: 'WMS-上海仓',
      carrier: '顺丰快递',
      trackingNumber: 'SF7234567890',
      packages: [
        { packageId: 'PKG789-01', items: '高端手表 x1', weight: '0.8kg' },
        { packageId: 'PKG789-02', items: '手表包装盒, 保修卡', weight: '1.2kg' }
      ],
      estimatedDelivery: '2024-02-18 16:00:00'
    },
    reason: '发货成功'
  },

  // === 装车 ===
  {
    timestamp: '2024-02-17 13:15:00',
    node: 'Loading',
    actionType: 'Loading',
    title: '装车完成',
    content: 'Dispatch #D789 包裹装车完成，运输车辆：沪A12345',
    actor: 'WMS-上海仓（装车员）',
    object: 'dispatch #D789',
    type: 'success',
    icon: 'shipped',
    details: {
      dispatchId: 'D789',
      vehicle: '沪A12345',
      driver: '王师傅',
      driverPhone: '138****5678',
      loadTime: '2024-02-17 13:15:00',
      packages: ['PKG789-01', 'PKG789-02'],
      departure: '预计14:00发车'
    },
    reason: '准备发车'
  },

  {
    timestamp: '2024-02-17 11:45:00',
    node: 'Loading',
    actionType: 'Loading', 
    title: '装车完成',
    content: 'Dispatch #D456 包裹装车完成，运输车辆：京B56789',
    actor: 'WMS-北京仓（装车员）',
    object: 'dispatch #D456',
    type: 'success',
    icon: 'shipped',
    details: {
      dispatchId: 'D456',
      vehicle: '京B56789',
      driver: '李师傅',
      driverPhone: '136****9876',
      loadTime: '2024-02-17 11:45:00',
      packages: ['PKG456-01'],
      departure: '预计15:30发车'
    },
    reason: '准备发车'
  },

  // === 打包 ===
  {
    timestamp: '2024-02-17 10:30:00',
    node: 'Packed',
    actionType: 'Packed',
    title: '打包完成',
    content: 'Dispatch #D789 打包完成，生成2个包裹',
    actor: 'WMS-上海仓（打包员-小红）',
    object: 'dispatch #D789',
    type: 'success',
    icon: 'box',
    details: {
      dispatchId: 'D789',
      totalPackages: 2,
      packager: '小红',
      packages: [
        {
          packageId: 'PKG789-01',
          items: ['高端手表 x1'],
          dimensions: '15x10x8cm',
          weight: '0.8kg',
          packingMaterial: '珠宝包装'
        },
        {
          packageId: 'PKG789-02', 
          items: ['手表包装盒', '保修卡', '说明书'],
          dimensions: '20x15x10cm',
          weight: '1.2kg',
          packingMaterial: '标准包装'
        }
      ]
    },
    reason: '打包完成'
  },

  {
    timestamp: '2024-02-17 09:15:00',
    node: 'Packed',
    actionType: 'Packed',
    title: '打包完成',
    content: 'Dispatch #D456 打包完成，生成1个包裹',
    actor: 'WMS-北京仓（打包员-小明）',
    object: 'dispatch #D456',
    type: 'success',
    icon: 'box',
    details: {
      dispatchId: 'D456',
      totalPackages: 1,
      packager: '小明',
      packages: [
        {
          packageId: 'PKG456-01',
          items: ['蓝色连衣裙 x1'],
          dimensions: '30x25x5cm',
          weight: '0.5kg',
          packingMaterial: '服装包装'
        }
      ]
    },
    reason: '打包完成'
  },

  // === 仓库确认 ===
  {
    timestamp: '2024-02-17 08:45:00',
    node: 'Warehouse Processing',
    actionType: 'WMS Confirm',
    title: '仓库确认',
    content: 'WMS-上海仓确认接收 Dispatch #D789',
    actor: 'WMS-上海仓（API回传）',
    object: 'dispatch #D789',
    type: 'success',
    icon: 'wms-confirm',
    details: {
      dispatchId: 'D789',
      warehouse: 'WMS-上海仓',
      outboundOrder: 'OUT-2024021700789',
      items: [
              { sku: 'SKU-003', name: '高端手表', quantity: 1, uom: 'PCS', location: 'A-05-12' }
      ],
      estimatedPackTime: '2024-02-17 10:00:00'
    },
    reason: '仓库系统确认'
  },

  {
    timestamp: '2024-02-17 08:30:00',
    node: 'Warehouse Processing',
    actionType: 'WMS Confirm',
    title: '仓库确认',
    content: 'WMS-北京仓确认接收 Dispatch #D456',
    actor: 'WMS-北京仓（API回传）',
    object: 'dispatch #D456',
    type: 'success',
    icon: 'wms-confirm',
    details: {
      dispatchId: 'D456',
      warehouse: 'WMS-北京仓',
      outboundOrder: 'OUT-2024021700456',
      items: [
              { sku: 'SKU-001', name: '蓝色连衣裙', quantity: 1, uom: 'PCS', location: 'B-03-08' }
      ],
      estimatedPackTime: '2024-02-17 09:00:00'
    },
    reason: '仓库系统确认'
  },

  // === 订单拆分 ===
  {
    timestamp: '2024-02-16 16:30:00',
    node: 'Split',
    actionType: 'Split',
    title: '订单拆分',
    content: '订单拆分为2个dispatch，按仓库和商品属性分配',
    actor: '系统（订单引擎）',
    object: '订单 #SO00184716',
    type: 'warning',
    icon: 'allocate',
    details: {
      originalOrder: 'SO00184716',
      splitReason: '多仓库多品类拆分',
      dispatches: [
        {
          dispatchId: 'D789',
          warehouse: 'WMS-上海仓',
          items: ['高端手表 x1'],
          category: '珠宝饰品',
          estimatedShipDate: '2024-02-17 14:00:00'
        },
        {
          dispatchId: 'D456', 
          warehouse: 'WMS-北京仓',
          items: ['蓝色连衣裙 x1'],
          category: '服装',
          estimatedShipDate: '2024-02-17 15:00:00'
        }
      ]
    },
    reason: '优化配送效率'
  },
  {
    timestamp: '2024-02-16 15:45:00',
    node: 'Warehouse Processing',
    actionType: 'WMS Confirm',
    title: '仓库接单',
    content: '已创建出库单，承运商顺丰，单号 SF7234567890',
    actor: 'WMS-上海仓（API回传）',
    object: 'dispatch #D789',
    type: 'success',
    icon: 'wms-confirm',
    details: {
      dispatchId: 'D789',
      warehouse: 'WMS-上海仓',
      outboundOrder: 'OUT-2024021600789',
      carrier: '顺丰快递',
      trackingNumber: 'SF7234567890'
    },
    reason: '仓库系统确认接单'
  },
  {
    timestamp: '2024-02-16 14:50:00',
    node: 'Allocated',
    actionType: 'Reallocate',
    title: '手动改仓',
    content: 'SKU: SKU-001 → WMS-上海仓',
    actor: '王晓（管理员）',
    object: 'SKU: SKU-001',
    type: 'warning',
    icon: 'reallocate',
    details: {
      fromWarehouse: 'WMS-北京仓',
      toWarehouse: 'WMS-上海仓',
      sku: 'SKU-001',
      quantity: 1,
      allocationRule: '人工指定切换'
    },
    reason: '客服操作补仓'
  },
  {
    timestamp: '2024-02-16 14:30:00',
    node: 'Deallocated',
    actionType: 'Deallocate',
    title: 'WMS 拒收退仓',
    content: '从 WMS-北京仓 退回履约池',
    actor: '系统（被动）',
    object: 'SKU: SKU-001',
    type: 'danger',
    icon: 'deallocate',
    details: {
      warehouse: 'WMS-北京仓',
      sku: 'SKU-001',
      quantity: 1,
      errorCode: 'INSUFFICIENT_STOCK',
      errorMessage: 'WMS-北京仓 返回"库存不足"错误'
    },
    reason: '原因：WMS Cancel'
  },
  {
    timestamp: '2024-02-16 14:25:00',
    node: 'Exception',
    actionType: 'Exception',
    title: '标记异常',
    content: 'WMS-北京仓 返回"库存不足"错误',
    actor: '系统（WMS接口返回）',
    object: 'dispatch 子单 #D456',
    type: 'danger',
    icon: 'exception',
    details: {
      dispatchId: 'D456',
      warehouse: 'WMS-北京仓',
      errorType: 'INSUFFICIENT_STOCK',
      errorCode: 'WMS_STOCK_ERROR',
      apiResponse: '{"error": "库存不足", "available": 0, "required": 1}'
    },
    reason: '需要退仓处理'
  },
  {
    timestamp: '2024-02-16 12:30:00',
    node: 'Allocated',
    actionType: 'Allocate',
    title: '自动分仓',
    content: '按就近库存策略自动分配至仓库 WMS-北京仓',
    actor: '系统（分仓引擎）',
    object: 'SKU: SKU-001 → 仓库 WMS-北京仓',
    type: 'primary',
    icon: 'allocate',
    details: {
      sku: 'SKU-001',
      warehouse: 'WMS-北京仓',
      quantity: 1,
      allocationRule: '就近+库存优先',
      distance: '15.2km',
      stockLevel: 156
    },
    reason: '分仓规则：就近+库存优先'
  },
  {
    timestamp: '2024-02-16 10:25:00',
    node: 'Updated',
    actionType: 'Update',
    title: '修改订单',
    content: '地址从"北京市朝阳区"→"上海市浦东新区"',
    actor: 'Emma.H（用户）',
    object: '地址字段',
    type: 'warning',
    icon: 'update',
    details: {
      field: '收货地址',
      oldValue: '北京市朝阳区建国门外大街1号',
      newValue: '上海市浦东新区张江高科技园区祖冲之路887号',
      changeType: 'ADDRESS_UPDATE',
      customerRequest: true
    },
    reason: '客户致电修改地址'
  },
  {
    timestamp: '2024-02-16 09:22:15',
    node: 'Imported',
    actionType: 'Create',
    title: '创建订单',
    content: '通过 Shopify 拉单自动创建订单',
    actor: '系统（DI自动导入）',
    object: '订单 #SO00184716',
    type: 'primary',
    icon: 'create',
    details: {
      sourceChannel: 'Shopify',
      channelOrderId: 'SP-2024021600123',
      importMethod: 'API_PULL',
      customerId: 'CUST-789012',
      customerEmail: 'emma.h@example.com',
      orderAmount: '￥10,298.00',
      itemCount: 2
    },
    reason: '来源平台：Shopify'
  }
])

// 备注
const note = ref('')

// 时间轴相关数据和函数
const expandedItems = ref([])
const showFullTimeline = ref(false)
const currentPage = ref(1)
const pageSize = ref(4)

// 时间线筛选相关
const activeTimelineTab = ref('all')
const selectedFilters = ref([])

// 快速筛选选项
const quickFilters = ref([
  { key: 'today', label: '今天', icon: 'Calendar' },
  { key: 'error', label: '异常', icon: 'Warning' },
  { key: 'important', label: '重要', icon: 'Star' },
  { key: 'manual', label: '人工操作', icon: 'User' }
])

// 根据Tab筛选活动数据
const getFilteredActivities = (tabType) => {
  if (tabType === 'all') {
    return activities.value
  }
  
  return activities.value.filter(activity => {
    switch (tabType) {
      case 'dispatch':
        return activity.actionType?.toLowerCase().includes('dispatch') || 
               activity.content?.toLowerCase().includes('dispatch') ||
               activity.actionType === 'Shipped' ||
               activity.actionType === 'Loading' ||
               activity.actionType === 'Packed'
      case 'update':
        return activity.actionType === 'Update' ||
               activity.actionType === 'Modify' ||
               activity.title?.includes('修改') ||
               activity.title?.includes('更新')
      case 'wms':
        return activity.actor?.includes('WMS') ||
               activity.actionType === 'WMS Confirm' ||
               activity.actionType === 'Allocate' ||
               activity.actionType === 'Packed' ||
               activity.actionType === 'Loading'
      case 'logistics':
        return activity.actionType === 'Shipped' ||
               activity.actionType === 'In Transit' ||
               activity.actionType === 'DC Arrival' ||
               activity.actionType === 'Delivered' ||
               activity.actor?.includes('快递') ||
               activity.actor?.includes('物流')
      case 'customer':
        return activity.actionType === 'Complete' ||
               activity.actionType === 'Create' ||
               activity.title?.includes('客户') ||
               activity.title?.includes('签收')
      default:
        return true
    }
  })
}

// 当前活跃Tab的筛选数据
const filteredActivities = computed(() => {
  let filtered = getFilteredActivities(activeTimelineTab.value)
  
  // 应用快速筛选
  if (selectedFilters.value.length > 0) {
    filtered = filtered.filter(activity => {
      return selectedFilters.value.some(filter => {
        switch (filter) {
          case 'today':
            const today = new Date().toDateString()
            const activityDate = new Date(activity.timestamp).toDateString()
            return today === activityDate
          case 'error':
            return activity.type === 'danger' || 
                   activity.actionType === 'Exception' ||
                   activity.title?.includes('异常') ||
                   activity.title?.includes('错误')
          case 'important':
            return activity.actionType === 'Complete' ||
                   activity.actionType === 'Shipped' ||
                   activity.actionType === 'Create'
          case 'manual':
            return activity.actor?.includes('操作员') ||
                   activity.actor?.includes('客服') ||
                   activity.actor?.includes('管理员') ||
                   !activity.actor?.includes('系统') && 
                   !activity.actor?.includes('API') &&
                   !activity.actor?.includes('自动')
          default:
            return false
        }
      })
    })
  }
  
  return filtered
})

// 分页后的活动数据
const filteredPaginatedActivities = computed(() => {
  if (showFullTimeline.value) {
    return filteredActivities.value
  }
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredActivities.value.slice(start, end)
})

// 保留原有的分页逻辑用于兼容
const paginatedActivities = computed(() => {
  if (showFullTimeline.value) {
    return activities.value
  }
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return activities.value.slice(start, end)
})

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  // 清空展开项
  expandedItems.value = []
}

// 切换快速筛选
const toggleFilter = (filterKey) => {
  const index = selectedFilters.value.indexOf(filterKey)
  if (index > -1) {
    selectedFilters.value.splice(index, 1)
  } else {
    selectedFilters.value.push(filterKey)
  }
  // 重置分页
  currentPage.value = 1
}

// 清除所有筛选
const clearFilters = () => {
  selectedFilters.value = []
  currentPage.value = 1
}

// 获取筛选计数
const getFilterCount = (filterKey) => {
  return activities.value.filter(activity => {
    switch (filterKey) {
      case 'today':
        const today = new Date().toDateString()
        const activityDate = new Date(activity.timestamp).toDateString()
        return today === activityDate
      case 'error':
        return activity.type === 'danger' || 
               activity.actionType === 'Exception' ||
               activity.title?.includes('异常') ||
               activity.title?.includes('错误')
      case 'important':
        return activity.actionType === 'Complete' ||
               activity.actionType === 'Shipped' ||
               activity.actionType === 'Create'
      case 'manual':
        return activity.actor?.includes('操作员') ||
               activity.actor?.includes('客服') ||
               activity.actor?.includes('管理员') ||
               !activity.actor?.includes('系统') && 
               !activity.actor?.includes('API') &&
               !activity.actor?.includes('自动')
      default:
        return false
    }
  }).length
}

// 监听tab变化，重置分页
watch(activeTimelineTab, () => {
  currentPage.value = 1
  expandedItems.value = []
})

// 格式化时间轴日期
const formatTimelineDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取时间轴图标 - 基于标准化动作类型
const getTimelineIcon = (iconName) => {
  const iconMap = {
    // 标准化动作类型图标
    'create': 'Plus',                 // 创建订单
    'update': 'Edit',                 // 修改订单
    'allocate': 'Location',           // 分仓
    'deallocate': 'RemoveFilled',     // 退仓
    'reallocate': 'Refresh',          // 改仓
    'split': 'Operation',             // 订单拆分
    'wms-confirm': 'Select',          // 仓库接单
    'packed': 'Box',                  // 打包
    'loading': 'Upload',              // 装车
    'shipped': 'Van',                 // 发货
    'in-transit': 'Van',              // 运输中
    'dc-arrival': 'Position',         // DC到货
    'delivered': 'Check',             // 已送达
    'exception': 'Warning',           // 异常
    'refund': 'RefreshLeft',          // 退款
    'return': 'Back',                 // 退货
    'cancel': 'CircleClose',          // 取消
    'complete': 'CircleCheck',        // 完成
    
    // 兼容旧图标
    'truck': 'Van',
    'box': 'Box', 
    'check-circle': 'Check',
    'clock': 'Clock',
    'shield-check': 'Shield',
    'user-check': 'User',
    'database': 'DataBoard',
    'alert-triangle': 'Warning',
    'map-pin': 'Location',
    'credit-card': 'CreditCard',
    'map': 'Map',
    'package': 'Box',
    'plus-circle': 'Plus',
    'user': 'User',
    'calculator': 'DataBoard'
  }
  return iconMap[iconName] || 'InfoFilled'
}

// 获取活动类型标签
const getActivityTypeLabel = (type) => {
  const typeMap = {
    'primary': '处理中',
    'success': '已完成',
    'warning': '注意',
    'danger': '错误',
    'info': '信息'
  }
  return typeMap[type] || type
}

// 切换详情展开状态
const toggleDetails = (index) => {
  const idx = expandedItems.value.indexOf(index)
  if (idx > -1) {
    expandedItems.value.splice(idx, 1)
  } else {
    expandedItems.value.push(index)
  }
}

// 格式化详情标签 - 基于标准化字段
const formatDetailLabel = (key) => {
  const labelMap = {
    // 标准化字段标签
    'dispatchId': 'Dispatch ID',
    'packageId': '包裹ID',
    'trackingNumber': '运单号',
    'signedBy': '签收人',
    'signedTime': '签收时间',
    'deliveryAddress': '配送地址',
    'totalPackages': '总包裹数',
    'completedPackages': '完成包裹数',
    'packageWeight': '包裹重量',
    'dcLocation': 'DC站点',
    'dcCode': 'DC代码',
    'arrivalTime': '到达时间',
    'packages': '包裹信息',
    'courierAssigned': '配送员',
    'estimatedDelivery': '预计送达',
    'currentLocation': '当前位置',
    'vehicle': '车辆',
    'transitStatus': '运输状态',
    'estimatedArrival': '预计到达',
    'route': '运输路线',
    'driver': '司机',
    'driverPhone': '司机电话',
    'loadTime': '装车时间',
    'departure': '发车时间',
    'packager': '打包员',
    'dimensions': '包装尺寸',
    'weight': '重量',
    'packingMaterial': '包装材料',
    'items': '商品',
    'location': '库位',
    'estimatedPackTime': '预计打包时间',
    'originalOrder': '原订单',
    'splitReason': '拆分原因',
    'dispatches': 'Dispatch列表',
    'category': '商品类别',
    'estimatedShipDate': '预计发货日期',
    'status': '状态',
    'sku': 'SKU代码',
    'quantity': '数量',
    'fromWarehouse': '原仓库',
    'toWarehouse': '目标仓库',
    'errorCode': '错误代码',
    'errorMessage': '错误信息',
    'errorType': '错误类型',
    'apiResponse': 'API响应',
    'distance': '距离',
    'stockLevel': '库存水平',
    'field': '字段',
    'oldValue': '原值',
    'newValue': '新值',
    'changeType': '变更类型',
    'customerRequest': '客户请求',
    'sourceChannel': '来源渠道',
    'channelOrderId': '渠道订单号',
    'importMethod': '导入方式',
    'customerId': '客户ID',
    'customerEmail': '客户邮箱',
    'orderAmount': '订单金额',
    'itemCount': '商品数量',
    'outboundOrder': '出库单号',
    
    // 兼容旧字段
    'carrier': '物流公司',
    'packageSize': '包装尺寸',
    'packageCount': '包裹数量',
    'pickingList': '拣货单号',
    'warehouse': '仓库',
    'reviewResult': '审核结果',
    'reviewComments': '审核意见',
    'approvalCode': '批准代码',
    'reason': '原因',
    'assignedTo': '分配给',
    'priority': '优先级',
    'totalItems': '总商品数',
    'allAvailable': '全部可用',
    'reservedUntil': '保留到',
    'rule': '触发规则',
    'trigger': '触发条件',
    'holdStatus': 'Hold状态',
    'allocationRule': '分配规则',
    'estimatedProcessTime': '预计处理时间',
    'paymentMethod': '支付方式',
    'amount': '金额',
    'transactionId': '交易号',
    'confirmationMethod': '确认方式',
    'customerIP': '客户IP',
    'confirmationCode': '确认码',
    'subtotal': '小计',
    'shipping': '运费',
    'tax': '税费',
    'discount': '折扣',
    'total': '总计',
    'address': '地址',
    'deliveryZone': '配送区域',
    'checkedItems': '检查商品',
    'channel': '渠道',
    'customerPhone': '客户电话'
  }
  return labelMap[key] || key
}

// 新增数据
const orderBasicInfo = ref({
  orderDate: '2024-02-16 08:30:00',      // 原始订单创建时间
  importDate: '2024-02-16 09:00:00',     // 导入OMS时间
  lastUpdateDate: '2024-02-16 10:30:00',  // 最后更新时间
  shipByDate: '2024-02-20 16:00:00',     // 要求发货时间
  fulfillBy: 'WMS 仓库发货',
  dispatchTime: '2024-02-16 10:30:00',
  shippingSentToChannelDate: '2024-02-16 11:00:00'
})

// 控制信息面板的展开状态
const activeInfoPanel = ref(['information'])

const platformInfo = ref({
  sourceChannel: 'Amazon → Shopify → OMS',
  channelSalesOrderNo: 'CSO-2024-001',
  originalOrderSource: 'Amazon',
  originalOrderId: 'AMZ-2024-001',
  purchaseOrderId: 'PO-2024-001',
  referenceNo: 'REF-2024-001',
  currentChannel: 'Shopify'
})

const returnInfo = ref({
  isReturn: false,
  returnSource: '',
  returnType: '',
  returnReferenceNo: '',
  originOrderId: ''
})

// 定义支付信息类型
interface PaymentInfo {
  status: 'paid' | 'pending' | 'failed';
  statusText: string;
  paymentTime: string;
  transactionId: string;
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  invoiceNo: string;
  invoiceUrl: string;
}

// 更新支付信息数据
const paymentInfo = ref<PaymentInfo>({
  status: 'paid',
  statusText: '已支付',
  paymentTime: '2024-02-16 09:30:00',
  transactionId: 'TXN202402160001',
  subtotal: 2950.00,
  discount: 0.00,
  shippingCost: 8.00,
  tax: 679.00,
  total: 3637.00,
  invoiceNo: 'INV202402160001',
  invoiceUrl: 'https://example.com/invoice.pdf'
})

// 定义类型
interface TrackingInfo {
  carrier: string;
  trackingNumber: string;
  carrierTrackingUrl: string;
  subOrderNo: string;
}

interface ShippingInfo {
  shipMethod: string;
  carrier: string;
  deliveryService: string;
  trackingInfo: TrackingInfo[];
  originalShippingCode: string;
}

// 使用类型
const shippingInfo = ref<ShippingInfo>({
  shipMethod: 'Standard',
  carrier: 'FedEx',
  deliveryService: 'FedEx Express Saver',
  trackingInfo: [
    {
        carrier: 'FedEx',
      trackingNumber: 'FDX123456789',
      carrierTrackingUrl: 'https://www.fedex.com/tracking',
      subOrderNo: 'SUB-001'
    },
    {
      carrier: 'UPS',
      trackingNumber: 'UPS987654321',
      carrierTrackingUrl: 'https://www.ups.com/track',
      subOrderNo: 'SUB-002'
    }
  ],
  originalShippingCode: 'ORG-SHIP-001'
})

const shippingTimeline = ref({
  requestedShipDate: '2024-02-17 14:00:00',
  estimatedShippingDate: '2024-02-18 16:00:00',
  loadedDate: '2024-02-18 15:30:00',
  shipDate: '2024-02-18 16:30:00'
})

const customerInfo = ref<CustomerInfo>({
  name: 'Dunder Mufflin LTD.',
  email: 'hello@dundermufflin.com',
  phone: '(724) 234-848-9434',
  shippingAddress: {
    line1: '1226 University Drive',
    line2: 'Burr Ridge 3507 Vine Street',
    city: 'Chicago',
    state: 'Illinois',
    country: 'United States',
    zipCode: '60527',
    phone: '(724) 234-848-9434'
  },
  billingAddress: {
    line1: '1226 University Drive',
    line2: 'Burr Ridge 3507 Vine Street',
    city: 'Chicago',
    state: 'Illinois',
    country: 'United States',
    zipCode: '60527',
    phone: '(724) 234-848-9434'
  }
})

// 计算是否超时
const isOverdue = computed(() => {
  if (!shippingTimeline.value.requestedShipDate || !shippingTimeline.value.shipDate) {
    return false;
  }
  return new Date(shippingTimeline.value.shipDate) > new Date(shippingTimeline.value.requestedShipDate);
});

// 添加跳转函数
const openTracking = (url: string, trackingNumber: string): void => {
  const win: Window = window as Window
  win.open(`${url}/${trackingNumber}`, '_blank')
}

// 添加处理发票的方法
const handleViewInvoice = (): void => {
  const win: Window = window as Window
  win.open(paymentInfo.value.invoiceUrl, '_blank')
}

const handleDownloadInvoice = (): void => {
  const win: Window = window as Window
  win.open(paymentInfo.value.invoiceUrl + '?download=true', '_blank')
}

// 订单状态和操作相关
// const orderStatus = ref<OrderStatus>(OrderStatus.Allocated)

// 是否可以发货
const canShipOrder = computed(() => {
  return [OrderStatus.Allocated, OrderStatus.WarehouseProcessing].includes(orderStatus.value)
})

// 计算可用的操作
const availableActions = computed(() => {
  if (!orderStatus.value) return []
  return STATUS_CONFIG[orderStatus.value]?.availableActions || []
})

// 是否有可用操作
const hasAvailableActions = computed(() => availableActions.value.length > 0)

// 获取操作标签
const getActionLabel = (action: OrderAction): string => {
  const labels: Record<OrderAction, string> = {
    [OrderAction.Allocate]: '分配',
    [OrderAction.Pend]: '挂起',
    [OrderAction.Cancel]: '取消',
    [OrderAction.Edit]: '编辑',
    [OrderAction.Deallocate]: '取消分配',
    [OrderAction.Dispatch]: '发货',
    [OrderAction.Reopen]: '重新打开',
    [OrderAction.Split]: '拆分',
    [OrderAction.Merge]: '合并',
    [OrderAction.SyncLogistics]: '同步物流信息'
  }
  return labels[action] || action
}

// 获取操作图标
const getActionIcon = (action: OrderAction) => {
  const icons: Record<OrderAction, any> = {
    [OrderAction.Allocate]: Connection,
    [OrderAction.Pend]: VideoPlay,
    [OrderAction.Cancel]: CircleClose,
    [OrderAction.Edit]: Edit,
    [OrderAction.Deallocate]: Remove,
    [OrderAction.Dispatch]: Van,
    [OrderAction.Reopen]: SwitchButton,
    [OrderAction.Split]: CirclePlus,
    [OrderAction.Merge]: Connection,
    [OrderAction.SyncLogistics]: Refresh
  }
  return icons[action]
}

// 处理订单操作
const handleAction = (command: OrderAction | 'rawData') => {
  if (command === 'rawData') {
    handleRawData()
    return
  }

  // 检查操作是否可用
  if (!availableActions.value.includes(command)) {
    ElMessage.warning('当前状态下不可执行此操作')
    return
  }

  switch (command) {
    case OrderAction.Allocate:
      handleAllocate()
      break
    case OrderAction.Pend:
      handlePend()
      break
    case OrderAction.Cancel:
      handleCancel()
      break
    case OrderAction.Edit:
      handleEdit()
      break
    case OrderAction.Deallocate:
      handleDeallocate()
      break
    case OrderAction.Dispatch:
      handleDispatch()
      break
    case OrderAction.Reopen:
      handleReopen()
      break
    case OrderAction.Split:
      handleSplit()
      break
    case OrderAction.Merge:
      handleMerge()
      break
    case OrderAction.SyncLogistics:
      handleSyncLogistics()
      break
  }
}

// 处理发货操作
const handleShipOrder = () => {
  if (!canShipOrder.value) {
    ElMessage.warning('当前状态下不可发货')
    return
  }
  
  ElMessageBox.confirm(
    '确认开始发货处理？',
    '发货确认',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用发货API
    ElMessage({
      type: 'success',
      message: '发货处理已开始'
    })
  }).catch(() => {})
}

// 添加新的操作处理函数
const handleDispatch = () => {
  ElMessage.info('Dispatch feature coming soon')
}

const handleSplit = () => {
  ElMessage.info('Split feature coming soon')
}

const handleMerge = () => {
  ElMessage.info('Merge feature coming soon')
}

const handleSyncLogistics = () => {
  ElMessage.success('物流信息同步成功')
  // TODO: 调用同步物流信息 API
}

// 商品变更记录
const productChangeLogs = ref([
  {
    id: 1,
    type: 'quantity_change',
    productId: 'P001',
    oldValue: 1,
    newValue: 2,
    operator: 'Tommy Smith',
    timestamp: '2024-02-16 09:40:00'
  }
])

// 处理原始数据查看
const handleRawData = () => {
  // TODO: 实现查看原始数据的逻辑
  ElMessage.info('Raw data feature coming soon')
}

// 添加缺失的处理函数
const handleAllocate = () => {
  ElMessage.info('Allocate feature coming soon')
}

const handlePend = () => {
  ElMessage.info('Hold feature coming soon')
}

const handleCancel = () => {
  ElMessage.info('Cancel feature coming soon')
}

const handleEdit = () => {
  ElMessage.info('Edit feature coming soon')
}

const handleDeallocate = () => {
  ElMessage.info('Deallocate feature coming soon')
}

const handleReopen = () => {
  ElMessage.info('Reopen feature coming soon')
}

// 编辑收货地址
const handleEditShippingAddress = () => {
  // 这里可以打开一个更详细的编辑弹窗
  ElMessage.info('编辑收货地址')
}

// 编辑账单地址
const handleEditBillingAddress = () => {
  // 这里可以打开一个更详细的编辑弹窗
  ElMessage.info('编辑账单地址')
}

// 编辑商品信息
const handleEditProducts = () => {
  // TODO: 实现编辑商品信息的逻辑
}

// 添加商品
const handleAddProduct = () => {
  const newProduct: Product = {
    id: `P${Date.now()}`, // 生成临时ID
    name: '',
    category: '',
    status: 'Ready',
    quantity: 1,
    uom: 'PCS',
    price: 0,
    discount: 0,
    tax: 0,
    amount: 0,
    snCode: '',
    remarks: '',
    color: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)'
  }
  products.value.push(newProduct)
}

// 删除商品
const handleDeleteProduct = (index: number) => {
  const product = products.value[index]
  if (!product) return

  ElMessageBox.confirm(
    '确认删除该商品？',
    '删除确认',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    if (product.id) {
      // 记录删除操作
      logProductChange('product_delete', product.id, product, null)
    }
    products.value.splice(index, 1)
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
  }).catch(() => {
    // 用户取消删除，不做任何操作
  })
}

// 记录商品变更
const logProductChange = (changeType: string, productId: string, oldValue: any, newValue: any) => {
  productChangeLogs.value.push({
    id: Date.now(),
    type: changeType,
    productId,
    oldValue,
    newValue,
    operator: 'Tommy Smith', // TODO: 从用户信息中获取
    timestamp: new Date().toISOString()
  })
}

// 订单基本信息
const orderNo = ref('SO00184716')

// 获取状态类型
const getStatusType = (status: OrderStatus): string => {
  const types: Record<string, string> = {
    [OrderStatus.Imported]: 'info',
    [OrderStatus.Pending]: 'warning',
    [OrderStatus.Allocated]: 'success',
    [OrderStatus.Exception]: 'danger',
    [OrderStatus.Deallocated]: 'info',
    [OrderStatus.Cancelling]: 'warning',
    [OrderStatus.Canceled]: 'danger',
    [OrderStatus['Warehouse Processing']]: 'primary',
    [OrderStatus.Shipped]: 'success',
    [OrderStatus.InTransit]: 'primary',
    [OrderStatus.Delivered]: 'success',
    [OrderStatus.Completed]: 'success'
  }
  return types[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<string, string> = {
    [OrderStatus.Imported]: 'Imported',
    [OrderStatus.Pending]: 'Pending',
    [OrderStatus.Allocated]: 'Allocated',
    [OrderStatus.Exception]: 'Exception',
    [OrderStatus.Deallocated]: 'Deallocated',
    [OrderStatus.Cancelling]: 'Cancelling',
    [OrderStatus.Canceled]: 'Cancelled',
    [OrderStatus['Warehouse Processing']]: 'Warehouse Processing',
    [OrderStatus.Shipped]: 'Shipped',
    [OrderStatus.InTransit]: 'In Transit',
    [OrderStatus.Delivered]: 'Delivered',
    [OrderStatus.Completed]: 'Completed'
  }
  return labels[status] || status
}

// 格式化日期
const formatDate = (date: string): string => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取承运商简称
const getCarrierShort = (carrier: string): string => {
  const carrierMap: Record<string, string> = {
    '顺丰速运': '顺丰',
    '中通快递': '中通',
    '申通快递': '申通',
    'FedEx': 'FedEx',
    'DHL': 'DHL',
    'UPS': 'UPS'
  }
  return carrierMap[carrier] || carrier.slice(0, 4)
}

// 获取服务类型简称
const getServiceShort = (service: string): string => {
  const serviceMap: Record<string, string> = {
    'SF Standard': 'SF标准',
    'ZTO Express': 'ZTO快递',
    'STO Standard': 'STO标准',
    'FedEx Priority': 'FedEx优先',
    'DHL Express': 'DHL快递'
  }
  return serviceMap[service] || service.replace(/\s+/g, '').slice(0, 6)
}

// 获取尺寸简称
const getDimensionsShort = (dimensions: string): string => {
  // 将 35×25×15cm 转换为更紧凑的格式
  return dimensions.replace('×', 'x').replace('cm', '')
}

// 处理跟踪号点击事件
const handleTrackingClick = (trackingNumber: string) => {
  // 这里调用之前的跟踪弹窗功能
  openTracking(trackingNumber)
}

// 编辑状态控制
const isEditing = ref(false)

// Tab控制
const activeTab = ref('items')

// 展开/折叠状态管理
const expandedDispatches = ref<string[]>([])
const expandedPackages = ref<string[]>([])

// 物流跟踪弹窗相关
const trackingDialogVisible = ref(false)
const selectedTracking = ref<any>({
  trackingNumber: '',
  carrier: '',
  subOrderNo: '',
  currentStatus: '',
  trackingEvents: []
})

// 订单备注相关
const isEditingNotes = ref(false)
const orderNotes = ref({
  internal: '此订单需要特殊包装，客户要求在包装盒上贴上个性化标签。',
  customer: '请务必小心包装，这是送给朋友的生日礼物。'
})

// 订单备注的备份数据
const backupNotes = ref({
  internal: '',
  customer: ''
})

// 切换dispatch商品展开状态
const toggleDispatchItems = (dispatchId: string) => {
  const index = expandedDispatches.value.indexOf(dispatchId)
  if (index > -1) {
    expandedDispatches.value.splice(index, 1)
  } else {
    expandedDispatches.value.push(dispatchId)
  }
}

// 切换package商品展开状态
const togglePackageItems = (packageId: string) => {
  const index = expandedPackages.value.indexOf(packageId)
  if (index > -1) {
    expandedPackages.value.splice(index, 1)
  } else {
    expandedPackages.value.push(packageId)
  }
}

// Dispatched Details数据接口
interface DispatchedDetail {
  dispatchId: string;
  warehouse: string;
  warehouseCode: string;
  status: string;
  carrier: string;
  trackingNumber?: string;
  trackingUrl?: string;
  shipDate?: string;
  estimatedDelivery?: string;
  items: Array<{
    sku: string;
    quantity: number;
  }>;
  allocatedTime?: string;
  receivedTime?: string;
  committedTime?: string;
  pickedTime?: string;
  packedTime?: string;
  loadedTime?: string;
  partiallyShippedTime?: string;
  shippedTime?: string;
  shortShippedTime?: string;
  cancelTime?: string;
}

// Package数据接口
interface Package {
  packageId: string;
  dispatchId: string;
  shipmentNo: string;
  palletNo: string;
  carrier: string;
  service: string;
  masterTrackingNumber: string;
  weight: string;
  dimensions: string;
  trackingNumber?: string;
  trackingUrl?: string;
  lastUpdate: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
}




// 编辑前的备份数据
const backupData = ref<BackupData>({
  products: null,
  customerInfo: null
})

// 切换编辑状态
const toggleEdit = () => {
  if (isEditing.value) {
    // 保存编辑
    ElMessageBox.confirm(
      '确认保存修改？',
      '保存确认',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      // TODO: 调用保存API
      ElMessage({
        type: 'success',
        message: '保存成功'
      })
      isEditing.value = false
      // 保存成功后清空备份
      backupData.value = {
        products: null,
        customerInfo: null
      }
    }).catch(() => {})
  } else {
    // 进入编辑模式前先备份当前数据
    backupData.value = {
      products: JSON.parse(JSON.stringify(products.value)),
      customerInfo: JSON.parse(JSON.stringify(customerInfo.value))
    }
    isEditing.value = true
  }
}

// 判断商品是否可编辑（只有未dispatch的商品可编辑）
const isProductEditable = (product: Product | EnhancedProduct): boolean => {
  // 对于增强商品数据，检查履约状态
      if ('fulfillmentStatus' in product) {
      return product.fulfillmentStatus === 'TO_BE_DISPATCHED' && product.productStatus !== '已取消'
    }
  // 对于普通商品数据，只有状态为Ready的商品才可以编辑
  return product.status === 'Ready'
}

// 处理商品数量变更
const handleQuantityChange = (row: Product, value: number): void => {
  // 只有可编辑的商品才能变更数量
  if (!isProductEditable(row)) {
    ElMessage.warning('已dispatch的商品不能修改数量')
    return
  }
  
  // 记录变更
  logProductChange('quantity_change', row.id, row.quantity, value)
  row.quantity = value
  // 重新计算金额
  row.amount = row.price * value
}

// 订单备注相关方法
const startEditNotes = () => {
  // 备份当前备注数据
  backupNotes.value = {
    internal: orderNotes.value.internal,
    customer: orderNotes.value.customer
  }
  isEditingNotes.value = true
}

const saveNotes = () => {
  ElMessageBox.confirm(
    '确认保存备注修改？',
    '保存确认',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用保存备注API
    ElMessage({
      type: 'success',
      message: '备注保存成功'
    })
    isEditingNotes.value = false
  }).catch(() => {})
}

const cancelEditNotes = () => {
  // 恢复备份的数据
  orderNotes.value.internal = backupNotes.value.internal
  orderNotes.value.customer = backupNotes.value.customer
  isEditingNotes.value = false
  ElMessage({
    type: 'info',
    message: '已取消编辑'
  })
}

defineExpose({
  openTracking
});

// 修改cancelEdit函数
const cancelEdit = () => {
  ElMessageBox.confirm(
    '确认取消编辑？未保存的修改将会丢失',
    '取消确认',
    {
      confirmButtonText: '确认',
      cancelButtonText: '继续编辑',
      type: 'warning'
    }
  ).then(() => {
    // 恢复备份的数据
    if (backupData.value?.products) {
      products.value = JSON.parse(JSON.stringify(backupData.value.products))
    }
    if (backupData.value?.customerInfo) {
      customerInfo.value = JSON.parse(JSON.stringify(backupData.value.customerInfo))
    }
    // 退出编辑模式
    isEditing.value = false
    // 清空备份数据
    backupData.value = {
      products: null,
      customerInfo: null
    }
    ElMessage({
      type: 'info',
      message: '已取消编辑'
    })
  }).catch(() => {
    // 用户选择继续编辑，不做任何操作
  })
}

// 添加watch来监听编辑状态变化
watch(isEditing, (newVal) => {
  if (!newVal) {
    // 退出编辑模式时，禁用所有输入框
    nextTick(() => {
      Array.from(document.querySelectorAll<HTMLElement>('input, textarea')).forEach(input => {
        input.blur()
      })
    })
  }
})

// 错误相关的状态
const hasError = ref(false)
const errorMessage = ref('')

// 显示错误详情
const showErrorDetail = () => {
  ElMessageBox.alert(
    `错误详细信息：
1. SKU-001 (蓝色连衣裙)
   - 需求数量：5
   - 当前库存：3
   - 缺少数量：2

2. SKU-002 (红色T恤)
   - 需求数量：3
   - 当前库存：2
   - 缺少数量：1

处理建议：
- 请检查仓库实际库存
- 考虑部分发货
- 或等待补货后重新分配`, 
    '库存不足详情', 
    {
      confirmButtonText: '知道了',
      type: 'error',
      customClass: 'error-dialog'
    }
  )
}

// 更新错误状态的方法
const updateErrorStatus = (error: string | null) => {
  hasError.value = !!error
  errorMessage.value = error || ''
}

// 计算取消商品总金额
const getCancelledTotalAmount = (): string => {
  const total = cancelledProducts.value.reduce((sum, product) => {
    return sum + (product.price * product.quantity)
  }, 0)
  return total.toFixed(2)
}

// 计算退货商品总金额
const getReturnedTotalAmount = (): string => {
  const total = returnedProducts.value.reduce((sum, product) => {
    return sum + (product.price * product.returnQuantity)
  }, 0)
  return total.toFixed(2)
}

// 计算换货商品总价差
const getExchangeTotalDifference = (): string => {
  const total = exchangedProducts.value.reduce((sum, exchange) => {
    return sum + exchange.priceDifference
  }, 0)
  return total >= 0 ? `+${total.toFixed(2)}` : total.toFixed(2)
}

// 获取退货状态类型
const getReturnStatusType = (status: string): string => {
  const types: Record<string, string> = {
    '退货申请': 'warning',
    '退货中': 'info',
    '退款完成': 'success',
    '退货失败': 'danger'
  }
  return types[status] || 'info'
}

// 获取换货状态类型
const getExchangeStatusType = (status: string): string => {
  const types: Record<string, string> = {
    '换货申请': 'warning',
    '换货中': 'info',
    '换货完成': 'success',
    '换货失败': 'danger'
  }
  return types[status] || 'info'
}

// 获取商品状态类型
const getProductStatusType = (status: string): string => {
  const types: Record<string, string> = {
    '待发货': 'warning',
    '已发货': 'info',
    '已送达': 'success',
    '已取消': 'danger',
    '已退款': 'info',
    '已退货': 'warning',
    '换货中': 'info'
  }
  return types[status] || 'info'
}

// 获取履约状态类型
const getFulfillmentStatusType = (status: string): string => {
  const types: Record<string, string> = {
    'NO_FULFILLMENT': 'info',        // 无需履约
    'HOLD': 'warning',               // 暂停履约  
    'TO_BE_DISPATCHED': 'danger',    // 待履约
    'DISPATCHED': 'success',         // 已下发
    'PARTIALLY_DISPATCHED': 'warning', // 部分下发
    'CANCELED': 'info',              // 已取消
    'PARTIALLY_SHIPPED': 'warning',  // 部分发货
    'SHIPPED': 'success',            // 全部发货
    'SHORT_SHIPPED': 'danger'        // 缺货发货
  }
  return types[status] || 'info'
}

// 获取履约状态中文名称
const getFulfillmentStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'NO_FULFILLMENT': '无需履约',
    'HOLD': '暂停履约',
    'TO_BE_DISPATCHED': '待履约',
    'DISPATCHED': '已下发',
    'PARTIALLY_DISPATCHED': '部分下发',
    'CANCELED': '已取消',
    'PARTIALLY_SHIPPED': '部分发货',
    'SHIPPED': '全部发货',
    'SHORT_SHIPPED': '缺货发货'
  }
  return labels[status] || status
}

// 获取操作标签类型
const getOperationTagType = (operation: string): string => {
  const types: Record<string, string> = {
    'cancel': 'danger',
    'return': 'warning',
    'exchange': 'info',
    'exchange_new': 'warning',
    'refund': 'info'
  }
  return types[operation] || 'info'
}

// 获取操作标签文本
const getOperationLabel = (operation: string): string => {
  const labels: Record<string, string> = {
    'cancel': '已取消',
    'return': '已退货',
    'exchange': '已换货',
    'exchange_new': '换货新品',
    'refund': '已退款'
  }
  return labels[operation] || operation
}

// 计算商品行总金额
const calculateLineTotal = (product: EnhancedProduct, quantity: number): number => {
  const subtotal = product.price * quantity
  const discountRatio = quantity / product.originalQuantity
  const discountAmount = product.discount * discountRatio
  const taxAmount = product.tax * discountRatio
  
  return subtotal - discountAmount + taxAmount
}

// 计算商品退款金额
const calculateRefundAmount = (product: EnhancedProduct): number => {
  // 计算取消数量的退款金额
  const cancelAmount = calculateLineTotal(product, product.cancelledQuantity)
  
  // 计算退货数量的退款金额  
  const returnAmount = calculateLineTotal(product, product.returnedQuantity)
  
  // 计算退款数量的退款金额
  const refundAmount = calculateLineTotal(product, product.refundedQuantity)
  
  return cancelAmount + returnAmount + refundAmount
}

// 处理应发货数量变更
const handleShouldDispatchQuantityChange = (row: EnhancedProduct, value: number): void => {
  // 只有可编辑的商品才能变更数量
  if (!isProductEditable(row)) {
    ElMessage.warning('已dispatch的商品不能修改数量')
    return
  }
  
  // 验证数量范围
  if (value < 0 || value > row.originalQuantity) {
    ElMessage.warning(`应发货数量必须在0到${row.originalQuantity}之间`)
    return
  }
  
  // 记录变更
  logProductChange('should_dispatch_quantity_change', row.id, row.shouldDispatchQuantity, value)
  row.shouldDispatchQuantity = value
  
  // 同时更新履约数量
  row.fulfillmentQuantity = value
}

// 显示物流跟踪详情
const showTrackingDetails = (tracking: any) => {
  // 模拟详细的物流跟踪数据
  selectedTracking.value = {
    ...tracking,
    currentStatus: 'Delivered',
    trackingEvents: [
      {
        date: 'Monday, 5/19/25',
        time: '10:08 AM',
        status: 'Delivered',
        location: 'Houston, TX',
        description: '包裹已成功投递',
        facility: null
      },
      {
        date: 'Monday, 5/19/25',
        time: '5:15 AM',
        status: 'On FedEx vehicle for delivery',
        location: 'HOUSTON, TX',
        description: '包裹已装车，正在配送途中',
        facility: 'Houston Distribution Center'
      },
      {
        date: 'Monday, 5/19/25',
        time: '5:01 AM',
        status: 'At local FedEx facility',
        location: 'HOUSTON, TX',
        description: '包裹已到达本地配送站点',
        facility: 'Houston Local Facility'
      },
      {
        date: 'Sunday, 5/18/25',
        time: '7:30 PM',
        status: 'On the way',
        location: 'HOUSTON, TX',
        description: '包裹运输中',
        facility: null
      },
      {
        date: 'Saturday, 5/17/25',
        time: '10:41 PM',
        status: 'On the way',
        location: 'HOUSTON, TX',
        description: '包裹运输中',
        facility: null
      },
      {
        date: 'Saturday, 5/17/25',
        time: '10:40 AM',
        status: 'On the way',
        location: 'HOUSTON, TX',
        description: '包裹运输中',
        facility: null
      },
      {
        date: 'Friday, 5/16/25',
        time: '9:40 PM',
        status: 'Departed FedEx location',
        location: 'CYPRESS, TX',
        description: '包裹已离开FedEx站点',
        facility: 'Cypress Sorting Center'
      },
      {
        date: 'Friday, 5/16/25',
        time: '6:33 PM',
        status: 'Arrived at FedEx location',
        location: 'CYPRESS, TX',
        description: '包裹已到达FedEx站点',
        facility: 'Cypress Sorting Center'
      },
      {
        date: 'Friday, 5/16/25',
        time: '11:00 AM',
        status: 'On the way',
        location: 'OKOLONA, AR',
        description: '包裹运输中',
        facility: null
      },
      {
        date: 'Thursday, 5/15/25',
        time: '11:52 PM',
        status: 'Left FedEx origin facility',
        location: 'LOUISVILLE, KY',
        description: '包裹已离开FedEx起始站点',
        facility: 'Louisville Origin Facility'
      },
      {
        date: 'Thursday, 5/15/25',
        time: '7:42 PM',
        status: 'Shipment arriving On-Time',
        location: 'LOUISVILLE, KY',
        description: '包裹按时到达',
        facility: 'Louisville Hub'
      },
      {
        date: 'Thursday, 5/15/25',
        time: '7:40 PM',
        status: 'Arrived at FedEx location',
        location: 'LOUISVILLE, KY',
        description: '包裹已到达FedEx站点',
        facility: 'Louisville Hub'
      }
    ]
  }
  trackingDialogVisible.value = true
}

// 获取跟踪状态类型
const getTrackingStatusType = (status: string) => {
  if (status === 'Delivered') return 'success'
  if (status.includes('On the way') || status.includes('vehicle')) return 'warning'
  return 'info'
}

// 获取时间轴事件类型
const getTimelineEventType = (status: string) => {
  if (status === 'Delivered') return 'success'
  if (status.includes('On the way') || status.includes('vehicle')) return 'warning'
  return 'primary'
}

// 获取时间轴事件图标
const getTimelineEventIcon = (status: string) => {
  if (status === 'Delivered') return 'Check'
  if (status.includes('vehicle')) return 'Van'
  if (status.includes('Arrived')) return 'Location'
  if (status.includes('Departed') || status.includes('Left')) return 'Right'
  return 'Clock'
}

// 获取时间轴事件颜色
const getTimelineEventColor = (status: string) => {
  if (status === 'Delivered') return '#67C23A'
  if (status.includes('On the way') || status.includes('vehicle')) return '#E6A23C'
  if (status.includes('Arrived')) return '#409EFF'
  if (status.includes('Departed') || status.includes('Left')) return '#909399'
  return '#909399'
}

// 打开承运商官网跟踪
const openCarrierTracking = (tracking: any) => {
  const url = `${tracking.carrierTrackingUrl}/${tracking.trackingNumber}`
  window.open(url, '_blank')
}

// 获取Dispatch状态类型
const getDispatchStatusType = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Shipped': 'success',
    'Processing': 'warning',
    'Delivered': 'success',
    'Cancelled': 'danger',
    'Exception': 'danger'
  }
  return statusMap[status] || 'info'
}



// 添加自定义样式
const styleContent = `
.error-dialog {
  max-width: 500px !important;
  
  .el-message-box__content {
    max-height: 400px;
    overflow-y: auto;
    white-space: pre-line;
    font-family: monospace;
    padding: 20px;
    background: rgba(244, 63, 94, 0.05);
    border-radius: 8px;
    margin: 16px 0;
  }
}`

const style = document.createElement('style')
style.textContent = styleContent
document.head.appendChild(style)

// 在 script setup 中添加状态相关的类型和数据
interface OrderNode {
  id: number;
  name: string;
  status: string;
  statusText: string;
  description: string;
  type: 'start' | 'process' | 'end';  // 节点类型：开始、过程、结束
  icon?: string;  // 节点图标
  nextNodes?: number[];  // 下一个可能的节点ID
  isBlocked?: boolean;  // 是否被阻塞
  blockReason?: string;  // 阻塞原因
  error?: {
    details: string[];
    level: 'warning' | 'error' | 'info';
    actions: {
      type: string;
      label: string;
      icon: string;
      action: string;
    }[];
  };
}



// 生成节点内容
const generateNodeContent = (node: OrderNode): string => {
  let content = '<div class="node-content">'
  
  if (node.error) {
    content += `
      <div class="error-section">
        <h4>异常说明：</h4>
        <ul>
          ${node.error.details.map(detail => `<li>${detail}</li>`).join('')}
        </ul>
      </div>
      <div class="action-section">
        <h4>建议操作：</h4>
        <div class="action-list">
          ${node.error.actions.map(action => `
            <button class="action-button ${action.type}">
              <i class="el-icon-${action.icon}"></i>
              ${action.label}
            </button>
          `).join('')}
        </div>
      </div>
    `
  }
  
  if (node.isBlocked) {
    content += `
      <div class="block-section">
        <h4>阻塞原因：</h4>
        <p>${node.blockReason}</p>
      </div>
    `
  }
  
  content += '</div>'
  return content
}

// 处理异常操作
const handleErrorAction = (action: any) => {
  switch (action.action) {
    case 'reallocate':
      // 处理重新分配
      break
    case 'cancel':
      // 处理取消订单
      break
  }
}

// 添加获取节点时间的方法
const getNodeTime = (node: OrderNode | null) => {
  if (!node) return ''
  const history = statusHistory.value.find(h => h.to === node.status)
  return history ? history.time : ''
}


// 订单状态历史记录
interface StatusHistory {
  from: string;
  to: string;
  time: string;
  type: 'normal' | 'error' | 'cancel';
  reason?: string;
}

// 示例状态历史
const statusHistory = ref<StatusHistory[]>([
  { from: 'Imported', to: 'Pending', time: '2024-02-16 09:00:00', type: 'normal' },
  { from: 'Pending', to: 'Allocated', time: '2024-02-16 09:05:00', type: 'normal' },
  { from: 'Allocated', to: 'Exception', time: '2024-02-16 09:10:00', type: 'error', reason: '库存不足' },
])
</script>

<style lang="scss" scoped>
.order-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #0A0A0F 0%, #141420 100%);
  color: #fff;

  .detail-header {
    padding: 32px 48px;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
    align-items: flex-start;

    .header-main {
      flex: 1;

      .left-section {
    display: flex;
    align-items: center;
    gap: 16px;
        margin-bottom: 20px;
        flex-wrap: wrap;

        .order-id {
          margin: 0;
          font-size: 32px;
      font-weight: 600;
          background: linear-gradient(135deg, #fff, rgba(255, 255, 255, 0.6));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
          position: relative;
          
          &::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 100%;
            height: 1px;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.2), transparent);
          }
        }

        .el-tag {
          height: 32px;
          padding: 0 20px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          letter-spacing: 0.2px;
          transition: all 0.3s ease;
          
          &:hover {
            transform: translateY(-2px);
          }
          
          &.el-tag--success {
            background: rgba(52, 199, 89, 0.15);
            color: #34C759;
            box-shadow: 0 0 20px rgba(52, 199, 89, 0.15);
          }
          
          &.el-tag--warning {
            background: rgba(255, 159, 10, 0.15);
            color: #FF9F0A;
            box-shadow: 0 0 20px rgba(255, 159, 10, 0.15);
          }
        }

        .error-tag {
      display: flex;
      align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: rgba(244, 63, 94, 0.1);
          border: 1px solid rgba(244, 63, 94, 0.2);
          border-radius: 16px;
          margin-left: 8px;
          
          .error-icon {
            color: #F43F5E;
      font-size: 14px;
    }

          .error-text {
            color: #F43F5E;
            font-size: 13px;
            font-weight: 500;
          }
          
          .view-detail {
            font-size: 13px;
            padding: 0 8px;
            height: 24px;
            border-radius: 12px;
            background: rgba(244, 63, 94, 0.15);
            
            &:hover {
              background: rgba(244, 63, 94, 0.25);
              transform: translateY(-1px);
            }
          }
        }
      }

      .order-info {
    display: flex;
    align-items: center;
        gap: 24px;
        margin-top: 12px;
        flex-wrap: wrap;

        .channel-path,
        .create-time {
      display: flex;
      align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.2px;

          .el-icon {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.4);
          }

          &:hover {
            color: rgba(255, 255, 255, 0.8);
            .el-icon {
              color: rgba(255, 255, 255, 0.6);
            }
          }
        }

        .channel-path {
          .path-text {
            background: linear-gradient(45deg, #6366F1, #818CF8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
            font-weight: 600;
          }
        }
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;
    align-items: center;

      .edit-button {
        height: 40px;
        padding: 0 24px;
        background: rgba(99, 102, 241, 0.1);
        border: 1px solid rgba(99, 102, 241, 0.2);
        color: #6366F1;
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(99, 102, 241, 0.15);
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateY(-2px);
        }
        
        &.el-button--success {
          background: rgba(52, 199, 89, 0.1);
          border-color: rgba(52, 199, 89, 0.2);
          color: #34C759;
          
          &:hover {
            background: rgba(52, 199, 89, 0.15);
            border-color: rgba(52, 199, 89, 0.3);
          }
        }
        
        .el-icon {
          margin-right: 6px;
        }
      }

      .el-button {
        height: 40px;
        padding: 0 24px;
        font-size: 14px;
        font-weight: 500;
        border-radius: 8px;
        
        &.el-button--primary {
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          color: #6366F1;
          
          &:hover {
            background: rgba(99, 102, 241, 0.15);
            border-color: rgba(99, 102, 241, 0.3);
          }
          
          .el-icon {
            margin-left: 6px;
          }
        }
      }

      .ship-button {
        background: rgba(99, 102, 241, 0.1);
        border: 1px solid rgba(99, 102, 241, 0.2);
        color: #6366F1;
        
        &:hover {
          background: rgba(99, 102, 241, 0.15);
          border-color: rgba(99, 102, 241, 0.3);
        }
        
        &:disabled {
          background: rgba(148, 163, 184, 0.1);
          border-color: rgba(148, 163, 184, 0.2);
          color: #94A3B8;
        }
        
        .el-icon {
          margin-right: 6px;
        }
      }

    :deep(.el-dropdown-menu__item) {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
        color: var(--text-primary);

      .el-icon {
        margin-right: 0;
          font-size: 16px;
        }

        &:hover {
          background-color: rgba(99, 102, 241, 0.1);
          color: #6366F1;
      }

      &.is-disabled {
        opacity: 0.6;
          color: var(--text-secondary);
        }

        &.el-dropdown-menu__item--divided {
          border-top-color: var(--border-color);
          margin-top: 4px;
          padding-top: 12px;
        }
      }
    }
  }

  .detail-content {
    padding: 48px 32px;
    display: grid;
    grid-template-columns: minmax(0, 2fr) 400px;
    gap: 40px;
    max-width: 1920px;
    margin: 0 auto;

    .main-section {
      display: grid;
      gap: 32px;

      .status-section {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
        border-radius: 32px;
        padding: 32px;
        border: 1px solid rgba(255, 255, 255, 0.04);
        position: relative;
  overflow: hidden;

        .status-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
          margin-bottom: 32px;

          .left {
            display: flex;
            align-items: center;
            gap: 20px;

    h3 {
      margin: 0;
              font-size: 20px;
              font-weight: 600;
              background: linear-gradient(135deg, #fff, rgba(255, 255, 255, 0.6));
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              letter-spacing: -0.5px;
            }
          }

          .right {
            .el-button {
              height: 40px;
              padding: 0 24px;
              background: rgba(99, 102, 241, 0.1);
              border: 1px solid rgba(99, 102, 241, 0.2);
              color: #6366F1;
              box-shadow: none;
              
              &:hover {
                background: rgba(99, 102, 241, 0.15);
                border-color: rgba(99, 102, 241, 0.3);
              }
            }
          }
        }

        .progress-timeline {
          position: relative;
          padding: 40px 0;
          display: flex;
          align-items: center;
          gap: 0;
          
          .timeline-node {
            flex: 1;
            position: relative;
            cursor: pointer;
            
            .node-content {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
              position: relative;
              z-index: 2;
              
              .node-dot {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: #1a1a1a;
                border: 2px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                position: relative;
                
                .el-icon {
                  font-size: 16px;
                  color: rgba(255, 255, 255, 0.6);
                  transition: all 0.3s ease;
                }
                
                .pulse-ring {
                  position: absolute;
                  top: -4px;
                  left: -4px;
                  right: -4px;
                  bottom: -4px;
                  border-radius: 50%;
                  border: 2px solid #6366F1;
                  animation: pulse 2s infinite;
                }
              }
              
              .node-info {
      display: flex;
      flex-direction: column;
                align-items: center;
      gap: 4px;

                .node-name {
                  font-size: 14px;
                  font-weight: 500;
                  color: rgba(255, 255, 255, 0.6);
                  transition: all 0.3s ease;
                }
                
                .node-time {
        font-size: 12px;
                  color: rgba(255, 255, 255, 0.4);
                }
                
                .block-reason {
                  font-size: 12px;
                  color: #FF9F0A;
                  text-align: center;
                  max-width: 200px;
                  line-height: 1.4;
                }
              }
            }
            
            .node-line {
              position: absolute;
              top: 16px;
              left: 50%;
              right: -50%;
              height: 2px;
              background: rgba(255, 255, 255, 0.1);
              z-index: 1;
              
              &.line-branch {
                .branch-line {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 2px;
                  background: rgba(255, 255, 255, 0.1);
                  transform-origin: left center;
                  
                  &:nth-child(1) {
                    transform: rotate(-15deg);
                  }
                  
                  &:nth-child(2) {
                    transform: rotate(15deg);
                  }
                  
                  &.branch-Exception {
                    background: linear-gradient(90deg, #F43F5E, rgba(244, 63, 94, 0.3));
                  }
                  
                  &.branch-Cancelled {
                    background: linear-gradient(90deg, #64748B, rgba(100, 116, 139, 0.3));
                  }
                }
              }
              
              .error-marker {
                position: absolute;
                top: -8px;
                left: 50%;
                transform: translateX(-50%);
                width: 20px;
                height: 20px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                
                &.warning {
                  background: #FF9F0A;
                  box-shadow: 0 0 12px rgba(255, 159, 10, 0.4);
                  
                  .el-icon {
                    color: white;
                    font-size: 12px;
                  }
                }
                
                &.error {
                  background: #F43F5E;
                  box-shadow: 0 0 12px rgba(244, 63, 94, 0.4);
                  
                  .el-icon {
                    color: white;
                    font-size: 12px;
                  }
                }
              }
            }
            
            // 开始节点样式
            &.type-start {
              .node-dot {
                background: rgba(52, 199, 89, 0.1);
                border-color: #34C759;
                
                .el-icon {
                  color: #34C759;
                }
              }
            }
            
            // 结束节点样式
            &.type-end {
              .node-dot {
                &::after {
                  content: '';
                  position: absolute;
                  top: -8px;
                  left: -8px;
                  right: -8px;
                  bottom: -8px;
                  border-radius: 50%;
                  border: 2px solid;
                  opacity: 0.2;
                }
              }
              
              &.completed {
                .node-dot {
                background: rgba(52, 199, 89, 0.1);
                  border-color: #34C759;
                
                .el-icon {
                  color: #34C759;
                }
                  
                  &::after {
                    border-color: #34C759;
                  }
              }
              
                .node-name {
                  color: #34C759;
                }
              }
              
              &.cancelled {
                .node-dot {
                  background: rgba(100, 116, 139, 0.1);
                  border-color: #64748B;
                  
                  .el-icon {
                    color: #64748B;
                  }
                  
                  &::after {
                    border-color: #64748B;
                  }
                }
                
                .node-name {
                  color: #64748B;
                  text-decoration: line-through;
                }
              }
            }
            
            // 当前节点样式
            &.current {
              .node-dot {
                background: rgba(99, 102, 241, 0.1);
                border-color: #6366F1;
                box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                
                .el-icon {
                  color: #6366F1;
                  animation: spin 1s linear infinite;
                }
              }
              
              .node-name {
                color: #6366F1;
                font-weight: 600;
              }
            }
            
            // 错误节点样式
            &.error {
              .node-dot {
                background: rgba(244, 63, 94, 0.1);
                border-color: #F43F5E;
                
                .el-icon {
                  color: #F43F5E;
                }
              }
              
              .node-name {
                color: #F43F5E;
              }
              
              .node-line {
                background: linear-gradient(90deg, #F43F5E, rgba(244, 63, 94, 0.3));
              }
            }
            
            // 阻塞节点样式
            &.is-blocked {
              .node-dot {
                border-style: dashed;
                animation: shake 1s ease-in-out infinite;
                }
              }
              
            &:hover {
              .node-dot {
                transform: scale(1.1);
              }
              
              .node-name {
                transform: translateY(-2px);
              }
            }
          }
        }
      }

      .info-grid {
  display: grid;
    grid-template-columns: repeat(2, 1fr);
        gap: 48px;
      }

      .info-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
        border-radius: 32px;
        padding: 40px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(24px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
        }

        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 100%;
          background: radial-gradient(
            ellipse at top,
            rgba(255, 255, 255, 0.05),
            transparent 70%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        &:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 12px 32px rgba(0, 0, 0, 0.3),
            0 2px 6px rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 255, 255, 0.1);

          &::after {
            opacity: 1;
          }
        }

        h3 {
          margin: 0 0 32px;
          font-size: 24px;
          font-weight: 600;
          background: linear-gradient(135deg, #fff, rgba(255, 255, 255, 0.6));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }

        .info-list {
    .info-item {
    display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0;
            
            &::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 1px;
              background: linear-gradient(90deg, 
                transparent,
                rgba(255, 255, 255, 0.04),
                transparent
              );
            }

            &:last-child::after {
              display: none;
            }
            
            &.highlight {
              background: rgba(52, 199, 89, 0.05);
              margin: 0 -40px;
              padding: 16px 40px;
              border-left: 3px solid #34C759;
              position: relative;
              
              &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg,
                  rgba(52, 199, 89, 0.1),
                  transparent
                );
                opacity: 0;
                transition: opacity 0.3s ease;
              }
              
              &:hover::before {
                opacity: 1;
              }
            }

            .label {
              color: rgba(255, 255, 255, 0.4);
              font-size: 15px;
              letter-spacing: 0.2px;
              transition: color 0.3s ease;
            }

            .value {
              color: rgba(255, 255, 255, 0.9);
              font-size: 15px;
              font-weight: 500;
              letter-spacing: 0.2px;
              transition: all 0.3s ease;
              
              &:hover {
                color: #34C759;
                transform: translateX(-4px);
              }
            }
          }
        }
      }

      .order-details-section {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
        border-radius: 32px;
        padding: 32px 24px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(24px);
        position: relative;
  overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, rgba(52, 199, 89, 0.05) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        &:hover::before {
          opacity: 1;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
  margin-bottom: 24px;

          h3 {
      margin: 0;
            font-size: 20px;
            font-weight: 600;
            background: linear-gradient(135deg, #fff, rgba(255, 255, 255, 0.6));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.5px;
  position: relative;

            &::after {
              content: '';
              position: absolute;
              bottom: -4px;
              left: 0;
              width: 40%;
              height: 2px;
              background: linear-gradient(90deg, #34C759, transparent);
            }
          }
        }

        .table-container {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          
          &::-webkit-scrollbar {
            height: 6px;
          }
          
          &::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
          }
          
          &::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            
            &:hover {
              background: rgba(255, 255, 255, 0.3);
            }
          }
        }

        .order-tabs {
          background: transparent;
          border: none;
          margin-top: 16px;

          :deep(.el-tabs__header) {
            background: transparent;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            margin: 0 0 24px 0;
            
            .el-tabs__nav {
              border: none;
              
              .el-tabs__item {
                background: transparent;
                border: none;
                color: rgba(255, 255, 255, 0.5);
                height: 48px;
                line-height: 48px;
                font-size: 14px;
                font-weight: 500;
                padding: 0 24px;
                transition: all 0.3s ease;
                position: relative;
                
                &:hover {
                  color: rgba(255, 255, 255, 0.8);
                }

                &.is-active {
                  color: #34C759;
                  font-weight: 600;
                  
                  &::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 80%;
                    height: 3px;
                    background: linear-gradient(90deg, #34C759, #30D158);
                    border-radius: 2px;
                    box-shadow: 0 2px 8px rgba(52, 199, 89, 0.3);
                  }
                }
              }
            }
          }

          :deep(.el-tabs__content) {
            background: transparent;
            padding: 0;
          }

          .tab-content {
            padding: 0;
          }
        }

        :deep(.el-table) {
          background: transparent;
          
          &::before,
          &::after {
            display: none;
          }
          
          .el-table__header-wrapper {
            th {
              background: rgba(255, 255, 255, 0.02) !important;
              border-bottom: 1px solid rgba(255, 255, 255, 0.04);
              color: rgba(255, 255, 255, 0.6);
              font-weight: 600;
              padding: 10px 8px;
              font-size: 12px;
              white-space: nowrap;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              
              .cell {
                color: rgba(255, 255, 255, 0.6);
              }
            }
          }
          
          .el-table__body-wrapper {
            background: transparent;
            
            td {
              background: transparent;
              border-bottom: 1px solid rgba(255, 255, 255, 0.04);
              color: rgba(255, 255, 255, 0.9);
              padding: 8px 12px;
              font-size: 13px;
            }
          }

          .el-table__row {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

            &:hover {
              background: rgba(255, 255, 255, 0.02) !important;
              td {
                background: transparent !important;
              }
            }
          }
        }

        .product-image {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #34C759, #30D158);
        }

        .item-name {
          font-size: 14px;
          margin-bottom: 4px;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 0.2px;
        }

        .item-category {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.2px;
        }

        .sn-code {
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
          font-size: 11px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          padding: 4px 8px;
          border-radius: 6px;
          color: #6366F1;
          letter-spacing: 0.5px;
          font-weight: 500;
          display: inline-block;
        }

        .quantity-display {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          text-align: center;
        }

        .uom-tag {
          font-size: 11px;
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
          text-transform: uppercase;
        }

        .price-display {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
        }

        .discount-display {
          .discount-amount {
            font-size: 13px;
            font-weight: 600;
            color: #10B981;
          }
          
          .no-discount {
            font-size: 12px;
            color: rgba(148, 163, 184, 0.6);
          }
        }

        .tax-display {
          .tax-amount {
          font-size: 13px;
            font-weight: 500;
            color: rgba(251, 191, 36, 0.9);
          }
          
          .no-tax {
            font-size: 12px;
            color: rgba(148, 163, 184, 0.6);
          }
        }

        .amount-display {
          font-size: 14px;
          font-weight: 600;
          color: #34C759;
          border-left: 2px solid rgba(52, 199, 89, 0.3);
          padding-left: 8px;
        }

        .remarks-text {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.4;
          max-height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        // Dispatched Details Tab 样式
        .dispatch-id {
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
          font-size: 11px;
          background: rgba(52, 199, 89, 0.1);
          border: 1px solid rgba(52, 199, 89, 0.2);
          padding: 4px 8px;
          border-radius: 6px;
          color: #34C759;
          font-weight: 500;
          display: inline-block;
        }

        .warehouse-info {
          .warehouse-name {
            font-size: 14px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 2px;
          }
          
          .warehouse-code {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.5);
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
          }
        }

        .tracking-link {
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
          font-size: 12px;
          font-weight: 500;
        }

        .no-tracking {
          color: rgba(255, 255, 255, 0.3);
          font-style: italic;
        }

        .dispatch-item,
        .package-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 8px;
          margin-bottom: 4px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 4px;
          
          &:last-child {
            margin-bottom: 0;
          }

          .item-sku {
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
            font-size: 12px;
            font-weight: 600;
            color: #6366F1;
          }

          .item-name {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.8);
            flex: 1;
          }

          .item-qty {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            font-weight: 500;
          }
        }

        // Packages Tab 样式
        .package-id {
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
          font-size: 11px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          padding: 4px 8px;
          border-radius: 6px;
          color: #6366F1;
          font-weight: 500;
          display: inline-block;
        }

        .weight-display,
        .dimensions-display {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
        }
      }

      .timeline-section {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
        border-radius: 32px;
        padding: 40px;
        border: 1px solid rgba(255, 255, 255, 0.04);
        backdrop-filter: blur(24px);
        
        // 时间线筛选样式
        .timeline-filters {
          margin-bottom: 24px;
          
          .timeline-tabs {
            margin-bottom: 16px;
            
            :deep(.el-tabs__header) {
              background: rgba(255, 255, 255, 0.02);
              border-radius: 12px;
              padding: 4px;
              border: 1px solid rgba(255, 255, 255, 0.06);
              margin: 0;
            }
            
            :deep(.el-tabs__nav) {
              border: none;
            }
            
            :deep(.el-tabs__item) {
              background: transparent;
              border: none !important;
              border-radius: 8px !important;
              margin: 0 2px;
              padding: 8px 16px;
              color: rgba(255, 255, 255, 0.7);
              transition: all 0.3s ease;
              
              .tab-label {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                
                .el-icon {
                  font-size: 14px;
                }
                
                .tab-badge {
                  :deep(.el-badge__content) {
                    background: rgba(99, 102, 241, 0.8);
                    border: none;
                    font-size: 10px;
                    height: 16px;
                    line-height: 16px;
                    min-width: 16px;
                    padding: 0 4px;
                  }
                }
              }
              
              &.is-active {
                background: rgba(99, 102, 241, 0.15);
                color: #6366F1;
                
                .tab-badge {
                  :deep(.el-badge__content) {
                    background: #6366F1;
                    color: white;
                  }
                }
              }
              
              &:hover {
                background: rgba(255, 255, 255, 0.05);
                color: rgba(255, 255, 255, 0.9);
              }
            }
          }
          
          .advanced-filters {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            
            .filter-buttons {
              display: flex;
              gap: 8px;
              flex-wrap: wrap;
              
              .el-button {
                padding: 6px 12px;
                border-radius: 8px;
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 4px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(255, 255, 255, 0.02);
                color: rgba(255, 255, 255, 0.7);
                transition: all 0.3s ease;
                
                .el-icon {
                  font-size: 12px;
                }
                
                .filter-badge {
                  :deep(.el-badge__content) {
                    background: rgba(148, 163, 184, 0.8);
                    border: none;
                    font-size: 9px;
                    height: 14px;
                    line-height: 14px;
                    min-width: 14px;
                    padding: 0 3px;
                  }
                }
                
                &.el-button--primary {
                  background: rgba(99, 102, 241, 0.15);
                  border-color: rgba(99, 102, 241, 0.3);
                  color: #6366F1;
                  
                  .filter-badge {
                    :deep(.el-badge__content) {
                      background: #6366F1;
                      color: white;
                    }
                  }
                }
                
                &:hover {
                  background: rgba(255, 255, 255, 0.05);
                  border-color: rgba(255, 255, 255, 0.2);
                  color: rgba(255, 255, 255, 0.9);
                }
              }
            }
          }
        }
        
        // 无数据提示样式
        .no-timeline-data {
          padding: 40px 20px;
          text-align: center;
          
          :deep(.el-empty__description) {
            color: rgba(255, 255, 255, 0.6);
          }
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;

          h3 {
      margin: 0;
            font-size: 24px;
            font-weight: 600;
            background: linear-gradient(135deg, #fff, rgba(255, 255, 255, 0.6));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.5px;
          }
        }

        .timeline-pagination {
          display: flex;
          justify-content: center;
          margin-top: 24px;
          
          :deep(.el-pagination) {
            --el-pagination-bg-color: rgba(255, 255, 255, 0.05);
            --el-pagination-text-color: rgba(255, 255, 255, 0.8);
            --el-pagination-hover-color: #6366F1;
            
            .btn-prev, .btn-next {
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.1);
              color: rgba(255, 255, 255, 0.7);
              
              &:hover {
                background: rgba(99, 102, 241, 0.1);
                border-color: #6366F1;
                color: #6366F1;
              }
            }
            
            .el-pager li {
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.1);
              color: rgba(255, 255, 255, 0.7);
              margin: 0 4px;
              border-radius: 6px;
              
              &:hover {
                background: rgba(99, 102, 241, 0.1);
                border-color: #6366F1;
                color: #6366F1;
              }
              
              &.is-active {
                background: #6366F1;
                border-color: #6366F1;
                color: white;
              }
            }
          }
        }

        :deep(.el-timeline) {
          padding-left: 20px;

          .el-timeline-item__node {
            background: linear-gradient(135deg, #6366F1, #4F46E5) !important;
      border: none;
            box-shadow: 0 0 0 6px rgba(99, 102, 241, 0.15) !important;
          }

          .el-timeline-item__tail {
            border-left: 2px solid rgba(255, 255, 255, 0.04);
          }

          .el-timeline-item__timestamp {
            color: rgba(255, 255, 255, 0.4);
            font-size: 13px;
            padding-top: 6px;
            letter-spacing: 0.2px;
          }

          .el-timeline-item__content {
            h4 {
              font-size: 15px;
              font-weight: 500;
              margin: 0 0 6px;
              color: rgba(255, 255, 255, 0.9);
              letter-spacing: 0.2px;
            }

            p {
      font-size: 14px;
              color: rgba(255, 255, 255, 0.4);
              margin: 0 0 6px;
              letter-spacing: 0.2px;
            }

            .operator {
              font-size: 14px;
              color: rgba(255, 255, 255, 0.6);
              letter-spacing: 0.2px;
            }

            .email-info {
              display: flex;
              gap: 6px;
              align-items: center;
              color: rgba(255, 255, 255, 0.6);
              letter-spacing: 0.2px;
            }

            .el-button {
              margin-top: 12px;
              padding: 0;
              height: auto;
              font-size: 14px;
              color: #6366F1;
              letter-spacing: 0.2px;

              &:hover {
                color: #818CF8;
              }
            }

            // 优化后的紧凑时间轴样式
            .timeline-item-content {
              .timeline-header {
                margin-bottom: 12px;

                .header-main {
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  margin-bottom: 6px;

                  .timeline-title {
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0;
                    color: rgba(255, 255, 255, 0.9);
                  }

                  .action-type-tag {
                    font-size: 11px;
                    height: 20px;
                    padding: 0 8px;
                    border-radius: 10px;
                    font-weight: 500;
                  }
                }

                .header-meta {
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  font-size: 13px;

                  .actor {
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 500;
                  }

                  .object {
                    color: rgba(255, 255, 255, 0.5);
                    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 12px;
                  }
                }
              }

              .timeline-content {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.7);
                margin: 8px 0;
                line-height: 1.5;
              }

              .timeline-reason {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-top: 8px;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
                background: rgba(255, 255, 255, 0.03);
                padding: 6px 10px;
                border-radius: 6px;
                border-left: 2px solid #6366F1;

                .el-icon {
                  font-size: 12px;
                  color: #6366F1;
                }
              }

              .timeline-operator {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                color: rgba(255, 255, 255, 0.6);
                margin: 8px 0;

                .el-icon {
                  font-size: 14px;
                }
              }

              .timeline-metadata {
                margin-top: 12px;
                padding: 12px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                border-left: 3px solid var(--el-color-primary);
                
                .metadata-item {
                  display: flex;
                  margin-bottom: 6px;
                  font-size: 13px;
                  
                  &:last-child {
                    margin-bottom: 0;
                  }
                  
                  .metadata-label {
                    min-width: 80px;
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 500;
                  }
                  
                  .metadata-value {
                    color: rgba(255, 255, 255, 0.9);
                    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
                  }
                }
              }

              .timeline-details {
                margin-top: 12px;

                .details-toggle {
                  font-size: 12px;
                  padding: 4px 8px;
                  height: auto;
                  color: rgba(255, 255, 255, 0.6);
                  
                  &:hover {
                    color: #6366F1;
                  }
                  
                  .el-icon {
                    margin-right: 4px;
                  }
                }

                .details-content {
                  margin-top: 8px;
                  padding: 12px;
                  background: rgba(255, 255, 255, 0.03);
                  border-radius: 8px;
                  border: 1px solid rgba(255, 255, 255, 0.08);

                  .detail-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 6px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    
                    &:last-child {
                      border-bottom: none;
                      padding-bottom: 0;
                    }

                    .detail-label {
                      font-size: 12px;
                      color: rgba(255, 255, 255, 0.6);
                      font-weight: 500;
                      min-width: 100px;
                    }

                    .detail-value {
                      font-size: 13px;
                      color: rgba(255, 255, 255, 0.8);
                      text-align: right;
                      max-width: 200px;
                      word-break: break-all;

                      &.success {
                        color: #67C23A;
                        font-weight: 600;
                      }

                      &.highlight {
                        color: #6366F1;
                        font-weight: 600;
                      }

                      &.error {
                        color: #F56C6C;
                        font-weight: 600;
                      }

                      &.code {
                        font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
                        background: rgba(255, 255, 255, 0.05);
                        padding: 2px 6px;
                        border-radius: 4px;
                        font-size: 11px;
                      }
                    }
                  }

                  .detail-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 12px;

                    .detail-item {
                      display: flex;
                      flex-direction: column;
                      gap: 4px;

                      &.full-width {
                        grid-column: 1 / -1;
                      }

                      .detail-label {
                        font-size: 12px;
                        color: rgba(255, 255, 255, 0.5);
                        font-weight: 500;
                      }

                      .detail-value {
                        font-size: 13px;
                        color: rgba(255, 255, 255, 0.8);

                        &.success {
                          color: #67C23A;
                          font-weight: 600;
                        }

                        &.highlight {
                          color: #6366F1;
                          font-weight: 600;
                        }

                        &.error {
                          color: #F56C6C;
                          font-weight: 600;
                        }

                        &.code {
                          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
                          background: rgba(255, 255, 255, 0.05);
                          padding: 2px 6px;
                          border-radius: 4px;
                          font-size: 12px;
                        }
                      }
                    }
                  }

                  .items-list {
                    .items-title {
                      font-size: 13px;
                      color: rgba(255, 255, 255, 0.8);
                      font-weight: 600;
                      margin-bottom: 8px;
                    }

                    .item-row {
                      display: flex;
                      gap: 12px;
                      padding: 6px 8px;
                      margin-bottom: 4px;
                      background: rgba(255, 255, 255, 0.02);
                      border-radius: 4px;

                      .item-sku {
                        font-weight: 600;
                        color: #6366F1;
                        min-width: 80px;
                      }

                      .item-name {
                        flex: 1;
                        color: rgba(255, 255, 255, 0.8);
                      }

                      .item-qty, .item-location {
                        font-size: 12px;
                        color: rgba(255, 255, 255, 0.6);
                      }
                    }
                  }

                  .changes-list {
                    .changes-title {
                      font-size: 13px;
                      color: rgba(255, 255, 255, 0.8);
                      font-weight: 600;
                      margin-bottom: 8px;
                    }

                    .change-row {
                      padding: 8px;
                      margin-bottom: 8px;
                      background: rgba(255, 255, 255, 0.02);
                      border-radius: 4px;

                      .change-field {
                        font-weight: 600;
                        color: rgba(255, 255, 255, 0.8);
                        margin-bottom: 4px;
                      }

                      .change-values {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 4px;

                        .old-value {
                          color: #F56C6C;
                          text-decoration: line-through;
                        }

                        .arrow-icon {
                          color: rgba(255, 255, 255, 0.5);
                        }

                        .new-value {
                          color: #67C23A;
                          font-weight: 600;
                        }
                      }

                      .change-reason {
                        font-size: 12px;
                        color: rgba(255, 255, 255, 0.6);
                      }
                    }

                    .approval-info {
                      margin-top: 8px;
                      padding-top: 8px;
                      border-top: 1px solid rgba(255, 255, 255, 0.1);
                      font-size: 12px;

                      .detail-label {
                        color: rgba(255, 255, 255, 0.5);
                      }

                      .detail-value {
                        color: rgba(255, 255, 255, 0.8);
                        font-weight: 600;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    .side-section {
      display: grid;
      gap: 32px;
      align-content: start;

      .info-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
        border-radius: 24px;
        padding: 32px 24px;
        border: 1px solid rgba(255, 255, 255, 0.04);
        backdrop-filter: blur(24px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.08);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;

          h3 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            background: linear-gradient(135deg, #fff, rgba(255, 255, 255, 0.6));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.5px;
          }

          .el-tag {
            height: 28px;
            padding: 0 16px;
            border-radius: 14px;
            font-size: 13px;
      font-weight: 500;
            letter-spacing: 0.2px;

            &.el-tag--success {
              background: rgba(52, 199, 89, 0.15);
              color: #34C759;
            }

            &.el-tag--warning {
              background: rgba(255, 159, 10, 0.15);
              color: #FF9F0A;
            }

            &.el-tag--info {
              background: rgba(100, 116, 139, 0.15);
              color: #64748B;
            }
          }
        }

        .info-list {
          .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0;
            
            &.highlight {
              background: rgba(52, 199, 89, 0.05);
              margin: 0 -40px;
              padding: 16px 40px;
              border-left: 3px solid #34C759;
            }

            .label {
              color: rgba(255, 255, 255, 0.4);
              font-size: 15px;
              letter-spacing: 0.2px;
            }

            .value {
              color: rgba(255, 255, 255, 0.9);
              font-size: 15px;
              font-weight: 500;
              letter-spacing: 0.2px;
            }
          }
        }
      }

      .custom-tabs {
        background: transparent;
      border: none;

        :deep(.el-tabs__header) {
          background: transparent;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          margin: 0;
          
          .el-tabs__nav {
            border: none;
            
            .el-tabs__item {
              background: transparent;
              border: none;
              color: rgba(255, 255, 255, 0.4);
              height: 48px;
              line-height: 48px;
              font-size: 14px;
              transition: all 0.3s ease;
              
              &:hover {
                color: rgba(255, 255, 255, 0.9);
              }

      &.is-active {
                color: #34C759;
                font-weight: 500;
                
                &::after {
                  content: '';
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  width: 100%;
                  height: 2px;
                  background: #34C759;
                  box-shadow: 0 0 8px rgba(52, 199, 89, 0.4);
                }
              }
            }
          }
        }

        :deep(.el-tabs__content) {
          background: transparent;
          padding: 20px 16px;
        }
      }

      .tab-content {
        .info-section {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          
          &:last-child {
            margin-bottom: 0;
          }

          .section-title {
            margin-bottom: 32px;

            .title-content {
              display: flex;
              align-items: center;
              gap: 12px;

              .status-tag {
                height: 24px;
                padding: 0 12px;
                border-radius: 12px;
                font-size: 13px;
              }
            }
          }

          .amount-list {
            margin-bottom: 32px;
            
            .info-item {
              display: flex;
              justify-content: space-between;
              padding: 16px 0;
              border-bottom: 1px solid rgba(255, 255, 255, 0.04);
              
              &:last-child {
                border-bottom: none;
              }

              .discount {
                color: #FF3B30;
              }

              &.total {
                margin-top: 16px;
                padding-top: 24px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                
                .label {
                  font-size: 16px;
      font-weight: 600;
                  color: rgba(255, 255, 255, 0.9);
                }
                
                .value {
                  font-size: 20px;
                  font-weight: 600;
                  color: #34C759;
                }
              }
            }
          }

          .payment-details {
            margin-bottom: 32px;
            
            .info-group {
              background: rgba(255, 255, 255, 0.02);
              border-radius: 12px;
              padding: 24px;
              border: 1px solid rgba(255, 255, 255, 0.04);
              
              .info-item {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.04);
                
                &:last-child {
                  border-bottom: none;
                }

                .highlight {
                  color: #34C759;
                  font-weight: 500;
                }
              }
            }
          }

          .action-group {
            display: flex;
            justify-content: flex-end;
            gap: 24px;
            padding-top: 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.06);

            .el-button {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 14px;
              
              &:hover {
                transform: translateY(-2px);
                transition: all 0.3s ease;
              }

              .el-icon {
                font-size: 16px;
              }
            }
          }
        }
      }
    }
  }
}

.info-section {
  .info-list {
    .info-item {
      .value-with-link {
        display: flex;
        align-items: center;
        gap: 12px;

        .value {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.2px;
        }

        .el-button {
          padding: 0;
          height: auto;
          font-size: 14px;

          &:hover {
            transform: translateX(4px);
            transition: all 0.3s ease;
          }
        }
      }

      .highlight-warning {
        color: #FF9F0A;
        font-weight: 500;
      }

      .highlight-success {
        color: #6366F1 !important;
        font-weight: 500;
      }
    }
  }
}

.tracking-numbers {
  flex-direction: column !important;
  align-items: flex-start !important;
  gap: 12px;
  
  .tracking-list {
    width: 100%;
  display: flex;
  flex-direction: column;
    gap: 12px;
    
    .tracking-item {
      background: rgba(255, 255, 255, 0.02);
      border-radius: 8px;
      padding: 12px;
      width: 100%;
      
      .tracking-item-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        
        .sub-order {
          color: rgba(255, 255, 255, 0.4);
          font-size: 12px;
        }
        
        .carrier {
          color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
          font-weight: 500;
        }
      }
      
      .tracking-number {
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0.2px;
        
        &:hover {
          transform: translateX(4px);
          transition: all 0.3s ease;
        }
      }
    }
  }
}

.customer-info {
  .address-info {
    display: flex;
    flex-direction: column;
    gap: 24px;

    .address-section {
      background: rgba(255, 255, 255, 0.02);
      border-radius: 12px;
      padding: 24px;
      border: 1px solid rgba(255, 255, 255, 0.04);

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        h5 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 0.2px;
        }

        .edit-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.3s ease;

          .el-icon {
            font-size: 14px;
          }

          &:hover {
            color: #34C759;
            transform: translateY(-1px);
          }
        }
      }

      .address-content {
        p {
          margin: 0;
          padding: 4px 0;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          letter-spacing: 0.2px;
          line-height: 1.5;

          &.name {
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
          }

          &.phone {
            color: rgba(255, 255, 255, 0.4);
            margin-bottom: 8px;
          }
        }
      }
    }
  }
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .title-content {
    display: flex;
    align-items: center;
    gap: 12px;

    h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      background: linear-gradient(135deg, #fff, rgba(255, 255, 255, 0.6));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 0.2px;
    }

    .status-tag {
      height: 24px;
      padding: 0 12px;
      border-radius: 12px;
      font-size: 13px;
    }
  }

  .el-button {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    
    &:hover {
      transform: translateY(-2px);
      transition: all 0.3s ease;
    }

    .el-icon {
      font-size: 16px;
    }
  }
}

:deep(.el-button--primary.el-button--link) {
  color: #6366F1;
  
  &:hover {
    color: #818CF8;
  }
}

:deep(.el-tag--success) {
  background: rgba(99, 102, 241, 0.15) !important;
  color: #6366F1 !important;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.15) !important;
}

.highlight-success {
  color: #6366F1 !important;
}

:deep(.el-timeline-item__node--success) {
  background: linear-gradient(135deg, #6366F1, #4F46E5) !important;
  box-shadow: 0 0 0 6px rgba(99, 102, 241, 0.15) !important;
}

.products-section {
  :deep(.el-input) {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    
    .el-input__wrapper {
      background: transparent;
      box-shadow: none !important;
    }
    
    .el-input__inner {
      color: rgba(255, 255, 255, 0.9);
      height: 36px;
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.3);
      }
    }
    
    &:hover,
    &:focus {
      border-color: rgba(99, 102, 241, 0.3);
    }
    
    &.is-focus {
      border-color: #6366F1;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
    }
  }

  :deep(.el-input-number) {
    width: 120px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    
    &.el-input-number--small {
      width: 100px;
    }
    
    .el-input__wrapper {
      background: transparent;
      box-shadow: none !important;
    }
    
    .el-input__inner {
      color: rgba(255, 255, 255, 0.9);
      height: 36px;
      text-align: center;
      
      &.el-input--small .el-input__inner {
        height: 32px;
      }
    }
    
    .el-input-number__decrease,
    .el-input-number__increase {
      background: rgba(255, 255, 255, 0.02);
      border-color: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.6);
      
      &:hover {
        color: #6366F1;
      }
    }
    
    &:hover {
      border-color: rgba(99, 102, 241, 0.3);
    }
    
    &.is-focus {
      border-color: #6366F1;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
    }
  }

  :deep(.el-textarea) {
    .el-textarea__inner {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      color: rgba(255, 255, 255, 0.9);
      resize: none;
      min-height: 32px;
      font-size: 13px;
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.3);
      }
      
      &:hover {
        border-color: rgba(99, 102, 241, 0.3);
      }
      
      &:focus {
        border-color: #6366F1;
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
      }
    }
  }
}

.customer-info {
  :deep(.el-form) {
    .el-form-item {
      margin-bottom: 16px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .el-form-item__label {
        color: rgba(255, 255, 255, 0.4);
        font-size: 13px;
        padding-bottom: 4px;
      }
      
  .el-input {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        
        .el-input__wrapper {
          background: transparent;
          box-shadow: none !important;
        }
        
        .el-input__inner {
          color: rgba(255, 255, 255, 0.9);
          height: 36px;
          
          &::placeholder {
            color: rgba(255, 255, 255, 0.3);
          }
        }
        
        &:hover {
          border-color: rgba(99, 102, 241, 0.3);
        }
        
        &.is-focus {
          border-color: #6366F1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
        }
      }
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Tooltip样式
:deep(.el-tooltip__popper) {
  &.node-tooltip {
    background: rgba(17, 24, 39, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
    border-radius: 12px;
    padding: 0;
    
    .tooltip-content {
      min-width: 280px;
      
      .tooltip-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        
        .el-icon {
          font-size: 16px;
        }
        
        span {
          font-weight: 500;
        }
      }
      
      .tooltip-body {
        padding: 16px;
        
        p {
          margin: 0 0 8px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
          
          &:last-child {
            margin-bottom: 0;
          }
        }
        
        .error-info {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          
          .error-title {
            color: #F43F5E;
            font-weight: 500;
            margin-bottom: 8px;
          }
          
          ul {
            margin: 0;
            padding-left: 16px;
            
            li {
              color: rgba(255, 255, 255, 0.6);
              margin-bottom: 4px;
              
              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }
        
        .suggested-actions {
          margin-top: 16px;
          
          .action-title {
            font-weight: 500;
            margin-bottom: 12px;
          }
          
          .action-buttons {
            display: flex;
            gap: 8px;
            
            .el-button {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 4px;
              height: 32px;
              font-size: 13px;
              
              .el-icon {
                font-size: 14px;
              }
            }
          }
        }
      }
    }
    
    &.error-tooltip {
      .tooltip-header {
        background: rgba(244, 63, 94, 0.1);
        
        .el-icon {
          color: #F43F5E;
        }
      }
    }
  }
}

// 节点详情弹窗样式
:deep(.node-detail-dialog) {
  .error-content {
    .error-section {
      margin-bottom: 24px;
      
      h4 {
        color: #F43F5E;
        margin: 0 0 12px;
      }
      
      ul {
        margin: 0;
        padding-left: 20px;
        
        li {
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.6);
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    
    .action-section {
      h4 {
        margin: 0 0 12px;
      }
      
      .action-list {
        display: flex;
        gap: 12px;
        
        .action-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 36px;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          
          &.primary {
            background: #6366F1;
            color: white;
            
            &:hover {
              background: #4F46E5;
            }
          }
          
          &.danger {
            background: #F43F5E;
            color: white;
            
            &:hover {
              background: #E11D48;
            }
          }
        }
      }
    }
  }
}

// 动画
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  75% {
    transform: translateX(2px);
  }
}

// 提示框样式
.node-tooltip {
  background: rgba(17, 24, 39, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(12px);
  border-radius: 12px !important;
  padding: 0 !important;
  
  .tooltip-content {
    min-width: 280px;
    
    .tooltip-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      .el-icon {
        font-size: 16px;
      }
      
      span {
        font-weight: 500;
      }
    }
    
    .tooltip-body {
      padding: 16px;
      
      p {
        margin: 0 0 8px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.6);
        
        &:last-child {
          margin-bottom: 0;
        }
      }
      
      .error-info,
      .block-info {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        
        .error-title,
        .block-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
          margin-bottom: 8px;
          
          .el-icon {
            font-size: 14px;
          }
        }
      }
      
      .error-info {
        .error-title {
          color: #F43F5E;
          
          .el-icon {
            color: #F43F5E;
          }
        }
        
        ul {
          margin: 0;
          padding-left: 16px;
          
          li {
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 4px;
            
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
      
      .block-info {
        .block-title {
          color: #FF9F0A;
          
          .el-icon {
            color: #FF9F0A;
          }
        }
        
        .block-reason {
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.4;
        }
      }
      
      .suggested-actions {
        margin-top: 16px;
        
        .action-title {
          font-weight: 500;
          margin-bottom: 12px;
        }
        
        .action-buttons {
          display: flex;
          gap: 8px;
          
          .el-button {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            height: 32px;
            font-size: 13px;
            
            .el-icon {
              font-size: 14px;
            }
            
            &.el-button--primary {
              background: rgba(99, 102, 241, 0.1);
              border-color: rgba(99, 102, 241, 0.2);
              color: #6366F1;
              
              &:hover {
                background: rgba(99, 102, 241, 0.15);
                border-color: rgba(99, 102, 241, 0.3);
              }
            }
            
            &.el-button--danger {
              background: rgba(244, 63, 94, 0.1);
              border-color: rgba(244, 63, 94, 0.2);
              color: #F43F5E;
              
              &:hover {
                background: rgba(244, 63, 94, 0.15);
                border-color: rgba(244, 63, 94, 0.3);
              }
            }
          }
        }
      }
    }
  }
  
  &.error-tooltip {
    .tooltip-header {
      background: rgba(244, 63, 94, 0.1);
      
      .el-icon {
        color: #F43F5E;
      }
    }
  }
  
  &.blocked-tooltip {
    .tooltip-header {
      background: rgba(255, 159, 10, 0.1);
      
      .el-icon {
        color: #FF9F0A;
      }
    }
  }
}

// 节点详情弹窗样式
.node-detail-dialog {
  .el-message-box__content {
    padding: 0;
    
    .node-content {
      .error-section,
      .block-section {
        padding: 16px;
        
        h4 {
          margin: 0 0 12px;
          font-size: 16px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
        }
      }
      
      .error-section {
        background: rgba(244, 63, 94, 0.05);
        
        h4 {
          color: #F43F5E;
        }
        
        ul {
          margin: 0;
          padding-left: 20px;
          
          li {
            margin-bottom: 8px;
            color: rgba(255, 255, 255, 0.6);
            
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
      
      .block-section {
        background: rgba(255, 159, 10, 0.05);
        
        h4 {
          color: #FF9F0A;
        }
        
        p {
          margin: 0;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.5;
        }
      }
      
      .action-section {
        padding: 16px;
        
        h4 {
          margin: 0 0 12px;
          font-size: 16px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .action-list {
          display: flex;
          gap: 12px;
          
          .action-button {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            height: 36px;
            border-radius: 8px;
            border: none;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            
            &.primary {
              background: rgba(99, 102, 241, 0.1);
              border: 1px solid rgba(99, 102, 241, 0.2);
              color: #6366F1;
              
              &:hover {
                background: rgba(99, 102, 241, 0.15);
                border-color: rgba(99, 102, 241, 0.3);
              }
            }
            
            &.danger {
              background: rgba(244, 63, 94, 0.1);
              border: 1px solid rgba(244, 63, 94, 0.2);
              color: #F43F5E;
              
              &:hover {
                background: rgba(244, 63, 94, 0.15);
                border-color: rgba(244, 63, 94, 0.3);
              }
            }
          }
        }
      }
    }
  }
}



// Dispatch卡片列表样式
.dispatch-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  .dispatch-card {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    overflow: hidden;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: rgba(255, 255, 255, 0.12);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
    
    .dispatch-main-info {
      padding: 16px 20px;
      background: rgba(255, 255, 255, 0.01);
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      
      .dispatch-header {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
        
        .dispatch-id {
          font-size: 14px;
          font-weight: 700;
          color: #10B981;
          background: rgba(16, 185, 129, 0.15);
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid rgba(16, 185, 129, 0.3);
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }
        
        .warehouse-info {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.05);
          padding: 6px 10px;
          border-radius: 5px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .carrier-info {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.03);
          padding: 6px 10px;
          border-radius: 5px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .tracking-link {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 12px;
          background: rgba(99, 102, 241, 0.1);
          padding: 6px 10px;
          border-radius: 5px;
          border: 1px solid rgba(99, 102, 241, 0.3);
          text-decoration: none;
          
          &:hover {
            background: rgba(99, 102, 241, 0.2);
          }
        }
        
        .date-info {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.02);
          padding: 6px 8px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
      }
    }
    
    .dispatch-items-section {
      padding: 12px 20px 16px;
      
      .items-header {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        padding: 8px 12px;
        border-radius: 6px;
        transition: all 0.2s ease;
        
        &:hover {
          background: rgba(255, 255, 255, 0.03);
        }
        
        .items-label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 500;
          min-width: 60px;
        }
        
        .items-preview {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          
          .first-item {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.8);
            background: rgba(99, 102, 241, 0.1);
            padding: 4px 8px;
            border-radius: 4px;
            border: 1px solid rgba(99, 102, 241, 0.2);
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          }
          
          .more-items {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            background: rgba(255, 255, 255, 0.05);
            padding: 4px 8px;
            border-radius: 4px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
        }
        
        .expand-icon {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          transition: all 0.3s ease;
          
          &.expanded {
            transform: rotate(180deg);
            color: rgba(255, 255, 255, 0.6);
          }
        }
      }
      
      .items-detail-expanded {
        margin-top: 8px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.01);
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.04);
        border-left: 3px solid rgba(99, 102, 241, 0.3);
        
        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 8px;
        }
        
        .dispatch-item-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 10px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.2s ease;
          
          &:hover {
            background: rgba(255, 255, 255, 0.04);
            border-color: rgba(99, 102, 241, 0.3);
            transform: translateY(-1px);
          }
          
          .item-sku {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 11px;
            color: #6366F1;
            background: rgba(99, 102, 241, 0.15);
            padding: 4px 8px;
            border-radius: 4px;
            border: 1px solid rgba(99, 102, 241, 0.3);
            font-weight: 600;
            text-align: center;
            margin-bottom: 6px;
          }
          
          .item-qty {
            font-size: 12px;
            color: #10B981;
            font-weight: 700;
            background: rgba(16, 185, 129, 0.15);
            padding: 4px 8px;
            border-radius: 8px;
            border: 1px solid rgba(16, 185, 129, 0.3);
          }
        }
      }
    }
  }
}

// Tab区域商品列表样式
.order-tabs {
  .items-container {
    .items-summary-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.12);
        transform: translateY(-1px);
      }
      
      .summary-info {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .total-qty {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.08);
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
      }
      
      .expand-icon {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        transition: all 0.3s ease;
        
        &.expanded {
          transform: rotate(180deg);
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
    
    .items-detail-expanded {
      margin-top: 8px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.01);
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-top: 2px solid rgba(99, 102, 241, 0.3);
      
      .items-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 8px;
      }
      
      .dispatch-item-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        transition: all 0.2s ease;
        position: relative;
        
        &:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .item-sku {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 11px;
          color: #6366F1;
          background: rgba(99, 102, 241, 0.15);
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid rgba(99, 102, 241, 0.3);
          font-weight: 600;
          text-align: center;
          margin-bottom: 6px;
        }
        
        .item-qty {
          font-size: 12px;
          color: #10B981;
          font-weight: 700;
          background: rgba(16, 185, 129, 0.15);
          padding: 4px 10px;
          border-radius: 12px;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
      }
      
      .package-item-card {
        display: flex;
        flex-direction: column;
        padding: 10px 12px;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        transition: all 0.2s ease;
        
        &:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(139, 92, 246, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          
          .item-name {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
            line-height: 1.3;
            flex: 1;
            margin-right: 8px;
          }
          
          .item-qty {
            font-size: 11px;
            color: #10B981;
            font-weight: 700;
            background: rgba(16, 185, 129, 0.15);
            padding: 3px 8px;
            border-radius: 10px;
            border: 1px solid rgba(16, 185, 129, 0.3);
            white-space: nowrap;
          }
        }
        
        .item-sku {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 10px;
          color: #8B5CF6;
          background: rgba(139, 92, 246, 0.15);
          padding: 3px 6px;
          border-radius: 3px;
          border: 1px solid rgba(139, 92, 246, 0.3);
          align-self: flex-start;
        }
      }
    }
  }

  // 新的展开式商品明细样式
  .expanded-items-section {
    padding: 16px 24px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.03), rgba(139, 92, 246, 0.02));
    border-radius: 8px;
    border: 1px solid rgba(99, 102, 241, 0.1);
    margin: 8px 0;
    
    .items-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 600;
      
      .el-icon {
        color: #6366F1;
        font-size: 16px;
      }
    }
    
    .items-table-container {
      margin-top: 8px;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.08);
      
      .el-table {
        background: transparent !important;
        
        .el-table__header {
          background: rgba(255, 255, 255, 0.02) !important;
          
          th {
            background: transparent !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
            color: rgba(255, 255, 255, 0.8) !important;
            font-size: 12px !important;
            font-weight: 600 !important;
            padding: 8px !important;
          }
        }
        
        .el-table__body {
          tr {
            background: transparent !important;
            
            &:hover {
              background: rgba(255, 255, 255, 0.02) !important;
            }
            
            td {
              background: transparent !important;
              border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
              padding: 8px !important;
            }
          }
        }
      }
      
      .item-sku {
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 11px;
        color: #6366F1;
        background: rgba(99, 102, 241, 0.15);
        padding: 3px 6px;
        border-radius: 3px;
        border: 1px solid rgba(99, 102, 241, 0.3);
        font-weight: 600;
      }
      
      .item-name {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
      }
      
      .item-quantity {
        font-size: 12px;
        color: #10B981;
        font-weight: 700;
        background: rgba(16, 185, 129, 0.15);
        padding: 3px 8px;
        border-radius: 10px;
        border: 1px solid rgba(16, 185, 129, 0.3);
      }
      
      .item-sn {
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 11px;
        color: #8B5CF6;
        background: rgba(139, 92, 246, 0.15);
        padding: 3px 6px;
        border-radius: 3px;
        border: 1px solid rgba(139, 92, 246, 0.3);
        font-weight: 600;
      }
      
      .item-lot {
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 11px;
        color: #F59E0B;
        background: rgba(245, 158, 11, 0.15);
        padding: 3px 6px;
        border-radius: 3px;
        border: 1px solid rgba(245, 158, 11, 0.3);
        font-weight: 600;
      }
      
      .item-uom {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.7);
        background: rgba(255, 255, 255, 0.08);
        padding: 2px 6px;
        border-radius: 3px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        white-space: nowrap;
        display: inline-block;
      }
    }
  }

  // Items Summary 列样式
  .items-summary {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .total-qty {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.7);
      background: rgba(255, 255, 255, 0.08);
      padding: 3px 6px;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
    
    .quick-preview {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.6);
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      background: rgba(255, 255, 255, 0.04);
      padding: 3px 6px;
      border-radius: 3px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
  }

  // 物流跟踪弹窗样式
  :deep(.tracking-dialog) {
    .el-dialog__header {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05));
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      .el-dialog__title {
        color: rgba(255, 255, 255, 0.9);
        font-weight: 600;
        font-size: 16px;
      }
    }
    
    .el-dialog__body {
      padding: 0;
    }
    
    .el-dialog__footer {
      background: rgba(255, 255, 255, 0.02);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
  }

  .tracking-detail-content {
    .tracking-header {
      padding: 20px 24px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.02));
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      
      .tracking-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        
        .info-row {
          display: flex;
          align-items: center;
          gap: 12px;
          
          .label {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.6);
            min-width: 60px;
          }
          
          .value {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          }
        }
      }
    }
    
    .tracking-timeline {
      padding: 24px;
      
      h4 {
        margin: 0 0 20px 0;
        color: rgba(255, 255, 255, 0.9);
        font-size: 16px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        
        &:before {
          content: '📦';
          font-size: 18px;
        }
      }
      
      .el-timeline {
        padding-left: 0;
        
        .el-timeline-item {
          .el-timeline-item__timestamp {
            color: rgba(255, 255, 255, 0.6);
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 4px;
          }
          
          .timeline-event {
            .event-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 8px;
              
              .event-status {
                margin: 0;
                font-size: 14px;
                color: rgba(255, 255, 255, 0.9);
                font-weight: 600;
              }
              
              .event-location {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
                background: rgba(255, 255, 255, 0.05);
                padding: 2px 8px;
                border-radius: 4px;
                border: 1px solid rgba(255, 255, 255, 0.1);
              }
            }
            
            .event-description {
              margin: 0 0 8px 0;
              font-size: 13px;
              color: rgba(255, 255, 255, 0.7);
              line-height: 1.4;
            }
            
            .event-meta {
              .facility {
                font-size: 11px;
                color: rgba(255, 255, 255, 0.5);
                background: rgba(255, 255, 255, 0.03);
                padding: 2px 6px;
                border-radius: 3px;
                border: 1px solid rgba(255, 255, 255, 0.08);
              }
            }
          }
        }
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
  }
}
</style> 

<style lang="scss">
.order-detail {
  .status-section {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    
    .status-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      .left {
        display: flex;
        align-items: center;
        gap: 12px;
        
        h3 {
          margin: 0;
          font-size: 18px;
          color: rgba(255, 255, 255, 0.9);
        }
      }
    }

    .status-progress-wrapper {
      margin-top: 32px;
      padding: 0 24px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
  }
}

// 错误弹窗样式
.error-dialog {
  max-width: 500px !important;
  
  .el-message-box__content {
    max-height: 400px;
    overflow-y: auto;
    white-space: pre-line;
    font-family: monospace;
    padding: 20px;
    background: rgba(244, 63, 94, 0.05);
    border-radius: 8px;
    margin: 16px 0;
  }
}

// 代码列表样式
.shipment-no {
  font-family: 'Courier New', monospace;
  background: #f0f9ff;
  color: #0ea5e9;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

// 单号高亮样式
.number-highlight {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1));
  color: #6366f1;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(99, 102, 241, 0.2);
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
  
  &:hover {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.15));
    border-color: rgba(99, 102, 241, 0.4);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
  }
  
  // 紧凑模式
  &.compact {
    padding: 2px 4px;
    font-size: 11px;
    border-radius: 4px;
    letter-spacing: 0.2px;
  }
}

// 紧凑文本样式
.compact-text {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  cursor: help;
  
  &:hover {
    color: rgba(255, 255, 255, 1);
  }
}

// 重写其他显示组件的紧凑模式
.weight-display.compact,
.dimensions-display.compact {
  font-size: 11px;
  padding: 1px 4px;
}

// 承运商徽章样式
.carrier-badge {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 2px 6px;
  border-radius: 4px;
  cursor: help;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(16, 185, 129, 0.2);
    border-color: rgba(16, 185, 129, 0.5);
    transform: translateY(-1px);
  }
  
  &.full {
    font-size: 12px;
    padding: 4px 8px;
    font-weight: 500;
  }
}

// 服务类型徽章样式
.service-badge {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  padding: 2px 5px;
  border-radius: 3px;
  cursor: help;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.5);
    transform: translateY(-1px);
  }
  
  &.full {
    font-size: 11px;
    padding: 4px 8px;
    font-weight: 500;
  }
}

// 订单备注样式
.notes-section {
  margin-bottom: 24px;
  
  .notes-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    
    h5 {
      margin: 0;
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      font-weight: 600;
    }
    
    .notes-desc {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.05);
      padding: 2px 8px;
      border-radius: 4px;
    }
  }
  
  .notes-content {
    .notes-text {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.6;
      padding: 12px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 6px;
      border-left: 3px solid rgba(99, 102, 241, 0.3);
      margin: 0;
    }
    
    .empty-notes {
      color: rgba(255, 255, 255, 0.4);
      font-style: italic;
      padding: 12px;
      text-align: center;
      margin: 0;
    }
    
    .notes-textarea {
      :deep(.el-textarea__inner) {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.9);
        
        &:focus {
          border-color: rgba(99, 102, 241, 0.5);
        }
        
        &::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      }
    }
  }
  

}

.notes-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

// 商品编辑限制相关样式
.edit-note {
  font-size: 11px;
  color: rgba(52, 199, 89, 0.8);
  background: rgba(52, 199, 89, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 4px;
  border: 1px solid rgba(52, 199, 89, 0.2);
  display: inline-block;
}

.dispatch-lock {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 11px;
  color: rgba(248, 113, 113, 0.8);
  background: rgba(248, 113, 113, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(248, 113, 113, 0.2);
  
  .el-icon {
    font-size: 10px;
  }
}

.edit-disabled-icon {
  color: rgba(148, 163, 184, 0.6);
  font-size: 14px;
  margin-left: 4px;
  cursor: help;
  
  &:hover {
    color: rgba(148, 163, 184, 0.8);
  }
}

.quantity-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

// 商品状态列表样式
.status-products-section {
  margin-top: 32px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  .status-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .status-icon {
        font-size: 20px;
        
        &.cancelled {
          color: #F87171;
        }
        
        &.returned {
          color: #FBBF24;
        }
        
        &.exchanged {
          color: #60A5FA;
        }
      }
      
      h4 {
        margin: 0;
        color: rgba(255, 255, 255, 0.9);
        font-size: 16px;
        font-weight: 600;
      }
    }
    
    .status-summary {
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      
      .amount-highlight {
        color: #FBBF24;
        font-weight: 600;
        font-size: 16px;
      }
    }
  }
  
  .status-table-container {
    .el-table {
      background: transparent;
      
      :deep(.el-table__header) {
        background: rgba(255, 255, 255, 0.05);
        
        th {
          background: transparent;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
        }
      }
      
      :deep(.el-table__body) {
        tr {
          background: transparent;
          
          &:hover {
            background: rgba(255, 255, 255, 0.03);
          }
          
          td {
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.8);
          }
        }
      }
    }
  }
}

// 小尺寸商品图片
.product-image-small {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(45deg, #6366F1, #8B5CF6);
  flex-shrink: 0;
}

.product-image-tiny {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: linear-gradient(45deg, #6366F1, #8B5CF6);
  flex-shrink: 0;
}

// 商品信息样式
.item-info {
  .item-name {
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
  }
  
  .item-category {
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    margin-bottom: 2px;
  }
  
  .item-sku {
    color: rgba(99, 102, 241, 0.8);
    font-size: 11px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    background: rgba(99, 102, 241, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    display: inline-block;
  }
}

// 数量样式
.quantity-cancelled,
.quantity-returned {
  color: rgba(248, 113, 113, 0.9);
  font-weight: 600;
  background: rgba(248, 113, 113, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 13px;
}

// 原因样式
.cancel-reason,
.return-reason,
.exchange-reason {
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  line-height: 1.4;
}

// 时间样式
.cancel-time,
.return-time,
.exchange-time {
  color: rgba(148, 163, 184, 0.9);
  font-size: 12px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

// 金额样式
.amount-cancelled,
.amount-returned {
  color: #F87171;
  font-weight: 600;
  font-size: 14px;
}

// 换货详情样式
.exchange-details {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  margin: 8px 0;
  
  .exchange-item {
    flex: 1;
    
    .exchange-label {
      color: rgba(255, 255, 255, 0.6);
      font-size: 12px;
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    .exchange-product {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .product-details {
        .name {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 4px;
        }
        
        .meta {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          margin-bottom: 2px;
        }
        
        .price {
          color: rgba(99, 102, 241, 0.8);
          font-size: 11px;
        }
      }
    }
  }
  
  .exchange-arrow {
    color: rgba(99, 102, 241, 0.8);
    font-size: 20px;
    
    .el-icon {
      font-size: 20px;
    }
  }
}

// 换货信息样式
.exchange-info {
  .exchange-summary {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
    
    .original-name {
      color: rgba(255, 255, 255, 0.8);
      font-size: 13px;
    }
    
    .exchange-icon {
      color: rgba(99, 102, 241, 0.8);
      font-size: 14px;
    }
    
    .new-name {
      color: rgba(52, 199, 89, 0.9);
      font-size: 13px;
      font-weight: 500;
    }
  }
  
  .exchange-meta {
    color: rgba(99, 102, 241, 0.8);
    font-size: 11px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }
}

// 价差样式
.price-difference {
  font-weight: 600;
  font-size: 14px;
  
  &.positive {
    color: #34C759;
  }
  
  &.negative {
    color: #F87171;
  }
  
  &.zero {
    color: rgba(148, 163, 184, 0.8);
  }
}

// 简化商品信息样式
.item-info-simple {
  .item-name {
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    
    .exchange-tag {
      font-size: 10px;
      padding: 1px 4px;
      border-radius: 3px;
    }
  }
  
  .item-meta {
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    margin-bottom: 4px;
  }
  
  .item-sku {
    color: rgba(99, 102, 241, 0.8);
    font-size: 11px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    background: rgba(99, 102, 241, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    display: inline-block;
    margin-bottom: 4px;
  }
  
  .exchange-info {
    display: flex;
    align-items: center;
    gap: 4px;
    color: rgba(251, 191, 36, 0.8);
    font-size: 11px;
    background: rgba(251, 191, 36, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    
    .exchange-icon {
      font-size: 10px;
    }
  }
}

.quantity-info {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  
  .original-quantity {
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    font-weight: 600;
  }
  
  .quantity-unit {
    color: rgba(255, 255, 255, 0.6);
    font-size: 11px;
  }
}

// 应发货数量样式
.should-dispatch-quantity {
  text-align: center;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  
  &.zero {
    background: rgba(248, 113, 113, 0.1);
    color: #F87171;
  }
  
  &.partial {
    background: rgba(251, 191, 36, 0.1);
    color: #FBBF24;
  }
  
  &.full {
    background: rgba(52, 199, 89, 0.1);
    color: #34C759;
  }
}

// 已下发数量样式
.dispatched-quantity {
  text-align: center;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  position: relative;
  
  &.zero {
    background: rgba(148, 163, 184, 0.1);
    color: rgba(148, 163, 184, 0.8);
  }
  
  &.partial {
    background: rgba(251, 191, 36, 0.1);
    color: #FBBF24;
  }
  
  &.full {
    background: rgba(52, 199, 89, 0.1);
    color: #34C759;
  }
  
  &.over {
    background: rgba(248, 113, 113, 0.1);
    color: #F87171;
  }
  
  .dispatch-ratio {
    color: rgba(255, 255, 255, 0.6);
    font-size: 11px;
    margin-left: 2px;
  }
}

// 已shipped数量样式
.shipped-quantity {
  text-align: center;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  position: relative;
  
  &.zero {
    background: rgba(148, 163, 184, 0.1);
    color: rgba(148, 163, 184, 0.8);
  }
  
  &.partial {
    background: rgba(251, 191, 36, 0.1);
    color: #FBBF24;
  }
  
  &.full {
    background: rgba(52, 199, 89, 0.1);
    color: #34C759;
  }
  
  &.over {
    background: rgba(248, 113, 113, 0.1);
    color: #F87171;
  }
  
  .shipped-ratio {
    color: rgba(255, 255, 255, 0.6);
    font-size: 11px;
    margin-left: 2px;
  }
}

.fulfillment-amount {
  text-align: right;
  
  .current-amount {
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 2px;
  }
  
  .original-amount {
    color: rgba(148, 163, 184, 0.8);
    font-size: 11px;
    text-decoration: line-through;
    margin-bottom: 4px;
  }
  
  .refund-amount {
    color: #F87171;
    font-size: 11px;
    font-weight: 500;
    margin-bottom: 4px;
    background: rgba(248, 113, 113, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    display: inline-block;
  }
  
  .amount-breakdown {
    .breakdown-text {
      color: rgba(148, 163, 184, 0.8);
      font-size: 10px;
      line-height: 1.2;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      
      span {
        display: inline-block;
        margin: 0 2px;
        
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
}

.operations-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  margin-top: 6px;
  
  .el-tag {
    font-size: 10px;
    padding: 1px 4px;
    border-radius: 3px;
    height: auto;
  }
  
  .no-operations {
    color: rgba(148, 163, 184, 0.6);
    font-size: 11px;
  }
}

// 操作历史表格样式
.operation-action {
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
}

.operation-reason {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  line-height: 1.4;
}

.quantity-change {
  color: rgba(99, 102, 241, 0.8);
  font-size: 12px;
  font-weight: 500;
  background: rgba(99, 102, 241, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.operation-time {
  color: rgba(148, 163, 184, 0.8);
  font-size: 11px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.detail-header {
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-lighter);

  .header-main {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 16px;

    .left-section {
      display: flex;
      align-items: center;
      gap: 8px;

      .order-id {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }

      :deep(.el-tag) {
        margin-left: 4px;
        height: 22px;
        padding: 0 8px;
      }
    }

    .order-info {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .channel-flow {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: var(--el-text-color-regular);

        .flow-item {
          color: var(--el-text-color-regular);
        }

        .arrow {
          font-size: 12px;
          color: var(--el-text-color-secondary);
          margin: 0 2px;
        }
      }

      .info-cards {
        display: flex;
        gap: 16px;

        .info-card {
          flex: 1;

          .info-content {
            .info-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 2px;
              font-size: 12px;

              &:last-child {
                margin-bottom: 0;
              }

              .label {
                color: var(--el-text-color-regular);
              }

              .value {
                color: var(--el-text-color-primary);
              }
            }
          }
        }
      }
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    background: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color-lighter);
  }
}

.info-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
  }
  
  .info-cards {
    display: flex;
    gap: 20px;
    
    .info-card {
      flex: 1;
      
      :deep(.el-card__header) {
        padding: 12px 16px;
        border-bottom: 1px solid var(--el-border-color-lighter);
        
        .card-header {
          h3 {
            margin: 0;
            font-size: 16px;
            color: var(--el-text-color-primary);
          }
          
          .source-path {
            margin-top: 4px;
            font-size: 12px;
            color: var(--el-text-color-secondary);
          }
        }
      }
      
      .info-content {
        padding: 16px;
        
        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          .label {
            color: var(--el-text-color-secondary);
            font-size: 14px;
          }
          
          .value {
            color: var(--el-text-color-primary);
            font-size: 14px;
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style>