/**
 * Mappers between domain models and view models
 */

import { FiFiObject, BranchSummary, BranchDetail } from "./models.js";

export function mapFiFiObjectToSummary(obj: FiFiObject): BranchSummary {
  return {
    id: obj.id,
    name: obj.officeName,
    type: obj.typeGroup,
    address: {
      street: obj.street,
      houseNumber: obj.houseNumber,
      postalCode: obj.postalCode,
      city: obj.city
    },
    distanceMeters: obj.distanceMeters,
    isOpenNow: obj.isOpenNow,
    isTemporarilyClosed: obj.isTemporarilyClosed,
    temporarilyClosedFrom: obj.temporarilyClosedFrom ?? null,
    temporarilyClosedThrough: obj.temporarilyClosedThrough ?? null,
    keyFacilities: obj.facilities ?? []
  };
}

export function mapFiFiObjectToDetail(obj: FiFiObject): BranchDetail {
  const base = mapFiFiObjectToSummary(obj);
  return {
    ...base,
    state: obj.state,
    coordinates: obj.coordinates,
    contact: obj.contact,
    openingHours: obj.openingHours,
    consultationHours: obj.consultationHours,
    publicTransport: obj.publicTransport,
    images: obj.images,
    attributes: obj.attributes
  };
}

