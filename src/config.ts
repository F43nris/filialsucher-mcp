import * as dotenv from "dotenv";

dotenv.config();

export interface AppConfig {
  filialfinderBaseUrl: string;
  filialfinderApiKey: string;
  filialfinderBlz: string;
  requestTimeoutMs: number;
}

export function loadConfig(): AppConfig {
  const {
    FILIALFINDER_BASE_URL = "https://filialfinder-service.sparkasse.de",
    FILIALFINDER_API_KEY = "mock-key",
    FILIALFINDER_BLZ = "50050000",
    REQUEST_TIMEOUT_MS = "2500"
  } = process.env;

  return {
    filialfinderBaseUrl: FILIALFINDER_BASE_URL,
    filialfinderApiKey: FILIALFINDER_API_KEY,
    filialfinderBlz: FILIALFINDER_BLZ,
    requestTimeoutMs: Number(REQUEST_TIMEOUT_MS)
  };
}

