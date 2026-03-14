import { API_BASE_URL, apiClient } from "@/shared/api/apiClient";

const GOOGLE_LOGIN_URL = `${API_BASE_URL}/oauth2/authorization/google`;
const POST_LOGIN_REDIRECT_KEY = "postLoginRedirectPath";

type ExchangeBody = {
  accessToken?: string;
  access_token?: string;
  token?: string;
};

export const exchangeAuthCode = async (code: string) => {
  const {
    headers: { authorization },
  } = await apiClient.get<ExchangeBody>("/auth/exchange", {
    params: { code },
  });
  const accessToken = authorization as string | undefined;

  return {
    accessToken,
  };
};

export const processAuthCallback = async (code: string) => {
  try {
    const { accessToken } = await exchangeAuthCode(code);

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }

    console.log("Access token:", accessToken);
    return { ok: true, accessToken };
  } catch (error) {
    console.error("Error fetching access token:", error);
    return { ok: false as const, accessToken: null };
  }
};

const isKakaoInAppBrowser = () => /KAKAOTALK/i.test(navigator.userAgent);

export const startGoogleLogin = () => {
  const {
    location: { pathname, search, hash },
  } = window;
  const currentPath = `${pathname}${search}${hash}`;
  sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, currentPath);

  if (isKakaoInAppBrowser()) {
    const cleanUrl = `${window.location.origin}${currentPath}`;
    window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(cleanUrl)}`;
    return;
  }

  window.location.replace(GOOGLE_LOGIN_URL);
};

export const logout = async () => {
  try {
    await apiClient.post("/auth/logout", null, { authRequired: true });
  } finally {
    localStorage.removeItem("accessToken");
    window.location.replace("/");
  }
};

export const consumePostLoginRedirectPath = () => {
  const savedPath = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
  sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);

  if (!savedPath || savedPath.startsWith("/oauth/callback")) {
    return "/";
  }

  return savedPath;
};
