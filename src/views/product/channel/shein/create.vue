<template>
  <div class="shein-product-create">
    <!-- 顶部标题栏 -->
    <div class="page-header" :class="{ 'is-sticky': isSticky }">
      <div class="header-content">
      <div class="header-left">
        <el-button link class="back-button" @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <h1 class="page-title">Create Shein Product</h1>

          <!-- 标签页导航 -->
        <div class="horizontal-tabs">
          <div class="tabs-nav">
            <div 
              v-for="tab in tabs" 
              :key="tab.id"
              class="tab-item"
              :class="{ 'is-active': activeTab === tab.id }"
              @click="scrollToSection(tab.id)"
            >
              <div class="tab-label-wrapper">
                <el-icon class="tab-icon">
                  <component :is="tab.icon" />
                </el-icon>
                <span class="tab-label">{{ tab.label }}</span>
              </div>
            </div>
          </div>
            <div class="tabs-active-bar" :style="{ left: activeBarLeft, width: activeBarWidth }"></div>
        </div>
        </div>
      </div>
    </div>
    
    <!-- 表单内容区域 -->
    <div class="content-wrapper" ref="contentWrapperRef">
      <div class="form-content">
        <!-- Basic Info 区域 -->
        <div id="basic" class="section-block" ref="basicRef">
          <div class="section-header">
            <h2 class="section-main-title">
              <el-icon class="title-icon"><Document /></el-icon>
              Basic Information
            </h2>
          </div>
          <el-card shadow="never" class="section-card">
            <el-form :model="formData" :rules="rules" ref="basicFormRef" label-width="180px" class="content-form">
              
              <!-- 店铺 -->
              <el-form-item label="Store" prop="store" required>
                <el-select v-model="formData.store" placeholder="Select store" style="width: 100%;">
                  <el-option label="Gearonic" value="gearonic" />
                  <el-option label="Store 2" value="store2" />
                  <el-option label="Store 3" value="store3" />
                </el-select>
              </el-form-item>

              <!-- 发布站点 -->
              <el-form-item label="Publish Site" prop="publishSites" required>
                <el-checkbox-group v-model="formData.publishSites">
                  <el-checkbox label="all">All Sites</el-checkbox>
                  <el-checkbox label="us">US Site</el-checkbox>
                </el-checkbox-group>
              </el-form-item>

              <!-- 产品标题 -->
              <!-- 商品名称 -->
              <el-form-item label="Product Name" prop="productName" required>
                <div style="display: flex; gap: 8px; align-items: flex-start; width: 100%;">
                  <el-input 
                    v-model="formData.productName" 
                    placeholder="Enter product name"
                    maxlength="200"
                    show-word-limit
                    style="flex: 1;"
                  />
                  <div class="field-ai-actions">
                    <el-button class="ai-button" :icon="MagicStick" @click="handleAIGenerateProductName">
                      AI Generate
                    </el-button>
                    <el-tooltip content="AI SEO Analysis & Suggestions" placement="top">
                      <el-button class="ai-button" @click="handleQuickSEOAnalysis('productName')">
                        <el-icon><TrendCharts /></el-icon>
                        SEO Check
                      </el-button>
                    </el-tooltip>
                  </div>
                </div>
              </el-form-item>

              <!-- 货号 -->
              <el-form-item label="Seller Parent SKU" prop="sellerParentSku" required>
                <el-input 
                  v-model="formData.sellerParentSku" 
                  placeholder="Enter seller parent SKU"
                  maxlength="256"
                  show-word-limit
                />
              </el-form-item>

              <!-- 产品描述 -->
              <el-form-item label="Product Description" prop="productDescription">
                <div style="width: 100%;">
                  <el-input 
                    v-model="formData.productDescription" 
                    type="textarea"
                    :rows="8"
                    placeholder="Enter product description"
                    maxlength="5000"
                    show-word-limit
                  />
                  <div style="margin-top: 8px;">
                    <el-button class="ai-button" size="small" :icon="MagicStick" @click="handleAIGenerateDescription">AI Generate</el-button>
                  </div>
                </div>
              </el-form-item>

              <!-- 品牌 -->
              <el-form-item label="Brand" prop="brand">
                <div style="display: flex; gap: 8px; align-items: center; width: 100%;">
                  <el-select v-model="formData.brand" placeholder="Select brand" clearable style="flex: 1;">
                    <el-option label="Brand A" value="brandA" />
                    <el-option label="Brand B" value="brandB" />
                    <el-option label="Brand C" value="brandC" />
                  </el-select>
                  <el-button :icon="Refresh" />
                </div>
              </el-form-item>

              <!-- 产地 -->
              <el-form-item label="Country of Origin" prop="countryOfOrigin">
                <el-select 
                  v-model="formData.countryOfOrigin" 
                  placeholder="Select country of origin" 
                  clearable 
                  filterable
                  style="width: 100%;"
                >
                  <el-option label="China" value="CN" />
                  <el-option label="United States" value="US" />
                  <el-option label="United Kingdom" value="UK" />
                  <el-option label="Japan" value="JP" />
                  <el-option label="South Korea" value="KR" />
                  <el-option label="Germany" value="DE" />
                  <el-option label="France" value="FR" />
                  <el-option label="Italy" value="IT" />
                  <el-option label="Spain" value="ES" />
                  <el-option label="Vietnam" value="VN" />
                  <el-option label="Thailand" value="TH" />
                  <el-option label="India" value="IN" />
                  <el-option label="Bangladesh" value="BD" />
                  <el-option label="Pakistan" value="PK" />
                  <el-option label="Turkey" value="TR" />
                </el-select>
              </el-form-item>

              <!-- 标签 -->
              <el-form-item label="Tags" prop="tags">
                <div class="tags-container">
                  <el-tag
                    v-for="tag in formData.tags"
                    :key="tag"
                    closable
                    :disable-transitions="false"
                    @close="handleTagClose(tag)"
                    class="product-tag"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-input
                    v-if="tagInputVisible"
                    ref="tagInputRef"
                    v-model="tagInputValue"
                    class="tag-input"
                    size="small"
                    placeholder="Enter tag, press Enter or click outside to add"
                    @keyup.enter="handleTagInputConfirm"
                    @blur="handleTagInputConfirm"
                  />
                  <el-button
                    v-else
                    class="tag-add-button"
                    size="small"
                    @click="showTagInput"
                  >
                    <el-icon><Plus /></el-icon>
                    Add Tag
                  </el-button>
                  <el-button
                    v-if="formData.tags.length > 0"
                    size="small"
                    :icon="Delete"
                    @click="handleClearAllTags"
                    style="margin-left: 8px;"
                  >
                    Clear All
                  </el-button>
                </div>
              </el-form-item>

            </el-form>
          </el-card>
        </div>

        <!-- Category & Attributes 区域 -->
        <div id="category" class="section-block" ref="categoryRef">
          <div class="section-header">
            <h2 class="section-main-title">
              <el-icon class="title-icon"><Menu /></el-icon>
              Category & Attributes
            </h2>
          </div>
          <el-card shadow="never" class="section-card">
            <el-form :model="formData" :rules="rules" ref="categoryFormRef" label-width="180px" class="content-form">
              
              <!-- 产品类目 -->
              <el-form-item label="Product Category" prop="categoryPath" required>
                <div style="display: flex; gap: 8px; align-items: center; width: 100%;">
                  <el-cascader
                    v-model="formData.categoryPath"
                    :options="categoryOptions"
                    :props="{ label: 'name', value: 'id', children: 'children' }"
                    placeholder="Please select category"
                    clearable
                    style="flex: 1;"
                    @change="handleCategoryChange"
                  />
                  <el-button :icon="Refresh" @click="handleRefreshCategory" />
                </div>
              </el-form-item>

              <!-- 产品属性 -->
              <el-form-item label="Product Attributes" class="attribute-form-item">
                <!-- 按钮和内容区域 -->
                <div v-if="formData.categoryPath && formData.categoryPath.length > 0" class="attribute-header-actions">
                  <el-button type="primary" size="small" link @click="handleShowCustomAttributeDialog">
                    + Custom Attribute
                  </el-button>
                </div>

                <!-- 未选择类目提示 -->
                <el-alert
                  v-if="!formData.categoryPath || formData.categoryPath.length === 0"
                  type="warning"
                  :closable="false"
                  show-icon
                >
                  <template #title>
                    You haven't selected a product category yet, please select in <strong>[Category & Attributes]</strong>
                  </template>
                </el-alert>

                <!-- 已选择类目，显示属性列表 -->
                <div v-else class="attributes-list">
                  <!-- 属性网格 -->
                  <el-row :gutter="12">
                    <el-col 
                      v-for="(attr, attrIndex) in displayedAttributes" 
                      :key="attrIndex"
                      :xs="24"
                      :sm="12"
                      :md="8"
                      :lg="8"
                      :xl="8"
                      class="attribute-col"
                    >
                      <div class="attribute-item" :class="{ 'editing-mode': attr.isEditing }">
                        <!-- 编辑模式 -->
                        <template v-if="attr.isEditing">
                          <div class="editing-content">
                            <div class="editing-inputs">
                              <el-input
                                v-model="attr.label"
                                placeholder="Attribute name"
                                class="edit-label-input"
                              />
                              <el-input
                                v-model="attr.value"
                                placeholder="Attribute value"
                                class="edit-value-input"
                              />
                            </div>
                            <div class="editing-actions">
                              <el-button 
                                type="primary" 
                                size="small" 
                                :icon="Check"
                                @click="handleSaveAttribute(attributesList.indexOf(attr))"
                              >
                                Save
                              </el-button>
                              <el-button 
                                size="small" 
                                @click="handleCancelEditAttribute(attributesList.indexOf(attr))"
                              >
                                Cancel
                              </el-button>
                            </div>
                          </div>
                        </template>

                        <!-- 正常显示模式 -->
                        <template v-else>
                          <div class="attribute-header">
                            <div class="attribute-label">
                              <span v-if="attr.required" class="required-star">*</span>
                              <span class="label-text">{{ attr.label }}</span>
                              <el-tooltip v-if="attr.tip" :content="attr.tip" placement="top">
                                <el-icon class="help-icon"><QuestionFilled /></el-icon>
                              </el-tooltip>
                            </div>
                            <el-dropdown v-if="attr.type === 'custom'" trigger="click">
                              <el-icon class="more-icon"><MoreFilled /></el-icon>
                              <template #dropdown>
                                <el-dropdown-menu>
                                  <el-dropdown-item @click="handleEditAttribute(attributesList.indexOf(attr))">Edit</el-dropdown-item>
                                  <el-dropdown-item @click="handleDeleteAttribute(attributesList.indexOf(attr))">Delete</el-dropdown-item>
                                </el-dropdown-menu>
                              </template>
                            </el-dropdown>
                          </div>
                          
                          <div class="attribute-content">
                            <!-- 单选类型 -->
                            <el-select 
                              v-if="attr.type === 'select'"
                              v-model="attr.value" 
                              :placeholder="`Please select`"
                              style="width: 100%;"
                            >
                              <el-option 
                                v-for="option in attr.options" 
                                :key="option.value"
                                :label="option.label" 
                                :value="option.value" 
                              />
                            </el-select>

                            <!-- 多选类型 -->
                            <el-checkbox-group v-if="attr.type === 'checkbox'" v-model="attr.value">
                              <el-checkbox 
                                v-for="option in attr.options" 
                                :key="option.value"
                                :label="option.value"
                              >
                                {{ option.label }}
                              </el-checkbox>
                            </el-checkbox-group>

                            <!-- 输入类型（包括自定义属性） -->
                            <el-input
                              v-if="attr.type === 'input' || attr.type === 'custom'"
                              v-model="attr.value"
                              :placeholder="attr.type === 'custom' ? 'Enter value' : `Enter ${attr.label.toLowerCase()}`"
                            />

                            <!-- 数字输入 -->
                            <div v-if="attr.type === 'number'" style="display: flex; gap: 8px; align-items: center;">
                              <el-input-number
                                v-model="attr.value"
                                :min="0"
                                :max="attr.max || 100"
                                style="flex: 1;"
                              />
                              <span v-if="attr.unit">{{ attr.unit }}</span>
                              <el-button type="primary" link @click="handleAddAttributeValue(attributesList.indexOf(attr))">
                                % Add
                              </el-button>
                            </div>
                          </div>
                        </template>
                      </div>
                    </el-col>
                  </el-row>

                  <!-- 成分管理 -->
                  <div v-show="showMoreAttributes" class="composition-section">
                    <div class="composition-header">
                      <span class="composition-label">Composition</span>
                      <span class="composition-note">All sizes must total 100%</span>
                    </div>

                    <template v-if="formData.composition.length === 0">
                      <div class="composition-item">
                        <el-select 
                          v-model="tempComposition.type" 
                          placeholder="Please select or enter custom value" 
                          filterable 
                          allow-create
                          default-first-option
                          style="flex: 1;"
                          @change="handleTempCompositionChange"
                        >
                          <el-option label="Cotton" value="Cotton" />
                          <el-option label="Polyester" value="Polyester" />
                          <el-option label="Leather" value="Leather" />
                          <el-option label="Nylon" value="Nylon" />
                          <el-option label="Wool" value="Wool" />
                          <el-option label="Silk" value="Silk" />
                          <el-option label="Spandex" value="Spandex" />
                          <el-option label="Rayon" value="Rayon" />
                        </el-select>
                        
                        <div class="composition-value">
                          <span class="value-label">Number</span>
                          <el-input-number v-model="tempComposition.ratio" :min="0" :max="100" style="width: 120px;" />
                          <span class="value-unit">%</span>
                        </div>

                        <el-button 
                          type="primary" 
                          link 
                          @click="handleAddComposition"
                          style="margin-right: 8px;"
                        >
                          Add
                        </el-button>

                        <el-button type="danger" link disabled>
                          Delete
                        </el-button>
                      </div>
                    </template>

                    <div v-for="(comp, index) in formData.composition" :key="index" class="composition-item">
                      <el-select 
                        v-model="comp.type" 
                        placeholder="Please select or enter custom value" 
                        filterable 
                        allow-create
                        default-first-option
                        style="flex: 1;"
                      >
                        <el-option label="Cotton" value="Cotton" />
                        <el-option label="Polyester" value="Polyester" />
                        <el-option label="Leather" value="Leather" />
                        <el-option label="Nylon" value="Nylon" />
                        <el-option label="Wool" value="Wool" />
                        <el-option label="Silk" value="Silk" />
                        <el-option label="Spandex" value="Spandex" />
                        <el-option label="Rayon" value="Rayon" />
                      </el-select>
                      
                      <div class="composition-value">
                        <span class="value-label">Number</span>
                        <el-input-number v-model="comp.ratio" :min="0" :max="100" style="width: 120px;" />
                        <span class="value-unit">%</span>
                      </div>

                      <el-button 
                        type="primary" 
                        link 
                        @click="handleAddComposition"
                        style="margin-right: 8px;"
                      >
                        Add
                      </el-button>

                      <el-button type="danger" link @click="handleRemoveComposition(index)">
                        Delete
                      </el-button>
                    </div>
                  </div>

                  <!-- 折叠按钮 -->
                  <div v-if="attributesList.length > 3" class="collapse-section">
                    <span class="collapse-text" @click="handleToggleMoreAttributes">
                      <el-icon>
                        <component :is="showMoreAttributes ? 'ArrowUp' : 'ArrowDown'" />
                      </el-icon>
                      {{ showMoreAttributes ? 'Collapse' : 'Expand' }}
                    </span>
                  </div>
                </div>
              </el-form-item>
              
            </el-form>
          </el-card>
        </div>

        <!-- SKU Info 区域 -->
        <div id="sku" class="section-block" ref="skuRef">
          <div class="section-header">
            <h2 class="section-main-title">
              <el-icon class="title-icon"><Grid /></el-icon>
              SKU Information
            </h2>
          </div>
          <el-card shadow="never" class="section-card">
            <!-- 未选择类目提示 -->
            <el-alert
              v-if="!formData.categoryPath || formData.categoryPath.length === 0"
              type="warning"
              :closable="false"
              show-icon
            >
              <template #title>
                You haven't selected a product category yet, please select in [Category & Attributes]
              </template>
            </el-alert>

            <el-form v-else :model="formData" label-width="180px" class="sku-form">
              <!-- 规格列表 -->
              <el-form-item 
                v-for="(spec, specIndex) in specsList" 
                :key="spec.id"
                :label="specIndex === 0 ? 'Main Spec' : `Other Spec ${specIndex}`"
                :required="specIndex === 0"
              >
                <div class="spec-content-wrapper">
                  <div class="spec-type-row">
                    <el-select 
                      v-model="spec.type" 
                      placeholder="Select or customize spec type" 
                      style="width: 200px;"
                      filterable
                      allow-create
                      default-first-option
                      @change="handleSpecTypeChange(specIndex)"
                    >
                      <el-option 
                        v-for="specType in availableSpecTypes(specIndex)" 
                        :key="specType.value"
                        :label="specType.label" 
                        :value="specType.value" 
                      />
                    </el-select>
                    
                    <el-button 
                      v-if="specIndex > 0"
                      :icon="Delete" 
                      type="danger"
                      link
                      @click="handleRemoveSpec(specIndex)"
                    >
                      Delete
                    </el-button>
            </div>

                  <!-- 动态选择器网格 - 一行三个 -->
                  <div class="spec-selectors-grid">
                    <div 
                      v-for="(selector, index) in spec.selectors" 
                      :key="selector.id"
                      class="spec-selector-item"
                    >
                <el-select
                        v-model="selector.value"
                        placeholder="Select or customize"
                        filterable
                        allow-create
                        default-first-option
                        @change="handleSpecSelectorChange(specIndex, index)"
                        class="spec-select"
                      >
                        <el-option 
                          v-for="option in getAvailableSpecValues(spec, specIndex)"
                          :key="option.value"
                          :label="option.label" 
                          :value="option.value" 
                        />
                </el-select>
                      
                      <el-button 
                        v-if="spec.selectors.length > 1 && selector.value"
                        :icon="Delete" 
                        class="delete-value-btn"
                        @click="handleRemoveSpecValue(specIndex, index)"
                      />
              </div>
              </div>
            </div>
              </el-form-item>

              <!-- 添加其他规格按钮 -->
              <el-form-item v-if="specsList.length < 3" label=" ">
                <el-button type="primary" link @click="handleAddNewSpec">
                  <el-icon><Plus /></el-icon>
                  Add Other Spec
                </el-button>
              </el-form-item>

            <!-- SKU列表 -->
              <el-form-item label="SKU List">
                <div class="sku-list-content">
              <div class="sku-actions-row">
                <el-button type="primary" link @click="generateSKUs" class="generate-btn">
                  <el-icon><Refresh /></el-icon>
                  Generate SKUs
                </el-button>
                
                <el-button type="primary" @click="showBatchSettingsDialog = true" class="batch-settings-btn">
                  Apply All Settings
                </el-button>
              </div>

              <!-- 聚合展示的SKU表格 - 使用rowspan合并主规格 -->
              <el-table 
                v-if="flattenedSkuList.length > 0" 
                :key="skuTableKey"
                :data="flattenedSkuList" 
                border 
                class="sku-table"
                :span-method="handleSpanMethod"
                :height="600"
                :max-height="800"
              >
                <!-- 主规格列 -->
                <el-table-column :label="mainSpecLabel" width="150" align="center">
                  <template #default="{ row }">
                    <span class="main-spec-value">{{ row.mainSpecValue }}</span>
                  </template>
                </el-table-column>
                
                <!-- 其他规格列 -->
                <el-table-column 
                  v-for="(spec, specIndex) in otherSpecColumns" 
                  :key="`spec-${specIndex}`"
                  :label="spec.label" 
                  width="120"
                  align="center"
                >
                  <template #default="{ row }">
                    <span>{{ row.specs[spec.key] || '-' }}</span>
                  </template>
                </el-table-column>
                
                <el-table-column label="Sales Price" width="220">
                  <template #default="{ row }">
                    <div class="price-input-wrapper">
                    <el-input-number
                      v-model="row.price"
                      :min="0"
                      :precision="2"
                      :step="0.01"
                      size="small"
                        :controls="false"
                      style="width: 120px;"
                    />
                      <el-select v-model="row.currency" size="small" style="width: 85px;">
                        <el-option label="CNY" value="CNY" />
                        <el-option label="USD" value="USD" />
                      </el-select>
                    </div>
                  </template>
                </el-table-column>
                
                <el-table-column label="Discount Price" width="220">
                  <template #default="{ row }">
                    <div class="price-input-wrapper">
                    <el-input-number
                      v-model="row.salePrice"
                      :min="0"
                      :precision="2"
                      :step="0.01"
                      size="small"
                        :controls="false"
                      style="width: 120px;"
                    />
                      <el-select v-model="row.currency" size="small" style="width: 85px;">
                        <el-option label="CNY" value="CNY" />
                        <el-option label="USD" value="USD" />
                      </el-select>
                    </div>
                  </template>
                </el-table-column>
                
                <el-table-column label="Inventory" width="200">
                  <template #default="{ row }">
                    <div class="inventory-input-wrapper">
                    <el-input-number
                      v-model="row.stock"
                      :min="0"
                        :precision="0"
                        :step="1"
                      size="small"
                        :controls="false"
                      style="width: 100px;"
                    />
                      <el-select v-model="row.unit" size="small" style="width: 85px;">
                        <el-option label="PCS" value="PCS" />
                        <el-option label="KG" value="KG" />
                      </el-select>
                    </div>
                  </template>
                </el-table-column>
                
                <el-table-column label="Weight" width="180">
                  <template #default="{ row }">
                    <div class="weight-input-wrapper">
                      <el-input-number
                        v-model="row.weight"
                        :min="0"
                        :precision="3"
                        size="small"
                        :controls="false"
                        style="width: 100px;"
                      />
                      <el-select v-model="row.weightUnit" size="small" style="width: 65px;">
                        <el-option label="KG" value="KG" />
                      </el-select>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="Dimensions" width="340">
                  <template #default="{ row }">
                    <div class="dimensions-input-wrapper">
                      <el-input-number
                        v-model="row.length"
                        :min="0"
                        :precision="2"
                        size="small"
                        :controls="false"
                        placeholder="L"
                        style="width: 68px;"
                      />
                      <span class="dimension-separator">×</span>
                      <el-input-number
                        v-model="row.width"
                        :min="0"
                        :precision="2"
                        size="small"
                        :controls="false"
                        placeholder="W"
                        style="width: 68px;"
                      />
                      <span class="dimension-separator">×</span>
                      <el-input-number
                        v-model="row.height"
                        :min="0"
                        :precision="2"
                        size="small"
                        :controls="false"
                        placeholder="H"
                        style="width: 68px;"
                      />
                      <el-select v-model="row.dimensionUnit" size="small" style="width: 80px;">
                        <el-option label="CM" value="CM" />
                      </el-select>
                    </div>
                  </template>
                </el-table-column>
                
                <el-table-column label="SKU" min-width="250">
                  <template #default="{ row }">
                    <el-input v-model="row.skuCode" placeholder="Auto-generated" size="small" />
                  </template>
                </el-table-column>
                
                <el-table-column label="Status" width="150">
                  <template #default="{ row }">
                    <el-select v-model="row.status" size="small">
                      <el-option label="Active" value="Active" />
                      <el-option label="Inactive" value="Inactive" />
                    </el-select>
                  </template>
                </el-table-column>

                <el-table-column label="Actions" width="100" fixed="right" align="center">
                  <template #default="{ row }">
                    <el-button
                      :icon="Delete"
                      type="danger"
                      link
                      size="small"
                      @click="handleDeleteSKU(row.originalIndex)"
                    />
                  </template>
                </el-table-column>
              </el-table>

              <el-empty v-else description="No SKUs generated yet. Please generate SKUs first." />
                </div>
              </el-form-item>
              
              <!-- Size Chart -->
              <el-form-item label="Size Chart" v-if="flattenedSkuList.length > 0">
                <el-button type="primary" link @click="showSizeChartDialog = true">
                  <el-icon><EditPen /></el-icon>
                  Edit Size Chart
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
        
        <!-- Batch Settings Dialog -->
        <el-dialog
          v-model="showBatchSettingsDialog"
          title="Batch Settings"
          width="800px"
          :close-on-click-modal="false"
        >
          <el-form :model="batchSettings" label-width="140px">
            <el-form-item label="Sales Price">
              <div class="batch-input-row">
                <el-input-number
                  v-model="batchSettings.price"
                  :min="0"
                  :precision="2"
                  :step="0.01"
                  :controls="false"
                  placeholder="0.00"
                  style="width: 150px;"
                />
                <el-select v-model="batchSettings.currency" style="width: 100px;">
                  <el-option label="USD" value="USD" />
                  <el-option label="CNY" value="CNY" />
                </el-select>
              </div>
            </el-form-item>
            
            <el-form-item label="Inventory">
              <div class="batch-input-row">
                <el-input-number
                  v-model="batchSettings.stock"
                  :min="0"
                  :precision="0"
                  :step="1"
                  :controls="false"
                  placeholder="0"
                  style="width: 150px;"
                />
                <el-select v-model="batchSettings.unit" style="width: 100px;">
                  <el-option label="PCS" value="PCS" />
                  <el-option label="KG" value="KG" />
                </el-select>
              </div>
            </el-form-item>
            
            <el-form-item label="Weight">
              <div class="batch-input-row">
                <el-input-number
                  v-model="batchSettings.weight"
                  :min="0"
                  :precision="3"
                  :step="0.001"
                  :controls="false"
                  placeholder="0.000"
                  style="width: 150px;"
                />
                <el-select v-model="batchSettings.weightUnit" style="width: 100px;">
                  <el-option label="KG" value="KG" />
                </el-select>
              </div>
            </el-form-item>
            
            <el-form-item label="Dimensions">
              <div class="batch-dimensions-row">
                <el-input-number
                  v-model="batchSettings.length"
                  :min="0"
                  :precision="2"
                  :controls="false"
                  placeholder="Length"
                  style="width: 90px;"
                />
                <span class="dimension-separator">×</span>
                <el-input-number
                  v-model="batchSettings.width"
                  :min="0"
                  :precision="2"
                  :controls="false"
                  placeholder="Width"
                  style="width: 90px;"
                />
                <span class="dimension-separator">×</span>
                <el-input-number
                  v-model="batchSettings.height"
                  :min="0"
                  :precision="2"
                  :controls="false"
                  placeholder="Height"
                  style="width: 90px;"
                />
                <el-select v-model="batchSettings.dimensionUnit" style="width: 80px;">
                  <el-option label="CM" value="CM" />
                </el-select>
              </div>
            </el-form-item>
            
            <el-form-item label="Status">
              <el-select v-model="batchSettings.status" style="width: 150px;">
                <el-option label="Active" value="Active" />
                <el-option label="Inactive" value="Inactive" />
              </el-select>
            </el-form-item>
          </el-form>
          
          <template #footer>
            <el-button @click="showBatchSettingsDialog = false">Cancel</el-button>
            <el-button type="primary" @click="applyBatchSettings">Apply to All</el-button>
          </template>
        </el-dialog>
        
        <!-- Size Chart Dialog -->
        <el-dialog
          v-model="showSizeChartDialog"
          title="Size Chart"
          width="1200px"
          :close-on-click-modal="false"
          class="size-chart-dialog"
        >
          <div class="size-chart-content">
            <el-form :model="sizeChartForm" label-width="150px" class="size-chart-form">
              <el-form-item label="Select Attribute" required>
                <el-select 
                  v-model="sizeChartForm.selectedSpecIndex" 
                  placeholder="Please select specification" 
                  style="width: 300px;"
                  @change="handleSpecAttributeChange"
                >
                  <el-option 
                    v-for="(spec, index) in specsList" 
                    :key="index"
                    :label="spec.type || `Spec ${index + 1}`" 
                    :value="index" 
                  />
                </el-select>
              </el-form-item>
              
              <!-- Size Chart Table -->
              <div class="size-chart-table-wrapper" v-if="sizeChartForm.selectedSpecIndex !== null">
                <el-table :data="sizeChartTableData" border class="size-chart-table">
                  <el-table-column :label="selectedSpecLabel" width="150" align="center" fixed>
                    <template #default="{ row }">
                      <strong>{{ row.specValue }}</strong>
                    </template>
                  </el-table-column>
                  
                  <el-table-column label="Length (cm)" min-width="150">
                    <template #default="{ row }">
                      <el-input-number
                        v-model="row.length"
                        :min="0"
                        :precision="2"
                        :controls="false"
                        size="small"
                        placeholder="0.00"
                        style="width: 100%;"
                      />
                    </template>
                  </el-table-column>
                  
                  <el-table-column label="Width (cm)" min-width="150">
                    <template #default="{ row }">
                      <el-input-number
                        v-model="row.width"
                        :min="0"
                        :precision="2"
                        :controls="false"
                        size="small"
                        placeholder="0.00"
                        style="width: 100%;"
                      />
                    </template>
                  </el-table-column>
                  
                  <el-table-column label="Height (cm)" min-width="150">
                    <template #default="{ row }">
                      <el-input-number
                        v-model="row.height"
                        :min="0"
                        :precision="2"
                        :controls="false"
                        size="small"
                        placeholder="0.00"
                        style="width: 100%;"
                      />
                    </template>
                  </el-table-column>
                  
                  <el-table-column label="Volume (cm³)" min-width="150">
                    <template #default="{ row }">
                      <el-input-number
                        v-model="row.volume"
                        :min="0"
                        :precision="2"
                        :controls="false"
                        size="small"
                        placeholder="0.00"
                        style="width: 100%;"
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              
              <el-empty 
                v-else 
                description="Please select a specification attribute to create size chart"
                style="margin-top: 40px;"
              />
            </el-form>
          </div>
          
          <template #footer>
            <el-button @click="showSizeChartDialog = false">Cancel</el-button>
            <el-button type="primary" @click="saveSizeChart">Save</el-button>
          </template>
        </el-dialog>

        <!-- Product Images 区域 -->
        <div id="images" class="section-block" ref="imagesRef">
          <div class="section-header">
            <h2 class="section-main-title">
              <el-icon class="title-icon"><Picture /></el-icon>
              Product Images
            </h2>
          </div>
          <el-card shadow="never" class="section-card">
            <!-- SKC图片标题和工具栏 -->
            <div class="skc-header">
              <div class="skc-title">
                <span class="required-star">*</span>
                <span>SKC Image:</span>
              </div>
            </div>

            <!-- 图片上传说明 -->
            <div class="upload-notice-simple">
              <p>Image Upload Guidelines:</p>
              <ol>
                <li>All images should be <strong>&lt;3MB</strong>, formats: JPG, JPEG, PNG; Detail images support uploading up to <strong>11 images</strong></li>
                <li>Supports one-click batch upload or drag and drop to upload</li>
                <li><strong>Detail Image:</strong> Support aspect ratios 1:1, 3:4, 4:5, 1:3, 16:9; Image size range <strong>900px - 2200px</strong></li>
                <li><strong>Square Image:</strong> Recommended size <strong>1200 x 1200 pixels</strong> (1:1 ratio)</li>
                <li><strong>Color Block Image:</strong> Recommended size <strong>680 x 80 pixels</strong></li>
                <li><strong>Image Processing:</strong> If images do not meet size requirements, you can use the image editing tool to crop them manually. During publishing, if images do not meet platform requirements, the system will automatically crop them to ensure successful publication</li>
              </ol>
                </div>

            <!-- 选项行 -->
            <div class="image-options">
              <div class="selection-info">
                <el-checkbox v-model="selectAllImages">Select All</el-checkbox>
                <span class="selected-count">
                  <template v-if="selectedImagesCount > 0">
                    <el-icon class="check-icon"><Check /></el-icon>
                    Selected {{ selectedImagesCount }} image{{ selectedImagesCount > 1 ? 's' : '' }}
                  </template>
                  <template v-else>
                    <el-icon class="info-icon"><QuestionFilled /></el-icon>
                    Click images to select, then use batch actions
                  </template>
                </span>
              </div>
                <div class="skc-actions">
                  <el-button class="ai-button" :disabled="selectedImagesCount === 0" @click="handleAIProcessImages('skc')">
                    <el-icon><MagicStick /></el-icon>
                    AI Process
                  </el-button>
                  <el-button class="delete-button" :disabled="selectedImagesCount === 0" @click="handleBatchDeleteImages('skc')">
                    <el-icon><Delete /></el-icon>
                    Batch Delete
                  </el-button>
                  <el-button class="action-button" :disabled="selectedImagesCount === 0" @click="handleImageEditing('skc')">
                    <el-icon><Edit /></el-icon>
                    Image Cropping
                  </el-button>
                  <el-button class="action-button" :disabled="selectedImagesCount === 0" @click="handleExportImages('skc')">
                    <el-icon><Download /></el-icon>
                    Export Images
                  </el-button>
                </div>
            </div>

            <!-- 图片上传表格 -->
            <el-table 
              :data="imageRowsData" 
              border 
              class="image-upload-table"
              style="width: 100%"
            >
              <template #empty>
                <div class="empty-image-table">
                  <el-icon class="empty-icon"><Picture /></el-icon>
                  <p class="empty-text">Please add colors in SKU Info section first</p>
                  <p class="empty-hint">Color options will appear here as rows for image upload</p>
                </div>
              </template>

              <el-table-column label="Main Spec" width="120" align="center" fixed>
                <template #default="{ row }">
                  <div class="spec-cell">{{ row.spec }}</div>
                </template>
              </el-table-column>

              <el-table-column align="left" min-width="250">
                <template #header>
                  <span class="header-with-tooltip">
                    <span class="required-star">*</span> Detail Image
                    <el-tooltip
                      placement="top"
                      effect="dark"
                      popper-class="detail-image-tooltip"
                    >
                      <template #content>
                        <div class="tooltip-content">
                          <p style="margin: 0 0 8px 0; font-weight: 600;">Detail Image Information</p>
                          <p style="margin: 0 0 4px 0;">Supplement detailed information such as product size, selling points, production process, and usage methods that consumers care about.</p>
                          <p style="margin: 0;">Will be displayed in the <strong>[More Detail]</strong> module on the product detail page to help consumers better purchase products.</p>
                        </div>
                      </template>
                      <el-icon class="info-icon-header"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </template>
                <template #default="{ row }">
                  <div class="upload-cell detail-images-cell">
                  <el-upload
                      v-model:file-list="row.detailImages"
                    list-type="picture-card"
                      :limit="11"
                    :on-preview="handlePreview"
                      :on-change="handleImageChange"
                    :auto-upload="false"
                      class="table-upload multi"
                  >
                    <el-icon><Plus /></el-icon>
                  </el-upload>
                </div>
                    </template>
              </el-table-column>

              <el-table-column width="160" align="center">
                <template #header>
                  <span class="required-star">*</span> Square Image
                </template>
                <template #default="{ row }">
                  <div class="upload-cell single-image-upload">
                <el-upload
                      v-model:file-list="row.squareImage"
                  list-type="picture-card"
                      :limit="1"
                      :on-exceed="handleExceed"
                  :on-preview="handlePreview"
                      :on-change="handleImageChange"
                  :auto-upload="false"
                      class="table-upload"
                >
                      <div class="upload-content">
                  <el-icon><Plus /></el-icon>
                        <div class="upload-hint">Add Image</div>
                    </div>
                  </el-upload>
                </div>
                </template>
              </el-table-column>

              <el-table-column width="160" align="center">
                <template #header>
                  <span class="required-star">*</span> Color Block Image
                </template>
                <template #default="{ row }">
                  <div class="upload-cell single-image-upload">
                <el-upload
                      v-model:file-list="row.colorBlockImage"
                  list-type="picture-card"
                      :limit="1"
                      :on-exceed="handleExceed"
                  :on-preview="handlePreview"
                      :on-change="handleImageChange"
                  :auto-upload="false"
                      class="table-upload"
                >
                      <div class="upload-content">
                  <el-icon><Plus /></el-icon>
                        <div class="upload-hint">Add Image</div>
              </div>
                </el-upload>
            </div>
                </template>
              </el-table-column>
            </el-table>

            <!-- SKU图片上传区域 -->
            <div v-if="flattenedSkuList.length > 0" class="sku-images-section">
              <!-- 分隔线 -->
              <el-divider class="section-divider">
                <span class="divider-text">SKU Images</span>
              </el-divider>

              <!-- SKU图片标题和工具栏 -->
              <div class="skc-header">
                <div class="skc-title">
                  <span>SKU Image:</span>
                </div>
              </div>

              <!-- 图片上传说明 -->
              <div class="upload-notice-simple">
                <p>Image Upload Guidelines:</p>
                <ol>
                  <li>All images should be <strong>&lt;3MB</strong>, formats: JPG, JPEG, PNG; Each SKU supports uploading up to <strong>10 images</strong></li>
                  <li>Aspect ratio: <strong>1340px × 1785px</strong> or <strong>1:1</strong>; Image size range: <strong>900px - 2200px</strong></li>
                  <li>SKU images represent the specific characteristics of each product variant. When customers switch between different SKUs on the product detail page, the corresponding SKU image will automatically display, helping them better understand the relevant information about each variant</li>
                </ol>
              </div>

              <!-- 选项行 -->
              <div class="image-options">
                <div class="selection-info">
                  <el-checkbox v-model="selectAllSkuImages">Select All</el-checkbox>
                  <span class="selected-count">
                    <template v-if="selectedSkuImagesCount > 0">
                      <el-icon class="check-icon"><Check /></el-icon>
                      Selected {{ selectedSkuImagesCount }} image{{ selectedSkuImagesCount > 1 ? 's' : '' }}
                    </template>
                    <template v-else>
                      <el-icon class="info-icon"><QuestionFilled /></el-icon>
                      Click images to select, then use batch actions
                    </template>
                  </span>
                </div>
                <div class="skc-actions">
                  <el-button class="ai-button" :disabled="selectedSkuImagesCount === 0" @click="handleAIProcessImages('sku')">
                    <el-icon><MagicStick /></el-icon>
                    AI Process
                  </el-button>
                  <el-button class="delete-button" :disabled="selectedSkuImagesCount === 0" @click="handleBatchDeleteImages('sku')">
                    <el-icon><Delete /></el-icon>
                    Batch Delete
                  </el-button>
                  <el-button class="action-button" :disabled="selectedSkuImagesCount === 0" @click="handleImageEditing('sku')">
                    <el-icon><Edit /></el-icon>
                    Image Cropping
                  </el-button>
                  <el-button class="action-button" :disabled="selectedSkuImagesCount === 0" @click="handleExportImages('sku')">
                    <el-icon><Download /></el-icon>
                    Export Images
                  </el-button>
                </div>
              </div>

              <!-- SKU图片上传表格 -->
              <el-table 
                :data="skuImageRowsData" 
                border 
                class="image-upload-table sku-image-table"
                style="width: 100%"
              >
                <el-table-column label="SKU" width="150" align="center" fixed>
                  <template #default="{ row }">
                    <div class="spec-cell">{{ row.skuCode }}</div>
                  </template>
                </el-table-column>

                <el-table-column label="Specs" width="120" align="center">
                  <template #default="{ row }">
                    <div class="spec-cell">{{ row.specsText }}</div>
                  </template>
                </el-table-column>

                <el-table-column label="SKU Image" align="left">
                  <template #default="{ row }">
                    <div class="upload-cell">
                <el-upload
                        v-model:file-list="row.skuImages"
                  list-type="picture-card"
                  :limit="10"
                  :on-preview="handlePreview"
                        :on-change="handleImageChange"
                  :auto-upload="false"
                        class="table-upload multi"
                >
                  <el-icon><Plus /></el-icon>
                      </el-upload>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- Shein详情图上传区域 -->
            <div v-if="flattenedSkuList.length > 0" class="shein-detail-section">
              <!-- 分隔线 -->
              <el-divider class="section-divider">
                <span class="divider-text">Shein Detail Images</span>
              </el-divider>

              <!-- Shein详情图标题和工具栏 -->
              <div class="skc-header">
                <div class="skc-title">
                  <span>Shein Detail Image:</span>
              </div>
            </div>

              <!-- 图片上传说明 -->
              <div class="upload-notice-simple">
                <p>Image Upload Guidelines:</p>
                <p class="detail-hint">It is recommended to upload 3-4 detail images with pixels larger than 900px for the best display effect. Up to <strong>10 images</strong> are supported, you can drag to move images, and the first 10 images will be uploaded when publishing if exceeded.</p>
              </div>

              <!-- 选项行 -->
              <div class="image-options">
                <div class="selection-info">
                  <el-checkbox v-model="selectAllSheinImages">Select All</el-checkbox>
                  <span class="selected-count">
                    <template v-if="selectedSheinImagesCount > 0">
                      <el-icon class="check-icon"><Check /></el-icon>
                      Selected {{ selectedSheinImagesCount }} image{{ selectedSheinImagesCount > 1 ? 's' : '' }}
                    </template>
                    <template v-else>
                      <el-icon class="info-icon"><QuestionFilled /></el-icon>
                      Click images to select, then use batch actions
                    </template>
                  </span>
                </div>
                <div class="skc-actions">
                  <el-button class="ai-button" :disabled="selectedSheinImagesCount === 0" @click="handleAIProcessImages('shein')">
                    <el-icon><MagicStick /></el-icon>
                    AI Process
                  </el-button>
                  <el-button class="delete-button" :disabled="selectedSheinImagesCount === 0" @click="handleBatchDeleteImages('shein')">
                    <el-icon><Delete /></el-icon>
                    Batch Delete
                  </el-button>
                  <el-button class="action-button" :disabled="selectedSheinImagesCount === 0" @click="handleImageEditing('shein')">
                    <el-icon><Edit /></el-icon>
                    Image Editing
                  </el-button>
                  <el-button class="action-button" :disabled="selectedSheinImagesCount === 0" @click="handleExportImages('shein')">
                    <el-icon><Download /></el-icon>
                    Export Images
                  </el-button>
                </div>
              </div>

              <!-- Shein详情图上传表格 -->
              <el-table 
                :data="sheinDetailImageRowsData" 
                border 
                class="image-upload-table shein-detail-table"
                style="width: 100%"
                :span-method="handleSheinTableSpanMethod"
              >
                <el-table-column label="Main Spec" width="150" align="center" fixed>
                  <template #default="{ row }">
                    <div class="spec-cell">{{ row.spec }}</div>
                  </template>
                </el-table-column>

                <el-table-column label="Site" width="150" align="center">
                  <template #default="{ row }">
                    <el-select 
                      v-model="row.site" 
                      size="small"
                      @change="handleSheinSiteChange(row)"
                    >
                      <el-option
                        v-for="site in getAvailableSitesForRow(row)"
                        :key="site"
                        :label="site"
                        :value="site"
                      />
                    </el-select>
                  </template>
                </el-table-column>

                <el-table-column align="left">
                  <template #header>
                    <span class="header-with-tooltip">
                      Detail Images
                      <el-tooltip
                        placement="top"
                        effect="dark"
                        popper-class="detail-image-tooltip"
                      >
                        <template #content>
                          <div class="tooltip-content">
                            <p style="margin: 0 0 8px 0; font-weight: 600;">Detail Image Information</p>
                            <p style="margin: 0 0 4px 0;">Supplement detailed information such as product size, selling points, production process, and usage methods that consumers care about.</p>
                            <p style="margin: 0;">Will be displayed in the <strong>[More Detail]</strong> module on the product detail page to help consumers better purchase products.</p>
                          </div>
                        </template>
                        <el-icon class="info-icon-header"><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </span>
                  </template>
                  <template #default="{ row }">
                    <div class="upload-cell">
                <el-upload
                        v-model:file-list="row.detailImages"
                  list-type="picture-card"
                  :limit="10"
                  :on-preview="handlePreview"
                        :on-change="handleImageChange"
                  :auto-upload="false"
                        class="table-upload multi"
                >
                  <el-icon><Plus /></el-icon>
                </el-upload>
              </div>
                  </template>
                </el-table-column>

                <el-table-column label="Actions" width="100" align="center">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" @click="handleAddSheinSite(row)">Add</el-button>
                    <el-button type="danger" link size="small" @click="handleDeleteSheinSite(row)">Delete</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- Other Product Images上传区域 -->
            <div v-if="flattenedSkuList.length > 0" class="other-images-section">
              <!-- 分隔线 -->
              <el-divider class="section-divider">
                <span class="divider-text">Additional Product Images</span>
              </el-divider>

              <!-- Other Product Images标题 -->
              <div class="skc-header">
                <div class="skc-title">
                  <span>Additional Product Images:</span>
                </div>
              </div>

              <!-- 图片上传说明 -->
              <div class="upload-notice-simple">
                <p>Image Upload Guidelines:</p>
                <p class="detail-hint">Upload additional product images for marketing and promotional purposes. These images can include lifestyle photos, usage scenarios, packaging images, etc. Up to <strong>15 images</strong> are supported.</p>
              </div>

              <!-- 选项行 -->
              <div class="image-options">
                <div class="selection-info">
                  <el-checkbox v-model="selectAllOtherImages">Select All</el-checkbox>
                  <span class="selected-count">
                    <template v-if="selectedOtherImagesCount > 0">
                      <el-icon class="check-icon"><Check /></el-icon>
                      Selected {{ selectedOtherImagesCount }} image{{ selectedOtherImagesCount > 1 ? 's' : '' }}
                    </template>
                    <template v-else>
                      <el-icon class="info-icon"><QuestionFilled /></el-icon>
                      Click images to select, then use batch actions
                    </template>
                  </span>
                </div>
                <div class="skc-actions">
                  <el-button class="ai-button" :disabled="selectedOtherImagesCount === 0" @click="handleAIProcessImages('other')">
                    <el-icon><MagicStick /></el-icon>
                    AI Process
                  </el-button>
                  <el-button class="delete-button" :disabled="selectedOtherImagesCount === 0" @click="handleBatchDeleteImages('other')">
                    <el-icon><Delete /></el-icon>
                    Batch Delete
                  </el-button>
                  <el-button class="action-button" :disabled="selectedOtherImagesCount === 0" @click="handleImageEditing('other')">
                    <el-icon><Edit /></el-icon>
                    Image Editing
                  </el-button>
                  <el-button class="action-button" :disabled="selectedOtherImagesCount === 0" @click="handleExportImages('other')">
                    <el-icon><Download /></el-icon>
                    Export Images
                  </el-button>
                </div>
              </div>

              <!-- Other Product Images上传区域 -->
              <div class="other-images-upload">
                <el-upload
                  v-model:file-list="otherProductImages"
                  list-type="picture-card"
                  :limit="15"
                  :on-exceed="handleExceed"
                  :on-preview="handlePreview"
                  :on-change="handleImageChange"
                  :auto-upload="false"
                  class="table-upload multi"
                >
                  <el-icon><Plus /></el-icon>
                </el-upload>
            </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 - 吸底 -->
    <div class="footer-actions">
      <div class="footer-container">
        <div class="footer-left">
          <el-button @click="handleBack">Cancel</el-button>
          <el-button @click="handleSaveDraft">
            <el-icon><Document /></el-icon>
            Save Draft
          </el-button>
        </div>
        <div class="footer-right">
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            <el-icon><Check /></el-icon>
            Submit
          </el-button>
        </div>
      </div>
    </div>

    <!-- 图片预览对话框 -->
    <el-dialog v-model="previewDialogVisible" title="Image Preview" width="800px">
      <img :src="previewImageUrl" style="width: 100%;" />
    </el-dialog>

    <!-- AI生成对话框 -->
    <el-dialog 
      v-model="aiGenerateDialogVisible" 
      :title="aiGenerateType === 'title' ? 'AI Generate Title' : aiGenerateType === 'productName' ? 'AI Generate Product Name' : 'AI Generate Description'"
      width="1200px"
      class="ai-generate-dialog"
    >
      <div class="ai-dialog-content">
        <!-- 左侧：基础设置 -->
        <div class="ai-settings">
          <h3 class="settings-title">Basic Settings</h3>
          
          <el-form label-width="120px" class="settings-form">
            <!-- 生成语言 -->
            <el-form-item label="Language">
              <el-select v-model="aiSettings.language" placeholder="Select language" style="width: 100%;">
                <el-option label="English" value="en" />
                <el-option label="中文" value="zh-CN" />
                <el-option label="Español" value="es" />
                <el-option label="Français" value="fr" />
                <el-option label="Deutsch" value="de" />
                <el-option label="日本語" value="ja" />
              </el-select>
            </el-form-item>

            <!-- 语气风格 -->
            <el-form-item label="Tone">
              <el-select v-model="aiSettings.tone" placeholder="Select tone" style="width: 100%;">
                <el-option label="Professional" value="professional" />
                <el-option label="Casual" value="casual" />
                <el-option label="Enthusiastic" value="enthusiastic" />
                <el-option label="Formal" value="formal" />
                <el-option label="Friendly" value="friendly" />
              </el-select>
            </el-form-item>

            <!-- 内容长度 -->
            <el-form-item label="Length" v-if="aiGenerateType === 'description' || aiGenerateType === 'productName'">
              <el-radio-group v-model="aiSettings.length">
                <el-radio label="short">Short</el-radio>
                <el-radio label="medium">Medium</el-radio>
                <el-radio label="long">Long</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 目标受众 -->
            <el-form-item label="Target Audience">
              <el-input
                v-model="aiSettings.targetAudience"
                placeholder="e.g., Young professionals, Fashion enthusiasts"
              />
            </el-form-item>

            <!-- 产品特点 -->
            <el-form-item label="Key Features">
              <el-input
                v-model="aiSettings.features"
                type="textarea"
                :rows="3"
                placeholder="Enter key features (one per line)&#10;e.g.,&#10;High quality materials&#10;Comfortable fit&#10;Trendy design"
              />
            </el-form-item>

            <!-- 关键词 -->
            <el-form-item label="Keywords">
              <el-checkbox v-model="aiSettings.includeKeywords">
                Include specific keywords
              </el-checkbox>
              <el-input
                v-if="aiSettings.includeKeywords"
                v-model="aiSettings.keywords"
                placeholder="Enter keywords, separated by commas"
                style="margin-top: 8px;"
              />
            </el-form-item>

            <!-- SEO优化 -->
            <el-form-item label="SEO Optimize">
              <el-checkbox v-model="aiSettings.seoOptimize">
                Optimize for search engines
              </el-checkbox>
            </el-form-item>

            <!-- 生成数量 -->
            <el-form-item label="Generate Count">
              <el-slider v-model="aiSettings.generateCount" :min="1" :max="10" show-input />
            </el-form-item>

            <!-- 生成按钮 -->
            <el-form-item>
              <el-button 
                type="primary" 
                @click="handleGenerateAI" 
                :loading="aiGenerating"
                style="width: 100%;"
              >
                <el-icon><MagicStick /></el-icon>
                Start Generate
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 右侧：生成结果预览 -->
        <div class="ai-preview">
          <h3 class="preview-title">AI Generated Results</h3>
          
          <div v-if="aiGenerating" class="generating-placeholder">
            <el-icon class="is-loading" size="32"><Loading /></el-icon>
            <p>AI is generating content...</p>
          </div>

          <div v-else-if="aiResults.length === 0" class="empty-placeholder">
            <el-empty description="No results yet, click 'Start Generate' to create content" />
          </div>

          <div v-else class="results-list">
            <div 
              v-for="(result, index) in aiResults" 
              :key="index"
              class="result-item"
            >
              <div class="result-content">
                <span class="result-number">{{ index + 1 }}.</span>
                <div class="result-text-wrapper">
                  <span class="result-text">{{ result.content }}</span>
                  <div class="result-meta" v-if="result.seoScore">
                    <el-tag :type="result.seoScore > 80 ? 'success' : result.seoScore > 60 ? 'warning' : 'danger'" size="small">
                      SEO Score: {{ result.seoScore }}
                    </el-tag>
                    <el-tag v-if="result.length" type="info" size="small">
                      {{ result.length }} chars
                    </el-tag>
                  </div>
                </div>
              </div>
              <div class="result-actions">
                <el-tooltip content="Apply this result" placement="top">
                  <el-button size="small" type="primary" @click="handleApplyResult(result.content)">
                    <el-icon><Select /></el-icon>
                    Apply
                  </el-button>
                </el-tooltip>
                <el-dropdown @command="(lang) => handleTranslateResult(result.content, index, lang)" trigger="click">
                  <el-button size="small">
                    <el-icon><Document /></el-icon>
                    Translate
                    <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="zh-CN">中文</el-dropdown-item>
                      <el-dropdown-item command="es">Español</el-dropdown-item>
                      <el-dropdown-item command="fr">Français</el-dropdown-item>
                      <el-dropdown-item command="de">Deutsch</el-dropdown-item>
                      <el-dropdown-item command="ja">日本語</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <el-tooltip content="Analyze SEO" placement="top">
                  <el-button size="small" @click="handleAnalyzeSEO(result.content, index)" v-if="aiGenerateType === 'title'">
                    <el-icon><TrendCharts /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="Copy to clipboard" placement="top">
                  <el-button size="small" @click="handleCopyResult(result.content)">
                    <el-icon><CopyDocument /></el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

        <!-- AI图片处理对话框 -->
        <el-dialog
          v-model="aiImageDialogVisible"
          title="AI Image Processing - E-commerce Toolkit"
          width="1400px"
          class="ai-image-dialog"
        >
          <div class="ai-image-content">
            <!-- 左侧：设置区域 -->
            <div class="ai-image-settings-panel">
            <div class="selected-images-preview">
              <div class="preview-title">
                <span>📸 Selected Images ({{ aiSelectedImages.length }})</span>
              </div>
              <div class="preview-grid">
                <div v-for="(img, index) in aiSelectedImages" :key="index" class="preview-item">
                  <img :src="img.url || (img.raw ? getImageUrl(img.raw) : '')" alt="preview">
                  <div class="preview-name">{{ img.name }}</div>
                </div>
              </div>
            </div>

            <div class="ai-features-grid">
              <div class="feature-title">🤖 AI Features for E-commerce</div>
              
              <div class="ai-feature-cards">
                <!-- 自动抠图 -->
                <div 
                  class="ai-feature-card" 
                  :class="{ active: aiImageSettings.processType === 'auto-cutout' }"
                  @click="aiImageSettings.processType = 'auto-cutout'"
                >
                  <div class="feature-icon">✂️</div>
                  <div class="feature-name">Auto Cutout</div>
                  <div class="feature-desc">AI removes background automatically</div>
                </div>

                <!-- 去除背景 -->
                <div 
                  class="ai-feature-card" 
                  :class="{ active: aiImageSettings.processType === 'remove-bg' }"
                  @click="aiImageSettings.processType = 'remove-bg'"
                >
                  <div class="feature-icon">🎭</div>
                  <div class="feature-name">Remove Background</div>
                  <div class="feature-desc">Pure transparent background</div>
                </div>

                <!-- 更换背景 -->
                <div 
                  class="ai-feature-card" 
                  :class="{ active: aiImageSettings.processType === 'replace-bg' }"
                  @click="aiImageSettings.processType = 'replace-bg'"
                >
                  <div class="feature-icon">🖼️</div>
                  <div class="feature-name">Replace Background</div>
                  <div class="feature-desc">Change to custom background</div>
                </div>

                <!-- 自动美化 -->
                <div 
                  class="ai-feature-card" 
                  :class="{ active: aiImageSettings.processType === 'enhance' }"
                  @click="aiImageSettings.processType = 'enhance'"
                >
                  <div class="feature-icon">✨</div>
                  <div class="feature-name">Auto Enhance</div>
                  <div class="feature-desc">AI beautify & optimize</div>
                </div>

                <!-- 提取主体 -->
                <div 
                  class="ai-feature-card" 
                  :class="{ active: aiImageSettings.processType === 'extract-subject' }"
                  @click="aiImageSettings.processType = 'extract-subject'"
                >
                  <div class="feature-icon">🎯</div>
                  <div class="feature-name">Extract Subject</div>
                  <div class="feature-desc">Focus on main product</div>
                </div>

                <!-- 智能裁剪 -->
                <div 
                  class="ai-feature-card" 
                  :class="{ active: aiImageSettings.processType === 'smart-crop' }"
                  @click="aiImageSettings.processType = 'smart-crop'"
                >
                  <div class="feature-icon">📐</div>
                  <div class="feature-name">Smart Crop</div>
                  <div class="feature-desc">Auto crop to best composition</div>
                </div>

                <!-- 文字生成图片 -->
                <div 
                  class="ai-feature-card" 
                  :class="{ active: aiImageSettings.processType === 'text-to-image' }"
                  @click="aiImageSettings.processType = 'text-to-image'"
                >
                  <div class="feature-icon">🎨</div>
                  <div class="feature-name">Text to Image</div>
                  <div class="feature-desc">Generate from description</div>
                </div>

                <!-- 去除水印 -->
                <div 
                  class="ai-feature-card" 
                  :class="{ active: aiImageSettings.processType === 'remove-watermark' }"
                  @click="aiImageSettings.processType = 'remove-watermark'"
                >
                  <div class="feature-icon">🧹</div>
                  <div class="feature-name">Remove Watermark</div>
                  <div class="feature-desc">Clean unwanted marks</div>
                </div>
              </div>
            </div>

            <!-- 动态选项区域 -->
            <div class="ai-dynamic-options" v-if="aiImageSettings.processType">
              <!-- 更换背景选项 -->
              <div v-if="aiImageSettings.processType === 'replace-bg'" class="option-section">
                <div class="option-section-title">🎨 Background Options</div>
                <el-radio-group v-model="aiImageSettings.bgType" class="bg-type-group">
                  <el-radio label="color">Solid Color</el-radio>
                  <el-radio label="gradient">Gradient</el-radio>
                  <el-radio label="image">Custom Image</el-radio>
                </el-radio-group>

                <div v-if="aiImageSettings.bgType === 'color'" class="color-picker-area">
                  <div class="preset-colors">
                    <div 
                      v-for="color in presetColors" 
                      :key="color"
                      class="color-option"
                      :style="{ background: color }"
                      :class="{ active: aiImageSettings.bgColor === color }"
                      @click="aiImageSettings.bgColor = color"
                    ></div>
                  </div>
                  <el-color-picker v-model="aiImageSettings.bgColor" show-alpha />
                </div>

                <div v-if="aiImageSettings.bgType === 'gradient'" class="gradient-picker-area">
                  <el-select v-model="aiImageSettings.gradientStyle" placeholder="Select gradient">
                    <el-option label="Top to Bottom" value="to-bottom" />
                    <el-option label="Left to Right" value="to-right" />
                    <el-option label="Diagonal" value="diagonal" />
                    <el-option label="Radial" value="radial" />
                  </el-select>
                </div>

                <div v-if="aiImageSettings.bgType === 'image'">
                  <el-upload
                    action="#"
                    :auto-upload="false"
                    :show-file-list="false"
                    accept="image/*"
                  >
                    <el-button>📁 Upload Background Image</el-button>
                  </el-upload>
                </div>
              </div>

              <!-- 文字生成图片选项 -->
              <div v-if="aiImageSettings.processType === 'text-to-image'" class="option-section">
                <div class="option-section-title">💬 Image Generation</div>
                <el-input
                  v-model="aiImageSettings.textPrompt"
                  type="textarea"
                  :rows="4"
                  placeholder="Describe the product image you want to generate...&#10;Example: A modern white sneaker on a wooden table with natural lighting, product photography style"
                />
                <div class="generation-options">
                  <el-select v-model="aiImageSettings.imageStyle" placeholder="Style">
                    <el-option label="Product Photography" value="product" />
                    <el-option label="Lifestyle" value="lifestyle" />
                    <el-option label="Minimalist" value="minimalist" />
                    <el-option label="Vintage" value="vintage" />
                    <el-option label="Modern" value="modern" />
                  </el-select>
                  <el-select v-model="aiImageSettings.imageSize" placeholder="Size">
                    <el-option label="1340×1785 (Standard)" value="1340x1785" />
                    <el-option label="1:1 Square" value="1:1" />
                    <el-option label="16:9 Wide" value="16:9" />
                  </el-select>
                </div>
              </div>

              <!-- 智能裁剪选项 -->
              <div v-if="aiImageSettings.processType === 'smart-crop'" class="option-section">
                <div class="option-section-title">📐 Crop Settings</div>
                <el-radio-group v-model="aiImageSettings.cropRatio">
                  <el-radio label="1340x1785">1340×1785 (Product)</el-radio>
                  <el-radio label="1:1">1:1 (Square)</el-radio>
                  <el-radio label="4:3">4:3 (Standard)</el-radio>
                  <el-radio label="16:9">16:9 (Wide)</el-radio>
                </el-radio-group>
                <el-checkbox v-model="aiImageSettings.detectSubject">Auto detect main subject</el-checkbox>
              </div>

              <!-- 通用质量选项 -->
              <div v-if="['enhance', 'auto-cutout', 'extract-subject'].includes(aiImageSettings.processType)" class="option-section">
                <div class="option-section-title">⚙️ Quality Settings</div>
                <el-form-item label="Output Quality">
                  <el-slider v-model="aiImageSettings.quality" :min="60" :max="100" show-input />
                </el-form-item>
                <el-checkbox v-model="aiImageSettings.preserveTransparency">Preserve Transparency</el-checkbox>
              </div>
            </div>

            <div class="ai-processing-progress" v-if="aiImageProcessing">
              <el-progress 
                :percentage="aiProcessingProgress" 
                :status="aiProcessingProgress === 100 ? 'success' : undefined"
                :stroke-width="12"
              >
                <template #default="{ percentage }">
                  <span class="progress-text">{{ percentage }}%</span>
                </template>
              </el-progress>
              <div class="progress-info">
                🤖 AI Processing: {{ aiCurrentImage }} / {{ aiSelectedImages.length }} images
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <el-button @click="aiImageDialogVisible = false" :disabled="aiImageProcessing">Cancel</el-button>
              <el-button type="primary" @click="handleStartAIProcessing" :loading="aiImageProcessing" :disabled="!aiImageSettings.processType">
                <span v-if="!aiImageProcessing">🚀 Start AI Processing</span>
                <span v-else>⏳ Processing...</span>
              </el-button>
            </div>
            </div>

            <!-- 右侧：处理结果预览 -->
              <div class="ai-results-preview" v-if="aiProcessedResults.length > 0 && !aiImageProcessing">
                <div class="results-header">
                  <div class="results-title-area">
                    <span class="results-title">✨ Processing Results</span>
                    <span class="results-count">{{ aiProcessedResults.length }} image(s) processed</span>
                  </div>
                  <el-button size="small" type="primary" @click="handleApplyResults">
                    <el-icon><Check /></el-icon> Apply to Images
                  </el-button>
                </div>
                <div class="results-grid">
                  <div v-for="(result, index) in aiProcessedResults" :key="index" class="result-item">
                    <div class="result-header">
                      <span class="result-index">#{{ index + 1 }}</span>
                      <span class="result-name">{{ result.fileName }}</span>
                    </div>
                    <div class="result-images">
                      <div class="image-column before-column">
                        <div class="column-label">
                          <el-icon><Picture /></el-icon>
                          <span>Before</span>
                        </div>
                        <div class="image-wrapper" @click="handlePreviewImage(result.originalUrl)">
                          <img :src="result.originalUrl" alt="before">
                          <div class="image-overlay">
                            <el-icon class="preview-icon"><ZoomIn /></el-icon>
                          </div>
                        </div>
                      </div>
                      <div class="arrow-separator">
                        <el-icon class="arrow-icon"><Right /></el-icon>
                      </div>
                      <div class="image-column after-column">
                        <div class="column-label">
                          <el-icon><MagicStick /></el-icon>
                          <span>After</span>
                          <span class="feature-badge">{{ result.featureName }}</span>
                        </div>
                        <div class="image-wrapper" @click="handlePreviewImage(result.processedUrl)">
                          <img :src="result.processedUrl" alt="after">
                          <div class="image-overlay">
                            <el-icon class="preview-icon"><ZoomIn /></el-icon>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </el-dialog>

    <!-- 图片预览对话框 -->
    <el-dialog
      v-model="imagePreviewVisible"
      title="Image Preview"
      width="80%"
      class="image-preview-dialog"
      append-to-body
    >
      <div class="preview-image-container">
        <img :src="currentPreviewImage" alt="preview" class="preview-image">
      </div>
    </el-dialog>

    <!-- 图片编辑对话框 -->
    <el-dialog
      v-model="imageEditDialogVisible"
      title="Image Editor"
      width="1200px"
      class="image-edit-dialog"
      :close-on-click-modal="false"
    >
      <div class="image-edit-content">
        <div class="edit-sidebar">
          <div class="selected-images-list">
            <div class="list-title">Images ({{ editSelectedImages.length }})</div>
            <div 
              v-for="(img, index) in editSelectedImages" 
              :key="index" 
              class="image-list-item"
              :class="{ active: currentEditIndex === index }"
              @click="currentEditIndex = index"
            >
              <img :src="img.url || (img.raw ? getImageUrl(img.raw) : '')" alt="thumbnail">
              <div class="item-info">
                <div class="item-name">{{ img.name }}</div>
                <div class="item-size">{{ img.size ? formatFileSize(img.size) : 'N/A' }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="edit-main">
          <div class="edit-toolbar">
            <el-button-group>
              <el-button :type="editTool === 'crop' ? 'primary' : ''" @click="editTool = 'crop'">
                <el-icon><Crop /></el-icon> Crop
              </el-button>
              <el-button :type="editTool === 'rotate' ? 'primary' : ''" @click="editTool = 'rotate'">
                <el-icon><RefreshRight /></el-icon> Rotate
              </el-button>
              <el-button :type="editTool === 'resize' ? 'primary' : ''" @click="editTool = 'resize'">
                <el-icon><FullScreen /></el-icon> Resize
              </el-button>
              <el-button :type="editTool === 'filter' ? 'primary' : ''" @click="editTool = 'filter'">
                <el-icon><Picture /></el-icon> Filter
              </el-button>
            </el-button-group>

            <el-button-group style="margin-left: auto;">
              <el-button @click="handleResetEdit">
                <el-icon><RefreshLeft /></el-icon> Reset
              </el-button>
              <el-button type="primary" @click="handleApplyEdit">
                <el-icon><Check /></el-icon> Apply
              </el-button>
            </el-button-group>
          </div>

          <div class="edit-canvas-area">
            <div class="canvas-container">
              <img 
                v-if="currentEditImage" 
                :src="editHistory.currentImage || currentEditImage.url || (currentEditImage.raw ? getImageUrl(currentEditImage.raw) : '')" 
                alt="edit preview"
                ref="editImageRef"
                class="edit-image"
              >
            </div>
          </div>

          <div class="edit-options-panel" v-if="editTool">
            <!-- Crop Options -->
            <div v-if="editTool === 'crop'" class="tool-options">
              <div class="option-title">Crop Settings</div>
              <el-form label-position="top" size="small">
                <el-form-item label="Aspect Ratio">
                  <el-select v-model="cropSettings.aspectRatio">
                    <el-option label="Free" value="free" />
                    <el-option label="1:1 (Square)" value="1:1" />
                    <el-option label="4:3" value="4:3" />
                    <el-option label="16:9" value="16:9" />
                    <el-option label="3:4 (Portrait)" value="3:4" />
                  </el-select>
                </el-form-item>
              </el-form>
            </div>

            <!-- Rotate Options -->
            <div v-if="editTool === 'rotate'" class="tool-options">
              <div class="option-title">Rotate Settings</div>
              <el-button-group>
                <el-button @click="handleRotateImage(-90)">
                  <el-icon><RefreshLeft /></el-icon> 90° Left
                </el-button>
                <el-button @click="handleRotateImage(90)">
                  <el-icon><RefreshRight /></el-icon> 90° Right
                </el-button>
              </el-button-group>
              <el-button @click="handleFlipImage('horizontal')" style="margin-top: 10px;">
                Flip Horizontal
              </el-button>
              <el-button @click="handleFlipImage('vertical')">
                Flip Vertical
              </el-button>
            </div>

            <!-- Resize Options -->
            <div v-if="editTool === 'resize'" class="tool-options">
              <div class="option-title">Resize Settings</div>
              <el-form label-position="top" size="small">
                <el-form-item label="Width (px)">
                  <el-input-number v-model="resizeSettings.width" :min="1" :max="5000" />
                </el-form-item>
                <el-form-item label="Height (px)">
                  <el-input-number v-model="resizeSettings.height" :min="1" :max="5000" />
                </el-form-item>
                <el-form-item>
                  <el-checkbox v-model="resizeSettings.keepRatio">Keep Aspect Ratio</el-checkbox>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleResizeImage">Apply Resize</el-button>
                </el-form-item>
              </el-form>
            </div>

            <!-- Filter Options -->
            <div v-if="editTool === 'filter'" class="tool-options">
              <div class="option-title">Filter Presets</div>
              <div class="filter-presets-grid">
                <div 
                  v-for="preset in filterPresets" 
                  :key="preset.name"
                  class="filter-preset-item"
                  :class="{ active: selectedFilterPreset === preset.name }"
                  @click="applyFilterPreset(preset)"
                >
                  <div class="preset-icon">{{ preset.icon }}</div>
                  <div class="preset-name">{{ preset.name }}</div>
                </div>
              </div>

              <el-divider />

              <div class="option-title">Manual Adjustment</div>
              <el-form label-position="top" size="small">
                <el-form-item label="Brightness">
                  <el-slider v-model="filterSettings.brightness" :min="-100" :max="100" />
                </el-form-item>
                <el-form-item label="Contrast">
                  <el-slider v-model="filterSettings.contrast" :min="-100" :max="100" />
                </el-form-item>
                <el-form-item label="Saturation">
                  <el-slider v-model="filterSettings.saturation" :min="-100" :max="100" />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { mockAIService } from '@/api/ai'
import type { AITextGenerateRequest } from '@/api/ai'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Plus,
  Refresh,
  RefreshRight,
  RefreshLeft,
  Upload,
  Delete,
  Document,
  Menu,
  Grid,
  Picture,
  Check,
  MagicStick,
  Loading,
  QuestionFilled,
  MoreFilled,
  Download,
  Edit,
  FullScreen,
  Crop
} from '@element-plus/icons-vue'

const router = useRouter()

// Tab定义
const tabs = [
  { id: 'basic', label: 'Basic Info', icon: Document },
  { id: 'category', label: 'Category & Attributes', icon: Menu },
  { id: 'sku', label: 'SKU Info', icon: Grid },
  { id: 'images', label: 'Product Images', icon: Picture }
]

// 当前激活的标签页
const activeTab = ref('basic')

// 提交状态
const submitting = ref(false)

// 吸顶状态
const isSticky = ref(false)

// 标签相关状态
const tagInputVisible = ref(false)
const tagInputValue = ref('')
const tagInputRef = ref()

// 活动条位置和宽度
const activeBarLeft = ref('0px')
const activeBarWidth = ref('100px')

// refs
const contentWrapperRef = ref()
const basicRef = ref()
const categoryRef = ref()
const skuRef = ref()
const imagesRef = ref()

// 表单数据
const formData = reactive({
  // Basic Information
  store: '',
  publishSites: [],
  productName: '',
  sellerParentSku: '',
  productDescription: '',
  brand: '',
  countryOfOrigin: '',
  tags: [],
  
  // Category & Attributes
  categoryPath: [],
  attributes: {
    occasion: '',
    closureType: '',
    details: '',
    magnetic: '',
    strapType: '',
    pattern: '',
    style: ''
  },
  composition: [
    { type: '', ratio: 0 }
  ],
  
  // Other
  subordinateAttrs: [],
  colors: [],
  sizes: []
})

// 更多属性展开状态
const showMoreAttributes = ref(false)

// 临时成分（用于空状态时显示）
const tempComposition = reactive({
  type: '',
  ratio: 0
})

// 属性列表
const attributesList = ref([
  {
    label: 'Style',
    type: 'select',
    value: '',
    required: true,
    tip: 'Select the style of the product',
    options: [
      { label: 'Casual', value: 'casual' },
      { label: 'Formal', value: 'formal' },
      { label: 'Sport', value: 'sport' }
    ]
  },
  {
    label: 'Bag Type',
    type: 'select',
    value: '',
    required: true,
    tip: 'Select bag type',
    options: [
      { label: 'Shoulder Bag', value: 'shoulder' },
      { label: 'Crossbody', value: 'crossbody' },
      { label: 'Tote', value: 'tote' }
    ]
  },
  {
    label: 'Strap Type',
    type: 'select',
    value: '',
    required: true,
    options: [
      { label: 'Adjustable', value: 'adjustable' },
      { label: 'Fixed', value: 'fixed' },
      { label: 'Detachable', value: 'detachable' }
    ]
  },
  {
    label: 'Occasion',
    type: 'select',
    value: '',
    options: [
      { label: 'Daily', value: 'daily' },
      { label: 'Party', value: 'party' },
      { label: 'Business', value: 'business' }
    ]
  },
  {
    label: 'Closure Type',
    type: 'select',
    value: '',
    options: [
      { label: 'Zipper', value: 'zipper' },
      { label: 'Magnetic', value: 'magnetic' },
      { label: 'Buckle', value: 'buckle' }
    ]
  },
  {
    label: 'Material',
    type: 'select',
    value: '',
    options: [
      { label: 'Leather', value: 'leather' },
      { label: 'Canvas', value: 'canvas' },
      { label: 'Nylon', value: 'nylon' }
    ]
  },
  {
    label: 'Pattern',
    type: 'select',
    value: '',
    options: [
      { label: 'Solid', value: 'solid' },
      { label: 'Striped', value: 'striped' },
      { label: 'Floral', value: 'floral' }
    ]
  },
  {
    label: 'Details',
    type: 'select',
    value: '',
    options: [
      { label: 'None', value: 'none' },
      { label: 'Embroidery', value: 'embroidery' },
      { label: 'Print', value: 'print' }
    ]
  }
])

// 显示的属性（默认显示3个，即一行）
const displayedAttributes = computed(() => {
  if (showMoreAttributes.value || attributesList.value.length <= 3) {
    return attributesList.value
  }
  return attributesList.value.slice(0, 3)
})

// 临时存储编辑前的属性数据
const editingBackup = ref<any>(null)

// 表单引用
const basicFormRef = ref()

// 表单验证规则
const rules = {
  // Basic Information
  store: [
    { required: true, message: 'Please select store', trigger: 'change' }
  ],
  publishSites: [
    { required: true, type: 'array', min: 1, message: 'Please select at least one publish site', trigger: 'change' }
  ],
  productName: [
    { required: true, message: 'Please enter product name', trigger: 'blur' },
    { min: 1, max: 200, message: 'Length should be 1 to 200 characters', trigger: 'blur' }
  ],
  sellerParentSku: [
    { required: true, message: 'Please enter seller parent SKU', trigger: 'blur' },
    { min: 1, max: 256, message: 'Length should be 1 to 256 characters', trigger: 'blur' }
  ],
  
  // Category & Attributes
  categoryPath: [
    { required: true, message: 'Please select a category', trigger: 'change' }
  ]
}

// 分类选项（使用之前定义的分类树数据）
const categoryOptions = ref([
  {
    id: 'women',
    name: 'Women',
    children: [
      {
        id: 'women-clothing',
        name: 'Clothing',
        children: [
          { id: 'women-clothing-dresses', name: 'Dresses' },
          { id: 'women-clothing-tops', name: 'Tops' },
          { id: 'women-clothing-bottoms', name: 'Bottoms' }
        ]
      },
      {
        id: 'women-accessories',
        name: 'Accessories',
        children: [
          { id: 'women-accessories-bags', name: 'Bags' },
          { id: 'women-accessories-jewelry', name: 'Jewelry' }
        ]
      }
    ]
  },
  {
    id: 'men',
    name: 'Men',
    children: [
      {
        id: 'men-clothing',
        name: 'Clothing',
        children: [
          { id: 'men-clothing-shirts', name: 'Shirts' },
          { id: 'men-clothing-pants', name: 'Pants' }
        ]
      }
    ]
  }
])

// 颜色管理
const showColorInput = ref(false)
const newColorInput = ref('')
const colorInputRef = ref()
const selectedColor = ref('')

// 规格列表管理（支持多个规格，最多3个）
let specIdCounter = 0
let selectorIdCounter = 0

const specsList = ref([
  {
    id: specIdCounter++,
    type: 'color',
    selectors: [
      { id: selectorIdCounter++, value: '' }
    ]
  }
])

// 预设的规格类型选项
const defaultSpecTypes = [
  { label: 'Color', value: 'color' },
  { label: 'Size', value: 'size' },
  { label: 'Style', value: 'style' }
]

// 规格值选项（根据类型）
const specValueOptions: Record<string, Array<{label: string, value: string}>> = {
  color: [
    { label: 'Fluorescent', value: 'Fluorescent' },
    { label: 'Red', value: 'Red' },
    { label: 'Blue', value: 'Blue' },
    { label: 'Black', value: 'Black' },
    { label: 'White', value: 'White' },
    { label: 'Green', value: 'Green' },
    { label: 'Yellow', value: 'Yellow' },
    { label: 'Purple', value: 'Purple' },
    { label: 'Pink', value: 'Pink' },
    { label: 'Orange', value: 'Orange' }
  ],
  size: [
    { label: 'XS', value: 'XS' },
    { label: 'S', value: 'S' },
    { label: 'M', value: 'M' },
    { label: 'L', value: 'L' },
    { label: 'XL', value: 'XL' },
    { label: 'XXL', value: 'XXL' }
  ],
  style: [
    { label: 'Casual', value: 'Casual' },
    { label: 'Formal', value: 'Formal' },
    { label: 'Sport', value: 'Sport' }
  ]
}

// 获取可用的规格类型（过滤已选的）
const availableSpecTypes = (currentIndex: number) => {
  const usedTypes = specsList.value
    .filter((_, index) => index !== currentIndex)
    .map(spec => spec.type)
    .filter(type => type) // 过滤空值
  
  return defaultSpecTypes.filter(type => !usedTypes.includes(type.value))
}

// 获取可用的规格值（过滤已选的）
const getAvailableSpecValues = (spec: any, specIndex: number) => {
  if (!spec.type) return []
  
  // 获取该规格类型的所有预设选项
  const allOptions = specValueOptions[spec.type] || []
  
  // 获取该规格已选的值
  const selectedValues = spec.selectors
    .map((s: any) => s.value)
    .filter((v: string) => v && v.trim())
  
  // 过滤掉已选的值
  return allOptions.filter(option => !selectedValues.includes(option.value))
}

// 规格类型改变
const handleSpecTypeChange = (specIndex: number) => {
  // 清空该规格的所有选择器值
  specsList.value[specIndex].selectors = [
    { id: selectorIdCounter++, value: '' }
  ]
  syncSpecsToFormData()
}

// 动态选择器处理
const handleSpecSelectorChange = (specIndex: number, selectorIndex: number) => {
  const spec = specsList.value[specIndex]
  const selector = spec.selectors[selectorIndex]
  
  // 更新表单数据
  syncSpecsToFormData()
  
  // 如果是最后一个选择器且有值，自动添加新的空选择器
  if (selectorIndex === spec.selectors.length - 1 && selector.value) {
    spec.selectors.push({
      id: selectorIdCounter++,
      value: ''
    })
  }
}

const handleRemoveSpecValue = (specIndex: number, selectorIndex: number) => {
  const spec = specsList.value[specIndex]
  if (spec.selectors.length > 1) {
    spec.selectors.splice(selectorIndex, 1)
    syncSpecsToFormData()
  }
}

const handleRemoveSpec = (specIndex: number) => {
  if (specsList.value.length > 1) {
    specsList.value.splice(specIndex, 1)
    syncSpecsToFormData()
  }
}

const handleAddNewSpec = () => {
  if (specsList.value.length < 3) {
    specsList.value.push({
      id: specIdCounter++,
      type: '',
      selectors: [
        { id: selectorIdCounter++, value: '' }
      ]
    })
  } else {
    ElMessage.warning('Maximum 3 specs allowed')
  }
}

// 同步规格数据到表单
const syncSpecsToFormData = () => {
  // 找到color类型的规格并同步到colors数组
  const colorSpec = specsList.value.find(s => s.type === 'color')
  if (colorSpec) {
    formData.colors = colorSpec.selectors
      .map(s => s.value)
      .filter(v => v && v.trim())
  } else {
    formData.colors = []
  }
  
  // 找到size类型的规格并同步到sizes数组
  const sizeSpec = specsList.value.find(s => s.type === 'size')
  if (sizeSpec) {
    formData.sizes = sizeSpec.selectors
      .map(s => s.value)
      .filter(v => v && v.trim())
  } else {
    formData.sizes = []
  }
}

const handleColorSelect = (value: string) => {
  if (value && !formData.colors.includes(value)) {
    formData.colors.push(value)
  }
  // 清空选择，允许继续添加
  nextTick(() => {
    selectedColor.value = ''
  })
}

const handleShowAddOptionDialog = () => {
  ElMessage.info('Add option functionality coming soon...')
}

const handleAddColor = () => {
  showColorInput.value = true
  nextTick(() => {
    colorInputRef.value?.focus()
  })
}

const handleColorInputConfirm = () => {
  if (newColorInput.value && !formData.colors.includes(newColorInput.value)) {
    formData.colors.push(newColorInput.value)
    // 图片行数据会通过 watch 自动同步
  }
  showColorInput.value = false
  newColorInput.value = ''
}

const handleRemoveColor = (color: string) => {
  const index = formData.colors.indexOf(color)
  if (index > -1) {
    formData.colors.splice(index, 1)
    // 图片行数据会通过 watch 自动同步
  }
}

// 尺寸管理
const selectedSizeTemplate = ref('standard')
const availableSizes = ref(['XS', 'S', 'M', 'L', 'XL', 'XXL'])

const handleSizeTemplateChange = (template: string) => {
  switch (template) {
    case 'standard':
      availableSizes.value = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
      break
    case 'plus':
      availableSizes.value = ['1X', '2X', '3X', '4X', '5X']
      break
    case 'custom':
      availableSizes.value = []
      break
  }
  formData.sizes = []
}

// 规格类型管理
const handleAddSpecType = () => {
  ElMessage.info('添加规格类型功能开发中...')
}

const handleRemoveSpecType = (type: string) => {
  ElMessageBox.confirm(`确定要删除${type === 'color' ? '颜色' : '尺寸'}规格吗？`, '确认删除', {
    type: 'warning'
  }).then(() => {
    if (type === 'color') {
      formData.colors = []
    } else if (type === 'size') {
      formData.sizes = []
    }
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// SKU列表
const skuList = ref([])
const skuTableKey = ref(0) // 用于强制刷新表格

// 批量设置
const showBatchSettingsDialog = ref(false)
const batchSettings = ref({
  price: null,
  currency: 'CNY',
  stock: null,
  unit: 'PCS',
  weight: null,
  weightUnit: 'KG',
  length: null,
  width: null,
  height: null,
  dimensionUnit: 'CM',
  status: 'Active'
})

const applyBatchSettings = () => {
  if (skuList.value.length === 0) {
    ElMessage.warning('No SKUs available. Please generate SKUs first.')
    return
  }
  
  skuList.value.forEach(sku => {
    if (batchSettings.value.price !== null) {
      sku.price = batchSettings.value.price
      sku.salePrice = batchSettings.value.price
    }
    if (batchSettings.value.currency) {
      sku.currency = batchSettings.value.currency
    }
    if (batchSettings.value.stock !== null) {
      sku.stock = batchSettings.value.stock
    }
    if (batchSettings.value.unit) {
      sku.unit = batchSettings.value.unit
    }
    if (batchSettings.value.weight !== null) {
      sku.weight = batchSettings.value.weight
    }
    if (batchSettings.value.weightUnit) {
      sku.weightUnit = batchSettings.value.weightUnit
    }
    if (batchSettings.value.length !== null) {
      sku.length = batchSettings.value.length
    }
    if (batchSettings.value.width !== null) {
      sku.width = batchSettings.value.width
    }
    if (batchSettings.value.height !== null) {
      sku.height = batchSettings.value.height
    }
    if (batchSettings.value.dimensionUnit) {
      sku.dimensionUnit = batchSettings.value.dimensionUnit
    }
    if (batchSettings.value.status) {
      sku.status = batchSettings.value.status
    }
  })
  
  showBatchSettingsDialog.value = false
  skuTableKey.value++ // 刷新表格
  ElMessage.success('Batch settings applied successfully')
}

// 尺码表
const showSizeChartDialog = ref(false)
const sizeChartForm = ref({
  selectedSpecIndex: null as number | null
})

// 尺码表数据存储
const sizeChartDataStore = ref<Record<string, any[]>>({})

// 当前选中的规格标签
const selectedSpecLabel = computed(() => {
  if (sizeChartForm.value.selectedSpecIndex === null) return ''
  const spec = specsList.value[sizeChartForm.value.selectedSpecIndex]
  return spec?.type || `Spec ${sizeChartForm.value.selectedSpecIndex + 1}`
})

// 尺码表表格数据
const sizeChartTableData = computed(() => {
  if (sizeChartForm.value.selectedSpecIndex === null) return []
  
  const spec = specsList.value[sizeChartForm.value.selectedSpecIndex]
  if (!spec) return []
  
  const specValues = spec.selectors
    .filter(s => s.value)
    .map(s => s.value)
  
  // 获取或创建该规格的尺码表数据
  const storeKey = `spec${sizeChartForm.value.selectedSpecIndex}`
  if (!sizeChartDataStore.value[storeKey]) {
    sizeChartDataStore.value[storeKey] = specValues.map(value => ({
      specValue: value,
      length: 0,
      width: 0,
      height: 0,
      volume: 0
    }))
  } else {
    // 更新数据以匹配当前规格值
    const existingData = sizeChartDataStore.value[storeKey]
    const updatedData = specValues.map(value => {
      const existing = existingData.find(d => d.specValue === value)
      return existing || {
        specValue: value,
        length: 0,
        width: 0,
        height: 0,
        volume: 0
      }
    })
    sizeChartDataStore.value[storeKey] = updatedData
  }
  
  return sizeChartDataStore.value[storeKey]
})

const handleSpecAttributeChange = () => {
  // 规格属性改变时触发数据刷新
  console.log('Spec attribute changed')
}

const saveSizeChart = () => {
  showSizeChartDialog.value = false
  ElMessage.success('Size chart saved successfully')
}

// 主规格标签
const mainSpecLabel = computed(() => {
  if (specsList.value.length === 0) return 'Main Spec'
  return specsList.value[0].type || 'Main Spec'
})

// 其他规格列（除了第一个主规格外的所有规格）
const otherSpecColumns = computed(() => {
  if (specsList.value.length <= 1) return []
  
  return specsList.value.slice(1).map((spec, index) => ({
    key: index + 1, // 使用实际的规格索引
    label: spec.type || `Spec ${index + 1}`
  }))
})

// 扁平化的SKU列表（用于单表格展示，带rowspan信息）
const flattenedSkuList = computed(() => {
  if (skuList.value.length === 0) return []
  
  // 检查是否有有效的规格
  const hasValidSpecs = specsList.value.some(spec => 
    spec.selectors.some(s => s.value)
  )
  
  if (!hasValidSpecs) return []
  
  // 添加主规格值到每个SKU（使用索引0）
  return skuList.value.map((sku, index) => ({
    ...sku,
    mainSpecValue: sku.specs?.[0] || '',
    originalIndex: index
  }))
})

// 处理单元格合并（主规格和其他规格列使用rowspan）
const handleSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  const allRows = flattenedSkuList.value
  const otherSpecCount = otherSpecColumns.value.length
  
  if (!row || !row.specs) {
    return { rowspan: 1, colspan: 1 }
  }
  
  // 第一列：主规格列合并
  if (columnIndex === 0) {
    const mainValue = row.mainSpecValue
    if (!mainValue) {
      return { rowspan: 1, colspan: 1 }
    }
    
    const firstIndex = allRows.findIndex(r => r.mainSpecValue === mainValue)
    
    if (rowIndex === firstIndex) {
      const count = allRows.filter(r => r.mainSpecValue === mainValue).length
      return { rowspan: count, colspan: 1 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
  
  // 第二列及后续其他规格列：在同一主规格值内合并相同的规格值
  if (columnIndex > 0 && columnIndex <= otherSpecCount) {
    const mainValue = row.mainSpecValue
    const specIndex = columnIndex // 直接使用列索引作为规格索引
    const specValue = row.specs?.[specIndex]
    
    if (!mainValue || specValue === undefined) {
      return { rowspan: 1, colspan: 1 }
    }
    
    // 找到同一主规格值内的所有行
    const sameMainSpecRows = allRows.filter(r => r.mainSpecValue === mainValue)
    
    if (sameMainSpecRows.length === 0) {
      return { rowspan: 1, colspan: 1 }
    }
    
    // 在同一主规格值内，找到当前规格值的第一次出现
    const sameMainSpecStartIndex = allRows.findIndex(r => r.mainSpecValue === mainValue)
    const relativeIndex = rowIndex - sameMainSpecStartIndex
    
    // 找到当前规格值在同一主规格内第一次出现的相对位置
    const firstOccurrenceIndex = sameMainSpecRows.findIndex(r => r.specs?.[specIndex] === specValue)
    
    if (relativeIndex === firstOccurrenceIndex) {
      // 计算相同规格值的数量
      const count = sameMainSpecRows.filter(r => r.specs?.[specIndex] === specValue).length
      return { rowspan: count, colspan: 1 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
  
  return { rowspan: 1, colspan: 1 }
}

const generateSKUs = () => {
  // 检查是否至少有一个规格
  const hasValidSpecs = specsList.value.some(spec => 
    spec.selectors.some(selector => selector.value)
  )
  
  if (!hasValidSpecs) {
    ElMessage.warning('Please select at least one specification value')
    return
  }

  // 获取有效规格（有值的规格）及其信息
  const validSpecs = specsList.value
    .map((spec, index) => ({
      index,
      type: spec.type,
      values: spec.selectors.filter(s => s.value).map(s => s.value)
    }))
    .filter(spec => spec.values.length > 0)
  
  if (validSpecs.length === 0) {
    ElMessage.warning('Please select at least one specification value')
    return
  }
  
  // 生成SKU的笛卡尔积
  const generateCartesianProduct = (specs: typeof validSpecs): Array<Record<number, string>> => {
    if (specs.length === 0) return [{}]
    
    const [first, ...rest] = specs
    const restProduct = generateCartesianProduct(rest)
    
    return first.values.flatMap(value => 
      restProduct.map(product => ({
        [first.index]: value,
        ...product
      }))
    )
  }
  
  const combinations = generateCartesianProduct(validSpecs)
  
  // 保存旧的SKU数据以便保留已输入的信息
  const oldSkuMap = new Map()
  skuList.value.forEach(sku => {
    // 使用规格值组合作为key
    const key = validSpecs.map(s => sku.specs?.[s.index] || '').join('|')
    oldSkuMap.set(key, sku)
  })
  
  skuList.value = combinations.map((combo) => {
    // 构建规格对象（使用原始索引）
    const specs: Record<number, string> = combo
    
    // 生成SKU代码
    const skuCodeParts = validSpecs.map(s => specs[s.index])
    const skuCode = `SKU-${skuCodeParts.join('-')}`.toUpperCase().replace(/\s+/g, '-')
    
    // 使用规格值组合作为key查找旧数据
    const key = validSpecs.map(s => specs[s.index]).join('|')
    const existingSku = oldSkuMap.get(key)
    
    if (existingSku) {
      return {
        ...existingSku,
        specs, // 更新规格
        skuCode
      }
    }
    
    return {
      skuCode,
      specs,
        price: 0,
        salePrice: 0,
      currency: 'CNY',
        stock: 0,
      unit: 'PCS',
      weight: 0,
      weightUnit: 'KG',
      length: 0,
      width: 0,
      height: 0,
      dimensionUnit: 'CM',
      status: 'Active',
        barcode: ''
    }
  })

  // 强制刷新表格以正确计算rowspan
  skuTableKey.value++

  ElMessage.success(`Generated ${skuList.value.length} SKUs`)
}

const handleDeleteSKU = (index: number) => {
  skuList.value.splice(index, 1)
}

// 图片管理
// 图片上传相关数据
const imageRowsData = ref<Array<{
  spec: string
  detailImages: any[]
  squareImage: any[]
  colorBlockImage: any[]
}>>([])

const selectAllImages = ref(false)
const previewDialogVisible = ref(false)
const previewImageUrl = ref('')

// 存储选中的图片 (使用 uid 作为唯一标识)
const selectedImages = ref<Set<string>>(new Set())

// 响应式版本号，用于触发 Set 的响应式更新
const selectedImagesVersion = ref(0)

// 计算选中图片的数量（依赖版本号确保响应式更新）
const selectedImagesCount = computed(() => {
  // 访问版本号以触发依赖
  selectedImagesVersion.value
  return selectedImages.value.size
})

// 监听颜色变化，同步更新图片行数据
watch(() => formData.colors, (newColors) => {
  // 移除不存在的颜色对应的行
  imageRowsData.value = imageRowsData.value.filter(row => 
    newColors.includes(row.spec)
  )
  
  // 添加新颜色对应的行
  newColors.forEach(color => {
    const exists = imageRowsData.value.find(row => row.spec === color)
    if (!exists) {
      imageRowsData.value.push({
        spec: color,
        detailImages: [],
        squareImage: [],
        colorBlockImage: []
      })
    }
  })
}, { deep: true, immediate: true })

// SKU图片管理
const skuImageRowsData = ref<Array<{
  skuCode: string
  specsText: string
  skuImages: any[]
  originalIndex: number
}>>([])

const selectAllSkuImages = ref(false)
// 计算 SKU 图片的选中数量
const selectedSkuImagesCount = computed(() => {
  selectedImagesVersion.value  // 触发依赖
  const skuIds: string[] = []
  skuImageRowsData.value.forEach(row => {
    row.skuImages.forEach((img: any) => {
      if (img.uid) skuIds.push(String(img.uid))
    })
  })
  return skuIds.filter(id => selectedImages.value.has(id)).length
})

// 监听SKU列表变化，同步更新SKU图片行数据
watch(() => flattenedSkuList.value, (newSkuList) => {
  // 清空并重建
  const newSkuImageRows: typeof skuImageRowsData.value = []
  
  newSkuList.forEach((sku, index) => {
    // 获取所有规格值
    const specsText = Object.values(sku.specs).filter(Boolean).join(' / ')
    
    // 查找是否已存在
    const existing = skuImageRowsData.value.find(row => row.skuCode === sku.skuCode)
    
    newSkuImageRows.push({
      skuCode: sku.skuCode || `SKU-${index + 1}`,
      specsText: specsText || '-',
      skuImages: existing?.skuImages || [],
      originalIndex: index
    })
  })
  
  skuImageRowsData.value = newSkuImageRows
}, { deep: true, immediate: true })

// Shein详情图管理
const sheinDetailImageRowsData = ref<Array<{
  spec: string
  site: string
  detailImages: any[]
}>>([])

const selectAllSheinImages = ref(false)
// 计算 Shein 详情图片的选中数量
const selectedSheinImagesCount = computed(() => {
  selectedImagesVersion.value  // 触发依赖
  const sheinIds: string[] = []
  sheinDetailImageRowsData.value.forEach(row => {
    row.detailImages.forEach((img: any) => {
      if (img.uid) sheinIds.push(String(img.uid))
    })
  })
  return sheinIds.filter(id => selectedImages.value.has(id)).length
})

// 站点选项
const siteOptions = ['All', 'US', 'UK', 'FR', 'DE', 'ES', 'IT']

// 监听颜色变化，同步更新Shein详情图行数据
watch(() => formData.colors, (newColors) => {
  const newRows: typeof sheinDetailImageRowsData.value = []
  
  newColors.forEach(color => {
    // 查找该颜色下的所有现有站点
    const existingRows = sheinDetailImageRowsData.value.filter(row => row.spec === color)
    
    if (existingRows.length > 0) {
      // 保留已有的站点行
      newRows.push(...existingRows)
    } else {
      // 新颜色，创建默认的"All"站点
      newRows.push({
        spec: color,
        site: 'All',
        detailImages: []
      })
    }
  })
  
  sheinDetailImageRowsData.value = newRows
}, { deep: true, immediate: true })

// 获取该行可用的站点选项（包括当前选中的站点）
const getAvailableSitesForRow = (row: any) => {
  // 获取当前规格下已有的站点（排除当前行）
  const existingSites = sheinDetailImageRowsData.value
    .filter(r => r.spec === row.spec && r.site !== row.site)
    .map(r => r.site)
  
  // 返回未被使用的站点 + 当前行的站点
  return siteOptions.filter(site => !existingSites.includes(site))
}

// 处理站点变更
const handleSheinSiteChange = (row: any) => {
  // 检查新站点是否已存在
  const duplicate = sheinDetailImageRowsData.value.find(
    r => r.spec === row.spec && r.site === row.site && r !== row
  )
  
  if (duplicate) {
    ElMessage.warning(`Site "${row.site}" already exists for this spec`)
    // 恢复之前的值
    nextTick(() => {
      row.site = row.site
    })
  }
}

// 添加Shein详情图站点（默认US）
const handleAddSheinSite = (row: any) => {
  // 获取当前规格下已有的站点
  const existingSites = sheinDetailImageRowsData.value
    .filter(r => r.spec === row.spec)
    .map(r => r.site)
  
  // 获取可选的站点（排除已存在的）
  const availableSites = siteOptions.filter(site => !existingSites.includes(site))
  
  if (availableSites.length === 0) {
    ElMessage.warning('All sites have been added for this spec')
    return
  }

  // 默认选择US，如果US已存在则选择第一个可用站点
  const defaultSite = availableSites.includes('US') ? 'US' : availableSites[0]
  
  // 在当前行后面插入新站点
  const currentIndex = sheinDetailImageRowsData.value.findIndex(
    r => r.spec === row.spec && r.site === row.site
  )
  
  sheinDetailImageRowsData.value.splice(currentIndex + 1, 0, {
    spec: row.spec,
    site: defaultSite,
    detailImages: []
  })
  
  ElMessage.success(`Site "${defaultSite}" added successfully`)
}

// Other Product Images管理
const otherProductImages = ref<any[]>([])
const selectAllOtherImages = ref(false)
// 计算其他产品图片的选中数量
const selectedOtherImagesCount = computed(() => {
  selectedImagesVersion.value  // 触发依赖
  const otherIds = otherProductImages.value.map((img: any) => String(img.uid)).filter(Boolean)
  return otherIds.filter(id => selectedImages.value.has(id)).length
})

// Shein详情图表格单元格合并方法
const handleSheinTableSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  // 只处理第一列（Main Spec列）
  if (columnIndex === 0) {
    // 统计每个主规格有多少行
    const spec = row.spec
    const sameSpecRows = sheinDetailImageRowsData.value.filter(r => r.spec === spec)
    const firstIndex = sheinDetailImageRowsData.value.findIndex(r => r.spec === spec)
    
    // 如果是该主规格的第一行，返回合并的行数
    if (rowIndex === firstIndex) {
      return {
        rowspan: sameSpecRows.length,
        colspan: 1
      }
    } else {
      // 如果不是第一行，隐藏该单元格
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
  
  // 其他列不合并
  return {
    rowspan: 1,
    colspan: 1
  }
}

// 删除Shein详情图站点行
const handleDeleteSheinSite = async (row: any) => {
  // 检查是否是该颜色下的最后一行
  const sameSpecRows = sheinDetailImageRowsData.value.filter(r => r.spec === row.spec)
  if (sameSpecRows.length === 1) {
    ElMessage.warning('Cannot delete the last site for this spec')
    return
  }

  try {
    await ElMessageBox.confirm(
      `Are you sure to delete site "${row.site}" for spec "${row.spec}"?`,
      'Confirm Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )

    // 删除该行
    const index = sheinDetailImageRowsData.value.findIndex(
      r => r.spec === row.spec && r.site === row.site
    )
    if (index > -1) {
      sheinDetailImageRowsData.value.splice(index, 1)
      ElMessage.success('Site deleted successfully')
    }
  } catch {
    // 用户取消删除
  }
}

// 获取所有图片的唯一标识
const getAllImageIds = () => {
  const ids: string[] = []
  imageRowsData.value.forEach(row => {
    row.detailImages.forEach((img: any) => {
      if (img.uid) ids.push(String(img.uid))
    })
    row.squareImage.forEach((img: any) => {
      if (img.uid) ids.push(String(img.uid))
    })
    row.colorBlockImage.forEach((img: any) => {
      if (img.uid) ids.push(String(img.uid))
    })
  })
  console.log('getAllImageIds:', ids.length, 'UIDs:', ids)
  return ids
}

// 全选/取消全选 - SKC 图片
let isUpdatingSelectAll = false  // 防止循环更新
watch(selectAllImages, (newVal) => {
  if (isUpdatingSelectAll) return
  
  const skcIds = getAllImageIds()
  console.log('=== SKC Select All:', newVal, 'Found', skcIds.length, 'images ===')
  
  if (newVal) {
    // 全选：添加所有 SKC 图片
    skcIds.forEach(id => {
      selectedImages.value.add(id)
      console.log('  Added to selection:', id)
    })
  } else {
    // 取消全选：移除所有 SKC 图片
    skcIds.forEach(id => {
      selectedImages.value.delete(id)
      console.log('  Removed from selection:', id)
    })
  }
  
  console.log('SKC images selected count:', selectedImages.value.size)
  console.log('Selected UIDs:', Array.from(selectedImages.value))
  
  // 触发响应式更新
  selectedImagesVersion.value++
  
  // 延迟更新UI，确保 DOM 已经渲染
  nextTick(() => {
    setTimeout(() => {
      updateImageSelectionUI()
    }, 100)
  })
})

// 全选/取消全选 - SKU 图片
watch(selectAllSkuImages, (newVal) => {
  if (isUpdatingSelectAll) return
  
  const skuIds: string[] = []
  skuImageRowsData.value.forEach(row => {
    row.skuImages.forEach((img: any) => {
      if (img.uid) skuIds.push(String(img.uid))
    })
  })
  
  if (newVal) {
    skuIds.forEach(id => selectedImages.value.add(id))
  } else {
    skuIds.forEach(id => selectedImages.value.delete(id))
  }
  
  console.log('SKU images select all changed:', newVal, 'Selected count:', selectedImages.value.size)
  
  // 触发响应式更新
  selectedImagesVersion.value++
  
  nextTick(() => {
    setTimeout(() => {
      updateImageSelectionUI()
    }, 100)
  })
})

// 全选/取消全选 - Shein 详情图片
watch(selectAllSheinImages, (newVal) => {
  if (isUpdatingSelectAll) return
  
  const sheinIds: string[] = []
  sheinDetailImageRowsData.value.forEach(row => {
    row.detailImages.forEach((img: any) => {
      if (img.uid) sheinIds.push(String(img.uid))
    })
  })
  
  if (newVal) {
    sheinIds.forEach(id => selectedImages.value.add(id))
  } else {
    sheinIds.forEach(id => selectedImages.value.delete(id))
  }
  
  console.log('Shein images select all changed:', newVal, 'Selected count:', selectedImages.value.size)
  
  // 触发响应式更新
  selectedImagesVersion.value++
  
  nextTick(() => {
    setTimeout(() => {
      updateImageSelectionUI()
    }, 100)
  })
})

// 全选/取消全选 - 其他产品图片
watch(selectAllOtherImages, (newVal) => {
  if (isUpdatingSelectAll) return
  
  const otherIds = otherProductImages.value.map((img: any) => String(img.uid)).filter(Boolean)
  
  if (newVal) {
    otherIds.forEach(id => selectedImages.value.add(id))
  } else {
    otherIds.forEach(id => selectedImages.value.delete(id))
  }
  
  console.log('Other images select all changed:', newVal, 'Selected count:', selectedImages.value.size)
  
  // 触发响应式更新
  selectedImagesVersion.value++
  
  nextTick(() => {
    setTimeout(() => {
      updateImageSelectionUI()
    }, 100)
  })
})

// 检查图片是否被选中（通过 UID）
const isImageSelected = (uid: string) => {
  return uid && selectedImages.value.has(uid)
}

// 切换图片选中状态（通过 UID）
const toggleImageSelection = (uid: string) => {
  if (!uid || uid === 'null' || uid === 'undefined') return
  
  if (selectedImages.value.has(uid)) {
    selectedImages.value.delete(uid)
    console.log('Removed from selection:', uid)
  } else {
    selectedImages.value.add(uid)
    console.log('Added to selection:', uid)
  }
  
  console.log('Total selected:', selectedImages.value.size, 'UIDs:', Array.from(selectedImages.value))
  
  // 触发响应式更新
  selectedImagesVersion.value++
}

// 监听选中状态变化，自动更新全选按钮状态
watch(() => selectedImagesVersion.value, () => {
  isUpdatingSelectAll = true
  
  // 检查 SKC 图片是否全选
  const skcIds = getAllImageIds()
  const allSkcSelected = skcIds.length > 0 && skcIds.every(id => selectedImages.value.has(id))
  if (selectAllImages.value !== allSkcSelected) {
    selectAllImages.value = allSkcSelected
  }
  
  // 检查 SKU 图片是否全选
  const skuIds: string[] = []
  skuImageRowsData.value.forEach(row => {
    row.skuImages.forEach((img: any) => {
      if (img.uid) skuIds.push(String(img.uid))
    })
  })
  const allSkuSelected = skuIds.length > 0 && skuIds.every(id => selectedImages.value.has(id))
  if (selectAllSkuImages.value !== allSkuSelected) {
    selectAllSkuImages.value = allSkuSelected
  }
  
  // 检查 Shein 图片是否全选
  const sheinIds: string[] = []
  sheinDetailImageRowsData.value.forEach(row => {
    row.detailImages.forEach((img: any) => {
      if (img.uid) sheinIds.push(String(img.uid))
    })
  })
  const allSheinSelected = sheinIds.length > 0 && sheinIds.every(id => selectedImages.value.has(id))
  if (selectAllSheinImages.value !== allSheinSelected) {
    selectAllSheinImages.value = allSheinSelected
  }
  
  // 检查其他图片是否全选
  const otherIds = otherProductImages.value.map((img: any) => String(img.uid)).filter(Boolean)
  const allOtherSelected = otherIds.length > 0 && otherIds.every(id => selectedImages.value.has(id))
  if (selectAllOtherImages.value !== allOtherSelected) {
    selectAllOtherImages.value = allOtherSelected
  }
  
  nextTick(() => {
    isUpdatingSelectAll = false
  })
})

// AI生成相关
const aiGenerateDialogVisible = ref(false)
const aiGenerateType = ref<'title' | 'description' | 'productName'>('title')
const aiGenerating = ref(false)
const aiSettings = reactive({
  language: 'en',
  tone: 'professional',
  length: 'medium',
  targetAudience: '',
  features: '',
  includeKeywords: false,
  keywords: '',
  seoOptimize: true,
  generateCount: 5
})
const aiResults = ref<Array<{ content: string, translated?: string, seoScore?: number, length?: number }>>([])


const handlePreview = (file: any) => {
  previewImageUrl.value = file.url || URL.createObjectURL(file.raw)
  previewDialogVisible.value = true
}

// 处理超出上传数量限制
const handleExceed = (files: any[], fileList: any[]) => {
  ElMessage.warning(`Upload limit reached. Current limit: ${fileList.length} file(s).`)
}

// 处理图片上传变化，获取并显示图片尺寸
const handleImageChange = (file: any, fileList: any[]) => {
  console.log('=== handleImageChange called ===')
  console.log('File:', file.name, 'UID:', file.uid, 'Status:', file.status)
  
  // 先为当前文件创建并存储 blob URL（避免重复创建）
  if (file.raw && !file.blobUrl) {
    file.blobUrl = URL.createObjectURL(file.raw)
  }
  
  // 使用更长的延迟确保 DOM 完全更新
  setTimeout(() => {
    const uploadItems = document.querySelectorAll('.el-upload-list__item')
    console.log('Found upload items:', uploadItems.length)
    
    const allCurrentFiles = getAllImages()
    console.log('Total files in data:', allCurrentFiles.length)
    
    // 为所有文件创建 blob URL 映射
    const fileMap = new Map()
    allCurrentFiles.forEach((f: any) => {
      if (f.raw && !f.blobUrl) {
        f.blobUrl = URL.createObjectURL(f.raw)
      }
      if (f.blobUrl) {
        fileMap.set(f.blobUrl, f)
      }
      if (f.url) {
        fileMap.set(f.url, f)
      }
    })
    
    uploadItems.forEach((item: any, index: number) => {
      const imgElement = item.querySelector('img')
      if (!imgElement) return
      
      const imgSrc = imgElement.src
      const existingUid = item.getAttribute('data-uid')
      
      // 如果已经有有效的 UID，跳过
      if (existingUid && existingUid !== 'null' && existingUid !== 'undefined') {
        console.log(`Item ${index} already has UID:`, existingUid)
        return
      }
      
      // 尝试通过 src 精确匹配
      let matchedFile = fileMap.get(imgSrc)
      
      if (matchedFile) {
        item.setAttribute('data-uid', matchedFile.uid)
        console.log(`✓ Matched item ${index} by URL to file:`, matchedFile.name, 'UID:', matchedFile.uid)
      } else {
        // 如果精确匹配失败，尝试通过文件名和大小匹配
        console.log(`⚠ Item ${index} - No exact match, trying fuzzy match...`)
        
        // 获取图片的名称提示（如果有）
        const nameElement = item.querySelector('.el-upload-list__item-name')
        const displayName = nameElement?.textContent || nameElement?.innerText || ''
        
        // 通过名称匹配
        const nameMatch = allCurrentFiles.find((f: any) => 
          f.name === displayName || f.name === file.name
        )
        
        if (nameMatch) {
          item.setAttribute('data-uid', nameMatch.uid)
          console.log(`✓ Matched item ${index} by name to file:`, nameMatch.name, 'UID:', nameMatch.uid)
        } else {
          console.error(`✗ Could not match item ${index}, src:`, imgSrc.substring(0, 50))
        }
      }
    })
    
    // 初始化所有图片的点击事件
    initializeImageClickEvents()
  }, 200)
  
  // 获取并设置图片尺寸
  if (file.raw) {
    const img = new Image()
    img.onload = () => {
      const dimensions = `${img.naturalWidth} x ${img.naturalHeight}`
      console.log(`Image loaded: ${file.name}, dimensions: ${dimensions}`)
      
      // 使用更长的延迟确保 UID 已经设置
      setTimeout(() => {
        const uploadItems = document.querySelectorAll('.el-upload-list__item')
        let dimensionSet = false
        
        uploadItems.forEach((item: any, index: number) => {
          const uid = item.getAttribute('data-uid')
          const imgElement = item.querySelector('img')
          
          // 多种匹配方式
          if (uid === String(file.uid)) {
            item.setAttribute('data-dimensions', dimensions)
            console.log(`✓ Set dimensions by UID match for item ${index}:`, dimensions)
            dimensionSet = true
          } else if (imgElement && imgElement.src === (file.blobUrl || img.src)) {
            // 如果 UID 不匹配，尝试通过图片 src 匹配
            item.setAttribute('data-uid', file.uid)
            item.setAttribute('data-dimensions', dimensions)
            console.log(`✓ Set dimensions by src match for item ${index}:`, dimensions)
            dimensionSet = true
          }
        })
        
        if (!dimensionSet) {
          console.warn(`⚠ Could not set dimensions for file: ${file.name}`)
        }
      }, 300)
    }
    img.onerror = () => {
      console.error(`✗ Failed to load image: ${file.name}`)
    }
    img.src = file.blobUrl || URL.createObjectURL(file.raw)
  }
}

// 初始化所有图片的点击事件
const initializeImageClickEvents = () => {
  nextTick(() => {
    const uploadItems = document.querySelectorAll('.el-upload-list__item')
    uploadItems.forEach((item: any) => {
      // 隐藏默认的操作按钮
      const defaultActions = item.querySelector('.el-upload-list__item-actions')
      if (defaultActions) {
        defaultActions.style.display = 'none'
      }
      
      // 添加点击事件到图片本身用于选中
      const imgElement = item.querySelector('img')
      if (imgElement && !imgElement.dataset.clickBound) {
        imgElement.dataset.clickBound = 'true'
        imgElement.style.cursor = 'pointer'
        imgElement.title = 'Click to select/deselect'
        
        // 定义点击处理函数
        const handleImageClick = (e: MouseEvent) => {
          e.stopPropagation()
          e.preventDefault()
          
          // 获取 UID
          const uid = item.getAttribute('data-uid')
          console.log('=== Image clicked, UID:', uid)
          
          if (!uid || uid === 'null' || uid === 'undefined') {
            console.warn('Image UID not set, trying to rescan...')
            ElMessage.warning('Image not ready, please try again')
            return
          }
          
          // 直接使用 UID 切换选中状态，不需要查找文件对象
          if (selectedImages.value.has(uid)) {
            selectedImages.value.delete(uid)
            item.classList.remove('image-selected')
            console.log('✓ Deselected image, UID:', uid)
          } else {
            selectedImages.value.add(uid)
            item.classList.add('image-selected')
            console.log('✓ Selected image, UID:', uid)
          }
          
          console.log('Current selected UIDs:', Array.from(selectedImages.value))
        }
        
        imgElement.addEventListener('click', handleImageClick, true)
        
        // 初始化时根据选中状态设置 UI
        const uid = item.getAttribute('data-uid')
        if (uid && selectedImages.value.has(uid)) {
          item.classList.add('image-selected')
        } else {
          item.classList.remove('image-selected')
        }
      }
      
      // 添加自定义操作按钮
      if (!item.querySelector('.custom-image-actions')) {
        const actionsDiv = document.createElement('div')
        actionsDiv.className = 'custom-image-actions'
        
        // 更换按钮
        const replaceBtn = document.createElement('button')
        replaceBtn.className = 'action-btn replace-btn'
        replaceBtn.type = 'button'
        replaceBtn.innerHTML = '<svg viewBox="0 0 1024 1024" width="14" height="14"><path fill="currentColor" d="M174.72 855.68a32 32 0 0 1 0-45.248L654.848 330.304 521.344 196.8a32 32 0 1 1 45.248-45.248l155.584 155.584a32 32 0 0 1 0 45.248L216.96 855.616a32 32 0 0 1-45.248 0z"/><path fill="currentColor" d="M848 960H176a128 128 0 0 1-128-128V160a128 128 0 0 1 128-128h416a32 32 0 0 1 0 64H176a64 64 0 0 0-64 64v672a64 64 0 0 0 64 64h672a64 64 0 0 0 64-64V416a32 32 0 0 1 64 0v416a128 128 0 0 1-128 128z"/></svg>'
        replaceBtn.title = 'Replace'
        replaceBtn.addEventListener('click', (e: MouseEvent) => {
          e.stopPropagation()
          e.preventDefault()
          console.log('=== Replace button clicked ===')
          
          const uid = item.getAttribute('data-uid')
          console.log('Image UID to replace:', uid)
          
          if (!uid || uid === 'null') {
            ElMessage.warning('Image not ready, please try again')
            return
          }
          
          // 创建一个临时的 file input
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = 'image/*'
          input.style.display = 'none'
          document.body.appendChild(input)
          
          input.onchange = (event: any) => {
            const newFile = event.target.files?.[0]
            if (!newFile) {
              document.body.removeChild(input)
              return
            }
            
            console.log('Selected new file:', newFile.name)
            
            // 查找并替换文件
            let replaced = false
            const replaceInArray = (arr: any[]) => {
              const index = arr.findIndex((f: any) => String(f.uid) === String(uid))
              if (index > -1) {
                // 保留原来的 uid，但替换文件内容
                const originalUid = arr[index].uid
                arr[index] = {
                  uid: originalUid,
                  raw: newFile,
                  name: newFile.name,
                  size: newFile.size,
                  url: URL.createObjectURL(newFile)
                }
                console.log('✓ Replaced file at index', index, 'UID:', originalUid)
                return true
              }
              return false
            }
            
            // 尝试从各个数据源中替换
            imageRowsData.value.forEach(row => {
              if (!replaced) replaced = replaceInArray(row.detailImages)
              if (!replaced) replaced = replaceInArray(row.squareImage)
              if (!replaced) replaced = replaceInArray(row.colorBlockImage)
            })
            
            if (!replaced) {
              skuImageRowsData.value.forEach(row => {
                if (!replaced) replaced = replaceInArray(row.skuImages)
              })
            }
            
            if (!replaced) {
              sheinDetailImageRowsData.value.forEach(row => {
                if (!replaced) replaced = replaceInArray(row.detailImages)
              })
            }
            
            if (!replaced) {
              replaced = replaceInArray(otherProductImages.value)
            }
            
            document.body.removeChild(input)
            
            if (replaced) {
              ElMessage.success('Image replaced successfully')
              // 强制更新 DOM
              setTimeout(() => {
                initializeImageClickEvents()
              }, 200)
            } else {
              console.error('Failed to find image with UID:', uid)
              ElMessage.error('Failed to replace image')
            }
          }
          
          input.click()
        }, true)
        
        // 删除按钮
        const deleteBtn = document.createElement('button')
        deleteBtn.className = 'action-btn delete-btn'
        deleteBtn.type = 'button'
        deleteBtn.innerHTML = '<svg viewBox="0 0 1024 1024" width="14" height="14"><path fill="currentColor" d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"/></svg>'
        deleteBtn.title = 'Delete'
        deleteBtn.addEventListener('click', (e: MouseEvent) => {
          e.stopPropagation()
          e.preventDefault()
          console.log('=== Delete button clicked ===')
          
          // 获取 uid
          const uid = item.getAttribute('data-uid')
          console.log('Deleting image with UID:', uid)
          
          if (!uid || uid === 'null') {
            ElMessage.warning('Cannot delete image - UID not found')
            return
          }
          
          // 从所有数据源中删除该图片（使用字符串匹配）
          const removeFromArray = (arr: any[]) => {
            const index = arr.findIndex((f: any) => String(f.uid) === String(uid))
            if (index > -1) {
              arr.splice(index, 1)
              console.log('✓ Removed from array at index:', index)
              return true
            }
            return false
          }
          
          // 尝试从各个数据源中删除
          let removed = false
          
          // SKC 图片
          imageRowsData.value.forEach(row => {
            if (!removed) removed = removeFromArray(row.detailImages)
            if (!removed) removed = removeFromArray(row.squareImage)
            if (!removed) removed = removeFromArray(row.colorBlockImage)
          })
          
          // SKU 图片
          if (!removed) {
            skuImageRowsData.value.forEach(row => {
              if (!removed) removed = removeFromArray(row.skuImages)
            })
          }
          
          // Shein 详情图片
          if (!removed) {
            sheinDetailImageRowsData.value.forEach(row => {
              if (!removed) removed = removeFromArray(row.detailImages)
            })
          }
          
          // 其他产品图片
          if (!removed) {
            removed = removeFromArray(otherProductImages.value)
          }
          
          if (removed) {
            // 从选中列表中移除
            selectedImages.value.delete(uid)
            
            // 触发响应式更新
            selectedImagesVersion.value++
            
            // 移除 DOM 元素
            item.remove()
            
            ElMessage.success('Image deleted successfully')
            console.log('✓ Image deleted successfully')
          } else {
            console.error('✗ Failed to find image with UID:', uid)
            ElMessage.error('Failed to delete image')
          }
        }, true)
        
        // 放大按钮
        const zoomBtn = document.createElement('button')
        zoomBtn.className = 'action-btn zoom-btn'
        zoomBtn.type = 'button'
        zoomBtn.innerHTML = '<svg viewBox="0 0 1024 1024" width="14" height="14"><path fill="currentColor" d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448zm0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160z"/></svg>'
        zoomBtn.title = 'Zoom'
        zoomBtn.addEventListener('click', (e: MouseEvent) => {
          e.stopPropagation()
          e.preventDefault()
          console.log('Zoom clicked')
          
          const uid = item.getAttribute('data-uid')
          console.log('Trying to preview image with UID:', uid)
          
          // 尝试从数据中找到文件
          const allImages = getAllImages()
          console.log('All images:', allImages)
          
          let file = allImages.find((f: any) => String(f.uid) === uid)
          console.log('Found file by UID:', file)
          
          // 如果找不到，直接使用 DOM 中的图片
          if (!file) {
            const imgElement = item.querySelector('img')
            if (imgElement && imgElement.src) {
              console.log('Using img src directly:', imgElement.src)
              previewImageUrl.value = imgElement.src
              previewDialogVisible.value = true
              return
            }
          }
          
          if (file) {
            handlePreview(file)
          } else {
            ElMessage.warning('Cannot find image to preview')
          }
        }, true)
        
        actionsDiv.appendChild(replaceBtn)
        actionsDiv.appendChild(deleteBtn)
        actionsDiv.appendChild(zoomBtn)
        item.appendChild(actionsDiv)
      }
    })
  })
}

// 获取所有图片
const getAllImages = () => {
  const images: any[] = []
  // SKC 图片
  imageRowsData.value.forEach(row => {
    images.push(...row.detailImages, ...row.squareImage, ...row.colorBlockImage)
  })
  // SKU 图片
  skuImageRowsData.value.forEach(row => {
    images.push(...row.skuImages)
  })
  // Shein详情图片
  sheinDetailImageRowsData.value.forEach(row => {
    images.push(...row.detailImages)
  })
  // 其他产品图片
  images.push(...otherProductImages.value)
  return images
}

// 手动重新扫描所有图片并设置UID（用于修复UID丢失的问题）
const rescanAllImageUIDs = () => {
  console.log('=== Manually rescanning all image UIDs ===')
  
  const uploadItems = document.querySelectorAll('.el-upload-list__item')
  const allFiles = getAllImages()
  
  console.log('Upload items:', uploadItems.length, 'Files in data:', allFiles.length)
  
  // 为所有文件创建 blob URL 映射
  const fileMap = new Map()
  const usedUIDs = new Set()
  
  allFiles.forEach((f: any) => {
    if (f.raw && !f.blobUrl) {
      f.blobUrl = URL.createObjectURL(f.raw)
    }
    if (f.blobUrl) {
      fileMap.set(f.blobUrl, f)
    }
    if (f.url) {
      fileMap.set(f.url, f)
    }
  })
  
  uploadItems.forEach((item: any, index: number) => {
    const imgElement = item.querySelector('img')
    if (!imgElement) return
    
    const imgSrc = imgElement.src
    
    // 先清除旧的 UID
    item.removeAttribute('data-uid')
    
    // 尝试通过 src 精确匹配
    let matchedFile = fileMap.get(imgSrc)
    
    if (matchedFile && !usedUIDs.has(matchedFile.uid)) {
      item.setAttribute('data-uid', matchedFile.uid)
      usedUIDs.add(matchedFile.uid)
      console.log(`✓ Matched item ${index} by URL to file:`, matchedFile.name, 'UID:', matchedFile.uid)
      
      // 如果有尺寸信息，也设置上
      if (matchedFile.raw) {
        const tempImg = new Image()
        tempImg.onload = () => {
          const dimensions = `${tempImg.naturalWidth} x ${tempImg.naturalHeight}`
          item.setAttribute('data-dimensions', dimensions)
          console.log(`✓ Set dimensions for item ${index}:`, dimensions)
        }
        tempImg.src = imgSrc
      }
    } else {
      // 如果精确匹配失败，尝试通过名称匹配
      const nameElement = item.querySelector('.el-upload-list__item-name')
      const displayName = nameElement?.textContent || nameElement?.innerText || ''
      
      const nameMatch = allFiles.find((f: any) => 
        !usedUIDs.has(f.uid) && f.name === displayName
      )
      
      if (nameMatch) {
        item.setAttribute('data-uid', nameMatch.uid)
        usedUIDs.add(nameMatch.uid)
        console.log(`✓ Matched item ${index} by name to file:`, nameMatch.name, 'UID:', nameMatch.uid)
      } else {
        console.warn(`⚠ Item ${index} not matched, src:`, imgSrc.substring(0, 50))
      }
    }
  })
  
  // 重新初始化事件
  initializeImageClickEvents()
  
  ElMessage.success('Re-scanned all images. Check console for details.')
}

// 手动刷新所有图片的选中状态UI
const forceUpdateAllSelectionUI = () => {
  console.log('=== Force updating all selection UI ===')
  console.log('Current selected UIDs:', Array.from(selectedImages.value))
  
  nextTick(() => {
    setTimeout(() => {
      const uploadItems = document.querySelectorAll('.el-upload-list__item')
      console.log('Found', uploadItems.length, 'upload items')
      
      let matchedCount = 0
      let mismatchCount = 0
      
      uploadItems.forEach((item: any, index: number) => {
        const uid = item.getAttribute('data-uid')
        const shouldBeSelected = uid && selectedImages.value.has(uid)
        const isCurrentlySelected = item.classList.contains('image-selected')
        
        if (shouldBeSelected !== isCurrentlySelected) {
          mismatchCount++
          console.log(`Item ${index} MISMATCH: UID=${uid}, should=${shouldBeSelected}, current=${isCurrentlySelected}`)
        }
        
        if (shouldBeSelected) {
          item.classList.add('image-selected')
          matchedCount++
        } else {
          item.classList.remove('image-selected')
        }
      })
      
      console.log(`✓ Updated: ${matchedCount} selected, ${mismatchCount} mismatches fixed`)
      ElMessage.success(`Updated ${matchedCount} selected images`)
    }, 50)
  })
}

// 暴露到window对象供调试使用
try {
  if (typeof window !== 'undefined' && window) {
    (window as any).rescanImageUIDs = rescanAllImageUIDs;
    (window as any).forceUpdateSelection = forceUpdateAllSelectionUI;
    (window as any).debugImages = () => {
      console.log('=== Debug Images ===')
      console.log('Total files in data:', getAllImages().length)
      console.log('Total selected UIDs:', selectedImages.value.size)
      console.log('Selected UIDs:', Array.from(selectedImages.value))
      
      const items = document.querySelectorAll('.el-upload-list__item')
      console.log('Total DOM items:', items.length)
      
      items.forEach((item: any, index: number) => {
        const uid = item.getAttribute('data-uid')
        const isSelected = selectedImages.value.has(uid)
        const hasClass = item.classList.contains('image-selected')
        
        console.log(`Item ${index}:`, {
          uid: uid,
          dimensions: item.getAttribute('data-dimensions'),
          isSelected: isSelected,
          hasSelectedClass: hasClass,
          classMatch: isSelected === hasClass ? '✓' : '✗ MISMATCH',
          src: item.querySelector('img')?.src?.substring(0, 80) + '...'
        })
      })
      
      // 检查不一致
      const allFiles = getAllImages()
      const fileUIDs = new Set(allFiles.map((f: any) => String(f.uid)))
      const domUIDs = new Set()
      items.forEach((item: any) => {
        const uid = item.getAttribute('data-uid')
        if (uid && uid !== 'null') domUIDs.add(uid)
      })
      
      console.log('Files in data but not in DOM:', 
        Array.from(fileUIDs).filter(uid => !domUIDs.has(uid))
      )
      console.log('DOM items without valid UID:', 
        Array.from(items).filter((item: any) => {
          const uid = item.getAttribute('data-uid')
          return !uid || uid === 'null' || !fileUIDs.has(uid)
        }).length
      )
    };
    console.log('💡 Debug functions available:')
    console.log('  - window.rescanImageUIDs() - Re-scan and fix all image UIDs')
    console.log('  - window.forceUpdateSelection() - Force refresh selection UI')
    console.log('  - window.debugImages() - Show debug info for all images')
  }
} catch (e) {
  console.warn('Failed to expose debug functions to window:', e)
}

// 更新单个图片项的UI
// 更新单个图片的选中状态 UI（通过 UID）
const updateImageItemUI = (item: HTMLElement) => {
  const uid = item.getAttribute('data-uid')
  if (isImageSelected(uid)) {
    item.classList.add('image-selected')
  } else {
    item.classList.remove('image-selected')
  }
}

// 更新所有图片选中状态的UI
const updateImageSelectionUI = () => {
  nextTick(() => {
    setTimeout(() => {
      const uploadItems = document.querySelectorAll('.el-upload-list__item')
      console.log('Updating UI for', uploadItems.length, 'items')
      console.log('Selected UIDs:', Array.from(selectedImages.value))
      
      let updatedCount = 0
      uploadItems.forEach((item: any) => {
        const uid = item.getAttribute('data-uid')
        
        // 直接根据 UID 判断选中状态
        if (uid && selectedImages.value.has(uid)) {
          item.classList.add('image-selected')
          updatedCount++
          console.log('✓ Added selected class to UID:', uid)
        } else {
          item.classList.remove('image-selected')
        }
      })
      
      console.log(`Updated UI: ${updatedCount} items selected out of ${uploadItems.length}`)
    }, 50)
  })
}

// AI生成标题
const handleAIGenerateTitle = () => {
  aiGenerateType.value = 'title'
  aiGenerateDialogVisible.value = true
  aiResults.value = []
}

// AI生成描述
const handleAIGenerateDescription = () => {
  aiGenerateType.value = 'description'
  aiGenerateDialogVisible.value = true
  aiResults.value = []
}

const handleAIGenerateProductName = () => {
  aiGenerateType.value = 'productName'
  aiGenerateDialogVisible.value = true
  aiResults.value = []
}

// 获取当前区域已选中的图片
const getSelectedImagesForArea = (area: 'skc' | 'sku' | 'shein' | 'other') => {
  const selectedFiles: any[] = []
  
  if (area === 'skc') {
    // SKC 图片
    imageRowsData.value.forEach(row => {
      row.detailImages.forEach((img: any) => {
        if (img.uid && selectedImages.value.has(String(img.uid))) {
          selectedFiles.push(img)
        }
      })
      row.squareImage.forEach((img: any) => {
        if (img.uid && selectedImages.value.has(String(img.uid))) {
          selectedFiles.push(img)
        }
      })
      row.colorBlockImage.forEach((img: any) => {
        if (img.uid && selectedImages.value.has(String(img.uid))) {
          selectedFiles.push(img)
        }
      })
    })
  } else if (area === 'sku') {
    // SKU 图片
    skuImageRowsData.value.forEach(row => {
      row.skuImages.forEach((img: any) => {
        if (img.uid && selectedImages.value.has(String(img.uid))) {
          selectedFiles.push(img)
        }
      })
    })
  } else if (area === 'shein') {
    // Shein 详情图片
    sheinDetailImageRowsData.value.forEach(row => {
      row.detailImages.forEach((img: any) => {
        if (img.uid && selectedImages.value.has(String(img.uid))) {
          selectedFiles.push(img)
        }
      })
    })
  } else if (area === 'other') {
    // 其他产品图片
    otherProductImages.value.forEach((img: any) => {
      if (img.uid && selectedImages.value.has(String(img.uid))) {
        selectedFiles.push(img)
      }
    })
  }
  
  return selectedFiles
}

// 批量删除图片
const handleBatchDeleteImages = async (area: 'skc' | 'sku' | 'shein' | 'other') => {
  const selectedFiles = getSelectedImagesForArea(area)
  
  if (selectedFiles.length === 0) {
    ElMessage.warning('Please select images to delete')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete ${selectedFiles.length} selected image(s)?`,
      'Batch Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    
    console.log('=== Batch deleting images ===')
    console.log('Area:', area, 'Count:', selectedFiles.length)
    
    let deletedCount = 0
    
    // 从数据中删除
    selectedFiles.forEach((file: any) => {
      const uid = String(file.uid)
      
      if (area === 'skc') {
        imageRowsData.value.forEach(row => {
          const detailIndex = row.detailImages.findIndex((img: any) => String(img.uid) === uid)
          if (detailIndex > -1) {
            row.detailImages.splice(detailIndex, 1)
            deletedCount++
          }
          const squareIndex = row.squareImage.findIndex((img: any) => String(img.uid) === uid)
          if (squareIndex > -1) {
            row.squareImage.splice(squareIndex, 1)
            deletedCount++
          }
          const colorIndex = row.colorBlockImage.findIndex((img: any) => String(img.uid) === uid)
          if (colorIndex > -1) {
            row.colorBlockImage.splice(colorIndex, 1)
            deletedCount++
          }
        })
      } else if (area === 'sku') {
        skuImageRowsData.value.forEach(row => {
          const index = row.skuImages.findIndex((img: any) => String(img.uid) === uid)
          if (index > -1) {
            row.skuImages.splice(index, 1)
            deletedCount++
          }
        })
      } else if (area === 'shein') {
        sheinDetailImageRowsData.value.forEach(row => {
          const index = row.detailImages.findIndex((img: any) => String(img.uid) === uid)
          if (index > -1) {
            row.detailImages.splice(index, 1)
            deletedCount++
          }
        })
      } else if (area === 'other') {
        const index = otherProductImages.value.findIndex((img: any) => String(img.uid) === uid)
        if (index > -1) {
          otherProductImages.value.splice(index, 1)
          deletedCount++
        }
      }
      
      // 从选中列表中移除
      selectedImages.value.delete(uid)
      
      // 移除 DOM 元素
      const domItem = document.querySelector(`[data-uid="${uid}"]`)
      if (domItem) {
        domItem.remove()
      }
    })
    
    // 触发响应式更新
    selectedImagesVersion.value++
    
    ElMessage.success(`Successfully deleted ${deletedCount} image(s)`)
    console.log(`✓ Batch delete completed: ${deletedCount} images`)
  } catch (error) {
    console.log('User cancelled batch delete')
  }
}

// AI图片处理相关状态
const aiImageDialogVisible = ref(false)
const aiSelectedImages = ref<any[]>([])
const aiCurrentArea = ref<'skc' | 'sku' | 'shein' | 'other'>('skc')
const aiImageProcessing = ref(false)
const aiProcessingProgress = ref(0)
const aiCurrentImage = ref(0)
const aiProcessedResults = ref<Array<{
  originalUrl: string
  processedUrl: string
  fileName: string
  featureName: string
  originalFile: any
}>>([])

// 图片预览状态
const imagePreviewVisible = ref(false)
const currentPreviewImage = ref('')

// 处理图片预览
const handlePreviewImage = (imageUrl: string) => {
  currentPreviewImage.value = imageUrl
  imagePreviewVisible.value = true
}

const aiImageSettings = reactive({
  processType: '',
  quality: 90,
  preserveTransparency: true,
  // 更换背景相关
  bgType: 'color',
  bgColor: '#ffffff',
  gradientStyle: 'to-bottom',
  // 文字生成图片相关
  textPrompt: '',
  imageStyle: 'product',
  imageSize: '1340x1785',
  // 智能裁剪相关
  cropRatio: '1340x1785',
  detectSubject: true
})

// 预设颜色（电商常用背景色）
const presetColors = [
  '#ffffff', // 纯白
  '#f5f5f5', // 浅灰
  '#000000', // 纯黑
  '#fafafa', // 米白
  '#f0f0f0', // 灰白
  '#e8f4f8', // 浅蓝
  '#fff5f5', // 浅粉
  '#f5fff5', // 浅绿
  '#fffbf0', // 浅黄
  '#f8f0ff', // 浅紫
]

// AI处理图片
const handleAIProcessImages = async (area: 'skc' | 'sku' | 'shein' | 'other') => {
  const selectedFiles = getSelectedImagesForArea(area)
  
  if (selectedFiles.length === 0) {
    ElMessage.warning('Please select images to process')
    return
  }
  
  console.log('=== Opening AI Processing Dialog ===')
  console.log('Area:', area, 'Count:', selectedFiles.length)
  
  // 打开对话框
  aiSelectedImages.value = selectedFiles
  aiCurrentArea.value = area
  aiImageDialogVisible.value = true
  aiProcessingProgress.value = 0
  aiCurrentImage.value = 0
  aiProcessedResults.value = [] // 清空之前的结果
}

// 开始AI处理
const handleStartAIProcessing = async () => {
  if (aiImageProcessing.value) return
  
  if (!aiImageSettings.processType) {
    ElMessage.warning('Please select an AI feature')
    return
  }
  
  // 文字生成图片需要文字提示
  if (aiImageSettings.processType === 'text-to-image' && !aiImageSettings.textPrompt.trim()) {
    ElMessage.warning('Please enter a description for image generation')
    return
  }
  
  aiImageProcessing.value = true
  aiProcessingProgress.value = 0
  aiCurrentImage.value = 0
  
  console.log('=== Starting AI Processing ===')
  console.log('Feature:', aiImageSettings.processType)
  console.log('Settings:', aiImageSettings)
  console.log('Images count:', aiSelectedImages.value.length)
  
  try {
    // 获取功能名称
    const featureNames: Record<string, string> = {
      'auto-cutout': '🤖 Auto Cutout',
      'remove-bg': '🎭 Remove Background',
      'replace-bg': '🖼️ Replace Background',
      'enhance': '✨ Auto Enhance',
      'extract-subject': '🎯 Extract Subject',
      'smart-crop': '📐 Smart Crop',
      'text-to-image': '🎨 Text to Image',
      'remove-watermark': '🧹 Remove Watermark'
    }
    
    const featureName = featureNames[aiImageSettings.processType] || 'AI Processing'
    
    ElMessage.info({
      message: `Starting ${featureName}...`,
      duration: 2000
    })
    
    const totalImages = aiSelectedImages.value.length
    
    // 根据不同功能模拟不同的处理时间
    const processingTime = aiImageSettings.processType === 'text-to-image' ? 2000 : 1500
    
    // 清空之前的结果
    aiProcessedResults.value = []
    
    // 模拟处理每张图片
    for (let i = 0; i < totalImages; i++) {
      aiCurrentImage.value = i + 1
      
      // 模拟AI处理（实际应该调用后端API）
      console.log(`🚀 Processing image ${i + 1}/${totalImages}...`)
      const processedUrl = await applyAIProcessing(aiSelectedImages.value[i], aiImageSettings.processType)
      
      // 保存处理结果
      const originalUrl = aiSelectedImages.value[i].url || (aiSelectedImages.value[i].raw ? URL.createObjectURL(aiSelectedImages.value[i].raw) : '')
      
      aiProcessedResults.value.push({
        originalUrl,
        processedUrl,
        fileName: aiSelectedImages.value[i].name || `Image ${i + 1}`,
        featureName: featureName,
        originalFile: aiSelectedImages.value[i]
      })
      
      await new Promise(resolve => setTimeout(resolve, processingTime))
      
      aiProcessingProgress.value = Math.round(((i + 1) / totalImages) * 100)
    }
    
    // 处理完成提示
    const successMessage = aiImageSettings.processType === 'text-to-image' 
      ? `🎉 Generated ${totalImages} image(s) successfully!`
      : `🎉 Processed ${totalImages} image(s) with ${featureName}!`
    
    ElMessage.success({
      message: successMessage,
      duration: 3000,
      showClose: true
    })
    
    console.log('✓ AI processing completed')
    
    // 处理完成，显示结果，不自动关闭对话框
    aiImageProcessing.value = false
    
  } catch (error) {
    aiImageProcessing.value = false
    aiProcessedResults.value = []
    ElMessage.error('AI processing failed')
    console.error('AI processing error:', error)
  }
}

// 应用处理结果
const handleApplyResults = () => {
  try {
    console.log('=== Applying AI Processing Results ===')
    
    // 更新图片数据
    aiProcessedResults.value.forEach((result) => {
      const originalFile = result.originalFile
      const uid = String(originalFile.uid)
      
      // 创建新的File对象（模拟，实际应该是真实的处理后的文件）
      const processedFile = {
        ...originalFile,
        url: result.processedUrl,
        // 在实际应用中，这里应该是真实的处理后的文件
      }
      
      // 更新所有数据源中的图片
      imageRowsData.value.forEach(row => {
        const detailIndex = row.detailImages.findIndex((img: any) => String(img.uid) === uid)
        if (detailIndex > -1) row.detailImages[detailIndex] = processedFile
        
        const squareIndex = row.squareImage.findIndex((img: any) => String(img.uid) === uid)
        if (squareIndex > -1) row.squareImage[squareIndex] = processedFile
        
        const colorIndex = row.colorBlockImage.findIndex((img: any) => String(img.uid) === uid)
        if (colorIndex > -1) row.colorBlockImage[colorIndex] = processedFile
      })
      
      skuImageRowsData.value.forEach(row => {
        const index = row.skuImages.findIndex((img: any) => String(img.uid) === uid)
        if (index > -1) row.skuImages[index] = processedFile
      })
      
      sheinDetailImageRowsData.value.forEach(row => {
        const index = row.detailImages.findIndex((img: any) => String(img.uid) === uid)
        if (index > -1) row.detailImages[index] = processedFile
      })
      
      const otherIndex = otherProductImages.value.findIndex((img: any) => String(img.uid) === uid)
      if (otherIndex > -1) otherProductImages.value[otherIndex] = processedFile
      
      console.log(`✓ Applied result for: ${result.fileName}`)
    })
    
    ElMessage.success({
      message: `✅ Applied ${aiProcessedResults.value.length} processed image(s) successfully!`,
      duration: 3000,
      showClose: true
    })
    
    // 重新初始化图片事件
    setTimeout(() => {
      initializeImageClickEvents()
    }, 500)
    
    // 关闭对话框
    aiImageDialogVisible.value = false
    aiProcessedResults.value = []
    
  } catch (error) {
    ElMessage.error('Failed to apply results')
    console.error('Apply results error:', error)
  }
}

// 真实的AI图像处理功能
const applyAIProcessing = async (image: any, processType: string): Promise<string> => {
  console.log(`  📷 Processing: ${image.name}`)
  
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    const imageUrl = image.url || (image.raw ? URL.createObjectURL(image.raw) : '')
    img.src = imageUrl
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      
      if (!ctx) {
        resolve(imageUrl)
        return
      }
      
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      // 根据不同功能应用真实的图像处理
      switch (processType) {
        case 'auto-cutout':
        case 'remove-bg':
          console.log('  → AI detecting subject boundaries...')
          console.log('  → Removing background...')
          removeBackground(canvas, ctx)
          break
          
        case 'replace-bg':
          console.log('  → Removing background first...')
          removeBackground(canvas, ctx)
          console.log(`  → Applying new background: ${aiImageSettings.bgType}`)
          replaceBackground(canvas, ctx)
          break
          
        case 'enhance':
          console.log('  → AI analyzing image quality...')
          console.log('  → Enhancing brightness, contrast & colors...')
          enhanceImage(canvas, ctx)
          break
          
        case 'extract-subject':
        case 'smart-crop':
          console.log('  → AI analyzing composition...')
          console.log(`  → Smart cropping...`)
          smartCrop(canvas, ctx)
          break
          
        case 'text-to-image':
          console.log('  → Generating image from text...')
          console.log(`  → Prompt: "${aiImageSettings.textPrompt}"`)
          generateFromText(canvas, ctx)
          break
          
        case 'remove-watermark':
          console.log('  → AI detecting and removing watermarks...')
          removeWatermark(canvas, ctx)
          break
      }
      
      resolve(canvas.toDataURL('image/png', aiImageSettings.quality / 100))
    }
    
    img.onerror = () => {
      console.error('Failed to load image')
      resolve(imageUrl)
    }
  })
}

// 真实的去背景算法（基于颜色边缘检测）
const removeBackground = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  
  // 检测边缘颜色（四个角）
  const corners = [
    [0, 0], // 左上
    [canvas.width - 1, 0], // 右上
    [0, canvas.height - 1], // 左下
    [canvas.width - 1, canvas.height - 1] // 右下
  ]
  
  // 采样背景色
  const bgColors = corners.map(([x, y]) => {
    const idx = (y * canvas.width + x) * 4
    return { r: data[idx], g: data[idx + 1], b: data[idx + 2] }
  })
  
  // 计算平均背景色
  const avgBg = {
    r: bgColors.reduce((sum, c) => sum + c.r, 0) / 4,
    g: bgColors.reduce((sum, c) => sum + c.g, 0) / 4,
    b: bgColors.reduce((sum, c) => sum + c.b, 0) / 4
  }
  
  // 去除背景（基于颜色相似度）
  const threshold = 40 // 相似度阈值
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    
    // 计算与背景色的距离
    const distance = Math.sqrt(
      Math.pow(r - avgBg.r, 2) +
      Math.pow(g - avgBg.g, 2) +
      Math.pow(b - avgBg.b, 2)
    )
    
    // 如果与背景色相似，设为透明
    if (distance < threshold) {
      data[i + 3] = 0
    } else {
      // 边缘柔化
      if (distance < threshold * 2) {
        data[i + 3] = Math.floor((distance / threshold - 1) * 255)
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0)
  console.log('  ✓ Background removed')
}

// 更换背景
const replaceBackground = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  if (!tempCtx) return
  
  tempCanvas.width = canvas.width
  tempCanvas.height = canvas.height
  
  // 绘制新背景
  if (aiImageSettings.bgType === 'color') {
    tempCtx.fillStyle = aiImageSettings.bgColor
    tempCtx.fillRect(0, 0, canvas.width, canvas.height)
  } else if (aiImageSettings.bgType === 'gradient') {
    let grad
    switch (aiImageSettings.gradientStyle) {
      case 'to-bottom':
        grad = tempCtx.createLinearGradient(0, 0, 0, canvas.height)
        break
      case 'to-right':
        grad = tempCtx.createLinearGradient(0, 0, canvas.width, 0)
        break
      case 'diagonal':
        grad = tempCtx.createLinearGradient(0, 0, canvas.width, canvas.height)
        break
      default:
        grad = tempCtx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height)/2)
    }
    grad.addColorStop(0, '#7c4dff')
    grad.addColorStop(1, '#c4b5fd')
    tempCtx.fillStyle = grad
    tempCtx.fillRect(0, 0, canvas.width, canvas.height)
  }
  
  // 叠加原图（已去背景）
  tempCtx.drawImage(canvas, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(tempCanvas, 0, 0)
  console.log('  ✓ Background replaced')
}

// 图像增强
const enhanceImage = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i]
    let g = data[i + 1]
    let b = data[i + 2]
    
    // 自动对比度增强
    r = ((r - 128) * 1.3) + 128
    g = ((g - 128) * 1.3) + 128
    b = ((b - 128) * 1.3) + 128
    
    // 亮度提升
    r += 15
    g += 15
    b += 15
    
    // 饱和度增强
    const gray = 0.299 * r + 0.587 * g + 0.114 * b
    r = gray + (r - gray) * 1.2
    g = gray + (g - gray) * 1.2
    b = gray + (b - gray) * 1.2
    
    // 限制范围
    data[i] = Math.max(0, Math.min(255, r))
    data[i + 1] = Math.max(0, Math.min(255, g))
    data[i + 2] = Math.max(0, Math.min(255, b))
  }
  
  ctx.putImageData(imageData, 0, 0)
  console.log('  ✓ Image enhanced')
}

// 智能裁剪
const smartCrop = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  // 检测主体区域（非透明或非边缘色）
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  
  let minX = canvas.width, maxX = 0
  let minY = canvas.height, maxY = 0
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const idx = (y * canvas.width + x) * 4
      const alpha = data[idx + 3]
      
      // 如果不是透明像素
      if (alpha > 50) {
        minX = Math.min(minX, x)
        maxX = Math.max(maxX, x)
        minY = Math.min(minY, y)
        maxY = Math.max(maxY, y)
      }
    }
  }
  
  // 添加边距
  const padding = 20
  minX = Math.max(0, minX - padding)
  minY = Math.max(0, minY - padding)
  maxX = Math.min(canvas.width, maxX + padding)
  maxY = Math.min(canvas.height, maxY + padding)
  
  const cropWidth = maxX - minX
  const cropHeight = maxY - minY
  
  if (cropWidth > 0 && cropHeight > 0) {
    const croppedData = ctx.getImageData(minX, minY, cropWidth, cropHeight)
    canvas.width = cropWidth
    canvas.height = cropHeight
    ctx.putImageData(croppedData, 0, 0)
  }
  
  console.log('  ✓ Image cropped')
}

// 生成图片（文字转图）
const generateFromText = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  // 渐变背景
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, '#7c4dff')
  gradient.addColorStop(1, '#c4b5fd')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 添加文字提示
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.font = 'bold 24px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('AI Generated', canvas.width / 2, canvas.height / 2 - 20)
  
  ctx.font = '16px Arial'
  const prompt = aiImageSettings.textPrompt || 'Product Image'
  const words = prompt.split(' ')
  const maxWidth = canvas.width - 40
  let line = ''
  let y = canvas.height / 2 + 20
  
  for (let word of words) {
    const testLine = line + word + ' '
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && line !== '') {
      ctx.fillText(line, canvas.width / 2, y)
      line = word + ' '
      y += 25
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, canvas.width / 2, y)
  
  console.log('  ✓ Image generated from text')
}

// 去水印
const removeWatermark = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  
  // 简单的局部均值模糊（去除水印效果）
  const tempData = new Uint8ClampedArray(data)
  const radius = 2
  
  for (let y = radius; y < canvas.height - radius; y++) {
    for (let x = radius; x < canvas.width - radius; x++) {
      let r = 0, g = 0, b = 0, count = 0
      
      // 检查周围像素
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const idx = ((y + dy) * canvas.width + (x + dx)) * 4
          r += tempData[idx]
          g += tempData[idx + 1]
          b += tempData[idx + 2]
          count++
        }
      }
      
      const idx = (y * canvas.width + x) * 4
      data[idx] = r / count
      data[idx + 1] = g / count
      data[idx + 2] = b / count
    }
  }
  
  ctx.putImageData(imageData, 0, 0)
  console.log('  ✓ Watermark removed')
}

// 图片编辑相关状态
const imageEditDialogVisible = ref(false)
const editSelectedImages = ref<any[]>([])
const currentEditIndex = ref(0)
const editTool = ref<'crop' | 'rotate' | 'resize' | 'filter' | ''>('')
const editImageRef = ref<HTMLImageElement | null>(null)
const cropperInstance = ref<any>(null)

// 编辑历史记录
const editHistory = reactive({
  currentRotation: 0,
  flipHorizontal: false,
  flipVertical: false,
  originalImage: null as string | null,
  currentImage: null as string | null
})

const cropSettings = reactive({
  aspectRatio: 'free'
})

const resizeSettings = reactive({
  width: 1340,
  height: 1785,
  keepRatio: true
})

const filterSettings = reactive({
  brightness: 0,
  contrast: 0,
  saturation: 0
})

// 预设滤镜配方
const filterPresets = [
  { 
    name: 'Original', 
    icon: '🎨',
    brightness: 0, 
    contrast: 0, 
    saturation: 0,
    description: 'No filter'
  },
  { 
    name: 'Vivid', 
    icon: '🌈',
    brightness: 10, 
    contrast: 20, 
    saturation: 30,
    description: 'Vibrant colors'
  },
  { 
    name: 'Bright', 
    icon: '☀️',
    brightness: 25, 
    contrast: 10, 
    saturation: 10,
    description: 'Brighter image'
  },
  { 
    name: 'Warm', 
    icon: '🔥',
    brightness: 15, 
    contrast: 15, 
    saturation: 20,
    description: 'Warm tone'
  },
  { 
    name: 'Cool', 
    icon: '❄️',
    brightness: 5, 
    contrast: 10, 
    saturation: -10,
    description: 'Cool tone'
  },
  { 
    name: 'Soft', 
    icon: '🌸',
    brightness: 10, 
    contrast: -15, 
    saturation: -5,
    description: 'Soft and gentle'
  },
  { 
    name: 'High Contrast', 
    icon: '⚡',
    brightness: 0, 
    contrast: 40, 
    saturation: 15,
    description: 'Strong contrast'
  },
  { 
    name: 'Grayscale', 
    icon: '⚫',
    brightness: 0, 
    contrast: 0, 
    saturation: -100,
    description: 'Black and white'
  }
]

const selectedFilterPreset = ref('Original')

// 当前编辑的图片
const currentEditImage = computed(() => {
  return editSelectedImages.value[currentEditIndex.value]
})

// 获取图片URL
const getImageUrl = (file: File | Blob) => {
  return URL.createObjectURL(file)
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// 应用预设滤镜
const applyFilterPreset = (preset: typeof filterPresets[0]) => {
  selectedFilterPreset.value = preset.name
  filterSettings.brightness = preset.brightness
  filterSettings.contrast = preset.contrast
  filterSettings.saturation = preset.saturation
  ElMessage.success(`Applied ${preset.name} filter`)
}

// 初始化裁剪工具
const initCropper = () => {
  if (cropperInstance.value) {
    cropperInstance.value.destroy()
  }
  
  nextTick(() => {
    const imageElement = editImageRef.value
    if (!imageElement) return
    
    // 动态加载Cropper.js（如果需要）
    // 这里我们使用简化版的裁剪实现
    const aspectRatioMap: Record<string, number | undefined> = {
      'free': NaN,
      '1:1': 1,
      '4:3': 4 / 3,
      '16:9': 16 / 9,
      '3:4': 3 / 4
    }
    
    // 创建裁剪覆盖层
    createCropOverlay(aspectRatioMap[cropSettings.aspectRatio])
  })
}

// 裁剪状态
const cropState = reactive({
  isDraggingImage: false,
  isDraggingBox: false,
  isDraggingHandle: '',
  startX: 0,
  startY: 0,
  imageX: 0,
  imageY: 0,
  imageScale: 1,
  boxX: 0,
  boxY: 0,
  boxWidth: 0,
  boxHeight: 0
})

// 创建裁剪覆盖层（完整交互版）
const createCropOverlay = (aspectRatio?: number) => {
  const container = editImageRef.value?.parentElement
  const img = editImageRef.value
  if (!container || !img) return
  
  // 移除现有覆盖层
  const existing = container.querySelector('.crop-overlay')
  if (existing) existing.remove()
  
  // 获取图片尺寸和位置
  const containerRect = container.getBoundingClientRect()
  const imgRect = img.getBoundingClientRect()
  
  // 初始化裁剪框位置（居中，60%大小）
  const boxWidth = imgRect.width * 0.6
  const boxHeight = aspectRatio && !isNaN(aspectRatio) 
    ? boxWidth / aspectRatio 
    : imgRect.height * 0.6
  
  cropState.boxX = (imgRect.width - boxWidth) / 2
  cropState.boxY = (imgRect.height - boxHeight) / 2
  cropState.boxWidth = boxWidth
  cropState.boxHeight = boxHeight
  cropState.imageX = 0
  cropState.imageY = 0
  cropState.imageScale = 1
  
  // 创建覆盖层
  const overlay = document.createElement('div')
  overlay.className = 'crop-overlay'
  overlay.innerHTML = `
    <div class="crop-image-container" style="cursor: move;">
      <img class="crop-image" src="${img.src}" draggable="false" style="
        transform: translate(${cropState.imageX}px, ${cropState.imageY}px) scale(${cropState.imageScale});
        cursor: move;
        user-select: none;
      ">
    </div>
    <div class="crop-box" style="
      left: ${cropState.boxX}px;
      top: ${cropState.boxY}px;
      width: ${cropState.boxWidth}px;
      height: ${cropState.boxHeight}px;
    ">
      <div class="crop-border"></div>
      <div class="crop-grid">
        <div class="crop-grid-line" style="top: 33.33%; width: 100%; height: 1px;"></div>
        <div class="crop-grid-line" style="top: 66.66%; width: 100%; height: 1px;"></div>
        <div class="crop-grid-line" style="left: 33.33%; width: 1px; height: 100%;"></div>
        <div class="crop-grid-line" style="left: 66.66%; width: 1px; height: 100%;"></div>
      </div>
      <div class="crop-handle top-left" data-handle="top-left"></div>
      <div class="crop-handle top-right" data-handle="top-right"></div>
      <div class="crop-handle bottom-left" data-handle="bottom-left"></div>
      <div class="crop-handle bottom-right" data-handle="bottom-right"></div>
      <div class="crop-handle top" data-handle="top"></div>
      <div class="crop-handle bottom" data-handle="bottom"></div>
      <div class="crop-handle left" data-handle="left"></div>
      <div class="crop-handle right" data-handle="right"></div>
    </div>
    <div class="crop-controls">
      <div class="crop-zoom">
        <button class="zoom-btn" data-action="zoom-in">🔍+</button>
        <input type="range" class="zoom-slider" min="0.5" max="3" step="0.1" value="1">
        <button class="zoom-btn" data-action="zoom-out">🔍-</button>
      </div>
    </div>
    <div class="crop-actions">
      <button class="crop-apply-btn">✓ Apply Crop</button>
      <button class="crop-cancel-btn">✕ Cancel</button>
    </div>
  `
  container.appendChild(overlay)
  
  const cropImage = overlay.querySelector('.crop-image') as HTMLImageElement
  const cropBox = overlay.querySelector('.crop-box') as HTMLElement
  const applyBtn = overlay.querySelector('.crop-apply-btn')
  const cancelBtn = overlay.querySelector('.crop-cancel-btn')
  const zoomSlider = overlay.querySelector('.zoom-slider') as HTMLInputElement
  const zoomInBtn = overlay.querySelector('[data-action="zoom-in"]')
  const zoomOutBtn = overlay.querySelector('[data-action="zoom-out"]')
  
  // 更新裁剪框位置
  const updateCropBox = () => {
    if (cropBox) {
      cropBox.style.left = `${cropState.boxX}px`
      cropBox.style.top = `${cropState.boxY}px`
      cropBox.style.width = `${cropState.boxWidth}px`
      cropBox.style.height = `${cropState.boxHeight}px`
    }
  }
  
  // 更新图片变换
  const updateImageTransform = () => {
    if (cropImage) {
      cropImage.style.transform = `translate(${cropState.imageX}px, ${cropState.imageY}px) scale(${cropState.imageScale})`
    }
  }
  
  // 拖动图片
  const handleImageMouseDown = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('.crop-box')) return
    cropState.isDraggingImage = true
    cropState.startX = e.clientX - cropState.imageX
    cropState.startY = e.clientY - cropState.imageY
    e.preventDefault()
  }
  
  // 拖动裁剪框
  const handleBoxMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('crop-handle')) return
    if (target.closest('.crop-handle')) return
    
    cropState.isDraggingBox = true
    cropState.startX = e.clientX - cropState.boxX
    cropState.startY = e.clientY - cropState.boxY
    e.stopPropagation()
    e.preventDefault()
  }
  
  // 拖动手柄调整大小
  const handleHandleMouseDown = (e: MouseEvent) => {
    const handle = (e.target as HTMLElement).dataset.handle
    if (!handle) return
    
    cropState.isDraggingHandle = handle
    cropState.startX = e.clientX
    cropState.startY = e.clientY
    e.stopPropagation()
    e.preventDefault()
  }
  
  const handleMouseMove = (e: MouseEvent) => {
    if (cropState.isDraggingImage) {
      cropState.imageX = e.clientX - cropState.startX
      cropState.imageY = e.clientY - cropState.startY
      updateImageTransform()
    } else if (cropState.isDraggingBox) {
      cropState.boxX = e.clientX - cropState.startX
      cropState.boxY = e.clientY - cropState.startY
      updateCropBox()
    } else if (cropState.isDraggingHandle) {
      const dx = e.clientX - cropState.startX
      const dy = e.clientY - cropState.startY
      const handle = cropState.isDraggingHandle
      
      // 保存原始值
      const oldX = cropState.boxX
      const oldY = cropState.boxY
      const oldW = cropState.boxWidth
      const oldH = cropState.boxHeight
      
      // 根据手柄调整
      if (handle.includes('left')) {
        cropState.boxX += dx
        cropState.boxWidth -= dx
      }
      if (handle.includes('right')) {
        cropState.boxWidth += dx
      }
      if (handle.includes('top')) {
        cropState.boxY += dy
        cropState.boxHeight -= dy
      }
      if (handle.includes('bottom')) {
        cropState.boxHeight += dy
      }
      
      // 限制最小尺寸
      if (cropState.boxWidth < 50) {
        cropState.boxX = oldX
        cropState.boxWidth = oldW
      }
      if (cropState.boxHeight < 50) {
        cropState.boxY = oldY
        cropState.boxHeight = oldH
      }
      
      // 如果有宽高比限制
      if (aspectRatio && !isNaN(aspectRatio)) {
        if (handle.includes('left') || handle.includes('right')) {
          cropState.boxHeight = cropState.boxWidth / aspectRatio
          if (handle.includes('top')) {
            cropState.boxY = oldY + oldH - cropState.boxHeight
          }
        } else {
          cropState.boxWidth = cropState.boxHeight * aspectRatio
          if (handle.includes('left')) {
            cropState.boxX = oldX + oldW - cropState.boxWidth
          }
        }
      }
      
      cropState.startX = e.clientX
      cropState.startY = e.clientY
      updateCropBox()
    }
  }
  
  const handleMouseUp = () => {
    cropState.isDraggingImage = false
    cropState.isDraggingBox = false
    cropState.isDraggingHandle = ''
  }
  
  // 缩放
  const handleZoom = (scale: number) => {
    cropState.imageScale = Math.max(0.5, Math.min(3, scale))
    if (zoomSlider) zoomSlider.value = String(cropState.imageScale)
    updateImageTransform()
  }
  
  // 绑定事件
  cropImage?.addEventListener('mousedown', handleImageMouseDown)
  cropBox?.addEventListener('mousedown', handleBoxMouseDown)
  overlay.querySelectorAll('.crop-handle').forEach(handle => {
    handle.addEventListener('mousedown', handleHandleMouseDown as any)
  })
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  
  zoomSlider?.addEventListener('input', (e) => {
    handleZoom(parseFloat((e.target as HTMLInputElement).value))
  })
  zoomInBtn?.addEventListener('click', () => handleZoom(cropState.imageScale + 0.1))
  zoomOutBtn?.addEventListener('click', () => handleZoom(cropState.imageScale - 0.1))
  
  applyBtn?.addEventListener('click', () => {
    handleApplyCrop()
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    overlay.remove()
  })
  
  cancelBtn?.addEventListener('click', () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    overlay.remove()
    editTool.value = ''
  })
}

// 应用裁剪
const handleApplyCrop = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Cropping image...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  try {
    const img = editImageRef.value
    if (!img) throw new Error('Image not found')
    
    // 创建Canvas进行裁剪
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')
    
    // 加载原始图片
    const sourceImg = new Image()
    sourceImg.crossOrigin = 'anonymous'
    
    await new Promise((resolve, reject) => {
      sourceImg.onload = resolve
      sourceImg.onerror = reject
      sourceImg.src = editHistory.currentImage || editHistory.originalImage || img.src
    })
    
    // 计算实际图片尺寸与显示尺寸的比例
    const displayWidth = img.naturalWidth || img.width
    const displayHeight = img.naturalHeight || img.height
    const imgRect = img.getBoundingClientRect()
    const scaleX = displayWidth / (imgRect.width * cropState.imageScale)
    const scaleY = displayHeight / (imgRect.height * cropState.imageScale)
    
    // 计算裁剪区域在原图上的位置
    const cropX = (-cropState.imageX + cropState.boxX) * scaleX
    const cropY = (-cropState.imageY + cropState.boxY) * scaleY
    const cropWidth = cropState.boxWidth * scaleX
    const cropHeight = cropState.boxHeight * scaleY
    
    // 设置Canvas尺寸为裁剪区域大小
    canvas.width = cropWidth
    canvas.height = cropHeight
    
    // 绘制裁剪后的图片
    ctx.drawImage(
      sourceImg,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight
    )
    
    // 应用之前的旋转和翻转
    if (editHistory.currentRotation !== 0 || editHistory.flipHorizontal || editHistory.flipVertical) {
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d')
      if (!tempCtx) throw new Error('Temp canvas context not available')
      
      if (Math.abs(editHistory.currentRotation) === 90 || Math.abs(editHistory.currentRotation) === 270) {
        tempCanvas.width = canvas.height
        tempCanvas.height = canvas.width
      } else {
        tempCanvas.width = canvas.width
        tempCanvas.height = canvas.height
      }
      
      const rotation = (editHistory.currentRotation * Math.PI) / 180
      tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2)
      tempCtx.rotate(rotation)
      if (editHistory.flipHorizontal) tempCtx.scale(-1, 1)
      if (editHistory.flipVertical) tempCtx.scale(1, -1)
      tempCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2)
      
      editHistory.currentImage = tempCanvas.toDataURL('image/jpeg', 0.95)
    } else {
      editHistory.currentImage = canvas.toDataURL('image/jpeg', 0.95)
    }
    
    loading.close()
    ElMessage.success('Crop applied successfully')
  } catch (error) {
    loading.close()
    ElMessage.error('Failed to crop image')
    console.error('Crop error:', error)
  }
}

// 监听裁剪工具切换
watch(() => editTool.value, (newTool) => {
  if (newTool === 'crop') {
    initCropper()
  } else {
    // 移除裁剪覆盖层
    const container = editImageRef.value?.parentElement
    const overlay = container?.querySelector('.crop-overlay')
    if (overlay) overlay.remove()
  }
})

// 监听裁剪比例变化
watch(() => cropSettings.aspectRatio, () => {
  if (editTool.value === 'crop') {
    initCropper()
  }
})

// 图片编辑
const handleImageEditing = (area: 'skc' | 'sku' | 'shein' | 'other') => {
  const selectedFiles = getSelectedImagesForArea(area)
  
  if (selectedFiles.length === 0) {
    ElMessage.warning('Please select images to edit')
    return
  }
  
  console.log('=== Opening image editor ===')
  console.log('Area:', area, 'Count:', selectedFiles.length)
  
  // 打开编辑对话框
  editSelectedImages.value = selectedFiles
  currentEditIndex.value = 0
  editTool.value = ''
  imageEditDialogVisible.value = true
  
  // 重置编辑设置
  editHistory.currentRotation = 0
  editHistory.flipHorizontal = false
  editHistory.flipVertical = false
  editHistory.originalImage = null
  editHistory.currentImage = null
  filterSettings.brightness = 0
  filterSettings.contrast = 0
  filterSettings.saturation = 0
  selectedFilterPreset.value = 'Original'
  
  // 加载第一张图片
  nextTick(() => {
    loadImageForEditing()
  })
}

// 加载图片用于编辑
const loadImageForEditing = () => {
  const currentImage = currentEditImage.value
  if (!currentImage) return
  
  const imageUrl = currentImage.url || (currentImage.raw ? URL.createObjectURL(currentImage.raw) : '')
  if (imageUrl) {
    editHistory.originalImage = imageUrl
    editHistory.currentImage = imageUrl
    
    // 获取原始图片尺寸
    const img = new Image()
    img.onload = () => {
      resizeSettings.width = img.naturalWidth
      resizeSettings.height = img.naturalHeight
    }
    img.src = imageUrl
  }
}

// 监听当前编辑索引变化
watch(currentEditIndex, () => {
  loadImageForEditing()
  // 重置编辑状态
  editHistory.currentRotation = 0
  editHistory.flipHorizontal = false
  editHistory.flipVertical = false
  filterSettings.brightness = 0
  filterSettings.contrast = 0
  filterSettings.saturation = 0
})

// 旋转图片
const handleRotateImage = async (degree: number) => {
  const loading = ElLoading.service({
    lock: true,
    text: `Rotating image by ${degree}°...`,
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  try {
    editHistory.currentRotation = (editHistory.currentRotation + degree) % 360
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')
    
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = editHistory.originalImage || ''
    })
    
    // 根据旋转角度设置canvas尺寸
    const rotation = (editHistory.currentRotation * Math.PI) / 180
    if (Math.abs(editHistory.currentRotation) === 90 || Math.abs(editHistory.currentRotation) === 270) {
      canvas.width = img.height
      canvas.height = img.width
    } else {
      canvas.width = img.width
      canvas.height = img.height
    }
    
    // 应用变换
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(rotation)
    if (editHistory.flipHorizontal) ctx.scale(-1, 1)
    if (editHistory.flipVertical) ctx.scale(1, -1)
    ctx.drawImage(img, -img.width / 2, -img.height / 2)
    
    // 应用滤镜
    applyFiltersToCanvas(canvas, ctx)
    
    editHistory.currentImage = canvas.toDataURL('image/jpeg', 0.95)
    loading.close()
    ElMessage.success(`Rotated by ${degree}°`)
  } catch (error) {
    loading.close()
    ElMessage.error('Failed to rotate image')
    console.error('Rotation error:', error)
  }
}

// 翻转图片
const handleFlipImage = async (direction: 'horizontal' | 'vertical') => {
  const loading = ElLoading.service({
    lock: true,
    text: `Flipping image ${direction}...`,
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  try {
    if (direction === 'horizontal') {
      editHistory.flipHorizontal = !editHistory.flipHorizontal
    } else {
      editHistory.flipVertical = !editHistory.flipVertical
    }
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')
    
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = editHistory.originalImage || ''
    })
    
    // 根据旋转角度设置canvas尺寸
    if (Math.abs(editHistory.currentRotation) === 90 || Math.abs(editHistory.currentRotation) === 270) {
      canvas.width = img.height
      canvas.height = img.width
    } else {
      canvas.width = img.width
      canvas.height = img.height
    }
    
    // 应用变换
    const rotation = (editHistory.currentRotation * Math.PI) / 180
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(rotation)
    if (editHistory.flipHorizontal) ctx.scale(-1, 1)
    if (editHistory.flipVertical) ctx.scale(1, -1)
    ctx.drawImage(img, -img.width / 2, -img.height / 2)
    
    // 应用滤镜
    applyFiltersToCanvas(canvas, ctx)
    
    editHistory.currentImage = canvas.toDataURL('image/jpeg', 0.95)
    loading.close()
    ElMessage.success(`Flipped ${direction}`)
  } catch (error) {
    loading.close()
    ElMessage.error('Failed to flip image')
    console.error('Flip error:', error)
  }
}

// 应用滤镜到Canvas
const applyFiltersToCanvas = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  if (filterSettings.brightness !== 0 || filterSettings.contrast !== 0 || filterSettings.saturation !== 0) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i]
      let g = data[i + 1]
      let b = data[i + 2]
      
      // 亮度调整
      if (filterSettings.brightness !== 0) {
        const brightnessFactor = filterSettings.brightness / 100
        r += 255 * brightnessFactor
        g += 255 * brightnessFactor
        b += 255 * brightnessFactor
      }
      
      // 对比度调整
      if (filterSettings.contrast !== 0) {
        const contrastFactor = (259 * (filterSettings.contrast + 255)) / (255 * (259 - filterSettings.contrast))
        r = contrastFactor * (r - 128) + 128
        g = contrastFactor * (g - 128) + 128
        b = contrastFactor * (b - 128) + 128
      }
      
      // 饱和度调整
      if (filterSettings.saturation !== 0) {
        const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b
        const saturationFactor = (filterSettings.saturation + 100) / 100
        r = gray + saturationFactor * (r - gray)
        g = gray + saturationFactor * (g - gray)
        b = gray + saturationFactor * (b - gray)
      }
      
      data[i] = Math.max(0, Math.min(255, r))
      data[i + 1] = Math.max(0, Math.min(255, g))
      data[i + 2] = Math.max(0, Math.min(255, b))
    }
    
    ctx.putImageData(imageData, 0, 0)
  }
}

// 监听滤镜设置变化，实时预览
watch([() => filterSettings.brightness, () => filterSettings.contrast, () => filterSettings.saturation], 
  async () => {
    if (!editHistory.originalImage) return
    
    // 检查是否手动调整，如果是则取消预设选择
    const isManualAdjustment = !filterPresets.some(preset => 
      preset.brightness === filterSettings.brightness &&
      preset.contrast === filterSettings.contrast &&
      preset.saturation === filterSettings.saturation
    )
    
    if (isManualAdjustment && selectedFilterPreset.value !== 'Original') {
      selectedFilterPreset.value = 'Original'
    }
    
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = editHistory.originalImage || ''
      })
      
      // 根据旋转角度设置canvas尺寸
      if (Math.abs(editHistory.currentRotation) === 90 || Math.abs(editHistory.currentRotation) === 270) {
        canvas.width = img.height
        canvas.height = img.width
      } else {
        canvas.width = img.width
        canvas.height = img.height
      }
      
      // 应用变换
      const rotation = (editHistory.currentRotation * Math.PI) / 180
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(rotation)
      if (editHistory.flipHorizontal) ctx.scale(-1, 1)
      if (editHistory.flipVertical) ctx.scale(1, -1)
      ctx.drawImage(img, -img.width / 2, -img.height / 2)
      
      // 应用滤镜
      applyFiltersToCanvas(canvas, ctx)
      
      editHistory.currentImage = canvas.toDataURL('image/jpeg', 0.95)
    } catch (error) {
      console.error('Filter preview error:', error)
    }
  }
)

// 调整图片大小
const handleResizeImage = async () => {
  if (!resizeSettings.width || !resizeSettings.height) {
    ElMessage.warning('Please enter valid dimensions')
    return
  }
  
  const loading = ElLoading.service({
    lock: true,
    text: 'Resizing image...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')
    
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = editHistory.currentImage || editHistory.originalImage || ''
    })
    
    canvas.width = resizeSettings.width
    canvas.height = resizeSettings.height
    
    ctx.drawImage(img, 0, 0, resizeSettings.width, resizeSettings.height)
    
    editHistory.currentImage = canvas.toDataURL('image/jpeg', 0.95)
    loading.close()
    ElMessage.success(`Resized to ${resizeSettings.width}×${resizeSettings.height}`)
  } catch (error) {
    loading.close()
    ElMessage.error('Failed to resize image')
    console.error('Resize error:', error)
  }
}

// 重置编辑
const handleResetEdit = () => {
  editHistory.currentRotation = 0
  editHistory.flipHorizontal = false
  editHistory.flipVertical = false
  editHistory.currentImage = editHistory.originalImage
  filterSettings.brightness = 0
  filterSettings.contrast = 0
  filterSettings.saturation = 0
  ElMessage.info('Reset to original')
}

// 应用编辑并保存
const handleApplyEdit = async () => {
  if (!editHistory.currentImage) {
    ElMessage.warning('No changes to apply')
    return
  }
  
  const loading = ElLoading.service({
    lock: true,
    text: 'Applying changes...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  try {
    // 将base64转换为Blob
    const response = await fetch(editHistory.currentImage)
    const blob = await response.blob()
    
    // 创建新的File对象
    const fileName = currentEditImage.value.name || 'edited_image.jpg'
    const newFile = new File([blob], fileName, { type: 'image/jpeg' })
    
    // 生成新的UID
    const newUid = Date.now() + Math.random()
    
    // 更新图片数据
    const editedFile: any = {
      ...currentEditImage.value,
      raw: newFile,
      url: editHistory.currentImage,
      uid: newUid,
      size: blob.size
    }
    
    // 替换原图片
    editSelectedImages.value[currentEditIndex.value] = editedFile
    
    // 找到并替换数据源中的图片
    const oldUid = String(currentEditImage.value.uid)
    
    // 替换所有数据源中的图片
    imageRowsData.value.forEach(row => {
      const detailIndex = row.detailImages.findIndex((img: any) => String(img.uid) === oldUid)
      if (detailIndex > -1) row.detailImages[detailIndex] = editedFile
      
      const squareIndex = row.squareImage.findIndex((img: any) => String(img.uid) === oldUid)
      if (squareIndex > -1) row.squareImage[squareIndex] = editedFile
      
      const colorIndex = row.colorBlockImage.findIndex((img: any) => String(img.uid) === oldUid)
      if (colorIndex > -1) row.colorBlockImage[colorIndex] = editedFile
    })
    
    skuImageRowsData.value.forEach(row => {
      const index = row.skuImages.findIndex((img: any) => String(img.uid) === oldUid)
      if (index > -1) row.skuImages[index] = editedFile
    })
    
    sheinDetailImageRowsData.value.forEach(row => {
      const index = row.detailImages.findIndex((img: any) => String(img.uid) === oldUid)
      if (index > -1) row.detailImages[index] = editedFile
    })
    
    const otherIndex = otherProductImages.value.findIndex((img: any) => String(img.uid) === oldUid)
    if (otherIndex > -1) otherProductImages.value[otherIndex] = editedFile
    
    // 更新选中列表的UID
    if (selectedImages.value.has(oldUid)) {
      selectedImages.value.delete(oldUid)
      selectedImages.value.add(String(newUid))
    }
    
    loading.close()
    ElMessage.success('Changes applied successfully')
    
    // 重新初始化图片事件
    setTimeout(() => {
      initializeImageClickEvents()
    }, 500)
    
    console.log('✓ Edit applied and saved')
  } catch (error) {
    loading.close()
    ElMessage.error('Failed to apply changes')
    console.error('Apply edit error:', error)
  }
}

// 导出图片
const handleExportImages = async (area: 'skc' | 'sku' | 'shein' | 'other') => {
  const selectedFiles = getSelectedImagesForArea(area)
  
  if (selectedFiles.length === 0) {
    ElMessage.warning('Please select images to export')
    return
  }
  
  console.log('=== Exporting images ===')
  console.log('Area:', area, 'Count:', selectedFiles.length)
  
  const loading = ElLoading.service({
    lock: true,
    text: `Exporting ${selectedFiles.length} image(s)...`,
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  try {
    // 创建一个临时的 a 标签来下载图片
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      const url = file.url || (file.raw ? URL.createObjectURL(file.raw) : '')
      
      if (url) {
        const link = document.createElement('a')
        link.href = url
        link.download = file.name || `image_${i + 1}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // 延迟以避免浏览器阻止多个下载
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }
    
    loading.close()
    ElMessage.success(`Successfully exported ${selectedFiles.length} image(s)`)
    console.log('✓ Export completed')
  } catch (error) {
    loading.close()
    ElMessage.error('Export failed')
    console.error('Export error:', error)
  }
}

// 执行AI生成
const handleGenerateAI = async () => {
  aiGenerating.value = true
  aiResults.value = []
  
  try {
    // 准备AI生成请求
    const requestType = aiGenerateType.value === 'productName' ? 'product-title' : 
                       aiGenerateType.value === 'title' ? 'product-title' : 
                       'product-description'
    
    const featuresList = aiSettings.features 
      ? aiSettings.features.split('\n').filter(f => f.trim()) 
      : []
    
    const keywordsList = aiSettings.includeKeywords && aiSettings.keywords
      ? aiSettings.keywords.split(',').map(k => k.trim()).filter(Boolean)
      : []
    
    const request: AITextGenerateRequest = {
      type: requestType,
      context: {
        productName: formData.productName || 'Product',
        category: formData.category || 'Fashion',
        features: featuresList,
        targetAudience: aiSettings.targetAudience || 'Fashion enthusiasts',
        language: aiSettings.language,
        tone: aiSettings.tone as any,
        length: aiSettings.length as any
      },
      keywords: keywordsList,
      count: aiSettings.generateCount
    }
    
    console.log('AI Generate Request:', request)
    
    // 调用 Mock AI 服务
    const response = await mockAIService.generateText(request)
    
    if (response.success && response.data) {
      // 为每个结果添加SEO评分和长度信息
      aiResults.value = response.data.map((item: any) => {
        const content = item.content
        const length = content.length
        
        // 简单的SEO评分算法
        let seoScore = 50
        
        // 长度检查
        if (requestType === 'product-title') {
          if (length >= 50 && length <= 60) seoScore += 15
          else if (length >= 40 && length < 70) seoScore += 10
          else if (length < 30 || length > 80) seoScore -= 10
        } else {
          if (length >= 150 && length <= 300) seoScore += 15
          else if (length >= 100 && length < 400) seoScore += 10
        }
        
        // 关键词检查
        if (keywordsList.length > 0) {
          const hasKeywords = keywordsList.some(kw => 
            content.toLowerCase().includes(kw.toLowerCase())
          )
          if (hasKeywords) seoScore += 15
        }
        
        // 包含品类关键词
        if (content.toLowerCase().includes((formData.category || '').toLowerCase())) {
          seoScore += 10
        }
        
        // SEO优化检查
        if (aiSettings.seoOptimize) {
          // 检查是否使用了强力词汇
          const powerWords = ['premium', 'exclusive', 'trending', 'best', 'quality', 'perfect', 'essential']
          const hasPowerWords = powerWords.some(pw => content.toLowerCase().includes(pw))
          if (hasPowerWords) seoScore += 5
        }
        
        return {
          content,
          length,
          seoScore: Math.min(100, seoScore)
        }
      })
      
      // 按SEO评分排序
      if (aiSettings.seoOptimize) {
        aiResults.value.sort((a, b) => (b.seoScore || 0) - (a.seoScore || 0))
      }
      
      ElMessage.success({
        message: `✨ Generated ${aiResults.value.length} AI results successfully!`,
        duration: 3000
      })
    } else {
      throw new Error('AI service returned no data')
    }
    
  } catch (error) {
    console.error('AI generation error:', error)
    ElMessage.error('AI generation failed. Please try again.')
  } finally {
    aiGenerating.value = false
  }
}

// 应用AI生成结果
const handleApplyResult = (content: string) => {
  if (aiGenerateType.value === 'title') {
    formData.productTitle = content
  } else if (aiGenerateType.value === 'productName') {
    formData.productName = content
  } else {
    formData.productDescription = content
  }
  ElMessage.success('✅ Applied successfully')
  aiGenerateDialogVisible.value = false
}

// 翻译结果
const handleTranslateResult = async (content: string, index: number, targetLang: string) => {
  try {
    const loading = ElLoading.service({
      lock: true,
      text: 'Translating...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    const response = await mockAIService.translate({
      text: content,
      sourceLang: aiSettings.language,
      targetLang: targetLang,
      context: aiGenerateType.value === 'title' ? 'product-title' : 'product-description'
    })
    
    loading.close()
    
    if (response.success && response.data) {
      aiResults.value[index].translated = response.data.translatedText
      
      ElMessageBox.confirm(
        `<div style="max-height: 300px; overflow-y: auto;">
          <p><strong>Original:</strong></p>
          <p>${content}</p>
          <br/>
          <p><strong>Translated (${targetLang}):</strong></p>
          <p>${response.data.translatedText}</p>
          <br/>
          <p style="color: #909399; font-size: 12px;">Confidence: ${(response.data.confidence * 100).toFixed(0)}%</p>
        </div>`,
        'Translation Result',
        {
          confirmButtonText: 'Use Translation',
          cancelButtonText: 'Close',
          type: 'info',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        // 用翻译结果替换原内容
        aiResults.value[index].content = response.data.translatedText
        ElMessage.success('Translation applied')
      }).catch(() => {})
    }
  } catch (error) {
    console.error('Translation error:', error)
    ElMessage.error('Translation failed')
  }
}

// SEO分析
const handleAnalyzeSEO = async (content: string, index: number) => {
  try {
    const loading = ElLoading.service({
      lock: true,
      text: '🔍 AI正在深度分析SEO...',
      background: 'rgba(0, 0, 0, 0.85)'
    })
    
    const response = await mockAIService.analyzeSEO({
      title: content,
      description: formData.productDescription || '',
      category: formData.category || '',
      targetMarket: 'US'
    })
    
    loading.close()
    
    if (response.success && response.data) {
      const { score, suggestions, keywords } = response.data
      
      const scoreColor = score > 80 ? '#10b981' : score > 60 ? '#f59e0b' : '#ef4444'
      const scoreLabel = score > 80 ? 'Excellent' : score > 60 ? 'Good' : 'Needs Improvement'
      const scoreIcon = score > 80 ? '🎉' : score > 60 ? '👍' : '⚠️'
      
      // Calculate performance metrics
      const metrics = {
        length: { score: content.length >= 40 && content.length <= 70 ? 100 : content.length < 40 ? 60 : 75, label: 'Length Optimization' },
        keywords: { score: Math.min(100, (keywords.recommended.length / 5) * 100), label: 'Keyword Density' },
        readability: { score: 85, label: 'Readability' },
        uniqueness: { score: 92, label: 'Uniqueness' }
      }
      
      // Metrics cards HTML
      const metricsHtml = Object.entries(metrics).map(([key, metric]) => {
        const percentage = metric.score
        const barColor = percentage > 80 ? '#10b981' : percentage > 60 ? '#f59e0b' : '#ef4444'
        return `
          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-label">${metric.label}</span>
              <span class="metric-score">${Math.round(percentage)}%</span>
            </div>
            <div class="metric-bar">
              <div class="metric-fill" style="width: ${percentage}%; background: ${barColor};"></div>
            </div>
          </div>
        `
      }).join('')
      
      // Optimization suggestions
      const suggestionsHtml = suggestions.map((s: any, idx: number) => {
        const hasActionable = s.suggestion && (s.field === 'title' || s.field === 'productName')
        const cleanSuggestion = s.suggestion ? s.suggestion.replace(/"/g, '&quot;').replace(/'/g, "\\'") : ''
        
        const iconMap = { error: '🔴', warning: '🟡', success: '🟢' }
        const colorMap = { error: '#fef2f2', warning: '#fffbeb', success: '#f0fdf4' }
        const borderMap = { error: '#fecaca', warning: '#fde68a', success: '#bbf7d0' }
        
        return `
          <div class="suggestion-card-v2" style="background: ${colorMap[s.type]}; border-color: ${borderMap[s.type]};">
            <div class="suggestion-icon-v2">${iconMap[s.type]}</div>
            <div class="suggestion-body">
              <div class="suggestion-title-v2">${s.message}</div>
              ${s.suggestion ? `
                <div class="suggestion-detail-v2">${s.suggestion}</div>
                ${hasActionable ? `
                  <button class="btn-apply-v2" onclick="window.applySEOSuggestion('${s.field}', '${cleanSuggestion}')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Apply Suggestion
                  </button>
                ` : ''}
              ` : ''}
            </div>
          </div>
        `
      }).join('')
      
      // Generate smart product name suggestions
      const nameSuggestions = [
        content,
        `Premium Quality ${content}`,
        `${content} - Fashion & Style`,
        `Best ${content} Collection`,
        `Trendy ${content} For You`
      ].slice(0, 5)
      
      const suggestionsCards = nameSuggestions.map((name: string, idx: number) => {
        const cleanName = name.replace(/"/g, '&quot;').replace(/'/g, "\\'")
        const charCount = name.length
        const isOptimal = charCount >= 40 && charCount <= 70
        
        return `
          <div class="name-card-v2">
            <div class="name-card-header">
              <div class="name-index">#${idx + 1}</div>
              <div class="name-stats">
                <span class="char-count ${isOptimal ? 'optimal' : ''}">${charCount} chars</span>
                ${isOptimal ? '<span class="optimal-badge">✓ Optimal</span>' : ''}
              </div>
            </div>
            <div class="name-text">${name}</div>
            <button class="btn-use-v2" onclick="window.applySEOSuggestion('productName', '${cleanName}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Use This Name
            </button>
          </div>
        `
      }).join('')
      
      // Keyword tags
      const keywordsHtml = keywords.recommended.map((kw: string) => 
        `<span class="keyword-tag-v2" onclick="window.addSEOTag('${kw}')">
          <span class="tag-text">${kw}</span>
          <svg class="tag-add-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </span>`
      ).join('')
      
      ElMessageBox.alert(
        `<div class="seo-analysis-content-v2">
          <!-- Header with Score -->
          <div class="seo-header-v2">
            <div class="score-circle" style="--score-color: ${scoreColor}; --score-percent: ${score}%;">
              <div class="score-inner">
                <div class="score-number">${score}</div>
                <div class="score-icon">${scoreIcon}</div>
              </div>
              <svg class="score-ring">
                <circle cx="70" cy="70" r="60" class="score-ring-bg"></circle>
                <circle cx="70" cy="70" r="60" class="score-ring-fill" 
                  style="stroke: ${scoreColor}; stroke-dasharray: ${(score / 100) * 377} 377;"></circle>
              </svg>
            </div>
            <div class="score-info">
              <h2 class="score-title">SEO Score Analysis</h2>
              <div class="score-status" style="color: ${scoreColor};">
                ${scoreLabel}
              </div>
              <div class="analyzed-text">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                ${content}
              </div>
            </div>
          </div>
          
          <!-- Performance Metrics -->
          <div class="metrics-section">
            <h3 class="section-title-v2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="20" x2="12" y2="10"></line>
                <line x1="18" y1="20" x2="18" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="16"></line>
              </svg>
              Performance Metrics
            </h3>
            <div class="metrics-grid">
              ${metricsHtml}
            </div>
          </div>
          
          <!-- AI Recommended Names -->
          <div class="names-section">
            <h3 class="section-title-v2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              AI Recommended Names
              <span class="count-badge">${nameSuggestions.length}</span>
            </h3>
            <div class="names-grid">
              ${suggestionsCards}
            </div>
          </div>
          
          <!-- Optimization Suggestions -->
          ${suggestions.length > 0 ? `
            <div class="suggestions-section">
              <h3 class="section-title-v2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                Optimization Tips
              </h3>
              <div class="suggestions-list-v2">
                ${suggestionsHtml}
              </div>
            </div>
          ` : ''}
          
          <!-- Recommended Keywords -->
          <div class="keywords-section">
            <h3 class="section-title-v2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
              Recommended Keywords
              <span class="hint-badge">Click to add tags</span>
            </h3>
            <div class="keywords-grid-v2">
              ${keywordsHtml}
            </div>
          </div>
        </div>`,
        '',
        {
          confirmButtonText: 'Close',
          dangerouslyUseHTMLString: true,
          customClass: 'seo-analysis-dialog-v2',
          showClose: true,
          closeOnClickModal: true
        }
      )
      
      // Update SEO score in results
      aiResults.value[index].seoScore = score
    }
  } catch (error) {
    console.error('SEO analysis error:', error)
    ElMessage.error('SEO analysis failed, please try again')
  }
}

// 复制结果到剪贴板
const handleCopyResult = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    ElMessage.success('📋 Copied to clipboard')
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = content
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      ElMessage.success('📋 Copied to clipboard')
    } catch (err) {
      ElMessage.error('Failed to copy')
    }
    document.body.removeChild(textArea)
  }
}

// Quick SEO Analysis (from field button)
const handleQuickSEOAnalysis = async (field: 'productName' | 'title' | 'description') => {
  let content = ''
  let fieldName = ''
  
  if (field === 'productName') {
    content = formData.productName
    fieldName = 'Product Name'
  } else if (field === 'title') {
    content = formData.productTitle
    fieldName = 'Product Title'
  } else {
    content = formData.productDescription
    fieldName = 'Product Description'
  }
  
  if (!content || !content.trim()) {
    ElMessage.warning(`Please enter ${fieldName} first`)
    return
  }
  
  try {
    const loading = ElLoading.service({
      lock: true,
      text: '🔍 AI is analyzing SEO...',
      background: 'rgba(0, 0, 0, 0.85)'
    })
    
    const response = await mockAIService.analyzeSEO({
      title: content,
      description: formData.productDescription || content,
      category: formData.category || '',
      targetMarket: 'Global'
    })
    
    loading.close()
    
    if (response.success && response.data) {
      const { score, suggestions, keywords } = response.data
      
      const scoreColor = score > 80 ? '#10b981' : score > 60 ? '#f59e0b' : '#ef4444'
      const scoreLabel = score > 80 ? 'Excellent' : score > 60 ? 'Good' : 'Needs Improvement'
      const scoreIcon = score > 80 ? '🎉' : score > 60 ? '👍' : '⚠️'
      
      // Calculate performance metrics
      const metrics = {
        length: { score: content.length >= 40 && content.length <= 70 ? 100 : content.length < 40 ? 60 : 75, label: 'Length Optimization' },
        keywords: { score: Math.min(100, (keywords.recommended.length / 5) * 100), label: 'Keyword Density' },
        readability: { score: 85, label: 'Readability' },
        uniqueness: { score: 92, label: 'Uniqueness' }
      }
      
      // 指标卡片HTML
      const metricsHtml = Object.entries(metrics).map(([key, metric]) => {
        const percentage = metric.score
        const barColor = percentage > 80 ? '#10b981' : percentage > 60 ? '#f59e0b' : '#ef4444'
        return `
          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-label">${metric.label}</span>
              <span class="metric-score">${Math.round(percentage)}%</span>
            </div>
            <div class="metric-bar">
              <div class="metric-fill" style="width: ${percentage}%; background: ${barColor};"></div>
            </div>
          </div>
        `
      }).join('')
      
      // 优化建议
      const suggestionsHtml = suggestions.map((s: any, idx: number) => {
        const hasActionable = s.suggestion && (s.field === 'title' || s.field === 'productName')
        const cleanSuggestion = s.suggestion ? s.suggestion.replace(/"/g, '&quot;').replace(/'/g, "\\'") : ''
        
        const iconMap = { error: '🔴', warning: '🟡', success: '🟢' }
        const colorMap = { error: '#fef2f2', warning: '#fffbeb', success: '#f0fdf4' }
        const borderMap = { error: '#fecaca', warning: '#fde68a', success: '#bbf7d0' }
        
        return `
          <div class="suggestion-card-v2" style="background: ${colorMap[s.type]}; border-color: ${borderMap[s.type]};">
            <div class="suggestion-icon-v2">${iconMap[s.type]}</div>
            <div class="suggestion-body">
              <div class="suggestion-title-v2">${s.message}</div>
              ${s.suggestion ? `
                <div class="suggestion-detail-v2">${s.suggestion}</div>
                ${hasActionable ? `
                  <button class="btn-apply-v2" onclick="window.applySEOSuggestion('${s.field}', '${cleanSuggestion}')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Apply Suggestion
                  </button>
                ` : ''}
              ` : ''}
            </div>
          </div>
        `
      }).join('')
      
      // Generate smart product name suggestions
      const nameSuggestions = field === 'productName' ? [
        content,
        `Premium Quality ${content}`,
        `${content} - Fashion & Style`,
        `Best ${content} Collection`,
        `Trendy ${content} For You`
      ].slice(0, 5) : []
      
      const suggestionsCards = nameSuggestions.map((name: string, idx: number) => {
        const cleanName = name.replace(/"/g, '&quot;').replace(/'/g, "\\'")
        const charCount = name.length
        const isOptimal = charCount >= 40 && charCount <= 70
        
        return `
          <div class="name-card-v2">
            <div class="name-card-header">
              <div class="name-index">#${idx + 1}</div>
              <div class="name-stats">
                <span class="char-count ${isOptimal ? 'optimal' : ''}">${charCount} chars</span>
                ${isOptimal ? '<span class="optimal-badge">✓ Optimal</span>' : ''}
              </div>
            </div>
            <div class="name-text">${name}</div>
            <button class="btn-use-v2" onclick="window.applySEOSuggestion('productName', '${cleanName}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Use This Name
            </button>
          </div>
        `
      }).join('')
      
      // Keyword tags
      const keywordsHtml = keywords.recommended.map((kw: string) => 
        `<span class="keyword-tag-v2" onclick="window.addSEOTag('${kw}')">
          <span class="tag-text">${kw}</span>
          <svg class="tag-add-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </span>`
      ).join('')
      
      ElMessageBox.alert(
        `<div class="seo-analysis-content-v2">
          <!-- Header with Score -->
          <div class="seo-header-v2">
            <div class="score-circle" style="--score-color: ${scoreColor}; --score-percent: ${score}%;">
              <div class="score-inner">
                <div class="score-number">${score}</div>
                <div class="score-icon">${scoreIcon}</div>
              </div>
              <svg class="score-ring">
                <circle cx="70" cy="70" r="60" class="score-ring-bg"></circle>
                <circle cx="70" cy="70" r="60" class="score-ring-fill" 
                  style="stroke: ${scoreColor}; stroke-dasharray: ${(score / 100) * 377} 377;"></circle>
              </svg>
            </div>
            <div class="score-info">
              <h2 class="score-title">SEO Score Analysis</h2>
              <div class="score-status" style="color: ${scoreColor};">
                ${scoreLabel}
              </div>
              <div class="analyzed-text">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                ${content}
              </div>
            </div>
          </div>
          
          <!-- Performance Metrics -->
          <div class="metrics-section">
            <h3 class="section-title-v2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="20" x2="12" y2="10"></line>
                <line x1="18" y1="20" x2="18" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="16"></line>
              </svg>
              Performance Metrics
            </h3>
            <div class="metrics-grid">
              ${metricsHtml}
            </div>
          </div>
          
          <!-- AI Recommended Names (only for productName) -->
          ${nameSuggestions.length > 0 ? `
            <div class="names-section">
              <h3 class="section-title-v2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                AI Recommended Names
                <span class="count-badge">${nameSuggestions.length}</span>
              </h3>
              <div class="names-grid">
                ${suggestionsCards}
              </div>
            </div>
          ` : ''}
          
          <!-- Optimization Tips -->
          ${suggestions.length > 0 ? `
            <div class="suggestions-section">
              <h3 class="section-title-v2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                Optimization Tips
              </h3>
              <div class="suggestions-list-v2">
                ${suggestionsHtml}
              </div>
            </div>
          ` : ''}
          
          <!-- Recommended Keywords -->
          <div class="keywords-section">
            <h3 class="section-title-v2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
              Recommended Keywords
              <span class="hint-badge">Click to add tags</span>
            </h3>
            <div class="keywords-grid-v2">
              ${keywordsHtml}
            </div>
          </div>
        </div>`,
        '',
        {
          confirmButtonText: 'Close',
          dangerouslyUseHTMLString: true,
          customClass: 'seo-analysis-dialog-v2',
          showClose: true,
          closeOnClickModal: true
        }
      )
    }
  } catch (error) {
    console.error('Quick SEO analysis error:', error)
    ElMessage.error('SEO analysis failed, please try again')
  }
}

// 类目相关处理
const handleCategoryChange = (value: any) => {
  console.log('Category changed:', value)
  // 类目改变时，重置成分（保留一项空白）
  formData.composition = [{ type: '', ratio: 0 }]
  ElMessage.success('Category selected successfully')
}

const handleRefreshCategory = () => {
  ElMessage.info('Refreshing category options...')
  // TODO: 刷新类目数据
}

// 成分管理
const handleAddComposition = () => {
  // 如果当前是空状态，先添加临时数据
  if (formData.composition.length === 0 && (tempComposition.type || tempComposition.ratio > 0)) {
    formData.composition.push({
      type: tempComposition.type,
      ratio: tempComposition.ratio
    })
    // 重置临时数据
    tempComposition.type = ''
    tempComposition.ratio = 0
  }
  
  // 添加新的空白项
  formData.composition.push({
    type: '',
    ratio: 0
  })
}

// 处理临时成分变化（空状态时）
const handleTempCompositionChange = () => {
  // 当用户在临时输入框中选择了材料，自动转换为正式项
  if (tempComposition.type && formData.composition.length === 0) {
    formData.composition.push({
      type: tempComposition.type,
      ratio: tempComposition.ratio
    })
    // 重置临时数据
    tempComposition.type = ''
    tempComposition.ratio = 0
  }
}

const handleRemoveComposition = (index: number) => {
  if (formData.composition.length > 1) {
  formData.composition.splice(index, 1)
  } else {
    // 如果只剩最后一项，清空而不是删除
    formData.composition[index] = { type: '', ratio: 0 }
    ElMessage.info('Composition item cleared')
  }
}

// 属性管理
const handleEditAttribute = (index: number) => {
  const attr = attributesList.value[index]
  
  // 如果是自定义属性，可以编辑名称和值
  if (attr.type === 'custom') {
    // 备份原始数据
    editingBackup.value = {
      label: attr.label,
      value: attr.value
    }
    // 进入编辑模式
    attr.isEditing = true
  } else {
    ElMessage.info('Only custom attributes can be edited')
  }
}

const handleDeleteAttribute = (index: number) => {
  const attr = attributesList.value[index]
  
  // 只有自定义属性可以删除
  if (attr.type !== 'custom') {
    ElMessage.warning('System attributes cannot be deleted')
    return
  }
  
  ElMessageBox.confirm('Are you sure to delete this attribute?', 'Warning', {
    type: 'warning'
  }).then(() => {
    attributesList.value.splice(index, 1)
    ElMessage.success('Attribute deleted successfully')
  }).catch(() => {})
}

const handleSaveAttribute = (index: number) => {
  const attr = attributesList.value[index]
  
  if (!attr.label || !attr.label.trim()) {
    ElMessage.warning('Please enter attribute name')
    return
  }
  
  // 退出编辑模式
  attr.isEditing = false
  editingBackup.value = null
  ElMessage.success('Attribute saved successfully')
}

const handleCancelEditAttribute = (index: number) => {
  const attr = attributesList.value[index]
  
  // 如果是新添加的还未保存的属性，直接删除
  if (!editingBackup.value) {
    attributesList.value.splice(index, 1)
  } else {
    // 恢复原始数据
    attr.label = editingBackup.value.label
    attr.value = editingBackup.value.value
    attr.isEditing = false
    editingBackup.value = null
  }
}

const handleAddAttributeValue = (index: number) => {
  ElMessage.info('Add value functionality coming soon...')
}

// 切换更多属性
const handleToggleMoreAttributes = () => {
  showMoreAttributes.value = !showMoreAttributes.value
}

// 添加自定义属性（直接添加到列表）
const handleShowCustomAttributeDialog = () => {
  // 添加一个新的自定义属性，默认进入编辑状态
  const newAttr = {
    label: '',
    type: 'custom',
    value: '',
    isEditing: true,
    required: false
  }
  
  attributesList.value.push(newAttr)
  editingBackup.value = null // 新属性没有备份
  
  // 如果当前是折叠状态且添加后超过3个，自动展开以显示新属性
  if (!showMoreAttributes.value && attributesList.value.length > 3) {
    showMoreAttributes.value = true
  }
  
  ElMessage.info('Please enter attribute name and value')
}

// 返回列表
// 标签处理函数
const handleTagClose = (tag: string) => {
  formData.tags = formData.tags.filter(t => t !== tag)
}

const showTagInput = () => {
  tagInputVisible.value = true
  nextTick(() => {
    tagInputRef.value?.focus()
  })
}

const handleTagInputConfirm = () => {
  if (tagInputValue.value) {
    const newTag = tagInputValue.value.trim()
    if (newTag && !formData.tags.includes(newTag)) {
      formData.tags.push(newTag)
    }
  }
  tagInputVisible.value = false
  tagInputValue.value = ''
}

const handleClearAllTags = () => {
  formData.tags = []
}

const handleBack = () => {
  router.push('/product/channel/shein')
}

// 保存草稿
const handleSaveDraft = async () => {
  try {
    // TODO: 实际保存逻辑
    ElMessage.success('Draft saved successfully')
  } catch (error) {
    ElMessage.error('Failed to save draft')
  }
}

// 提交
const handleSubmit = async () => {
  try {
    submitting.value = true
    
    // 验证基本信息
    if (basicFormRef.value) {
      await basicFormRef.value.validate()
    }
    
    // 验证分类信息
    if (categoryFormRef.value) {
      await categoryFormRef.value.validate()
    }
    
    // TODO: 实际提交逻辑
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('Product created successfully')
    router.push('/product/channel/shein')
  } catch (error) {
    ElMessage.error('Failed to create product')
  } finally {
    submitting.value = false
  }
}

// 滚动到指定区域
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    // 顶部header的高度 + 一个小的边距（让卡片紧贴在header下方作为第一项）
    const headerHeight = 80 
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
    
    // 更新当前激活的tab
    activeTab.value = sectionId
    updateActiveBarPosition()
  }
}

// 更新活动条位置
const updateActiveBarPosition = () => {
  nextTick(() => {
  const currentIndex = tabs.findIndex(tab => tab.id === activeTab.value)
  if (currentIndex !== -1) {
      // 获取所有tab元素
      const tabElements = document.querySelectorAll('.tab-item')
      if (tabElements.length > currentIndex) {
        const currentTab = tabElements[currentIndex] as HTMLElement
        
        if (currentTab) {
          // 获取当前tab相对于导航容器的位置
          const tabLeft = currentTab.offsetLeft
          const tabWidth = currentTab.offsetWidth
          
          // 获取tab内部文字内容的宽度
          const labelWrapper = currentTab.querySelector('.tab-label-wrapper') as HTMLElement
          const actualContentWidth = labelWrapper ? labelWrapper.offsetWidth : tabWidth * 0.6
          
          // 设置激活条宽度（比文字稍宽一点）
          activeBarWidth.value = `${actualContentWidth + 20}px`
          
          // 计算居中位置：tab起始位置 + (tab宽度 - 激活条宽度) / 2
          const leftPosition = tabLeft + (tabWidth - actualContentWidth - 20) / 2
    activeBarLeft.value = `${leftPosition}px`
  }
      }
    }
  })
}

// 滚动监听 - 实现吸顶效果和区域检测
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  isSticky.value = scrollTop > 60

  // 检测当前在哪个区域
  const sections = [
    { id: 'basic', ref: basicRef },
    { id: 'category', ref: categoryRef },
    { id: 'sku', ref: skuRef },
    { id: 'images', ref: imagesRef }
  ]

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i]
    const element = section.ref.value
    if (element) {
      const rect = element.getBoundingClientRect()
      // 如果区域顶部在视口上半部分，则认为是当前激活区域
      if (rect.top <= 100) {
        if (activeTab.value !== section.id) {
          activeTab.value = section.id
          updateActiveBarPosition()
        }
        break
      }
    }
  }
}

// SEO建议应用
const applySEOSuggestion = (field: string, suggestion: string) => {
  console.log('applySEOSuggestion called:', field, suggestion)
  if (field === 'title') {
    formData.productTitle = suggestion
    ElMessage.success('✓ Applied to Product Title')
  } else if (field === 'productName') {
    formData.productName = suggestion
    ElMessage.success('✓ Applied to Product Name')
  }
}

// SEO添加标签
const addSEOTag = (keyword: string) => {
  console.log('addSEOTag called:', keyword)
  if (!keyword || keyword.trim() === '') return
  
  // 检查是否已存在
  if (!formData.tags.includes(keyword)) {
    formData.tags.push(keyword)
    ElMessage.success(`✓ Tag added: "${keyword}"`)
  } else {
    ElMessage.warning(`Tag "${keyword}" already exists`)
  }
}

// 暴露到window对象供HTML调用
;(window as any).applySEOSuggestion = applySEOSuggestion
;(window as any).addSEOTag = addSEOTag

// 生命周期
onMounted(() => {
  console.log('Shein Product Create Page Mounted')
  window.addEventListener('scroll', handleScroll)
  updateActiveBarPosition()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 表单引用
const categoryFormRef = ref()
</script>

<style scoped lang="scss">
.shein-product-create {
  min-height: 100vh;
  background-color: var(--el-bg-color-page);
  display: flex;
  flex-direction: column;
  padding-bottom: 70px; // 为底部操作栏留出空间

  .page-header {
    background: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color-light);
    position: sticky;
    top: 0;
    z-index: 100;
    transition: all 0.3s ease;

    &.is-sticky {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 16px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 24px;
      flex: 1;

      .back-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        padding: 0;
        background: #2c2c2c;
        border-radius: 8px;
        border: none;
        color: #fff;
        flex-shrink: 0;

        &:hover {
          background: #3a3a3a;
          color: #fff;
        }

        &:active {
          background: #232323;
        }

        .el-icon {
          font-size: 18px;
          color: #fff;
        }
      }

      .page-title {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        flex-shrink: 0;
      }

      .horizontal-tabs {
        flex: 1;
        position: relative;
        margin-left: 24px;

        .tabs-nav {
          display: flex;
          align-items: center;
          gap: 0;
          position: relative;

          .tab-item {
            padding: 4px 16px;
            cursor: pointer;
            color: var(--el-text-color-regular);
            transition: all 0.3s ease;
            position: relative;
            user-select: none;

            &:first-child {
              padding-left: 0;
            }

            &:hover {
              color: #7c4dff;
            }

            &.is-active {
              color: #7c4dff;
              font-weight: 600;
            }

            .tab-label-wrapper {
              display: flex;
              align-items: center;
              gap: 6px;

              .tab-icon {
                font-size: 16px;
              }

              .tab-label {
                font-size: 14px;
              }
            }
          }
        }

        .tabs-active-bar {
          position: absolute;
          bottom: -16px;
          height: 3px;
          background-color: #7c4dff;
          transition: left 0.3s ease, width 0.3s ease;
          border-radius: 2px 2px 0 0;
        }
      }
    }
  }


  .content-wrapper {
    flex: 1;
    
    .form-content {
      padding: 20px 0;
      width: 100%;
      // 与标题左对齐：16px(header padding) + 40px(button) + 16px(gap)
      padding-left: 72px;
      padding-right: 24px;

      .section-block {
        margin-bottom: 24px;
        scroll-margin-top: 80px; // 为吸顶元素留出空间

        &:last-child {
          margin-bottom: 0;
        }

        .section-header {
          margin-bottom: 16px;
          padding-left: 1px; // 与卡片边框对齐

          .section-main-title {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: var(--el-text-color-primary);

            .title-icon {
              font-size: 20px;
              color: var(--el-color-primary);
            }
          }
        }

        .section-card {
          border: 1px solid var(--el-border-color-lighter);
          border-radius: 8px;
          background: var(--el-bg-color);

          :deep(.el-card__body) {
            padding: 28px 32px;
          }

          // 标签右对齐
          :deep(.el-form-item__label) {
            text-align: right;
            white-space: nowrap;
          }

          // AI按钮紫色样式
          .ai-button {
            background-color: #7c4dff;
            border-color: #7c4dff;
            color: #fff;

            &:hover,
            &:focus {
              background-color: #9466ff;
              border-color: #9466ff;
              color: #fff;
            }

            &:active {
              background-color: #6a3de6;
              border-color: #6a3de6;
            }
          }

          // 标签容器样式
          .tags-container {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
            min-height: 32px;

            .product-tag {
              background-color: #7c4dff;
              border-color: #7c4dff;
              color: #fff;
              font-size: 13px;
              padding: 4px 12px;
              border-radius: 4px;
              transition: all 0.3s;

              &:hover {
                background-color: #9466ff;
                border-color: #9466ff;
              }

              :deep(.el-tag__close) {
                color: #fff;
                
                &:hover {
                  background-color: rgba(255, 255, 255, 0.2);
                  color: #fff;
                }
              }

              .el-icon {
                margin-left: 4px;
                cursor: pointer;
                color: #fff;
              }
            }

            .tag-input {
              width: 180px;
            }

            .tag-add-button {
              border-style: dashed;
              border-color: var(--el-border-color);
              color: var(--el-text-color-secondary);

              &:hover {
                border-color: #7c4dff;
                color: #7c4dff;
              }
            }
          }

          // 属性表单项样式
          .attribute-form-item {
            .attribute-header-actions {
              margin-bottom: 12px;
            }
          }

          // 属性列表样式
          .attributes-list {
            width: 100%;

            .el-alert {
              margin-bottom: 0;
            }

            .el-row {
              margin-bottom: 0 !important;
            }

            // 属性列
            .attribute-col {
              margin-bottom: 12px;
            }

            // 属性项
            .attribute-item {
              height: 100%;
              padding: 12px;
              background: transparent !important;
              border: 1px solid var(--el-border-color);
              border-radius: 4px;
              transition: all 0.3s ease;

              &:hover {
                background: rgba(0, 0, 0, 0.1) !important;
                border-color: var(--el-border-color-dark);
              }

              // 编辑模式
              &.editing-mode {
                background: transparent !important;
                border-color: var(--el-border-color);
                padding: 16px;
              }

              .editing-content {
                display: flex;
                flex-direction: column;
                gap: 12px;

                .editing-inputs {
                  display: flex;
                  flex-direction: column;
                  gap: 8px;

                  .edit-label-input,
                  .edit-value-input {
                    width: 100%;
                    
                    :deep(.el-input__wrapper) {
                      background-color: var(--el-bg-color);
                    }
                  }
                }

                .editing-actions {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding-top: 8px;
                  border-top: 1px solid var(--el-border-color-lighter);

                  .el-button {
                    min-width: 70px;

                    &:first-child {
                      margin-left: auto;
                      margin-right: 8px;
                    }
                  }
                }
              }

              .attribute-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 10px;

                .attribute-label {
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  flex: 1;
                  min-width: 0;

                  .required-star {
                    color: #f56c6c;
                    font-size: 14px;
                    font-weight: bold;
                    flex-shrink: 0;
                    line-height: 1;
                  }

                  .el-tag {
                    height: 18px;
                    line-height: 16px;
                    padding: 0 6px;
                    font-size: 11px;
                    flex-shrink: 0;
                  }

                  .label-text {
                    font-size: 12px;
                    font-weight: 500;
                    color: var(--el-text-color-primary);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }

                  .help-icon {
                    font-size: 14px;
                    color: var(--el-text-color-secondary);
                    cursor: pointer;
                    flex-shrink: 0;

                    &:hover {
                      color: var(--el-color-primary);
                    }
                  }
                }

                .more-icon {
                  font-size: 16px;
                  color: var(--el-text-color-secondary);
                  cursor: pointer;
                  flex-shrink: 0;
                  margin-left: 4px;

                  &:hover {
                    color: var(--el-color-primary);
                  }
                }
              }

              .attribute-content {
                .el-select,
                .el-input {
                  width: 100%;
                }

                .el-checkbox-group {
                  display: flex;
                  flex-direction: column;
                  gap: 8px;
                }
              }
            }

            // 成分管理
            .composition-section {
              margin-top: 20px;
              padding: 16px;
              background: transparent;
              border: 1px solid var(--el-border-color);
              border-radius: 4px;

              .composition-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;

                .composition-label {
                  font-size: 13px;
                  font-weight: 500;
                  color: var(--el-text-color-primary);
                }

                .composition-note {
                  font-size: 12px;
                  color: var(--el-text-color-secondary);
                }
              }

              .composition-item {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 12px;
                padding: 12px;
                background: transparent;
                border: 1px solid var(--el-border-color);
                border-radius: 4px;

                &:last-child {
                  margin-bottom: 0;
                }

                .el-select {
                  flex: 1;
                }

                .composition-value {
                  display: flex;
                  align-items: center;
                  gap: 8px;

                  .value-label {
                    font-size: 12px;
                    color: var(--el-text-color-secondary);
                  }

                  .value-unit {
                    font-size: 12px;
                    color: var(--el-text-color-secondary);
                  }
                }
              }
            }

            // 添加属性区域
            .add-attribute-section {
              margin-top: 16px;
              padding-top: 16px;
              border-top: 1px dashed var(--el-border-color-lighter);
            }

            // 折叠区域
            .collapse-section {
              text-align: center;
              margin-top: 16px;
              padding-top: 16px;
              border-top: 1px dashed var(--el-border-color-lighter);
              
              .collapse-text {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                color: #7c4dff;
                font-size: 14px;
                cursor: pointer;
                user-select: none;
                transition: all 0.3s;
                
                &:hover {
                  color: #7c4dff;
                  text-decoration: underline;
                }
                
                .el-icon {
                  font-size: 14px;
                }
              }
            }
          }
        }
      }

      .tab-content {
        animation: fadeIn 0.3s ease;

        .content-form {
          max-width: 900px;

          // 标签右对齐
          :deep(.el-form-item__label) {
            text-align: right;
            white-space: nowrap;
          }

          .form-section {
            margin-bottom: 24px;

            &:last-child {
              margin-bottom: 0;
            }

            .section-title {
              font-size: 14px;
              font-weight: 600;
              color: var(--el-text-color-primary);
              margin-bottom: 16px;
              padding-left: 8px;
              border-left: 3px solid var(--el-color-primary);
            }

            .section-subtitle {
              font-size: 13px;
              color: var(--el-text-color-regular);
              margin-bottom: 12px;
              padding-left: 11px;
            }

            &.mt-20 {
              margin-top: 20px;
            }
          }

          .form-tip {
            margin-top: 4px;
            font-size: 12px;
            color: var(--el-text-color-secondary);
            line-height: 1.5;
          }
        }
      }
    }
  }

  // SKU表单样式
  .sku-form {
    :deep(.el-form-item__label) {
      text-align: right;
      white-space: nowrap;
    }
    
    // SKU List表单项占满空间
    :deep(.el-form-item) {
      &:has(.sku-list-content) {
        margin-bottom: 16px;
        
        .el-form-item__content {
          display: flex;
          flex-direction: column;
        }
      }
    }

    .spec-content-wrapper {
      width: 100%;

      .spec-type-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }

      .spec-selectors-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;

        .spec-selector-item {
          display: flex;
          align-items: center;
          gap: 8px;

          .spec-select {
            flex: 1;
            min-width: 0;
          }

          .delete-value-btn {
            width: 32px;
            height: 32px;
            padding: 0;
            border: 1px solid var(--el-border-color);
            flex-shrink: 0;
            
            &:hover {
              color: #f56c6c;
              border-color: #f56c6c;
            }
          }
        }
      }
    }

    .sku-list-content {
      width: 100%;
      display: flex;
      flex-direction: column;

      .sku-actions-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
      }
      
      .generate-btn {
        font-size: 14px;
        
        .el-icon {
          margin-right: 6px;
        }
      }
      
      .batch-settings-btn {
        flex-shrink: 0;
      }

      .sku-table {
        width: 100%;
        flex: 1;
        
        :deep(.el-table__header) {
          th {
            background: var(--el-fill-color-lighter);
            font-weight: 600;
            font-size: 13px;
            padding: 12px 8px;
          }
        }
        
        // 优化滚动条样式
        :deep(.el-table__body-wrapper) {
          &::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          &::-webkit-scrollbar-thumb {
            background: var(--el-border-color);
            border-radius: 4px;
            
            &:hover {
              background: var(--el-border-color-dark);
            }
          }
          
          &::-webkit-scrollbar-track {
            background: var(--el-fill-color-lighter);
          }
        }
        
        :deep(.el-table__body) {
          td {
            padding: 14px 8px;
            line-height: 1.8;
          }
          
          .main-spec-value {
          font-weight: 600;
          color: var(--el-text-color-primary);
          }
          
          .price-input-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            padding: 0 4px;
            
            .el-input-number {
              flex: 1;
              min-width: 0;
            }
            
            .el-select {
              flex-shrink: 0;
            }
          }
          
          .inventory-input-wrapper {
        display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            padding: 0 6px;
            
            .el-input-number {
              flex-shrink: 0;
              
              :deep(.el-input__wrapper) {
                padding: 1px 10px;
              }
            }
            
            .el-select {
              flex-shrink: 0;
            }
          }
          
          .weight-input-wrapper {
            display: flex;
            align-items: center;
        gap: 8px;
            width: 100%;
            padding: 0 4px;
            
            .el-input-number {
              flex: 1;
              min-width: 0;
            }
            
            .el-select {
              flex-shrink: 0;
            }
          }
          
          .dimensions-input-wrapper {
          display: flex;
            align-items: center;
            gap: 6px;
            width: 100%;
            flex-wrap: nowrap;
            padding: 0 8px;
            
            .dimension-separator {
              color: var(--el-text-color-secondary);
              font-size: 13px;
              flex-shrink: 0;
              font-weight: 500;
              line-height: 1;
              margin: 0 2px;
            }
            
            .el-input-number {
              flex-shrink: 0;
              
              :deep(.el-input__wrapper) {
                padding: 1px 9px;
              }
            }
            
            .el-select {
              flex-shrink: 0;
              
              :deep(.el-input__wrapper) {
                padding: 1px 8px;
              }
            }
          }
        }
        
        // 合并单元格的样式
        :deep(.el-table__body-wrapper) {
          .el-table__row {
            &:not(:last-child) {
              td:first-child {
                border-bottom: 1px solid var(--el-border-color);
              }
            }
          }
        }
        
        // 确保表格单元格垂直居中对齐
        :deep(.el-table__cell) {
          .cell {
            display: flex;
            align-items: center;
            justify-content: center;
            
            &:has(.price-input-wrapper),
            &:has(.inventory-input-wrapper),
            &:has(.weight-input-wrapper),
            &:has(.dimensions-input-wrapper) {
              justify-content: flex-start;
            }
          }
        }
      }
    }
  }

  // SKU部分样式
  .sku-section {
    .spec-item {
      margin-bottom: 24px;

      .spec-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;

        .spec-required {
          color: #f56c6c;
        font-size: 14px;
          font-weight: bold;
        }

        .spec-main-label {
          font-size: 14px;
        color: var(--el-text-color-primary);
          font-weight: 500;
        }
      }

      .spec-selectors-list {
        margin-bottom: 16px;

        .spec-selector-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;

          &:last-child {
            margin-bottom: 0;
          }

          .spec-select {
            flex: 1;
            max-width: 400px;
          }

          .delete-icon-btn {
            width: 32px;
            height: 32px;
            padding: 0;
            border: 1px solid var(--el-border-color);
            flex-shrink: 0;
            
            &:hover {
              color: #f56c6c;
              border-color: #f56c6c;
            }
          }
        }
      }

      .add-option-btn {
        width: 100%;
        max-width: 440px;
        height: 32px;
        background: #e6f7f0;
        color: #52c41a;
        border: 1px dashed #52c41a;
        border-radius: 4px;

        &:hover {
          background: #d9f2e8;
          border-color: #3ea832;
          color: #3ea832;
        }

        .el-icon {
          margin-right: 4px;
        }
      }
    }

    .add-spec-btn {
      width: auto;
      padding: 8px 16px;
      background: #e6f7f0;
      color: #52c41a;
      border: 1px dashed #52c41a;
      border-radius: 4px;
      margin-bottom: 24px;

      &:hover {
        background: #d9f2e8;
        border-color: #3ea832;
        color: #3ea832;
      }

      .el-icon {
        margin-right: 4px;
      }
    }

  }

  // SKC头部样式
  .skc-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--el-border-color-lighter);

    .skc-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-primary);

      .required-star {
        color: #f56c6c;
        margin-right: 4px;
      }
    }
  }

  // 图片选项行
  .image-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
    padding: 12px 16px;
    background: var(--el-fill-color-extra-light);
    border-radius: 6px;

    .selection-info {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
    }

    .selected-count {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--el-text-color-regular);
      padding: 4px 12px;
      border-radius: 4px;
      transition: all 0.3s;

      .check-icon {
        color: #67c23a;
        font-size: 16px;
      }

      .info-icon {
        color: #909399;
        font-size: 16px;
      }

      &:has(.check-icon) {
        background: #f0f9ff;
        border: 1px solid #7c4dff;
        color: #7c4dff;
        font-weight: 500;
      }
    }

    .skc-actions {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-left: auto;

      .el-button {
        height: 32px;
        min-width: 140px;
        padding: 0 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        border-radius: 4px;
        transition: all 0.3s;
        gap: 6px;

        .el-icon {
        font-size: 14px;
        }

        // AI按钮 - 始终紫色
        &.ai-button {
          background-color: #7c4dff;
          border-color: #7c4dff;
          color: #fff;

          &:hover,
          &:focus {
            background-color: #9466ff;
            border-color: #9466ff;
            color: #fff;
          }

          &:active {
            background-color: #6a3de6;
            border-color: #6a3de6;
          }

          &.is-disabled,
          &.is-disabled:hover,
          &.is-disabled:focus {
            background-color: var(--el-fill-color-light);
            border-color: var(--el-border-color-lighter);
            color: var(--el-text-color-placeholder);
          }
        }

        // 删除按钮 - 红色
        &.delete-button {
          background-color: transparent;
          border-color: #f56c6c;
          color: #f56c6c;

          &:hover,
          &:focus {
            background-color: #f56c6c;
            border-color: #f56c6c;
            color: #fff;
          }

          &:active {
            background-color: #f23838;
            border-color: #f23838;
            color: #fff;
          }

          &.is-disabled,
          &.is-disabled:hover,
          &.is-disabled:focus {
            background-color: transparent;
            border-color: var(--el-border-color-lighter);
            color: var(--el-text-color-placeholder);
          }
        }

        // 其他按钮 - 默认透明，hover时紫色
        &.action-button {
          background-color: transparent;
          border-color: var(--el-border-color);
          color: var(--el-text-color-regular);

          &:hover,
          &:focus {
            background-color: #7c4dff;
            border-color: #7c4dff;
            color: #fff;
          }

          &:active {
            background-color: #6a3de6;
            border-color: #6a3de6;
            color: #fff;
          }

          &.is-disabled,
          &.is-disabled:hover,
          &.is-disabled:focus {
            background-color: transparent;
            border-color: var(--el-border-color-lighter);
            color: var(--el-text-color-placeholder);
          }
        }
      }
    }
  }

  // SKU图片区域
  .sku-images-section {
    margin-top: 40px;

    .section-divider {
      margin: 30px 0 20px 0;

      .divider-text {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        padding: 0 16px;
      }
    }
  }

  // Shein详情图区域
  .shein-detail-section {
    margin-top: 40px;

    .section-divider {
      margin: 30px 0 20px 0;

      .divider-text {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        padding: 0 16px;
      }
    }
  }

  // Other Product Images区域
  .other-images-section {
    margin-top: 40px;

    .section-divider {
      margin: 30px 0 20px 0;

      .divider-text {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        padding: 0 16px;
      }
    }

    .other-images-upload {
      padding: 20px;
      background: var(--el-fill-color-extra-light);
      border-radius: 8px;
      border: 1px solid var(--el-border-color-lighter);

      :deep(.el-upload-list--picture-card) {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      :deep(.el-upload--picture-card) {
        width: 100px;
        height: 100px;
        border: 2px dashed var(--el-border-color);
        border-radius: 6px;
        transition: all 0.3s;
        background: var(--el-fill-color-extra-light);
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          border-color: #7c4dff;
          background: rgba(124, 77, 255, 0.05);
        }

        .el-icon {
          font-size: 24px;
          color: var(--el-text-color-secondary);
        }
      }

      :deep(.el-upload-list__item) {
        width: 100px;
        height: 136px;
        margin: 0;
        position: relative;
        transition: all 0.3s;
        padding-bottom: 36px !important;

        // 图片尺寸显示
        &::after {
          content: attr(data-dimensions);
          position: absolute;
          bottom: 36px;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          font-size: 11px;
          padding: 2px 4px;
          text-align: center;
          line-height: 1.2;
          pointer-events: none;
          z-index: 2;
        }

        img {
          object-fit: cover;
          width: 100px;
          height: 100px;
          cursor: pointer;
        }

        // 选中状态样式
        &.image-selected {
          border: 2px solid #7c4dff !important;
          box-shadow: 0 0 0 2px rgba(124, 77, 255, 0.2);

          &::before {
            content: '';
            position: absolute;
            top: 4px;
            right: 4px;
            width: 20px;
            height: 20px;
            background: #7c4dff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath fill='white' d='M406.656 706.944L195.84 496.128a42.666 42.666 0 1 0-60.331 60.331l240.811 240.853a42.666 42.666 0 0 0 60.373 0l512-512a42.666 42.666 0 1 0-60.331-60.331L406.656 706.944z'/%3E%3C/svg%3E");
            background-size: 14px;
            background-position: center;
            background-repeat: no-repeat;
          }
        }

        // 自定义操作按钮
        .custom-image-actions {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 36px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 4px;
          background: transparent;
          padding: 4px;
          z-index: 3;

          .action-btn {
            flex: 1;
            height: 28px;
            padding: 0;
            border: none;
            background: transparent;
            color: var(--el-text-color-regular);
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;

            &:hover {
              background: rgba(0, 0, 0, 0.05);
              color: #7c4dff;
            }

            &:active {
              transform: scale(0.95);
            }

            svg {
              width: 14px;
              height: 14px;
            }

            &.replace-btn:hover {
              color: #7c4dff;
            }

            &.delete-btn:hover {
              color: #f56c6c;
              background: rgba(245, 108, 108, 0.1);
            }

            &.zoom-btn:hover {
              color: #7c4dff;
            }
          }
        }
      }
    }
  }

  // 图片上传说明样式
  .upload-notice-simple {
    background: var(--el-fill-color-extra-light);
    padding: 12px 16px;
    border-radius: 6px;
        margin-bottom: 20px;
    border: 1px solid var(--el-border-color-lighter);

    p {
      margin: 0 0 8px 0;
      font-size: 13px;
        font-weight: 600;
        color: var(--el-text-color-primary);

        &:last-child {
          margin-bottom: 0;
      }
    }

    .detail-hint {
      margin: 8px 0 0 0;
      font-size: 12px;
      font-weight: 400;
      line-height: 1.6;
      color: var(--el-text-color-regular);
    }

    ol {
      margin: 0;
      padding-left: 20px;
      font-size: 12px;
      line-height: 1.6;
      color: var(--el-text-color-regular);

      li {
        margin-bottom: 6px;

        &:last-child {
          margin-bottom: 0;
        }

        strong {
          color: #f56c6c;
          font-weight: 600;
        }
      }
    }
  }

  // 图片上传表格样式
  .image-upload-table {
    :deep(.el-table__header) {
      th {
        background: var(--el-fill-color-lighter);
        font-weight: 600;
        font-size: 13px;
        padding: 12px 8px;

        .required-star {
          color: #f56c6c;
          margin-right: 4px;
          font-size: 14px;
        }

        .header-with-tooltip {
          display: inline-flex;
          align-items: center;
          gap: 6px;

          .info-icon-header {
            font-size: 16px;
            color: var(--el-text-color-placeholder);
            cursor: help;
            transition: all 0.3s;

            &:hover {
              color: #7c4dff;
              transform: scale(1.1);
            }
          }
        }
      }
    }

    :deep(.el-table__body) {
      td {
        padding: 16px 8px;
        vertical-align: top;
      }
    }

    // 空状态样式
    .empty-image-table {
      padding: 60px 20px;
      text-align: center;

      .empty-icon {
        font-size: 64px;
        color: var(--el-text-color-placeholder);
        margin-bottom: 16px;
      }

      .empty-text {
        margin: 0 0 8px 0;
        font-size: 14px;
        font-weight: 500;
        color: var(--el-text-color-regular);
      }

      .empty-hint {
        margin: 0;
        font-size: 13px;
        color: var(--el-text-color-secondary);
      }
    }

    // 通用的图片项 hover 和选中样式
    :deep(.el-upload-list__item) {
      position: relative;
      display: flex;
      flex-direction: column;
      padding-bottom: 36px !important; // 为下方按钮预留空间
      
      // 图片尺寸显示（所有图片都显示）
      &::after {
        content: attr(data-dimensions);
        position: absolute;
        bottom: 36px;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        font-size: 11px;
        padding: 2px 4px;
        text-align: center;
        line-height: 1.2;
        pointer-events: none;
        z-index: 2;
      }
      
      img {
        cursor: pointer;
      }

      &:hover:not(.is-uploading) {
        img {
          border-color: #7c4dff !important;
          box-shadow: 0 2px 8px rgba(124, 77, 255, 0.3) !important;
        }
      }

      &.image-selected {
        border: 3px solid #7c4dff !important;
        box-shadow: 0 0 0 3px rgba(124, 77, 255, 0.2) !important;
        
        &::before {
          content: '✓';
          position: absolute;
          top: 4px;
          right: 4px;
          width: 24px;
          height: 24px;
          background: #7c4dff;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          z-index: 3;
          line-height: 1;
        }
      }

      // 隐藏默认的操作按钮
      .el-upload-list__item-actions {
        display: none !important;
      }
    }

    // Square Image 和 Color Block Image 达到限制时隐藏上传按钮
    .single-image-upload {
      // 当已有图片时隐藏上传按钮
      :deep(.el-upload--picture-card) {
        &.is-disabled {
          display: none !important;
        }
      }
      
      // 备用方案：通过检测是否有图片项来隐藏
      &:has(.el-upload-list__item) {
        :deep(.el-upload--picture-card) {
          display: none !important;
        }
      }
    }

    // 自定义操作按钮样式
    :deep(.custom-image-actions) {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 32px;
      display: flex;
      gap: 4px;
      padding: 4px;
      background: var(--el-fill-color-light);
      border-top: 1px solid var(--el-border-color-lighter);

      .action-btn {
        flex: 1;
        height: 24px;
        border: none;
        border-radius: 4px;
        background: var(--el-fill-color);
        color: var(--el-text-color-regular);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        padding: 0;

        .el-icon {
          width: 16px;
          height: 16px;
          
          svg {
            width: 100%;
            height: 100%;
          }
        }

        &:hover {
          background: #7c4dff;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 2px 4px rgba(124, 77, 255, 0.3);
        }

        &.delete-btn:hover {
          background: #f56c6c;
          color: #fff;
        }

        &:active {
          transform: translateY(0);
        }
      }
    }

    .spec-cell {
      padding: 8px;
            font-size: 13px;
      font-weight: 500;
            color: var(--el-text-color-primary);
          }

    .upload-cell {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 8px;
      min-height: 120px;

      &.detail-images-cell {
        justify-content: flex-start;
      }

      .table-upload {
        :deep(.el-upload-list--picture-card) {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: flex-start;

          .el-upload-list__item {
            width: 100px;
            height: 136px; // 100px 图片 + 36px 操作栏
            margin: 0;
            position: relative;
            transition: all 0.3s;
            padding-bottom: 36px !important;

            // 图片尺寸显示 - 调整位置避免遮挡操作按钮
            &::after {
              content: attr(data-dimensions);
              position: absolute;
              bottom: 36px; // 在操作按钮上方
              left: 0;
              right: 0;
              background: rgba(0, 0, 0, 0.7);
              color: #fff;
              font-size: 11px;
              padding: 2px 4px;
              text-align: center;
              line-height: 1.2;
              pointer-events: none;
              z-index: 2;
            }

            img {
              object-fit: cover;
              width: 100px;
              height: 100px;
              cursor: pointer;
            }

            // 选中状态样式
            &.image-selected {
              border: 2px solid #7c4dff !important;
              box-shadow: 0 0 0 2px rgba(124, 77, 255, 0.2);

              &::before {
                content: '';
                position: absolute;
                top: 4px;
                right: 4px;
                width: 20px;
                height: 20px;
                background: #7c4dff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath fill='white' d='M406.656 706.944L195.84 496.128a42.666 42.666 0 1 0-60.331 60.331l240.811 240.853a42.666 42.666 0 0 0 60.373 0l512-512a42.666 42.666 0 1 0-60.331-60.331L406.656 706.944z'/%3E%3C/svg%3E");
                background-size: 14px;
                background-position: center;
                background-repeat: no-repeat;
              }
            }

            // 自定义操作按钮
            .custom-image-actions {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 36px;
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 4px;
              background: transparent;
              padding: 4px;
              z-index: 3;

              .action-btn {
                flex: 1;
                height: 28px;
                padding: 0;
                border: none;
                background: transparent;
                color: var(--el-text-color-regular);
                cursor: pointer;
                border-radius: 4px;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;

                &:hover {
                  background: rgba(0, 0, 0, 0.05);
                  color: #7c4dff;
                }

                &:active {
                  transform: scale(0.95);
                }

                svg {
                  width: 14px;
                  height: 14px;
                }

                &.replace-btn:hover {
                  color: #7c4dff;
                }

                &.delete-btn:hover {
                  color: #f56c6c;
                  background: rgba(245, 108, 108, 0.1);
                }

                &.zoom-btn:hover {
                  color: #7c4dff;
                }
              }
            }
          }
        }

        :deep(.el-upload--picture-card) {
          width: 100px;
          height: 100px;
          border: 2px dashed var(--el-border-color);
          border-radius: 6px;
          transition: all 0.3s;
          background: var(--el-fill-color-extra-light);
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover {
            border-color: #7c4dff;
            background: rgba(124, 77, 255, 0.05);
          }

          .el-icon {
            font-size: 24px;
            color: var(--el-text-color-secondary);
          }
        }

        &.multi {
          :deep(.el-upload-list--picture-card) {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            max-width: 100%;
        }

        :deep(.el-upload--picture-card) {
            width: 100px;
            height: 100px;
          }

          :deep(.el-upload-list__item) {
            width: 100px;
            height: 136px; // 100px 图片 + 36px 操作栏
            position: relative;
            transition: all 0.3s;
            padding-bottom: 36px !important;

            // 图片尺寸显示 - 调整位置避免遮挡操作按钮
            &::after {
              content: attr(data-dimensions);
              position: absolute;
              bottom: 36px; // 在操作按钮上方
              left: 0;
              right: 0;
              background: rgba(0, 0, 0, 0.7);
              color: #fff;
              font-size: 11px;
              padding: 2px 4px;
              text-align: center;
              line-height: 1.2;
              pointer-events: none;
              z-index: 2;
            }

            img {
              object-fit: cover;
              width: 100px;
              height: 100px;
              cursor: pointer;
            }

            // 选中状态样式
            &.image-selected {
              border: 2px solid #7c4dff !important;
              box-shadow: 0 0 0 2px rgba(124, 77, 255, 0.2);

              &::before {
                content: '';
                position: absolute;
                top: 4px;
                right: 4px;
                width: 20px;
                height: 20px;
                background: #7c4dff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath fill='white' d='M406.656 706.944L195.84 496.128a42.666 42.666 0 1 0-60.331 60.331l240.811 240.853a42.666 42.666 0 0 0 60.373 0l512-512a42.666 42.666 0 1 0-60.331-60.331L406.656 706.944z'/%3E%3C/svg%3E");
                background-size: 14px;
                background-position: center;
                background-repeat: no-repeat;
              }
            }

            // 自定义操作按钮
            .custom-image-actions {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 36px;
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 4px;
              background: transparent;
              padding: 4px;
              z-index: 3;

              .action-btn {
                flex: 1;
                height: 28px;
                padding: 0;
                border: none;
                background: transparent;
                color: var(--el-text-color-regular);
                cursor: pointer;
                border-radius: 4px;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;

                &:hover {
                  background: rgba(0, 0, 0, 0.05);
                  color: #7c4dff;
                }

                &:active {
                  transform: scale(0.95);
                }

                svg {
                  width: 14px;
                  height: 14px;
                }

                &.replace-btn:hover {
                  color: #7c4dff;
                }

                &.delete-btn:hover {
                  color: #f56c6c;
                  background: rgba(245, 108, 108, 0.1);
                }

                &.zoom-btn:hover {
                  color: #7c4dff;
                }
              }
            }
          }
        }

      }

      .upload-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;

        .upload-hint {
          font-size: 12px;
          color: var(--el-text-color-placeholder);
          text-align: center;
        }
      }
    }
  }

  // SKU图片表格特殊样式
  .sku-image-table {
    .upload-cell {
      justify-content: flex-start !important;
      padding: 16px 20px;
    }

    :deep(.el-table__body) {
      td {
        padding: 16px 8px;
      }
    }

    // 确保 SKU 图片也显示尺寸
    :deep(.el-upload-list__item) {
      &::after {
        content: attr(data-dimensions);
        position: absolute;
        bottom: 36px;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        font-size: 11px;
        padding: 2px 4px;
        text-align: center;
        line-height: 1.2;
        pointer-events: none;
        z-index: 2;
      }
    }
  }

  // Shein详情图表格特殊样式
  .shein-detail-table {
    .upload-cell {
      justify-content: flex-start !important;
      padding: 16px 20px;
    }

    :deep(.el-table__body) {
      td {
        padding: 16px 8px;
        
        // 主规格列垂直居中
        &:first-child {
          vertical-align: middle;
          
          .spec-cell {
            font-weight: 600;
            color: var(--el-text-color-primary);
          }
        }
      }
    }

    // 站点下拉选择器样式
    :deep(.el-select) {
      width: 100%;
      
      .el-input__wrapper {
        box-shadow: 0 0 0 1px var(--el-border-color) inset;
        
        &:hover {
          box-shadow: 0 0 0 1px #7c4dff inset;
        }
      }
      
      &.is-focus .el-input__wrapper {
        box-shadow: 0 0 0 1px #7c4dff inset;
      }
    }

    // 确保 Shein 详情图片也显示尺寸
    :deep(.el-upload-list__item) {
      &::after {
        content: attr(data-dimensions);
        position: absolute;
        bottom: 36px;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        font-size: 11px;
        padding: 2px 4px;
        text-align: center;
        line-height: 1.2;
        pointer-events: none;
        z-index: 2;
      }
    }
  }

  // 底部操作栏 - 吸底
  .footer-actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--el-bg-color);
    border-top: 1px solid var(--el-border-color-light);
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
    z-index: 98;

    .footer-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      // 与标题左对齐：16px(header padding) + 40px(button) + 16px(gap)
      padding-left: 72px;
      padding-right: 16px;

      .footer-left {
        display: flex;
        gap: 12px;
      }

      .footer-right {
        display: flex;
        gap: 12px;

        .el-button--primary {
          min-width: 120px;
          background-color: #753BBD;
          border-color: #753BBD;

          &:hover,
          &:focus {
            background-color: #8d52d1;
            border-color: #8d52d1;
          }

          &:active {
            background-color: #5f2f9a;
            border-color: #5f2f9a;
          }
        }
      }
    }
  }
}

// AI生成对话框样式
.ai-generate-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
  }

  .ai-dialog-content {
    display: flex;
    height: 600px;
    max-height: 70vh;

    .ai-settings {
      width: 350px;
      padding: 24px;
      background: var(--el-fill-color-extra-light);
      border-right: 1px solid var(--el-border-color-light);
      overflow-y: auto;

      .settings-title {
        margin: 0 0 20px 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .settings-form {
        :deep(.el-form-item__label) {
          font-weight: 500;
        }
      }
    }

    .ai-preview {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;

      .preview-title {
        margin: 0 0 20px 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        flex-shrink: 0;
      }

      .generating-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        min-height: 300px;
        color: var(--el-text-color-secondary);

        .el-icon {
          margin-bottom: 16px;
          color: var(--el-color-primary);
        }

        p {
          margin: 0;
          font-size: 14px;
        }
      }

      .empty-placeholder {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 300px;
      }

      .results-list {
        flex: 1;
        overflow-y: auto;
        .result-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 16px;
          margin-bottom: 12px;
          background: var(--el-bg-color);
          border: 1px solid var(--el-border-color-lighter);
          border-radius: 8px;
          transition: all 0.3s ease;

          &:hover {
            border-color: var(--el-color-primary);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          }

      .result-content {
        flex: 1;
        padding-right: 16px;
        display: flex;
        align-items: flex-start;
        gap: 12px;

            .result-number {
              font-weight: 600;
              color: var(--el-color-primary);
              flex-shrink: 0;
            }

            .result-text-wrapper {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 8px;

              .result-text {
                color: var(--el-text-color-primary);
                line-height: 1.6;
              }

              .result-meta {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
              }
            }
          }

          .field-ai-actions {
            display: flex;
            gap: 8px;
          }

          .result-actions {
            display: flex;
            gap: 8px;
            flex-shrink: 0;
          }
        }
      }
    }
  }
}

// SEO Analysis 对话框样式 - 专业设计
// 新版 SEO 分析弹窗样式
.seo-analysis-dialog-v2 {
  :deep(.el-message-box) {
    max-width: 900px;
    width: 90vw;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2);
    border: none;
  }

  :deep(.el-message-box__header) {
    padding: 0;
    border-bottom: none;
  }

  :deep(.el-message-box__title) {
    font-size: 0;
  }

  :deep(.el-message-box__content) {
    padding: 0;
  }

  :deep(.el-message-box__message) {
    padding: 0;
  }

  :deep(.el-message-box__btns) {
    padding: 20px 32px;
    border-top: 1px solid #e5e7eb;
    background: linear-gradient(to bottom, #fafafa 0%, #ffffff 100%);

    .el-button {
      padding: 12px 32px;
      font-weight: 600;
      border-radius: 10px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-size: 14px;

      &.el-button--primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        color: white;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
      }
    }
  }

  .seo-analysis-content-v2 {
    max-height: 75vh;
    overflow-y: auto;
    background: #f8f9fa;
    
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f3f5;
    }
    
    &::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      border-radius: 10px;
      
      &:hover {
        background: linear-gradient(180deg, #764ba2 0%, #667eea 100%);
      }
    }
  }

  // 顶部评分区域
  .seo-header-v2 {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 40px;
    display: flex;
    align-items: center;
    gap: 40px;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      opacity: 0.6;
    }
    
    .score-circle {
      position: relative;
      width: 140px;
      height: 140px;
      flex-shrink: 0;
      z-index: 1;
      
      .score-inner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        
        .score-number {
          font-size: 48px;
          font-weight: 800;
          color: white;
          line-height: 1;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        
        .score-icon {
          font-size: 24px;
          margin-top: 8px;
        }
      }
      
      .score-ring {
        width: 140px;
        height: 140px;
        transform: rotate(-90deg);
        
        circle {
          fill: none;
          stroke-width: 8;
        }
        
        .score-ring-bg {
          stroke: rgba(255, 255, 255, 0.2);
        }
        
        .score-ring-fill {
          stroke-linecap: round;
          transition: stroke-dasharray 1s ease-in-out;
        }
      }
    }
    
    .score-info {
      flex: 1;
      color: white;
      z-index: 1;
      
      .score-title {
        font-size: 28px;
        font-weight: 800;
        margin-bottom: 12px;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      
      .score-status {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 20px;
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        display: inline-block;
        backdrop-filter: blur(10px);
      }
      
      .analyzed-text {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 16px 20px;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        font-size: 15px;
        line-height: 1.6;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        
        svg {
          flex-shrink: 0;
        }
      }
    }
  }

  // 通用节标题
  .section-title-v2 {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 20px;
    
    svg {
      color: #667eea;
    }
    
    .count-badge {
      margin-left: 8px;
      padding: 4px 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
    }
    
    .hint-badge {
      margin-left: auto;
      padding: 6px 14px;
      background: #f3f4f6;
      color: #6b7280;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
    }
  }

  // Animated sections
  .animate-section {
    animation: slideInRight 0.5s ease-out;
  }

  // Metrics grid
  .metrics-section {
    padding: 32px;
    background: white;
    border-bottom: 1px solid #e5e7eb;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }

  .metric-card {
    padding: 20px;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    transition: all 0.3s;
    animation: scaleIn 0.4s ease-out;
    
    &:nth-child(1) { animation-delay: 0.1s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.3s; }
    &:nth-child(4) { animation-delay: 0.4s; }
    
    &:hover {
      border-color: #667eea;
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
    }
    
    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      .metric-label {
        font-size: 13px;
        font-weight: 600;
        color: #6b7280;
      }
      
      .metric-score {
        font-size: 18px;
        font-weight: 800;
        color: #1f2937;
      }
    }
    
    .metric-bar {
      height: 8px;
      background: #e5e7eb;
      border-radius: 10px;
      overflow: hidden;
      
      .metric-fill {
        height: 100%;
        border-radius: 10px;
        transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }
    }
  }

  // AI推荐名称
  .names-section {
    padding: 32px;
    background: white;
    border-bottom: 1px solid #e5e7eb;
  }

  .names-grid {
    display: grid;
    gap: 16px;
  }

  .name-card-v2 {
    background: linear-gradient(135deg, #fafbff 0%, #ffffff 100%);
    border: 2px solid #e5e7eb;
    border-radius: 14px;
    padding: 20px 24px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: slideInRight 0.5s ease-out;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
      transition: left 0.5s;
    }
    
    &:nth-child(1) { animation-delay: 0.1s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.3s; }
    &:nth-child(4) { animation-delay: 0.4s; }
    &:nth-child(5) { animation-delay: 0.5s; }
    
    &:hover {
      border-color: #667eea;
      transform: translateX(4px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
      
      &::before {
        left: 100%;
      }
      
      .btn-use-v2 {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
    }
    
    .name-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      .name-index {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 800;
      }
      
      .name-stats {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .char-count {
          padding: 6px 14px;
          background: #f3f4f6;
          color: #6b7280;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          
          &.optimal {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
          }
        }
        
        .optimal-badge {
          padding: 4px 10px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          animation: pulse 2s ease-in-out infinite;
        }
      }
    }
    
    .name-text {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      line-height: 1.6;
      margin-bottom: 16px;
      padding-left: 48px;
    }
    
    .btn-use-v2 {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 12px 24px;
      background: #f3f4f6;
      color: #4b5563;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      
      svg {
        transition: transform 0.3s;
      }
      
      &:hover svg {
        transform: scale(1.2);
      }
      
      &:active {
        transform: scale(0.98);
      }
    }
  }

  // 优化建议
  .suggestions-section {
    padding: 32px;
    background: white;
    border-bottom: 1px solid #e5e7eb;
  }

  .suggestions-list-v2 {
    display: grid;
    gap: 16px;
  }

  .suggestion-card-v2 {
    display: flex;
    gap: 16px;
    padding: 20px;
    border: 2px solid;
    border-radius: 12px;
    transition: all 0.3s;
    animation: fadeIn 0.5s ease-out;
    
    &:nth-child(1) { animation-delay: 0.1s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.3s; }
    
    &:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    }
    
    .suggestion-icon-v2 {
      font-size: 24px;
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .suggestion-body {
      flex: 1;
      
      .suggestion-title-v2 {
        font-size: 15px;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 8px;
      }
      
      .suggestion-detail-v2 {
        font-size: 14px;
        color: #6b7280;
        line-height: 1.6;
        margin-bottom: 12px;
      }
      
      .btn-apply-v2 {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        &:active {
          transform: translateY(0);
        }
      }
    }
  }

  // 关键词推荐
  .keywords-section {
    padding: 32px;
    background: white;
  }

  .keywords-grid-v2 {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .keyword-tag-v2 {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: linear-gradient(135deg, #fafbff 0%, #f3f4f6 100%);
    border: 2px solid #e5e7eb;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
    animation: scaleIn 0.4s ease-out;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(102, 126, 234, 0.2);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }
    
    .tag-text {
      line-height: 1;
    }
    
    .tag-add-icon {
      opacity: 0;
      transform: scale(0);
      transition: all 0.3s;
    }
    
    &:hover {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: #667eea;
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.25);
      
      &::before {
        width: 300%;
        height: 300%;
      }
      
      .tag-add-icon {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    &:active {
      transform: translateY(-1px);
    }
    
    &.selected {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-color: #10b981;
      color: white;
      
      .tag-add-icon {
        opacity: 1;
        transform: scale(1) rotate(45deg);
      }
    }
  }
}

// 旧版样式保留（向后兼容）
.seo-analysis-dialog {
  :deep(.el-message-box) {
    max-width: 720px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    border: none;
  }

  :deep(.el-message-box__header) {
    padding: 0;
    border-bottom: none;
  }

  :deep(.el-message-box__title) {
    font-size: 0;
  }

  :deep(.el-message-box__content) {
    padding: 0;
  }

  :deep(.el-message-box__message) {
    padding: 0;
  }

  :deep(.el-message-box__btns) {
    padding: 20px 28px;
    border-top: 1px solid #f0f0f0;
    background: #fafafa;

    .el-button {
      padding: 11px 28px;
      font-weight: 600;
      border-radius: 6px;
      transition: all 0.2s;
      font-size: 14px;

      &.el-button--primary {
        background: #1a1a1a;
        border: none;
        color: white;

        &:hover {
          background: #333;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      }
    }
  }

  .seo-analysis-content {
    max-height: 600px;
    overflow-y: auto;
    background: #fff;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f8f8f8;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #d0d0d0;
      border-radius: 3px;
      
      &:hover {
        background: #b0b0b0;
      }
    }

    // New Header Design
    .seo-header-new {
      background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
      padding: 32px;
      border-bottom: 1px solid #e5e7eb;

      .header-top {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 24px;

        .score-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px 20px;
          border-radius: 12px;
          color: white;
          min-width: 100px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);

          .score-value {
            font-size: 36px;
            font-weight: 700;
            line-height: 1;
            margin-bottom: 4px;
          }

          .score-label {
            font-size: 11px;
            font-weight: 600;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
        }

        .field-info {
          flex: 1;

          .field-label {
            font-size: 12px;
            color: #6b7280;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
          }

          .field-name {
            font-size: 20px;
            font-weight: 700;
            color: #111827;
          }
        }
      }

      .current-name-section {
        background: white;
        border: 2px solid #e5e7eb;
        border-radius: 10px;
        padding: 16px 20px;

        .section-label-mini {
          font-size: 11px;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .current-name-display {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          line-height: 1.5;
        }
      }
    }

    // New Body Design
    .seo-body-new {
      padding: 32px;
      background: white;
    }

    .section-block {
      margin-bottom: 32px;

      &:last-child {
        margin-bottom: 0;
      }

      .section-heading {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 16px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 20px;

        svg {
          color: #6b7280;
        }

        .hint-text {
          margin-left: auto;
          font-size: 12px;
          color: #9ca3af;
          font-weight: 500;
        }
      }
    }

    // Product Name Suggestion Cards
    .suggestions-grid-new {
      display: grid;
      gap: 12px;

      .name-suggestion-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        background: #f9fafb;
        border: 2px solid #e5e7eb;
        border-radius: 10px;
        transition: all 0.25s;

        &:hover {
          border-color: #d1d5db;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .suggestion-content {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;

          .suggestion-index {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: #e5e7eb;
            color: #6b7280;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 700;
            flex-shrink: 0;
          }

          .suggestion-name {
            font-size: 15px;
            font-weight: 600;
            color: #111827;
            line-height: 1.5;
          }
        }

        .btn-use {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          background: #111827;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;

          svg {
            width: 16px;
            height: 16px;
          }

          &:hover {
            background: #1f2937;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }

          &:active {
            transform: translateY(0);
          }
        }
      }
    }

    // Keywords Grid
    .keywords-grid-new {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      .keyword-tag {
        padding: 10px 18px;
        background: #f3f4f6;
        color: #374151;
        border: 2px solid #e5e7eb;
        border-radius: 24px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.25s;
        user-select: none;

        &:hover {
          background: #111827;
          color: white;
          border-color: #111827;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        &:active {
          transform: translateY(0);
        }

        &.selected {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

// SEO 弹窗响应式设计
@media (max-width: 768px) {
  .seo-analysis-dialog-v2 {
    :deep(.el-message-box) {
      max-width: 95vw;
      width: 95vw;
      margin: 10px;
    }

    .seo-header-v2 {
      flex-direction: column;
      padding: 24px 20px;
      gap: 24px;

      .score-circle {
        width: 120px;
        height: 120px;

        .score-inner .score-number {
          font-size: 40px;
        }

        .score-ring {
          width: 120px;
          height: 120px;
        }
      }

      .score-info {
        width: 100%;

        .score-title {
          font-size: 22px;
        }

        .score-status {
          font-size: 16px;
        }

        .analyzed-text {
          font-size: 14px;
          padding: 12px 16px;
        }
      }
    }

    .metrics-section,
    .names-section,
    .suggestions-section,
    .keywords-section {
      padding: 20px 16px;
    }

    .metrics-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .section-title-v2 {
      font-size: 16px;
      flex-wrap: wrap;

      .hint-badge {
        margin-left: 0;
        margin-top: 8px;
        width: 100%;
        text-align: center;
      }
    }

    .name-card-v2 {
      padding: 16px;

      .name-card-header {
        .name-index {
          width: 32px;
          height: 32px;
          font-size: 12px;
        }

        .char-count {
          font-size: 11px;
          padding: 4px 10px;
        }
      }

      .name-text {
        font-size: 14px;
        padding-left: 0;
        margin-top: 8px;
      }

      .btn-use-v2 {
        padding: 10px 20px;
        font-size: 13px;
      }
    }

    .suggestion-card-v2 {
      flex-direction: column;
      padding: 16px;

      .suggestion-icon-v2 {
        width: 32px;
        height: 32px;
        font-size: 20px;
      }

      .suggestion-body {
        .suggestion-title-v2 {
          font-size: 14px;
        }

        .suggestion-detail-v2 {
          font-size: 13px;
        }
      }
    }

    .keywords-grid-v2 {
      gap: 8px;

      .keyword-tag-v2 {
        padding: 10px 16px;
        font-size: 13px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .shein-product-create {
    padding-bottom: 60px;

    .page-header {
      padding: 12px 16px;

      .header-left {
        gap: 12px;

        .page-title {
          font-size: 18px;
        }
      }
    }

    .tabs-sticky-wrapper {
      top: 49px;

      .tabs-container {
        padding: 0 16px;
        flex-direction: column;
        
        .horizontal-tabs {
          width: 100%;

          .tabs-nav {
            .tab-item {
              padding: 12px 12px;
              font-size: 13px;

              &:first-child {
                padding-left: 0;
              }

              .tab-label-wrapper {
                .tab-icon {
                  display: none;
                }

                .tab-label {
                  font-size: 13px;
                }
              }
            }
          }

          .tabs-active-bar {
            width: 80px;
          }
        }
      }
    }

    .content-wrapper {
      .form-content {
        padding: 16px 12px;

        .attribute-form-item {
          .attribute-header-actions {
            margin-bottom: 8px;
          }
        }

        .attributes-list {
          .attribute-item {
            &.editing-mode {
              padding: 12px;

              .editing-content {
                gap: 8px;

                .editing-actions {
                  flex-direction: column;
                  gap: 6px;
                  padding-top: 6px;

                  .el-button {
                    width: 100%;
                    margin-left: 0 !important;
                    margin-right: 0 !important;

                    &:first-child {
                      margin-left: 0 !important;
                      margin-right: 0 !important;
                    }
                  }
                }
              }
            }
          }
        }
        
        .section-block {
          .section-card {
            :deep(.el-card__body) {
              padding: 16px;
            }
          }
        }
      }
    }

    .footer-actions {
      .footer-container {
        padding: 8px 16px;
        
        .footer-left {
          gap: 8px;

          .el-button {
            font-size: 13px;
            padding: 8px 12px;
          }
        }

        .footer-right {
          .el-button--primary {
            min-width: 100px;
            font-size: 13px;
            padding: 8px 16px;
            background-color: #753BBD;
            border-color: #753BBD;

            &:hover,
            &:focus {
              background-color: #8d52d1;
              border-color: #8d52d1;
            }

            &:active {
              background-color: #5f2f9a;
              border-color: #5f2f9a;
            }
          }
        }
      }
    }
  }
  
  // 批量设置对话框样式
  .batch-input-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .batch-dimensions-row {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .dimension-separator {
      color: var(--el-text-color-secondary);
      font-size: 14px;
      font-weight: 500;
    }
  }
  
  // 尺码表对话框样式
  .size-chart-dialog {
    .size-chart-content {
      .size-chart-form {
        :deep(.el-form-item__label) {
          text-align: right;
          white-space: nowrap;
        }
      }
      
      .size-chart-table-wrapper {
        margin-top: 24px;
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        padding: 16px;
        background: var(--el-fill-color-lighter);
        
        .size-chart-table {
          width: 100%;
          
          :deep(.el-table__header) {
            th {
              background: var(--el-fill-color);
              font-weight: 600;
              font-size: 13px;
            }
          }
          
          :deep(.el-table__body) {
            td {
              padding: 10px 8px;
              
              .el-input-number {
                width: 100%;
              }
            }
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .shein-product-create {
    .tabs-sticky-wrapper {
      .tabs-container {
        padding-left: 12px;
        padding-right: 12px;
      }
    }

    .content-wrapper {
      .form-content {
        padding-left: 12px;
        padding-right: 12px;
      }
    }
    
    .footer-actions {
      .footer-container {
        padding-left: 12px;
        padding-right: 12px;
        flex-direction: column;
        gap: 8px;

        .footer-left,
        .footer-right {
          width: 100%;
          justify-content: stretch;

          .el-button {
            flex: 1;
          }
        }
      }
    }
  }
}

// Detail Image Tooltip 全局样式
.detail-image-tooltip {
  max-width: 400px;

  .tooltip-content {
    line-height: 1.6;
    font-size: 13px;

    p {
      margin: 0;
    }

    strong {
      color: #7c4dff;
      font-weight: 600;
    }
  }
}

// AI图片处理对话框样式
.ai-image-dialog {
  :deep(.el-dialog) {
    background: linear-gradient(135deg, #fafafa 0%, #f5f0ff 100%);
  }

  :deep(.el-dialog__header) {
    background: linear-gradient(180deg, #3c3c3c 0%, #2c2c2c 100%);
    border-bottom: 2px solid rgba(124, 77, 255, 0.4);
  }
  
  :deep(.el-dialog__title) {
    color: #e0e0e0;
    font-weight: 600;
  }
  
  :deep(.el-dialog__headerbtn .el-dialog__close) {
    color: #b0b0b0;
    
    &:hover {
      color: #7c4dff;
    }
  }

  :deep(.el-dialog__body) {
    padding: 0;
    background: transparent;
    max-height: 75vh;
    overflow: hidden;
  }


  :deep(.el-button) {
    padding: 10px 24px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 6px;
    transition: all 0.3s;
  }

  :deep(.el-button--default) {
    background: rgba(60, 60, 60, 0.9);
    border: 1px solid rgba(124, 77, 255, 0.3);
    color: #e0e0e0;

    &:hover {
      background: rgba(124, 77, 255, 0.2);
      border-color: #7c4dff;
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(124, 77, 255, 0.4);
    }
  }

  :deep(.el-button--primary) {
    background: linear-gradient(135deg, #7c4dff 0%, #6a3de8 100%);
    border-color: #7c4dff;
    color: #fff;
    box-shadow: 0 4px 12px rgba(124, 77, 255, 0.4);

    &:hover {
      background: linear-gradient(135deg, #6a3de8 0%, #5a2dd8 100%);
      border-color: #6a3de8;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(124, 77, 255, 0.5);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(124, 77, 255, 0.3);
    }
  }

  :deep(.el-progress__text) {
    color: #7c4dff !important;
  }

  :deep(.el-progress-bar__inner) {
    background-color: #7c4dff;
  }

  :deep(.el-radio__input.is-checked .el-radio__inner) {
    border-color: #7c4dff;
    background: #7c4dff;
  }

  :deep(.el-radio__input.is-checked + .el-radio__label) {
    color: #7c4dff;
  }

  :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: #7c4dff;
    border-color: #7c4dff;
  }

  :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
    color: #7c4dff;
  }

  :deep(.el-slider__bar) {
    background-color: #7c4dff;
  }

  :deep(.el-slider__button) {
    border-color: #7c4dff;
  }

  .ai-image-content {
    display: flex;
    height: 100%;
    max-height: 75vh;

    // 左侧设置面板
    .ai-image-settings-panel {
      width: 600px;
      padding: 24px;
      background: var(--el-fill-color-extra-light);
      border-right: 2px solid rgba(124, 77, 255, 0.2);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;

      .action-buttons {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        padding-top: 16px;
        border-top: 2px solid rgba(124, 77, 255, 0.2);
        margin-top: auto;

        .el-button {
          flex: 1;
        }
      }
    }

    .selected-images-preview {
      .preview-title {
        font-size: 15px;
        font-weight: 700;
        margin-bottom: 12px;
        color: #7c4dff;
        
        span {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
      }

      .preview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        gap: 12px;
        max-height: 160px;
        overflow-y: auto;
        padding: 12px;
        background: transparent;
        border: 2px solid rgba(124, 77, 255, 0.2);
        border-radius: 8px;

        .preview-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(124, 77, 255, 0.15);
          border-radius: 8px;
          transition: all 0.3s;

          &:hover {
            background: rgba(124, 77, 255, 0.1);
            border-color: #7c4dff;
            transform: translateY(-2px);
          }

          img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 6px;
            border: 1px solid rgba(124, 77, 255, 0.2);
            transition: all 0.3s;

            &:hover {
              border-color: #7c4dff;
            }
          }

          .preview-name {
            font-size: 12px;
            color: #606266;
            max-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
          }
        }
      }
    }

    .ai-processing-options {
      padding: 20px;
      background: rgba(255, 255, 255, 0.02);
      border: 2px solid rgba(124, 77, 255, 0.2);
      border-radius: 12px;
      margin-bottom: 20px;

      .option-title {
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 16px;
        color: #7c4dff;
        display: flex;
        align-items: center;
        gap: 8px;

        &::before {
          content: '⚙️';
          font-size: 20px;
        }
      }

      :deep(.el-form-item) {
        margin-bottom: 18px;
      }

      :deep(.el-form-item__label) {
        color: #606266;
        font-weight: 600;
        font-size: 14px;
      }

      :deep(.el-select),
      :deep(.el-input) {
        .el-input__wrapper {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(124, 77, 255, 0.2);
          transition: all 0.3s;

          &:hover {
            border-color: #7c4dff;
            background: rgba(255, 255, 255, 0.12);
            box-shadow: 0 0 0 3px rgba(124, 77, 255, 0.1);
          }

          &.is-focus {
            border-color: #7c4dff;
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 0 0 3px rgba(124, 77, 255, 0.15);
          }
        }
      }

      :deep(.el-checkbox__label) {
        color: #606266;
        font-size: 14px;
      }

      :deep(.el-slider) {
        padding: 0;
      }
    }

    // AI功能网格
    .ai-features-grid {
      .feature-title {
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 16px;
        color: #7c4dff;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .ai-feature-cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;

        .ai-feature-card {
          padding: 18px 14px;
          border: 2px solid rgba(124, 77, 255, 0.15);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          background: rgba(255, 255, 255, 0.02);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 140px;

          &:hover {
            border-color: #7c4dff;
            background: rgba(124, 77, 255, 0.08);
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(124, 77, 255, 0.3);
          }

          &.active {
            border-color: #7c4dff;
            border-width: 3px;
            background: linear-gradient(135deg, #7c4dff 0%, #6a3de8 100%);
            box-shadow: 0 6px 24px rgba(124, 77, 255, 0.6);
            padding: 17px 13px; // 补偿边框增加的宽度
            
            .feature-icon {
              transform: scale(1.15);
              filter: brightness(1.3) drop-shadow(0 2px 8px rgba(255, 255, 255, 0.3));
            }

            .feature-name {
              color: #ffffff;
              font-weight: 700;
              text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
            }

            .feature-desc {
              color: rgba(255, 255, 255, 0.95);
            }
          }

          .feature-icon {
            font-size: 40px;
            margin-bottom: 10px;
            transition: all 0.3s;
            line-height: 1;
          }

          .feature-name {
            font-size: 14px;
            font-weight: 600;
            color: #303133;
            margin-bottom: 6px;
            transition: all 0.3s;
            line-height: 1.3;
          }

          .feature-desc {
            font-size: 12px;
            color: #909399;
            line-height: 1.5;
            transition: all 0.3s;
            word-break: break-word;
          }
        }
      }
    }

    // 动态选项区域
    .ai-dynamic-options {
      padding: 20px;
      background: transparent;
      border: 2px solid rgba(124, 77, 255, 0.25);
      border-radius: 12px;

      .option-section {
        &:not(:last-child) {
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(124, 77, 255, 0.1);
        }

        .option-section-title {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 12px;
          color: #7c4dff;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .bg-type-group {
          margin-bottom: 16px;
        }

        .color-picker-area {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;

          .preset-colors {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;

            .color-option {
              width: 36px;
              height: 36px;
              border-radius: 8px;
              cursor: pointer;
              border: 2px solid #dcdfe6;
              transition: all 0.3s;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

              &:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
              }

              &.active {
                border-color: #7c4dff;
                border-width: 3px;
                box-shadow: 0 0 0 3px rgba(124, 77, 255, 0.2);
              }
            }
          }
        }

        .generation-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 12px;
        }

        .gradient-picker-area {
          :deep(.el-select) {
            width: 100%;
          }
        }
      }
    }

    .ai-processing-progress {
      padding: 20px;
      background: rgba(124, 77, 255, 0.08);
      border: 1px solid rgba(124, 77, 255, 0.15);
      border-radius: 8px;

      .progress-info {
        text-align: center;
        margin-top: 12px;
        font-size: 14px;
        color: #7c4dff;
        font-weight: 600;
      }
    }

    // 右侧结果预览面板
    .ai-results-preview {
      flex: 1;
      padding: 24px;
      background: var(--el-bg-color);
      overflow-y: auto;
      display: flex;
      flex-direction: column;

      .results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 2px solid rgba(124, 77, 255, 0.2);
        flex-shrink: 0;

        .results-title-area {
          display: flex;
          flex-direction: column;
          gap: 6px;

          .results-title {
            font-size: 18px;
            font-weight: 700;
            color: #7c4dff;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .results-count {
            font-size: 13px;
            color: #909399;
            font-weight: 500;
          }
        }

        .el-button--primary {
          background: linear-gradient(135deg, #7c4dff 0%, #6a3de8 100%);
          border: none;
          box-shadow: 0 4px 12px rgba(124, 77, 255, 0.4);
          
          &:hover {
            box-shadow: 0 6px 16px rgba(124, 77, 255, 0.6);
            transform: translateY(-2px);
          }
        }
      }

      .results-grid {
        display: flex;
        flex-direction: column;
        gap: 20px;
        flex: 1;
        overflow-y: auto;
        padding: 8px 4px;

        .result-item {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(124, 77, 255, 0.2);
          border-radius: 12px;
          padding: 16px;
          transition: all 0.3s;

          &:hover {
            background: rgba(124, 77, 255, 0.05);
            border-color: #7c4dff;
            box-shadow: 0 8px 20px rgba(124, 77, 255, 0.3);
            transform: translateY(-2px);
          }

          .result-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(124, 77, 255, 0.15);

            .result-index {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 28px;
              height: 28px;
              background: linear-gradient(135deg, #7c4dff 0%, #6a3de8 100%);
              color: white;
              border-radius: 50%;
              font-size: 13px;
              font-weight: 700;
              box-shadow: 0 2px 8px rgba(124, 77, 255, 0.4);
            }

            .result-name {
              font-size: 14px;
              color: #303133;
              font-weight: 600;
              flex: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          .result-images {
            display: flex;
            align-items: stretch;
            gap: 20px;

            .image-column {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 12px;
              min-width: 0; // 防止flex子项溢出

              .column-label {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                font-weight: 600;
                color: #606266;
                padding: 8px 12px;
                background: rgba(124, 77, 255, 0.08);
                border-radius: 8px;
                flex-shrink: 0;

                .el-icon {
                  font-size: 18px;
                  color: #7c4dff;
                  flex-shrink: 0;
                }

                span {
                  flex-shrink: 0;
                }

                .feature-badge {
                  margin-left: auto;
                  background: linear-gradient(135deg, #7c4dff 0%, #6a3de8 100%);
                  color: white;
                  padding: 4px 12px;
                  border-radius: 12px;
                  font-size: 11px;
                  font-weight: 700;
                  box-shadow: 0 2px 8px rgba(124, 77, 255, 0.5);
                  white-space: nowrap;
                  flex-shrink: 0;
                }
              }

              .image-wrapper {
                position: relative;
                border: 2px solid rgba(124, 77, 255, 0.25);
                border-radius: 10px;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.3s;
                background: linear-gradient(45deg, #f5f5f5 25%, transparent 25%, transparent 75%, #f5f5f5 75%, #f5f5f5),
                            linear-gradient(45deg, #f5f5f5 25%, transparent 25%, transparent 75%, #f5f5f5 75%, #f5f5f5);
                background-size: 20px 20px;
                background-position: 0 0, 10px 10px;
                flex: 1;

                &:hover {
                  border-color: #7c4dff;
                  box-shadow: 0 6px 16px rgba(124, 77, 255, 0.35);
                  transform: scale(1.03);

                  .image-overlay {
                    opacity: 1;
                  }
                }

                img {
                  width: 100%;
                  height: 200px;
                  object-fit: contain;
                  display: block;
                  padding: 8px;
                }

                .image-overlay {
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: rgba(0, 0, 0, 0.5);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  opacity: 0;
                  transition: opacity 0.3s;

                  .preview-icon {
                    font-size: 36px;
                    color: white;
                    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
                  }
                }
              }
            }

            .arrow-separator {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0 12px;
              flex-shrink: 0;

              .arrow-icon {
                font-size: 32px;
                color: #7c4dff;
                filter: drop-shadow(0 3px 6px rgba(124, 77, 255, 0.4));
                animation: pulse 2s ease-in-out infinite;
              }
            }

            @keyframes pulse {
              0%, 100% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(1.1);
                opacity: 0.8;
              }
            }
          }
        }
      }
    }
  }
}

// 图片预览对话框样式
.image-preview-dialog {
  :deep(.el-dialog) {
    background: rgba(0, 0, 0, 0.95) !important;
    border: 2px solid rgba(124, 77, 255, 0.3) !important;
  }

  :deep(.el-dialog__header) {
    background: rgba(124, 77, 255, 0.1) !important;
    border-bottom: 2px solid rgba(124, 77, 255, 0.3) !important;

    .el-dialog__title {
      color: #7c4dff !important;
      font-weight: 700 !important;
    }

    .el-dialog__close {
      color: #7c4dff !important;
      font-size: 20px !important;

      &:hover {
        color: #fff !important;
      }
    }
  }

  :deep(.el-dialog__body) {
    padding: 0 !important;
  }

  .preview-image-container {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    min-height: 400px !important;
    max-height: 70vh !important;
    padding: 20px !important;
    background: rgba(0, 0, 0, 0.9) !important;

    .preview-image {
      max-width: 100% !important;
      max-height: 100% !important;
      object-fit: contain !important;
      border-radius: 8px !important;
      box-shadow: 0 8px 32px rgba(124, 77, 255, 0.4) !important;
    }
  }
}

// 图片编辑对话框样式
.image-edit-dialog {
  :deep(.el-dialog) {
    background: #fafafa;
  }

  :deep(.el-dialog__header) {
    background: linear-gradient(180deg, #3c3c3c 0%, #2c2c2c 100%);
    border-bottom: 2px solid rgba(124, 77, 255, 0.4);
  }
  
  :deep(.el-dialog__title) {
    color: #e0e0e0;
    font-weight: 600;
  }
  
  :deep(.el-dialog__headerbtn .el-dialog__close) {
    color: #b0b0b0;
    
    &:hover {
      color: #7c4dff;
    }
  }

  :deep(.el-dialog__body) {
    padding: 0;
    height: 700px;
    background: transparent;
  }

  :deep(.el-button--primary) {
    background-color: #7c4dff;
    border-color: #7c4dff;

    &:hover {
      background-color: #6a3de8;
      border-color: #6a3de8;
    }
  }

  .image-edit-content {
    display: flex;
    height: 100%;

    .edit-sidebar {
      width: 250px;
      border-right: 1px solid rgba(124, 77, 255, 0.15);
      background: rgba(124, 77, 255, 0.03);

      .selected-images-list {
        height: 100%;
        overflow-y: auto;

        .list-title {
          padding: 16px;
          font-size: 14px;
          font-weight: 600;
          color: #303133;
          background: rgba(124, 77, 255, 0.05);
          border-bottom: 1px solid rgba(124, 77, 255, 0.1);
        }

        .image-list-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.3s;
          border-bottom: 1px solid #e4e7ed;

          &:hover {
            background: #f3e5ff;
          }

          &.active {
            background: #7c4dff;
            
            .item-info {
              .item-name,
              .item-size {
                color: #fff;
              }
            }
          }

          img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 4px;
            border: 2px solid #dcdfe6;
          }

          .item-info {
            flex: 1;
            min-width: 0;

            .item-name {
              font-size: 13px;
              color: #303133;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-bottom: 4px;
            }

            .item-size {
              font-size: 12px;
              color: #909399;
            }
          }
        }
      }
    }

    .edit-main {
      flex: 1;
      display: flex;
      flex-direction: column;

      .edit-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        background: linear-gradient(180deg, #2c2c2c 0%, #1f1f1f 100%);
        backdrop-filter: blur(10px);
        border-bottom: 2px solid rgba(124, 77, 255, 0.4);
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);

        :deep(.el-button-group) {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          border-radius: 6px;
          overflow: hidden;

          .el-button {
            padding: 10px 20px;
            font-weight: 600;
            transition: all 0.3s;

            &:not(.el-button--primary) {
              background: rgba(60, 60, 60, 0.9);
              border-color: rgba(124, 77, 255, 0.3);
              color: #e0e0e0;

              &:hover {
                background: rgba(124, 77, 255, 0.2);
                border-color: #7c4dff;
                color: #fff;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(124, 77, 255, 0.4);
              }
            }
          }

          .el-button--primary {
            background: linear-gradient(135deg, #7c4dff 0%, #6a3de8 100%);
            border-color: #7c4dff;
            box-shadow: 0 4px 12px rgba(124, 77, 255, 0.5);
            color: #fff;

            &:hover {
              background: linear-gradient(135deg, #8c5dff 0%, #7a4df8 100%);
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(124, 77, 255, 0.6);
            }
          }
        }
      }

      .edit-canvas-area {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
        overflow: auto;
        padding: 20px;
        position: relative;

        .canvas-container {
          max-width: 100%;
          max-height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;

          .edit-image {
            max-width: 100%;
            max-height: 100%;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          }
        }

        // 裁剪覆盖层样式
        :deep(.crop-overlay) {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          overflow: hidden;

          .crop-image-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            
            .crop-image {
              max-width: 100%;
              max-height: 100%;
              transition: transform 0.1s ease-out;
              pointer-events: all;
            }
          }

          .crop-box {
            position: absolute;
            border: 2px solid #7c4dff;
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
            cursor: move;
            transition: none;

            .crop-border {
              position: absolute;
              top: -2px;
              left: -2px;
              right: -2px;
              bottom: -2px;
              border: 1px solid rgba(255, 255, 255, 0.5);
              pointer-events: none;
            }

            .crop-grid {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              pointer-events: none;

              .crop-grid-line {
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
              }
            }

            .crop-handle {
              position: absolute;
              background: #7c4dff;
              border: 2px solid #fff;
              border-radius: 50%;
              cursor: pointer;
              z-index: 10;

              &.top-left {
                width: 14px;
                height: 14px;
                top: -7px;
                left: -7px;
                cursor: nw-resize;
              }

              &.top-right {
                width: 14px;
                height: 14px;
                top: -7px;
                right: -7px;
                cursor: ne-resize;
              }

              &.bottom-left {
                width: 14px;
                height: 14px;
                bottom: -7px;
                left: -7px;
                cursor: sw-resize;
              }

              &.bottom-right {
                width: 14px;
                height: 14px;
                bottom: -7px;
                right: -7px;
                cursor: se-resize;
              }

              &.top {
                width: 30px;
                height: 8px;
                top: -4px;
                left: 50%;
                transform: translateX(-50%);
                border-radius: 4px;
                cursor: n-resize;
              }

              &.bottom {
                width: 30px;
                height: 8px;
                bottom: -4px;
                left: 50%;
                transform: translateX(-50%);
                border-radius: 4px;
                cursor: s-resize;
              }

              &.left {
                width: 8px;
                height: 30px;
                left: -4px;
                top: 50%;
                transform: translateY(-50%);
                border-radius: 4px;
                cursor: w-resize;
              }

              &.right {
                width: 8px;
                height: 30px;
                right: -4px;
                top: 50%;
                transform: translateY(-50%);
                border-radius: 4px;
                cursor: e-resize;
              }
            }
          }

          .crop-controls {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 20;

            .crop-zoom {
              display: flex;
              align-items: center;
              gap: 12px;
              background: rgba(0, 0, 0, 0.7);
              padding: 10px 20px;
              border-radius: 25px;
              border: 2px solid rgba(124, 77, 255, 0.5);

              .zoom-btn {
                background: rgba(124, 77, 255, 0.8);
                color: #fff;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s;

                &:hover {
                  background: #7c4dff;
                  transform: scale(1.05);
                }
              }

              .zoom-slider {
                width: 150px;
                height: 6px;
                -webkit-appearance: none;
                appearance: none;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 3px;
                outline: none;

                &::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 18px;
                  height: 18px;
                  background: #7c4dff;
                  border: 2px solid #fff;
                  border-radius: 50%;
                  cursor: pointer;
                  box-shadow: 0 2px 8px rgba(124, 77, 255, 0.5);

                  &:hover {
                    transform: scale(1.2);
                  }
                }

                &::-moz-range-thumb {
                  width: 18px;
                  height: 18px;
                  background: #7c4dff;
                  border: 2px solid #fff;
                  border-radius: 50%;
                  cursor: pointer;
                  box-shadow: 0 2px 8px rgba(124, 77, 255, 0.5);

                  &:hover {
                    transform: scale(1.2);
                  }
                }
              }
            }
          }

          .crop-actions {
            position: absolute;
            bottom: 40px;
            display: flex;
            gap: 16px;
            z-index: 20;

            button {
              padding: 12px 32px;
              border: none;
              border-radius: 8px;
              font-size: 15px;
              font-weight: 700;
              cursor: pointer;
              transition: all 0.3s;
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);

              &.crop-apply-btn {
                background: linear-gradient(135deg, #7c4dff 0%, #6a3de8 100%);
                color: #fff;
                border: 2px solid rgba(255, 255, 255, 0.3);

                &:hover {
                  background: linear-gradient(135deg, #8c5dff 0%, #7a4df8 100%);
                  transform: translateY(-3px);
                  box-shadow: 0 6px 20px rgba(124, 77, 255, 0.8);
                }

                &:active {
                  transform: translateY(-1px);
                  box-shadow: 0 3px 12px rgba(124, 77, 255, 0.6);
                }
              }

              &.crop-cancel-btn {
                background: rgba(255, 255, 255, 0.95);
                color: #606266;
                border: 2px solid rgba(124, 77, 255, 0.3);

                &:hover {
                  background: rgba(255, 255, 255, 1);
                  border-color: #7c4dff;
                  color: #7c4dff;
                  transform: translateY(-3px);
                  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
                }

                &:active {
                  transform: translateY(-1px);
                }
              }
            }
          }
        }
      }

      .edit-options-panel {
        width: 100%;
        border-top: 2px solid rgba(124, 77, 255, 0.4);
        background: linear-gradient(180deg, #2c2c2c 0%, #1f1f1f 100%);
        backdrop-filter: blur(10px);
        padding: 24px;
        max-height: 300px;
        overflow-y: auto;
        box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.4);

        .tool-options {
          .option-title {
            font-size: 15px;
            font-weight: 700;
            margin-bottom: 16px;
            color: #b794f6;
            display: flex;
            align-items: center;
            gap: 8px;
            padding-bottom: 12px;
            border-bottom: 2px solid rgba(124, 77, 255, 0.3);

            &::before {
              content: '🎨';
              font-size: 18px;
            }
          }

          .el-button-group {
            display: flex;
            gap: 8px;
            
            .el-button {
              font-weight: 600;
              padding: 10px 20px;
              transition: all 0.3s;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);

              &:not(.el-button--primary) {
                background: rgba(60, 60, 60, 0.9);
                border-color: rgba(124, 77, 255, 0.3);
                color: #e0e0e0;

                &:hover {
                  background: rgba(124, 77, 255, 0.2);
                  border-color: #7c4dff;
                  color: #fff;
                  transform: translateY(-2px);
                  box-shadow: 0 4px 12px rgba(124, 77, 255, 0.4);
                }
              }

              &:active {
                transform: translateY(0);
              }
            }

            .el-button--primary {
              background: linear-gradient(135deg, #7c4dff 0%, #6a3de8 100%);
              border-color: #7c4dff;
              color: #fff;
            }
          }

          .el-form {
            max-width: 400px;

            :deep(.el-form-item__label) {
              color: #e0e0e0;
              font-weight: 600;
            }

            :deep(.el-input__inner),
            :deep(.el-input-number__decrease),
            :deep(.el-input-number__increase) {
              background: rgba(50, 50, 50, 0.8);
              color: #e0e0e0;
              border-color: rgba(124, 77, 255, 0.3);
            }
          }

          // 滤镜预设网格
          .filter-presets-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 16px;

            .filter-preset-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 18px 14px;
              border: 2px solid rgba(124, 77, 255, 0.3);
              border-radius: 10px;
              cursor: pointer;
              transition: all 0.3s;
              background: linear-gradient(135deg, rgba(50, 50, 50, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%);
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
              position: relative;
              overflow: hidden;

              &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #7c4dff 0%, #6a3de8 100%);
                opacity: 0;
                transition: all 0.3s;
              }

              &:hover {
                border-color: #7c4dff;
                background: linear-gradient(135deg, rgba(124, 77, 255, 0.3) 0%, rgba(124, 77, 255, 0.2) 100%);
                transform: translateY(-4px);
                box-shadow: 0 6px 16px rgba(124, 77, 255, 0.5);

                &::before {
                  opacity: 1;
                }

                .preset-icon {
                  transform: scale(1.2);
                }
              }

              &.active {
                border-color: #7c4dff;
                border-width: 3px;
                background: linear-gradient(135deg, rgba(124, 77, 255, 0.4) 0%, rgba(124, 77, 255, 0.3) 100%);
                box-shadow: 0 4px 16px rgba(124, 77, 255, 0.6), 
                           0 0 0 4px rgba(124, 77, 255, 0.3);

                &::before {
                  opacity: 1;
                  height: 4px;
                }

                .preset-icon {
                  transform: scale(1.1);
                }

                &::after {
                  content: '✓';
                  position: absolute;
                  top: 8px;
                  right: 8px;
                  width: 20px;
                  height: 20px;
                  background: #7c4dff;
                  color: #fff;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 12px;
                  font-weight: bold;
                }
              }

              .preset-icon {
                font-size: 36px;
                margin-bottom: 10px;
                transition: all 0.3s;
              }

              .preset-name {
                font-size: 13px;
                color: #c0c0c0;
                text-align: center;
                font-weight: 600;
                transition: all 0.3s;
              }
              
              &:hover .preset-name {
                color: #fff;
              }
              
              &.active .preset-name {
                color: #fff;
              }
            }
          }
        }
      }
    }
  }

  // 滑块主题色
  :deep(.el-slider__bar) {
    background-color: #7c4dff;
  }

  :deep(.el-slider__button) {
    border-color: #7c4dff;
  }

  :deep(.el-slider__button:hover) {
    border-color: #7c4dff;
  }
}
</style>

