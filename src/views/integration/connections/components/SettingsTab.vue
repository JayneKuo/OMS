<template>
  <div class="settings-tab">
    <div class="section">
      <h3>Connection Flow</h3>
      
      <!-- Orders -->
      <div class="flow-item">
        <h4>Orders</h4>
        <div class="process-info">Process orders information</div>
        <el-radio-group v-model="modelValue.orders.mode" class="flow-options">
          <el-radio label="disabled">Disabled</el-radio>
          <el-radio label="pull">Pull orders from Shopify</el-radio>
          <el-radio label="push">Push orders to Shopify</el-radio>
          <el-radio label="both">Push and pull orders</el-radio>
        </el-radio-group>
        <div class="status-info" v-if="modelValue.orders.lastPull">
          Last Pull: {{ modelValue.orders.lastPull }}, Next: {{ modelValue.orders.nextStatus }}
        </div>
      </div>

      <!-- Products -->
      <div class="flow-item">
        <h4>Products</h4>
        <div class="process-info">Process product catalog updates</div>
        <el-radio-group v-model="modelValue.products.mode" class="flow-options">
          <el-radio label="disabled">Disabled</el-radio>
          <el-radio label="pull">Pull products from Shopify to OMS</el-radio>
          <el-radio label="push">Push products from OMS to Shopify</el-radio>
        </el-radio-group>
        <div class="status-info" v-if="modelValue.products.lastPull">
          Last Pull: {{ modelValue.products.lastPull }}, Next: {{ modelValue.products.nextStatus }}
        </div>
      </div>

      <!-- Inventory -->
      <div class="flow-item">
        <h4>Inventory</h4>
        <div class="process-info">Process inventory updates</div>
        <el-radio-group v-model="modelValue.inventory.mode" class="flow-options">
          <el-radio label="disabled">Disabled</el-radio>
          <el-radio label="pull">Pull inventory information from Shopify to OMS</el-radio>
          <el-radio label="push">Push inventory information from OMS to Shopify</el-radio>
        </el-radio-group>
      </div>

      <!-- Fulfillments -->
      <div class="flow-item">
        <h4>Fulfillments</h4>
        <div class="process-info">Process fulfillment information</div>
        <el-radio-group v-model="modelValue.fulfillments.mode" class="flow-options">
          <el-radio label="disabled">Disabled</el-radio>
          <el-radio label="pull">Pull fulfillments from Shopify</el-radio>
          <el-radio label="push">Push fulfillments to Shopify</el-radio>
          <el-radio label="both">Push and pull fulfillments</el-radio>
        </el-radio-group>
      </div>

      <!-- Returns -->
      <div class="flow-item">
        <h4>Returns</h4>
        <div class="process-info">Process returns</div>
        <el-radio-group v-model="modelValue.returns.mode" class="flow-options">
          <el-radio label="disabled">Disabled</el-radio>
          <el-radio label="pull">Pull return requests from Shopify to OMS</el-radio>
          <el-radio label="push">Push return requests from OMS to Shopify</el-radio>
        </el-radio-group>
      </div>

      <!-- Refunds -->
      <div class="flow-item">
        <h4>Refunds</h4>
        <div class="process-info">Process refunds</div>
        <el-radio-group v-model="modelValue.refunds.mode" class="flow-options">
          <el-radio label="disabled">Disabled</el-radio>
          <el-radio label="pull">Pull refunds from Shopify to OMS</el-radio>
          <el-radio label="push">Push refunds from OMS to Shopify</el-radio>
        </el-radio-group>
      </div>

      <!-- Statements -->
      <div class="flow-item">
        <h4>Statements</h4>
        <el-checkbox v-model="modelValue.statements.enabled">Pull statements from Shopify</el-checkbox>
      </div>

      <!-- Locations -->
      <div class="flow-item">
        <h4>Locations</h4>
        <el-checkbox v-model="modelValue.locations.enabled">Pull locations from Shopify</el-checkbox>
      </div>
    </div>

    <!-- Shopify Settings -->
    <div class="section">
      <h3>Shopify Settings</h3>
      
      <!-- Orders -->
      <div class="setting-group">
        <h4>Orders</h4>
        
        <div class="setting-item">
          <div class="label">Timezone</div>
          <el-select v-model="modelValue.shopifySettings.timezone">
            <el-option label="GMT+8" value="GMT+8" />
          </el-select>
        </div>

        <div class="setting-item">
          <div class="label">Exclude orders created before</div>
          <el-date-picker
            v-model="modelValue.shopifySettings.excludeBeforeDate"
            type="datetime"
            format="MM/DD/YYYY hh:mm A"
            class="date-picker"
          />
          <div class="hint">
            When the exclude orders created before date is not set, the default value is when the integration was created. 
            This integration was created on {{ modelValue.shopifySettings.createdAt }} (UTC).
          </div>
        </div>

        <div class="setting-item">
          <div class="label">Regular Orders</div>
          <el-input v-model="modelValue.shopifySettings.regularOrders" placeholder="regular" />
          <div class="hint">
            Each element consists of attribute name and match pattern separated by semicolon.
            Pure string value denotes precise match (case-insensitive), string value wrapped in // denotes regexp pattern.
          </div>
        </div>

        <div class="setting-item">
          <div class="label">Payment Statuses</div>
          <div class="status-tags">
            <el-tag
              v-for="status in ['paid', 'refunded', 'partially_refunded']"
              :key="status"
              :class="{ active: modelValue.shopifySettings.paymentStatuses.includes(status) }"
              @click="toggleStatus('paymentStatuses', status)"
            >
              {{ status }}
            </el-tag>
          </div>
          <div class="hint">
            Select the order payment statuses you want to allow OMS to ingest.
            If blank, only paid, refunded, partially_refunded orders are pulled.
          </div>
        </div>

        <div class="setting-item">
          <div class="label">Order Tags</div>
          <el-input v-model="modelValue.shopifySettings.orderTags" placeholder="wholesale_order" />
          <div class="hint">
            Only orders with these tags are pulled. If left blank, all orders are pulled.
          </div>
        </div>

        <div class="setting-item">
          <div class="label">Exclude Tags Pattern</div>
          <el-input v-model="modelValue.shopifySettings.excludeTagsPattern" placeholder="/.+USED$/" />
          <div class="hint">
            Pure string value denotes precise match (case-insensitive), string value wrapped in // denotes regexp pattern
          </div>
        </div>

        <div class="setting-item">
          <div class="label">Exclude SKU Pattern</div>
          <el-input v-model="modelValue.shopifySettings.excludeSkuPattern" placeholder="/.+USED$/" />
          <div class="hint">
            Pure string value denotes precise match (case-insensitive), string value wrapped in // denotes regexp pattern
          </div>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.pullAllocatedOnly">
            Pull only orders allocated to warehouses tied with fulfillment locations in OMS
          </el-checkbox>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.pullAmazonBuyPrime">
            Always pull Amazon Buy with Prime orders
            <div class="hint">
              When ON, orders with Buy with Prime line items will be pulled without warehouse allocation check.
            </div>
          </el-checkbox>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.adjustPriceWithTax">
            Adjust order line item price when taxes are reported as included in price by Shopify
          </el-checkbox>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.pullPayments">
            Pull payments information available for Shopify orders
          </el-checkbox>
        </div>

        <div class="setting-item">
          <div class="label">Localized Fields Countries</div>
          <el-input v-model="modelValue.shopifySettings.localizedFieldsCountries" placeholder="US,CA" />
          <div class="hint">
            Provide a list of 2-letter country codes, empty value would allow collecting localized fields for all orders
          </div>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.fetchCompanyProfile">
            Fetch company profile while pulling orders from Shopify
          </el-checkbox>
        </div>
      </div>

      <!-- Order Tags -->
      <div class="setting-group">
        <h4>Order Tags</h4>

        <div class="setting-item">
          <div class="label">Accepted Tag</div>
          <el-input v-model="modelValue.shopifySettings.acceptedTag" placeholder="oms_accepted" />
          <div class="hint">
            When the order is ingested by OMS, this tag will be added in Shopify.
          </div>
        </div>

        <div class="setting-item">
          <div class="label">Routed Tag</div>
          <el-input v-model="modelValue.shopifySettings.routedTag" placeholder="oms_routed" />
          <div class="hint">
            When the order is sent to fulfillment in OMS, this tag will be added in Shopify.
          </div>
        </div>

        <div class="setting-item">
          <div class="label">Cancelled Tag</div>
          <el-input v-model="modelValue.shopifySettings.cancelledTag" placeholder="oms_cancelled" />
          <div class="hint">
            If the order is cancelled in OMS, this tag will be added in Shopify.
          </div>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.pushOrderTags">
            Push order tags updates from OMS to Shopify
          </el-checkbox>
        </div>
      </div>

      <!-- Order Flow -->
      <div class="setting-group">
        <h4>Order Flow</h4>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.resolveCustomerConflicts">
            Automatically resolve conflicts caused by duplicate customer email or phone while pushing orders to Shopify
          </el-checkbox>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.removeInvalidCustomerData">
            Automatically remove incorrect values for customer email and/or phone while pushing orders to Shopify
          </el-checkbox>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.splitByFulfillmentOrder">
            Split shippable order lines according to Fulfillment Order(s) statuses in Shopify
          </el-checkbox>
        </div>
      </div>

      <!-- Outbound Orders Matching -->
      <div class="setting-group">
        <h4>Outbound Orders Matching</h4>

        <div class="setting-item">
          <div class="label">Order Statuses</div>
          <el-select v-model="modelValue.shopifySettings.orderStatuses" multiple>
            <el-option
              v-for="status in orderStatusOptions"
              :key="status"
              :label="status"
              :value="status"
            />
          </el-select>
          <div class="hint">
            Only orders with specified statuses will be processed
          </div>
        </div>

        <div class="setting-item">
          <div class="label">Order Source Pattern</div>
          <el-input v-model="modelValue.shopifySettings.orderSourcePattern" />
          <div class="hint">
            Empty value matches any order source, specific value defines precise match, regexp pattern can be used if wrapped into //, e.g. /shopify/
          </div>
        </div>

        <div class="setting-item">
          <div class="label">Order Tag Pattern</div>
          <el-input v-model="modelValue.shopifySettings.orderTagPattern" />
          <div class="hint">
            Empty value matches any order tag, specific value defines precise match, regexp pattern can be used if wrapped into //, e.g. /tagValue/
          </div>
        </div>
      </div>

      <!-- Order Flow Settings -->
      <div class="setting-group">
        <h4>Order Flow</h4>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.pushForFulfillment">
            Matched orders should be pushed to Shopify for fulfillment process
          </el-checkbox>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.pushForTracking">
            Matched orders should be pushed to Shopify for order tracking
          </el-checkbox>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.markAsSentToFulfillment">
            Once order is pushed to Shopify, mark it as 'sentToFulfillment' in OMS
          </el-checkbox>
        </div>

        <div class="setting-item">
          <div class="label">Default Orders Location</div>
          <el-input v-model="modelValue.shopifySettings.defaultOrdersLocation" />
          <div class="hint">
            Matched orders will be pushed to this Shopify location.
          </div>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.holdAndReleaseFulfillment">
            Hold & release fulfillment orders in Shopify according to OMS order status
          </el-checkbox>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.allowOrderUpdates">
            Allow applying updates to orders in Shopify
          </el-checkbox>
        </div>
      </div>

      <!-- Fulfillments -->
      <div class="setting-group">
        <h4>Fulfillments</h4>

        <div class="setting-item">
          <div class="label">Exclude Reference Pattern</div>
          <el-input v-model="modelValue.shopifySettings.excludeReferencePattern" placeholder="/^REPLACEMENT-/" />
          <div class="hint">
            Pure string value denotes precise match (case-insensitive), string value wrapped in // denotes regexp pattern
          </div>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.allowLocationSwap">
            Allow swap to actual fulfillment locations
          </el-checkbox>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.allowPullFulfillments">
            Allow pulling fulfillments for orders originated in Shopify and fulfillable in OMS
          </el-checkbox>
        </div>
      </div>

      <!-- Returns -->
      <div class="setting-group">
        <h4>Returns</h4>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.pullReturnsWithShipping">
            Only pull returns with shipping information defined in Shopify
          </el-checkbox>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.pullReturnsWithLocation">
            Only pull returns associated with fulfillable location in OMS
          </el-checkbox>
        </div>
      </div>

      <!-- Products -->
      <div class="setting-group">
        <h4>Products</h4>

        <div class="setting-item">
          <div class="label">Exclude SKU Pattern</div>
          <el-input v-model="modelValue.shopifySettings.productExcludeSkuPattern" />
          <div class="hint">
            Pure string value denotes precise match (case-insensitive), string value wrapped in // denotes regexp pattern
          </div>
        </div>

        <div class="setting-item">
          <div class="label">Exclude Tag Pattern</div>
          <el-input v-model="modelValue.shopifySettings.productExcludeTagPattern" />
          <div class="hint">
            Pure string value denotes precise match (case-insensitive), string value wrapped in // denotes regexp pattern
          </div>
        </div>

        <div class="setting-item">
          <div class="label">Price Field</div>
          <el-input v-model="modelValue.shopifySettings.priceField" placeholder="price" />
          <div class="hint">
            OMS price with this name will be mapped to 'Price' in Shopify
          </div>
        </div>

        <div class="setting-item">
          <div class="label">Compare At Price Field</div>
          <el-input v-model="modelValue.shopifySettings.compareAtPriceField" placeholder="compare_at_price" />
          <div class="hint">
            OMS price with this name will be mapped to 'Compare At Price' in Shopify
          </div>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.allowEmptySku">
            Allow pull products with empty SKU
          </el-checkbox>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.allowOverwriteProducts">
            Allow overwrite Shopify products structure
          </el-checkbox>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.allowExtendProducts">
            Allow to extend existing Shopify products with new variants
            <div class="hint">
              When ON, variant SKUs created in OMS after reporting initial parent/variant structure, will be created in Shopify.
            </div>
          </el-checkbox>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.pullAllVariants">
            Pull all variants when Shopify parent product changes
          </el-checkbox>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.enableDailyResync">
            Enable daily products re-sync from Shopify
          </el-checkbox>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.forceProductResync">
            Force product catalog resync
          </el-checkbox>
        </div>
      </div>

      <!-- Inventory -->
      <div class="setting-group">
        <h4>Inventory</h4>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.reportInventoryTotals">
            Report inventory totals from OMS to dedicated Shopify location
            <div class="hint">
              All inventory from OMS will be aggregated to this single Shopify location.
            </div>
          </el-checkbox>
        </div>

        <div class="setting-item">
          <div class="label">Inventory Field</div>
          <el-input v-model="modelValue.shopifySettings.inventoryField" placeholder="available" />
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.autoConnectInventory">
            Automatically connect inventory items to a location if inventory level is missing in Shopify.
          </el-checkbox>
        </div>

        <div class="setting-item">
          <div class="label">Exclude SKU Pattern</div>
          <el-input v-model="modelValue.shopifySettings.inventoryExcludeSkuPattern" />
          <div class="hint">
            Pure string value denotes precise match (case-insensitive), string value wrapped in // denotes regexp pattern
          </div>
        </div>

        <div class="setting-item">
          <div class="label">Exclude Tag Pattern</div>
          <el-input v-model="modelValue.shopifySettings.inventoryExcludeTagPattern" />
          <div class="hint">
            Pure string value denotes precise match (case-insensitive), string value wrapped in // denotes regexp pattern
          </div>
        </div>

        <div class="setting-item">
          <div class="label">Include SKU Pattern</div>
          <el-input v-model="modelValue.shopifySettings.inventoryIncludeSkuPattern" />
          <div class="hint">
            Pure string value denotes precise match (case-insensitive), string value wrapped in // denotes regexp pattern
          </div>
        </div>

        <div class="setting-item">
          <div class="label">Include Tag Pattern</div>
          <el-input v-model="modelValue.shopifySettings.inventoryIncludeTagPattern" />
          <div class="hint">
            Pure string value denotes precise match (case-insensitive), string value wrapped in // denotes regexp pattern
          </div>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.enableInventoryReconciliation">
            Enable periodic inventory reconciliation between 12:00AM PST - 2:00AM PST
          </el-checkbox>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.increaseInventoryInDedicatedHours">
            Increase Shopify inventory only during dedicated hours (inventory resync)
            <div class="hint">
              Turn on this option so that OMS will not post increased inventory levels to Shopify outside of dedicated hours.
            </div>
          </el-checkbox>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.forceInventoryResync">
            Force inventory resync
          </el-checkbox>
        </div>
      </div>

      <!-- Statements -->
      <div class="setting-group">
        <h4>Statements</h4>

        <div class="setting-item">
          <div class="label">Date Format</div>
          <el-input v-model="modelValue.shopifySettings.statementDateFormat" placeholder="mm/dd/yyyy hh:mm (a|p)m" />
        </div>
      </div>

      <!-- Advanced -->
      <div class="setting-group">
        <h4>Advanced</h4>

        <div class="setting-item">
          <div class="label">Fulfillment Service Mode</div>
          <el-input v-model="modelValue.shopifySettings.fulfillmentServiceMode" disabled />
          <div class="hint">Do not edit this field without contacting support.</div>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.createFromFulfillmentOrder">
            Create OMS Order from Shopify Fulfillment Order
            <div class="hint">Create OMS order from Shopify Fulfillment Order instead of Shopify Order</div>
          </el-checkbox>
        </div>
      </div>

      <!-- Fulfillment Service Locations -->
      <div class="setting-group">
        <h4>Fulfillment Service Locations</h4>

        <div class="setting-item">
          <div class="label">Name</div>
          <el-input v-model="modelValue.shopifySettings.fulfillmentServiceName" placeholder="OMS" />
          <div class="hint">Name of fulfillment service location</div>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.tracksInventory">
            Whether the fulfillment service tracks product inventory and provides updates to Shopify
          </el-checkbox>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.requiresShipping">
            Whether the fulfillment service requires products to be physically shipped
          </el-checkbox>
        </div>

        <div class="setting-item">
          <el-checkbox v-model="modelValue.shopifySettings.providesTrackingNumbers">
            Whether the fulfillment service provides tracking numbers for packages
          </el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

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
</script>

<style lang="scss" scoped>
.settings-tab {
  padding: 0 20px;

  .section {
    margin-bottom: 40px;

    h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 24px;
      color: var(--el-text-color-primary);
    }
  }

  .flow-item {
    margin-bottom: 24px;
    border-bottom: 1px solid var(--el-border-color-light);
    padding-bottom: 24px;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    h4 {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 12px;
      color: var(--el-text-color-primary);
    }

    .process-info {
      font-size: 14px;
      color: var(--el-text-color-regular);
      margin-bottom: 12px;
    }

    .flow-options {
      .el-radio-group {
        width: 100%;
        
        :deep(.el-radio) {
          margin: 0;
          height: auto;
          padding: 4px 0;
          width: 100%;
          
          .el-radio__input {
            float: left;
            margin-top: 3px;
          }
          
          .el-radio__label {
            display: block;
            white-space: normal;
            line-height: 1.4;
            margin-left: 25px;
            padding-left: 0;
          }
        }
      }
    }

    .status-info {
      margin-top: 8px;
      font-size: 12px;
      color: var(--el-text-color-secondary);
      padding-left: 24px;
    }

    .el-checkbox {
      margin: 4px 0;
      
      .el-checkbox__label {
        line-height: 1.4;
      }
    }
  }

  .setting-group {
    margin-bottom: 32px;
    padding: 20px;
    background: var(--el-fill-color-blank);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;

    h4 {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 16px;
      color: var(--el-text-color-primary);
    }

    .setting-item {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        font-size: 14px;
        color: var(--el-text-color-regular);
        margin-bottom: 8px;
      }

      .hint {
        font-size: 12px;
        color: var(--el-text-color-secondary);
        margin-top: 8px;
        line-height: 1.4;
      }

      .status-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 8px;

        .el-tag {
          cursor: pointer;
          
          &.active {
            background-color: var(--el-color-primary-light-9);
            border-color: var(--el-color-primary);
            color: var(--el-color-primary);
          }
        }
      }

      .el-input,
      .el-select,
      .el-date-picker {
        width: 100%;
      }

      .el-checkbox {
        display: block;
        margin: 0;
        height: auto;
        white-space: normal;

        .el-checkbox__label {
          white-space: normal;
          line-height: 1.4;
        }

        .hint {
          margin-left: 24px;
        }
      }
    }
  }
}

.expanded-table {
  padding: 16px;
  background-color: var(--el-table-row-hover-bg-color);
}

:deep(.el-table__row) {
  cursor: pointer;
  
  &.expandable-row {
    background-color: var(--el-bg-color);
    
    &:hover {
      background-color: var(--el-table-row-hover-bg-color);
    }
  }
}
</style> 