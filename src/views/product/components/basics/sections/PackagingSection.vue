# 包装层级部分组件
<template>
  <div class="section">
    <div class="section-header">
      <h3>包装层级</h3>
      <el-tooltip content="仓储维度的物理包装关系">
        <el-icon><InfoFilled /></el-icon>
      </el-tooltip>
    </div>

    <div class="section-body">
      <!-- 最小单位 -->
      <el-form-item
        label="最小单位 (EA)"
        required
        class="packaging-level-item"
      >
        <div class="packaging-level-row">
          <el-input-number
            :model-value="1"
            disabled
            style="width: 120px"
          >
            <template #prepend>
              <el-tag size="small">数量</el-tag>
            </template>
          </el-input-number>
          <span class="packaging-level-text">个/件</span>
        </div>

        <!-- 单位包装信息 -->
        <div class="packaging-details">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="重量">
                <el-input-number
                  v-model="form.packagingInfo.unit.weight.value"
                  :precision="3"
                  :step="0.001"
                  :min="0"
                  style="width: 180px"
                >
                  <template #append>
                    <el-select
                      v-model="form.packagingInfo.unit.weight.unit"
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

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="尺寸">
                <div class="dimensions-container">
                  <el-input-number
                    v-model="form.packagingInfo.unit.dimensions.length"
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
                    v-model="form.packagingInfo.unit.dimensions.width"
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
                    v-model="form.packagingInfo.unit.dimensions.height"
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
                    v-model="form.packagingInfo.unit.dimensions.unit"
                    style="width: 90px"
                  >
                    <el-option label="cm" value="cm" />
                    <el-option label="inch" value="inch" />
                  </el-select>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form-item>

      <!-- 内包装 -->
      <el-form-item
        label="内包装"
        class="packaging-level-item"
      >
        <div class="packaging-level-container">
          <div class="packaging-level-row">
            <el-input-number
              v-model="form.packagingInfo.innerPack.quantity"
              :min="1"
              :step="1"
              style="width: 120px"
              placeholder="数量"
            >
              <template #prepend>
                <el-tag size="small">数量</el-tag>
              </template>
            </el-input-number>
            <span class="packaging-level-text">个/件</span>

            <el-button
              type="primary"
              link
              @click="toggleInnerPackDetails"
            >
              {{ showInnerPackDetails ? '收起详情' : '展开详情' }}
              <el-icon>
                <component :is="showInnerPackDetails ? 'ArrowUp' : 'ArrowDown'" />
              </el-icon>
            </el-button>
          </div>

          <el-collapse-transition>
            <div v-show="showInnerPackDetails" class="packaging-details">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="重量">
                    <el-input-number
                      v-model="form.packagingInfo.innerPack.weight.value"
                      :precision="3"
                      :step="0.001"
                      :min="0"
                      style="width: 180px"
                    >
                      <template #append>
                        <el-select
                          v-model="form.packagingInfo.innerPack.weight.unit"
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

              <el-row :gutter="20">
                <el-col :span="24">
                  <el-form-item label="尺寸">
                    <div class="dimensions-container">
                      <el-input-number
                        v-model="form.packagingInfo.innerPack.dimensions.length"
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
                        v-model="form.packagingInfo.innerPack.dimensions.width"
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
                        v-model="form.packagingInfo.innerPack.dimensions.height"
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
                        v-model="form.packagingInfo.innerPack.dimensions.unit"
                        style="width: 90px"
                      >
                        <el-option label="cm" value="cm" />
                        <el-option label="inch" value="inch" />
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-collapse-transition>
        </div>
      </el-form-item>

      <!-- 外箱 -->
      <el-form-item
        label="外箱"
        class="packaging-level-item"
      >
        <div class="packaging-level-container">
          <div class="packaging-level-row">
            <el-input-number
              v-model="form.packagingInfo.masterCarton.quantity"
              :min="1"
              :step="1"
              style="width: 120px"
              placeholder="数量"
            >
              <template #prepend>
                <el-tag size="small">数量</el-tag>
              </template>
            </el-input-number>
            <span class="packaging-level-text">
              {{ form.packagingInfo.innerPack?.quantity ? '内包装' : '个/件' }}
            </span>

            <el-button
              type="primary"
              link
              @click="toggleMasterCartonDetails"
            >
              {{ showMasterCartonDetails ? '收起详情' : '展开详情' }}
              <el-icon>
                <component :is="showMasterCartonDetails ? 'ArrowUp' : 'ArrowDown'" />
              </el-icon>
            </el-button>
          </div>

          <el-collapse-transition>
            <div v-show="showMasterCartonDetails" class="packaging-details">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="重量">
                    <el-input-number
                      v-model="form.packagingInfo.masterCarton.weight.value"
                      :precision="3"
                      :step="0.001"
                      :min="0"
                      style="width: 180px"
                    >
                      <template #append>
                        <el-select
                          v-model="form.packagingInfo.masterCarton.weight.unit"
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

              <el-row :gutter="20">
                <el-col :span="24">
                  <el-form-item label="尺寸">
                    <div class="dimensions-container">
                      <el-input-number
                        v-model="form.packagingInfo.masterCarton.dimensions.length"
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
                        v-model="form.packagingInfo.masterCarton.dimensions.width"
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
                        v-model="form.packagingInfo.masterCarton.dimensions.height"
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
                        v-model="form.packagingInfo.masterCarton.dimensions.unit"
                        style="width: 90px"
                      >
                        <el-option label="cm" value="cm" />
                        <el-option label="inch" value="inch" />
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 堆码层数 -->
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="堆码层数">
                    <el-input-number
                      v-model="form.packagingInfo.masterCarton.stackingLimit"
                      :min="1"
                      :step="1"
                      style="width: 120px"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 温度要求 -->
              <el-row :gutter="20">
                <el-col :span="24">
                  <el-form-item label="温度要求">
                    <div class="temperature-range">
                      <el-input-number
                        v-model="form.packagingInfo.masterCarton.temperatureRange.min"
                        :precision="1"
                        :step="0.1"
                        style="width: 120px"
                        placeholder="最低温度"
                      />
                      <span class="temperature-separator">至</span>
                      <el-input-number
                        v-model="form.packagingInfo.masterCarton.temperatureRange.max"
                        :precision="1"
                        :step="0.1"
                        style="width: 120px"
                        placeholder="最高温度"
                      />
                      <el-select
                        v-model="form.packagingInfo.masterCarton.temperatureRange.unit"
                        style="width: 70px"
                      >
                        <el-option label="°C" value="C" />
                        <el-option label="°F" value="F" />
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-collapse-transition>
        </div>
      </el-form-item>

      <!-- 包装层级总览 -->
      <div class="packaging-summary">
        <el-divider>包装层级总览</el-divider>
        <div class="packaging-tree">
          <el-tree
            :data="packagingTreeData"
            :props="defaultProps"
            default-expand-all
          >
            <template #default="{ node, data }">
              <div class="packaging-node">
                <span class="node-label">{{ node.label }}</span>
                <span class="node-info">{{ data.info }}</span>
              </div>
            </template>
          </el-tree>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Product } from '@/types/product';

const props = defineProps<{
  form: Product;
}>();

// 展开/收起控制
const showInnerPackDetails = ref(false);
const showMasterCartonDetails = ref(false);

function toggleInnerPackDetails() {
  showInnerPackDetails.value = !showInnerPackDetails.value;
}

function toggleMasterCartonDetails() {
  showMasterCartonDetails.value = !showMasterCartonDetails.value;
}

// 包装层级树形数据
const packagingTreeData = computed(() => {
  const data = [
    {
      label: '最小单位',
      info: '1个/件',
      children: []
    }
  ];

  // 添加内包装节点
  if (props.form.packagingInfo.innerPack?.quantity) {
    data[0].children.push({
      label: '内包装',
      info: `1内包装 = ${props.form.packagingInfo.innerPack.quantity}个/件`
    });
  }

  // 添加外箱节点
  if (props.form.packagingInfo.masterCarton?.quantity) {
    const lastNode = props.form.packagingInfo.innerPack?.quantity
      ? data[0].children[0]
      : data[0];

    lastNode.children = [{
      label: '外箱',
      info: `1外箱 = ${props.form.packagingInfo.masterCarton.quantity}${props.form.packagingInfo.innerPack?.quantity ? '内包装' : '个/件'}`
    }];
  }

  return data;
});

const defaultProps = {
  children: 'children',
  label: 'label'
};
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

.packaging-level-container {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
}

.packaging-level-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  .packaging-level-text {
    color: var(--el-text-color-regular);
  }
}

.packaging-details {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed var(--el-border-color);
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

.temperature-range {
  display: flex;
  align-items: center;
  gap: 8px;

  .temperature-separator {
    color: var(--el-text-color-regular);
  }
}

.packaging-summary {
  margin-top: 24px;
}

.packaging-tree {
  margin-top: 16px;
}

.packaging-node {
  display: flex;
  align-items: center;
  gap: 12px;

  .node-label {
    font-weight: 500;
    color: var(--el-text-color-primary);
  }

  .node-info {
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }
}

:deep(.el-tree-node__content) {
  height: 32px;
}

:deep(.el-tree-node__children) {
  padding-left: 24px;
}
</style>
