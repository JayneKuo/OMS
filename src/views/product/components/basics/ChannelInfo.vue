<template>
  <div class="channel-info">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="channel-form"
    >
      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>渠道设置</span>
          </div>
        </template>

        <el-form-item label="销售渠道" prop="channels">
          <el-checkbox-group v-model="form.channels">
            <el-checkbox label="amazon">Amazon</el-checkbox>
            <el-checkbox label="shopify">Shopify</el-checkbox>
            <el-checkbox label="ebay">eBay</el-checkbox>
            <el-checkbox label="walmart">Walmart</el-checkbox>
            <el-checkbox label="woocommerce">WooCommerce</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-card>

      <!-- Amazon 设置 -->
      <el-card v-if="hasChannel('amazon')" class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <div class="left">
              <span>Amazon 设置</span>
              <el-tag :type="getChannelStatusType(form.amazon?.status)">
                {{ form.amazon?.status }}
              </el-tag>
            </div>
            <div class="right">
              <el-button-group>
                <el-button size="small" @click="refreshCompetitorPrices('amazon')">
                  <el-icon><Refresh /></el-icon>
                  更新竞争数据
                </el-button>
                <el-button size="small" type="primary" @click="syncToChannel('amazon')">
                  <el-icon><Upload /></el-icon>
                  同步到 Amazon
                </el-button>
              </el-button-group>
            </div>
          </div>
        </template>

        <el-tabs v-model="amazonActiveTab">
          <el-tab-pane label="基本信息" name="basic">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="ASIN" prop="amazon.asin">
                  <el-input v-model="form.amazon.asin" placeholder="请输入ASIN">
                    <template #append>
                      <el-button @click="fetchAsinInfo">
                        <el-icon><Search /></el-icon>
                      </el-button>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="亚马逊类目" prop="amazon.category">
                  <el-cascader
                    v-model="form.amazon.category"
                    :options="amazonCategories"
                    :props="{ checkStrictly: true }"
                    placeholder="请选择亚马逊类目"
                  >
                    <template #default="{ node, data }">
                      <span>{{ data.label }}</span>
                      <span v-if="data.browseNode">
                        ({{ data.browseNode }})
                      </span>
                    </template>
                  </el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Fulfillment" prop="amazon.fulfillment">
                  <el-select v-model="form.amazon.fulfillment" placeholder="请选择配送方式">
                    <el-option label="FBA" value="FBA">
                      <template #default>
                        <div style="display: flex; justify-content: space-between; align-items: center">
                          <span>FBA</span>
                          <el-tag size="small" type="success">推荐</el-tag>
                        </div>
                      </template>
                    </el-option>
                    <el-option label="FBM" value="FBM" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="品牌信息" prop="amazon.brand">
                  <el-card shadow="never" class="brand-card">
                    <el-form-item label="品牌名称" prop="amazon.brand.name">
                      <el-input v-model="form.amazon.brand.name" placeholder="请输入品牌名称" />
                    </el-form-item>
                    <el-form-item label="品牌商店" prop="amazon.brand.store">
                      <el-input v-model="form.amazon.brand.store" placeholder="请输入品牌商店URL">
                        <template #prepend>https://amazon.com/stores/</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="品牌注册" prop="amazon.brand.registry">
                      <el-input v-model="form.amazon.brand.registry" placeholder="请输入品牌注册号" />
                    </el-form-item>
                  </el-card>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="变体设置" prop="amazon.variation">
                  <el-card shadow="never" class="variation-card">
                    <el-form-item label="变体主题" prop="amazon.variation.theme">
                      <el-select v-model="form.amazon.variation.theme" placeholder="请选择变体主题">
                        <el-option label="尺寸" value="SizeName" />
                        <el-option label="颜色" value="ColorName" />
                        <el-option label="尺寸-颜色" value="SizeName-ColorName" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="变体属性" prop="amazon.variation.attributes">
                      <el-select
                        v-model="form.amazon.variation.attributes"
                        multiple
                        placeholder="请选择变体属性"
                      >
                        <el-option label="尺寸" value="size" />
                        <el-option label="颜色" value="color" />
                        <el-option label="材质" value="material" />
                      </el-select>
                    </el-form-item>
                  </el-card>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="价格与库存" name="pricing">
            <el-row :gutter="20">
              <el-col :span="16">
                <el-card shadow="never" class="pricing-card">
                  <template #header>
                    <div class="card-header">
                      <span>价格设置</span>
                      <el-tooltip content="竞争对手价格区间：$15.99 - $24.99" placement="top">
                        <el-icon><InfoFilled /></el-icon>
                      </el-tooltip>
                    </div>
                  </template>
                  <el-form-item label="标准价格" prop="amazon.price.regular">
                    <el-input-number
                      v-model="form.amazon.price.regular"
                      :precision="2"
                      :step="0.01"
                      :min="0"
                      placeholder="请输入标准价格"
                    />
                  </el-form-item>
                  <el-form-item label="促销价格" prop="amazon.price.sale">
                    <el-input-number
                      v-model="form.amazon.price.sale"
                      :precision="2"
                      :step="0.01"
                      :min="0"
                      placeholder="请输入促销价格"
                    >
                      <template #append>
                        <el-date-picker
                          v-model="form.amazon.promotion.dateRange"
                          type="daterange"
                          range-separator="-"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                        />
                      </template>
                    </el-input-number>
                  </el-form-item>
                  <el-form-item label="建议零售价" prop="amazon.price.msrp">
                    <el-input-number
                      v-model="form.amazon.price.msrp"
                      :precision="2"
                      :step="0.01"
                      :min="0"
                      placeholder="请输入建议零售价"
                    />
                  </el-form-item>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="never" class="inventory-card">
                  <template #header>
                    <div class="card-header">
                      <span>库存设置</span>
                    </div>
                  </template>
                  <el-form-item label="库存策略" prop="amazon.inventory.strategy">
                    <el-select v-model="form.amazon.inventory.strategy" placeholder="请选择库存策略">
                      <el-option label="固定数量" value="fixed" />
                      <el-option label="百分比" value="percentage" />
                      <el-option label="实际库存" value="actual" />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="库存数量"
                    prop="amazon.inventory.quantity"
                    v-if="form.amazon.inventory.strategy === 'fixed'"
                  >
                    <el-input-number
                      v-model="form.amazon.inventory.quantity"
                      :min="0"
                      placeholder="请输入库存数量"
                    />
                  </el-form-item>
                  <el-form-item
                    label="库存百分比"
                    prop="amazon.inventory.percentage"
                    v-if="form.amazon.inventory.strategy === 'percentage'"
                  >
                    <el-slider
                      v-model="form.amazon.inventory.percentage"
                      :min="0"
                      :max="100"
                      :format-tooltip="value => value + '%'"
                    />
                  </el-form-item>
                  <el-form-item label="库存阈值" prop="amazon.inventory.threshold">
                    <el-input-number
                      v-model="form.amazon.inventory.threshold"
                      :min="0"
                      placeholder="请输入库存阈值"
                    >
                      <template #append>
                        <el-tooltip content="库存低于此值时发送通知" placement="top">
                          <el-icon><InfoFilled /></el-icon>
                        </el-tooltip>
                      </template>
                    </el-input-number>
                  </el-form-item>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="内容优化" name="content">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="搜索关键词" prop="amazon.searchTerms">
                  <el-select
                    v-model="form.amazon.searchTerms"
                    multiple
                    filterable
                    allow-create
                    :max-limit="5"
                    placeholder="请输入搜索关键词（最多5个）"
                  >
                    <template #prefix>
                      <el-tooltip content="每个关键词建议50个字符以内" placement="top">
                        <el-icon><InfoFilled /></el-icon>
                      </el-tooltip>
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="五点描述" prop="amazon.bulletPoints">
                  <el-card shadow="never" class="bullet-points-card">
                    <template #header>
                      <div class="card-header">
                        <span>五点描述</span>
                        <el-tooltip content="每点建议200个字符以内" placement="top">
                          <el-icon><InfoFilled /></el-icon>
                        </el-tooltip>
                      </div>
                    </template>
                    <div
                      v-for="(lang, index) in supportedLanguages"
                      :key="lang.value"
                      class="bullet-points-lang"
                    >
                      <div class="lang-label">{{ lang.label }}:</div>
                      <el-input
                        v-for="(point, pIndex) in form.amazon.bulletPoints[lang.value]"
                        :key="pIndex"
                        v-model="form.amazon.bulletPoints[lang.value][pIndex]"
                        type="textarea"
                        :rows="2"
                        :placeholder="`请输入第${pIndex + 1}点描述`"
                        show-word-limit
                        maxlength="200"
                      />
                    </div>
                  </el-card>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="A+ 内容" prop="amazon.aplus">
              <el-card shadow="never" class="aplus-card">
                <template #header>
                  <div class="card-header">
                    <div class="left">
                      <span>A+ 内容</span>
                      <el-tag type="success" v-if="form.amazon.aplus?.enabled">已启用</el-tag>
                      <el-tag type="info" v-else>未启用</el-tag>
                    </div>
                    <div class="right">
                      <el-switch v-model="form.amazon.aplus.enabled" />
                    </div>
                  </div>
                </template>
                <template v-if="form.amazon.aplus?.enabled">
                  <el-tabs v-model="aplusActiveTab">
                    <el-tab-pane label="模块选择" name="modules">
                      <el-form-item label="选择模块">
                        <el-checkbox-group v-model="form.amazon.aplus.modules">
                          <el-checkbox label="standard-text">标准文本</el-checkbox>
                          <el-checkbox label="standard-image">标准图文</el-checkbox>
                          <el-checkbox label="standard-comparison">标准对比</el-checkbox>
                          <el-checkbox label="standard-three-images">三图布局</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="内容编辑" name="content">
                      <el-form-item label="A+ 内容">
                        <el-input
                          v-model="form.amazon.aplus.content"
                          type="textarea"
                          :rows="10"
                          placeholder="请输入 A+ 内容"
                        />
                      </el-form-item>
                    </el-tab-pane>
                  </el-tabs>
                </template>
              </el-card>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="竞争分析" name="analytics">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-card shadow="never" class="analytics-card">
                  <template #header>
                    <div class="card-header">
                      <span>销售表现</span>
                    </div>
                  </template>
                  <div class="analytics-item">
                    <span class="label">浏览量</span>
                    <span class="value">{{ form.amazon.analytics?.views || 0 }}</span>
                  </div>
                  <div class="analytics-item">
                    <span class="label">销量</span>
                    <span class="value">{{ form.amazon.analytics?.sales || 0 }}</span>
                  </div>
                  <div class="analytics-item">
                    <span class="label">转化率</span>
                    <span class="value">{{ (form.amazon.analytics?.conversion || 0) * 100 }}%</span>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="never" class="analytics-card">
                  <template #header>
                    <div class="card-header">
                      <span>Buy Box</span>
                    </div>
                  </template>
                  <div class="analytics-item">
                    <span class="label">Buy Box 状态</span>
                    <el-tag :type="form.amazon.analytics?.buyBox ? 'success' : 'danger'">
                      {{ form.amazon.analytics?.buyBox ? '已获得' : '未获得' }}
                    </el-tag>
                  </div>
                  <div class="analytics-item">
                    <span class="label">排名</span>
                    <span class="value">#{{ form.amazon.analytics?.ranking || 'N/A' }}</span>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="never" class="analytics-card">
                  <template #header>
                    <div class="card-header">
                      <span>竞争对手价格</span>
                    </div>
                  </template>
                  <div class="analytics-item">
                    <span class="label">最低价</span>
                    <span class="value">${{ form.amazon.analytics?.competitorPrices?.min || 'N/A' }}</span>
                  </div>
                  <div class="analytics-item">
                    <span class="label">最高价</span>
                    <span class="value">${{ form.amazon.analytics?.competitorPrices?.max || 'N/A' }}</span>
                  </div>
                  <div class="analytics-item">
                    <span class="label">平均价</span>
                    <span class="value">${{ form.amazon.analytics?.competitorPrices?.average || 'N/A' }}</span>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- Shopify 设置 -->
      <el-card v-if="hasChannel('shopify')" class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>Shopify 设置</span>
          </div>
        </template>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="商品ID" prop="shopify.productId">
              <el-input v-model="form.shopify.productId" placeholder="请输入商品ID" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品类型" prop="shopify.productType">
              <el-input v-model="form.shopify.productType" placeholder="请输入商品类型" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商" prop="shopify.vendor">
              <el-input v-model="form.shopify.vendor" placeholder="请输入供应商" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="售价" prop="shopify.price">
              <el-input-number
                v-model="form.shopify.price"
                :precision="2"
                :step="0.01"
                :min="0"
                placeholder="请输入售价"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="比较价格" prop="shopify.compareAtPrice">
              <el-input-number
                v-model="form.shopify.compareAtPrice"
                :precision="2"
                :step="0.01"
                :min="0"
                placeholder="请输入比较价格"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库存跟踪" prop="shopify.trackInventory">
              <el-switch v-model="form.shopify.trackInventory" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- eBay 设置 -->
      <el-card v-if="hasChannel('ebay')" class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>eBay 设置</span>
          </div>
        </template>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="商品ID" prop="ebay.itemId">
              <el-input v-model="form.ebay.itemId" placeholder="请输入商品ID" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="eBay类目" prop="ebay.category">
              <el-cascader
                v-model="form.ebay.category"
                :options="ebayCategories"
                placeholder="请选择eBay类目"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品状态" prop="ebay.condition">
              <el-select v-model="form.ebay.condition" placeholder="请选择商品状态">
                <el-option label="全新" value="NEW" />
                <el-option label="二手" value="USED" />
                <el-option label="翻新" value="REFURBISHED" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="起始价格" prop="ebay.startPrice">
              <el-input-number
                v-model="form.ebay.startPrice"
                :precision="2"
                :step="0.01"
                :min="0"
                placeholder="请输入起始价格"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="一口价" prop="ebay.buyItNowPrice">
              <el-input-number
                v-model="form.ebay.buyItNowPrice"
                :precision="2"
                :step="0.01"
                :min="0"
                placeholder="请输入一口价"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库存数量" prop="ebay.quantity">
              <el-input-number
                v-model="form.ebay.quantity"
                :min="0"
                placeholder="请输入库存数量"
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
import type { FormInstance } from 'element-plus';
import type { Language } from '@/types/common';
import type {
  ChannelType,
  ChannelSettings,
  AmazonListing,
  ShopifyListing,
  EbayListing,
  WalmartListing
} from '@/types/channel';

const props = defineProps<{
  form: ChannelSettings
}>();

// 支持的渠道列表
const supportedChannels: { label: string; value: ChannelType; icon: string }[] = [
  { label: 'Amazon', value: 'amazon', icon: 'amazon' },
  { label: 'Shopify', value: 'shopify', icon: 'shopify' },
  { label: 'eBay', value: 'ebay', icon: 'ebay' },
  { label: 'Walmart', value: 'walmart', icon: 'walmart' },
  { label: 'WooCommerce', value: 'woocommerce', icon: 'woocommerce' }
];

const emit = defineEmits(['update:form']);

const formRef = ref<FormInstance>();
const form = reactive(props.form);

// 标签页状态
const amazonActiveTab = ref('basic');
const aplusActiveTab = ref('modules');

// 获取渠道状态样式
const getChannelStatusType = (status?: string) => {
  const types: Record<string, string> = {
    draft: 'info',
    active: 'success',
    inactive: 'warning',
    archived: 'danger'
  };
  return types[status?.toLowerCase() || ''] || 'info';
};

// 更新竞争数据
const refreshCompetitorPrices = async (channel: ChannelType) => {
  try {
    // TODO: 调用 API 获取最新竞争数据
    ElMessage.success('竞争数据更新成功');
  } catch (error) {
    ElMessage.error('竞争数据更新失败');
  }
};

// 同步到渠道
const syncToChannel = async (channel: ChannelType) => {
  try {
    // TODO: 调用 API 同步数据到渠道
    ElMessage.success('数据同步成功');
  } catch (error) {
    ElMessage.error('数据同步失败');
  }
};

// 获取 ASIN 信息
const fetchAsinInfo = async () => {
  if (!form.amazon?.asin) {
    ElMessage.warning('请先输入 ASIN');
    return;
  }

  try {
    // TODO: 调用 API 获取 ASIN 信息
    ElMessage.success('ASIN 信息获取成功');
  } catch (error) {
    ElMessage.error('ASIN 信息获取失败');
  }
};

// 模拟数据
const amazonCategories = [
  {
    value: 'electronics',
    label: 'Electronics',
    children: [
      {
        value: 'computers',
        label: 'Computers & Accessories',
        children: [
          {
            value: 'laptops',
            label: 'Laptops'
          }
        ]
      }
    ]
  }
];

const ebayCategories = [
  {
    value: 'electronics',
    label: 'Electronics',
    children: [
      {
        value: 'computers',
        label: 'Computers/Tablets & Networking',
        children: [
          {
            value: 'laptops',
            label: 'Laptops & Netbooks'
          }
        ]
      }
    ]
  }
];

// 表单验证规则
const rules = {
  enabledChannels: [{ required: true, message: '请选择至少一个销售渠道', trigger: 'change' }],
  // Amazon 验证规则
  'amazon.asin': [{ required: true, message: '请输入ASIN', trigger: 'blur' }],
  'amazon.category': [{ required: true, message: '请选择亚马逊类目', trigger: 'change' }],
  'amazon.fulfillment': [{ required: true, message: '请选择配送方式', trigger: 'change' }],
  'amazon.brand.name': [{ required: true, message: '请输入品牌名称', trigger: 'blur' }],
  'amazon.price.regular': [{ required: true, message: '请输入标准价格', trigger: 'blur' }],
  'amazon.inventory.strategy': [{ required: true, message: '请选择库存策略', trigger: 'change' }],
  'amazon.inventory.quantity': [{
    required: true,
    message: '请输入库存数量',
    trigger: 'blur',
    validator: (rule: any, value: any) => {
      return form.amazon?.inventory.strategy === 'fixed' ? !!value : true;
    }
  }],
  'amazon.inventory.percentage': [{
    required: true,
    message: '请输入库存百分比',
    trigger: 'change',
    validator: (rule: any, value: any) => {
      return form.amazon?.inventory.strategy === 'percentage' ? !!value : true;
    }
  }],
  'amazon.searchTerms': [{
    type: 'array',
    max: 5,
    message: '最多添加5个搜索关键词',
    trigger: 'change'
  }],
  'amazon.bulletPoints': [{
    type: 'array',
    max: 5,
    message: '最多添加5点描述',
    trigger: 'change'
  }],
  // Shopify 验证规则
  'shopify.handle': [{ required: true, message: '请输入商品 Handle', trigger: 'blur' }],
  'shopify.productType': [{ required: true, message: '请输入商品类型', trigger: 'blur' }],
  'shopify.vendor': [{ required: true, message: '请输入供应商', trigger: 'blur' }],
  'shopify.price.regular': [{ required: true, message: '请输入标准价格', trigger: 'blur' }],
  // eBay 验证规则
  'ebay.itemId': [{ required: true, message: '请输入商品ID', trigger: 'blur' }],
  'ebay.category': [{ required: true, message: '请选择eBay类目', trigger: 'change' }],
  'ebay.condition': [{ required: true, message: '请选择商品状态', trigger: 'change' }],
  'ebay.format': [{ required: true, message: '请选择销售格式', trigger: 'change' }],
  'ebay.startPrice': [{
    required: true,
    message: '请输入起始价格',
    trigger: 'blur',
    validator: (rule: any, value: any) => {
      return form.ebay?.format === 'AUCTION' ? !!value : true;
    }
  }],
  'ebay.buyItNowPrice': [{
    required: true,
    message: '请输入一口价',
    trigger: 'blur',
    validator: (rule: any, value: any) => {
      return form.ebay?.format === 'FIXED_PRICE' ? !!value : true;
    }
  }],
};

// 检查是否包含特定渠道
const hasChannel = (channel: string) => {
  return form.channels?.includes(channel);
};

// 暴露验证方法给父组件
defineExpose({
  validate: () => formRef.value?.validate()
});
</script>

<style scoped>
.channel-info {
  height: 100%;
  overflow-y: auto;
}

.channel-form {
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
  font-weight: 500;

  .left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
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

.brand-card,
.variation-card,
.pricing-card,
.inventory-card,
.bullet-points-card,
.aplus-card,
.analytics-card {
  :deep(.el-card__body) {
    padding: 16px;
  }
}

.bullet-points-lang {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  .lang-label {
    margin-bottom: 8px;
    font-weight: 500;
  }

  :deep(.el-input) {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.analytics-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  .label {
    color: var(--el-text-color-secondary);
  }

  .value {
    font-weight: 500;
  }
}
</style>
