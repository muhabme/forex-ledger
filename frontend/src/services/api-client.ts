const API_PREFIX = "/api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(method: HttpMethod, path: string, status: number, body: unknown) {
    super(
      `${method} ${API_PREFIX}${path} failed with status ${String(status)}`,
    );
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

// Returns the parsed JSON body as `unknown` (null when there is none, e.g. 204);
// each service function states the response type it expects from the back end.
async function request(
  method: HttpMethod,
  path: string,
  body?: unknown,
): Promise<unknown> {
  const hasBody = body !== undefined;
  const response = await fetch(`${API_PREFIX}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
    },
    ...(hasBody ? { body: JSON.stringify(body) } : {}),
  });
  const responseBody: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(method, path, response.status, responseBody);
  }

  return responseBody;
}

const apiGet = (path: string) => request("GET", path);
const apiPost = (path: string, body: unknown) => request("POST", path, body);
const apiPut = (path: string, body: unknown) => request("PUT", path, body);
const apiDelete = (path: string) => request("DELETE", path);

export const apiClient = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
};
