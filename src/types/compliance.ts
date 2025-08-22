export type CertificationType = 'CE' | 'FCC' | 'RoHS' | 'FDA' | 'UL' | 'CPSIA' | 'ASTM' | 'REACH' | 'CPC';
export type RestrictionType = 'BATTERY' | 'LIQUID' | 'POWDER' | 'MAGNETIC' | 'HAZMAT';
export type ExportControlClass = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';

export interface CertificationDetail {
  type: CertificationType;
  certificateNo: string;
  issueDate: string;
  expiryDate: string;
  issuingBody: string;
  status: 'valid' | 'expired' | 'pending';
  attachments?: string[];
  notes?: string;
}

export interface HazmatInfo {
  isHazmat: boolean;
  unNumber?: string;
  class?: string;
  packingGroup?: string;
  properShippingName?: string;
  technicalName?: string;
  reportableQuantity?: number;
  emergencyContact?: string;
}

export interface BatteryInfo {
  hasBattery: boolean;
  type?: 'lithium-ion' | 'lithium-metal' | 'alkaline' | 'other';
  configuration?: 'contained-in-equipment' | 'packed-with-equipment' | 'standalone';
  cellCount?: number;
  wattHourRating?: number;
  lithiumContent?: number;
}

export interface FDAInfo {
  requiresFDA: boolean;
  registrationNumber?: string;
  productCode?: string;
  deviceListing?: string;
  medicalDevice?: boolean;
  drugListing?: string;
  foodFacility?: string;
  labelingReview?: boolean;
}

export interface CPSIAInfo {
  requiresCPSIA: boolean;
  ageGrade?: string;
  testingLab?: string;
  trackingLabel?: string;
  smallPartsWarning?: boolean;
  leadContent?: boolean;
  phthalatesTest?: boolean;
}

export interface Prop65Info {
  requiresWarning: boolean;
  warningType?: 'short-form' | 'long-form';
  chemicals?: string[];
  exposureType?: 'consumer-product' | 'environmental' | 'occupational';
  warningLanguage?: Record<string, string>;
}

export interface CustomsInfo {
  hsCode: string;
  countryOfOrigin: string;
  declaredValue: number;
  currencyCode: string;
  dutyRate: number;
  vatRate: number;
  declaredUnit: string;
  declaredDescription: Record<string, string>;
  preferentialDuty?: {
    agreement: string;
    rate: number;
    requiresCertificate: boolean;
  };
}

export interface ComplianceSettings {
  customs: CustomsInfo;
  certifications: CertificationType[];
  restrictions: RestrictionType[];
  certificationDetails: CertificationDetail[];
  hazmat?: HazmatInfo;
  battery?: BatteryInfo;
  fda?: FDAInfo;
  cpsia?: CPSIAInfo;
  prop65?: Prop65Info;
  eccnCode?: string;
  exportControlClass: ExportControlClass;
  licenseRequired: boolean;
  exportControlNotes?: string;
  marketAccess: {
    us?: {
      fccId?: string;
      epaCertification?: string;
      fdaRegistration?: string;
      cpscTracking?: string;
    };
    eu?: {
      ceMarkingClass?: string;
      rohs?: boolean;
      reach?: boolean;
      weee?: boolean;
    };
    other?: Record<string, any>;
  };
  complianceStatus: 'compliant' | 'non-compliant' | 'pending-review' | 'exempted';
  lastReviewDate?: string;
  nextReviewDate?: string;
  reviewedBy?: string;
  complianceNotes?: string;
}
