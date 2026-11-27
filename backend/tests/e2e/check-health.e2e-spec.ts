import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import type { INestApplication } from "@nestjs/common";
import { getConnectionToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import type { Connection } from "mongoose";
import request from "supertest";
import type { App } from "supertest/types.js";

import { AppModule } from "../../src/app.module.js";
import { configureApp } from "../../src/bootstrap.js";

describe("GET /api/health", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("responds 200 when the database is connected", async () => {
    await request(app.getHttpServer())
      .get("/api/health")
      .expect(200)
      .expect({ status: "ok", database: "up" });
  });

  it("responds 503 when the database connection is lost", async () => {
    await app.get<Connection>(getConnectionToken()).close();

    const response = await request(app.getHttpServer())
      .get("/api/health")
      .expect(503);

    expect(response.body).toEqual({ status: "error", database: "down" });
  });

  it("is only served under the /api prefix", async () => {
    await request(app.getHttpServer()).get("/health").expect(404);
  });
});
