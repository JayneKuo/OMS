<template>
  <div class="basic-info-container">
    <!-- 1. Basic Information Card -->
    <el-card class="info-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon><InfoFilled /></el-icon>
          <span>Basic Information</span>
        </div>
      </template>

      <el-form :model="form" label-width="180px">
        <!-- Product Name -->
        <el-form-item label="Product Name" required>
          <el-input 
            v-model="form.generalInfo.productName"
            placeholder="Enter product name"
            maxlength="1000"
            show-word-limit
          />
          <div class="field-help">
            Product name will be displayed in all channels and marketplaces
          </div>
        </el-form-item>

        <!-- Seller Parent SKU -->
        <el-form-item label="Seller Parent SKU">
          <el-input 
            v-model="form.generalInfo.parentSku"
            placeholder="Put your own SKU"
          />
        </el-form-item>

        <!-- Category Selector -->
        <el-form-item label="Category" required>
          <CategorySelector v-model="form.generalInfo.category" />
        </el-form-item>

        <!-- Brand -->
        <el-form-item label="Brand">
          <el-select
            v-model="form.generalInfo.brand"
            placeholder="Select Brand"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="brand in brands"
              :key="brand"
              :label="brand"
              :value="brand"
            />
          </el-select>
          <div class="field-help">
            If your brand isn't listed, please go to <el-link type="primary">Brands</el-link> to add a new brand.
          </div>
        </el-form-item>

        <!-- Product Type -->
        <el-form-item label="Product Type" required>
          <el-select
            v-model="form.generalInfo.type"
            placeholder="Select Product Type"
            style="width: 100%"
          >
            <el-option label="Physical Product" value="Physical" />
            <el-option label="Digital Product" value="Digital" />
            <el-option label="Bundle" value="Bundle" />
          </el-select>
        </el-form-item>

        <!-- Description -->
        <el-form-item label="Description">
          <el-input 
            v-model="form.generalInfo.description"
            type="textarea"
            :rows="4"
            placeholder="Enter product description"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 2. Product Attributes Card -->
    <el-card class="info-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon><Upload /></el-icon>
          <span>Product Attributes</span>
        </div>
      </template>

      <el-form :model="form" label-width="180px">
        <!-- Basic Attributes -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Occasion">
              <el-select 
                v-model="form.generalInfo.attributes.occasion"
                placeholder="Select Occasion"
                style="width: 100%"
              >
                <el-option label="Daily" value="daily" />
                <el-option label="Formal" value="formal" />
                <el-option label="Sport" value="sport" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Material">
              <el-select 
                v-model="form.generalInfo.attributes.material"
                placeholder="Select Material"
                style="width: 100%"
              >
                <el-option label="Cotton" value="cotton" />
                <el-option label="Polyester" value="polyester" />
                <el-option label="Leather" value="leather" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Pattern">
              <el-select 
                v-model="form.generalInfo.attributes.pattern"
                placeholder="Select Pattern"
                style="width: 100%"
              >
                <el-option label="Solid" value="solid" />
                <el-option label="Striped" value="striped" />
                <el-option label="Floral" value="floral" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Care Instructions -->
        <el-form-item label="Care Instructions">
          <el-input 
            v-model="form.generalInfo.attributes.careInstructions"
            placeholder="Enter care instructions"
          />
        </el-form-item>

        <!-- Custom Attributes -->
        <div class="custom-attributes">
          <div class="attribute-header">
            <div class="label">Custom Attributes</div>
            <div class="tip-text">Add custom key-value pairs for additional product information</div>
          </div>
          
          <div 
            v-for="(attr, index) in form.generalInfo.attributes.customAttributes" 
            :key="index"
            class="custom-attribute-item"
          >
            <div class="input-group">
              <el-input 
                v-model="attr.key"
                placeholder="Attribute Name"
                class="key-input"
              />
              <el-input 
                v-model="attr.value"
                placeholder="Attribute Value"
                class="value-input"
              />
              <el-button 
                type="danger" 
                text
                @click="removeCustomAttribute(index)"
                class="remove-button"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>

          <el-button 
            type="primary" 
            plain
            @click="addCustomAttribute"
            class="add-custom-attr-button"
          >
            <el-icon><Plus /></el-icon>
            Add Custom Attribute
          </el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 3. Sales Attributes Card -->
    <el-card class="info-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon><Picture /></el-icon>
          <span>Sales Attributes</span>
        </div>
      </template>

      <el-form :model="form" label-width="180px">
        <!-- Unit of Measure -->
        <el-form-item label="Unit of Measure">
          <el-select
            v-model="form.generalInfo.unitOfMeasure"
            placeholder="Select UOM"
            style="width: 100%"
          >
            <el-option label="Each (EA)" value="EA" />
            <el-option label="Kilogram (KG)" value="KG" />
            <el-option label="Pound (LB)" value="LB" />
            <el-option label="Pack" value="Pack" />
            <el-option label="Case" value="Case" />
            <el-option label="Pallet" value="Pallet" />
          </el-select>
        </el-form-item>

        <!-- Quantity -->
        <el-form-item label="Quantity">
          <el-input-number 
            v-model="form.generalInfo.attributes.quantity"
            :min="1"
            controls-position="right"
          />
        </el-form-item>

        <!-- Product Status -->
        <el-form-item label="Product Status">
          <el-radio-group v-model="form.generalInfo.status">
            <el-radio label="Draft">Draft</el-radio>
            <el-radio label="Active">Active</el-radio>
            <el-radio label="Inactive">Inactive</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- Sample Product -->
        <el-form-item label="Sample Product">
          <el-switch
            v-model="form.generalInfo.isSample"
            active-text="Yes"
            inactive-text="No"
          />
          <div class="field-help">
            Mark this product as a sample for testing purposes
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 4. Product Images Card -->
    <el-card class="info-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon><Picture /></el-icon>
          <span>Product Images</span>
        </div>
      </template>

      <el-form :model="form" label-width="180px">
        <!-- Main Images -->
        <el-form-item label="Main Images" required>
          <div class="upload-container">
            <el-upload
              v-model:file-list="mainImageFiles"
              action="#"
              list-type="picture-card"
              :limit="5"
              :auto-upload="false"
              accept="image/*"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
            <div class="upload-tips">
              <p>• Upload up to 5 main product images</p>
              <p>• Recommended size: 1000x1000px</p>
              <p>• Supported formats: JPG, PNG, GIF</p>
            </div>
          </div>
        </el-form-item>

        <!-- Additional Images -->
        <el-form-item label="Additional Images">
          <div class="upload-container">
            <el-upload
              v-model:file-list="additionalImageFiles"
              action="#"
              list-type="picture-card"
              :limit="10"
              :auto-upload="false"
              accept="image/*"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
            <div class="upload-tips">
              <p>• Upload up to 10 additional images</p>
              <p>• Use for detail shots, lifestyle images, etc.</p>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 5. Product Videos Card -->
    <el-card class="info-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon><Upload /></el-icon>
          <span>Product Videos</span>
        </div>
      </template>

      <el-form :model="form" label-width="180px">
        <!-- Video Upload -->
        <el-form-item label="Product Videos">
          <div class="upload-container">
            <el-upload
              v-model:file-list="videoFiles"
              action="#"
              :limit="3"
              :auto-upload="false"
              accept="video/*"
            >
              <el-button type="primary">
                <el-icon><Upload /></el-icon>
                Upload Video
              </el-button>
            </el-upload>
            <div class="upload-tips">
              <p>• Upload up to 3 product videos</p>
              <p>• Max file size: 100MB per video</p>
              <p>• Supported formats: MP4, MOV, AVI</p>
            </div>
          </div>
        </el-form-item>

        <!-- Video URL -->
        <el-form-item label="Video URL">
          <el-input
            v-model="form.mediaInfo.videoUrl"
            placeholder="Enter video URL (YouTube, Vimeo, etc.)"
          />
          <div class="field-help">
            Alternatively, provide a URL to an online video
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 6. Logistics Information Card -->
    <el-card class="info-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon><Upload /></el-icon>
          <span>Logistics Information</span>
        </div>
      </template>

      <el-form :model="form" label-width="180px">
        <!-- Weight -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Weight">
              <div class="input-group">
                <el-input-number
                  v-model="form.logisticsInfo.weight.net"
                  :min="0"
                  :precision="2"
                  placeholder="0.00"
                />
                <el-select
                  v-model="form.logisticsInfo.weight.unit"
                  style="width: 80px;"
                >
                  <el-option label="kg" value="kg" />
                  <el-option label="lb" value="lb" />
                  <el-option label="g" value="g" />
                  <el-option label="oz" value="oz" />
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Package Weight">
              <div class="input-group">
                <el-input-number
                  v-model="form.logisticsInfo.weight.gross"
                  :min="0"
                  :precision="2"
                  placeholder="0.00"
                />
                <el-select
                  v-model="form.logisticsInfo.weight.unit"
                  style="width: 80px;"
                >
                  <el-option label="kg" value="kg" />
                  <el-option label="lb" value="lb" />
                  <el-option label="g" value="g" />
                  <el-option label="oz" value="oz" />
                </el-select>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Dimensions -->
        <el-form-item label="Dimensions (L×W×H)">
          <div class="input-group">
            <el-input-number
              v-model="form.logisticsInfo.dimensions.length"
              :min="0"
              :precision="2"
              placeholder="Length"
            />
            <span class="separator">×</span>
            <el-input-number
              v-model="form.logisticsInfo.dimensions.width"
              :min="0"
              :precision="2"
              placeholder="Width"
            />
            <span class="separator">×</span>
            <el-input-number
              v-model="form.logisticsInfo.dimensions.height"
              :min="0"
              :precision="2"
              placeholder="Height"
            />
            <el-select
              v-model="form.logisticsInfo.dimensions.unit"
              style="width: 80px;"
            >
              <el-option label="cm" value="cm" />
              <el-option label="in" value="inch" />
              <el-option label="mm" value="mm" />
            </el-select>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 7. Supplier Information Card -->
    <el-card class="info-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon><InfoFilled /></el-icon>
          <span>Supplier Information</span>
        </div>
      </template>

      <el-form :model="form" label-width="180px">
        <!-- Supplier Details -->
        <el-form-item label="Supplier Name">
          <el-input
            v-model="form.supplierInfo.name"
            placeholder="Enter supplier name"
          />
        </el-form-item>

        <el-form-item label="Supplier Code">
          <el-input
            v-model="form.supplierInfo.code"
            placeholder="Enter supplier code"
          />
        </el-form-item>

        <el-form-item label="Contact Person">
          <el-input
            v-model="form.supplierInfo.contactPerson"
            placeholder="Enter contact person name"
          />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Email">
              <el-input
                v-model="form.supplierInfo.email"
                placeholder="Enter email address"
                type="email"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Phone">
              <el-input
                v-model="form.supplierInfo.phone"
                placeholder="Enter phone number"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Address">
          <el-input
            v-model="form.supplierInfo.address"
            type="textarea"
            :rows="3"
            placeholder="Enter supplier address"
          />
        </el-form-item>

        <!-- Lead Time -->
        <el-form-item label="Lead Time (days)">
          <el-input-number
            v-model="form.supplierInfo.leadTime"
            :min="1"
            placeholder="Enter lead time in days"
          />
        </el-form-item>

        <!-- Minimum Order Quantity -->
        <el-form-item label="Minimum Order Quantity">
          <el-input-number
            v-model="form.supplierInfo.moq"
            :min="1"
            placeholder="Enter MOQ"
          />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CategorySelector from '../CategorySelector.vue';
import { InfoFilled, Upload, Picture, Plus, Delete } from '@element-plus/icons-vue';
import type { Product } from '@/types/product';

const props = defineProps<{
  form: Product;
}>();

// Refs for file uploads
const mainImageFiles = ref([]);
const additionalImageFiles = ref([]);
const videoFiles = ref([]);

// 品牌数据
const brands = ['Nike', 'Adidas', 'Apple', 'Samsung', 'Sony', 'Canon'];

// 自定义属性管理
const addCustomAttribute = () => {
  if (!props.form.generalInfo.attributes) {
    props.form.generalInfo.attributes = {};
  }
  if (!props.form.generalInfo.attributes.customAttributes) {
    props.form.generalInfo.attributes.customAttributes = [];
  }
  props.form.generalInfo.attributes.customAttributes.push({
    key: '',
    value: ''
  });
};

const removeCustomAttribute = (index: number) => {
  if (props.form.generalInfo.attributes?.customAttributes) {
    props.form.generalInfo.attributes.customAttributes.splice(index, 1);
  }
};
</script>

<style scoped lang="scss">
.basic-info-container {
  max-width: 1200px;
  margin: 0 auto;
}

.info-card {
  margin-bottom: 24px;
  border-radius: 12px;
  border: 1px solid var(--el-border-color-light);

  &:last-child {
    margin-bottom: 0;
  }

  :deep(.el-card__header) {
    padding: 16px 20px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  :deep(.el-card__body) {
    padding: 24px;
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  font-size: 16px;

  .el-icon {
    color: var(--el-color-primary);
    font-size: 18px;
  }
}

.field-help {
  color: var(--el-text-color-secondary);
  font-size: 12px;
  margin-top: 4px;
}

.custom-attributes {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--el-border-color-light);
  
  .attribute-header {
    margin-bottom: 16px;
    
    .label {
      font-size: 14px;
      font-weight: 600;
      color: var(--el-text-color-regular);
      margin-bottom: 4px;
    }
    
    .tip-text {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
  
  .custom-attribute-item {
    margin-bottom: 12px;
    
    .input-group {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .key-input {
        flex: 1;
        min-width: 150px;
      }
      
      .value-input {
        flex: 2;
        min-width: 200px;
      }
      
      .remove-button {
        min-width: 40px;
        color: var(--el-color-danger);
        
        &:hover {
          background-color: var(--el-color-danger-light-9);
        }
      }
    }
  }
  
  .add-custom-attr-button {
    width: 100%;
    border-style: dashed;
    margin-top: 8px;
    
    &:hover {
      border-color: var(--el-color-primary);
      color: var(--el-color-primary);
    }
  }
}

.upload-container {
  width: 100%;

  .upload-tips {
    margin-top: 12px;
    padding: 12px;
    background: var(--el-fill-color-light);
    border-radius: 6px;
    
    p {
      margin: 0 0 4px 0;
      color: var(--el-text-color-secondary);
      font-size: 12px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;

  .separator {
    color: var(--el-text-color-secondary);
    margin: 0 4px;
    font-weight: bold;
  }

  .el-input-number {
    flex: 1;
  }
}

:deep(.el-form-item) {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  .el-form-item__label {
    line-height: 32px;
    font-weight: 500;
    color: var(--el-text-color-regular);
  }

  .el-form-item__content {
    line-height: 32px;
  }

  &.is-required .el-form-item__label:before {
    color: var(--el-color-danger);
  }
}

:deep(.el-upload--picture-card) {
  width: 104px;
  height: 104px;
  border-radius: 8px;
  border: 2px dashed var(--el-border-color);
  
  &:hover {
    border-color: var(--el-color-primary);
  }
}

:deep(.el-upload-list--picture-card) {
  .el-upload-list__item {
    width: 104px;
    height: 104px;
    border-radius: 8px;
  }
}
</style>
