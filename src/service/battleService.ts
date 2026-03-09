import { apiClient } from "@/shared/api/apiClient";

export type BattleRequestResponse = {
  requestId: number;
  targetUserId: number;
  status: string;
};

export const createBattleRequest = async (targetUserId: number) => {
  const { data } = await apiClient.post<BattleRequestResponse>(
    "/battles/requests",
    { targetUserId },
    { authRequired: true },
  );

  return data;
};

export const cancelBattleRequest = async (requestId: number) => {
  await apiClient.delete(`/battles/requests/${requestId}`, {
    authRequired: true,
  });
};

export const acceptBattleRequest = async (requestId: number) => {
  const { data } = await apiClient.patch(
    `/battles/requests/${requestId}/accept`,
    null,
    { authRequired: true },
  );

  return data;
};

export const rejectBattleRequest = async (requestId: number) => {
  const { data } = await apiClient.patch(
    `/battles/requests/${requestId}/reject`,
    null,
    { authRequired: true },
  );

  return data;
};
