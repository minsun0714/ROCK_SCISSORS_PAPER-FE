import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

type UpdateStatusMessageParams = {
  statusMessage: string;
};

type PresignedUrlRequestParams = {
  fileName: string;
  fileType: string;
};

type ProfilePicturePresignedResponse = {
  presignedUrl?: string;
  uploadUrl?: string;
  url?: string;
  key?: string;
  fileKey?: string;
};

type SaveProfilePictureKeyParams = {
  key: string;
};

export type MyProfileResponse = {
  profileImageUrl?: string | null;
};

const getAuthorizationHeader = () => {
  const storedToken = localStorage.getItem("accessToken");
  const authorization = storedToken
    ? storedToken.startsWith("Bearer ")
      ? storedToken
      : `Bearer ${storedToken}`
    : undefined;

  return authorization ? { Authorization: authorization } : undefined;
};

export const updateMyStatusMessage = async ({
  statusMessage,
}: UpdateStatusMessageParams) => {
  const response = await axios.patch(
    `${API_BASE_URL}/users/me/status-message`,
    { statusMessage },
    {
      withCredentials: true,
      headers: getAuthorizationHeader(),
    },
  );

  return response.data;
};

export const requestMyProfilePicturePresignedUrl = async ({
  fileName,
  fileType,
}: PresignedUrlRequestParams) => {
  const response = await axios.post<ProfilePicturePresignedResponse>(
    `${API_BASE_URL}/users/me/profile-picture`,
    { fileName, fileType },
    {
      withCredentials: true,
      headers: getAuthorizationHeader(),
    },
  );

  const presignedUrl =
    response.data.presignedUrl ?? response.data.uploadUrl ?? response.data.url;
  const key = response.data.key ?? response.data.fileKey;

  if (!presignedUrl || !key) {
    throw new Error("프리사인드 URL 응답 형식이 올바르지 않습니다.");
  }

  return { presignedUrl, key };
};

export const uploadFileToPresignedUrl = async ({
  presignedUrl,
  file,
}: {
  presignedUrl: string;
  file: File;
}) => {
  const response = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`S3 업로드 실패: ${response.status} ${errorBody}`);
  }
};

export const saveMyProfilePictureKey = async ({
  key,
}: SaveProfilePictureKeyParams) => {
  const response = await axios.patch(
    `${API_BASE_URL}/users/me/profile-picture`,
    { key },
    {
      withCredentials: true,
      headers: getAuthorizationHeader(),
    },
  );

  return response.data;
};

export const getMyProfile = async () => {
  const response = await axios.get<MyProfileResponse>(
    `${API_BASE_URL}/users/me`,
    {
      withCredentials: true,
      headers: getAuthorizationHeader(),
    },
  );

  return response.data;
};
