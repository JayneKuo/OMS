<template>
  <div class="connection-settings">
    <div class="settings-section">
      <h3>Connection Flow</h3>
      
      <div class="flow-group">
        <!-- Orders -->
        <div class="flow-item">
          <div class="item-title">Orders</div>
          <div class="item-content">
            <div class="flow-description">Process orders information</div>
            <div class="flow-status" v-if="settings.connectionFlow.orders.mode !== 'disabled'">
              Last Pull: {{ settings.connectionFlow.orders.lastPull }}
              <span class="status">Next: {{ settings.connectionFlow.orders.nextStatus }}</span>
            </div>
            <el-radio-group v-model="settings.connectionFlow.orders.mode" class="flow-options">
              <el-radio label="disabled">Disabled</el-radio>
              <el-radio label="pull">Pull orders from {{ channelName }}</el-radio>
              <el-radio label="push">Push orders to {{ channelName }}</el-radio>
              <el-radio label="both">Push and pull orders</el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- Products -->
        <div class="flow-item">
          <div class="item-title">Products</div>
          <div class="item-content">
            <div class="flow-description">Process product catalog updates</div>
            <div class="flow-status" v-if="settings.connectionFlow.products.mode !== 'disabled'">
              Last Pull: {{ settings.connectionFlow.products.lastPull }}
              <span class="status">Next: {{ settings.connectionFlow.products.nextStatus }}</span>
            </div>
            <el-radio-group v-model="settings.connectionFlow.products.mode" class="flow-options">
              <el-radio label="disabled">Disabled</el-radio>
              <el-radio label="pull">Pull products from {{ channelName }} to OMS</el-radio>
              <el-radio label="push">Push products from OMS to {{ channelName }}</el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- Inventory -->
        <div class="flow-item">
          <div class="item-title">Inventory</div>
          <div class="item-content">
            <div class="flow-description">Process inventory updates</div>
            <el-radio-group v-model="settings.connectionFlow.inventory.mode" class="flow-options">
              <el-radio label="disabled">Disabled</el-radio>
              <el-radio label="pull">Pull inventory information from {{ channelName }} to OMS</el-radio>
              <el-radio label="push">Push inventory information from OMS to {{ channelName }}</el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- Fulfillments -->
        <div class="flow-item">
          <div class="item-title">Fulfillments</div>
          <div class="item-content">
            <div class="flow-description">Process fulfillment information</div>
            <el-radio-group v-model="settings.connectionFlow.fulfillments.mode" class="flow-options">
              <el-radio label="disabled">Disabled</el-radio>
              <el-radio label="pull">Pull fulfillments from {{ channelName }}</el-radio>
              <el-radio label="push">Push fulfillments to {{ channelName }}</el-radio>
              <el-radio label="both">Push and pull fulfillments</el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- Returns -->
        <div class="flow-item">
          <div class="item-title">Returns</div>
          <div class="item-content">
            <div class="flow-description">Process returns</div>
            <el-radio-group v-model="settings.connectionFlow.returns.mode" class="flow-options">
              <el-radio label="disabled">Disabled</el-radio>
              <el-radio label="pull">Pull return requests from {{ channelName }} to OMS</el-radio>
              <el-radio label="push">Push return requests from OMS to {{ channelName }}</el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- Refunds -->
        <div class="flow-item">
          <div class="item-title">Refunds</div>
          <div class="item-content">
            <div class="flow-description">Process refunds</div>
            <el-radio-group v-model="settings.connectionFlow.refunds.mode" class="flow-options">
              <el-radio label="disabled">Disabled</el-radio>
              <el-radio label="pull">Pull refunds from {{ channelName }} to OMS</el-radio>
              <el-radio label="push">Push refunds from OMS to {{ channelName }}</el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- Statements -->
        <div class="flow-item">
          <div class="item-title">Statements</div>
          <div class="item-content">
            <el-checkbox v-model="settings.connectionFlow.statements.enabled">
              Pull statements from {{ channelName }}
            </el-checkbox>
          </div>
        </div>

        <!-- Locations -->
        <div class="flow-item">
          <div class="item-title">Locations</div>
          <div class="item-content">
            <el-checkbox v-model="settings.connectionFlow.locations.enabled">
              Pull locations from {{ channelName }}
            </el-checkbox>
          </div>
        </div>
      </div>
    </div>

    <!-- Channel Specific Settings -->
    <div class="settings-section">
      <h3>{{ channelName }} Settings</h3>

      <!-- Orders Settings -->
      <div class="setting-group">
        <h4>Orders</h4>
        <div class="setting-item">
          <!-- Timezone -->
          <div class="setting-row">
            <span class="label">Timezone</span>
            <el-input v-model="settings.orders.timezone" readonly />
          </div>

          <!-- Exclude Orders Before -->
          <div class="setting-row">
            <span class="label">Exclude orders created before</span>
            <el-date-picker
              v-model="settings.orders.excludeBeforeDate"
              type="datetime"
              format="MM/DD/YYYY hh:mm A"
            />
            <div class="setting-hint">
              When the exclude orders created before date is not set, the default value is when the integration was created.
              This integration was created on {{ settings.orders.createdAt }} (UTC).
            </div>
          </div>

          <!-- Order Pattern -->
          <div class="setting-row">
            <span class="label">Order Pattern</span>
            <el-input v-model="settings.orders.pattern" placeholder="regular" />
            <div class="setting-hint">
              Each element consists of attribute name and match pattern separated by semicolon.
              Pure string value denotes precise match (case-insensitive), string value wrapped in // denotes regexp pattern.
            </div>
          </div>

          <!-- Payment Statuses -->
          <div class="setting-row">
            <span class="label">Payment Statuses</span>
            <el-select v-model="settings.orders.paymentStatuses" multiple placeholder="Select payment statuses">
              <el-option label="Paid" value="paid" />
              <el-option label="Refunded" value="refunded" />
              <el-option label="Partially Refunded" value="partially_refunded" />
            </el-select>
            <div class="setting-hint">
              Select the order payment statuses you want to allow OMS to ingest.
              If blank, only paid, refunded, partially_refunded orders are pulled.
            </div>
          </div>

          <!-- Fulfillment Statuses -->
          <div class="setting-row">
            <span class="label">Fulfillment Statuses</span>
            <el-select v-model="settings.orders.fulfillmentStatuses" multiple placeholder="Select fulfillment statuses">
              <el-option label="Unfulfilled" value="unfulfilled" />
              <el-option label="Fulfilled" value="fulfilled" />
              <el-option label="Partially Fulfilled" value="partially_fulfilled" />
            </el-select>
            <div class="setting-hint">
              Select the order fulfillment statuses you want to allow OMS to ingest.
              If blank, orders of any fulfillment status are pulled.
            </div>
          </div>

          <!-- Order Tags -->
          <div class="setting-row">
            <span class="label">Order Tags</span>
            <el-input v-model="settings.orders.orderTags" placeholder="wholesale_order" />
            <div class="setting-hint">
              Only orders with these tags are pulled. If left blank, all orders are pulled.
            </div>
          </div>

          <!-- SKU Pattern -->
          <div class="setting-row">
            <span class="label">SKU Pattern</span>
            <el-input v-model="settings.orders.skuPattern" placeholder="/.+USED$/" />
            <div class="setting-hint">
              Pure string value denotes precise match (case-insensitive), string value wrapped in // denotes regexp pattern.
            </div>
          </div>

          <!-- Line Item Pattern -->
          <div class="setting-row">
            <span class="label">Line Item Pattern</span>
            <el-input v-model="settings.orders.lineItemPattern" placeholder="/.+USED$/" />
            <div class="setting-hint">
              Pure string value denotes precise match (case-insensitive), string value wrapped in // denotes regexp pattern.
            </div>
          </div>

          <!-- Order Settings Switches -->
          <div class="setting-switches">
            <el-checkbox v-model="settings.orders.pullAllocatedOnly">
              Pull only orders allocated to warehouses tied with fulfillment locations in OMS
            </el-checkbox>

            <el-checkbox v-model="settings.orders.pullAmazonBuyPrime">
              Always pull Amazon Buy with Prime orders
              <div class="setting-hint">
                When ON, orders with Buy with Prime line items will be pulled without warehouse allocation check.
              </div>
            </el-checkbox>

            <el-checkbox v-model="settings.orders.adjustTaxIncludedPrice">
              Adjust order line item price when taxes are reported as included in price by {{ channelName }}
            </el-checkbox>

            <el-checkbox v-model="settings.orders.pullPaymentsInfo">
              Pull payments information available for {{ channelName }} orders
            </el-checkbox>
          </div>

          <!-- Country Codes -->
          <div class="setting-row">
            <span class="label">Country Codes</span>
            <el-input v-model="settings.orders.countryCodesList" placeholder="US,CA,GB" />
            <div class="setting-hint">
              Provide a list of 2-letter country codes, empty value would allow collecting localized fields for all orders.
            </div>
          </div>

          <!-- Company Profile -->
          <el-checkbox v-model="settings.orders.fetchCompanyProfile">
            Fetch company profile while pulling orders from {{ channelName }}
          </el-checkbox>

          <!-- Order Tags -->
          <div class="setting-row">
            <span class="label">Accepted Tag</span>
            <el-input v-model="settings.orders.tags.accepted" placeholder="oms_accepted" />
            <div class="setting-hint">
              When the order is ingested by OMS, this tag will be added in {{ channelName }}.
            </div>
          </div>

          <div class="setting-row">
            <span class="label">Routed Tag</span>
            <el-input v-model="settings.orders.tags.routed" placeholder="oms_routed" />
            <div class="setting-hint">
              When the order is sent to fulfillment in OMS, this tag will be added in {{ channelName }}.
            </div>
          </div>

          <div class="setting-row">
            <span class="label">Cancelled Tag</span>
            <el-input v-model="settings.orders.tags.cancelled" placeholder="oms_cancelled" />
            <div class="setting-hint">
              If the order is cancelled in OMS, this tag will be added in {{ channelName }}.
            </div>
          </div>

          <!-- Additional Order Settings -->
          <div class="setting-switches">
            <el-checkbox v-model="settings.orders.pushTagUpdates">
              Push order tags updates from OMS to {{ channelName }}
            </el-checkbox>

            <el-checkbox v-model="settings.orders.autoResolveConflicts">
              Automatically resolve conflicts caused by duplicate customer email or phone while pushing orders to {{ channelName }}
            </el-checkbox>

            <el-checkbox v-model="settings.orders.autoRemoveIncorrectValues">
              Automatically remove incorrect values for customer email and/or phone while pushing orders to {{ channelName }}
            </el-checkbox>

            <el-checkbox v-model="settings.orders.splitShippableLines">
              Split shippable order lines according to Fulfillment Order(s) statuses in {{ channelName }}
            </el-checkbox>
          </div>
        </div>
      </div>

      <!-- Outbound Orders Matching -->
      <div class="setting-group">
        <h4>Outbound Orders Matching</h4>
        <div class="setting-item">
          <div class="setting-row">
            <span class="label">Status Filter</span>
            <el-input v-model="settings.outboundMatching.statusFilter" />
            <div class="setting-hint">
              Only orders with specified statuses will be processed
            </div>
          </div>

          <div class="setting-row">
            <span class="label">Source Pattern</span>
            <el-input v-model="settings.outboundMatching.sourcePattern" />
            <div class="setting-hint">
              Empty value matches any order source, specific value defines precise match, regexp pattern can be used if wrapped into //, e.g. /shopify/
            </div>
          </div>

          <div class="setting-row">
            <span class="label">Tag Pattern</span>
            <el-input v-model="settings.outboundMatching.tagPattern" />
            <div class="setting-hint">
              Empty value matches any order tag, specific value defines precise match, regexp pattern can be used if wrapped into //, e.g. /tagValue/
            </div>
          </div>
        </div>
      </div>

      <!-- Order Flow -->
      <div class="setting-group">
        <h4>Order Flow</h4>
        <div class="setting-item">
          <div class="setting-switches">
            <el-checkbox v-model="settings.orderFlow.pushForFulfillment">
              Matched orders should be pushed to {{ channelName }} for fulfillment process
            </el-checkbox>

            <el-checkbox v-model="settings.orderFlow.pushForTracking">
              Matched orders should be pushed to {{ channelName }} for order tracking
            </el-checkbox>

            <el-checkbox v-model="settings.orderFlow.markAsSentToFulfillment">
              Once order is pushed to {{ channelName }}, mark it as 'sentToFulfillment' in OMS
            </el-checkbox>
          </div>

          <div class="setting-row">
            <span class="label">Default Location</span>
            <el-input v-model="settings.orderFlow.defaultLocation" />
            <div class="setting-hint">
              Matched orders will be pushed to this {{ channelName }} location.
            </div>
          </div>

          <div class="setting-switches">
            <el-checkbox v-model="settings.orderFlow.holdAndRelease">
              Hold & release fulfillment orders in {{ channelName }} according to OMS order status
            </el-checkbox>

            <el-checkbox v-model="settings.orderFlow.allowUpdates">
              Allow applying updates to orders in {{ channelName }}
            </el-checkbox>
          </div>
        </div>
      </div>

      <!-- Fulfillments -->
      <div class="setting-group">
        <h4>Fulfillments</h4>
        <div class="setting-item">
          <div class="setting-row">
            <span class="label">Replacement Pattern</span>
            <el-input v-model="settings.fulfillments.replacementPattern" placeholder="/^REPLACEMENT-/" />
            <div class="setting-hint">
              Pure string value denotes precise match (case-insensitive), string value wrapped in // denotes regexp pattern.
            </div>
          </div>

          <div class="setting-switches">
            <el-checkbox v-model="settings.fulfillments.allowLocationSwap">
              Allow swap to actual fulfillment locations
            </el-checkbox>

            <el-checkbox v-model="settings.fulfillments.allowPullOriginated">
              Allow pulling fulfillments for orders originated in {{ channelName }} and fulfillable in OMS
            </el-checkbox>
          </div>
        </div>
      </div>

      <!-- Returns -->
      <div class="setting-group">
        <h4>Returns</h4>
        <div class="setting-item">
          <div class="setting-switches">
            <el-checkbox v-model="settings.returns.pullWithShipping">
              Only pull returns with shipping information defined in {{ channelName }}
            </el-checkbox>

            <el-checkbox v-model="settings.returns.pullWithLocation">
              Only pull returns associated with fulfillable location in OMS
            </el-checkbox>
          </div>
        </div>
      </div>

      <!-- Products -->
      <div class="setting-group">
        <h4>Products</h4>
        <div class="setting-item">
          <div class="setting-row">
            <span class="label">SKU Pattern</span>
            <el-input v-model="settings.products.skuPattern" />
            <div class="setting-hint">
              Pure string value denotes precise match (case-insensitive), string value wrapped in // denotes regexp pattern.
            </div>
          </div>

          <div class="setting-row">
            <span class="label">Tag Pattern</span>
            <el-input v-model="settings.products.tagPattern" />
            <div class="setting-hint">
              Pure string value denotes precise match (case-insensitive), string value wrapped in // denotes regexp pattern.
            </div>
          </div>

          <!-- Price Mapping -->
          <div class="setting-row">
            <span class="label">Price Field</span>
            <el-input v-model="settings.products.priceMapping.price" placeholder="price" />
            <div class="setting-hint">
              OMS price with this name will be mapped to 'Price' in {{ channelName }}
            </div>
          </div>

          <div class="setting-row">
            <span class="label">Compare At Price Field</span>
            <el-input v-model="settings.products.priceMapping.compareAtPrice" placeholder="compare_at_price" />
            <div class="setting-hint">
              OMS price with this name will be mapped to 'Compare At Price' in {{ channelName }}
            </div>
          </div>

          <div class="setting-switches">
            <el-checkbox v-model="settings.products.allowEmptySku">
              Allow pull products with empty SKU
            </el-checkbox>

            <el-checkbox v-model="settings.products.allowOverwrite">
              Allow overwrite {{ channelName }} products structure
            </el-checkbox>

            <el-checkbox v-model="settings.products.allowExtend">
              Allow to extend existing {{ channelName }} products with new variants
              <div class="setting-hint">
                When ON, variant SKUs created in OMS after reporting initial parent/variant structure, will be created in {{ channelName }}.
              </div>
            </el-checkbox>

            <el-checkbox v-model="settings.products.pullAllVariants">
              Pull all variants when {{ channelName }} parent product changes
            </el-checkbox>

            <el-checkbox v-model="settings.products.enableDailySync">
              Enable daily products re-sync from {{ channelName }}
            </el-checkbox>

            <el-checkbox v-model="settings.products.forceResync">
              Force product catalog resync
            </el-checkbox>
          </div>
        </div>
      </div>

      <!-- Inventory -->
      <div class="setting-group">
        <h4>Inventory</h4>
        <div class="setting-item">
          <div class="setting-row">
            <span class="label">Report to Location</span>
            <el-input v-model="settings.inventory.reportToLocation" />
            <div class="setting-hint">
              All inventory from OMS will be aggregated to this single {{ channelName }} location.
            </div>
          </div>

          <div class="setting-row">
            <span class="label">Available Field</span>
            <el-input v-model="settings.inventory.availableField" placeholder="available" />
          </div>

          <div class="setting-switches">
            <el-checkbox v-model="settings.inventory.autoConnectItems">
              Automatically connect inventory items to a location if inventory level is missing in {{ channelName }}.
            </el-checkbox>

            <el-checkbox v-model="settings.inventory.enableReconciliation">
              Enable periodic inventory reconciliation between 12:00AM PST - 2:00AM PST
            </el-checkbox>

            <el-checkbox v-model="settings.inventory.restrictedHours">
              Increase {{ channelName }} inventory only during dedicated hours (inventory resync)
              <div class="setting-hint">
                Turn on this option so that OMS will not post increased inventory levels to {{ channelName }} outside of dedicated hours.
              </div>
            </el-checkbox>

            <el-checkbox v-model="settings.inventory.forceResync">
              Force inventory resync
            </el-checkbox>
          </div>
        </div>
      </div>

      <!-- Advanced -->
      <div class="setting-group">
        <h4>Advanced</h4>
        <div class="setting-item">
          <div class="setting-row">
            <span class="label">Fulfillment Service Mode</span>
            <el-input v-model="settings.advanced.fulfillmentServiceMode" />
            <div class="setting-hint">
              Do not edit this field without contacting support.
            </div>
          </div>

          <div class="setting-switches">
            <el-checkbox v-model="settings.advanced.createFromFulfillmentOrder">
              Create OMS Order from {{ channelName }} Fulfillment Order
              <div class="setting-hint">
                Create OMS order from {{ channelName }} Fulfillment Order instead of {{ channelName }} Order
              </div>
            </el-checkbox>
          </div>

          <div class="setting-row">
            <span class="label">Service Name</span>
            <el-input v-model="settings.advanced.serviceName" placeholder="OMS" />
            <div class="setting-hint">
              Name of fulfillment service location
            </div>
          </div>

          <div class="setting-switches">
            <el-checkbox v-model="settings.advanced.trackInventory">
              Whether the fulfillment service tracks product inventory and provides updates to {{ channelName }}
            </el-checkbox>

            <el-checkbox v-model="settings.advanced.requiresShipping">
              Whether the fulfillment service requires products to be physically shipped
            </el-checkbox>

            <el-checkbox v-model="settings.advanced.providesTracking">
              Whether the fulfillment service provides tracking numbers for packages
            </el-checkbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  modelValue: {
    connectionFlow: {
      orders: {
        mode: string
        lastPull: string
        nextStatus: string
      }
      products: {
        mode: string
        lastPull: string
        nextStatus: string
      }
      inventory: {
        mode: string
      }
      fulfillments: {
        mode: string
      }
      returns: {
        mode: string
      }
      refunds: {
        mode: string
      }
      statements: {
        enabled: boolean
      }
      locations: {
        enabled: boolean
      }
    }
    orders: {
      timezone: string
      excludeBeforeDate: string
      createdAt: string
      pattern: string
      paymentStatuses: string[]
      fulfillmentStatuses: string[]
      orderTags: string
      skuPattern: string
      lineItemPattern: string
      pullAllocatedOnly: boolean
      pullAmazonBuyPrime: boolean
      adjustTaxIncludedPrice: boolean
      pullPaymentsInfo: boolean
      countryCodesList: string
      fetchCompanyProfile: boolean
      tags: {
        accepted: string
        routed: string
        cancelled: string
      }
      pushTagUpdates: boolean
      autoResolveConflicts: boolean
      autoRemoveIncorrectValues: boolean
      splitShippableLines: boolean
    }
    outboundMatching: {
      statusFilter: string
      sourcePattern: string
      tagPattern: string
    }
    orderFlow: {
      pushForFulfillment: boolean
      pushForTracking: boolean
      markAsSentToFulfillment: boolean
      defaultLocation: string
      holdAndRelease: boolean
      allowUpdates: boolean
    }
    fulfillments: {
      replacementPattern: string
      allowLocationSwap: boolean
      allowPullOriginated: boolean
    }
    returns: {
      pullWithShipping: boolean
      pullWithLocation: boolean
    }
    products: {
      skuPattern: string
      tagPattern: string
      priceMapping: {
        price: string
        compareAtPrice: string
      }
      allowEmptySku: boolean
      allowOverwrite: boolean
      allowExtend: boolean
      pullAllVariants: boolean
      enableDailySync: boolean
      forceResync: boolean
    }
    inventory: {
      reportToLocation: string
      availableField: string
      autoConnectItems: boolean
      enableReconciliation: boolean
      restrictedHours: boolean
      forceResync: boolean
    }
    advanced: {
      fulfillmentServiceMode: string
      createFromFulfillmentOrder: boolean
      serviceName: string
      trackInventory: boolean
      requiresShipping: boolean
      providesTracking: boolean
    }
  }
  channelName: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const settings = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  settings.value = newVal
}, { deep: true })

const handleChange = () => {
  emit('update:modelValue', settings.value)
}
</script>

<style lang="scss" scoped>
.connection-settings {
  .settings-section {
    h3 {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 24px;
      color: var(--el-text-color-primary);
    }

    .flow-group {
      .flow-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 32px;
        min-height: 32px;

        &:last-child {
          margin-bottom: 0;
        }

        .item-title {
          width: 160px;
          padding-top: 4px;
          font-size: 13px;
          color: var(--el-text-color-primary);
          font-weight: 500;
          flex-shrink: 0;
        }

        .item-content {
          flex: 1;
          min-width: 0;

          .flow-description {
            font-size: 13px;
            color: var(--el-text-color-regular);
            margin-bottom: 8px;
          }

          .flow-status {
            font-size: 12px;
            color: var(--el-text-color-secondary);
            margin-bottom: 12px;

            .status {
              color: var(--el-color-success);
            }
          }

          .flow-options {
            display: flex;
            flex-direction: column;

            .el-radio {
              margin: 0 0 8px 0;
              padding: 0;
              height: 32px;
              line-height: 32px;

              &:last-child {
                margin-bottom: 0;
              }

              :deep(.el-radio__input) {
                margin-top: 9px;
              }

              :deep(.el-radio__label) {
                padding-left: 8px;
                font-size: 13px;
                color: var(--el-text-color-primary);
              }
            }
          }

          .el-checkbox {
            margin: 0;
            padding: 0;
            height: 32px;
            line-height: 32px;

            :deep(.el-checkbox__input) {
              margin-top: 9px;
            }

            :deep(.el-checkbox__label) {
              padding-left: 8px;
              font-size: 13px;
              color: var(--el-text-color-primary);
            }
          }
        }

        &.disabled {
          .item-content {
            opacity: 0.6;
          }
        }
      }
    }
  }
}
</style> 