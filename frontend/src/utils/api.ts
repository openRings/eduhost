import { currentAccessToken, isAuthorized, refreshSession } from "./auth";

export type FetchApiOptions = Omit<RequestInit, "body"> & {
  authRedirect?: boolean;
  query?: Record<string, string>;
  body?: any;
};

export type FetchApiResponse<T> = {
  status: number;
  body: T;
};

export async function fetchApi<T = any>(
  path: string,
  options?: FetchApiOptions,
): Promise<FetchApiResponse<T>> {
  let { body, query, authRedirect, ...fetchOptions } = options ?? {};

  if (body) body = JSON.stringify(body);

  let fetchPath = `/api${path}`;
  if (query) fetchPath = `${path}?${new URLSearchParams(query).toString()}`;

  if (!currentAccessToken() && isAuthorized()) await refreshSession();

  const headers = new Headers(fetchOptions.headers);
  const accessToken = currentAccessToken();

  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  if (body) headers.set("Content-Type", "application/json");

  const response = await fetch(fetchPath, { ...fetchOptions, headers });
  const status = response.status;

  if (status == 401) {
    if (isAuthorized()) {
      await refreshSession(authRedirect ?? true);
      return fetchApi(path, options);
    }

    !(authRedirect == false) && window.location.assign("/signin");
  }

  const responseBody: T = await response.json();

  return {
    status,
    body: responseBody,
  };
}
