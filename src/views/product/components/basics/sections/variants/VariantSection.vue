# 变体管理主组件
<template>
  <div class="section">
    <div class="section-header">
      <h3>变体管理</h3>
      <el-tooltip content="多规格商品的父子关系">
        <el-icon><InfoFilled /></el-icon>
      </el-tooltip>
    </div>

    <div class="section-body">
      <!-- 启用变体开关 -->
      <el-form-item
        label="启用变体"
        prop="variantInfo.enabled"
        class="variants-switch"
      >
        <el-switch
          v-model="form.variantInfo.enabled"
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>

      <template v-if="form.variantInfo.enabled">
        <!-- 变体维度 -->
        <VariantDimensions
          v-model:dimensions="form.variantInfo.dimensions"
          @update:dimensions="handleDimensionsChange"
        />

        <!-- 变体选项 -->
        <VariantOptions
          v-if="form.variantInfo.dimensions?.length"
          v-model:options="form.variantInfo.options"
          :dimensions="form.variantInfo.dimensions"
          @update:options="handleOptionsChange"
        />

        <!-- 变体预览 -->
        <VariantPreview
          v-if="hasValidOptions"
          :dimensions="form.variantInfo.dimensions"
          :options="form.variantInfo.options"
        />

        <!-- 子SKU管理 -->
        <ChildSKUTable
          v-if="hasValidOptions"
          v-model:children="form.variantInfo.children"
          :dimensions="form.variantInfo.dimensions"
          :options="form.variantInfo.options"
          :parent-sku="form.generalInfo.sku"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product, VariantDimension } from '@/types/product';
import VariantDimensions from './VariantDimensions.vue';
import VariantOptions from './VariantOptions.vue';
import VariantPreview from './VariantPreview.vue';
import ChildSKUTable from './ChildSKUTable.vue';

const props = defineProps<{
  form: Product;
}>();

// 是否有有效的变体选项
const hasValidOptions = computed(() => {
  if (!props.form.variantInfo.dimensions?.length) return false;
  if (!props.form.variantInfo.options) return false;

  return props.form.variantInfo.dimensions.every(dimension => {
    const options = props.form.variantInfo.options?.[dimension];
    return options && options.length > 0;
  });
});

// 变体维度变更处理
function handleDimensionsChange(dimensions: VariantDimension[]) {
  // 清理已删除维度的选项
  if (props.form.variantInfo.options) {
    Object.keys(props.form.variantInfo.options).forEach(key => {
      if (!dimensions.includes(key as VariantDimension)) {
        delete props.form.variantInfo.options![key as VariantDimension];
      }
    });
  }

  // 清理子SKU
  props.form.variantInfo.children = [];
}

// 变体选项变更处理
function handleOptionsChange() {
  // 清理子SKU
  props.form.variantInfo.children = [];
}
</script>

<style scoped>
.section {
  padding: 16px;
  background-color: var(--el-bg-color-overlay);
  border-radius: 4px;
  border: 1px solid var(--el-border-color-darker);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }

  .el-icon {
    font-size: 16px;
    color: var(--el-text-color-secondary);
  }
}

.variants-switch {
  margin-bottom: 24px;
}
</style>