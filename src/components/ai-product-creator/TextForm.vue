<template>
  <div class="text-form">
    <el-form :model="formState" label-width="140px">
      <el-card class="form-section" shadow="never">
        <el-form-item label="Description/Keywords">
          <el-input
            v-model="formState.descriptionOrKeywords"
            type="textarea"
            :rows="8"
            placeholder="Enter product description or keywords..."
          />
        </el-form-item>
        <el-form-item label="Language">
          <el-select v-model="formState.language" placeholder="Select language" style="width: 100%">
            <el-option label="English" value="english" />
            <el-option label="Chinese" value="chinese" />
            <el-option label="Japanese" value="japanese" />
            <el-option label="Korean" value="korean" />
          </el-select>
        </el-form-item>
        <el-form-item label="Generate Images">
          <el-switch v-model="formState.generateImages" />
        </el-form-item>
      </el-card>
      
      <!-- Advanced Options -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <span class="section-title">Advanced Options</span>
            <el-button text @click="showAdvanced = !showAdvanced">
              {{ showAdvanced ? 'Collapse' : 'Expand' }}
            </el-button>
          </div>
        </template>
        <div v-if="showAdvanced">
          <el-form-item label="Category Hint">
            <el-input v-model="formState.categoryHint" placeholder="Optional category hint" />
          </el-form-item>
          <el-form-item label="Tone">
            <el-select v-model="formState.tone" placeholder="Select tone" style="width: 100%">
              <el-option label="Professional" value="professional" />
              <el-option label="Friendly" value="friendly" />
              <el-option label="Premium" value="premium" />
            </el-select>
          </el-form-item>
          <el-form-item label="Max Bullet Points">
            <el-input-number
              v-model="formState.maxBulletPoints"
              :min="3"
              :max="7"
              style="width: 100%"
            />
          </el-form-item>
        </div>
      </el-card>
    </el-form>
    
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
import type { TextFormState } from '@/types/ai-product';

interface Emits {
  (e: 'generate', formState: TextFormState): void;
  (e: 'reset'): void;
}

const emit = defineEmits<Emits>();

const formState = reactive<TextFormState>({
  descriptionOrKeywords: '',
  language: 'english',
  generateImages: true,
  categoryHint: '',
  tone: 'professional',
  maxBulletPoints: 5
});

const showAdvanced = ref(false);
const loading = ref(false);

const handleGenerate = () => {
  if (!formState.descriptionOrKeywords.trim()) {
    ElMessage.warning('Please enter product description or keywords.');
    return;
  }
  
  loading.value = true;
  emit('generate', { ...formState });
  
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};

const handleReset = () => {
  formState.descriptionOrKeywords = '';
  formState.language = 'english';
  formState.generateImages = true;
  formState.categoryHint = '';
  formState.tone = 'professional';
  formState.maxBulletPoints = 5;
  showAdvanced.value = false;
  emit('reset');
};
</script>

<style scoped lang="scss">
.text-form {
  .form-section {
    margin-bottom: 20px;
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .section-title {
        font-weight: 600;
        font-size: 15px;
      }
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

