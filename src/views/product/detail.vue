<template>
  <div class="product-detail">
    <div class="page-header">
      <div class="header-content">
        <div class="left">
          <h2 class="title">{{ product?.name || '商品详情' }}</h2>
          <el-tag :type="getStatusTagType(product?.status)">
            {{ product?.status }}
          </el-tag>
        </div>
        <div class="right">
          <el-button @click="handleBack">返回</el-button>
          <el-button type="primary" @click="handleSave">保存</el-button>
        </div>
      </div>
      <el-tabs v-model="activeTab" class="product-tabs">
        <el-tab-pane name="basic" label="Basic Info" />
        <el-tab-pane name="channel" label="Channel" />
        <el-tab-pane name="warehouse" label="Warehouse" />
        <el-tab-pane name="compliance" label="Compliance" />
        <el-tab-pane name="bundle" label="Bundle / Kit" />
        <el-tab-pane name="mapping" label="Mapping" />
      </el-tabs>
    </div>

    <div class="main-content">
      <el-card shadow="never" class="content-card">
        <component
          :is="getCurrentComponent"
          ref="currentComponentRef"
          v-model:form="form[activeTab]"
        />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { ProductDetail } from '@/types/product';
import { getProduct, updateProduct } from '@/api/product';
import BasicInfo from './components/basics/BasicInfo.vue';
import ChannelInfo from './components/basics/ChannelInfo.vue';
import WarehouseInfo from './components/basics/WarehouseInfo.vue';
import ComplianceInfo from './components/basics/ComplianceInfo.vue';
import BundleInfo from './components/basics/BundleInfo.vue';
import MappingInfo from './components/basics/MappingInfo.vue';

const route = useRoute();
const router = useRouter();
const activeTab = ref('basic');
const product = ref<ProductDetail>();

// 组件引用
const currentComponentRef = ref();

// 动态组件映射
const componentMap = {
  basic: BasicInfo,
  channel: ChannelInfo,
  warehouse: WarehouseInfo,
  compliance: ComplianceInfo,
  bundle: BundleInfo,
  mapping: MappingInfo
};

// 获取当前组件
const getCurrentComponent = computed(() => {
  return componentMap[activeTab.value];
});

// 表单数据
const form = reactive({
  basic: {},
  channel: {},
  warehouse: {},
  compliance: {},
  bundle: {},
  mapping: {}
});

// 获取商品详情
const loadProduct = async () => {
  try {
    const response = await getProduct(route.params.id as string);
    product.value = response;
    // 填充表单数据
    form.basic = response;
    form.channel = response.channel;
    form.warehouse = response.warehouse;
    form.compliance = response.compliance;
    form.bundle = response.bundle;
    form.mapping = response.mapping;
  } catch (error) {
    ElMessage.error('获取商品详情失败');
  }
};

// 返回列表
const handleBack = () => {
  router.back();
};

// 保存商品
const handleSave = async () => {
  try {
    // 验证当前表单
    await currentComponentRef.value?.validate();

    // 合并表单数据
    const data = {
      ...form.basic,
      channel: form.channel,
      warehouse: form.warehouse,
      compliance: form.compliance,
      bundle: form.bundle,
      mapping: form.mapping
    };

    await updateProduct(route.params.id as string, data);
    ElMessage.success('保存成功');
    router.push('/product/list');
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确');
  }
};

// 获取状态标签类型
const getStatusTagType = (status: string) => {
  const types = {
    Active: 'success',
    Inactive: 'info',
    Draft: 'warning',
    Archived: '',
    Out_Of_Stock: 'danger',
    Discontinued: 'danger'
  };
  return types[status] || '';
};

onMounted(() => {
  loadProduct();
});
</script>

<style scoped>
.product-detail {
  height: 100%;
  background-color: var(--el-bg-color-page);
  display: flex;
  flex-direction: column;
}

.page-header {
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  padding: 16px 20px 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.right {
  display: flex;
  gap: 12px;
}

.product-tabs {
  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__nav-wrap) {
    padding: 0;
  }

  :deep(.el-tabs__nav) {
    border: none;
  }

  :deep(.el-tabs__item) {
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    border: none;
    border-bottom: 2px solid transparent;
    transition: all 0.3s;

    &.is-active {
      border-bottom-color: var(--el-color-primary);
    }
  }
}

.main-content {
  flex: 1;
  padding: 20px;
  min-height: 0;
  overflow: auto;
}

.content-card {
  height: 100%;
  
  :deep(.el-card__body) {
    height: 100%;
    padding: 20px;
  }
}
</style>
