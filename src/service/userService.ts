import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

type UpdateStatusMessageParams = {
  statusMessage: string;
};

export const updateMyStatusMessage = async ({
  statusMessage,
}: UpdateStatusMessageParams) => {
  const storedToken = localStorage.getItem("accessToken");
  const authorization = storedToken
    ? storedToken.startsWith("Bearer ")
      ? storedToken
      : `Bearer ${storedToken}`
    : undefined;

  const response = await axios.patch(
    `${API_BASE_URL}/users/me/status-message`,
    { statusMessage },
    {
      withCredentials: true,
      headers: authorization ? { Authorization: authorization } : undefined,
    },
  );

  return response.data;
};
