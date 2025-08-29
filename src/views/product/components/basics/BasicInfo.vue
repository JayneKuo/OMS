# 基本信息组件
<template>
  <el-form 
    :model="form" 
    label-position="left"
    :rules="rules"
    ref="formRef"
    :label-width="180"
  >
    <!-- Category Path -->
    <div class="category-path">
      <div class="path-content">
        <el-tag type="info">Category Selected</el-tag>
        <div class="path-text">
          {{ categoryPath }}
          <el-link type="primary" class="edit-link" @click="handleEditCategory">Edit Category</el-link>
        </div>
      </div>
    </div>

    <div class="basic-info">
      <div class="section-header">
        <h3>Basic Information</h3>
      </div>

      <!-- Product Name -->
      <el-form-item 
        label="Product Name (English)" 
        prop="generalInfo.productName"
        required
      >
        <el-input 
          v-model="form.generalInfo.productName"
          placeholder="Enter product name"
          maxlength="1000"
          show-word-limit
        >
          <template #prefix>
            <el-tooltip content="Required field" placement="top">
              <el-icon class="required-icon"><StarFilled /></el-icon>
            </el-tooltip>
          </template>
        </el-input>
        <div class="field-help">
          Product name will be displayed in all channels and marketplaces
        </div>
      </el-form-item>

      <!-- Seller Parent SKU -->
      <el-form-item 
        label="Seller Parent SKU" 
        prop="generalInfo.parentSku"
      >
        <el-input 
          v-model="form.generalInfo.parentSku"
          placeholder="Put your own SKU"
        >
          <template #prefix>
            <el-tooltip content="This is your own SKU identifier">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
        </el-input>
      </el-form-item>

      <!-- Brand -->
      <el-form-item 
        label="Brand" 
        prop="generalInfo.brand"
      >
        <div class="brand-section">
          <el-select
            v-model="form.generalInfo.brand"
            placeholder="Select Brand"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="brand in brands"
              :key="brand"
              :label="brand"
              :value="brand"
            />
          </el-select>
          <div class="field-help">
            If your brand isn't listed, please go to <el-link type="primary">Brands</el-link> to add a new brand.
          </div>
        </div>
      </el-form-item>

      <!-- Product Type -->
      <el-form-item 
        label="Product Type" 
        prop="generalInfo.productType"
        required
      >
        <el-select
          v-model="form.generalInfo.productType"
          placeholder="Select Product Type"
          style="width: 100%"
        >
          <el-option label="Physical Product" value="physical" />
          <el-option label="Virtual Product" value="virtual" />
          <el-option label="Service" value="service" />
          <el-option label="Gift" value="gift" />
          <el-option label="Sample" value="sample" />
          <el-option label="Material" value="material" />
        </el-select>
      </el-form-item>

      <!-- UOM -->
      <el-form-item 
        label="UOM" 
        prop="generalInfo.baseUOM"
        required
      >
        <el-select
          v-model="form.generalInfo.baseUOM"
          placeholder="Select UOM"
          style="width: 100%"
        >
          <el-option-group label="Common">
            <el-option label="Piece (pcs)" value="pcs" />
            <el-option label="Carton (ctn)" value="ctn" />
            <el-option label="Each" value="each" />
          </el-option-group>
          <el-option-group label="Weight">
            <el-option label="Kilogram (kg)" value="kg" />
            <el-option label="Gram (g)" value="g" />
          </el-option-group>
          <el-option-group label="Volume">
            <el-option label="Liter (L)" value="l" />
            <el-option label="Milliliter (ml)" value="ml" />
          </el-option-group>
          <el-option-group label="Length">
            <el-option label="Meter (m)" value="m" />
            <el-option label="Centimeter (cm)" value="cm" />
          </el-option-group>
          <el-option-group label="Package">
            <el-option label="Case" value="case" />
            <el-option label="Pallet" value="pallet" />
            <el-option label="Box" value="box" />
          </el-option-group>
        </el-select>
      </el-form-item>

      <!-- Primary Barcode -->
      <el-form-item 
        label="Primary Barcode" 
        prop="generalInfo.primaryBarcode"
      >
        <div class="barcode-section">
          <el-input
            v-model="form.generalInfo.primaryBarcode"
            placeholder="Enter barcode"
            maxlength="13"
            show-word-limit
          >
            <template #append>
              <el-tooltip 
                content="Scan barcode or enter manually. Supports EAN-13, UPC-A, and ISBN formats." 
                placement="top"
              >
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </template>
          </el-input>
          <div class="field-help">
            Common barcode formats: EAN-13 (13 digits), UPC-A (12 digits), ISBN (13 digits)
          </div>
        </div>
      </el-form-item>

      <!-- Product Description -->
      <el-form-item 
        label="Product Description" 
        prop="generalInfo.description"
      >
        <el-input 
          v-model="form.generalInfo.description"
          type="textarea"
          :rows="6"
          placeholder="Enter product description"
          maxlength="5000"
          show-word-limit
        />
      </el-form-item>

      <!-- Keywords -->
      <el-form-item 
        label="Keywords" 
        prop="generalInfo.keywords"
      >
        <el-select
          v-model="form.generalInfo.keywords"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="Enter keywords and press Enter"
          style="width: 100%"
        >
          <el-option
            v-for="item in keywordSuggestions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <div class="field-help">
          Enter keywords to improve product searchability. Each keyword should be specific and relevant.
        </div>
      </el-form-item>

      <!-- Section Divider -->
      <div class="section-divider"></div>

      <!-- Product Attributes -->
      <div class="product-attributes">
        <div class="attributes-header" @click="toggleAttributes">
          <div class="left">
            <h4>Product Attributes</h4>
          </div>
          <div class="right">
            <el-icon :class="{ 'is-active': showAttributes }"><ArrowDown /></el-icon>
          </div>
        </div>
        <div class="attributes-content">
          <div class="attributes-grid">
            <!-- 前6个属性（固定显示） -->
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item>
                  <div class="attribute-label">
                    <span class="required-tag">Important</span>
                    <span>Product Condition</span>
                    <el-tooltip content="Select the current condition of the product" placement="top">
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                  <el-select
                    v-model="form.generalInfo.condition"
                    placeholder="Select condition"
                    style="width: 100%"
                  >
                    <el-option label="New" value="new" />
                    <el-option label="Like New" value="like_new" />
                    <el-option label="Used - Excellent" value="used_excellent" />
                    <el-option label="Used - Good" value="used_good" />
                    <el-option label="Used - Fair" value="used_fair" />
                    <el-option label="Refurbished" value="refurbished" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <div class="attribute-label">
                    <span class="required-tag">Important</span>
                    <span>Country of Origin</span>
                    <el-tooltip content="Select the country where the product was manufactured" placement="top">
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                  <el-select
                    v-model="form.generalInfo.originCountry"
                    placeholder="Select country"
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="country in countries"
                      :key="country.code"
                      :label="country.name"
                      :value="country.code"
                    >
                      <span>{{ country.name }}</span>
                      <span class="country-code">({{ country.code }})</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <div class="attribute-label">
                    <span class="required-tag">Important</span>
                    <span>Hazardous Material</span>
                    <el-tooltip content="Specify if the product contains hazardous materials" placement="top">
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                  <div class="hazardous-section">
                    <el-switch
                      v-model="form.generalInfo.isHazardous"
                      active-text="Yes"
                      inactive-text="No"
                    />
                    <el-select
                      v-if="form.generalInfo.isHazardous"
                      v-model="form.generalInfo.hazardClass"
                      placeholder="Select hazard class"
                      style="width: 100%; margin-top: 8px;"
                    >
                      <el-option label="Class 1 - Explosives" value="class_1" />
                      <el-option label="Class 2 - Gases" value="class_2" />
                      <el-option label="Class 3 - Flammable Liquids" value="class_3" />
                      <el-option label="Class 4 - Flammable Solids" value="class_4" />
                      <el-option label="Class 5 - Oxidizing Substances" value="class_5" />
                      <el-option label="Class 6 - Toxic Substances" value="class_6" />
                      <el-option label="Class 7 - Radioactive Materials" value="class_7" />
                      <el-option label="Class 8 - Corrosive Substances" value="class_8" />
                      <el-option label="Class 9 - Miscellaneous" value="class_9" />
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item>
                  <div class="attribute-label">
                    <span class="required-tag">Important</span>
                    <span>Expiration Management</span>
                    <el-tooltip content="Specify if the product has an expiration date" placement="top">
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                  <div class="expiration-section">
                    <el-switch
                      v-model="form.generalInfo.hasExpiration"
                      active-text="Yes"
                      inactive-text="No"
                    />
                    <template v-if="form.generalInfo.hasExpiration">
                      <el-input-number
                        v-model="form.generalInfo.shelfLife"
                        :min="1"
                        :max="3650"
                        placeholder="Shelf life (days)"
                        style="width: 100%; margin-top: 8px;"
                      />
                      <el-select
                        v-model="form.generalInfo.expirationFormat"
                        placeholder="Date format"
                        style="width: 100%; margin-top: 8px;"
                      >
                        <el-option label="YYYY-MM-DD" value="yyyy-mm-dd" />
                        <el-option label="MM/DD/YYYY" value="mm/dd/yyyy" />
                        <el-option label="DD/MM/YYYY" value="dd/mm/yyyy" />
                        <el-option label="MM/YYYY" value="mm/yyyy" />
                      </el-select>
                    </template>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <div class="attribute-label">
                    <span class="required-tag">Important</span>
                    <span>Type</span>
                    <el-tooltip content="Select the product type" placement="top">
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                  <el-select 
                    v-model="form.generalInfo.attributes.type"
                    placeholder="Select Type"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <div class="attribute-label">
                    <span class="required-tag">Important</span>
                    <span>Style</span>
                    <el-tooltip content="Select the product style" placement="top">
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                  <el-select 
                    v-model="form.generalInfo.attributes.style"
                    placeholder="Select Style"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item>
                  <div class="attribute-label">
                    <span class="required-tag">Important</span>
                    <span>Details</span>
                    <el-tooltip content="Select product details" placement="top">
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                  <el-select 
                    v-model="form.generalInfo.attributes.details"
                    placeholder="Select Details"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <div class="attribute-label">
                    <span class="required-tag">Important</span>
                    <span>Material</span>
                    <el-tooltip content="Select the main material" placement="top">
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                  <el-select 
                    v-model="form.generalInfo.attributes.material"
                    placeholder="Select Material"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <div class="attribute-label">
                    <span>Specific Pattern</span>
                    <el-tooltip content="Select the pattern type" placement="top">
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                  <el-select 
                    v-model="form.generalInfo.attributes.pattern"
                    placeholder="Select Pattern"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 额外属性（点击展开显示） -->
            <div v-show="showAttributes" class="additional-attributes">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item>
                    <div class="attribute-label">
                      <span>Hazard Category</span>
                      <el-tooltip content="Select if product contains hazardous materials" placement="top">
                        <el-icon><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </div>
                    <el-select 
                      v-model="form.generalInfo.attributes.hazardCategory"
                      placeholder="Select Category"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <div class="attribute-label">
                      <span>Features</span>
                      <el-tooltip content="Select product features" placement="top">
                        <el-icon><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </div>
                    <el-select 
                      v-model="form.generalInfo.attributes.features"
                      placeholder="Select Features"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <div class="attribute-label">
                      <span>Care Instructions</span>
                      <el-tooltip content="Select care instructions" placement="top">
                        <el-icon><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </div>
                    <el-select 
                      v-model="form.generalInfo.attributes.careInstructions"
                      placeholder="Select Instructions"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item>
                    <div class="attribute-label">
                      <span>Strap Type</span>
                      <el-tooltip content="Select the strap type" placement="top">
                        <el-icon><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </div>
                    <el-select 
                      v-model="form.generalInfo.attributes.strapType"
                      placeholder="Select Type"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <div class="attribute-label">
                      <span>Magnetic</span>
                      <el-tooltip content="Select if product contains magnetic components" placement="top">
                        <el-icon><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </div>
                    <el-select 
                      v-model="form.generalInfo.attributes.magnetic"
                      placeholder="Select Option"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <div class="attribute-label">
                      <span>Closure Type</span>
                      <el-tooltip content="Select the closure mechanism" placement="top">
                        <el-icon><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </div>
                    <el-select 
                      v-model="form.generalInfo.attributes.closureType"
                      placeholder="Select Type"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <div class="special-attribute">
                <div class="attribute-header">
                  <div class="label">Coating</div>
                  <div class="tip-text">The sum of all Coating proportions must equal 100%</div>
                </div>
                <div class="input-group">
                  <el-select 
                    v-model="form.generalInfo.attributes.coatingType"
                    placeholder="Select Type"
                    class="type-select"
                  />
                  <el-input-number 
                    v-model="form.generalInfo.attributes.coatingPercentage"
                    :min="0"
                    :max="100"
                    placeholder="Numb"
                    class="number-input"
                    controls-position="right"
                  />
                  <span class="unit">%</span>
                  <el-button class="add-button" type="primary">Add</el-button>
                </div>
              </div>

              <div class="special-attribute">
                <div class="attribute-header">
                  <div class="label">Composition</div>
                  <div class="tip-text">The sum of all Composition proportions must equal 100%</div>
                </div>
                <div class="input-group">
                  <el-select 
                    v-model="form.generalInfo.attributes.compositionType"
                    placeholder="Select Type"
                    class="type-select"
                  />
                  <el-input-number 
                    v-model="form.generalInfo.attributes.compositionPercentage"
                    :min="0"
                    :max="100"
                    placeholder="Numb"
                    class="number-input"
                    controls-position="right"
                  />
                  <span class="unit">%</span>
                  <el-button class="add-button" type="primary">Add</el-button>
                </div>
              </div>

              <div class="special-attribute">
                <div class="attribute-header">
                  <div class="label">Quantity</div>
                </div>
                <div class="input-group">
                  <el-input-number 
                    v-model="form.generalInfo.attributes.quantity"
                    :min="1"
                    controls-position="right"
                    class="quantity-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section Divider -->
      <div class="section-divider"></div>

      <!-- Variants -->
      <div class="variations-section">
        <div class="variants-header">
          <div class="left">
            <h3>Variants</h3>
          </div>
          <div class="right">
            <div class="tips">
              <el-icon><InfoFilled /></el-icon>
              <div class="tip-content">
                <p>You can add up to 3 variant attributes (e.g., color, size), and the mandatory attribute must include 2+ images. Once the product is published, existing variant attributes cannot be modified.</p>
                <p>Instructions for Filling in Custom Attribute Values.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Variant Attributes -->
        <div class="variant-attributes">
          <!-- Sales Attributes -->
          <div class="attribute-section">
            <div class="section-header">
              <div class="section-label">
                <span class="required">*</span>
                Sales Attributes (Max 3)
              </div>
            </div>
            <div class="attribute-row" v-for="(attr, attrIndex) in salesAttributes" :key="attrIndex">
              <el-select
                v-model="attr.type"
                placeholder="Select Attribute Type"
                class="attribute-type-select"
                @change="handleAttributeTypeChange(attrIndex)"
              >
                <el-option
                  v-for="option in getAvailableAttributeTypes(attrIndex)"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              
              <div class="value-list">
                <div v-for="(value, valueIndex) in attr.values" :key="valueIndex" class="value-item">
                  <el-select
                    v-model="attr.values[valueIndex]"
                    placeholder="Set Attribute Value"
                    class="attribute-value-select"
                    filterable
                    allow-create
                    @change="handleValueChange(attrIndex, valueIndex)"
                  >
                    <el-option
                      v-for="option in getAvailableOptions(attr.type, attr.values, valueIndex)"
                      :key="option"
                      :label="option"
                      :value="option"
                    />
                  </el-select>
                  <el-button link @click="removeAttributeValue(attrIndex, valueIndex)" class="delete-btn">Delete</el-button>
                </div>
              </div>
            </div>
            
            <!-- Add Attribute Button -->
            <div class="add-attribute" v-if="salesAttributes.length < 3">
              <el-button 
                link 
                type="primary" 
                @click="addAttribute"
                class="add-attribute-btn"
              >
                <el-icon><Plus /></el-icon>
                Add Attribute
              </el-button>
            </div>
          </div>


        </div>


        <!-- Product Images -->
        <div class="product-images">
          <!-- Section Header -->
          <div class="section-header">
            <h4>Color Images</h4>
          </div>

          <!-- Image Tips -->
          <div class="image-tips">
            <el-icon><InfoFilled /></el-icon>
            <ol>
              <li>Upload up to 11 detailed images with an aspect ratio between 3:4 and 1:1, and a resolution between 900×900 px and 2200×2200 px.</li>
              <li>Minimum file size is 3MB. Supported formats: JPG, JPEG, PNG.</li>
              <li>Each variant will display its variant title first, which can be managed in the product image module. If no SKU title is provided, the SKU title will be used instead.</li>
              <li>Ad images are used for external ads. Upload high-quality images that accurately represent the product.</li>
              <li class="required-tip">Images marked with * are required for SHEIN</li>
            </ol>
          </div>

          <!-- Image Table -->
          <div class="image-table">
            <!-- Table Header -->
            <div class="table-header">
              <div class="col-color">Color</div>
              <div class="col-name">Variant Name (Title on Details Page)</div>
              <div class="col-images">Images</div>
              <div class="col-all">
                Ad Image
                <el-tooltip content="Upload all product images at once" placement="top">
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
              </div>
              <div class="col-swatch">
                Color Swatch
                <el-tooltip content="80×80 px color swatch image" placement="top">
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
              </div>
            </div>

            <!-- Table Body -->
            <div class="table-body">
              <template v-for="(attr, attrIndex) in salesAttributes" :key="attrIndex">
                <template v-if="attr.type === 'color'">
                  <div class="table-row" v-for="(value, valueIndex) in attr.values.filter(v => v)" :key="valueIndex">
                    <div class="col-color">
                      <div class="color-name">{{ value }}</div>
                      <div class="color-skc">SKC: {{ generateSKC(value) }}</div>
                    </div>
                    <div class="col-name">
                      <el-input
                        v-model="variantTitles[generateSKC(value)]"
                        placeholder="If not required, the SKU title will be displayed by default..."
                      />
                    </div>
                    <div class="col-images">
                      <div class="image-grid">
                        <div class="image-slot">
                          <div class="image-label">*Main image</div>
                          <div class="upload-area">
                            <el-icon><Picture /></el-icon>
                          </div>
                        </div>
                        <div v-for="n in 4" :key="n" class="image-slot">
                          <div class="image-label">
                            High resolution
                            <el-tooltip content="Resolution between 900×900 px and 2200×2200 px" placement="top">
                              <el-icon><InfoFilled /></el-icon>
                            </el-tooltip>
                          </div>
                          <div class="upload-area">
                            <el-icon><Picture /></el-icon>
                          </div>
                        </div>
                        <div class="image-slot">
                          <el-upload
                            class="uploader"
                            :auto-upload="false"
                            :show-file-list="false"
                            accept=".jpg,.jpeg,.png"
                            :before-upload="validateImageUpload"
                            :multiple="true"
                          >
                            <div class="upload-area square">
                              <el-icon><Upload /></el-icon>
                              <div class="upload-text">Upload</div>
                            </div>
                          </el-upload>
                        </div>
                      </div>
                    </div>
                    <div class="col-all">
                      <el-upload
                        class="uploader"
                        :auto-upload="false"
                        :show-file-list="false"
                        accept=".jpg,.jpeg,.png"
                        :before-upload="validateImageUpload"
                      >
                        <div class="upload-area">
                          <el-icon><Upload /></el-icon>
                          <div class="upload-text">Upload</div>
                        </div>
                      </el-upload>
                    </div>
                    <div class="col-swatch">
                      <el-upload
                        class="uploader"
                        :auto-upload="false"
                        :show-file-list="false"
                        accept=".jpg,.jpeg,.png"
                        :before-upload="validateSwatchUpload"
                      >
                        <div class="upload-area circle">
                          <el-icon><Upload /></el-icon>
                          <div class="upload-text">Upload</div>
                        </div>
                      </el-upload>
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </div>

                <!-- SKU List -->
      <div class="sku-list">
        <!-- Header -->
        <div class="sku-header">
          <div class="header-top">
            <h4>SKU List</h4>
          </div>
        </div>

        <!-- Warning Message -->
        <div class="warning-message">
          <el-icon><Warning /></el-icon>
          <span>Product weight and volume directly impact pricing, sales performance, and shipping costs. Use compact packaging and measure accurately. Incorrect submissions may result in penalties.</span>
        </div>

        <!-- SKU Content -->
        <div v-if="skuList.length > 0" class="sku-content">
          <!-- Batch Actions -->
          <div class="batch-actions">
            <el-select v-model="batchAction" placeholder="Batch Actions">
              <el-option label="Active All" value="activeAll" />
              <el-option label="Inactive All" value="inactiveAll" />
              <el-option label="Delete Selected" value="deleteSelected" />
            </el-select>
            <el-button type="primary" @click="handleBatchAction">Apply</el-button>
          </div>

          <!-- Batch Operations Area -->
          <div class="batch-operations">
            <div class="batch-section">
              <div class="section-header">
                <h5>Filter & Fill</h5>
                <div class="description">
                  If the filter criteria are selected, only the filter results will be filled in batches. If not, all SKUs will be filled in batches.
                </div>
              </div>
              
              <div class="filter-area">
                <div class="filter-row">
                  <div class="filter-label">filter criteria</div>
                  <div class="filter-content">
                    <template v-for="(attr, index) in salesAttributes" :key="attr.type">
                      <template v-if="attr.type">
                        <el-select 
                          v-model="filterCriteria[attr.type]" 
                          :placeholder="attr.type"
                          clearable
                          class="filter-select"
                        >
                          <el-option
                            v-for="value in attr.values.filter(v => v)"
                            :key="value"
                            :label="value"
                            :value="value"
                          />
                        </el-select>
                      </template>
                    </template>
                  </div>
                </div>

                <div class="fill-row">
                  <div class="filter-label">fill in the content</div>
                  <div class="fill-content">
                    <div class="dimensions-group">
                      <label>Package Dimensions</label>
                      <div class="input-group">
                        <el-input-number v-model="fillContent.value" :min="0" :precision="2" :step="0.1" placeholder="L" :controls="false" />
                        <span class="multiply">×</span>
                        <el-input-number v-model="fillContent.width" :min="0" :precision="2" :step="0.1" placeholder="W" :controls="false" />
                        <span class="multiply">×</span>
                        <el-input-number v-model="fillContent.height" :min="0" :precision="2" :step="0.1" placeholder="H" :controls="false" />
                        <el-select v-model="fillContent.unit" placeholder="cm" class="unit-select">
                          <el-option
                            v-for="option in unitOptions.dimension"
                            :key="option.value"
                            :label="option.label"
                            :value="option.value"
                          />
                        </el-select>
                      </div>
                    </div>

                    <div class="weight-group">
                      <label>Weight with Package</label>
                      <div class="input-group">
                        <el-input-number 
                          v-model="fillContent.weight"
                          :min="0"
                          :precision="2"
                          :step="0.1"
                          placeholder="Weight"
                          :controls="false"
                          class="weight-input"
                        />
                        <el-select v-model="fillContent.weightUnit" class="unit-select">
                          <el-option
                            v-for="option in unitOptions.weight"
                            :key="option.value"
                            :label="option.label"
                            :value="option.value"
                          />
                        </el-select>
                      </div>
                    </div>

                    <div class="status-group">
                      <label>Status</label>
                      <el-select v-model="fillContent.status" placeholder="Active" class="status-select">
                        <el-option label="Active" value="active" />
                        <el-option label="Inactive" value="inactive" />
                        <el-option label="Discontinued" value="discontinued" />
                      </el-select>
                    </div>
                  </div>
                </div>

                <div class="action-buttons">
                  <el-button type="primary" @click="handleBatchFill">Fill in Batches</el-button>
                  <el-button @click="handleClear">Clear</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>

            <div class="sku-table">
              <div class="table-header">
                <div class="col-attr" v-for="(attr, index) in salesAttributes.slice(0, 3)" :key="attr.type">
                  {{ attr.type || `Attribute ${index + 1}` }}
                </div>
                <div class="col-weight-package">Weight with Package</div>
                <div class="col-dimensions">Package Dimensions</div>
                <div class="col-sku">Seller SKU</div>
                <div class="col-price">
                  Price
                  <el-tooltip content="Set selling price" placement="top">
                    <el-icon><InfoFilled /></el-icon>
                  </el-tooltip>
                </div>
                <div class="col-inventory">
                  Quantity
                  <el-tooltip content="Set available quantity" placement="top">
                    <el-icon><InfoFilled /></el-icon>
                  </el-tooltip>
                </div>
                <div class="col-status">Status</div>
                <div class="col-action">Action</div>
              </div>
              <div class="table-body">
                <template v-for="(item, index) in skuList" :key="item.skc">
                  <template v-for="(size, sizeIndex) in item.sizes" :key="size.size">
                    <div class="table-row">
                      <!-- 属性列 -->
                      <template v-for="(attr, attrIndex) in salesAttributes.slice(0, 3)" :key="attr.type">
                        <div class="col-attr" :class="{ 'is-merged': shouldMergeCell(item, sizeIndex, attrIndex) }">
                          <template v-if="!shouldMergeCell(item, sizeIndex, attrIndex)">
                            <div class="attr-content">
                              <div class="attr-value">{{ getAttributeValue(item, attrIndex, sizeIndex) }}</div>
                              <div v-if="attrIndex === 0" class="attr-skc">SKC: {{ item.skc }}</div>
                            </div>
                          </template>
                        </div>
                      </template>
                      <!-- Weight with Package列 -->
                      <div class="col-weight-package">
                        <div class="input-group">
                          <el-input-number 
                            v-model="size.packageWeight"
                            :min="0"
                            :precision="2"
                            :step="0.1"
                            placeholder="0.00"
                            class="weight-input"
                            controls-position="right"
                          />
                          <el-select v-model="size.packageWeightUnit" class="unit-select">
                            <el-option label="kg" value="kg" />
                            <el-option label="g" value="g" />
                            <el-option label="lb" value="lb" />
                            <el-option label="oz" value="oz" />
                          </el-select>
                        </div>
                      </div>
                      <!-- Package Dimensions列 -->
                      <div class="col-dimensions">
                        <div class="dimensions-group">
                          <div class="dimension-item">
                            <el-input-number 
                              v-model="size.packageDimensions.length"
                              :min="0"
                              :precision="2"
                              :step="0.1"
                              placeholder="0.00"
                              :controls="false"
                              class="dimension-input"
                            />
                          </div>
                          <span class="separator">×</span>
                          <div class="dimension-item">
                            <el-input-number 
                              v-model="size.packageDimensions.width"
                              :min="0"
                              :precision="2"
                              :step="0.1"
                              placeholder="0.00"
                              :controls="false"
                              class="dimension-input"
                            />
                          </div>
                          <span class="separator">×</span>
                          <div class="dimension-item">
                            <el-input-number 
                              v-model="size.packageDimensions.height"
                              :min="0"
                              :precision="2"
                              :step="0.1"
                              placeholder="0.00"
                              :controls="false"
                              class="dimension-input"
                            />
                          </div>
                          <el-select v-model="size.packageDimensions.unit" class="unit-select">
                            <el-option label="cm" value="cm" />
                            <el-option label="mm" value="mm" />
                            <el-option label="in" value="in" />
                          </el-select>
                        </div>
                      </div>
                      <!-- Seller SKU列 -->
                      <div class="col-sku">
                        <el-input 
                          v-model="size.sellerSKU"
                          placeholder="Enter SKU"
                          class="sku-input"
                        />
                      </div>
                      <!-- Price列 -->
                      <div class="col-price">
                        <el-input-number
                          v-model="size.price"
                          :min="0"
                          :precision="2"
                          :step="0.01"
                          placeholder="0.00"
                          class="price-input"
                          controls-position="right"
                        />
                      </div>
                      <!-- Inventory列 -->
                      <div class="col-inventory">
                        <el-input-number
                          v-model="size.quantity"
                          :min="0"
                          :precision="0"
                          :step="1"
                          placeholder="0"
                          class="inventory-input"
                          controls-position="right"
                        />
                      </div>
                      <!-- Status列 -->
                      <div class="col-status">
                        <el-select v-model="size.status" class="status-select">
                          <el-option label="Active" value="active" />
                          <el-option label="Inactive" value="inactive" />
                          <el-option label="Discontinued" value="discontinued" />
                        </el-select>
                      </div>
                      <!-- Action列 -->
                      <div class="col-action">
                        <el-button 
                          type="danger" 
                          link 
                          class="delete-btn"
                          @click="handleDeleteSku(item.skc, size.id)"
                        >
                          Delete
                        </el-button>
                      </div>
                    </div>
                  </template>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Size Chart & Media Section -->
      <div class="size-chart-section">
        <!-- Size Chart Header -->
        <div class="section-header">
          <div class="title-group">
            <h3>Size Chart</h3>
            <el-button link type="primary" @click="openSizeChartDialog">Edit Size Chart</el-button>
          </div>
        </div>

        <!-- Additional Images -->
        <div class="additional-images">
          <div class="subsection-header">
            <h4>Additional Images</h4>
            <el-tooltip content="Upload up to 10 images with a 3:4 ratio and resolution above 900px" placement="top">
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </div>

          <div class="image-upload-grid">
            <el-upload
              class="image-uploader"
              :auto-upload="false"
              :show-file-list="true"
              :limit="10"
              accept=".jpg,.jpeg,.png"
              :before-upload="validateAdditionalImage"
              :on-exceed="handleExceed"
              multiple
              list-type="picture-card"
            >
              <template #default>
                <div class="upload-area">
                  <el-icon><Plus /></el-icon>
                  <span>Upload</span>
                </div>
              </template>
              <template #file="{ file }">
                <div class="image-card">
                  <img :src="file.url" class="image" />
                  <div class="image-actions">
                    <el-button 
                      type="danger" 
                      :icon="Delete" 
                      circle
                      @click.stop="handleRemove(file)"
                    />
                  </div>
                </div>
              </template>
            </el-upload>
          </div>
        </div>

        <!-- Video Section -->
        <div class="video-section">
          <div class="subsection-header">
            <h4>Video</h4>
            <el-tooltip content="Uploading high-quality product videos can help boost sales by an estimated 25-40%" placement="top">
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </div>

          <div class="video-upload-area">
            <el-upload
              class="video-uploader"
              :auto-upload="false"
              :show-file-list="false"
              accept="video/mp4"
              :before-upload="validateVideoUpload"
            >
              <div class="upload-area">
                <el-icon><Plus /></el-icon>
                <span>Select a video...</span>
              </div>
            </el-upload>

            <div class="upload-tips">
              <ol>
                <li>For better conversion, upload videos in a 1:1 or 1:4 ratio, under 60 seconds, less than 100MB, in MP4 format.</li>
                <li>High resolution is required. Do not include copyrighted content or prohibited terms.</li>
                <li>Include the main product image and highlight key selling points within the first 5 seconds.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <!-- Size Chart Dialog -->
      <el-dialog
        v-model="sizeChartDialogVisible"
        title="Size Chart"
        width="80%"
        class="size-chart-dialog"
      >
        <div class="size-chart-editor">
          <!-- X-Axis Attribute Selection -->
          <div class="axis-selection">
            <span class="required">*</span>
            <span class="label">X-Axis Attribute</span>
            <el-select 
              v-model="selectedXAxis" 
              placeholder="Select attribute"
              @change="handleXAxisChange"
              class="axis-select"
            >
              <el-option
                v-for="attr in availableAttributes"
                :key="attr.value"
                :label="attr.label"
                :value="attr.value"
              />
            </el-select>


          </div>

          <!-- Value Input Section -->
          <div class="value-input-section">
            <div class="input-row">
              <div class="label">Enter initial value</div>
              <div class="inputs">
                <template v-for="column in sizeChartColumns" :key="column.key">
                  <el-input 
                    v-model="initialValues[column.key]"
                    :placeholder="column.label"
                    type="number"
                  />
                </template>
              </div>
            </div>

            <div class="input-row">
              <div class="label">Enter increment value</div>
              <div class="inputs">
                <template v-for="column in sizeChartColumns" :key="column.key">
                  <el-input 
                    v-model="incrementValues[column.key]"
                    :placeholder="column.label"
                    type="number"
                  />
                </template>
              </div>
            </div>

            <div class="actions">
              <el-button type="primary" @click="applyValues">Apply</el-button>
              <el-button @click="clearValues">Clear</el-button>
            </div>
          </div>

          <!-- Size Chart Table -->
          <el-table :data="sizeChartData" border style="width: 100%">
            <el-table-column prop="size" :label="selectedXAxis" width="120">
              <template #default="scope">
                <el-input v-model="scope.row.size" :placeholder="selectedXAxis" />
              </template>
            </el-table-column>

            <template v-for="column in sizeChartColumns" :key="column.key">
              <el-table-column :prop="column.key" :label="column.label" min-width="120">
                <template #default="scope">
                  <el-input 
                    v-model="scope.row[column.key]" 
                    :placeholder="column.label"
                    type="number"
                  />
                </template>
              </el-table-column>
            </template>
          </el-table>
        </div>

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="sizeChartDialogVisible = false">Close</el-button>

            <el-button type="primary" @click="confirmSizeChart">
              Confirm
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { Product, VariantDimension, VariantOption } from '@/types/product';

// SKU 数据类型定义
interface SKUData {
  color: string;
  skc: string;
  sizes: Array<{
    attributes: Record<string, string>;
    weight: number;
    weightUnit: string;
    packageWeight: number;
    packageWeightUnit: string;
    packageDimensions: {
      length: number;
      width: number;
      height: number;
      unit: string;
    };
    sellerSKU: string;
    status: 'active' | 'inactive';
    price: number;
    quantity: number;
  }>;
  images: {
    main: string;
    additional: string[];
    ad?: string;
    swatch?: string;
  };
}
import { QuestionFilled, InfoFilled, StarFilled, ArrowDown, Plus, Delete, Upload, Picture } from '@element-plus/icons-vue';

const props = defineProps<{
  form: Product;
}>();

// 品牌列表
const formRef = ref();
const router = useRouter();
const showAttributes = ref(false);
const variantTitles = ref<Record<string, string>>({});

// SKU 列表数据
const skuList = ref<SKUData[]>([]);

// 批量设置的值
// 筛选条件
const filterCriteria = ref<Record<string, string>>({});

// 填充内容
const fillContent = ref({
  value: 4,
  width: 4,
  height: 4,
  unit: 'cm',
  status: 'active'
});

// 批量填充方法
const handleBatchFill = () => {
  const filteredList = skuList.value.filter(item => {
    if (!filterCriteria.value.color && !filterCriteria.value.size && !filterCriteria.value.weight) {
      return true;
    }
    return (
      (!filterCriteria.value.color || item.color === filterCriteria.value.color) &&
      (!filterCriteria.value.size || item.sizes.some(s => s.attributes.size === filterCriteria.value.size))
    );
  });

  filteredList.forEach(item => {
    item.sizes.forEach(size => {
      size.packageDimensions = {
        length: fillContent.value.value,
        width: fillContent.value.width,
        height: fillContent.value.height,
        unit: fillContent.value.unit
      };
      size.status = fillContent.value.status;
    });
  });

  ElMessage.success('Batch fill completed');
};

// 清空方法
const handleClear = () => {
  filterCriteria.value = {
    color: '',
    size: '',
    weight: ''
  };
  fillContent.value = {
    value: 4,
    width: 4,
    height: 4,
    unit: 'cm',
    status: 'active'
  };
};

// 单位选项
const weightUnits = ['kg', 'g', 'lb', 'oz'];
const dimensionUnits = ['cm', 'mm', 'in'];

// 判断是否需要合并单元格
const shouldMergeCell = (item: any, sizeIndex: number, attrIndex: number) => {
  if (sizeIndex === 0) return false;
  
  const attr = salesAttributes.value[attrIndex];
  if (!attr || !attr.type) return false;
  
  // 获取当前行和前一行的属性值
  const currentValue = getAttributeValue(item, attrIndex, sizeIndex);
  const prevValue = getAttributeValue(item, attrIndex, sizeIndex - 1);
  
  // 如果是颜色属性，只要值相同就合并
  if (attr.type === 'color') {
    return currentValue === prevValue;
  }
  
  // 对于其他属性，需要检查前面的属性是否都相同
  for (let i = 0; i < attrIndex; i++) {
    const prevAttr = salesAttributes.value[i];
    if (!prevAttr || !prevAttr.type) continue;
    
    const currentPrevValue = getAttributeValue(item, i, sizeIndex);
    const prevPrevValue = getAttributeValue(item, i, sizeIndex - 1);
    
    if (currentPrevValue !== prevPrevValue) {
      return false;
    }
  }
  
  return currentValue === prevValue;
};

// 获取属性值的方法
const getAttributeValue = (item: any, index: number, sizeIndex: number) => {
  const attr = salesAttributes.value[index];
  if (!attr || !attr.type) return '-';
  
  if (attr.type === 'color') {
    return item.color || '-';
  } else {
    return item.sizes[sizeIndex]?.attributes[attr.type] || '-';
  }
};

// 删除SKU的方法
const handleDeleteSku = (skc: string, sizeId: string) => {
  ElMessageBox.confirm(
    'Are you sure you want to delete this SKU?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      const skuIndex = skuList.value.findIndex(item => item.skc === skc);
      if (skuIndex > -1) {
        const sizeIndex = skuList.value[skuIndex].sizes.findIndex(size => size.id === sizeId);
        if (sizeIndex > -1) {
          skuList.value[skuIndex].sizes.splice(sizeIndex, 1);
          if (skuList.value[skuIndex].sizes.length === 0) {
            skuList.value.splice(skuIndex, 1);
          }
          ElMessage.success('SKU deleted successfully');
        }
      }
    })
    .catch(() => {
      ElMessage.info('Delete cancelled');
    });
};

// Size Chart Data and State
const sizeChartDialogVisible = ref(false);
const selectedTemplate = ref('');
const selectedXAxis = ref('');
const sizeChartData = ref<Array<Record<string, any>>>([]);
const initialValues = ref<Record<string, string>>({});
const incrementValues = ref<Record<string, string>>({});

// Additional Images Data
const additionalImages = ref<File[]>([]);

// Handle exceed limit
const handleExceed = () => {
  ElMessage.warning('Maximum 10 images allowed');
};

// Handle remove image
const handleRemove = (file: File) => {
  const index = additionalImages.value.indexOf(file);
  if (index > -1) {
    additionalImages.value.splice(index, 1);
  }
};

// Image Upload Validation
interface ImageValidationOptions {
  minSize?: number;
  maxSize?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  aspectRatio?: number;
  aspectRatioTolerance?: number;
}

const validateImage = (file: File, options: ImageValidationOptions = {}) => {
  const {
    minSize = 3 * 1024 * 1024, // 默认最小 3MB
    maxSize = 10 * 1024 * 1024, // 默认最大 10MB
    minWidth = 900,
    minHeight = 900,
    maxWidth = 2200,
    maxHeight = 2200,
    aspectRatio = 0.75, // 3:4
    aspectRatioTolerance = 0.01
  } = options;

  // 检查文件格式
  const acceptedTypes = ['image/jpeg', 'image/png'];
  if (!acceptedTypes.includes(file.type)) {
    ElMessage.error('Only JPG and PNG formats are supported');
    return false;
  }

  // 检查文件大小
  if (file.size < minSize) {
    ElMessage.error(`Image size must be larger than ${(minSize / 1024 / 1024).toFixed(1)}MB`);
    return false;
  }
  if (file.size > maxSize) {
    ElMessage.error(`Image size must be smaller than ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
    return false;
  }

  // 检查图片尺寸
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      const { width, height } = img;
      
      // 检查分辨率
      if (width < minWidth || height < minHeight) {
        ElMessage.error(`Image resolution must be at least ${minWidth}×${minHeight} pixels`);
        reject();
        return;
      }
      if (width > maxWidth || height > maxHeight) {
        ElMessage.error(`Image resolution must not exceed ${maxWidth}×${maxHeight} pixels`);
        reject();
        return;
      }

      // 检查宽高比
      if (aspectRatio) {
        const ratio = width / height;
        if (Math.abs(ratio - aspectRatio) > aspectRatioTolerance) {
          ElMessage.error('Image aspect ratio must be 3:4');
          reject();
          return;
        }
      }

      resolve(true);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject();
    };
  });
};

// 主图验证
const validateMainImage = (file: File) => {
  return validateImage(file, {
    minSize: 3 * 1024 * 1024,
    maxSize: 10 * 1024 * 1024,
    minWidth: 900,
    minHeight: 900,
    maxWidth: 2200,
    maxHeight: 2200,
    aspectRatio: 1 // 1:1
  });
};

// 附加图片验证
const validateAdditionalImage = (file: File) => {
  return validateImage(file, {
    minSize: 3 * 1024 * 1024,
    maxSize: 10 * 1024 * 1024,
    minWidth: 900,
    minHeight: 900,
    maxWidth: 2200,
    maxHeight: 2200,
    aspectRatio: 0.75 // 3:4
  });
};

// 色卡图片验证
const validateSwatchImage = (file: File) => {
  return validateImage(file, {
    minSize: 50 * 1024, // 50KB
    maxSize: 1 * 1024 * 1024, // 1MB
    minWidth: 80,
    minHeight: 80,
    maxWidth: 160,
    maxHeight: 160,
    aspectRatio: 1 // 1:1
  });
};

// Video Upload Validation
const validateVideoUpload = (file: File) => {
  // 检查文件格式
  if (file.type !== 'video/mp4') {
    ElMessage.error('Only MP4 format is supported');
    return false;
  }

  // 检查文件大小（最大 100MB）
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    ElMessage.error('Video size must be less than 100MB');
    return false;
  }

  // 检查视频时长
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      if (video.duration > 60) {
        ElMessage.error('Video duration must be less than 60 seconds');
        reject();
        return;
      }
      resolve(true);
    };
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject();
    };
  });
};

// Size Chart Templates based on category
const sizeChartTemplates = {
  bags: {
    id: 'bags',
    name: 'Bags Size Chart',
    xAxisOptions: [
      { value: 'size', label: 'Size' },
      { value: 'style', label: 'Style' }
    ],
    sizeOptions: ['Mini', 'Small', 'Medium', 'Large'],
    styleOptions: ['Casual', 'Business', 'Party', 'Travel'],
    columns: {
      size: [
        { key: 'strapLength', label: 'Strap Length (cm)' },
        { key: 'handleHeight', label: 'Handle Height (cm)' },
        { key: 'bagWidth', label: 'Bag Width (cm)' },
        { key: 'bagLength', label: 'Bag Length (cm)' },
        { key: 'bagHeight', label: 'Bag Height (cm)' }
      ],
      style: [
        { key: 'capacity', label: 'Capacity (L)' },
        { key: 'maxWeight', label: 'Max Weight (kg)' },
        { key: 'shoulderDrop', label: 'Shoulder Drop (cm)' }
      ]
    }
  },
  clothes: {
    id: 'clothes',
    name: 'Clothing Size Chart',
    xAxisOptions: [
      { value: 'size', label: 'Size' },
      { value: 'height', label: 'Height (cm)' }
    ],
    sizeOptions: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    heightOptions: ['150-155', '155-160', '160-165', '165-170', '170-175', '175-180'],
    columns: {
      size: [
        { key: 'bust', label: 'Bust (cm)' },
        { key: 'waist', label: 'Waist (cm)' },
        { key: 'hip', label: 'Hip (cm)' },
        { key: 'length', label: 'Length (cm)' },
        { key: 'shoulder', label: 'Shoulder (cm)' }
      ],
      height: [
        { key: 'recommendedSize', label: 'Recommended Size' },
        { key: 'sleeveLength', label: 'Sleeve Length (cm)' },
        { key: 'inseam', label: 'Inseam (cm)' }
      ]
    }
  },
  shoes: {
    id: 'shoes',
    name: 'Shoes Size Chart',
    xAxisOptions: [
      { value: 'size', label: 'Size' },
      { value: 'footLength', label: 'Foot Length (cm)' }
    ],
    sizeOptions: ['35', '36', '37', '38', '39', '40', '41'],
    footLengthOptions: ['22.5', '23', '23.5', '24', '24.5', '25', '25.5'],
    columns: {
      size: [
        { key: 'footLength', label: 'Foot Length (cm)' },
        { key: 'footWidth', label: 'Foot Width (cm)' },
        { key: 'heelHeight', label: 'Heel Height (cm)' }
      ],
      footLength: [
        { key: 'euSize', label: 'EU Size' },
        { key: 'usSize', label: 'US Size' },
        { key: 'ukSize', label: 'UK Size' }
      ]
    }
  }
};

// Get available templates based on category
const availableTemplates = computed(() => {
  const category = props.form.generalInfo.category;
  const templates = [];
  
  if (category.some(cat => cat.toLowerCase().includes('bag'))) {
    templates.push(sizeChartTemplates.bags);
  }
  if (category.some(cat => cat.toLowerCase().includes('shoe'))) {
    templates.push(sizeChartTemplates.shoes);
  }
  if (category.some(cat => 
    cat.toLowerCase().includes('cloth') || 
    cat.toLowerCase().includes('apparel')
  )) {
    templates.push(sizeChartTemplates.clothes);
  }
  
  return templates;
});

// Get current template based on selection
const currentTemplate = computed(() => {
  if (!selectedTemplate.value) {
    return availableTemplates.value[0] || null;
  }
  return Object.values(sizeChartTemplates).find(t => t.id === selectedTemplate.value) || null;
});

// Available attributes for X-axis
const availableAttributes = computed(() => {
  const template = currentTemplate.value;
  if (!template) return [];
  return template.xAxisOptions;
});

// Get current axis options based on selection
const currentAxisOptions = computed(() => {
  const template = currentTemplate.value;
  if (!template || !selectedXAxis.value) return [];
  
  // 获取选中X轴对应的选项列表
  const optionsKey = `${selectedXAxis.value}Options`;
  return template[optionsKey] || [];
});

// Get current columns based on X-axis selection
const currentColumns = computed(() => {
  const template = currentTemplate.value;
  if (!template || !selectedXAxis.value) return [];
  
  return template.columns[selectedXAxis.value] || [];
});

// Get columns based on template
const sizeChartColumns = computed(() => {
  return currentTemplate.value?.columns || [];
});

// Open size chart dialog
const openSizeChartDialog = () => {
  sizeChartDialogVisible.value = true;
  if (!selectedXAxis.value && availableAttributes.value.length > 0) {
    selectedXAxis.value = availableAttributes.value[0].value;
  }
  initializeSizeChart();
};

// Initialize size chart
const initializeSizeChart = () => {
  const template = currentTemplate.value;
  if (!template) {
    console.warn('No template available for initialization');
    return;
  }

  try {
    // 设置默认的X轴属性
    if (!selectedXAxis.value && template.xAxisOptions.length > 0) {
      selectedXAxis.value = template.xAxisOptions[0].value;
    }

    // 初始化尺码表数据
    if (sizeChartData.value.length === 0) {
      const axisOptions = currentAxisOptions.value;
      const columns = currentColumns.value;

      sizeChartData.value = axisOptions.map(option => {
        const row: Record<string, any> = {
          [selectedXAxis.value]: option
        };
        columns.forEach(col => {
          row[col.key] = '';
        });
        return row;
      });

      console.log('Size chart initialized with template:', template.name);
    }
  } catch (error) {
    console.error('Error initializing size chart:', error);
    ElMessage.error('Failed to initialize size chart');
  }
};

// Handle X-axis change
const handleXAxisChange = () => {
  // Reset data when changing axis
  sizeChartData.value = [];
  initializeSizeChart();
};

// Apply increment values
const applyValues = () => {
  const template = currentTemplate.value;
  if (!template) return;

  // Get initial and increment values
  const initial = { ...initialValues.value };
  const increment = { ...incrementValues.value };

  // Apply to each row
  sizeChartData.value.forEach((row, index) => {
    template.columns.forEach(col => {
      const initialVal = parseFloat(initial[col.key]) || 0;
      const incrementVal = parseFloat(increment[col.key]) || 0;
      row[col.key] = (initialVal + (incrementVal * index)).toFixed(1);
    });
  });
};

// Clear values
const clearValues = () => {
  initialValues.value = {};
  incrementValues.value = {};
  sizeChartData.value.forEach(row => {
    Object.keys(row).forEach(key => {
      if (key !== 'size') {
        row[key] = '';
      }
    });
  });
};

// Show template help
const showTemplateHelp = () => {
  ElMessageBox.alert(
    'Templates help you quickly fill in size measurements by setting initial values and increments. The system will automatically calculate values for each size.',
    'How Templates Work',
    {
      confirmButtonText: 'Got it'
    }
  );
};

// Save as template
const saveSizeChart = () => {
  // TODO: Implement template saving logic
  ElMessage.success('Template saved successfully');
};

// Confirm size chart
const confirmSizeChart = () => {
  sizeChartDialogVisible.value = false;
  ElMessage.success('Size chart updated successfully');
};

// 监听分类变化，自动选择合适的模板
watch(() => props.form.generalInfo.category, (newCategory) => {
  console.log('Category changed:', newCategory);
  const templates = availableTemplates.value;
  
  // 如果有可用模板，选择第一个
  if (templates.length > 0) {
    selectedTemplate.value = templates[0].id;
    console.log('Selected template:', selectedTemplate.value);
    
    // 确保在模板选择后初始化数据
    nextTick(() => {
      if (currentTemplate.value) {
        initializeSizeChart();
      }
    });
  } else {
    // 如果没有可用模板，重置相关数据
    selectedTemplate.value = '';
    sizeChartData.value = [];
  }
}, { immediate: true });

// 监听模板变化
watch(() => selectedTemplate.value, (newTemplate) => {
  if (newTemplate && sizeChartData.value.length === 0) {
    addSizeRow();
  }
});

const batchValues = ref({
  weight: 0,
  weightUnit: 'kg',
  packageWeight: 0,
  packageWeightUnit: 'kg',
  packageDimensions: {
    length: 0,
    width: 0,
    height: 0,
    unit: 'cm'
  }
});

// 批量操作选项
const batchAction = ref('');

// 处理批量操作
const handleBatchAction = () => {
  if (!batchAction.value) {
    ElMessage.warning('Please select an action');
    return;
  }

  switch (batchAction.value) {
    case 'activeAll':
      skuList.value.forEach(item => {
        item.sizes.forEach(size => {
          size.status = 'active';
        });
      });
      ElMessage.success('All SKUs have been activated');
      break;
    case 'inactiveAll':
      skuList.value.forEach(item => {
        item.sizes.forEach(size => {
          size.status = 'inactive';
        });
      });
      ElMessage.success('All SKUs have been deactivated');
      break;
    case 'deleteSelected':
      // 这里可以添加删除确认对话框
      ElMessage.warning('Delete function not implemented');
      break;
  }
  
  batchAction.value = '';
};

// 单位选项
const unitOptions = {
  weight: [
    { label: 'kg', value: 'kg' },
    { label: 'g', value: 'g' },
    { label: 'lb', value: 'lb' },
    { label: 'oz', value: 'oz' }
  ],
  dimension: [
    { label: 'cm', value: 'cm' },
    { label: 'mm', value: 'mm' },
    { label: 'in', value: 'in' }
  ]
};

const toggleAttributes = () => {
  showAttributes.value = !showAttributes.value;
};

// Format category path
const categoryPath = computed(() => {
  const categories = props.form.generalInfo.category;
  return categories.join(' > ');
});

// Handle edit category
const handleEditCategory = () => {
  router.push('/product/select-category');
};

// Form validation rules
const rules = {
  'generalInfo.productName': [
    { required: true, message: 'Please enter the product name', trigger: 'blur' },
    { min: 3, message: 'Product name should be at least 3 characters', trigger: 'blur' }
  ],
  'generalInfo.parentSku': [
    { required: true, message: 'Please enter your SKU identifier', trigger: 'blur' },
    { pattern: /^[A-Za-z0-9-_]+$/, message: 'SKU can only contain letters, numbers, hyphens and underscores', trigger: 'blur' }
  ],
  'generalInfo.brand': [
    { required: true, message: 'Please select a brand', trigger: 'change' }
  ],
  'generalInfo.keywords': [
    { type: 'array', message: 'Please enter at least one keyword', trigger: 'change' }
  ],
  'generalInfo.productType': [
    { required: true, message: 'Please select product type', trigger: 'change' }
  ],
  'generalInfo.baseUOM': [
    { required: true, message: 'Please select UOM', trigger: 'change' }
  ],
  'generalInfo.primaryBarcode': [
    { pattern: /^[0-9]{12,13}$/, message: 'Please enter a valid 12 or 13-digit barcode', trigger: 'blur' }
  ],
  'generalInfo.condition': [
    { required: true, message: 'Please select product condition', trigger: 'change' }
  ],
  'generalInfo.isHazardous': [
    { required: true, message: 'Please specify if the product is hazardous', trigger: 'change' }
  ],
  'generalInfo.hazardClass': [
    { 
      required: true, 
      message: 'Please select hazard class', 
      trigger: 'change',
      validator: (rule: any, value: any, callback: any) => {
        if (form.value.generalInfo.isHazardous && !value) {
          callback(new Error('Please select hazard class'));
        } else {
          callback();
        }
      }
    }
  ],
  'generalInfo.hasExpiration': [
    { required: true, message: 'Please specify if the product has expiration date', trigger: 'change' }
  ],
  'generalInfo.shelfLife': [
    { 
      required: true, 
      message: 'Please enter shelf life', 
      trigger: 'change',
      validator: (rule: any, value: any, callback: any) => {
        if (form.value.generalInfo.hasExpiration && (!value || value < 1)) {
          callback(new Error('Please enter a valid shelf life'));
        } else {
          callback();
        }
      }
    }
  ],
  'generalInfo.expirationFormat': [
    { 
      required: true, 
      message: 'Please select expiration date format', 
      trigger: 'change',
      validator: (rule: any, value: any, callback: any) => {
        if (form.value.generalInfo.hasExpiration && !value) {
          callback(new Error('Please select expiration date format'));
        } else {
          callback();
        }
      }
    }
  ],
  'generalInfo.originCountry': [
    { required: true, message: 'Please select country of origin', trigger: 'change' }
  ],
  'generalInfo.attributes.occasion': [
    { required: true, message: 'Please select the occasion', trigger: 'change' }
  ],
  'generalInfo.attributes.type': [
    { required: true, message: 'Please select the product type', trigger: 'change' }
  ],
  'generalInfo.attributes.style': [
    { required: true, message: 'Please select the style', trigger: 'change' }
  ],
  'generalInfo.attributes.details': [
    { required: true, message: 'Please select the product details', trigger: 'change' }
  ],
  'generalInfo.attributes.material': [
    { required: true, message: 'Please select the material', trigger: 'change' }
  ]
};

// Country list for origin selection
const countries = [
  { code: 'CN', name: 'China' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'IN', name: 'India' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'SG', name: 'Singapore' }
];

const brands = [
  'Nike',
  'Adidas',
  'Puma',
  'Under Armour',
  'New Balance',
  'Reebok'
];

// 关键词建议
const keywordSuggestions = [
  'Fashion',
  'Casual',
  'Business',
  'Sport',
  'Outdoor',
  'Travel',
  'Luxury',
  'Classic',
  'Modern',
  'Trendy',
  'Vintage',
  'Elegant',
  'Comfortable',
  'Durable',
  'Waterproof',
  'Lightweight',
  'Premium',
  'Limited Edition',
  'Eco-friendly',
  'Handmade'
];

// 销售属性相关数据
const salesAttributes = ref<Array<{
  type: string;
  values: string[];
}>>([{
  type: '',
  values: ['']
}]);

// 预设属性选项
const attributeOptions = {
  color: [
    'Black', 'White', 'Beige', 'Khaki', 'Camel', 'Apricot',
    'Dark Gray', 'Gray', 'Light Gray', 'Silver', 'Red', 'Blue',
    'Green', 'Purple', 'Pink', 'Gold'
  ],
  size: [
    'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL',
    '34', '35', '36', '37', '38', '39', '40', '41', '42',
    'One Size'
  ],
  specification: [
    'Standard', 'Plus Size', 'Extended', 'Slim Fit', 'Loose Fit',
    'Single Pack', 'Double Pack', 'Triple Pack',
    '1.2m', '1.5m', '1.8m', '2.0m'
  ],
  capacity: [
    '32GB', '64GB', '128GB', '256GB', '512GB', '1TB',
    '2000mAh', '3000mAh', '4000mAh', '5000mAh',
    '1L', '2L', '3L', '5L', '10L'
  ],
  weight: [
    '0.5kg', '1kg', '2kg', '3kg', '5kg',
    '100g', '200g', '300g', '500g',
    '1lb', '2lb', '5lb'
  ],
  model: [
    'Basic', 'Standard', 'Pro', 'Plus', 'Max', 'Ultra',
    'Lite', 'Premium', 'Elite', 'Limited Edition'
  ],
  version: [
    'v1.0', 'v2.0', 'v3.0',
    '2023', '2024',
    'Gen 1', 'Gen 2', 'Gen 3',
    'Mark I', 'Mark II', 'Mark III'
  ],
  package: [
    'Retail Box', 'Bulk Pack', 'Gift Box',
    'Single Unit', 'Double Pack', 'Family Pack',
    'Travel Size', 'Sample Size'
  ],
  volume: [
    '30ml', '50ml', '100ml', '200ml', '500ml',
    '1000ml', '2000ml',
    '1L', '2L', '5L'
  ]
};



// 可选属性类型
const attributeTypeOptions = [
  { label: 'Color', value: 'color' },
  { label: 'Size', value: 'size' },
  { label: 'Specification', value: 'specification' },
  { label: 'Capacity', value: 'capacity' },
  { label: 'Weight', value: 'weight' },
  { label: 'Model', value: 'model' },
  { label: 'Version', value: 'version' },
  { label: 'Package', value: 'package' },
  { label: 'Volume', value: 'volume' }
];

// 获取可用的属性类型（排除已选择的类型）
const getAvailableAttributeTypes = (currentIndex: number) => {
  const usedTypes = salesAttributes.value
    .map(attr => attr.type)
    .filter((type, index) => index !== currentIndex && type !== '');
  return attributeTypeOptions.filter(option => !usedTypes.includes(option.value));
};

// 处理属性类型变化
const handleAttributeTypeChange = (attrIndex: number) => {
  const attr = salesAttributes.value[attrIndex];
  const currentType = attr.type;
  
  // 检查是否有重复的属性类型
  const duplicateType = salesAttributes.value.find((a, index) => 
    index !== attrIndex && a.type === currentType
  );

  if (duplicateType) {
    // 如果找到重复的属性类型，重置当前选择并提示错误
    attr.type = '';
    ElMessage.error(`Attribute type "${currentType}" has already been added`);
    return;
  }

  // 重置属性值
  attr.values = [''];
};

// 获取属性选项
const getAttributeOptions = (type: string) => {
  return attributeOptions[type as keyof typeof attributeOptions] || [];
};

// 获取可用的属性选项（排除已选择的值）
const getAvailableOptions = (type: string, currentValues: string[], currentIndex: number) => {
  const allOptions = attributeOptions[type as keyof typeof attributeOptions] || [];
  const usedValues = currentValues.filter((value, index) => index !== currentIndex && value !== '');
  return allOptions.filter(option => !usedValues.includes(option));
};

// 添加属性
const addAttribute = () => {
  if (salesAttributes.value.length >= 3) {
    ElMessage.warning('Maximum 3 sales attributes allowed');
    return;
  }
  salesAttributes.value.push({
    type: '',
    values: ['']  // Initialize with one value
  });
};

// 删除属性
const removeAttribute = (index: number) => {
  salesAttributes.value.splice(index, 1);
};

// 处理值变化
const handleValueChange = (attrIndex: number, valueIndex: number) => {
  const attr = salesAttributes.value[attrIndex];
  const currentValue = attr.values[valueIndex];
  
  // 如果值为空，直接返回
  if (!currentValue) return;

  // 检查是否有重复值
  const duplicateIndex = attr.values.findIndex((value, index) => 
    value === currentValue && index !== valueIndex
  );

  if (duplicateIndex !== -1) {
    // 如果找到重复值，清空当前输入并提示错误
    attr.values[valueIndex] = '';
    ElMessage.error(`Value "${currentValue}" already exists in this attribute`);
    return;
  }
  
  // 如果是最后一个值且未达到上限，添加一个新的空值
  if (valueIndex === attr.values.length - 1 && attr.values.length < 10) {
    attr.values.push('');
  }
};

// 删除属性值
const removeAttributeValue = (attrIndex: number, valueIndex: number) => {
  const attr = salesAttributes.value[attrIndex];
  
  // 如果只有一个值，不允许删除
  if (attr.values.length === 1) {
    ElMessage.warning('At least one value is required');
    return;
  }
  
  attr.values.splice(valueIndex, 1);
  
  // 如果删除后没有空值，并且未达到最大值限制，添加一个空值
  const hasEmptyValue = attr.values.some(v => !v);
  if (!hasEmptyValue && attr.values.length < 10) {
    attr.values.push('');
  }
};



// 图片上传相关
const validateImageUpload = (file: File) => {
  // 检查文件格式
  const acceptedTypes = ['image/jpeg', 'image/png'];
  if (!acceptedTypes.includes(file.type)) {
    ElMessage.error('只支持 JPG, JPEG 和 PNG 格式的图片');
    return false;
  }

  // 检查文件大小（最小 3MB）
  const minSize = 3 * 1024 * 1024; // 3MB in bytes
  if (file.size < minSize) {
    ElMessage.error('图片大小必须大于 3MB');
    return false;
  }

  // 检查图片尺寸
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      const { width, height } = img;
      
      // 检查分辨率（900x900 到 2200x2200）
      if (width < 900 || height < 900 || width > 2200 || height > 2200) {
        ElMessage.error('图片分辨率必须在 900x900 到 2200x2200 之间');
        reject();
        return;
      }

      // 检查宽高比（3:4 到 1:1）
      const ratio = width / height;
      if (ratio < 0.75 || ratio > 1) {
        ElMessage.error('图片宽高比必须在 3:4 到 1:1 之间');
        reject();
        return;
      }

      resolve(true);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject();
    };
  });
};

const validateSwatchUpload = (file: File) => {
  // 检查文件格式
  const acceptedTypes = ['image/jpeg', 'image/png'];
  if (!acceptedTypes.includes(file.type)) {
    ElMessage.error('只支持 JPG, JPEG 和 PNG 格式的图片');
    return false;
  }

  // 检查图片尺寸
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      const { width, height } = img;
      
      // 检查尺寸（建议 80x80）
      if (width !== 80 || height !== 80) {
        ElMessage.warning('建议使用 80x80 像素的图片作为色卡图');
      }

      resolve(true);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject();
    };
  });
};

// 变体相关方法
const handleSaveTemplate = () => {
  // TODO: 实现保存模板功能
  console.log('Save template');
};

const handleDeleteColor = () => {
  selectedColor.value = '';
  variantTitle.value = '';
};



const handleVariantAttributesChange = (values: VariantDimension[]) => {
  props.form.variantInfo.enabled = values.length > 0;
  props.form.variantInfo.dimensions = values;
  
  // 初始化选项
  if (!props.form.variantInfo.options) {
    props.form.variantInfo.options = {};
  }

  // 移除不再使用的维度选项
  Object.keys(props.form.variantInfo.options).forEach(key => {
    if (!values.includes(key as VariantDimension)) {
      delete props.form.variantInfo.options![key as VariantDimension];
    }
  });

  // 为新维度添加空选项数组
  values.forEach(dimension => {
    if (!props.form.variantInfo.options![dimension]) {
      props.form.variantInfo.options![dimension] = [];
    }
  });
};

  const generateSKC = (colorValue: string) => {
    const parentSku = props.form.generalInfo.parentSku || '';
    return `${parentSku}-${colorValue.toLowerCase().replace(/\s+/g, '')}`;
  };

  const generateSKU = (skc: string, size: string, specification: string) => {
    return `${skc}-${size.toLowerCase()}-${specification.toLowerCase().replace(/\s+/g, '')}`;
  };

const addColorVariant = () => {
  if (!props.form.variantInfo.options) {
    props.form.variantInfo.options = {};
  }
  if (!props.form.variantInfo.options['Color']) {
    props.form.variantInfo.options['Color'] = [];
  }
  props.form.variantInfo.options['Color'].push({
    value: '',
    displayName: '',
    image: ''
  });
};

const removeColorVariant = (index: number) => {
  props.form.variantInfo.options?.['Color']?.splice(index, 1);
};

const generateCombinations = (colorOption: VariantOption) => {
  const combinations: Array<{
    id: string;
    name: string;
    sku: string;
  }> = [];

  // 获取其他维度的所有选项
  const otherOptions = otherDimensions.value.map(dimension => ({
    dimension,
    options: props.form.variantInfo.options?.[dimension] || []
  }));

  // 如果没有其他维度，返回空数组
  if (otherOptions.length === 0) {
    return combinations;
  }

  // 生成所有可能的组合
  const generateHelper = (current: string[], dimensionIndex: number) => {
    if (dimensionIndex === otherOptions.length) {
      const name = [colorOption.value, ...current].join(' / ');
      const sku = `${generateSKC(colorOption.value)}-${current.join('-').toLowerCase().replace(/\s+/g, '-')}`;
      combinations.push({
        id: sku,
        name,
        sku
      });
      return;
    }

    const currentDimension = otherOptions[dimensionIndex];
    currentDimension.options.forEach(option => {
      generateHelper([...current, option.value], dimensionIndex + 1);
    });
  };

  generateHelper([], 0);
  return combinations;
};

const removeCombination = (colorIndex: number, combinationId: string) => {
  // TODO: 实现删除组合的功能
  console.log('Remove combination:', colorIndex, combinationId);
};

// 获取变体维度标签
const getDimensionLabel = (dimension: VariantDimension) => {
  const labels: Record<VariantDimension, string> = {
    'Color': '颜色',
    'Size': '尺寸',
    'Material': '材质',
    'Style': '款式'
  };
  return labels[dimension] || dimension;
};

// 获取输入框占位符
const getPlaceholder = (dimension: VariantDimension) => {
  const placeholders: Record<VariantDimension, string> = {
    'Color': '输入颜色值',
    'Size': '输入尺寸值',
    'Material': '输入材质值',
    'Style': '输入款式值'
  };
  return placeholders[dimension] || '输入值';
};

// 获取变体选项
const getVariantOptions = (dimension: VariantDimension) => {
  if (!props.form.variantInfo.options) {
    props.form.variantInfo.options = {};
  }
  if (!props.form.variantInfo.options[dimension]) {
    props.form.variantInfo.options[dimension] = [];
  }
  return props.form.variantInfo.options[dimension];
};

// 添加变体选项
const addVariantOption = (dimension: VariantDimension) => {
  if (!props.form.variantInfo.options) {
    props.form.variantInfo.options = {};
  }
  if (!props.form.variantInfo.options[dimension]) {
    props.form.variantInfo.options[dimension] = [];
  }
  props.form.variantInfo.options[dimension]?.push({
    value: '',
    displayName: ''
  });
};

// 删除变体选项
const removeVariantOption = (dimension: VariantDimension, index: number) => {
  props.form.variantInfo.options?.[dimension]?.splice(index, 1);
};

// 生成 SKU 列表
const generateSKUList = () => {
  try {
    const colorAttributes = salesAttributes.value.find(attr => attr.type === 'color');
    if (!colorAttributes) {
      skuList.value = [];
      return;
    }

    const validColors = colorAttributes.values.filter(color => color);
    const otherAttributes = salesAttributes.value
      .filter(attr => attr.type && attr.type !== 'color')
      .map(attr => ({
        type: attr.type,
        values: attr.values.filter(v => v)
      }));

    skuList.value = validColors.map(color => {
      const skc = generateSKC(color);
      let variants = [{}];

      // 按照属性顺序生成所有组合
      const validAttributes = otherAttributes.filter(attr => attr.values.length > 0);
      validAttributes.forEach(attr => {
        const newVariants: Record<string, string>[] = [];
        const validValues = attr.values.filter(v => v);
        validValues.forEach(value => {
          variants.forEach(variant => {
            newVariants.push({
              ...variant,
              [attr.type]: value
            });
          });
        });
        variants = newVariants;
      });

      // 对变体进行排序，确保按照属性层级顺序排序
      const sortedVariants = variants.sort((a, b) => {
        // 按照属性顺序逐个比较
        for (const attr of validAttributes) {
          const aValue = a[attr.type] || '';
          const bValue = b[attr.type] || '';
          const comparison = aValue.localeCompare(bValue);
          if (comparison !== 0) {
            return comparison;
          }
        }
        return 0;
      });

      return {
        color,
        skc,
        sizes: sortedVariants.map(variant => ({
          attributes: variant,
          weight: 0,
          weightUnit: batchValues.value.weightUnit,
          packageWeight: 0,
          packageWeightUnit: batchValues.value.weightUnit,
          packageDimensions: {
            length: 0,
            width: 0,
            height: 0,
            unit: batchValues.value.packageDimensions.unit
          },
          sellerSKU: generateSKU(skc, variant['size'] || '', variant['specification'] || ''),
          status: 'active' as const,
          price: 0,
          quantity: 0
        })),
        images: {
          main: '',
          additional: [],
          ad: '',
          swatch: ''
        }
      };
    });
  } catch (error) {
    console.error('Error generating SKU list:', error);
    skuList.value = [];
  }
};

// 批量应用设置
const applyBatchSettings = (skc?: string) => {
  const targetList = skc 
    ? skuList.value.filter(item => item.skc === skc)
    : skuList.value;

  targetList.forEach(item => {
    item.sizes.forEach(size => {
      if (batchValues.value.weight) {
        size.weight = Number(batchValues.value.weight);
        size.weightUnit = batchValues.value.weightUnit;
      }
      if (batchValues.value.packageWeight) {
        size.packageWeight = Number(batchValues.value.packageWeight);
        size.packageWeightUnit = batchValues.value.packageWeightUnit;
      }
      if (batchValues.value.packageDimensions.length) {
        size.packageDimensions = {
          length: Number(batchValues.value.packageDimensions.length),
          width: Number(batchValues.value.packageDimensions.width),
          height: Number(batchValues.value.packageDimensions.height),
          unit: batchValues.value.packageDimensions.unit
        };
      }
    });
  });
};

// 判断是否应该显示属性值
const shouldShowAttribute = (item: SKUData, sizeIndex: number, attrType: string) => {
  // 如果是第一行，总是显示
  if (sizeIndex === 0) return true;

  // 获取当前行和前一行的属性值
  const currentRow = item.sizes[sizeIndex];
  const previousRow = item.sizes[sizeIndex - 1];

  // 获取有效的属性列表（不包括颜色）
  const validAttrs = salesAttributes.value
    .filter(attr => attr.type && attr.type !== 'color' && attr.values.some(v => v));

  // 获取当前属性的索引
  const attrIndex = validAttrs.findIndex(attr => attr.type === attrType);

  // 对于第一个属性，检查值是否改变
  if (attrIndex === 0) {
    return currentRow.attributes[attrType] !== previousRow.attributes[attrType];
  }

  // 对于后续属性，检查当前属性或之前的属性是否有变化
  const previousAttrs = validAttrs.slice(0, attrIndex + 1);

  return previousAttrs.some(attr => 
    currentRow.attributes[attr.type] !== previousRow.attributes[attr.type]
  );
};

// 监听销售属性变化，更新 SKU 列表
watch(
  () => salesAttributes.value,
  (newVal) => {
    const hasColorAttribute = newVal.some(attr => attr.type === 'color' && attr.values.some(v => v));
    if (hasColorAttribute) {
      generateSKUList();
    } else {
      skuList.value = [];
    }
  },
  { deep: true }
);
</script>

<style lang="scss">
/* 
 * Basic Info Component Styles
 * -------------------------- 
 * 1. Base Layout
 * 2. Form Elements
 * 3. Section Components
 * 4. Dialog Styles
 */

/* 1. Base Layout */
.category-path {
  background-color: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 16px 24px;
  margin-bottom: 16px;

  .path-content {
    display: flex;
    align-items: center;
    gap: 12px;

    .path-text {
      color: var(--el-text-color-primary);
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 12px;

      .edit-link {
        font-size: 13px;
      }
    }
  }
}

.sku-list {
  margin-top: 32px;
  padding: 24px;
  background-color: var(--el-bg-color-overlay);
  border-radius: 8px;

  .sku-header {
    margin-bottom: 16px;

    .header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      h4 {
        font-size: 16px;
        font-weight: 500;
        margin: 0;
        color: var(--el-text-color-primary);
      }
    }
  }

  .warning-message {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 16px;
    background-color: var(--el-color-warning-light-9);
    border-radius: 4px;
    margin-bottom: 24px;

    .el-icon {
      color: var(--el-color-warning);
      font-size: 16px;
      margin-top: 2px;
    }

    span {
      color: var(--el-text-color-regular);
      font-size: 14px;
      line-height: 1.5;
    }
  }

  .sku-content {
    .header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;

      h4 {
        font-size: 16px;
        font-weight: 500;
        margin: 0;
        color: var(--el-text-color-primary);
      }

      .batch-actions {
        display: flex;
        align-items: center;
        gap: 12px;

        .el-select {
          width: 160px;
        }

        .el-button {
          height: 32px;
          padding: 0 16px;
        }
      }
    }

    .batch-operations {
      background-color: var(--el-bg-color-overlay);
      border-radius: 4px;
      margin-bottom: 16px;

      .batch-section {
        padding: 16px;

        .section-header {
          margin-bottom: 16px;

          h5 {
            font-size: 14px;
            font-weight: 500;
            color: var(--el-text-color-primary);
            margin: 0 0 8px 0;
          }

          .description {
            color: var(--el-text-color-secondary);
            font-size: 13px;
            line-height: 1.4;
          }
        }

        .filter-area {
          .filter-row,
          .fill-row {
            margin-bottom: 16px;

            .filter-label {
              font-size: 13px;
              color: var(--el-text-color-regular);
              margin-bottom: 8px;
            }

            .filter-content {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;

              .filter-select {
                width: 160px;
              }
            }

            .fill-content {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 16px;
              
              label {
                display: block;
                font-size: 13px;
                color: var(--el-text-color-secondary);
                margin-bottom: 8px;
              }

              .dimensions-group {
                .input-group {
                  display: flex;
                  align-items: center;
                  gap: 8px;

                  .el-input-number {
                    width: 60px;

                    :deep(.el-input__wrapper) {
                      padding: 0 8px;
                    }

                    :deep(.el-input__inner) {
                      text-align: center;
                    }
                  }

                  .multiply {
                    color: var(--el-text-color-regular);
                    padding: 0 2px;
                  }

                  .unit-select {
                    width: 70px;
                  }
                }
              }

              .weight-group {
                .input-group {
                  display: flex;
                  align-items: center;
                  gap: 8px;

                  .weight-input {
                    width: 100px;
                  }

                  .unit-select {
                    width: 70px;
                  }
                }
              }

              .status-group {
                .status-select {
                  width: 100%;
                }
              }
            }
          }

          .action-buttons {
            display: flex;
            gap: 12px;
            padding-top: 8px;

            .el-button {
              height: 32px;
              padding: 0 16px;
            }
          }
        }
      }
    }
  }
}

.basic-info {
  background-color: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;

  .section-divider {
    height: 1px;
    background-color: var(--el-border-color-lighter);
    margin: 32px 0;
  }
}

.section-header {
  margin-bottom: 24px;
  h3 {
    font-size: 18px;
    font-weight: 500;
    margin: 0;
  }
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .field-help {
    color: var(--el-text-color-secondary);
    font-size: 12px;
    line-height: 1.4;
  }
}

.required-icon {
  color: var(--el-color-danger);
  font-size: 14px;
}

.brand-section,
.barcode-section,
.hazardous-section,
.expiration-section {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .field-help {
    color: var(--el-text-color-secondary);
    font-size: 12px;
    line-height: 1.4;
  }

  .el-form-item {
    margin-bottom: 0;
  }

  .el-switch {
    margin-right: 8px;
  }

  .el-select,
  .el-input-number {
    margin-top: 8px;
  }
}

.attribute-label {
  .required-tag {
    background-color: var(--el-color-danger-light-9);
    color: var(--el-color-danger);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
  }

  .el-icon {
    color: var(--el-text-color-secondary);
    cursor: help;
  }
}

.country-code {
  color: var(--el-text-color-secondary);
  margin-left: 4px;
  font-size: 13px;
}

.country-code {
  float: right;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.product-attributes {
  margin-top: 32px;
  border-top: 1px solid var(--el-border-color-lighter);
  padding-top: 24px;

  .attributes-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    cursor: pointer;
    user-select: none;
    transition: all 0.3s;

    &:hover {
      background-color: var(--el-fill-color-light);
    }

    .left {
      h4 {
        font-size: 16px;
        font-weight: 500;
        margin: 0;
        color: var(--el-text-color-primary);
      }
    }

    .right {
      .el-icon {
        font-size: 16px;
        color: var(--el-text-color-secondary);
        transition: transform 0.3s;

        &.is-active {
          transform: rotate(-180deg);
        }
      }
    }
  }

  .attributes-content {
    transition: all 0.3s;
  }

  .attributes-grid {
    .el-row {
      margin-bottom: 20px;
    }
  }

  .attribute-label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;

    .required-tag {
      font-size: 12px;
      color: var(--el-color-danger);
      background-color: var(--el-color-danger-light-9);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .el-icon {
      color: var(--el-text-color-secondary);
      font-size: 14px;
      cursor: help;
    }
  }
}

.special-attribute {
  margin-bottom: 24px;
  padding-left: 180px;

  .attribute-header {
    margin-bottom: 8px;

    .label {
      font-size: 14px;
      color: var(--el-text-color-regular);
      margin-bottom: 4px;
    }

    .tip-text {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;

  .type-select {
    width: 300px;
  }

  .number-input {
    width: 120px;
  }

  .quantity-input {
    width: 160px;
  }

  .unit {
    color: var(--el-text-color-secondary);
    margin: 0 4px;
  }

  .add-button {
    border-radius: 4px;
  }
}

:deep(.el-form-item) {
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;

  &:last-child {
    margin-bottom: 0;
  }

  .el-form-item__label {
    line-height: 32px;
    font-weight: 500;
    color: var(--el-text-color-regular);
    background-color: var(--el-fill-color-light);
    padding: 0 16px;
    height: 32px;
    border-radius: 4px;
    margin-right: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .el-form-item__content {
    flex: 1;
    min-width: 0;
  }

  &.is-required .el-form-item__label:before {
    display: none;
  }
}

:deep(.el-input-number) {
  width: 120px;
}

.variations-section {
  margin-top: 32px;
  padding: 24px;
  background-color: var(--el-bg-color-overlay);
  border-radius: 8px;

  // 变体头部
  .variants-header {
    display: flex;
    align-items: center;
    gap: 32px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--el-border-color-lighter);

    .left {
      h3 {
        font-size: 16px;
        font-weight: 500;
        margin: 0;
        color: var(--el-text-color-primary);
        white-space: nowrap;
      }
    }

    .right {
      flex: 1;
      min-width: 0;
      
      .tips {
        display: flex;
        align-items: center;
        gap: 8px;

        .el-icon {
          color: var(--el-color-warning);
          font-size: 16px;
          flex-shrink: 0;
        }

        .tip-content {
          color: var(--el-text-color-regular);
          font-size: 13px;
          line-height: 1.5;

          p {
            margin: 0;
            
            &:not(:last-child) {
              margin-bottom: 4px;
            }
          }
        }
      }
    }
  }

  // 变体属性区域
  .variant-attributes {
    background-color: var(--el-fill-color-blank);
    padding: 16px 0;

    .attribute-section {
      margin-bottom: 24px;

      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;

        .section-label {
          font-size: 14px;
          color: var(--el-text-color-regular);
          display: flex;
          align-items: center;
          gap: 4px;

          .required {
            color: var(--el-color-danger);
          }
        }

        .add-attribute-btn {
          padding: 0;
          height: auto;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }

      .attribute-row {
        margin-bottom: 16px;
        
        &:last-child {
          margin-bottom: 0;
        }

        .attribute-type-select {
          width: 200px;
          margin-bottom: 8px;
        }

        .value-list {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 12px;
          margin-top: 8px;

          .value-item {
            display: flex;
            align-items: center;
            gap: 8px;

            .attribute-value-select {
              flex: 1;
              min-width: 0;
            }

            .delete-btn {
              padding: 0;
              height: auto;
              font-size: 14px;
              color: var(--el-text-color-primary);
              flex-shrink: 0;

              &:hover {
                color: var(--el-color-primary);
              }
            }
          }
        }
      }

      .add-attribute {
        margin-top: 16px;
        padding-left: 200px;

        .add-attribute-btn {
          padding: 0;
          height: auto;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }

    .add-variations {
      padding-left: 160px;
      margin-top: 16px;

      .el-button {
        padding: 0;
        height: auto;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }

  // 添加变体按钮
  .add-variations {
    padding: 16px 0;

    .el-button {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: 0;
      color: var(--el-color-primary);
    }
  }

      // SKU 列表
    .sku-list {
      margin-top: 24px;
      background-color: var(--el-bg-color-overlay);
      border-radius: 8px;
      padding: 24px;
      overflow-x: auto;

      .sku-header {
        margin-bottom: 24px;

        .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;

          h4 {
            font-size: 16px;
            font-weight: 500;
            margin: 0;
            color: var(--el-text-color-primary);
          }

          .batch-actions {
            display: flex;
            align-items: center;
            gap: 12px;

            .el-select {
              width: 120px;
            }

            .el-button {
              height: 32px;
              padding: 0 16px;
            }
          }
        }

        .batch-settings {
          background-color: var(--el-fill-color-light);
          border-radius: 4px;
          padding: 16px;

          .settings-form {
            .form-row {
              display: flex;
              align-items: flex-end;
              gap: 24px;
              justify-content: space-between;

              .form-item {
                flex: 1;
                min-width: 0;
                
                label {
                  display: block;
                  font-size: 13px;
                  color: var(--el-text-color-secondary);
                  margin-bottom: 8px;
                }

                .input-group {
                  display: flex;
                  align-items: center;
                  gap: 8px;

                  .el-input-number {
                    flex: 1;
                    min-width: 0;

                    :deep(.el-input__wrapper) {
                      padding: 0 12px;
                      height: 32px;
                      line-height: 32px;
                      box-shadow: 0 0 0 1px var(--el-border-color) inset;
                    }

                    :deep(.el-input-number__decrease),
                    :deep(.el-input-number__increase) {
                      display: none;
                    }
                  }

                  .unit-select {
                    width: 70px;

                    :deep(.el-input__wrapper) {
                      height: 32px;
                      line-height: 32px;
                      box-shadow: 0 0 0 1px var(--el-border-color) inset;
                    }
                  }
                }

                .dimensions-group {
                  display: flex;
                  align-items: center;
                  gap: 8px;

                  .el-input-number {
                    :deep(.el-input__wrapper) {
                      padding: 0 12px;
                      height: 36px;
                      line-height: 36px;
                    }

                    :deep(.el-input-number__decrease),
                    :deep(.el-input-number__increase) {
                      display: none;
                    }
                  }

                  .separator {
                    color: var(--el-text-color-secondary);
                    text-align: center;
                    font-size: 14px;
                  }

                  .unit-select {
                    width: 80px;

                    :deep(.el-input__wrapper) {
                      height: 36px;
                      line-height: 36px;
                    }
                  }
                }
              }

              .el-button {
                height: 36px;
                padding: 0 24px;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 500;
              }
            }
          }
        }
      }

      .sku-table {
        width: 100%;
        min-width: 1000px;
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 4px;
        border-spacing: 0;
        border-collapse: collapse;
        overflow-x: auto;

                              .table-header {
              display: grid;
              grid-template-columns: repeat(3, minmax(120px, 1fr)) minmax(150px, 1.2fr) minmax(180px, 1.5fr) minmax(150px, 1.2fr) minmax(200px, 1.5fr) minmax(200px, 1.5fr) minmax(100px, 0.8fr) 80px;
              gap: 0;
              background-color: #1d1e1f;
          font-size: 13px;
          color: var(--el-text-color-regular);
          font-weight: normal;
          text-transform: lowercase;

          > div {
            padding: 8px 12px;
            border-right: 1px solid var(--el-border-color-lighter);
            border-bottom: 1px solid var(--el-border-color-lighter);
            display: flex;
            align-items: center;
            justify-content: flex-start;
            text-align: left;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            &:last-child {
              border-right: none;
            }

            .el-icon {
              margin-left: 4px;
              font-size: 14px;
              color: var(--el-text-color-secondary);
            }
          }
        }

        .table-body {
                      .table-row {
            display: grid;
            grid-template-columns: repeat(3, minmax(120px, 1fr)) minmax(150px, 1.2fr) minmax(180px, 1.5fr) minmax(150px, 1.2fr) minmax(100px, 0.8fr) 80px;
            gap: 0;
            align-items: stretch;
            transition: background-color 0.3s;
            background-color: var(--el-bg-color-overlay);

            &:hover {
              background-color: var(--el-fill-color-light);
            }

            &:last-child {
              border-bottom: none;
            }

            .col-color {
              grid-column: 1;
              padding: 8px 12px;
              border-right: 1px solid var(--el-border-color-lighter);
              border-bottom: 1px solid var(--el-border-color-lighter);
              background-color: transparent;

              &.is-parent {
                background-color: var(--el-fill-color-light);
              }

              .color-info {
                .color-name {
                  font-size: 14px;
                  font-weight: 500;
                  color: var(--el-text-color-primary);
                  margin-bottom: 4px;
                }

                .color-skc {
                  font-size: 13px;
                  color: var(--el-text-color-secondary);
                }
              }
            }

            .col-size,
            .col-specification {
              padding: 8px 12px;
              border-right: 1px solid var(--el-border-color-lighter);
              border-bottom: 1px solid var(--el-border-color-lighter);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              color: var(--el-text-color-primary);
            }

            .col-attr,
            .col-attr-placeholder {
              grid-column: auto;
              border-right: 1px solid var(--el-border-color-lighter);
              border-bottom: 1px solid var(--el-border-color-lighter);
              padding: 8px 12px;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .col-attr {
              font-size: 14px;
              color: var(--el-text-color-primary);
            }

            .col-attr-placeholder {
              display: none;
              border: none;
            }

            .col-weight {
              grid-column: auto;
            }

            .col-weight-package {
              grid-column: auto;
            }

            .col-dimensions {
              grid-column: auto;
            }

            .col-sku {
              grid-column: auto;
            }

            .col-status {
              grid-column: auto;
            }

            .col-action {
              grid-column: auto;
            }

            .col-color,
            .col-weight,
            .col-weight-package,
            .col-dimensions,
            .col-sku,
            .col-status,
            .col-action {
              padding: 12px;
              border-right: 1px solid var(--el-border-color);
              border-bottom: 1px solid var(--el-border-color);
            }

            .col-attr {
              padding: 12px;
              border-right: 1px solid var(--el-border-color);
              border-bottom: 1px solid var(--el-border-color);

              &.is-merged {
                border-top: none;
                background-color: transparent;
              }

              .attr-value {
                font-size: 14px;
                color: var(--el-text-color-primary);
                margin-bottom: 4px;
              }

              .attr-skc {
                font-size: 13px;
                color: var(--el-text-color-secondary);
              }
            }

            .col-weight {
              .weight-value {
                font-size: 14px;
                color: var(--el-text-color-regular);
                text-align: center;
              }
            }

            .col-weight-package {
              display: flex;
              align-items: center;
              gap: 8px;

              .weight-input {
                width: 100px;

                :deep(.el-input__wrapper) {
                  background-color: var(--el-bg-color-overlay);
                  border-radius: 4px;
                  height: 32px;
                  line-height: 32px;
                  box-shadow: 0 0 0 1px var(--el-border-color) inset;
                  padding: 0 30px 0 12px;
                }

                :deep(.el-input-number__decrease),
                :deep(.el-input-number__increase) {
                  width: 28px;
                  height: 16px;
                  line-height: 16px;
                  background-color: transparent;
                  border: none;
                  color: var(--el-text-color-regular);

                  &:hover {
                    color: var(--el-color-primary);
                  }
                }
              }

              .unit-select {
                width: 70px;

                :deep(.el-input__wrapper) {
                  background-color: var(--el-bg-color-overlay);
                  border-radius: 4px;
                  height: 32px;
                  line-height: 32px;
                  box-shadow: 0 0 0 1px var(--el-border-color) inset;
                  padding: 0 24px 0 8px;
                }

                :deep(.el-select__caret) {
                  color: var(--el-text-color-regular);
                  right: 8px;
                }

                :deep(.el-input__inner) {
                  font-size: 14px;
                }

                :deep(.el-select__popper) {
                  background-color: var(--el-bg-color-overlay);
                  border: 1px solid var(--el-border-color);
                  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                }

                :deep(.el-select-dropdown__item) {
                  color: var(--el-text-color-regular);
                  font-size: 14px;
                  height: 34px;
                  line-height: 34px;
                  padding: 0 12px;

                  &.selected {
                    color: var(--el-color-primary);
                    font-weight: bold;
                    background-color: var(--el-color-primary-light-9);
                  }

                  &:hover {
                    background-color: var(--el-fill-color-light);
                  }
                }
              }
            }

            .col-dimensions {
              display: flex;
              align-items: center;
              gap: 8px;

              .dimensions-group {
                display: flex;
                align-items: center;
                gap: 4px;
                flex: 1;

                .dimension-item {
                  position: relative;
                  width: 60px;

                  .dimension-input {
                    width: 100%;

                    :deep(.el-input__wrapper) {
                      background-color: var(--el-bg-color-overlay);
                      border-radius: 4px;
                      height: 32px;
                      line-height: 32px;
                      box-shadow: 0 0 0 1px var(--el-border-color) inset;
                      padding: 0 8px;
                    }

                    :deep(.el-input__inner) {
                      text-align: center;
                      padding: 0;
                    }

                    :deep(.el-input-number__decrease),
                    :deep(.el-input-number__increase) {
                      display: none;
                    }
                  }
                }

                .separator {
                  color: var(--el-text-color-regular);
                  font-size: 14px;
                  padding: 0 2px;
                }
              }

              .unit-select {
                width: 70px;

                :deep(.el-input__wrapper) {
                  background-color: var(--el-bg-color-overlay);
                  border-radius: 4px;
                  height: 32px;
                  line-height: 32px;
                  box-shadow: 0 0 0 1px var(--el-border-color) inset;
                  padding: 0 24px 0 8px;
                }

                :deep(.el-select__caret) {
                  color: var(--el-text-color-regular);
                  right: 8px;
                }

                :deep(.el-input__inner) {
                  font-size: 14px;
                }

                :deep(.el-select__popper) {
                  background-color: var(--el-bg-color-overlay);
                  border: 1px solid var(--el-border-color);
                  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                }

                :deep(.el-select-dropdown__item) {
                  color: var(--el-text-color-regular);
                  font-size: 14px;
                  height: 34px;
                  line-height: 34px;
                  padding: 0 12px;

                  &.selected {
                    color: var(--el-color-primary);
                    font-weight: bold;
                    background-color: var(--el-color-primary-light-9);
                  }

                  &:hover {
                    background-color: var(--el-fill-color-light);
                  }
                }
              }
            }

            .col-sku {
              .sku-value {
                font-size: 14px;
                color: var(--el-text-color-regular);
              }
            }

            .col-price,
            .col-inventory {
              padding: 12px;
              border-right: 1px solid var(--el-border-color);
              border-bottom: 1px solid var(--el-border-color);
              display: flex;
              align-items: center;
              justify-content: center;

              .price-input,
              .inventory-input {
                width: 100%;

                :deep(.el-input__wrapper) {
                  padding: 0 8px;
                }

                :deep(.el-input__inner) {
                  text-align: right;
                }
              }
            }

            .col-status {
              display: flex;
              align-items: center;
              gap: 8px;

              .status-tag {
                color: var(--el-color-success);
                font-size: 14px;
              }

              .status-select {
                width: 120px;

                :deep(.el-input__wrapper) {
                  background-color: var(--el-bg-color-overlay);
                  border-radius: 4px;
                  height: 32px;
                  line-height: 32px;
                  box-shadow: 0 0 0 1px var(--el-border-color) inset;
                  padding: 0 24px 0 8px;
                }

                :deep(.el-select__caret) {
                  color: var(--el-text-color-regular);
                  right: 8px;
                }

                :deep(.el-input__inner) {
                  font-size: 14px;
                }

                :deep(.el-select__popper) {
                  background-color: var(--el-bg-color-overlay);
                  border: 1px solid var(--el-border-color);
                  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                }

                :deep(.el-select-dropdown__item) {
                  color: var(--el-text-color-regular);
                  font-size: 14px;
                  height: 34px;
                  line-height: 34px;
                  padding: 0 12px;

                  &.selected {
                    color: var(--el-color-primary);
                    font-weight: bold;
                    background-color: var(--el-color-primary-light-9);
                  }

                  &:hover {
                    background-color: var(--el-fill-color-light);
                  }
                }
              }
            }

            .col-action {
              display: flex;
              align-items: center;
              justify-content: center;

              .delete-btn {
                padding: 0;
                height: auto;
                font-size: 14px;
                color: var(--el-color-danger);

                &:hover {
                  opacity: 0.8;
                }
              }
            }

            .col-action {
              text-align: center;

              .el-button {
                padding: 0;
                height: auto;
                font-size: 14px;
                color: var(--el-color-danger);

                &:hover {
                  opacity: 0.8;
                }
              }
            }
          }
        }
      }
    }

    // 产品图片
    .product-images {
    margin-top: 24px;

    // 区域标题
    .section-header {
      margin-bottom: 16px;

      h4 {
        font-size: 16px;
        font-weight: 500;
        margin: 0;
        color: var(--el-text-color-primary);
      }
    }

    // 图片提示
    .image-tips {
      margin-bottom: 24px;
      padding: 16px;
      background-color: var(--el-fill-color-lighter);
      border-radius: 4px;
      display: flex;
      gap: 8px;

      .el-icon {
        color: var(--el-color-warning);
        font-size: 16px;
        margin-top: 3px;
      }

      ol {
        margin: 0;
        padding-left: 20px;
        color: var(--el-text-color-regular);
        font-size: 14px;

        li {
          margin-bottom: 8px;

          &:last-child {
            margin-bottom: 0;
          }

          &.required-tip {
            color: var(--el-color-danger);
            display: flex;
            align-items: center;
            gap: 4px;

            &:before {
              content: '*';
              margin-right: 4px;
            }
          }
        }
      }
    }

    // 图片表格
    .image-table {
      border: 1px solid var(--el-border-color-lighter);
      border-radius: 4px;

      // 表头
      .table-header {
        display: grid;
        grid-template-columns: 180px minmax(280px, 320px) minmax(400px, 1fr) 120px 100px;
        gap: 24px;
        padding: 12px 24px;
        background-color: var(--el-fill-color-light);
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        font-size: 14px;
        color: var(--el-text-color-regular);
        border-bottom: 1px solid var(--el-border-color-lighter);

        .col-all,
        .col-swatch {
          display: flex;
          align-items: center;
          gap: 4px;

          .el-icon {
            color: var(--el-text-color-secondary);
            font-size: 14px;
            cursor: help;
          }
        }
      }

      // 表格内容
      .table-body {
        .table-row {
          display: grid;
          grid-template-columns: 180px minmax(280px, 320px) minmax(400px, 1fr) 120px 100px;
          gap: 24px;
          padding: 24px;

          // 颜色列
          .col-color {
            .color-name {
              font-size: 14px;
              font-weight: 500;
              margin-bottom: 8px;
            }

            .color-skc {
              font-size: 13px;
              color: var(--el-text-color-secondary);
            }
          }

          // 变体名称列
          .col-name {
            .el-input {
              width: 100%;

              :deep(.el-input__inner) {
                font-size: 14px;
              }
            }
          }

          // 图片列
          .col-images {
            .image-grid {
              display: grid;
              grid-template-columns: repeat(6, 1fr);
              gap: 8px;

              .image-slot {
                .image-label {
                  font-size: 13px;
                  color: var(--el-text-color-regular);
                  margin-bottom: 6px;
                  display: flex;
                  align-items: center;
                  gap: 4px;

                  .el-icon {
                    color: var(--el-text-color-secondary);
                    font-size: 14px;
                    cursor: help;
                  }

                  &:before {
                    content: '*';
                    color: var(--el-color-danger);
                    margin-right: 4px;
                    display: none;
                  }
                }

                &:first-child .image-label:before {
                  display: inline;
                }

                .upload-area {
                  height: 80px;
                  border: 1px dashed var(--el-border-color);
                  border-radius: 4px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  background-color: var(--el-fill-color-blank);
                  transition: all 0.3s;

                  .el-icon {
                    font-size: 24px;
                    color: var(--el-text-color-secondary);
                  }

                  .upload-text {
                    font-size: 13px;
                    color: var(--el-text-color-secondary);
                    margin-top: 4px;
                  }

                  &.square {
                    width: 92px;
                    height: 92px;
                  }
                }

                .uploader {
                  display: flex;
                  justify-content: center;
                  
                  .upload-area {
                    cursor: pointer;

                    &:hover {
                      border-color: var(--el-color-primary);
                      background-color: var(--el-fill-color-light);
                    }
                  }
                }
              }
            }
          }

          // All Image 和 Color Swatch 列
          .col-all,
          .col-swatch {
            display: flex;
            align-items: center;
            justify-content: center;

            .uploader {
              .upload-area {
                width: 92px;
                height: 92px;
                border: 1px dashed var(--el-border-color);
                border-radius: 4px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s;
                background-color: var(--el-fill-color-blank);

                &:hover {
                  border-color: var(--el-color-primary);
                  background-color: var(--el-fill-color-light);
                }

                &.circle {
                  border-radius: 50%;
                  width: 80px;
                  height: 80px;
                }

                .el-icon {
                  font-size: 24px;
                  color: var(--el-text-color-secondary);
                  margin-bottom: 4px;
                }

                .upload-text {
                  font-size: 13px;
                  color: var(--el-text-color-secondary);
                }
              }
            }
          }
        }
      }
    }
  }
}

.size-chart-section {
  margin-top: 32px;
  padding: 24px;
  background-color: var(--el-bg-color-overlay);
  border-radius: 8px;

  .subsection-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;

    h4 {
      font-size: 16px;
      font-weight: 500;
      margin: 0;
      color: var(--el-text-color-primary);
    }

    .el-icon {
      color: var(--el-color-info);
      font-size: 14px;
      cursor: help;
    }
  }

  .additional-images {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid var(--el-border-color-lighter);

    .image-upload-grid {
      margin-top: 16px;

      :deep(.el-upload--picture-card) {
        --el-upload-picture-card-size: 140px;
        border-radius: 8px;
        border: 1px dashed var(--el-border-color);
        background-color: var(--el-fill-color-blank);
        transition: all 0.3s;

        &:hover {
          border-color: var(--el-color-primary);
          background-color: var(--el-fill-color-light);
        }
      }

      :deep(.el-upload-list--picture-card) {
        --el-upload-list-picture-card-size: 140px;
        display: grid;
        grid-template-columns: repeat(auto-fill, 140px);
        gap: 12px;
        margin: 0;

        .el-upload-list__item {
          border-radius: 8px;
          padding: 0;
          border: none;

          &:hover {
            .image-actions {
              opacity: 1;
            }
          }
        }
      }

      .upload-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        height: 100%;
        color: var(--el-text-color-secondary);

        .el-icon {
          font-size: 24px;
        }

        span {
          font-size: 13px;
        }
      }

      .image-card {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 8px;
        overflow: hidden;

        .image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-actions {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.5);
          opacity: 0;
          transition: opacity 0.3s;

          .el-button {
            --el-button-size: 32px;
            --el-button-bg-color: transparent;
            --el-button-border-color: #fff;
            --el-button-hover-bg-color: var(--el-color-danger);
            --el-button-hover-border-color: var(--el-color-danger);
            
            .el-icon {
              color: #fff;
            }
          }
        }
      }

      .table-header {
        display: grid;
        grid-template-columns: 180px 180px 1fr 100px;
        gap: 12px;
        padding: 12px 16px;
        background-color: var(--el-fill-color-light);
        font-size: 13px;
        color: var(--el-text-color-regular);
        border-bottom: 1px solid var(--el-border-color-lighter);
        font-weight: 500;
      }

      .table-body {
        .table-row {
          display: grid;
          grid-template-columns: 180px 180px 1fr 100px;
          gap: 12px;
          padding: 16px;
          align-items: center;
          border-bottom: 1px solid var(--el-border-color-lighter);
          transition: background-color 0.3s;

          &:hover {
            background-color: var(--el-fill-color-light);
          }

          &:last-child {
            border-bottom: none;
          }

          .col-color {
            .color-name {
              font-size: 14px;
              font-weight: 500;
              color: var(--el-text-color-primary);
              margin-bottom: 4px;
            }
            .color-skc {
              font-size: 12px;
              color: var(--el-text-color-secondary);
            }
          }

          .col-region {
            :deep(.el-select) {
              width: 100%;

              .el-input__wrapper {
                box-shadow: none;
                border: 1px solid var(--el-border-color);
                border-radius: 4px;

                &:hover {
                  border-color: var(--el-border-color-darker);
                }

                &.is-focus {
                  border-color: var(--el-color-primary);
                }
              }
            }
          }

          .col-images {
            .image-uploader {
              width: 100%;
            }

            .upload-area {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              height: 72px;
              border: 1px dashed var(--el-border-color);
              border-radius: 4px;
              cursor: pointer;
              transition: all 0.3s;
              background-color: var(--el-fill-color-blank);

              &:hover {
                border-color: var(--el-color-primary);
                color: var(--el-color-primary);
                background-color: var(--el-fill-color-light);
              }

              .el-icon {
                font-size: 18px;
              }

              span {
                font-size: 13px;
                color: var(--el-text-color-regular);
              }
            }
          }

          .col-action {
            display: flex;
            gap: 12px;
            justify-content: center;

            .el-button {
              padding: 0;
              height: auto;
              font-size: 13px;

              &.el-button--danger {
                margin-left: 0;
              }
            }
          }
        }
      }
    }
  }

  .video-section {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid var(--el-border-color-lighter);

    .video-upload-area {
      .video-uploader {
        margin-bottom: 16px;
      }

      .upload-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        height: 180px;
        border: 1px dashed var(--el-border-color);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;
        background-color: var(--el-fill-color-blank);

        &:hover {
          border-color: var(--el-color-primary);
          color: var(--el-color-primary);
          background-color: var(--el-fill-color-light);
        }

        .el-icon {
          font-size: 36px;
          color: var(--el-text-color-secondary);
        }

        span {
          font-size: 14px;
          color: var(--el-text-color-regular);
        }
      }

      .upload-tips {
        background-color: var(--el-fill-color-light);
        border-radius: 8px;
        padding: 16px 20px;

        ol {
          margin: 0;
          padding-left: 20px;
          
          li {
            color: var(--el-text-color-regular);
            font-size: 13px;
            line-height: 1.6;
            margin-bottom: 8px;
            position: relative;

            &:last-child {
              margin-bottom: 0;
            }

            &::marker {
              color: var(--el-text-color-secondary);
            }
          }
        }
      }
    }
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title-group {
      display: flex;
      align-items: center;
      gap: 16px;

      h3 {
        font-size: 16px;
        font-weight: 500;
        margin: 0;
        color: var(--el-text-color-primary);
      }
    }
  }
}

.size-chart-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
  }
}

.size-chart-editor {
  .axis-selection {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;

    .required {
      color: var(--el-color-danger);
      margin-right: -8px;
    }

    .label {
      color: var(--el-text-color-regular);
      font-size: 14px;
    }

    .axis-select {
      width: 200px;
    }

    .help-link {
      margin-left: auto;
      font-size: 14px;
    }
  }

  .value-input-section {
    background-color: var(--el-fill-color-light);
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 24px;

    .input-row {
      display: flex;
      align-items: center;
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        width: 160px;
        color: var(--el-text-color-regular);
        font-size: 14px;
      }

      .inputs {
        flex: 1;
        display: flex;
        gap: 12px;

        .el-input {
          width: 120px;

          :deep(.el-input__wrapper) {
            padding: 0 8px;
          }

          :deep(.el-input__inner) {
            text-align: center;
          }
        }
      }
    }

    .actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--el-border-color-lighter);

      .el-button {
        min-width: 80px;
      }
    }
  }

  .el-table {
    :deep(.el-input__wrapper) {
      padding: 0 8px;
    }

    :deep(.el-input__inner) {
      text-align: center;
    }

    :deep(.cell) {
      padding: 8px;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;

  .el-button {
    min-width: 90px;
  }
}

/* End of Styles */

/* 4. Dialog Styles */
.size-chart-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
  }
}

.size-chart-editor {
  .axis-selection {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;

    .required {
      color: var(--el-color-danger);
      margin-right: -8px;
    }

    .label {
      color: var(--el-text-color-regular);
      font-size: 14px;
    }

    .axis-select {
      width: 200px;
    }

    .help-link {
      margin-left: auto;
      font-size: 14px;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;

  .el-button {
    min-width: 90px;
  }
}

/* 5. Product Images Section */
.product-images-section {
  margin-top: 24px;
  padding: 24px;
  background-color: var(--el-bg-color-overlay);
  border-radius: 8px;

  .section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 24px;
    padding: 16px;
    background-color: var(--el-fill-color-light);
    border-radius: 4px;

    .el-icon {
      color: var(--el-color-warning);
      font-size: 16px;
    }

    span {
      color: var(--el-text-color-regular);
      font-size: 14px;
    }
  }

  .color-row {
    margin-bottom: 24px;

    .color-info {
      display: grid;
      grid-template-columns: 120px 1fr repeat(3, 120px);
      gap: 16px;
      padding: 12px 16px;
      background-color: var(--el-fill-color-light);
      border-radius: 4px;
      font-size: 14px;
      color: var(--el-text-color-regular);
    }

    .color-content {
      padding: 16px;
      border: 1px solid var(--el-border-color);
      border-radius: 4px;
      margin-top: 12px;

      .color-value {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 8px;
      }

      .skc {
        color: var(--el-text-color-secondary);
        font-size: 14px;
        margin-bottom: 16px;
      }

      .name-input {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;

        .el-input {
          width: 400px;
        }
      }

      .image-uploads {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 16px;

        .image-label {
          margin-bottom: 8px;
          font-size: 14px;
          color: var(--el-text-color-regular);

          &.required {
            color: var(--el-color-danger);
          }
        }

        .uploader {
          .upload-area {
            width: 100%;
            height: 120px;
            border: 1px dashed var(--el-border-color);
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              border-color: var(--el-color-primary);
            }

            &.small {
              width: 80px;
              height: 80px;
            }

            .el-icon {
              font-size: 24px;
              color: var(--el-text-color-secondary);
              margin-bottom: 4px;
            }

            .upload-text {
              font-size: 12px;
              color: var(--el-text-color-secondary);
            }
          }
        }
      }
    }
  }

  .image-requirements {
    color: var(--el-text-color-secondary);
    font-size: 13px;
    padding: 16px;
    background-color: var(--el-fill-color-light);
    border-radius: 4px;

    ol {
      margin: 0;
      padding-left: 20px;

      li {
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>