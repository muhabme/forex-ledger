// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HealthStatus } from "./HealthStatus.tsx";

function renderWithQueryClient() {
  const queryClient = new QueryClient();

  render(
    <QueryClientProvider client={queryClient}>
      <HealthStatus />
    </QueryClientProvider>,
  );
}

describe("HealthStatus", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("shows that it is checking while the request is in flight", () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));

    renderWithQueryClient();

    expect(screen.getByRole("status").textContent).toBe("Checking API…");
  });

  it("shows ok when the API and database are up", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(Response.json({ status: "ok", database: "up" })),
    );

    renderWithQueryClient();

    expect(await screen.findByText("API ok, database up")).toBeDefined();
  });

  it("shows that the database is down when the API answers 503", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          Response.json({ status: "error", database: "down" }, { status: 503 }),
        ),
    );

    renderWithQueryClient();

    expect(
      await screen.findByText("API reachable, database down"),
    ).toBeDefined();
  });

  it("shows that the API is unreachable when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
    );

    renderWithQueryClient();

    expect(await screen.findByText("API unreachable")).toBeDefined();
  });
});
