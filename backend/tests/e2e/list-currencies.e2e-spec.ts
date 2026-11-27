import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import type { App } from "supertest/types.js";

import { AppModule } from "../../src/app.module.js";
import { configureApp } from "../../src/bootstrap.js";

interface CurrencyItem {
  code: string;
  name: string;
  decimals: number;
}

describe("GET /api/currencies", () => {
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

  it("lists the supported currencies with code, name and decimals, sorted by code", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/currencies")
      .expect(200);
    const currencies = response.body as CurrencyItem[];
    const codes = currencies.map(({ code }) => code);

    expect(currencies).toContainEqual({
      code: "JPY",
      name: "Japanese Yen",
      decimals: 0,
    });
    expect(currencies).toContainEqual({
      code: "EUR",
      name: "Euro",
      decimals: 2,
    });
    expect(currencies).toContainEqual({
      code: "KWD",
      name: "Kuwaiti Dinar",
      decimals: 3,
    });
    expect(codes).toEqual([...codes].sort());
  });

  it("returns exactly code, name and decimals for each currency", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/currencies")
      .expect(200);

    for (const currency of response.body as object[]) {
      expect(Object.keys(currency).sort()).toEqual([
        "code",
        "decimals",
        "name",
      ]);
    }
  });

  it("leaves out crypto and metals", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/currencies")
      .expect(200);
    const codes = (response.body as CurrencyItem[]).map(({ code }) => code);

    expect(codes).not.toContain("BTC");
    expect(codes).not.toContain("XAU");
  });
});
