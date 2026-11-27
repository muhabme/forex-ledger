import { afterAll, beforeAll, describe, it } from "@jest/globals";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import type { App } from "supertest/types.js";

import { AppModule } from "../../src/app.module.js";
import { configureApp } from "../../src/bootstrap.js";

describe("GET /api/health", () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("responds 200 with status ok", async () => {
    await request(app.getHttpServer())
      .get("/api/health")
      .expect(200)
      .expect({ status: "ok" });
  });

  it("is only served under the /api prefix", async () => {
    await request(app.getHttpServer()).get("/health").expect(404);
  });
});
