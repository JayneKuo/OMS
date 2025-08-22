<template>
  <div class="warehouse-info">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="warehouse-form"
    >
      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>库存设置</span>
          </div>
        </template>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="库存跟踪" prop="trackInventory">
              <el-switch v-model="form.trackInventory" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="安全库存" prop="safetyStock">
              <el-input-number
                v-model="form.safetyStock"
                :min="0"
                placeholder="请输入安全库存"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="补货点" prop="reorderPoint">
              <el-input-number
                v-model="form.reorderPoint"
                :min="0"
                placeholder="请输入补货点"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="最大库存" prop="maxStock">
              <el-input-number
                v-model="form.maxStock"
                :min="0"
                placeholder="请输入最大库存"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经济订货量" prop="economicOrderQuantity">
              <el-input-number
                v-model="form.economicOrderQuantity"
                :min="0"
                placeholder="请输入经济订货量"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="补货周期(天)" prop="leadTime">
              <el-input-number
                v-model="form.leadTime"
                :min="0"
                placeholder="请输入补货周期"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>仓库分配</span>
            <el-button-group>
              <el-button
                type="primary"
                link
                :icon="Plus"
                @click="handleAddWarehouse"
              >
                添加仓库
              </el-button>
              <el-button
                type="primary"
                link
                :icon="Refresh"
                @click="refreshInventoryLevels"
              >
                刷新库存
              </el-button>
            </el-button-group>
          </div>
        </template>

        <el-table :data="form.warehouses" border style="width: 100%">
          <el-table-column label="仓库类型" prop="type" width="150">
            <template #default="{ row }">
              <el-select v-model="row.type" placeholder="请选择仓库类型">
                <el-option
                  v-for="type in warehouseTypes"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="仓库" prop="warehouseId" width="200">
            <template #default="{ row }">
              <el-select v-model="row.warehouseId" placeholder="请选择仓库">
                <el-option
                  v-for="warehouse in warehouses"
                  :key="warehouse.id"
                  :label="warehouse.name"
                  :value="warehouse.id"
                />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="库位" prop="location" width="200">
            <template #default="{ row }">
              <el-input v-model="row.location" placeholder="请输入库位" />
            </template>
          </el-table-column>

          <el-table-column label="初始库存" prop="initialStock" width="150">
            <template #default="{ row }">
              <el-input-number
                v-model="row.initialStock"
                :min="0"
                placeholder="请输入初始库存"
              />
            </template>
          </el-table-column>

          <el-table-column label="最小库存" prop="minStock" width="150">
            <template #default="{ row }">
              <el-input-number
                v-model="row.minStock"
                :min="0"
                placeholder="请输入最小库存"
              />
            </template>
          </el-table-column>

          <el-table-column label="最大库存" prop="maxStock" width="150">
            <template #default="{ row }">
              <el-input-number
                v-model="row.maxStock"
                :min="0"
                placeholder="请输入最大库存"
              />
            </template>
          </el-table-column>

          <el-table-column label="优先级" prop="priority" width="150">
            <template #default="{ row }">
              <el-input-number
                v-model="row.priority"
                :min="1"
                :max="99"
                placeholder="请输入优先级"
              />
            </template>
          </el-table-column>

          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row, $index }">
              <el-button-group>
                <el-button
                  type="primary"
                  link
                  :icon="TrendCharts"
                  @click="showWarehouseAnalytics(row)"
                >
                  分析
                </el-button>
                <el-button
                  type="danger"
                  link
                  :icon="Delete"
                  @click="handleRemoveWarehouse($index)"
                >
                  删除
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- FBA 设置 -->
      <el-card v-if="hasFBAWarehouse" class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>Amazon FBA 设置</span>
          </div>
        </template>

        <el-form-item label="启用 FBA" prop="fba.enabled">
          <el-switch v-model="form.fba.enabled" />
        </el-form-item>

        <template v-if="form.fba?.enabled">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="配送中心" prop="fba.fulfillmentCenter">
                <el-select v-model="form.fba.fulfillmentCenter" placeholder="请选择配送中心">
                  <el-option label="美国东部" value="US_EAST" />
                  <el-option label="美国西部" value="US_WEST" />
                  <el-option label="欧洲" value="EU" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预处理中心" prop="fba.prepCenter">
                <el-select v-model="form.fba.prepCenter" placeholder="请选择预处理中心">
                  <el-option label="自行处理" value="SELF" />
                  <el-option label="亚马逊处理" value="AMAZON" />
                  <el-option label="第三方处理" value="THIRD_PARTY" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="需要贴标" prop="fba.labelingRequired">
                <el-switch v-model="form.fba.labelingRequired" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="需要包装" prop="fba.packagingRequired">
                <el-switch v-model="form.fba.packagingRequired" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="危险品资质" prop="fba.hazmatEligible">
                <el-switch v-model="form.fba.hazmatEligible" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="预处理说明" prop="fba.preparationInstructions">
            <el-input
              v-model="form.fba.preparationInstructions"
              type="textarea"
              :rows="3"
              placeholder="请输入预处理说明"
            />
          </el-form-item>
        </template>
      </el-card>

      <!-- WFS 设置 -->
      <el-card v-if="hasWFSWarehouse" class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>Walmart WFS 设置</span>
          </div>
        </template>

        <el-form-item label="启用 WFS" prop="wfs.enabled">
          <el-switch v-model="form.wfs.enabled" />
        </el-form-item>

        <template v-if="form.wfs?.enabled">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="配送中心" prop="wfs.fulfillmentCenter">
                <el-select v-model="form.wfs.fulfillmentCenter" placeholder="请选择配送中心">
                  <el-option label="美国东部" value="US_EAST" />
                  <el-option label="美国中部" value="US_CENTRAL" />
                  <el-option label="美国西部" value="US_WEST" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="配送模板" prop="wfs.shippingTemplate">
                <el-select v-model="form.wfs.shippingTemplate" placeholder="请选择配送模板">
                  <el-option label="标准配送" value="STANDARD" />
                  <el-option label="二日达" value="TWO_DAY" />
                  <el-option label="次日达" value="NEXT_DAY" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="处理时间(天)" prop="wfs.handlingTime">
                <el-input-number
                  v-model="form.wfs.handlingTime"
                  :min="1"
                  :max="5"
                  placeholder="请输入处理时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="退货政策" prop="wfs.returnPolicy">
                <el-select v-model="form.wfs.returnPolicy" placeholder="请选择退货政策">
                  <el-option label="30天退货" value="30_DAYS" />
                  <el-option label="60天退货" value="60_DAYS" />
                  <el-option label="90天退货" value="90_DAYS" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-card>

      <!-- 3PL 设置 -->
      <el-card v-if="has3PLWarehouse" class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>第三方物流设置</span>
            <el-button
              type="primary"
              link
              :icon="Plus"
              @click="handleAdd3PL"
            >
              添加3PL
            </el-button>
          </div>
        </template>

        <div v-for="(thirdPL, index) in form.thirdPartyLogistics" :key="index" class="third-pl-item">
          <el-divider v-if="index > 0" />
          
          <div class="third-pl-header">
            <h4>3PL Provider #{{ index + 1 }}</h4>
            <el-button
              type="danger"
              link
              :icon="Delete"
              @click="handleRemove3PL(index)"
            >
              删除
            </el-button>
          </div>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item :label="'服务商'" :prop="'thirdPartyLogistics.' + index + '.provider'">
                <el-select
                  v-model="thirdPL.provider"
                  placeholder="请选择服务商"
                >
                  <el-option label="ShipBob" value="SHIPBOB" />
                  <el-option label="Deliverr" value="DELIVERR" />
                  <el-option label="ShipMonk" value="SHIPMONK" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="'仓库'" :prop="'thirdPartyLogistics.' + index + '.warehouse'">
                <el-input v-model="thirdPL.warehouse" placeholder="请输入仓库" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="'账号'" :prop="'thirdPartyLogistics.' + index + '.accountNumber'">
                <el-input v-model="thirdPL.accountNumber" placeholder="请输入账号" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item :label="'API密钥'" :prop="'thirdPartyLogistics.' + index + '.apiKey'">
            <el-input
              v-model="thirdPL.apiKey"
              type="password"
              placeholder="请输入API密钥"
              show-password
            />
          </el-form-item>
        </div>
      </el-card>

      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>智能补货</span>
          </div>
        </template>

        <el-tabs v-model="replenishmentActiveTab">
          <el-tab-pane label="补货规则" name="rules">
            <el-form-item label="补货类型" prop="replenishmentRules.type">
              <el-radio-group v-model="form.replenishmentRules.type">
                <el-radio label="min-max">最小-最大补货</el-radio>
                <el-radio label="periodic">定期补货</el-radio>
                <el-radio label="demand-driven">需求驱动</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="最小库存" prop="replenishmentRules.minQuantity">
                  <el-input-number
                    v-model="form.replenishmentRules.minQuantity"
                    :min="0"
                    placeholder="请输入最小库存"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="最大库存" prop="replenishmentRules.maxQuantity">
                  <el-input-number
                    v-model="form.replenishmentRules.maxQuantity"
                    :min="0"
                    placeholder="请输入最大库存"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="补货点" prop="replenishmentRules.orderPoint">
                  <el-input-number
                    v-model="form.replenishmentRules.orderPoint"
                    :min="0"
                    placeholder="请输入补货点"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="补货量" prop="replenishmentRules.orderQuantity">
                  <el-input-number
                    v-model="form.replenishmentRules.orderQuantity"
                    :min="0"
                    placeholder="请输入补货量"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="复查周期(天)"
                  prop="replenishmentRules.reviewPeriod"
                  v-if="form.replenishmentRules.type === 'periodic'"
                >
                  <el-input-number
                    v-model="form.replenishmentRules.reviewPeriod"
                    :min="1"
                    placeholder="请输入复查周期"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="安全库存" prop="replenishmentRules.safetyStock">
                  <el-input-number
                    v-model="form.replenishmentRules.safetyStock"
                    :min="0"
                    placeholder="请输入安全库存"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="需求预测" name="forecast">
            <el-form-item label="预测周期" prop="inventoryForecasts.period">
              <el-radio-group v-model="form.inventoryForecasts.period">
                <el-radio label="daily">每日</el-radio>
                <el-radio label="weekly">每周</el-radio>
                <el-radio label="monthly">每月</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="预测需求" prop="inventoryForecasts.forecastedDemand">
                  <el-input-number
                    v-model="form.inventoryForecasts.forecastedDemand"
                    :min="0"
                    placeholder="请输入预测需求"
                  >
                    <template #append>
                      <el-tooltip content="基于历史销售数据的预测值" placement="top">
                        <el-icon><InfoFilled /></el-icon>
                      </el-tooltip>
                    </template>
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="置信度" prop="inventoryForecasts.confidenceLevel">
                  <el-slider
                    v-model="form.inventoryForecasts.confidenceLevel"
                    :min="0"
                    :max="100"
                    :format-tooltip="value => value + '%'"
                  >
                    <template #marker>
                      <el-icon><InfoFilled /></el-icon>
                    </template>
                  </el-slider>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="季节性因子" prop="inventoryForecasts.seasonalityFactor">
                  <el-input-number
                    v-model="form.inventoryForecasts.seasonalityFactor"
                    :min="0"
                    :max="2"
                    :step="0.1"
                    placeholder="请输入季节性因子"
                  >
                    <template #append>
                      <el-tooltip content="1.0 表示无季节性，>1.0 表示旺季，<1.0 表示淡季" placement="top">
                        <el-icon><InfoFilled /></el-icon>
                      </el-tooltip>
                    </template>
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="趋势因子" prop="inventoryForecasts.trendFactor">
                  <el-input-number
                    v-model="form.inventoryForecasts.trendFactor"
                    :min="-1"
                    :max="1"
                    :step="0.1"
                    placeholder="请输入趋势因子"
                  >
                    <template #append>
                      <el-tooltip content="正值表示上升趋势，负值表示下降趋势" placement="top">
                        <el-icon><InfoFilled /></el-icon>
                      </el-tooltip>
                    </template>
                  </el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>库存规则</span>
          </div>
        </template>

        <el-form-item label="库存分配策略" prop="allocationStrategy">
          <el-select v-model="form.allocationStrategy" placeholder="请选择库存分配策略">
            <el-option label="FIFO" value="FIFO" />
            <el-option label="LIFO" value="LIFO" />
            <el-option label="FEFO" value="FEFO" />
            <el-option label="按仓库优先级" value="PRIORITY" />
          </el-select>
        </el-form-item>

        <el-form-item label="缺货处理" prop="outOfStockAction">
          <el-select v-model="form.outOfStockAction" placeholder="请选择缺货处理方式">
            <el-option label="允许超卖" value="ALLOW_BACKORDER" />
            <el-option label="禁止销售" value="PREVENT_SALE" />
            <el-option label="等待补货" value="WAIT_FOR_RESTOCK" />
          </el-select>
        </el-form-item>

        <el-form-item label="库存预警规则" prop="stockAlertRules">
          <el-checkbox-group v-model="form.stockAlertRules">
            <el-checkbox label="LOW_STOCK">低库存预警</el-checkbox>
            <el-checkbox label="OUT_OF_STOCK">缺货预警</el-checkbox>
            <el-checkbox label="EXCESS_STOCK">库存积压预警</el-checkbox>
            <el-checkbox label="EXPIRY">效期预警</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-card>

      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>物流信息</span>
          </div>
        </template>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="包装类型" prop="packagingType">
              <el-select v-model="form.packagingType" placeholder="请选择包装类型">
                <el-option label="标准包装" value="STANDARD" />
                <el-option label="气泡包装" value="BUBBLE" />
                <el-option label="防震包装" value="SHOCK_PROOF" />
                <el-option label="防水包装" value="WATER_PROOF" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="危险品等级" prop="dangerousGoodsClass">
              <el-select v-model="form.dangerousGoodsClass" placeholder="请选择危险品等级">
                <el-option label="非危险品" value="NONE" />
                <el-option label="1类" value="CLASS_1" />
                <el-option label="2类" value="CLASS_2" />
                <el-option label="3类" value="CLASS_3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="温控要求" prop="temperatureControl">
              <el-select v-model="form.temperatureControl" placeholder="请选择温控要求">
                <el-option label="常温" value="ROOM_TEMP" />
                <el-option label="冷藏" value="REFRIGERATED" />
                <el-option label="冷冻" value="FROZEN" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="堆码层数" prop="stackingTier">
              <el-input-number
                v-model="form.stackingTier"
                :min="1"
                placeholder="请输入堆码层数"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效期(天)" prop="shelfLife">
              <el-input-number
                v-model="form.shelfLife"
                :min="0"
                placeholder="请输入有效期"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { Plus, Delete, Refresh, TrendCharts } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus';
import type {
  WarehouseSettings,
  WarehouseType,
  FBASettings,
  WFSSettings,
  ThirdPartyLogistics,
  InventoryForecast,
  ReplenishmentRule
} from '@/types/warehouse';

const props = defineProps<{
  form: WarehouseSettings
}>();

// 仓库类型选项
const warehouseTypes: { label: string; value: WarehouseType }[] = [
  { label: '自营仓库', value: 'SELF_OPERATED' },
  { label: 'Amazon FBA', value: 'FBA' },
  { label: 'Walmart WFS', value: 'WFS' },
  { label: '第三方物流', value: '3PL' }
];

const emit = defineEmits(['update:form']);

const formRef = ref<FormInstance>();
const form = reactive(props.form);

// 标签页状态
const replenishmentActiveTab = ref('rules');

// 计算属性
const hasFBAWarehouse = computed(() => {
  return form.warehouses?.some(w => w.type === 'FBA');
});

const hasWFSWarehouse = computed(() => {
  return form.warehouses?.some(w => w.type === 'WFS');
});

const has3PLWarehouse = computed(() => {
  return form.warehouses?.some(w => w.type === '3PL');
});

// 模拟数据
const warehouses = [
  { id: 'WH001', name: '美国西部仓库' },
  { id: 'WH002', name: '美国东部仓库' },
  { id: 'WH003', name: '欧洲仓库' },
  { id: 'WH004', name: '亚洲仓库' }
];

// 表单验证规则
const rules = {
  allocationStrategy: [
    { required: true, message: '请选择库存分配策略', trigger: 'change' }
  ],
  outOfStockAction: [
    { required: true, message: '请选择缺货处理方式', trigger: 'change' }
  ],
  packagingType: [
    { required: true, message: '请选择包装类型', trigger: 'change' }
  ],
  'replenishmentRules.type': [
    { required: true, message: '请选择补货类型', trigger: 'change' }
  ],
  'replenishmentRules.minQuantity': [
    { required: true, message: '请输入最小库存', trigger: 'blur' }
  ],
  'replenishmentRules.maxQuantity': [
    { required: true, message: '请输入最大库存', trigger: 'blur' }
  ],
  'replenishmentRules.orderPoint': [
    { required: true, message: '请输入补货点', trigger: 'blur' }
  ],
  'replenishmentRules.orderQuantity': [
    { required: true, message: '请输入补货量', trigger: 'blur' }
  ],
  'replenishmentRules.reviewPeriod': [{
    required: true,
    message: '请输入复查周期',
    trigger: 'blur',
    validator: (rule: any, value: any) => {
      return form.replenishmentRules?.type === 'periodic' ? !!value : true;
    }
  }],
  'inventoryForecasts.period': [
    { required: true, message: '请选择预测周期', trigger: 'change' }
  ],
  'inventoryForecasts.forecastedDemand': [
    { required: true, message: '请输入预测需求', trigger: 'blur' }
  ]
};

// 添加仓库
const handleAddWarehouse = () => {
  if (!form.warehouses) {
    form.warehouses = [];
  }
  form.warehouses.push({
    warehouseId: '',
    warehouseName: '',
    location: '',
    initialStock: 0,
    minStock: 0,
    maxStock: 0,
    type: 'SELF_OPERATED',
    priority: form.warehouses.length + 1
  });
};

// 删除仓库
const handleRemoveWarehouse = (index: number) => {
  form.warehouses.splice(index, 1);
  // 重新计算优先级
  form.warehouses.forEach((w, i) => {
    w.priority = i + 1;
  });
};

// 添加3PL
const handleAdd3PL = () => {
  if (!form.thirdPartyLogistics) {
    form.thirdPartyLogistics = [];
  }
  form.thirdPartyLogistics.push({
    provider: '',
    warehouse: '',
    accountNumber: '',
    apiKey: '',
    integrationSettings: {}
  });
};

// 删除3PL
const handleRemove3PL = (index: number) => {
  form.thirdPartyLogistics?.splice(index, 1);
};

// 刷新库存水平
const refreshInventoryLevels = async () => {
  try {
    // TODO: 调用 API 刷新库存水平
    ElMessage.success('库存水平刷新成功');
  } catch (error) {
    ElMessage.error('库存水平刷新失败');
  }
};

// 显示仓库分析
const showWarehouseAnalytics = (warehouse: WarehouseLocation) => {
  // TODO: 显示仓库分析弹窗
  ElMessage.info('仓库分析功能开发中');
};

// 暴露验证方法给父组件
defineExpose({
  validate: () => formRef.value?.validate()
});
</script>

<style scoped>
.warehouse-info {
  height: 100%;
  overflow-y: auto;
}

.warehouse-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-card {
  :deep(.el-card__header) {
    padding: 12px 20px;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

:deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

:deep(.el-form-item) {
  margin-bottom: 18px;

  &:last-child {
    margin-bottom: 0;
  }
}

.third-pl-item {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  .third-pl-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
  }
}

:deep(.el-tabs__content) {
  padding: 16px 0;
}

:deep(.el-slider) {
  margin-top: 8px;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-tooltip__trigger) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

:deep(.el-radio-group) {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

:deep(.el-button-group) {
  display: flex;
  gap: 8px;
}
</style>
