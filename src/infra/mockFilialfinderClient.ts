/**
 * Mock implementation of Filialfinder client for demonstration purposes
 * Provides realistic data for Rhine-Main area
 */

import { FilialfinderPort, ObjectType, FiFiConfiguration } from "./filialfinderClient.js";
import { FiFiObject } from "../domain/models.js";

const MOCK_OBJECTS: FiFiObject[] = [
  {
    id: 12001,
    officeName: "Sparkasse Mainz - Hauptstelle",
    typeGroup: "FILIALE",
    street: "Große Bleiche",
    houseNumber: "46-48",
    postalCode: "55116",
    city: "Mainz",
    coordinates: {
      latitude: 49.9928617,
      longitude: 8.2472526
    },
    isOpenNow: true,
    isTemporarilyClosed: false,
    temporarilyClosedFrom: null,
    temporarilyClosedThrough: null,
    facilities: ["Beratung", "Geldautomat", "Kontoauszugsdrucker", "Münzgeldautomat"],
    contact: {
      phone: "+49 6131 3840",
      url: "https://www.sparkasse-mainz.de"
    },
    openingHours: [
      { day: "Montag", hours: "09:00-16:00" },
      { day: "Dienstag", hours: "09:00-16:00" },
      { day: "Mittwoch", hours: "09:00-16:00" },
      { day: "Donnerstag", hours: "09:00-18:00" },
      { day: "Freitag", hours: "09:00-16:00" }
    ]
  },
  {
    id: 12002,
    officeName: "Geldautomat Hauptbahnhof Mainz",
    typeGroup: "GELDAUTOMAT",
    street: "Bahnhofsplatz",
    houseNumber: "1",
    postalCode: "55116",
    city: "Mainz",
    coordinates: {
      latitude: 50.0011207,
      longitude: 8.2590851
    },
    isOpenNow: true,
    isTemporarilyClosed: false,
    temporarilyClosedFrom: null,
    temporarilyClosedThrough: null,
    facilities: ["Geldautomat", "24/7 verfügbar"],
    openingHours: [
      { day: "Montag-Sonntag", hours: "00:00-23:59" }
    ]
  },
  {
    id: 12003,
    officeName: "Sparkasse Mainz - Filiale Gonsenheim",
    typeGroup: "FILIALE",
    street: "Breite Straße",
    houseNumber: "17",
    postalCode: "55124",
    city: "Mainz",
    coordinates: {
      latitude: 49.9842345,
      longitude: 8.2156789
    },
    isOpenNow: false,
    isTemporarilyClosed: false,
    temporarilyClosedFrom: null,
    temporarilyClosedThrough: null,
    facilities: ["Beratung", "Geldautomat", "Kontoauszugsdrucker"],
    contact: {
      phone: "+49 6131 3840",
      url: "https://www.sparkasse-mainz.de"
    },
    openingHours: [
      { day: "Montag", hours: "09:00-13:00" },
      { day: "Dienstag", hours: "09:00-13:00" },
      { day: "Donnerstag", hours: "14:00-18:00" },
      { day: "Freitag", hours: "09:00-13:00" }
    ]
  },
  {
    id: 12004,
    officeName: "SB-Filiale Universitätscampus",
    typeGroup: "SB_FILIALE",
    street: "Jakob-Welder-Weg",
    houseNumber: "9",
    postalCode: "55128",
    city: "Mainz",
    coordinates: {
      latitude: 49.9906783,
      longitude: 8.2405234
    },
    isOpenNow: true,
    isTemporarilyClosed: false,
    temporarilyClosedFrom: null,
    temporarilyClosedThrough: null,
    facilities: ["Geldautomat", "Kontoauszugsdrucker", "Überweisungsterminal"],
    openingHours: [
      { day: "Montag-Freitag", hours: "06:00-22:00" }
    ]
  },
  {
    id: 12005,
    officeName: "Geldautomat Rheingoldhalle",
    typeGroup: "GELDAUTOMAT",
    street: "Rheinstraße",
    houseNumber: "66",
    postalCode: "55116",
    city: "Mainz",
    coordinates: {
      latitude: 50.0050123,
      longitude: 8.2706789
    },
    isOpenNow: true,
    isTemporarilyClosed: false,
    temporarilyClosedFrom: null,
    temporarilyClosedThrough: null,
    facilities: ["Geldautomat", "24/7 verfügbar"],
    openingHours: [
      { day: "Montag-Sonntag", hours: "00:00-23:59" }
    ]
  },
  {
    id: 12006,
    officeName: "Sparkasse Mainz - Filiale Weisenau",
    typeGroup: "FILIALE",
    street: "Göttelmannstraße",
    houseNumber: "2",
    postalCode: "55131",
    city: "Mainz",
    coordinates: {
      latitude: 49.9712345,
      longitude: 8.2934567
    },
    isOpenNow: false,
    isTemporarilyClosed: false,
    temporarilyClosedFrom: null,
    temporarilyClosedThrough: null,
    facilities: ["Beratung", "Geldautomat"],
    contact: {
      phone: "+49 6131 3840"
    },
    openingHours: [
      { day: "Montag", hours: "09:00-16:00" },
      { day: "Mittwoch", hours: "09:00-16:00" },
      { day: "Freitag", hours: "09:00-12:00" }
    ]
  }
];

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export class MockFilialfinderClient implements FilialfinderPort {
  private readonly blz = "50050000";

  async searchObjectsByCoordinates(params: {
    latitude: number;
    longitude: number;
    radiusKm?: number;
    typeGroup?: string;
    nowOpen?: boolean;
    facilities?: number[];
    objectsPerPage?: number;
    pageNo?: number;
  }): Promise<FiFiObject[]> {
    const { latitude, longitude, radiusKm, typeGroup, nowOpen, facilities, objectsPerPage = 10 } = params;

    let results = MOCK_OBJECTS.map(obj => ({
      ...obj,
      distanceMeters: obj.coordinates
        ? calculateDistance(
            latitude,
            longitude,
            obj.coordinates.latitude,
            obj.coordinates.longitude
          )
        : undefined
    }));

    // Filter by radius if specified
    if (radiusKm !== undefined) {
      const radiusMeters = radiusKm * 1000;
      results = results.filter(obj => obj.distanceMeters !== undefined && obj.distanceMeters <= radiusMeters);
    }

    // Filter by type if specified
    if (typeGroup) {
      results = results.filter(obj => obj.typeGroup === typeGroup);
    }

    // Filter by open now if specified
    if (nowOpen) {
      results = results.filter(obj => obj.isOpenNow);
    }

    // Filter by facilities if specified
    if (facilities && facilities.length > 0) {
      const facilityNames = await this.getFacilityNamesByIds(facilities);
      results = results.filter(obj => 
        obj.facilities && facilityNames.some(name => obj.facilities!.includes(name))
      );
    }

    // Sort by distance
    results.sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0));

    // Apply pagination
    return results.slice(0, objectsPerPage);
  }

  private async getFacilityNamesByIds(ids: number[]): Promise<string[]> {
    const allFacilities = await this.listFacilities();
    return allFacilities
      .filter(f => ids.includes(f.id))
      .map(f => f.name);
  }

  async getObjectById(id: number): Promise<FiFiObject | null> {
    return MOCK_OBJECTS.find(obj => obj.id === id) ?? null;
  }

  async listFacilities(): Promise<{ id: number; name: string }[]> {
    return [
      { id: 1, name: "Beratung" },
      { id: 2, name: "Geldautomat" },
      { id: 3, name: "Kontoauszugsdrucker" },
      { id: 4, name: "Münzgeldautomat" },
      { id: 5, name: "Überweisungsterminal" },
      { id: 6, name: "Einzahlautomat" },
      { id: 7, name: "Barrierefrei" }
    ];
  }

  async listObjectTypes(): Promise<ObjectType[]> {
    return [
      { id: 1, name: "Geldautomat", groupName: "GELDAUTOMAT" },
      { id: 2, name: "Filiale", groupName: "FILIALE" },
      { id: 3, name: "SB-Filiale", groupName: "SB_FILIALE" }
    ];
  }

  async getConfiguration(): Promise<FiFiConfiguration> {
    return {
      blz: this.blz,
      name: "Sparkasse Mainz",
      supportedObjectTypes: ["FILIALE", "GELDAUTOMAT", "SB_FILIALE"]
    };
  }
}

