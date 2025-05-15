# Multi-Platform Query Tool Documentation

## 1. Product Overview

The Multi-Platform Query Tool is an integrated data query platform designed to help users quickly query and manage orders and product data across different platforms. This tool provides a unified query interface, supporting filtering, displaying, and exporting data by different dimensions, improving the efficiency of data query and management.

### 1.1 Feature Overview

- **Multi-Platform Data Integration**: Integrates data from different e-commerce platforms (such as Amazon, Shopify, eBay, Walmart)
- **Multi-Dimensional Query**: Supports queries by customer, channel, order number, and other dimensions
- **Order Query**: Query channel order information, including order status, shipping status, etc.
- **Product Query**: Query channel product information, including inventory information, synchronization rules, etc.
- **Detail View**: Support viewing order details, product inventory details
- **Data Export**: Support exporting query results

## 2. Technical Architecture

### 2.1 Frontend Architecture

- **Framework**: Vue 3 + TypeScript
- **UI Component Library**: Element Plus
- **State Management**: Composition API
- **Routing**: Vue Router

### 2.2 Data Models

#### Customer Information
```typescript
interface Customer {
  id: string;     // Customer ID
  name: string;   // Customer Name
  code: string;   // Customer Code
}
```

#### Channel Information
```typescript
interface Channel {
  id: string;     // Channel ID
  name: string;   // Channel Name
  code: string;   // Channel Code
  type: string;   // Channel Type (marketplace, ecommerce)
}
```

#### Order Data
```typescript
interface OrderData {
  channelOrderId: string;      // Channel Order ID
  systemOrderId?: string;      // System Order ID
  channel: string;             // Channel
  status?: string;             // System Status
  customerName: string;        // Customer Name
  amount: number;              // Order Amount
  createTime: number;          // Creation Timestamp
  items: OrderItem[];          // Order Items
  channelStatus?: string;      // Channel Status
  store?: string;              // Store
  systemCreateTime?: number;   // System Creation Time
}
```

#### Order Item
```typescript
interface OrderItem {
  sku: string;                  // Product SKU
  productName: string;          // Product Name
  quantity: number;             // Quantity
  price: number;                // Unit Price
  total: number;                // Total Price
  fulfillmentStatus?: string;   // Fulfillment Status
}
```

#### Product Data
```typescript
interface ProductData {
  sku: string;                 // Product SKU
  productName: string;         // Product Name
  channelSku: string;          // Channel SKU
  channel: string;             // Channel
  price: number;               // Price
  status: string;              // Status
  imageUrl?: string;           // Image URL
  updateTime: number;          // Update Timestamp
  store?: string;              // Store
  stock?: number;              // Channel Stock
  wmsStock?: number;           // WMS Stock
  lastSyncStock?: number;      // Last Synced Stock Quantity
  lastSyncTime?: number;       // Last Sync Time
  customerName?: string;       // Customer Name
  masterSku?: string;          // Master SKU
  masterProductName?: string;  // Master Product Name
  warehouseStock?: {           // Warehouse Stock Details
    US?: number;
    EU?: number;
    CN?: number;
    UK?: number;
    [key: string]: number | undefined;
  };
  syncRule?: {                 // Sync Rule
    type: 'percent' | 'fixed' | 'reduce';  // Sync Type
    value: number;                         // Value
    method?: 'percent' | 'fixed';          // Method
  };
}
```

#### Query Parameters
```typescript
interface QueryParams {
  customer: string;            // Customer
  channel: string;             // Channel
  type: 'order' | 'product';   // Query Type
  page: number;                // Page Number
  pageSize: number;            // Page Size
  
  // Order Query Fields
  channelOrderId?: string;     // Channel Order ID
  systemOrderId?: string;      // System Order ID
  orderStatus?: string;        // Order Status
  channelStatus?: string;      // Channel Status
  startDate?: string;          // Start Date
  endDate?: string;            // End Date
  
  // Product Query Fields
  productName?: string;        // Product Name
  sku?: string;                // SKU
  productStatus?: string;      // Product Status
  minPrice?: number;           // Minimum Price
  maxPrice?: number;           // Maximum Price
}
```

## 3. Feature Modules in Detail

### 3.1 Query Form Module

#### 3.1.1 Basic Query Fields
- **Customer Selection**: Required field, select from the preset customer list
- **Channel Selection**: Required field, dynamically load the corresponding channel list based on the selected customer
- **Query Type**: Choose between "Channel Orders" or "Channel Products"

#### 3.1.2 Order Query Fields
Displayed when the query type is "Channel Orders":
- **Platform Order Number**: Input field, supports fuzzy query
- **System Order Number**: Input field, supports fuzzy query
- **System Status**: Dropdown selection, including: All, Completed, Processing, Pending, Error
- **Channel Shipping Status**: Dropdown selection, including: All, Shipped, Processing, Pending, Unshipped, Delivered, Error
- **Order Date**: Date range picker

#### 3.1.3 Product Query Fields
Displayed when the query type is "Channel Products":
- **Product Name**: Input field, supports fuzzy query
- **SKU**: Input field, supports querying SKU or Channel SKU

#### 3.1.4 Operation Buttons
- **Search Button**: Triggers the query, validates required fields before executing the query logic
- **Reset Button**: Clears all query conditions, resets the form
- **Export Button**: Exports the current query result data

### 3.2 Query Results Module

#### 3.2.1 Order Query Results Table
Displayed when the query type is "Channel Orders", contains the following columns:
- **Customer Name**: Displays the customer to which the order belongs
- **Channel**: Displays the channel to which the order belongs
- **Store Name**: Displays the store to which the order belongs
- **Channel Order Number**: Displays the order number on the channel platform
- **Channel Shipping Status**: Displays the shipping status of the order on the channel platform with a tag
- **Channel Order Time**: Formats and displays the creation time of the order on the channel
- **System Order Number**: If there is an associated system order, displays it as a clickable link, otherwise displays "-"
- **System Order Status**: Displays the order status in the system with a colored tag, with colors corresponding to different statuses
- **System Creation Time**: Formats and displays the order creation time in the system
- **Operations**: Provides a "View Details" button, clicking it opens the order details dialog

#### 3.2.2 Product Query Results Table
Displayed when the query type is "Channel Products", contains the following columns:
- **Customer Name**: Displays the customer to which the product belongs
- **Channel**: Displays the channel to which the product belongs
- **Store Name**: Displays the store to which the product belongs
- **Product Name**: Displays the product name, supports text overflow tooltip
- **SKU**: Displays the SKU, if there is a Channel SKU, it is displayed in smaller text below
- **Master SKU**: Displays the Master SKU, if available displays as a link style, otherwise displays "-"
- **Master Product Name**: Displays the Master Product Name, if none displays "-"
- **Channel Stock**: Right-aligned display of the channel stock quantity
- **WMS Stock**: Right-aligned display of the WMS stock, hover to show stock details
  - Hover popup shows stock in each warehouse: US Warehouse, EU Warehouse, China Warehouse, UK Warehouse
- **Last Synced Stock**: Right-aligned display of the recently synchronized stock quantity, hover to show synchronization rules
  - Hover popup shows sync mode, sync ratio/fixed quantity, last sync time, etc.
  - Supports three sync modes: Percentage Sync, Fixed Quantity, Reduction Sync
- **Last Sync Time**: Formats and displays the time of the last inventory synchronization

#### 3.2.3 Pagination Controls
- Supports page switching, page size adjustment
- Provides total record count display
- Page size options: 10/20/50/100 items per page

### 3.3 Order Details Dialog

The order details dialog displays detailed information about the order in a popup form, including:

#### 3.3.1 Order Basic Information
- **Order Number**: Displays the channel order number
- **Order Status**: Displays the channel order status
- **Customer Information**: Displays the customer name
- **Channel Information**: Displays the channel name
- **Store Information**: Displays the store name
- **Order Time**: Displays the order creation time

#### 3.3.2 Order Items List
Displays the product details in the order in table form:
- **Product Name**: Displays the product name
- **SKU**: Displays the product SKU
- **Unit Price**: Displays the product unit price, right-aligned
- **Quantity**: Displays the purchase quantity, center-aligned
- **Subtotal**: Displays the total price of the individual product, right-aligned
- **Fulfillment Status**: Displays the fulfillment status of the product with colored tags

#### 3.3.3 Order Amount
- **Order Total**: Displays the total amount of the order

## 4. Functional Logic in Detail

### 4.1 Data Retrieval Logic

#### 4.1.1 Customer Data Loading
- Get customer list from the `customers` array
- Convert to dropdown option format: `{ label: customer.name, value: customer.id }`

#### 4.1.2 Channel Data Loading
- Get the corresponding channel list from `channelMap` based on the selected customer ID
- Convert to dropdown option format: `{ label: channel.name, value: channel.id }`
- When the customer selection changes, clear the channel selection and reload the channel list

#### 4.1.3 Order Data Query
When querying orders, the following filtering logic is executed:
1. Filter by selected customer (by matching customer name)
2. Filter by selected channel
3. Filter by entered channel order number (includes matching)
4. Filter by entered system order number (includes matching)
5. Filter by selected order status
6. Filter by selected channel status
7. Filter by selected date range
8. Calculate total record count and paginate the results

#### 4.1.4 Product Data Query
When querying products, the following filtering logic is executed:
1. Filter by selected customer (by filtering channels associated with the customer)
2. Filter by selected channel
3. Filter by entered product name (includes matching)
4. Filter by entered SKU (supports includes matching for both SKU and channel SKU)
5. Filter by selected product status
6. Filter by price range (if set)
7. Calculate total record count and paginate the results

### 4.2 Display Logic

#### 4.2.1 Conditional Rendering Logic
- Conditionally display different query fields and result tables based on the `queryForm.type` value
- Order type displays order query fields and order results table
- Product type displays product query fields and product results table

#### 4.2.2 Data Formatting Logic
- **Date Formatting**: Use the `formatDate` function to convert timestamps to local date-time format
- **Channel Name Retrieval**: Use the `getChannelName` function to get the channel name based on the channel ID
- **Status Tag Styling**: Use the `getStatusTagType`, `getProductStatusTagType`, and `getFulfillmentStatusType` functions to set different colored tags based on status values

#### 4.2.3 Conditional Display Logic
- **Empty Value Handling**: For fields that may not exist, use conditional rendering, if no value display "-"
- **Tag Colors**: Display tags with different colors based on different statuses
- **Stock Hover**: Add hover interaction to WMS stock and Last Synced Stock to display detailed information

### 4.3 Interaction Logic

#### 4.3.1 Form Validation
- Customer and channel are required fields, validated before submission
- Display warning messages when validation fails

#### 4.3.2 Pagination Handling
- Update `currentPage` when switching pages, and trigger requery
- Update `pageSize` when changing page size, and trigger requery

#### 4.3.3 Reset Operation
- Clear all query condition fields
- Reset pagination parameters
- Hide results area

#### 4.3.4 Refresh Operation
- Re-execute query using current query conditions
- Maintain current pagination state

#### 4.3.5 Export Operation
- Validate required fields
- Simulate export process (should connect to backend export API in actual implementation)

#### 4.3.6 View Order Details
- When clicking the "View Details" button on an order row, open the order details dialog
- Pass the current row's order data to the dialog component

#### 4.3.7 Order Detail Navigation
- Clicking on the system order number navigates to the order detail page

### 4.4 Data Synchronization Mechanism

#### 4.4.1 Inventory Synchronization Rules
The system supports three inventory synchronization rules:

1. **Percentage Sync** (percent)
   - Synchronize the WMS inventory to the channel according to the specified percentage
   - Example: 80% of inventory synchronized to the channel

2. **Fixed Quantity** (fixed)
   - Fixed quantity of inventory synchronized to the channel
   - Example: Fixed 100 units of inventory synchronized to the channel

3. **Reduction Sync** (reduce)
   - Supports two reduction methods:
     - Percentage Reduction: Synchronize after reducing by specified percentage
     - Fixed Quantity Reduction: Synchronize after reducing by specified quantity

#### 4.4.2 Inventory Distribution Display
- Mouse hover over WMS stock displays the stock distribution across warehouses
- Supports displaying stock in US Warehouse, EU Warehouse, China Warehouse, UK Warehouse, etc.

## 5. Styling and User Experience

### 5.1 Overall Layout
- Page uses a card-style layout, clearly separating different functional areas
- Top displays the page title, middle for query conditions, bottom for query results

### 5.2 Form Styling
- Form items use a three-column layout, making rational use of space
- Required fields are clearly marked, prompting users for required input
- Buttons are centered, main operations use the primary color

### 5.3 Table Styling
- Tables use a bordered style, clearly distinguishing columns
- Status information uses colored tags for intuitive display
- Supports tooltips for long text overflow
- Operation buttons placed on the far right for ease of operation

### 5.4 Dialog Styling
- Order details dialog displayed centered, with moderate width
- Header displays basic information, body displays product list
- Footer displays order total amount
- Content destroyed on close to avoid memory leaks

### 5.5 Responsive Handling
- Form items support adaptation on small screens
- Fixed right-side operation column when scrolling tables

## 6. Future Extension Plans

### 6.1 Feature Extensions
- Add batch export functionality
- Add advanced filtering conditions
- Add batch operation functionality
- Add order tracking functionality
- Add data visualization charts

### 6.2 Performance Optimizations
- Implement data lazy loading
- Optimize rendering performance for large data volumes
- Add data caching mechanism

### 6.3 User Experience Improvements
- Add personalization settings
- Add favorite query conditions
- Add quick filtering functionality
- Optimize mobile adaptation

## 7. Development and Deployment

### 7.1 Development Environment
- Node.js 14+
- Vite 4.5+
- Vue 3.2+
- TypeScript 4.5+
- Element Plus 2.2+

### 7.2 Deployment Requirements
- Modern browser support
- Recommended to use the latest versions of Chrome, Firefox, Edge
- Server environment: Nginx/Apache

### 7.3 API Interfaces
In actual deployment, the following APIs need to be connected:
- Customer Data API
- Channel Data API
- Order Query API
- Product Query API
- Data Export API

## 8. Summary

The Multi-Platform Query Tool is a query management tool that integrates orders and product data from multiple platforms. It provides a unified query interface and rich filtering conditions, supports detailed data display and export functionality. Through this tool, users can conveniently query and manage data from different e-commerce platforms, improving work efficiency.

This tool is developed using a modern frontend technology stack, has good user experience and extensibility, and can be functionally extended and optimized according to business needs. 