<template>
  <div class="warehouse-info">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="180px"
      class="warehouse-form"
    >
      <!-- Warehouse Assignment -->
      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>Warehouse Assignment</span>
            <el-tooltip content="Select warehouses to store this product" placement="top">
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>

        <!-- Warehouse Selection -->
        <el-form-item 
          label="Warehouse" 
          prop="warehouse.selected"
        >
                    <div class="warehouse-selection">
            <el-select 
              v-model="form.warehouse.selected" 
              placeholder="Select warehouses for product storage"
              multiple
              collapse-tags
              collapse-tags-tooltip
              clearable
              @change="handleWarehouseChange"
            >
              <el-option
                v-for="warehouse in warehouseOptions"
                :key="warehouse.id"
                :label="warehouse.name"
                :value="warehouse.id"
              >
                <div class="warehouse-option">
                  <span>{{ warehouse.name }}</span>
                  <el-tag size="small" :type="warehouse.type === 'WMS' ? 'primary' : 'success'">
                    {{ warehouse.type }}
                  </el-tag>
                </div>
              </el-option>
            </el-select>

            <!-- Warehouse Item IDs -->
            <div class="warehouse-ids" v-if="form.warehouse.selected?.length">
              <div 
                v-for="warehouseId in form.warehouse.selected" 
                :key="warehouseId"
                class="warehouse-id-item"
              >
                <div class="warehouse-name">
                  {{ getWarehouseName(warehouseId) }}
                  <el-tag 
                    size="small" 
                    :type="getWarehouseType(warehouseId) === 'WMS' ? 'primary' : 'success'"
                  >
                    {{ getWarehouseType(warehouseId) }}
                  </el-tag>
                </div>
                <div class="item-id">
                  <span class="id-label">Item ID:</span>
                  <el-input
                    v-model="form.warehouse.itemIds[warehouseId]"
                    placeholder="Auto-assigned after creation"
                    disabled
                  >
                    <template #prefix>
                      <el-icon><Link /></el-icon>
                    </template>
                  </el-input>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>

        <!-- Warehouse Configuration (Only shown when warehouse is selected) -->
        <template v-if="form.warehouse.selected">
          <!-- Warehouse Item ID -->
          <el-form-item 
            label="Warehouse Item ID" 
            prop="warehouse.itemId"
        >
          <el-input 
              v-model="form.warehouse.itemId" 
              placeholder="Item ID in warehouse system (auto-assigned after creation)"
              disabled
          >
            <template #append>
                <el-tooltip 
                  content="This ID will be automatically assigned by the warehouse system after product creation" 
                  placement="top"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
            </template>
          </el-input>
            <div class="field-help">System-generated unique identifier in the warehouse system</div>
        </el-form-item>


        </template>
      </el-card>

      <!-- Basic Settings -->
      <el-card 
        v-if="form.warehouse.selected"
        class="form-card" 
        shadow="never"
      >
        <template #header>
          <div class="card-header">
            <span>Basic Settings</span>
            <el-tooltip content="Basic warehouse product settings" placement="top">
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>

        <!-- Product Category -->
        <el-form-item 
          label="Product Category" 
          prop="warehouse.basicSettings.category"
          required
        >
          <el-select 
            v-model="form.warehouse.basicSettings.category" 
            placeholder="Select product category"
          >
            <el-option label="General Merchandise" value="GENERAL" />
            <el-option label="Electronics" value="ELECTRONICS" />
            <el-option label="Apparel" value="APPAREL" />
            <el-option label="Food & Beverage" value="F&B" />
            <el-option label="Health & Beauty" value="H&B" />
          </el-select>
          <div class="field-help">Category for warehouse organization and handling</div>
        </el-form-item>

        <!-- Product Type -->
        <el-form-item 
          label="Product Type" 
          prop="warehouse.basicSettings.type"
          required
        >
          <el-select 
            v-model="form.warehouse.basicSettings.type" 
            placeholder="Select product type"
          >
            <el-option label="Standard Product" value="STANDARD" />
            <el-option label="Bundle" value="BUNDLE" />
            <el-option label="Kit" value="KIT" />
            <el-option label="Raw Material" value="RAW" />
          </el-select>
          <div class="field-help">Determines how the product is handled in warehouse operations</div>
        </el-form-item>

        <!-- Handling Unit -->
        <el-form-item 
          label="Handling Unit" 
          prop="warehouse.basicSettings.handlingUnit"
          required
        >
          <el-select 
            v-model="form.warehouse.basicSettings.handlingUnit" 
            placeholder="Select handling unit"
          >
            <el-option label="Single Unit" value="UNIT" />
            <el-option label="Inner Pack" value="INNER" />
            <el-option label="Case" value="CASE" />
            <el-option label="Pallet" value="PALLET" />
          </el-select>
          <div class="field-help">Default unit for warehouse operations</div>
        </el-form-item>

        <!-- Supplier -->
        <el-form-item 
          label="Supplier" 
          prop="warehouse.basicSettings.supplier"
        >
          <el-select 
            v-model="form.warehouse.basicSettings.supplier" 
            placeholder="Select supplier"
            filterable
            remote
            :remote-method="handleSupplierSearch"
            :loading="supplierSearchLoading"
          >
            <el-option
              v-for="item in supplierOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <div class="supplier-option">
                <span>{{ item.name }}</span>
                <span class="supplier-code">{{ item.code }}</span>
              </div>
            </el-option>
          </el-select>
          <div class="field-help">Product supplier for warehouse receiving</div>
        </el-form-item>

        <!-- Product Group -->
        <el-form-item 
          label="Product Group" 
          prop="warehouse.basicSettings.group"
        >
          <el-cascader
            v-model="form.warehouse.basicSettings.group"
            :options="groupOptions"
            :props="{
              checkStrictly: true,
              emitPath: true,
              label: 'name',
              value: 'id'
            }"
            placeholder="Select product group"
            clearable
          />
          <div class="field-help">Group for warehouse organization and reporting</div>
        </el-form-item>

        <!-- Tags -->
        <el-form-item 
          label="Tags" 
          prop="warehouse.basicSettings.tags"
        >
          <el-select
            v-model="form.warehouse.basicSettings.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="Enter or select tags"
          >
            <el-option
              v-for="tag in tagOptions"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
          <div class="field-help">Tags for product categorization and filtering</div>
        </el-form-item>



        <!-- Product Attributes -->
        <el-form-item 
          label="Product Attributes" 
          prop="warehouse.attributes"
        >
          <el-checkbox-group v-model="form.warehouse.attributes">
            <el-checkbox label="BATCH">
              Batch Management
              <el-tooltip content="Track and manage product batches" placement="top">
                <el-icon class="attribute-info"><InfoFilled /></el-icon>
              </el-tooltip>
            </el-checkbox>
            <el-checkbox label="SERIAL">
              Serial Number
              <el-tooltip content="Track individual items with unique serial numbers" placement="top">
                <el-icon class="attribute-info"><InfoFilled /></el-icon>
              </el-tooltip>
            </el-checkbox>
            <el-checkbox label="EXPIRY">
              Expiry Date
              <el-tooltip content="Track product expiration dates" placement="top">
                <el-icon class="attribute-info"><InfoFilled /></el-icon>
              </el-tooltip>
            </el-checkbox>
            <el-checkbox label="QUALITY">
              Quality Check
              <el-tooltip content="Require quality inspection" placement="top">
                <el-icon class="attribute-info"><InfoFilled /></el-icon>
              </el-tooltip>
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- Batch Control Settings -->
        <template v-if="form.warehouse.attributes.includes('BATCH')">
          <el-form-item 
            label="Batch Control" 
            required
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Shelf Life (Days)">
                  <el-input-number 
                    v-model="form.warehouse.batchControl.shelfLife" 
                    :min="0"
                    placeholder="Product shelf life in days"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Min Receiving Life (Days)">
                  <el-input-number 
                    v-model="form.warehouse.batchControl.minReceivingLife" 
                    :min="0"
                    placeholder="Minimum receiving shelf life"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </template>

        <!-- Serial Number Control Settings -->
        <template v-if="form.warehouse.attributes.includes('SERIAL')">
          <el-form-item 
            label="Serial Number Control" 
            required
          >
            <el-checkbox-group v-model="form.warehouse.serialControl.trackingPoints">
              <el-checkbox label="RECEIVING">Track at Receiving</el-checkbox>
              <el-checkbox label="PUTAWAY">Track at Put-away</el-checkbox>
              <el-checkbox label="PICKING">Track at Picking</el-checkbox>
              <el-checkbox label="SHIPPING">Track at Shipping</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </template>
      </el-card>

      <!-- Packaging Information -->
      <el-card 
        v-if="form.warehouse.selected"
        class="form-card" 
        shadow="never"
      >
        <template #header>
          <div class="card-header">
            <span>Packaging Information</span>
            <el-tooltip content="Product packaging levels and specifications" placement="top">
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>

        <!-- 包装层级 -->
        <div class="package-levels">
          <div class="level-header">
              <h4>Packaging Levels</h4>
            <el-button 
              type="primary" 
              link 
              :icon="Plus"
              @click="handleAddPackageLevel"
                :disabled="!form.warehouse.basicSettings.handlingUnit"
            >
                Add Level
            </el-button>
          </div>

            <!-- Base Unit Display -->
            <div class="base-unit" v-if="form.warehouse.basicSettings.handlingUnit">
              <el-alert
                type="info"
                :title="'Base Unit: ' + getUnitLabel(form.warehouse.basicSettings.handlingUnit)"
                :closable="false"
              >
                <template #default>
                  <div class="base-unit-info">
                    <span>All packaging levels will be converted based on this unit</span>
                  </div>
                </template>
              </el-alert>
            </div>

            <el-table :data="form.packageLevels" border v-if="form.warehouse.basicSettings.handlingUnit">
              <el-table-column label="Level" width="150">
                <template #default="{ row, $index }">
                  <el-select 
                    v-model="row.level" 
                    placeholder="Select level"
                    @change="handleLevelChange($index)"
                  >
                    <el-option
                      v-for="option in getAvailableLevels($index)"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    />
                </el-select>
              </template>
            </el-table-column>

              <el-table-column label="Conversion" width="250">
                <template #default="{ row, $index }">
                  <div class="conversion-rate">
                    <span>1 {{ getLevelLabel(row.level) }} =</span>
                    <el-input-number 
                      v-model="row.quantity" 
                      :min="1" 
                      :precision="0"
                      :disabled="$index === 0"
                      @change="handleQuantityChange($index)"
                    />
                    <span>{{ getPreviousLevelLabel($index) }}</span>
                  </div>
                  <div class="total-conversion" v-if="$index > 0">
                    = {{ calculateTotalQuantity($index) }} {{ getUnitLabel(form.warehouse.basicSettings.handlingUnit) }}
                  </div>
              </template>
            </el-table-column>

              <el-table-column label="Barcode" min-width="200">
              <template #default="{ row }">
                  <el-input v-model="row.barcode" placeholder="Enter barcode">
                  <template #append>
                      <el-tooltip content="Verify barcode" placement="top">
                    <el-button :icon="Search" @click="handleVerifyBarcode(row)" />
                      </el-tooltip>
                  </template>
                </el-input>
              </template>
            </el-table-column>

              <el-table-column label="Dimensions (cm)" width="300">
              <template #default="{ row }">
                <el-input-group>
                    <el-input-number v-model="row.length" :min="0" :precision="2" placeholder="L" />
                    <el-input-number v-model="row.width" :min="0" :precision="2" placeholder="W" />
                    <el-input-number v-model="row.height" :min="0" :precision="2" placeholder="H" />
                </el-input-group>
              </template>
            </el-table-column>

              <el-table-column label="Weight (kg)" width="150">
              <template #default="{ row }">
                  <el-input-number v-model="row.weight" :min="0" :precision="3" placeholder="Weight" />
              </template>
            </el-table-column>

              <el-table-column label="Actions" width="100" fixed="right">
              <template #default="{ $index }">
                <el-button 
                  type="danger" 
                  link 
                  :icon="Delete"
                  @click="handleRemovePackageLevel($index)"
                />
              </template>
            </el-table-column>
          </el-table>

            <!-- Empty State -->
            <div class="package-levels-empty" v-else>
              <el-empty description="Please select base unit first">
                <template #description>
                  <p>Select Handling Unit in Basic Settings as the base unit</p>
                </template>
              </el-empty>
            </div>
        </div>
      </el-card>

      <!-- Storage Requirements -->
      <el-card 
        v-if="form.warehouse.selected"
        class="form-card" 
        shadow="never"
      >
        <template #header>
          <div class="card-header">
            <span>Storage Requirements</span>
            <el-tooltip content="Product storage conditions and special requirements" placement="top">
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item 
              label="Storage Type" 
              prop="warehouse.storage.type"
              required
            >
              <el-select 
                v-model="form.warehouse.storage.type" 
                placeholder="Select storage type"
              >
                <el-option label="Normal Temperature" value="NORMAL" />
                <el-option label="Cold Storage" value="COLD" />
                <el-option label="Frozen" value="FROZEN" />
                <el-option label="Constant Temperature" value="CONSTANT" />
              </el-select>
              <div class="field-help">Temperature requirements for storage</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item 
              label="ABC Classification" 
              prop="warehouse.storage.abcClass"
              required
            >
              <el-select 
                v-model="form.warehouse.storage.abcClass" 
                placeholder="Select ABC class"
              >
                <el-option label="A - High Value/Priority" value="A" />
                <el-option label="B - Medium Value/Priority" value="B" />
                <el-option label="C - Low Value/Priority" value="C" />
              </el-select>
              <div class="field-help">Storage location priority classification</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item 
              label="Turnover Type" 
              prop="warehouse.storage.turnoverType"
              required
            >
              <el-select 
                v-model="form.warehouse.storage.turnoverType" 
                placeholder="Select turnover type"
              >
                <el-option label="Fast Moving" value="FAST" />
                <el-option label="Regular Moving" value="NORMAL" />
                <el-option label="Slow Moving" value="SLOW" />
              </el-select>
              <div class="field-help">Product turnover frequency</div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item 
              label="Storage Conditions" 
              prop="warehouse.storage.conditions"
            >
              <el-checkbox-group v-model="form.warehouse.storage.conditions">
                <el-checkbox label="STACK">Stackable</el-checkbox>
                <el-checkbox label="TILT">Tiltable</el-checkbox>
                <el-checkbox label="MOISTURE">Moisture Sensitive</el-checkbox>
                <el-checkbox label="LIGHT">Light Sensitive</el-checkbox>
              </el-checkbox-group>
              <div class="field-help">Physical storage conditions</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="Special Requirements" 
              prop="warehouse.storage.specialRequirements"
            >
              <el-checkbox-group v-model="form.warehouse.storage.specialRequirements">
                <el-checkbox label="FRAGILE">Fragile</el-checkbox>
                <el-checkbox label="HEAVY">Heavy</el-checkbox>
                <el-checkbox label="HAZMAT">Hazardous Materials</el-checkbox>
                <el-checkbox label="VALUABLE">Valuable Items</el-checkbox>
              </el-checkbox-group>
              <div class="field-help">Special handling requirements</div>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Hazardous Materials Information -->
        <template v-if="form.warehouse.storage.specialRequirements?.includes('HAZMAT')">
          <div class="hazmat-section">
            <h4>Hazardous Materials Information</h4>
            
        <el-form-item 
              label="UN Code" 
              prop="warehouse.storage.hazmatInfo.unCode"
              required
            >
              <el-input 
                v-model="form.warehouse.storage.hazmatInfo.unCode"
                placeholder="Enter UN code"
              >
                <template #prepend>UN</template>
              </el-input>
              <div class="field-help">United Nations Dangerous Goods Code</div>
              </el-form-item>

            <el-form-item 
              label="Hazard Class" 
              prop="warehouse.storage.hazmatInfo.hazardClass"
              required
            >
              <el-select 
                v-model="form.warehouse.storage.hazmatInfo.hazardClass"
                placeholder="Select hazard class"
              >
                <el-option label="Class 1 - Explosives" value="CLASS_1" />
                <el-option label="Class 2 - Gases" value="CLASS_2" />
                <el-option label="Class 3 - Flammable Liquids" value="CLASS_3" />
                <el-option label="Class 4 - Flammable Solids" value="CLASS_4" />
                <el-option label="Class 5 - Oxidizing Substances" value="CLASS_5" />
                <el-option label="Class 6 - Toxic Substances" value="CLASS_6" />
                <el-option label="Class 7 - Radioactive Materials" value="CLASS_7" />
                <el-option label="Class 8 - Corrosive Substances" value="CLASS_8" />
                <el-option label="Class 9 - Miscellaneous" value="CLASS_9" />
                </el-select>
              <div class="field-help">UN hazard classification</div>
              </el-form-item>

            <el-form-item 
              label="Packing Group" 
              prop="warehouse.storage.hazmatInfo.packingGroup"
              required
            >
              <el-select 
                v-model="form.warehouse.storage.hazmatInfo.packingGroup"
                placeholder="Select packing group"
              >
                <el-option label="I - Great Danger" value="PG_I" />
                <el-option label="II - Medium Danger" value="PG_II" />
                <el-option label="III - Minor Danger" value="PG_III" />
                </el-select>
              <div class="field-help">UN packing group classification</div>
              </el-form-item>

            <el-form-item 
              label="Special Provisions" 
              prop="warehouse.storage.hazmatInfo.specialProvisions"
            >
              <el-input
                type="textarea"
                v-model="form.warehouse.storage.hazmatInfo.specialProvisions"
                placeholder="Enter special handling provisions"
                :rows="3"
              />
              <div class="field-help">Special handling or storage requirements</div>
        </el-form-item>
          </div>
        </template>
      </el-card>

      <!-- Inventory Control -->
      <el-card 
        v-if="form.warehouse.selected"
        class="form-card" 
        shadow="never"
      >
        <template #header>
          <div class="card-header">
            <span>Inventory Control</span>
            <el-tooltip content="Inventory strategies and threshold settings" placement="top">
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>

        <!-- Inventory Strategies -->
        <div class="strategy-section">
          <h4>Inventory Strategies</h4>
        <el-row :gutter="20">
          <el-col :span="8">
              <el-form-item 
                label="Stock Strategy" 
                prop="warehouse.inventory.stockStrategy"
                required
              >
                <el-select 
                  v-model="form.warehouse.inventory.stockStrategy" 
                  placeholder="Select stock strategy"
                >
                  <el-option label="FIFO - First In First Out" value="FIFO" />
                  <el-option label="FEFO - First Expired First Out" value="FEFO" />
                  <el-option label="LIFO - Last In First Out" value="LIFO" />
              </el-select>
                <div class="field-help">Stock rotation method</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
              <el-form-item 
                label="Replenishment" 
                prop="warehouse.inventory.replenishStrategy"
                required
              >
                <el-select 
                  v-model="form.warehouse.inventory.replenishStrategy" 
                  placeholder="Select replenishment strategy"
                >
                  <el-option label="Min-Max" value="MIN_MAX" />
                  <el-option label="Periodic Review" value="PERIODIC" />
                  <el-option label="Demand Driven" value="DEMAND" />
              </el-select>
                <div class="field-help">Stock replenishment method</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
              <el-form-item 
                label="Stockout Action" 
                prop="warehouse.inventory.stockoutAction"
                required
              >
                <el-select 
                  v-model="form.warehouse.inventory.stockoutAction" 
                  placeholder="Select stockout action"
                >
                  <el-option label="Allow Backorder" value="ALLOW" />
                  <el-option label="No Backorder" value="FORBID" />
                  <el-option label="Wait for Stock" value="WAIT" />
              </el-select>
                <div class="field-help">Action when stock is depleted</div>
            </el-form-item>
          </el-col>
        </el-row>
        </div>

        <!-- Stock Thresholds -->
        <div class="threshold-section">
          <h4>Stock Thresholds</h4>
          <div class="threshold-inputs">
            <!-- Safety Stock -->
            <div class="threshold-item">
              <el-form-item 
                label="Safety Stock" 
                prop="warehouse.inventory.thresholds.safety"
                required
              >
                <div class="threshold-input-group">
                  <el-input-number 
                    v-model="form.warehouse.inventory.thresholds.safety" 
                    :min="0" 
                    :precision="0"
                    :step="1"
                    placeholder="Enter safety stock level"
                    class="threshold-input"
                  >
                    <template #prefix>
                      <el-icon class="threshold-icon safety"><WarnTriangleFilled /></el-icon>
                    </template>
                  </el-input-number>
                  <div class="threshold-info">
                    <div class="threshold-value">
                      <span class="value-label">Current:</span>
                      <span class="value-number">{{ form.warehouse.inventory.thresholds.safety }}</span>
                      <span class="value-unit">units</span>
                    </div>
                    <div class="threshold-desc">Buffer stock to prevent stockouts</div>
                  </div>
                </div>
            </el-form-item>
            </div>

            <!-- Reorder Point -->
            <div class="threshold-item">
              <el-form-item 
                label="Alert Level" 
                prop="warehouse.inventory.thresholds.reorder"
                required
              >
                <div class="threshold-input-group">
                  <el-input-number 
                    v-model="form.warehouse.inventory.thresholds.reorder" 
                    :min="0" 
                    :precision="0"
                    :step="1"
                    placeholder="Enter alert level"
                    class="threshold-input"
                  >
                    <template #prefix>
                      <el-icon class="threshold-icon reorder"><WarnTriangleFilled /></el-icon>
                    </template>
                  </el-input-number>
                  <div class="threshold-info">
                    <div class="threshold-value">
                      <span class="value-label">Current:</span>
                      <span class="value-number">{{ form.warehouse.inventory.thresholds.reorder }}</span>
                      <span class="value-unit">units</span>
                    </div>
                    <div class="threshold-desc">Stock level that triggers replenishment alert</div>
                  </div>
                </div>
            </el-form-item>
            </div>

            <!-- Minimum Stock -->
            <div class="threshold-item">
              <el-form-item 
                label="Minimum Stock" 
                prop="warehouse.inventory.thresholds.minimum"
                required
              >
                <div class="threshold-input-group">
                  <el-input-number 
                    v-model="form.warehouse.inventory.thresholds.minimum" 
                    :min="0" 
                    :precision="0"
                    :step="1"
                    placeholder="Enter minimum stock level"
                    class="threshold-input"
                  >
                    <template #prefix>
                      <el-icon class="threshold-icon minimum"><ArrowDown /></el-icon>
                    </template>
                  </el-input-number>
                  <div class="threshold-info">
                    <div class="threshold-value">
                      <span class="value-label">Current:</span>
                      <span class="value-number">{{ form.warehouse.inventory.thresholds.minimum }}</span>
                      <span class="value-unit">units</span>
                    </div>
                    <div class="threshold-desc">Absolute minimum stock level allowed</div>
                  </div>
                </div>
            </el-form-item>
            </div>

            <!-- Maximum Stock -->
            <div class="threshold-item">
              <el-form-item 
                label="Maximum Stock" 
                prop="warehouse.inventory.thresholds.maximum"
                required
              >
                <div class="threshold-input-group">
                  <el-input-number 
                    v-model="form.warehouse.inventory.thresholds.maximum" 
                    :min="0" 
                    :precision="0"
                    :step="1"
                    placeholder="Enter maximum stock level"
                    class="threshold-input"
                  >
                    <template #prefix>
                      <el-icon class="threshold-icon maximum"><ArrowUp /></el-icon>
                    </template>
                  </el-input-number>
                  <div class="threshold-info">
                    <div class="threshold-value">
                      <span class="value-label">Current:</span>
                      <span class="value-number">{{ form.warehouse.inventory.thresholds.maximum }}</span>
                      <span class="value-unit">units</span>
                    </div>
                    <div class="threshold-desc">Maximum stock level capacity</div>
                  </div>
                </div>
            </el-form-item>
            </div>
          </div>
        </div>

        <!-- Alerts Configuration -->
        <div class="alerts-section">
          <h4>Alert Settings</h4>
          <el-form-item 
            label="Stock Alerts" 
            prop="warehouse.inventory.alerts"
          >
            <el-checkbox-group v-model="form.warehouse.inventory.alerts">
              <el-checkbox label="LOW">
                Low Stock
                <el-tooltip content="Alert when stock falls below safety level" placement="top">
                  <el-icon class="alert-info"><InfoFilled /></el-icon>
                </el-tooltip>
              </el-checkbox>
              <el-checkbox label="HIGH">
                High Stock
                <el-tooltip content="Alert when stock exceeds maximum level" placement="top">
                  <el-icon class="alert-info"><InfoFilled /></el-icon>
                </el-tooltip>
              </el-checkbox>
              <el-checkbox label="EXPIRY">
                Expiration
                <el-tooltip content="Alert for items approaching expiration" placement="top">
                  <el-icon class="alert-info"><InfoFilled /></el-icon>
                </el-tooltip>
              </el-checkbox>
              <el-checkbox label="QUALITY">
                Quality Check
                <el-tooltip content="Alert for items requiring quality inspection" placement="top">
                  <el-icon class="alert-info"><InfoFilled /></el-icon>
                </el-tooltip>
              </el-checkbox>
          </el-checkbox-group>
            <div class="field-help">Configure inventory monitoring alerts</div>
        </el-form-item>
        </div>
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { 
  Plus,
  Delete,
  Refresh,
  InfoFilled,
  Search,
  WarnTriangleFilled,
  RefreshRight,
  ArrowUp,
  ArrowDown
} from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus';
import type { WMSProductSettings } from '@/types/warehouse';

// 包装层级接口定义
interface PackageLevel {
  level: string;           // 包装层级类型
  quantity: number;        // 与上一层级的换算比例
  barcode: string;        // 条码
  length: number;         // 长度
  width: number;          // 宽度
  height: number;         // 高度
  weight: number;         // 重量
}

// Package level options
const PACKAGE_LEVELS = [
  { label: 'Inner Pack', value: 'INNER' },
  { label: 'Carton', value: 'CARTON' },
  { label: 'Pallet', value: 'PALLET' }
];

interface WarehouseForm {
  warehouse: {
    selected: string[];             // 选择的仓库ID列表
    itemIds: Record<string, string>; // 每个仓库对应的商品ID
    
    // 基础设置
    basicSettings: {
      category: string;           // 仓库商品分类
      type: string;              // 商品类型
      handlingUnit: string;      // 操作单位
      supplier?: string;         // 供应商ID
      group?: string[];          // 商品分组路径
      tags?: string[];          // 标签列表
    };

    // 存储要求
    storage: {
      type: string;             // 存储类型
      abcClass: string;         // ABC分类
      turnoverType: string;     // 周转类型
      conditions: string[];     // 存储条件
      specialRequirements: string[]; // 特殊要求
      hazmatInfo?: {
        unCode: string;         // UN编码
        hazardClass: string;    // 危险品等级
        packingGroup: string;   // 包装等级
        specialProvisions?: string; // 特殊规定
      };
    };

    // 库存控制
    inventory: {
      // 库存策略
      stockStrategy: string;    // 库存策略(FIFO/FEFO/LIFO)
      replenishStrategy: string; // 补货策略
      stockoutAction: string;   // 缺货处理

      // 库存阈值
      thresholds: {
        safety: number;        // 安全库存
        minimum: number;       // 最小库存
        maximum: number;       // 最大库存
        reorder: number;      // 补货点
      };

      // 预警设置
      alerts: string[];       // 库存预警类型
    };
    
    // 商品属性
    attributes: string[];           // 商品属性
    
    // 批次管理
    batchControl: {
      shelfLife: number;           // 保质期天数
      minReceivingLife: number;    // 最小收货保质期天数
    };
    
    // 序列号管理
    serialControl: {
      trackingPoints: string[];    // 序列号管理节点
    };
  };
}

const props = defineProps<{
  form: WarehouseForm
}>();

const emit = defineEmits(['update:form']);
const formRef = ref<FormInstance>();
const form = reactive<WarehouseForm>({
  warehouse: {
    selected: [],
    itemIds: {},
    
    // 基础设置
    basicSettings: {
      category: '',              // 仓库商品分类
      type: '',                 // 商品类型
      handlingUnit: '',         // 操作单位
      supplier: undefined,      // 供应商ID
      group: [],               // 商品分组路径
      tags: [],                // 标签列表
    },

    // 存储要求
    storage: {
      type: '',                // 存储类型
      abcClass: '',           // ABC分类
      turnoverType: '',       // 周转类型
      conditions: [],         // 存储条件
      specialRequirements: [], // 特殊要求
      hazmatInfo: {
        unCode: '',           // UN编码
        hazardClass: '',      // 危险品等级
        packingGroup: '',     // 包装等级
        specialProvisions: '', // 特殊规定
      },
    },

    // 库存控制
    inventory: {
      // 库存策略
      stockStrategy: '',      // 库存策略
      replenishStrategy: '', // 补货策略
      stockoutAction: '',    // 缺货处理

      // 库存阈值
      thresholds: {
        safety: 0,          // 安全库存
        minimum: 0,         // 最小库存
        maximum: 0,         // 最大库存
        reorder: 0,        // 补货点
      },

      // 预警设置
      alerts: [],          // 库存预警类型
    },
    
    // 商品属性
    attributes: [],
    
    // 批次管理
    batchControl: {
      shelfLife: 0,
      minReceivingLife: 0,
    },
    
    // 序列号管理
    serialControl: {
      trackingPoints: [],
    },
  },
});

// 仓库选项
const warehouseOptions = [
  { id: 'WMS_01', name: 'Main Warehouse', type: 'WMS' },
  { id: 'WMS_02', name: 'Secondary Warehouse', type: 'WMS' },
  { id: '3PL_01', name: '3PL Warehouse', type: '3PL' },
];

// 供应商搜索
const supplierSearchLoading = ref(false);
const supplierOptions = ref<Array<{id: string; name: string; code: string}>>([]);

const handleSupplierSearch = async (query: string) => {
  if (query) {
    supplierSearchLoading.value = true;
    try {
      // TODO: 调用供应商搜索API
      // const response = await supplierService.search(query);
      // supplierOptions.value = response.data;
      
      // 模拟数据
      supplierOptions.value = [
        { id: 'SUP001', name: 'Supplier A', code: 'SA001' },
        { id: 'SUP002', name: 'Supplier B', code: 'SB001' },
      ];
    } catch (error) {
      console.error('Failed to search suppliers:', error);
    } finally {
      supplierSearchLoading.value = false;
    }
  } else {
    supplierOptions.value = [];
  }
};

// 商品分组选项
const groupOptions = ref([
  {
    id: 'G1',
    name: 'Electronics',
    children: [
      {
        id: 'G1-1',
        name: 'Computers',
        children: [
          { id: 'G1-1-1', name: 'Laptops' },
          { id: 'G1-1-2', name: 'Desktops' }
        ]
      },
      {
        id: 'G1-2',
        name: 'Mobile Devices',
        children: [
          { id: 'G1-2-1', name: 'Smartphones' },
          { id: 'G1-2-2', name: 'Tablets' }
        ]
      }
    ]
  },
  {
    id: 'G2',
    name: 'Apparel',
    children: [
      {
        id: 'G2-1',
        name: 'Men',
        children: [
          { id: 'G2-1-1', name: 'Shirts' },
          { id: 'G2-1-2', name: 'Pants' }
        ]
      },
      {
        id: 'G2-2',
        name: 'Women',
        children: [
          { id: 'G2-2-1', name: 'Dresses' },
          { id: 'G2-2-2', name: 'Skirts' }
        ]
      }
    ]
  }
]);

// 标签选项
const tagOptions = ref([
  'New Arrival',
  'Best Seller',
  'High Value',
  'Promotion',
  'Seasonal',
  'Clearance'
]);

// 获取仓库名称
const getWarehouseName = (warehouseId: string) => {
  const warehouse = warehouseOptions.find(w => w.id === warehouseId);
  return warehouse?.name || warehouseId;
};

// 获取仓库类型
const getWarehouseType = (warehouseId: string) => {
  const warehouse = warehouseOptions.find(w => w.id === warehouseId);
  return warehouse?.type || 'WMS';
};

// 监听仓库选择变化
const handleWarehouseChange = (value: string[]) => {
  // 移除未选中仓库的itemId
  Object.keys(form.warehouse.itemIds).forEach(warehouseId => {
    if (!value.includes(warehouseId)) {
      delete form.warehouse.itemIds[warehouseId];
    }
  });

  // 如果没有选择任何仓库
  if (!value.length) {
    // 清空相关配置
    form.warehouse.itemIds = {};
    
    // 清空基础设置
    form.warehouse.basicSettings = {
      storageType: '',
      abcClass: '',
      inventoryStrategy: '',
      storageConditions: [],
      specialRequirements: [],
    };
    
    // 清空商品属性
    form.warehouse.attributes = [];
    
    // 清空批次管理
    form.warehouse.batchControl = {
      shelfLife: 0,
      minReceivingLife: 0,
    };
    
    // 清空序列号管理
    form.warehouse.serialControl = {
      trackingPoints: [],
    };
  }
};

// 包装层级相关方法
const handleAddPackageLevel = () => {
  if (!form.packageLevels) {
    form.packageLevels = [];
  }
  form.packageLevels.push({
    level: '',
    quantity: 1,
    barcode: '',
    length: 0,
    width: 0,
    height: 0,
    weight: 0
  });
};

const handleRemovePackageLevel = (index: number) => {
  form.packageLevels.splice(index, 1);
};

// Get unit label
const getUnitLabel = (unit: string) => {
  switch (unit) {
    case 'UNIT': return 'Unit';
    case 'INNER': return 'Inner Pack';
    case 'CASE': return 'Case';
    case 'PALLET': return 'Pallet';
    default: return unit;
  }
};

// 获取层级标签
const getLevelLabel = (level: string) => {
  const found = PACKAGE_LEVELS.find(l => l.value === level);
  return found ? found.label : level;
};

// 获取可用的层级选项
const getAvailableLevels = (currentIndex: number) => {
  const usedLevels = form.packageLevels
    .map(level => level.level)
    .filter((_, index) => index !== currentIndex);

  return PACKAGE_LEVELS.filter(level => !usedLevels.includes(level.value));
};

// 获取上一层级标签
const getPreviousLevelLabel = (currentIndex: number) => {
  if (currentIndex === 0) {
    return getUnitLabel(form.warehouse.basicSettings.handlingUnit);
  }
  return getLevelLabel(form.packageLevels[currentIndex - 1].level);
};

// 计算总换算数量
const calculateTotalQuantity = (currentIndex: number) => {
  let total = form.packageLevels[currentIndex].quantity;
  for (let i = currentIndex - 1; i >= 0; i--) {
    total *= form.packageLevels[i].quantity;
  }
  return total;
};

// 处理层级变更
const handleLevelChange = (index: number) => {
  // 可以在这里添加层级变更时的特殊处理
  // 例如：根据层级类型设置默认值等
};

// 处理数量变更
const handleQuantityChange = (index: number) => {
  // 可以在这里添加数量变更时的特殊处理
  // 例如：更新关联字段等
};

// 条码验证
const handleVerifyBarcode = async (row: PackageLevel) => {
  try {
    // TODO: 调用条码验证API
    ElMessage.success('条码验证通过');
  } catch (error) {
    ElMessage.error('条码验证失败');
  }
};

// 表单验证规则
const rules = {
  'warehouse.attributes': [
    {
      validator: (rule: any, value: string[]) => {
        if (!form.warehouse.selected) return true;
        if (value.includes('BATCH')) {
          if (!form.warehouse.batchControl.shelfLife) {
            return new Error('Please enter shelf life for batch management');
          }
          if (!form.warehouse.batchControl.minReceivingLife) {
            return new Error('Please enter minimum receiving life for batch management');
          }
        }
        if (value.includes('SERIAL') && form.warehouse.serialControl.trackingPoints.length === 0) {
          return new Error('Please select at least one tracking point for serial number management');
        }
        return true;
      },
      trigger: 'change'
    }
  ]
};

// 暴露验证方法给父组件
defineExpose({
  validate: () => formRef.value?.validate()
});
</script>

<style scoped lang="scss">
.warehouse-info {
  height: 100%;
  overflow-y: auto;
}

.warehouse-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-card {
  :deep(.el-card__header) {
    padding: 12px 20px;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }
}

:deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

:deep(.el-form-item) {
  margin-bottom: 18px;

  &:last-child {
    margin-bottom: 0;
  }
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-table) {
  margin-bottom: 20px;
}

:deep(.el-input-group) {
  display: flex;
  gap: 8px;
}

.supplier-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .supplier-code {
    color: #909399;
    font-size: 12px;
  }
}

:deep(.el-select-dropdown__item) {
  padding: 0 12px;
}

.warehouse-selection {
  display: flex;
  flex-direction: column;
  gap: 16px;

  :deep(.el-select) {
    width: 100%;

    .el-select__tags {
      .el-tag {
        background-color: #262626;
        border-color: #404040;
        color: #e5e5e5;

        .el-tag__close {
          background-color: transparent;
          color: #737373;
          
          &:hover {
            background-color: #404040;
            color: #ffffff;
          }
        }
      }
    }

    .el-input__wrapper {
      background-color: #1a1a1a;
      border-color: #333333;
      box-shadow: none;

      &:hover {
        border-color: #404040;
      }

      &.is-focus {
        border-color: #2563eb;
      }
    }
  }
}

.warehouse-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  
  span {
    color: #e5e5e5;
  }
}

.warehouse-ids {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.warehouse-id-item {
  background-color: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #404040;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);
  }

  .warehouse-name {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    color: #ffffff;
    font-weight: 500;
    font-size: 14px;

    .el-tag {
      font-weight: normal;
    }
  }

  .item-id {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #262626;
    border-radius: 6px;
    padding: 8px 12px;

    .id-label {
      color: #a3a3a3;
      font-size: 12px;
      white-space: nowrap;
    }

    :deep(.el-input) {
      flex: 1;
      min-width: 0;

      .el-input__wrapper {
        background-color: transparent;
        border: none;
        box-shadow: none;
        padding-left: 24px;
      }

      .el-input__prefix {
        color: #737373;
        font-size: 14px;
      }

      .el-input__inner {
        color: #e5e5e5;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 13px;

        &::placeholder {
          color: #525252;
        }
      }
    }
  }
}

.base-unit {
  margin-bottom: 16px;

  .base-unit-info {
    font-size: 12px;
    color: #606266;
  }
}

.conversion-rate {
  display: flex;
  align-items: center;
  gap: 8px;

  :deep(.el-input-number) {
    width: 90px;
  }
}

.total-conversion {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
  padding-left: 4px;
}

.package-levels-empty {
  padding: 32px 0;
  text-align: center;

  p {
    color: #909399;
    margin: 8px 0 0;
  }
}

.hazmat-section,
.strategy-section,
.threshold-section,
.alerts-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #EBEEF5;

  &:first-child {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
  }

  h4 {
    margin: 0 0 16px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    background-color: #1f2937;
    border-radius: 4px;
    display: inline-block;
  }
}

.alert-info {
  margin-left: 4px;
  font-size: 14px;
  color: #909399;
}

.threshold-inputs {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.threshold-item {
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
  border: 1px solid #333333;

  &:hover {
    background-color: #262626;
    border-color: #404040;
  }
}

.threshold-input-group {
  display: flex;
  gap: 16px;
  align-items: flex-start;

  .threshold-input {
    width: 200px;
    flex-shrink: 0;

    :deep(.el-input-number__prefix) {
      display: flex;
      align-items: center;
      left: 8px;
    }

    :deep(.el-input__wrapper) {
      padding-left: 32px;
    }
  }
}

.threshold-info {
  flex: 1;
  min-width: 0;
}

.threshold-value {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;

  .value-label {
    color: #a3a3a3;
    font-size: 12px;
  }

  .value-number {
    color: #ffffff;
    font-size: 16px;
    font-weight: 500;
  }

  .value-unit {
    color: #a3a3a3;
    font-size: 12px;
  }
}

.threshold-desc {
  color: #737373;
  font-size: 12px;
}

.threshold-icon {
  font-size: 16px;

  &.safety {
    color: #f59e0b;
  }

  &.reorder {
    color: #eab308;
  }

  &.minimum {
    color: #ef4444;
  }

  &.maximum {
    color: #22c55e;
  }
}
</style>