# 变体维度组件
<template>
  <el-form-item
    label="变体维度"
    required
    class="variant-dimensions"
  >
    <div class="dimensions-container">
      <el-select
        v-model="selectedDimensions"
        multiple
        placeholder="请选择变体维度（最多3个）"
        :multiple-limit="3"
        @change="handleChange"
      >
        <el-option
          v-for="dimension in availableDimensions"
          :key="dimension.value"
          :label="dimension.label"
          :value="dimension.value"
        >
          <div class="dimension-option">
            <el-icon>
              <component :is="dimension.icon" />
            </el-icon>
            <span>{{ dimension.label }}</span>
            <el-tooltip
              :content="dimension.description"
              placement="right"
            >
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </div>
        </el-option>
      </el-select>

      <!-- 已选维度展示 -->
      <div class="selected-dimensions" v-if="selectedDimensions.length">
        <el-tag
          v-for="dimension in selectedDimensions"
          :key="dimension"
          closable
          @close="removeDimension(dimension)"
        >
          <el-icon>
            <component :is="getDimensionIcon(dimension)" />
          </el-icon>
          <span>{{ getDimensionLabel(dimension) }}</span>
        </el-tag>
      </div>

      <div class="dimensions-tip">
        <el-alert
          type="info"
          :closable="false"
          show-icon
        >
          <template #title>
            变体维度说明
          </template>
          <template #default>
            <ul class="dimension-tips">
              <li>最多可选择3个维度</li>
              <li>维度选择后将自动创建变体组合</li>
              <li>建议按照重要性顺序选择维度</li>
              <li>维度选择后将影响子SKU的生成</li>
            </ul>
          </template>
        </el-alert>
      </div>
    </div>
  </el-form-item>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { VariantDimension } from '@/types/product';

const props = defineProps<{
  dimensions?: VariantDimension[];
}>();

const emit = defineEmits<{
  'update:dimensions': [dimensions: VariantDimension[]];
}>();

// 可选的变体维度
const availableDimensions = [
  {
    value: 'Color' as const,
    label: '颜色',
    icon: 'Brush',
    description: '商品的颜色选项，如：红色、蓝色等'
  },
  {
    value: 'Size' as const,
    label: '尺码',
    icon: 'ScaleToOriginal',
    description: '商品的尺码选项，如：S、M、L等'
  },
  {
    value: 'Material' as const,
    label: '材质',
    icon: 'Box',
    description: '商品的材质选项，如：棉、涤纶等'
  },
  {
    value: 'Style' as const,
    label: '款式',
    icon: 'Stamp',
    description: '商品的款式选项，如：圆领、V领等'
  }
];

// 已选维度
const selectedDimensions = ref<VariantDimension[]>(props.dimensions || []);

// 监听props变化
watch(() => props.dimensions, (newVal) => {
  if (newVal) {
    selectedDimensions.value = newVal;
  }
}, { deep: true });

// 维度变更处理
function handleChange(values: VariantDimension[]) {
  emit('update:dimensions', values);
}

// 移除维度
function removeDimension(dimension: VariantDimension) {
  const index = selectedDimensions.value.indexOf(dimension);
  if (index > -1) {
    selectedDimensions.value.splice(index, 1);
    emit('update:dimensions', selectedDimensions.value);
  }
}

// 获取维度图标
function getDimensionIcon(dimension: VariantDimension) {
  return availableDimensions.find(d => d.value === dimension)?.icon;
}

// 获取维度标签
function getDimensionLabel(dimension: VariantDimension) {
  return availableDimensions.find(d => d.value === dimension)?.label;
}
</script>

<style scoped>
.dimensions-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dimension-option {
  display: flex;
  align-items: center;
  gap: 8px;

  .el-icon {
    font-size: 16px;
    color: var(--el-text-color-secondary);
  }
}

.selected-dimensions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .el-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;

    .el-icon {
      font-size: 14px;
    }
  }
}

.dimension-tips {
  margin: 4px 0 0;
  padding-left: 20px;
  font-size: 12px;
  color: var(--el-text-color-regular);
}
</style>
