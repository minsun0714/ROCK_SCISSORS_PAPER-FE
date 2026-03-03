import { apiClient } from "@/service/apiClient";

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

export const updateMyStatusMessage = async ({ statusMessage }: UpdateStatusMessageParams) => {
  const { data } = await apiClient.patch(
    "/users/me/status-message",
    { statusMessage },
    {
      authRequired: true,
    },
  );

  return data;
};

export const requestMyProfilePicturePresignedUrl = async ({
  fileName,
  fileType,
}: PresignedUrlRequestParams) => {
  const { data } = await apiClient.post<ProfilePicturePresignedResponse>(
    "/users/me/profile-picture",
    { fileName, fileType },
    {
      authRequired: true,
    },
  );

  const { presignedUrl, uploadUrl, url, key, fileKey } = data;
  const resolvedPresignedUrl = presignedUrl ?? uploadUrl ?? url;
  const resolvedKey = key ?? fileKey;

  if (!resolvedPresignedUrl || !resolvedKey) {
    throw new Error("프리사인드 URL 응답 형식이 올바르지 않습니다.");
  }

  return { presignedUrl: resolvedPresignedUrl, key: resolvedKey };
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
  const { ok, status } = response;

  if (!ok) {
    const errorBody = await response.text();
    throw new Error(`S3 업로드 실패: ${status} ${errorBody}`);
  }
};

export const saveMyProfilePictureKey = async ({ key }: SaveProfilePictureKeyParams) => {
  const { data } = await apiClient.patch(
    "/users/me/profile-picture",
    { key },
    {
      authRequired: true,
    },
  );

  return data;
};

export const getMyProfile = async () => {
  const { data } = await apiClient.get<MyProfileResponse>("/users/me", {
    authRequired: true,
  });

  return data;
};
