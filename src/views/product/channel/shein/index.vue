<template>
  <div class="shein-product-list">
    <!-- 1. 页面标题 -->
    <div class="page-title-section">
      <h1 class="page-title">Shein Product List</h1>
    </div>

    <!-- 主要标签页 -->
    <el-tabs v-model="activeTab" class="main-tabs" @tab-change="handleTabChange">
      <el-tab-pane label="Published Products" name="published">
        <template #label>
          <span class="tab-label">
            <el-icon><Document /></el-icon>
            Published Products
          </span>
        </template>
        
        <!-- Published Products 内容 -->
        <div class="tab-content">
          <!-- Search Area -->
          <div class="search-section">
            <el-card shadow="never" class="search-card">
              <div class="search-content">
                <div class="search-filters-compact">
                  <!-- Primary Search Row -->
                  <div class="search-row primary-search">
                    <div class="search-item search-item-large">
                      <label class="search-label">Product Name</label>
                      <el-input
                        v-model="searchProductName"
                        placeholder="Enter product name"
                        clearable
                        size="default"
                        :prefix-icon="Search"
                        @input="handleSearch"
                        @clear="handleSearch"
                      />
                    </div>
                    
                    <div class="search-item">
                      <label class="search-label">Seller SKU</label>
                      <el-input
                        v-model="searchSKU"
                        placeholder="Enter seller SKU"
                        clearable
                        size="default"
                        @input="handleSearch"
                        @clear="handleSearch"
                      />
                    </div>
                    
                    <div class="search-item">
                      <label class="search-label">Parent SKU</label>
                      <el-input
                        v-model="searchSellerParentSku"
                        placeholder="Enter parent SKU"
                        clearable
                        size="default"
                        @input="handleSearch"
                        @clear="handleSearch"
                      />
                    </div>
                  </div>

                  <!-- Secondary Search Row -->
                  <div class="search-row">
                    <div class="search-item">
                      <label class="search-label">SKC</label>
                      <el-input
                        v-model="searchSKC"
                        placeholder="Enter SKC"
                        clearable
                        size="default"
                        @input="handleSearch"
                        @clear="handleSearch"
                      />
                    </div>
                    
                    <div class="search-item">
                      <label class="search-label">Brand</label>
                      <el-select
                        v-model="filterBrand"
                        placeholder="Select brand"
                        clearable
                        size="default"
                        @change="handleSearch"
                      >
                        <el-option label="SHEIN" value="SHEIN" />
                        <el-option label="ROMWE" value="ROMWE" />
                        <el-option label="MOTF" value="MOTF" />
                      </el-select>
                    </div>
                    
                    <div class="search-item">
                      <label class="search-label">Category</label>
                      <el-select
                        v-model="filterCategory"
                        placeholder="Select category"
                        clearable
                        size="default"
                        @change="handleSearch"
                      >
                        <el-option label="Clothing" value="clothing" />
                        <el-option label="Accessories" value="accessories" />
                        <el-option label="Shoes" value="shoes" />
                        <el-option label="Bags" value="bags" />
                        <el-option label="Beauty" value="beauty" />
                      </el-select>
                    </div>
                    </div>
                    
                  <!-- Date Filters Row -->
                  <div class="search-row">
                    <div class="search-item">
                      <label class="search-label">Date Created</label>
                      <el-date-picker
                        v-model="dateCreatedRange"
                        type="daterange"
                        range-separator="to"
                        start-placeholder="Start date"
                        end-placeholder="End date"
                        size="default"
                        @change="handleSearch"
                      />
                  </div>

                    <div class="search-item">
                      <label class="search-label">Date Listed</label>
                      <el-date-picker
                        v-model="dateListedRange"
                        type="daterange"
                        range-separator="to"
                        start-placeholder="Start date"
                        end-placeholder="End date"
                        size="default"
                        @change="handleSearch"
                      />
                    </div>
                    
                    <div class="search-item">
                      <label class="search-label">Date Added</label>
                      <el-date-picker
                        v-model="dateAddedRange"
                        type="daterange"
                        range-separator="to"
                        start-placeholder="Start date"
                        end-placeholder="End date"
                        size="default"
                        @change="handleSearch"
                        />
                      </div>
                    </div>
                    
                  <!-- Action Buttons -->
                  <div class="search-actions">
                    <div class="search-actions-left">
                      <el-button size="default" plain @click="handleResetFilters" :icon="Refresh">
                        Reset
                      </el-button>
                      </div>
                    <div class="search-actions-right">
                      <el-button size="default" type="primary" @click="handleSearch" :icon="Search">
                        Search
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>

          <!-- Operations Area -->
          <div class="operations-section">
              <div class="operations-content">
              <!-- Main Actions -->
              <div class="main-actions">
                <div class="left-actions">
                  <!-- Status Tabs -->
                  <div class="status-tabs">
                    <el-tag 
                      v-for="status in statusTabs" 
                      :key="status.key"
                      :type="status.key === activeStatusTab ? (status.type || 'primary') : ''"
                      :effect="status.key === activeStatusTab ? 'dark' : 'light'"
                      class="status-tab"
                      :class="{ 
                        'active': status.key === activeStatusTab,
                        'status-tab-all': status.key === 'all'
                      }"
                      @click="handleStatusTabChange(status.key)"
                    >
                      {{ status.label }} 
                      <span class="status-count" :class="{ 'active': status.key === activeStatusTab }">
                        ({{ status.count }})
                      </span>
                    </el-tag>
                  </div>
                </div>

                  <div class="right-actions">
                    <!-- 统计数据 -->
                    <div class="stats-section">
                      <div class="stat-item">
                        <div class="stat-content">
                          <span class="stat-label">Total Products</span>
                          <el-tooltip content="Total number of products that can be published" placement="top">
                            <div class="stat-value-wrapper">
                              <span class="stat-value">{{ totalProducts }}</span>
                              <el-icon class="info-icon"><InfoFilled /></el-icon>
                            </div>
                          </el-tooltip>
                        </div>
                      </div>
                      <div class="stat-item">
                        <div class="stat-content">
                          <span class="stat-label">Published</span>
                          <span class="stat-value published">{{ publishedProducts }}</span>
                        </div>
                      </div>
                      <div class="stat-item">
                        <div class="stat-content">
                          <span class="stat-label">Remaining</span>
                          <span class="stat-value remaining">{{ remainingProducts }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Basic Actions -->
                    <div class="action-group primary-actions">
                      <!-- Selection Counter -->
                      <div v-if="selectedItems.length > 0" class="selection-indicator">
                        <span class="selection-count">{{ selectedItems.length }} selected</span>
                  </div>

                      <!-- Bulk Actions Dropdown -->
                      <el-dropdown 
                        trigger="click"
                        :disabled="!selectedItems.length"
                        @command="handleBulkOperation"
                      >
                        <el-button 
                          type="primary"
                          class="action-button"
                          :class="{ 'can-action': selectedItems.length > 0 }"
                          :disabled="!selectedItems.length"
                        >
                          <el-icon><Edit /></el-icon>
                          Bulk Actions
                          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                    </el-button>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <!-- Listing Operations Group -->
                            <el-dropdown-item-group>
                              <template #title>Listing Status</template>
                              <el-dropdown-item command="publish">
                                <el-icon><Top /></el-icon>
                                List Products
                              </el-dropdown-item>
                              <el-dropdown-item command="unpublish">
                                <el-icon><Bottom /></el-icon>
                                Delist Products
                              </el-dropdown-item>
                            </el-dropdown-item-group>

                            <!-- Product Settings Group -->
                            <el-dropdown-item-group>
                              <template #title>Product Settings</template>
                              <el-dropdown-item command="setCategory">
                                <el-icon><FolderOpened /></el-icon>
                                Set Category
                              </el-dropdown-item>
                              <el-dropdown-item command="setPrice">
                                <el-icon><Money /></el-icon>
                                Set Regular Price
                              </el-dropdown-item>
                              <el-dropdown-item command="setSalePrice">
                                <el-icon><Discount /></el-icon>
                                Set Sale Price
                              </el-dropdown-item>
                            </el-dropdown-item-group>

                            <!-- Import/Export Operations -->
                            <el-dropdown-item-group>
                              <template #title>Import/Export</template>
                              <el-dropdown-item command="exportAll">
                                <el-icon><Download /></el-icon>
                                Export All Products
                              </el-dropdown-item>
                              <el-dropdown-item 
                                command="exportSelected" 
                                :disabled="!selectedItems.length"
                                :class="{ 'highlight-item': selectedItems.length > 0 }"
                              >
                                <el-icon><Select /></el-icon>
                                Export Selected
                                <span v-if="selectedItems.length" class="item-count">
                                  ({{ selectedItems.length }})
                                </span>
                              </el-dropdown-item>
                              <el-dropdown-item divided command="bulkImport">
                                <el-icon><Upload /></el-icon>
                                Bulk Import
                              </el-dropdown-item>
                              <el-dropdown-item command="downloadTemplate">
                                <el-icon><Document /></el-icon>
                                Download Template
                              </el-dropdown-item>
                            </el-dropdown-item-group>
                          </el-dropdown-menu>
                    </template>
                      </el-dropdown>

                      <div class="action-divider"></div>

                      <el-tooltip content="Create New Product" placement="top">
                        <el-button type="primary" class="create-button" @click="handleCreateProduct">
                          <el-icon><Plus /></el-icon>
                          Create
                        </el-button>
                      </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. 商品列表 -->
          <div class="products-list-section">
            <el-card class="products-list-card" shadow="never">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        row-key="id"
      >
        <el-table-column type="selection" width="55" fixed="left" />
        
        <!-- Product Information (SPU Level) -->
        <el-table-column label="Product Information" min-width="300" fixed="left">
          <template #default="{ row }">
            <div class="product-info-cell">
              <!-- SPU 层级信息 -->
              <div class="product-main-info">
              <el-image
                    :src="row.image"
                :preview-src-list="[row.image]"
                fit="cover"
                    class="product-image"
              />
              <div class="product-details">
                <div class="product-name">{{ row.name }}</div>
                    <div class="product-ids">
                      <div class="id-row">
                        <span class="id-label">Parent SKU:</span>
                        <span class="id-value highlight">{{ row.sellerParentSku }}</span>
                  </div>
                      <div class="id-row">
                        <span class="id-label">Shein SPU Code:</span>
                        <span class="id-value">{{ row.sheinSpuCode }}</span>
                  </div>
                      <div class="id-row">
                        <span class="id-label">Shein Product ID:</span>
                        <span class="id-value">{{ row.sheinProductId }}</span>
                  </div>
                  </div>
                  </div>
                </div>
            </div>
          </template>
        </el-table-column>



        <!-- Category -->
        <el-table-column label="Category" min-width="220">
          <template #default="{ row }">
            <div class="category-path">
              <span class="category-text">{{ row.categoryPath.join(' > ') }}</span>
              <el-button 
                type="primary" 
                link 
                size="small"
                class="inline-edit-btn"
                @click="handleEditCategory(row)"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>

        <!-- Prices -->
        <el-table-column label="Price" min-width="150">
          <template #default="{ row }">
            <div class="price-info">
              <div class="price-content">
                <div class="regular-price">
                  <span class="price-label">Regular:</span>
                  <span class="price-value" :class="{ 'has-range': row.priceRange }">
                    {{ formatPrice(row.minPrice) }}
                    <template v-if="row.priceRange">
                      - {{ formatPrice(row.maxPrice) }}
                    </template>
                  </span>
                </div>
                <div class="sale-price">
                  <span class="price-label">Sale:</span>
                  <span class="price-value" :class="{ 'has-range': row.salePriceRange }">
                    {{ formatPrice(row.minSalePrice) }}
                    <template v-if="row.salePriceRange">
                      - {{ formatPrice(row.maxSalePrice) }}
                    </template>
                  </span>
                </div>
              </div>
              <el-button 
                type="primary" 
                link 
                size="small"
                class="inline-edit-btn"
                @click="handleEditPrice(row)"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>

        <!-- Status -->
        <el-table-column label="Status" min-width="160">
          <template #default="{ row }">
            <div class="status-info">
              <div class="status-content">
                <div class="status-text" :class="`status-${row.status.toLowerCase()}`">
                  {{ getStatusText(row.status) }}
                </div>
                
                <!-- PENDING 状态的缺失信息提示 -->
                <div v-if="row.status === 'PENDING' && row.missingInfo" class="missing-info">
                  <el-tooltip placement="top">
                    <template #content>
                      <div class="missing-info-tooltip">
                        <div class="tooltip-title">Missing Information:</div>
                        <ul class="missing-list">
                          <li v-for="info in row.missingInfo" :key="info">{{ info }}</li>
                        </ul>
                      </div>
                    </template>
                    <div class="missing-text">
                      <el-icon><Warning /></el-icon>
                      {{ row.missingInfo.length }} Missing
                    </div>
                  </el-tooltip>
                </div>
                
                <!-- 失败原因提示 -->
                <div v-if="row.failureReason" class="failure-info">
                  <el-tooltip :content="row.failureReason" placement="top">
                    <div class="failure-text">
                      <el-icon><Close /></el-icon>
                      Failed
                    </div>
                  </el-tooltip>
                </div>
              </div>
              <el-button 
                type="primary" 
                link 
                size="small"
                class="inline-edit-btn"
                @click="handleEditStatus(row)"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>

        <!-- Dates -->
        <el-table-column label="Dates" min-width="160">
          <template #default="{ row }">
            <div class="dates-info">
              <div class="date-item">
                <span class="date-label">Created:</span>
                <span class="date-value">{{ formatDate(row.createdAt) }}</span>
              </div>
              <div class="date-item">
                <span class="date-label">Listed:</span>
                <span class="date-value">{{ formatDate(row.listedAt) || '-' }}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- Actions -->
        <el-table-column label="Actions" width="100" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons-vertical">
              <el-button
                type="primary"
                link
                size="small"
                @click="handleEdit(row)"
              >
                Edit
              </el-button>
              <el-button
                v-if="row.status === 'DRAFT'"
                type="danger"
                link
                size="small"
                @click="handleDelete(row)"
              >
                Delete
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

              <!-- 分页器 -->
              <div class="pagination-wrapper">
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="total"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </el-card>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="History" name="history">
        <template #label>
          <span class="tab-label">
            <el-icon><Clock /></el-icon>
            History
          </span>
        </template>
        
        <!-- History 内容 -->
        <div class="tab-content">
          <!-- 搜索区域 -->
          <el-card class="search-card" shadow="never">
            <div class="search-content">
              <div class="search-filters-compact">
                <!-- 第一行：基本筛选 -->
                <div class="search-row primary-search">
                  <div class="search-item">
                    <label class="search-label">Seller Parent SKU</label>
                    <el-input
                      v-model="historySellerParentSku"
                      placeholder="Enter SKU"
                      size="default"
                      clearable
                    />
                  </div>
                  <div class="search-item">
                    <label class="search-label">Seller SKU</label>
                    <el-input
                      v-model="historySellerSku"
                      placeholder="Enter SKU"
                      size="default"
                      clearable
                    />
                  </div>
                  <div class="search-item">
                    <label class="search-label">SKC</label>
                    <el-input
                      v-model="historySKC"
                      placeholder="Enter SKC"
                      size="default"
                      clearable
                    />
                  </div>
                  <div class="search-item-large">
                    <label class="search-label">Product Name</label>
                    <el-input
                      v-model="historyProductName"
                      placeholder="Enter product name"
                      size="default"
                      clearable
                    />
                  </div>
                  <div class="search-item">
                    <label class="search-label">Brand</label>
                    <el-input
                      v-model="historyBrand"
                      placeholder="Enter brand"
                      size="default"
                      clearable
                    />
                  </div>
                  <div class="search-item">
                    <label class="search-label">Category</label>
                    <el-select
                      v-model="historyCategory"
                      placeholder="Select category"
                      size="default"
                      clearable
                    >
                      <el-option label="Women > Clothing > Dresses" value="women-clothing-dresses" />
                      <el-option label="Women > Accessories > Bags" value="women-accessories-bags" />
                      <el-option label="Men > Clothing > Shirts" value="men-clothing-shirts" />
                    </el-select>
                  </div>
                </div>
                
                <!-- 第二行：其他筛选 -->
                <div class="search-row">
                  <div class="search-item">
                    <label class="search-label">Date Created</label>
                    <el-date-picker
                      v-model="historyDateCreatedRange"
                      type="daterange"
                      range-separator="to"
                      start-placeholder="Start date"
                      end-placeholder="End date"
                      size="default"
                      @change="handleHistorySearch"
                    />
                  </div>
                  <div class="search-item">
                    <label class="search-label">Date Listed</label>
                    <el-date-picker
                      v-model="historyDateListedRange"
                      type="daterange"
                      range-separator="to"
                      start-placeholder="Start date"
                      end-placeholder="End date"
                      size="default"
                      @change="handleHistorySearch"
                    />
                  </div>
                  <div class="search-item">
                    <label class="search-label">Date Added</label>
                    <el-date-picker
                      v-model="historyDateAddedRange"
                      type="daterange"
                      range-separator="to"
                      start-placeholder="Start date"
                      end-placeholder="End date"
                      size="default"
                      @change="handleHistorySearch"
                    />
                  </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="search-actions">
                  <div class="search-actions-left">
                    <el-button size="default" plain @click="handleHistoryResetFilters" :icon="Refresh">
                      Reset
                    </el-button>
                  </div>
                  <div class="search-actions-right">
                    <el-button size="default" type="primary" @click="handleHistorySearch" :icon="Search">
                      Search
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-card>

          <!-- Operations Area -->
          <div class="operations-section">
            <div class="operations-content">
              <!-- Main Actions -->
              <div class="main-actions">
                <div class="left-actions">
                  <!-- Status Tabs -->
                  <div class="status-tabs">
                    <el-tag 
                      v-for="status in historyStatusTabs" 
                      :key="status.key"
                      :type="status.key === activeHistoryStatusTab ? (status.type || 'primary') : ''"
                      :effect="status.key === activeHistoryStatusTab ? 'dark' : 'light'"
                      class="status-tab"
                      :class="{ 
                        'active': status.key === activeHistoryStatusTab,
                        'status-tab-all': status.key === 'all'
                      }"
                      @click="handleHistoryStatusTabChange(status.key)"
                    >
                      {{ status.label }} 
                      <span class="status-count" :class="{ 'active': status.key === activeHistoryStatusTab }">
                        ({{ status.count }})
                      </span>
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 表格区域 -->
          <el-card class="history-table-card" shadow="never">
            <el-table
              :data="historyData"
              style="width: 100%"
              v-loading="historyLoading"
              :row-selection="false"
            >
              <!-- Record ID -->
              <el-table-column label="Record ID" min-width="160">
                <template #default="{ row }">
                  <span class="record-id">{{ row.recordId }}</span>
                </template>
              </el-table-column>
              
              <!-- Product Information -->
              <el-table-column label="Product Information" min-width="280">
                <template #default="{ row }">
                  <div class="product-info-cell">
                    <div class="product-main-info">
                      <el-image
                        :src="row.image"
                        :preview-src-list="[row.image]"
                        fit="cover"
                        class="product-image"
                      />
                      <div class="product-details">
                        <div class="product-name">{{ row.name }}</div>
                        <div class="product-ids">
                          <div class="id-row">
                            <span class="id-label">Parent SKU:</span>
                            <span class="id-value highlight">{{ row.sellerParentSku }}</span>
                          </div>
                          <div class="id-row">
                            <span class="id-label">Shein SPU Code:</span>
                            <span class="id-value">{{ row.sheinSpuCode }}</span>
                          </div>
                          <div class="id-row">
                            <span class="id-label">Shein Product ID:</span>
                            <span class="id-value">{{ row.sheinProductId }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>

              <!-- Category -->
              <el-table-column label="Category" min-width="200">
                <template #default="{ row }">
                  <div class="category-path">
                    <span class="category-text">{{ row.categoryPath ? row.categoryPath.join(' > ') : '-' }}</span>
                  </div>
                </template>
              </el-table-column>

              <!-- Status -->
              <el-table-column label="Status" min-width="120">
                <template #default="{ row }">
                  <el-tag
                    :type="getHistoryStatusType(row.status)"
                    class="status-tag"
                  >
                    {{ getHistoryStatusText(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>

              <!-- Edit Type -->
              <el-table-column label="Edit Type" min-width="100">
                <template #default="{ row }">
                  <el-tag
                    :type="row.editType === 'Add' ? 'success' : 'info'"
                    size="small"
                  >
                    {{ row.editType }}
                  </el-tag>
                </template>
              </el-table-column>

              <!-- Submitted Time -->
              <el-table-column label="Submitted Time" min-width="140">
                <template #default="{ row }">
                  <span>{{ row.submittedTime }}</span>
                </template>
              </el-table-column>

              <!-- Approval Time -->
              <el-table-column label="Approval Time" min-width="140">
                <template #default="{ row }">
                  <span>{{ row.approvalTime || '-' }}</span>
                </template>
              </el-table-column>

              <!-- Action -->
              <el-table-column label="Action" width="120" fixed="right">
                <template #default="{ row }">
                  <div class="action-buttons-vertical">
                    <!-- Rejection Reason - 只有被拒绝的显示 -->
                    <el-button
                      v-if="row.status === 'REJECTED'"
                      type="danger"
                      link
                      size="small"
                      @click="handleViewRejectionReason(row)"
                    >
                      Rejection Reason
                    </el-button>
                    
                    <!-- Edit - 审核通过的不显示 -->
                    <el-button
                      v-if="row.status !== 'APPROVED'"
                      type="primary"
                      link
                      size="small"
                      @click="handleHistoryEdit(row)"
                    >
                      Edit
                    </el-button>
                    
                    <!-- View Details - 所有状态都有 -->
                    <el-button
                      type="primary"
                      link
                      size="small"
                      @click="handleHistoryViewDetail(row)"
                    >
                      View Details
                    </el-button>
                    
                    <!-- Archive - 审核通过的不显示 -->
                    <el-button
                      v-if="row.status !== 'APPROVED'"
                      type="warning"
                      link
                      size="small"
                      @click="handleHistoryArchive(row)"
                    >
                      Archive
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            
            <div class="pagination-wrapper">
              <el-pagination
                v-model:current-page="historyCurrentPage"
                v-model:page-size="historyPageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="historyTotal"
                layout="total, sizes, prev, pager, next, jumper"
              />
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Drafts" name="drafts">
        <template #label>
          <span class="tab-label">
            <el-icon><Edit /></el-icon>
            Drafts
          </span>
        </template>
        
        <!-- Drafts 内容 -->
        <div class="tab-content">
          <!-- 搜索区域 -->
          <el-card class="search-card" shadow="never">
            <div class="search-content">
              <div class="search-filters-compact">
                <!-- 第一行：基本筛选 -->
                <div class="search-row primary-search">
                  <div class="search-item">
                    <label class="search-label">Seller Parent SKU</label>
                    <el-input
                      v-model="draftsSellerParentSku"
                      placeholder="Enter SKU"
                      size="default"
                      clearable
                    />
                  </div>
                  <div class="search-item">
                    <label class="search-label">Seller SKU</label>
                    <el-input
                      v-model="draftsSellerSku"
                      placeholder="Enter SKU"
                      size="default"
                      clearable
                    />
                  </div>
                  <div class="search-item">
                    <label class="search-label">SKC</label>
                    <el-input
                      v-model="draftsSKC"
                      placeholder="Enter SKC"
                      size="default"
                      clearable
                    />
                  </div>
                  <div class="search-item-large">
                    <label class="search-label">Product Name</label>
                    <el-input
                      v-model="draftsProductName"
                      placeholder="Enter product name"
                      size="default"
                      clearable
                    />
                  </div>
                  <div class="search-item">
                    <label class="search-label">Brand</label>
                    <el-input
                      v-model="draftsBrand"
                      placeholder="Enter brand"
                      size="default"
                      clearable
                    />
                  </div>
                  <div class="search-item">
                    <label class="search-label">Category</label>
                    <el-select
                      v-model="draftsCategory"
                      placeholder="Select category"
                      size="default"
                      clearable
                    >
                      <el-option label="Women > Clothing > Dresses" value="women-clothing-dresses" />
                      <el-option label="Women > Accessories > Bags" value="women-accessories-bags" />
                      <el-option label="Men > Clothing > Shirts" value="men-clothing-shirts" />
                    </el-select>
                  </div>
                </div>
                
                <!-- 第二行：其他筛选 -->
                <div class="search-row">
                  <div class="search-item">
                    <label class="search-label">Date Created</label>
                    <el-date-picker
                      v-model="draftsDateCreatedRange"
                      type="daterange"
                      range-separator="to"
                      start-placeholder="Start date"
                      end-placeholder="End date"
                      size="default"
                      @change="handleDraftsSearch"
                    />
                  </div>
                  <div class="search-item">
                    <label class="search-label">Date Listed</label>
                    <el-date-picker
                      v-model="draftsDateListedRange"
                      type="daterange"
                      range-separator="to"
                      start-placeholder="Start date"
                      end-placeholder="End date"
                      size="default"
                      @change="handleDraftsSearch"
                    />
                  </div>
                  <div class="search-item">
                    <label class="search-label">Date Added</label>
                    <el-date-picker
                      v-model="draftsDateAddedRange"
                      type="daterange"
                      range-separator="to"
                      start-placeholder="Start date"
                      end-placeholder="End date"
                      size="default"
                      @change="handleDraftsSearch"
                    />
                  </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="search-actions">
                  <div class="search-actions-left">
                    <el-button size="default" plain @click="handleDraftsResetFilters" :icon="Refresh">
                      Reset
                    </el-button>
                  </div>
                  <div class="search-actions-right">
                    <el-button size="default" type="primary" @click="handleDraftsSearch" :icon="Search">
                      Search
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-card>

          <!-- Operations Area -->
          <div class="operations-section">
            <div class="operations-content">
              <!-- Main Actions -->
              <div class="main-actions">
                <div class="left-actions">
                  <!-- Status Tabs -->
                  <div class="status-tabs">
                    <el-tag 
                      v-for="status in draftsStatusTabs" 
                      :key="status.key"
                      :type="status.key === activeDraftsStatusTab ? (status.type || 'primary') : ''"
                      :effect="status.key === activeDraftsStatusTab ? 'dark' : 'light'"
                      class="status-tab"
                      :class="{ 
                        'active': status.key === activeDraftsStatusTab,
                        'status-tab-all': status.key === 'all'
                      }"
                      @click="handleDraftsStatusTabChange(status.key)"
                    >
                      {{ status.label }} 
                      <span class="status-count" :class="{ 'active': status.key === activeDraftsStatusTab }">
                        ({{ status.count }})
                      </span>
                    </el-tag>
                  </div>
                </div>

                <div class="right-actions">
                  <!-- Basic Actions -->
                  <div class="action-group primary-actions">
                    <!-- Selection Counter -->
                    <div v-if="selectedDrafts.length > 0" class="selection-indicator">
                      <span class="selection-count">{{ selectedDrafts.length }} selected</span>
                    </div>

                    <!-- Bulk Actions Dropdown -->
                    <el-dropdown 
                      trigger="click"
                      :disabled="!selectedDrafts.length"
                      @command="handleDraftsBulkOperation"
                    >
                      <el-button 
                        type="primary"
                        class="action-button"
                        :class="{ 'can-action': selectedDrafts.length > 0 }"
                        :disabled="!selectedDrafts.length"
                      >
                        <el-icon><Edit /></el-icon>
                        Bulk Actions
                        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item command="publish">
                            <el-icon><Top /></el-icon>
                            Publish Selected
                          </el-dropdown-item>
                          <el-dropdown-item command="delete">
                            <el-icon><Delete /></el-icon>
                            Delete Selected
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                    
                    <div class="action-divider"></div>
                    
                    <!-- Create Button -->
                    <el-button type="success" :icon="Plus" @click="handleCreateDraft">
                      Create
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 表格区域 -->
          <el-card class="drafts-table-card" shadow="never">
            <el-table
              :data="draftsData"
              style="width: 100%"
              v-loading="draftsLoading"
              @selection-change="handleDraftsSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              
              <!-- Product Information -->
              <el-table-column label="Product Information" min-width="280">
                <template #default="{ row }">
                  <div class="product-info-cell">
                    <div class="product-main-info">
                      <el-image
                        :src="row.image"
                        :preview-src-list="[row.image]"
                        fit="cover"
                        class="product-image"
                      />
                      <div class="product-details">
                        <div class="product-name">{{ row.name }}</div>
                        <div class="product-ids">
                          <div class="id-row">
                            <span class="id-label">Parent SKU:</span>
                            <span class="id-value highlight">{{ row.sellerParentSku }}</span>
                          </div>
                          <div class="id-row">
                            <span class="id-label">Shein SPU Code:</span>
                            <span class="id-value">{{ row.sheinSpuCode }}</span>
                          </div>
                          <div class="id-row">
                            <span class="id-label">Shein Product ID:</span>
                            <span class="id-value">{{ row.sheinProductId }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>

              <!-- Category -->
              <el-table-column label="Category" min-width="200">
                <template #default="{ row }">
                  <div class="category-path">
                    <span class="category-text">{{ row.categoryPath ? row.categoryPath.join(' > ') : '-' }}</span>
                  </div>
                </template>
              </el-table-column>

              <!-- Price -->
              <el-table-column label="Price" min-width="150">
                <template #default="{ row }">
                  <div class="price-info">
                    <div class="price-content">
                      <div class="regular-price">
                        <span class="price-label">Regular:</span>
                        <span class="price-value">{{ formatPrice(row.minPrice) }}</span>
                      </div>
                      <div class="sale-price">
                        <span class="price-label">Sale:</span>
                        <span class="price-value">{{ formatPrice(row.minSalePrice) }}</span>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>

              <!-- Status -->
              <el-table-column label="Status" min-width="120">
                <template #default="{ row }">
                  <div class="status-text" :class="`status-${row.status.toLowerCase()}`">
                    {{ getStatusText(row.status) }}
                  </div>
                </template>
              </el-table-column>

              <!-- Creation Time -->
              <el-table-column label="Creation Time" min-width="140">
                <template #default="{ row }">
                  <span>{{ row.createdAt }}</span>
                </template>
              </el-table-column>

              <!-- Listing Time -->
              <el-table-column label="Listing Time" min-width="140">
                <template #default="{ row }">
                  <span>{{ row.listedAt || '-' }}</span>
                </template>
              </el-table-column>

              <!-- Actions -->
              <el-table-column label="Actions" width="100" fixed="right">
                <template #default="{ row }">
                  <div class="action-buttons-vertical">
                    <el-button
                      type="primary"
                      link
                      size="small"
                      @click="handleEdit(row)"
                    >
                      Edit
                    </el-button>
                    <el-button
                      type="danger"
                      link
                      size="small"
                      @click="handleDelete(row)"
                    >
                      Delete
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            
            <div class="pagination-wrapper">
              <el-pagination
                v-model:current-page="draftsCurrentPage"
                v-model:page-size="draftsPageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="draftsTotal"
                layout="total, sizes, prev, pager, next, jumper"
              />
            </div>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 分类编辑弹窗 -->
    <el-dialog
      v-model="categoryDialogVisible"
      title="编辑产品分类"
      width="500px"
      :before-close="handleCategoryDialogClose"
    >
      <div class="category-dialog-content">
        <div class="current-category">
          <span class="label">当前分类：</span>
          <span class="value">{{ currentEditProduct?.categoryPath?.join(' > ') || '未设置' }}</span>
        </div>
        
        <div class="category-tree-section">
          <span class="label">选择新分类：</span>
          <el-tree
            ref="categoryTreeRef"
            :data="categoryTreeData"
            :props="{ children: 'children', label: 'name' }"
            show-checkbox
            node-key="id"
            check-strictly
            :default-checked-keys="selectedCategoryIds"
            @check="handleCategoryCheck"
          />
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="categoryDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCategorySave">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 价格编辑弹窗 -->
    <el-dialog
      v-model="priceDialogVisible"
      title="Edit Product Price"
      width="800px"
      :before-close="handlePriceDialogClose"
    >
      <div class="price-dialog-content">
        <div class="price-table-header">
          <div class="header-row">
            <div class="spec-headers">
              <div class="spec-header">Color</div>
              <div class="spec-header">Size</div>
              <div class="spec-header">Style</div>
            </div>
            <div class="site-header">US Site</div>
            <div class="price-headers">
              <div class="price-header">
                <span>USD</span>
                <el-input
                  v-model="batchOriginalPrice"
                  placeholder="Enter original price"
                  size="small"
                  type="number"
                  :min="0"
                  step="0.01"
                  class="batch-price-input"
                />
              </div>
              <div class="price-header">
                <span>USD</span>
                <el-input
                  v-model="batchSpecialPrice"
                  placeholder="Enter special price"
                  size="small"
                  type="number"
                  :min="0"
                  step="0.01"
                  class="batch-price-input"
                />
              </div>
            </div>
            <div class="action-header">
              <el-button type="primary" size="small" @click="handlePriceBatchFill">Fill</el-button>
            </div>
          </div>
        </div>

        <div class="price-table-body">
          <div v-for="(variant, index) in currentEditProduct?.priceVariants || []" :key="index" class="price-row">
            <div class="spec-values">
              <div class="spec-value">{{ variant.color }}</div>
              <div class="spec-value">{{ variant.size }}</div>
              <div class="spec-value">{{ variant.style }}</div>
            </div>
            <div class="site-value">US Site</div>
            <div class="price-inputs">
              <div class="price-input-group">
                <span class="currency">USD</span>
                <el-input
                  v-model="variant.originalPrice"
                  placeholder="Original Price"
                  size="small"
                  type="number"
                  :min="0"
                  step="0.01"
                />
                <div class="calculated-info">
                  <div class="calculated-label">Expected Settlement:</div>
                  <div class="calculated-value">{{ calculateSettlement(variant.originalPrice) }}</div>
                </div>
              </div>
              <div class="price-input-group">
                <span class="currency">USD</span>
                <el-input
                  v-model="variant.specialPrice"
                  placeholder="Special Price"
                  size="small"
                  type="number"
                  :min="0"
                  step="0.01"
                />
                <div class="calculated-value">{{ variant.specialPrice || 0 }}</div>
                <span class="currency-suffix">USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="priceDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handlePriceSave">Save</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 状态编辑弹窗 -->
    <el-dialog
      v-model="statusDialogVisible"
      title="Listing Status"
      width="800px"
      :before-close="handleStatusDialogClose"
    >
      <div class="status-dialog-content">
        <div class="product-header">
          <div class="product-image">
            <img :src="currentEditProduct?.image" :alt="currentEditProduct?.name" />
          </div>
          <div class="product-info">
            <div class="product-name">{{ currentEditProduct?.name }}</div>
            <div class="product-spu">SPU: {{ currentEditProduct?.sellerParentSku }}</div>
          </div>
        </div>

        <div class="status-table">
          <div class="status-header">
            <div class="color-header">Color</div>
            <div class="site-header">Listing Sites</div>
          </div>

          <div class="status-body">
            <div v-for="(variant, index) in currentEditProduct?.statusVariants || []" :key="index" class="status-row">
              <div class="color-section">
                <div class="color-info">
                  <img :src="variant.colorImage" :alt="variant.color" class="color-image" />
                  <div class="color-details">
                    <div class="color-name">{{ variant.color }}</div>
                    <div class="sku-info">
                      <div>SKC: {{ variant.skc }}</div>
                      <div>SKU: {{ variant.sku }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="site-section">
                <div class="site-item" v-for="site in variant.sites" :key="site.name">
                  <div class="site-info">
                    <div class="site-time">
                      <div class="time-label">First Listed Time: {{ site.firstListTime }}</div>
                    </div>
                    <div class="site-checkboxes">
                      <div class="checkbox-group">
                        <el-checkbox 
                          v-model="site.shein" 
                          :disabled="getCheckboxDisabled(site, 'shein')"
                          @change="handleSiteChange(variant, site, 'shein')"
                        >
                          Shein
                        </el-checkbox>
                        <div v-if="site.shein && site.sheinStatus" class="status-indicator">
                          <span :class="`status-${site.sheinStatus}`">{{ getStatusText(site.sheinStatus) }}</span>
                        </div>
                      </div>
                      <div class="checkbox-group">
                        <el-checkbox 
                          v-model="site.us" 
                          :disabled="getCheckboxDisabled(site, 'us')"
                          @change="handleSiteChange(variant, site, 'us')"
                        >
                          US Site
                        </el-checkbox>
                        <div v-if="site.us && site.usStatus" class="status-indicator">
                          <span :class="`status-${site.usStatus}`">{{ getStatusText(site.usStatus) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="statusDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleStatusSave">Save</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Search, 
  Download, 
  Plus, 
  Refresh,
  ArrowDown,
  Document,
  Clock,
  Edit,
  ArrowRight,
  Upload,
  Top,
  Bottom,
  RefreshRight,
  Delete,
  Setting,
  FolderOpened,
  Money,
  Discount,
  Warning,
  Close,
  InfoFilled
} from '@element-plus/icons-vue'

// 主要标签页
const activeTab = ref('published')

// Published Products 数据
const loading = ref(false)
// 独立搜索字段
const searchSKC = ref('')
const searchSKU = ref('')
const searchSPU = ref('')
const searchSellerParentSku = ref('')
const searchProductName = ref('')
const filterBrand = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const dateCreatedRange = ref([])
const dateListedRange = ref([])
const dateAddedRange = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const tableData = ref([])
const selectedItems = ref([])
const expandedRows = ref<string[]>([])

// 展开行控制
const handleExpandChange = (row: any, expanded: boolean) => {
  const rowId = row.id.toString()
  const index = expandedRows.value.indexOf(rowId)
  
  if (expanded && index === -1) {
    // 展开当前行
    expandedRows.value.push(rowId)
    
    // 如果是 SPU 层级，同时展开其下的所有 SKUC
    if (row.skucs) {
      row.skucs.forEach((skuc: any) => {
        if (skuc.id) {
          expandedRows.value.push(skuc.id.toString())
        }
      })
    }
  } else if (!expanded && index > -1) {
    // 折叠当前行
    expandedRows.value.splice(index, 1)
    
    // 如果是 SPU 层级，同时折叠其下的所有 SKUC 和 SKU
    if (row.skucs) {
      row.skucs.forEach((skuc: any) => {
        const skucIndex = expandedRows.value.indexOf(skuc.id.toString())
        if (skucIndex > -1) {
          expandedRows.value.splice(skucIndex, 1)
        }
        
        if (skuc.skus) {
          skuc.skus.forEach((sku: any) => {
            const skuIndex = expandedRows.value.indexOf(sku.id.toString())
            if (skuIndex > -1) {
              expandedRows.value.splice(skuIndex, 1)
            }
          })
        }
      })
    }
  }
}

// 状态标签页
const activeStatusTab = ref('all')
const statusTabs = ref([
  { key: 'all', label: 'All', count: 6, type: '' },
  { key: 'pending', label: 'Pending', count: 1, type: 'warning' },
  { key: 'listed', label: 'Listed', count: 1, type: 'success' },
  { key: 'sold_out', label: 'Sold Out', count: 1, type: 'info' },
  { key: 'delisted', label: 'Delisted', count: 1, type: 'danger' },
  { key: 'draft', label: 'Draft', count: 1, type: 'info' },
  { key: 'failed', label: 'Failed', count: 1, type: 'danger' }
])

// History 数据
const historyLoading = ref(false)
const historyCurrentPage = ref(1)
const historyPageSize = ref(20)
const historyTotal = ref(0)

// History 搜索字段
const historySellerParentSku = ref('')
const historySellerSku = ref('')
const historySKC = ref('')
const historyProductName = ref('')
const historyBrand = ref('')
const historyCategory = ref('')
const historyDateCreatedRange = ref([])
const historyDateListedRange = ref([])
const historyDateAddedRange = ref([])

// History 状态标签
const activeHistoryStatusTab = ref('all')
const historyStatusTabs = ref([
  { key: 'all', label: 'All', count: 9, type: '' },
  { key: 'pending_review', label: 'Pending review', count: 2, type: 'warning' },
  { key: 'pending_price', label: 'Pending price', count: 1, type: 'warning' },
  { key: 'pending_final_review', label: 'Pending final review', count: 1, type: 'warning' },
  { key: 'rejected', label: 'Rejected', count: 1, type: 'danger' },
  { key: 'appealing', label: 'Appealing', count: 1, type: 'info' },
  { key: 'approved', label: 'Approved', count: 2, type: 'success' },
  { key: 'revoked', label: 'Revoked', count: 1, type: 'danger' },
  { key: 'archived', label: 'Archived', count: 0, type: 'info' }
])
const historyData = ref([])

// Drafts 数据
const draftsLoading = ref(false)
const draftsSearchQuery = ref('')
const draftsStatusFilter = ref('')
const draftsCurrentPage = ref(1)
const draftsPageSize = ref(20)
const draftsTotal = ref(0)
const draftsData = ref([])

// Drafts 搜索字段
const draftsSellerParentSku = ref('')
const draftsSellerSku = ref('')
const draftsSKC = ref('')
const draftsProductName = ref('')
const draftsBrand = ref('')
const draftsCategory = ref('')
const draftsDateCreatedRange = ref([])
const draftsDateListedRange = ref([])
const draftsDateAddedRange = ref([])

// Drafts 状态标签
const activeDraftsStatusTab = ref('all')
const draftsStatusTabs = ref([
  { key: 'all', label: 'All', count: 3, type: '' },
  { key: 'draft', label: 'Draft', count: 2, type: 'info' },
  { key: 'incomplete', label: 'Incomplete', count: 1, type: 'warning' }
])

// Drafts 选中项
const selectedDrafts = ref([])

// 排序参数
const sortField = ref('')
const sortOrder = ref('')

// 分类编辑弹窗
const categoryDialogVisible = ref(false)
const categoryTreeRef = ref()
const currentEditProduct = ref<any>(null)
const selectedCategoryIds = ref<string[]>([])

// 价格编辑弹窗
const priceDialogVisible = ref(false)
const batchOriginalPrice = ref('')
const batchSpecialPrice = ref('')

// 状态编辑弹窗
const statusDialogVisible = ref(false)

// 统计数据
const totalProducts = computed(() => 6000)
const publishedProducts = computed(() => {
  const listedCount = statusTabs.value.find(tab => tab.key === 'listed')?.count || 0
  const soldOutCount = statusTabs.value.find(tab => tab.key === 'sold_out')?.count || 0
  return listedCount + soldOutCount
})
const remainingProducts = computed(() => totalProducts.value - publishedProducts.value)

// 分类树数据
const categoryTreeData = ref([
  {
    id: 'women',
    name: 'Women',
    children: [
      {
        id: 'women-clothing',
        name: 'Clothing',
        children: [
          {
            id: 'women-clothing-dresses',
            name: 'Dresses',
            children: [
              { id: 'women-clothing-dresses-summer', name: 'Summer' },
              { id: 'women-clothing-dresses-winter', name: 'Winter' },
              { id: 'women-clothing-dresses-party', name: 'Party' }
            ]
          },
          {
            id: 'women-clothing-outerwear',
            name: 'Outerwear',
            children: [
              { id: 'women-clothing-outerwear-jackets', name: 'Jackets' },
              { id: 'women-clothing-outerwear-coats', name: 'Coats' }
            ]
          },
          {
            id: 'women-clothing-bottoms',
            name: 'Bottoms',
            children: [
              { id: 'women-clothing-bottoms-skirts', name: 'Skirts' },
              { id: 'women-clothing-bottoms-pants', name: 'Pants' }
            ]
          }
        ]
      },
      {
        id: 'women-accessories',
        name: 'Accessories',
        children: [
          {
            id: 'women-accessories-handbags',
            name: 'Handbags',
            children: [
              { id: 'women-accessories-handbags-leather', name: 'Leather' },
              { id: 'women-accessories-handbags-canvas', name: 'Canvas' }
            ]
          }
        ]
      },
      {
        id: 'women-shoes',
        name: 'Shoes',
        children: [
          {
            id: 'women-shoes-sneakers',
            name: 'Sneakers',
            children: [
              { id: 'women-shoes-sneakers-casual', name: 'Casual' },
              { id: 'women-shoes-sneakers-sport', name: 'Sport' }
            ]
          }
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

// 模拟数据
const mockData = [
  // 已上架产品
  {
    id: 1,
    name: 'Elegant Summer Dress Collection',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/dress_main.jpg',
    sellerParentSku: 'PARENT-DRESS-001',
    sheinSpuCode: 'SPU24010001',
    sheinProductId: 'PID24010001',
    categoryPath: ['Women', 'Clothing', 'Dresses', 'Summer'],
    minPrice: 29.99,
    maxPrice: 39.99,
    priceRange: true,
    minSalePrice: 19.99,
    maxSalePrice: 29.99,
    salePriceRange: true,
    status: 'LISTED',
    isListed: true,
    createdAt: new Date('2024-01-10'),
    listedAt: new Date('2024-01-15'),
    hasVariants: true,
    priceVariants: [
      {
        color: 'Green',
        size: 'Mini',
        style: 'A',
        originalPrice: 190,
        specialPrice: 0
      },
      {
        color: 'Green',
        size: 'Small',
        style: 'A',
        originalPrice: 190,
        specialPrice: 0
      }
    ],
    statusVariants: [
      {
        color: 'Black',
        colorImage: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/black_color.jpg',
        skc: 'st25082864236677163',
        sku: 'TEST112',
        sites: [
          {
            name: 'shein-us',
            firstListTime: '2025-08-28 01:19:54',
            shein: true,
            sheinStatus: 'LISTED',
            us: true,
            usStatus: 'LISTED'
          }
        ]
      },
      {
        color: 'White',
        colorImage: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/white_color.jpg',
        skc: 'st25082864236643271',
        sku: 'TEST112',
        sites: [
          {
            name: 'shein-us',
            firstListTime: '2025-08-28 01:11:13',
            shein: false,
            sheinStatus: 'DELISTED',
            us: false,
            usStatus: 'DELISTED'
          }
        ]
      }
    ],
    skucs: [
      {
        id: 11,
        isSkuc: true,
        skc: 'SKC24010001',
        colorImage: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/blue_color.jpg',
        colorValue: 'Sky Blue',
        colorCode: '#87CEEB',
        mainSpecs: [
          { name: 'Material', value: 'Cotton' },
          { name: 'Pattern', value: 'Solid' },
          { name: 'Style', value: 'Casual' }
        ],
        skus: [
          {
            id: 111,
            isSku: true,
            sellerSku: 'SKU24010001-BLUE-S',
            sheinSkuCode: 'SHEIN24010001',
            skuId: 'SKUID24010001',
            specifications: [
              { name: 'Size', value: 'S' }
            ]
          },
          {
            id: 112,
            isSku: true,
            sellerSku: 'SKU24010001-BLUE-M',
            sheinSkuCode: 'SHEIN24010002',
            skuId: 'SKUID24010002',
            specifications: [
              { name: 'Size', value: 'M' }
            ]
          }
        ]
      },
      {
        id: 12,
        isSkuc: true,
        skc: 'SKC24010002',
        colorImage: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/pink_color.jpg',
        colorValue: 'Pink',
        colorCode: '#FFC0CB',
        mainSpecs: [
          { name: 'Material', value: 'Cotton' },
          { name: 'Pattern', value: 'Solid' },
          { name: 'Style', value: 'Casual' }
        ],
        skus: [
          {
            id: 121,
            isSku: true,
            sellerSku: 'SKU24010003-PINK-S',
            sheinSkuCode: 'SHEIN24010003',
            skuId: 'SKUID24010003',
            specifications: [
              { name: 'Size', value: 'S' }
            ]
          },
          {
            id: 122,
            isSku: true,
            sellerSku: 'SKU24010003-PINK-M',
            sheinSkuCode: 'SHEIN24010004',
            skuId: 'SKUID24010004',
            specifications: [
              { name: 'Size', value: 'M' }
            ]
          }
        ]
      }
    ]
  },
  // 待上架产品
  {
    id: 2,
    name: 'Classic Denim Jacket',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/jacket_main.jpg',
    sellerParentSku: 'PARENT-JACKET-001',
    sheinSpuCode: 'SPU24010002',
    sheinProductId: 'PID24010002',
    categoryPath: ['Women', 'Clothing', 'Outerwear', 'Jackets'],
    minPrice: 49.99,
    maxPrice: 49.99,
    priceRange: false,
    minSalePrice: 39.99,
    maxSalePrice: 39.99,
    salePriceRange: false,
    status: 'PENDING',
    failureReason: 'Missing product description and size chart',
    missingInfo: ['Product Description', 'Size Chart', 'Brand Authorization'],
    isListed: false,
    createdAt: new Date('2024-01-12'),
    listedAt: null,
    hasVariants: true,
    skucs: [
      {
        id: 21,
        isSkuc: true,
        skc: 'SKC24010003',
        colorImage: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/light_wash.jpg',
        colorValue: 'Light Wash',
        colorCode: '#D3D3D3',
        mainSpecs: [
          { name: 'Material', value: 'Denim' },
          { name: 'Style', value: 'Classic' },
          { name: 'Wash', value: 'Light Wash' }
        ],
        skus: [
          {
            id: 211,
            isSku: true,
            sellerSku: 'SKU24010002-LIGHT-L',
            sheinSkuCode: 'SHEIN24010003',
            skuId: 'SKUID24010003',
            specifications: [
              { name: 'Size', value: 'L' }
            ]
          }
        ]
      }
    ]
  },
  // 已售罄产品
  {
    id: 4,
    name: 'Trendy Sneakers Collection',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/sneakers_main.jpg',
    sellerParentSku: 'PARENT-SNEAKERS-001',
    sheinSpuCode: 'SPU24010004',
    sheinProductId: 'PID24010004',
    categoryPath: ['Women', 'Shoes', 'Sneakers', 'Casual'],
    minPrice: 59.99,
    maxPrice: 79.99,
    priceRange: true,
    minSalePrice: 49.99,
    maxSalePrice: 69.99,
    salePriceRange: true,
    status: 'SOLD_OUT',
    isListed: true,
    createdAt: new Date('2024-01-08'),
    listedAt: new Date('2024-01-10'),
    soldOutAt: new Date('2024-01-18'),
    hasVariants: true,
    skucs: [
      {
        id: 41,
        isSkuc: true,
        skc: 'SKC24010005',
        colorImage: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/white_sneakers.jpg',
        colorValue: 'Classic White',
        colorCode: '#FFFFFF',
        mainSpecs: [
          { name: 'Material', value: 'Canvas' },
          { name: 'Style', value: 'Low Top' },
          { name: 'Sole', value: 'Rubber' }
        ],
        skus: [
          {
            id: 411,
            isSku: true,
            sellerSku: 'SKU24010004-WHITE-7',
            sheinSkuCode: 'SHEIN24010007',
            skuId: 'SKUID24010007',
            specifications: [
              { name: 'Size', value: '7' }
            ]
          },
          {
            id: 412,
            isSku: true,
            sellerSku: 'SKU24010004-WHITE-8',
            sheinSkuCode: 'SHEIN24010008',
            skuId: 'SKUID24010008',
            specifications: [
              { name: 'Size', value: '8' }
            ]
          }
        ]
      }
    ]
  },
  // 草稿状态产品
  {
    id: 5,
    name: 'Vintage Leather Handbag',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/handbag_main.jpg',
    sellerParentSku: 'PARENT-HANDBAG-001',
    sheinSpuCode: '',
    sheinProductId: '',
    categoryPath: ['Women', 'Accessories', 'Handbags', 'Leather'],
    minPrice: 89.99,
    maxPrice: 89.99,
    priceRange: false,
    minSalePrice: null,
    maxSalePrice: null,
    salePriceRange: false,
    status: 'DRAFT',
    isListed: false,
    createdAt: new Date('2024-01-20'),
    listedAt: null,
    hasVariants: true,
    skucs: [
      {
        id: 51,
        isSkuc: true,
        skc: 'SKC24010006',
        colorImage: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/brown_leather.jpg',
        colorValue: 'Brown',
        colorCode: '#8B4513',
        mainSpecs: [
          { name: 'Material', value: 'Genuine Leather' },
          { name: 'Style', value: 'Vintage' },
          { name: 'Hardware', value: 'Gold' }
        ],
        skus: [
          {
            id: 511,
            isSku: true,
            sellerSku: 'SKU24010005-BROWN-REG',
            sheinSkuCode: '',
            skuId: '',
            specifications: [
              { name: 'Size', value: 'Regular' }
            ]
          }
        ]
      }
    ]
  },
  // 失败状态产品
  {
    id: 6,
    name: 'Smart Watch Pro',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/smartwatch_main.jpg',
    sellerParentSku: 'PARENT-WATCH-001',
    sheinSpuCode: 'SPU24010005',
    sheinProductId: 'PID24010005',
    categoryPath: ['Electronics', 'Wearables', 'Smart Watches', 'Fitness'],
    minPrice: 199.99,
    maxPrice: 299.99,
    priceRange: true,
    minSalePrice: 149.99,
    maxSalePrice: 249.99,
    salePriceRange: true,
    status: 'FAILED',
    failureReason: 'Product category not allowed on Shein platform. Electronics require additional certifications.',
    isListed: false,
    createdAt: new Date('2024-01-18'),
    listedAt: null,
    hasVariants: true,
    skucs: [
      {
        id: 61,
        isSkuc: true,
        skc: 'SKC24010007',
        colorImage: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/black_watch.jpg',
        colorValue: 'Space Black',
        colorCode: '#000000',
        mainSpecs: [
          { name: 'Display', value: 'OLED' },
          { name: 'Battery', value: '7 Days' },
          { name: 'Water Resistance', value: '50M' }
        ],
        skus: [
          {
            id: 611,
            isSku: true,
            sellerSku: 'SKU24010006-BLACK-42MM',
            sheinSkuCode: 'SHEIN24010009',
            skuId: 'SKUID24010009',
            specifications: [
              { name: 'Size', value: '42mm' }
            ]
          },
          {
            id: 612,
            isSku: true,
            sellerSku: 'SKU24010006-BLACK-46MM',
            sheinSkuCode: 'SHEIN24010010',
            skuId: 'SKUID24010010',
            specifications: [
              { name: 'Size', value: '46mm' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Classic Denim Jacket',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/jacket_main.jpg',
    sellerParentSku: 'PARENT-JACKET-001',
    sheinSpuCode: 'SPU24010002',
    sheinProductId: 'PID24010002',
    categoryPath: ['Women', 'Clothing', 'Outerwear', 'Jackets'],
    minPrice: 49.99,
    maxPrice: 49.99,
    priceRange: false,
    minSalePrice: 39.99,
    maxSalePrice: 39.99,
    salePriceRange: false,
    status: 'PENDING',
    failureReason: 'Product description needs more details',
    isListed: false,
    createdAt: new Date('2024-01-12'),
    listedAt: null,
    hasVariants: true,
    variants: [
      {
        isVariant: true,
        colorImage: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/light_wash.jpg',
        colorValue: 'Light Wash',
        skc: 'SKC24010003',
        sellerSku: 'SKU24010002-LIGHT-L',
        sheinSkuCode: 'SHEIN24010003',
        skuId: 'SKUID24010003',
        specifications: [
          { name: 'Color', value: 'Light Wash' },
          { name: 'Size', value: 'L' }
        ]
      }
    ]
  },
  // 已下架产品
  {
    id: 3,
    name: 'Boho Style Maxi Skirt',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/skirt_main.jpg',
    sellerParentSku: 'PARENT-SKIRT-001',
    sheinSpuCode: 'SPU24010003',
    sheinProductId: 'PID24010003',
    categoryPath: ['Women', 'Clothing', 'Bottoms', 'Skirts'],
    minPrice: 35.99,
    maxPrice: 35.99,
    priceRange: false,
    minSalePrice: null,
    maxSalePrice: null,
    salePriceRange: false,
    status: 'DELISTED',
    isListed: false,
    createdAt: new Date('2024-01-14'),
    listedAt: new Date('2024-01-16'),
    delistedAt: new Date('2024-01-20'),
    hasVariants: true,
    skucs: [
      {
        isVariant: true,
        colorImage: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/floral_print.jpg',
        colorValue: 'Floral Print',
        skc: 'SKC24010004',
        sellerSku: 'SKU24010003-FLORAL-M',
        sheinSkuCode: 'SHEIN24010004',
        skuId: 'SKUID24010004',
        specifications: [
          { name: 'Pattern', value: 'Floral Print' },
          { name: 'Size', value: 'M' }
        ]
      }
    ]
  },
  {
    id: 2,
    productCode: 'H12',
    skc: 'H12-002',
    sku: 'g2509014617',
    spu: 'SPU-H12-2024',
    sellerParentSku: 'PARENT-H12-002',
    name: 'H12 Fashion Top',
    sheinId: 'g2509014617641774',
    brand: 'SHEIN',
    category: '服装',
    dateCreated: new Date('2024-01-08'),
    dateAdded: new Date('2024-01-10'),
    dateListed: null,
    salePrice: 18.00,
    inventory: {
      status: 'PAYMENT_LOCKED',
      total: 8,
      committed: 5,
      locked: 3,
      available: 0
    },
    listingStatus: 'DELETED',
    listingMethod: '已删除状态',
    listingCriteria: 'none',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/10/f2/170523456789a1b2c3d4e5f6g7h8i9j0_thumbnail_405x552.jpg'
  },
  {
    id: 3,
    productCode: 'J118',
    skc: 'J118-003',
    sku: 'g2509051171',
    spu: 'SPU-J118-2024',
    sellerParentSku: 'PARENT-J118-003',
    name: 'J118 Designer Bag',
    sheinId: 'g2509051171641778',
    brand: 'SHEIN',
    category: '包包',
    dateCreated: new Date('2024-01-05'),
    dateAdded: new Date('2024-01-07'),
    dateListed: new Date('2024-01-12'),
    salePrice: 199.00,
    inventory: {
      status: 'COMMITTED',
      total: 75,
      committed: 60,
      locked: 5,
      available: 10
    },
    listingStatus: 'PENDING',
    listingMethod: '预估上架日期',
    listingCriteria: 'none',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/12/a1/17052123456789b0c1d2e3f4g5h6i7j8_thumbnail_405x552.jpg'
  },
  {
    id: 4,
    productCode: 'JKT2',
    skc: 'JKT2-004',
    sku: 'g2509011569',
    spu: 'SPU-JKT2-2024',
    sellerParentSku: 'PARENT-JKT2-004',
    name: 'Item W Jacket 2',
    sheinId: 'g2509011569912190',
    brand: 'ROMWE',
    category: '服装',
    dateCreated: new Date('2024-01-03'),
    dateAdded: new Date('2024-01-05'),
    dateListed: null,
    salePrice: 1.00,
    inventory: {
      status: 'COMMITTED',
      total: 25,
      committed: 20,
      locked: 2,
      available: 3
    },
    listingStatus: 'DELETED',
    listingMethod: '已删除状态',
    listingCriteria: 'none',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/05/d3/170521234567890123456789_thumbnail_405x552.jpg'
  },
  {
    id: 5,
    productCode: 'SPKT2',
    skc: 'SPKT2-005',
    sku: 'g2509016308',
    spu: 'SPU-SPKT2-2024',
    sellerParentSku: 'PARENT-SPKT2-005',
    name: 'itemcuspkt-2',
    sheinId: 'g2509016308111444',
    brand: 'SHEIN',
    category: '鞋类',
    dateCreated: new Date('2024-01-01'),
    dateAdded: new Date('2024-01-03'),
    dateListed: new Date('2024-01-08'),
    salePrice: 1.00,
    inventory: {
      status: 'COMMITTED',
      total: 100,
      committed: 80,
      locked: 5,
      available: 15
    },
    listingStatus: 'ACTIVE',
    listingMethod: '即时上架',
    listingCriteria: 'none',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/01/e4/170520123456789012345678_thumbnail_405x552.jpg'
  },
  {
    id: 6,
    productCode: 'ACC001',
    skc: 'ACC001-006',
    sku: 'g2509020456',
    spu: 'SPU-ACC001-2024',
    sellerParentSku: 'PARENT-ACC001-006',
    name: 'Fashion Accessories Set',
    sheinId: 'g2509020456789123',
    brand: 'MOTF',
    category: '配饰',
    dateCreated: new Date('2024-01-15'),
    dateAdded: new Date('2024-01-16'),
    dateListed: new Date('2024-01-18'),
    salePrice: 25.50,
    inventory: {
      status: 'COMMITTED',
      total: 200,
      committed: 150,
      locked: 20,
      available: 30
    },
    listingStatus: 'ACTIVE',
    listingMethod: '即时上架',
    listingCriteria: 'trusted',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/18/b5/170524567890123456789012_thumbnail_405x552.jpg'
  }
]

// 历史记录模拟数据
const mockHistoryData = [
  {
    recordId: 'SPMP4L4205093231150114',
    name: 'Elegant Summer Dress Collection',
    sellerParentSku: 'SPU24010001',
    sheinSpuCode: 'SHEIN-SPU-001',
    sheinProductId: 'SHEIN-001',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/product1.jpg',
    categoryPath: ['Women', 'Clothing', 'Dresses', 'Summer'],
    status: 'PENDING_REVIEW',
    editType: 'Add',
    submittedTime: '2024-01-15 10:30:00',
    approvalTime: null
  },
  {
    recordId: 'SPMP4L4205093231150141',
    name: 'Winter Coat Series',
    sellerParentSku: 'SPU24010002',
    sheinSpuCode: 'SHEIN-SPU-002',
    sheinProductId: 'SHEIN-002',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/product2.jpg',
    categoryPath: ['Women', 'Clothing', 'Outerwear', 'Coats'],
    status: 'APPROVED',
    editType: 'Edit',
    submittedTime: '2024-01-14 15:20:00',
    approvalTime: '2024-01-16 09:15:00'
  },
  {
    recordId: 'SPMP4L1602059172266129',
    name: 'Spring Jacket',
    sellerParentSku: 'SPU24010003',
    sheinSpuCode: 'SHEIN-SPU-003',
    sheinProductId: 'SHEIN-003',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/product3.jpg',
    categoryPath: ['Women', 'Clothing', 'Outerwear', 'Jackets'],
    status: 'REJECTED',
    editType: 'Add',
    submittedTime: '2024-01-13 09:45:00',
    approvalTime: '2024-01-14 14:30:00',
    rejectionReason: 'Product images do not meet quality standards'
  },
  {
    recordId: 'SPMP4L1602059161968362',
    name: 'Autumn Sweater',
    sellerParentSku: 'SPU24010004',
    sheinSpuCode: 'SHEIN-SPU-004',
    sheinProductId: 'SHEIN-004',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/product4.jpg',
    categoryPath: ['Women', 'Clothing', 'Sweaters', 'Autumn'],
    status: 'PENDING_PRICE',
    editType: 'Edit',
    submittedTime: '2024-01-12 16:45:00',
    approvalTime: null
  },
  {
    recordId: 'SPMP4L4205091856723529',
    name: 'Casual T-Shirt',
    sellerParentSku: 'SPU24010005',
    sheinSpuCode: 'SHEIN-SPU-005',
    sheinProductId: 'SHEIN-005',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/product5.jpg',
    categoryPath: ['Women', 'Clothing', 'Tops', 'T-Shirts'],
    status: 'PENDING_FINAL_REVIEW',
    editType: 'Add',
    submittedTime: '2024-01-11 11:30:00',
    approvalTime: null
  },
  {
    recordId: 'SPMP4L4205091541781819',
    name: 'Denim Jeans',
    sellerParentSku: 'SPU24010006',
    sheinSpuCode: 'SHEIN-SPU-006',
    sheinProductId: 'SHEIN-006',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/product6.jpg',
    categoryPath: ['Women', 'Clothing', 'Bottoms', 'Jeans'],
    status: 'APPEALING',
    editType: 'Edit',
    submittedTime: '2024-01-10 08:20:00',
    approvalTime: null
  },
  {
    recordId: 'SPMP4L4205091541781815',
    name: 'Sports Shoes',
    sellerParentSku: 'SPU24010007',
    sheinSpuCode: 'SHEIN-SPU-007',
    sheinProductId: 'SHEIN-007',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/product7.jpg',
    categoryPath: ['Women', 'Shoes', 'Sneakers', 'Sports'],
    status: 'APPROVED',
    editType: 'Add',
    submittedTime: '2024-01-09 14:15:00',
    approvalTime: '2024-01-10 10:30:00'
  },
  {
    recordId: 'SPMP4L1020350911150905',
    name: 'Handbag Collection',
    sellerParentSku: 'SPU24010008',
    sheinSpuCode: 'SHEIN-SPU-008',
    sheinProductId: 'SHEIN-008',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/product8.jpg',
    categoryPath: ['Women', 'Accessories', 'Handbags', 'Leather'],
    status: 'REVOKED',
    editType: 'Edit',
    submittedTime: '2024-01-08 13:45:00',
    approvalTime: '2024-01-09 16:20:00'
  },
  {
    recordId: 'SPMP4L1020350911150906',
    name: 'Summer Hat',
    sellerParentSku: 'SPU24010009',
    sheinSpuCode: 'SHEIN-SPU-009',
    sheinProductId: 'SHEIN-009',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/product9.jpg',
    categoryPath: ['Women', 'Accessories', 'Hats', 'Summer'],
    status: 'PENDING_REVIEW',
    editType: 'Add',
    submittedTime: '2024-01-07 12:30:00',
    approvalTime: null
  }
]

// 草稿模拟数据
const mockDraftsData = [
  {
    id: 'DRAFT001',
    name: 'Summer Beach Dress Draft',
    sellerParentSku: 'DRAFT-SPU001',
    sheinSpuCode: '',
    sheinProductId: '',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/draft1.jpg',
    categoryPath: ['Women', 'Clothing', 'Dresses', 'Beach'],
    minPrice: 25.99,
    maxPrice: 35.99,
    minSalePrice: 19.99,
    maxSalePrice: 29.99,
    status: 'DRAFT',
    isListed: false,
    createdAt: '2024-01-10 14:30:00',
    listedAt: null,
    failureReason: null,
    missingInfo: null
  },
  {
    id: 'DRAFT002',
    name: 'Casual Handbag Collection Draft',
    sellerParentSku: 'DRAFT-SPU002',
    sheinSpuCode: '',
    sheinProductId: '',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/draft2.jpg',
    categoryPath: ['Women', 'Accessories', 'Handbags', 'Casual'],
    minPrice: 45.00,
    maxPrice: 45.00,
    minSalePrice: 39.99,
    maxSalePrice: 39.99,
    status: 'DRAFT',
    isListed: false,
    createdAt: '2024-01-08 11:20:00',
    listedAt: null,
    failureReason: null,
    missingInfo: null
  },
  {
    id: 'DRAFT003',
    name: 'Sports Sneakers Incomplete',
    sellerParentSku: 'DRAFT-SPU003',
    sheinSpuCode: '',
    sheinProductId: '',
    image: 'https://img.ltwebstatic.com/images3_pi/2024/01/15/draft3.jpg',
    categoryPath: ['Women', 'Shoes', 'Sneakers', 'Sports'],
    minPrice: 0,
    maxPrice: 0,
    minSalePrice: 0,
    maxSalePrice: 0,
    status: 'INCOMPLETE',
    isListed: false,
    createdAt: '2024-01-05 09:15:00',
    listedAt: null,
    failureReason: null,
    missingInfo: ['Price not set', 'Size chart missing']
  }
]

// 初始化数据
onMounted(() => {
  loadData()
  loadHistoryData()
  loadDraftsData()
})

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 应用筛选和搜索
    let filteredData = [...mockData]
    
    // 状态标签页筛选
    if (activeStatusTab.value !== 'all') {
      filteredData = filteredData.filter(item => {
        switch (activeStatusTab.value) {
          case 'pending':
            return item.status === 'PENDING'
          case 'listed':
            return item.status === 'LISTED'
          case 'sold_out':
            return item.status === 'SOLD_OUT'
          case 'delisted':
            return item.status === 'DELISTED'
          case 'draft':
            return item.status === 'DRAFT'
          case 'failed':
            return item.status === 'FAILED'
          default:
            return true
        }
      })
    }
    
    // 搜索条件
    if (searchProductName.value) {
      filteredData = filteredData.filter(item => 
        item.name && item.name.toLowerCase().includes(searchProductName.value.toLowerCase())
      )
    }
    
    if (searchSellerParentSku.value) {
      filteredData = filteredData.filter(item => 
        item.sellerParentSku && item.sellerParentSku.toLowerCase().includes(searchSellerParentSku.value.toLowerCase())
      )
    }
    
    if (searchSKC.value) {
      filteredData = filteredData.filter(item => {
        // 检查 skucs 数组中的 skc
        return item.skucs && item.skucs.some(skuc => 
          skuc.skc && skuc.skc.toLowerCase().includes(searchSKC.value.toLowerCase())
        )
      })
    }

    if (searchSKU.value) {
      filteredData = filteredData.filter(item => {
        // 检查所有 skucs 中的 skus 数组
        return item.skucs && item.skucs.some(skuc => 
          skuc.skus && skuc.skus.some(sku => 
            sku.sellerSku && sku.sellerSku.toLowerCase().includes(searchSKU.value.toLowerCase())
          )
        )
      })
    }
    
    // 日期筛选
    if (dateCreatedRange.value && dateCreatedRange.value.length === 2) {
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.createdAt)
        return itemDate >= dateCreatedRange.value[0] && itemDate <= dateCreatedRange.value[1]
      })
    }
    
    if (dateListedRange.value && dateListedRange.value.length === 2) {
      filteredData = filteredData.filter(item => {
        if (!item.listedAt) return false
        const itemDate = new Date(item.listedAt)
        return itemDate >= dateListedRange.value[0] && itemDate <= dateListedRange.value[1]
      })
    }
    
    if (dateAddedRange.value && dateAddedRange.value.length === 2) {
      filteredData = filteredData.filter(item => {
        if (!item.dateAdded) return false
        const itemDate = new Date(item.dateAdded)
        return itemDate >= dateAddedRange.value[0] && itemDate <= dateAddedRange.value[1]
      })
    }
    
    // 排序
    if (sortField.value) {
      filteredData.sort((a, b) => {
        let aVal = a[sortField.value]
        let bVal = b[sortField.value]
        
        const modifier = sortOrder.value === 'ascending' ? 1 : -1
        
        if (aVal < bVal) return -1 * modifier
        if (aVal > bVal) return 1 * modifier
        return 0
      })
    }
    
    total.value = filteredData.length
    
    // 构建数据结构 - SPU 为主行，包含所有 SKC 和 SKU 信息
    const processedData = filteredData.map(item => {
      return {
        ...item,
        // 计算 SKC 和 SKU 的总数用于行合并
        skucCount: item.skucs ? item.skucs.length : 0,
        skuCount: item.skucs ? item.skucs.reduce((total: number, skuc: any) => total + (skuc.skus ? skuc.skus.length : 0), 0) : 0
      }
    })
    
    // 分页
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    tableData.value = processedData.slice(start, end)
    
  } catch (error) {
    console.error('Failed to load data:', error)
    ElMessage.error('Failed to load data')
  } finally {
    loading.value = false
  }
}

// 标签页切换
const handleTabChange = (tabName: string) => {
  activeTab.value = tabName
  switch (tabName) {
    case 'published':
      loadData()
      break
    case 'history':
      loadHistoryData()
      break
    case 'drafts':
      loadDraftsData()
      break
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

// 状态标签切换
const handleStatusTabChange = (statusKey: string) => {
  activeStatusTab.value = statusKey
  currentPage.value = 1
  loadData()
}

// Reset filters
const handleResetFilters = () => {
  searchSKC.value = ''
  searchSKU.value = ''
  searchSellerParentSku.value = ''
  searchProductName.value = ''
  filterBrand.value = ''
  filterCategory.value = ''
  dateCreatedRange.value = []
  dateListedRange.value = []
  dateAddedRange.value = []
  currentPage.value = 1
  loadData()
}

// 导出数据
const handleExport = () => {
  ElMessage.success('开始导出数据，请稍候...')
}

// 刷新数据
const handleRefresh = () => {
  loadData()
  ElMessage.success('数据已刷新')
}

// 批量上架
const handleBulkListing = () => {
  ElMessage.success('开始批量上架操作')
}

// 同步产品
const handleSync = (row?: any) => {
  if (row) {
    ElMessage.success(`开始同步产品: ${row.name}`)
  } else {
    ElMessage.success('开始批量同步产品')
  }
}

// 批量操作
const handleBulkPublish = async () => {
  await ElMessageBox.confirm(`确定要批量上架选中的 ${selectedItems.value.length} 个产品吗？`, '批量上架', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  ElMessage.success(`已批量上架 ${selectedItems.value.length} 个产品`)
  loadData()
}

const handleBulkUnpublish = async () => {
  await ElMessageBox.confirm(`确定要批量下架选中的 ${selectedItems.value.length} 个产品吗？`, '批量下架', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  ElMessage.success(`已批量下架 ${selectedItems.value.length} 个产品`)
  loadData()
}

const handleBulkSync = async () => {
  await ElMessageBox.confirm(`确定要批量同步选中的 ${selectedItems.value.length} 个产品吗？`, '批量同步', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  ElMessage.success(`已开始批量同步 ${selectedItems.value.length} 个产品`)
  loadData()
}

const handleBulkExport = () => {
  ElMessage.success(`开始导出选中的 ${selectedItems.value.length} 个产品`)
}

// Bulk Operations Handler
const handleBulkOperation = async (command: string) => {
  const itemCount = selectedItems.value.length
  
  switch (command) {
    case 'setCategory':
      // Open category selection dialog
      const categoryDialogVisible = ref(false)
      try {
        await ElMessageBox.prompt('Select category for selected items:', 'Set Category', {
          confirmButtonText: 'Apply',
          cancelButtonText: 'Cancel',
          inputPlaceholder: 'Choose category...',
          inputType: 'select',
          inputValue: '',
          inputValidator: (value) => !!value,
          inputErrorMessage: 'Please select a category',
          inputOptions: [
            { label: 'Clothing', value: 'clothing' },
            { label: 'Accessories', value: 'accessories' },
            { label: 'Shoes', value: 'shoes' },
            { label: 'Bags', value: 'bags' },
            { label: 'Beauty', value: 'beauty' }
          ]
        })
        ElMessage.success(`Category updated for ${itemCount} items`)
  loadData()
      } catch (error) {
        // User cancelled
      }
      break

    case 'setPrice':
      try {
        const { value } = await ElMessageBox.prompt('Enter regular price for selected items:', 'Set Regular Price', {
          confirmButtonText: 'Apply',
          cancelButtonText: 'Cancel',
          inputPattern: /^\d+(\.\d{1,2})?$/,
          inputErrorMessage: 'Please enter a valid price (e.g., 29.99)',
          inputPlaceholder: 'Enter price...'
        })
        if (value) {
          ElMessage.success(`Regular price updated to $${value} for ${itemCount} items`)
          loadData()
        }
      } catch (error) {
        // User cancelled
      }
      break

    case 'setSalePrice':
      try {
        const { value } = await ElMessageBox.prompt('Enter sale price for selected items:', 'Set Sale Price', {
          confirmButtonText: 'Apply',
          cancelButtonText: 'Cancel',
          inputPattern: /^\d+(\.\d{1,2})?$/,
          inputErrorMessage: 'Please enter a valid price (e.g., 19.99)',
          inputPlaceholder: 'Enter sale price...'
        })
        if (value) {
          ElMessage.success(`Sale price updated to $${value} for ${itemCount} items`)
          loadData()
        }
      } catch (error) {
        // User cancelled
      }
      break

    case 'bulkImport':
      // 触发文件选择
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.xlsx,.xls,.csv'
      input.onchange = async (e) => {
        const file = e.target.files[0]
        if (file) {
          // 这里可以添加文件类型验证
          const isValidType = ['.xlsx', '.xls', '.csv'].some(type => 
            file.name.toLowerCase().endsWith(type)
          )
          
          if (!isValidType) {
            ElMessage.error('Please upload a valid Excel or CSV file')
            return
          }

          // 这里可以添加文件处理逻辑
          ElMessage.success(`File "${file.name}" selected for import`)
          // TODO: 处理文件上传和导入
        }
      }
      input.click()
      break

    case 'downloadTemplate':
      try {
        // 这里可以添加模板下载逻辑
        ElMessage.success('Starting template download...')
        // TODO: 处理模板下载
      } catch (error) {
        ElMessage.error('Failed to download template')
      }
      break

    case 'delete':
      await ElMessageBox.confirm(
        `Delete ${itemCount} selected items? This action cannot be undone.`,
        'Delete Confirmation',
        {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'error'
        }
      )
      ElMessage.success(`Successfully deleted ${itemCount} items`)
      loadData()
      break
  }
}

// 查看产品
const handleView = (row: any) => {
  // 跳转到产品详情页
  console.log('查看产品:', row)
}

// 编辑产品
const handleEdit = (row: any) => {
  // 跳转到编辑页面
  console.log('编辑产品:', row)
  ElMessage.success(`跳转到编辑页面: ${row.name}`)
}

// 编辑分类
const handleEditCategory = (row: any) => {
  console.log('编辑分类:', row)
  currentEditProduct.value = row
  
  // 设置当前选中的分类
  if (row.categoryPath && row.categoryPath.length > 0) {
    // 构建分类ID路径
    const categoryId = row.categoryPath.join('-').toLowerCase().replace(/\s+/g, '-')
    selectedCategoryIds.value = [categoryId]
  } else {
    selectedCategoryIds.value = []
  }
  
  categoryDialogVisible.value = true
}

// 编辑价格
const handleEditPrice = (row: any) => {
  console.log('编辑价格:', row)
  currentEditProduct.value = row
  
  // 确保产品有价格变体数据
  if (!row.priceVariants) {
    row.priceVariants = [
      {
        color: 'Green',
        size: 'Mini',
        style: 'A',
        originalPrice: row.minPrice || 0,
        specialPrice: row.minSalePrice || 0
      }
    ]
  }
  
  priceDialogVisible.value = true
}

// 编辑状态
const handleEditStatus = (row: any) => {
  console.log('编辑状态:', row)
  currentEditProduct.value = row
  
  // 确保产品有状态变体数据
  if (!row.statusVariants) {
    row.statusVariants = [
      {
        color: 'Black',
        colorImage: row.image || 'https://img.ltwebstatic.com/images3_pi/2024/01/15/black_color.jpg',
        skc: 'st25082864236677163',
        sku: 'TEST112',
        sites: [
          {
            name: 'shein-us',
            firstListTime: '2025-08-28 01:19:54',
            shein: row.status === 'LISTED',
            sheinStatus: row.status,
            us: row.status === 'LISTED',
            usStatus: row.status
          }
        ]
      }
    ]
  }
  
  statusDialogVisible.value = true
}

// 分类弹窗相关处理函数
const handleCategoryCheck = (data: any, { checkedKeys }: any) => {
  selectedCategoryIds.value = checkedKeys
}

const handleCategoryDialogClose = () => {
  categoryDialogVisible.value = false
  currentEditProduct.value = null
  selectedCategoryIds.value = []
}

const handleCategorySave = () => {
  if (selectedCategoryIds.value.length === 0) {
    ElMessage.warning('请选择一个分类')
    return
  }
  
  if (currentEditProduct.value) {
    // 根据选中的分类ID构建分类路径
    const selectedId = selectedCategoryIds.value[0]
    const pathParts = selectedId.split('-')
    
    // 构建新的分类路径
    const newCategoryPath = pathParts.map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    )
    
    currentEditProduct.value.categoryPath = newCategoryPath
    
    ElMessage.success('分类更新成功')
    categoryDialogVisible.value = false
    
    // 刷新数据
    loadData()
  }
}

// 价格弹窗相关处理函数
const handlePriceDialogClose = () => {
  priceDialogVisible.value = false
  currentEditProduct.value = null
  batchOriginalPrice.value = ''
  batchSpecialPrice.value = ''
}

const handlePriceBatchFill = () => {
  if (!currentEditProduct.value?.priceVariants) {
    ElMessage.warning('No price variants found')
    return
  }
  
  let filled = false
  
  // 批量填写原价
  if (batchOriginalPrice.value && parseFloat(batchOriginalPrice.value) > 0) {
    currentEditProduct.value.priceVariants.forEach((variant: any) => {
      variant.originalPrice = batchOriginalPrice.value
    })
    filled = true
  }
  
  // 批量填写特价
  if (batchSpecialPrice.value && parseFloat(batchSpecialPrice.value) >= 0) {
    currentEditProduct.value.priceVariants.forEach((variant: any) => {
      variant.specialPrice = batchSpecialPrice.value
    })
    filled = true
  }
  
  if (filled) {
    ElMessage.success('Batch fill completed successfully')
    // 强制更新视图
    currentEditProduct.value = { ...currentEditProduct.value }
  } else {
    ElMessage.warning('Please enter at least one price to fill')
  }
}

const handlePriceSave = () => {
  if (currentEditProduct.value && currentEditProduct.value.priceVariants) {
    // 计算价格区间
    const prices = currentEditProduct.value.priceVariants
      .map((v: any) => parseFloat(v.originalPrice) || 0)
      .filter((p: number) => p > 0)
    
    const salePrices = currentEditProduct.value.priceVariants
      .map((v: any) => parseFloat(v.specialPrice) || 0)
      .filter((p: number) => p > 0)
    
    if (prices.length > 0) {
      currentEditProduct.value.minPrice = Math.min(...prices)
      currentEditProduct.value.maxPrice = Math.max(...prices)
      currentEditProduct.value.priceRange = prices.length > 1 && Math.min(...prices) !== Math.max(...prices)
    }
    
    if (salePrices.length > 0) {
      currentEditProduct.value.minSalePrice = Math.min(...salePrices)
      currentEditProduct.value.maxSalePrice = Math.max(...salePrices)
      currentEditProduct.value.salePriceRange = salePrices.length > 1 && Math.min(...salePrices) !== Math.max(...salePrices)
    }
    
    ElMessage.success('价格更新成功')
    priceDialogVisible.value = false
    
    // 刷新数据
    loadData()
  }
}

// 计算预计结算金额
const calculateSettlement = (price: number | string) => {
  const numPrice = parseFloat(price as string) || 0
  const settlement = numPrice * 0.9 // 假设90%结算率
  return settlement.toFixed(0)
}

// 状态弹窗相关处理函数
const handleStatusDialogClose = () => {
  statusDialogVisible.value = false
  currentEditProduct.value = null
}

const handleStatusSave = () => {
  if (currentEditProduct.value) {
    ElMessage.success('Status updated successfully')
    statusDialogVisible.value = false
    
    // 刷新数据
    loadData()
  }
}

// 复选框逻辑处理
const getCheckboxDisabled = (site: any, platform: string) => {
  // 根据当前状态决定是否禁用
  // 这里可以根据业务逻辑调整
  return false // 暂时都不禁用，允许用户自由切换
}

const handleSiteChange = (variant: any, site: any, platform: string) => {
  console.log(`${platform} status changed for ${variant.color}:`, site[platform])
  
  // 更新对应的状态
  if (platform === 'shein') {
    site.sheinStatus = site.shein ? 'LISTED' : 'DELISTED'
  } else if (platform === 'us') {
    site.usStatus = site.us ? 'LISTED' : 'DELISTED'
  }
  
  // 强制更新视图
  currentEditProduct.value = { ...currentEditProduct.value }
}

// 复制产品
const handleDuplicate = (row: any) => {
  console.log('复制产品:', row)
  ElMessage.success(`已复制产品: ${row.name}`)
}

// 编辑属性
const handleEditAttributes = (row: any) => {
  console.log('编辑属性:', row)
  ElMessage.success(`打开属性编辑器: ${row.name}`)
}

// 更多操作
const handleMoreAction = async (command: string, row: any) => {
  switch (command) {
    case 'view':
      console.log('查看详情:', row)
      ElMessage.success(`查看产品详情: ${row.name}`)
      break
    case 'viewHistory':
      console.log('查看变更历史:', row)
      ElMessage.success(`查看变更历史: ${row.name}`)
      break
    case 'sync':
      ElMessage.success(`开始同步产品到Shein: ${row.name}`)
      break
    case 'publish':
      await ElMessageBox.confirm('确定要上架此产品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      ElMessage.success('产品已上架')
      break
    case 'unpublish':
      await ElMessageBox.confirm('确定要下架此产品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      ElMessage.success('产品已下架')
      break
    case 'delete':
      await ElMessageBox.confirm('确定要删除此产品吗？此操作不可撤销。', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
      ElMessage.success('产品已删除')
      break
  }
  loadData()
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedItems.value = selection
}

// 排序变化
const handleSortChange = ({ prop, order }: { prop: string, order: string }) => {
  sortField.value = prop
  sortOrder.value = order
  loadData()
}

// 分页变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadData()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  loadData()
}

// 库存状态相关方法
const getInventoryStatusClass = (inventory: any) => {
  const status = inventory.status
  const statusMap = {
    'COMMITTED': 'committed',
    'PAYMENT_LOCKED': 'payment-locked',
    'AVAILABLE': 'available'
  }
  return statusMap[status] || 'default'
}

const getInventoryStatusText = (inventory: any) => {
  const status = inventory.status
  const statusMap = {
    'COMMITTED': '已提交',
    'PAYMENT_LOCKED': '付款已锁定',
    'AVAILABLE': '可用'
  }
  return statusMap[status] || status
}

// 上架状态相关方法
const getListingStatusType = (status: string) => {
  const statusMap = {
    'ESTIMATED_LISTING_DATE': 'warning',
    'PENDING': 'warning',
    'DELETED': 'danger',
    'TRUSTED_STATES': 'success'
  }
  return statusMap[status] || 'info'
}

const getListingStatusText = (status: string) => {
  const statusMap = {
    'ESTIMATED_LISTING_DATE': '预估上架日期',
    'PENDING': '待处理',
    'DELETED': '已删除',
    'TRUSTED_STATES': '已上架状态'
  }
  return statusMap[status] || status
}

// Format date
const formatDate = (date: Date | null) => {
  if (!date) return '-'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).format(new Date(date))
}

// Format date and time
const formatDateTime = (date: Date) => {
  if (!date) return '-'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date(date))
}

// Format price
const formatPrice = (price: number | null) => {
  if (price === null) return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

// Get category tag type
const getCategoryTagType = (level: number) => {
  const types = ['', 'success', 'warning', 'danger']
  return types[level] || ''
}

// Get status type
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    'DRAFT': 'info',
    'PENDING': 'warning',
    'LISTED': 'success',
    'DELISTED': 'info',
    'SOLD_OUT': 'warning',
    'FAILED': 'danger'
  }
  return typeMap[status] || ''
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    'DRAFT': 'Draft',
    'PENDING': 'Pending',
    'LISTED': 'Listed',
    'DELISTED': 'Delisted',
    'SOLD_OUT': 'Sold Out',
    'FAILED': 'Failed'
  }
  return textMap[status] || status
}

// Handle status change
const handleStatusChange = async (value: boolean, row: any) => {
  try {
    row.statusLoading = true
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
    ElMessage.success(`Product ${value ? 'listed' : 'delisted'} successfully`)
    row.isListed = value
  } catch (error) {
    ElMessage.error('Failed to update status')
    row.isListed = !value
  } finally {
    row.statusLoading = false
  }
}

// 历史记录相关方法
const loadHistoryData = async () => {
  historyLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    historyData.value = [...mockHistoryData]
    historyTotal.value = mockHistoryData.length
  } catch (error) {
    ElMessage.error('加载历史记录失败')
  } finally {
    historyLoading.value = false
  }
}

// History 搜索处理
const handleHistorySearch = () => {
  console.log('搜索发布历史')
  loadHistoryData()
}

// History 重置筛选
const handleHistoryResetFilters = () => {
  historySellerParentSku.value = ''
  historySellerSku.value = ''
  historySKC.value = ''
  historyProductName.value = ''
  historyBrand.value = ''
  historyCategory.value = ''
  historyDateCreatedRange.value = []
  historyDateListedRange.value = []
  historyDateAddedRange.value = []
  loadHistoryData()
}

// History 状态标签切换
const handleHistoryStatusTabChange = (statusKey: string) => {
  activeHistoryStatusTab.value = statusKey
  loadHistoryData()
}

// History 状态处理函数
const getHistoryStatusType = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return 'success'
    case 'REJECTED':
    case 'REVOKED':
      return 'danger'
    case 'PENDING_REVIEW':
    case 'PENDING_PRICE':
    case 'PENDING_FINAL_REVIEW':
      return 'warning'
    case 'APPEALING':
    case 'ARCHIVED':
      return 'info'
    default:
      return 'info'
  }
}

const getHistoryStatusText = (status: string) => {
  switch (status) {
    case 'PENDING_REVIEW':
      return 'Pending review'
    case 'PENDING_PRICE':
      return 'Pending price'
    case 'PENDING_FINAL_REVIEW':
      return 'Pending final review'
    case 'REJECTED':
      return 'Rejected'
    case 'APPEALING':
      return 'Appealing'
    case 'APPROVED':
      return 'Approved'
    case 'REVOKED':
      return 'Revoked'
    case 'ARCHIVED':
      return 'Archived'
    default:
      return 'Unknown'
  }
}

// History 操作处理函数
const handleHistoryViewDetail = (row: any) => {
  console.log('查看详情:', row)
  ElMessage.info(`View details for ${row.name}`)
}

const handleViewRejectionReason = (row: any) => {
  console.log('查看拒绝原因:', row)
  ElMessageBox.alert(
    row.rejectionReason || 'No rejection reason provided',
    'Rejection Reason',
    {
      confirmButtonText: 'OK',
      type: 'error'
    }
  )
}

const handleHistoryEdit = (row: any) => {
  console.log('编辑:', row)
  ElMessage.info(`Edit ${row.name}`)
}

const handleHistoryArchive = (row: any) => {
  console.log('归档:', row)
  ElMessageBox.confirm(
    `Are you sure you want to archive "${row.name}"?`,
    'Confirm Archive',
    {
      confirmButtonText: 'Archive',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success(`${row.name} has been archived`)
  }).catch(() => {
    ElMessage.info('Archive cancelled')
  })
}

const getActionType = (action: string) => {
  const actionMap = {
    'PUBLISH': 'success',
    'UPDATE': 'warning',
    'DELETE': 'danger',
    'CREATE': 'info'
  }
  return actionMap[action] || 'info'
}

const getActionText = (action: string) => {
  const actionMap = {
    'PUBLISH': '发布',
    'UPDATE': '更新',
    'DELETE': '删除',
    'CREATE': '创建'
  }
  return actionMap[action] || action
}

// 草稿相关方法已移至下方统一管理

const getDraftStatusType = (status: string) => {
  const statusMap = {
    'SAVED': 'success',
    'INCOMPLETE': 'warning',
    'PENDING_REVIEW': 'info'
  }
  return statusMap[status] || 'info'
}

const getDraftStatusText = (status: string) => {
  const statusMap = {
    'SAVED': '已保存',
    'INCOMPLETE': '未完成',
    'PENDING_REVIEW': '待审核'
  }
  return statusMap[status] || status
}

const handleDraftsSelectionChange = (selection: any[]) => {
  selectedDrafts.value = selection
}

// Drafts 搜索处理
const handleDraftsSearch = () => {
  console.log('搜索草稿')
  loadDraftsData()
}

// Drafts 重置筛选
const handleDraftsResetFilters = () => {
  draftsSellerParentSku.value = ''
  draftsSellerSku.value = ''
  draftsSKC.value = ''
  draftsProductName.value = ''
  draftsBrand.value = ''
  draftsCategory.value = ''
  draftsDateCreatedRange.value = []
  draftsDateListedRange.value = []
  draftsDateAddedRange.value = []
  loadDraftsData()
}

// Drafts 状态标签切换
const handleDraftsStatusTabChange = (statusKey: string) => {
  activeDraftsStatusTab.value = statusKey
  loadDraftsData()
}

// Drafts 批量操作
const handleDraftsBulkOperation = (command: string) => {
  switch (command) {
    case 'publish':
      ElMessageBox.confirm(
        `Are you sure you want to publish ${selectedDrafts.value.length} selected drafts?`,
        'Confirm Publish',
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      ).then(() => {
        console.log('批量发布草稿:', selectedDrafts.value)
        ElMessage.success('Drafts published successfully')
        selectedDrafts.value = []
        loadDraftsData()
      })
      break
    case 'delete':
      ElMessageBox.confirm(
        `Are you sure you want to delete ${selectedDrafts.value.length} selected drafts?`,
        'Confirm Delete',
        {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'error'
        }
      ).then(() => {
        console.log('批量删除草稿:', selectedDrafts.value)
        ElMessage.success('Drafts deleted successfully')
        selectedDrafts.value = []
        loadDraftsData()
      })
      break
  }
}

// 加载草稿数据
const loadDraftsData = () => {
  draftsLoading.value = true
  
  setTimeout(() => {
    let filteredData = [...mockDraftsData]
    
    // 状态筛选
    if (activeDraftsStatusTab.value !== 'all') {
      filteredData = filteredData.filter(item => 
        item.status === activeDraftsStatusTab.value.toUpperCase()
      )
    }
    
    // 搜索筛选
    if (draftsSellerParentSku.value) {
      filteredData = filteredData.filter(item => 
        item.sellerParentSku.toLowerCase().includes(draftsSellerParentSku.value.toLowerCase())
      )
    }
    
    if (draftsProductName.value) {
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(draftsProductName.value.toLowerCase())
      )
    }
    
    draftsData.value = filteredData
    draftsTotal.value = filteredData.length
    draftsLoading.value = false
  }, 500)
}

const handleCreateDraft = () => {
  ElMessage.success('跳转到新建草稿页面')
}

const handleBulkUpload = () => {
  ElMessage.success('打开批量导入对话框')
}

const handleEditDraft = (row: any) => {
  ElMessage.success(`编辑草稿: ${row.draftName}`)
}

const handlePublishDraft = async (row: any) => {
  await ElMessageBox.confirm(`确定要发布草稿 "${row.draftName}" 吗？`, '发布草稿', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  ElMessage.success(`草稿 "${row.draftName}" 已发布`)
  loadDraftsData()
}

const handleCopyDraft = (row: any) => {
  ElMessage.success(`已复制草稿: ${row.draftName}`)
  loadDraftsData()
}

const handleDeleteDraft = async (row: any) => {
  await ElMessageBox.confirm(`确定要删除草稿 "${row.draftName}" 吗？此操作不可撤销。`, '删除草稿', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'error'
  })
  ElMessage.success(`草稿 "${row.draftName}" 已删除`)
  loadDraftsData()
}
</script>

<style scoped>
.shein-product-list {
  padding: 20px;
  background-color: var(--el-bg-color-page, #f8fafc);
  min-height: 100vh;
}

/* 1. 页面标题样式 */
.page-title-section {
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: var(--el-text-color-primary, #1f2937);
  text-align: left;
}

.status-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.status-tab {
  cursor: pointer;
  transition: all 0.3s;
}

.status-tab:hover {
  opacity: 0.8;
}

/* 2. 搜索区域样式 */
.search-section {
  margin-bottom: 20px;
}

.search-card {
  border: 1px solid var(--el-border-color-light, #ebeef5);
  border-radius: 8px;
  background-color: var(--el-bg-color, #ffffff);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
}

.search-content {
  padding: 24px;
}

/* Modern Search Layout */
.search-filters-compact {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: start;
}

.search-row.primary-search {
  grid-template-columns: 2fr 1fr 1fr;
  margin-bottom: 4px;
}

.search-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-item-large {
  grid-column: span 1;
}

.search-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-primary, #303133);
  line-height: 1.4;
  margin-bottom: -4px;
}

/* Search Actions */
.search-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  margin-top: 4px;
  border-top: 1px solid var(--el-border-color-lighter, #ebeef5);
}

.search-actions-left,
.search-actions-right {
  display: flex;
  gap: 12px;
}

/* Input Styles */
:deep(.el-input__wrapper) {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-select .el-input__wrapper) {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

:deep(.el-date-editor.el-input__wrapper) {
  width: 100%;
}

/* 范围输入样式 */
.range-inputs {
  display: flex;
  align-items: center;
  gap: 6px;
}

.range-inputs .el-input {
  flex: 1;
}

.range-separator {
  color: var(--el-text-color-placeholder, #a8abb2);
  font-weight: 500;
  font-size: 12px;
  padding: 0 2px;
}

/* 操作按钮区域 */
.search-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter, #f2f3f5);
}

/* 3. 操作和状态区域样式 */
.operations-section {
  margin: 16px 0 20px;
  background-color: var(--el-bg-color, #ffffff);
  border-radius: 8px;
}

.operations-content {
  padding: 16px 20px;
}

/* Main Actions Layout */
.main-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.left-actions {
  flex: 1;
  min-width: 0;
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

/* Status Tabs */
.status-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.status-tab {
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  border: 1px solid var(--el-border-color-light);
}

.status-tab:hover {
  transform: translateY(-1px);
  border-color: var(--el-border-color-darker);
}

.status-tab.active {
  border-color: transparent;
}

.status-tab.status-tab-all {
  background-color: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary-light-5);
  color: var(--el-color-primary);
}

.status-tab.status-tab-all.active {
  background-color: var(--el-color-primary);
  color: white;
}

.status-count {
  display: inline-block;
  margin-left: 6px;
  font-weight: normal;
  opacity: 0.8;
  font-size: 12px;
}

.status-count.active {
  opacity: 1;
  color: inherit;
}

/* 统计数据样式 */
.stats-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-right: 20px;
  height: 32px; /* 与状态标签相同高度 */
  
  .stat-item {
    display: flex;
    align-items: center;
    height: 100%;
    
    .stat-content {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: var(--el-fill-color-extra-light);
      border-radius: 16px;
      border: 1px solid var(--el-border-color-lighter);
      height: 32px;
      
      .stat-label {
        font-size: 12px;
        color: var(--el-text-color-regular);
        font-weight: 500;
        white-space: nowrap;
      }
      
      .stat-value {
        font-size: 14px;
        font-weight: 700;
        color: var(--el-text-color-primary);
        
        &.published {
          color: var(--el-color-success);
        }
        
        &.remaining {
          color: var(--el-color-warning);
        }
      }
      
      .stat-value-wrapper {
        display: flex;
        align-items: center;
        gap: 4px;
        
        .stat-value {
          font-size: 14px;
          font-weight: 700;
          color: var(--el-text-color-primary);
        }
        
        .info-icon {
          font-size: 12px;
          color: var(--el-text-color-placeholder);
          cursor: help;
        }
      }
    }
  }
}

/* 响应式设计 - 统计数据 */
@media (max-width: 1400px) {
  .stats-section {
    gap: 12px;
    margin-right: 16px;
    
    .stat-item .stat-content {
      padding: 4px 10px;
      
      .stat-label {
        font-size: 11px;
      }
      
      .stat-value {
        font-size: 13px;
      }
      
      .stat-value-wrapper .stat-value {
        font-size: 13px;
      }
    }
  }
}

@media (max-width: 1200px) {
  .stats-section {
    gap: 8px;
    margin-right: 12px;
    
    .stat-item .stat-content {
      padding: 4px 8px;
      
      .stat-label {
        font-size: 10px;
      }
      
      .stat-value {
        font-size: 12px;
      }
      
      .stat-value-wrapper .stat-value {
        font-size: 12px;
      }
    }
  }
}

@media (max-width: 992px) {
  .stats-section {
    display: none; /* 在小屏幕上隐藏统计数据 */
  }
}

:deep(.el-tag.status-tab) {
  height: auto;
  line-height: 1.4;
  white-space: nowrap;
}

:deep(.el-tag.status-tab.active) {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}

/* Action Groups */
.action-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.primary-buttons {
  margin-right: 4px;
}

.export-dropdown {
  margin-right: 4px;
}

/* Batch Operations */
.batch-operations {
  display: flex;
  align-items: center;
  gap: 8px;
}

.selected-count {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
  background-color: var(--el-color-primary-light-9);
  padding: 4px 12px;
  border-radius: 4px;
  border: 1px solid var(--el-color-primary-light-5);
}

/* Action Groups Layout */
.right-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Primary Actions */
.primary-actions {
  padding-right: 16px;
  border-right: 1px solid var(--el-border-color-light);
}

.create-button {
  min-width: 100px;
}

/* Dropdown Styles */
:deep(.el-dropdown-menu) {
  padding: 8px;
  min-width: 240px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

:deep(.el-dropdown-item-group__title) {
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  background-color: var(--el-fill-color-light);
  margin: 0 -8px 4px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

:deep(.el-dropdown-item-group + .el-dropdown-item-group) {
  .el-dropdown-item-group__title {
    margin-top: 8px;
  }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 13px;
  border-radius: 6px;
  margin: 2px 8px;
  transition: all 0.2s ease;
}

:deep(.el-dropdown-menu__item .el-icon) {
  font-size: 16px;
  color: var(--el-text-color-secondary);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

:deep(.el-dropdown-menu__item.highlight-item) {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

:deep(.el-dropdown-menu__item.highlight-item .el-icon) {
  color: var(--el-color-primary);
}

.item-count {
  margin-left: auto;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  background-color: var(--el-fill-color-lighter);
  padding: 2px 8px;
  border-radius: 12px;
}

/* Hover Effects */
:deep(.el-dropdown-menu__item:not(.is-disabled):hover) {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  transform: translateX(4px);
}

:deep(.el-dropdown-menu__item:not(.is-disabled):hover .el-icon) {
  color: var(--el-color-primary);
  transform: scale(1.1);
}

:deep(.el-dropdown-menu__item.is-disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Bulk Actions Button */
.batch-operations {
  .action-button {
    min-width: 130px;
    font-weight: 500;
    
    &.can-action {
      animation: pulse 2s infinite;
    }
  }
}

/* Dividers */
:deep(.el-dropdown-menu__item.is-divided) {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
}

/* Animations */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--el-color-primary-rgb), 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(var(--el-color-primary-rgb), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--el-color-primary-rgb), 0);
  }
}

/* Selection Indicator */
.selection-indicator {
  padding: 4px 12px;
  background: var(--el-color-primary-light-9);
  border-radius: 4px;
  border: 1px solid var(--el-color-primary-light-5);
  margin: 0 8px;
}

.selection-count {
  font-size: 13px;
  color: var(--el-color-primary);
  font-weight: 500;
}

.action-divider {
  width: 1px;
  height: 24px;
  background-color: var(--el-border-color-light);
  margin: 0 8px;
}

/* Batch Operations */
.batch-operations {
  display: flex;
  align-items: center;
  gap: 8px;
}

.operation-group {
  display: flex;
  gap: 4px;
}

/* Button Base Styles */
.action-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s ease;
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color);
  color: var(--el-text-color-regular);
}

.action-button .el-icon {
  font-size: 14px;
  transition: transform 0.2s ease;
}

/* Button States */
.action-button:not(.is-disabled):hover {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary-light-7);
  background-color: var(--el-color-primary-light-9);
}

.action-button.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: var(--el-fill-color-blank);
}

.action-button.can-action {
  border-color: var(--el-color-primary-light-5);
}

/* Dropdown Styles */
.export-dropdown {
  position: relative;
}

:deep(.el-dropdown-menu) {
  padding: 4px;
  min-width: 200px;
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 13px;
  border-radius: 4px;
  margin: 2px 0;
}

:deep(.el-dropdown-menu__item .el-icon) {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

:deep(.el-dropdown-menu__item.highlight-item) {
  color: var(--el-color-primary);
}

:deep(.el-dropdown-menu__item.highlight-item .el-icon) {
  color: var(--el-color-primary);
}

.item-count {
  margin-left: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

/* Hover Effects */
:deep(.el-dropdown-menu__item:not(.is-disabled):hover) {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

:deep(.el-dropdown-menu__item:not(.is-disabled):hover .el-icon) {
  color: var(--el-color-primary);
}

/* Animation */
@keyframes highlight {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.can-action {
  animation: highlight 0.3s ease;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .right-actions {
  flex-wrap: wrap;
  }

  .primary-actions {
    border-right: none;
    padding-right: 0;
    margin-bottom: 8px;
    width: 100%;
    justify-content: flex-start;
  }

  .batch-operations {
    flex-wrap: wrap;
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .action-button {
    width: 100%;
    justify-content: center;
  }

  .operation-group {
    width: 100%;
  }

  .operation-group .action-button {
    flex: 1;
  }
}

/* Divider */
.batch-operations .el-divider--vertical {
  margin: 0;
  height: 20px;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .batch-operations {
    flex-wrap: wrap;
    gap: 8px;
  }

  .batch-operations .el-button-group,
  .batch-operations .el-button,
  .batch-operations .el-dropdown {
    flex: 1;
    min-width: calc(50% - 4px);
  }

  .batch-operations :deep(.el-button) {
    width: 100%;
    justify-content: center;
  }

  .selected-count {
    width: 100%;
    text-align: center;
  }
}

/* Button Styles */
:deep(.el-button) {
  font-weight: 500;
}

:deep(.el-button--small) {
  padding: 8px 12px;
  font-size: 13px;
}

:deep(.el-button-group .el-button) {
  padding: 8px 16px;
}

:deep(.el-dropdown__popper) {
  min-width: 160px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .main-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .right-actions {
    justify-content: space-between;
  }

  .status-tabs {
    margin-bottom: 12px;
  }
}

@media (max-width: 768px) {
  .operations-content {
    padding: 12px 16px;
  }

  .right-actions {
    flex-direction: column;
    gap: 12px;
  }

  .action-group {
    width: 100%;
    justify-content: space-between;
  }

  .batch-operations {
    width: 100%;
    justify-content: space-between;
  }

  .primary-buttons,
  .export-dropdown {
    width: 100%;
  }

  :deep(.el-button-group) {
    display: flex;
    width: 100%;
  }

  :deep(.el-button-group .el-button) {
    flex: 1;
  }
}

/* 4. 商品列表样式 */
.products-list-section {
  margin-bottom: 20px;
}

.products-list-card {
  border: 1px solid var(--el-border-color, #e5e7eb);
  border-radius: 8px;
  background-color: var(--el-bg-color, #ffffff);
}

/* 主要标签页样式 */
.main-tabs {
  margin-bottom: 20px;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab-content {
  min-height: 400px;
}

.status-tabs-wrapper {
  margin-bottom: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-header {
  padding: 0;
}

.search-and-filters-row {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.search-input-compact {
  width: 350px;
}

.search-input-expanded {
  width: 450px;
}

.filters-group-compact {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-select {
  width: 140px;
}

.date-picker-compact {
  width: 240px;
}

.advanced-filters {
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
  margin-top: 16px;
}

.advanced-filters-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  color: #374151;
  white-space: nowrap;
}

.price-input, .stock-input {
  width: 100px;
}

.price-separator, .stock-separator {
  color: #6b7280;
  margin: 0 4px;
}

.filter-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.bulk-actions-card {
  margin-bottom: 16px;
  background: var(--el-color-warning-light-9, #fef3c7);
  border: 1px solid var(--el-color-warning, #fbbf24);
}

.bulk-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.selected-count {
  font-weight: 500;
  color: var(--el-color-warning-dark-2, #92400e);
}

.bulk-buttons {
  display: flex;
  gap: 8px;
}

.table-card {
  margin-bottom: 20px;
}

.product-code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  color: #374151;
  font-weight: 500;
}

/* Table Styles */
:deep(.el-table) {
  font-size: 13px;

  .el-table__row {
    transition: all 0.2s ease;

    &:hover {
      background-color: var(--el-fill-color-lighter);
    }

    td {
      transition: all 0.2s ease;
    }

    /* SPU 层级样式 */
    &[data-level="spu"] {
      background-color: var(--el-bg-color);
      border-bottom: 2px solid var(--el-border-color-light);
      
      td {
        padding: 16px 8px;
        font-weight: 600;
      }

      &:hover {
        background-color: var(--el-fill-color-lighter);
      }
    }

    /* SKUC 层级样式 */
    &[data-level="skuc"] {
      background-color: var(--el-fill-color-light);
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background-color: var(--el-color-primary-light-5);
      }

      td {
        padding: 12px 8px;
        padding-left: 20px;
      }

      &:hover {
        background-color: var(--el-fill-color);
        
        &::before {
          background-color: var(--el-color-primary);
        }
      }
    }

    /* SKU 层级样式 */
    &[data-level="sku"] {
      background-color: var(--el-fill-color-lighter);
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background-color: var(--el-color-success-light-5);
      }

      td {
        padding: 10px 8px;
        padding-left: 40px;
        font-size: 12px;
      }

      &:hover {
        background-color: var(--el-fill-color-light);
        
        &::before {
          background-color: var(--el-color-success);
        }
      }
    }
  }

  .el-table__fixed-right-patch {
    background-color: var(--el-bg-color);
  }

  .el-table__fixed-right,
  .el-table__fixed {
    background-color: var(--el-bg-color);
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
    
    .el-table__fixed-body-wrapper {
      background-color: var(--el-bg-color);
    }
  }

  .el-table__header {
    th {
      background-color: var(--el-fill-color-light);
      font-weight: 600;
      color: var(--el-text-color-primary);
      padding: 12px 0;
    }
  }

  .el-table__body {
    td {
      padding: 12px 0;
    }
  }
}

/* Product Information Cell */
.product-info-cell {
  padding: 16px 0;

  .product-main-info {
  display: flex;
    gap: 16px;
    align-items: flex-start;

    .product-image {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      object-fit: cover;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--el-border-color);
      transition: all 0.2s ease;

      &:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }
    }

    .product-details {
      flex: 1;
      min-width: 0;

      .product-name {
        font-size: 14px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 12px;
        line-height: 1.4;
        transition: color 0.2s ease;

        &:hover {
          color: var(--el-color-primary);
        }
      }

      .product-ids {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .id-row {
          display: flex;
  gap: 12px;
          font-size: 13px;
          align-items: center;

          .id-label {
            color: var(--el-text-color-secondary);
            min-width: 120px;
            font-weight: 500;
          }

          .id-value {
            color: var(--el-text-color-regular);
            font-family: 'Monaco', 'Menlo', monospace;
            padding: 2px 6px;
            background: var(--el-fill-color-light);
  border-radius: 4px;
            transition: all 0.2s ease;

            &.highlight {
              color: var(--el-color-primary);
              font-weight: 600;
              background: var(--el-color-primary-light-9);
            }

            &:hover {
              background: var(--el-fill-color);
              transform: translateX(4px);
            }
          }
        }
      }
    }
  }
}

/* SKUC Information Cell */
.skuc-info-cell {
  padding: 16px 0;
  transition: all 0.2s ease;
}

/* SKUC List Cell */
.skuc-list-cell {
  padding: 16px 0;
  
  .skuc-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    .skuc-item {
      border: 1px solid var(--el-border-color-light);
      border-radius: 8px;
      padding: 12px;
      background: var(--el-fill-color-lighter);
      
      .skuc-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
        
        .color-section {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .color-image {
  width: 40px;
  height: 40px;
            border-radius: 6px;
            object-fit: cover;
            border: 1px solid var(--el-border-color);
          }
          
          .color-details {
            .color-name {
              font-size: 13px;
              font-weight: 600;
              color: var(--el-text-color-primary);
            }
            
            .color-code {
              font-size: 12px;
              color: var(--el-text-color-regular);
            }
          }
        }
        
        .skuc-details {
          .skuc-row {
            display: flex;
            gap: 8px;
            font-size: 13px;
            
            .skuc-label {
              color: var(--el-text-color-regular);
            }
            
            .skuc-value {
              color: var(--el-text-color-primary);
              font-weight: 600;
              
              &.highlight {
                color: var(--el-color-primary);
                background: var(--el-color-primary-light-9);
                padding: 2px 6px;
  border-radius: 4px;
              }
            }
          }
        }
      }
      
      .main-specs-section {
        .spec-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--el-text-color-regular);
          margin-bottom: 6px;
        }
        
        .spec-items {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          
          .spec-item {
            display: flex;
            gap: 4px;
            font-size: 12px;
            padding: 2px 6px;
            background: var(--el-bg-color);
            border-radius: 4px;
            border: 1px solid var(--el-border-color-lighter);
            
            .spec-label {
              color: var(--el-text-color-regular);
            }
            
            .spec-value {
              color: var(--el-text-color-primary);
              font-weight: 500;
            }
          }
        }
      }
      
      /* SKU Section within SKUC */
      .sku-section {
        margin-top: 12px;
        padding-top: 8px;
        border-top: 1px solid var(--el-border-color-lighter);
        
        .sku-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--el-text-color-regular);
          margin-bottom: 8px;
        }
        
        .sku-items-compact {
          display: flex;
          flex-direction: column;
          gap: 6px;
          
          .sku-item-compact {
            padding: 6px 8px;
            background: var(--el-fill-color-extra-light);
            border-radius: 6px;
            border: 1px solid var(--el-border-color-lighter);
            
            .sku-info-compact {
              .sku-label-compact {
                display: inline-block;
                font-size: 12px;
                font-weight: 600;
                color: var(--el-color-primary);
                background: var(--el-color-primary-light-9);
                padding: 2px 6px;
                border-radius: 4px;
                margin-bottom: 4px;
              }
              
              .sku-specs-compact {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                margin-top: 4px;
                
                .spec-tag {
                  font-size: 11px;
                  padding: 1px 4px;
                  background: var(--el-bg-color);
                  border-radius: 3px;
                  border: 1px solid var(--el-border-color-lighter);
                  color: var(--el-text-color-regular);
                }
              }
            }
          }
        }
      }
    }
    
    .skuc-divider {
      height: 1px;
      background: var(--el-border-color-light);
      margin: 8px 0;
    }
  }
}

/* Parent Product Info */
.product-main-info {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-details {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
  line-height: 1.4;
}

.product-ids {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.id-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.id-label {
  color: var(--el-text-color-secondary);
  min-width: 120px;
}

.id-value {
  color: var(--el-text-color-primary);
  font-family: 'Monaco', 'Menlo', monospace;
}

.id-value.highlight {
  color: var(--el-color-primary);
  font-weight: 500;
}

/* SKU Info */
.sku-info {
  padding: 12px 16px;
  margin: 8px 0 8px 40px;
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 50%;
    width: 20px;
    height: 2px;
    background: var(--el-border-color-lighter);
  }

  .sku-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 12px;
    padding: 16px;
    background: var(--el-bg-color);
    border-radius: 8px;
    border: 1px solid var(--el-border-color);
    margin-bottom: 12px;

    .sku-row {
      display: flex;
      gap: 12px;
      font-size: 13px;
      padding: 8px 12px;
      background: var(--el-fill-color-light);
      border-radius: 6px;
      transition: all 0.2s ease;

      &:hover {
        background: var(--el-fill-color);
        transform: translateX(4px);
      }

      .sku-label {
        color: var(--el-text-color-secondary);
        min-width: 120px;
  font-weight: 500;
      }

      .sku-value {
        color: var(--el-text-color-regular);
        font-family: 'Monaco', 'Menlo', monospace;

        &.highlight {
          color: var(--el-color-primary);
          font-weight: 600;
          padding: 0 6px;
          background: var(--el-color-primary-light-9);
          border-radius: 4px;
        }
      }
    }
  }

  .specs-section {
    padding: 16px;
    background: var(--el-bg-color);
    border-radius: 8px;
    border: 1px solid var(--el-border-color);

    .spec-item {
      display: flex;
      gap: 12px;
      padding: 8px 12px;
      font-size: 13px;
      background: var(--el-fill-color-light);
      border-radius: 6px;
      transition: all 0.2s ease;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      &:hover {
        background: var(--el-fill-color);
        transform: translateX(4px);
      }

      .spec-label {
        color: var(--el-text-color-secondary);
        min-width: 100px;
        font-weight: 500;
      }

      .spec-value {
        color: var(--el-text-color-primary);
  font-weight: 600;
      }
    }
  }
}

/* Category */
.category-path {
  padding: 8px 0;
}

.category-text {
  font-size: 13px;
  color: var(--el-text-color-primary);
  line-height: 1.4;
}

/* Category Column */
.category-path {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
  gap: 8px;

  .category-text {
    flex: 1;
    font-size: 13px;
    line-height: 1.4;
  }
}

.category-tags {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.category-tags .el-tag {
  margin-right: 0;
  text-align: left;
}

/* Price Column */
.price-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  .price-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }
}

.regular-price,
.sale-price {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  min-width: 60px;
}

.price-value {
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.price-value.has-range {
  color: var(--el-color-warning);
}

.sale-price .price-value {
  color: var(--el-color-danger);
}

/* Status Column */
.status-info {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;

  .status-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
  }

  .status-text {
    font-size: 13px;
  font-weight: 500;
    
    &.status-draft {
      color: var(--el-color-info);
    }
    
    &.status-pending {
      color: var(--el-color-warning);
    }
    
    &.status-listed {
      color: var(--el-color-success);
    }
    
    &.status-delisted {
      color: var(--el-text-color-regular);
    }
    
    &.status-sold_out {
      color: var(--el-color-warning-dark-2);
    }
    
    &.status-failed {
      color: var(--el-color-danger);
    }
  }

  .missing-info,
  .failure-info {
  margin-top: 2px;
  }

  .missing-text,
  .failure-text {
  font-size: 11px;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: help;
    
    .el-icon {
      font-size: 12px;
    }
  }

  .missing-text {
    color: var(--el-color-warning);
  }

  .failure-text {
    color: var(--el-color-danger);
  }
}

/* Missing Info Tooltip */
.missing-info-tooltip {
  .tooltip-title {
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--el-color-warning);
  }

  .missing-list {
    margin: 0;
    padding-left: 16px;
    
    li {
      margin-bottom: 4px;
      color: var(--el-text-color-primary);
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

/* Dates Column */
.dates-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  min-width: 60px;
}

.date-value {
  font-size: 12px;
  color: var(--el-text-color-primary);
}

/* Inline Edit Button */
.inline-edit-btn {
  padding: 4px 6px !important;
  min-width: auto !important;
  
  .el-icon {
    font-size: 14px;
  }
}

/* Actions Column */
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
}

.action-buttons .el-button {
  padding: 4px;
}

/* 分类编辑弹窗样式 */
.category-dialog-content {
  .current-category {
    margin-bottom: 20px;
    padding: 12px;
    background: var(--el-fill-color-lighter);
    border-radius: 6px;
    
    .label {
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
    
    .value {
      color: var(--el-color-primary);
      margin-left: 8px;
    }
  }
  
  .category-tree-section {
    .label {
      display: block;
      margin-bottom: 12px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
    
    :deep(.el-tree) {
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid var(--el-border-color);
      border-radius: 6px;
      padding: 8px;
    }
  }
}

/* 价格编辑弹窗样式 */
.price-dialog-content {
  .price-table-header {
    background: var(--el-fill-color-lighter);
    border-radius: 6px 6px 0 0;
    border: 1px solid var(--el-border-color);
    
    .header-row {
      display: flex;
      align-items: center;
      padding: 12px;
      gap: 12px;
      
      .spec-headers {
        display: flex;
        gap: 20px;
        min-width: 200px;
        
        .spec-header {
          font-weight: 600;
          color: var(--el-text-color-primary);
          font-size: 13px;
        }
      }
      
      .site-header {
        min-width: 80px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        font-size: 13px;
      }
      
      .price-headers {
        display: flex;
        gap: 20px;
        flex: 1;
        
        .price-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          min-width: 150px;
          
          span:first-child {
            font-weight: 600;
            color: var(--el-color-primary);
            font-size: 14px;
          }
          
          .batch-price-input {
            width: 120px;
            
            :deep(.el-input__inner) {
              text-align: center;
              font-size: 12px;
            }
          }
        }
      }
      
      .action-header {
        min-width: 60px;
      }
    }
  }
  
  .price-table-body {
    border: 1px solid var(--el-border-color);
    border-top: none;
    border-radius: 0 0 6px 6px;
    
    .price-row {
      display: flex;
      align-items: center;
      padding: 12px;
      gap: 12px;
      border-bottom: 1px solid var(--el-border-color-lighter);
      
      &:last-child {
        border-bottom: none;
      }
      
      &:nth-child(even) {
        background: var(--el-fill-color-extra-light);
      }
      
      .spec-values {
        display: flex;
        gap: 20px;
        min-width: 200px;
        
        .spec-value {
          font-size: 13px;
          color: var(--el-text-color-primary);
        }
      }
      
      .site-value {
        min-width: 80px;
        font-size: 13px;
        color: var(--el-text-color-primary);
      }
      
      .price-inputs {
        display: flex;
        gap: 20px;
        flex: 1;
        
        .price-input-group {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 150px;
          
          .currency {
            font-weight: 600;
            color: var(--el-color-primary);
            min-width: 35px;
          }
          
          .el-input {
            width: 80px;
          }
          
          .calculated-info {
            display: flex;
            flex-direction: column;
            font-size: 11px;
            color: var(--el-text-color-regular);
            margin-left: 8px;
            
            .calculated-label {
              white-space: nowrap;
            }
            
            .calculated-value {
              color: var(--el-text-color-primary);
              font-weight: 500;
            }
          }
          
          .calculated-value {
            font-size: 13px;
            color: var(--el-text-color-primary);
            min-width: 40px;
          }
          
          .currency-suffix {
            font-size: 13px;
            color: var(--el-text-color-regular);
          }
        }
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 状态编辑弹窗样式 */
.status-dialog-content {
  .product-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid var(--el-border-color-lighter);
    margin-bottom: 20px;
    
    .product-image {
      width: 60px;
      height: 60px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 6px;
        border: 1px solid var(--el-border-color-lighter);
      }
    }
    
    .product-info {
      .product-name {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 4px;
      }
      
      .product-spu {
        font-size: 13px;
        color: var(--el-text-color-regular);
      }
    }
  }
  
  .status-table {
    .status-header {
      display: flex;
      background: var(--el-fill-color-lighter);
      border: 1px solid var(--el-border-color);
      border-radius: 6px 6px 0 0;
      padding: 12px 16px;
      
      .color-header {
        flex: 1;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
      
      .site-header {
        flex: 2;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }
    
    .status-body {
      border: 1px solid var(--el-border-color);
      border-top: none;
      border-radius: 0 0 6px 6px;
      
      .status-row {
        display: flex;
        border-bottom: 1px solid var(--el-border-color-lighter);
        
        &:last-child {
          border-bottom: none;
        }
        
        &:nth-child(even) {
          background: var(--el-fill-color-extra-light);
        }
        
        .color-section {
          flex: 1;
          padding: 16px;
          border-right: 1px solid var(--el-border-color-lighter);
          
          .color-info {
            display: flex;
            align-items: center;
            gap: 12px;
            
            .color-image {
              width: 48px;
              height: 48px;
              object-fit: cover;
              border-radius: 4px;
              border: 1px solid var(--el-border-color-lighter);
            }
            
            .color-details {
              .color-name {
                font-size: 14px;
                font-weight: 600;
                color: var(--el-text-color-primary);
                margin-bottom: 8px;
              }
              
              .sku-info {
                display: flex;
                flex-direction: column;
                gap: 4px;
                
                div {
                  font-size: 12px;
                  color: var(--el-text-color-regular);
                }
              }
            }
          }
        }
        
        .site-section {
          flex: 2;
          padding: 16px;
          
          .site-item {
            margin-bottom: 16px;
            
            &:last-child {
              margin-bottom: 0;
            }
            
            .site-info {
              .site-time {
                margin-bottom: 12px;
                
                .time-label {
                  font-size: 12px;
                  color: var(--el-text-color-regular);
                }
              }
              
              .site-checkboxes {
                display: flex;
                flex-direction: column;
                gap: 16px;
                
                .checkbox-group {
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  
                  :deep(.el-checkbox) {
                    .el-checkbox__label {
                      font-size: 13px;
                      font-weight: 500;
                    }
                  }
                  
                  .status-indicator {
                    .status-LISTED {
                      color: var(--el-color-success);
                      font-size: 12px;
                      font-weight: 500;
                    }
                    
                    .status-DELISTED {
                      color: var(--el-color-warning);
                      font-size: 12px;
                      font-weight: 500;
                    }
                    
                    .status-PENDING {
                      color: var(--el-color-info);
                      font-size: 12px;
                      font-weight: 500;
                    }
                    
                    .status-FAILED {
                      color: var(--el-color-danger);
                      font-size: 12px;
                      font-weight: 500;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

.action-buttons .el-icon {
  font-size: 16px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

:deep(.el-table) {
  font-size: 13px;
}

:deep(.el-table th) {
  background-color: #f9fafb;
  font-weight: 600;
  font-size: 12px;
}

:deep(.el-table td) {
  padding: 8px 0;
}

:deep(.el-tag) {
  border-radius: 4px;
  font-size: 11px;
}

:deep(.el-button--small) {
  padding: 4px 8px;
  font-size: 11px;
}

:deep(.el-table .el-table__fixed-right) {
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
}

:deep(.el-table .el-table__fixed) {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

/* History 页面样式 */
.history-table-card {
  margin-top: 20px;
}

.history-product-info {
  .product-main {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .product-thumb {
      width: 60px;
      height: 60px;
      border-radius: 6px;
      border: 1px solid var(--el-border-color-lighter);
    }
    
    .product-details {
      .product-name {
        font-size: 14px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 8px;
        line-height: 1.4;
      }
      
      .product-codes {
        .code-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
          
          .code-label {
            font-size: 12px;
            color: var(--el-text-color-regular);
            min-width: 35px;
          }
          
          .code-value {
            font-size: 12px;
            color: var(--el-text-color-primary);
            font-weight: 500;
          }
        }
      }
    }
  }
}

.skc-info {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .color-thumb {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    border: 1px solid var(--el-border-color-lighter);
  }
  
  .skc-details {
    .color-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 6px;
    }
    
    .skc-code,
    .sku-code {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 3px;
      
      .code-label {
        font-size: 11px;
        color: var(--el-text-color-regular);
        min-width: 30px;
      }
      
      .code-value {
        font-size: 11px;
        color: var(--el-text-color-primary);
        font-weight: 500;
      }
    }
  }
}

.record-id {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: var(--el-text-color-primary);
  font-weight: 500;
}

/* 操作按钮竖向排列 */
.action-buttons-vertical {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
  
  .el-button {
    margin: 0 !important;
    padding: 2px 8px !important;
    min-height: auto !important;
    font-size: 12px !important;
    line-height: 1.2 !important;
    
    &.is-link {
      padding: 2px 0 !important;
    }
  }
}

/* 草稿表格卡片 */
.drafts-table-card {
  margin-top: 16px;
  border: 1px solid var(--el-border-color-light);
  
  :deep(.el-card__body) {
    padding: 0;
  }
}

.history-filters {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.history-product {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-change {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Drafts 页面样式 */
.drafts-card {
  margin-bottom: 20px;
}

.drafts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.drafts-filters {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.drafts-actions {
  display: flex;
  gap: 8px;
}

.draft-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.draft-name {
  font-weight: 500;
  color: var(--el-text-color-primary, #1f2937);
}

.draft-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary, #6b7280);
}

/* Element Plus 标签页样式覆盖 */
:deep(.el-tabs__header) {
  margin: 0 0 20px 0;
  border-bottom: 1px solid var(--el-border-color-light, #e4e7ed);
}

:deep(.el-tabs__nav-wrap) {
  padding: 0 20px;
}

:deep(.el-tabs__item) {
  padding: 0 20px;
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-regular, #606266);
}

:deep(.el-tabs__item.is-active) {
  color: var(--el-color-primary, #409eff);
}

:deep(.el-tabs__item:hover) {
  color: var(--el-color-primary, #409eff);
}

/* Responsive Design */
@media (max-width: 1600px) {
  .search-row {
    gap: 16px;
  }
  
  .search-row.primary-search {
    grid-template-columns: 1.5fr 1fr 1fr;
  }
}

@media (max-width: 1400px) {
  .search-content {
    padding: 20px;
  }
  
  .search-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .search-row.primary-search {
    grid-template-columns: 2fr 1fr;
  }
  
  .search-item-large {
    grid-column: span 2;
  }
}

@media (max-width: 1200px) {
  .search-filters-compact {
    gap: 16px;
  }
  
  .search-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .search-row.primary-search {
    grid-template-columns: 1fr;
  }
  
  .search-item-large {
    grid-column: span 1;
  }
  
  .batch-operations-area {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .batch-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 992px) {
  .search-content {
    padding: 16px;
  }
  
  .search-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .search-actions {
    flex-direction: column-reverse;
    gap: 12px;
  }
  
  .search-actions-left,
  .search-actions-right {
    width: 100%;
  }
  
  .search-actions-left .el-button,
  .search-actions-right .el-button {
    width: 100%;
  }
  
  .drafts-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .history-filters {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .shein-product-list {
    padding: 12px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .search-filters-compact {
    gap: 12px;
  }
  
  .search-label {
    font-size: 12px;
  }
  
  .batch-operations-area {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .batch-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .status-tabs {
    flex-direction: column;
    gap: 8px;
  }
  
  .status-tab {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .shein-product-list {
    padding: 8px;
  }
  
  .search-content {
    padding: 12px;
  }
  
  .search-filters-compact {
    gap: 8px;
}

  .search-row {
    gap: 8px;
  }
  
  :deep(.el-date-editor.el-input__wrapper) {
    width: 100% !important;
  }
}
</style>

