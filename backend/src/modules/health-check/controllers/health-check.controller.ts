import { Controller, Get } from "@nestjs/common";

import type { HealthCheckResponse } from "../responses/health-check.response.js";

@Controller("health")
export class HealthCheckController {
  @Get()
  check(): HealthCheckResponse {
    return { status: "ok" };
  }
}
