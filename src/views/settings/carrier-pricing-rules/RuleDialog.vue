<template>
  <el-dialog
    :model-value="modelValue"
    :title="rule ? 'Edit Rule' : 'Create Rule'"
    width="1400px"
    destroy-on-close
    class="rule-dialog"
    top="5vh"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="rule-form-container">
      <!-- Left Sidebar -->
      <div class="rule-form-sidebar">
        <div class="sidebar-content">
          <!-- Basic Information -->
          <div class="sidebar-section">
            <div class="sidebar-section-title">
              <el-icon><Document /></el-icon>
              <span>Basic Info</span>
            </div>
            <div class="sidebar-form-group">
              <label class="sidebar-label">Rule Name <span class="required-mark">*</span></label>
              <el-input 
                v-model="formData.ruleName" 
                placeholder="Enter rule name"
                size="default"
              />
            </div>
            <div class="sidebar-form-group">
              <label class="sidebar-label">Description</label>
              <el-input 
                v-model="formData.description" 
                type="textarea"
                :rows="2"
                placeholder="Brief description"
                size="default"
              />
            </div>
            <div class="sidebar-form-group">
              <label class="sidebar-label">Status</label>
              <el-switch
                v-model="formData.status"
                active-value="active"
                inactive-value="inactive"
                active-text="Active"
                inactive-text="Inactive"
              />
            </div>
          </div>

          <!-- Trigger Conditions Selection -->
          <div class="sidebar-section">
            <div class="sidebar-section-title">
              <el-icon><Filter /></el-icon>
              <span>Available Conditions</span>
            </div>
            <div class="condition-groups">
              <!-- Rate Request Basics -->
              <div class="condition-group">
                <div class="group-title">
                  <span>Rate Request Basics</span>
                </div>
                <div class="group-fields">
                  <el-checkbox v-model="selectedConditions.orderSource" class="field-checkbox">
                    <span class="field-name">Order Source</span>
                  </el-checkbox>
                  <el-checkbox v-model="selectedConditions.customerName" class="field-checkbox">
                    <span class="field-name">Customer Name</span>
                  </el-checkbox>
                </div>
              </div>

              <!-- Ship From Address -->
              <div class="condition-group">
                <div class="group-title">
                  <span>Ship From Address</span>
                </div>
                <div class="group-fields">
                  <el-checkbox v-model="selectedConditions.originCountries" class="field-checkbox">
                    <span class="field-name">Ship From Country</span>
                  </el-checkbox>
                  <el-checkbox v-model="selectedConditions.originStates" class="field-checkbox">
                    <span class="field-name">Ship From State/Province</span>
                  </el-checkbox>
                  <el-checkbox v-model="selectedConditions.originPostalCodes" class="field-checkbox">
                    <span class="field-name">Ship From Postal Code</span>
                  </el-checkbox>
                  <el-checkbox v-model="selectedConditions.warehouseIds" class="field-checkbox">
                    <span class="field-name">Warehouse/Location</span>
                  </el-checkbox>
                </div>
              </div>

              <!-- Ship To Address -->
              <div class="condition-group">
                <div class="group-title">
                  <span>Ship To Address</span>
                </div>
                <div class="group-fields">
                  <el-checkbox v-model="selectedConditions.destinationCountries" class="field-checkbox">
                    <span class="field-name">Ship To Country</span>
                  </el-checkbox>
                  <el-checkbox v-model="selectedConditions.destinationStates" class="field-checkbox">
                    <span class="field-name">Ship To State/Province</span>
                  </el-checkbox>
                  <el-checkbox v-model="selectedConditions.destinationZipCodes" class="field-checkbox">
                    <span class="field-name">Ship To Postal Code</span>
                  </el-checkbox>
                </div>
              </div>

              <!-- Package Details -->
              <div class="condition-group">
                <div class="group-title">
                  <span>Package Details</span>
                </div>
                <div class="group-fields">
                  <el-checkbox v-model="selectedConditions.weight" class="field-checkbox">
                    <span class="field-name">Weight Range</span>
                  </el-checkbox>
                  <el-checkbox v-model="selectedConditions.dimensions" class="field-checkbox">
                    <span class="field-name">Package Dimensions</span>
                  </el-checkbox>
                </div>
              </div>

              <!-- Commodity Details -->
              <div class="condition-group">
                <div class="group-title">
                  <span>Commodity Details</span>
                </div>
                <div class="group-fields">
                  <el-checkbox v-model="selectedConditions.hazmat" class="field-checkbox">
                    <span class="field-name">Dangerous Goods/Hazmat</span>
                  </el-checkbox>
                </div>
              </div>

              <!-- Product Rules -->
              <div class="condition-group">
                <div class="group-title">
                  <span>Product Rules</span>
                </div>
                <div class="group-fields">
                  <el-checkbox v-model="selectedConditions.productSKUs" class="field-checkbox">
                    <span class="field-name">Product SKUs</span>
                  </el-checkbox>
                </div>
              </div>

              <!-- Shipping Configuration -->
              <div class="condition-group">
                <div class="group-title">
                  <span>Shipping Configuration</span>
                </div>
                <div class="group-fields">
                  <el-checkbox v-model="selectedConditions.carrier" class="field-checkbox">
                    <span class="field-name">Carrier</span>
                  </el-checkbox>
                  <el-checkbox v-model="selectedConditions.shippingService" class="field-checkbox">
                    <span class="field-name">Shipping Service</span>
                  </el-checkbox>
                  <el-checkbox v-model="selectedConditions.shippingMethod" class="field-checkbox">
                    <span class="field-name">Shipping Method</span>
                  </el-checkbox>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- Right Content Area -->
      <div class="rule-form-content">
        <el-form 
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-width="180px"
          class="rule-form"
        >
          <!-- Trigger Conditions -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-title">
                <h3>Trigger Conditions</h3>
                <p class="text-gray-500">Define when this rule should be applied</p>
              </div>
            </div>

            <div class="section-content">
              <!-- Render conditions in the order they were added -->
              <template v-for="conditionKey in conditionOrder" :key="conditionKey">
                <!-- Order Source -->
              <div v-if="conditionKey === 'orderSource'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Order Source</span>
                  <el-button 
                    text 
                    type="danger" 
                    size="small"
                    @click="selectedConditions.orderSource = false"
                  >
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
                <div class="config-item-body">
                  <el-select
                    v-model="formData.triggerConditions.orderSource"
                    multiple
                    placeholder="Select order sources"
                    collapse-tags
                    style="width: 100%"
                  >
                    <el-option label="Shopify" value="shopify" />
                    <el-option label="Amazon" value="amazon" />
                    <el-option label="eBay" value="ebay" />
                    <el-option label="WooCommerce" value="woocommerce" />
                    <el-option label="Magento" value="magento" />
                    <el-option label="Manual Order" value="manual" />
                  </el-select>
                </div>
              </div>

              <!-- Customer Name -->
              <div v-if="conditionKey === 'customerName'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Customer Name</span>
                  <el-button text type="danger" size="small" @click="selectedConditions.customerName = false">
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
                <div class="config-item-body">
                  <el-select
                    v-model="formData.triggerConditions.customerNames"
                    multiple
                    filterable
                    allow-create
                    placeholder="Enter customer names"
                    style="width: 100%"
                  >
                  </el-select>
                  <span class="field-hint">Type customer name and press enter to add</span>
                </div>
              </div>

              <!-- Ship From Countries -->
              <div v-if="conditionKey === 'originCountries'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Ship From Country</span>
                  <el-button 
                    text 
                    type="danger" 
                    size="small"
                    @click="selectedConditions.originCountries = false"
                  >
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
                <div class="config-item-body">
                  <el-select
                    v-model="formData.triggerConditions.originCountries"
                    multiple
                    filterable
                    placeholder="Select ship from countries"
                    style="width: 100%"
                  >
                    <el-option label="United States" value="US" />
                    <el-option label="Canada" value="CA" />
                    <el-option label="Mexico" value="MX" />
                    <el-option label="China" value="CN" />
                    <el-option label="United Kingdom" value="UK" />
                  </el-select>
                </div>
              </div>

              <!-- Ship From States -->
              <div v-if="conditionKey === 'originStates'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Ship From State/Province</span>
                  <el-button 
                    text 
                    type="danger" 
                    size="small"
                    @click="selectedConditions.originStates = false"
                  >
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
                <div class="config-item-body">
                  <el-select
                    v-model="formData.triggerConditions.originStates"
                    multiple
                    filterable
                    allow-create
                    placeholder="e.g. CA, NY, TX"
                    style="width: 100%"
                  >
                    <el-option label="California (CA)" value="CA" />
                    <el-option label="New York (NY)" value="NY" />
                    <el-option label="Texas (TX)" value="TX" />
                    <el-option label="Florida (FL)" value="FL" />
                    <el-option label="Illinois (IL)" value="IL" />
                  </el-select>
                </div>
              </div>

              <!-- Ship From Postal Codes -->
              <div v-if="conditionKey === 'originPostalCodes'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Ship From Postal Code</span>
                  <el-button 
                    text 
                    type="danger" 
                    size="small"
                    @click="selectedConditions.originPostalCodes = false"
                  >
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
                <div class="config-item-body">
                  <el-select
                    v-model="formData.triggerConditions.originPostalCodes"
                    multiple
                    filterable
                    allow-create
                    placeholder="Enter postal codes (e.g. 90001, 10001)"
                    style="width: 100%"
                  >
                  </el-select>
                  <span class="field-hint">Supports wildcards: 900* for all 900xx</span>
                </div>
              </div>

              <!-- Warehouse/Location -->
              <div v-if="conditionKey === 'warehouseIds'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Warehouse/Location</span>
                  <el-button 
                    text 
                    type="danger" 
                    size="small"
                    @click="selectedConditions.warehouseIds = false"
                  >
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
                <div class="config-item-body">
                  <el-select
                    v-model="formData.triggerConditions.warehouseIds"
                    multiple
                    placeholder="Select warehouses"
                    style="width: 100%"
                  >
                    <el-option label="Warehouse LA (Los Angeles, CA)" value="1" />
                    <el-option label="Warehouse NYC (New York, NY)" value="2" />
                    <el-option label="Warehouse Chicago (Chicago, IL)" value="3" />
                  </el-select>
                </div>
              </div>

              <!-- Ship To Countries -->
              <div v-if="conditionKey === 'destinationCountries'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Ship To Countries</span>
                  <el-button 
                    text 
                    type="danger" 
                    size="small"
                    @click="selectedConditions.destinationCountries = false"
                  >
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
                <div class="config-item-body">
                  <el-select
                    v-model="formData.triggerConditions.destinationCountries"
                    multiple
                    placeholder="e.g. US, CN, UK"
                    allow-create
                    filterable
                    collapse-tags
                    style="width: 100%"
                  >
                    <el-option label="United States" value="US" />
                    <el-option label="China" value="CN" />
                    <el-option label="United Kingdom" value="UK" />
                    <el-option label="European Union" value="EU" />
                  </el-select>
                </div>
              </div>

              <!-- Ship To States -->
              <div v-if="conditionKey === 'destinationStates'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Ship To States</span>
                  <el-button 
                    text 
                    type="danger" 
                    size="small"
                    @click="selectedConditions.destinationStates = false"
                  >
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
                <div class="config-item-body">
                  <el-select
                    v-model="formData.triggerConditions.destinationStates"
                    multiple
                    placeholder="e.g. CA, NY, TX"
                    allow-create
                    filterable
                    collapse-tags
                    style="width: 100%"
                  >
                    <el-option label="California" value="CA" />
                    <el-option label="New York" value="NY" />
                    <el-option label="Texas" value="TX" />
                  </el-select>
                </div>
              </div>

              <!-- Ship To Postal Code -->
              <div v-if="conditionKey === 'destinationZipCodes'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Ship To Postal Code</span>
                  <el-button 
                    text 
                    type="danger" 
                    size="small"
                    @click="selectedConditions.destinationZipCodes = false"
                  >
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
                <div class="config-item-body">
                  <el-select
                    v-model="formData.triggerConditions.destinationZipCodes"
                    multiple
                    filterable
                    allow-create
                    placeholder="Enter postal codes (e.g. 90001, 10001)"
                    style="width: 100%"
                  >
                  </el-select>
                  <span class="field-hint">Supports wildcards: 900* for all 900xx</span>
                </div>
              </div>

              <!-- Weight Range -->
              <div v-if="conditionKey === 'weight'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Weight Range (kg)</span>
                  <el-button 
                    text 
                    type="danger" 
                    size="small"
                    @click="selectedConditions.weight = false"
                  >
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
                <div class="config-item-body">
                  <div class="range-input">
                    <el-input-number v-model="formData.triggerConditions.weightMin" :min="0" :precision="2" placeholder="Min" />
                    <span class="range-separator">to</span>
                    <el-input-number v-model="formData.triggerConditions.weightMax" :min="0" :precision="2" placeholder="Max" />
                  </div>
                </div>
              </div>

              <!-- Dimensions -->
              <div v-if="conditionKey === 'dimensions'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Package Dimensions</span>
                  <el-button text type="danger" size="small" @click="selectedConditions.dimensions = false">
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
                <div class="config-item-body">
                  <div style="display: flex; gap: 12px; align-items: center;">
                    <el-input-number v-model="formData.triggerConditions.length" :min="0" placeholder="L" style="flex: 1;" />
                    <span>×</span>
                    <el-input-number v-model="formData.triggerConditions.width" :min="0" placeholder="W" style="flex: 1;" />
                    <span>×</span>
                    <el-input-number v-model="formData.triggerConditions.height" :min="0" placeholder="H" style="flex: 1;" />
                  </div>
                </div>
              </div>

              <!-- Hazmat/Dangerous Goods -->
              <div v-if="conditionKey === 'hazmat'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Dangerous Goods/Hazmat</span>
                  <el-button text type="danger" size="small" @click="selectedConditions.hazmat = false">
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
                <div class="config-item-body">
                  <el-radio-group v-model="formData.triggerConditions.hazmatType">
                    <el-radio label="NONE">No Dangerous Goods</el-radio>
                    <el-radio label="HAZMAT">Hazmat (Domestic)</el-radio>
                    <el-radio label="IATA">IATA Dangerous Goods (International)</el-radio>
                  </el-radio-group>
                  <el-alert v-if="formData.triggerConditions.hazmatType !== 'NONE'" type="warning" :closable="false" style="margin-top: 12px;">
                    <template #title>Requires special documentation and may have service restrictions</template>
                  </el-alert>
                </div>
              </div>

              <!-- Product SKUs -->
              <div v-if="conditionKey === 'productSKUs'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Product SKUs</span>
                  <el-button text type="danger" size="small" @click="selectedConditions.productSKUs = false">
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
                <div class="config-item-body">
                  <el-select
                    v-model="formData.triggerConditions.productSKUs"
                    multiple
                    filterable
                    allow-create
                    placeholder="Enter product SKUs"
                    style="width: 100%"
                  >
                  </el-select>
                  <span class="field-hint">Type SKU and press enter to add</span>
                </div>
              </div>

              <!-- Carrier -->
              <div v-if="conditionKey === 'carrier'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Carrier</span>
                  <el-button text type="danger" size="small" @click="selectedConditions.carrier = false">
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
                <div class="config-item-body">
                  <el-select
                    v-model="formData.triggerConditions.carriers"
                    multiple
                    placeholder="Select carriers"
                    style="width: 100%"
                  >
                    <el-option label="FedEx" value="fedex" />
                    <el-option label="UPS" value="ups" />
                    <el-option label="USPS" value="usps" />
                    <el-option label="DHL" value="dhl" />
                  </el-select>
                </div>
              </div>

              <!-- Shipping Service -->
              <div v-if="conditionKey === 'shippingService'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Shipping Service</span>
                  <el-button text type="danger" size="small" @click="selectedConditions.shippingService = false">
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
                <div class="config-item-body">
                  <el-select
                    v-model="formData.triggerConditions.shippingServices"
                    multiple
                    placeholder="Select shipping services"
                    collapse-tags
                    style="width: 100%"
                  >
                    <el-option-group label="FedEx Services">
                      <el-option label="FedEx Ground" value="FEDEX_GROUND" />
                      <el-option label="FedEx Express Saver" value="FEDEX_EXPRESS_SAVER" />
                      <el-option label="FedEx 2Day" value="FEDEX_2_DAY" />
                      <el-option label="FedEx Standard Overnight" value="STANDARD_OVERNIGHT" />
                      <el-option label="FedEx Priority Overnight" value="PRIORITY_OVERNIGHT" />
                    </el-option-group>
                    <el-option-group label="UPS Services">
                      <el-option label="UPS Ground" value="UPS_GROUND" />
                      <el-option label="UPS 3 Day Select" value="UPS_3_DAY_SELECT" />
                      <el-option label="UPS 2nd Day Air" value="UPS_2ND_DAY_AIR" />
                      <el-option label="UPS Next Day Air" value="UPS_NEXT_DAY_AIR" />
                    </el-option-group>
                    <el-option-group label="USPS Services">
                      <el-option label="USPS First Class" value="USPS_FIRST_CLASS" />
                      <el-option label="USPS Priority Mail" value="USPS_PRIORITY" />
                      <el-option label="USPS Express Mail" value="USPS_EXPRESS" />
                    </el-option-group>
                  </el-select>
                </div>
              </div>

              <!-- Shipping Method -->
              <div v-if="conditionKey === 'shippingMethod'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Shipping Method</span>
                  <el-button text type="danger" size="small" @click="selectedConditions.shippingMethod = false">
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
                <div class="config-item-body">
                  <el-select
                    v-model="formData.triggerConditions.shippingMethods"
                    multiple
                    placeholder="Select shipping methods"
                    style="width: 100%"
                  >
                    <el-option label="Will Call" value="will_call" />
                    <el-option label="Small Parcel" value="small_parcel" />
                    <el-option label="Large Parcel" value="large_parcel" />
                    <el-option label="LTL (Less Than Truckload)" value="ltl" />
                    <el-option label="TL (Truckload)" value="tl" />
                    <el-option label="FTL (Full Truckload)" value="ftl" />
                    <el-option label="Same City Pick & Send" value="same_city_pick_send" />
                    <el-option label="City Buy" value="city_buy" />
                  </el-select>
                </div>
              </div>
              </template>

              <div v-if="!hasAnyCondition" class="no-conditions-hint">
                <el-alert
                  type="info"
                  :closable="false"
                  show-icon
                >
                  <template #title>
                    <span class="text-sm">Please select conditions from the left panel to configure</span>
                  </template>
                </el-alert>
              </div>
            </div>
          </div>

          <!-- Rate Shopping Configuration -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-title">
                <h3>Rate Shopping Configuration</h3>
                <p class="text-gray-500">Configure carriers and their settings</p>
              </div>
            </div>

            <div class="section-content">
              <div class="carriers-config">
                <!-- Carrier Selection Dropdown -->
                <div class="carrier-selection-section">
                  <label class="field-label">Select Carriers <span class="required-mark">*</span></label>
                  <el-select
                    v-model="selectedCarriers"
                    multiple
                    placeholder="Select carriers to add"
                    style="width: 100%"
                    @change="handleCarrierSelection"
                    collapse-tags
                    collapse-tags-tooltip
                  >
                    <el-option
                      v-for="option in CARRIER_OPTIONS"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                      :disabled="isCarrierAdded(option.value)"
                    />
                  </el-select>
                  <span class="field-hint">Select one or more carriers for rate shopping</span>
                </div>

                <!-- Carrier Cards with Drag & Drop -->
                <div v-if="formData.rateShoppingConfig.carriers.length > 0" class="carrier-cards-wrapper">
                  <div class="carrier-cards-header">
                    <span class="cards-header-text">Carrier Priority (Drag to reorder)</span>
                  </div>
                  <draggable 
                    v-model="formData.rateShoppingConfig.carriers" 
                    item-key="carrier"
                    handle=".drag-handle"
                    class="carrier-cards-list"
                  >
                    <template #item="{ element: carrier, index }">
                      <div class="carrier-config-card">
                        <div class="carrier-header">
                          <div class="carrier-title-section">
                            <el-icon class="drag-handle"><Rank /></el-icon>
                            <span class="priority-number">{{ index + 1 }}</span>
                            <strong class="carrier-name">{{ getCarrierLabel(carrier.carrier) }}</strong>
                          </div>
                          <el-button
                            type="danger"
                            size="small"
                            text
                            @click="removeCarrier(index)"
                            class="remove-carrier-btn"
                          >
                            <el-icon><Delete /></el-icon>
                          </el-button>
                        </div>

                        <div class="carrier-fields">
                          <div class="field-row">
                            <div class="field-item">
                              <label class="field-label">Shipping Account <span class="required-mark">*</span></label>
                              <el-select
                                v-model="carrier.shippingAccountId"
                                placeholder="Select Shipping Account"
                                @change="handleAccountChange($event, carrier)"
                                style="width: 100%"
                              >
                                <el-option
                                  v-for="account in getShippingAccountsByCarrier(carrier.carrier)"
                                  :key="account.id"
                                  :label="`${account.name} (${account.accountNo})`"
                                  :value="account.id"
                                />
                              </el-select>
                            </div>

                            <div class="field-item">
                              <label class="field-label">Shipping Service</label>
                              <el-select
                                v-model="carrier.shippingService"
                                placeholder="Select Shipping Service"
                                style="width: 100%"
                              >
                                <el-option label="Ground" value="ground" />
                                <el-option label="Express" value="express" />
                                <el-option label="Overnight" value="overnight" />
                                <el-option label="2-Day" value="2day" />
                                <el-option label="International" value="international" />
                              </el-select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </draggable>
                </div>

                <!-- Empty State -->
                <el-alert 
                  v-else
                  type="info" 
                  :closable="false" 
                  show-icon
                  style="margin-top: 16px;"
                >
                  <template #title>
                    <span class="text-sm">Please select carriers from the dropdown above</span>
                  </template>
                </el-alert>
              </div>
            </div>
          </div>

          <!-- Review Rules -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-title">
                <h3>Review Rules</h3>
                <p class="text-gray-500">Configure when manual review is required</p>
              </div>
            </div>

            <div class="section-content">
              <div class="review-config">
                <el-checkbox v-model="formData.reviewRules.requireReview" size="large">
                  Require manual review for this rule
                </el-checkbox>

                <div v-if="formData.reviewRules.requireReview" class="review-conditions">
                  <el-alert
                    title="Review will be triggered if ANY of the following conditions are met:"
                    type="info"
                    :closable="false"
                    style="margin-bottom: 20px;"
                  />

                  <div class="field-row">
                    <div class="field-item">
                      <label class="field-label">Price Exceeds ($)</label>
                      <el-input-number v-model="priceThreshold" :min="0" :precision="2" style="width: 100%" />
                    </div>

                    <div class="field-item">
                      <label class="field-label">Price Deviation (%)</label>
                      <el-input-number v-model="priceDeviationPercentage" :min="0" :max="100" :precision="0" style="width: 100%" />
                      <span class="field-hint">From expected/historical price</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel" size="large">Cancel</el-button>
        <el-button
          type="primary"
          :loading="saving"
          @click="handleSubmit"
          size="large"
        >
          <el-icon v-if="!saving"><Check /></el-icon>
          {{ rule ? 'Update Rule' : 'Create Rule' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { 
  Document, Filter, Close, Plus, Delete, Check, Rank
} from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import type { RateShoppingRule, CarrierConfig } from './types'
import { 
  CARRIER_OPTIONS
} from './types'

interface Props {
  modelValue: boolean
  rule?: RateShoppingRule | null
}

const props = withDefaults(defineProps<Props>(), {
  rule: null
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'save': [rule: RateShoppingRule]
}>()

const formRef = ref<FormInstance>()
const saving = ref(false)

// Helper data
const priceThreshold = ref<number | null>(null)
const priceDeviationPercentage = ref<number | null>(null)
const selectedCarriers = ref<string[]>([])

// Condition order tracking
const conditionOrder = ref<string[]>([])

// Selected conditions
const selectedConditions = reactive({
  // Rate Request Basics
  orderSource: false,
  customerName: false,
  
  // Origin Address
  originCountries: false,
  originStates: false,
  originPostalCodes: false,
  warehouseIds: false,
  
  // Destination Address
  destinationCountries: false,
  destinationStates: false,
  destinationZipCodes: false,
  
  // Package Details
  weight: false,
  dimensions: false,
  
  // Commodity Details
  hazmat: false,
  
  // Product Rules
  productSKUs: false,
  
  // Shipping Configuration
  carrier: false,
  shippingService: false,
  shippingMethod: false
})

// Mock shipping accounts data
const shippingAccounts = ref([
  { id: 1, carrier: 'fedex', name: 'FedEx Main Account', accountNo: '123456789' },
  { id: 2, carrier: 'ups', name: 'UPS Business Account', accountNo: '987654321' },
  { id: 3, carrier: 'usps', name: 'USPS Standard', accountNo: '555666777' },
  { id: 4, carrier: 'dhl', name: 'DHL Express Account', accountNo: '111222333' }
])

// Form data
const formData = reactive<RateShoppingRule>({
  ruleName: '',
  description: '',
  status: 'active',
  priority: 1,
  triggerConditions: {
    orderStatus: [],
    destinationCountries: [],
    destinationStates: [],
    weightMin: null,
    weightMax: null,
    orderValueMin: null,
    orderValueMax: null
  },
  rateShoppingConfig: {
    carriers: []
  },
  selectionLogic: {
    primaryCriteria: 'cheapest',
    carrierPriority: [],
    excludeConditions: {}
  },
  reviewRules: {
    requireReview: false,
    reviewConditions: {}
  }
})

// Form rules
const rules: FormRules = {
  ruleName: [
    { required: true, message: 'Please enter rule name', trigger: 'blur' }
  ]
}

// Check if has any condition
const hasAnyCondition = computed(() => {
  return Object.values(selectedConditions).some(v => v)
})

// Get condition component name mapping
const getConditionComponent = (key: string) => {
  return key
}

// Get carrier label
const getCarrierLabel = (value: string) => {
  const carrier = CARRIER_OPTIONS.find(c => c.value === value)
  return carrier ? carrier.label : value
}

// Get shipping accounts by carrier
const getShippingAccountsByCarrier = (carrier: string) => {
  return shippingAccounts.value.filter(acc => acc.carrier === carrier)
}

// Handle account change
const handleAccountChange = (accountId: string | number, carrier: CarrierConfig) => {
  const account = shippingAccounts.value.find(acc => acc.id === accountId)
  if (account) {
    carrier.shippingAccountName = `${account.name} (${account.accountNo})`
  }
}

// Check if carrier is already added
const isCarrierAdded = (carrierValue: string) => {
  return formData.rateShoppingConfig.carriers.some(c => c.carrier === carrierValue)
}

// Handle carrier selection
const handleCarrierSelection = () => {
  // Add newly selected carriers
  selectedCarriers.value.forEach(carrierValue => {
    if (!isCarrierAdded(carrierValue)) {
      formData.rateShoppingConfig.carriers.push({
        carrier: carrierValue,
        enabled: true,
        shippingAccountId: '',
        serviceTypes: [],
        markupType: 'none',
        markupValue: 0
      })
    }
  })

  // Remove deselected carriers
  formData.rateShoppingConfig.carriers = formData.rateShoppingConfig.carriers.filter(c =>
    selectedCarriers.value.includes(c.carrier)
  )

  // Sync carrier priority
  syncCarrierPriority()
}

// Sync carrier priority based on carrier order
const syncCarrierPriority = () => {
  formData.selectionLogic.carrierPriority = formData.rateShoppingConfig.carriers.map(c => c.carrier)
}

// Remove carrier
const removeCarrier = (index: number) => {
  const carrier = formData.rateShoppingConfig.carriers[index]
  const carrierValue = carrier.carrier
  
  ElMessageBox.confirm(
    `Are you sure you want to remove ${getCarrierLabel(carrierValue)}?`,
    'Remove Carrier',
    {
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    }
  ).then(() => {
    // Remove from carriers list
    formData.rateShoppingConfig.carriers.splice(index, 1)
    
    // Remove from selected carriers
    const selectedIndex = selectedCarriers.value.indexOf(carrierValue)
    if (selectedIndex > -1) {
      selectedCarriers.value.splice(selectedIndex, 1)
    }
    
    // Sync carrier priority
    syncCarrierPriority()
    
    ElMessage.success(`${getCarrierLabel(carrierValue)} has been removed`)
  }).catch(() => {
    // User cancelled
  })
}

// Watch each condition individually to maintain order
Object.keys(selectedConditions).forEach(key => {
  watch(() => selectedConditions[key], (newVal, oldVal) => {
    if (newVal && !oldVal) {
      // Condition was just selected, add to order if not already there
      if (!conditionOrder.value.includes(key)) {
        conditionOrder.value.push(key)
      }
    } else if (!newVal && oldVal) {
      // Condition was deselected, remove from order
      const index = conditionOrder.value.indexOf(key)
      if (index > -1) {
        conditionOrder.value.splice(index, 1)
      }
    }
  })
})

// Sync carrier priority when carriers change or are reordered
watch(() => formData.rateShoppingConfig.carriers, () => {
  syncCarrierPriority()
}, { deep: true })

// Sync review conditions
watch([priceThreshold, priceDeviationPercentage], () => {
  if (!formData.reviewRules.reviewConditions) {
    formData.reviewRules.reviewConditions = {}
  }
  formData.reviewRules.reviewConditions.priceThreshold = priceThreshold.value || undefined
  formData.reviewRules.reviewConditions.priceDeviationPercentage = priceDeviationPercentage.value || undefined
}, { deep: true })

// Load data if editing
onMounted(() => {
  if (props.rule) {
    Object.assign(formData, JSON.parse(JSON.stringify(props.rule)))
    
    // Initialize selected carriers from existing data
    selectedCarriers.value = formData.rateShoppingConfig.carriers.map(c => c.carrier)
    
    // Set selected conditions based on existing data
    const conditionsToActivate = [
      { key: 'orderSource', check: () => formData.triggerConditions.orderSource?.length },
      { key: 'customerName', check: () => formData.triggerConditions.customerNames?.length },
      { key: 'originCountries', check: () => formData.triggerConditions.originCountries?.length },
      { key: 'originStates', check: () => formData.triggerConditions.originStates?.length },
      { key: 'originPostalCodes', check: () => formData.triggerConditions.originPostalCodes?.length },
      { key: 'warehouseIds', check: () => formData.triggerConditions.warehouseIds?.length },
      { key: 'destinationCountries', check: () => formData.triggerConditions.destinationCountries?.length },
      { key: 'destinationStates', check: () => formData.triggerConditions.destinationStates?.length },
      { key: 'destinationZipCodes', check: () => formData.triggerConditions.destinationZipCodes?.length },
      { key: 'weight', check: () => formData.triggerConditions.weightMin !== null || formData.triggerConditions.weightMax !== null },
      { key: 'dimensions', check: () => formData.triggerConditions.length || formData.triggerConditions.width || formData.triggerConditions.height },
      { key: 'hazmat', check: () => formData.triggerConditions.hazmatType },
      { key: 'productSKUs', check: () => formData.triggerConditions.productSKUs?.length },
      { key: 'carrier', check: () => formData.triggerConditions.carriers?.length },
      { key: 'shippingService', check: () => formData.triggerConditions.shippingServices?.length },
      { key: 'shippingMethod', check: () => formData.triggerConditions.shippingMethods?.length }
    ]
    
    conditionsToActivate.forEach(({ key, check }) => {
      if (check()) {
        selectedConditions[key] = true
        conditionOrder.value.push(key)
      }
    })
    
    // Load review conditions
    if (formData.reviewRules.reviewConditions) {
      priceThreshold.value = formData.reviewRules.reviewConditions.priceThreshold || null
      priceDeviationPercentage.value = formData.reviewRules.reviewConditions.priceDeviationPercentage || null
    }
  } else {
    // Initialize selected carriers for new rule
    selectedCarriers.value = formData.rateShoppingConfig.carriers.map(c => c.carrier)
  }
})

// Handle cancel
const handleCancel = () => {
  emit('update:modelValue', false)
}

// Handle submit
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    saving.value = true
    
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    emit('save', formData)
  } catch (error) {
    console.error('Validation failed:', error)
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss" scoped>
.rule-dialog {
  max-width: 95vw;
}

.rule-dialog :deep(.el-dialog__header) {
  padding: 20px 24px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.rule-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.rule-dialog :deep(.el-dialog__body) {
  padding: 0;
  background: var(--el-fill-color-lighter);
}

.rule-dialog :deep(.el-dialog__footer) {
  padding: 16px 24px;
  border-top: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
}

.rule-form-container {
  display: flex;
  min-height: 70vh;
  max-height: 82vh;
  margin: -20px;
  gap: 0;
}

.rule-form-sidebar {
  width: 320px;
  background: var(--el-fill-color-lighter);
  border-right: 1px solid var(--el-border-color-lighter);
  overflow-y: auto;
  flex-shrink: 0;
}

.sidebar-content {
  padding: 20px 16px;
}

.sidebar-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.sidebar-section:last-child {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

.sidebar-form-group {
  margin-bottom: 16px;
}

.sidebar-form-group:last-child {
  margin-bottom: 0;
}

.sidebar-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
}

.sidebar-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
}

.sidebar-section-title .el-icon {
  color: var(--el-color-primary);
  font-size: 16px;
}

.required-mark {
  color: var(--el-color-danger);
  margin-left: 2px;
}

/* Condition Groups */
.condition-groups {
  max-height: 650px;
  overflow-y: auto;
  padding-right: 4px;
}

.condition-groups::-webkit-scrollbar {
  width: 4px;
}

.condition-groups::-webkit-scrollbar-thumb {
  background: var(--el-border-color);
  border-radius: 2px;
}

.condition-group {
  margin-bottom: 16px;
}

.condition-group:last-child {
  margin-bottom: 0;
}

.group-fields {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 8px;
}

.field-checkbox {
  margin: 0 !important;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.field-checkbox:hover {
  background: var(--el-fill-color-lighter);
}

.field-checkbox :deep(.el-checkbox__label) {
  width: 100%;
  white-space: normal;
  line-height: 1.5;
}

.field-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.group-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
  padding: 4px 8px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
}

.rule-form-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: var(--el-bg-color);
}

.rule-form-content::-webkit-scrollbar {
  width: 6px;
}

.rule-form-content::-webkit-scrollbar-thumb {
  background: var(--el-border-color);
  border-radius: 3px;
}

.rule-form-content::-webkit-scrollbar-track {
  background: var(--el-fill-color-lighter);
}

.form-section {
  background: transparent;
  border-radius: 8px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.form-section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.section-title {
  margin-bottom: 0;
}

.section-title h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--el-text-color-primary);
}

.section-title p {
  font-size: 12px;
  margin: 4px 0 0;
  color: var(--el-text-color-secondary);
}

.section-content {
  padding: 20px;
}

.condition-config-item {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
  margin-bottom: 16px;
}

.condition-config-item:hover {
  border-color: var(--el-color-primary-light-5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.config-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--el-fill-color-lighter);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.config-item-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.config-item-body {
  padding: 16px;
}

.no-conditions-hint {
  margin-bottom: 20px;
}

.carriers-config {
  .carrier-selection-section {
    margin-bottom: 24px;
    padding: 16px;
    background-color: var(--el-fill-color-light);
    border-radius: 8px;
  }

  .carrier-cards-wrapper {
    margin-top: 20px;
  }

  .carrier-cards-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding: 8px 0;

    .cards-header-text {
      font-size: 14px;
      font-weight: 600;
      color: var(--el-text-color-secondary);
    }
  }

  .carrier-cards-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .carrier-config-card {
    padding: 16px;
    border: 2px solid var(--el-border-color-lighter);
    border-radius: 8px;
    background-color: var(--el-fill-color-blank);
    transition: all 0.3s ease;
    cursor: move;

    &:hover {
      border-color: var(--el-color-primary-light-5);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
      transform: translateY(-2px);
    }

    .carrier-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    .carrier-title-section {
      display: flex;
      align-items: center;
      gap: 12px;

      .drag-handle {
        font-size: 20px;
        color: var(--el-text-color-secondary);
        cursor: grab;
        transition: all 0.2s ease;

        &:hover {
          color: var(--el-color-primary);
          transform: scale(1.1);
        }

        &:active {
          cursor: grabbing;
        }
      }

      .priority-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
        color: white;
        border-radius: 50%;
        font-size: 13px;
        font-weight: 700;
        box-shadow: 0 2px 6px rgba(64, 158, 255, 0.3);
      }

      .carrier-name {
        font-size: 15px;
        color: var(--el-text-color-primary);
      }
    }

    .carrier-fields {
      margin-top: 16px;
    }
  }
}

.remove-carrier-btn {
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--el-color-danger);
  }
  
  .el-icon {
    font-size: 16px;
  }
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.field-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  display: flex;
  align-items: center;
  gap: 4px;
}

.field-hint {
  display: block;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

.range-input {
  display: flex;
  align-items: center;
  gap: 12px;

  .el-input-number {
    flex: 1;
  }

  .range-separator {
    color: var(--el-text-color-secondary);
  }
}

.review-config {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-conditions {
  padding: 16px;
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
  margin-top: 16px;
}

.dialog-footer {
  padding: 20px 0 0;
  border-top: 1px solid var(--el-border-color-light);
}

.text-gray-500 {
  color: var(--el-text-color-secondary);
}

.text-sm {
  font-size: 13px;
}
</style>

