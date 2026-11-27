import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import type { Connection } from "mongoose";
import mongoose from "mongoose";

import type { HealthCheckResponse } from "../responses/health-check.response.js";

@Controller("health")
export class HealthCheckController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  check(): HealthCheckResponse {
    if (this.connection.readyState !== mongoose.ConnectionStates.connected) {
      throw new ServiceUnavailableException({
        status: "error",
        database: "down",
      });
    }

    return { status: "ok", database: "up" };
  }
}
