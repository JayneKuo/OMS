# 变体预览组件
<template>
  <div class="variant-preview">
    <el-divider>变体预览</el-divider>

    <!-- 变体组合统计 -->
    <div class="preview-summary">
      <el-alert
        :type="isValidCombinations ? 'success' : 'warning'"
        :closable="false"
        show-icon
      >
        <template #title>
          共生成 {{ combinations.length }} 个变体组合
          <template v-if="!isValidCombinations">
            （超过100个组合，请考虑减少选项数量）
          </template>
        </template>
      </el-alert>
    </div>

    <!-- 变体组合表格 -->
    <div class="preview-table">
      <el-table
        :data="combinations"
        border
        style="width: 100%"
        size="small"
        max-height="400"
      >
        <!-- 序号列 -->
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center"
        />

        <!-- 维度列 -->
        <el-table-column
          v-for="dimension in dimensions"
          :key="dimension"
          :prop="dimension.toLowerCase()"
          :label="getDimensionLabel(dimension)"
          align="center"
        >
          <template #default="{ row }">
            <div class="dimension-value">
              <!-- 颜色维度显示图片 -->
              <template v-if="dimension === 'Color' && getOptionImage(dimension, row[dimension])">
                <el-image
                  :src="getOptionImage(dimension, row[dimension])"
                  :preview-src-list="[getOptionImage(dimension, row[dimension])!]"
                  fit="cover"
                  class="color-image"
                />
              </template>
              
              <!-- 显示值 -->
              <span>{{ getOptionDisplayName(dimension, row[dimension]) || row[dimension] }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- 变体标题列 -->
        <el-table-column
          label="变体标题"
          prop="variantTitle"
          min-width="200"
          align="center"
        >
          <template #default="{ row }">
            {{ getVariantTitle(row) }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 变体命名规则 -->
    <div class="naming-rules">
      <el-collapse>
        <el-collapse-item title="变体命名规则说明">
          <div class="rules-content">
            <h4>默认命名规则</h4>
            <p>变体标题按照维度顺序组合，例：</p>
            <ul>
              <li>单维度：红色</li>
              <li>双维度：红色-M码</li>
              <li>三维度：红色-M码-棉质</li>
            </ul>

            <h4>自定义展示名称</h4>
            <p>可以为每个选项设置展示名称，用于替代默认值：</p>
            <ul>
              <li>默认值：红色-M码-棉质</li>
              <li>自定义后：中国红-中码-纯棉</li>
            </ul>

            <el-alert
              type="info"
              :closable="false"
              show-icon
            >
              <template #default>
                建议使用简短、清晰的命名，便于客户理解和选择
              </template>
            </el-alert>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { VariantDimension } from '@/types/product';

const props = defineProps<{
  dimensions: VariantDimension[];
  options: {
    [key in VariantDimension]?: {
      value: string;
      displayName?: string;
      image?: string;
    }[];
  };
}>();

// 维度信息
const dimensionInfo = {
  Color: { label: '颜色' },
  Size: { label: '尺码' },
  Material: { label: '材质' },
  Style: { label: '款式' }
};

// 获取维度标签
function getDimensionLabel(dimension: VariantDimension) {
  return dimensionInfo[dimension].label;
}

// 获取选项图片
function getOptionImage(dimension: VariantDimension, value: string) {
  const option = props.options[dimension]?.find(opt => opt.value === value);
  return option?.image;
}

// 获取选项展示名称
function getOptionDisplayName(dimension: VariantDimension, value: string) {
  const option = props.options[dimension]?.find(opt => opt.value === value);
  return option?.displayName;
}

// 生成所有可能的变体组合
const combinations = computed(() => {
  const result: Record<string, string>[] = [{}];

  props.dimensions.forEach(dimension => {
    const values = props.options[dimension]?.map(opt => opt.value) || [];
    const temp: Record<string, string>[] = [];

    result.forEach(item => {
      values.forEach(value => {
        temp.push({
          ...item,
          [dimension]: value
        });
      });
    });

    result.length = 0;
    result.push(...temp);
  });

  return result;
});

// 检查组合数量是否合理
const isValidCombinations = computed(() => {
  return combinations.value.length <= 100;
});

// 生成变体标题
function getVariantTitle(variant: Record<string, string>) {
  return props.dimensions
    .map(dimension => {
      const value = variant[dimension];
      return getOptionDisplayName(dimension, value) || value;
    })
    .join('-');
}
</script>

<style scoped>
.variant-preview {
  margin-top: 24px;
}

.preview-summary {
  margin-bottom: 16px;
}

.preview-table {
  margin-bottom: 16px;
}

.dimension-value {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.color-image {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid var(--el-border-color);
}

.naming-rules {
  margin-top: 16px;
}

.rules-content {
  color: var(--el-text-color-regular);
  font-size: 14px;

  h4 {
    margin: 16px 0 8px;
    color: var(--el-text-color-primary);
  }

  p {
    margin: 8px 0;
  }

  ul {
    margin: 8px 0;
    padding-left: 20px;
  }

  .el-alert {
    margin-top: 16px;
  }
}
</style>
