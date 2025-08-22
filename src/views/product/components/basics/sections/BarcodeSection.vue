# 条码信息部分组件
<template>
  <div class="section">
    <div class="section-header">
      <h3>条码信息</h3>
      <el-tooltip content="商品物理识别标识">
        <el-icon><InfoFilled /></el-icon>
      </el-tooltip>
    </div>

    <div class="section-body">
      <!-- 主条码 -->
      <el-form-item
        label="主条码"
        prop="barcodeInfo.primary"
        :required="isBarcodeRequired"
        class="primary-barcode"
      >
        <div class="barcode-container">
          <!-- 条码类型选择 -->
          <el-select
            v-model="form.barcodeInfo.primary.type"
            placeholder="请选择条码类型"
            style="width: 120px"
          >
            <el-option
              v-for="type in barcodeTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            >
              <div class="barcode-type-option">
                <span>{{ type.label }}</span>
                <el-tooltip :content="type.description" placement="right">
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
              </div>
            </el-option>
          </el-select>

          <!-- 条码输入 -->
          <el-input
            v-model="form.barcodeInfo.primary.value"
            :placeholder="'请输入' + getBarcodeTypeLabel(form.barcodeInfo.primary.type) + '条码'"
            style="width: 300px"
            :maxlength="getBarcodeMaxLength(form.barcodeInfo.primary.type)"
            show-word-limit
          >
            <template #append>
              <el-button @click="validateBarcode">
                <el-icon><Check /></el-icon>
                验证
              </el-button>
            </template>
          </el-input>

          <!-- 生成按钮 -->
          <el-button @click="generateBarcode">
            <el-icon><Magic /></el-icon>
            生成
          </el-button>
        </div>

        <!-- 条码预览 -->
        <div 
          v-if="form.barcodeInfo.primary.value"
          class="barcode-preview"
        >
          <vue-barcode
            :value="form.barcodeInfo.primary.value"
            :format="form.barcodeInfo.primary.type"
            :width="2"
            :height="50"
            :margin="5"
            :background="isDark ? '#1a1a1a' : '#ffffff'"
            :lineColor="isDark ? '#ffffff' : '#000000'"
          />
          <div class="barcode-status">
            <el-tag
              :type="form.barcodeInfo.primary.verified ? 'success' : 'warning'"
              size="small"
            >
              {{ form.barcodeInfo.primary.verified ? '已验证' : '未验证' }}
            </el-tag>
            <span v-if="form.barcodeInfo.primary.verificationDate">
              验证时间：{{ formatDate(form.barcodeInfo.primary.verificationDate) }}
            </span>
          </div>
        </div>

        <!-- 条码规则说明 -->
        <div class="barcode-rules">
          <el-collapse>
            <el-collapse-item 
              :title="getBarcodeTypeLabel(form.barcodeInfo.primary.type) + '条码规则'"
            >
              <div class="rules-content">
                <template v-if="form.barcodeInfo.primary.type === 'UPC'">
                  <h4>UPC-A 条码规则</h4>
                  <ul>
                    <li>长度：12位数字</li>
                    <li>第1位：商品类型</li>
                    <li>第2-6位：制造商编码</li>
                    <li>第7-11位：商品编码</li>
                    <li>第12位：校验位</li>
                  </ul>
                </template>

                <template v-else-if="form.barcodeInfo.primary.type === 'EAN'">
                  <h4>EAN-13 条码规则</h4>
                  <ul>
                    <li>长度：13位数字</li>
                    <li>前2-3位：国家代码</li>
                    <li>接下来4-6位：厂商代码</li>
                    <li>接下来3-5位：商品代码</li>
                    <li>最后1位：校验位</li>
                  </ul>
                </template>

                <template v-else-if="form.barcodeInfo.primary.type === 'GTIN'">
                  <h4>GTIN 条码规则</h4>
                  <ul>
                    <li>长度：14位数字</li>
                    <li>第1位：包装级别</li>
                    <li>第2-14位：EAN-13码</li>
                  </ul>
                </template>

                <template v-else-if="form.barcodeInfo.primary.type === 'ISBN'">
                  <h4>ISBN-13 条码规则</h4>
                  <ul>
                    <li>长度：13位数字</li>
                    <li>前3位：固定为978或979</li>
                    <li>接下来1-5位：组号</li>
                    <li>接下来2-7位：出版商号</li>
                    <li>接下来1-6位：书号</li>
                    <li>最后1位：校验位</li>
                  </ul>
                </template>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-form-item>

      <!-- 附加条码 -->
      <el-form-item
        label="附加条码"
        prop="barcodeInfo.additional"
        class="additional-barcodes"
      >
        <div class="additional-barcodes-container">
          <!-- 已添加的附加条码 -->
          <div
            v-for="(barcode, index) in form.barcodeInfo.additional"
            :key="index"
            class="additional-barcode-row"
          >
            <el-input
              v-model="barcode.type"
              placeholder="条码类型"
              style="width: 120px"
            />
            <el-input
              v-model="barcode.value"
              :placeholder="'请输入' + barcode.type + '条码'"
              style="width: 300px"
            />
            <el-date-picker
              v-model="barcode.startDate"
              type="date"
              placeholder="启用日期"
              style="width: 150px"
            />
            <el-date-picker
              v-model="barcode.endDate"
              type="date"
              placeholder="失效日期"
              style="width: 150px"
            />
            <el-button
              type="danger"
              link
              @click="removeAdditionalBarcode(index)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>

          <!-- 添加附加条码按钮 -->
          <el-button
            v-if="!form.barcodeInfo.additional?.length || form.barcodeInfo.additional.length < 5"
            type="primary"
            link
            @click="addAdditionalBarcode"
          >
            <el-icon><Plus /></el-icon>
            添加附加条码
          </el-button>

          <div class="barcode-tip">
            用于同一SKU多条码场景（如新旧包装共存）
          </div>
        </div>
      </el-form-item>

      <!-- 自定义编码 -->
      <el-form-item
        label="自定义编码"
        prop="barcodeInfo.custom"
        class="custom-code"
      >
        <el-input
          v-model="form.barcodeInfo.custom"
          placeholder="请输入商家内部自定义编码"
          style="width: 300px"
        >
          <template #append>
            <el-tooltip content="仅用于内部管理，不影响外部系统" placement="top">
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </template>
        </el-input>
      </el-form-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product, BarcodeType } from '@/types/product';

const props = defineProps<{
  form: Product;
}>();

// 条码类型定义
const barcodeTypes = [
  {
    value: 'UPC' as const,
    label: 'UPC',
    description: '通用产品代码，主要用于北美市场',
    length: 12
  },
  {
    value: 'EAN' as const,
    label: 'EAN',
    description: '欧洲商品编码，国际通用',
    length: 13
  },
  {
    value: 'GTIN' as const,
    label: 'GTIN',
    description: '全球贸易项目代码，包含包装层级信息',
    length: 14
  },
  {
    value: 'ISBN' as const,
    label: 'ISBN',
    description: '国际标准书号，用于图书产品',
    length: 13
  }
];

// 是否为暗色主题
const isDark = computed(() => {
  return document.documentElement.classList.contains('dark');
});

// 条码是否必填（根据类目判断）
const isBarcodeRequired = computed(() => {
  // TODO: 根据类目判断是否必填
  return false;
});

// 获取条码类型标签
function getBarcodeTypeLabel(type?: BarcodeType) {
  return barcodeTypes.find(t => t.value === type)?.label || '';
}

// 获取条码最大长度
function getBarcodeMaxLength(type?: BarcodeType) {
  return barcodeTypes.find(t => t.value === type)?.length || 20;
}

// 验证条码
async function validateBarcode() {
  if (!props.form.barcodeInfo.primary?.value) {
    ElMessage.warning('请先输入条码');
    return;
  }

  try {
    // TODO: 调用验证API
    await new Promise(resolve => setTimeout(resolve, 1000));
    props.form.barcodeInfo.primary.verified = true;
    props.form.barcodeInfo.primary.verificationDate = new Date().toISOString();
    ElMessage.success('条码验证通过');
  } catch (error) {
    ElMessage.error('条码验证失败');
  }
}

// 生成条码
function generateBarcode() {
  if (!props.form.barcodeInfo.primary?.type) {
    ElMessage.warning('请先选择条码类型');
    return;
  }

  // TODO: 调用生成API
  const randomDigits = (length: number) => {
    return Array.from(
      { length },
      () => Math.floor(Math.random() * 10)
    ).join('');
  };

  const type = props.form.barcodeInfo.primary.type;
  let barcode = '';

  switch (type) {
    case 'UPC':
      barcode = randomDigits(12);
      break;
    case 'EAN':
      barcode = randomDigits(13);
      break;
    case 'GTIN':
      barcode = randomDigits(14);
      break;
    case 'ISBN':
      barcode = '978' + randomDigits(10);
      break;
  }

  props.form.barcodeInfo.primary.value = barcode;
  props.form.barcodeInfo.primary.verified = false;
  props.form.barcodeInfo.primary.verificationDate = undefined;
}

// 添加附加条码
function addAdditionalBarcode() {
  if (!props.form.barcodeInfo.additional) {
    props.form.barcodeInfo.additional = [];
  }

  if (props.form.barcodeInfo.additional.length < 5) {
    props.form.barcodeInfo.additional.push({
      type: '',
      value: ''
    });
  }
}

// 移除附加条码
function removeAdditionalBarcode(index: number) {
  props.form.barcodeInfo.additional?.splice(index, 1);
}

// 格式化日期
function formatDate(date: string) {
  return new Date(date).toLocaleString();
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

.barcode-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.barcode-type-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .el-icon {
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }
}

.barcode-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.barcode-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.barcode-rules {
  margin-top: 16px;
}

.rules-content {
  color: var(--el-text-color-regular);
  font-size: 14px;

  h4 {
    margin: 0 0 8px;
    color: var(--el-text-color-primary);
  }

  ul {
    margin: 0;
    padding-left: 20px;
  }
}

.additional-barcodes-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.additional-barcode-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.barcode-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}
</style>
