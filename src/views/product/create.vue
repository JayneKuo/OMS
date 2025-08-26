# 创建商品页面
<template>
  <div class="create-product">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <div class="header-main">
        <div class="header-left">
          <el-button 
            link 
            type="primary" 
            class="back-button"
            @click="handleBack"
          >
            <el-icon><ArrowLeft /></el-icon>
            返回商品列表
          </el-button>
          <el-divider direction="vertical" />
          <h2 class="page-title">创建商品</h2>
        </div>

        <div class="header-right">
          <el-space>
            <el-dropdown trigger="click">
              <el-button>
                导入
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>从Excel导入</el-dropdown-item>
                  <el-dropdown-item>从Shopify导入</el-dropdown-item>
                  <el-dropdown-item>从Amazon导入</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button type="info" plain>预览</el-button>
            <el-button @click="handleSaveAsDraft">保存草稿</el-button>
            <el-button type="primary" @click="handleSave">发布商品</el-button>
          </el-space>
        </div>
      </div>

      <!-- 主要标签页 -->
      <div class="header-tabs">
        <el-tabs 
          v-model="activeTab" 
          type="card"
          class="main-tabs"
        >
          <el-tab-pane name="basic">
            <template #label>
              <div class="tab-label">
                <el-icon><Goods /></el-icon>
                基本信息
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="channel">
            <template #label>
              <div class="tab-label">
                <el-icon><Shop /></el-icon>
                渠道设置
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="warehouse">
            <template #label>
              <div class="tab-label">
                <el-icon><House /></el-icon>
                仓储设置
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="compliance">
            <template #label>
              <div class="tab-label">
                <el-icon><DocumentChecked /></el-icon>
                合规信息
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="mapping">
            <template #label>
              <div class="tab-label">
                <el-icon><Connection /></el-icon>
                系统映射
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="page-content">
      <el-form
        ref="formRef"
        :model="form"
        :validate-on-rule-change="false"
        class="product-form"
      >
        <!-- 基本信息 -->
        <div v-show="activeTab === 'basic'" class="tab-content">
          <BasicInfo :form="form" />
        </div>

        <!-- 渠道设置 -->
        <div v-show="activeTab === 'channel'" class="tab-content">
          <!-- TODO: 渠道设置组件 -->
        </div>

        <!-- 仓储设置 -->
        <div v-show="activeTab === 'warehouse'" class="tab-content">
          <!-- TODO: 仓储设置组件 -->
        </div>

        <!-- 合规信息 -->
        <div v-show="activeTab === 'compliance'" class="tab-content">
          <!-- TODO: 合规信息组件 -->
        </div>

        <!-- 系统映射 -->
        <div v-show="activeTab === 'mapping'" class="tab-content">
          <!-- TODO: 系统映射组件 -->
        </div>
      </el-form>

      <!-- 底部状态栏 -->
      <div class="page-footer">
        <div class="footer-left">
          <el-tag type="info">草稿</el-tag>
          <span class="update-time">最后更新：{{ formatDate(form.systemInfo.updatedAt) }}</span>
        </div>
        <div class="footer-right">
          <el-space>
            <span class="validation-status">
              <el-icon color="var(--el-color-success)"><CircleCheck /></el-icon>
              表单验证通过
            </span>
            <el-divider direction="vertical" />
            <el-button-group>
              <el-button @click="handleSaveAsDraft">保存草稿</el-button>
              <el-button type="primary" @click="handleSave">发布商品</el-button>
            </el-button-group>
          </el-space>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { Product } from '@/types/product';
import BasicInfo from './components/basics/BasicInfo.vue';

const router = useRouter();
const route = useRoute();
const activeTab = ref('basic');
const formRef = ref();

// 获取URL中的分类参数
const categoryFromRoute = route.query.category as string;
if (!categoryFromRoute) {
  // 如果没有分类参数，重定向到分类选择页面
  router.replace({ name: 'SelectCategory' });
}

// 创建默认的尺寸对象
const defaultDimensions = {
  length: 0,
  width: 0,
  height: 0,
  unit: 'cm' as const
};

// 创建默认的重量对象
const defaultWeight = {
  value: 0,
  unit: 'kg' as const
};

// 初始化表单数据
const form = ref<Product>({
  generalInfo: {
    productName: '',
    sku: '',
    parentSku: '',
    type: 'Physical',
    category: categoryFromRoute ? categoryFromRoute.split('/') : [],
    status: 'Draft',
    isSample: false,
    description: '',
    attributes: {
      occasion: '',
      type: '',
      style: '',
      details: '',
      material: '',
      pattern: '',
      hazardCategory: '',
      features: [],
      batteryType: '',
      strapType: '',
      magnetic: false,
      closureType: '',
      coating: [],
      composition: [],
      quantity: 1
    }
  },
  mediaInfo: {
    mainImages: [],
    additionalImages: []
  },
  descriptionInfo: {
    description: '',
    bulletPoints: [],
    categoryAttributes: {}
  },
  logisticsInfo: {
    primaryUOM: {
      unit: 'EA',
      customName: ''
    },
    additionalUOMs: [],
    weight: {
      net: 0,
      gross: 0,
      unit: 'kg'
    },
    dimensions: { ...defaultDimensions }
  },
  packagingInfo: {
    unit: {
      quantity: 1,
      dimensions: { ...defaultDimensions },
      weight: { ...defaultWeight }
    },
    innerPack: {
      quantity: 0,
      dimensions: { ...defaultDimensions },
      weight: { ...defaultWeight }
    },
    masterCarton: {
      quantity: 0,
      dimensions: { ...defaultDimensions },
      weight: { ...defaultWeight },
      stackingLimit: 0,
      temperatureRange: {
        min: 0,
        max: 0,
        unit: 'C'
      }
    }
  },
  variantInfo: {
    enabled: false,
    dimensions: [],
    options: {},
    children: []
  },
  barcodeInfo: {
    primary: {
      type: 'UPC',
      value: '',
      verified: false
    },
    additional: [],
    custom: ''
  },
  translations: {},
  systemInfo: {
    createdAt: new Date().toISOString(),
    createdBy: 'system',
    updatedAt: new Date().toISOString(),
    updatedBy: 'system',
    version: 1,
    source: 'manual'
  }
});

// 返回处理
function handleBack() {
  ElMessageBox.confirm(
    '确定要离开吗？未保存的内容将会丢失。',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    router.back();
  });
}

// 保存处理
async function handleSave() {
  try {
    await formRef.value?.validate();
    // TODO: 调用保存API
    await new Promise(resolve => setTimeout(resolve, 1000));
    ElMessage.success('发布成功');
    router.push('/product');
  } catch (error) {
    ElMessage.error('表单验证失败，请检查必填项');
  }
}

// 保存为草稿
async function handleSaveAsDraft() {
  try {
    // TODO: 调用保存草稿API
    await new Promise(resolve => setTimeout(resolve, 1000));
    ElMessage.success('草稿保存成功');
  } catch (error) {
    ElMessage.error('保存失败');
  }
}

// 格式化日期
function formatDate(date: string) {
  return new Date(date).toLocaleString();
}
</script>

<style scoped lang="scss">
.create-product {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color);
}

.page-header {
  background-color: var(--el-bg-color-overlay);
  border-bottom: 1px solid var(--el-border-color-light);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .header-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    padding: 0 24px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .back-button {
      font-size: 14px;
      .el-icon {
        margin-right: 4px;
      }
    }

    .page-title {
      font-size: 18px;
      font-weight: 500;
      color: var(--el-text-color-primary);
      margin: 0;
    }
  }
}

.header-tabs {
  padding: 0 24px;
  border-top: 1px solid var(--el-border-color-lighter);
  background-color: var(--el-bg-color);

  .main-tabs {
    :deep(.el-tabs__header) {
      margin: 0;
      border-bottom: none;
    }

    :deep(.el-tabs__nav) {
      border: none;
    }

    :deep(.el-tabs__item) {
      height: 48px;
      line-height: 48px;
      border: none;
      padding: 0 24px;
      transition: all 0.3s;

      &.is-active {
        background-color: var(--el-color-primary-light-9);
        border-bottom: 2px solid var(--el-color-primary);
      }

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;

  .el-icon {
    font-size: 16px;
  }
}

.page-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.product-form {
  flex: 1;
  overflow: hidden;
  padding: 24px;
}

.tab-content {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 64px; // 为底部状态栏留出空间
}

.page-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: var(--el-bg-color-overlay);
  border-top: 1px solid var(--el-border-color-light);
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  backdrop-filter: blur(10px);

  .footer-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .update-time {
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }
  }

  .validation-status {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--el-color-success);
    font-size: 13px;
  }
}

// 暗色主题优化
:deep(.dark) {
  .page-header {
    background-color: var(--el-bg-color);
    border-bottom-color: var(--el-border-color-darker);
  }

  .header-tabs {
    background-color: var(--el-bg-color-overlay);
    border-top-color: var(--el-border-color-darker);
  }

  .page-footer {
    background-color: var(--el-bg-color);
    border-top-color: var(--el-border-color-darker);
  }
}
</style>