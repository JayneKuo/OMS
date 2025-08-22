# 基本资料部分组件
<template>
  <div class="section">
    <div class="section-header">
      <h3>基本资料</h3>
      <el-tooltip content="商品最小必填身份信息">
        <el-icon><InfoFilled /></el-icon>
      </el-tooltip>
    </div>

    <div class="section-body">
      <el-row :gutter="16">
        <!-- 商品名称 -->
        <el-col :span="8">
          <el-form-item 
            label="商品名称" 
            prop="generalInfo.productName"
            required
          >
            <el-input 
              v-model="form.generalInfo.productName"
              placeholder="请输入商品名称"
              :maxlength="200"
              show-word-limit
            >
              <template #append>
                <el-tooltip content="前台可见，审核敏感">
                  <el-icon><Warning /></el-icon>
                </el-tooltip>
              </template>
            </el-input>
          </el-form-item>
        </el-col>

        <!-- SKU -->
        <el-col :span="8">
          <el-form-item 
            label="SKU" 
            prop="generalInfo.sku"
            required
          >
            <el-input 
              v-model="form.generalInfo.sku"
              placeholder="请输入商家唯一库存编号"
              :maxlength="50"
            />
          </el-form-item>
        </el-col>

        <!-- Parent SKU -->
        <el-col :span="8">
          <el-form-item 
            label="Parent SKU" 
            prop="generalInfo.parentSku"
            :required="form.variantInfo.enabled"
          >
            <el-input 
              v-model="form.generalInfo.parentSku"
              placeholder="多变体商品的分组SKU"
              :disabled="!form.variantInfo.enabled"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <!-- 商品类型 -->
        <el-col :span="6">
          <el-form-item 
            label="商品类型" 
            prop="generalInfo.type"
            required
          >
            <el-select 
              v-model="form.generalInfo.type"
              placeholder="请选择商品类型"
            >
              <el-option label="实物商品" value="Physical" />
              <el-option label="数字商品" value="Digital" />
              <el-option label="组合商品" value="Bundle" />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 商品状态 -->
        <el-col :span="6">
          <el-form-item 
            label="商品状态" 
            prop="generalInfo.status"
            required
          >
            <el-select 
              v-model="form.generalInfo.status"
              placeholder="请选择商品状态"
            >
              <el-option label="草稿" value="Draft" />
              <el-option label="活跃" value="Active" />
              <el-option label="非活跃" value="Inactive" />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 品牌 -->
        <el-col :span="6">
          <el-form-item 
            label="品牌" 
            prop="generalInfo.brand"
            :required="isBrandRequired"
          >
            <el-select
              v-model="form.generalInfo.brand"
              placeholder="请选择品牌"
              filterable
              allow-create
              clearable
            >
              <el-option
                v-for="brand in brands"
                :key="brand"
                :label="brand"
                :value="brand"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 是否样品 -->
        <el-col :span="6">
          <el-form-item 
            label="是否样品" 
            prop="generalInfo.isSample"
          >
            <el-switch
              v-model="form.generalInfo.isSample"
              active-text="是"
              inactive-text="否"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <!-- 类目 -->
        <el-col :span="12">
          <el-form-item 
            label="类目" 
            prop="generalInfo.category"
            required
          >
            <el-cascader
              v-model="form.generalInfo.category"
              :options="categories"
              :props="{
                checkStrictly: false,
                emitPath: true,
                expandTrigger: 'hover'
              }"
              placeholder="请选择平台类目"
              clearable
              @change="handleCategoryChange"
            />
          </el-form-item>
        </el-col>

        <!-- 当前类目路径 -->
        <el-col :span="12">
          <div class="category-path" v-if="categoryPath.length">
            <el-tag 
              v-for="(cat, index) in categoryPath"
              :key="index"
              :type="index === categoryPath.length - 1 ? 'success' : ''"
              class="mx-1"
            >
              {{ cat }}
              <el-icon v-if="index < categoryPath.length - 1">
                <ArrowRight />
              </el-icon>
            </el-tag>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '@/types/product';

const props = defineProps<{
  form: Product;
}>();

// 品牌是否必填（根据类目判断）
const isBrandRequired = computed(() => {
  // TODO: 根据类目判断品牌是否必填
  return false;
});

// 类目路径
const categoryPath = computed(() => {
  if (!props.form.generalInfo.category?.length) return [];
  return props.form.generalInfo.category.map(cat => {
    const category = findCategory(cat);
    return category?.label || cat;
  });
});

// 模拟数据
const brands = ['Brand A', 'Brand B', 'Brand C'];
const categories = [
  {
    value: 'electronics',
    label: '电子产品',
    children: [
      {
        value: 'phones',
        label: '手机',
        children: [
          {
            value: 'smartphone',
            label: '智能手机',
            requireBrand: true // 该类目必填品牌
          }
        ]
      }
    ]
  }
];

// 查找类目
function findCategory(value: string) {
  // TODO: 实现类目查找逻辑
  return null;
}

// 类目变更处理
function handleCategoryChange(value: string[]) {
  // TODO: 处理类目变更，加载类目属性模板
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

.category-path {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 0;

  .el-tag {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}
</style>
