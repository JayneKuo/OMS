# 物流信息部分组件
<template>
  <div class="section">
    <div class="section-header">
      <h3>物流信息</h3>
      <el-tooltip content="商品最小单位的计量、重量与尺寸">
        <el-icon><InfoFilled /></el-icon>
      </el-tooltip>
    </div>

    <div class="section-body">
      <!-- 主计量单位 -->
      <el-form-item
        label="主计量单位"
        prop="logisticsInfo.primaryUOM.unit"
        required
        class="uom-item"
      >
        <el-select
          v-model="form.logisticsInfo.primaryUOM.unit"
          placeholder="请选择主计量单位"
          style="width: 180px"
        >
          <el-option label="个/件 (EA)" value="EA" />
          <el-option label="千克 (KG)" value="KG" />
          <el-option label="磅 (LB)" value="LB" />
          <el-option label="包 (Pack)" value="Pack" />
          <el-option label="箱 (Case)" value="Case" />
          <el-option label="托盘 (Pallet)" value="Pallet" />
        </el-select>

        <!-- 自定义单位名称 -->
        <el-input
          v-if="form.logisticsInfo.primaryUOM.unit !== 'EA'"
          v-model="form.logisticsInfo.primaryUOM.customName"
          placeholder="自定义单位名称（可选）"
          style="width: 200px; margin-left: 8px;"
        />
      </el-form-item>

      <!-- 辅助计量单位 -->
      <el-form-item
        label="辅助计量单位"
        prop="logisticsInfo.additionalUOMs"
        class="additional-uom-item"
      >
        <div class="additional-uoms-container">
          <!-- 已添加的辅助单位 -->
          <div
            v-for="(uom, index) in form.logisticsInfo.additionalUOMs"
            :key="index"
            class="additional-uom-row"
          >
            <el-select
              v-model="uom.unit"
              placeholder="请选择计量单位"
              style="width: 180px"
            >
              <el-option label="个/件 (EA)" value="EA" />
              <el-option label="千克 (KG)" value="KG" />
              <el-option label="磅 (LB)" value="LB" />
              <el-option label="包 (Pack)" value="Pack" />
              <el-option label="箱 (Case)" value="Case" />
              <el-option label="托盘 (Pallet)" value="Pallet" />
            </el-select>

            <!-- 自定义单位名称 -->
            <el-input
              v-if="uom.unit !== 'EA'"
              v-model="uom.customName"
              placeholder="自定义单位名称（可选）"
              style="width: 160px"
            />

            <!-- 换算关系 -->
            <div class="conversion-relation">
              <span class="conversion-text">1 {{ uom.customName || uom.unit }} =</span>
              <el-input-number
                v-model="uom.ratio"
                :min="0"
                :precision="2"
                :step="0.1"
                style="width: 120px"
              />
              <span class="conversion-text">{{ form.logisticsInfo.primaryUOM.customName || form.logisticsInfo.primaryUOM.unit }}</span>
            </div>

            <!-- 删除按钮 -->
            <el-button
              type="danger"
              link
              @click="removeAdditionalUOM(index)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>

          <!-- 添加辅助单位按钮 -->
          <el-button
            v-if="!form.logisticsInfo.additionalUOMs?.length || form.logisticsInfo.additionalUOMs.length < 3"
            type="primary"
            link
            @click="addAdditionalUOM"
          >
            <el-icon><Plus /></el-icon>
            添加辅助计量单位
          </el-button>

          <div class="uom-tip">
            可添加最多3个辅助计量单位，用于不同场景下的单位换算
          </div>
        </div>
      </el-form-item>

      <!-- 重量信息 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="净重"
            prop="logisticsInfo.weight.net"
            required
            class="weight-item"
          >
            <el-input-number
              v-model="form.logisticsInfo.weight.net"
              :precision="3"
              :step="0.001"
              :min="0"
              style="width: 180px"
              placeholder="请输入净重"
            >
              <template #append>
                <el-select
                  v-model="form.logisticsInfo.weight.unit"
                  style="width: 70px"
                >
                  <el-option label="kg" value="kg" />
                  <el-option label="lb" value="lb" />
                </el-select>
              </template>
            </el-input-number>

            <!-- 单位换算显示 -->
            <span 
              v-if="form.logisticsInfo.weight.unit" 
              class="weight-conversion"
            >
              ≈ {{ convertedWeight }} {{ form.logisticsInfo.weight.unit === 'kg' ? 'lb' : 'kg' }}
            </span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="毛重"
            prop="logisticsInfo.weight.gross"
            class="weight-item"
          >
            <el-input-number
              v-model="form.logisticsInfo.weight.gross"
              :precision="3"
              :step="0.001"
              :min="form.logisticsInfo.weight.net"
              style="width: 180px"
              placeholder="请输入毛重"
            >
              <template #append>
                <el-select
                  v-model="form.logisticsInfo.weight.unit"
                  style="width: 70px"
                >
                  <el-option label="kg" value="kg" />
                  <el-option label="lb" value="lb" />
                </el-select>
              </template>
            </el-input-number>

            <!-- 单位换算显示 -->
            <span 
              v-if="form.logisticsInfo.weight.gross" 
              class="weight-conversion"
            >
              ≈ {{ convertedGrossWeight }} {{ form.logisticsInfo.weight.unit === 'kg' ? 'lb' : 'kg' }}
            </span>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 尺寸信息 -->
      <el-form-item
        label="商品尺寸"
        prop="logisticsInfo.dimensions"
        required
        class="dimensions-item"
      >
        <div class="dimensions-container">
          <el-input-number
            v-model="form.logisticsInfo.dimensions.length"
            :precision="2"
            :step="0.1"
            :min="0"
            style="width: 120px"
            placeholder="长"
          >
            <template #prepend>
              <span class="dimension-label">长</span>
            </template>
          </el-input-number>

          <el-input-number
            v-model="form.logisticsInfo.dimensions.width"
            :precision="2"
            :step="0.1"
            :min="0"
            style="width: 120px"
            placeholder="宽"
          >
            <template #prepend>
              <span class="dimension-label">宽</span>
            </template>
          </el-input-number>

          <el-input-number
            v-model="form.logisticsInfo.dimensions.height"
            :precision="2"
            :step="0.1"
            :min="0"
            style="width: 120px"
            placeholder="高"
          >
            <template #prepend>
              <span class="dimension-label">高</span>
            </template>
          </el-input-number>

          <el-select
            v-model="form.logisticsInfo.dimensions.unit"
            style="width: 90px"
          >
            <el-option label="cm" value="cm" />
            <el-option label="inch" value="inch" />
          </el-select>

          <!-- 单位换算显示 -->
          <div 
            v-if="hasDimensions" 
            class="dimensions-conversion"
          >
            ≈ {{ convertedDimensions }}
          </div>
        </div>

        <!-- 体积重计算 -->
        <div 
          v-if="hasDimensions"
          class="volume-weight"
        >
          体积重：{{ volumeWeight }} kg
          <el-tooltip content="体积重 = 长(cm) × 宽(cm) × 高(cm) ÷ 6000" placement="top">
            <el-icon><InfoFilled /></el-icon>
          </el-tooltip>
        </div>
      </el-form-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '@/types/product';

const props = defineProps<{
  form: Product;
}>();

// 添加辅助计量单位
function addAdditionalUOM() {
  if (!props.form.logisticsInfo.additionalUOMs) {
    props.form.logisticsInfo.additionalUOMs = [];
  }
  
  if (props.form.logisticsInfo.additionalUOMs.length < 3) {
    props.form.logisticsInfo.additionalUOMs.push({
      unit: 'EA',
      ratio: 1,
      customName: ''
    });
  }
}

// 删除辅助计量单位
function removeAdditionalUOM(index: number) {
  props.form.logisticsInfo.additionalUOMs?.splice(index, 1);
}

// 重量单位换算
const convertedWeight = computed(() => {
  const { net, unit } = props.form.logisticsInfo.weight;
  if (!net) return '';
  
  return unit === 'kg'
    ? (net * 2.20462).toFixed(3) // kg to lb
    : (net * 0.453592).toFixed(3); // lb to kg
});

const convertedGrossWeight = computed(() => {
  const { gross, unit } = props.form.logisticsInfo.weight;
  if (!gross) return '';
  
  return unit === 'kg'
    ? (gross * 2.20462).toFixed(3) // kg to lb
    : (gross * 0.453592).toFixed(3); // lb to kg
});

// 尺寸相关计算
const hasDimensions = computed(() => {
  const { length, width, height } = props.form.logisticsInfo.dimensions;
  return length && width && height;
});

const convertedDimensions = computed(() => {
  const { length, width, height, unit } = props.form.logisticsInfo.dimensions;
  if (!length || !width || !height) return '';

  if (unit === 'cm') {
    // cm to inch
    const l = (length / 2.54).toFixed(2);
    const w = (width / 2.54).toFixed(2);
    const h = (height / 2.54).toFixed(2);
    return `${l}" × ${w}" × ${h}"`;
  } else {
    // inch to cm
    const l = (length * 2.54).toFixed(2);
    const w = (width * 2.54).toFixed(2);
    const h = (height * 2.54).toFixed(2);
    return `${l} × ${w} × ${h} cm`;
  }
});

// 体积重计算
const volumeWeight = computed(() => {
  const { length, width, height, unit } = props.form.logisticsInfo.dimensions;
  if (!length || !width || !height) return 0;

  // 转换为cm
  const l = unit === 'cm' ? length : length * 2.54;
  const w = unit === 'cm' ? width : width * 2.54;
  const h = unit === 'cm' ? height : height * 2.54;

  // 体积重 = 长 × 宽 × 高 ÷ 6000
  return ((l * w * h) / 6000).toFixed(2);
});
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

/* 计量单位 */
.additional-uoms-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.additional-uom-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.conversion-relation {
  display: flex;
  align-items: center;
  gap: 8px;
}

.conversion-text {
  color: var(--el-text-color-regular);
}

.uom-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

/* 重量 */
.weight-conversion {
  margin-left: 8px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

/* 尺寸 */
.dimensions-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dimension-label {
  color: var(--el-text-color-regular);
  width: 24px;
  text-align: center;
}

.dimensions-conversion {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.volume-weight {
  margin-top: 8px;
  color: var(--el-text-color-regular);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
