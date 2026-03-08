import { apiClient } from "@/service/apiClient";
import type { FriendStatus, Paginated, PresenceStatus } from "@/service/userService";

export type FriendResponse = {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  presenceStatus: PresenceStatus;
  friendStatus: FriendStatus;
  friendRequestId: number | null;
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

export const acceptFriendRequest = async (requestId: number) => {
  const { data } = await apiClient.patch(
    `/friends/requests/${requestId}/accept`,
    null,
    { authRequired: true },
  );

  return data;
};

export const rejectFriendRequest = async (requestId: number) => {
  const { data } = await apiClient.patch(
    `/friends/requests/${requestId}/reject`,
    null,
    { authRequired: true },
  );

  return data;
};
