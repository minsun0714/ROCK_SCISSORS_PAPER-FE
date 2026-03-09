import axios from "axios";
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

export type PresenceStatus = "ONLINE" | "OFFLINE" | "IN_BATTLE";

export type FriendStatus = "NONE" | "PENDING" | "REQUESTED" | "FRIEND";

type FriendInfo = {
  status: FriendStatus;
  friendRequestId?: number | null;
};

export type UserProfileResponse = {
  userId?: number | null;
  nickname?: string | null;
  profileImageUrl?: string | null;
  statusMessage?: string | null;
  friendInfo?: FriendInfo | null;
};

export type MyProfileResponse = {
  userId?: number | null;
  profileImageUrl?: string | null;
  statusMessage?: string | null;
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
  await axios.put(presignedUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
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

export const sendHeartbeat = async () => {
  const { data } = await apiClient.post("/users/me/presence/heartbeat", null, {
    authRequired: true,
  });

  return data;
};

type BulkPresenceResponse = {
  presenceStatuses: Record<string, PresenceStatus>;
};

export const getBulkPresence = async (userIds: number[]) => {
  const { data } = await apiClient.post<BulkPresenceResponse>("/users/presence", { userIds });

  return data.presenceStatuses;
};

export const getUserProfile = async (userId: string) => {
  const { data } = await apiClient.get<UserProfileResponse>(`/users/${userId}`, {
    authRequired: true,
  });

  return data;
};

export const getMyProfile = async () => {
  const { data } = await apiClient.get<MyProfileResponse>("/users/me", {
    authRequired: true,
  });

  return data;
};

export type UserSearchResponse = {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  presenceStatus: PresenceStatus;
  friendStatus: FriendStatus;
};

export type Paginated<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export const searchUsers = async (keyword: string, page: number = 0, size: number = 10) => {
  const hasToken = !!localStorage.getItem("accessToken");

  const { data } = await apiClient.get<Paginated<UserSearchResponse>>("/users/search", {
    params: { keyword, page, size },
    authRequired: hasToken,
  });

  return data;
};
