<template>
  <div class="settings-tab">
    <div class="section">
      <h3>Connection Flow</h3>
      
      <!-- Orders -->
      <div class="flow-card" :class="{ 'is-active': modelValue.orders?.mode !== 'disabled' }">
        <div class="flow-card-header">
          <div class="flow-header-left">
            <div class="flow-icon" :class="`flow-icon-orders`">
              <el-icon :size="24"><ShoppingBag /></el-icon>
            </div>
            <div class="flow-title-group">
              <h4>Orders</h4>
              <div class="process-info">Process orders information</div>
              <div class="flow-status-info" v-if="modelValue.orders?.mode !== 'disabled'">
                <div class="status-item">
                  <el-icon :size="14"><Clock /></el-icon>
                  <span>Last run: {{ formatLastRunTime(modelValue.orders?.lastRunTime) }}</span>
                </div>
                <div class="status-item" v-if="modelValue.orders?.nextRunTime">
                  <span>Next run: {{ formatLastRunTime(modelValue.orders?.nextRunTime) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flow-header-right">
            <div class="flow-actions">
              <el-switch
                v-model="modelValue.orders.enabled"
                :disabled="modelValue.orders?.mode === 'disabled'"
                active-text="Enabled"
                inactive-text="Disabled"
                class="enable-switch"
              />
              <el-button
                type="primary"
                :icon="VideoPlay"
                :disabled="modelValue.orders?.mode === 'disabled' || !modelValue.orders?.enabled"
                @click="handleRunNow('orders')"
                :loading="modelValue.orders?.running"
                size="small"
                class="run-now-btn"
              >
                Run Now
              </el-button>
            </div>
          </div>
        </div>
        
        <div class="flow-card-body">
          <div class="flow-mode-selection">
            <div class="mode-label">Mode:</div>
            <el-radio-group v-model="modelValue.orders.mode" class="flow-options">
              <el-radio label="disabled">Disabled</el-radio>
              <el-radio label="pull">Pull orders from {{ channelName }}</el-radio>
              <el-radio label="push">Push orders to {{ channelName }}</el-radio>
              <el-radio label="both">Push and pull orders</el-radio>
            </el-radio-group>
          </div>
        </div>
        <!-- Orders Settings Card -->
        <transition name="slide-fade">
          <div v-if="modelValue.orders?.mode && modelValue.orders?.mode !== 'disabled'" class="settings-card">
            <div class="card-header">
              <div class="card-header-left">
                <el-icon :size="18"><Setting /></el-icon>
                <h5>Orders Settings</h5>
              </div>
            </div>
            <div class="card-content">
              <!-- Pull Settings -->
              <template v-if="modelValue.orders.mode === 'pull' || modelValue.orders.mode === 'both'">
                <div class="settings-group">
                  <div class="group-title">
                    <el-icon :size="16"><RefreshLeft /></el-icon>
                    <span>Pull Configuration</span>
                  </div>
                  <div class="setting-item">
                    <div class="label">
                      <span>Sync Interval</span>
                      <span class="label-unit">(minutes)</span>
                    </div>
                    <el-input-number 
                      v-model="modelValue.orders.syncInterval" 
                      :min="5" 
                      :max="1440" 
                      :step="5"
                      style="width: 100%"
                    />
                    <div class="hint">How often to sync orders (minimum 5 minutes)</div>
                  </div>
                  
                  <div class="setting-item">
                    <div class="label">Pull Orders From Date</div>
                    <el-date-picker
                      v-model="modelValue.orders.pullFromDate"
                      type="datetime"
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="Select start date"
                      style="width: 100%"
                    />
                    <div class="hint">Only pull orders created after this date. If not set, defaults to when integration was created.</div>
                  </div>

                  <div class="setting-item">
                    <div class="label">Order Status Filter</div>
                    <el-select 
                      v-model="modelValue.orders.orderStatuses" 
                      multiple 
                      placeholder="Select order statuses"
                      style="width: 100%"
                    >
                      <el-option label="Pending" value="pending" />
                      <el-option label="Processing" value="processing" />
                      <el-option label="Shipped" value="shipped" />
                      <el-option label="Delivered" value="delivered" />
                      <el-option label="Cancelled" value="cancelled" />
                      <el-option label="Unshipped" value="unshipped" />
                      <el-option label="Partially Shipped" value="partially_shipped" />
                    </el-select>
                    <div class="hint">Only pull orders with selected statuses. Leave empty to pull all statuses.</div>
                  </div>

                  <div class="setting-item">
                    <div class="label">Order Tags Filter</div>
                    <el-input 
                      v-model="modelValue.orders.orderTags" 
                      placeholder="e.g., wholesale_order, vip_order"
                      style="width: 100%"
                    />
                    <div class="hint">Only pull orders with these tags (comma-separated). Leave empty to pull all orders.</div>
                  </div>

                  <div class="setting-item-checkbox">
                    <el-checkbox v-model="modelValue.orders.autoSync">Enable automatic order sync</el-checkbox>
                    <div class="hint">Automatically pull new orders at the specified interval</div>
                  </div>
                </div>
              </template>

              <!-- Push Settings -->
              <template v-if="modelValue.orders.mode === 'push' || modelValue.orders.mode === 'both'">
                <div class="settings-group">
                  <div class="group-title">
                    <el-icon :size="16"><Upload /></el-icon>
                    <span>Push Configuration</span>
                  </div>
                  <div class="setting-item" v-if="modelValue.orders.mode === 'push'">
                    <div class="label">
                      <span>Sync Interval</span>
                      <span class="label-unit">(minutes)</span>
                    </div>
                    <el-input-number 
                      v-model="modelValue.orders.syncInterval" 
                      :min="5" 
                      :max="1440" 
                      :step="5"
                      style="width: 100%"
                    />
                    <div class="hint">How often to sync orders (minimum 5 minutes)</div>
                  </div>
                  <div class="setting-item-checkbox">
                    <el-checkbox v-model="modelValue.orders.autoPush">Enable automatic order push</el-checkbox>
                    <div class="hint">Automatically push orders to {{ channelName }} when created in OMS</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </transition>
      </div>

      <!-- Products -->
      <div class="flow-card" :class="{ 'is-active': modelValue.products.mode !== 'disabled' }">
        <div class="flow-card-header">
          <div class="flow-header-left">
            <div class="flow-icon flow-icon-products">
              <el-icon :size="24"><Box /></el-icon>
            </div>
            <div class="flow-title-group">
              <h4>Products</h4>
              <div class="process-info">Process product catalog updates</div>
              <div class="flow-status-info" v-if="modelValue.products?.mode !== 'disabled'">
                <div class="status-item">
                  <el-icon :size="14"><Clock /></el-icon>
                  <span>Last run: {{ formatLastRunTime(modelValue.products?.lastRunTime) }}</span>
                </div>
                <div class="status-item" v-if="modelValue.products?.nextRunTime">
                  <span>Next run: {{ formatLastRunTime(modelValue.products?.nextRunTime) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flow-header-right">
            <div class="flow-actions">
              <el-switch
                v-model="modelValue.products.enabled"
                :disabled="modelValue.products?.mode === 'disabled'"
                active-text="Enabled"
                inactive-text="Disabled"
                class="enable-switch"
              />
              <el-button
                type="primary"
                :icon="VideoPlay"
                :disabled="modelValue.products?.mode === 'disabled' || !modelValue.products?.enabled"
                @click="handleRunNow('products')"
                :loading="modelValue.products?.running"
                size="small"
                class="run-now-btn"
              >
                Run Now
              </el-button>
            </div>
          </div>
        </div>
        
        <div class="flow-card-body">
          <div class="flow-mode-selection">
            <div class="mode-label">Mode:</div>
            <el-radio-group v-model="modelValue.products.mode" class="flow-options">
              <el-radio label="disabled">Disabled</el-radio>
              <el-radio label="pull">Pull products from {{ channelName }} to OMS</el-radio>
              <el-radio label="push">Push products from OMS to {{ channelName }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <!-- Products Settings Card -->
        <transition name="slide-fade">
          <div v-if="modelValue.products.mode && modelValue.products.mode !== 'disabled'" class="settings-card">
            <div class="card-header">
              <div class="card-header-left">
                <el-icon :size="18"><Setting /></el-icon>
                <h5>Products Settings</h5>
              </div>
            </div>
            <div class="card-content">
              <div class="setting-item">
                <div class="label">
                  <span>Sync Interval</span>
                  <span class="label-unit">(minutes)</span>
                </div>
                <el-input-number 
                  v-model="modelValue.products.syncInterval" 
                  :min="15" 
                  :max="1440" 
                  :step="15"
                  style="width: 100%"
                />
                <div class="hint">How often to sync products (minimum 15 minutes)</div>
              </div>
              <div class="setting-item-checkbox" v-if="modelValue.products.mode === 'pull'">
                <el-checkbox v-model="modelValue.products.syncVariants">Sync product variants</el-checkbox>
                <div class="hint">Include product variants when pulling products</div>
              </div>
              <div class="setting-item-checkbox" v-if="modelValue.products.mode === 'push'">
                <el-checkbox v-model="modelValue.products.updateExisting">Update existing products</el-checkbox>
                <div class="hint">Update products that already exist in {{ channelName }}</div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Inventory -->
      <div class="flow-card" :class="{ 'is-active': modelValue.inventory.mode !== 'disabled' }">
        <div class="flow-card-header">
          <div class="flow-header-left">
            <div class="flow-icon flow-icon-inventory">
              <el-icon :size="24"><DataAnalysis /></el-icon>
            </div>
            <div class="flow-title-group">
              <h4>Inventory</h4>
              <div class="process-info">Process inventory updates</div>
              <div class="flow-status-info" v-if="modelValue.inventory?.mode !== 'disabled'">
                <div class="status-item">
                  <el-icon :size="14"><Clock /></el-icon>
                  <span>Last run: {{ formatLastRunTime(modelValue.inventory?.lastRunTime) }}</span>
                </div>
                <div class="status-item" v-if="modelValue.inventory?.nextRunTime">
                  <span>Next run: {{ formatLastRunTime(modelValue.inventory?.nextRunTime) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flow-header-right">
            <div class="flow-actions">
              <el-switch
                v-model="modelValue.inventory.enabled"
                :disabled="modelValue.inventory?.mode === 'disabled'"
                active-text="Enabled"
                inactive-text="Disabled"
                class="enable-switch"
              />
              <el-button
                type="primary"
                :icon="VideoPlay"
                :disabled="modelValue.inventory?.mode === 'disabled' || !modelValue.inventory?.enabled"
                @click="handleRunNow('inventory')"
                :loading="modelValue.inventory?.running"
                size="small"
                class="run-now-btn"
              >
                Run Now
              </el-button>
            </div>
          </div>
        </div>
        
        <div class="flow-card-body">
          <div class="flow-mode-selection">
            <div class="mode-label">Mode:</div>
            <el-radio-group v-model="modelValue.inventory.mode" class="flow-options">
              <el-radio label="disabled">Disabled</el-radio>
              <el-radio label="pull">Pull inventory information from {{ channelName }} to OMS</el-radio>
              <el-radio label="push">Push inventory information from OMS to {{ channelName }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <!-- Inventory Settings Card -->
        <transition name="slide-fade">
          <div v-if="modelValue.inventory.mode && modelValue.inventory.mode !== 'disabled'" class="settings-card">
            <div class="card-header">
              <div class="card-header-left">
                <el-icon :size="18"><Setting /></el-icon>
                <h5>Inventory Settings</h5>
              </div>
            </div>
            <div class="card-content">
              <div class="setting-item">
                <div class="label">Sync Interval (minutes)</div>
                <el-input-number 
                  v-model="modelValue.inventory.syncInterval" 
                  :min="5" 
                  :max="1440" 
                  :step="5"
                  style="width: 100%"
                />
                <div class="hint">How often to sync inventory levels (minimum 5 minutes)</div>
              </div>

              <div class="setting-item" v-if="modelValue.inventory.mode === 'push'">
                <div class="label">Sync to Locations</div>
                <el-select 
                  v-model="modelValue.inventory.syncToLocations" 
                  multiple 
                  placeholder="Select locations to sync inventory"
                  style="width: 100%"
                  collapse-tags
                  collapse-tags-tooltip
                  @change="handleLocationChange('syncTo')"
                >
                  <el-option label="All Locations" value="all" />
                  <el-option label="US Warehouse 01" value="WH_US_01" />
                  <el-option label="US Warehouse 02" value="WH_US_02" />
                  <el-option label="UK Warehouse 01" value="WH_UK_01" />
                  <el-option label="Warehouse LA (Los Angeles, CA)" value="WH_LA" />
                  <el-option label="Warehouse NYC (New York, NY)" value="WH_NYC" />
                  <el-option label="Warehouse Chicago (Chicago, IL)" value="WH_CHI" />
                </el-select>
                <div class="hint">Select which {{ channelName }} locations to sync inventory to. Leave empty to sync to all locations.</div>
              </div>

              <div class="setting-item-checkbox" v-if="modelValue.inventory.mode === 'push'">
                <el-checkbox v-model="modelValue.inventory.realTimeSync">Enable real-time sync</el-checkbox>
                <div class="hint">Sync inventory immediately when changes occur in OMS</div>
              </div>

              <div class="setting-item" v-if="modelValue.inventory.mode === 'pull'">
                <div class="label">Pull from Locations</div>
                <el-select 
                  v-model="modelValue.inventory.pullFromLocations" 
                  multiple 
                  placeholder="Select locations to pull inventory from"
                  style="width: 100%"
                  collapse-tags
                  collapse-tags-tooltip
                  @change="handleLocationChange('pullFrom')"
                >
                  <el-option label="All Locations" value="all" />
                  <el-option label="US Warehouse 01" value="WH_US_01" />
                  <el-option label="US Warehouse 02" value="WH_US_02" />
                  <el-option label="UK Warehouse 01" value="WH_UK_01" />
                  <el-option label="Warehouse LA (Los Angeles, CA)" value="WH_LA" />
                  <el-option label="Warehouse NYC (New York, NY)" value="WH_NYC" />
                  <el-option label="Warehouse Chicago (Chicago, IL)" value="WH_CHI" />
                </el-select>
                <div class="hint">Select which {{ channelName }} locations to pull inventory from. Leave empty to pull from all locations.</div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Fulfillments -->
      <div class="flow-card" :class="{ 'is-active': modelValue.fulfillments.mode !== 'disabled' }">
        <div class="flow-card-header">
          <div class="flow-header-left">
            <div class="flow-icon flow-icon-fulfillments">
              <el-icon :size="24"><Van /></el-icon>
            </div>
            <div class="flow-title-group">
              <h4>Fulfillments</h4>
              <div class="process-info">Process fulfillment information</div>
              <div class="flow-status-info" v-if="modelValue.fulfillments?.mode !== 'disabled'">
                <div class="status-item">
                  <el-icon :size="14"><Clock /></el-icon>
                  <span>Last run: {{ formatLastRunTime(modelValue.fulfillments?.lastRunTime) }}</span>
                </div>
                <div class="status-item" v-if="modelValue.fulfillments?.nextRunTime">
                  <span>Next run: {{ formatLastRunTime(modelValue.fulfillments?.nextRunTime) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flow-header-right">
            <div class="flow-actions">
              <el-switch
                v-model="modelValue.fulfillments.enabled"
                :disabled="modelValue.fulfillments?.mode === 'disabled'"
                active-text="Enabled"
                inactive-text="Disabled"
                class="enable-switch"
              />
              <el-button
                type="primary"
                :icon="VideoPlay"
                :disabled="modelValue.fulfillments?.mode === 'disabled' || !modelValue.fulfillments?.enabled"
                @click="handleRunNow('fulfillments')"
                :loading="modelValue.fulfillments?.running"
                size="small"
                class="run-now-btn"
              >
                Run Now
              </el-button>
            </div>
          </div>
        </div>
        
        <div class="flow-card-body">
          <div class="flow-mode-selection">
            <div class="mode-label">Mode:</div>
            <el-radio-group v-model="modelValue.fulfillments.mode" class="flow-options">
              <el-radio label="disabled">Disabled</el-radio>
              <el-radio label="pull">Pull fulfillments from {{ channelName }}</el-radio>
              <el-radio label="push">Push fulfillments to {{ channelName }}</el-radio>
              <el-radio label="both">Push and pull fulfillments</el-radio>
            </el-radio-group>
          </div>
        </div>
        <!-- Fulfillments Settings Card -->
        <transition name="slide-fade">
          <div v-if="modelValue.fulfillments.mode && modelValue.fulfillments.mode !== 'disabled'" class="settings-card">
            <div class="card-header">
              <div class="card-header-left">
                <el-icon :size="18"><Setting /></el-icon>
                <h5>Fulfillments Settings</h5>
              </div>
            </div>
            <div class="card-content">
              <div class="setting-item">
                <div class="label">
                  <span>Sync Interval</span>
                  <span class="label-unit">(minutes)</span>
                </div>
                <el-input-number 
                  v-model="modelValue.fulfillments.syncInterval" 
                  :min="5" 
                  :max="1440" 
                  :step="5"
                  style="width: 100%"
                />
                <div class="hint">How often to sync fulfillment status (minimum 5 minutes)</div>
              </div>
              <div class="setting-item-checkbox" v-if="modelValue.fulfillments.mode === 'push' || modelValue.fulfillments.mode === 'both'">
                <el-checkbox v-model="modelValue.fulfillments.autoUpdate">Auto-update fulfillment status</el-checkbox>
                <div class="hint">Automatically update fulfillment status in {{ channelName }}</div>
              </div>
              <div class="setting-item-checkbox" v-if="modelValue.fulfillments.mode === 'push' || modelValue.fulfillments.mode === 'both'">
                <el-checkbox v-model="modelValue.fulfillments.includeTracking">Include tracking numbers</el-checkbox>
                <div class="hint">Send tracking numbers when updating fulfillments</div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Returns -->
      <div class="flow-card" :class="{ 'is-active': modelValue.returns.mode !== 'disabled' }">
        <div class="flow-card-header">
          <div class="flow-header-left">
            <div class="flow-icon flow-icon-returns">
              <el-icon :size="24"><RefreshLeft /></el-icon>
            </div>
            <div class="flow-title-group">
              <h4>Returns</h4>
              <div class="process-info">Process returns</div>
              <div class="flow-status-info" v-if="modelValue.returns?.mode !== 'disabled'">
                <div class="status-item">
                  <el-icon :size="14"><Clock /></el-icon>
                  <span>Last run: {{ formatLastRunTime(modelValue.returns?.lastRunTime) }}</span>
                </div>
                <div class="status-item" v-if="modelValue.returns?.nextRunTime">
                  <span>Next run: {{ formatLastRunTime(modelValue.returns?.nextRunTime) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flow-header-right">
            <div class="flow-actions">
              <el-switch
                v-model="modelValue.returns.enabled"
                :disabled="modelValue.returns?.mode === 'disabled'"
                active-text="Enabled"
                inactive-text="Disabled"
                class="enable-switch"
              />
              <el-button
                type="primary"
                :icon="VideoPlay"
                :disabled="modelValue.returns?.mode === 'disabled' || !modelValue.returns?.enabled"
                @click="handleRunNow('returns')"
                :loading="modelValue.returns?.running"
                size="small"
                class="run-now-btn"
              >
                Run Now
              </el-button>
            </div>
          </div>
        </div>
        
        <div class="flow-card-body">
          <div class="flow-mode-selection">
            <div class="mode-label">Mode:</div>
            <el-radio-group v-model="modelValue.returns.mode" class="flow-options">
              <el-radio label="disabled">Disabled</el-radio>
              <el-radio label="pull">Pull return requests from {{ channelName }} to OMS</el-radio>
              <el-radio label="push">Push return requests from OMS to {{ channelName }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <!-- Returns Settings Card -->
        <transition name="slide-fade">
          <div v-if="modelValue.returns.mode && modelValue.returns.mode !== 'disabled'" class="settings-card">
            <div class="card-header">
              <div class="card-header-left">
                <el-icon :size="18"><Setting /></el-icon>
                <h5>Returns Settings</h5>
              </div>
            </div>
            <div class="card-content">
              <div class="setting-item">
                <div class="label">
                  <span>Sync Interval</span>
                  <span class="label-unit">(minutes)</span>
                </div>
                <el-input-number 
                  v-model="modelValue.returns.syncInterval" 
                  :min="15" 
                  :max="1440" 
                  :step="15"
                  style="width: 100%"
                />
                <div class="hint">How often to sync return requests (minimum 15 minutes)</div>
              </div>
              <div class="setting-item-checkbox" v-if="modelValue.returns.mode === 'pull'">
                <el-checkbox v-model="modelValue.returns.autoProcess">Auto-process approved returns</el-checkbox>
                <div class="hint">Automatically process returns that are approved in {{ channelName }}</div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Refunds -->
      <div class="flow-card" :class="{ 'is-active': modelValue.refunds.mode !== 'disabled' }">
        <div class="flow-card-header">
          <div class="flow-header-left">
            <div class="flow-icon flow-icon-refunds">
              <el-icon :size="24"><Money /></el-icon>
            </div>
            <div class="flow-title-group">
              <h4>Refunds</h4>
              <div class="process-info">Process refunds</div>
              <div class="flow-status-info" v-if="modelValue.refunds?.mode !== 'disabled'">
                <div class="status-item">
                  <el-icon :size="14"><Clock /></el-icon>
                  <span>Last run: {{ formatLastRunTime(modelValue.refunds?.lastRunTime) }}</span>
                </div>
                <div class="status-item" v-if="modelValue.refunds?.nextRunTime">
                  <span>Next run: {{ formatLastRunTime(modelValue.refunds?.nextRunTime) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flow-header-right">
            <div class="flow-actions">
              <el-switch
                v-model="modelValue.refunds.enabled"
                :disabled="modelValue.refunds?.mode === 'disabled'"
                active-text="Enabled"
                inactive-text="Disabled"
                class="enable-switch"
              />
              <el-button
                type="primary"
                :icon="VideoPlay"
                :disabled="modelValue.refunds?.mode === 'disabled' || !modelValue.refunds?.enabled"
                @click="handleRunNow('refunds')"
                :loading="modelValue.refunds?.running"
                size="small"
                class="run-now-btn"
              >
                Run Now
              </el-button>
            </div>
          </div>
        </div>
        
        <div class="flow-card-body">
          <div class="flow-mode-selection">
            <div class="mode-label">Mode:</div>
            <el-radio-group v-model="modelValue.refunds.mode" class="flow-options">
              <el-radio label="disabled">Disabled</el-radio>
              <el-radio label="pull">Pull refunds from {{ channelName }} to OMS</el-radio>
              <el-radio label="push">Push refunds from OMS to {{ channelName }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <!-- Refunds Settings Card -->
        <transition name="slide-fade">
          <div v-if="modelValue.refunds.mode && modelValue.refunds.mode !== 'disabled'" class="settings-card">
            <div class="card-header">
              <div class="card-header-left">
                <el-icon :size="18"><Setting /></el-icon>
                <h5>Refunds Settings</h5>
              </div>
            </div>
            <div class="card-content">
              <div class="setting-item">
                <div class="label">
                  <span>Sync Interval</span>
                  <span class="label-unit">(minutes)</span>
                </div>
                <el-input-number 
                  v-model="modelValue.refunds.syncInterval" 
                  :min="15" 
                  :max="1440" 
                  :step="15"
                  style="width: 100%"
                />
                <div class="hint">How often to sync refund information (minimum 15 minutes)</div>
              </div>
              <div class="setting-item-checkbox" v-if="modelValue.refunds.mode === 'pull'">
                <el-checkbox v-model="modelValue.refunds.syncPartial">Sync partial refunds</el-checkbox>
                <div class="hint">Include partial refunds when pulling refund data</div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Statements -->
      <div class="flow-card" v-if="hasStatements" :class="{ 'is-active': modelValue.statements.enabled }">
        <div class="flow-card-header">
          <div class="flow-header-left">
            <div class="flow-icon flow-icon-statements">
              <el-icon :size="24"><Document /></el-icon>
            </div>
            <div class="flow-title-group">
              <h4>Statements</h4>
              <div class="process-info">Pull statements from {{ channelName }}</div>
              <div class="flow-status-info" v-if="modelValue.statements.enabled">
                <div class="status-item">
                  <el-icon :size="14"><Clock /></el-icon>
                  <span>Last run: {{ formatLastRunTime(modelValue.statements?.lastRunTime) }}</span>
                </div>
                <div class="status-item" v-if="modelValue.statements?.nextRunTime">
                  <span>Next run: {{ formatLastRunTime(modelValue.statements?.nextRunTime) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flow-header-right">
            <div class="flow-actions">
              <el-switch 
                v-model="modelValue.statements.enabled"
                active-text="Enabled"
                inactive-text="Disabled"
                class="enable-switch"
              />
              <el-button
                type="primary"
                :icon="VideoPlay"
                :disabled="!modelValue.statements.enabled"
                @click="handleRunNow('statements')"
                :loading="modelValue.statements?.running"
                size="small"
                class="run-now-btn"
              >
                Run Now
              </el-button>
            </div>
          </div>
        </div>
        
        <div class="flow-card-body">
          <div class="flow-mode-selection">
            <div class="mode-label">Status:</div>
            <el-switch 
              v-model="modelValue.statements.enabled"
              active-text="Pull statements from {{ channelName }}"
              inactive-text="Disabled"
              class="mode-switch"
            />
          </div>
        </div>
        <!-- Statements Settings Card -->
        <transition name="slide-fade">
          <div v-if="modelValue.statements.enabled" class="settings-card">
            <div class="card-header">
              <div class="card-header-left">
                <el-icon :size="18"><Setting /></el-icon>
                <h5>Statements Settings</h5>
              </div>
            </div>
            <div class="card-content">
              <div class="setting-item">
                <div class="label">
                  <span>Sync Interval</span>
                  <span class="label-unit">(minutes)</span>
                </div>
                <el-input-number 
                  v-model="modelValue.statements.syncInterval" 
                  :min="60" 
                  :max="1440" 
                  :step="60"
                  style="width: 100%"
                />
                <div class="hint">How often to pull statements (minimum 60 minutes)</div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Locations -->
      <div class="flow-card" v-if="hasLocations" :class="{ 'is-active': modelValue.locations.enabled }">
        <div class="flow-card-header">
          <div class="flow-header-left">
            <div class="flow-icon flow-icon-locations">
              <el-icon :size="24"><Location /></el-icon>
            </div>
            <div class="flow-title-group">
              <h4>Locations</h4>
              <div class="process-info">Pull locations from {{ channelName }}</div>
              <div class="flow-status-info" v-if="modelValue.locations.enabled">
                <div class="status-item">
                  <el-icon :size="14"><Clock /></el-icon>
                  <span>Last run: {{ formatLastRunTime(modelValue.locations?.lastRunTime) }}</span>
                </div>
                <div class="status-item" v-if="modelValue.locations?.nextRunTime">
                  <span>Next run: {{ formatLastRunTime(modelValue.locations?.nextRunTime) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flow-header-right">
            <div class="flow-actions">
              <el-switch 
                v-model="modelValue.locations.enabled"
                active-text="Enabled"
                inactive-text="Disabled"
                class="enable-switch"
              />
              <el-button
                type="primary"
                :icon="VideoPlay"
                :disabled="!modelValue.locations.enabled"
                @click="handleRunNow('locations')"
                :loading="modelValue.locations?.running"
                size="small"
                class="run-now-btn"
              >
                Run Now
              </el-button>
            </div>
          </div>
        </div>
        
        <div class="flow-card-body">
          <div class="flow-mode-selection">
            <div class="mode-label">Status:</div>
            <el-switch 
              v-model="modelValue.locations.enabled"
              active-text="Pull locations from {{ channelName }}"
              inactive-text="Disabled"
              class="mode-switch"
            />
          </div>
        </div>
        <!-- Locations Settings Card -->
        <transition name="slide-fade">
          <div v-if="modelValue.locations.enabled" class="settings-card">
            <div class="card-header">
              <div class="card-header-left">
                <el-icon :size="18"><Setting /></el-icon>
                <h5>Locations Settings</h5>
              </div>
            </div>
            <div class="card-content">
              <div class="setting-item">
                <div class="label">
                  <span>Sync Interval</span>
                  <span class="label-unit">(minutes)</span>
                </div>
                <el-input-number 
                  v-model="modelValue.locations.syncInterval" 
                  :min="60" 
                  :max="1440" 
                  :step="60"
                  style="width: 100%"
                />
                <div class="hint">How often to pull locations (minimum 60 minutes)</div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from 'vue'
import { IntegrationSubType } from '@/constants/integration'
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  ShoppingBag, 
  Box, 
  DataAnalysis, 
  Van, 
  RefreshLeft, 
  Money, 
  Document, 
  Location,
  Clock,
  Setting,
  Upload,
  Download,
  VideoPlay
} from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue: any,
  channelType?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()


// 获取渠道名称
const channelName = computed(() => {
  switch (props.channelType) {
    case IntegrationSubType.SHOPIFY:
      return 'Shopify'
    case IntegrationSubType.AMAZON:
      return 'Amazon'
    case IntegrationSubType.WALMART:
      return 'Walmart'
    case IntegrationSubType.TIKTOK:
      return 'TikTok'
    case IntegrationSubType.WOOCOMMERCE:
      return 'WooCommerce'
    case IntegrationSubType.UNIS_WMS:
      return 'UNIS WMS'
    case IntegrationSubType.ITEM_WMS:
      return 'Item WMS'
    default:
      return 'Channel'
  }
})

// 初始化渠道设置
const initChannelSettings = () => {
  if (!props.modelValue) return
  
  if (!props.modelValue.channelSettings) {
    props.modelValue.channelSettings = {}
  }
  
  // 初始化各个 flow 的设置默认值
  if (!props.modelValue.orders) {
    props.modelValue.orders = {}
  }
  if (props.modelValue.orders.enabled === undefined) {
    props.modelValue.orders.enabled = false
  }
  if (props.modelValue.orders.running === undefined) {
    props.modelValue.orders.running = false
  }
  if (props.modelValue.orders.mode === undefined) {
    props.modelValue.orders.mode = 'disabled'
  }
  if (!props.modelValue.orders.syncInterval) {
    props.modelValue.orders.syncInterval = 15
  }
  if (!props.modelValue.orders.orderStatuses) {
    props.modelValue.orders.orderStatuses = []
  }
  if (!props.modelValue.orders.orderTags) {
    props.modelValue.orders.orderTags = ''
  }
  if (!props.modelValue.orders.pullFromDate) {
    props.modelValue.orders.pullFromDate = null
  }
  
  if (!props.modelValue.products) {
    props.modelValue.products = {}
  }
  if (props.modelValue.products.enabled === undefined) {
    props.modelValue.products.enabled = false
  }
  if (props.modelValue.products.running === undefined) {
    props.modelValue.products.running = false
  }
  if (props.modelValue.products.mode === undefined) {
    props.modelValue.products.mode = 'disabled'
  }
  if (!props.modelValue.products.syncInterval) {
    props.modelValue.products.syncInterval = 30
  }
  
  if (!props.modelValue.inventory) {
    props.modelValue.inventory = {}
  }
  if (props.modelValue.inventory.enabled === undefined) {
    props.modelValue.inventory.enabled = false
  }
  if (props.modelValue.inventory.running === undefined) {
    props.modelValue.inventory.running = false
  }
  if (props.modelValue.inventory.mode === undefined) {
    props.modelValue.inventory.mode = 'disabled'
  }
  if (!props.modelValue.inventory.syncInterval) {
    props.modelValue.inventory.syncInterval = 15
  }
  if (!props.modelValue.inventory.syncToLocations) {
    props.modelValue.inventory.syncToLocations = []
  }
  if (!props.modelValue.inventory.pullFromLocations) {
    props.modelValue.inventory.pullFromLocations = []
  }
  
  if (!props.modelValue.fulfillments) {
    props.modelValue.fulfillments = {}
  }
  if (props.modelValue.fulfillments.enabled === undefined) {
    props.modelValue.fulfillments.enabled = false
  }
  if (props.modelValue.fulfillments.running === undefined) {
    props.modelValue.fulfillments.running = false
  }
  if (props.modelValue.fulfillments.mode === undefined) {
    props.modelValue.fulfillments.mode = 'disabled'
  }
  if (!props.modelValue.fulfillments.syncInterval) {
    props.modelValue.fulfillments.syncInterval = 10
  }
  
  if (!props.modelValue.returns) {
    props.modelValue.returns = {}
  }
  if (props.modelValue.returns.enabled === undefined) {
    props.modelValue.returns.enabled = false
  }
  if (props.modelValue.returns.running === undefined) {
    props.modelValue.returns.running = false
  }
  if (props.modelValue.returns.mode === undefined) {
    props.modelValue.returns.mode = 'disabled'
  }
  if (!props.modelValue.returns.syncInterval) {
    props.modelValue.returns.syncInterval = 60
  }
  
  if (!props.modelValue.refunds) {
    props.modelValue.refunds = {}
  }
  if (props.modelValue.refunds.enabled === undefined) {
    props.modelValue.refunds.enabled = false
  }
  if (props.modelValue.refunds.running === undefined) {
    props.modelValue.refunds.running = false
  }
  if (props.modelValue.refunds.mode === undefined) {
    props.modelValue.refunds.mode = 'disabled'
  }
  if (!props.modelValue.refunds.syncInterval) {
    props.modelValue.refunds.syncInterval = 60
  }
  
  if (!props.modelValue.statements) {
    props.modelValue.statements = {}
  }
  if (props.modelValue.statements.enabled === undefined) {
    props.modelValue.statements.enabled = false
  }
  if (props.modelValue.statements.running === undefined) {
    props.modelValue.statements.running = false
  }
  if (!props.modelValue.statements.syncInterval) {
    props.modelValue.statements.syncInterval = 240
  }
  
  if (!props.modelValue.locations) {
    props.modelValue.locations = {}
  }
  if (props.modelValue.locations.enabled === undefined) {
    props.modelValue.locations.enabled = false
  }
  if (props.modelValue.locations.running === undefined) {
    props.modelValue.locations.running = false
  }
  if (!props.modelValue.locations.syncInterval) {
    props.modelValue.locations.syncInterval = 240
  }
}

// 立即初始化，不等待挂载
initChannelSettings()

// 在组件挂载时再次检查
onMounted(() => {
  initChannelSettings()
})

// 判断是否显示 Statements 和 Locations
const hasStatements = computed(() => {
  return [
    IntegrationSubType.SHOPIFY,
    IntegrationSubType.AMAZON,
    IntegrationSubType.WALMART
  ].includes(props.channelType as IntegrationSubType)
})

const hasLocations = computed(() => {
  return [
    IntegrationSubType.SHOPIFY,
    IntegrationSubType.WALMART,
    IntegrationSubType.UNIS_WMS,
    IntegrationSubType.ITEM_WMS
  ].includes(props.channelType as IntegrationSubType)
})

const orderStatusOptions = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
]

const toggleStatus = (field: string, value: string) => {
  const current = [...props.modelValue.shopifySettings[field]]
  const index = current.indexOf(value)
  if (index === -1) {
    current.push(value)
  } else {
    current.splice(index, 1)
  }
  emit('update:modelValue', {
    ...props.modelValue,
    shopifySettings: {
      ...props.modelValue.shopifySettings,
      [field]: current
    }
  })
}

const defaultColumns = [
  'sku',
  'location',
  'available',
  'committed',
  'onHand',
  'inbound',
  'lastEvent',
  'updated',
  'adjustedBy'
]

// 处理 location 选择变化
const handleLocationChange = (type: 'syncTo' | 'pullFrom') => {
  const locations = type === 'syncTo' 
    ? props.modelValue.inventory.syncToLocations 
    : props.modelValue.inventory.pullFromLocations
  
  // 如果选择了 "all"，清空其他选项，只保留 "all"
  if (locations.includes('all') && locations.length > 1) {
    if (type === 'syncTo') {
      props.modelValue.inventory.syncToLocations = ['all']
    } else {
      props.modelValue.inventory.pullFromLocations = ['all']
    }
  }
  // 如果选择了其他选项，移除 "all"
  else if (locations.length > 1 && locations.includes('all')) {
    const filtered = locations.filter(loc => loc !== 'all')
    if (type === 'syncTo') {
      props.modelValue.inventory.syncToLocations = filtered
    } else {
      props.modelValue.inventory.pullFromLocations = filtered
    }
  }
}

// 立即运行
const handleRunNow = async (type: string) => {
  const flow = props.modelValue[type]
  if (!flow) {
    console.error(`Flow ${type} not found`)
    return
  }
  
  flow.running = true
  try {
    // TODO: 调用实际的运行 API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 更新最后运行时间
    flow.lastRunTime = new Date().toISOString()
    
    // 计算下次运行时间
    if (flow.syncInterval) {
      const nextRun = new Date()
      nextRun.setMinutes(nextRun.getMinutes() + flow.syncInterval)
      flow.nextRunTime = nextRun.toISOString()
    }
    
    ElMessage.success(`${type.charAt(0).toUpperCase() + type.slice(1)} sync completed successfully`)
  } catch (error) {
    console.error(`Failed to run ${type}:`, error)
    ElMessage.error(`Failed to run ${type} sync`)
  } finally {
    if (flow) {
      flow.running = false
    }
  }
}

// 格式化最后运行时间
const formatLastRunTime = (time: string | null | undefined) => {
  if (!time) return 'Never'
  
  try {
    const date = new Date(time)
    if (isNaN(date.getTime())) return 'Never'
    
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    
    if (diffMs < 0) return 'Never'
    
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting time:', error)
    return 'Never'
  }
}
</script>

<style lang="scss" scoped>
.settings-tab {
  padding: 0;

  .section {
    margin-bottom: 32px;

    h3 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      color: var(--el-text-color-primary);
      letter-spacing: -0.01em;
    }
  }

  // Flow Card 样式
  .flow-card {
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 12px;
    margin-bottom: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
      border-color: var(--el-border-color);
    }

    &.is-active {
      border-color: var(--el-color-primary-light-7);
      box-shadow: 0 2px 8px rgba(107, 70, 193, 0.12);

      &:hover {
        box-shadow: 0 4px 16px rgba(107, 70, 193, 0.16);
      }

      .flow-icon {
        background: linear-gradient(135deg, var(--el-color-primary-light-8), var(--el-color-primary-light-9));
        color: var(--el-color-primary);
      }
    }

    .flow-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 20px 24px;
      background: var(--el-bg-color);
      border-bottom: 1px solid var(--el-border-color-lighter);
      gap: 24px;

      .flow-header-left {
        display: flex;
        align-items: center;
        gap: 16px;
        flex: 1;

        .flow-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--el-fill-color-light);
          color: var(--el-text-color-regular);
          transition: all 0.3s ease;
          flex-shrink: 0;

          &.flow-icon-orders {
            background: linear-gradient(135deg, #dbeafe, #bfdbfe);
            color: #3b82f6;
          }

          &.flow-icon-products {
            background: linear-gradient(135deg, #f3e8ff, #e9d5ff);
            color: #8b5cf6;
          }

          &.flow-icon-inventory {
            background: linear-gradient(135deg, #d1fae5, #a7f3d0);
            color: #10b981;
          }

          &.flow-icon-fulfillments {
            background: linear-gradient(135deg, #fed7aa, #fdba74);
            color: #f59e0b;
          }

          &.flow-icon-returns {
            background: linear-gradient(135deg, #fce7f3, #fbcfe8);
            color: #ec4899;
          }

          &.flow-icon-refunds {
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            color: #f59e0b;
          }

          &.flow-icon-statements {
            background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
            color: #6366f1;
          }

          &.flow-icon-locations {
            background: linear-gradient(135deg, #dbeafe, #bfdbfe);
            color: #3b82f6;
          }
        }

        .flow-title-group {
          flex: 1;

          h4 {
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 4px 0;
            color: var(--el-text-color-primary);
            letter-spacing: -0.01em;
          }

          .process-info {
            font-size: 13px;
            color: var(--el-text-color-secondary);
            line-height: 1.5;
            margin-bottom: 8px;
          }

          .flow-status-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
            font-size: 12px;
            color: var(--el-text-color-secondary);
            margin-top: 4px;

            .status-item {
              display: flex;
              align-items: center;
              gap: 6px;

              .el-icon {
                color: var(--el-text-color-placeholder);
              }
            }
          }
        }
      }

      .flow-header-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 12px;
        flex-shrink: 0;

        .flow-actions {
          display: flex;
          align-items: center;
          gap: 12px;

          .enable-switch {
            :deep(.el-switch__label) {
              font-size: 13px;
              font-weight: 500;
            }
          }

          .run-now-btn {
            min-width: 100px;
          }
        }
      }
    }

    .flow-card-body {
      padding: 20px 24px;
      background: var(--el-bg-color);

      .flow-mode-selection {
        display: flex;
        align-items: flex-start;
        gap: 12px;

        .mode-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--el-text-color-regular);
          padding-top: 6px;
          white-space: nowrap;
        }

        .flow-options {
          flex: 1;

          :deep(.el-radio-group) {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .el-radio {
              margin: 0;
              height: auto;
              padding: 8px 12px;
              border-radius: 8px;
              transition: all 0.2s ease;
              background: var(--el-fill-color-light);
              border: 1px solid transparent;

              &:hover {
                background: var(--el-fill-color);
                border-color: var(--el-border-color-lighter);
              }

              .el-radio__input {
                margin-top: 2px;
              }

              .el-radio__label {
                font-size: 13px;
                color: var(--el-text-color-regular);
                padding-left: 8px;
                line-height: 1.5;
              }

              &.is-checked {
                background: var(--el-color-primary-light-9);
                border-color: var(--el-color-primary-light-7);

                .el-radio__label {
                  color: var(--el-color-primary);
                  font-weight: 500;
                }

                .el-radio__inner {
                  border-color: var(--el-color-primary);
                  background: var(--el-color-primary);
                }
              }
            }
          }
        }

        .mode-switch {
          flex: 1;
        }
      }
    }
  }

  // Settings Card 样式
  .settings-card {
    margin-top: 0;
    background: var(--el-fill-color-blank);
    border: none;
    border-top: 1px solid var(--el-border-color-lighter);
    border-radius: 0;
    overflow: hidden;
    box-shadow: none;

    .card-header {
      padding: 12px 24px;
      background: transparent;
      border-bottom: 1px solid var(--el-border-color-lighter);

      .card-header-left {
        display: flex;
        align-items: center;
        gap: 8px;

        .el-icon {
          color: var(--el-color-primary);
          font-size: 16px;
        }

        h5 {
          margin: 0;
          font-size: 13px;
          font-weight: 600;
          color: var(--el-text-color-primary);
          letter-spacing: -0.01em;
        }
      }
    }

    .card-content {
      padding: 16px 24px 20px 24px;

      .settings-group {
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        .group-title {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
          font-size: 12px;
          font-weight: 600;
          color: var(--el-text-color-primary);

          .el-icon {
            color: var(--el-color-primary);
            font-size: 14px;
          }
        }
      }

      .setting-item {
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          display: flex;
          align-items: baseline;
          gap: 4px;
          font-size: 12px;
          color: var(--el-text-color-regular);
          margin-bottom: 8px;
          font-weight: 500;

          .label-unit {
            font-size: 11px;
            color: var(--el-text-color-placeholder);
            font-weight: 400;
          }
        }

        .hint {
          margin-top: 6px;
          font-size: 11px;
          color: var(--el-text-color-secondary);
          line-height: 1.4;
        }
      }

      .setting-item-checkbox {
        margin-bottom: 14px;

        &:last-child {
          margin-bottom: 0;
        }

        .el-checkbox {
          margin: 0;
          
          :deep(.el-checkbox__label) {
            font-size: 12px;
            color: var(--el-text-color-primary);
            font-weight: 500;
          }
        }

        .hint {
          margin-top: 6px;
          margin-left: 24px;
          font-size: 11px;
          color: var(--el-text-color-secondary);
          line-height: 1.4;
        }
      }
    }
  }

  // 动画效果
  .slide-fade-enter-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .slide-fade-enter-from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }

  .slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }

  // 表单控件样式优化
  :deep(.el-input),
  :deep(.el-select),
  :deep(.el-date-picker),
  :deep(.el-input-number) {
    width: 100%;

    .el-input__wrapper {
      background-color: var(--el-fill-color-blank);
      border: 1px solid var(--el-border-color);
      box-shadow: 0 0 0 1px var(--el-border-color) inset;
      border-radius: 8px;
      transition: all 0.2s ease;
      
      &:hover {
        border-color: var(--el-border-color-darker);
        box-shadow: 0 0 0 1px var(--el-border-color-darker) inset;
      }
      
      &.is-focus {
        border-color: var(--el-color-primary);
        box-shadow: 0 0 0 1px var(--el-color-primary) inset;
      }
    }

    .el-input__inner {
      font-size: 13px;
    }
  }

  :deep(.el-date-editor) {
    width: 100%;
  }

  :deep(.el-switch) {
    --el-switch-on-color: var(--el-color-primary);
  }

  // Switch 样式优化
  :deep(.el-switch__label) {
    font-size: 13px;
    font-weight: 500;
  }
}
</style> 