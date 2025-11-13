<template>
  <div class="image-uploader">
    <!-- 上传区域 -->
    <div 
      class="upload-area"
      :class="{ 'drag-over': isDragOver }"
      @drop="handleDrop"
      @dragover.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
      @click="triggerFileInput"
    >
      <input
        ref="fileInputRef"
        type="file"
        multiple
        accept="image/*"
        @change="handleFileChange"
        style="display: none"
      />
      <el-icon class="upload-icon"><Upload /></el-icon>
      <div class="upload-text">
        <p class="main-text">Drop images here or click to upload</p>
        <p class="sub-text">JPG, PNG, WEBP · up to 10 images</p>
      </div>
    </div>
    
    <!-- 图片列表 -->
    <div v-if="images.length > 0" class="image-list">
      <div 
        v-for="image in images" 
        :key="image.id" 
        class="image-item"
      >
        <div class="image-preview">
          <img :src="image.url" :alt="image.id" />
          <div v-if="image.isMain" class="main-badge">Main</div>
        </div>
        <div class="image-info">
          <div class="image-name">{{ getImageName(image) }}</div>
          <div class="image-actions">
            <el-button 
              v-if="!image.isMain"
              size="small" 
              type="primary" 
              text
              @click="handleSetMain(image.id)"
            >
              Set main
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              text
              @click="handleRemove(image.id)"
            >
              Delete
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Upload } from '@element-plus/icons-vue';
import type { AiProductImage } from '@/types/ai-product';

interface Props {
  images: AiProductImage[];
  maxImages?: number;
}

interface Emits {
  (e: 'update:images', images: AiProductImage[]): void;
  (e: 'change-main', imageId: string): void;
  (e: 'remove', imageId: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  maxImages: 10
});

const emit = defineEmits<Emits>();

const fileInputRef = ref<HTMLInputElement>();
const isDragOver = ref(false);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    processFiles(Array.from(target.files));
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;
  
  if (event.dataTransfer?.files) {
    processFiles(Array.from(event.dataTransfer.files));
  }
};

const processFiles = (files: File[]) => {
  const imageFiles = files.filter(file => file.type.startsWith('image/'));
  
  if (props.images.length + imageFiles.length > props.maxImages) {
    ElMessage.warning(`Maximum ${props.maxImages} images allowed`);
    return;
  }
  
  imageFiles.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newImage: AiProductImage = {
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        url: e.target?.result as string,
        file: file,
        isMain: props.images.length === 0 // 第一张自动设为主图
      };
      
      const updatedImages = [...props.images, newImage];
      emit('update:images', updatedImages);
    };
    reader.readAsDataURL(file);
  });
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleSetMain = (imageId: string) => {
  emit('change-main', imageId);
};

const handleRemove = (imageId: string) => {
  emit('remove', imageId);
};

const getImageName = (image: AiProductImage): string => {
  if (image.file) {
    return image.file.name;
  }
  return `Image ${image.id.substring(0, 8)}`;
};
</script>

<style scoped lang="scss">
.image-uploader {
  .upload-area {
    border: 1px dashed var(--el-border-color);
    border-radius: 4px;
    padding: 24px 12px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: var(--el-fill-color-light);
    
    &:hover {
      border-color: var(--el-color-primary);
      background: var(--el-color-primary-light-9);
    }
    
    &.drag-over {
      border-color: var(--el-color-primary);
      background: var(--el-color-primary-light-9);
    }
    
    .upload-icon {
      font-size: 32px;
      color: var(--el-text-color-secondary);
      margin-bottom: 8px;
    }
    
    .upload-text {
      .main-text {
        margin: 0 0 4px 0;
        font-size: 13px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }
      
      .sub-text {
        margin: 0;
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
  
  .image-list {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    .image-item {
      border: 1px solid var(--el-border-color-lighter);
      border-radius: 4px;
      overflow: hidden;
      background: var(--el-bg-color);
      display: flex;
      gap: 8px;
      padding: 8px;
      
      .image-preview {
        position: relative;
        width: 60px;
        height: 60px;
        flex-shrink: 0;
        overflow: hidden;
        background: var(--el-fill-color-light);
        border-radius: 4px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .main-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: var(--el-color-primary);
          color: white;
          padding: 2px 4px;
          border-radius: 2px;
          font-size: 10px;
          font-weight: 600;
        }
      }
      
      .image-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
        .image-name {
          font-size: 12px;
          color: var(--el-text-color-regular);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 4px;
        }
        
        .image-actions {
          display: flex;
          gap: 4px;
        }
      }
    }
  }
}
</style>


