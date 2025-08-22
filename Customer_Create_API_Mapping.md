# Customer Create API - Field Mapping

This document describes the field mapping for creating customers using the provided API endpoint.

## Required API Fields for Customer Creation

Based on the Customer List UI form, here are the essential field mappings:

### Basic Customer Information

| UI Field | API Field | Type | Required | Notes |
|----------|-----------|------|----------|-------|
| Customer Name | `customerName` | string | ✅ | Primary display name |
| Contact Person | `customerFullName` | string | ✅ | Full contact person name |
| Email | `email` | string | ✅ | Primary email address |
| Phone | `phone` | string | ✅ | Primary phone number |

### Address Information

| UI Field | API Field | Type | Required | Notes |
|----------|-----------|------|----------|-------|
| Address | `registeredAddress` | string | ❌ | Business address |
| City | `registeredCity` | string | ❌ | City name |
| State | `registeredState` | string | ❌ | State/Province |
| Zip Code | `registeredZipCode` | string | ❌ | Postal code |
| Country | `registeredCountry` | string | ❌ | Country name |

### Customer Classification

| UI Field | API Field | Type | Required | Notes |
|----------|-----------|------|----------|-------|
| Customer Group | `group` | number | ❌ | Group ID (enum) |
| Status | `status` | number | ✅ | Default: 1 (Active) |

### Optional Business Information

| UI Field | API Field | Type | Required | Notes |
|----------|-----------|------|----------|-------|
| Description/Notes | `notes` | string | ❌ | Additional information |
| Website | `website` | string | ❌ | Company website |
| Tax ID | `taxID` | string | ❌ | Tax identification |

## API Request Example

```javascript
// Customer creation payload
const customerData = {
  customerName: form.name,           // Required
  customerFullName: form.contact,    // Required  
  email: form.email,                 // Required
  phone: form.phone,                 // Required
  status: 1,                         // Active status
  registeredAddress: form.address,   // Optional
  notes: form.description,           // Optional
  group: form.group || 0,            // Optional, default group
  // Set default values for other fields
  customerId: 0,                     // Auto-generated
  accountId: "",                     // Can be empty initially
  currentContactPeriod: new Date().toISOString(),
  subsidiary: "",
  subCustomerOf: 0,
  billToOnly: false,
  lineOfBusiness: 0,
  typeOfBusiness: 0,
  annualSpending: 0,
  monthlyCreditRequired: "",
  dunAndBradstreet: "",
  parentCompany: "",
  numberOfEmployees: 0,
  dateEstablished: new Date().toISOString(),
  corporateAddress: "",
  corporateCity: "",
  corporateState: "",
  corporateZipCode: "",
  corporateCountry: "",
  representsCompany: 0,
  contractTerms: "",
  ein: "",
  duns: "",
  tags: [],
  logoImageID: 0,
  logoZebraCode: "",
  mcNumber: "",
  phoneNumberPrefixesId: 0,
  mid: "",
  onHold: false,
  tagsCancelRelationship: {}
};
```

## Form Validation Mapping

```javascript
// Current form validation rules mapped to API fields
const apiValidationRules = {
  customerName: [
    { required: true, message: 'Please enter customer name', trigger: 'blur' }
  ],
  customerFullName: [
    { required: true, message: 'Please enter contact person', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Please enter email address', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Please enter phone number', trigger: 'blur' }
  ],
  status: [
    { required: true, message: 'Status is required', trigger: 'change' }
  ]
};
```

## Implementation Code

```javascript
// Update the handleSubmit function in customer list
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const apiPayload = {
          // Required fields from form
          customerName: form.name,
          customerFullName: form.contact,
          email: form.email,
          phone: form.phone,
          status: 1, // Active by default
          
          // Optional fields from form
          registeredAddress: form.address || "",
          notes: form.description || "",
          group: form.group || 0,
          
          // Default values for API required fields
          customerId: 0,
          accountId: "",
          currentContactPeriod: new Date().toISOString(),
          subsidiary: "",
          subCustomerOf: 0,
          billToOnly: false,
          lineOfBusiness: 0,
          typeOfBusiness: 0,
          annualSpending: 0,
          monthlyCreditRequired: "",
          dunAndBradstreet: "",
          parentCompany: "",
          numberOfEmployees: 0,
          dateEstablished: new Date().toISOString(),
          corporateAddress: "",
          corporateCity: "",
          corporateState: "",
          corporateZipCode: "",
          corporateCountry: "",
          representsCompany: 0,
          contractTerms: "",
          ein: "",
          duns: "",
          tags: [],
          logoImageID: 0,
          logoZebraCode: "",
          mcNumber: "",
          phoneNumberPrefixesId: 0,
          mid: "",
          onHold: false,
          tagsCancelRelationship: {}
        };

        if (form.id) {
          // Update existing customer
          apiPayload.customerId = parseInt(form.id);
          await api.updateCustomer(apiPayload);
        } else {
          // Create new customer
          await api.createCustomer(apiPayload);
        }
        
        ElMessage.success(form.id ? 'Updated successfully' : 'Created successfully')
        dialogVisible.value = false
        getCustomerList()
      } catch (error) {
        console.error('Failed to save customer:', error)
        ElMessage.error('Failed to save')
      }
    }
  })
}
```

## Status Enum Values

```javascript
const CustomerStatus = {
  INACTIVE: 0,
  ACTIVE: 1,
  PENDING: 2,
  SUSPENDED: 3
};
```

## Notes

1. **Minimal Required Fields**: Only `customerName`, `customerFullName`, `email`, `phone`, and `status` are essential
2. **Default Values**: All other API fields should be set to appropriate default values
3. **Date Fields**: Use ISO 8601 format for datetime fields
4. **Status**: Default to `1` (Active) for new customers
5. **Group**: Default to `0` if no group is selected
6. **ID Fields**: Set to `0` for new records (auto-generated by API)
