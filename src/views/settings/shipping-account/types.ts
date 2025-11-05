export interface ShippingAccount {
  id?: string | number
  carrier: string
  accountNo: string
  apiClientId: string
  apiClientPassword: string
  apiToken: string
  trackApiKey: string
  trackApiSecret: string
  name: string
  company: string
  address1: string
  address2: string
  city: string
  countryRegion: string
  stateProvince: string
  zipCode: string
  phone: string
  smartPostHubId: string
  returnAccountNumber: string
  isReturn: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ShippingAccountFilter {
  carrier?: string
  accountNo?: string
  name?: string
  company?: string
}

export const CARRIER_OPTIONS = [
  { label: 'FedEx', value: 'fedex' },
  { label: 'UPS', value: 'ups' },
  { label: 'USPS', value: 'usps' },
  { label: 'DHL', value: 'dhl' },
  { label: 'Other', value: 'other' }
]

