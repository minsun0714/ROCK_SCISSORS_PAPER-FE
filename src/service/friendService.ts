import { apiClient } from "@/service/apiClient";
import type { FriendStatus, Paginated, PresenceStatus } from "@/service/userService";

type FriendInfo = {
  status: FriendStatus;
  friendRequestId: number | null;
};

export type FriendResponse = {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  statusMessage: string | null;
  presenceStatus: PresenceStatus;
  friendInfo: FriendInfo | null;
};

export const getMyFriends = async (keyword: string, page: number, size: number) => {
  const { data } = await apiClient.get<Paginated<FriendResponse>>("/friends/me", {
    params: { keyword, page, size },
    authRequired: true,
  });

  return data;
};

export const getOtherUserFriends = async (
  userId: number,
  keyword: string,
  page: number,
  size: number,
) => {
  const { data } = await apiClient.get<Paginated<FriendResponse>>(`/friends/${userId}`, {
    params: { keyword, page, size },
  });

  return data;
};

export const getPendingRequests = async (keyword: string, page: number, size: number) => {
  const { data } = await apiClient.get<Paginated<FriendResponse>>("/friends/requests/pending", {
    params: { keyword, page, size },
    authRequired: true,
  });

  return data;
};

export const getRequestedRequests = async (keyword: string, page: number, size: number) => {
  const { data } = await apiClient.get<Paginated<FriendResponse>>("/friends/requests/requested", {
    params: { keyword, page, size },
    authRequired: true,
  });

  return data;
};

export const sendFriendRequest = async (targetUserId: number) => {
  const { data } = await apiClient.post(
    "/friends/requests",
    { targetUserId },
    { authRequired: true },
  );

  return data;
};

export const cancelFriendRequest = async (requestId: number) => {
  const { data } = await apiClient.delete(`/friends/requests/${requestId}`, {
    authRequired: true,
  });

  return data;
};

export const acceptFriendRequest = async (requestId: number) => {
  const { data } = await apiClient.patch(`/friends/requests/${requestId}/accept`, null, {
    authRequired: true,
  });

  return data;
};

export const rejectFriendRequest = async (requestId: number) => {
  const { data } = await apiClient.patch(`/friends/requests/${requestId}/reject`, null, {
    authRequired: true,
  });

  return data;
};
