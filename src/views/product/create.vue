<template>
  <div class="create-product">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <div class="header-main">
        <div class="header-left">
          <el-button 
            link 
            type="primary" 
            class="back-button"
            @click="handleBack"
          >
            <el-icon><ArrowLeft /></el-icon>
            Back to Products
          </el-button>
          <el-divider direction="vertical" />
          <h2 class="page-title">Create Product</h2>
        </div>

        <div class="header-right">
          <el-space>
            <el-dropdown trigger="click">
              <el-button>
                Import
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>Import from Excel</el-dropdown-item>
                  <el-dropdown-item>Import from Shopify</el-dropdown-item>
                  <el-dropdown-item>Import from Amazon</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button type="info" plain>Preview</el-button>
            <el-button :icon="Document" @click="handleSaveOnly">Save</el-button>
            <el-button @click="handleSaveAsDraft">Save Draft</el-button>
            <el-button type="primary" :icon="Upload" @click="handleSave">Publish</el-button>
          </el-space>
        </div>
      </div>

      <!-- 主要标签页 -->
      <div class="header-tabs">
        <el-tabs 
          v-model="activeTab" 
          type="card"
          class="main-tabs"
        >
          <el-tab-pane name="basic">
            <template #label>
              <div class="tab-label">
                <el-icon><Goods /></el-icon>
                Basic Information
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="media">
            <template #label>
              <div class="tab-label">
                <el-icon><Picture /></el-icon>
                Media Resources
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="warehouse">
            <template #label>
              <div class="tab-label">
                <el-icon><House /></el-icon>
                Warehouse Settings
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="compliance">
            <template #label>
              <div class="tab-label">
                <el-icon><DocumentChecked /></el-icon>
                Customs & Compliance
              </div>
            </template>
          </el-tab-pane>

        </el-tabs>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="page-content">
      <el-form
        ref="formRef"
        :model="form"
        :validate-on-rule-change="false"
        class="product-form"
      >
        <!-- 基本信息 -->
        <div v-show="activeTab === 'basic'" class="tab-content">
          <BasicInfo :form="form" />
        </div>

        <!-- 渠道设置 -->
        <div v-show="activeTab === 'media'" class="tab-content">
          <MediaSection :form="form" />
        </div>

        <!-- 仓储设置 -->
        <div v-show="activeTab === 'warehouse'" class="tab-content">
          <WarehouseInfo :form="form.warehouseSettings" />
        </div>

        <!-- 合规信息 -->
        <div v-show="activeTab === 'compliance'" class="tab-content">
          <ComplianceInfo :form="form.complianceInfo" />
        </div>


      </el-form>

      <!-- 底部状态栏 -->
      <div class="page-footer">
        <div class="footer-left">
          <el-tag type="info">Draft</el-tag>
          <span class="update-time">Last Updated: {{ formatDate(form.systemInfo.updatedAt) }}</span>
        </div>
        <div class="footer-right">
          <el-space>
            <span class="validation-status">
              <el-icon color="var(--el-color-success)"><CircleCheck /></el-icon>
              Form Validation Passed
            </span>
            <el-divider direction="vertical" />
            <el-button-group>
              <el-button :icon="Document" @click="handleSaveOnly">Save</el-button>
              <el-button @click="handleSaveAsDraft">Save Draft</el-button>
              <el-button type="primary" :icon="Upload" @click="handleSave">Publish</el-button>
            </el-button-group>
          </el-space>
        </div>
      </div>
    </div>

    <!-- 发布确认对话框 -->
    <el-dialog
      v-model="publishDialogVisible"
      title="Publish Product Confirmation"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="publish-dialog-content">
        <div class="warning-section">
          <el-alert
            title="Publishing will distribute your product to multiple channels"
            type="info"
            :closable="false"
            show-icon
          />
        </div>

        <!-- 表单验证状态提示 -->
        <div class="validation-section" v-if="showValidationWarning">
          <el-alert
            title="Please complete all required fields before publishing"
            type="warning"
            :closable="false"
            show-icon
          >
            <template #default>
              Form validation will be performed when you confirm the publication. Make sure all required fields are filled.
            </template>
          </el-alert>
        </div>

        <div class="publish-options">
          <h4>Publication Targets:</h4>
          
          <div class="option-group">
            <h5>E-commerce Platforms:</h5>
            <el-checkbox-group v-model="publishTargets.platforms">
              <el-checkbox value="shein">Shein</el-checkbox>
              <el-checkbox value="amazon">Amazon</el-checkbox>
              <el-checkbox value="shopify">Shopify</el-checkbox>
              <el-checkbox value="ebay">eBay</el-checkbox>
              <el-checkbox value="walmart">Walmart</el-checkbox>
            </el-checkbox-group>
          </div>

          <div class="option-group">
            <h5>System Integration:</h5>
            <el-checkbox-group v-model="publishTargets.systems">
              <el-checkbox value="wms">WMS (Warehouse Management)</el-checkbox>
              <el-checkbox value="item-master" :disabled="true">
                <div class="system-option">
                  <span class="system-name">Item Master</span>
                  <el-tag size="small" type="success">Default</el-tag>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>

        <!-- 平台特殊要求验证区域 -->
        <div class="platform-requirements" v-if="selectedPlatformRequirements.length > 0">
          <h4>Platform-Specific Requirements:</h4>
          <div class="requirements-list">
            <div 
              v-for="requirement in selectedPlatformRequirements" 
              :key="requirement.platform"
              class="requirement-item"
            >
              <div class="requirement-header">
                <span class="platform-name">{{ requirement.platformName }}</span>
                <el-tag 
                  :type="requirement.isValid ? 'success' : 'danger'" 
                  size="small"
                >
                  {{ requirement.isValid ? 'Valid' : 'Missing Fields' }}
                </el-tag>
              </div>
              
              <div v-if="!requirement.isValid" class="missing-fields">
                <div class="field-group" v-for="group in requirement.missingGroups" :key="group.name">
                  <h6>{{ group.label }}:</h6>
                  <div class="field-actions">
                    <span class="missing-info">{{ group.fields.join(', ') }}</span>
                    <el-button 
                      link 
                      type="primary" 
                      size="small"
                      @click="openFieldSettings(requirement.platform, group.name)"
                    >
                      Set Now
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="info-section">
          <el-alert
            title="After publishing, the product will be distributed to selected channels. You can track the publication progress in the product management interface."
            type="warning"
            :closable="false"
            show-icon
          />
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="publishDialogVisible = false">Cancel</el-button>
          <el-button 
            type="primary" 
            :loading="publishLoading"
            @click="confirmPublish"
          >
            Confirm Publish
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 保存确认对话框 -->
    <el-dialog
      v-model="saveDialogVisible"
      title="Save Product Confirmation"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="save-dialog-content">
        <div class="info-section">
          <el-alert
            title="Save product to system"
            type="info"
            :closable="false"
            show-icon
          >
            <template #default>
              <div class="alert-content">
                <p>Choose where to save and sync your product data:</p>
                <p class="note">This operation will preserve the current product status and update all basic information.</p>
              </div>
            </template>
          </el-alert>
        </div>

        <div class="save-options">
          <div class="option-group">
            <h6>System Integration:</h6>
            <el-checkbox-group v-model="saveTargets.systems" class="system-options">
              <el-checkbox 
                value="item-master" 
                class="system-option"
              >
                <div class="option-content">
                  <div class="option-info">
                    <strong>Item Master</strong>
                    <span class="option-desc">Base product database</span>
                  </div>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>

        <div class="save-summary">
          <el-alert
            v-if="saveTargets.systems.length === 0"
            title="No sync target selected"
            type="warning"
            :closable="false"
            show-icon
          >
            Product will be saved locally only. Consider syncing to Item Master for data consistency.
          </el-alert>
          <el-alert
            v-else
            :title="`Product will be synced to ${saveTargets.systems.length} system(s)`"
            type="success"
            :closable="false"
            show-icon
          />
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="saveDialogVisible = false">Cancel</el-button>
          <el-button 
            type="primary" 
            :loading="saveLoading"
            @click="confirmSave"
          >
            <template #icon>
              <el-icon><Document /></el-icon>
            </template>
            {{ saveLoading ? 'Saving...' : 'Confirm Save' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Item Master冲突处理对话框 -->
    <el-dialog
      v-model="conflictDialogVisible"
      title="Item Master Conflict Detected"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="conflict-dialog-content">
        <div class="conflict-warning">
          <el-alert
            title="Product already exists in Item Master"
            type="warning"
            :closable="false"
            show-icon
          >
            <template #default>
              <p>A product with similar information already exists in Item Master. Please choose how to proceed:</p>
            </template>
          </el-alert>
        </div>

        <div class="existing-product-info" v-if="conflictProduct">
          <h6>Existing Product Information:</h6>
          <el-card shadow="never" class="product-card">
            <div class="product-details">
              <div class="detail-row">
                <span class="label">Product ID:</span>
                <span class="value">{{ conflictProduct.id }}</span>
              </div>
              <div class="detail-row">
                <span class="label">SKU:</span>
                <span class="value">{{ conflictProduct.sku }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Product Name:</span>
                <span class="value">{{ conflictProduct.name }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Category:</span>
                <span class="value">{{ conflictProduct.category }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Status:</span>
                <el-tag :type="conflictProduct.status === 'Active' ? 'success' : 'info'">
                  {{ conflictProduct.status }}
                </el-tag>
              </div>
              <div class="detail-row">
                <span class="label">Last Updated:</span>
                <span class="value">{{ conflictProduct.updatedAt }} by {{ conflictProduct.createdBy }}</span>
              </div>
            </div>
          </el-card>
        </div>

        <div class="conflict-actions">
          <h6>Choose Action:</h6>
          <div class="action-options">
            <el-card 
              shadow="hover" 
              class="action-card"
              :class="{ active: conflictAction === 'map' }"
              @click="conflictAction = 'map'"
            >
              <div class="action-content">
                <div class="action-icon">
                  <el-icon size="24"><Link /></el-icon>
                </div>
                <div class="action-info">
                  <h6>Map to Existing Product</h6>
                  <p>Link this product to the existing Item Master entry. Your product will reference the existing data.</p>
                </div>
              </div>
            </el-card>

            <el-card 
              shadow="hover" 
              class="action-card"
              :class="{ active: conflictAction === 'update' }"
              @click="conflictAction = 'update'"
            >
              <div class="action-content">
                <div class="action-icon">
                  <el-icon size="24"><Edit /></el-icon>
                </div>
                <div class="action-info">
                  <h6>Update Existing Product</h6>
                  <p>Update the existing Item Master entry with your current product information.</p>
                </div>
              </div>
            </el-card>

            <el-card 
              shadow="hover" 
              class="action-card"
              :class="{ active: conflictAction === 'create-new' }"
              @click="conflictAction = 'create-new'"
            >
              <div class="action-content">
                <div class="action-icon">
                  <el-icon size="24"><Plus /></el-icon>
                </div>
                <div class="action-info">
                  <h6>Create New Entry</h6>
                  <p>Create a new Item Master entry with a different identifier (SKU will be auto-adjusted).</p>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="conflictDialogVisible = false">Cancel</el-button>
          <el-button 
            type="primary" 
            :disabled="!conflictAction"
            :loading="saveLoading"
            @click="handleConflictChoice(conflictAction)"
          >
            <template #icon>
              <el-icon><Check /></el-icon>
            </template>
            {{ saveLoading ? 'Processing...' : 'Confirm Action' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 平台字段设置对话框 -->
    <el-dialog
      v-model="fieldSettingsDialogVisible"
      :title="`Set ${currentPlatformName} Fields - ${currentFieldGroupLabel}`"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="field-settings-content">
        <div class="field-form">
          <!-- 分类设置 -->
          <div v-if="currentFieldGroup === 'category'" class="field-section">
            <h5>Platform Category Mapping:</h5>
            <el-form-item label="Platform Category">
              <el-cascader
                v-model="platformFields.category"
                :options="platformCategoryOptions"
                :props="{ multiple: false, checkStrictly: false }"
                placeholder="Select platform category"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="Category Attributes">
              <div class="attribute-list">
                <div 
                  v-for="attr in platformCategoryAttributes" 
                  :key="attr.key"
                  class="attribute-item"
                >
                  <label>{{ attr.label }}:</label>
                  <el-input
                    v-if="attr.type === 'text'"
                    v-model="platformFields.categoryAttributes[attr.key]"
                    :placeholder="attr.placeholder"
                  />
                  <el-select
                    v-else-if="attr.type === 'select'"
                    v-model="platformFields.categoryAttributes[attr.key]"
                    :placeholder="attr.placeholder"
                  >
                    <el-option
                      v-for="option in attr.options"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    />
                  </el-select>
                </div>
              </div>
            </el-form-item>
          </div>

          <!-- 销售属性设置 -->
          <div v-if="currentFieldGroup === 'sales'" class="field-section">
            <h5>Sales Attributes:</h5>
            
            <el-form-item label="Size Chart">
              <el-select
                v-model="platformFields.sizeChart"
                placeholder="Select size chart"
              >
                <el-option label="US Standard" value="us-standard" />
                <el-option label="EU Standard" value="eu-standard" />
                <el-option label="Asian Standard" value="asian-standard" />
                <el-option label="Custom" value="custom" />
              </el-select>
            </el-form-item>

            <!-- 颜色变体和SKC设置 -->
            <div class="color-variants-section">
              <div class="section-header">
                <h6>Color Variants & SKC Configuration:</h6>
                <el-button 
                  type="primary" 
                  size="small"
                  @click="loadColorsFromProduct"
                >
                  Load from Product
                </el-button>
              </div>

              <div class="color-variants-list">
                <div 
                  v-for="(variant, index) in platformFields.colorVariants" 
                  :key="index"
                  class="color-variant-item"
                >
                  <el-card shadow="never" class="variant-card">
                    <div class="variant-header">
                      <div class="color-info">
                        <div class="color-display">
                          <div 
                            class="color-swatch" 
                            :style="{ backgroundColor: variant.colorValue }"
                          ></div>
                          <span class="color-name">{{ variant.colorName }}</span>
                        </div>
                        <el-button 
                          type="danger" 
                          size="small" 
                          text
                          @click="removeColorVariant(index)"
                        >
                          Remove
                        </el-button>
                      </div>
                      
                      <el-form-item label="SKC Code" class="skc-input">
                        <el-input
                          v-model="variant.skc"
                          :placeholder="`SKC for ${variant.colorName}`"
                        />
                      </el-form-item>
                    </div>

                    <div class="variant-images">
                      <h6>Images for {{ variant.colorName }}:</h6>
                      <div class="image-upload-section">
                        <div class="image-types">
                          <div class="image-type-group">
                            <label>Main Images:</label>
                            <div class="image-upload-list">
                              <div 
                                v-for="(image, imgIndex) in getImagesByType(variant, 'main')" 
                                :key="imgIndex"
                                class="image-item"
                              >
                                <div class="image-preview">
                                  <img v-if="image.url" :src="image.url" alt="Main image" />
                                  <div v-else class="image-placeholder">No Image</div>
                                </div>
                                <el-button 
                                  size="small" 
                                  type="danger" 
                                  text
                                  @click="removeVariantImage(index, imgIndex, 'main')"
                                >
                                  Remove
                                </el-button>
                              </div>
                              <el-upload
                                :show-file-list="false"
                                :before-upload="(file) => handleImageUpload(file, index, 'main')"
                                accept="image/*"
                                class="image-uploader"
                              >
                                <div class="upload-placeholder">
                                  <el-icon><Plus /></el-icon>
                                  <span>Upload Main</span>
                                </div>
                              </el-upload>
                            </div>
                          </div>

                          <div class="image-type-group">
                            <label>Detail Images:</label>
                            <div class="image-upload-list">
                              <div 
                                v-for="(image, imgIndex) in getImagesByType(variant, 'detail')" 
                                :key="imgIndex"
                                class="image-item"
                              >
                                <div class="image-preview">
                                  <img v-if="image.url" :src="image.url" alt="Detail image" />
                                  <div v-else class="image-placeholder">No Image</div>
                                </div>
                                <el-button 
                                  size="small" 
                                  type="danger" 
                                  text
                                  @click="removeVariantImage(index, imgIndex, 'detail')"
                                >
                                  Remove
                                </el-button>
                              </div>
                              <el-upload
                                :show-file-list="false"
                                :before-upload="(file) => handleImageUpload(file, index, 'detail')"
                                accept="image/*"
                                class="image-uploader"
                              >
                                <div class="upload-placeholder">
                                  <el-icon><Plus /></el-icon>
                                  <span>Upload Detail</span>
                                </div>
                              </el-upload>
                            </div>
                          </div>

                          <div class="image-type-group">
                            <label>Color Swatch:</label>
                            <div class="image-upload-list">
                              <div 
                                v-for="(image, imgIndex) in getImagesByType(variant, 'swatch')" 
                                :key="imgIndex"
                                class="image-item"
                              >
                                <div class="image-preview swatch-preview">
                                  <img v-if="image.url" :src="image.url" alt="Color swatch" />
                                  <div v-else class="image-placeholder">No Swatch</div>
                                </div>
                                <el-button 
                                  size="small" 
                                  type="danger" 
                                  text
                                  @click="removeVariantImage(index, imgIndex, 'swatch')"
                                >
                                  Remove
                                </el-button>
                              </div>
                              <el-upload
                                v-if="getImagesByType(variant, 'swatch').length === 0"
                                :show-file-list="false"
                                :before-upload="(file) => handleImageUpload(file, index, 'swatch')"
                                accept="image/*"
                                class="image-uploader swatch-uploader"
                              >
                                <div class="upload-placeholder">
                                  <el-icon><Plus /></el-icon>
                                  <span>Upload Swatch</span>
                                </div>
                              </el-upload>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-card>
                </div>

                <div v-if="platformFields.colorVariants.length === 0" class="empty-variants">
                  <el-empty description="No color variants loaded">
                    <el-button type="primary" @click="loadColorsFromProduct">
                      Load Colors from Product
                    </el-button>
                  </el-empty>
                </div>
              </div>
            </div>
          </div>

          <!-- 动态属性设置 -->
          <div v-if="currentFieldGroup === 'dynamic'" class="field-section">
            <h5>Platform-Specific Attributes:</h5>
            <div 
              v-for="attr in platformDynamicAttributes" 
              :key="attr.key"
              class="dynamic-attribute"
            >
              <el-form-item :label="attr.label" :required="attr.required">
                <el-input
                  v-if="attr.type === 'text'"
                  v-model="platformFields.dynamicAttributes[attr.key]"
                  :placeholder="attr.placeholder"
                />
                <el-select
                  v-else-if="attr.type === 'select'"
                  v-model="platformFields.dynamicAttributes[attr.key]"
                  :placeholder="attr.placeholder"
                >
                  <el-option
                    v-for="option in attr.options"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
                <el-input-number
                  v-else-if="attr.type === 'number'"
                  v-model="platformFields.dynamicAttributes[attr.key]"
                  :placeholder="attr.placeholder"
                  style="width: 100%"
                />
              </el-form-item>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="fieldSettingsDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="savePlatformFields">
            Save Fields
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import { 
  ArrowLeft, 
  ArrowDown, 
  Goods, 
  Picture, 
  House, 
  DocumentChecked,
  CircleCheck,
  Document,
  Upload,
  Check,
  Link,
  Edit,
  Plus
} from '@element-plus/icons-vue';
import type { Product } from '@/types/product';
import type { WMSProductSettings } from '@/types/warehouse';
import BasicInfo from './components/basics/BasicInfoRevised.vue';
import MediaSection from './components/basics/MediaSection.vue';
import WarehouseInfo from './components/basics/WarehouseInfo.vue';
import ComplianceInfo from './components/basics/ComplianceInfo.vue';

const router = useRouter();
const route = useRoute();
const activeTab = ref('basic');
const formRef = ref();

// 发布对话框相关
const publishDialogVisible = ref(false);
const publishLoading = ref(false);
const showValidationWarning = ref(true); // 默认显示验证提醒
const publishTargets = ref({
  platforms: [], // 不默认选中任何平台
  systems: ['item-master'] // 只默认选中Item Master
});

// 保存对话框相关
const saveDialogVisible = ref(false);
const saveLoading = ref(false);
const saveTargets = ref({
  systems: ['item-master'] // 默认勾选Item Master，但用户可以取消
});

// Item Master冲突处理
const conflictDialogVisible = ref(false);
const conflictProduct = ref(null);
const conflictAction = ref(''); // 'map' | 'update' | 'create-new'

// 平台字段设置相关
const fieldSettingsDialogVisible = ref(false);
const currentPlatform = ref('');
const currentPlatformName = ref('');
const currentFieldGroup = ref('');
const currentFieldGroupLabel = ref('');

// 平台字段数据
const platformFields = ref({
  category: [],
  categoryAttributes: {} as Record<string, any>,
  skc: '',
  sizeChart: '',
  colorMapping: '',
  colorVariants: [] as Array<{
    colorName: string;
    colorValue: string;
    skc: string;
    images: Array<{
      type: 'main' | 'detail' | 'swatch';
      url: string;
      file?: File;
    }>;
  }>,
  dynamicAttributes: {} as Record<string, any>
});

// 平台特定数据（模拟数据，实际应从API获取）
const platformCategoryOptions = ref([
  {
    value: 'clothing',
    label: 'Clothing',
    children: [
      { value: 'tops', label: 'Tops' },
      { value: 'bottoms', label: 'Bottoms' },
      { value: 'dresses', label: 'Dresses' }
    ]
  },
  {
    value: 'accessories',
    label: 'Accessories',
    children: [
      { value: 'bags', label: 'Bags' },
      { value: 'jewelry', label: 'Jewelry' }
    ]
  }
]);

const platformCategoryAttributes = ref([
  { key: 'material', label: 'Material', type: 'text', placeholder: 'e.g., Cotton, Polyester' },
  { key: 'season', label: 'Season', type: 'select', options: [
    { label: 'Spring', value: 'spring' },
    { label: 'Summer', value: 'summer' },
    { label: 'Fall', value: 'fall' },
    { label: 'Winter', value: 'winter' }
  ], placeholder: 'Select season' }
]);

const platformDynamicAttributes = ref([
  { key: 'brand_story', label: 'Brand Story', type: 'text', required: true, placeholder: 'Enter brand story' },
  { key: 'target_audience', label: 'Target Audience', type: 'select', required: true, 
    options: [
      { label: 'Women 18-25', value: 'women_18_25' },
      { label: 'Women 26-35', value: 'women_26_35' },
      { label: 'Men 18-25', value: 'men_18_25' }
    ], placeholder: 'Select target audience' },
  { key: 'price_range', label: 'Price Range', type: 'number', required: false, placeholder: 'Max price' }
]);

// 计算属性：选中平台的要求
const selectedPlatformRequirements = computed(() => {
  return publishTargets.value.platforms.map(platform => {
    const platformName = getPlatformName(platform);
    const requirements = getPlatformRequirements(platform);
    const validation = validatePlatformRequirements(platform, requirements);
    
    return {
      platform,
      platformName,
      isValid: validation.isValid,
      missingGroups: validation.missingGroups
    };
  });
});

// 不再需要从路由获取分类参数

// 创建默认的尺寸对象
const defaultDimensions = {
  length: 0,
  width: 0,
  height: 0,
  unit: 'cm' as const
};

// 创建默认的重量对象
const defaultWeight = {
  value: 0,
  unit: 'kg' as const
};

// 初始化表单数据
const form = ref<Product>({
  generalInfo: {
    productName: '',
    sku: '',
    parentSku: '',
    type: 'Physical',
    category: {
      categories: [],
      customCategory: ''
    },
    status: 'Draft',
    isSample: false,
    description: '',
    attributes: {
      occasion: '',
      type: '',
      style: '',
      details: '',
      material: '',
      pattern: '',
      hazardCategory: '',
      features: [],
      batteryType: '',
      strapType: '',
      magnetic: false,
      closureType: '',
      coating: [],
      composition: [],
      quantity: 1,
      customAttributes: []
    }
  },
  mediaInfo: {
    mainImages: [],
    additionalImages: [],
    videoUrl: ''
  },
  supplierInfo: {
    name: '',
    code: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    leadTime: 1,
    moq: 1
  },
  descriptionInfo: {
    description: '',
    bulletPoints: [],
    categoryAttributes: {}
  },
  logisticsInfo: {
    primaryUOM: {
      unit: 'EA',
      customName: ''
    },
    additionalUOMs: [],
    weight: {
      net: 0,
      gross: 0,
      unit: 'kg'
    },
    dimensions: { ...defaultDimensions }
  },
  packagingInfo: {
    unit: {
      quantity: 1,
      dimensions: { ...defaultDimensions },
      weight: { ...defaultWeight }
    },
    innerPack: {
      quantity: 0,
      dimensions: { ...defaultDimensions },
      weight: { ...defaultWeight }
    },
    masterCarton: {
      quantity: 0,
      dimensions: { ...defaultDimensions },
      weight: { ...defaultWeight },
      stackingLimit: 0,
      temperatureRange: {
        min: 0,
        max: 0,
        unit: 'C'
      }
    }
  },
  variantInfo: {
    enabled: false,
    dimensions: [],
    options: {},
    children: []
  },
  barcodeInfo: {
    primary: {
      type: 'UPC',
      value: '',
      verified: false
    },
    additional: [],
    custom: ''
  },
  translations: {},
  systemInfo: {
    createdAt: new Date().toISOString(),
    createdBy: 'system',
    updatedAt: new Date().toISOString(),
    updatedBy: 'system',
    version: 1,
    source: 'manual'
  },
  // 仓库设置初始化
  complianceInfo: {
    basic: {
      chineseName: '',
      englishName: '',
      chineseMaterial: '',
      englishMaterial: '',
      chineseUsage: '',
      englishUsage: '',
      brandType: '',
      exportBenefits: 'NONE',
      specialProperties: []
    },
    customs: {
      hsCode: '',
      countryOfOrigin: '',
      declaredValue: 0,
      dutyRate: 0,
      vatRate: 0,
      declaredUnit: '',
      declaredDescription: '',
      importPermits: [],
      ciqRequirements: [],
      certificates: {} as Record<string, {
        number: string;
        expiryDate: string;
        status: string;
        attachments: { name: string; url: string }[];
        notes: string;
      }>,
      ciqCertificates: {} as Record<string, {
        number: string;
        inspectionDate: string;
        result: string;
        report: { name: string; url: string } | null;
        notes: string;
      }>
    },
    export: {
      dutyRate: 0,
      vatRate: 0,
      selectedCertificates: [] as string[],
      certificates: {} as Record<string, {
        number: string;
        issueDate: string;
        status: string;
        attachments: { name: string; url: string }[];
        notes: string;
      }>,
      specialRequirements: []
    },
    complianceStatus: 'pending',
    certifications: [],
    restrictions: [],
    certificationDetails: [],
    hazmat: {
      unNumber: '',
      class: '',
      packingGroup: '',
      reportableQuantity: 0,
      properShippingName: '',
      technicalName: '',
      emergencyContact: ''
    },
    battery: {
      type: '',
      configuration: '',
      cellCount: 0,
      wattHourRating: 0,
      lithiumContent: 0
    },
    fda: {
      registrationNumber: '',
      productCode: '',
      medicalDevice: false,
      deviceListing: '',
      labelingReview: false,
      drugListing: '',
      foodFacility: ''
    },
    cpsia: {
      ageGrade: '',
      testingLab: '',
      trackingLabel: '',
      smallPartsWarning: false,
      leadContent: false,
      phthalatesTest: false
    },
    prop65: {
      warningType: '',
      exposureType: '',
      chemicals: [],
      warningLanguage: {
        en: '',
        es: ''
      }
    },
    eccnCode: '',
    exportControlClass: '',
    licenseRequired: false,
    exportControlNotes: ''
  },
  warehouseSettings: {
    baseUOM: '',
    uomLevels: [],
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      unit: 'cm'
    },
    weight: {
      net: 0,
      gross: 0,
      unit: 'kg'
    },
    barcodes: [],
    lotTracking: {
      enabled: false,
      shelfLifeDays: 0,
      fifoRule: 'FIFO',
      minReceivingLife: 0,
      minShippingLife: 0
    },
    serialTracking: {
      enabled: false,
      receivingRequired: false,
      shippingRequired: false
    },
    barcodeStrategy: {
      mode: 'EA_REQUIRED',
      points: []
    },
    dangerousGoods: {
      isDangerous: false,
      unCode: '',
      hazardClass: ''
    },
    storageConditions: {
      temperature: 'ROOM_TEMP',
      stackable: true,
      tiltable: true,
      moistureSensitive: false
    },
    warehouses: [],
    fba: {
      enabled: false
    },
    wfs: {
      enabled: false
    },
    thirdPartyLogistics: [],
    replenishmentRules: {
      type: 'min-max',
      minQuantity: 0,
      maxQuantity: 0,
      orderPoint: 0,
      orderQuantity: 0,
      safetyStock: 0
    },
    inventoryForecasts: {
      period: 'monthly',
      forecastedDemand: 0,
      confidenceLevel: 95,
      seasonalityFactor: 1,
      trendFactor: 0
    },
    allocationStrategy: 'FIFO',
    outOfStockAction: 'PREVENT_SALE',
    stockAlertRules: []
  }
});

// 返回处理
function handleBack() {
  ElMessageBox.confirm(
    'Are you sure you want to leave? Unsaved changes will be lost.',
    'Warning',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    router.back();
  });
}

// 发布处理
async function handleSave() {
  // 直接显示发布确认对话框，不进行预先验证
  await showPublishConfirmDialog();
}

// 保存（不发布）
async function handleSaveOnly() {
  // 显示保存确认对话框
  saveDialogVisible.value = true;
}

// 保存为草稿
async function handleSaveAsDraft() {
  try {
    // 保存草稿时也默认同步到Item Master
    const draftData = {
      ...form.value,
      status: 'draft',
      syncTargets: ['item-master'] // 默认同步到Item Master
    };
    
    // TODO: 调用保存草稿API
    console.log('Saving draft with Item Master sync...', draftData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    ElMessage.success('Draft saved and synced to Item Master successfully');
  } catch (error) {
    ElMessage.error('Failed to save');
  }
}

// 显示发布确认对话框
async function showPublishConfirmDialog() {
  publishDialogVisible.value = true;
}

// 确认保存
async function confirmSave() {
  try {
    saveLoading.value = true;
    
    // 如果选择了Item Master同步，先检查冲突
    if (saveTargets.value.systems.includes('item-master')) {
      const hasConflict = await checkItemMasterConflict();
      if (hasConflict) {
        saveLoading.value = false;
        saveDialogVisible.value = false;
        return; // 显示冲突对话框，等待用户选择
      }
    }
    
    await performSave();
  } catch (error) {
    ElMessage.error('Failed to save');
    saveLoading.value = false;
  }
}

// 检查Item Master中是否存在冲突
async function checkItemMasterConflict() {
  // 模拟API调用检查商品是否已存在
  console.log('Checking Item Master for existing product...');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 模拟冲突情况（实际应根据SKU、商品名称等检查）
  const hasConflict = Math.random() > 0.5; // 50%概率有冲突，用于演示
  
  if (hasConflict) {
    // 模拟找到的冲突商品
    conflictProduct.value = {
      id: 'IM001',
      sku: form.value.sku,
      name: form.value.name,
      category: 'Existing Category',
      status: 'Active',
      createdAt: '2024-01-15',
      updatedAt: '2024-03-10',
      createdBy: 'System Admin'
    };
    
    conflictDialogVisible.value = true;
    return true;
  }
  
  return false;
}

// 执行实际保存操作
async function performSave() {
  try {
    // 根据用户选择的同步目标保存
    const saveData = {
      ...form.value,
      syncTargets: saveTargets.value.systems,
      conflictAction: conflictAction.value // 包含冲突处理动作
    };
    
    // TODO: 调用保存API（保持当前状态，不改变发布状态）
    console.log('Saving product data...', saveData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 根据同步目标显示不同的成功消息
    let successMessage = 'Product saved successfully';
    if (saveTargets.value.systems.length > 0) {
      const syncTargetsText = saveTargets.value.systems.map(target => {
        switch(target) {
          case 'item-master': return 'Item Master';
          default: return target;
        }
      }).join(', ');
      successMessage = `Product saved and synced to ${syncTargetsText} successfully`;
    }
    
    ElMessage.success(successMessage);
    saveDialogVisible.value = false;
  } catch (error) {
    ElMessage.error('Failed to save');
  } finally {
    saveLoading.value = false;
  }
}

// 处理冲突选择
async function handleConflictChoice(action: string) {
  conflictAction.value = action;
  conflictDialogVisible.value = false;
  
  try {
    saveLoading.value = true;
    await performSave();
  } catch (error) {
    ElMessage.error('Failed to save');
    saveLoading.value = false;
  }
}

// 确认发布
async function confirmPublish() {
  publishLoading.value = true;
  
  try {
    // 在确认发布时进行表单验证
    await formRef.value?.validate();
    
    // 检查是否至少选择了一个发布目标
    const totalTargets = publishTargets.value.platforms.length + publishTargets.value.systems.length;
    if (totalTargets === 0) {
      ElMessage.warning('Please select at least one publication target.');
      return;
    }
    
    // 模拟发布过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 构建发布结果消息
    const platformNames = publishTargets.value.platforms.map(p => {
      const platformMap: Record<string, string> = {
        'shein': 'Shein',
        'amazon': 'Amazon', 
        'shopify': 'Shopify',
        'ebay': 'eBay',
        'walmart': 'Walmart'
      };
      return platformMap[p] || p;
    });
    
    const systemNames = publishTargets.value.systems.map(s => {
      const systemMap: Record<string, string> = {
        'wms': 'WMS',
        'item-master': 'Item Master'
      };
      return systemMap[s] || s;
    });
    
    // 显示成功消息
    const allTargets = [...platformNames, ...systemNames];
    const message = allTargets.length > 0 
      ? `Product published successfully to: ${allTargets.join(', ')}`
      : 'Product published successfully';
    
    ElMessage.success({
      message: message,
      duration: 5000
    });
    
    // 显示进度跟踪提示
    setTimeout(() => {
      ElMessage.info({
        message: 'You can track the publication progress in the Product Management interface.',
        duration: 8000
      });
    }, 1000);
    
    publishDialogVisible.value = false;
    router.push('/product');
    
  } catch (error) {
    // 如果是表单验证错误，显示验证提示但保持对话框打开
    if (error && typeof error === 'object' && 'fields' in error) {
      ElMessage.error('Form validation failed. Please check required fields and try again.');
    } else {
      ElMessage.error('Failed to publish product. Please try again.');
    }
  } finally {
    publishLoading.value = false;
  }
}

// 获取平台名称
function getPlatformName(platform: string): string {
  const platformMap: Record<string, string> = {
    'shein': 'Shein',
    'amazon': 'Amazon',
    'shopify': 'Shopify',
    'ebay': 'eBay',
    'walmart': 'Walmart'
  };
  return platformMap[platform] || platform;
}

// 获取平台要求（模拟数据，实际应从API获取）
function getPlatformRequirements(platform: string) {
  const requirements: Record<string, any> = {
    'shein': {
      category: { required: true, fields: ['Platform Category', 'Material', 'Season'] },
      sales: { required: true, fields: ['SKC', 'Size Chart', 'Color Mapping'] },
      dynamic: { required: true, fields: ['Brand Story', 'Target Audience'] }
    },
    'amazon': {
      category: { required: true, fields: ['Platform Category', 'Material'] },
      dynamic: { required: true, fields: ['Brand Story'] }
    },
    'shopify': {
      sales: { required: true, fields: ['SKC', 'Color Mapping'] }
    }
  };
  
  return requirements[platform] || {};
}

// 验证平台要求
function validatePlatformRequirements(platform: string, requirements: any) {
  const missingGroups = [];
  
  for (const [groupName, groupReq] of Object.entries(requirements)) {
    if (groupReq && typeof groupReq === 'object' && groupReq.required) {
      const isGroupValid = checkGroupValidation(platform, groupName);
      if (!isGroupValid) {
        missingGroups.push({
          name: groupName,
          label: getGroupLabel(groupName),
          fields: groupReq.fields || []
        });
      }
    }
  }
  
  return {
    isValid: missingGroups.length === 0,
    missingGroups
  };
}

// 检查组验证
function checkGroupValidation(platform: string, groupName: string): boolean {
  // 这里应该检查实际的表单数据和平台字段数据
  // 简化示例：假设某些字段缺失
  if (groupName === 'category') {
    return platformFields.value.category.length > 0;
  }
  if (groupName === 'sales') {
    return !!platformFields.value.skc;
  }
  if (groupName === 'dynamic') {
    return Object.keys(platformFields.value.dynamicAttributes).length > 0;
  }
  return false;
}

// 获取组标签
function getGroupLabel(groupName: string): string {
  const groupLabels: Record<string, string> = {
    'category': 'Category & Attributes',
    'sales': 'Sales Attributes',
    'dynamic': 'Platform-Specific Fields'
  };
  return groupLabels[groupName] || groupName;
}

// 打开字段设置对话框
function openFieldSettings(platform: string, groupName: string) {
  currentPlatform.value = platform;
  currentPlatformName.value = getPlatformName(platform);
  currentFieldGroup.value = groupName;
  currentFieldGroupLabel.value = getGroupLabel(groupName);
  fieldSettingsDialogVisible.value = true;
}

// 从产品基础信息加载颜色
function loadColorsFromProduct() {
  // 模拟从产品表单中获取颜色信息
  // 实际应用中应该从 form.value 中获取变体信息
  const mockColors = [
    { colorName: 'Red and White', colorValue: '#FF0000' },
    { colorName: 'Blue', colorValue: '#0000FF' },
    { colorName: 'Green', colorValue: '#00FF00' }
  ];
  
  platformFields.value.colorVariants = mockColors.map(color => ({
    colorName: color.colorName,
    colorValue: color.colorValue,
    skc: '', // 用户需要填写
    images: []
  }));
  
  ElMessage.success('Colors loaded from product successfully');
}

// 移除颜色变体
function removeColorVariant(index: number) {
  platformFields.value.colorVariants.splice(index, 1);
}

// 根据类型获取图片
function getImagesByType(variant: any, type: 'main' | 'detail' | 'swatch') {
  return variant.images.filter((img: any) => img.type === type);
}

// 处理图片上传
function handleImageUpload(file: File, variantIndex: number, imageType: 'main' | 'detail' | 'swatch') {
  // 创建图片预览URL
  const url = URL.createObjectURL(file);
  
  // 添加图片到对应变体
  platformFields.value.colorVariants[variantIndex].images.push({
    type: imageType,
    url: url,
    file: file
  });
  
  ElMessage.success(`${imageType} image uploaded successfully`);
  
  // 阻止默认上传行为
  return false;
}

// 移除变体图片
function removeVariantImage(variantIndex: number, imageIndex: number, imageType: 'main' | 'detail' | 'swatch') {
  const variant = platformFields.value.colorVariants[variantIndex];
  const images = variant.images.filter((img: any) => img.type === imageType);
  const targetImage = images[imageIndex];
  
  // 找到并移除图片
  const allImageIndex = variant.images.findIndex((img: any) => img === targetImage);
  if (allImageIndex > -1) {
    // 释放URL对象
    if (targetImage.url.startsWith('blob:')) {
      URL.revokeObjectURL(targetImage.url);
    }
    variant.images.splice(allImageIndex, 1);
  }
}

// 保存平台字段
function savePlatformFields() {
  // 验证SKC设置
  if (currentFieldGroup.value === 'sales') {
    const missingSkc = platformFields.value.colorVariants.filter(variant => !variant.skc);
    if (missingSkc.length > 0) {
      ElMessage.warning(`Please set SKC codes for: ${missingSkc.map(v => v.colorName).join(', ')}`);
      return;
    }
  }
  
  // 这里应该保存字段到表单数据或发送到API
  ElMessage.success(`${currentPlatformName.value} fields saved successfully`);
  fieldSettingsDialogVisible.value = false;
  
  // 触发重新验证
  // 在实际应用中，这里应该更新相关的数据
}

// 格式化日期
function formatDate(date: string) {
  return new Date(date).toLocaleString();
}
</script>

<style scoped lang="scss">
.create-product {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color);
}

.page-header {
  background-color: var(--el-bg-color-overlay);
  border-bottom: 1px solid var(--el-border-color-light);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .header-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    padding: 0 24px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .back-button {
      font-size: 14px;
      .el-icon {
        margin-right: 4px;
      }
    }

    .page-title {
      font-size: 18px;
      font-weight: 500;
      color: var(--el-text-color-primary);
      margin: 0;
    }
  }
}

.header-tabs {
  padding: 0 24px;
  border-top: 1px solid var(--el-border-color-lighter);
  background-color: var(--el-bg-color);

  .main-tabs {
    :deep(.el-tabs__header) {
      margin: 0;
      border-bottom: none;
    }

    :deep(.el-tabs__nav) {
      border: none;
    }

    :deep(.el-tabs__item) {
      height: 48px;
      line-height: 48px;
      border: none;
      padding: 0 24px;
      transition: all 0.3s;

      &.is-active {
        background-color: var(--el-color-primary-light-9);
        border-bottom: 2px solid var(--el-color-primary);
      }

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;

  .el-icon {
    font-size: 16px;
  }
}

.page-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.product-form {
  flex: 1;
  overflow: hidden;
  padding: 24px;
}

.tab-content {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 64px; // 为底部状态栏留出空间
}

.page-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: var(--el-bg-color-overlay);
  border-top: 1px solid var(--el-border-color-light);
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  backdrop-filter: blur(10px);

  .footer-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .update-time {
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }
  }

  .validation-status {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--el-color-success);
    font-size: 13px;
  }
}

  // 保存对话框样式
  .save-dialog-content {
    .info-section {
      margin-bottom: 20px;

      .alert-content {
        p {
          margin: 8px 0;
          color: var(--el-text-color-regular);
          
          &.note {
            font-size: 13px;
            color: var(--el-text-color-secondary);
            margin-top: 12px;
          }
        }
      }
    }

    .save-options {
      margin-bottom: 20px;

      .option-group {
        h6 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .system-options {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .system-option {
            margin: 0;
            padding: 12px;
            border: 1px solid var(--el-border-color-light);
            border-radius: 6px;
            transition: all 0.2s;

            &:hover {
              border-color: var(--el-color-primary-light-7);
              background-color: var(--el-color-primary-light-9);
            }

            &.is-checked {
              border-color: var(--el-color-primary);
              background-color: var(--el-color-primary-light-9);
            }

            .option-content {
              .option-info {
                display: flex;
                flex-direction: column;
                gap: 2px;

                strong {
                  font-size: 14px;
                  color: var(--el-text-color-primary);
                }

                .option-desc {
                  font-size: 12px;
                  color: var(--el-text-color-secondary);
                }
              }
            }
          }
        }
      }
    }

    .save-summary {
      margin-bottom: 0;
    }
  }

  // 冲突处理对话框样式
  .conflict-dialog-content {
    .conflict-warning {
      margin-bottom: 20px;
    }

    .existing-product-info {
      margin-bottom: 24px;

      h6 {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .product-card {
        background-color: var(--el-bg-color-page);
        border: 1px solid var(--el-border-color-light);

        .product-details {
          .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid var(--el-border-color-lighter);

            &:last-child {
              border-bottom: none;
            }

            .label {
              font-weight: 500;
              color: var(--el-text-color-secondary);
              min-width: 120px;
            }

            .value {
              color: var(--el-text-color-primary);
              text-align: right;
            }
          }
        }
      }
    }

    .conflict-actions {
      h6 {
        margin: 0 0 16px 0;
        font-size: 14px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .action-options {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .action-card {
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid var(--el-border-color-light);

          &:hover {
            border-color: var(--el-color-primary-light-7);
            transform: translateY(-1px);
          }

          &.active {
            border-color: var(--el-color-primary);
            background-color: var(--el-color-primary-light-9);
          }

          .action-content {
            display: flex;
            align-items: flex-start;
            gap: 16px;
            padding: 4px;

            .action-icon {
              color: var(--el-color-primary);
              margin-top: 4px;
            }

            .action-info {
              flex: 1;

              h6 {
                margin: 0 0 8px 0;
                font-size: 15px;
                font-weight: 600;
                color: var(--el-text-color-primary);
              }

              p {
                margin: 0;
                font-size: 13px;
                color: var(--el-text-color-secondary);
                line-height: 1.4;
              }
            }
          }
        }
      }
    }
  }

  // 发布对话框样式
  .publish-dialog-content {
  .warning-section {
    margin-bottom: 24px;
  }

  .validation-section {
    margin-bottom: 24px;
  }

  .publish-options {
    margin-bottom: 24px;

    h4 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    h5 {
      margin: 16px 0 12px 0;
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-regular);
    }

    .option-group {
      margin-bottom: 20px;

      .el-checkbox {
        display: block;
        margin-bottom: 8px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }

      .platform-option,
      .system-option {
        display: flex;
        align-items: center;
        gap: 8px;

        .platform-name,
        .system-name {
          flex: 1;
          font-size: 14px;
        }
      }
    }
  }

  .info-section {
    margin-top: 24px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

// 平台要求验证样式
.platform-requirements {
  margin-bottom: 24px;

  h4 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .requirements-list {
    .requirement-item {
      margin-bottom: 16px;
      padding: 16px;
      border: 1px solid var(--el-border-color-light);
      border-radius: 6px;
      background: var(--el-bg-color-page);

      .requirement-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .platform-name {
          font-weight: 600;
          font-size: 14px;
        }
      }

      .missing-fields {
        .field-group {
          margin-bottom: 12px;

          h6 {
            margin: 0 0 8px 0;
            font-size: 13px;
            font-weight: 500;
            color: var(--el-text-color-regular);
          }

          .field-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .missing-info {
              font-size: 12px;
              color: var(--el-text-color-secondary);
              flex: 1;
            }
          }
        }
      }
    }
  }
}

// 字段设置对话框样式
.field-settings-content {
  .field-form {
    .field-section {
      h5 {
        margin: 0 0 16px 0;
        font-size: 14px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        border-bottom: 1px solid var(--el-border-color-lighter);
        padding-bottom: 8px;
      }

      .attribute-list {
        .attribute-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;

          label {
            min-width: 120px;
            font-size: 13px;
            color: var(--el-text-color-regular);
          }
        }
      }

      .dynamic-attribute {
        margin-bottom: 16px;
      }

      .color-mapping {
        display: flex;
        gap: 8px;
      }

      // 颜色变体样式
      .color-variants-section {
        margin-top: 24px;
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          
          h6 {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
          }
        }
        
        .color-variants-list {
          .color-variant-item {
            margin-bottom: 20px;
            
            .variant-card {
              border: 1px solid var(--el-border-color-light);
            }
            
            .variant-header {
              margin-bottom: 16px;
              
              .color-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                
                .color-display {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  
                  .color-swatch {
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                    border: 1px solid var(--el-border-color);
                  }
                  
                  .color-name {
                    font-weight: 500;
                    font-size: 14px;
                  }
                }
              }
              
              .skc-input {
                margin-bottom: 0;
              }
            }
            
            .variant-images {
              h6 {
                margin: 0 0 12px 0;
                font-size: 13px;
                color: var(--el-text-color-regular);
              }
              
              .image-types {
                display: flex;
                flex-direction: column;
                gap: 16px;
                
                .image-type-group {
                  label {
                    display: block;
                    font-size: 12px;
                    font-weight: 500;
                    color: var(--el-text-color-secondary);
                    margin-bottom: 8px;
                  }
                  
                  .image-upload-list {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    
                    .image-item {
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      gap: 4px;
                      
                      .image-preview {
                        width: 80px;
                        height: 80px;
                        border: 1px solid var(--el-border-color);
                        border-radius: 4px;
                        overflow: hidden;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: var(--el-bg-color-page);
                        
                        img {
                          width: 100%;
                          height: 100%;
                          object-fit: cover;
                        }
                        
                        .image-placeholder {
                          font-size: 11px;
                          color: var(--el-text-color-placeholder);
                          text-align: center;
                        }
                        
                        &.swatch-preview {
                          width: 60px;
                          height: 60px;
                        }
                      }
                    }
                    
                    .image-uploader {
                      .upload-placeholder {
                        width: 80px;
                        height: 80px;
                        border: 2px dashed var(--el-border-color);
                        border-radius: 4px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: all 0.2s;
                        
                        &:hover {
                          border-color: var(--el-color-primary);
                          color: var(--el-color-primary);
                        }
                        
                        span {
                          font-size: 11px;
                          margin-top: 4px;
                        }
                      }
                      
                      &.swatch-uploader .upload-placeholder {
                        width: 60px;
                        height: 60px;
                      }
                    }
                  }
                }
              }
            }
          }
          
          .empty-variants {
            text-align: center;
            padding: 40px 20px;
          }
        }
      }
    }
  }
}

// 暗色主题优化
:deep(.dark) {
  .page-header {
    background-color: var(--el-bg-color);
    border-bottom-color: var(--el-border-color-darker);
  }

  .header-tabs {
    background-color: var(--el-bg-color-overlay);
    border-top-color: var(--el-border-color-darker);
  }

  .page-footer {
    background-color: var(--el-bg-color);
    border-top-color: var(--el-border-color-darker);
  }
}
</style>