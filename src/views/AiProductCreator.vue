<template>
  <div class="ai-product-creator">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">AI 创建商品</h1>
      <p class="page-subtitle">上传图片或输入描述，我帮你生成一个可上架的商品草稿</p>
    </div>
    
    <!-- 左右分栏布局 -->
    <div class="creator-layout">
      <!-- 左侧：配置区域 -->
      <div class="left-panel">
        <el-card shadow="never" class="config-card">
          <el-form :model="formState" label-width="100px" size="default">
            <!-- 1. Basic Inputs -->
            <div class="form-section">
              <div class="section-label">
                Basic Inputs
                <el-tooltip content="用于向 AI 提供最核心的商品基础信息，是生成内容的主要依据。" placement="top">
                  <el-icon class="help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
              
              <el-form-item label="Images">
                <template #label>
                  <span>Images</span>
                  <el-tooltip content="上传商品图片，提供视觉识别信息（主图/角度图/包装图）。JPG / PNG / WEBP（最多 10 张）" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
                <ImageUploader
                  :images="images"
                  @update:images="images = $event"
                  @change-main="handleChangeMain"
                  @remove="handleRemoveImage"
                />
              </el-form-item>
              
              <el-form-item label="Description">
                <template #label>
                  <span>Description</span>
                  <el-tooltip content="补充 AI 无法从图片识别的内容，如容量、材质、用途等。0–2000 字文本" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
                <el-input
                  v-model="formState.productNotes"
                  type="textarea"
                  :rows="4"
                  placeholder="304 stainless steel tumbler, 600ml, keeps warm 12 hours…"
                  maxlength="2000"
                  show-word-limit
                />
              </el-form-item>
              
              <el-form-item label="Brand">
                <template #label>
                  <span>Brand</span>
                  <el-tooltip content="商品品牌名，用于统一标题与文案风格。" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
                <el-input v-model="formState.brand" placeholder="Enter brand name" clearable />
              </el-form-item>
              
              <el-form-item label="Category">
                <template #label>
                  <span>Category</span>
                  <el-tooltip content="类目决定属性结构、标题模板、商品类型推断。" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
                <el-select v-model="formState.category" placeholder="Select category" clearable style="width: 100%">
                  <el-option label="Auto Detect" value="" />
                  <el-option label="Drinkware" value="drinkware" />
                  <el-option label="Electronics" value="electronics" />
                  <el-option label="Home" value="home" />
                  <el-option label="Fashion" value="fashion" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="Language">
                <template #label>
                  <span>Language</span>
                  <el-tooltip content="控制生成文案语言与语言习惯。" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
                <el-select v-model="formState.language" placeholder="Select language" style="width: 100%">
                  <el-option label="English" value="english" />
                  <el-option label="Chinese" value="chinese" />
                  <el-option label="Japanese" value="japanese" />
                  <el-option label="Korean" value="korean" />
                  <el-option label="Spanish" value="spanish" />
                </el-select>
              </el-form-item>
            </div>
            
            <!-- 2. AI Content Control -->
            <div class="form-section">
              <div class="section-label">
                AI Content Control
                <el-tooltip content="控制 AI 输出质量，如长短、语气、关键词、变体、属性生成等，是影响内容质量的核心设置。" placement="top">
                  <el-icon class="help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
              
              <el-form-item label="Detail Level">
                <template #label>
                  <span>Detail Level</span>
                  <el-tooltip content="控制内容详细程度（简短 / 标准 / 高细节）。" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
                <el-select v-model="formState.outputDetailLevel" placeholder="Select level" style="width: 100%">
                  <el-option label="Short" value="short" />
                  <el-option label="Normal" value="normal" />
                  <el-option label="Detailed" value="detailed" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="Tone">
                <template #label>
                  <span>Tone</span>
                  <el-tooltip content="控制文案风格，使其符合品牌调性。" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
                <el-select v-model="formState.tone" placeholder="Select tone" style="width: 100%">
                  <el-option label="Professional" value="professional" />
                  <el-option label="Friendly" value="friendly" />
                  <el-option label="Premium" value="premium" />
                  <el-option label="Technical" value="technical" />
                  <el-option label="Minimal" value="minimal" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="Keywords">
                <template #label>
                  <span>Keywords</span>
                  <el-tooltip content="Required: 强制 AI 在标题/卖点等字段中包含某些关键字。Avoid: 强制 AI 避免生成违禁词、敏感词或不期望的词。" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <el-input
                    v-model="formState.requiredKeywords"
                    placeholder="Required keywords (comma separated)"
                    clearable
                  />
                  <el-input
                    v-model="formState.avoidKeywords"
                    placeholder="Avoid keywords (comma separated)"
                    clearable
                  />
                </div>
              </el-form-item>
              
              <el-form-item label="Generate Variants">
                <template #label>
                  <span>Generate Variants</span>
                  <el-tooltip content="自动识别颜色/尺寸等，生成多变体商品。" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
                <el-switch v-model="formState.generateVariants" />
              </el-form-item>
              
              <el-form-item label="Generate Specs">
                <template #label>
                  <span>Generate Specs</span>
                  <el-tooltip content="自动生成规格属性（材质、尺寸、重量等）。" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
                <el-switch v-model="formState.generateSpecs" />
              </el-form-item>
            </div>
            
            <!-- 3. AI Template -->
            <div class="form-section">
              <div class="section-label">
                AI Template
                <el-tooltip content="控制标题风格、卖点数量、标题长度等，适配 Amazon / TikTok / Shopify 等不同平台需要。" placement="top">
                  <el-icon class="help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
              
              <el-form-item label="Title Style">
                <template #label>
                  <span>Title Style</span>
                  <el-tooltip content="控制标题生成格式（SEO 强化 / 平台差异化）。" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
                <el-select v-model="formState.titleStyle" placeholder="Select style" style="width: 100%">
                  <el-option label="SEO" value="seo" />
                  <el-option label="Minimal" value="minimal" />
                  <el-option label="Amazon" value="amazon" />
                  <el-option label="TikTok" value="tiktok" />
                  <el-option label="Shopify" value="shopify" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="Bullet Count">
                <template #label>
                  <span>Bullet Count</span>
                  <el-tooltip content="卖点数量。" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
                <el-select v-model="formState.bulletCount" placeholder="Select count" style="width: 100%">
                  <el-option :label="3" :value="3" />
                  <el-option :label="5" :value="5" />
                  <el-option :label="7" :value="7" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="Title Length">
                <template #label>
                  <span>Title Length</span>
                  <el-tooltip content="限制标题长度，符合平台规则。" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
                <el-input-number
                  v-model="formState.titleLengthLimit"
                  :min="20"
                  :max="200"
                  :step="10"
                  style="width: 100%"
                />
                <span style="font-size: 12px; color: var(--el-text-color-secondary); margin-left: 8px;">characters</span>
              </el-form-item>
            </div>
            
            <!-- 4. SKU Generator -->
            <div class="form-section">
              <div class="section-label">
                SKU Generator
                <el-tooltip content="帮助商家自动生成标准化 SKU，适用于仓储/OMS/TMS 等系统。" placement="top">
                  <el-icon class="help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
              
              <el-form-item label="Enable SKU">
                <template #label>
                  <span>Enable SKU</span>
                  <el-tooltip content="是否启用自动 SKU 生成逻辑。" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
                <el-switch v-model="skuRule.enabled" />
              </el-form-item>
              
              <el-form-item v-if="skuRule.enabled" label="Prefix">
                <template #label>
                  <span>Prefix</span>
                  <el-tooltip content="SKU 前缀，如品牌缩写。" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
                <el-input v-model="skuRule.prefix" placeholder="e.g., BRAND" />
              </el-form-item>
              
              <el-form-item v-if="skuRule.enabled" label="Format">
                <template #label>
                  <span>Format</span>
                  <el-tooltip content="SKU 模板（支持 {BRAND}、{COLOR}、{SIZE} 等变量）。" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
                <el-input v-model="skuRule.format" placeholder="{BRAND}-{CATEGORY}-{VARIANT}" />
              </el-form-item>
              
              <el-form-item v-if="skuRule.enabled" label="Include Timestamp">
                <template #label>
                  <span>Include Timestamp</span>
                  <el-tooltip content="是否在 SKU 末尾加入时间戳防止重复。" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
                <el-switch v-model="skuRule.includeTimestamp" />
              </el-form-item>
            </div>
            
            <!-- 5. AI Image Generation -->
            <div class="form-section">
              <div class="section-label">
                AI Image Generation
                <el-tooltip content="用于生成白底图、场景图、3D 渲染图，提高商品拍照能力不足时的图像质量。" placement="top">
                  <el-icon class="help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
              
              <el-form-item label="Generate Images">
                <template #label>
                  <span>Generate Images</span>
                  <el-tooltip content="是否启用 AI 自动生成商品图。" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
                <el-switch v-model="formState.generateImages" />
              </el-form-item>
              
              <el-form-item v-if="formState.generateImages" label="Image Type">
                <template #label>
                  <span>Image Type</span>
                  <el-tooltip content="生成图像的类型。" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
                <el-select v-model="formState.imageType" placeholder="Select type" style="width: 100%">
                  <el-option label="White Background" value="white" />
                  <el-option label="Lifestyle" value="lifestyle" />
                  <el-option label="3D Render" value="3d" />
                  <el-option label="Infographic" value="infographic" />
                </el-select>
              </el-form-item>
              
              <el-form-item v-if="formState.generateImages" label="Image Style">
                <template #label>
                  <span>Image Style</span>
                  <el-tooltip content="图像风格（影棚光、真实、极简、高端等）。" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
                <el-select v-model="formState.imageStyle" placeholder="Select style" style="width: 100%">
                  <el-option label="Realistic" value="realistic" />
                  <el-option label="Studio" value="studio" />
                  <el-option label="Minimalist" value="minimalist" />
                  <el-option label="Premium" value="premium" />
                  <el-option label="Soft Light" value="softlight" />
                </el-select>
              </el-form-item>
              
              <el-form-item v-if="formState.generateImages" label="Resolution">
                <template #label>
                  <span>Resolution</span>
                  <el-tooltip content="输出图像分辨率。" placement="top">
                    <el-icon class="help-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
                <el-select v-model="formState.resolution" placeholder="Select resolution" style="width: 100%">
                  <el-option label="1024" value="1024" />
                  <el-option label="2048" value="2048" />
                  <el-option label="4096" value="4096" />
                </el-select>
              </el-form-item>
            </div>
            
            <!-- 操作按钮 -->
            <div class="form-actions">
              <el-button type="primary" block @click="handleGenerate" :loading="isGenerating" :disabled="isGenerating">
                Generate draft
              </el-button>
              <el-button block @click="handleReset">Reset</el-button>
            </div>
          </el-form>
        </el-card>
      </div>
      
      <!-- 右侧：预览区域 -->
      <div class="right-panel">
        <!-- 空状态 -->
        <div v-if="!aiResult || !aiResult.meta || aiResult.meta.status === 'idle'" class="preview-empty">
          <el-icon class="empty-icon"><Document /></el-icon>
          <p class="empty-text">还没有生成结果。请在上方上传图片或输入描述，然后点击 "Generate draft"。</p>
        </div>
        
        <!-- Loading状态 -->
        <div v-else-if="aiResult && aiResult.meta && aiResult.meta.status === 'loading'" class="preview-loading">
          <el-skeleton :rows="8" animated />
        </div>
        
        <!-- Generated状态 -->
        <div v-else-if="aiResult && aiResult.meta && aiResult.meta.status === 'generated'" class="preview-content">
          <!-- 预览内容 -->
          <div class="preview-body">
            <!-- Basic Information Section -->
            <div class="section-block">
              <div class="section-header">
                <h2 class="section-main-title">
                  <el-icon class="title-icon"><Document /></el-icon>
                  Basic Information
                </h2>
              </div>
              <el-card shadow="never" class="section-card">
                <el-form :model="editableResult" label-width="180px" class="content-form">
                  <el-form-item label="Product Title">
                    <div style="display: flex; gap: 8px; align-items: flex-start; width: 100%;">
                      <el-input
                        v-model="editableResult.title"
                        placeholder="Enter product title"
                        maxlength="200"
                        show-word-limit
                        style="flex: 1;"
                      />
                      <div class="field-ai-actions">
                        <el-button class="ai-button" :icon="Refresh" @click="handleRegenerate('title')" :loading="regeneratingField === 'title'">
                          Regenerate
                        </el-button>
                      </div>
                    </div>
                  </el-form-item>
                  
                  <el-form-item label="Subtitle">
                    <div style="display: flex; gap: 8px; align-items: flex-start; width: 100%;">
                      <el-input
                        v-model="editableResult.subtitle"
                        placeholder="Enter subtitle (optional)"
                        maxlength="200"
                        show-word-limit
                        style="flex: 1;"
                      />
                      <div class="field-ai-actions">
                        <el-button class="ai-button" :icon="Refresh" @click="handleRegenerate('subtitle')" :loading="regeneratingField === 'subtitle'">
                          Regenerate
                        </el-button>
                      </div>
                    </div>
                  </el-form-item>
                  
                  <el-form-item label="Category">
                    <div style="display: flex; gap: 8px; align-items: center; width: 100%;">
                      <el-cascader
                        v-if="!showCategoryInput"
                        v-model="editableResult.categoryPath"
                        :options="[]"
                        placeholder="Select category"
                        clearable
                        style="flex: 1;"
                      />
                      <el-input
                        v-else
                        v-model="categoryInputValue"
                        placeholder="Enter category path, e.g., Electronics > Audio > Headphones"
                        @keyup.enter="handleSaveCategory"
                        @blur="handleSaveCategory"
                        style="flex: 1;"
                      />
                      <el-button :icon="Edit" @click="showCategoryInput = !showCategoryInput" />
                      <el-button class="ai-button" :icon="Refresh" @click="handleRegenerate('category')" :loading="regeneratingField === 'category'">
                        Regenerate
                      </el-button>
                    </div>
                  </el-form-item>
                  
                  <el-form-item label="Tags">
                    <div class="tags-container">
                      <el-tag
                        v-for="(tag, index) in editableResult.tags"
                        :key="index"
                        closable
                        :disable-transitions="false"
                        @close="handleRemoveTag(index)"
                        class="product-tag"
                      >
                        {{ tag }}
                      </el-tag>
                      <el-input
                        v-if="showTagInput"
                        ref="tagInputRef"
                        v-model="newTag"
                        class="tag-input"
                        size="small"
                        placeholder="Enter tag, press Enter or click outside to add"
                        @keyup.enter="handleAddTag"
                        @blur="handleTagInputConfirm"
                      />
                      <el-button
                        v-else
                        class="tag-add-button"
                        size="small"
                        @click="showTagInput = true"
                      >
                        <el-icon><Plus /></el-icon>
                        Add Tag
                      </el-button>
                      <el-button
                        v-if="editableResult.tags.length > 0"
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
            
            <!-- Product Description Section -->
            <div class="section-block">
              <div class="section-header">
                <h2 class="section-main-title">
                  <el-icon class="title-icon"><Document /></el-icon>
                  Product Description
                </h2>
              </div>
              <el-card shadow="never" class="section-card">
                <el-form :model="editableResult" label-width="180px" class="content-form">
                  <el-form-item label="Bullet Points">
                    <div style="width: 100%;">
                      <div class="bullets-list">
                        <div v-for="(bullet, index) in editableResult.bullets" :key="index" class="bullet-item">
                          <span class="bullet-marker">•</span>
                          <el-input
                            v-model="editableResult.bullets[index]"
                            @blur="handleFieldChange('bullets')"
                            class="bullet-input"
                            placeholder="Enter bullet point"
                          />
                        </div>
                      </div>
                      <div style="margin-top: 8px;">
                        <el-button class="ai-button" size="small" :icon="Refresh" @click="handleRegenerate('bullets')" :loading="regeneratingField === 'bullets'">
                          Regenerate
                        </el-button>
                      </div>
                    </div>
                  </el-form-item>
                  
                  <el-form-item label="Description">
                    <div style="width: 100%;">
                      <el-input
                        v-model="editableResult.description"
                        type="textarea"
                        :rows="8"
                        placeholder="Enter product description"
                        maxlength="5000"
                        show-word-limit
                        @blur="handleFieldChange('description')"
                      />
                      <div style="margin-top: 8px;">
                        <el-button class="ai-button" size="small" :icon="Refresh" @click="handleRegenerate('description')" :loading="regeneratingField === 'description'">
                          Regenerate
                        </el-button>
                      </div>
                    </div>
                  </el-form-item>
                </el-form>
              </el-card>
            </div>
            
            <!-- Attributes & Variants Section -->
            <div class="section-block">
              <div class="section-header">
                <h2 class="section-main-title">
                  <el-icon class="title-icon"><Menu /></el-icon>
                  Attributes & Variants
                </h2>
              </div>
              <el-card shadow="never" class="section-card">
                <el-form :model="editableResult" label-width="180px" class="content-form">
                  <el-form-item label="Attributes" class="attribute-form-item">
                    <div class="attribute-header-actions">
                      <el-button type="primary" size="small" link @click="handleAddAttribute">
                        + Custom Attribute
                      </el-button>
                    </div>
                    <div class="attributes-list">
                      <el-row :gutter="12">
                        <el-col 
                          v-for="(attr, attrIndex) in editableResult.attributes" 
                          :key="attrIndex"
                          :xs="24"
                          :sm="12"
                          :md="8"
                          :lg="8"
                          :xl="8"
                          class="attribute-col"
                        >
                          <div class="attribute-item">
                            <div class="attribute-header">
                              <div class="attribute-label">
                                <span class="label-text">{{ attr.name || 'Attribute' }}</span>
                                <el-tag :type="getSourceTagType(attr.source)" size="small">
                                  {{ attr.source.toUpperCase() }}
                                </el-tag>
                              </div>
                              <el-button
                                size="small"
                                type="danger"
                                text
                                @click="handleRemoveAttribute(attrIndex)"
                              >
                                <el-icon><Delete /></el-icon>
                              </el-button>
                            </div>
                            <div class="attribute-content">
                              <el-input
                                v-model="editableResult.attributes[attrIndex].name"
                                placeholder="Attribute name"
                                @blur="handleFieldChange('attributes')"
                                style="margin-bottom: 8px;"
                              />
                              <el-input
                                v-model="editableResult.attributes[attrIndex].value"
                                placeholder="Attribute value"
                                @blur="handleFieldChange('attributes')"
                              />
                            </div>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                    <div style="margin-top: 12px;">
                      <el-button class="ai-button" size="small" :icon="Refresh" @click="handleRegenerate('attributes')" :loading="regeneratingField === 'attributes'">
                        Regenerate
                      </el-button>
                    </div>
                  </el-form-item>
                  
                  <!-- 销售属性 -->
                  <el-form-item v-if="editableResult.salesAttributes && editableResult.salesAttributes.length > 0" label="Sales Attributes">
                    <div class="attributes-list">
                      <el-row :gutter="12">
                        <el-col 
                          v-for="(attr, attrIndex) in editableResult.salesAttributes.slice(0, 3)" 
                          :key="attrIndex"
                          :xs="24"
                          :sm="12"
                          :md="8"
                          :lg="8"
                          :xl="8"
                          class="attribute-col"
                        >
                          <div class="attribute-item">
                            <div class="attribute-header">
                              <div class="attribute-label">
                                <span class="label-text">{{ attr.name || 'Sales Attribute' }}</span>
                              </div>
                            </div>
                            <div class="attribute-content">
                              <el-input
                                v-model="editableResult.salesAttributes[attrIndex].name"
                                placeholder="Attribute name"
                                @blur="handleFieldChange('salesAttributes')"
                                style="margin-bottom: 8px;"
                              />
                              <div class="attr-values">
                                <div v-for="(value, vIndex) in attr.values" :key="vIndex" class="attr-value-item">
                                  <el-input
                                    v-model="editableResult.salesAttributes[attrIndex].values[vIndex]"
                                    size="small"
                                    placeholder="Value"
                                    @blur="handleFieldChange('salesAttributes')"
                                    style="flex: 1;"
                                  />
                                  <el-button
                                    size="small"
                                    type="danger"
                                    text
                                    @click="handleRemoveAttrValue(attrIndex, vIndex)"
                                  >
                                    <el-icon><Delete /></el-icon>
                                  </el-button>
                                </div>
                                <el-button size="small" text type="primary" @click="handleAddAttrValue(attrIndex)" style="width: 100%; margin-top: 8px;">
                                  + Add Value
                                </el-button>
                              </div>
                            </div>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                    <div style="margin-top: 12px;">
                      <el-button class="ai-button" size="small" :icon="Refresh" @click="handleRegenerate('salesAttributes')" :loading="regeneratingField === 'salesAttributes'">
                        Regenerate
                      </el-button>
                    </div>
                  </el-form-item>
                  
                  <!-- 变体 -->
                  <el-form-item v-if="editableResult.variants && editableResult.variants.length > 0" label="Variants">
                    <div class="variants-grid">
                      <div v-for="(variant, index) in editableResult.variants.slice(0, 3)" :key="index" class="variant-card">
                        <div class="variant-header">
                          <span class="variant-name">Variant {{ index + 1 }}</span>
                        </div>
                        <div class="variant-content">
                          <div class="variant-row">
                            <span class="info-label">Name:</span>
                            <el-input
                              v-model="editableResult.variants[index].name"
                              size="small"
                              class="variant-field-input"
                              @blur="handleFieldChange('variants')"
                            />
                          </div>
                          <div class="variant-row">
                            <span class="info-label">Color:</span>
                            <el-input
                              v-model="editableResult.variants[index].color"
                              size="small"
                              class="variant-field-input"
                              placeholder="Color"
                              @blur="handleFieldChange('variants')"
                            />
                          </div>
                          <div class="variant-row">
                            <span class="info-label">Size:</span>
                            <el-input
                              v-model="editableResult.variants[index].size"
                              size="small"
                              class="variant-field-input"
                              placeholder="Size"
                              @blur="handleFieldChange('variants')"
                            />
                          </div>
                          <div class="variant-row">
                            <span class="info-label">Price:</span>
                            <el-input-number
                              v-model="editableResult.variants[index].price"
                              size="small"
                              :min="0"
                              :precision="2"
                              class="variant-field-input"
                              @blur="handleFieldChange('variants')"
                            />
                          </div>
                          <div class="variant-row">
                            <span class="info-label">Stock:</span>
                            <el-input-number
                              v-model="editableResult.variants[index].stock"
                              size="small"
                              :min="0"
                              class="variant-field-input"
                              @blur="handleFieldChange('variants')"
                            />
                          </div>
                          <div class="variant-row">
                            <span class="info-label">SKU:</span>
                            <el-input
                              v-model="editableResult.variants[index].sku"
                              size="small"
                              class="variant-field-input sku-input"
                              placeholder="SKU"
                              @blur="handleFieldChange('variants')"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-form-item>
                </el-form>
              </el-card>
            </div>
            
            <!-- SKU List Section -->
            <div v-if="skuTableData.length > 0" class="section-block">
              <div class="section-header">
                <h2 class="section-main-title">
                  <el-icon class="title-icon"><Grid /></el-icon>
                  SKU Information
                </h2>
              </div>
              <el-card shadow="never" class="section-card">
                <el-form :model="editableResult" label-width="180px" class="content-form">
                  <el-form-item label="SKU List">
                    <div class="sku-list-content">
                      <div class="sku-actions-row">
                        <el-button class="ai-button" :icon="Refresh" @click="handleRegenerateSkus">
                          Regenerate SKUs
                        </el-button>
                      </div>
                      
                      <el-table 
                        :data="skuTableData"
                        border 
                        class="sku-table"
                        :height="400"
                        :max-height="600"
                      >
                        <!-- 销售属性列 -->
                        <el-table-column 
                          v-for="(attrName, attrIndex) in getSkuSpecColumns()" 
                          :key="attrIndex"
                          :label="attrName" 
                          width="120"
                          align="center"
                        >
                          <template #default="{ row }">
                            <span>{{ row.specs[attrIndex] || '-' }}</span>
                          </template>
                        </el-table-column>
                        
                        <el-table-column label="SKU Code" min-width="250">
                          <template #default="{ row }">
                            <el-input 
                              v-model="row.skuCode" 
                              placeholder="Auto-generated" 
                              size="small"
                              @blur="handleSkuCodeChange(row)"
                            />
                          </template>
                        </el-table-column>
                        
                        <el-table-column label="Price" width="150">
                          <template #default="{ row }">
                            <el-input-number
                              v-model="row.price"
                              :min="0"
                              :precision="2"
                              size="small"
                              :controls="false"
                              style="width: 100%;"
                              @blur="handleSkuChange(row)"
                            />
                          </template>
                        </el-table-column>
                        
                        <el-table-column label="Stock" width="150">
                          <template #default="{ row }">
                            <el-input-number
                              v-model="row.stock"
                              :min="0"
                              :precision="0"
                              size="small"
                              :controls="false"
                              style="width: 100%;"
                              @blur="handleSkuChange(row)"
                            />
                          </template>
                        </el-table-column>
                        
                        <el-table-column label="Status" width="150">
                          <template #default="{ row }">
                            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
                              {{ row.status === 'active' ? 'Active' : 'Inactive' }}
                            </el-tag>
                          </template>
                        </el-table-column>
                        
                        <el-table-column label="Actions" width="100" fixed="right" align="center">
                          <template #default="{ row }">
                            <el-button
                              :icon="Delete"
                              type="danger"
                              link
                              size="small"
                              @click="handleRemoveSku(row.index)"
                            />
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-form-item>
                </el-form>
              </el-card>
            </div>
            
            <!-- Product Images Section -->
            <div v-if="aiResult.images.length > 0" class="section-block">
              <div class="section-header">
                <h2 class="section-main-title">
                  <el-icon class="title-icon"><Picture /></el-icon>
                  Product Images
                </h2>
              </div>
              <el-card shadow="never" class="section-card">
                <input
                  ref="replaceImageInputRef"
                  type="file"
                  accept="image/*"
                  @change="handleReplaceImageFileChange"
                  style="display: none"
                />
                <div class="images-preview">
                  <div class="main-image-container">
                    <img 
                      :src="mainImage?.url" 
                      :alt="mainImage?.id"
                      v-if="mainImage"
                      class="main-image"
                    />
                    <div class="main-image-actions">
                      <el-button size="small" type="primary" @click="handleReplaceImage(mainImage?.id)">
                        <el-icon><Upload /></el-icon>
                        Replace
                      </el-button>
                    </div>
                  </div>
                  <div class="thumbnails-container">
                    <div
                      v-for="image in aiResult.images"
                      :key="image.id"
                      class="thumbnail-item"
                      :class="{ 'is-main': image.isMain }"
                      @click="handleSetMainImage(image.id)"
                    >
                      <img :src="image.url" :alt="image.id" />
                      <div class="thumbnail-badge" v-if="image.isMain">Main</div>
                      <div class="thumbnail-overlay">
                        <el-button
                          size="small"
                          type="primary"
                          text
                          @click.stop="handleReplaceImage(image.id)"
                        >
                          Replace
                        </el-button>
                        <el-button
                          size="small"
                          type="danger"
                          text
                          @click.stop="handleDeleteImage(image.id)"
                        >
                          Delete
                        </el-button>
                      </div>
                    </div>
                    <div class="thumbnail-item add-image-item" @click="handleAddImage">
                      <el-icon class="add-icon"><Plus /></el-icon>
                      <span class="add-text">Add Image</span>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
            
            <!-- Bottom Actions -->
            <div class="preview-footer">
              <div class="footer-content">
                <div class="footer-left">
                  <el-tag :type="isEdited ? 'warning' : 'success'" size="default">
                    {{ isEdited ? 'Edited' : 'Generated' }}
                  </el-tag>
                  <span v-if="aiResult.meta.createdAt" class="meta-text">
                    Created: {{ formatDate(aiResult.meta.createdAt) }}
                  </span>
                </div>
                <div class="footer-right">
                  <el-button @click="handleExportJson">Export JSON</el-button>
                  <el-button @click="handleApplyToExisting">Apply to existing product</el-button>
                  <el-button type="primary" @click="handleSaveDraft">Save as draft product</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Document, Refresh, Edit, Menu, Grid, Picture, Delete, Plus, Upload, QuestionFilled } from '@element-plus/icons-vue';
import ImageUploader from '@/components/ai-product-creator/ImageUploader.vue';
import type { AiProductResult, AiProductImage, AttributeSource } from '@/types/ai-product';
import { generateMockResult } from '@/utils/ai-product-mock';

const isGenerating = ref(false);
const images = ref<AiProductImage[]>([]);
const isEdited = ref(false);
const showTagInput = ref(false);
const newTag = ref('');
const tagInputRef = ref();
const regeneratingField = ref<string | null>(null);
const showCategoryInput = ref(false);
const categoryInputValue = ref('');

const skuRule = reactive({
  enabled: false,
  prefix: '',
  format: '{BRAND}-{CATEGORY}-{VARIANT}',
  includeTimestamp: false
});

const formState = reactive({
  productNotes: '',
  brand: '',
  category: '',
  language: 'english',
  // AI Content Control
  outputDetailLevel: 'normal',
  tone: 'professional',
  requiredKeywords: '',
  avoidKeywords: '',
  generateVariants: false,
  generateSpecs: true,
  // AI Template
  titleStyle: 'seo',
  bulletCount: 5,
  titleLengthLimit: 120,
  // AI Image Generation
  generateImages: false,
  imageType: 'white',
  imageStyle: 'realistic',
  resolution: '2048',
  // Legacy
  includeSeoFields: true
});

// AI结果
const aiResult = ref<AiProductResult | null>({
  title: '',
  subtitle: '',
  categoryPath: [],
  tags: [],
  bullets: [],
  description: '',
  attributes: [],
  variants: [],
  salesAttributes: [],
  images: [],
  skuGenerationRule: {
    enabled: true,
    prefix: '',
    format: '{BRAND}-{CATEGORY}-{VARIANT}',
    includeTimestamp: false
  },
  suggestedSkus: [],
  meta: {
    status: 'idle'
  }
});

const editableResult = ref<AiProductResult | null>(null);

watch(() => aiResult.value, (newResult) => {
  if (newResult && newResult.meta.status === 'generated') {
    editableResult.value = JSON.parse(JSON.stringify(newResult));
    // 同步SKU规则到左侧配置
    if (editableResult.value.skuGenerationRule) {
      Object.assign(skuRule, editableResult.value.skuGenerationRule);
    }
    isEdited.value = false;
  } else if (!newResult || newResult.meta.status === 'idle') {
    editableResult.value = null;
    isEdited.value = false;
  }
}, { immediate: true, deep: true });

// 监听销售属性变化，自动更新SKU列表
watch(() => editableResult.value?.salesAttributes, () => {
  // SKU列表会根据销售属性自动计算，这里只需要触发响应式更新
  if (editableResult.value && editableResult.value.salesAttributes && editableResult.value.salesAttributes.length > 0) {
    handleFieldChange('salesAttributes');
  }
}, { deep: true });

const mainImage = computed(() => {
  if (!aiResult.value) return null;
  return aiResult.value.images.find(img => img.isMain) || aiResult.value.images[0];
});

// 根据销售属性生成SKU列表
const generateSkusFromSalesAttributes = () => {
  if (!editableResult.value || !editableResult.value.salesAttributes || editableResult.value.salesAttributes.length === 0) {
    return [];
  }
  
  const salesAttrs = editableResult.value.salesAttributes.filter(attr => 
    attr.values && attr.values.length > 0 && attr.values.some(v => v.trim())
  );
  
  if (salesAttrs.length === 0) return [];
  
  // 生成笛卡尔积
  const generateCartesianProduct = (arrays: string[][]): string[][] => {
    if (arrays.length === 0) return [[]];
    if (arrays.length === 1) return arrays[0].map(v => [v]);
    
    const [first, ...rest] = arrays;
    const restProduct = generateCartesianProduct(rest);
    
    return first.flatMap(value => 
      restProduct.map(product => [value, ...product])
    );
  };
  
  const valuesArrays = salesAttrs.map(attr => attr.values.filter(v => v.trim()));
  const combinations = generateCartesianProduct(valuesArrays);
  
  // 生成SKU代码
  const prefix = skuRule.prefix || formState.brand.toUpperCase().substring(0, 4) || 'PROD';
  const category = (editableResult.value.categoryPath[editableResult.value.categoryPath.length - 1] || 'ITEM').toUpperCase().substring(0, 4);
  
  return combinations.map((combo, index) => {
    const comboStr = combo.map(v => v.substring(0, 3).toUpperCase().replace(/\s+/g, '')).join('-');
    const skuCode = skuRule.format 
      ? skuRule.format
          .replace('{BRAND}', prefix)
          .replace('{CATEGORY}', category)
          .replace('{VARIANT}', comboStr)
      : `${prefix}-${category}-${comboStr}-${String(index + 1).padStart(3, '0')}`;
    
    return {
      skuCode,
      specs: combo,
      specNames: salesAttrs.map(attr => attr.name),
      price: 0,
      stock: 0,
      status: 'active',
      index
    };
  });
};

const skuTableData = computed(() => {
  if (!editableResult.value) return [];
  
  // 如果有销售属性，根据销售属性生成SKU
  if (editableResult.value.salesAttributes && editableResult.value.salesAttributes.length > 0) {
    return generateSkusFromSalesAttributes();
  }
  
  // 否则使用 suggestedSkus
  if (editableResult.value.suggestedSkus && editableResult.value.suggestedSkus.length > 0) {
    return editableResult.value.suggestedSkus.map((sku, index) => ({
      skuCode: sku,
      specs: [],
      specNames: [],
      price: 0,
      stock: 0,
      status: 'active',
      index
    }));
  }
  
  return [];
});

// 生成处理
const handleGenerate = () => {
  if (images.value.length === 0 && !formState.productNotes.trim()) {
    ElMessage.warning('Please upload at least one image or provide some product notes.');
    return;
  }
  
  isGenerating.value = true;
  
  // 设置 loading 状态
  if (aiResult.value) {
    aiResult.value.meta.status = 'loading';
  } else {
    aiResult.value = {
      title: '',
      subtitle: '',
      categoryPath: [],
      tags: [],
      bullets: [],
      description: '',
      attributes: [],
      variants: [],
      salesAttributes: [],
      images: [],
      skuGenerationRule: {
        enabled: false,
        prefix: '',
        format: '{BRAND}-{CATEGORY}-{VARIANT}',
        includeTimestamp: false
      },
      suggestedSkus: [],
      meta: {
        status: 'loading'
      }
    };
  }
  
  // 减少延迟，提升响应速度
  setTimeout(() => {
    try {
      const result = generateMockResult('hybrid', {
        formState: formState,
        images: images.value
      });
      
      // 确保结果有正确的 meta 状态
      if (!result.meta) {
        result.meta = { status: 'generated', createdAt: new Date().toISOString() };
      } else {
        result.meta.status = 'generated';
        if (!result.meta.createdAt) {
          result.meta.createdAt = new Date().toISOString();
        }
      }
      
      // 同步SKU规则
      if (result.skuGenerationRule) {
        result.skuGenerationRule = { ...skuRule };
      }
      
      // 确保 images 数组存在
      if (!result.images) {
        result.images = images.value.length > 0 ? images.value : [];
      }
      
      aiResult.value = result;
      isGenerating.value = false;
      ElMessage.success('Product draft generated successfully!');
    } catch (error) {
      console.error('Generate error:', error);
      isGenerating.value = false;
      if (aiResult.value) {
        aiResult.value.meta.status = 'idle';
        aiResult.value.meta.errorMessage = 'Generation failed. Please try again.';
      }
      ElMessage.error('Failed to generate product draft. Please try again.');
    }
  }, 500);
};

// 重置处理
const handleReset = () => {
  images.value = [];
  
  // Reset Basic Inputs
  formState.productNotes = '';
  formState.brand = '';
  formState.category = '';
  formState.language = 'english';
  
  // Reset AI Content Control
  formState.outputDetailLevel = 'normal';
  formState.tone = 'professional';
  formState.requiredKeywords = '';
  formState.avoidKeywords = '';
  formState.generateVariants = false;
  formState.generateSpecs = true;
  
  // Reset AI Template
  formState.titleStyle = 'seo';
  formState.bulletCount = 5;
  formState.titleLengthLimit = 120;
  
  // Reset AI Image Generation
  formState.generateImages = false;
  formState.imageType = 'white';
  formState.imageStyle = 'realistic';
  formState.resolution = '2048';
  
  // Reset Legacy
  formState.includeSeoFields = true;
  
  // Reset SKU Rule
  skuRule.enabled = false;
  skuRule.prefix = '';
  skuRule.format = '{BRAND}-{CATEGORY}-{VARIANT}';
  skuRule.includeTimestamp = false;
  
  aiResult.value = {
    title: '',
    subtitle: '',
    categoryPath: [],
    tags: [],
    bullets: [],
    description: '',
    attributes: [],
    variants: [],
    salesAttributes: [],
    images: [],
    skuGenerationRule: {
      enabled: true,
      prefix: '',
      format: '{BRAND}-{CATEGORY}-{VARIANT}',
      includeTimestamp: false
    },
    suggestedSkus: [],
    meta: {
      status: 'idle'
    }
  };
};

// 图片操作
const handleChangeMain = (imageId: string) => {
  images.value.forEach(img => {
    img.isMain = img.id === imageId;
  });
  
  if (aiResult.value) {
    aiResult.value.images.forEach(img => {
      img.isMain = img.id === imageId;
    });
  }
};

const handleRemoveImage = (imageId: string) => {
  images.value = images.value.filter(img => img.id !== imageId);
  
  if (aiResult.value) {
    aiResult.value.images = aiResult.value.images.filter(img => img.id !== imageId);
  }
};

// 结果操作
const handleFieldChange = (field: string) => {
  if (editableResult.value) {
    isEdited.value = true;
    if (aiResult.value) {
      aiResult.value = { ...editableResult.value };
    }
  }
};

const handleCategoryChange = (category: string) => {
  if (!editableResult.value) return;
  
  const categoryMap: Record<string, string[]> = {
    drinkware: ['Home', 'Kitchen', 'Drinkware'],
    electronics: ['Electronics', 'Audio', 'Headphones'],
    home: ['Home', 'Living', 'Furniture'],
    fashion: ['Fashion', 'Accessories', 'Bags']
  };
  
  editableResult.value.categoryPath = categoryMap[category] || editableResult.value.categoryPath;
  handleFieldChange('categoryPath');
};

const handleRemoveTag = (index: number) => {
  if (!editableResult.value) return;
  editableResult.value.tags.splice(index, 1);
  handleFieldChange('tags');
};

const handleAddTag = () => {
  handleTagInputConfirm();
};

const handleTagInputConfirm = () => {
  if (newTag.value.trim() && editableResult.value) {
    if (!editableResult.value.tags) {
      editableResult.value.tags = [];
    }
    if (!editableResult.value.tags.includes(newTag.value.trim())) {
      editableResult.value.tags.push(newTag.value.trim());
      handleFieldChange('tags');
    }
    newTag.value = '';
  }
  showTagInput.value = false;
};

const handleClearAllTags = () => {
  if (editableResult.value) {
    editableResult.value.tags = [];
    handleFieldChange('tags');
  }
};

const handleRegenerate = (field: string) => {
  if (!aiResult.value || !editableResult.value) return;
  
  regeneratingField.value = field;
  ElMessage.info(`Regenerating ${field}...`);
  
  setTimeout(() => {
    const mockResult = generateMockResult('hybrid', {
      formState: formState,
      images: aiResult.value!.images
    });
    
    switch (field) {
      case 'title':
        editableResult.value.title = mockResult.title;
        break;
      case 'subtitle':
        editableResult.value.subtitle = mockResult.subtitle;
        break;
      case 'category':
        editableResult.value.categoryPath = mockResult.categoryPath;
        break;
      case 'bullets':
        editableResult.value.bullets = mockResult.bullets;
        break;
      case 'description':
        editableResult.value.description = mockResult.description;
        break;
      case 'attributes':
        editableResult.value.attributes = mockResult.attributes;
        break;
      case 'salesAttributes':
        editableResult.value.salesAttributes = mockResult.salesAttributes;
        break;
      case 'images':
        editableResult.value.images = mockResult.images;
        aiResult.value!.images = mockResult.images;
        break;
    }
    
    handleFieldChange(field);
    regeneratingField.value = null;
    ElMessage.success(`${field} regenerated`);
  }, 1000);
};

const handleSaveCategory = () => {
  if (!editableResult.value || !categoryInputValue.value.trim()) {
    showCategoryInput.value = false;
    return;
  }
  
  // 解析分类路径，支持 ">" 或 "/" 分隔符
  const path = categoryInputValue.value.split(/[>/]/).map(s => s.trim()).filter(s => s);
  if (path.length > 0) {
    editableResult.value.categoryPath = path;
    handleFieldChange('categoryPath');
  }
  
  showCategoryInput.value = false;
  categoryInputValue.value = '';
};

const handleAddAttribute = () => {
  if (!editableResult.value) return;
  editableResult.value.attributes.push({
    name: '',
    value: '',
    source: 'ai'
  });
  handleFieldChange('attributes');
};

const handleRemoveAttribute = (index: number) => {
  if (!editableResult.value) return;
  editableResult.value.attributes.splice(index, 1);
  handleFieldChange('attributes');
};

const handleAddAttrValue = (attrIndex: number) => {
  if (!editableResult.value || !editableResult.value.salesAttributes) return;
  editableResult.value.salesAttributes[attrIndex].values.push('');
  handleFieldChange('salesAttributes');
};

const handleRemoveAttrValue = (attrIndex: number, valueIndex: number) => {
  if (!editableResult.value || !editableResult.value.salesAttributes) return;
  editableResult.value.salesAttributes[attrIndex].values.splice(valueIndex, 1);
  handleFieldChange('salesAttributes');
};

const handleRegenerateSkus = () => {
  if (!editableResult.value) return;
  
  // 如果有销售属性，根据销售属性重新生成
  if (editableResult.value.salesAttributes && editableResult.value.salesAttributes.length > 0) {
    // SKU列表会根据销售属性自动生成，这里只需要触发更新
    ElMessage.success('SKUs regenerated based on sales attributes');
    return;
  }
  
  // 否则使用mock生成
  const mockResult = generateMockResult('hybrid', {
    formState: formState,
    images: aiResult.value!.images
  });

  if (mockResult.suggestedSkus) {
    editableResult.value.suggestedSkus = mockResult.suggestedSkus;
    handleFieldChange('suggestedSkus');
    ElMessage.success('SKUs regenerated');
  }
};

const getSkuSpecColumns = () => {
  if (!editableResult.value || !editableResult.value.salesAttributes) return [];
  return editableResult.value.salesAttributes
    .filter(attr => attr.values && attr.values.length > 0)
    .map(attr => attr.name);
};

const handleSkuCodeChange = (row: any) => {
  handleFieldChange('suggestedSkus');
};

const handleSkuChange = (row: any) => {
  handleFieldChange('suggestedSkus');
};

const replaceImageInputRef = ref<HTMLInputElement>();
const replacingImageId = ref<string | null>(null);

const handleReplaceImage = (imageId: string | undefined) => {
  if (!imageId) return;
  replacingImageId.value = imageId;
  replaceImageInputRef.value?.click();
};

const handleAddImage = () => {
  replacingImageId.value = null;
  replaceImageInputRef.value?.click();
};

const handleReplaceImageFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  
  const file = target.files[0];
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('Please select an image file');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    if (!aiResult.value) return;
    
    const newUrl = e.target?.result as string;
    
    if (replacingImageId.value) {
      // 替换现有图片
      const imageIndex = aiResult.value.images.findIndex(img => img.id === replacingImageId.value);
      if (imageIndex !== -1) {
        aiResult.value.images[imageIndex].url = newUrl;
        aiResult.value.images[imageIndex].file = file;
        if (editableResult.value) {
          editableResult.value.images[imageIndex].url = newUrl;
          editableResult.value.images[imageIndex].file = file;
        }
        handleFieldChange('images');
        ElMessage.success('Image replaced');
      }
    } else {
      // 添加新图片
      const newImage: AiProductImage = {
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        url: newUrl,
        file: file,
        isMain: aiResult.value.images.length === 0
      };
      
      aiResult.value.images.push(newImage);
      if (editableResult.value) {
        editableResult.value.images.push({ ...newImage });
      }
      handleFieldChange('images');
      ElMessage.success('Image added');
    }
    
    replacingImageId.value = null;
    // 重置input
    if (target) {
      target.value = '';
    }
  };
  reader.readAsDataURL(file);
};

const handleRemoveSku = (index: number) => {
  if (!editableResult.value) return;
  
  // 如果SKU是基于销售属性生成的，不能单独删除，需要提示用户修改销售属性
  if (editableResult.value.salesAttributes && editableResult.value.salesAttributes.length > 0) {
    ElMessage.warning('Cannot delete individual SKU. Please modify sales attributes to regenerate SKUs.');
    return;
  }
  
  // 否则删除 suggestedSkus 中的项
  if (editableResult.value.suggestedSkus) {
    editableResult.value.suggestedSkus.splice(index, 1);
    handleFieldChange('suggestedSkus');
  }
};

const handleSelectSku = (sku: string) => {
  ElMessage.info(`Selected SKU: ${sku}`);
  // 可以在这里实现SKU应用到变体的逻辑
};

const handleSetMainImage = (imageId: string) => {
  if (!aiResult.value) return;
  
  aiResult.value.images.forEach(img => {
    img.isMain = img.id === imageId;
  });
  
  if (editableResult.value) {
    editableResult.value.images.forEach(img => {
      img.isMain = img.id === imageId;
    });
  }
};

const handleDeleteImage = (imageId: string) => {
  if (!aiResult.value) return;
  
  aiResult.value.images = aiResult.value.images.filter(img => img.id !== imageId);
  
  if (editableResult.value) {
    editableResult.value.images = editableResult.value.images.filter(img => img.id !== imageId);
  }
  
  if (aiResult.value.images.length > 0 && !aiResult.value.images.find(img => img.isMain)) {
    aiResult.value.images[0].isMain = true;
  }
};

const handleSaveDraft = () => {
  console.log('Save draft:', editableResult.value);
  ElMessage.success('Draft saved (check console)');
};

const handleApplyToExisting = () => {
  ElMessage.info('Apply to existing product feature coming soon');
};

const handleExportJson = () => {
  if (!editableResult.value) return;
  
  const json = JSON.stringify(editableResult.value, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ai-product-draft-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  
  ElMessage.success('JSON exported');
};

const getSourceTagType = (source: AttributeSource): string => {
  const map: Record<AttributeSource, string> = {
    image: 'info',
    notes: 'success',
    ai: 'warning'
  };
  return map[source] || '';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};
</script>

<style scoped lang="scss">
.ai-product-creator {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color-page);
  overflow: hidden;
  
  .page-header {
    flex-shrink: 0;
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    background: var(--el-bg-color);
    
    .page-title {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
    
    .page-subtitle {
      margin: 0;
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }
  }
  
  .creator-layout {
    flex: 1;
    display: flex;
    overflow: hidden;
    gap: 1px;
    background: var(--el-border-color-lighter);
    
    // 左侧：配置区域
    .left-panel {
      width: 35%;
      min-width: 450px;
      max-width: 550px;
      flex-shrink: 0;
      background: var(--el-bg-color);
      overflow-y: auto;
      border-right: 1px solid var(--el-border-color-lighter);
      
      .config-card {
        height: 100%;
        border: none;
        border-radius: 0;
        
        :deep(.el-card__body) {
          padding: 16px;
          height: 100%;
        }
        
        .form-section {
          margin-bottom: 20px;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          .section-label {
            font-size: 13px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
            
            .help-icon {
              font-size: 14px;
              color: var(--el-text-color-secondary);
              cursor: help;
              
              &:hover {
                color: var(--el-color-primary);
              }
            }
          }
          
          :deep(.el-form-item__label) {
            display: flex;
            align-items: center;
            gap: 4px;
            
            .help-icon {
              font-size: 13px;
              color: var(--el-text-color-secondary);
              cursor: help;
              
              &:hover {
                color: var(--el-color-primary);
              }
            }
          }
          
          .el-form-item {
            margin-bottom: 16px;
            
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
        
        .advanced-collapse {
          :deep(.el-collapse-item__header) {
            padding-left: 0;
            font-size: 13px;
            font-weight: 500;
          }
          
          :deep(.el-collapse-item__content) {
            padding: 12px 0;
          }
        }
        
        .form-actions {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid var(--el-border-color-lighter);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      }
    }
    
    // 右侧：预览区域
    .right-panel {
      flex: 1;
      background: var(--el-bg-color);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      
      .preview-empty {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        
        .empty-icon {
          font-size: 48px;
          color: var(--el-text-color-placeholder);
          margin-bottom: 12px;
        }
        
        .empty-text {
          margin: 0;
          font-size: 14px;
          color: var(--el-text-color-secondary);
          text-align: center;
          max-width: 400px;
        }
      }
      
      .preview-loading {
        padding: 20px;
      }
      
      .preview-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
        
        .preview-header {
          flex-shrink: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          border-bottom: 1px solid var(--el-border-color-lighter);
          background: var(--el-bg-color);
          
          .header-left {
            display: flex;
            align-items: center;
            gap: 12px;
            
            .meta-text {
              font-size: 12px;
              color: var(--el-text-color-secondary);
            }
          }
          
          .header-right {
            display: flex;
            gap: 8px;
          }
        }
        
        .preview-body {
          flex: 1;
          padding: 20px 0;
          padding-left: 72px;
          padding-right: 24px;
          overflow-y: auto;
          
          .section-block {
            margin-bottom: 24px;
            scroll-margin-top: 80px;
            
            &:last-child {
              margin-bottom: 0;
            }
            
            .section-header {
              margin-bottom: 16px;
              padding-left: 1px;
              
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
              
              // 字段AI操作按钮容器
              .field-ai-actions {
                display: flex;
                gap: 8px;
                flex-shrink: 0;
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
                    background: rgba(0, 0, 0, 0.02) !important;
                    border-color: var(--el-border-color-dark);
                  }
                  
                  .attribute-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 10px;
                    
                    .attribute-label {
                      display: flex;
                      align-items: center;
                      gap: 8px;
                      flex: 1;
                      min-width: 0;
                      
                      .label-text {
                        font-size: 12px;
                        font-weight: 500;
                        color: var(--el-text-color-primary);
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      }
                      
                      .el-tag {
                        height: 18px;
                        line-height: 16px;
                        padding: 0 6px;
                        font-size: 11px;
                        flex-shrink: 0;
                      }
                    }
                  }
                  
                  .attribute-content {
                    .el-input {
                      width: 100%;
                    }
                  }
                  
                  .attr-values {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    
                    .attr-value-item {
                      display: flex;
                      align-items: center;
                      gap: 8px;
                    }
                  }
                }
              }
              
              .content-form {
                .el-form-item {
                  margin-bottom: 20px;
                  
                  &:last-child {
                    margin-bottom: 0;
                  }
                }
              }
              
              .bullets-list {
                .bullet-item {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  margin-bottom: 8px;
                  
                  &:last-child {
                    margin-bottom: 0;
                  }
                  
                  .bullet-marker {
                    color: var(--el-text-color-secondary);
                    font-size: 14px;
                    flex-shrink: 0;
                  }
                  
                  .bullet-input {
                    flex: 1;
                  }
                }
              }
            }
          }
          
          .variants-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 16px;
            
            .variant-card {
              border: 1px solid var(--el-border-color-lighter);
              border-radius: 8px;
              padding: 16px;
              background: var(--el-bg-color);
              
              .variant-header {
                margin-bottom: 12px;
                padding-bottom: 12px;
                border-bottom: 1px solid var(--el-border-color-lighter);
                
                .variant-name {
                  font-size: 14px;
                  font-weight: 600;
                  color: var(--el-text-color-primary);
                }
              }
              
              .variant-content {
                display: flex;
                flex-direction: column;
                gap: 12px;
                
                .variant-row {
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  font-size: 13px;
                  
                  .info-label {
                    color: var(--el-text-color-secondary);
                    min-width: 60px;
                    flex-shrink: 0;
                    font-weight: 500;
                  }
                  
                  .variant-field-input {
                    flex: 1;
                    
                    &.sku-input {
                      font-family: monospace;
                      font-size: 12px;
                    }
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
              }
              
              :deep(.el-table__cell) {
                .cell {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  
                  &:has(.el-input) {
                    justify-content: flex-start;
                  }
                }
              }
            }
          }
          
          .images-preview {
            display: flex;
            gap: 16px;
            
            .main-image-container {
              flex: 1;
              max-width: 300px;
              aspect-ratio: 1;
              border: 1px solid var(--el-border-color-lighter);
              border-radius: 4px;
              overflow: hidden;
              background: var(--el-fill-color-light);
              position: relative;
              
              .main-image {
                width: 100%;
                height: 100%;
                object-fit: contain;
              }
              
              .main-image-actions {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.6);
                padding: 8px;
                display: flex;
                justify-content: center;
              }
            }
            
            .thumbnails-container {
              display: flex;
              flex-direction: column;
              gap: 8px;
              max-height: 300px;
              overflow-y: auto;
              
              .thumbnail-item {
                width: 80px;
                aspect-ratio: 1;
                border: 2px solid var(--el-border-color);
                border-radius: 4px;
                overflow: hidden;
                position: relative;
                cursor: pointer;
                transition: all 0.2s;
                
                &.is-main {
                  border-color: var(--el-color-primary);
                }
                
                &.add-image-item {
                  border-style: dashed;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  background: var(--el-fill-color-light);
                  
                  &:hover {
                    border-color: var(--el-color-primary);
                    background: var(--el-color-primary-light-9);
                  }
                  
                  .add-icon {
                    font-size: 24px;
                    color: var(--el-text-color-secondary);
                    margin-bottom: 4px;
                  }
                  
                  .add-text {
                    font-size: 11px;
                    color: var(--el-text-color-secondary);
                  }
                }
                
                &:hover:not(.add-image-item) {
                  border-color: var(--el-color-primary);
                  
                  .thumbnail-overlay {
                    opacity: 1;
                  }
                }
                
                img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }
                
                .thumbnail-badge {
                  position: absolute;
                  top: 4px;
                  right: 4px;
                  background: var(--el-color-primary);
                  color: white;
                  padding: 2px 6px;
                  border-radius: 2px;
                  font-size: 10px;
                  font-weight: 600;
                  z-index: 1;
                }
                
                .thumbnail-overlay {
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  background: rgba(0, 0, 0, 0.7);
                  padding: 4px;
                  display: flex;
                  flex-direction: column;
                  gap: 4px;
                  justify-content: center;
                  opacity: 0;
                  transition: opacity 0.2s;
                }
              }
            }
          }
          
          .preview-footer {
            margin-top: 30px;
            padding: 20px;
            border-top: 1px solid var(--el-border-color-lighter);
            background: var(--el-bg-color);
            position: sticky;
            bottom: 0;
            z-index: 10;
            
            .footer-content {
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 16px;
              
              .footer-left {
                display: flex;
                align-items: center;
                gap: 12px;
                
                .meta-text {
                  font-size: 13px;
                  color: var(--el-text-color-secondary);
                }
              }
              
              .footer-right {
                display: flex;
                gap: 12px;
              }
            }
          }
        }
      }
    }
  }
}

// 响应式
@media (max-width: 1200px) {
  .ai-product-creator {
    .creator-layout {
      .left-panel {
        width: 350px;
      }
    }
  }
}

@media (max-width: 768px) {
  .ai-product-creator {
    .creator-layout {
      flex-direction: column;
      
      .left-panel {
        width: 100%;
        max-height: 50vh;
      }
      
      .right-panel {
        flex: 1;
      }
    }
  }
}
</style>
