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
                  <el-tag size="small" type="info">询价基础</el-tag>
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

              <!-- Origin Address -->
              <div class="condition-group">
                <div class="group-title">
                  <span>Origin Address</span>
                  <el-tag size="small" type="warning">发货地</el-tag>
                </div>
                <div class="group-fields">
                  <el-checkbox v-model="selectedConditions.originCountries" class="field-checkbox">
                    <span class="field-name">Origin Country</span>
                  </el-checkbox>
                  <el-checkbox v-model="selectedConditions.originStates" class="field-checkbox">
                    <span class="field-name">Origin State/Province</span>
                  </el-checkbox>
                  <el-checkbox v-model="selectedConditions.originPostalCodes" class="field-checkbox">
                    <span class="field-name">Origin Postal Code</span>
                  </el-checkbox>
                  <el-checkbox v-model="selectedConditions.warehouseIds" class="field-checkbox">
                    <span class="field-name">Warehouse/Location</span>
                  </el-checkbox>
                </div>
              </div>

              <!-- Destination Address -->
              <div class="condition-group">
                <div class="group-title">
                  <span>Destination Address</span>
                  <el-tag size="small" type="success">收货地</el-tag>
                </div>
                <div class="group-fields">
                  <el-checkbox v-model="selectedConditions.destinationCountries" class="field-checkbox">
                    <span class="field-name">Destination Country</span>
                  </el-checkbox>
                  <el-checkbox v-model="selectedConditions.destinationStates" class="field-checkbox">
                    <span class="field-name">Destination State/Province</span>
                  </el-checkbox>
                  <el-checkbox v-model="selectedConditions.destinationZipCodes" class="field-checkbox">
                    <span class="field-name">Destination Postal Code</span>
                  </el-checkbox>
                </div>
              </div>

              <!-- Package Details -->
              <div class="condition-group">
                <div class="group-title">
                  <span>Package Details</span>
                  <el-tag size="small" type="danger">包裹详情</el-tag>
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
                  <el-tag size="small">商品详情</el-tag>
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
                  <el-tag size="small">产品规则</el-tag>
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
                  <el-tag size="small" type="primary">运输配置</el-tag>
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

              <!-- Origin Countries -->
              <div v-if="conditionKey === 'originCountries'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Origin Country</span>
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
                    placeholder="Select origin countries"
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

              <!-- Origin States -->
              <div v-if="conditionKey === 'originStates'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Origin State/Province</span>
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

              <!-- Origin Postal Codes -->
              <div v-if="conditionKey === 'originPostalCodes'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Origin Postal Code</span>
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

              <!-- Destination Countries -->
              <div v-if="conditionKey === 'destinationCountries'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Destination Countries</span>
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

              <!-- Destination States -->
              <div v-if="conditionKey === 'destinationStates'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Destination States</span>
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

              <!-- Destination Postal Code -->
              <div v-if="conditionKey === 'destinationZipCodes'" class="condition-config-item">
                <div class="config-item-header">
                  <span class="config-item-title">Destination Postal Code</span>
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
                    <el-option label="Ground" value="ground" />
                    <el-option label="Express" value="express" />
                    <el-option label="Overnight" value="overnight" />
                    <el-option label="2-Day" value="2day" />
                    <el-option label="3-Day" value="3day" />
                    <el-option label="International" value="international" />
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
                <div v-for="(carrier, index) in formData.rateShoppingConfig.carriers" :key="index" class="carrier-config-card">
                  <div class="carrier-header">
                    <div class="carrier-title-section">
                      <el-checkbox v-model="carrier.enabled" size="large">
                        <strong>{{ getCarrierLabel(carrier.carrier) }}</strong>
                      </el-checkbox>
                    </div>
                    <el-button
                      type="danger"
                      size="small"
                      plain
                      @click="removeCarrier(index)"
                      v-if="formData.rateShoppingConfig.carriers.length > 1"
                      class="remove-carrier-btn"
                    >
                      <el-icon><Delete /></el-icon>
                      Remove Carrier
                    </el-button>
                  </div>

                  <div v-if="carrier.enabled" class="carrier-fields">
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
                        <label class="field-label">Service Types <span class="required-mark">*</span></label>
                        <el-select
                          v-model="carrier.serviceTypes"
                          multiple
                          placeholder="Select Service Types"
                          collapse-tags
                          style="width: 100%"
                        >
                          <el-option
                            v-for="service in SERVICE_TYPE_OPTIONS"
                            :key="service.value"
                            :label="service.label"
                            :value="service.value"
                          />
                        </el-select>
                      </div>
                    </div>

                    <div class="field-row">
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

                      <div class="field-item">
                        <label class="field-label">Shipping Method</label>
                        <el-select
                          v-model="carrier.shippingMethod"
                          placeholder="Select Shipping Method"
                          style="width: 100%"
                        >
                          <el-option label="Standard" value="standard" />
                          <el-option label="Expedited" value="expedited" />
                          <el-option label="Priority" value="priority" />
                          <el-option label="Economy" value="economy" />
                        </el-select>
                      </div>
                    </div>

                    <div class="field-row">
                      <div class="field-item">
                        <label class="field-label">Price Adjustment</label>
                        <el-select v-model="carrier.markupType" placeholder="None" style="width: 100%">
                          <el-option
                            v-for="type in MARKUP_TYPE_OPTIONS"
                            :key="type.value"
                            :label="type.label"
                            :value="type.value"
                          />
                        </el-select>
                      </div>

                      <div class="field-item" v-if="carrier.markupType && carrier.markupType !== 'none'">
                        <label class="field-label">{{ carrier.markupType === 'percentage' ? 'Markup %' : 'Markup $' }}</label>
                        <el-input-number
                          v-model="carrier.markupValue"
                          :min="0"
                          :precision="2"
                          style="width: 100%"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <el-button type="primary" plain @click="addCarrier" style="width: 100%; margin-top: 10px;">
                  <el-icon><Plus /></el-icon>
                  Add Another Carrier
                </el-button>
              </div>
            </div>
          </div>

          <!-- Selection Logic -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-title">
                <h3>Selection Logic</h3>
                <p class="text-gray-500">Define how to select the best rate</p>
              </div>
            </div>

            <div class="section-content">
              <div class="selection-config">
                <div class="field-item">
                  <label class="field-label">Selection Criteria <span class="required-mark">*</span></label>
                  <el-select v-model="formData.selectionLogic.primaryCriteria" placeholder="Select Criteria" style="width: 100%">
                    <el-option
                      v-for="criteria in PRIMARY_CRITERIA_OPTIONS"
                      :key="criteria.value"
                      :label="criteria.label"
                      :value="criteria.value"
                    />
                  </el-select>
                </div>

                <div v-if="formData.selectionLogic.primaryCriteria === 'custom'" class="field-item">
                  <label class="field-label">Price / Speed Balance</label>
                  <div class="weight-slider">
                    <span class="weight-label">Price {{ priceWeight }}%</span>
                    <el-slider v-model="priceWeight" :max="100" :show-tooltip="false" style="flex: 1" />
                    <span class="weight-label">Speed {{ 100 - priceWeight }}%</span>
                  </div>
                </div>

                <div class="field-item">
                  <label class="field-label">Carrier Priority</label>
                  <span class="field-hint">Drag to reorder carriers. Used when rates are similar.</span>
                  <div v-if="formData.selectionLogic.carrierPriority.length > 0">
                    <draggable v-model="formData.selectionLogic.carrierPriority" item-key="element" class="draggable-list">
                      <template #item="{ element, index }">
                        <div class="priority-item">
                          <el-icon class="drag-handle"><Rank /></el-icon>
                          <span class="priority-number">{{ index + 1 }}</span>
                          <el-tag>{{ getCarrierLabel(element) }}</el-tag>
                        </div>
                      </template>
                    </draggable>
                  </div>
                  <el-alert v-else type="info" :closable="false" show-icon>
                    <template #title>
                      <span class="text-sm">Please add carriers in Rate Shopping Configuration section above</span>
                    </template>
                  </el-alert>
                </div>
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

                  <div class="field-item">
                    <label class="field-label">Notify Emails</label>
                    <div class="email-input-group">
                      <div v-for="(email, idx) in notifyEmails" :key="idx" class="email-item">
                        <el-input
                          v-model="notifyEmails[idx]"
                          placeholder="Enter email address"
                        />
                        <el-button type="danger" @click="removeEmail(idx)">
                          <el-icon><Delete /></el-icon>
                        </el-button>
                      </div>
                      <el-button type="primary" plain @click="addEmail">
                        <el-icon><Plus /></el-icon>
                        Add Email
                      </el-button>
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
  CARRIER_OPTIONS, SERVICE_TYPE_OPTIONS, MARKUP_TYPE_OPTIONS,
  ORDER_STATUS_OPTIONS, PRIMARY_CRITERIA_OPTIONS
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
const priceWeight = ref(50)
const priceThreshold = ref<number | null>(null)
const priceDeviationPercentage = ref<number | null>(null)
const notifyEmails = ref<string[]>([])

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
    carriers: [
      {
        carrier: 'fedex',
        enabled: true,
        shippingAccountId: '',
        serviceTypes: [],
        markupType: 'none',
        markupValue: 0
      }
    ]
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

// Add carrier
const addCarrier = () => {
  // Find the first carrier that hasn't been added yet
  const existingCarriers = formData.rateShoppingConfig.carriers.map(c => c.carrier)
  const availableCarrier = CARRIER_OPTIONS.find(option => !existingCarriers.includes(option.value))
  
  formData.rateShoppingConfig.carriers.push({
    carrier: availableCarrier ? availableCarrier.value : 'fedex',
    enabled: true,
    shippingAccountId: '',
    serviceTypes: [],
    markupType: 'none',
    markupValue: 0
  })
}

// Remove carrier
const removeCarrier = (index: number) => {
  const carrier = formData.rateShoppingConfig.carriers[index]
  const carrierName = getCarrierLabel(carrier.carrier)
  
  ElMessageBox.confirm(
    `Are you sure you want to remove ${carrierName}? This will also remove it from the carrier priority list.`,
    'Remove Carrier',
    {
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    }
  ).then(() => {
    formData.rateShoppingConfig.carriers.splice(index, 1)
    ElMessage.success(`${carrierName} has been removed`)
  }).catch(() => {
    // User cancelled
  })
}

// Add email
const addEmail = () => {
  notifyEmails.value.push('')
}

// Remove email
const removeEmail = (index: number) => {
  notifyEmails.value.splice(index, 1)
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

// Sync carrier priority with added carriers
watch(() => formData.rateShoppingConfig.carriers, (newCarriers) => {
  const currentCarriers = newCarriers.map(c => c.carrier)
  
  // Remove carriers that are no longer in the list
  formData.selectionLogic.carrierPriority = formData.selectionLogic.carrierPriority.filter(
    carrier => currentCarriers.includes(carrier)
  )
  
  // Add new carriers that are not in the priority list
  currentCarriers.forEach(carrier => {
    if (!formData.selectionLogic.carrierPriority.includes(carrier)) {
      formData.selectionLogic.carrierPriority.push(carrier)
    }
  })
}, { deep: true, immediate: true })

// Sync custom weights
watch(priceWeight, (val) => {
  if (!formData.selectionLogic.customWeights) {
    formData.selectionLogic.customWeights = { priceWeight: 50, speedWeight: 50 }
  }
  formData.selectionLogic.customWeights.priceWeight = val
  formData.selectionLogic.customWeights.speedWeight = 100 - val
})

// Sync review conditions
watch([priceThreshold, priceDeviationPercentage, notifyEmails], () => {
  if (!formData.reviewRules.reviewConditions) {
    formData.reviewRules.reviewConditions = {}
  }
  formData.reviewRules.reviewConditions.priceThreshold = priceThreshold.value || undefined
  formData.reviewRules.reviewConditions.priceDeviationPercentage = priceDeviationPercentage.value || undefined
  formData.reviewRules.notifyEmails = notifyEmails.value.filter(e => e.trim())
}, { deep: true })

// Load data if editing
onMounted(() => {
  if (props.rule) {
    Object.assign(formData, JSON.parse(JSON.stringify(props.rule)))
    
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
    if (formData.reviewRules.notifyEmails) {
      notifyEmails.value = [...formData.reviewRules.notifyEmails]
    }
    
    // Load custom weights
    if (formData.selectionLogic.customWeights) {
      priceWeight.value = formData.selectionLogic.customWeights.priceWeight || 50
    }
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
  .carrier-config-card {
    padding: 16px;
    margin-bottom: 16px;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
    background-color: var(--el-fill-color-blank);
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--el-color-primary-light-5);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .carrier-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .carrier-fields {
      margin-top: 16px;
    }
  }
}

.remove-carrier-btn {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(245, 108, 108, 0.3);
  }
  
  .el-icon {
    margin-right: 4px;
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

.selection-config,
.review-config {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.weight-slider {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;

  .el-slider {
    flex: 1;
  }

  .weight-label {
    min-width: 80px;
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }
}

.draggable-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.priority-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background-color: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  cursor: move;

  &:hover {
    border-color: var(--el-color-primary);
  }

  .drag-handle {
    font-size: 18px;
    color: var(--el-text-color-secondary);
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  .priority-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: var(--el-color-primary);
    color: white;
    border-radius: 50%;
    font-size: 12px;
    font-weight: 600;
  }
}

.review-conditions {
  padding: 16px;
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
  margin-top: 16px;
}

.email-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .email-item {
    display: flex;
    gap: 8px;
    align-items: center;

    .el-input {
      flex: 1;
    }
  }
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

