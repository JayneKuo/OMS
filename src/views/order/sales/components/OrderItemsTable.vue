<template>
  <div class="order-items-table">
    <el-table 
      :data="testProducts" 
      style="width: 100%"
      :expand-row-keys="expandedRows"
      row-key="id"
      size="small"
      :row-class-name="getRowClassName"
    >
      <!-- Product -->
      <el-table-column 
        prop="product"
        label="PRODUCT" 
        min-width="30%"
        class-name="no-wrap product-column"
      >
        <template #default="{ row }">
          <div class="product-info">
            <template v-if="row.name">
              <div class="product-name">{{ row.name }}</div>
              <div class="product-meta">
                <div class="sku-line">
                  <span class="sku-code">SKU: {{ row.snCode }}</span>
                </div>
                <span v-if="row.poLineNo" class="po-line">PO Line: {{ row.poLineNo }}</span>
                <div v-if="row.isOnHold" class="hold-info">
                  <el-tag 
                    size="small" 
                    type="warning" 
                    effect="plain" 
                    class="status-tag"
                  >
                    ON HOLD
                  </el-tag>
                  <span class="hold-reason">{{ row.holdReason || 'Pending review' }}</span>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="product-meta">
                <div class="sku-line">
                  <span class="sku-code">SKU: {{ row.snCode }}</span>
                </div>
                <span v-if="row.poLineNo" class="po-line">PO Line: {{ row.poLineNo }}</span>
                <div v-if="row.isOnHold" class="hold-info">
                  <el-tag 
                    size="small" 
                    type="warning" 
                    effect="plain" 
                    class="status-tag"
                  >
                    ON HOLD
                  </el-tag>
                  <span class="hold-reason">{{ row.holdReason || 'Pending review' }}</span>
                </div>
              </div>
            </template>
          </div>
        </template>
      </el-table-column>

      <!-- Qty -->
      <el-table-column 
        prop="qty"
        label="QTY" 
        min-width="10%"
        align="right"
        class-name="no-wrap"
      >
        <template #default="{ row }">
          <span class="mono">{{ row.shouldDispatchQuantity }}</span>
        </template>
      </el-table-column>

      <!-- Dispatched -->
      <el-table-column 
        prop="dispatched"
        label="DISPATCHED" 
        min-width="12%"
        align="right"
        class-name="no-wrap"
      >
        <template #default="{ row }">
          <span class="mono" :class="{ 'fulfilled': row.dispatchedQuantity > 0 }">
            {{ row.dispatchedQuantity }}
          </span>
          <span class="mono quantity-separator">/</span>
          <span class="mono">{{ row.shouldDispatchQuantity }}</span>
        </template>
      </el-table-column>

      <!-- Unit Price -->
      <el-table-column 
        prop="unitPrice"
        label="UNIT PRICE" 
        min-width="12%"
        align="right"
        class-name="no-wrap"
      >
        <template #default="{ row }">
          <span class="mono">${{ formatPrice(row.price) }}</span>
        </template>
      </el-table-column>

      <!-- UOM -->
      <el-table-column 
        prop="uom"
        label="UOM" 
        min-width="8%"
        align="center"
        class-name="no-wrap"
      >
        <template #default="{ row }">
          <span class="mono">{{ row.uom }}</span>
        </template>
      </el-table-column>

      <!-- SN Product -->
      <el-table-column 
        prop="snProduct"
        label="SN PRODUCT" 
        min-width="15%"
        align="center"
        class-name="no-wrap"
      >
        <template #default="{ row }">
          <span class="mono">{{ row.snProduct || '-' }}</span>
        </template>
      </el-table-column>

      <!-- Price -->
      <el-table-column 
        prop="price"
        label="PRICE" 
        min-width="12%"
        align="right"
        class-name="no-wrap"
      >
        <template #default="{ row }">
          <span class="mono">${{ formatPrice(row.price * row.shouldDispatchQuantity) }}</span>
        </template>
      </el-table-column>

      <!-- Discount -->
      <el-table-column 
        prop="discount"
        label="DISCOUNT" 
        min-width="10%"
        align="right"
        class-name="no-wrap"
      >
        <template #default="{ row }">
          <span v-if="row.discount > 0" class="mono discount">
            -${{ formatPrice(row.discount) }}
          </span>
          <span v-else class="mono">-</span>
        </template>
      </el-table-column>

      <!-- Total -->
      <el-table-column 
        prop="total"
        label="TOTAL" 
        min-width="13%"
        align="right"
        class-name="no-wrap"
        fixed="right"
      >
        <template #default="{ row }">
          <span class="mono">${{ formatPrice(calculateLineTotal(row)) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { EnhancedProduct } from '../types'

// 测试数据
const testProducts: EnhancedProduct[] = [
  {
    id: '1',
    name: '蓝色连衣裙',
    category: 'Clothing',
    snCode: 'SN001234567',
    poLineNo: 'PO-001',
    uom: 'PCS',
    price: 199.99,
    discount: 20,
    tax: 10,
    color: 'Blue',
    originalQuantity: 2,
    shouldDispatchQuantity: 2,
    dispatchedQuantity: 1,  // 已下发1件
    shippedQuantity: 0,
    fulfillmentQuantity: 2,
    cancelledQuantity: 0,
    returnedQuantity: 0,
    exchangedQuantity: 0,
    refundedQuantity: 0,
    productStatus: '待发货',
    fulfillmentStatus: 'Pending',
    hasOperations: false,
    operationTypes: [],
    history: [],
    isOnHold: true,  // 商品处于 hold 状态
    holdReason: 'Order matched pre-sale rule: Product will continue fulfillment after Sep 09, 2025 09:00 AM (Pre-sale Activity Rule #PS20240001)'
  },
  {
    id: '2',
    name: '',
    category: 'Clothing',
    snCode: 'SN001234568',
    poLineNo: 'PO-002',
    uom: 'PCS',
    price: 299.99,
    discount: 0,
    tax: 15,
    color: 'Red',
    originalQuantity: 1,
    shouldDispatchQuantity: 1,
    dispatchedQuantity: 1,  // 已全部下发
    shippedQuantity: 0,
    fulfillmentQuantity: 1,
    cancelledQuantity: 0,
    returnedQuantity: 0,
    exchangedQuantity: 0,
    refundedQuantity: 0,
    productStatus: '待发货',
    fulfillmentStatus: 'Pending',
    hasOperations: false,
    operationTypes: [],
    history: [],
    isOnHold: true,
    holdReason: '质检不通过，等待品控确认'
  },
  {
    id: '3',
    name: '黑色运动鞋',
    category: 'Shoes',
    snCode: 'SN001234569',
    uom: 'PAIR',
    price: 499.99,
    discount: 50,
    tax: 25,
    color: 'Black',
    originalQuantity: 1,
    shouldDispatchQuantity: 1,
    dispatchedQuantity: 0,  // 未下发
    shippedQuantity: 0,
    fulfillmentQuantity: 1,
    cancelledQuantity: 0,
    returnedQuantity: 0,
    exchangedQuantity: 0,
    refundedQuantity: 0,
    productStatus: '待发货',
    fulfillmentStatus: 'Pending',
    hasOperations: false,
    operationTypes: [],
    history: [],
    isOnHold: false
  }
]

// Props定义
const props = defineProps<{
  products: EnhancedProduct[]
}>()

// 展开行控制
const expandedRows = ref<string[]>([])

// 格式化价格
const formatPrice = (price: number): string => {
  return price.toFixed(2)
}

// 计算商品行总价
const calculateLineTotal = (product: EnhancedProduct): number => {
  const subtotal = product.price * product.shouldDispatchQuantity
  const discountRatio = product.shouldDispatchQuantity / product.originalQuantity
  const discountAmount = product.discount * discountRatio
  const taxAmount = product.tax * discountRatio
  return subtotal - discountAmount + taxAmount
}

// 根据行状态返回类名
const getRowClassName = (row: EnhancedProduct) => {
  return row.isOnHold ? 'row-on-hold' : ''
}
</script>

<style lang="scss" scoped>
.order-items-table {
  :deep(.el-table) {
    --el-table-border-color: rgba(255, 255, 255, 0.1);
    --el-table-header-bg-color: rgba(255, 255, 255, 0.02);
    --el-table-tr-bg-color: transparent;
    --el-table-row-hover-bg-color: rgba(255, 255, 255, 0.02);
    
    .product-column {
      .cell {
        white-space: normal;
        padding-right: 24px;
      }
    }

    .product-info {
      .product-name {
        color: #e1e3e6;
        font-weight: 500;
        margin-bottom: 2px;
      }
      
      .product-meta {
        .sku-line {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 2px;

          .sku-code {
            color: #8b949e;
            font-size: 12px;
            font-family: 'Roboto Mono', monospace;
          }
        }

        .po-line {
          color: #8b949e;
          font-size: 12px;
          font-family: 'Roboto Mono', monospace;
          display: block;
          margin-bottom: 2px;
        }

        .hold-info {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 4px;
          padding-top: 4px;
          border-top: 1px dashed rgba(255, 149, 0, 0.2);

          .status-tag {
            flex-shrink: 0;
            font-weight: 500;
            font-size: 11px;
            padding: 0 8px;
            height: 20px;
            line-height: 18px;
            background: rgba(255, 149, 0, 0.1);
            border-color: rgba(255, 149, 0, 0.2);
            color: #ff9500;
          }

          .hold-reason {
            color: #ff9500;
            font-size: 12px;
            opacity: 0.8;
            white-space: normal;
            word-break: break-all;
            line-height: 1.5;
          }
        }
      }
    }

    // 当行处于 on hold 状态时的背景色
    .row-on-hold {
      background-color: rgba(255, 149, 0, 0.02);
      
      &:hover > td.el-table__cell {
        background-color: rgba(255, 149, 0, 0.04) !important;
      }
      
      td.el-table__cell {
        background-color: rgba(255, 149, 0, 0.02);
      }
    }
    
    .mono {
      font-family: 'Roboto Mono', monospace;
      font-size: 12px;
      color: #e1e3e6;
      
      &.discount {
        color: #ff3b30;
      }

      &.fulfilled {
        color: #34c759;
        font-weight: 500;
      }
    }

    .quantity-separator {
      margin: 0 2px;
      color: #8b949e;
    }

    .no-wrap {
      .cell {
        white-space: nowrap;
      }
    }

    th.el-table__cell {
      background-color: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 12px;
      color: #8b949e;
      font-weight: 500;
    }

    td.el-table__cell {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
  }
}
</style> 