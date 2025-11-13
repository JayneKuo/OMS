<template>
  <el-card class="input-form-card" shadow="never">
    <template #header>
      <div class="card-header">
        <div>
          <h2 class="card-title">AI 创建商品</h2>
          <p class="card-subtitle">上传图片或输入描述，我帮你生成一个可上架的商品草稿。</p>
        </div>
      </div>
    </template>
    
    <el-form :model="formState" label-width="100px">
      <!-- ① 必填/主入口：用户有什么 -->
      <div class="form-section primary-section">
        <h3 class="section-title">您有什么？</h3>
        
        <!-- 图片上传 -->
        <div class="image-upload-wrapper">
          <ImageUploader
            :images="images"
            @update:images="$emit('update:images', $event)"
            @change-main="$emit('change-main', $event)"
            @remove="$emit('remove', $event)"
          />
        </div>
        
        <!-- 描述文本框 -->
        <el-form-item label="描述（可选）">
          <el-input
            v-model="formState.productNotes"
            type="textarea"
            :rows="4"
            placeholder="304 stainless steel tumbler, 600ml, keeps warm 12 hours…"
            maxlength="2000"
            show-word-limit
          />
        </el-form-item>
      </div>
      
      <!-- ② 推荐填写：系统最少需要的信息 -->
      <div class="form-section recommended-section">
        <h3 class="section-title">推荐填写</h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Brand">
              <el-input v-model="formState.brand" placeholder="Enter brand name" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Category">
              <el-select v-model="formState.category" placeholder="Select category" clearable style="width: 100%">
                <el-option label="Let AI decide" value="" />
                <el-option label="Drinkware" value="drinkware" />
                <el-option label="Electronics" value="electronics" />
                <el-option label="Home" value="home" />
                <el-option label="Fashion" value="fashion" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Language">
              <el-select v-model="formState.language" placeholder="Select language" style="width: 100%">
                <el-option label="English" value="english" />
                <el-option label="Chinese" value="chinese" />
                <el-option label="Japanese" value="japanese" />
                <el-option label="Korean" value="korean" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      
      <!-- ③ 高级选项：默认折叠 -->
      <div class="form-section advanced-section">
        <el-collapse v-model="advancedExpanded">
          <el-collapse-item name="advanced" :title="'Advanced options'">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Generate Images">
                  <el-switch v-model="formState.generateImages" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Generate Variants">
                  <el-switch v-model="formState.generateVariants" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Detail Level">
                  <el-select v-model="formState.outputDetailLevel" placeholder="Select level" style="width: 100%">
                    <el-option label="Quick" value="quick" />
                    <el-option label="Normal" value="normal" />
                    <el-option label="High" value="high" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Tone">
                  <el-select v-model="formState.tone" placeholder="Select tone" style="width: 100%">
                    <el-option label="Professional" value="professional" />
                    <el-option label="Friendly" value="friendly" />
                    <el-option label="Premium" value="premium" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Include SEO Fields">
                  <el-switch v-model="formState.includeSeoFields" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-form>
    
    <!-- 操作按钮 -->
    <div class="form-actions">
      <el-button type="primary" size="large" @click="handleGenerate" :loading="props.loading" :disabled="props.loading">
        Generate draft
      </el-button>
      <el-button size="large" @click="handleReset">Reset</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import ImageUploader from './ImageUploader.vue';
import type { AiProductImage } from '@/types/ai-product';

interface Props {
  images: AiProductImage[];
  loading?: boolean;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'update:images', images: AiProductImage[]): void;
  (e: 'change-main', imageId: string): void;
  (e: 'remove', imageId: string): void;
  (e: 'generate', data: { formState: any; images: AiProductImage[] }): void;
  (e: 'reset'): void;
}

const emit = defineEmits<Emits>();

const advancedExpanded = ref<string[]>([]);

const formState = reactive({
  productNotes: '',
  brand: '',
  category: '',
  language: 'english',
  generateImages: true,
  generateVariants: false,
  outputDetailLevel: 'normal',
  tone: 'professional',
  includeSeoFields: true
});

const handleGenerate = () => {
  if (props.images.length === 0 && !formState.productNotes.trim()) {
    ElMessage.warning('Please upload at least one image or provide some product notes.');
    return;
  }
  
  emit('generate', {
    formState: { ...formState },
    images: props.images
  });
};

const handleReset = () => {
  formState.productNotes = '';
  formState.brand = '';
  formState.category = '';
  formState.language = 'english';
  formState.generateImages = true;
  formState.generateVariants = false;
  formState.outputDetailLevel = 'normal';
  formState.tone = 'professional';
  formState.includeSeoFields = true;
  advancedExpanded.value = [];
  emit('reset');
};
</script>

<style scoped lang="scss">
.input-form-card {
  .card-header {
    .card-title {
      margin: 0 0 8px 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
    
    .card-subtitle {
      margin: 0;
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }
  
  .form-section {
    margin-bottom: 32px;
    
    &:last-of-type {
      margin-bottom: 0;
    }
    
    .section-title {
      margin: 0 0 16px 0;
      font-size: 15px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
    
    &.primary-section {
      .image-upload-wrapper {
        margin-bottom: 20px;
      }
    }
    
    &.recommended-section {
      padding-top: 20px;
      border-top: 1px solid var(--el-border-color-lighter);
    }
    
    &.advanced-section {
      padding-top: 20px;
      border-top: 1px solid var(--el-border-color-lighter);
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}
</style>

