import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient, ApiError } from "./api-client.ts";

function stubFetch(response: Response): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
}

describe("apiClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("get", () => {
    it("requests the path under /api and returns the JSON body", async () => {
      const fetchMock = stubFetch(Response.json({ status: "ok" }));

      await expect(apiClient.get("/health")).resolves.toEqual({
        status: "ok",
      });
      expect(fetchMock).toHaveBeenCalledWith("/api/health", {
        method: "GET",
        headers: { Accept: "application/json" },
      });
    });
  });

  describe.each([
    ["post", "POST", apiClient.post],
    ["put", "PUT", apiClient.put],
  ] as const)("%s", (_name, method, send) => {
    it("sends the body as JSON and returns the JSON response", async () => {
      const fetchMock = stubFetch(Response.json({ id: "1" }));

      await expect(send("/expenses", { amount: 1250 })).resolves.toEqual({
        id: "1",
      });
      expect(fetchMock).toHaveBeenCalledWith("/api/expenses", {
        method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: 1250 }),
      });
    });
  });

  describe("delete", () => {
    it("sends a DELETE and returns null for an empty 204 response", async () => {
      const fetchMock = stubFetch(new Response(null, { status: 204 }));

      await expect(apiClient.delete("/expenses/1")).resolves.toBeNull();
      expect(fetchMock).toHaveBeenCalledWith("/api/expenses/1", {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
    });
  });

  describe("errors", () => {
    it("throws an ApiError with the status and body when the response is not ok", async () => {
      stubFetch(Response.json({ database: "down" }, { status: 503 }));

      const error = await apiClient
        .get("/health")
        .catch((caught: unknown) => caught);

      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({
        message: "GET /api/health failed with status 503",
        status: 503,
        body: { database: "down" },
      });
    });

    it("uses a null body when the error response is not JSON", async () => {
      stubFetch(new Response("Bad Gateway", { status: 502 }));

      await expect(apiClient.post("/expenses", {})).rejects.toMatchObject({
        message: "POST /api/expenses failed with status 502",
        status: 502,
        body: null,
      });
    });
  });
});
