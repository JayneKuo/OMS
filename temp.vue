<template>
  <div class="basic-info-container">
    <!-- 1. Basic Information -->
    <div class="info-section">
      <div class="section-title">
        <el-icon class="title-icon"><InfoFilled /></el-icon>
        <span>Basic Information</span>
      </div>
      
      <div class="section-content">
        <el-form 
          :model="form" 
          label-position="right"
          label-width="200px"
          class="basic-form"
        >
        <!-- Product Name -->
        <el-form-item label="Product Name" required class="form-item">
          <el-input 
            v-model="form.generalInfo.productName"
            placeholder="Enter product name"
            maxlength="1000"
            show-word-limit
            size="large"
          />
          <div class="help-text">Product name displayed in all channels and marketplaces</div>
        </el-form-item>

        <!-- SKU -->
        <el-form-item label="SKU" required class="form-item">
          <el-input 
            v-model="form.generalInfo.parentSku"
            placeholder="Enter unique SKU"
            size="large"
          />
          <div class="help-text">Unique identifier for this product, must be unique across all products</div>
        </el-form-item>

        <!-- Product Type -->
        <el-form-item label="Product Type" required class="form-item">
          <el-select
            v-model="form.generalInfo.type"
            placeholder="Select Product Type"
            size="large"
            style="width: 100%"
          >
            <el-option label="Physical Product" value="PHYSICAL">
              <div class="product-type-option">
                <span class="type-label">Physical Product</span>
                <span class="type-desc">Physical goods</span>
              </div>
            </el-option>
            <el-option label="Virtual Product" value="VIRTUAL">
              <div class="product-type-option">
                <span class="type-label">Virtual Product</span>
                <span class="type-desc">Point cards, phone recharge</span>
              </div>
            </el-option>
            <el-option label="Service" value="SERVICE">
              <div class="product-type-option">
                <span class="type-label">Service</span>
                <span class="type-desc">Extended warranty, on-site service</span>
              </div>
            </el-option>
            <el-option label="Gift" value="GIFT">
              <div class="product-type-option">
                <span class="type-label">Gift</span>
                <span class="type-desc">Promotional gifts, can be marked independently</span>
              </div>
            </el-option>
            <el-option label="Sample" value="SAMPLE">
              <div class="product-type-option">
                <span class="type-label">Sample</span>
                <span class="type-desc">Trial pack, sample</span>
              </div>
            </el-option>
            <el-option label="Material" value="MATERIAL">
              <div class="product-type-option">
                <span class="type-label">Material</span>
                <span class="type-desc">Raw materials (B2B/supply chain scenario)</span>
              </div>
            </el-option>
          </el-select>
          <div class="help-text">Product type classification</div>
        </el-form-item>

        <!-- Product Status -->
        <el-form-item label="Product Status" required class="form-item">
          <el-select
            v-model="form.generalInfo.status"
            placeholder="Select Product Status"
            size="large"
            style="width: 100%"
          >
            <el-option label="Draft" value="Draft">
              <div class="status-option">
                <span class="status-label">Draft</span>
                <span class="status-desc">Initial state, not published</span>
              </div>
            </el-option>
            <el-option label="Active" value="Active">
              <div class="status-option">
                <span class="status-label">Active</span>
                <span class="status-desc">Published and available</span>
              </div>
            </el-option>
            <el-option label="Inactive" value="Inactive">
              <div class="status-option">
                <span class="status-label">Inactive</span>
                <span class="status-desc">Temporarily disabled</span>
              </div>
            </el-option>
            <el-option label="Disabled" value="Disabled">
              <div class="status-option">
                <span class="status-label">Disabled</span>
                <span class="status-desc">Permanently disabled</span>
              </div>
            </el-option>
          </el-select>
          <div class="help-text">System default is Draft, can be switched to Active, Inactive, or Disabled</div>
        </el-form-item>

        <!-- UOM -->
        <el-form-item label="UOM (Unit of Measure)" required class="form-item">
          <el-select
            v-model="form.generalInfo.unitOfMeasure"
            placeholder="Select Unit of Measure"
            size="large"
            style="width: 100%"
          >
            <el-option-group label="Common">
              <el-option label="Each (EA)" value="EA" />
              <el-option label="Piece (PCS)" value="PCS" />
              <el-option label="Box (BOX)" value="BOX" />
              <el-option label="Carton (CTN)" value="CTN" />
            </el-option-group>
            <el-option-group label="Weight">
              <el-option label="Kilogram (KG)" value="KG" />
              <el-option label="Gram (G)" value="G" />
              <el-option label="Pound (LB)" value="LB" />
            </el-option-group>
            <el-option-group label="Volume">
              <el-option label="Liter (L)" value="L" />
              <el-option label="Milliliter (ML)" value="ML" />
            </el-option-group>
          </el-select>
          <div class="help-text">Product measurement unit such as EA, BOX, KG</div>
        </el-form-item>

        <!-- Category -->
        <el-form-item label="Category" class="form-item">
          <CategorySelector v-model="form.generalInfo.category" />
          <div class="help-text">Support platform category mapping</div>
        </el-form-item>

        <!-- Brand -->
        <el-form-item label="Brand" class="form-item">
          <el-select
            v-model="form.generalInfo.brand"
            placeholder="Select Brand"
            filterable
            size="large"
            style="width: 100%"
          >
            <el-option
              v-for="brand in brands"
              :key="brand"
              :label="brand"
              :value="brand"
            />
          </el-select>
          <div class="help-text">Must be an existing brand in the system</div>
        </el-form-item>

        <!-- Barcode -->
        <el-form-item label="Barcode" class="form-item">
          <el-input 
            v-model="form.generalInfo.sku"
            placeholder="Enter barcode (EAN/UPC/ISBN)"
            size="large"
          />
          <div class="help-text">Product barcode, supports EAN/UPC/ISBN format</div>
        </el-form-item>

        <!-- Description -->
        <el-form-item label="Description" class="form-item">
          <el-input 
            v-model="form.generalInfo.description"
            type="textarea"
            :rows="4"
            placeholder="Enter detailed product description"
            maxlength="5000"
            show-word-limit
          />
          <div class="help-text">Detailed description of the product</div>
        </el-form-item>

        <!-- Keywords -->
        <el-form-item label="Keywords" class="form-item">
          <el-select
            v-model="keywords"
            placeholder="Add keywords to improve search visibility"
            size="large"
            style="width: 100%"
            multiple
            filterable
            allow-create
            default-first-option
          >
          </el-select>
          <div class="help-text">Keywords to improve search visibility, press Enter to add</div>
        </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 2. Product Attributes -->
    <div class="info-section">
      <div class="section-title">
        <el-icon class="title-icon"><DocumentChecked /></el-icon>
        <span>Product Attributes</span>
      </div>
      
      <div class="section-content">
        <DynamicAttributes
          :category-info="form.generalInfo.category"
          v-model="dynamicAttributesValue"
        />
      </div>
    </div>

    <!-- 3. Sales Attributes -->
    <div class="info-section">
      <div class="section-title">
        <el-icon class="title-icon"><Goods /></el-icon>
        <span>Sales Attributes</span>
      </div>
      
      <div class="section-content">
        <SalesAttributes v-model="salesAttributesValue" />
      </div>
    </div>

    <!-- 4. Product Images -->
    <div class="info-section">
      <div class="section-title">
        <el-icon class="title-icon"><Picture /></el-icon>
        <span>Product Images</span>
      </div>
      
      <div class="section-content">
        <el-form 
          :model="form" 
          label-position="right"
          label-width="200px"
          class="basic-form"
        >
        <!-- SKC Images -->
        <el-form-item label="SKC Images" class="form-item skc-images-section">
          <div class="skc-images-container">
            <div class="skc-header">
              <span class="skc-title">Color Variant Images ({{ colorVariants.length }} colors)</span>
              <el-tooltip content="Upload images for each color variant. These will be used for color selection display.">
                <el-icon class="info-icon"><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
            
            <!-- 调试信息 -->
            <div style="margin-bottom: 16px; padding: 12px; background: #374151; border-radius: 6px; font-family: monospace; font-size: 12px; color: #e2e8f0;">
              <div><strong>🐛 Debug Info:</strong></div>
              <div>colorVariants.length: {{ colorVariants.length }}</div>
              <div>colorVariants data: {{ JSON.stringify(colorVariants, null, 2) }}</div>
            </div>
            
            <!-- SKC Images Table - 抄SKU List的实�?-->
            <div class="variants-table-section">
              <div class="table-header">
                <span>SKC Images ({{ colorVariants.length }} colors)</span>
              </div>
              
              <el-table 
                :data="colorVariants" 
                style="width: 100%"
                class="variants-table"
                size="default"
                border
                stripe
              >
                <!-- Color Info Column -->
                <el-table-column label="Color" min-width="150">
                  <template #header>
                    <div class="column-header">
                      <span>Color</span>
                    </div>
                  </template>
                  <template #default="scope">
                    <div class="color-info-cell">
                      <div 
                        class="color-swatch" 
                        :style="{ backgroundColor: scope.row.color || '#cccccc' }"
                      ></div>
                      <div class="color-details">
                        <div class="color-name">{{ scope.row.name }}</div>
                        <div class="color-value">{{ scope.row.color || '#cccccc' }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                
                <!-- Detail Images Column -->
                <el-table-column label="Detail Images" min-width="300">
                  <template #header>
                    <div class="column-header">
                      <span>Detail Images (Max 5)</span>
                    </div>
                  </template>
                  <template #default="scope">
                    <div class="image-upload-cell">
                      <el-upload
                        v-model:file-list="scope.row.detailImages"
                        action="#"
                        list-type="picture-card"
                        :limit="5"
                        :auto-upload="false"
                        accept="image/*"
                        class="table-upload detail-upload"
                      >
                        <el-icon class="upload-icon"><Plus /></el-icon>
                      </el-upload>
                      <div class="upload-info">{{ scope.row.detailImages.length }}/5</div>
                    </div>
                  </template>
                </el-table-column>
                
                <!-- Square Images Column -->
                <el-table-column label="Square Images" min-width="250">
                  <template #header>
                    <div class="column-header">
                      <span>Square Images (Max 3)</span>
                    </div>
                  </template>
                  <template #default="scope">
                    <div class="image-upload-cell">
                      <el-upload
                        v-model:file-list="scope.row.squareImages"
                        action="#"
                        list-type="picture-card"
                        :limit="3"
                        :auto-upload="false"
                        accept="image/*"
                        class="table-upload square-upload"
                      >
                        <el-icon class="upload-icon"><Plus /></el-icon>
                      </el-upload>
                      <div class="upload-info">{{ scope.row.squareImages.length }}/3</div>
                    </div>
                  </template>
                </el-table-column>
                
                <!-- Color Block Images Column -->
                <el-table-column label="Color Block" min-width="150">
                  <template #header>
                    <div class="column-header">
                      <span>Color Block (1)</span>
                    </div>
                  </template>
                  <template #default="scope">
                    <div class="image-upload-cell">
                      <el-upload
                        v-model:file-list="scope.row.colorBlockImages"
                        action="#"
                        list-type="picture-card"
                        :limit="1"
                        :auto-upload="false"
                        accept="image/*"
                        class="table-upload colorblock-upload"
                      >
                        <el-icon class="upload-icon"><Plus /></el-icon>
                      </el-upload>
                      <div class="upload-info">{{ scope.row.colorBlockImages.length }}/1</div>
                    </div>
                  </template>
                </el-table-column>
                
                <!-- Actions Column -->
                <el-table-column label="Actions" width="120" fixed="right">
                  <template #default="scope">
                    <div class="action-buttons">
                      <el-button 
                        type="primary" 
                        size="small"
                        @click="previewColorImages(scope.row)"
                        :disabled="!hasAnyImages(scope.row)"
                      >
                        <el-icon><View /></el-icon>
                      </el-button>
                      <el-button 
                        type="danger" 
                        size="small"
                        @click="clearColorImages(scope.row)"
                        :disabled="!hasAnyImages(scope.row)"
                      >
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="Main Images" required class="form-item">
          <div class="image-upload-area">
            <el-upload
              v-model:file-list="mainImageFiles"
              action="#"
              list-type="picture-card"
              :limit="5"
              :auto-upload="false"
              accept="image/*"
              class="main-upload"
            >
              <el-icon class="upload-icon"><Plus /></el-icon>
            </el-upload>
            <div class="upload-info">
              <div class="info-title">Image Requirements</div>
              <ul class="info-list">
                <li>Upload up to 5 main product images</li>
                <li>Recommended size: 1000x1000px or higher</li>
                <li>Supported formats: JPG, PNG, WebP</li>
                <li>File size: Max 5MB per image</li>
              </ul>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="Additional Images" class="form-item">
          <el-upload
            v-model:file-list="additionalImageFiles"
            action="#"
            list-type="picture-card"
            :limit="10"
            :auto-upload="false"
            accept="image/*"
            class="additional-upload"
          >
            <el-icon class="upload-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 5. Product Videos -->
    <div class="info-section">
      <div class="section-title">
        <el-icon class="title-icon"><Upload /></el-icon>
        <span>Product Videos</span>
      </div>
      
      <div class="section-content">
        <el-form 
          :model="form" 
          label-position="right"
          label-width="200px"
          class="basic-form"
        >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="Video Files" class="form-item">
              <el-upload
                v-model:file-list="videoFiles"
                action="#"
                :limit="3"
                :auto-upload="false"
                accept="video/*"
                class="video-upload"
              >
                <el-button type="primary" size="large">
                  <el-icon><Upload /></el-icon>
                  Upload Video
                </el-button>
                <template #tip>
                  <div class="upload-tip">Max 3 videos, 100MB each</div>
                </template>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Video URL" class="form-item">
              <el-input
                v-model="form.mediaInfo.videoUrl"
                placeholder="YouTube, Vimeo, or other video URL"
                size="large"
              />
              <div class="help-text">Alternative to file upload</div>
            </el-form-item>
          </el-col>
        </el-row>
        </el-form>
      </div>
    </div>

    <!-- 6. Logistics Information -->
    <div class="info-section">
      <div class="section-title">
        <el-icon class="title-icon"><Goods /></el-icon>
        <span>Logistics Information</span>
      </div>
      
      <div class="section-content">
        <el-form 
          :model="form" 
          label-position="right"
          label-width="200px"
          class="basic-form"
        >
        <el-row :gutter="24">
          <el-col :span="12">
            <div class="weight-section">
              <div class="subsection-title">Weight</div>
              <div class="weight-inputs">
                <el-form-item label="Net Weight" class="inline-form-item">
                  <div class="input-with-unit">
                    <el-input-number
                      v-model="form.logisticsInfo.weight.net"
                      :min="0"
                      :precision="2"
                      placeholder="0.00"
                      size="large"
                    />
                    <el-select
                      v-model="form.logisticsInfo.weight.unit"
                      class="unit-select"
                      size="large"
                    >
                      <el-option label="kg" value="kg" />
                      <el-option label="g" value="g" />
                      <el-option label="lb" value="lb" />
                      <el-option label="oz" value="oz" />
                    </el-select>
                  </div>
                </el-form-item>
                <el-form-item label="Gross Weight" class="inline-form-item">
                  <div class="input-with-unit">
                    <el-input-number
                      v-model="form.logisticsInfo.weight.gross"
                      :min="0"
                      :precision="2"
                      placeholder="0.00"
                      size="large"
                    />
                    <el-select
                      v-model="form.logisticsInfo.weight.unit"
                      class="unit-select"
                      size="large"
                    >
                      <el-option label="kg" value="kg" />
                      <el-option label="g" value="g" />
                      <el-option label="lb" value="lb" />
                      <el-option label="oz" value="oz" />
                    </el-select>
                  </div>
                </el-form-item>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="dimensions-section">
              <div class="subsection-title">Dimensions (L×W×H)</div>
              <div class="dimension-inputs">
                <el-input-number
                  v-model="form.logisticsInfo.dimensions.length"
                  :min="0"
                  :precision="1"
                  placeholder="Length"
                  size="large"
                />
                <span class="dimension-separator">×</span>
                <el-input-number
                  v-model="form.logisticsInfo.dimensions.width"
                  :min="0"
                  :precision="1"
                  placeholder="Width"
                  size="large"
                />
                <span class="dimension-separator">×</span>
                <el-input-number
                  v-model="form.logisticsInfo.dimensions.height"
                  :min="0"
                  :precision="1"
                  placeholder="Height"
                  size="large"
                />
                <el-select
                  v-model="form.logisticsInfo.dimensions.unit"
                  class="unit-select"
                  size="large"
                >
                  <el-option label="cm" value="cm" />
                  <el-option label="in" value="inch" />
                  <el-option label="mm" value="mm" />
                </el-select>
              </div>
            </div>
          </el-col>
        </el-row>
        </el-form>
      </div>
    </div>

    <!-- 7. Supplier Information -->
    <div class="info-section">
      <div class="section-title">
        <el-icon class="title-icon"><User /></el-icon>
        <span>Supplier Information</span>
      </div>
      
      <div class="section-content">
        <el-form 
          :model="form" 
          label-position="right"
          label-width="200px"
          class="basic-form"
        >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="Supplier Name" class="form-item">
              <el-input
                v-model="form.supplierInfo.name"
                placeholder="Enter supplier name"
                size="large"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Supplier Code" class="form-item">
              <el-input
                v-model="form.supplierInfo.code"
                placeholder="Enter supplier code"
                size="large"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="Contact Person" class="form-item">
              <el-input
                v-model="form.supplierInfo.contactPerson"
                placeholder="Contact name"
                size="large"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Email" class="form-item">
              <el-input
                v-model="form.supplierInfo.email"
                placeholder="email@example.com"
                type="email"
                size="large"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Phone" class="form-item">
              <el-input
                v-model="form.supplierInfo.phone"
                placeholder="Phone number"
                size="large"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Address" class="form-item">
          <el-input
            v-model="form.supplierInfo.address"
            type="textarea"
            :rows="3"
            placeholder="Supplier address"
          />
        </el-form-item>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="Lead Time (days)" class="form-item">
              <el-input-number
                v-model="form.supplierInfo.leadTime"
                :min="1"
                placeholder="Days"
                size="large"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Minimum Order Quantity" class="form-item">
              <el-input-number
                v-model="form.supplierInfo.moq"
                :min="1"
                placeholder="MOQ"
                size="large"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import CategorySelector from '../CategorySelectorSimple.vue';
import DynamicAttributes from '../DynamicAttributes.vue';
import SalesAttributes from '../SalesAttributes.vue';
import { 
  InfoFilled, 
  DocumentChecked, 
  Goods, 
  Picture, 
  Plus, 
  Delete, 
  Upload,
  User,
  QuestionFilled,
  Grid,
  Brush,
  View
} from '@element-plus/icons-vue';
import type { Product } from '@/types/product';

const props = defineProps<{
  form: Product;
}>();

// 动态属性�?const dynamicAttributesValue = ref({
  platformAttributes: {},
  customAttributes: []
});

// 销售属性�?const salesAttributesValue = ref({
  sellingForm: 'single',
  dimensions: [],
  primaryDimension: '',
  colorOptions: [],
  sizeOptions: [],
  styleOptions: [],
  bundleProducts: []
});

// Refs for file uploads
const mainImageFiles = ref([]);
const additionalImageFiles = ref([]);
const videoFiles = ref([]);

// 品牌数据
const brands = ['Nike', 'Adidas', 'Apple', 'Samsung', 'Sony', 'Canon'];

// 销售属性相关变量已移至 SalesAttributes 组件�?
// 关键�?const keywords = ref([]);

// 动态属性管理由 DynamicAttributes 组件处理

// SKC图片数据结构
interface ColorVariant {
  name: string;
  color?: string;
  detailImages: any[];
  squareImages: any[];
  colorBlockImages: any[];
}

// 颜色变体数据 - 写死的调试数据（使用ref而不是computed，这样可以修改）
const colorVariants = ref<ColorVariant[]>([
  {
    name: '红色',
    color: '#FF0000',
    detailImages: [],
    squareImages: [],
    colorBlockImages: []
  },
  {
    name: '蓝色',
    color: '#0000FF',
    detailImages: [],
    squareImages: [],
    colorBlockImages: []
  },
  {
    name: '绿色',
    color: '#00FF00',
    detailImages: [],
    squareImages: [],
    colorBlockImages: []
  },
  {
    name: '黄色',
    color: '#FFFF00',
    detailImages: [],
    squareImages: [],
    colorBlockImages: []
  },
  {
    name: '紫色',
    color: '#800080',
    detailImages: [],
    squareImages: [],
    colorBlockImages: []
  }
]);

// 检查颜色变体是否有任何图片
const hasAnyImages = (colorVariant: ColorVariant): boolean => {
  return (
    colorVariant.detailImages.length > 0 ||
    colorVariant.squareImages.length > 0 ||
    colorVariant.colorBlockImages.length > 0
  );
};

// 预览颜色图片
const previewColorImages = (colorVariant: ColorVariant) => {
  console.log('Preview images for color:', colorVariant.name, colorVariant);
  // TODO: 实现图片预览功能
};

// 清空颜色图片
const clearColorImages = (colorVariant: ColorVariant) => {
  colorVariant.detailImages = [];
  colorVariant.squareImages = [];
  colorVariant.colorBlockImages = [];
};

// 销售属性相关函数已移至 SalesAttributes 组件�?</script>

<style scoped lang="scss">
.basic-info-container {
  width: 100%;
  margin: 0;
  padding: 0;
}

.info-section {
  background: #1e1e1e;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid #333333;
  overflow: hidden;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px 16px;
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  color: #e2e8f0;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  border-bottom: 1px solid #4a5568;
  
  .title-icon {
    font-size: 20px;
    opacity: 0.9;
    color: #63b3ed;
  }
}

.section-content {
  padding: 24px;
}

.form-item {
  margin-bottom: 20px;
  
  :deep(.el-form-item__label) {
    font-size: 14px;
    font-weight: 500;
    color: #cbd5e0;
    line-height: 1.5;
    margin-bottom: 8px;
    text-align: right;
    justify-content: flex-end;
  }
  
  :deep(.el-form-item__content) {
    line-height: 1.5;
  }
  
  // Dark theme for form controls
  :deep(.el-input__wrapper) {
    background-color: #2d3748;
    border: 1px solid #4a5568;
    box-shadow: none;
    
    &:hover {
      border-color: #63b3ed;
    }
    
    &.is-focus {
      border-color: #63b3ed;
      box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.2);
    }
    
    .el-input__inner {
      color: #e2e8f0;
      background-color: transparent;
      
      &::placeholder {
        color: #718096;
      }
    }
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
        background-color: transparent;
      }
    }
  }
  
  :deep(.el-textarea__inner) {
    background-color: #2d3748;
    border: 1px solid #4a5568;
    color: #e2e8f0;
    
    &::placeholder {
      color: #718096;
    }
    
    &:hover {
      border-color: #63b3ed;
    }
    
    &:focus {
      border-color: #63b3ed;
      box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.2);
    }
  }
  
  :deep(.el-input-number) {
    .el-input__wrapper {
      background-color: #2d3748;
      border: 1px solid #4a5568;
      
      .el-input__inner {
        color: #e2e8f0;
        background-color: transparent;
      }
    }
    
    .el-input-number__decrease,
    .el-input-number__increase {
      background-color: #4a5568;
      border-color: #4a5568;
      color: #cbd5e0;
      
      &:hover {
        background-color: #63b3ed;
        border-color: #63b3ed;
        color: white;
      }
    }
  }
}

.help-text {
  color: #a0aec0;
  font-size: 13px;
  margin-top: 6px;
  line-height: 1.4;
}

.subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #4a5568;
}

// Custom Attributes
.custom-attributes-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #4a5568;
}

.custom-attr-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  
  .attr-key {
    flex: 1;
    min-width: 200px;
  }
  
  .attr-value {
    flex: 2;
    min-width: 300px;
  }
  
  .delete-btn {
    flex-shrink: 0;
    color: #ef4444;
    border-color: #ef4444;
    
    &:hover {
      background-color: #fef2f2;
    }
  }
}

.add-attr-btn {
  width: 100%;
  border-style: dashed;
  border-width: 2px;
  height: 48px;
  font-size: 14px;
  
  &:hover {
    border-color: #667eea;
    color: #667eea;
  }
}

// Selling Form
.selling-form-group {
  :deep(.el-radio-button__inner) {
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 500;
  }
}

// Variant Section
.variant-section {
  margin-top: 20px;
  padding: 20px;
  background: #2d3748;
  border-radius: 8px;
  border: 1px solid #4a5568;
}

.dimension-options {
  margin-top: 20px;
}

.option-label {
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 12px;
}

// Color Options
.color-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .color-name {
    flex: 1;
    max-width: 200px;
  }
  
  .color-picker {
    flex-shrink: 0;
  }
}

.add-option-btn {
  align-self: flex-start;
  margin-top: 8px;
}

// Size Options
.size-options {
  .size-group {
    :deep(.el-checkbox-button__inner) {
      padding: 8px 16px;
      font-weight: 500;
    }
  }
}

// Image Upload
.image-upload-area {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.main-upload {
  flex-shrink: 0;
}

.upload-info {
  flex: 1;
  padding: 20px;
  background: #2d3748;
  border-radius: 8px;
  border: 1px solid #4a5568;
  
  .info-title {
    font-size: 14px;
    font-weight: 600;
    color: #e2e8f0;
    margin-bottom: 12px;
  }
  
  .info-list {
    margin: 0;
    padding-left: 16px;
    color: #a0aec0;
    font-size: 13px;
    
    li {
      margin-bottom: 6px;
      line-height: 1.4;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

:deep(.el-upload--picture-card) {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  border: 2px dashed #4a5568;
  background-color: #2d3748;
  
  &:hover {
    border-color: #63b3ed;
    background-color: #374151;
  }
  
  .upload-icon {
    font-size: 32px;
    color: #718096;
  }
}

:deep(.el-upload-list--picture-card) {
  .el-upload-list__item {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    background-color: #2d3748;
    border: 1px solid #4a5568;
  }
}

// Video Upload
.video-upload {
  :deep(.el-upload-dragger) {
    width: 100%;
    height: 120px;
    border-radius: 8px;
    border: 2px dashed #4a5568;
    background-color: #2d3748;
    
    &:hover {
      border-color: #63b3ed;
      background-color: #374151;
    }
  }
}

.upload-tip {
  color: #a0aec0;
  font-size: 12px;
  margin-top: 8px;
}

// Logistics
.weight-section, .dimensions-section {
  .subsection-title {
    font-size: 14px;
    margin-bottom: 16px;
  }
}

.weight-inputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.inline-form-item {
  margin-bottom: 0;
  
  :deep(.el-form-item__label) {
    font-size: 13px;
    margin-bottom: 6px;
  }
}

.input-with-unit {
  display: flex;
  gap: 8px;
  align-items: center;
  
  .el-input-number {
    flex: 1;
  }
  
  .unit-select {
    width: 80px;
    flex-shrink: 0;
  }
}

.dimension-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  
  .el-input-number {
    flex: 1;
    min-width: 100px;
  }
  
  .dimension-separator {
    color: #6b7280;
    font-weight: 600;
    font-size: 16px;
    margin: 0 4px;
  }
  
  .unit-select {
    width: 80px;
    flex-shrink: 0;
  }
}

// Dark theme for buttons and other controls
:deep(.el-button) {
  &.el-button--primary {
    background-color: #63b3ed;
    border-color: #63b3ed;
    color: white;
    
    &:hover {
      background-color: #4299e1;
      border-color: #4299e1;
    }
    
    &:active {
      background-color: #3182ce;
      border-color: #3182ce;
    }
    
    &.is-plain {
      background-color: transparent;
      color: #63b3ed;
      border: 2px dashed #63b3ed;
      
      &:hover {
        background-color: rgba(99, 179, 237, 0.1);
        border-color: #4299e1;
        color: #4299e1;
      }
    }
  }
  
  &.el-button--danger {
    background-color: #f56565;
    border-color: #f56565;
    
    &:hover {
      background-color: #e53e3e;
      border-color: #e53e3e;
    }
    
    &.is-text {
      background-color: transparent;
      border-color: transparent;
      color: #f56565;
      
      &:hover {
        background-color: rgba(245, 101, 101, 0.1);
      }
    }
    
    &.is-circle {
      background-color: transparent;
      border-color: #f56565;
      color: #f56565;
      
      &:hover {
        background-color: rgba(245, 101, 101, 0.1);
      }
    }
  }
}

:deep(.el-radio-group) {
  .el-radio-button__inner {
    background-color: #2d3748;
    border-color: #4a5568;
    color: #cbd5e0;
    
    &:hover {
      color: #63b3ed;
    }
  }
  
  .el-radio-button__original-radio:checked + .el-radio-button__inner {
    background-color: #63b3ed;
    border-color: #63b3ed;
    color: white;
    box-shadow: -1px 0 0 0 #63b3ed;
  }
}

:deep(.el-checkbox-group) {
  .el-checkbox-button__inner {
    background-color: #2d3748;
    border-color: #4a5568;
    color: #cbd5e0;
    
    &:hover {
      color: #63b3ed;
    }
  }
  
  .el-checkbox-button.is-checked .el-checkbox-button__inner {
    background-color: #63b3ed;
    border-color: #63b3ed;
    color: white;
  }
}

:deep(.el-switch) {
  .el-switch__core {
    background-color: #4a5568;
    border-color: #4a5568;
  }
  
  &.is-checked .el-switch__core {
    background-color: #63b3ed;
    border-color: #63b3ed;
  }
}

:deep(.el-color-picker) {
  .el-color-picker__trigger {
    background-color: #2d3748;
    border-color: #4a5568;
    
    &:hover {
      border-color: #63b3ed;
    }
  }
}

// Responsive Design
@media (max-width: 768px) {
  .basic-info-container {
    padding: 0;
  }
  
  .section-content {
    padding: 20px 16px;
  }
  
  .image-upload-area {
    flex-direction: column;
    gap: 16px;
  }
  
  .dimension-inputs {
    flex-direction: column;
    align-items: stretch;
    
    .dimension-separator {
      display: none;
    }
  }
}

// Status option styling
.status-option {
  display: flex;
  flex-direction: column;
  gap: 2px;
  
  .status-label {
    font-weight: 600;
    color: #e2e8f0;
    font-size: 14px;
  }
  
  .status-desc {
    font-size: 12px;
    color: #a0aec0;
    line-height: 1.2;
  }
}

// Product type option styling
.product-type-option {
  display: flex;
  flex-direction: column;
  gap: 2px;
  
  .type-label {
    font-weight: 600;
    color: #e2e8f0;
    font-size: 14px;
  }
  
  .type-desc {
    font-size: 12px;
    color: #a0aec0;
    line-height: 1.2;
  }
}

// SKC Images Styles
.skc-images-section {
  .skc-images-container {
    width: 100%;
  }
  
  .skc-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    
    .skc-title {
      font-size: 16px;
      font-weight: 600;
      color: #e2e8f0;
    }
    
    .info-icon {
      color: #63b3ed;
      cursor: help;
    }
  }
  
  // 变体表格样式 - 抄SKU List的样�?  .variants-table-section {
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
    
    // 列标题样�?    .column-header {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    // 颜色信息单元�?    .color-info-cell {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      
      .color-swatch {
        width: 32px;
        height: 32px;
        border-radius: 6px;
        border: 2px solid #4a5568;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
      
      .color-details {
        .color-name {
          font-weight: 600;
          color: #e2e8f0;
          font-size: 14px;
        }
        
        .color-value {
          font-size: 12px;
          color: #a0aec0;
          font-family: monospace;
        }
      }
    }
    
    // 图片上传单元�?    .image-upload-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 8px;
      
      .table-upload {
        :deep(.el-upload--picture-card) {
          width: 64px;
          height: 64px;
          border-radius: 6px;
          border: 2px dashed #4a5568;
          background: #374151;
          
          &:hover {
            border-color: #63b3ed;
            background: #4a5568;
          }
          
          .upload-icon {
            font-size: 20px;
            color: #a0aec0;
          }
        }
        
        :deep(.el-upload-list--picture-card) {
          .el-upload-list__item {
            width: 64px;
            height: 64px;
            border-radius: 6px;
            background: #374151;
            border: 1px solid #4a5568;
          }
        }
      }
      
      .upload-info {
        font-size: 11px;
        color: #a0aec0;
        font-weight: 500;
      }
    }
    
    // 操作按钮
    .action-buttons {
      display: flex;
      gap: 4px;
      
      .el-button {
        padding: 4px 8px;
        font-size: 12px;
        
        .el-icon {
          font-size: 14px;
        }
      }
    }
  }
}

// SKC Images Table Border
:deep(.el-table--border) {
  border-color: #4a5568;
}

// Color Info Cell
.color-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  
  .color-swatch {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: 2px solid #4a5568;
    flex-shrink: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .color-details {
    flex: 1;
    min-width: 0;
    
    .color-name {
      font-size: 14px;
      font-weight: 600;
      color: #e2e8f0;
      margin-bottom: 2px;
    }
    
    .color-value {
      font-size: 11px;
      font-family: monospace;
      color: #a0aec0;
      text-transform: uppercase;
    }
  }
}

// Table Header with Tooltip  
.table-header-with-tooltip {
      display: flex;
      align-items: center;
      gap: 6px;
      
      .el-icon {
        color: #63b3ed;
        font-size: 14px;
      }
      
      .tooltip-icon {
        color: #718096;
        cursor: help;
        font-size: 12px;
        opacity: 0.8;
        
        &:hover {
          opacity: 1;
          color: #63b3ed;
        }
      }
    }
    
    // Image Upload Cell
    .image-upload-cell {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px 0;
      
      .table-upload {
        :deep(.el-upload--picture-card) {
          width: 64px;
          height: 64px;
          border-radius: 6px;
          border: 2px dashed #4a5568;
          background: #1a202c;
          margin: 0 4px 4px 0;
          
          &:hover {
            border-color: #63b3ed;
            background: #374151;
          }
          
          .upload-icon {
            font-size: 18px;
            color: #718096;
          }
        }
        
        :deep(.el-upload-list--picture-card) {
          .el-upload-list__item {
            width: 64px;
            height: 64px;
            border-radius: 6px;
            background: #1a202c;
            border: 1px solid #4a5568;
            margin: 0 4px 4px 0;
            
            .el-upload-list__item-thumbnail {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
      }
      
      .upload-info {
        font-size: 11px;
        color: #a0aec0;
        text-align: center;
        font-weight: 500;
      }
    }
    
    // Action Buttons
    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 6px;
      
      .el-button {
        padding: 4px 8px;
        font-size: 11px;
        height: auto;
        min-height: 24px;
        
        .el-icon {
          font-size: 12px;
        }
        
        &.el-button--primary {
          background: linear-gradient(135deg, #63b3ed 0%, #4299e1 100%);
          border-color: #63b3ed;
          
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
            border-color: #4299e1;
          }
          
          &:disabled {
            background: #4a5568;
            border-color: #4a5568;
            color: #718096;
            opacity: 0.6;
          }
        }
        
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
            opacity: 0.6;
          }
        }
      }
    }
  }
}
</style>
        color: #e2e8f0;
      }
      
      .el-alert__content {
        color: #cbd5e0;
      }
      
      .el-alert__icon {
        color: #63b3ed;
