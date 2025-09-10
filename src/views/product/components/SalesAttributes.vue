<template>
  <div class="sales-attributes">
    <!-- Selling Form Selection - Simplified -->
    <div class="selling-form-section">
      <div class="form-header">
        <h3 class="form-header-title">Selling Form</h3>
      </div>
      
      <div class="selling-form-radio-group">
        <el-radio-group 
          v-model="selectedForm" 
          size="large"
          class="form-radio-group"
        >
          <el-radio-button 
            v-for="form in sellingForms" 
            :key="form.value"
            :label="form.value"
            class="form-radio-button"
          >
            <div class="radio-content">
              <el-icon class="radio-icon"><component :is="form.icon" /></el-icon>
              <span class="radio-label">{{ form.label }}</span>
            </div>
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- Single Variant Settings -->
    <div v-if="selectedForm === 'single'" class="variant-settings">
      <div class="settings-content">
        
        <!-- Single Product Table -->
        <el-table 
          :data="singleVariantTableData" 
          style="width: 100%; min-height: 120px;"
          size="default"
          border
          stripe
          class="single-variant-table"
          :show-header="true"
        >
          <el-table-column label="Sales Price" min-width="160">
            <template #default="scope">
              <div class="input-group price-group">
                <el-input-number
                  v-model="scope.row.salesPrice"
                  :min="0"
                  :precision="2"
                  size="small"
                  placeholder="0.00"
                  style="width: 60%; min-width: 85px"
                />
                <el-select v-model="scope.row.priceUnit" size="small" style="width: 38%; min-width: 65px">
                  <el-option label="CNY" value="CNY" />
                  <el-option label="USD" value="USD" />
                  <el-option label="EUR" value="EUR" />
                  <el-option label="GBP" value="GBP" />
                  <el-option label="JPY" value="JPY" />
                  <el-option label="KRW" value="KRW" />
                  <el-option label="HKD" value="HKD" />
                  <el-option label="SGD" value="SGD" />
                  <el-option label="AUD" value="AUD" />
                  <el-option label="CAD" value="CAD" />
                  <el-option label="CHF" value="CHF" />
                  <el-option label="SEK" value="SEK" />
                  <el-option label="NOK" value="NOK" />
                  <el-option label="DKK" value="DKK" />
                </el-select>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="Discount Price" min-width="160">
            <template #default="scope">
              <div class="input-group discount-group">
                <el-input-number
                  v-model="scope.row.discountPrice"
                  :min="0"
                  :max="scope.row.salesPrice || undefined"
                  :precision="2"
                  size="small"
                  placeholder="0.00"
                  style="width: 60%; min-width: 85px"
                />
                <el-select v-model="scope.row.discountUnit" size="small" style="width: 38%; min-width: 65px">
                  <el-option label="CNY" value="CNY" />
                  <el-option label="USD" value="USD" />
                  <el-option label="EUR" value="EUR" />
                  <el-option label="GBP" value="GBP" />
                  <el-option label="JPY" value="JPY" />
                  <el-option label="KRW" value="KRW" />
                  <el-option label="HKD" value="HKD" />
                  <el-option label="SGD" value="SGD" />
                  <el-option label="AUD" value="AUD" />
                  <el-option label="CAD" value="CAD" />
                  <el-option label="CHF" value="CHF" />
                  <el-option label="SEK" value="SEK" />
                  <el-option label="NOK" value="NOK" />
                  <el-option label="DKK" value="DKK" />
                </el-select>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="Inventory" min-width="180">
            <template #default="scope">
              <div class="input-group inventory-group compact">
                <el-input-number
                  v-model="scope.row.inventory"
                  :min="0"
                  size="small"
                  placeholder="0"
                  style="width: 60%; min-width: 80px; flex-shrink: 1"
                />
                <el-select v-model="scope.row.inventoryUnit" size="small" style="width: 38%; min-width: 70px; flex-shrink: 0">
                  <el-option label="PCS" value="PCS" />
                  <el-option label="SET" value="SET" />
                  <el-option label="BOX" value="BOX" />
                  <el-option label="CTN" value="CTN" />
                  <el-option label="PLT" value="PLT" />
                  <el-option label="PKG" value="PKG" />
                  <el-option label="BAG" value="BAG" />
                  <el-option label="BTL" value="BTL" />
                  <el-option label="CAN" value="CAN" />
                  <el-option label="JAR" value="JAR" />
                  <el-option label="TUB" value="TUB" />
                  <el-option label="ROL" value="ROL" />
                  <el-option label="SHT" value="SHT" />
                  <el-option label="PAD" value="PAD" />
                  <el-option label="BDL" value="BDL" />
                  <el-option label="LOT" value="LOT" />
                  <el-option label="DOZ" value="DOZ" />
                  <el-option label="GRS" value="GRS" />
                  <el-option label="EA" value="EA" />
                  <el-option label="PR" value="PR" />
                </el-select>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="Weight" min-width="180">
            <template #default="scope">
              <div class="input-group weight-group compact">
                <el-input-number
                  v-model="scope.row.weight"
                  :min="0"
                  :precision="3"
                  size="small"
                  placeholder="0.000"
                  style="width: 60%; min-width: 80px; flex-shrink: 1"
                />
                <el-select v-model="scope.row.weightUnit" size="small" style="width: 38%; min-width: 70px; flex-shrink: 0">
                  <el-option label="KG" value="KG" />
                  <el-option label="G" value="G" />
                  <el-option label="MG" value="MG" />
                  <el-option label="T" value="T" />
                  <el-option label="LB" value="LB" />
                  <el-option label="OZ" value="OZ" />
                  <el-option label="ST" value="ST" />
                  <el-option label="TON" value="TON" />
                </el-select>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="Dimensions" min-width="380">
            <template #default="scope">
              <div class="dimensions-group compact">
                  <el-input-number
                    v-model="scope.row.length"
                    :min="0"
                    :precision="2"
                    size="small"
                    placeholder="L"
                  style="width: 22%; min-width: 60px"
                  />
                <span class="separator">×</span>
                  <el-input-number
                    v-model="scope.row.width"
                    :min="0"
                    :precision="2"
                    size="small"
                    placeholder="W"
                  style="width: 22%; min-width: 60px"
                  />
                <span class="separator">×</span>
                  <el-input-number
                    v-model="scope.row.height"
                    :min="0"
                    :precision="2"
                    size="small"
                    placeholder="H"
                  style="width: 22%; min-width: 60px"
                  />
                <el-select v-model="scope.row.dimensionUnit" size="small" style="width: 20%; min-width: 55px; margin-left: 8px">
                  <el-option label="CM" value="CM" />
                  <el-option label="MM" value="MM" />
                  <el-option label="M" value="M" />
                  <el-option label="IN" value="IN" />
                  <el-option label="FT" value="FT" />
                  <el-option label="YD" value="YD" />
                </el-select>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="Status" min-width="100">
            <template #default="scope">
              <el-select 
                v-model="scope.row.status" 
                size="small"
                style="width: 100%"
              >
                <el-option label="Active" value="active" />
                <el-option label="Inactive" value="inactive" />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- Multi Variant Settings -->
    <div v-if="selectedForm === 'multi'" class="variant-settings">
      <div class="settings-content">
        <!-- Sales Attributes Configuration -->
        <div class="sales-attributes-config">
          <div class="config-title">
            <span>Sales Attributes</span>
          </div>
          
          <div class="attribute-sections">
            <!-- Dynamic Attribute Configuration -->
            <div 
              v-for="(attribute, index) in selectedAttributes" 
              :key="index"
              class="attribute-section"
            >
              <div class="section-header">
                <el-select 
                  v-model="attribute.type" 
                  placeholder="Select Attribute"
                  size="small"
                  style="width: 150px"
                  @change="updateAttributeType(index)"
                >
                  <el-option 
                    v-for="type in getSelectableAttributeTypes(index)" 
                    :key="type"
                    :label="getAttributeName(type)" 
                    :value="type" 
                  />
                </el-select>
                
                <el-button 
                  type="danger" 
                  size="small" 
                  :icon="Delete"
                  @click="removeAttribute(index)"
                  style="margin-left: 10px"
                />
              </div>
              
              <div class="section-content">
                <div class="attribute-values-horizontal">
                  <div 
                    v-for="(value, valueIndex) in attribute.values" 
                    :key="valueIndex"
                    class="value-item-horizontal"
                  >
                    <el-color-picker 
                      v-if="attribute.type === 'color'"
                      v-model="value.color" 
                      size="small"
                      @change="onColorChange(index, valueIndex, $event)"
                    />
                    <el-input 
                      v-model="value.name" 
                      :placeholder="getPlaceholder(attribute.type)"
                      size="small"
                      style="width: 100px"
                      @input="generateSkuList"
                    />
                    <el-button 
                      type="danger" 
                      size="small" 
                      :icon="Delete"
                      @click="removeAttributeValue(index, valueIndex)"
                      circle
                    />
                  </div>
                  
                  <el-button 
                    type="primary" 
                    size="small" 
                    :icon="Plus"
                    @click="addAttributeValue(index)"
                    circle
                  />
                </div>
              </div>
            </div>

            <!-- Add Attribute Button -->
            <div v-if="selectedAttributes.length < 3" class="add-attribute-section">
              <el-button 
                type="primary" 
                size="small" 
                :icon="Plus"
                @click="addAttribute"
                style="width: 100%"
              >
                Add Attribute ({{ selectedAttributes.length }}/3)
              </el-button>
            </div>
          </div>
        </div>

        <!-- Generated SKU List -->
        <div v-if="skuList.length > 0" class="variants-table-section">
          <div class="table-header">
            <span>SKU List ({{ skuList.length }} variants)</span>
          </div>
          
          <!-- Batch Settings Area -->
          <div class="batch-settings-area">
            <div class="batch-settings-header" @click="toggleBatchSettings">
              <span class="batch-title">Batch Settings</span>
              <el-button size="small" type="text">
                <el-icon>
                  <ArrowDown v-if="showBatchSettings" />
                  <ArrowRight v-else />
                </el-icon>
              </el-button>
            </div>
            
            <div v-show="showBatchSettings" class="batch-settings-content">
              <!-- Single Row: All Fields -->
              <div class="batch-row single-line-row">
                <div class="batch-field price-field">
                  <span class="field-label">Sales Price:</span>
                  <div class="input-group">
                    <el-input-number 
                      v-model="batchSettings.salesPrice" 
                      :min="0" 
                      :precision="2" 
                      size="small" 
                      placeholder="0.00"
                      style="width: 120px"
                    />
                    <el-select v-model="batchSettings.currency" size="small" style="width: 80px">
                      <el-option label="USD" value="USD" />
                      <el-option label="EUR" value="EUR" />
                      <el-option label="GBP" value="GBP" />
                      <el-option label="CNY" value="CNY" />
                    </el-select>
                  </div>
                </div>
                
                <div class="batch-field inventory-field">
                  <span class="field-label">Inventory:</span>
                  <div class="input-group">
                    <el-input-number 
                      v-model="batchSettings.inventory" 
                      :min="0" 
                      size="small" 
                      placeholder="0"
                      style="width: 100px"
                    />
                    <el-select v-model="batchSettings.inventoryUnit" size="small" style="width: 70px">
                      <el-option label="PCS" value="PCS" />
                      <el-option label="SET" value="SET" />
                      <el-option label="BOX" value="BOX" />
                      <el-option label="CTN" value="CTN" />
                    </el-select>
                  </div>
                </div>
                
                <div class="batch-field weight-field">
                  <span class="field-label">Weight:</span>
                  <div class="input-group">
                    <el-input-number 
                      v-model="batchSettings.weight" 
                      :min="0" 
                      :precision="3" 
                      size="small" 
                      placeholder="0.000"
                      style="width: 100px"
                    />
                    <el-select v-model="batchSettings.weightUnit" size="small" style="width: 70px">
                      <el-option label="KG" value="KG" />
                      <el-option label="G" value="G" />
                      <el-option label="LB" value="LB" />
                      <el-option label="OZ" value="OZ" />
                    </el-select>
                  </div>
                </div>
                
                <div class="batch-field dimensions-field">
                  <span class="field-label">Dimensions:</span>
                  <div class="input-group dimensions-inputs">
                    <el-input-number 
                      v-model="batchSettings.length" 
                      :min="0" 
                      :precision="2" 
                      size="small" 
                      placeholder="L"
                      style="width: 70px"
                    />
                    <span class="dimension-separator">×</span>
                    <el-input-number 
                      v-model="batchSettings.width" 
                      :min="0" 
                      :precision="2" 
                      size="small" 
                      placeholder="W"
                      style="width: 70px"
                    />
                    <span class="dimension-separator">×</span>
                    <el-input-number 
                      v-model="batchSettings.height" 
                      :min="0" 
                      :precision="2" 
                      size="small" 
                      placeholder="H"
                      style="width: 70px"
                    />
                    <el-select v-model="batchSettings.dimensionUnit" size="small" style="width: 70px">
                      <el-option label="CM" value="CM" />
                      <el-option label="MM" value="MM" />
                      <el-option label="M" value="M" />
                      <el-option label="IN" value="IN" />
                    </el-select>
                  </div>
                </div>
                
                <div class="batch-field status-field">
                  <span class="field-label">Status:</span>
                  <el-select v-model="batchSettings.status" size="small" style="width: 120px">
                    <el-option label="Active" value="Active" />
                    <el-option label="Inactive" value="Inactive" />
                  </el-select>
                </div>
                
                <div class="batch-actions-inline">
                  <el-button type="primary" @click="applyAllBatchSettings">
                    Apply All Settings
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          
          <el-table 
            :data="groupedSkuList" 
            style="width: 100%"
            class="variants-table"
            size="default"
            border
            stripe
            :span-method="handleSpanMethod"
          >
            <!-- Dynamic Attribute Columns -->
            <el-table-column 
              v-for="(attribute, index) in selectedAttributes" 
              :key="attribute.type"
              :label="getAttributeName(attribute.type)"
              :min-width="100"
              :prop="attribute.type"
              :class-name="index === selectedAttributes.length - 1 ? 'sku-detail-column' : ''"
            >
              <template #header="{ column }">
                <div class="column-header">
                  <span>{{ getAttributeName(attribute.type) }}</span>
                </div>
              </template>
              <template #default="scope">
                <div class="attribute-cell" :class="{ 
                  'group-start': scope.row._isGroupStart?.[attribute.type]
                }">
                  <span class="attribute-value">{{ scope.row[attribute.type] }}</span>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="Sales Price" min-width="160">
              <template #default="scope">
                <div class="input-group price-group">
                  <el-input-number
                    v-model="scope.row.salesPrice"
                    :min="0"
                    :precision="2"
                    size="small"
                    placeholder="0.00"
                    style="width: 60%; min-width: 85px"
                  />
                  <el-select v-model="scope.row.priceUnit" size="small" style="width: 38%; min-width: 65px">
                    <el-option label="CNY" value="CNY" />
                    <el-option label="USD" value="USD" />
                    <el-option label="EUR" value="EUR" />
                    <el-option label="GBP" value="GBP" />
                    <el-option label="JPY" value="JPY" />
                    <el-option label="KRW" value="KRW" />
                    <el-option label="HKD" value="HKD" />
                    <el-option label="SGD" value="SGD" />
                    <el-option label="AUD" value="AUD" />
                    <el-option label="CAD" value="CAD" />
                    <el-option label="CHF" value="CHF" />
                    <el-option label="SEK" value="SEK" />
                    <el-option label="NOK" value="NOK" />
                    <el-option label="DKK" value="DKK" />
                  </el-select>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="Discount Price" min-width="160">
              <template #default="scope">
                <div class="input-group discount-group">
                  <el-input-number
                    v-model="scope.row.discountPrice"
                    :min="0"
                    :max="scope.row.salesPrice || undefined"
                    :precision="2"
                    size="small"
                    placeholder="0.00"
                    style="width: 60%; min-width: 85px"
                  />
                  <el-select v-model="scope.row.discountUnit" size="small" style="width: 38%; min-width: 65px">
                    <el-option label="CNY" value="CNY" />
                    <el-option label="USD" value="USD" />
                    <el-option label="EUR" value="EUR" />
                    <el-option label="GBP" value="GBP" />
                    <el-option label="JPY" value="JPY" />
                    <el-option label="KRW" value="KRW" />
                    <el-option label="HKD" value="HKD" />
                    <el-option label="SGD" value="SGD" />
                    <el-option label="AUD" value="AUD" />
                    <el-option label="CAD" value="CAD" />
                    <el-option label="CHF" value="CHF" />
                    <el-option label="SEK" value="SEK" />
                    <el-option label="NOK" value="NOK" />
                    <el-option label="DKK" value="DKK" />
                  </el-select>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="Inventory" min-width="180">
              <template #default="scope">
                <div class="input-group inventory-group compact">
                  <el-input-number
                    v-model="scope.row.inventory"
                    :min="0"
                    size="small"
                    placeholder="0"
                    style="width: 60%; min-width: 80px; flex-shrink: 1"
                  />
                  <el-select v-model="scope.row.inventoryUnit" size="small" style="width: 38%; min-width: 70px; flex-shrink: 0">
                    <el-option label="PCS" value="PCS" />
                    <el-option label="SET" value="SET" />
                    <el-option label="BOX" value="BOX" />
                    <el-option label="CTN" value="CTN" />
                    <el-option label="PLT" value="PLT" />
                    <el-option label="PKG" value="PKG" />
                    <el-option label="BAG" value="BAG" />
                    <el-option label="BTL" value="BTL" />
                    <el-option label="CAN" value="CAN" />
                    <el-option label="JAR" value="JAR" />
                    <el-option label="TUB" value="TUB" />
                    <el-option label="ROL" value="ROL" />
                    <el-option label="SHT" value="SHT" />
                    <el-option label="PAD" value="PAD" />
                    <el-option label="BDL" value="BDL" />
                    <el-option label="LOT" value="LOT" />
                    <el-option label="DOZ" value="DOZ" />
                    <el-option label="GRS" value="GRS" />
                    <el-option label="EA" value="EA" />
                    <el-option label="PR" value="PR" />
                  </el-select>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="Weight" min-width="180">
              <template #default="scope">
                <div class="input-group weight-group compact">
                  <el-input-number
                    v-model="scope.row.weight"
                    :min="0"
                    :precision="3"
                    size="small"
                    placeholder="0.000"
                    style="width: 60%; min-width: 80px; flex-shrink: 1"
                  />
                  <el-select v-model="scope.row.weightUnit" size="small" style="width: 38%; min-width: 70px; flex-shrink: 0">
                    <el-option label="KG" value="KG" />
                    <el-option label="G" value="G" />
                    <el-option label="MG" value="MG" />
                    <el-option label="T" value="T" />
                    <el-option label="LB" value="LB" />
                    <el-option label="OZ" value="OZ" />
                    <el-option label="ST" value="ST" />
                    <el-option label="TON" value="TON" />
                  </el-select>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="Dimensions" min-width="380">
              <template #default="scope">
                <div class="dimensions-group compact">
                    <el-input-number
                      v-model="scope.row.length"
                      :min="0"
                      :precision="2"
                      size="small"
                      placeholder="L"
                    style="width: 22%; min-width: 60px"
                    />
                  <span class="separator">×</span>
                    <el-input-number
                      v-model="scope.row.width"
                      :min="0"
                      :precision="2"
                      size="small"
                      placeholder="W"
                    style="width: 22%; min-width: 60px"
                    />
                  <span class="separator">×</span>
                    <el-input-number
                      v-model="scope.row.height"
                      :min="0"
                      :precision="2"
                      size="small"
                      placeholder="H"
                    style="width: 22%; min-width: 60px"
                    />
                  <el-select v-model="scope.row.dimensionUnit" size="small" style="width: 20%; min-width: 55px; margin-left: 8px">
                    <el-option label="CM" value="CM" />
                    <el-option label="MM" value="MM" />
                    <el-option label="M" value="M" />
                    <el-option label="IN" value="IN" />
                    <el-option label="FT" value="FT" />
                    <el-option label="YD" value="YD" />
                  </el-select>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="SKU" min-width="180">
              <template #default="scope">
                <el-input
                  v-model="scope.row.sku"
                  size="small"
                  placeholder="Enter SKU"
                  style="font-family: monospace;"
                />
              </template>
            </el-table-column>
            
            <el-table-column label="Status" min-width="100">
              <template #default="scope">
                <el-select 
                  v-model="scope.row.status" 
                  size="small"
                  style="width: 100%"
                >
                  <el-option label="Active" value="active" />
                  <el-option label="Inactive" value="inactive" />
                </el-select>
              </template>
            </el-table-column>
            
            <el-table-column label="Actions" width="80" fixed="right">
              <template #default="scope">
                <el-button 
                  type="danger" 
                  size="small"
                  :icon="Delete"
                  @click="deleteSkuRow(scope.$index)"
                  circle
                  :disabled="skuList.length <= 1"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- Bundle Settings -->
    <div v-if="selectedForm === 'bundle'" class="bundle-table-section">
      <!-- Bundle Product Selection -->
      <div class="bundle-product-selector">
        <div class="selector-header">
          <span class="selector-title">Select Bundle Products</span>
      </div>
            <el-select
              v-model="selectedBundleProducts"
              placeholder="Search and select products by SKU or name"
              multiple
              filterable
              remote
              :remote-method="searchProducts"
              :loading="productSearchLoading"
          size="default"
          style="width: 100%; margin-bottom: 16px"
            >
              <el-option
                v-for="product in availableProducts"
                :key="product.sku"
                :label="`${product.sku} - ${product.name}`"
                :value="product.sku"
          />
            </el-select>
        
        <!-- Quick Bundle Presets -->
        <div class="preset-bundles">
          <div class="preset-title">Quick Presets:</div>
          <div class="preset-buttons">
                <el-button 
              v-for="preset in presetBundles"
              :key="preset.name"
                  size="small" 
                  type="primary" 
                  plain
              @click="loadPresetBundle(preset.products)"
            >
              {{ preset.name }}
              <el-tooltip :content="preset.description" placement="top">
                <el-icon style="margin-left: 4px"><InfoFilled /></el-icon>
              </el-tooltip>
                </el-button>
              </div>
            </div>
          </div>

       <!-- Bundle Configuration Table -->
       <div v-if="bundleTableData.length > 0" class="bundle-table-container">
         <div class="table-header">
           <span>Bundle Configuration ({{ bundleTableData.length }} products)</span>
           <div class="bundle-batch-settings">
             <div class="batch-quantity-setting">
               <label>Batch Quantity:</label>
               <el-input-number
                 v-model="bundleBatchQuantity"
                 :min="1"
                 :max="99"
                 size="small"
                 placeholder="1"
                 style="width: 80px; margin-left: 8px; margin-right: 8px"
               />
               <el-button 
                 type="primary" 
                 size="small"
                 @click="applyBatchQuantity"
               >
                 Apply to All
               </el-button>
             </div>
           </div>
         </div>
        
         <el-table 
           :data="bundleTableData" 
           style="width: 100%"
           class="bundle-table"
           size="default"
           border
           stripe
           :span-method="handleBundleSpanMethod"
         >
          <el-table-column label="Product" min-width="200">
            <template #default="scope">
              <div class="product-info">
                <div class="product-sku">{{ scope.row.sku }}</div>
                <div class="product-name">{{ scope.row.name }}</div>
                </div>
            </template>
          </el-table-column>
          
           <el-table-column label="Unit Price" min-width="120">
             <template #default="scope">
               <div class="unit-price-display">
                 ${{ (availableProducts.find(p => p.sku === scope.row.sku)?.price || 0).toFixed(2) }}
               </div>
             </template>
           </el-table-column>
           
           <el-table-column label="Quantity" min-width="100">
             <template #default="scope">
                   <el-input-number
                 v-model="scope.row.quantity"
                     :min="1"
                     :max="99"
                     size="small"
               />
             </template>
           </el-table-column>
          
           <el-table-column label="Sales Price" min-width="160">
             <template #default="scope">
               <div class="input-group price-group compact">
                 <el-input-number
                   v-model="bundleAggregateSettings.salesPrice"
                   :min="0"
                   :precision="2"
                   size="small"
                   placeholder="0.00"
                   style="flex: 1 1 60%"
                 />
                 <el-select v-model="bundleAggregateSettings.priceUnit" size="small" style="flex: 0 0 38%">
                   <el-option label="USD" value="USD" />
                   <el-option label="EUR" value="EUR" />
                   <el-option label="GBP" value="GBP" />
                   <el-option label="CNY" value="CNY" />
                 </el-select>
               </div>
             </template>
           </el-table-column>
          
          <el-table-column label="Discount Price" min-width="160">
            <template #default="scope">
              <div class="input-group discount-group compact">
                <el-input-number
                  v-model="bundleAggregateSettings.discountPrice"
                  :min="0"
                  :precision="2"
                  size="small"
                  placeholder="0.00"
                  style="flex: 1 1 60%"
                />
                <el-select v-model="bundleAggregateSettings.discountUnit" size="small" style="flex: 0 0 38%">
                  <el-option label="USD" value="USD" />
                  <el-option label="EUR" value="EUR" />
                  <el-option label="GBP" value="GBP" />
                  <el-option label="CNY" value="CNY" />
                </el-select>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="Inventory Type" min-width="200">
            <template #default="scope">
              <el-radio-group v-model="bundleAggregateSettings.inventoryType" size="small" class="compact-radio-group">
                <el-radio-button label="sub_product">Sub Product</el-radio-button>
                <el-radio-button label="bundle">Bundle</el-radio-button>
              </el-radio-group>
            </template>
          </el-table-column>
          
          <el-table-column label="Weight" min-width="150">
            <template #default="scope">
              <div class="input-group weight-group compact">
                <el-input-number
                  v-model="bundleAggregateSettings.weight"
                  :min="0"
                  :precision="3"
                  size="small"
                  placeholder="0.000"
                  style="flex: 1 1 60%"
                />
                <el-select v-model="bundleAggregateSettings.weightUnit" size="small" style="flex: 0 0 38%">
                  <el-option label="KG" value="KG" />
                  <el-option label="G" value="G" />
                  <el-option label="LB" value="LB" />
                  <el-option label="OZ" value="OZ" />
                </el-select>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="Dimensions" min-width="320">
            <template #default="scope">
              <div class="dimensions-group compact">
                <el-input-number
                  v-model="bundleAggregateSettings.length"
                  :min="0"
                  :precision="2"
                  size="small"
                  placeholder="L"
                  style="width: 20%; min-width: 50px"
                />
                <span class="separator">×</span>
                <el-input-number
                  v-model="bundleAggregateSettings.width"
                  :min="0"
                  :precision="2"
                  size="small"
                  placeholder="W"
                  style="width: 20%; min-width: 50px"
                />
                <span class="separator">×</span>
                <el-input-number
                  v-model="bundleAggregateSettings.height"
                  :min="0"
                  :precision="2"
                  size="small"
                  placeholder="H"
                  style="width: 20%; min-width: 50px"
                />
                <el-select v-model="bundleAggregateSettings.dimensionUnit" size="small" style="width: 25%; min-width: 50px; margin-left: 4px">
                  <el-option label="CM" value="CM" />
                  <el-option label="MM" value="MM" />
                  <el-option label="M" value="M" />
                  <el-option label="IN" value="IN" />
                </el-select>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="Split Shipping" min-width="140">
            <template #default="scope">
              <el-switch
                v-model="bundleAggregateSettings.splitShipping"
                active-text="Yes"
                inactive-text="No"
                size="small"
              />
            </template>
          </el-table-column>
          
          <el-table-column label="Actions" min-width="80" fixed="right">
            <template #default="scope">
                <el-button 
                  type="danger" 
                  size="small"
                circle
                @click="removeBundleProduct(scope.row.sku)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { 
  InfoFilled,
  Grid,
  Box,
  Brush,
  Expand,
  Star,
  Plus,
  Delete,
  ArrowDown,
  ArrowRight,
  Goods,
  User,
  Setting,
  Money,
  CircleCheck,
  DocumentAdd,
  Check
} from '@element-plus/icons-vue';

interface SellingForm {
  value: 'single' | 'multi' | 'bundle';
  label: string;
  description: string;
  icon: any;
}

interface Dimension {
  value: string;
  label: string;
  description: string;
  icon: any;
}

interface Product {
  sku: string;
  name: string;
  price: number;
}

// 新的动态规格属性接口
interface AttributeValue {
  name: string;
  color?: string; // 仅颜色属性使用
}

interface AttributeConfig {
  type: 'color' | 'size' | 'material' | 'style' | 'spec';
  values: AttributeValue[];
}

interface SkuItem {
  [key: string]: any; // 动态规格属性
  salesPrice: number;
  priceUnit: string;
  discountPrice: number;
  discountUnit: string;
  inventory: number;
  inventoryUnit: string;
  weight: number;
  weightUnit: string;
  length: number;
  width: number;
  height: number;
  dimensionUnit: string;
  sku: string;
  status: 'active' | 'inactive';
}

interface BundleItem {
  sku: string;
  name: string;
  quantity: number;
  salesPrice: number;
  priceUnit: string;
  discountPrice: number;
  discountUnit: string;
  inventoryType: 'sub_product' | 'bundle';
  weight: number;
  weightUnit: string;
  length: number;
  width: number;
  height: number;
  dimensionUnit: string;
  splitShipping: boolean;
  status: string;
}

// 用于表格显示的行数据接口，支持行合并
interface TableRowItem extends SkuItem {
  _rowSpan?: Record<string, number>; // 每个属性列的行合并数量
  _isGroupStart?: Record<string, boolean>; // 标记是否为分组的开始行
}

interface ColorOption {
  name: string;
  hex: string;
}

interface Specification {
  name: string;
  values: string[];
}

interface VariantData {
  sku: string;
  specifications: Record<string, string>;
  regularPrice: number;
  salePrice: number;
  costPrice: number;
  stock: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  barcode: string;
  status: 'active' | 'inactive' | 'out_of_stock';
}

const props = defineProps<{
  modelValue: {
    sellingForm: 'single' | 'multi' | 'bundle';
    dimensions?: string[];
    colorOptions?: ColorOption[];
    sizeOptions?: string[];
    styleOptions?: string[];
    bundleProducts?: Array<{ sku: string; quantity: number; }>;
  };
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

// 销售形式选项
const sellingForms: SellingForm[] = [
  {
    value: 'single',
    label: 'Single Variant',
    description: 'One product with no variations',
    icon: Goods
  },
  {
    value: 'multi',
    label: 'Multi Variant',
    description: 'Product with multiple variants (color, size, etc.)',
    icon: Grid
  },
  {
    value: 'bundle',
    label: 'Bundle',
    description: 'Combination of multiple existing products',
    icon: Box
  }
];

// 可用维度
const availableDimensions: Dimension[] = [
  {
    value: 'color',
    label: 'Color',
    description: 'Different colors of the product',
    icon: Brush
  },
  {
    value: 'size',
    label: 'Size',
    description: 'Different sizes (XS, S, M, L, XL, etc.)',
    icon: Expand
  },
  {
    value: 'style',
    label: 'Style',
    description: 'Different styles or designs',
    icon: Star
  },
  {
    value: 'material',
    label: 'Material',
    description: 'Different materials or fabrics',
    icon: Setting
  }
];

// 状态 - 默认选中单规格
const selectedForm = ref<'single' | 'multi' | 'bundle'>('single');
const selectedDimensions = ref<string[]>([]);
const primaryDimension = ref<string>('');
// 新的动态规格属性系统
const selectedAttributes = ref<AttributeConfig[]>([]);
const skuList = ref<SkuItem[]>([]);

// 原有的数据（保留兼容性）
const colorOptions = ref<ColorOption[]>([]);
const selectedSizes = ref<string[]>([]);
const styleOptions = ref<string[]>([]);
const showStyleInput = ref(false);
const newStyleName = ref('');

// 单规格商品数据
const singleVariant = ref({
  salesPrice: 15,
  discountPrice: 0,
  inventory: 705,
  weight: 0.15,
  length: 0,
  width: 0,
  height: 0
});

// 多规格属性开关
const enableColor = ref(false);
const enableSize = ref(false);
const enableStyle = ref(false);

// 生成的变体列表
const generatedVariants = ref<any[]>([]);

// 产品基本信息（从父组件传入或模拟）
const productName = ref('New Product');
const productSku = ref('SKU-001');
const masterSku = ref('MASTER-001'); // 主SKU，用于生成变体SKU

// 批量设置相关
const showBatchSettings = ref(true);
const batchSettings = ref({
  salesPrice: 0,
  discountPrice: 0,
  currency: 'USD',
  inventory: 0,
  inventoryUnit: 'PCS',
  weight: 0,
  weightUnit: 'KG',
  length: 0,
  width: 0,
  height: 0,
  dimensionUnit: 'CM',
  status: 'Active'
});

// 套装相关
const selectedBundleProducts = ref<string[]>([]);
const bundleQuantities = ref<Record<string, number>>({});
const availableProducts = ref<Product[]>([
  {
    sku: 'TSH-001',
    name: 'Cotton Basic T-Shirt',
    price: 19.99,
    category: 'Clothing'
  },
  {
    sku: 'JEA-002', 
    name: 'Denim Slim Fit Jeans',
    price: 79.99,
    category: 'Clothing'
  },
  {
    sku: 'SNE-003',
    name: 'Canvas Sneakers',
    price: 89.99,
    category: 'Footwear'
  },
  {
    sku: 'CAP-004',
    name: 'Baseball Cap',
    price: 24.99,
    category: 'Accessories'
  },
  {
    sku: 'BAG-005',
    name: 'Leather Backpack',
    price: 149.99,
    category: 'Accessories'
  },
  {
    sku: 'SUN-006',
    name: 'Aviator Sunglasses',
    price: 129.99,
    category: 'Accessories'
  },
  {
    sku: 'SHI-007',
    name: 'Oxford Dress Shirt',
    price: 59.99,
    category: 'Clothing'
  },
  {
    sku: 'JAC-008',
    name: 'Leather Jacket',
    price: 299.99,
    category: 'Clothing'
  },
  {
    sku: 'WAT-009',
    name: 'Stainless Steel Watch',
    price: 199.99,
    category: 'Accessories'
  },
  {
    sku: 'BOO-010',
    name: 'Leather Boots',
    price: 179.99,
    category: 'Footwear'
  }
]);
const productSearchLoading = ref(false);

// 组合品表格数据
const bundleTableData = ref<BundleItem[]>([]);

// 组合品聚合设置（所有子商品共享的设置）
const bundleAggregateSettings = ref({
  salesPrice: 0,
  priceUnit: 'USD',
  discountPrice: 0,
  discountUnit: 'USD',
  inventoryType: 'sub_product' as 'sub_product' | 'bundle',
  weight: 0,
  weightUnit: 'KG',
  length: 0,
  width: 0,
  height: 0,
  dimensionUnit: 'CM',
  splitShipping: false,
  status: 'Active'
});

// 批量数量设置
const bundleBatchQuantity = ref(1);

// 预设组合商品（用于调试）
const presetBundles = [
  {
    name: 'Casual Outfit',
    description: 'T-Shirt + Jeans + Sneakers',
    products: ['TSH-001', 'JEA-002', 'SNE-003']
  },
  {
    name: 'Business Look',
    description: 'Dress Shirt + Leather Jacket + Boots',
    products: ['SHI-007', 'JAC-008', 'BOO-010']
  },
  {
    name: 'Accessories Bundle',
    description: 'Cap + Backpack + Sunglasses + Watch',
    products: ['CAP-004', 'BAG-005', 'SUN-006', 'WAT-009']
  }
];

// 可用尺寸
const availableSizes = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
  '28', '30', '32', '34', '36', '38', '40', '42'
];

// 固定表格数据，避免响应式循环
const singleVariantTableData = ref([{
  salesPrice: 15,
  priceUnit: 'CNY',
  discountPrice: 12,
  discountUnit: 'CNY',
  inventory: 705,
  inventoryUnit: 'PCS',
  weight: 0.15,
  weightUnit: 'KG',
  length: 10,
  width: 8,
  height: 5,
  dimensionUnit: 'CM',
  status: 'active'
}]);

const totalBundleItems = computed(() => {
  return Object.values(bundleQuantities.value).reduce((sum, qty) => sum + qty, 0);
});

const totalBundleValue = computed(() => {
  return selectedBundleProducts.value.reduce((sum, sku) => {
    const product = availableProducts.value.find(p => p.sku === sku);
    const quantity = bundleQuantities.value[sku] || 1;
    return sum + (product ? product.price * quantity : 0);
  }, 0);
});

// 单规格价格计算
const finalPrice = computed(() => {
  return singleVariant.value.discountPrice || singleVariant.value.salesPrice || 0;
});

const savings = computed(() => {
  const basePrice = singleVariant.value.salesPrice || 0;
  const discountPrice = singleVariant.value.discountPrice || 0;
  return discountPrice > 0 ? basePrice - discountPrice : 0;
});

const profitMargin = computed(() => {
  // 简化计算，暂时不考虑成本价
  return 0;
});

const profitAmount = computed(() => {
  return (singleVariant.value.salesPrice || 0) - 0; // 简化计算，暂时不考虑成本价
});

// 处理行聚合的计算属性
const groupedSkuList = computed(() => {
  if (skuList.value.length === 0 || selectedAttributes.value.length === 0) {
    return skuList.value.map(item => ({ ...item, _rowSpan: {}, _isGroupStart: {} }));
  }

  // 初始化结果数组
  const result: TableRowItem[] = skuList.value.map(item => ({ 
    ...item, 
    _rowSpan: {}, 
    _isGroupStart: {} 
  }));
  
  // 为每个属性计算行合并信息（除了最后一个属性）
  const attributesToGroup = selectedAttributes.value.slice(0, -1); // 排除最后一个属性
  
  attributesToGroup.forEach((attribute) => {
    const attributeType = attribute.type;
    let currentValue = '';
    let currentGroupStart = 0;
    let currentGroupSize = 0;

    result.forEach((item, index) => {
      const itemValue = item[attributeType] || '';
      
      if (itemValue !== currentValue) {
        // 为前一组设置行合并信息
        if (currentGroupSize > 0) {
          for (let i = currentGroupStart; i < currentGroupStart + currentGroupSize; i++) {
            result[i]._rowSpan![attributeType] = i === currentGroupStart ? currentGroupSize : 0;
            result[i]._isGroupStart![attributeType] = i === currentGroupStart;
          }
        }
        
        // 开始新组
        currentValue = itemValue;
        currentGroupStart = index;
        currentGroupSize = 1;
      } else {
        currentGroupSize++;
      }
    });

    // 处理最后一组
    if (currentGroupSize > 0) {
      for (let i = currentGroupStart; i < currentGroupStart + currentGroupSize; i++) {
        result[i]._rowSpan![attributeType] = i === currentGroupStart ? currentGroupSize : 0;
        result[i]._isGroupStart![attributeType] = i === currentGroupStart;
      }
    }
  });

  // 为最后一个属性设置默认值（不聚合）
  if (selectedAttributes.value.length > 0) {
    const lastAttributeType = selectedAttributes.value[selectedAttributes.value.length - 1].type;
    result.forEach((item) => {
      item._rowSpan![lastAttributeType] = 1; // 每行都显示
      item._isGroupStart![lastAttributeType] = false; // 不标记为组开始
    });
  }

  return result;
});

// 监听selectedForm变化 - 简化版本，避免循环更新
watch(selectedForm, (newForm) => {
  console.log('Selling form changed to:', newForm);
  // 清理其他形式的数据，但不调用updateParent
  if (newForm !== 'multi') {
    enableColor.value = false;
    enableSize.value = false;
    enableStyle.value = false;
    colorOptions.value = [];
    selectedSizes.value = [];
    styleOptions.value = [];
    generatedVariants.value = [];
  }
  if (newForm !== 'bundle') {
    selectedBundleProducts.value = [];
    bundleQuantities.value = {};
  }
});

// 初始化时确保默认状态
console.log('Initial selectedForm:', selectedForm.value);

// 强制设置默认值
selectedForm.value = 'single';

// 方法
const handleFormChange = (form: 'single' | 'multi' | 'bundle') => {
  selectedForm.value = form;
};

// 批量设置方法
const toggleBatchSettings = () => {
  showBatchSettings.value = !showBatchSettings.value;
};

const applyAllBatchSettings = () => {
  if (skuList.value.length === 0) return;
  
  skuList.value.forEach(sku => {
    // Apply sales price if set
    if (batchSettings.value.salesPrice > 0) {
      sku.salesPrice = batchSettings.value.salesPrice;
      sku.priceUnit = batchSettings.value.currency;
    }
    
    // Apply discount price if set
    if (batchSettings.value.discountPrice > 0) {
      sku.discountPrice = batchSettings.value.discountPrice;
      sku.discountUnit = batchSettings.value.currency;
    }
    
    // Apply inventory if set
    if (batchSettings.value.inventory > 0) {
      sku.inventory = batchSettings.value.inventory;
      sku.inventoryUnit = batchSettings.value.inventoryUnit;
    }
    
    // Apply weight if set
    if (batchSettings.value.weight > 0) {
      sku.weight = batchSettings.value.weight;
      sku.weightUnit = batchSettings.value.weightUnit;
    }
    
    // Apply dimensions if any dimension is set
    if (batchSettings.value.length > 0 || batchSettings.value.width > 0 || batchSettings.value.height > 0) {
      if (batchSettings.value.length > 0) sku.length = batchSettings.value.length;
      if (batchSettings.value.width > 0) sku.width = batchSettings.value.width;
      if (batchSettings.value.height > 0) sku.height = batchSettings.value.height;
      sku.dimensionUnit = batchSettings.value.dimensionUnit;
    }
    
    // Apply status (always apply as it has a default value)
    sku.status = batchSettings.value.status;
  });
  
  console.log(`Applied all batch settings to ${skuList.value.length} SKUs`);
  
  // Optional: Show success message
  // ElMessage.success(`Successfully applied batch settings to ${skuList.value.length} SKUs`);
};

const updateSingleVariant = () => {
  console.log('Single variant updated:', singleVariant.value);
  // 移除 updateParent 调用，避免循环更新
};

const resetSingleVariant = () => {
  singleVariant.value = {
    salesPrice: 0,
    discountPrice: 0,
    inventory: 0
  };
  updateParent();
};

const onAttributeToggle = () => {
  // 当属性开关变化时，清空生成的变体
  generatedVariants.value = [];
  updateParent();
};

const generateVariants = () => {
  const variants = [];
  const attributes = [];
  
  if (enableColor.value && colorOptions.value.length > 0) {
    attributes.push({
      name: 'color',
      values: colorOptions.value.map(c => ({ name: c.name, hex: c.hex }))
    });
  }
  
  if (enableSize.value && selectedSizes.value.length > 0) {
    attributes.push({
      name: 'size',
      values: selectedSizes.value.map(s => ({ name: s }))
    });
  }
  
  if (enableStyle.value && styleOptions.value.length > 0) {
    attributes.push({
      name: 'style',
      values: styleOptions.value.map(s => ({ name: s }))
    });
  }
  
  if (attributes.length === 0) {
    return;
  }
  
  // 生成所有可能的组合
  const combinations = generateCombinations(attributes);
  
  combinations.forEach((combo, index) => {
    const sku = `${productSku.value || 'SKU'}-${String(index + 1).padStart(3, '0')}`;
    const variant = {
      sku,
      attributes: combo,
      salesPrice: 0,
      discountPrice: 0,
      inventory: 0
    };
    variants.push(variant);
  });
  
  generatedVariants.value = variants;
  updateParent();
};


const updateVariant = (index: number) => {
  updateParent();
};

const removeVariant = (index: number) => {
  generatedVariants.value.splice(index, 1);
  updateParent();
};

const bulkUpdatePrices = () => {
  // 批量更新价格的逻辑
  console.log('Bulk update prices');
};

const bulkUpdateInventory = () => {
  // 批量更新库存的逻辑
  console.log('Bulk update inventory');
};

const toggleDimension = (dimension: string) => {
  const index = selectedDimensions.value.indexOf(dimension);
  if (index > -1) {
    selectedDimensions.value.splice(index, 1);
    if (primaryDimension.value === dimension) {
      primaryDimension.value = selectedDimensions.value[0] || '';
    }
  } else {
    selectedDimensions.value.push(dimension);
    if (!primaryDimension.value) {
      primaryDimension.value = dimension;
    }
  }
  updateParent();
};

// 获取可用的属性类型
const getAvailableAttributeTypes = () => {
  const allTypes = ['color', 'size', 'material', 'style', 'spec'];
  const usedTypes = selectedAttributes.value.map(attr => attr.type);
  return allTypes.filter(type => !usedTypes.includes(type));
};

// 获取选择器可选的属性类型（包含当前属性）
const getSelectableAttributeTypes = (currentIndex: number) => {
  const allTypes = ['color', 'size', 'material', 'style', 'spec'];
  const usedTypes = selectedAttributes.value
    .map((attr, index) => index !== currentIndex ? attr.type : null)
    .filter(type => type !== null);
  return allTypes.filter(type => !usedTypes.includes(type));
};

// 新的动态规格属性方法
const addAttribute = () => {
  if (selectedAttributes.value.length < 3) {
    const availableTypes = getAvailableAttributeTypes();
    if (availableTypes.length > 0) {
      selectedAttributes.value.push({
        type: availableTypes[0] as 'color' | 'size' | 'material' | 'style' | 'spec',
        values: []
      });
    }
  }
};

const removeAttribute = (index: number) => {
  selectedAttributes.value.splice(index, 1);
  generateSkuList();
};

const updateAttributeType = (index: number) => {
  // 清空该属性的值
  selectedAttributes.value[index].values = [];
  generateSkuList();
};

const addAttributeValue = (attributeIndex: number) => {
  const attribute = selectedAttributes.value[attributeIndex];
  const newValue: AttributeValue = { name: '' };
  if (attribute.type === 'color') {
    newValue.color = '#ffffff';
  }
  attribute.values.push(newValue);
};

const removeAttributeValue = (attributeIndex: number, valueIndex: number) => {
  selectedAttributes.value[attributeIndex].values.splice(valueIndex, 1);
  generateSkuList();
};

const getAttributeName = (type: string) => {
  const nameMap = {
    color: 'Color',
    size: 'Size',
    material: 'Material',
    style: 'Style',
    spec: 'Spec'
  };
  return nameMap[type as keyof typeof nameMap] || 'Attribute';
};

const getPlaceholder = (type: string) => {
  const placeholderMap = {
    color: 'Color name',
    size: 'Size',
    material: 'Material',
    style: 'Style',
    spec: 'Specification'
  };
  return placeholderMap[type as keyof typeof placeholderMap] || 'Value';
};

const generateSkuList = () => {
  if (selectedAttributes.value.length === 0) {
    skuList.value = [];
    return;
  }

  // 生成所有可能的组合
  const combinations = generateCombinations(selectedAttributes.value);
  
  skuList.value = combinations.map((combination, index) => {
    // 生成SKU：mastersku-规格值1-规格值2-规格值3
    const skuParts = [masterSku.value];
    combination.forEach((attr) => {
      skuParts.push(attr.name.replace(/\s+/g, '').toUpperCase()); // 去除空格并转大写
    });
    const generatedSku = skuParts.join('-');

    const sku: SkuItem = {
      salesPrice: 0,
      priceUnit: 'CNY',
      discountPrice: 0,
      discountUnit: 'CNY',
      inventory: 0,
      inventoryUnit: 'PCS',
      weight: 0,
      weightUnit: 'KG',
      length: 0,
      width: 0,
      height: 0,
      dimensionUnit: 'CM',
      sku: generatedSku,
      status: 'active'
    };

    // 添加规格属性
    combination.forEach((attr, attrIndex) => {
      const attributeType = selectedAttributes.value[attrIndex].type;
      sku[attributeType] = attr.name;
      if (attr.color) {
        sku[attributeType + '_color'] = attr.color;
      }
    });

    return sku;
  });
  
  // 调试信息
  console.log('Generated SKU List:', skuList.value);
  console.log('Selected Attributes:', selectedAttributes.value);
  console.log('Attributes to group (excluding last):', selectedAttributes.value.slice(0, -1).map(attr => attr.type));
  console.log('Last attribute (no grouping):', selectedAttributes.value[selectedAttributes.value.length - 1]?.type);
};

const generateCombinations = (attributes: AttributeConfig[]): AttributeValue[][] => {
  if (attributes.length === 0) return [];
  if (attributes.length === 1) return attributes[0].values.map(v => [v]);

  const result: AttributeValue[][] = [];
  const firstAttribute = attributes[0];
  const restCombinations = generateCombinations(attributes.slice(1));

  firstAttribute.values.forEach(value => {
    restCombinations.forEach(restCombination => {
      result.push([value, ...restCombination]);
    });
  });

  return result;
};

// 处理表格行合并的方法
const handleSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  // 只对属性列进行合并处理
  const attributeType = column.property;
  
  if (selectedAttributes.value.some(attr => attr.type === attributeType)) {
    const rowSpan = row._rowSpan?.[attributeType];
    
    if (rowSpan !== undefined) {
      return {
        rowspan: rowSpan,
        colspan: rowSpan === 0 ? 0 : 1
      };
    }
  }
  
  // 其他列不合并
  return {
    rowspan: 1,
    colspan: 1
  };
};

// 颜色名称映射
const getColorName = (hex: string): string => {
  const colorMap: { [key: string]: string } = {
    '#ffffff': 'White',
    '#000000': 'Black',
    '#ff0000': 'Red',
    '#00ff00': 'Lime',
    '#0000ff': 'Blue',
    '#ffff00': 'Yellow',
    '#ff00ff': 'Magenta',
    '#00ffff': 'Cyan',
    '#ffa500': 'Orange',
    '#800080': 'Purple',
    '#ffc0cb': 'Pink',
    '#a52a2a': 'Brown',
    '#808080': 'Gray',
    '#c0c0c0': 'Silver',
    '#ffd700': 'Gold',
    '#008000': 'Green',
    '#000080': 'Navy',
    '#800000': 'Maroon',
    '#ff6b6b': 'Light Red',
    '#4ecdc4': 'Teal',
    '#45b7d1': 'Sky Blue',
    '#96ceb4': 'Mint',
    '#feca57': 'Amber',
    '#ff9ff3': 'Light Pink',
    '#54a0ff': 'Bright Blue',
    '#5f27cd': 'Deep Purple',
    '#00d2d3': 'Turquoise',
    '#ff9f43': 'Peach',
    '#10ac84': 'Emerald',
    '#ee5a24': 'Vermillion',
    '#0984e3': 'Ocean Blue',
    '#6c5ce7': 'Lavender',
    '#a29bfe': 'Periwinkle',
    '#fd79a8': 'Rose',
    '#fdcb6e': 'Mustard',
    '#6c5ce7': 'Violet',
    '#e17055': 'Coral',
    '#00b894': 'Mint Green',
    '#2d3436': 'Charcoal'
  };
  
  // 标准化颜色值格式
  const normalizedHex = hex.toLowerCase().startsWith('#') ? hex.toLowerCase() : `#${hex.toLowerCase()}`;
  
  // 直接匹配
  if (colorMap[normalizedHex]) {
    return colorMap[normalizedHex];
  }
  
  // 如果没有精确匹配，尝试找到最接近的颜色
  const rgb = hexToRgb(normalizedHex);
  if (rgb) {
    return getClosestColorName(rgb);
  }
  
  // 如果都没有匹配，返回颜色名称而不是色值
  return `Custom Color`;
};

// 十六进制转RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// 获取最接近的颜色名称
const getClosestColorName = (targetRgb: {r: number, g: number, b: number}): string => {
  const colorList = [
    { name: 'Red', r: 255, g: 0, b: 0 },
    { name: 'Green', r: 0, g: 128, b: 0 },
    { name: 'Blue', r: 0, g: 0, b: 255 },
    { name: 'Yellow', r: 255, g: 255, b: 0 },
    { name: 'Orange', r: 255, g: 165, b: 0 },
    { name: 'Purple', r: 128, g: 0, b: 128 },
    { name: 'Pink', r: 255, g: 192, b: 203 },
    { name: 'Brown', r: 165, g: 42, b: 42 },
    { name: 'Gray', r: 128, g: 128, b: 128 },
    { name: 'Black', r: 0, g: 0, b: 0 },
    { name: 'White', r: 255, g: 255, b: 255 }
  ];
  
  let closestColor = colorList[0];
  let minDistance = calculateColorDistance(targetRgb, closestColor);
  
  for (const color of colorList) {
    const distance = calculateColorDistance(targetRgb, color);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color;
    }
  }
  
  return closestColor.name;
};

// 计算颜色距离
const calculateColorDistance = (color1: {r: number, g: number, b: number}, color2: {r: number, g: number, b: number}): number => {
  const rDiff = color1.r - color2.r;
  const gDiff = color1.g - color2.g;
  const bDiff = color1.b - color2.b;
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
};

// 颜色变化处理
const onColorChange = (attributeIndex: number, valueIndex: number, color: string) => {
  const value = selectedAttributes.value[attributeIndex].values[valueIndex];
  if (!value.name || value.name === getColorName(value.color || '')) {
    value.name = getColorName(color);
  }
  generateSkuList();
};

// 删除SKU行
const deleteSkuRow = (index: number) => {
  if (skuList.value.length <= 1) {
    return; // 至少保留一行
  }
  skuList.value.splice(index, 1);
  console.log(`Deleted SKU row at index ${index}, remaining ${skuList.value.length} rows`);
};

const addColorOption = () => {
  colorOptions.value.push({ name: '', hex: '#ffffff' });
  updateParent();
};

const removeColorOption = (index: number) => {
  colorOptions.value.splice(index, 1);
  updateParent();
};

const addStyleOption = () => {
  showStyleInput.value = true;
  newStyleName.value = '';
};

const confirmStyleAdd = () => {
  if (newStyleName.value.trim()) {
    styleOptions.value.push(newStyleName.value.trim());
    updateParent();
  }
  showStyleInput.value = false;
  newStyleName.value = '';
};

const removeStyleOption = (index: number) => {
  styleOptions.value.splice(index, 1);
  updateParent();
};

const searchProducts = async (query: string) => {
  if (!query) {
    availableProducts.value = [];
    return;
  }
  
  productSearchLoading.value = true;
  
  // 模拟产品搜索 - 扩展的产品数据
  setTimeout(() => {
    const mockProducts = [
      { sku: 'TS001', name: 'Basic Cotton T-Shirt', price: 29.99 },
      { sku: 'TS002', name: 'Premium Polo Shirt', price: 49.99 },
      { sku: 'TS003', name: 'Graphic Print Tee', price: 34.99 },
      { sku: 'JN001', name: 'Classic Denim Jeans', price: 79.99 },
      { sku: 'JN002', name: 'Skinny Fit Jeans', price: 89.99 },
      { sku: 'JN003', name: 'Distressed Jeans', price: 99.99 },
      { sku: 'SN001', name: 'Running Sneakers', price: 129.99 },
      { sku: 'SN002', name: 'Canvas Shoes', price: 69.99 },
      { sku: 'SN003', name: 'High-top Sneakers', price: 149.99 },
      { sku: 'AC001', name: 'Baseball Cap', price: 24.99 },
      { sku: 'AC002', name: 'Beanie Hat', price: 19.99 },
      { sku: 'AC003', name: 'Sunglasses', price: 79.99 },
      { sku: 'JK001', name: 'Leather Jacket', price: 199.99 },
      { sku: 'JK002', name: 'Denim Jacket', price: 89.99 },
      { sku: 'JK003', name: 'Bomber Jacket', price: 119.99 },
      { sku: 'SW001', name: 'Hoodie Sweatshirt', price: 59.99 },
      { sku: 'SW002', name: 'Zip-up Hoodie', price: 69.99 },
      { sku: 'SW003', name: 'Crewneck Sweater', price: 79.99 },
      { sku: 'DR001', name: 'Summer Dress', price: 89.99 },
      { sku: 'DR002', name: 'Casual Midi Dress', price: 99.99 },
      { sku: 'SK001', name: 'Denim Skirt', price: 49.99 },
      { sku: 'SK002', name: 'Pleated Skirt', price: 59.99 },
      { sku: 'BG001', name: 'Canvas Backpack', price: 79.99 },
      { sku: 'BG002', name: 'Leather Handbag', price: 149.99 },
      { sku: 'BG003', name: 'Crossbody Bag', price: 69.99 }
    ];
    
    availableProducts.value = mockProducts.filter(product => 
      product.sku.toLowerCase().includes(query.toLowerCase()) ||
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    productSearchLoading.value = false;
  }, 500);
};

const getProductName = (sku: string) => {
  const product = availableProducts.value.find(p => p.sku === sku);
  return product ? product.name : sku;
};

const getProductPrice = (sku: string) => {
  const product = availableProducts.value.find(p => p.sku === sku);
  return product ? product.price.toFixed(2) : '0.00';
};

const updateBundleQuantity = (sku: string, quantity: number) => {
  bundleQuantities.value[sku] = quantity;
  updateParent();
};

const removeBundleProduct = (sku: string) => {
  const index = selectedBundleProducts.value.indexOf(sku);
  if (index > -1) {
    selectedBundleProducts.value.splice(index, 1);
    delete bundleQuantities.value[sku];
    // 表格数据会通过watch自动更新
  }
};

const addQuickCombo = (comboType: string) => {
  // 清空当前选择
  selectedBundleProducts.value = [];
  bundleQuantities.value = {};
  
  // 预先加载一些产品到 availableProducts
  const allProducts = [
    { sku: 'TS001', name: 'Basic Cotton T-Shirt', price: 29.99 },
    { sku: 'TS002', name: 'Premium Polo Shirt', price: 49.99 },
    { sku: 'JN001', name: 'Classic Denim Jeans', price: 79.99 },
    { sku: 'SN001', name: 'Running Sneakers', price: 129.99 },
    { sku: 'AC001', name: 'Baseball Cap', price: 24.99 },
    { sku: 'BG001', name: 'Canvas Backpack', price: 79.99 },
    { sku: 'AC003', name: 'Sunglasses', price: 79.99 }
  ];
  
  availableProducts.value = allProducts;
  
  let comboProducts: string[] = [];
  let quantities: Record<string, number> = {};
  
  switch (comboType) {
    case 'casual':
      comboProducts = ['TS001', 'JN001'];
      quantities = { 'TS001': 1, 'JN001': 1 };
      break;
    case 'complete':
      comboProducts = ['TS002', 'JN001', 'SN001'];
      quantities = { 'TS002': 1, 'JN001': 1, 'SN001': 1 };
      break;
    case 'accessories':
      comboProducts = ['AC001', 'BG001', 'AC003'];
      quantities = { 'AC001': 1, 'BG001': 1, 'AC003': 1 };
      break;
  }
  
  selectedBundleProducts.value = comboProducts;
  bundleQuantities.value = quantities;
  updateParent();
};

// 单规格定价更新方法
const updateSinglePricing = () => {
  updateParent();
};

const updateParent = () => {
  nextTick(() => {
    const value = {
      sellingForm: selectedForm.value,
      dimensions: selectedDimensions.value,
      primaryDimension: primaryDimension.value,
      colorOptions: colorOptions.value,
      sizeOptions: selectedSizes.value,
      styleOptions: styleOptions.value,
      bundleProducts: selectedBundleProducts.value.map(sku => ({
        sku,
        quantity: bundleQuantities.value[sku] || 1
      })),
      singleVariant: singleVariant.value
    };
    emit('update:modelValue', value);
  });
};

// 初始化
const initialize = () => {
  if (props.modelValue) {
    selectedForm.value = props.modelValue.sellingForm || 'single';
    selectedDimensions.value = props.modelValue.dimensions || [];
    colorOptions.value = props.modelValue.colorOptions || [];
    selectedSizes.value = props.modelValue.sizeOptions || [];
    styleOptions.value = props.modelValue.styleOptions || [];
    
    if (props.modelValue.bundleProducts) {
      selectedBundleProducts.value = props.modelValue.bundleProducts.map(p => p.sku);
      bundleQuantities.value = {};
      props.modelValue.bundleProducts.forEach(p => {
        bundleQuantities.value[p.sku] = p.quantity;
      });
    }
  }
  // 不要在初始化时调用 updateParent，避免循环更新
};

// 简化的监听器，避免循环更新
watch(() => selectedBundleProducts.value, (newSkus) => {
  // 为新添加的产品设置默认数量，但不触发更新
  newSkus.forEach(sku => {
    if (!bundleQuantities.value[sku]) {
      bundleQuantities.value[sku] = 1;
    }
  });
  
  // 更新组合品表格数据
  updateBundleTableData();
}, { deep: true });

// 更新组合品表格数据
const updateBundleTableData = () => {
  bundleTableData.value = selectedBundleProducts.value.map(sku => {
    const product = availableProducts.value.find(p => p.sku === sku);
    return {
      sku,
      name: product?.name || `Product ${sku}`,
      quantity: bundleQuantities.value[sku] || 1,
      // 销售价格和折扣价格都使用聚合设置
      salesPrice: bundleAggregateSettings.value.salesPrice,
      priceUnit: bundleAggregateSettings.value.priceUnit,
      discountPrice: bundleAggregateSettings.value.discountPrice,
      discountUnit: bundleAggregateSettings.value.discountUnit,
      inventoryType: bundleAggregateSettings.value.inventoryType,
      weight: bundleAggregateSettings.value.weight,
      weightUnit: bundleAggregateSettings.value.weightUnit,
      length: bundleAggregateSettings.value.length,
      width: bundleAggregateSettings.value.width,
      height: bundleAggregateSettings.value.height,
      dimensionUnit: bundleAggregateSettings.value.dimensionUnit,
      splitShipping: bundleAggregateSettings.value.splitShipping,
      status: bundleAggregateSettings.value.status
    };
  });
};

// 组合品表格行合并方法
const handleBundleSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  // 需要聚合的列索引
  // 列索引：Product(0), Unit Price(1), Quantity(2), Sales Price(3), Discount Price(4), Inventory Type(5), Weight(6), Dimensions(7), Split Shipping(8), Actions(9)
  // 聚合列：Sales Price(3), Discount Price(4), Inventory Type(5), Weight(6), Dimensions(7), Split Shipping(8)
  const aggregateColumns = [3, 4, 5, 6, 7, 8];
  
  if (aggregateColumns.includes(columnIndex)) {
    if (rowIndex === 0) {
      // 第一行显示，合并所有行
      return {
        rowspan: bundleTableData.value.length,
        colspan: 1
      };
    } else {
      // 其他行隐藏
      return {
        rowspan: 0,
        colspan: 0
      };
    }
  }
  
  // 其他列正常显示
  return {
    rowspan: 1,
    colspan: 1
  };
};

// 加载预设组合
const loadPresetBundle = (products: string[]) => {
  selectedBundleProducts.value = [...products];
  // 为每个产品设置默认数量
  products.forEach(sku => {
    bundleQuantities.value[sku] = 1;
  });
};

// 监听聚合设置变化，同步到表格数据
watch(() => bundleAggregateSettings.value, () => {
  updateBundleTableData();
}, { deep: true });

// 批量应用数量设置
const applyBatchQuantity = () => {
  selectedBundleProducts.value.forEach(sku => {
    bundleQuantities.value[sku] = bundleBatchQuantity.value;
  });
  updateBundleTableData();
};

// 移除可能导致循环的监听器
// watch(() => selectedSizes.value, updateParent, { deep: true });
// watch(() => props.modelValue, initialize, { immediate: true, deep: false });

// 移除重复的初始化调用，避免循环更新
// initialize();

// 确保首次加载时正确初始化
onMounted(() => {
  // 确保默认选中 single
  if (!selectedForm.value) {
    selectedForm.value = 'single';
  }
  console.log('Component mounted, selectedForm:', selectedForm.value);
});
</script>

<style scoped lang="scss">
.sales-attributes {
  width: 100%;
}

.selling-form-section {
  margin-bottom: 24px;
  
  .form-header {
    margin-bottom: 16px;
    
    .form-header-title {
      font-size: 16px;
      font-weight: 600;
      color: #e2e8f0;
      margin: 0;
    }
  }
  
  .selling-form-radio-group {
    .form-radio-group {
      display: flex;
      gap: 12px;
      
      .form-radio-button {
        flex: 1;
        
        :deep(.el-radio-button__inner) {
          width: 100%;
          padding: 12px 16px;
          background: #2d3748;
          border-color: #4a5568;
          color: #e2e8f0;
          transition: all 0.3s ease;
          
          .radio-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            
            .radio-icon {
              font-size: 18px;
            }
            
            .radio-label {
              font-weight: 500;
            }
          }
          
          &:hover {
            background: #374151;
            border-color: #48bb78;
          }
        }
        
        :deep(.el-radio-button__input:checked + .el-radio-button__inner) {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%) !important;
          border-color: #48bb78 !important;
          color: white !important;
          box-shadow: 0 2px 8px rgba(72, 187, 120, 0.3) !important;
          
          .radio-content {
            .radio-icon {
              color: white !important;
            }
            
            .radio-label {
              color: white !important;
              font-weight: 600 !important;
            }
          }
        }
      }
    }
  }
}

.selling-form-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.form-card {
  background: #2d3748;
  border: 2px solid #4a5568;
  border-radius: 16px;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: #63b3ed;
    transform: translateY(-4px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
  }
  
  &.active {
    border-color: #63b3ed;
    background: linear-gradient(135deg, #2d3748 0%, #374151 100%);
    box-shadow: 0 8px 30px rgba(99, 179, 237, 0.3);
    
    .card-header {
      background: linear-gradient(135deg, #63b3ed, #4299e1);
      
      .card-icon {
        background: rgba(255, 255, 255, 0.2);
        
        .el-icon {
          color: #ffffff;
        }
      }
      
      .card-radio .el-radio {
        :deep(.el-radio__input.is-checked) {
          .el-radio__inner {
            background-color: #ffffff;
            border-color: #ffffff;
            
            &::after {
              background-color: #63b3ed;
            }
          }
        }
      }
    }
    
    .form-badge {
      background: #63b3ed;
      color: #ffffff;
    }
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    background: #374151;
    
    .card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      background: rgba(99, 179, 237, 0.2);
      border-radius: 12px;
      
      .el-icon {
        font-size: 22px;
        color: #63b3ed;
      }
    }
    
    .card-radio {
      .el-radio {
        :deep(.el-radio__input) {
          .el-radio__inner {
            width: 18px;
            height: 18px;
            border: 2px solid #a0aec0;
            
            &::after {
              width: 6px;
              height: 6px;
            }
          }
        }
      }
    }
  }
  
  .card-content {
    padding: 24px;
    
    .card-title {
      font-size: 18px;
      font-weight: 700;
      color: #e2e8f0;
      margin: 0 0 8px 0;
    }
    
    .card-description {
      font-size: 14px;
      color: #a0aec0;
      line-height: 1.6;
      margin: 0 0 20px 0;
    }
    
    .form-features {
      .feature-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #cbd5e0;
          
          .feature-icon {
            font-size: 14px;
            color: #48bb78;
            flex-shrink: 0;
          }
        }
      }
    }
  }
  
  .card-footer {
    padding: 16px 24px;
    border-top: 1px solid #4a5568;
    text-align: center;
    
    .form-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      
      &.badge-single {
        background: #48bb78;
        color: #ffffff;
      }
      
      &.badge-multi {
        background: #ed8936;
        color: #ffffff;
      }
      
      &.badge-bundle {
        background: #9f7aea;
        color: #ffffff;
      }
    }
  }
}

.variant-settings {
  .settings-header {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 16px;
    font-weight: 600;
    color: #e2e8f0;
    margin-bottom: 20px;
    padding: 16px 20px;
    background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
    border-radius: 8px;
    border: 1px solid #4a5568;
    
    .el-icon {
      color: #63b3ed;
      font-size: 18px;
    }
  }
  
  .settings-content {
    padding: 0 20px;
  }
}

.dimension-selector {
  margin-bottom: 32px;
  
  .dimension-title {
    font-size: 14px;
    font-weight: 600;
    color: #e2e8f0;
    margin-bottom: 16px;
  }
}

.dimension-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.dimension-card {
  padding: 16px;
  background: #374151;
  border: 1px solid #4a5568;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &:hover {
    border-color: #63b3ed;
    background: #4a5568;
  }
  
  &.active {
    border-color: #63b3ed;
    background: #4a5568;
  }
  
  &.primary {
    border-color: #f6ad55;
    background: linear-gradient(135deg, #4a5568 0%, #553c3c 100%);
  }
  
  .dimension-icon {
    font-size: 20px;
    color: #63b3ed;
  }
  
  .dimension-info {
    flex: 1;
    
    .dimension-name {
      font-size: 14px;
      font-weight: 500;
      color: #e2e8f0;
      margin-bottom: 4px;
    }
    
    .dimension-desc {
      font-size: 12px;
      color: #a0aec0;
    }
  }
  
  .dimension-status {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.options-configuration {
  .config-title {
    font-size: 14px;
    font-weight: 600;
    color: #e2e8f0;
    margin-bottom: 20px;
  }
}

.dimension-config {
  margin-bottom: 24px;
  
  .config-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #e2e8f0;
    margin-bottom: 12px;
    
    .el-icon {
      color: #63b3ed;
    }
  }
}

.color-options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.color-option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #4a5568;
  border-radius: 6px;
}

.size-options {
  .size-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

.style-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  
  .style-tag {
    margin: 0;
  }
  
  .style-input {
    width: 120px;
  }
}

.bundle-products {
  .bundle-title {
    font-size: 14px;
    font-weight: 600;
    color: #e2e8f0;
    margin-bottom: 12px;
  }
  
  .product-selector {
    margin-bottom: 20px;
    
    .quick-add-section {
      margin-top: 16px;
      padding: 16px;
      background: #374151;
      border-radius: 8px;
      border: 1px solid #4a5568;
      
      .quick-add-title {
        font-size: 13px;
        font-weight: 500;
        color: #cbd5e0;
        margin-bottom: 12px;
      }
      
      .quick-add-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    }
  }
}

.product-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  
  .product-info {
    display: flex;
    flex-direction: column;
    
    .product-sku {
      font-weight: 600;
      color: #63b3ed;
      font-size: 12px;
    }
    
    .product-name {
      color: #e2e8f0;
      font-size: 14px;
    }
  }
  
  .product-price {
    font-weight: 600;
    color: #48bb78;
  }
}

.bundle-list {
  .bundle-list-title {
    font-size: 14px;
    font-weight: 600;
    color: #e2e8f0;
    margin-bottom: 12px;
  }
}

.bundle-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.bundle-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #4a5568;
  border-radius: 6px;
  
  .item-info {
    flex: 1;
    
    .item-sku {
      font-size: 12px;
      color: #63b3ed;
      font-weight: 600;
    }
    
    .item-name {
      font-size: 14px;
      color: #e2e8f0;
    }
  }
  
  .item-quantity {
    width: 80px;
  }
  
  .item-price {
    font-weight: 600;
    color: #48bb78;
    min-width: 60px;
  }
}

.bundle-summary {
  padding: 16px;
  background: #2d3748;
  border-radius: 8px;
  border: 1px solid #4a5568;
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    
    &:last-child {
      margin-bottom: 0;
      font-weight: 600;
      font-size: 16px;
      padding-top: 8px;
      border-top: 1px solid #4a5568;
    }
    
    .summary-label {
      color: #a0aec0;
    }
    
    .summary-value {
      color: #e2e8f0;
    }
  }
}

.config-alert {
  margin-bottom: 24px;
}

.pricing-section,
.inventory-section,
.status-section {
  margin-bottom: 32px;
  
  .section-subtitle {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #e2e8f0;
    margin-bottom: 16px;
    padding: 12px 16px;
    background: #374151;
    border-radius: 6px;
    border-left: 3px solid #63b3ed;
    
    .el-icon {
      color: #63b3ed;
    }
  }
}

.pricing-grid,
.inventory-grid,
.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.price-item,
.inventory-item,
.status-item {
  .price-label,
  .inventory-label,
  .status-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #cbd5e0;
    margin-bottom: 6px;
  }
}

.discount-section {
  margin-top: 20px;
  padding: 16px;
  background: #374151;
  border-radius: 8px;
  border: 1px solid #4a5568;
  
  .discount-header {
    margin-bottom: 16px;
  }
  
  .discount-config {
    .discount-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
      
      .discount-item {
        .discount-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #cbd5e0;
          margin-bottom: 6px;
        }
      }
    }
    
    .discount-preview {
      padding: 12px;
      background: #2d3748;
      border-radius: 6px;
      border: 1px solid #4a5568;
      
      .preview-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .preview-label {
          font-size: 13px;
          color: #a0aec0;
        }
        
        .preview-value {
          font-size: 14px;
          font-weight: 600;
          color: #e2e8f0;
          
          &.savings {
            color: #48bb78;
          }
        }
      }
    }
  }
}

// 单规格定价样式
.single-pricing-section {
  .pricing-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
    
    .pricing-card {
      background: #2d3748;
      border: 2px solid #4a5568;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #63b3ed;
        box-shadow: 0 4px 20px rgba(99, 179, 237, 0.15);
      }
      
      &.primary-card {
        border-color: #48bb78;
        
        .card-header {
          background: linear-gradient(135deg, #48bb78, #38a169);
        }
        
        &:hover {
          border-color: #48bb78;
          box-shadow: 0 4px 20px rgba(72, 187, 120, 0.2);
        }
      }
      
      &.discount-card {
        border-color: #ed8936;
        
        .card-header {
          background: linear-gradient(135deg, #ed8936, #dd6b20);
        }
        
        &:hover {
          border-color: #ed8936;
          box-shadow: 0 4px 20px rgba(237, 137, 54, 0.2);
        }
      }
      
      &.inventory-card {
        border-color: #63b3ed;
        
        .card-header {
          background: linear-gradient(135deg, #63b3ed, #4299e1);
        }
        
        &:hover {
          border-color: #63b3ed;
          box-shadow: 0 4px 20px rgba(99, 179, 237, 0.2);
        }
      }
      
      .card-header {
        padding: 16px 20px;
        background: #374151;
        display: flex;
        align-items: center;
        gap: 12px;
        
        .card-icon {
          font-size: 20px;
          color: #ffffff;
        }
        
        .card-title {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }
      }
      
      .card-body {
        padding: 20px;
        
        &.disabled {
          opacity: 0.6;
          
          .disabled-text {
            font-size: 14px;
            color: #a0aec0;
            text-align: center;
            margin: 20px 0;
            font-style: italic;
          }
        }
        
        .card-desc {
          font-size: 13px;
          color: #a0aec0;
          margin: 8px 0 0 0;
        }
        
        .price-input-group {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
          
          .currency-selector {
            flex-shrink: 0;
          }
          
          .price-input {
            flex: 1;
            
            .large-price-input {
              :deep(.el-input-number__increase),
              :deep(.el-input-number__decrease) {
                display: none !important;
              }
              
              :deep(.el-input__inner) {
                background-color: #374151;
                border-color: #4a5568;
                color: #e2e8f0;
                font-size: 18px;
                font-weight: 600;
                text-align: center;
                
                &:focus {
                  border-color: #63b3ed;
                }
              }
            }
          }
        }
        
        .discount-config {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
          
          .discount-type {
            :deep(.el-radio-button__inner) {
              background-color: #374151;
              border-color: #4a5568;
              color: #e2e8f0;
              
              &:hover {
                color: #ffffff;
              }
            }
            
            :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
              background-color: #ed8936;
              border-color: #ed8936;
              color: #ffffff;
            }
          }
        }
        
        .discount-preview {
          padding: 12px;
          background: #374151;
          border-radius: 8px;
          border: 1px solid #4a5568;
          
          .final-price, .savings {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            
            &:last-child {
              margin-bottom: 0;
            }
            
            .label {
              font-size: 13px;
              color: #a0aec0;
            }
            
            .value {
              font-size: 14px;
              font-weight: 600;
              color: #e2e8f0;
            }
          }
          
          .savings .value {
            color: #48bb78;
          }
        }
        
        .cost-inventory-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 16px;
          
          .input-group {
            .input-label {
              display: block;
              font-size: 13px;
              font-weight: 500;
              color: #cbd5e0;
              margin-bottom: 6px;
            }
          }
        }
        
        .profit-display {
          padding: 12px;
          background: #1a202c;
          border-radius: 8px;
          border: 1px solid #2d3748;
          
          .profit-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
            
            &:last-child {
              margin-bottom: 0;
            }
            
            .profit-label {
              font-size: 13px;
              color: #a0aec0;
            }
            
            .profit-value {
              font-size: 14px;
              font-weight: 600;
              
              &.positive {
                color: #48bb78;
              }
              
              &.negative {
                color: #f56565;
              }
            }
          }
        }
      }
    }
  }
  
  .additional-settings {
    padding: 20px;
    background: #2d3748;
    border: 1px solid #4a5568;
    border-radius: 12px;
    
    .settings-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
      
      .setting-item {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .setting-label {
          font-size: 14px;
          font-weight: 500;
          color: #cbd5e0;
          white-space: nowrap;
        }
      }
    }
  }
}

// 规格配置样式
.spec-section {
  margin-bottom: 32px;
  
  .spec-config {
    .spec-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding: 12px 16px;
      background: #374151;
      border-radius: 6px;
      
      .spec-title {
        font-size: 13px;
        color: #cbd5e0;
      }
    }
    
    .spec-empty {
      text-align: center;
      padding: 40px 20px;
      background: #2d3748;
      border: 2px dashed #4a5568;
      border-radius: 12px;
      
      .empty-icon {
        font-size: 48px;
        color: #718096;
        margin-bottom: 16px;
      }
      
      .empty-text {
        font-size: 16px;
        font-weight: 500;
        color: #e2e8f0;
        margin: 0 0 8px 0;
      }
      
      .empty-desc {
        font-size: 14px;
        color: #a0aec0;
        margin: 0;
      }
    }
    
    .spec-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      
      .spec-item {
        padding: 16px;
        background: #2d3748;
        border: 1px solid #4a5568;
        border-radius: 8px;
        
        .spec-row {
          display: grid;
          grid-template-columns: 1fr 2fr 60px;
          gap: 12px;
          align-items: center;
        }
      }
    }
  }
}

// 变体表格样式
.variants-table-section {
  margin-bottom: 32px;
  
  .section-subtitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .table-actions {
      display: flex;
      gap: 8px;
    }
  }
  
  .variants-table {
    margin-top: 16px;
    background: #2d3748;
    border-radius: 8px;
    overflow: hidden;
    
    .variants-data-table {
      background: transparent;
      
      :deep(.el-table__header) {
        background-color: #374151;
        
        th {
          background-color: #374151;
          color: #e2e8f0;
          border-bottom: 1px solid #4a5568;
          font-weight: 600;
        }
      }
      
      :deep(.el-table__body) {
        tr {
          background-color: #2d3748;
          
          &:hover {
            background-color: #374151;
          }
          
          td {
            border-bottom: 1px solid #4a5568;
            color: #e2e8f0;
          }
        }
      }
      
      :deep(.el-table__fixed) {
        background-color: #2d3748;
      }
    }
    
    .spec-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      
      .spec-tag {
        background: #4a5568;
        border-color: #63b3ed;
        color: #e2e8f0;
        font-size: 12px;
      }
    }
    
    .dimension-inputs {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #a0aec0;
    }
  }
}

// Dark theme for form controls
:deep(.el-radio-button__inner) {
  background-color: #374151;
  border-color: #4a5568;
  color: #e2e8f0;
  
  &:hover {
    background-color: #4a5568;
    border-color: #63b3ed;
  }
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #63b3ed;
  border-color: #63b3ed;
  color: white;
}

:deep(.el-checkbox-button__inner) {
  background-color: #374151;
  border-color: #4a5568;
  color: #e2e8f0;
  
  &:hover {
    background-color: #4a5568;
    border-color: #63b3ed;
  }
}

:deep(.el-checkbox-button.is-checked .el-checkbox-button__inner) {
  background-color: #63b3ed;
  border-color: #63b3ed;
  color: white;
}

:deep(.el-select) {
  .el-input__wrapper {
    background-color: #2d3748;
    border: 1px solid #4a5568;
    
    &:hover {
      border-color: #63b3ed;
    }
    
    &.is-focus {
      border-color: #63b3ed;
      box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.2);
    }
    
    .el-input__inner {
      color: #e2e8f0;
    }
  }
}

:deep(.el-input__wrapper) {
  background-color: #2d3748;
  border: 1px solid #4a5568;
  
  &:hover {
    border-color: #63b3ed;
  }
  
  &.is-focus {
    border-color: #63b3ed;
    box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.2);
  }
  
  .el-input__inner {
    color: #e2e8f0;
    
    &::placeholder {
      color: #718096;
    }
  }
}

:deep(.el-input-number) {
  .el-input__wrapper {
    background-color: #2d3748;
    border: 1px solid #4a5568;
  }
  
  .el-input-number__decrease,
  .el-input-number__increase {
    display: none !important;
  }
}

:deep(.el-color-picker__trigger) {
  background-color: #2d3748;
  border: 1px solid #4a5568;
  
  &:hover {
    border-color: #63b3ed;
  }
}

:deep(.el-tag) {
  background-color: #4a5568;
  border-color: #63b3ed;
  color: #e2e8f0;
  
  &.el-tag--success {
    background-color: #48bb78;
    border-color: #48bb78;
    color: white;
  }
}

:deep(.el-button.is-text) {
  background-color: transparent;
  border-color: transparent;
  
  &.el-button--primary {
    color: #63b3ed;
    
    &:hover {
      background-color: rgba(99, 179, 237, 0.1);
    }
  }
  
  &.el-button--danger {
    color: #f56565;
    
    &:hover {
      background-color: rgba(245, 101, 101, 0.1);
    }
  }
}

// 单规格表格样式 - 使用 el-table
.single-variant-table {
  margin-top: 16px;
  
  :deep(.el-table) {
    background-color: #2d3748 !important;
    color: #e2e8f0 !important;
  }
  
  :deep(.el-table__header) {
    background-color: #374151 !important;
    
    th {
      background-color: #374151 !important;
      border-color: #4a5568 !important;
      color: #e2e8f0 !important;
      font-weight: 600 !important;
    }
  }
  
  :deep(.el-table__body) {
    tr {
      background-color: #2d3748 !important;
      
      &:hover td {
        background-color: #374151 !important;
      }
      
      td {
        border-color: #4a5568 !important;
        color: #e2e8f0 !important;
        background-color: #2d3748 !important;
      }
    }
    
    .el-table__row--striped td {
      background-color: #374151 !important;
    }
  }
  
  :deep(.el-table--border) {
    border-color: #4a5568 !important;
    
    &::before {
      background-color: #4a5568 !important;
    }
    
    &::after {
      background-color: #4a5568 !important;
    }
  }
  
  .product-info {
    text-align: left;
    
    .product-name {
      font-size: 14px;
      font-weight: 600;
      color: #e2e8f0;
      margin-bottom: 4px;
    }
    
    .product-sku {
      font-size: 12px;
      color: #a0aec0;
    }
  }
  
  .input-group {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    
    // 价格组样式
    &.price-group {
      gap: 8px;
    
    .el-input-number {
        :deep(.el-input__inner) {
          font-weight: 600;
          color: #48bb78;
        }
      }
    }
    
    // 折扣价格组样式
    &.discount-group {
      gap: 8px;
      
      .el-input-number {
        :deep(.el-input__inner) {
          font-weight: 600;
          color: #ed8936;
        }
      }
    }
    
    // 库存组样式
    &.inventory-group {
      gap: 8px;
      align-items: center;
      flex-wrap: nowrap;
      
      .el-input-number {
        :deep(.el-input__inner) {
          font-weight: 600;
          color: #63b3ed;
        }
      }
      
      &.compact {
        gap: 4px;
        justify-content: space-between;
        flex-wrap: nowrap !important;
        min-width: 180px;
        
        .el-input-number {
          flex: 1 1 60%;
          min-width: 80px !important;
          max-width: 60% !important;
      
      :deep(.el-input__inner) {
        background: #4a5568;
        border-color: #4a5568;
            color: #63b3ed;
        text-align: center;
            font-weight: 600;
            padding: 0 6px;
        
        &:focus {
          border-color: #48bb78;
        }
      }
      
      :deep(.el-input-number__increase),
      :deep(.el-input-number__decrease) {
            display: none !important;
          }
        }
        
        .el-select {
          flex: 0 0 38%;
          min-width: 70px !important;
          max-width: 38% !important;
          
          :deep(.el-input__inner) {
            font-weight: 600;
            color: #f6ad55;
            padding: 0 6px;
          }
        }
      }
    }
    
    // 重量组样式
    &.weight-group {
      gap: 8px;
      align-items: center;
      flex-wrap: nowrap;
      
      .el-input-number {
        :deep(.el-input__inner) {
          font-weight: 600;
          color: #9f7aea;
        }
      }
      
      &.compact {
        gap: 4px;
        justify-content: space-between;
        flex-wrap: nowrap !important;
        min-width: 180px;
        
        .el-input-number {
          flex: 1 1 60%;
          min-width: 80px !important;
          max-width: 60% !important;
          
          :deep(.el-input__inner) {
            background: #4a5568;
            border-color: #4a5568;
            color: #9f7aea;
            text-align: center;
            font-weight: 600;
            padding: 0 6px;
            
            &:focus {
              border-color: #48bb78;
            }
          }
          
          :deep(.el-input-number__increase),
          :deep(.el-input-number__decrease) {
            display: none !important;
          }
        }
        
        .el-select {
          flex: 0 0 38%;
          min-width: 70px !important;
          max-width: 38% !important;
          
          :deep(.el-input__inner) {
            font-weight: 600;
            color: #f6ad55;
            padding: 0 6px;
          }
        }
      }
    }
    
    .el-input-number {
      flex: 1;
      
      :deep(.el-input__inner) {
        background: #4a5568;
        border-color: #4a5568;
        color: #e2e8f0;
        text-align: center;
        
        &:focus {
          border-color: #48bb78;
        }
      }
      
      :deep(.el-input-number__increase),
      :deep(.el-input-number__decrease) {
        display: none !important;
      }
    }
    
    .el-select {
      flex-shrink: 0;
    }
    
    .unit {
      font-size: 11px;
      color: #a0aec0;
      font-weight: 500;
      min-width: 25px;
    }
  }
  
  .dimensions-group {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    min-width: 380px;
    flex-wrap: nowrap;
    
    &.enhanced {
      min-width: 420px;
      gap: 8px;
      flex-wrap: nowrap;
    
    .dimension-item {
        position: relative;
        
        .dim-label {
          position: absolute;
          top: -18px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          color: #a0aec0;
          font-weight: 600;
          background: #2d3748;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid #4a5568;
        }
      }
      
      .separator {
        font-size: 14px;
        color: #63b3ed;
        font-weight: 600;
        margin: 0 6px;
      }
    }
    
    &.compact {
      min-width: 380px;
      gap: 4px;
      flex-wrap: nowrap;
      justify-content: space-between;
      
      .el-input-number {
        flex-shrink: 1;
        
        :deep(.el-input__inner) {
          background: #4a5568;
          border-color: #4a5568;
          color: #e2e8f0;
          text-align: center;
          font-weight: 600;
          padding: 0 8px;
          
          &:focus {
            border-color: #48bb78;
          }
        }
        
        :deep(.el-input-number__increase),
        :deep(.el-input-number__decrease) {
          display: none !important;
        }
      }
      
      .separator {
        font-size: 12px;
        color: #63b3ed;
        font-weight: 600;
        margin: 0 2px;
        flex-shrink: 0;
      }
      
      .el-select {
        flex-shrink: 0;
        
        :deep(.el-input__inner) {
          font-weight: 600;
          color: #f6ad55;
        }
      }
    }
    
    .dimension-item {
      display: flex;
      align-items: center;
      gap: 2px;
      flex: 1;
      min-width: 75px;
      
      .el-input-number {
        width: 100%;
        
        :deep(.el-input__inner) {
          background: #4a5568;
          border-color: #4a5568;
          color: #e2e8f0;
          text-align: center;
          font-weight: 600;
          
          &:focus {
            border-color: #48bb78;
          }
        }
        
        :deep(.el-input-number__increase),
        :deep(.el-input-number__decrease) {
          display: none !important;
        }
      }
      
      .unit {
        font-size: 10px;
        color: #a0aec0;
        font-weight: 500;
      }
    }
    
    .separator {
      font-size: 12px;
      color: #a0aec0;
      margin: 0 4px;
      flex-shrink: 0;
    }
    
    .el-select {
      flex-shrink: 0;
      
      :deep(.el-input__inner) {
        font-weight: 600;
        color: #f6ad55;
      }
    }
  }
}

// 多规格配置样式
.sales-attributes-config {
  margin-bottom: 24px;
  
  .attribute-sections {
    .attribute-section {
      margin-bottom: 20px;
      padding: 16px;
      background: #2d3748;
      border-radius: 8px;
      border: 1px solid #4a5568;
      
      .section-header {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
      }
      
      .section-content {
        .attribute-values-horizontal {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          
          .value-item-horizontal {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: #1a202c;
            border-radius: 6px;
            border: 1px solid #4a5568;
            
            &:hover {
              border-color: #48bb78;
            }
          }
        }
      }
    }
    
    .add-attribute-section {
      margin-bottom: 20px;
    }
  }
  
  .attribute-cell {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    transition: all 0.2s ease;
    
    &.group-start {
      position: relative;
      background: rgba(72, 187, 120, 0.05);
      border-left: 3px solid #48bb78;
      
      .attribute-value {
        font-weight: 600;
        color: #48bb78;
      }
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #48bb78, transparent);
      }
    }
    
    .attribute-value {
      font-size: 13px;
      font-weight: 500;
      color: #e2e8f0;
      
      &:empty::after {
        content: '-';
        color: #718096;
        font-style: italic;
      }
    }
    
  }
  
  // 列标题样式
  .column-header {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .config-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    span {
      font-size: 16px;
      font-weight: 600;
      color: #e2e8f0;
    }
  }
  
  .attributes-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    
    .attribute-config {
      background: #2d3748;
      border: 2px solid #4a5568;
      border-radius: 12px;
      padding: 16px;
      
      .config-header {
        margin-bottom: 12px;
        
        :deep(.el-checkbox) {
          .el-checkbox__label {
            color: #e2e8f0;
            font-weight: 600;
          }
          
          .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: #48bb78;
            border-color: #48bb78;
          }
        }
      }
      
      .config-content {
        .color-options {
          .color-item {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            
            &:last-child {
              margin-bottom: 0;
            }
          }
          
          .add-option-btn {
            margin-top: 8px;
          }
        }
        
        .size-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          
          :deep(.el-checkbox-button__inner) {
            background: #4a5568;
            border-color: #4a5568;
            color: #e2e8f0;
            padding: 4px 8px;
            font-size: 12px;
            
            &:hover {
              background: #48bb78;
              border-color: #48bb78;
            }
          }
          
          :deep(.el-checkbox-button__input:checked + .el-checkbox-button__inner) {
            background: #48bb78;
            border-color: #48bb78;
            color: white;
          }
        }
        
        .style-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          
          .el-tag {
            background: #4a5568;
            border-color: #4a5568;
            color: #e2e8f0;
            
            &:hover {
              background: #48bb78;
              border-color: #48bb78;
            }
          }
        }
      }
    }
  }
}

// 变体表格样式
.variants-table-section {
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    span {
      font-size: 16px;
      font-weight: 600;
      color: #e2e8f0;
    }
    
    
    .table-actions {
      display: flex;
      gap: 8px;
    }
  }
  
  .batch-settings-area {
    margin-bottom: 20px;
    background: #1a202c;
    border: 1px solid #2d3748;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .batch-settings-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      background: linear-gradient(135deg, #2d3748 0%, #374151 100%);
      border-radius: 8px 8px 0 0;
      cursor: pointer;
      transition: background 0.2s ease;
      
      &:hover {
        background: linear-gradient(135deg, #374151 0%, #4a5568 100%);
      }
      
      .batch-title {
        font-size: 15px;
        font-weight: 600;
        color: #e2e8f0;
        display: flex;
        align-items: center;
        gap: 8px;
        
        &::before {
          content: "⚡";
          font-size: 16px;
        }
      }
      
      .el-button {
        padding: 6px;
        margin-left: 8px;
        border-radius: 4px;
        
        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .el-icon {
          color: #a0aec0;
          transition: all 0.2s ease;
          font-size: 14px;
        }
      }
    }
    
    .batch-settings-content {
      padding: 16px 20px;
      background: #1a202c;
      
      .batch-row.single-line-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        flex-wrap: nowrap;
        width: 100%;
      }
      
      .batch-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 1;
        min-width: 0;
        
        .field-label {
          font-size: 12px;
          font-weight: 600;
          color: #e2e8f0;
          white-space: nowrap;
          text-align: left;
        }
        
        .input-group {
          display: flex;
          align-items: center;
          gap: 6px;
          
          &.dimensions-inputs {
            .dimension-separator {
              font-size: 12px;
              color: #63b3ed;
              margin: 0 2px;
              font-weight: 600;
            }
          }
        }
        
        // 特定字段宽度调整
        &.price-field {
          flex: 1.4;
        }
        
        &.inventory-field {
          flex: 1.2;
        }
        
        &.weight-field {
          flex: 1.2;
        }
        
        &.dimensions-field {
          flex: 2;
        }
        
        &.status-field {
          flex: 1;
        }
        
        .el-input-number {
          :deep(.el-input__inner) {
            background: #4a5568;
            border-color: #4a5568;
            color: #e2e8f0;
            text-align: center;
            
            &:focus {
              border-color: #48bb78;
            }
          }
          
          :deep(.el-input-number__increase),
          :deep(.el-input-number__decrease) {
            display: none !important;
          }
        }
        
        .el-select {
          :deep(.el-input__inner) {
            background: #4a5568;
            border-color: #4a5568;
            color: #e2e8f0;
            
            &:focus {
              border-color: #48bb78;
            }
          }
        }
      }
      
      .batch-actions-inline {
        flex: 0 0 auto;
        display: flex;
        align-items: flex-end;
        padding-top: 20px;
        
        .el-button--primary {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          border-color: #48bb78;
          font-weight: 600;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(72, 187, 120, 0.3);
          transition: all 0.2s ease;
          padding: 8px 20px;
          font-size: 14px;
          
          &:hover {
            background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
            border-color: #38a169;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
          }
          
          &:active {
            transform: translateY(0);
          }
        }
      }
    }
  }
  
  .bundle-table-section {
    .bundle-product-selector {
      margin-bottom: 20px;
      
      .selector-header {
        margin-bottom: 12px;
        
        .selector-title {
          font-size: 16px;
          font-weight: 600;
          color: #e2e8f0;
        }
      }
      
      .preset-bundles {
        margin-top: 16px;
        
        .preset-title {
          font-size: 14px;
          font-weight: 500;
          color: #a0aec0;
          margin-bottom: 8px;
        }
        
        .preset-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          
          .el-button {
            display: flex;
            align-items: center;
            
            &:hover {
              transform: translateY(-1px);
              box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
            }
            
            .el-icon {
              opacity: 0.7;
              transition: opacity 0.2s;
              
              &:hover {
                opacity: 1;
              }
            }
          }
        }
      }
    }
    
    .bundle-table-container {
      .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        
        span {
          font-size: 16px;
          font-weight: 600;
          color: #e2e8f0;
        }
        
        .bundle-batch-settings {
          .batch-quantity-setting {
            display: flex;
            align-items: center;
            gap: 8px;
            
            label {
              font-size: 14px;
              color: #cbd5e0;
              white-space: nowrap;
            }
            
            .el-button {
              margin-left: 4px;
            }
          }
        }
      }
    }
  }

  .bundle-table {
    background: #2d3748;
    border-radius: 12px;
    overflow: hidden;
    
    .product-info {
      .product-sku {
        font-family: monospace;
        font-size: 12px;
        color: #63b3ed;
        font-weight: 600;
      }
      
      .product-name {
        font-size: 13px;
        color: #e2e8f0;
        margin-top: 2px;
      }
    }
    
    .unit-price-display {
      font-family: monospace;
      font-size: 14px;
      color: #68d391;
      font-weight: 600;
      text-align: center;
    }
    
    .compact-radio-group {
      :deep(.el-radio-button__inner) {
        padding: 8px 12px;
        font-size: 12px;
      }
    }
    
    .price-group.compact,
    .discount-group.compact {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: nowrap !important;
      
      :deep(.el-input-number) {
        .el-input__inner {
          text-align: center;
        }
      }
    }
    
    // 聚合单元格样式
    :deep(.el-table__body) {
      td {
        &:nth-child(4), // Sales Price
        &:nth-child(5), // Discount Price
        &:nth-child(6), // Inventory Type
        &:nth-child(7), // Weight
        &:nth-child(8), // Dimensions
        &:nth-child(9) { // Split Shipping
          &.is-first-row {
            background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%);
            border-left: 3px solid #3182ce;
            position: relative;
            
            &::before {
              content: "📦";
              position: absolute;
              top: 8px;
              left: 8px;
              font-size: 12px;
              opacity: 0.6;
            }
          }
        }
      }
    }
    
    :deep(.el-table__header) {
      background: #374151;
      
      th {
        background: #374151;
        border-color: #4a5568;
        color: #f7fafc;
        font-weight: 600;
        font-size: 13px;
      }
    }
    
    :deep(.el-table__body) {
      tr {
        background: #2d3748;
        
        &:hover {
          background: #374151 !important;
        }
        
        td {
          border-color: #4a5568;
          color: #e2e8f0;
        }
      }
      
      .el-table__row--striped {
        background: #1a202c;
        
        &:hover {
          background: #374151 !important;
        }
      }
    }
  }
  
  .variants-table {
    background: #2d3748;
    border-radius: 12px;
    overflow: hidden;
    
    :deep(.el-table__header) {
      background: #374151;
      
      th {
        background: #374151;
        border-color: #4a5568;
        color: #e2e8f0;
        font-weight: 600;
        
      }
    }
    
    :deep(.el-table__body) {
      tr {
        background: #2d3748;
        
        &:hover {
          background: #374151;
        }
        
        td {
          border-color: #4a5568;
          color: #e2e8f0;
          
          // 合并单元格的特殊样式
          &.merged-cell {
            border-top: 2px solid #48bb78;
            background: rgba(72, 187, 120, 0.03);
          }
          
          // 隐藏被合并单元格的边框
          &.hidden-cell {
            border-top: none !important;
            border-bottom: none !important;
          }
          
        }
      }
    }
    
    .sku-info {
      .sku-code {
        font-weight: 600;
        color: #e2e8f0;
        margin-bottom: 4px;
      }
      
      .variant-attributes {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        
        .attr-tag {
          font-size: 10px;
          padding: 2px 6px;
          
          &[color] {
            border: 1px solid #4a5568;
          }
        }
      }
    }
    
    .total-value {
      font-weight: 600;
      color: #48bb78;
    }
    
    // 删除按钮样式
    .el-button.is-circle {
      &.el-button--danger {
        background: rgba(245, 101, 101, 0.1);
        border-color: #f56565;
        color: #f56565;
        
        &:hover:not(:disabled) {
          background: #f56565;
          border-color: #f56565;
          color: white;
        }
        
        &:disabled {
          background: rgba(160, 174, 192, 0.1);
          border-color: #a0aec0;
          color: #a0aec0;
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>
