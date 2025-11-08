/**
 * Domain models matching Sparkasse Filialfinder API schema
 */

export interface FiFiObject {
  id: number;
  officeName: string;
  typeGroup: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  state?: string;
  distanceMeters?: number;
  isOpenNow?: boolean;
  isTemporarilyClosed?: boolean;
  temporarilyClosedFrom?: string | null;
  temporarilyClosedThrough?: string | null;
  facilities?: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  contact?: {
    phone?: string;
    email?: string;
    url?: string;
  };
  openingHours?: Array<{
    day: string;
    hours: string;
  }>;
  consultationHours?: Array<{
    day: string;
    hours: string;
  }>;
  publicTransport?: {
    description?: string;
    routePlannerUrl?: string;
  };
  images?: Array<{
    caption?: string;
    url: string;
  }>;
  attributes?: Array<{
    id: number;
    name: string;
  }>;
}

/**
 * View model for search results - summary view
 */
export interface BranchSummary {
  id: number;
  name: string;
  type: string;
  address: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
  };
  distanceMeters?: number;
  isOpenNow?: boolean;
  isTemporarilyClosed?: boolean;
  temporarilyClosedFrom?: string | null;
  temporarilyClosedThrough?: string | null;
  keyFacilities: string[];
}

/**
 * View model for detail view - extends summary with full information
 */
export interface BranchDetail extends BranchSummary {
  state?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  contact?: {
    phone?: string;
    email?: string;
    url?: string;
  };
  openingHours?: Array<{
    day: string;
    hours: string;
  }>;
  consultationHours?: Array<{
    day: string;
    hours: string;
  }>;
  publicTransport?: {
    description?: string;
    routePlannerUrl?: string;
  };
  images?: Array<{
    caption?: string;
    url: string;
  }>;
  attributes?: Array<{
    id: number;
    name: string;
  }>;
}

