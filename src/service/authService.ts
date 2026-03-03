import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const GOOGLE_LOGIN_URL = `${API_BASE_URL}/oauth2/authorization/google`;
const POST_LOGIN_REDIRECT_KEY = "postLoginRedirectPath";

type ExchangeBody = {
  accessToken?: string;
  access_token?: string;
  token?: string;
};

export const exchangeAuthCode = async (code: string) => {
  const response = await axios.get<ExchangeBody>(`${API_BASE_URL}/auth/exchange`, {
    params: { code },
    withCredentials: true,
  });

  const accessToken = response.headers.authorization as string | undefined;

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

export const startGoogleLogin = () => {
  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, currentPath);
  window.location.href = GOOGLE_LOGIN_URL;
};

export const consumePostLoginRedirectPath = () => {
  const savedPath = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
  sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);

  if (!savedPath || savedPath.startsWith("/oauth/callback")) {
    return "/";
  }

  return savedPath;
};
