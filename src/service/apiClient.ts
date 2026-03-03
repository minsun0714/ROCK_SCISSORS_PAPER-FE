import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

declare module "axios" {
  interface AxiosRequestConfig {
    authRequired?: boolean;
  }

  interface InternalAxiosRequestConfig {
    authRequired?: boolean;
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

type TokenResponse = {
  accessToken?: string;
  access_token?: string;
  token?: string;
  csrfToken?: string;
  csrf_token?: string;
};

const getAccessToken = () => localStorage.getItem("accessToken");

const toBearerToken = (token?: string | null) => {
  if (!token) {
    return null;
  }

  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
};

const saveAccessToken = (token?: string | null) => {
  const bearerToken = toBearerToken(token);

  if (!bearerToken) {
    return;
  }

  localStorage.setItem("accessToken", bearerToken);
};

const readCookie = (name: string) => {
  const encodedName = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(";");

  for (const rawCookie of cookies) {
    const cookie = rawCookie.trim();
    if (cookie.startsWith(encodedName)) {
      return decodeURIComponent(cookie.slice(encodedName.length));
    }
  }

  return null;
};

const extractAccessToken = (data?: TokenResponse, authorizationHeader?: string) => {
  const headerToken = authorizationHeader;
  const bodyToken = data?.accessToken ?? data?.access_token ?? data?.token;

  return headerToken ?? bodyToken ?? null;
};

const extractCsrfToken = (data?: TokenResponse, csrfHeader?: string) => {
  return (
    csrfHeader ?? data?.csrfToken ?? data?.csrf_token ?? data?.token ?? readCookie("XSRF-TOKEN")
  );
};

const fetchCsrfToken = async () => {
  const response = await axios.get<TokenResponse>(`${API_BASE_URL}/csrf`, {
    withCredentials: true,
  });

  return extractCsrfToken(response.data, response.headers["x-csrf-token"] as string | undefined);
};

const refreshAccessToken = async () => {
  const csrfToken = await fetchCsrfToken();

  const response = await axios.post<TokenResponse>(
    `${API_BASE_URL}/auth/refresh`,
    {},
    {
      withCredentials: true,
      headers: csrfToken
        ? {
            "X-CSRF-TOKEN": csrfToken,
            "X-XSRF-TOKEN": csrfToken,
          }
        : undefined,
    },
  );

  const token = extractAccessToken(
    response.data,
    response.headers.authorization as string | undefined,
  );

  saveAccessToken(token);

  return toBearerToken(token);
};

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

apiClient.interceptors.request.use((config) => {
  const token = config.authRequired ? toBearerToken(getAccessToken()) : null;

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = token;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as InternalAxiosRequestConfig | undefined;

    if (!originalRequest || status !== 401 || !originalRequest.authRequired) {
      return Promise.reject(error);
    }

    try {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken();
      }

      await refreshPromise;
      return Promise.reject(error);
    } catch (refreshError) {
      localStorage.removeItem("accessToken");
      return Promise.reject(refreshError);
    } finally {
      if (isRefreshing) {
        isRefreshing = false;
        refreshPromise = null;
      }
    }
  },
);
