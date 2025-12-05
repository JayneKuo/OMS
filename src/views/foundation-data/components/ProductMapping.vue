<template>
  <div class="product-mapping">
    <!-- Tab 切换 -->
    <el-tabs v-model="activeTab" class="mapping-tabs">
      <!-- Product Pairing Tab -->
      <el-tab-pane label="Product Pairing" name="pairing">
        <div class="tab-content">
          <!-- 说明卡片 -->
          <el-alert
            type="info"
            :closable="false"
            show-icon
            class="info-alert"
          >
            <template #title>
              <div class="alert-content">
                <div class="alert-title">Product Pairing Guide</div>
                <div class="alert-description">
                  <p><strong>Function:</strong> Product pairing establishes the relationship between Channel SKU and Product SKU, enabling the mapping of channel products to product library items.</p>
                  <p><strong>Business Rules:</strong></p>
                  <ul>
                    <li>One Channel SKU within the same Channel can only be paired with one Product SKU</li>
                    <li>One Product SKU can be paired with multiple Channel SKUs from different Channels</li>
                    <li>Inventory SKU will be automatically populated based on the Product SKU mapping relationship</li>
                    <li>Unpaired Channel SKUs will not display Product SKU and Inventory SKU</li>
                  </ul>
                  <p><strong>Operations:</strong></p>
                  <ul>
                    <li>Click "Add Pairing" to add Product SKU for unpaired Channel SKU</li>
                    <li>Click "Modify Pairing" to change the paired Product SKU (other fields cannot be modified)</li>
                    <li>Click "Unpair" to remove the pairing relationship</li>
                    <li>Support bulk import of pairing data, please download the template first, fill it in, and then upload</li>
                  </ul>
                  <p><strong>Order Processing Flow:</strong></p>
                  <ul>
                    <li><strong>Order Receipt:</strong> When orders enter the system from channels (such as Amazon, eBay, Shopify, etc.), they carry Channel and Channel SKU information</li>
                    <li><strong>SKU Conversion:</strong> The system searches for the corresponding Product SKU based on the Channel and Channel SKU in the order</li>
                    <li><strong>Pairing Lookup:</strong> If a pairing relationship is found, the Channel SKU in the order will be converted to Product SKU for subsequent processing</li>
                    <li><strong>Pairing Failure:</strong> If no pairing relationship is found, the order cannot be processed normally, and the system will prompt to complete product pairing first</li>
                    <li><strong>Subsequent Processing:</strong> The converted Product SKU will be used for inventory queries, order processing, shipping, and other subsequent processes</li>
                  </ul>
                </div>
              </div>
            </template>
          </el-alert>

          <!-- 筛选栏 -->
          <div class="filter-bar">
            <el-select v-model="pairingFilter" placeholder="Filter Status" clearable style="width: 150px">
              <el-option label="All" value="" />
              <el-option label="Paired" value="paired" />
              <el-option label="Unpaired" value="unpaired" />
            </el-select>
            <el-input 
              v-model="pairingSearchForm.productSku" 
              placeholder="Product SKU" 
              clearable
              style="width: 200px"
            >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
            <el-input 
              v-model="pairingSearchForm.channelSku" 
              placeholder="Channel SKU" 
              clearable
              style="width: 200px"
            />
            <el-select 
              v-model="pairingSearchForm.channel" 
              placeholder="Channel" 
              clearable
              style="width: 200px"
            >
              <el-option 
                v-for="channel in channels" 
                :key="channel.value" 
                :label="channel.label" 
                :value="channel.value" 
              />
      </el-select>
            <el-button type="primary" @click="handleAddNewPairing">
              <el-icon><Plus /></el-icon>
              Add Pairing
            </el-button>
            <el-button type="primary" @click="handleBulkPairing">
              <el-icon><Upload /></el-icon>
              Bulk Pairing
            </el-button>
    </div>

          <!-- 数据表格 - 平铺展示 -->
          <el-table 
            :data="filteredPairingData" 
            style="width: 100%" 
            class="mapping-table"
            v-loading="pairingLoading"
            border
          >
            <el-table-column prop="channel" label="Channel" width="150" fixed="left">
        <template #default="{ row }">
                <el-tag size="small" type="info">{{ getChannelLabel(row.channel) }}</el-tag>
        </template>
      </el-table-column>
            <el-table-column prop="channelStoreName" label="Channel Store Name" min-width="180">
        <template #default="{ row }">
                <span>{{ row.channelStoreName || '-' }}</span>
        </template>
      </el-table-column>
            <el-table-column prop="channelSku" label="Channel SKU" min-width="180">
        <template #default="{ row }">
                <span class="sku-cell">{{ row.channelSku }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="productSku" label="Product SKU" min-width="180">
              <template #default="{ row }">
                <span v-if="row.productSku" class="sku-cell">{{ row.productSku }}</span>
                <el-tag v-else type="info" size="small">Unpaired</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="inventorySku" label="Inventory SKU" min-width="250">
              <template #default="{ row }">
                <div v-if="row.productSku" class="inventory-sku-container">
                  <el-tag
                    v-for="mapping in getInventorySkusByProductSku(row.productSku)"
                    :key="`${mapping.wms}_${mapping.inventorySku}`"
                    size="small"
                    type="success"
                    class="inventory-tag"
                  >
                    {{ getWmsLabel(mapping.wms) }}: {{ mapping.inventorySku }}
          </el-tag>
                  <span v-if="getInventorySkusByProductSku(row.productSku).length === 0" class="empty-text">-</span>
                </div>
                <span v-else class="empty-text">-</span>
        </template>
      </el-table-column>
            <el-table-column label="Actions" width="200" fixed="right">
        <template #default="{ row }">
                <el-button-group>
                  <el-button 
                    v-if="row.productSku"
                    type="primary" 
                    link 
                    @click="handleEditPairing(row)"
                  >
                    <el-icon><Edit /></el-icon>
                    Modify Pairing
                  </el-button>
                  <el-button 
                    v-if="row.productSku"
                    type="danger" 
                    link 
                    @click="handleUnpair(row.id)"
                  >
                    <el-icon><Delete /></el-icon>
                    Unpair
                  </el-button>
                  <el-button 
                    v-if="!row.productSku"
                    type="primary" 
                    link 
                    @click="handleEditPairing(row)"
                  >
                    <el-icon><Plus /></el-icon>
                    Add Pairing
                  </el-button>
                </el-button-group>
        </template>
      </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="pairingCurrentPage"
              v-model:page-size="pairingPageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="pairingTotal"
              layout="total, sizes, prev, pager, next"
              @size-change="handlePairingSizeChange"
              @current-change="handlePairingCurrentChange"
            />
          </div>
        </div>
      </el-tab-pane>

      <!-- Product Mapping Tab -->
      <el-tab-pane label="Product Mapping" name="mapping">
        <div class="tab-content">
          <!-- 说明卡片 -->
          <el-alert
            type="info"
            :closable="false"
            show-icon
            class="info-alert"
          >
            <template #title>
              <div class="alert-content">
                <div class="alert-title">Product Mapping Guide</div>
                <div class="alert-description">
                  <p><strong>Function:</strong> Product mapping establishes the relationship between Product SKU and Inventory SKU, enabling the mapping of product library items to warehouse inventory items.</p>
                  <p><strong>Business Rules:</strong></p>
                  <ul>
                    <li>One Product SKU within the same WMS can only be mapped to one Inventory SKU</li>
                    <li>One Product SKU can be mapped to multiple Inventory SKUs from different WMS</li>
                    <li>Channel SKU will be automatically displayed based on the Product SKU pairing relationship</li>
                    <li>Unmapped Inventory SKUs will not display Product SKU and Channel SKU</li>
                  </ul>
                  <p><strong>Operations:</strong></p>
                  <ul>
                    <li>Click "Add Mapping" to add Product SKU for unmapped Inventory SKU</li>
                    <li>Click "Modify Mapping" to change the mapped Product SKU (WMS and Inventory SKU cannot be modified)</li>
                    <li>Click "Unmap" to remove the mapping relationship</li>
                    <li>Support bulk import of mapping data, please download the template first, fill it in, and then upload</li>
                  </ul>
                  <p><strong>Order Processing Flow:</strong></p>
                  <ul>
                    <li><strong>Order Conversion:</strong> After product pairing, the Channel SKU has been converted to Product SKU</li>
                    <li><strong>Inventory Query:</strong> The system searches for the corresponding Inventory SKU based on the WMS and Product SKU specified in the order</li>
                    <li><strong>Mapping Lookup:</strong> If a mapping relationship is found, the system uses Inventory SKU to query real-time inventory information from the corresponding WMS</li>
                    <li><strong>Mapping Failure:</strong> If no mapping relationship is found, the inventory of that WMS cannot be queried, and the order may not be able to allocate inventory normally</li>
                    <li><strong>Order Shipping:</strong> When shipping orders, the system converts Product SKU to the corresponding WMS Inventory SKU based on the mapping relationship, ensuring that shipped products match warehouse inventory items</li>
                    <li><strong>Multi-Warehouse Support:</strong> One Product SKU can be mapped to multiple WMS, and the system will select the appropriate warehouse for shipping based on order requirements</li>
                  </ul>
                </div>
              </div>
            </template>
          </el-alert>

          <!-- 筛选栏 -->
          <div class="filter-bar">
            <el-select v-model="mappingFilter" placeholder="Filter Status" clearable style="width: 150px">
              <el-option label="All" value="" />
              <el-option label="Mapped" value="mapped" />
              <el-option label="Unmapped" value="unmapped" />
            </el-select>
            <el-input 
              v-model="mappingSearchForm.productSku" 
              placeholder="Product SKU" 
              clearable
              style="width: 200px"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-input 
              v-model="mappingSearchForm.inventorySku" 
              placeholder="Inventory SKU" 
              clearable
              style="width: 200px"
            />
            <el-select 
              v-model="mappingSearchForm.wms" 
              placeholder="WMS" 
              clearable
              style="width: 200px"
            >
              <el-option 
                v-for="wms in wmsList" 
                :key="wms.value" 
                :label="wms.label" 
                :value="wms.value" 
              />
            </el-select>
            <el-button type="primary" @click="handleAddNewMapping">
              <el-icon><Plus /></el-icon>
              Add Mapping
            </el-button>
            <el-button 
              type="success" 
              @click="handleGenerateProductSku" 
              :loading="generatingProductSku"
              :disabled="selectedUnmappedMappingRows.length === 0"
            >
              <el-icon><MagicStick /></el-icon>
              Generate Product SKU ({{ selectedUnmappedMappingRows.length }})
            </el-button>
            <el-button type="info" @click="handleRefreshInventorySku" :loading="refreshingInventorySku">
              <el-icon><Refresh /></el-icon>
              Refresh Inventory SKU
            </el-button>
            <el-button type="primary" @click="handleBulkMapping">
              <el-icon><Upload /></el-icon>
              Bulk Mapping
            </el-button>
          </div>

          <!-- 数据表格 - 平铺展示 -->
          <el-table 
            :data="filteredMappingData" 
            style="width: 100%" 
            class="mapping-table"
            v-loading="mappingLoading"
            border
            @selection-change="handleMappingSelectionChange"
            :row-key="(row: MappingItem) => row.id"
          >
            <el-table-column 
              type="selection" 
              width="55" 
              fixed="left"
              :selectable="(row: MappingItem) => !row.productSku"
            />
            <el-table-column prop="wms" label="WMS" width="150" fixed="left">
        <template #default="{ row }">
                <el-tag size="small" type="warning">{{ getWmsLabel(row.wms) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="inventorySku" label="Inventory SKU" min-width="180">
              <template #default="{ row }">
                <span class="sku-cell">{{ row.inventorySku }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="productSku" label="Product SKU" min-width="180">
              <template #default="{ row }">
                <span v-if="row.productSku" class="sku-cell">{{ row.productSku }}</span>
                <el-tag v-else type="info" size="small">Unmapped</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="channelSku" label="Channel SKU" min-width="250">
              <template #default="{ row }">
                <div v-if="row.productSku" class="channel-sku-container">
                  <el-tag
                    v-for="item in getChannelSkusByProductSku(row.productSku)"
                    :key="`${item.channel}_${item.channelSku}`"
                    size="small"
                    type="success"
                    class="channel-sku-tag"
                  >
                    {{ getChannelLabel(item.channel) }}: {{ item.channelSku }}
                  </el-tag>
                  <span v-if="getChannelSkusByProductSku(row.productSku).length === 0" class="empty-text">-</span>
          </div>
                <span v-else class="empty-text">-</span>
              </template>
            </el-table-column>
            <el-table-column label="Actions" width="200" fixed="right">
              <template #default="{ row }">
                <el-button-group>
                  <el-button 
                    v-if="row.productSku"
                    type="primary" 
                    link 
                    @click="handleEditMapping(row)"
                  >
                    <el-icon><Edit /></el-icon>
                    Modify Mapping
                  </el-button>
                  <el-button 
                    v-if="row.productSku"
                    type="danger" 
                    link 
                    @click="handleUnmap(row.id)"
                  >
                    <el-icon><Delete /></el-icon>
                    Unmap
                  </el-button>
                  <el-button 
                    v-if="!row.productSku"
                    type="primary" 
                    link 
                    @click="handleEditMapping(row)"
                  >
                    <el-icon><Plus /></el-icon>
                    Add Mapping
                  </el-button>
                </el-button-group>
        </template>
      </el-table-column>
    </el-table>

          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="mappingCurrentPage"
              v-model:page-size="mappingPageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="mappingTotal"
              layout="total, sizes, prev, pager, next"
              @size-change="handleMappingSizeChange"
              @current-change="handleMappingCurrentChange"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- Product Pairing Dialog -->
    <el-dialog
      v-model="pairingDialogVisible"
      :title="pairingIsEdit ? 'Modify Product Pairing' : 'Product Pairing'"
      width="600px"
      destroy-on-close
      class="product-dialog"
    >
      <el-form ref="pairingFormRef" :model="pairingForm" label-width="120px">
        <el-form-item label="Channel" required>
          <el-select 
            v-model="pairingForm.channel"
            placeholder="Select Channel"
            style="width: 100%"
            @change="handlePairingChannelChange"
            :disabled="pairingIsEdit"
          >
            <el-option
              v-for="channel in channels"
              :key="channel.value"
              :label="channel.label"
              :value="channel.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Channel Store Name">
          <el-input
            v-model="pairingForm.channelStoreName"
            placeholder="Enter Channel Store Name"
            style="width: 100%"
            :disabled="pairingIsEdit"
          />
        </el-form-item>
        <el-form-item label="Channel SKU" required>
          <el-input
            v-if="!pairingIsEdit && !pairingForm.id"
            v-model="pairingForm.channelSku"
            placeholder="Enter Channel SKU"
            style="width: 100%"
            :disabled="!pairingForm.channel"
          />
          <el-select
            v-else
            v-model="pairingForm.channelSku"
            placeholder="Select or Enter Channel SKU"
            filterable
            allow-create
            style="width: 100%"
            :disabled="!pairingForm.channel || pairingIsEdit"
          >
            <el-option
              v-for="sku in channelSkuOptions"
              :key="sku"
              :label="sku"
              :value="sku"
            />
          </el-select>
          <div class="form-tip" v-if="pairingForm.channel">
            One Channel SKU within the same Channel can only be paired with one Product SKU
        </div>
        </el-form-item>
        <el-form-item label="Product SKU" required>
          <el-select 
            v-model="pairingForm.productSku"
            placeholder="Select or Enter Product SKU"
            filterable
            allow-create
            style="width: 100%"
            @change="handleProductSkuChange"
          >
            <el-option
              v-for="sku in productSkuOptions"
              :key="sku"
              :label="sku"
              :value="sku"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Inventory SKU">
          <el-select
            v-model="pairingForm.inventorySku"
            placeholder="Will be auto-filled based on Product SKU"
            filterable
            allow-create
            style="width: 100%"
            clearable
            :disabled="true"
          >
            <el-option
              v-for="sku in inventorySkuOptions"
              :key="sku"
              :label="sku"
              :value="sku"
            />
          </el-select>
          <div class="form-tip" v-if="pairingForm.productSku">
            Inventory SKU has been auto-filled based on Product SKU
        </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pairingDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSavePairing">Save</el-button>
      </template>
    </el-dialog>

    <!-- Product Mapping Dialog -->
    <el-dialog
      v-model="mappingDialogVisible"
      :title="mappingIsEdit ? 'Edit Product Mapping' : 'Product Mapping'"
      width="600px"
      destroy-on-close
      class="product-dialog"
    >
      <el-form ref="mappingFormRef" :model="mappingForm" label-width="120px">
        <el-form-item label="WMS" required>
            <el-select
            v-model="mappingForm.wms"
            placeholder="Select WMS"
            style="width: 100%"
            @change="handleMappingWmsChange"
            :disabled="mappingIsEdit"
          >
            <el-option
              v-for="wms in wmsList"
              :key="wms.value"
              :label="wms.label"
              :value="wms.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Inventory SKU" required>
          <el-input
            v-if="!mappingIsEdit && !mappingForm.id"
            v-model="mappingForm.inventorySku"
            placeholder="Enter Inventory SKU"
            style="width: 100%"
            :disabled="!mappingForm.wms"
          />
          <el-select
            v-else
            v-model="mappingForm.inventorySku"
            placeholder="Select or Enter Inventory SKU"
              filterable
              allow-create
            style="width: 100%"
            :disabled="!mappingForm.wms || mappingIsEdit"
            >
              <el-option
              v-for="sku in inventorySkuOptions"
                :key="sku"
                :label="sku"
                :value="sku"
              />
            </el-select>
          <div class="form-tip" v-if="mappingForm.wms">
            One Product SKU within the same WMS can only be mapped to one Inventory SKU
          </div>
        </el-form-item>
        <el-form-item label="Product SKU" required>
            <el-select
            v-model="mappingForm.productSku"
            placeholder="Select or Enter Product SKU"
              filterable
              allow-create
            style="width: 100%"
            @change="handleMappingProductSkuChange"
            >
              <el-option
              v-for="sku in productSkuOptions"
                :key="sku"
                :label="sku"
                :value="sku"
              />
            </el-select>
        </el-form-item>
        <el-form-item label="Channel SKU">
          <div class="channel-sku-display">
            <el-tag
              v-for="item in getChannelSkusByProductSku(mappingForm.productSku)"
              :key="`${item.channel}_${item.channelSku}`"
              size="small"
              type="success"
              class="channel-sku-tag"
            >
              {{ getChannelLabel(item.channel) }}: {{ item.channelSku }}
            </el-tag>
            <span v-if="getChannelSkusByProductSku(mappingForm.productSku).length === 0" class="empty-text">-</span>
          </div>
          <div class="form-tip" v-if="mappingForm.productSku">
            Channel SKU has been auto-filled based on Product SKU
        </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="mappingDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSaveMapping">Save</el-button>
      </template>
    </el-dialog>

    <!-- Bulk Import Dialog -->
    <el-dialog
      v-model="importDialogVisible"
      :title="`Bulk Import - ${activeTab === 'pairing' ? 'Product Pairing' : 'Product Mapping'}`"
      width="600px"
      destroy-on-close
      class="import-dialog"
      @close="handleImportDialogClose"
    >
      <div class="import-container">
        <div class="import-header">
          <div class="import-title">
            <span class="label">Upload File</span>
            <el-link type="primary" :underline="false" @click="downloadTemplate">
              <el-icon><Download /></el-icon>
              Download Template
            </el-link>
          </div>
          <div class="import-desc">
            Supported formats: .xlsx, .xls, .csv (Max 10MB)
          </div>
        </div>
        
        <el-upload
          ref="uploadRef"
          class="upload-area"
          drag
          action="#"
          :auto-upload="false"
          :on-change="handleFileChange"
          :limit="1"
          accept=".csv,.xlsx,.xls"
          :file-list="importFile ? [{ name: importFile.name, raw: importFile }] : []"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            Drag file here or <em>click to upload</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              Support CSV, Excel (.xlsx, .xls) formats, max 10MB
            </div>
          </template>
        </el-upload>

        <div class="import-rules">
          <div class="rules-title">Import Rules:</div>
          <ul class="rules-list" v-if="activeTab === 'pairing'">
            <li>Required fields: Product SKU, Channel, Channel SKU</li>
            <li>One Channel SKU within the same Channel can only be paired with one Product SKU</li>
            <li>Channel format must be correct</li>
          </ul>
          <ul class="rules-list" v-else>
            <li>Required fields: Product SKU, WMS, Inventory SKU</li>
            <li>One Product SKU within the same WMS can only be mapped to one Inventory SKU</li>
            <li>WMS format must be correct</li>
          </ul>
        </div>
      </div>
      <template #footer>
        <el-button @click="importDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleImportSubmit" :disabled="!importFile">Upload</el-button>
      </template>
    </el-dialog>

    <!-- Import Result Dialog -->
    <el-dialog
      v-model="resultDialogVisible"
      title="Import Result"
      width="500px"
      class="result-dialog"
    >
      <div class="import-result">
        <div class="result-summary">
          <el-result
            :icon="importResult.failed > 0 ? 'warning' : 'success'"
            :title="getResultTitle()"
            :sub-title="getResultSubTitle()"
          >
            <template #extra>
              <el-button type="primary" @click="resultDialogVisible = false">OK</el-button>
              <el-button v-if="importResult.failed > 0" @click="copyFailedDetails">
                Copy Failed Details
              </el-button>
            </template>
          </el-result>
        </div>
        <div v-if="importResult.failed > 0" class="failed-details">
          <div class="details-title">Failed Details:</div>
          <el-scrollbar height="200px">
            <ul class="details-list">
              <li v-for="(reason, index) in importResult.reasons" :key="index">
                {{ reason }}
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { 
  Plus, 
  Upload, 
  Search, 
  Edit, 
  Delete, 
  UploadFilled, 
  Download,
  ArrowRight,
  MagicStick,
  Refresh
} from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

// Tab 状态
const activeTab = ref('pairing')

// ========== 商品配对相关 ==========
interface PairingItem {
  id: string
  productSku: string  // 未配对时为空字符串
  channel: string
  channelStoreName?: string
  channelSku: string  // Channel SKU 一定有值
  inventorySku?: string | null  // 根据 Product SKU 的映射关系决定
}

const pairingFilter = ref('')
const pairingSearchForm = reactive({
  productSku: '',
  channelSku: '',
  channel: ''
})

const pairingList = ref<PairingItem[]>([])
const pairingLoading = ref(false)
const pairingCurrentPage = ref(1)
const pairingPageSize = ref(10)

const pairingDialogVisible = ref(false)
const pairingIsEdit = ref(false)
const pairingFormRef = ref<FormInstance>()
const pairingForm = reactive({
  id: '',
  productSku: '',
  channel: '',
  channelStoreName: '',
  channelSku: '',
  inventorySku: ''
})

// ========== 商品映射相关 ==========
interface MappingItem {
  id: string
  productSku: string  // 未映射时为空字符串
  wms: string
  inventorySku: string  // Inventory SKU 一定有值
  channelSku?: string  // 根据 Product SKU 的配对关系决定
}

const mappingFilter = ref('')
const mappingSearchForm = reactive({
  productSku: '',
  inventorySku: '',
  wms: ''
})

const mappingList = ref<MappingItem[]>([])
const mappingLoading = ref(false)
const mappingCurrentPage = ref(1)
const mappingPageSize = ref(10)
const generatingProductSku = ref(false)
const refreshingInventorySku = ref(false)
const refreshTimer = ref<NodeJS.Timeout | null>(null)
const selectedMappingRows = ref<MappingItem[]>([])

const mappingDialogVisible = ref(false)
const mappingIsEdit = ref(false)
const mappingFormRef = ref<FormInstance>()
const mappingForm = reactive({
  id: '',
  productSku: '',
  wms: '',
  inventorySku: '',
  channelSku: ''
})

// 上传组件引用
const uploadRef = ref()

// ========== 选项数据 ==========
const channels = ref([
  { value: 'amazon', label: 'Amazon' },
  { value: 'ebay', label: 'eBay' },
  { value: 'shopify', label: 'Shopify' },
  { value: 'QQQ', label: 'shopify (QQQ)' }
])

const wmsList = ref([
  { value: 'wms1', label: 'WMS 1' },
  { value: 'wms2', label: 'WMS 2' },
  { value: 'wms3', label: 'WMS 3' }
])

const productSkuOptions = ref<string[]>([])
const channelSkuOptions = ref<string[]>([])
const inventorySkuOptions = ref<string[]>([])

// ========== 批量导入相关 ==========
const importDialogVisible = ref(false)
const resultDialogVisible = ref(false)
const importFile = ref<File | null>(null)
const importResult = reactive({
  success: 0,
  failed: 0,
  reasons: [] as string[]
})

// ========== 展开行状态 ==========
const expandedPairingRows = ref<string[]>([])
const expandedMappingRows = ref<string[]>([])

// ========== 计算属性 ==========
// 商品配对筛选后的数据 - 平铺展示
const filteredPairingData = computed(() => {
  // 先过滤掉没有 channelSku 的行
  let filteredData = pairingList.value.filter(item => item.channelSku)

  // 状态筛选
  if (pairingFilter.value === 'unpaired') {
    // 未配对：Product SKU 为空
    filteredData = filteredData.filter(item => !item.productSku)
  } else if (pairingFilter.value === 'paired') {
    // 已配对：Product SKU 有值
    filteredData = filteredData.filter(item => !!item.productSku)
  }

  // 搜索筛选
  if (pairingSearchForm.productSku) {
    filteredData = filteredData.filter(item => 
      item.productSku && item.productSku.toLowerCase().includes(pairingSearchForm.productSku.toLowerCase())
    )
  }
  if (pairingSearchForm.channelSku) {
    filteredData = filteredData.filter(item => 
      item.channelSku.toLowerCase().includes(pairingSearchForm.channelSku.toLowerCase())
    )
  }
  if (pairingSearchForm.channel) {
    filteredData = filteredData.filter(item => item.channel === pairingSearchForm.channel)
  }

  // 排序：按 Channel、Channel SKU、Product SKU
  filteredData.sort((a, b) => {
    if (a.channel !== b.channel) {
      return a.channel.localeCompare(b.channel)
    }
    if (a.channelSku !== b.channelSku) {
      return a.channelSku.localeCompare(b.channelSku)
    }
    return (a.productSku || '').localeCompare(b.productSku || '')
  })

  // 分页
  const start = (pairingCurrentPage.value - 1) * pairingPageSize.value
  const end = start + pairingPageSize.value
  return filteredData.slice(start, end)
})

const pairingTotal = computed(() => {
  // 先过滤掉没有 channelSku 的行
  let filteredData = pairingList.value.filter(item => item.channelSku)

  if (pairingFilter.value === 'paired') {
    filteredData = filteredData.filter(item => !!item.productSku)
  } else if (pairingFilter.value === 'unpaired') {
    filteredData = filteredData.filter(item => !item.productSku)
  }
  if (pairingSearchForm.productSku) {
    filteredData = filteredData.filter(item => 
      item.productSku && item.productSku.toLowerCase().includes(pairingSearchForm.productSku.toLowerCase())
    )
  }
  if (pairingSearchForm.channelSku) {
    filteredData = filteredData.filter(item => 
      item.channelSku.toLowerCase().includes(pairingSearchForm.channelSku.toLowerCase())
    )
  }
  if (pairingSearchForm.channel) {
    filteredData = filteredData.filter(item => item.channel === pairingSearchForm.channel)
  }

  return filteredData.length
})

// 商品映射筛选后的数据 - 平铺展示
const filteredMappingData = computed(() => {
  // 先过滤掉没有 inventorySku 的行
  let filteredData = mappingList.value.filter(item => item.inventorySku)

  // 状态筛选
  if (mappingFilter.value === 'unmapped') {
    // 未映射：Product SKU 为空
    filteredData = filteredData.filter(item => !item.productSku)
  } else if (mappingFilter.value === 'mapped') {
    // 已映射：Product SKU 有值
    filteredData = filteredData.filter(item => !!item.productSku)
  }

  // 搜索筛选
  if (mappingSearchForm.productSku) {
    filteredData = filteredData.filter(item => 
      item.productSku && item.productSku.toLowerCase().includes(mappingSearchForm.productSku.toLowerCase())
    )
  }
  if (mappingSearchForm.inventorySku) {
    filteredData = filteredData.filter(item => 
      item.inventorySku.toLowerCase().includes(mappingSearchForm.inventorySku.toLowerCase())
    )
  }
  if (mappingSearchForm.wms) {
    filteredData = filteredData.filter(item => item.wms === mappingSearchForm.wms)
  }

  // 排序：按 WMS、Inventory SKU、Product SKU
  filteredData.sort((a, b) => {
    if (a.wms !== b.wms) {
      return a.wms.localeCompare(b.wms)
    }
    if (a.inventorySku !== b.inventorySku) {
      return a.inventorySku.localeCompare(b.inventorySku)
    }
    return (a.productSku || '').localeCompare(b.productSku || '')
  })

  // 分页
  const start = (mappingCurrentPage.value - 1) * mappingPageSize.value
  const end = start + mappingPageSize.value
  return filteredData.slice(start, end)
})

const mappingTotal = computed(() => {
  // 先过滤掉没有 inventorySku 的行
  let filteredData = mappingList.value.filter(item => item.inventorySku)

  if (mappingFilter.value === 'mapped') {
    filteredData = filteredData.filter(item => !!item.productSku)
  } else if (mappingFilter.value === 'unmapped') {
    filteredData = filteredData.filter(item => !item.productSku)
  }
  if (mappingSearchForm.productSku) {
    filteredData = filteredData.filter(item => 
      item.productSku && item.productSku.toLowerCase().includes(mappingSearchForm.productSku.toLowerCase())
    )
  }
  if (mappingSearchForm.inventorySku) {
    filteredData = filteredData.filter(item => 
      item.inventorySku.toLowerCase().includes(mappingSearchForm.inventorySku.toLowerCase())
    )
  }
  if (mappingSearchForm.wms) {
    filteredData = filteredData.filter(item => item.wms === mappingSearchForm.wms)
  }

  return filteredData.length
})

// ========== 方法 ==========
const getChannelLabel = (value: string) => {
  const channel = channels.value.find(c => c.value === value)
  return channel ? channel.label : value
}

const getWmsLabel = (value: string) => {
  const wms = wmsList.value.find(w => w.value === value)
  return wms ? wms.label : value
}


// 根据 Product SKU 查找对应的所有 Channel + Channel SKU 组合
const getChannelSkusByProductSku = (productSku: string): Array<{ channel: string; channelSku: string }> => {
  // 从商品配对列表中查找该 Product SKU 对应的所有 Channel SKU（包含 Channel）
  return pairingList.value
    .filter(item => item.productSku === productSku && item.channelSku)
    .map(item => ({
      channel: item.channel,
      channelSku: item.channelSku
    }))
}

// 商品配对相关方法
const handleAddPairingForChannelSku = (channel: string, channelSku: string) => {
  pairingIsEdit.value = false
  Object.assign(pairingForm, {
    id: '',
    productSku: '',
    channel,
    channelStoreName: '',
    channelSku,
    inventorySku: ''
  })
  pairingDialogVisible.value = true
}

const handleAddPairingForProduct = (productSku: string) => {
  pairingIsEdit.value = false
  Object.assign(pairingForm, {
    id: '',
    productSku,
    channel: '',
    channelStoreName: '',
    channelSku: '',
    inventorySku: ''
  })
  pairingDialogVisible.value = true
}

const handleEditPairing = (row: PairingItem) => {
  pairingIsEdit.value = !!row.productSku
  Object.assign(pairingForm, {
    id: row.id,
    productSku: row.productSku || '',
    channel: row.channel,
    channelStoreName: row.channelStoreName || '',
    channelSku: row.channelSku,
    inventorySku: row.inventorySku || ''
  })
  pairingDialogVisible.value = true
}

const handleUnpair = (pairingId: string) => {
  ElMessageBox.confirm(
    'Are you sure you want to unpair? Product SKU and Inventory SKU will be cleared after unpairing.',
    'Warning',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  ).then(() => {
    const item = pairingList.value.find(p => p.id === pairingId)
    if (item) {
      item.productSku = ''
      item.inventorySku = null
      ElMessage.success('Unpaired successfully')
    }
  })
}

const handlePairingChannelChange = (value: string) => {
  if (value) {
    // 模拟根据 channel 获取可用的 channel sku
    channelSkuOptions.value = ['CH-SKU-001', 'CH-SKU-002', 'CH-SKU-003']
  } else {
    channelSkuOptions.value = []
  }
}

// 根据 Product SKU 查找对应的所有 WMS + Inventory SKU 组合
const getInventorySkusByProductSku = (productSku: string): Array<{ wms: string; inventorySku: string }> => {
  // 从商品映射列表中查找该 Product SKU 对应的所有 Inventory SKU（包含 WMS）
  return mappingList.value
    .filter(item => item.productSku === productSku && item.inventorySku)
    .map(item => ({
      wms: item.wms,
      inventorySku: item.inventorySku!
    }))
}

// 根据 Product SKU 查找对应的第一个 Inventory SKU（用于向后兼容）
const getInventorySkuByProductSku = (productSku: string): string | null => {
  const mappings = getInventorySkusByProductSku(productSku)
  return mappings.length > 0 ? mappings[0].inventorySku : null
}

// 处理 Product SKU 变化，自动填充 Inventory SKU
const handleProductSkuChange = (productSku: string) => {
  if (productSku) {
    const inventorySku = getInventorySkuByProductSku(productSku)
    if (inventorySku) {
      pairingForm.inventorySku = inventorySku
      // 更新可选项
      if (!inventorySkuOptions.value.includes(inventorySku)) {
        inventorySkuOptions.value.push(inventorySku)
      }
    } else {
      pairingForm.inventorySku = ''
    }
  } else {
    pairingForm.inventorySku = ''
  }
}

const handleSavePairing = () => {
  if (!pairingForm.productSku || !pairingForm.channel || !pairingForm.channelSku) {
    ElMessage.warning('Please fill in all required information')
    return
  }

  // Validate: one Channel SKU within the same Channel can only be paired with one Product SKU
  const existingPairing = pairingList.value.find(
    item => item.channel === pairingForm.channel && 
            item.channelSku === pairingForm.channelSku &&
            item.id !== pairingForm.id
  )
  if (existingPairing) {
    ElMessage.error(`This Channel SKU has already been paired with Product SKU "${existingPairing.productSku}"`)
    return
  }

  if (pairingIsEdit.value) {
    // Edit mode - only update Product SKU (other fields cannot be modified)
    const item = pairingList.value.find(p => p.id === pairingForm.id)
    if (item) {
      item.productSku = pairingForm.productSku
      // Auto-get Inventory SKU based on Product SKU
      const inventorySku = getInventorySkuByProductSku(pairingForm.productSku)
      item.inventorySku = inventorySku
      ElMessage.success('Saved successfully')
    }
  } else {
    // Add mode - add pairing for unpaired Channel SKU or create new pairing
    const item = pairingList.value.find(p => p.id === pairingForm.id)
    if (item) {
      // Update existing item (unpaired)
      item.channelStoreName = pairingForm.channelStoreName || undefined
      item.productSku = pairingForm.productSku
      // Auto-get Inventory SKU based on Product SKU
      const inventorySku = getInventorySkuByProductSku(pairingForm.productSku)
      item.inventorySku = inventorySku
      ElMessage.success('Pairing successful')
    } else {
      // Check if Channel + Channel SKU combination already exists
      const existingItem = pairingList.value.find(
        p => p.channel === pairingForm.channel && p.channelSku === pairingForm.channelSku
      )
      if (existingItem) {
        // Update existing item
        existingItem.channelStoreName = pairingForm.channelStoreName || undefined
        existingItem.productSku = pairingForm.productSku
        // Auto-get Inventory SKU based on Product SKU
        const inventorySku = getInventorySkuByProductSku(pairingForm.productSku)
        existingItem.inventorySku = inventorySku
        ElMessage.success('Pairing successful')
      } else {
        // Create new item (manual add or new Channel SKU)
        const inventorySku = getInventorySkuByProductSku(pairingForm.productSku)
        pairingList.value.push({
          id: `pairing_${pairingForm.channelSku}_${pairingForm.channel}_${Date.now()}`,
          productSku: pairingForm.productSku,
          channel: pairingForm.channel,
          channelStoreName: pairingForm.channelStoreName || undefined,
          channelSku: pairingForm.channelSku,
          inventorySku: inventorySku
        })
        // Add to options if not exists
        if (!channelSkuOptions.value.includes(pairingForm.channelSku)) {
          channelSkuOptions.value.push(pairingForm.channelSku)
        }
        ElMessage.success('Pairing successful')
      }
    }
  }

  pairingDialogVisible.value = false
}

// 商品映射相关方法
const handleAddMappingForInventorySku = (wms: string, inventorySku: string) => {
  mappingIsEdit.value = false
  Object.assign(mappingForm, {
    id: '',
    productSku: '',
    wms,
    inventorySku,
    channelSku: ''
  })
  mappingDialogVisible.value = true
}

const handleEditMapping = (row: MappingItem) => {
  mappingIsEdit.value = !!row.productSku
  Object.assign(mappingForm, {
    id: row.id,
    productSku: row.productSku || '',
    wms: row.wms,
    inventorySku: row.inventorySku,
    channelSku: row.channelSku || ''
  })
  mappingDialogVisible.value = true
}

const handleUnmap = (mappingId: string) => {
  ElMessageBox.confirm(
    'Are you sure you want to unmap? Product SKU and Channel SKU will be cleared after unmapping.',
    'Warning',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  ).then(() => {
    const item = mappingList.value.find(m => m.id === mappingId)
    if (item) {
      item.productSku = ''
      item.channelSku = undefined
      ElMessage.success('Unmapped successfully')
    }
  })
}

const handleMappingWmsChange = (value: string) => {
  if (value) {
    // 模拟根据 wms 获取可用的 inventory sku
    inventorySkuOptions.value = ['INV-SKU-001', 'INV-SKU-002', 'INV-SKU-003']
  } else {
    inventorySkuOptions.value = []
  }
}

// 处理 Product SKU 变化，自动填充 Channel SKU
const handleMappingProductSkuChange = (productSku: string) => {
  // Channel SKU 会自动显示，不需要手动设置
}

const handleSaveMapping = () => {
  if (!mappingForm.productSku || !mappingForm.wms || !mappingForm.inventorySku) {
    ElMessage.warning('Please fill in all required information')
    return
  }

  // Validate: one Product SKU within the same WMS can only be mapped to one Inventory SKU
  const existingMapping = mappingList.value.find(
    item => item.wms === mappingForm.wms && 
            item.productSku === mappingForm.productSku &&
            item.id !== mappingForm.id
  )
  if (existingMapping && existingMapping.inventorySku) {
    ElMessage.error(`This Product SKU in this WMS has already been mapped to Inventory SKU "${existingMapping.inventorySku}"`)
    return
  }

  if (mappingIsEdit.value) {
    // Edit mode - only update Product SKU (other fields cannot be modified)
    const item = mappingList.value.find(m => m.id === mappingForm.id)
    if (item) {
      item.productSku = mappingForm.productSku
      // Auto-get Channel SKU based on Product SKU
      const channelSkus = getChannelSkusByProductSku(mappingForm.productSku)
      item.channelSku = channelSkus.length > 0 ? channelSkus[0].channelSku : undefined
      ElMessage.success('Saved successfully')
    }
  } else {
    // Add mode - add mapping for unmapped Inventory SKU or create new mapping
    const item = mappingList.value.find(m => m.id === mappingForm.id)
    if (item) {
      // Update existing item (unmapped)
      item.productSku = mappingForm.productSku
      // Auto-get Channel SKU based on Product SKU
      const channelSkus = getChannelSkusByProductSku(mappingForm.productSku)
      item.channelSku = channelSkus.length > 0 ? channelSkus[0].channelSku : undefined
      ElMessage.success('Mapping successful')
    } else {
      // Check if WMS + Inventory SKU combination already exists
      const existingItem = mappingList.value.find(
        m => m.wms === mappingForm.wms && m.inventorySku === mappingForm.inventorySku
      )
      if (existingItem) {
        // Update existing item
        existingItem.productSku = mappingForm.productSku
        // Auto-get Channel SKU based on Product SKU
        const channelSkus = getChannelSkusByProductSku(mappingForm.productSku)
        existingItem.channelSku = channelSkus.length > 0 ? channelSkus[0].channelSku : undefined
        ElMessage.success('Mapping successful')
      } else {
        // Create new item (manual add or new Inventory SKU)
        const channelSkus = getChannelSkusByProductSku(mappingForm.productSku)
        mappingList.value.push({
          id: `mapping_${mappingForm.inventorySku}_${mappingForm.wms}_${Date.now()}`,
          productSku: mappingForm.productSku,
          wms: mappingForm.wms,
          inventorySku: mappingForm.inventorySku,
          channelSku: channelSkus.length > 0 ? channelSkus[0].channelSku : undefined
        })
        // Add to options if not exists
        if (!inventorySkuOptions.value.includes(mappingForm.inventorySku)) {
          inventorySkuOptions.value.push(mappingForm.inventorySku)
        }
        ElMessage.success('Mapping successful')
      }
    }
  }

  mappingDialogVisible.value = false
}

// 分页处理
const handlePairingSizeChange = (val: number) => {
  pairingPageSize.value = val
  pairingCurrentPage.value = 1
}

const handlePairingCurrentChange = (val: number) => {
  pairingCurrentPage.value = val
}

const handleMappingSizeChange = (val: number) => {
  mappingPageSize.value = val
  mappingCurrentPage.value = 1
}

const handleMappingCurrentChange = (val: number) => {
  mappingCurrentPage.value = val
}

// Handle add new pairing (manual)
const handleAddNewPairing = () => {
  pairingIsEdit.value = false
  Object.assign(pairingForm, {
    id: '',
    productSku: '',
    channel: '',
    channelStoreName: '',
    channelSku: '',
    inventorySku: ''
  })
  pairingDialogVisible.value = true
}

// Bulk pairing
const handleBulkPairing = () => {
  importFile.value = null
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
  importDialogVisible.value = true
}

// Handle add new mapping (manual)
const handleAddNewMapping = () => {
  mappingIsEdit.value = false
  Object.assign(mappingForm, {
    id: '',
    productSku: '',
    wms: '',
    inventorySku: '',
    channelSku: ''
  })
  mappingDialogVisible.value = true
}

// Bulk mapping
const handleBulkMapping = () => {
  importFile.value = null
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
  importDialogVisible.value = true
}

// Handle mapping table selection change
const handleMappingSelectionChange = (selection: MappingItem[]) => {
  selectedMappingRows.value = selection
}

// Get selected unmapped rows
const selectedUnmappedMappingRows = computed(() => {
  return selectedMappingRows.value.filter(row => !row.productSku)
})

// Generate Product SKU from Inventory SKU (only for selected unmapped items)
const handleGenerateProductSku = async () => {
  const selectedUnmapped = selectedUnmappedMappingRows.value
  
  if (selectedUnmapped.length === 0) {
    ElMessage.warning('Please select unmapped Inventory SKU(s) first')
    return
  }

  ElMessageBox.confirm(
    `This will generate Product SKU for ${selectedUnmapped.length} selected unmapped Inventory SKU(s). Continue?`,
    'Generate Product SKU',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'info',
    }
  ).then(async () => {
    generatingProductSku.value = true
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      let successCount = 0
      let failCount = 0
      
      selectedUnmapped.forEach(item => {
        // Generate Product SKU based on Inventory SKU
        // Format: PROD-{WMS}-{Inventory SKU}
        const generatedProductSku = `PROD-${item.wms.toUpperCase()}-${item.inventorySku}`
        
        // Check if this Product SKU already exists for this WMS
        const existingMapping = mappingList.value.find(
          m => m.wms === item.wms && 
               m.productSku === generatedProductSku &&
               m.id !== item.id
        )
        
        if (existingMapping) {
          // If exists, use the existing Product SKU
          item.productSku = generatedProductSku
          const channelSkus = getChannelSkusByProductSku(generatedProductSku)
          item.channelSku = channelSkus.length > 0 ? channelSkus[0].channelSku : undefined
          successCount++
        } else {
          // Generate new Product SKU
          item.productSku = generatedProductSku
          const channelSkus = getChannelSkusByProductSku(generatedProductSku)
          item.channelSku = channelSkus.length > 0 ? channelSkus[0].channelSku : undefined
          
          // Add to product SKU options if not exists
          if (!productSkuOptions.value.includes(generatedProductSku)) {
            productSkuOptions.value.push(generatedProductSku)
          }
          successCount++
        }
      })
      
      // Clear selection after generation
      selectedMappingRows.value = []
      
      ElMessage.success(`Successfully generated Product SKU for ${successCount} Inventory SKU(s)`)
    } catch (error) {
      console.error('Generate Product SKU failed:', error)
      ElMessage.error('Failed to generate Product SKU')
    } finally {
      generatingProductSku.value = false
    }
  }).catch(() => {
    // User cancelled
  })
}

// Refresh Inventory SKU from warehouse
const handleRefreshInventorySku = async () => {
  refreshingInventorySku.value = true
  
  try {
    // Simulate API call to fetch latest inventory SKU from warehouse
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock: Fetch new inventory SKUs from each WMS
    const newInventorySkus: Array<{ wms: string; inventorySku: string }> = []
    
    wmsList.value.forEach(wms => {
      // Simulate fetching new inventory SKUs
      const mockNewSkus = [
        `INV-${wms.value.toUpperCase()}-NEW-001`,
        `INV-${wms.value.toUpperCase()}-NEW-002`,
        `INV-${wms.value.toUpperCase()}-NEW-003`
      ]
      
      mockNewSkus.forEach(sku => {
        // Check if this inventory SKU already exists
        const existingItem = mappingList.value.find(
          item => item.wms === wms.value && item.inventorySku === sku
        )
        
        if (!existingItem) {
          newInventorySkus.push({ wms: wms.value, inventorySku: sku })
          // Add new inventory SKU to the list
          mappingList.value.push({
            id: `mapping_${sku}_${wms.value}_${Date.now()}`,
            productSku: '',
            wms: wms.value,
            inventorySku: sku,
            channelSku: undefined
          })
          
          // Add to options if not exists
          if (!inventorySkuOptions.value.includes(sku)) {
            inventorySkuOptions.value.push(sku)
          }
        }
      })
    })
    
    if (newInventorySkus.length > 0) {
      ElMessage.success(`Refreshed successfully. Found ${newInventorySkus.length} new Inventory SKU(s)`)
    } else {
      ElMessage.info('No new Inventory SKU found')
    }
  } catch (error) {
    console.error('Refresh Inventory SKU failed:', error)
    ElMessage.error('Failed to refresh Inventory SKU')
  } finally {
    refreshingInventorySku.value = false
  }
}

// Auto refresh Inventory SKU (every 5 minutes)
const startAutoRefresh = () => {
  // Clear existing timer if any
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value)
  }
  
  // Refresh every 5 minutes (300000 ms)
  refreshTimer.value = setInterval(() => {
    if (activeTab.value === 'mapping') {
      handleRefreshInventorySku()
    }
  }, 300000) // 5 minutes
}

// Stop auto refresh
const stopAutoRefresh = () => {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value)
    refreshTimer.value = null
  }
}

// 关闭导入对话框
const handleImportDialogClose = () => {
  importFile.value = null
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
}

// 文件选择处理
const handleFileChange = (file: any) => {
  importFile.value = file.raw
}

// Download template
const downloadTemplate = () => {
  const isPairing = activeTab.value === 'pairing'
  const headers = isPairing 
    ? ['Channel', 'Channel Store Name', 'Channel SKU', 'Product SKU']
    : ['WMS', 'Inventory SKU', 'Product SKU']
  
  // 创建CSV内容
  const csvContent = [
    headers.join(','),
    isPairing
      ? 'amazon,Store A,CH-SKU-001,PROD-001'
      : 'wms1,INV-SKU-001,PROD-001'
  ].join('\n')
  
  // Add BOM to support special characters
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = isPairing ? 'Product_Pairing_Import_Template.csv' : 'Product_Mapping_Import_Template.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  ElMessage.success('Template downloaded successfully')
}

// 解析CSV文件
const parseCSV = (text: string): string[][] => {
  const lines = text.split('\n').filter(line => line.trim())
  return lines.map(line => {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  })
}

// Submit import
const handleImportSubmit = async () => {
  if (!importFile.value) {
    ElMessage.warning('Please select a file first')
    return
  }

  const isPairing = activeTab.value === 'pairing'
  const reader = new FileReader()
  
  reader.onload = (e) => {
    try {
      const text = e.target?.result as string
      const rows = parseCSV(text)
      
      if (rows.length < 2) {
        ElMessage.error('File format error: At least header row and one data row are required')
        return
      }

      const headers = rows[0]
      const dataRows = rows.slice(1)
      const errors: string[] = []
      let successCount = 0
      let failCount = 0

      if (isPairing) {
        // Validate headers
        const expectedHeaders = ['Channel', 'Channel Store Name', 'Channel SKU', 'Product SKU']
        if (!expectedHeaders.every(h => headers.includes(h))) {
          ElMessage.error('File format error: Incorrect headers')
          return
        }

        // Process each row
        dataRows.forEach((row, index) => {
          const rowNum = index + 2 // Excel row number starts from 2 (row 1 is header)
          const channel = row[headers.indexOf('Channel')]?.trim()
          const channelStoreName = row[headers.indexOf('Channel Store Name')]?.trim()
          const channelSku = row[headers.indexOf('Channel SKU')]?.trim()
          const productSku = row[headers.indexOf('Product SKU')]?.trim()

          // Validate required fields
          if (!channel || !channelSku || !productSku) {
            errors.push(`Row ${rowNum}: Missing required fields`)
            failCount++
            return
          }

          // Validate Channel
          const validChannel = channels.value.find(c => c.value === channel || c.label === channel)
          if (!validChannel) {
            errors.push(`Row ${rowNum}: Channel "${channel}" format error`)
            failCount++
            return
          }

          // Check if pairing already exists
          const existingPairing = pairingList.value.find(
            item => item.channel === validChannel.value && item.channelSku === channelSku
          )

          if (existingPairing) {
            if (existingPairing.productSku) {
              // Update paired item
              existingPairing.productSku = productSku
              const inventorySku = getInventorySkuByProductSku(productSku)
              existingPairing.inventorySku = inventorySku
            } else {
              // Update unpaired item
              existingPairing.channelStoreName = channelStoreName || undefined
              existingPairing.productSku = productSku
              const inventorySku = getInventorySkuByProductSku(productSku)
              existingPairing.inventorySku = inventorySku
            }
            successCount++
          } else {
            // Create new item
            const inventorySku = getInventorySkuByProductSku(productSku)
            pairingList.value.push({
              id: `pairing_${channelSku}_${validChannel.value}_${Date.now()}_${index}`,
              productSku,
              channel: validChannel.value,
              channelStoreName: channelStoreName || undefined,
              channelSku,
              inventorySku
            })
            successCount++
          }
        })
      } else {
        // Product Mapping
        const expectedHeaders = ['WMS', 'Inventory SKU', 'Product SKU']
        if (!expectedHeaders.every(h => headers.includes(h))) {
          ElMessage.error('File format error: Incorrect headers')
          return
        }

        // Process each row
        dataRows.forEach((row, index) => {
          const rowNum = index + 2
          const wms = row[headers.indexOf('WMS')]?.trim()
          const inventorySku = row[headers.indexOf('Inventory SKU')]?.trim()
          const productSku = row[headers.indexOf('Product SKU')]?.trim()

          // Validate required fields
          if (!wms || !inventorySku || !productSku) {
            errors.push(`Row ${rowNum}: Missing required fields`)
            failCount++
            return
          }

          // Validate WMS
          const validWms = wmsList.value.find(w => w.value === wms || w.label === wms)
          if (!validWms) {
            errors.push(`Row ${rowNum}: WMS "${wms}" format error`)
            failCount++
            return
          }

          // Check if mapping already exists
          const existingMapping = mappingList.value.find(
            item => item.wms === validWms.value && item.inventorySku === inventorySku
          )

          if (existingMapping) {
            // Update mapping
            existingMapping.productSku = productSku
            const channelSkus = getChannelSkusByProductSku(productSku)
            existingMapping.channelSku = channelSkus.length > 0 ? channelSkus[0].channelSku : undefined
            successCount++
          } else {
            // Create new item
            const channelSkus = getChannelSkusByProductSku(productSku)
            mappingList.value.push({
              id: `mapping_${inventorySku}_${validWms.value}_${Date.now()}_${index}`,
              productSku,
              wms: validWms.value,
              inventorySku,
              channelSku: channelSkus.length > 0 ? channelSkus[0].channelSku : undefined
            })
            successCount++
          }
        })
      }

      // Show results
      importResult.success = successCount
      importResult.failed = failCount
      importResult.reasons = errors
  importDialogVisible.value = false
  resultDialogVisible.value = true

      if (failCount === 0) {
        ElMessage.success(`Successfully imported ${successCount} records`)
      }
    } catch (error) {
      console.error('Import failed:', error)
      ElMessage.error('File parsing failed, please check the file format')
    }
  }

  reader.readAsText(importFile.value, 'UTF-8')
}

const getResultTitle = () => {
  if (importResult.failed === 0) {
    return 'Import Successful'
  }
  return 'Partially Imported'
}

const getResultSubTitle = () => {
  const parts = []
  if (importResult.success > 0) {
    parts.push(`Successfully imported ${importResult.success} records`)
  }
  if (importResult.failed > 0) {
    parts.push(`Failed ${importResult.failed} records`)
  }
  return parts.join(', ')
}

const copyFailedDetails = () => {
  const text = importResult.reasons.join('\n')
  navigator.clipboard.writeText(text)
  ElMessage({
    type: 'success',
    message: 'Copied to clipboard',
  })
}

// 初始化模拟数据
const initMockData = async () => {
  pairingLoading.value = true
  mappingLoading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 生成商品配对模拟数据
    const pairingData: PairingItem[] = []
    const productSkus = ['PROD-001', 'PROD-002', 'PROD-003', 'PROD-004', 'PROD-005']
    const channelSkus = ['CH-SKU-001', 'CH-SKU-002', 'CH-SKU-003', 'CH-SKU-004', 'CH-SKU-005', 'CH-SKU-006', 'CH-SKU-007', 'CH-SKU-008']
    const storeNames = ['店铺A', '店铺B', '店铺C']
    
    // 生成已配对的数据（有 Product SKU）
    productSkus.slice(0, 3).forEach((productSku, index) => {
      channels.value.slice(0, 2).forEach((channel, chIndex) => {
        const inventorySku = getInventorySkuByProductSku(productSku)
        pairingData.push({
          id: `pairing_${productSku}_${channel.value}_${index}_${chIndex}`,
          productSku,
          channel: channel.value,
          channelStoreName: storeNames[chIndex % storeNames.length],
          channelSku: channelSkus[index * 2 + chIndex],
          inventorySku: inventorySku
        })
      })
    })
    
    // 生成未配对的数据（Channel SKU 有值，但 Product SKU 为空）
    channels.value.forEach((channel, chIndex) => {
      pairingData.push({
        id: `pairing_unpaired_${channel.value}_${chIndex}`,
        productSku: '',
        channel: channel.value,
        channelStoreName: storeNames[chIndex % storeNames.length],
        channelSku: channelSkus[chIndex + 6], // 使用不同的 Channel SKU
        inventorySku: null
      })
    })
    
    pairingList.value = pairingData
    
    // 生成商品映射模拟数据
    const mappingData: MappingItem[] = []
    
    const inventorySkus = ['INV-SKU-001', 'INV-SKU-002', 'INV-SKU-003', 'INV-SKU-004', 'INV-SKU-005', 'INV-SKU-006', 'INV-SKU-007', 'INV-SKU-008']
    
    // 生成已映射的数据（有 Product SKU）
    productSkus.slice(0, 3).forEach((productSku, index) => {
      wmsList.value.slice(0, 2).forEach((wms, wmsIndex) => {
        const channelSkus = getChannelSkusByProductSku(productSku)
        mappingData.push({
          id: `mapping_${productSku}_${wms.value}_${index}_${wmsIndex}`,
          productSku,
          wms: wms.value,
          inventorySku: inventorySkus[index * 2 + wmsIndex],
          channelSku: channelSkus.length > 0 ? channelSkus[0].channelSku : undefined
        })
      })
    })
    
    // 生成未映射的数据（Inventory SKU 有值，但 Product SKU 为空）
    wmsList.value.forEach((wms, wmsIndex) => {
      mappingData.push({
        id: `mapping_unmapped_${wms.value}_${wmsIndex}`,
        productSku: '',
        wms: wms.value,
        inventorySku: inventorySkus[wmsIndex + 6], // 使用不同的 Inventory SKU
        channelSku: undefined
      })
    })
    
    mappingList.value = mappingData
    
    // 初始化选项数据
    productSkuOptions.value = productSkus
  } finally {
    pairingLoading.value = false
    mappingLoading.value = false
  }
}

// 暴露方法给父组件
defineExpose({
  handleAddProduct: () => {
        if (activeTab.value === 'pairing') {
          pairingIsEdit.value = false
          Object.assign(pairingForm, {
            id: '',
            productSku: '',
      channel: '',
            channelStoreName: '',
            channelSku: '',
            inventorySku: ''
          })
          pairingDialogVisible.value = true
        } else {
      mappingIsEdit.value = false
      Object.assign(mappingForm, {
        id: '',
        productSku: '',
        wms: '',
        inventorySku: ''
      })
      mappingDialogVisible.value = true
    }
  },
  handleBulkImport: () => {
    importDialogVisible.value = true
  }
})

onMounted(() => {
  initMockData()
  // Start auto refresh when component is mounted
  startAutoRefresh()
})

onUnmounted(() => {
  // Stop auto refresh when component is unmounted
  stopAutoRefresh()
})
</script>

<style lang="scss" scoped>
.product-mapping {
  .mapping-tabs {
    :deep(.el-tabs__header) {
      margin-bottom: 24px;
    }

    :deep(.el-tabs__nav-wrap::after) {
      height: 1px;
      background-color: var(--el-border-color-light);
    }

    :deep(.el-tabs__item) {
      font-size: 14px;
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      color: var(--el-text-color-regular);
      
      &.is-active {
        font-weight: 500;
        color: #9D5FFE;
      }

      &:hover {
        color: #9D5FFE;
      }
    }

    :deep(.el-tabs__active-bar) {
      background-color: #9D5FFE;
    }
  }

  .tab-content {
    .info-alert {
    margin-bottom: 20px;
      border-radius: 8px;

      .alert-content {
        .alert-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 12px;
          color: var(--el-text-color-primary);
        }

        .alert-description {
          font-size: 14px;
          line-height: 1.8;
          color: var(--el-text-color-regular);

          p {
            margin: 8px 0;

            &:first-child {
              margin-top: 0;
            }

            strong {
              color: var(--el-text-color-primary);
              font-weight: 600;
            }
          }

          ul {
            margin: 8px 0;
            padding-left: 24px;

            li {
              margin: 6px 0;
              line-height: 1.6;
            }
          }
        }
      }
    }

    .filter-bar {
    display: flex;
    gap: 12px;
      margin-bottom: 20px;
    align-items: center;
  }

  .mapping-table {
    background: var(--el-bg-color);
    border-radius: 8px;
    border: 1px solid var(--el-border-color-lighter);

    .sku-cell {
      font-family: monospace;
      color: var(--el-text-color-primary);
    }

      .sku-cell-wrapper {
      display: flex;
        align-items: center;
      gap: 8px;

        .quick-add-btn {
          opacity: 0;
          transition: opacity 0.2s;
        }

        &:hover .quick-add-btn {
          opacity: 1;
        }
      }

      .statistics-cell {
        display: flex;
        flex-direction: column;
        gap: 6px;

        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;

          .stat-label {
            font-size: 12px;
            color: var(--el-text-color-secondary);
            min-width: 50px;
          }

          .stat-value {
        font-weight: 500;
        color: var(--el-text-color-primary);
          }
        }
      }

      .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;

        .pairing-tag,
        .mapping-tag {
          margin: 0;
        }

        .empty-text {
          color: var(--el-text-color-placeholder);
          font-size: 12px;
        }
      }

      .inventory-sku-container {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;

        .inventory-tag {
          margin: 0;
          font-size: 12px;
        }

        .empty-text {
          color: var(--el-text-color-placeholder);
          font-size: 12px;
        }
      }

      .channel-sku-container {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;

        .channel-sku-tag {
          margin: 0;
          font-size: 12px;
        }

        .empty-text {
          color: var(--el-text-color-placeholder);
          font-size: 12px;
        }
      }
    }

    .expand-content {
      padding: 16px 24px;
      background: var(--el-fill-color-lighter);

      .expand-header {
      display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        .expand-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--el-text-color-primary);
        }
      }

      :deep(.el-table) {
        background: var(--el-bg-color);
        border-radius: 4px;
      }
    }

    .pagination-container {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}

.product-dialog {
  :deep(.el-dialog) {
    border-radius: 8px;
    background: var(--el-bg-color-overlay);
    
    .el-dialog__header {
      margin: 0;
      padding: 20px 24px;
      border-bottom: 1px solid var(--el-border-color-light);

      .el-dialog__title {
        font-size: 18px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }
    }

    .el-dialog__body {
      padding: 24px;
    }

    .el-dialog__footer {
      padding: 16px 24px;
      border-top: 1px solid var(--el-border-color-light);
    }
  }

  .form-tip {
    margin-top: 8px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  .channel-sku-display {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    padding: 8px;
    min-height: 32px;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    background: var(--el-fill-color-lighter);

    .channel-sku-tag {
      margin: 0;
    }

    .empty-text {
      color: var(--el-text-color-placeholder);
      font-size: 12px;
    }
  }
}

.import-dialog {
  .import-container {
    .import-header {
      margin-bottom: 24px;

      .import-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .label {
          font-size: 16px;
          font-weight: 500;
        }
      }

      .import-desc {
        color: var(--el-text-color-secondary);
        font-size: 14px;
      }
    }

    .upload-area {
      margin-bottom: 24px;

      :deep(.el-upload-dragger) {
        width: 100%;
        height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        
        .el-icon--upload {
          font-size: 48px;
          margin-bottom: 12px;
          color: var(--el-color-primary);
        }

        .el-upload__text {
          text-align: center;
          color: var(--el-text-color-regular);

          em {
            color: var(--el-color-primary);
            font-style: normal;
          }
        }
      }
    }

    .import-rules {
      background: var(--el-fill-color-light);
      padding: 16px;
      border-radius: 8px;

      .rules-title {
        font-weight: 500;
        margin-bottom: 8px;
      }

      .rules-list {
        margin: 0;
        padding-left: 20px;
        color: var(--el-text-color-regular);

        li {
          margin-bottom: 4px;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}

.result-dialog {
  .import-result {
    .result-summary {
      text-align: center;
    }

    .failed-details {
      margin-top: 24px;
      
      .details-title {
        font-weight: 500;
        margin-bottom: 12px;
      }

      .details-list {
        margin: 0;
        padding-left: 20px;
        color: var(--el-text-color-regular);

        li {
          margin-bottom: 8px;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style> 
