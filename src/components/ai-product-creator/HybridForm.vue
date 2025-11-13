<template>
  <div class="hybrid-form">
    <el-form :model="formState" label-width="120px">
      <!-- Product Notes -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <span class="section-title">Product Notes</span>
        </template>
        <el-form-item label="Description">
          <el-input
            v-model="formState.productNotes"
            type="textarea"
            :rows="5"
            placeholder="Describe your product: materials, size, use cases, selling points..."
          />
        </el-form-item>
        <el-form-item label="Tone">
          <el-select v-model="formState.tone" placeholder="Select tone" style="width: 100%">
            <el-option label="Professional" value="professional" />
            <el-option label="Friendly" value="friendly" />
            <el-option label="Premium" value="premium" />
          </el-select>
        </el-form-item>
      </el-card>
      
      <!-- Basic Info -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <span class="section-title">Basic Info</span>
        </template>
        <el-form-item label="Brand">
          <el-input v-model="formState.brand" placeholder="Enter brand name" />
        </el-form-item>
        <el-form-item label="Category">
          <el-select v-model="formState.category" placeholder="Select category" style="width: 100%">
            <el-option label="Drinkware" value="drinkware" />
            <el-option label="Electronics" value="electronics" />
            <el-option label="Home" value="home" />
            <el-option label="Fashion" value="fashion" />
          </el-select>
        </el-form-item>
        <el-form-item label="Target Audience">
          <el-checkbox-group v-model="formState.targetAudience">
            <el-checkbox label="Men" />
            <el-checkbox label="Women" />
            <el-checkbox label="Kids" />
            <el-checkbox label="Outdoor" />
            <el-checkbox label="Office" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="Language">
          <el-select v-model="formState.language" placeholder="Select language" style="width: 100%">
            <el-option label="English" value="english" />
            <el-option label="Chinese" value="chinese" />
            <el-option label="Japanese" value="japanese" />
            <el-option label="Korean" value="korean" />
          </el-select>
        </el-form-item>
      </el-card>
      
      <!-- AI Options -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <span class="section-title">AI Options</span>
        </template>
        <el-form-item label="Generate Images">
          <el-switch v-model="formState.generateImages" />
        </el-form-item>
        <el-form-item label="Output Detail Level">
          <el-select v-model="formState.outputDetailLevel" placeholder="Select level" style="width: 100%">
            <el-option label="Quick" value="quick" />
            <el-option label="Normal" value="normal" />
            <el-option label="High" value="high" />
          </el-select>
        </el-form-item>
        <el-form-item label="Generate Variants">
          <el-switch v-model="formState.generateVariants" />
        </el-form-item>
        <el-form-item label="Include SEO Fields">
          <el-switch v-model="formState.includeSeoFields" />
        </el-form-item>
      </el-card>
    </el-form>
    
    <!-- Actions -->
    <div class="form-actions">
      <el-button type="primary" size="large" @click="handleGenerate" :loading="loading">
        Generate Product
      </el-button>
      <el-button size="large" @click="handleReset">Reset</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import type { HybridFormState } from '@/types/ai-product';
import type { AiProductImage } from '@/types/ai-product';

interface Props {
  images: AiProductImage[];
  loading?: boolean;
}

interface Emits {
  (e: 'generate', data: { formState: HybridFormState; images: AiProductImage[] }): void;
  (e: 'reset'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formState = reactive<HybridFormState>({
  productNotes: '',
  tone: 'professional',
  brand: '',
  category: '',
  targetAudience: [],
  language: 'english',
  generateImages: true,
  outputDetailLevel: 'normal',
  generateVariants: false,
  includeSeoFields: true
});

const loading = ref(false);

const handleGenerate = () => {
  if (props.images.length === 0 && !formState.productNotes.trim()) {
    ElMessage.warning('Please upload at least one image or provide some product notes.');
    return;
  }
  
  loading.value = true;
  emit('generate', {
    formState: { ...formState },
    images: props.images
  });
  
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};

const handleReset = () => {
  formState.productNotes = '';
  formState.tone = 'professional';
  formState.brand = '';
  formState.category = '';
  formState.targetAudience = [];
  formState.language = 'english';
  formState.generateImages = true;
  formState.outputDetailLevel = 'normal';
  formState.generateVariants = false;
  formState.includeSeoFields = true;
  emit('reset');
};
</script>

<style scoped lang="scss">
.hybrid-form {
  .form-section {
    margin-bottom: 20px;
    
    .section-title {
      font-weight: 600;
      font-size: 15px;
    }
  }
  
  .form-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}
</style>

