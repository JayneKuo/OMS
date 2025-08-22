# 变体选项组件
<template>
  <el-form-item
    label="变体选项"
    required
    class="variant-options"
  >
    <div class="options-container">
      <!-- 每个维度的选项管理 -->
      <div
        v-for="dimension in dimensions"
        :key="dimension"
        class="dimension-options"
      >
        <div class="dimension-header">
          <el-icon>
            <component :is="getDimensionIcon(dimension)" />
          </el-icon>
          <span class="dimension-label">{{ getDimensionLabel(dimension) }}</span>
        </div>

        <!-- 选项列表 -->
        <div class="options-list">
          <div
            v-for="(option, index) in dimensionOptions[dimension]"
            :key="index"
            class="option-item"
          >
            <!-- 选项值 -->
            <el-input
              v-model="option.value"
              :placeholder="'请输入' + getDimensionLabel(dimension) + '选项'"
            >
              <template #prepend>
                <el-tag size="small" round>{{ index + 1 }}</el-tag>
              </template>
              <template #append>
                <el-button
                  type="danger"
                  link
                  @click="removeOption(dimension, index)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </template>
            </el-input>

            <!-- 选项展示名称 -->
            <el-input
              v-model="option.displayName"
              :placeholder="'展示名称（可选）'"
              class="display-name-input"
            />

            <!-- 选项图片 -->
            <div v-if="dimension === 'Color'" class="option-image">
              <el-upload
                :file-list="option.image ? [{ url: option.image }] : []"
                :action="uploadAction"
                list-type="picture-card"
                :limit="1"
                :before-upload="beforeUpload"
                :on-success="(response) => handleImageSuccess(response, dimension, index)"
                :on-remove="() => handleImageRemove(dimension, index)"
              >
                <template #default>
                  <el-icon class="upload-icon"><Plus /></el-icon>
                  <div class="upload-text">上传图片</div>
                </template>
                <template #tip>
                  <div class="upload-tip">建议上传正方形图片</div>
                </template>
              </el-upload>
            </div>
          </div>

          <!-- 添加选项按钮 -->
          <el-button
            type="primary"
            link
            @click="addOption(dimension)"
          >
            <el-icon><Plus /></el-icon>
            添加{{ getDimensionLabel(dimension) }}选项
          </el-button>
        </div>

        <!-- 快速添加 -->
        <div class="quick-add">
          <el-input
            v-model="quickAddValue[dimension]"
            :placeholder="'批量添加' + getDimensionLabel(dimension) + '选项，用逗号分隔'"
            @keyup.enter="handleQuickAdd(dimension)"
          >
            <template #append>
              <el-button @click="handleQuickAdd(dimension)">
                快速添加
              </el-button>
            </template>
          </el-input>
        </div>

        <!-- 常用选项 -->
        <div class="common-options">
          <span class="common-options-label">常用选项：</span>
          <el-button
            v-for="option in getCommonOptions(dimension)"
            :key="option"
            link
            type="primary"
            @click="addCommonOption(dimension, option)"
          >
            {{ option }}
          </el-button>
        </div>
      </div>
    </div>
  </el-form-item>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { VariantDimension } from '@/types/product';

const props = defineProps<{
  dimensions: VariantDimension[];
  options?: {
    [key in VariantDimension]?: {
      value: string;
      displayName?: string;
      image?: string;
    }[];
  };
}>();

const emit = defineEmits<{
  'update:options': [options: NonNullable<typeof props.options>];
}>();

// 上传相关
const uploadAction = '/api/upload';

// 维度选项
const dimensionOptions = computed(() => {
  const options: NonNullable<typeof props.options> = {};
  props.dimensions.forEach(dimension => {
    options[dimension] = props.options?.[dimension] || [];
  });
  return options;
});

// 快速添加的值
const quickAddValue = ref<Record<VariantDimension, string>>({
  Color: '',
  Size: '',
  Material: '',
  Style: ''
});

// 维度信息
const dimensionInfo = {
  Color: {
    label: '颜色',
    icon: 'Brush',
    common: ['黑色', '白色', '红色', '蓝色', '灰色']
  },
  Size: {
    label: '尺码',
    icon: 'ScaleToOriginal',
    common: ['S', 'M', 'L', 'XL', 'XXL']
  },
  Material: {
    label: '材质',
    icon: 'Box',
    common: ['棉', '涤纶', '尼龙', '羊毛', '真丝']
  },
  Style: {
    label: '款式',
    icon: 'Stamp',
    common: ['圆领', 'V领', '立领', '翻领', '连帽']
  }
};

// 获取维度图标
function getDimensionIcon(dimension: VariantDimension) {
  return dimensionInfo[dimension].icon;
}

// 获取维度标签
function getDimensionLabel(dimension: VariantDimension) {
  return dimensionInfo[dimension].label;
}

// 获取常用选项
function getCommonOptions(dimension: VariantDimension) {
  return dimensionInfo[dimension].common;
}

// 添加选项
function addOption(dimension: VariantDimension) {
  const options = { ...dimensionOptions.value };
  if (!options[dimension]) {
    options[dimension] = [];
  }
  options[dimension]!.push({
    value: '',
    displayName: '',
    image: ''
  });
  emit('update:options', options);
}

// 移除选项
function removeOption(dimension: VariantDimension, index: number) {
  const options = { ...dimensionOptions.value };
  options[dimension]!.splice(index, 1);
  emit('update:options', options);
}

// 快速添加处理
function handleQuickAdd(dimension: VariantDimension) {
  const value = quickAddValue.value[dimension].trim();
  if (!value) return;

  const options = { ...dimensionOptions.value };
  if (!options[dimension]) {
    options[dimension] = [];
  }

  const values = value.split(/[,，]/).map(v => v.trim()).filter(Boolean);
  values.forEach(v => {
    options[dimension]!.push({
      value: v,
      displayName: '',
      image: ''
    });
  });

  emit('update:options', options);
  quickAddValue.value[dimension] = '';
}

// 添加常用选项
function addCommonOption(dimension: VariantDimension, value: string) {
  const options = { ...dimensionOptions.value };
  if (!options[dimension]) {
    options[dimension] = [];
  }

  // 检查是否已存在
  if (!options[dimension]!.some(opt => opt.value === value)) {
    options[dimension]!.push({
      value,
      displayName: '',
      image: ''
    });
    emit('update:options', options);
  }
}

// 图片上传前检查
function beforeUpload(file: File) {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error('只能上传图片文件！');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2MB！');
    return false;
  }
  return true;
}

// 图片上传成功处理
function handleImageSuccess(
  response: any,
  dimension: VariantDimension,
  index: number
) {
  const options = { ...dimensionOptions.value };
  options[dimension]![index].image = response.url;
  emit('update:options', options);
}

// 图片移除处理
function handleImageRemove(dimension: VariantDimension, index: number) {
  const options = { ...dimensionOptions.value };
  options[dimension]![index].image = '';
  emit('update:options', options);
}
</script>

<style scoped>
.options-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.dimension-options {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 16px;
}

.dimension-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  .el-icon {
    font-size: 18px;
    color: var(--el-text-color-primary);
  }

  .dimension-label {
    font-size: 16px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;

  .display-name-input {
    width: 200px;
  }
}

.option-image {
  width: 100px;
}

.quick-add {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed var(--el-border-color);
}

.common-options {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  .common-options-label {
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }
}

.upload-icon {
  font-size: 20px;
  color: var(--el-text-color-secondary);
}

.upload-text {
  margin-top: 8px;
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.upload-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 80px;
}

:deep(.el-upload-list--picture-card) {
  --el-upload-list-picture-card-size: 80px;
}
</style>
