<template>
  <div class="result-preview">
    <!-- 空状态 -->
    <div v-if="!result || result.meta.status === 'idle'" class="empty-state">
      <el-icon class="empty-icon"><Document /></el-icon>
      <p class="empty-text">No AI result yet. Fill in the form and click Generate Product to see AI output here.</p>
    </div>
    
    <!-- Loading状态 -->
    <div v-else-if="result.meta.status === 'loading'" class="loading-state">
      <el-skeleton :rows="8" animated />
      <el-skeleton :rows="5" animated style="margin-top: 20px" />
    </div>
    
    <!-- Error状态 -->
    <div v-else-if="result.meta.status === 'error'" class="error-state">
      <el-alert
        :title="result.meta.errorMessage || 'Failed to generate product'"
        type="error"
        :closable="false"
      />
    </div>
    
    <!-- Generated状态 -->
    <div v-else-if="result.meta.status === 'generated'" class="generated-content">
      <el-row :gutter="24">
        <!-- 左列：主要内容 -->
        <el-col :span="16">
          <!-- Basic Info -->
          <el-card class="content-card" shadow="never">
            <template #header>
              <span class="card-title">Basic Info</span>
            </template>
            <div class="basic-info">
              <h2 class="product-title" v-if="!editing.title" @dblclick="editing.title = true">
                {{ result.title }}
              </h2>
              <el-input
                v-else
                v-model="editableResult.title"
                @blur="editing.title = false"
                @keyup.enter="editing.title = false"
                class="title-input"
              />
              
              <div v-if="result.subtitle" class="product-subtitle">
                <span v-if="!editing.subtitle" @dblclick="editing.subtitle = true">{{ result.subtitle }}</span>
                <el-input
                  v-else
                  v-model="editableResult.subtitle"
                  @blur="editing.subtitle = false"
                  @keyup.enter="editing.subtitle = false"
                />
              </div>
              
              <div class="category-path">
                <el-breadcrumb separator="/">
                  <el-breadcrumb-item v-for="(cat, index) in result.categoryPath" :key="index">
                    {{ cat }}
                  </el-breadcrumb-item>
                </el-breadcrumb>
              </div>
              
              <div class="tags">
                <el-tag
                  v-for="tag in result.tags"
                  :key="tag"
                  class="tag-item"
                  effect="plain"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </el-card>
          
          <!-- Content -->
          <el-card class="content-card" shadow="never">
            <template #header>
              <span class="card-title">Content</span>
            </template>
            
            <div class="content-section">
              <h3 class="section-title">Bullet Points</h3>
              <ul class="bullet-list">
                <li v-for="(bullet, index) in result.bullets" :key="index">
                  <span v-if="!editing.bullets[index]" @dblclick="editing.bullets[index] = true">
                    {{ bullet }}
                  </span>
                  <el-input
                    v-else
                    v-model="editableResult.bullets[index]"
                    @blur="editing.bullets[index] = false"
                    @keyup.enter="editing.bullets[index] = false"
                  />
                </li>
              </ul>
            </div>
            
            <div class="content-section">
              <h3 class="section-title">Description</h3>
              <p v-if="!editing.description" @dblclick="editing.description = true" class="description-text">
                {{ result.description }}
              </p>
              <el-input
                v-else
                v-model="editableResult.description"
                type="textarea"
                :rows="6"
                @blur="editing.description = false"
              />
            </div>
            
            <div class="content-section">
              <h3 class="section-title">Attributes</h3>
              <el-table :data="result.attributes" border stripe size="small">
                <el-table-column prop="name" label="Name" width="150" />
                <el-table-column prop="value" label="Value" />
                <el-table-column prop="source" label="Source" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getSourceTagType(row.source)" size="small">
                      {{ row.source.toUpperCase() }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
          
          <!-- Variants -->
          <el-card v-if="result.variants && result.variants.length > 0" class="content-card" shadow="never">
            <template #header>
              <div class="card-header-with-action">
                <span class="card-title">Variants</span>
                <el-button size="small" type="primary" @click="handleAddVariant">
                  Add Variant
                </el-button>
              </div>
            </template>
            <el-table :data="result.variants" border stripe size="small">
              <el-table-column prop="name" label="Name" />
              <el-table-column prop="color" label="Color" />
              <el-table-column prop="size" label="Size" />
            </el-table>
          </el-card>
        </el-col>
        
        <!-- 右列：操作栏 -->
        <el-col :span="8">
          <el-card class="action-card" shadow="never">
            <div class="status-info">
              <el-tag type="success" size="large">Generated</el-tag>
              <p v-if="result.meta.createdAt" class="created-at">
                Created at: {{ formatDate(result.meta.createdAt) }}
              </p>
            </div>
            
            <div class="action-buttons">
              <el-button type="primary" block @click="handleSave">
                Save as Product
              </el-button>
              
              <el-button block @click="isEditing = !isEditing">
                {{ isEditing ? 'Done Editing' : 'Edit Fields' }}
              </el-button>
              
              <el-dropdown @command="handleRegenerate" trigger="click">
                <el-button block>
                  Regenerate <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="title">Regenerate Title</el-dropdown-item>
                    <el-dropdown-item command="bullets">Regenerate Bullets</el-dropdown-item>
                    <el-dropdown-item command="description">Regenerate Description</el-dropdown-item>
                    <el-dropdown-item command="attributes">Regenerate Attributes</el-dropdown-item>
                    <el-dropdown-item command="images">Regenerate Images</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              
              <el-button block @click="handleExportJson">
                Export JSON
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 图片展示区 -->
      <el-card class="images-card" shadow="never" v-if="result.images.length > 0">
        <template #header>
          <span class="card-title">Images</span>
        </template>
        <div class="images-display">
          <div class="main-image">
            <img 
              :src="mainImage?.url" 
              :alt="mainImage?.id"
              v-if="mainImage"
            />
          </div>
          <div class="thumbnail-list">
            <div
              v-for="image in result.images"
              :key="image.id"
              class="thumbnail-item"
              :class="{ 'is-main': image.isMain }"
            >
              <img :src="image.url" :alt="image.id" />
              <div class="thumbnail-actions">
                <el-button
                  v-if="!image.isMain"
                  size="small"
                  type="primary"
                  plain
                  @click="handleSetMainImage(image.id)"
                >
                  Set as main
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  plain
                  @click="handleDeleteImage(image.id)"
                >
                  Delete
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Document, ArrowDown } from '@element-plus/icons-vue';
import type { AiProductResult, AttributeSource } from '@/types/ai-product';

interface Props {
  result: AiProductResult | null;
}

interface Emits {
  (e: 'update:result', result: AiProductResult): void;
  (e: 'regenerate', field: string): void;
  (e: 'set-main-image', imageId: string): void;
  (e: 'delete-image', imageId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isEditing = ref(false);
const editing = ref({
  title: false,
  subtitle: false,
  description: false,
  bullets: [] as boolean[]
});

const editableResult = ref<AiProductResult | null>(null);

watch(() => props.result, (newResult) => {
  if (newResult) {
    editableResult.value = JSON.parse(JSON.stringify(newResult));
    editing.value.bullets = new Array(newResult.bullets.length).fill(false);
  }
}, { immediate: true });

const mainImage = computed(() => {
  if (!props.result) return null;
  return props.result.images.find(img => img.isMain) || props.result.images[0];
});

const getSourceTagType = (source: AttributeSource): string => {
  const map: Record<AttributeSource, string> = {
    image: 'info',
    notes: 'success',
    ai: 'warning'
  };
  return map[source] || '';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

const handleSave = () => {
  console.log('Save product:', props.result);
  ElMessage.success('Product saved (check console)');
};

const handleRegenerate = (field: string) => {
  emit('regenerate', field);
};

const handleExportJson = () => {
  if (!props.result) return;
  
  const json = JSON.stringify(props.result, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ai-product-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  
  ElMessage.success('JSON exported');
};

const handleAddVariant = () => {
  if (!props.result || !editableResult.value) return;
  
  if (!editableResult.value.variants) {
    editableResult.value.variants = [];
  }
  
  editableResult.value.variants.push({
    name: `Variant ${editableResult.value.variants.length + 1}`,
    color: '',
    size: ''
  });
  
  emit('update:result', editableResult.value);
};

const handleSetMainImage = (imageId: string) => {
  emit('set-main-image', imageId);
};

const handleDeleteImage = (imageId: string) => {
  emit('delete-image', imageId);
};
</script>

<style scoped lang="scss">
.result-preview {
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    
    .empty-icon {
      font-size: 64px;
      color: var(--el-text-color-placeholder);
      margin-bottom: 16px;
    }
    
    .empty-text {
      color: var(--el-text-color-secondary);
      font-size: 14px;
    }
  }
  
  .loading-state {
    padding: 20px;
  }
  
  .error-state {
    padding: 20px;
  }
  
  .generated-content {
    .content-card {
      margin-bottom: 20px;
      
      .card-title {
        font-weight: 600;
        font-size: 16px;
      }
      
      .card-header-with-action {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .basic-info {
        .product-title {
          margin: 0 0 12px 0;
          font-size: 24px;
          font-weight: 600;
          color: var(--el-text-color-primary);
          cursor: pointer;
          
          &:hover {
            color: var(--el-color-primary);
          }
        }
        
        .title-input {
          font-size: 24px;
          font-weight: 600;
        }
        
        .product-subtitle {
          margin-bottom: 16px;
          font-size: 16px;
          color: var(--el-text-color-regular);
          cursor: pointer;
          
          &:hover {
            color: var(--el-color-primary);
          }
        }
        
        .category-path {
          margin-bottom: 16px;
        }
        
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          
          .tag-item {
            margin: 0;
          }
        }
      }
      
      .content-section {
        margin-bottom: 24px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .section-title {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }
        
        .bullet-list {
          margin: 0;
          padding-left: 20px;
          
          li {
            margin-bottom: 8px;
            line-height: 1.6;
            cursor: pointer;
            
            &:hover {
              color: var(--el-color-primary);
            }
          }
        }
        
        .description-text {
          margin: 0;
          line-height: 1.8;
          color: var(--el-text-color-regular);
          cursor: pointer;
          
          &:hover {
            color: var(--el-color-primary);
          }
        }
      }
    }
    
    .action-card {
      position: sticky;
      top: 20px;
      
      .status-info {
        margin-bottom: 20px;
        text-align: center;
        
        .created-at {
          margin: 12px 0 0 0;
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
      
      .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
    }
    
    .images-card {
      margin-top: 20px;
      
      .images-display {
        display: flex;
        gap: 20px;
        
        .main-image {
          flex: 1;
          max-width: 500px;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          background: var(--el-fill-color-light);
          
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
        
        .thumbnail-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 500px;
          overflow-y: auto;
          
          .thumbnail-item {
            width: 120px;
            aspect-ratio: 1;
            border: 2px solid var(--el-border-color);
            border-radius: 8px;
            overflow: hidden;
            position: relative;
            cursor: pointer;
            transition: all 0.3s;
            
            &.is-main {
              border-color: var(--el-color-primary);
            }
            
            &:hover {
              border-color: var(--el-color-primary);
              
              .thumbnail-actions {
                opacity: 1;
              }
            }
            
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            
            .thumbnail-actions {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.6);
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              gap: 8px;
              opacity: 0;
              transition: opacity 0.3s;
            }
          }
        }
      }
    }
  }
}
</style>

