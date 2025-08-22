<template>
  <div class="bundle-info">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="bundle-form"
    >
      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <div class="left">
              <span>套装设置</span>
              <el-tag :type="getBundleStatusType(form.status)">
                {{ getBundleStatusText(form.status) }}
              </el-tag>
            </div>
            <div class="right">
              <el-button-group>
                <el-button
                  type="primary"
                  link
                  :icon="TrendCharts"
                  @click="analyticsDialogVisible = true"
                >
                  分析
                </el-button>
                <el-button
                  type="primary"
                  link
                  :icon="Promotion"
                  @click="promotionDialogVisible = true"
                >
                  促销
                </el-button>
                <el-button
                  type="primary"
                  link
                  :icon="Setting"
                  @click="recommendationDialogVisible = true"
                >
                  推荐
                </el-button>
              </el-button-group>
            </div>
          </div>
        </template>

        <el-tabs v-model="activeTab">
          <el-tab-pane label="基本设置" name="basic">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="套装类型" prop="bundleType">
                  <el-select v-model="form.bundleType" placeholder="请选择套装类型">
                    <el-option label="固定套装" value="FIXED">
                      <template #default>
                        <div class="option-with-tip">
                          <span>固定套装</span>
                          <el-tooltip content="组件和数量固定，不可更改" placement="right">
                            <el-icon><InfoFilled /></el-icon>
                          </el-tooltip>
                        </div>
                      </template>
                    </el-option>
                    <el-option label="动态套装" value="DYNAMIC">
                      <template #default>
                        <div class="option-with-tip">
                          <span>动态套装</span>
                          <el-tooltip content="组件固定，数量可调整" placement="right">
                            <el-icon><InfoFilled /></el-icon>
                          </el-tooltip>
                        </div>
                      </template>
                    </el-option>
                    <el-option label="可选套装" value="OPTIONAL">
                      <template #default>
                        <div class="option-with-tip">
                          <span>可选套装</span>
                          <el-tooltip content="组件和数量都可选择" placement="right">
                            <el-icon><InfoFilled /></el-icon>
                          </el-tooltip>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="定价策略" prop="pricingStrategy">
                  <el-select v-model="form.pricingStrategy" placeholder="请选择定价策略">
                    <el-option label="固定价格" value="FIXED">
                      <template #default>
                        <div class="option-with-tip">
                          <span>固定价格</span>
                          <el-tooltip content="手动设置套装价格" placement="right">
                            <el-icon><InfoFilled /></el-icon>
                          </el-tooltip>
                        </div>
                      </template>
                    </el-option>
                    <el-option label="组件总和" value="SUM">
                      <template #default>
                        <div class="option-with-tip">
                          <span>组件总和</span>
                          <el-tooltip content="自动计算组件总价" placement="right">
                            <el-icon><InfoFilled /></el-icon>
                          </el-tooltip>
                        </div>
                      </template>
                    </el-option>
                    <el-option label="折扣价格" value="DISCOUNT">
                      <template #default>
                        <div class="option-with-tip">
                          <span>折扣价格</span>
                          <el-tooltip content="基于总价设置折扣" placement="right">
                            <el-icon><InfoFilled /></el-icon>
                          </el-tooltip>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  v-if="form.pricingStrategy === 'DISCOUNT'"
                  label="折扣率"
                  prop="discountRate"
                >
                  <el-input-number
                    v-model="form.discountRate"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    :max="100"
                    placeholder="请输入折扣率"
                  >
                    <template #append>%</template>
                  </el-input-number>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="状态" prop="status">
                  <el-select v-model="form.status" placeholder="请选择状态">
                    <el-option label="草稿" value="draft" />
                    <el-option label="活跃" value="active" />
                    <el-option label="非活跃" value="inactive" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="显示顺序" prop="displayOrder">
                  <el-input-number
                    v-model="form.displayOrder"
                    :min="0"
                    placeholder="请输入显示顺序"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="定制选项" name="customization">
            <el-form-item label="允许定制" prop="customization.allowed">
              <el-switch v-model="form.customization.allowed" />
            </el-form-item>

            <template v-if="form.customization?.allowed">
              <div class="customization-options">
                <div class="options-header">
                  <span>定制选项</span>
                  <el-button type="primary" link :icon="Plus" @click="handleAddCustomizationOption">
                    添加选项
                  </el-button>
                </div>

                <div
                  v-for="(option, index) in form.customization.options"
                  :key="index"
                  class="option-item"
                >
                  <el-row :gutter="20">
                    <el-col :span="6">
                      <el-form-item
                        :label="'选项名称'"
                        :prop="'customization.options.' + index + '.name'"
                      >
                        <el-input v-model="option.name" placeholder="请输入选项名称" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item
                        :label="'选项类型'"
                        :prop="'customization.options.' + index + '.type'"
                      >
                        <el-select v-model="option.type" placeholder="请选择选项类型">
                          <el-option label="文本" value="text" />
                          <el-option label="选择" value="select" />
                          <el-option label="颜色" value="color" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item
                        :label="'是否必填'"
                        :prop="'customization.options.' + index + '.required'"
                      >
                        <el-switch v-model="option.required" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <div class="option-actions">
                        <el-button
                          type="danger"
                          link
                          :icon="Delete"
                          @click="handleRemoveCustomizationOption(index)"
                        >
                          删除
                        </el-button>
                      </div>
                    </el-col>
                  </el-row>

                  <el-form-item
                    v-if="option.type === 'select' || option.type === 'color'"
                    :label="'选项值'"
                    :prop="'customization.options.' + index + '.values'"
                  >
                    <el-select
                      v-model="option.values"
                      multiple
                      filterable
                      allow-create
                      placeholder="请输入选项值"
                    />
                  </el-form-item>
                </div>
              </div>
            </template>
          </el-tab-pane>

          <el-tab-pane label="限制规则" name="restrictions">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="限制国家/地区" prop="restrictions.countries">
                  <el-select
                    v-model="form.restrictions.countries"
                    multiple
                    filterable
                    placeholder="请选择限制国家/地区"
                  >
                    <el-option
                      v-for="country in countries"
                      :key="country.code"
                      :label="country.name"
                      :value="country.code"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="限制客户组" prop="restrictions.customerGroups">
                  <el-select
                    v-model="form.restrictions.customerGroups"
                    multiple
                    filterable
                    placeholder="请选择限制客户组"
                  >
                    <el-option
                      v-for="group in customerGroups"
                      :key="group.id"
                      :label="group.name"
                      :value="group.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="最小年龄限制" prop="restrictions.minimumAge">
                  <el-input-number
                    v-model="form.restrictions.minimumAge"
                    :min="0"
                    placeholder="请输入最小年龄限制"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="每单最大数量" prop="restrictions.maximumQuantityPerOrder">
                  <el-input-number
                    v-model="form.restrictions.maximumQuantityPerOrder"
                    :min="0"
                    placeholder="请输入每单最大数量"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>套装组件</span>
            <el-button type="primary" link :icon="Plus" @click="handleAddComponent">
              添加组件
            </el-button>
          </div>
        </template>

        <el-table :data="form.components" border style="width: 100%">
          <el-table-column label="商品" prop="productId" width="300">
            <template #default="{ row }">
              <el-select
                v-model="row.productId"
                filterable
                remote
                :remote-method="handleProductSearch"
                placeholder="请选择商品"
                :loading="productSearchLoading"
              >
                <el-option
                  v-for="product in productOptions"
                  :key="product.id"
                  :label="product.name"
                  :value="product.id"
                >
                  <div class="product-option">
                    <span>{{ product.name }}</span>
                    <span class="product-sku">{{ product.sku }}</span>
                  </div>
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="数量" prop="quantity" width="150">
            <template #default="{ row }">
              <el-input-number
                v-model="row.quantity"
                :min="1"
                placeholder="请输入数量"
              />
            </template>
          </el-table-column>

          <el-table-column
            label="必选"
            prop="required"
            width="100"
            v-if="form.bundleType === 'OPTIONAL'"
          >
            <template #default="{ row }">
              <el-switch v-model="row.required" />
            </template>
          </el-table-column>

          <el-table-column label="单价" prop="price">
            <template #default="{ row }">
              <el-input-number
                v-model="row.price"
                :precision="2"
                :step="0.01"
                :min="0"
                placeholder="请输入单价"
                :disabled="form.pricingStrategy !== 'FIXED'"
              />
            </template>
          </el-table-column>

          <el-table-column label="小计" width="150">
            <template #default="{ row }">
              {{ calculateSubtotal(row) }}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ $index }">
              <el-button-group>
                <el-button
                  type="primary"
                  link
                  :icon="Top"
                  :disabled="$index === 0"
                  @click="handleMoveComponent($index, 'up')"
                >
                  上移
                </el-button>
                <el-button
                  type="primary"
                  link
                  :icon="Bottom"
                  :disabled="$index === form.components.length - 1"
                  @click="handleMoveComponent($index, 'down')"
                >
                  下移
                </el-button>
                <el-button
                  type="danger"
                  link
                  :icon="Delete"
                  @click="handleRemoveComponent($index)"
                >
                  删除
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>

        <div class="table-footer">
          <span class="total-label">总价：</span>
          <span class="total-amount">$ {{ calculateTotal }}</span>
        </div>
      </el-card>

      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>套装规则</span>
          </div>
        </template>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="库存策略" prop="inventoryStrategy">
              <el-select v-model="form.inventoryStrategy" placeholder="请选择库存策略">
                <el-option label="独立库存" value="INDEPENDENT" />
                <el-option label="组件库存" value="COMPONENT" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最小订购量" prop="minOrderQuantity">
              <el-input-number
                v-model="form.minOrderQuantity"
                :min="1"
                placeholder="请输入最小订购量"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大订购量" prop="maxOrderQuantity">
              <el-input-number
                v-model="form.maxOrderQuantity"
                :min="1"
                placeholder="请输入最大订购量"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="销售规则" prop="salesRules">
          <el-checkbox-group v-model="form.salesRules">
            <el-checkbox label="ALLOW_SINGLE">允许单独销售组件</el-checkbox>
            <el-checkbox label="SYNC_PRICE">同步更新组件价格</el-checkbox>
            <el-checkbox label="SYNC_INVENTORY">同步更新组件库存</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-card>
    </el-form>

    <!-- 促销对话框 -->
    <el-dialog
      v-model="promotionDialogVisible"
      title="促销设置"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="promotionFormRef"
        :model="form.promotions"
        label-width="120px"
      >
        <el-form-item label="启用促销" prop="enabled">
          <el-switch v-model="form.promotions.enabled" />
        </el-form-item>

        <template v-if="form.promotions?.enabled">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="促销类型" prop="type">
                <el-select v-model="form.promotions.type" placeholder="请选择促销类型">
                  <el-option label="百分比折扣" value="percentage" />
                  <el-option label="固定金额" value="fixed" />
                  <el-option label="买一送一" value="bogo" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="促销值" prop="value">
                <el-input-number
                  v-model="form.promotions.value"
                  :precision="2"
                  :step="0.01"
                  :min="0"
                  placeholder="请输入促销值"
                >
                  <template #append>
                    {{ form.promotions.type === 'percentage' ? '%' : '$' }}
                  </template>
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最大折扣" prop="maximumDiscount">
                <el-input-number
                  v-model="form.promotions.maximumDiscount"
                  :precision="2"
                  :step="0.01"
                  :min="0"
                  placeholder="请输入最大折扣"
                >
                  <template #append>$</template>
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="最小购买数量" prop="minimumQuantity">
                <el-input-number
                  v-model="form.promotions.minimumQuantity"
                  :min="1"
                  placeholder="请输入最小购买数量"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="可叠加" prop="stackable">
                <el-switch v-model="form.promotions.stackable" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="开始时间" prop="startDate">
                <el-date-picker
                  v-model="form.promotions.startDate"
                  type="datetime"
                  placeholder="请选择开始时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间" prop="endDate">
                <el-date-picker
                  v-model="form.promotions.endDate"
                  type="datetime"
                  placeholder="请选择结束时间"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="适用渠道" prop="channels">
            <el-select
              v-model="form.promotions.channels"
              multiple
              placeholder="请选择适用渠道"
            >
              <el-option label="Amazon" value="amazon" />
              <el-option label="Shopify" value="shopify" />
              <el-option label="eBay" value="ebay" />
              <el-option label="Walmart" value="walmart" />
            </el-select>
          </el-form-item>

          <el-form-item label="客户组" prop="customerGroups">
            <el-select
              v-model="form.promotions.customerGroups"
              multiple
              placeholder="请选择客户组"
            >
              <el-option
                v-for="group in customerGroups"
                :key="group.id"
                :label="group.name"
                :value="group.id"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="promotionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSavePromotion">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分析对话框 -->
    <el-dialog
      v-model="analyticsDialogVisible"
      title="套装分析"
      width="80%"
      :close-on-click-modal="false"
    >
      <el-tabs>
        <el-tab-pane label="销售概览">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-card class="analytics-card">
                <template #header>
                  <div class="card-header">
                    <span>销售数量</span>
                  </div>
                </template>
                <div class="analytics-value">
                  {{ form.analytics?.salesCount || 0 }}
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="analytics-card">
                <template #header>
                  <div class="card-header">
                    <span>转化率</span>
                  </div>
                </template>
                <div class="analytics-value">
                  {{ ((form.analytics?.conversionRate || 0) * 100).toFixed(2) }}%
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="analytics-card">
                <template #header>
                  <div class="card-header">
                    <span>平均订单金额</span>
                  </div>
                </template>
                <div class="analytics-value">
                  $ {{ form.analytics?.averageOrderValue?.toFixed(2) || '0.00' }}
                </div>
              </el-card>
            </el-col>
          </el-row>

          <el-divider />

          <el-row :gutter="20">
            <el-col :span="12">
              <h4>热销组合</h4>
              <el-table :data="form.analytics?.topSellingCombinations || []">
                <el-table-column label="组合" prop="components">
                  <template #default="{ row }">
                    {{ row.components.join(' + ') }}
                  </template>
                </el-table-column>
                <el-table-column label="销量" prop="salesCount" />
                <el-table-column label="收入" prop="revenue">
                  <template #default="{ row }">
                    $ {{ row.revenue.toFixed(2) }}
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="12">
              <h4>客户群体</h4>
              <el-table :data="form.analytics?.customerSegments || []">
                <el-table-column label="客户群" prop="segment" />
                <el-table-column label="占比" prop="percentage">
                  <template #default="{ row }">
                    {{ row.percentage }}%
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>

          <el-divider />

          <h4>季节性趋势</h4>
          <el-table :data="form.analytics?.seasonalityTrends || []">
            <el-table-column label="月份" prop="month" />
            <el-table-column label="销量" prop="salesCount" />
            <el-table-column label="趋势" prop="trend">
              <template #default="{ row }">
                <el-tag :type="getTrendType(row.trend)">
                  {{ getTrendText(row.trend) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 推荐对话框 -->
    <el-dialog
      v-model="recommendationDialogVisible"
      title="智能推荐"
      width="70%"
      :close-on-click-modal="false"
    >
      <el-tabs>
        <el-tab-pane label="推荐商品">
          <el-table :data="form.recommendations || []">
            <el-table-column label="推荐类型" prop="type">
              <template #default="{ row }">
                {{ getRecommendationType(row.type) }}
              </template>
            </el-table-column>
            <el-table-column label="商品" prop="products">
              <template #default="{ row }">
                <div
                  v-for="product in row.products"
                  :key="product.productId"
                  class="recommended-product"
                >
                  <span class="product-name">{{ product.productName }}</span>
                  <span class="product-sku">{{ product.sku }}</span>
                  <div class="product-metrics">
                    <el-tooltip content="亲和度" placement="top">
                      <span class="metric">
                        <el-icon><Star /></el-icon>
                        {{ (product.affinityScore * 100).toFixed(0) }}%
                      </span>
                    </el-tooltip>
                    <el-tooltip content="转化率" placement="top">
                      <span class="metric">
                        <el-icon><TrendCharts /></el-icon>
                        {{ (product.conversionRate * 100).toFixed(0) }}%
                      </span>
                    </el-tooltip>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  link
                  @click="handleApplyRecommendation(row)"
                >
                  应用
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="推荐规则">
          <el-form
            ref="recommendationRulesFormRef"
            :model="form.recommendations[0].rules"
            label-width="120px"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="最低价格" prop="minPrice">
                  <el-input-number
                    v-model="form.recommendations[0].rules.minPrice"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    placeholder="请输入最低价格"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="最高价格" prop="maxPrice">
                  <el-input-number
                    v-model="form.recommendations[0].rules.maxPrice"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    placeholder="请输入最高价格"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="类目" prop="categories">
              <el-select
                v-model="form.recommendations[0].rules.categories"
                multiple
                filterable
                placeholder="请选择类目"
              >
                <el-option
                  v-for="category in categories"
                  :key="category.value"
                  :label="category.label"
                  :value="category.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="属性" prop="attributes">
              <el-card shadow="never" class="attributes-card">
                <template #header>
                  <div class="card-header">
                    <span>属性规则</span>
                    <el-button
                      type="primary"
                      link
                      :icon="Plus"
                      @click="handleAddAttributeRule"
                    >
                      添加规则
                    </el-button>
                  </div>
                </template>

                <div
                  v-for="(values, key) in form.recommendations[0].rules.attributes"
                  :key="key"
                  class="attribute-rule"
                >
                  <el-input
                    v-model="attributeKey"
                    placeholder="请输入属性名"
                    @change="handleAttributeKeyChange(key, $event)"
                  />
                  <el-select
                    v-model="form.recommendations[0].rules.attributes[key]"
                    multiple
                    filterable
                    allow-create
                    placeholder="请输入属性值"
                  />
                  <el-button
                    type="danger"
                    link
                    :icon="Delete"
                    @click="handleRemoveAttributeRule(key)"
                  />
                </div>
              </el-card>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="recommendationDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRefreshRecommendations">
            刷新推荐
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import {
  Plus,
  Delete,
  Top,
  Bottom,
  Refresh,
  TrendCharts,
  Promotion,
  Setting
} from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus';
import type {
  BundleSettings,
  BundleType,
  PricingStrategy,
  InventoryStrategy,
  SalesRule,
  BundleComponent,
  BundleAnalytics,
  BundlePromotion,
  BundleRecommendation
} from '@/types/bundle';

const props = defineProps<{
  form: BundleSettings
}>();

// 标签页状态
const activeTab = ref('basic');
const promotionDialogVisible = ref(false);
const analyticsDialogVisible = ref(false);
const recommendationDialogVisible = ref(false);

const emit = defineEmits(['update:form']);

const formRef = ref<FormInstance>();
const form = reactive(props.form);

// 模拟数据
const productSearchLoading = ref(false);
const productOptions = ref([
  { id: 1, name: '商品1', sku: 'SKU001' },
  { id: 2, name: '商品2', sku: 'SKU002' },
  { id: 3, name: '商品3', sku: 'SKU003' },
]);

// 表单验证规则
const rules = {
  bundleType: [{ required: true, message: '请选择套装类型', trigger: 'change' }],
  pricingStrategy: [{ required: true, message: '请选择定价策略', trigger: 'change' }],
  inventoryStrategy: [{ required: true, message: '请选择库存策略', trigger: 'change' }],
};

// 搜索商品
const handleProductSearch = async (query: string) => {
  if (query) {
    productSearchLoading.value = true;
    try {
      // TODO: 实现商品搜索API
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      productSearchLoading.value = false;
    }
  }
};

// 添加组件
const handleAddComponent = () => {
  if (!form.components) {
    form.components = [];
  }
  form.components.push({
    productId: '',
    quantity: 1,
    required: true,
    price: 0
  });
};

// 删除组件
const handleRemoveComponent = (index: number) => {
  form.components.splice(index, 1);
};

// 移动组件
const handleMoveComponent = (index: number, direction: 'up' | 'down') => {
  const newIndex = direction === 'up' ? index - 1 : index + 1;
  const component = form.components[index];
  form.components.splice(index, 1);
  form.components.splice(newIndex, 0, component);
};

// 计算小计
const calculateSubtotal = (row: any) => {
  if (!row.quantity || !row.price) return '$ 0.00';
  return `$ ${(row.quantity * row.price).toFixed(2)}`;
};

// 计算总价
const calculateTotal = computed(() => {
  if (!form.components) return '0.00';
  const total = form.components.reduce((sum, component) => {
    return sum + (component.quantity || 0) * (component.price || 0);
  }, 0);
  
  if (form.pricingStrategy === 'DISCOUNT' && form.discountRate) {
    return (total * (1 - form.discountRate / 100)).toFixed(2);
  }
  
  return total.toFixed(2);
});

// 暴露验证方法给父组件
defineExpose({
  validate: () => formRef.value?.validate()
});
</script>

<style scoped>
.bundle-info {
  height: 100%;
  overflow-y: auto;
}

.bundle-form {
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

:deep(.el-tabs__content) {
  padding: 16px 0;
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

.table-footer {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 12px 20px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.total-label {
  font-size: 14px;
  margin-right: 8px;
}

.total-amount {
  font-size: 18px;
  font-weight: 500;
  color: var(--el-color-danger);
}

.product-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-sku {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.option-with-tip {
  display: flex;
  align-items: center;
  gap: 8px;
}

.customization-options {
  .options-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .option-item {
    margin-bottom: 24px;
    padding: 16px;
    border: 1px solid var(--el-border-color-light);
    border-radius: 4px;

    &:last-child {
      margin-bottom: 0;
    }

    .option-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 32px;
    }
  }
}

.analytics-card {
  .analytics-value {
    font-size: 24px;
    font-weight: 500;
    text-align: center;
    padding: 16px 0;
  }
}

.recommended-product {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0;
  border-bottom: 1px solid var(--el-border-color-light);

  &:last-child {
    border-bottom: none;
  }

  .product-name {
    font-weight: 500;
  }

  .product-metrics {
    display: flex;
    gap: 16px;

    .metric {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--el-text-color-secondary);
      font-size: 12px;
    }
  }
}

.attributes-card {
  .attribute-rule {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
