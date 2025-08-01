export const ADDRESS_TYPES = [
  { label: 'Country', value: 'country' },
  { label: 'Full Address', value: 'full' },
  { label: 'State/Province', value: 'state' },
  { label: 'City', value: 'city' },
  { label: 'Zip Code', value: 'zipcode' },
  { label: 'Address Keyword', value: 'keyword' }
]

export const COUNTRIES = [
  { label: 'USA', value: 'USA' },
  { label: 'China', value: 'China' },
  { label: 'Canada', value: 'Canada' },
  { label: 'UK', value: 'UK' },
  { label: 'Germany', value: 'Germany' },
  { label: 'France', value: 'France' },
  { label: 'Japan', value: 'Japan' },
  { label: 'Australia', value: 'Australia' }
]

export const US_STATES = [
  { label: 'Alabama', value: 'Alabama' },
  { label: 'Alaska', value: 'Alaska' },
  { label: 'Arizona', value: 'Arizona' },
  { label: 'Arkansas', value: 'Arkansas' },
  { label: 'California', value: 'California' },
  { label: 'Colorado', value: 'Colorado' },
  { label: 'Connecticut', value: 'Connecticut' },
  { label: 'Delaware', value: 'Delaware' },
  { label: 'Florida', value: 'Florida' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Hawaii', value: 'Hawaii' },
  { label: 'Idaho', value: 'Idaho' },
  { label: 'Illinois', value: 'Illinois' },
  { label: 'Indiana', value: 'Indiana' },
  { label: 'Iowa', value: 'Iowa' },
  { label: 'Kansas', value: 'Kansas' },
  { label: 'Kentucky', value: 'Kentucky' },
  { label: 'Louisiana', value: 'Louisiana' },
  { label: 'Maine', value: 'Maine' },
  { label: 'Maryland', value: 'Maryland' },
  { label: 'Massachusetts', value: 'Massachusetts' },
  { label: 'Michigan', value: 'Michigan' },
  { label: 'Minnesota', value: 'Minnesota' },
  { label: 'Mississippi', value: 'Mississippi' },
  { label: 'Missouri', value: 'Missouri' },
  { label: 'Montana', value: 'Montana' },
  { label: 'Nebraska', value: 'Nebraska' },
  { label: 'Nevada', value: 'Nevada' },
  { label: 'New Hampshire', value: 'New Hampshire' },
  { label: 'New Jersey', value: 'New Jersey' },
  { label: 'New Mexico', value: 'New Mexico' },
  { label: 'New York', value: 'New York' },
  { label: 'North Carolina', value: 'North Carolina' },
  { label: 'North Dakota', value: 'North Dakota' },
  { label: 'Ohio', value: 'Ohio' },
  { label: 'Oklahoma', value: 'Oklahoma' },
  { label: 'Oregon', value: 'Oregon' },
  { label: 'Pennsylvania', value: 'Pennsylvania' },
  { label: 'Rhode Island', value: 'Rhode Island' },
  { label: 'South Carolina', value: 'South Carolina' },
  { label: 'South Dakota', value: 'South Dakota' },
  { label: 'Tennessee', value: 'Tennessee' },
  { label: 'Texas', value: 'Texas' },
  { label: 'Utah', value: 'Utah' },
  { label: 'Vermont', value: 'Vermont' },
  { label: 'Virginia', value: 'Virginia' },
  { label: 'Washington', value: 'Washington' },
  { label: 'West Virginia', value: 'West Virginia' },
  { label: 'Wisconsin', value: 'Wisconsin' },
  { label: 'Wyoming', value: 'Wyoming' }
]

export const CHINA_PROVINCES = [
  { label: 'Beijing', value: 'Beijing' },
  { label: 'Shanghai', value: 'Shanghai' },
  { label: 'Guangdong', value: 'Guangdong' },
  { label: 'Jiangsu', value: 'Jiangsu' },
  { label: 'Zhejiang', value: 'Zhejiang' },
  { label: 'Sichuan', value: 'Sichuan' },
  { label: 'Shandong', value: 'Shandong' },
  { label: 'Henan', value: 'Henan' },
  { label: 'Hubei', value: 'Hubei' },
  { label: 'Fujian', value: 'Fujian' }
]

export const CANADA_PROVINCES = [
  { label: 'Ontario', value: 'Ontario' },
  { label: 'Quebec', value: 'Quebec' },
  { label: 'British Columbia', value: 'British Columbia' },
  { label: 'Alberta', value: 'Alberta' },
  { label: 'Manitoba', value: 'Manitoba' },
  { label: 'Saskatchewan', value: 'Saskatchewan' },
  { label: 'Nova Scotia', value: 'Nova Scotia' },
  { label: 'New Brunswick', value: 'New Brunswick' },
  { label: 'Newfoundland and Labrador', value: 'Newfoundland and Labrador' },
  { label: 'Prince Edward Island', value: 'Prince Edward Island' }
]

export const US_CITIES = {
  'California': [
    { label: 'Los Angeles', value: 'Los Angeles' },
    { label: 'San Francisco', value: 'San Francisco' },
    { label: 'San Diego', value: 'San Diego' },
    { label: 'San Jose', value: 'San Jose' },
    { label: 'Sacramento', value: 'Sacramento' }
  ],
  'New York': [
    { label: 'New York City', value: 'New York City' },
    { label: 'Buffalo', value: 'Buffalo' },
    { label: 'Rochester', value: 'Rochester' },
    { label: 'Syracuse', value: 'Syracuse' },
    { label: 'Albany', value: 'Albany' }
  ],
  'Texas': [
    { label: 'Houston', value: 'Houston' },
    { label: 'Dallas', value: 'Dallas' },
    { label: 'Austin', value: 'Austin' },
    { label: 'San Antonio', value: 'San Antonio' },
    { label: 'Fort Worth', value: 'Fort Worth' }
  ],
  'Florida': [
    { label: 'Miami', value: 'Miami' },
    { label: 'Orlando', value: 'Orlando' },
    { label: 'Tampa', value: 'Tampa' },
    { label: 'Jacksonville', value: 'Jacksonville' },
    { label: 'Tallahassee', value: 'Tallahassee' }
  ]
} as const

export const CHINA_CITIES = {
  'Guangdong': [
    { label: 'Guangzhou', value: 'Guangzhou' },
    { label: 'Shenzhen', value: 'Shenzhen' },
    { label: 'Dongguan', value: 'Dongguan' },
    { label: 'Foshan', value: 'Foshan' },
    { label: 'Zhuhai', value: 'Zhuhai' }
  ],
  'Beijing': [
    { label: 'Beijing', value: 'Beijing' }
  ],
  'Shanghai': [
    { label: 'Shanghai', value: 'Shanghai' }
  ],
  'Jiangsu': [
    { label: 'Nanjing', value: 'Nanjing' },
    { label: 'Suzhou', value: 'Suzhou' },
    { label: 'Wuxi', value: 'Wuxi' },
    { label: 'Changzhou', value: 'Changzhou' },
    { label: 'Yangzhou', value: 'Yangzhou' }
  ],
  'Zhejiang': [
    { label: 'Hangzhou', value: 'Hangzhou' },
    { label: 'Ningbo', value: 'Ningbo' },
    { label: 'Wenzhou', value: 'Wenzhou' },
    { label: 'Shaoxing', value: 'Shaoxing' },
    { label: 'Jinhua', value: 'Jinhua' }
  ]
} as const

export const CANADA_CITIES = {
  'Ontario': [
    { label: 'Toronto', value: 'Toronto' },
    { label: 'Ottawa', value: 'Ottawa' },
    { label: 'Mississauga', value: 'Mississauga' },
    { label: 'Hamilton', value: 'Hamilton' },
    { label: 'London', value: 'London' }
  ],
  'Quebec': [
    { label: 'Montreal', value: 'Montreal' },
    { label: 'Quebec City', value: 'Quebec City' },
    { label: 'Laval', value: 'Laval' },
    { label: 'Gatineau', value: 'Gatineau' },
    { label: 'Longueuil', value: 'Longueuil' }
  ],
  'British Columbia': [
    { label: 'Vancouver', value: 'Vancouver' },
    { label: 'Victoria', value: 'Victoria' },
    { label: 'Surrey', value: 'Surrey' },
    { label: 'Burnaby', value: 'Burnaby' },
    { label: 'Richmond', value: 'Richmond' }
  ]
} as const

export const ADDRESS_KEYWORDS = [
  { label: 'PO BOX', value: 'PO BOX' },
  { label: 'P.O. BOX', value: 'P.O. BOX' },
  { label: 'APT', value: 'APT' },
  { label: 'APARTMENT', value: 'APARTMENT' },
  { label: 'SUITE', value: 'SUITE' },
  { label: 'STE', value: 'STE' },
  { label: 'UNIT', value: 'UNIT' },
  { label: 'FLOOR', value: 'FLOOR' },
  { label: 'FL', value: 'FL' },
  { label: 'BUILDING', value: 'BUILDING' },
  { label: 'BLDG', value: 'BLDG' }
] 