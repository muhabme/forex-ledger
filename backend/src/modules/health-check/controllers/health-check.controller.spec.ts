import { describe, expect, it } from "@jest/globals";
import { ServiceUnavailableException } from "@nestjs/common";
import { getConnectionToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import mongoose from "mongoose";

import { HealthCheckController } from "./health-check.controller.js";

async function createController(
  readyState: mongoose.ConnectionStates,
): Promise<HealthCheckController> {
  const moduleRef = await Test.createTestingModule({
    controllers: [HealthCheckController],
    providers: [{ provide: getConnectionToken(), useValue: { readyState } }],
  }).compile();

  return moduleRef.get(HealthCheckController);
}

describe("HealthCheckController", () => {
  it("reports ok when the database is connected", async () => {
    const controller = await createController(
      mongoose.ConnectionStates.connected,
    );

    expect(controller.check()).toEqual({ status: "ok", database: "up" });
  });

  it.each([
    mongoose.ConnectionStates.disconnected,
    mongoose.ConnectionStates.connecting,
    mongoose.ConnectionStates.disconnecting,
  ])("responds 503 when the connection state is %s", async (readyState) => {
    const controller = await createController(readyState);

    expect(() => controller.check()).toThrow(ServiceUnavailableException);
  });
});
