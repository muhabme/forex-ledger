import { useHealth } from "../hooks/queries/useHealth.ts";
import { ApiError } from "../services/api-client.ts";

function describeError(error: Error): string {
  // The back end answers 503 when it is running but cannot reach MongoDB.
  if (error instanceof ApiError && error.status === 503) {
    return "API reachable, database down";
  }

  return "API unreachable";
}

export function HealthStatus() {
  const { data, error, isPending } = useHealth();

  let message = "Checking API…";

  if (data) {
    message = "API ok, database up";
  } else if (error) {
    message = describeError(error);
  }

  return (
    <p role="status" aria-busy={isPending}>
      {message}
    </p>
  );
}
