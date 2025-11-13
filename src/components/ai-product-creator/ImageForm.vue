<template>
  <div class="image-form">
    <el-row :gutter="24">
      <el-col :span="16">
        <ImageUploader
          :images="images"
          @update:images="$emit('update:images', $event)"
          @change-main="$emit('change-main', $event)"
          @remove="$emit('remove', $event)"
        />
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          <template #header>
            <span class="section-title">Options</span>
          </template>
          <el-form :model="formState" label-width="100px">
            <el-form-item label="Short Notes">
              <el-input
                v-model="formState.shortNotes"
                type="textarea"
                :rows="4"
                placeholder="Optional notes..."
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
            <el-form-item label="Category">
              <el-select v-model="formState.category" placeholder="Optional category" style="width: 100%" clearable>
                <el-option label="Drinkware" value="drinkware" />
                <el-option label="Electronics" value="electronics" />
                <el-option label="Home" value="home" />
                <el-option label="Fashion" value="fashion" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    
    <div class="form-actions">
      <el-button type="primary" size="large" @click="handleDetect" :loading="loading">
        Detect & Create
      </el-button>
      <el-button size="large" @click="handleReset">Reset</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import ImageUploader from './ImageUploader.vue';
import type { ImageFormState } from '@/types/ai-product';
import type { AiProductImage } from '@/types/ai-product';

interface Props {
  images: AiProductImage[];
}

interface Emits {
  (e: 'update:images', images: AiProductImage[]): void;
  (e: 'change-main', imageId: string): void;
  (e: 'remove', imageId: string): void;
  (e: 'generate', data: { formState: ImageFormState; images: AiProductImage[] }): void;
  (e: 'reset'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formState = reactive<ImageFormState>({
  shortNotes: '',
  language: 'english',
  category: ''
});

const loading = ref(false);

const handleDetect = () => {
  if (props.images.length === 0) {
    ElMessage.warning('Please upload at least one image.');
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
  formState.shortNotes = '';
  formState.language = 'english';
  formState.category = '';
  emit('reset');
};
</script>

<style scoped lang="scss">
.image-form {
  .section-title {
    font-weight: 600;
    font-size: 15px;
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

