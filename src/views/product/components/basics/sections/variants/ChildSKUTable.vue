# 子SKU管理组件
<template>
  <div class="child-sku-table">
    <el-divider>子SKU管理</el-divider>

    <!-- 批量操作按钮 -->
    <div class="batch-actions">
      <el-button-group>
        <el-button
          type="primary"
          @click="generateChildSKUs"
        >
          <el-icon><RefreshRight /></el-icon>
          生成子SKU
        </el-button>
        <el-button
          type="success"
          @click="openBatchEdit"
        >
          <el-icon><Edit /></el-icon>
          批量编辑
        </el-button>
        <el-button
          type="warning"
          @click="openImport"
        >
          <el-icon><Upload /></el-icon>
          导入
        </el-button>
        <el-button
          type="info"
          @click="handleExport"
        >
          <el-icon><Download /></el-icon>
          导出
        </el-button>
      </el-button-group>
    </div>

    <!-- 子SKU表格 -->
    <el-table
      :data="children"
      border
      style="width: 100%"
      size="small"
    >
      <!-- 序号列 -->
      <el-table-column
        type="index"
        label="序号"
        width="60"
        align="center"
      />

      <!-- SKU列 -->
      <el-table-column
        prop="sku"
        label="SKU"
        min-width="150"
      >
        <template #default="{ row }">
          <el-input
            v-model="row.sku"
            placeholder="请输入SKU"
            :maxlength="50"
          />
        </template>
      </el-table-column>

      <!-- 变体标题列 -->
      <el-table-column
        prop="variantTitle"
        label="变体标题"
        min-width="200"
        align="center"
      />

      <!-- 条码列 -->
      <el-table-column
        prop="barcode"
        label="条码"
        min-width="150"
      >
        <template #default="{ row }">
          <el-input
            v-model="row.barcode"
            placeholder="请输入条码"
          />
        </template>
      </el-table-column>

      <!-- 重量列 -->
      <el-table-column
        label="重量"
        align="center"
        width="200"
      >
        <template #default="{ row }">
          <el-input-number
            v-model="row.weight.value"
            :precision="3"
            :step="0.001"
            :min="0"
            style="width: 120px"
          >
            <template #append>
              <el-select
                v-model="row.weight.unit"
                style="width: 70px"
              >
                <el-option label="kg" value="kg" />
                <el-option label="lb" value="lb" />
              </el-select>
            </template>
          </el-input-number>
        </template>
      </el-table-column>

      <!-- 状态列 -->
      <el-table-column
        prop="status"
        label="状态"
        width="120"
        align="center"
      >
        <template #default="{ row }">
          <el-select
            v-model="row.status"
            placeholder="请选择状态"
          >
            <el-option label="草稿" value="Draft" />
            <el-option label="活跃" value="Active" />
            <el-option label="非活跃" value="Inactive" />
          </el-select>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        label="操作"
        width="150"
        align="center"
        fixed="right"
      >
        <template #default="{ row }">
          <el-button-group>
            <el-button
              type="primary"
              link
              @click="openVariantDetails(row)"
            >
              <el-icon><Edit /></el-icon>
              详情
            </el-button>
            <el-button
              type="danger"
              link
              @click="removeVariant(row)"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 批量编辑对话框 -->
    <el-dialog
      v-model="batchEditVisible"
      title="批量编辑"
      width="600px"
    >
      <el-form
        ref="batchEditFormRef"
        :model="batchEditForm"
        label-width="100px"
      >
        <!-- SKU前缀 -->
        <el-form-item label="SKU前缀">
          <el-input
            v-model="batchEditForm.skuPrefix"
            placeholder="请输入SKU前缀"
          >
            <template #append>
              <el-tooltip content="生成规则：前缀 + 序号（3位）">
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>

        <!-- 条码前缀 -->
        <el-form-item label="条码前缀">
          <el-input
            v-model="batchEditForm.barcodePrefix"
            placeholder="请输入条码前缀"
          >
            <template #append>
              <el-tooltip content="生成规则：前缀 + 序号（12位）">
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>

        <!-- 重量 -->
        <el-form-item label="重量">
          <el-input-number
            v-model="batchEditForm.weight.value"
            :precision="3"
            :step="0.001"
            :min="0"
            style="width: 180px"
          >
            <template #append>
              <el-select
                v-model="batchEditForm.weight.unit"
                style="width: 70px"
              >
                <el-option label="kg" value="kg" />
                <el-option label="lb" value="lb" />
              </el-select>
            </template>
          </el-input-number>
        </el-form-item>

        <!-- 状态 -->
        <el-form-item label="状态">
          <el-select
            v-model="batchEditForm.status"
            placeholder="请选择状态"
          >
            <el-option label="草稿" value="Draft" />
            <el-option label="活跃" value="Active" />
            <el-option label="非活跃" value="Inactive" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="batchEditVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBatchEdit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog
      v-model="importVisible"
      title="导入子SKU"
      width="500px"
    >
      <el-upload
        class="import-upload"
        drag
        action="/api/import"
        :auto-upload="false"
        :on-change="handleImportChange"
        :file-list="importFileList"
      >
        <el-icon class="el-icon--upload"><Upload /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            请上传Excel文件（.xlsx），
            <el-link
              type="primary"
              :href="templateUrl"
              target="_blank"
            >
              下载模板
            </el-link>
          </div>
        </template>
      </el-upload>

      <template #footer>
        <el-button @click="importVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleImport"
          :loading="importing"
        >
          开始导入
        </el-button>
      </template>
    </el-dialog>

    <!-- 变体详情对话框 -->
    <el-dialog
      v-model="variantDetailsVisible"
      title="变体详情"
      width="800px"
    >
      <el-form
        ref="variantDetailsFormRef"
        :model="currentVariant"
        label-width="100px"
      >
        <!-- 基本信息 -->
        <el-form-item label="SKU" required>
          <el-input
            v-model="currentVariant.sku"
            placeholder="请输入SKU"
          />
        </el-form-item>

        <el-form-item label="变体标题">
          <el-input
            v-model="currentVariant.variantTitle"
            disabled
          />
        </el-form-item>

        <el-form-item label="条码">
          <el-input
            v-model="currentVariant.barcode"
            placeholder="请输入条码"
          />
        </el-form-item>

        <!-- 重量和尺寸 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="重量">
              <el-input-number
                v-model="currentVariant.weight.value"
                :precision="3"
                :step="0.001"
                :min="0"
                style="width: 180px"
              >
                <template #append>
                  <el-select
                    v-model="currentVariant.weight.unit"
                    style="width: 70px"
                  >
                    <el-option label="kg" value="kg" />
                    <el-option label="lb" value="lb" />
                  </el-select>
                </template>
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="尺寸">
          <div class="dimensions-container">
            <el-input-number
              v-model="currentVariant.dimensions.length"
              :precision="2"
              :step="0.1"
              :min="0"
              style="width: 120px"
            >
              <template #prepend>
                <span class="dimension-label">长</span>
              </template>
            </el-input-number>

            <el-input-number
              v-model="currentVariant.dimensions.width"
              :precision="2"
              :step="0.1"
              :min="0"
              style="width: 120px"
            >
              <template #prepend>
                <span class="dimension-label">宽</span>
              </template>
            </el-input-number>

            <el-input-number
              v-model="currentVariant.dimensions.height"
              :precision="2"
              :step="0.1"
              :min="0"
              style="width: 120px"
            >
              <template #prepend>
                <span class="dimension-label">高</span>
              </template>
            </el-input-number>

            <el-select
              v-model="currentVariant.dimensions.unit"
              style="width: 90px"
            >
              <el-option label="cm" value="cm" />
              <el-option label="inch" value="inch" />
            </el-select>
          </div>
        </el-form-item>

        <!-- 库存信息 -->
        <el-divider>库存信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="可用库存">
              <el-input-number
                v-model="currentVariant.inventory.available"
                :min="0"
                :step="1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预留库存">
              <el-input-number
                v-model="currentVariant.inventory.reserved"
                :min="0"
                :step="1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="在途库存">
              <el-input-number
                v-model="currentVariant.inventory.inbound"
                :min="0"
                :step="1"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 价格信息 -->
        <el-divider>价格信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="成本价">
              <el-input-number
                v-model="currentVariant.price.cost"
                :precision="2"
                :step="0.01"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="零售价">
              <el-input-number
                v-model="currentVariant.price.retail"
                :precision="2"
                :step="0.01"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="促销价">
              <el-input-number
                v-model="currentVariant.price.sale"
                :precision="2"
                :step="0.01"
                :min="0"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 状态 -->
        <el-form-item label="状态">
          <el-select
            v-model="currentVariant.status"
            placeholder="请选择状态"
          >
            <el-option label="草稿" value="Draft" />
            <el-option label="活跃" value="Active" />
            <el-option label="非活跃" value="Inactive" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="variantDetailsVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveVariant">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { VariantDimension } from '@/types/product';
import type { UploadFile } from 'element-plus';

const props = defineProps<{
  children: {
    sku: string;
    parentSku: string;
    barcode?: string;
    variantTitle: string;
    variantImage?: string;
    weight: {
      value: number;
      unit: 'kg' | 'lb';
    };
    dimensions: {
      length: number;
      width: number;
      height: number;
      unit: 'cm' | 'inch';
    };
    status: 'Draft' | 'Active' | 'Inactive';
    inventory?: {
      available: number;
      reserved: number;
      inbound: number;
    };
    price?: {
      cost: number;
      retail: number;
      sale?: number;
    };
  }[];
  dimensions: VariantDimension[];
  options: {
    [key in VariantDimension]?: {
      value: string;
      displayName?: string;
      image?: string;
    }[];
  };
  parentSku: string;
}>();

const emit = defineEmits<{
  'update:children': [children: typeof props.children];
}>();

// 批量编辑相关
const batchEditVisible = ref(false);
const batchEditForm = ref({
  skuPrefix: '',
  barcodePrefix: '',
  weight: {
    value: 0,
    unit: 'kg' as const
  },
  status: 'Draft' as const
});

// 导入相关
const importVisible = ref(false);
const importFileList = ref<UploadFile[]>([]);
const importing = ref(false);
const templateUrl = '/api/download/template';

// 变体详情相关
const variantDetailsVisible = ref(false);
const currentVariant = ref<(typeof props.children)[0]>();

// 生成子SKU
function generateChildSKUs() {
  // 生成所有可能的变体组合
  const combinations = generateCombinations();

  // 转换为子SKU
  const children = combinations.map((combination, index) => {
    const sku = `${props.parentSku}-${String(index + 1).padStart(3, '0')}`;
    const variantTitle = getVariantTitle(combination);

    return {
      sku,
      parentSku: props.parentSku,
      variantTitle,
      weight: {
        value: 0,
        unit: 'kg' as const
      },
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
        unit: 'cm' as const
      },
      status: 'Draft' as const,
      inventory: {
        available: 0,
        reserved: 0,
        inbound: 0
      },
      price: {
        cost: 0,
        retail: 0
      }
    };
  });

  emit('update:children', children);
}

// 生成所有可能的变体组合
function generateCombinations() {
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
}

// 获取变体标题
function getVariantTitle(variant: Record<string, string>) {
  return props.dimensions
    .map(dimension => {
      const value = variant[dimension];
      const option = props.options[dimension]?.find(opt => opt.value === value);
      return option?.displayName || value;
    })
    .join('-');
}

// 打开批量编辑
function openBatchEdit() {
  batchEditForm.value = {
    skuPrefix: props.parentSku,
    barcodePrefix: '',
    weight: {
      value: 0,
      unit: 'kg'
    },
    status: 'Draft'
  };
  batchEditVisible.value = true;
}

// 处理批量编辑
function handleBatchEdit() {
  const { skuPrefix, barcodePrefix, weight, status } = batchEditForm.value;
  const children = [...props.children];

  children.forEach((child, index) => {
    if (skuPrefix) {
      child.sku = `${skuPrefix}-${String(index + 1).padStart(3, '0')}`;
    }
    if (barcodePrefix) {
      child.barcode = `${barcodePrefix}${String(index + 1).padStart(12, '0')}`;
    }
    if (weight.value > 0) {
      child.weight = { ...weight };
    }
    child.status = status;
  });

  emit('update:children', children);
  batchEditVisible.value = false;
}

// 导入相关
function handleImportChange(file: UploadFile) {
  importFileList.value = [file];
}

async function handleImport() {
  if (!importFileList.value.length) {
    ElMessage.warning('请先选择要导入的文件');
    return;
  }

  importing.value = true;
  try {
    // TODO: 实现文件上传和解析
    await new Promise(resolve => setTimeout(resolve, 1000));
    ElMessage.success('导入成功');
    importVisible.value = false;
  } catch (error) {
    ElMessage.error('导入失败');
  } finally {
    importing.value = false;
  }
}

// 导出处理
function handleExport() {
  // TODO: 实现导出功能
  ElMessage.success('导出成功');
}

// 变体详情相关
function openVariantDetails(variant: (typeof props.children)[0]) {
  currentVariant.value = JSON.parse(JSON.stringify(variant));
  variantDetailsVisible.value = true;
}

function handleSaveVariant() {
  if (!currentVariant.value) return;

  const index = props.children.findIndex(
    child => child.sku === currentVariant.value!.sku
  );
  if (index > -1) {
    const children = [...props.children];
    children[index] = currentVariant.value;
    emit('update:children', children);
  }

  variantDetailsVisible.value = false;
}

// 删除变体
function removeVariant(variant: (typeof props.children)[0]) {
  ElMessageBox.confirm(
    '确定要删除该变体吗？',
    '提示',
    {
      type: 'warning'
    }
  ).then(() => {
    const children = props.children.filter(child => child.sku !== variant.sku);
    emit('update:children', children);
    ElMessage.success('删除成功');
  });
}
</script>

<style scoped>
.child-sku-table {
  margin-top: 24px;
}

.batch-actions {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
}

.dimensions-container {
  display: flex;
  align-items: center;
  gap: 12px;

  .dimension-label {
    color: var(--el-text-color-regular);
    width: 24px;
    text-align: center;
  }
}

.import-upload {
  text-align: center;

  .el-upload {
    width: 100%;
  }

  .el-upload-dragger {
    width: 100%;
  }
}

:deep(.el-upload__tip) {
  margin-top: 8px;
  line-height: 1.4;
}
</style>
