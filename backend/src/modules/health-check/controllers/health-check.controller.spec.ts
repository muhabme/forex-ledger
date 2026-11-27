import { beforeEach, describe, expect, it } from "@jest/globals";
import { Test } from "@nestjs/testing";

import { HealthCheckController } from "./health-check.controller.js";

describe("HealthCheckController", () => {
  let controller: HealthCheckController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthCheckController],
    }).compile();

    controller = moduleRef.get(HealthCheckController);
  });

  it("reports the service as ok", () => {
    expect(controller.check()).toEqual({ status: "ok" });
  });
});
