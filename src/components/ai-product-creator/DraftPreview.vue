<template>
  <div class="draft-preview">
    <!-- 空状态 -->
    <div v-if="!result || result.meta.status === 'idle'" class="empty-state">
      <el-icon class="empty-icon"><Document /></el-icon>
      <p class="empty-text">还没有生成结果。请在上方上传图片或输入描述，然后点击 "Generate draft"。</p>
    </div>
    
    <!-- Loading状态 -->
    <div v-else-if="result.meta.status === 'loading'" class="loading-state">
      <el-skeleton :rows="8" animated />
      <el-skeleton :rows="5" animated style="margin-top: 20px" />
    </div>
    
    <!-- Generated状态 -->
    <div v-else-if="result.meta.status === 'generated'" class="generated-content">
      <el-row :gutter="24">
        <!-- 左侧：商品草稿内容 -->
        <el-col :span="16" v-if="editableResult">
          <!-- 商品概览 -->
          <el-card class="draft-card" shadow="never">
            <template #header>
              <span class="card-title">商品概览</span>
            </template>
            <div class="product-overview">
              <div class="title-row">
                <el-input
                  v-model="editableResult.title"
                  class="title-input"
                  placeholder="Product title"
                  @blur="handleFieldChange('title')"
                />
              </div>
              
              <div class="subtitle-row">
                <el-input
                  v-model="editableResult.subtitle"
                  class="subtitle-input"
                  placeholder="Subtitle (optional)"
                  @blur="handleFieldChange('subtitle')"
                />
              </div>
              
              <div class="category-row">
                <el-breadcrumb separator="/">
                  <el-breadcrumb-item v-for="(cat, index) in editableResult.categoryPath" :key="index">
                    <el-dropdown v-if="index === editableResult.categoryPath.length - 1" @command="handleCategoryChange">
                      <span class="category-link">{{ cat }}</span>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item command="drinkware">Drinkware</el-dropdown-item>
                          <el-dropdown-item command="electronics">Electronics</el-dropdown-item>
                          <el-dropdown-item command="home">Home</el-dropdown-item>
                          <el-dropdown-item command="fashion">Fashion</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                    <span v-else>{{ cat }}</span>
                  </el-breadcrumb-item>
                </el-breadcrumb>
              </div>
              
              <div class="tags-row">
                <el-tag
                  v-for="(tag, index) in editableResult.tags"
                  :key="index"
                  class="tag-item"
                  closable
                  @close="handleRemoveTag(index)"
                  effect="plain"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  v-if="showTagInput"
                  ref="tagInputRef"
                  v-model="newTag"
                  size="small"
                  class="tag-input"
                  @keyup.enter="handleAddTag"
                  @blur="showTagInput = false"
                />
                <el-button v-else size="small" text @click="showTagInput = true">
                  + Add tag
                </el-button>
              </div>
            </div>
          </el-card>
          
          <!-- 卖点与描述 -->
          <el-card class="draft-card" shadow="never">
            <template #header>
              <span class="card-title">卖点与描述</span>
            </template>
            
            <div class="content-section">
              <h3 class="section-title">Bullet Points</h3>
              <ul class="bullet-list">
                <li v-for="(bullet, index) in editableResult.bullets" :key="index" class="bullet-item">
                  <el-input
                    v-model="editableResult.bullets[index]"
                    @blur="handleFieldChange('bullets')"
                  />
                </li>
              </ul>
            </div>
            
            <div class="content-section">
              <h3 class="section-title">Description</h3>
              <el-input
                v-model="editableResult.description"
                type="textarea"
                :rows="6"
                @blur="handleFieldChange('description')"
              />
            </div>
          </el-card>
          
          <!-- 规格与变体 -->
          <el-card class="draft-card" shadow="never">
            <template #header>
              <span class="card-title">规格与变体</span>
            </template>
            
            <div class="content-section">
              <h3 class="section-title">Attributes</h3>
              <el-table :data="editableResult.attributes" border stripe size="small">
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
            
            <div v-if="editableResult.variants && editableResult.variants.length > 0" class="content-section">
              <h3 class="section-title">Variants</h3>
              <el-table :data="editableResult.variants" border stripe size="small">
                <el-table-column prop="name" label="Name" />
                <el-table-column prop="color" label="Color" />
                <el-table-column prop="size" label="Size" />
              </el-table>
            </div>
          </el-card>
        </el-col>
        
        <!-- 右侧：状态 + 操作栏 -->
        <el-col :span="8" v-if="editableResult">
          <el-card class="action-card" shadow="never">
            <div class="status-info">
              <el-tag :type="isEdited ? 'warning' : 'success'" size="large">
                {{ isEdited ? 'Edited' : 'Generated' }}
              </el-tag>
              <p v-if="result.meta.createdAt" class="meta-info">
                Created at: {{ formatDate(result.meta.createdAt) }}
              </p>
              <p v-if="isEdited" class="meta-info">
                Last edited: {{ formatDate(new Date().toISOString()) }}
              </p>
            </div>
            
            <div class="action-buttons">
              <el-button type="primary" block @click="handleSaveDraft">
                Save as draft product
              </el-button>
              
              <el-button block @click="handleApplyToExisting">
                Apply to existing product
              </el-button>
              
              <el-dropdown @command="handleRegenerate" trigger="click" style="width: 100%">
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
      
      <!-- 底部：Images Gallery -->
      <el-card v-if="result.images.length > 0" class="images-gallery-card" shadow="never">
        <template #header>
          <span class="card-title">Images</span>
        </template>
        <div class="images-gallery">
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
              <div class="thumbnail-overlay">
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

const editableResult = ref<AiProductResult | null>(null);
const isEdited = ref(false);
const showTagInput = ref(false);
const newTag = ref('');
const tagInputRef = ref();

watch(() => props.result, (newResult) => {
  if (newResult && newResult.meta.status === 'generated') {
    editableResult.value = JSON.parse(JSON.stringify(newResult));
    isEdited.value = false;
  } else if (!newResult || newResult.meta.status === 'idle') {
    editableResult.value = null;
    isEdited.value = false;
  }
}, { immediate: true, deep: true });

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

const handleFieldChange = (field: string) => {
  if (editableResult.value) {
    isEdited.value = true;
    emit('update:result', editableResult.value);
  }
};

const handleCategoryChange = (category: string) => {
  if (!editableResult.value) return;
  
  const categoryMap: Record<string, string[]> = {
    drinkware: ['Home', 'Kitchen', 'Drinkware'],
    electronics: ['Electronics', 'Audio', 'Headphones'],
    home: ['Home', 'Living', 'Furniture'],
    fashion: ['Fashion', 'Accessories', 'Bags']
  };
  
  editableResult.value.categoryPath = categoryMap[category] || editableResult.value.categoryPath;
  handleFieldChange('categoryPath');
};

const handleRemoveTag = (index: number) => {
  if (!editableResult.value) return;
  editableResult.value.tags.splice(index, 1);
  handleFieldChange('tags');
};

const handleAddTag = () => {
  if (!editableResult.value || !newTag.value.trim()) return;
  
  if (!editableResult.value.tags.includes(newTag.value.trim())) {
    editableResult.value.tags.push(newTag.value.trim());
    handleFieldChange('tags');
  }
  
  newTag.value = '';
  showTagInput.value = false;
};

const handleSaveDraft = () => {
  console.log('Save draft:', editableResult.value);
  ElMessage.success('Draft saved (check console)');
};

const handleApplyToExisting = () => {
  ElMessage.info('Apply to existing product feature coming soon');
};

const handleRegenerate = (field: string) => {
  emit('regenerate', field);
};

const handleExportJson = () => {
  if (!editableResult.value) return;
  
  const json = JSON.stringify(editableResult.value, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ai-product-draft-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  
  ElMessage.success('JSON exported');
};

const handleSetMainImage = (imageId: string) => {
  emit('set-main-image', imageId);
};

const handleDeleteImage = (imageId: string) => {
  emit('delete-image', imageId);
};
</script>

<style scoped lang="scss">
.draft-preview {
  .empty-state {
    text-align: center;
    padding: 80px 20px;
    
    .empty-icon {
      font-size: 64px;
      color: var(--el-text-color-placeholder);
      margin-bottom: 16px;
    }
    
    .empty-text {
      color: var(--el-text-color-secondary);
      font-size: 14px;
      line-height: 1.6;
    }
  }
  
  .loading-state {
    padding: 20px;
  }
  
  .generated-content {
    .draft-card {
      margin-bottom: 20px;
      
      .card-title {
        font-weight: 600;
        font-size: 16px;
      }
      
      .product-overview {
        .title-row {
          margin-bottom: 16px;
          
          .title-input {
            font-size: 24px;
            font-weight: 600;
            
            :deep(.el-input__inner) {
              font-size: 24px;
              font-weight: 600;
              border: none;
              padding: 0;
              box-shadow: none;
              
              &:focus {
                border-bottom: 2px solid var(--el-color-primary);
                border-radius: 0;
              }
            }
          }
        }
        
        .subtitle-row {
          margin-bottom: 16px;
          
          .subtitle-input {
            :deep(.el-input__inner) {
              border: none;
              padding: 0;
              box-shadow: none;
              
              &:focus {
                border-bottom: 1px solid var(--el-color-primary);
                border-radius: 0;
              }
            }
          }
        }
        
        .category-row {
          margin-bottom: 16px;
          
          .category-link {
            cursor: pointer;
            color: var(--el-color-primary);
            
            &:hover {
              text-decoration: underline;
            }
          }
        }
        
        .tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          
          .tag-item {
            margin: 0;
          }
          
          .tag-input {
            width: 120px;
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
          font-size: 15px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }
        
        .bullet-list {
          margin: 0;
          padding: 0;
          list-style: none;
          
          .bullet-item {
            margin-bottom: 8px;
            
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }
    
    .action-card {
      position: sticky;
      top: 20px;
      
      .status-info {
        margin-bottom: 24px;
        text-align: center;
        
        .meta-info {
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
    
    .images-gallery-card {
      margin-top: 20px;
      
      .images-gallery {
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
              
              .thumbnail-overlay {
                opacity: 1;
              }
            }
            
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            
            .thumbnail-overlay {
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

