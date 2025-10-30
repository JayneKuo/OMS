# Category Mapping Dialog Fix

## Issue
The category mapping dialog was only displaying first-level categories (e.g., "女装" and "男装") instead of showing the complete multi-level tree structure (Level 1 → Level 2 → Level 3 → Level 4). Additionally, all text in the dialog was in Chinese instead of English.

## Root Cause
The `getPlatformCategories` API function in `src/api/product/category.ts` was only processing the first level of categories using `.map()`, which didn't recursively handle child nodes. Although `defaultCategories` already had a tree structure with `children` properties, the API was not preserving this nested structure.

## Changes Made

### 1. Fixed API Function (`src/api/product/category.ts`)

**Before:**
- Used `.map()` to create flat array
- Attempted to rebuild tree structure using a `buildTree` function
- This approach only captured first-level categories

**After:**
- Created a recursive `convertTree` function that properly processes all levels
- Recursively handles `children` arrays at every level
- Preserves the complete tree structure from `defaultCategories`

```typescript
const convertTree = (categories: any[]): any[] => {
  return categories.map(category => {
    const converted: any = {
      id: `${platform}_${category.id}`,
      name: category.name,
      platform,
      originalId: category.code,
      path: category.path,
      level: category.level,
      parentId: category.parentId ? `${platform}_${category.parentId}` : null,
      lastSyncTime: new Date().toISOString(),
      status: 'active' as const
    }

    // Recursively process child nodes
    if (category.children && category.children.length > 0) {
      converted.children = convertTree(category.children)
    }

    return converted
  })
}
```

### 2. Internationalized UI (`src/views/product/components/CategoryMappingDialog.vue`)

**Changes:**
- Translated dialog title from "映射分类: " to "Map Category: "
- Translated labels:
  - "分类名称：" → "Category Name:"
  - "分类编码：" → "Category Code:"
  - "分类路径：" → "Category Path:"
- Translated placeholder: "搜索平台分类" → "Search platform categories"
- Translated selected category title: "已选平台分类：" → "Selected Platform Category:"
- Translated buttons: "取消" → "Cancel", "确认映射" → "Confirm Mapping"
- Translated success/error messages:
  - "获取平台分类失败" → "Failed to load platform categories"
  - "映射成功" → "Mapping successful"
  - "映射失败" → "Mapping failed"
- Updated all comments to English
- Added `default-expand-all` prop to `el-tree` for better UX
- Added `console.log` for debugging API data

## Result

Now when users:
1. Click "Manage Platform Mappings" button for any category
2. Select a platform (Shein, Amazon, or Shopify)

The tree will display:
- **Level 1**: 女装 (WOMEN), 男装 (MEN)
  - **Level 2**: 上装 (TOP), 下装 (BOTTOM)
    - **Level 3**: T恤 (TSHIRT), 衬衫 (SHIRT), 裤装 (PANTS), 裙装 (SKIRTS)
      - **Level 4**: 短袖T恤 (TSHIRT_SHORT), 长袖T恤 (TSHIRT_LONG), etc.

All UI text is now in English for consistency with the rest of the application.

## Testing
- Open the category list
- Select any leaf category (Level 4)
- Click "Manage Platform Mappings"
- Select a platform (Shein/Amazon/Shopify)
- Verify all 4 levels are displayed in the tree
- Verify all text is in English
- Verify you can expand/collapse tree nodes
- Verify search functionality works across all levels

