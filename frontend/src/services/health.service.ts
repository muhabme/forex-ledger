import { apiClient } from "./api-client.ts";

export interface HealthResponse {
  status: "ok";
  database: "up";
}

export async function fetchHealth(): Promise<HealthResponse> {
  return (await apiClient.get("/health")) as HealthResponse;
}
