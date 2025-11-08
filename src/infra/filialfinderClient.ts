/**
 * Port interface for Filialfinder client - allows for mock and real implementations
 */

import { FiFiObject } from "../domain/models.js";

export interface ObjectType {
  id: number;
  name: string;
  groupName: string;
}

export interface FiFiConfiguration {
  blz: string;
  name: string;
  supportedObjectTypes: string[];
}

export interface FilialfinderPort {
  searchObjectsByCoordinates(params: {
    latitude: number;
    longitude: number;
    radiusKm?: number;
    typeGroup?: string;
    nowOpen?: boolean;
    facilities?: number[];
    objectsPerPage?: number;
    pageNo?: number;
  }): Promise<FiFiObject[]>;

  getObjectById(id: number): Promise<FiFiObject | null>;

  listFacilities(): Promise<{ id: number; name: string }[]>;

  listObjectTypes(): Promise<ObjectType[]>;

  getConfiguration(): Promise<FiFiConfiguration>;
}

