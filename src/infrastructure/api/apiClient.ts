export type ApiClientOptions = {
  baseUrl: string;
  getIdToken?: () => Promise<string | null>;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly payload?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export class ApiClient {
  constructor(private readonly options: ApiClientOptions) {}

  get<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  post<T>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  private async request<T>(path: string, options: RequestOptions): Promise<T> {
    const headers = new Headers(options.headers);
    headers.set("Accept", "application/json");

    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (options.auth) {
      const token = await this.options.getIdToken?.();

      if (!token) {
        throw new ApiError("Necesitás iniciar sesión para continuar.", 401);
      }

      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(new URL(path, this.options.baseUrl).toString(), {
      ...options,
      headers,
    });

    const payload = await parseJson(response);

    if (!response.ok) {
      throw new ApiError(getErrorMessage(payload, response.status), response.status, payload);
    }

    return payload as T;
  }
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getErrorMessage(payload: unknown, status: number): string {
  if (payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string") {
    return payload.error;
  }

  return `Error de API (${status}).`;
}
