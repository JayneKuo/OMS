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
                  <el-button class="ai-button" :icon="MagicStick" @click="handleAIGenerateProductName">AI Generate</el-button>
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
                <el-button class="ai-button" :disabled="selectedImagesCount === 0">
                  <el-icon><MagicStick /></el-icon>
                  AI Process
                </el-button>
                <el-button class="delete-button" :disabled="selectedImagesCount === 0">
                  <el-icon><Delete /></el-icon>
                  Batch Delete
                </el-button>
                <el-button class="action-button" :disabled="selectedImagesCount === 0">
                  <el-icon><Refresh /></el-icon>
                  Image Translation
                </el-button>
                <el-button class="action-button" :disabled="selectedImagesCount === 0">
                  <el-icon><Edit /></el-icon>
                  Image Cropping
                </el-button>
                <el-button class="action-button" :disabled="selectedImagesCount === 0">
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
                  <div class="upload-cell">
                <el-upload
                      v-model:file-list="row.squareImage"
                  list-type="picture-card"
                      :limit="1"
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
                  <div class="upload-cell">
                <el-upload
                      v-model:file-list="row.colorBlockImage"
                  list-type="picture-card"
                      :limit="1"
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
                  <el-button class="ai-button" :disabled="selectedSkuImagesCount === 0">
                    <el-icon><MagicStick /></el-icon>
                    AI Process
                  </el-button>
                  <el-button class="delete-button" :disabled="selectedSkuImagesCount === 0">
                    <el-icon><Delete /></el-icon>
                    Batch Delete
                  </el-button>
                  <el-button class="action-button" :disabled="selectedSkuImagesCount === 0">
                    <el-icon><Edit /></el-icon>
                    Image Cropping
                  </el-button>
                  <el-button class="action-button" :disabled="selectedSkuImagesCount === 0">
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
                  <el-button class="ai-button" :disabled="selectedSheinImagesCount === 0">
                    <el-icon><MagicStick /></el-icon>
                    AI Process
                  </el-button>
                  <el-button class="delete-button" :disabled="selectedSheinImagesCount === 0">
                    <el-icon><Delete /></el-icon>
                    Batch Delete
                  </el-button>
                  <el-button class="action-button" :disabled="selectedSheinImagesCount === 0">
                    <el-icon><Edit /></el-icon>
                    Image Editing
                  </el-button>
                  <el-button class="action-button" :disabled="selectedSheinImagesCount === 0">
                    <el-icon><Refresh /></el-icon>
                    Image Translation
                  </el-button>
                  <el-button class="action-button" :disabled="selectedSheinImagesCount === 0">
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
                  <el-button class="ai-button" :disabled="selectedOtherImagesCount === 0">
                    <el-icon><MagicStick /></el-icon>
                    AI Process
                  </el-button>
                  <el-button class="delete-button" :disabled="selectedOtherImagesCount === 0">
                    <el-icon><Delete /></el-icon>
                    Batch Delete
                  </el-button>
                  <el-button class="action-button" :disabled="selectedOtherImagesCount === 0">
                    <el-icon><Edit /></el-icon>
                    Image Editing
                  </el-button>
                  <el-button class="action-button" :disabled="selectedOtherImagesCount === 0">
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
                <el-option label="Chinese" value="zh" />
                <el-option label="Spanish" value="es" />
                <el-option label="French" value="fr" />
              </el-select>
            </el-form-item>

            <!-- 关键词 -->
            <el-form-item label="Keywords">
              <el-checkbox v-model="aiSettings.includeKeywords">
                Add specific keywords in title
              </el-checkbox>
              <el-input
                v-if="aiSettings.includeKeywords"
                v-model="aiSettings.keywords"
                placeholder="Enter keywords, separated by commas"
                style="margin-top: 8px;"
              />
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
                <span class="result-text">{{ result.content }}</span>
              </div>
              <div class="result-actions">
                <el-button size="small" type="primary" @click="handleApplyResult(result.content)">
                  Apply
                </el-button>
                <el-button size="small" @click="handleTranslateResult(result.content, index)">
                  中文
                </el-button>
              </div>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Plus,
  Refresh,
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
  Edit
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

// 计算选中图片的数量
const selectedImagesCount = computed(() => selectedImages.value.size)

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
const selectedSkuImages = ref<Set<string>>(new Set())
const selectedSkuImagesCount = computed(() => selectedSkuImages.value.size)

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
const selectedSheinImages = ref<Set<string>>(new Set())
const selectedSheinImagesCount = computed(() => selectedSheinImages.value.size)

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
const selectedOtherImages = ref<Set<string>>(new Set())
const selectedOtherImagesCount = computed(() => selectedOtherImages.value.size)

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
      if (img.uid) ids.push(img.uid)
    })
    row.squareImage.forEach((img: any) => {
      if (img.uid) ids.push(img.uid)
    })
    row.colorBlockImage.forEach((img: any) => {
      if (img.uid) ids.push(img.uid)
    })
  })
  return ids
}

// 全选/取消全选
watch(selectAllImages, (newVal) => {
  if (newVal) {
    // 全选：添加所有图片
    const allIds = getAllImageIds()
    selectedImages.value = new Set(allIds)
  } else {
    // 取消全选：清空
    selectedImages.value.clear()
  }
  // 更新UI
  updateImageSelectionUI()
})

// 检查图片是否被选中
const isImageSelected = (file: any) => {
  return file?.uid && selectedImages.value.has(file.uid)
}

// 切换图片选中状态
const toggleImageSelection = (file: any) => {
  if (!file?.uid) return
  
  if (selectedImages.value.has(file.uid)) {
    selectedImages.value.delete(file.uid)
  } else {
    selectedImages.value.add(file.uid)
  }
  
  // 更新全选状态
  const allIds = getAllImageIds()
  selectAllImages.value = allIds.length > 0 && allIds.every(id => selectedImages.value.has(id))
}

// AI生成相关
const aiGenerateDialogVisible = ref(false)
const aiGenerateType = ref<'title' | 'description'>('title')
const aiGenerating = ref(false)
const aiSettings = reactive({
  language: 'en',
  includeKeywords: false,
  keywords: ''
})
const aiResults = ref<Array<{ content: string, translated?: string }>>([])


const handlePreview = (file: any) => {
  previewImageUrl.value = file.url || URL.createObjectURL(file.raw)
  previewDialogVisible.value = true
}

// 处理图片上传变化，获取并显示图片尺寸
const handleImageChange = (file: any, fileList: any[]) => {
  if (file.raw) {
    const img = new Image()
    img.onload = () => {
      // 获取图片尺寸
      const dimensions = `${img.naturalWidth} x ${img.naturalHeight}`
      
      // 使用 nextTick 确保 DOM 已更新
      nextTick(() => {
        // 查找对应的图片元素并添加尺寸信息
        const uploadItems = document.querySelectorAll('.el-upload-list__item')
        uploadItems.forEach((item: any) => {
          const imgElement = item.querySelector('img')
          if (imgElement && imgElement.src === img.src) {
            item.setAttribute('data-dimensions', dimensions)
            // 设置 uid 到 DOM 元素上，方便后续查找
            if (file.uid) {
              item.setAttribute('data-uid', file.uid)
            }
          }
        })
        
        // 初始化所有图片的点击事件
        initializeImageClickEvents()
      })
    }
    img.src = URL.createObjectURL(file.raw)
  }
}

// 初始化所有图片的点击事件
const initializeImageClickEvents = () => {
  nextTick(() => {
    const uploadItems = document.querySelectorAll('.el-upload-list__item')
    uploadItems.forEach((item: any) => {
      // 如果已经添加过点击事件，跳过
      if (item.dataset.clickAdded) return
      
      item.dataset.clickAdded = 'true'
      item.style.cursor = 'pointer'
      
      // 隐藏默认的操作按钮
      const defaultActions = item.querySelector('.el-upload-list__item-actions')
      if (defaultActions) {
        defaultActions.style.display = 'none'
      }
      
      // 添加点击事件到图片本身
      const imgElement = item.querySelector('img')
      if (imgElement) {
        imgElement.addEventListener('click', (e: MouseEvent) => {
          e.stopPropagation()
          
          // 通过 uid 找到对应的文件
          const uid = item.getAttribute('data-uid')
          if (!uid) return
          
          const allImages = getAllImages()
          const clickedFile = allImages.find((f: any) => f.uid === uid)
          
          if (clickedFile) {
            toggleImageSelection(clickedFile)
            updateImageSelectionUI()
          }
        })
      }
      
      // 添加自定义操作按钮
      if (!item.querySelector('.custom-image-actions')) {
        const actionsDiv = document.createElement('div')
        actionsDiv.className = 'custom-image-actions'
        
        // 预览按钮
        const previewBtn = document.createElement('button')
        previewBtn.className = 'action-btn preview-btn'
        previewBtn.innerHTML = '<i class="el-icon"><svg viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448zm0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160z"></path></svg></i>'
        previewBtn.title = 'Preview'
        previewBtn.onclick = (e) => {
          e.stopPropagation()
          const uid = item.getAttribute('data-uid')
          const allImages = getAllImages()
          const file = allImages.find((f: any) => f.uid === uid)
          if (file) {
            handlePreview(file)
          }
        }
        
        // 删除按钮
        const deleteBtn = document.createElement('button')
        deleteBtn.className = 'action-btn delete-btn'
        deleteBtn.innerHTML = '<i class="el-icon"><svg viewBox="0 0 1024 1024"><path fill="currentColor" d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path></svg></i>'
        deleteBtn.title = 'Delete'
        deleteBtn.onclick = (e) => {
          e.stopPropagation()
          // 触发 Element Plus 的删除功能
          const deleteIcon = item.querySelector('.el-icon--close')
          if (deleteIcon) {
            deleteIcon.click()
          }
        }
        
        actionsDiv.appendChild(previewBtn)
        actionsDiv.appendChild(deleteBtn)
        item.appendChild(actionsDiv)
      }
      
      // 添加 hover 提示
      item.title = 'Click to select/deselect'
    })
  })
}

// 获取所有图片
const getAllImages = () => {
  const images: any[] = []
  imageRowsData.value.forEach(row => {
    images.push(...row.detailImages, ...row.squareImage, ...row.colorBlockImage)
  })
  return images
}

// 更新单个图片项的UI
const updateImageItemUI = (item: HTMLElement, file: any) => {
  if (isImageSelected(file)) {
    item.classList.add('image-selected')
  } else {
    item.classList.remove('image-selected')
  }
}

// 更新所有图片选中状态的UI
const updateImageSelectionUI = () => {
  nextTick(() => {
    const uploadItems = document.querySelectorAll('.el-upload-list__item')
    const allImages = getAllImages()
    
    uploadItems.forEach((item: any) => {
      const imgElement = item.querySelector('img')
      if (imgElement) {
        const file = allImages.find((f: any) => {
          const itemSrc = imgElement.src
          const fileSrc = f.url || (f.raw ? URL.createObjectURL(f.raw) : '')
          return itemSrc === fileSrc
        })
        
        if (file) {
          updateImageItemUI(item, file)
        }
      }
    })
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

// 执行AI生成
const handleGenerateAI = async () => {
  aiGenerating.value = true
  aiResults.value = []
  
  try {
    // 模拟AI生成延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 生成模拟结果
    if (aiGenerateType.value === 'title') {
      aiResults.value = [
        { content: 'Chic Style Essentials for Trendsetters' },
        { content: 'Fashion Forward Collection Unveiled' },
        { content: 'Elegant Basics for Modern Wardrobe' },
        { content: 'Trendy Must-Have Fashion Pieces' },
        { content: 'Contemporary Style Staples Collection' }
      ]
    } else {
      aiResults.value = [
        { content: 'Discover our latest collection featuring premium quality materials and contemporary designs. Perfect for any occasion, these pieces combine comfort with style to elevate your everyday look.' },
        { content: 'Experience the perfect blend of fashion and functionality with our carefully curated selection. Each item is designed with attention to detail and crafted to last.' },
        { content: 'Upgrade your wardrobe with our exclusive range of stylish essentials. Made from high-quality fabrics, these pieces offer both comfort and sophistication.' }
      ]
    }
    
    ElMessage.success('AI generation completed')
  } catch (error) {
    ElMessage.error('AI generation failed')
  } finally {
    aiGenerating.value = false
  }
}

// 应用AI生成结果
const handleApplyResult = (content: string) => {
  if (aiGenerateType.value === 'title') {
    formData.productTitle = content
  } else {
    formData.productDescription = content
  }
  ElMessage.success('Applied successfully')
  aiGenerateDialogVisible.value = false
}

// 翻译结果
const handleTranslateResult = (content: string, index: number) => {
  ElMessage.info('Translation feature coming soon...')
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
      }

      :deep(.el-upload-list__item) {
        width: 100px;
        height: 136px;
        margin: 0;
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
    min-height: 500px;

    .ai-settings {
      width: 350px;
      padding: 24px;
      background: var(--el-fill-color-extra-light);
      border-right: 1px solid var(--el-border-color-light);

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

      .preview-title {
        margin: 0 0 20px 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .generating-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
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
        min-height: 300px;
      }

      .results-list {
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

            .result-number {
              font-weight: 600;
              color: var(--el-color-primary);
              margin-right: 8px;
            }

            .result-text {
              color: var(--el-text-color-primary);
              line-height: 1.6;
            }
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
</style>

