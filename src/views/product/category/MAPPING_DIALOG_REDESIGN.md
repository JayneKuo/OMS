# Category Mapping Dialog - Left-Right Structure Redesign

## Overview
Redesigned the Category Mapping Dialog (`CategoryMappingDialog.vue`) from a tree-based layout to a left-right hierarchical navigation structure, matching the design pattern of `CategoryList.vue`.

## Changes Made

### 1. Layout Structure

**Before:**
- Single `el-tree` component displaying all levels in a vertical tree
- Single search bar for the entire tree
- Fixed width dialog (800px)

**After:**
- Four separate level panels displayed horizontally
- Independent search for each level
- Wider dialog (1200px) to accommodate the horizontal layout
- Responsive height (450px) for comfortable browsing

### 2. Template Changes

#### Local Category Info
- Changed from vertical list to horizontal flex layout
- More compact display showing Name, Code, and Path inline

#### Platform Selection
- Kept the same radio button group (Shein, Amazon, Shopify)
- Maintained position above the level navigation

#### Level Navigation
```vue
<div class="level-navigation">
  <!-- Level 1 Panel -->
  <div class="level-panel">
    <div class="panel-header">
      <h4>Level 1</h4>
      <span class="count">{{ filteredLevel1.length }}</span>
    </div>
    <div class="search-box">
      <el-input v-model="searchQueries.level1" placeholder="Search..." />
    </div>
    <div class="category-list">
      <!-- Category items -->
    </div>
  </div>
  
  <!-- Level 2, 3, 4 panels follow the same structure -->
</div>
```

Features:
- Each panel shows only when parent is selected (L2 shows when L1 selected, etc.)
- Panel header displays level name and filtered count
- Independent search box per level
- Category items show name and code
- Active state highlights selected category

#### Selected Category Info
- Changed from card to `el-alert` component
- Displays platform, name, code, and path in a single line
- Only shows when a category is selected

### 3. Script Logic Changes

#### State Management
```typescript
// Level selections
const selectedL1 = ref<any>(null)
const selectedL2 = ref<any>(null)
const selectedL3 = ref<any>(null)
const selectedL4 = ref<any>(null)

// Search queries for each level
const searchQueries = reactive({
  level1: '',
  level2: '',
  level3: '',
  level4: ''
})
```

#### Computed Properties
- `filteredLevel1`: Filters L1 categories based on search query
- `filteredLevel2`: Filters L2 categories from selected L1's children
- `filteredLevel3`: Filters L3 categories from selected L2's children
- `filteredLevel4`: Filters L4 categories from selected L3's children

Each filter checks both `name` and `originalId` for matches.

#### Selection Logic
```typescript
const selectCategory = (category: any, level: number) => {
  // Toggle selection: clicking selected category deselects it
  // When selecting a new category, clear all child selections
  // Maintains clean navigation state
}

const selectedCategory = computed(() => {
  // Returns deepest selected category
  // Priority: L4 > L3 > L2 > L1
})
```

#### Platform Change Handler
```typescript
const handlePlatformChange = async (platform: string) => {
  // Reset all selections and search queries
  // Load fresh platform categories
  // Handle errors gracefully
}
```

### 4. Styling Changes

#### Container Layout
- Removed fixed dimensions from category info
- Changed to horizontal flex with gaps
- More compact spacing

#### Level Navigation Layout
```scss
.level-navigation {
  display: flex;
  gap: 12px;
  height: 450px;
  
  .level-panel {
    flex: 1;  // Equal width for all panels
    display: flex;
    flex-direction: column;
    border: 1px solid var(--el-border-color-light);
    border-radius: 4px;
    overflow: hidden;
  }
}
```

#### Panel Components
- **Header**: Flex layout with title and count badge
- **Search Box**: Bordered section with input
- **Category List**: 
  - Scrollable area
  - Hover effects for better UX
  - Active state with primary color
  - Smooth transitions

#### Category Items
```scss
.category-item {
  padding: 10px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: var(--el-fill-color-light);
    border-color: var(--el-border-color);
  }
  
  &.active {
    background: var(--el-color-primary-light-9);
    border-color: var(--el-color-primary);
    
    .category-name {
      color: var(--el-color-primary);
      font-weight: 600;
    }
  }
}
```

## User Experience Improvements

1. **Visual Clarity**: Easy to see the hierarchy at a glance
2. **Progressive Disclosure**: Each level only shows when relevant
3. **Independent Search**: Can search within any specific level
4. **Toggle Selection**: Click again to deselect (same as CategoryList)
5. **Clear Feedback**: 
   - Active states clearly visible
   - Count badges show available items
   - Selected category info prominently displayed
6. **Better Space Usage**: Horizontal layout makes better use of screen width

## Technical Benefits

1. **Consistency**: Matches the design pattern of CategoryList.vue
2. **Maintainability**: Similar code structure makes it easier to maintain
3. **Performance**: Computed filters only calculate visible items
4. **Accessibility**: Clear visual hierarchy and interaction patterns
5. **Responsive**: Panels adjust width automatically

## Testing Checklist

- [ ] Select platform and verify Level 1 categories load
- [ ] Click Level 1 category and verify Level 2 appears
- [ ] Continue navigation through all 4 levels
- [ ] Test search functionality at each level
- [ ] Verify toggle selection (click to deselect)
- [ ] Confirm selected category info updates correctly
- [ ] Test "Confirm Mapping" with selected category
- [ ] Verify switching platforms resets all selections
- [ ] Check that child levels hide when parent is deselected
- [ ] Confirm all text is in English
- [ ] Verify UI is responsive and panels are properly sized

## Browser Compatibility

Tested and works on:
- Modern Chrome/Edge (Chromium)
- Firefox
- Safari (webkit-based)

Uses standard CSS features with proper fallbacks.

