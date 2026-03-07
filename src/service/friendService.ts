import { apiClient } from "@/service/apiClient";

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
