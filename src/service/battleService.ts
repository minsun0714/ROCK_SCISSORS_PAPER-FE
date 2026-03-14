import { API_BASE_URL, apiClient } from "@/shared/api/apiClient";

type BattleIdLike = string | number;
type BattleRequestIdentifier = string | number;

export type BattleRequestResponse = {
  requestId?: number;
  id?: number;
  battleRequestId?: number;
  targetUserId?: number;
  status?: string;
  battleStatus?: string;
  opponentId?: number;
  createdAt?: string;
  battleId?: BattleIdLike | null;
  roomId?: BattleIdLike | null;
  battleRoomId?: BattleIdLike | null;
  battle?: {
    id?: BattleIdLike | null;
    requestId?: number | null;
    battleRequestId?: number | null;
    battleStatus?: string | null;
    battleId?: BattleIdLike | null;
    roomId?: BattleIdLike | null;
  } | null;
  request?: {
    id?: number | null;
    requestId?: number | null;
    battleRequestId?: number | null;
    battleStatus?: string | null;
    battleId?: BattleIdLike | null;
    roomId?: BattleIdLike | null;
    battleRoomId?: BattleIdLike | null;
  } | null;
};

export type AcceptBattleRequestResponse = BattleRequestResponse;

export const resolveBattleRequestId = (payload?: BattleRequestResponse | null) => {
  const requestId = [
    payload?.roomId,
    payload?.battleRoomId,
    payload?.requestId,
    payload?.id,
    payload?.battleRequestId,
    payload?.battle?.roomId,
    payload?.battle?.requestId,
    payload?.battle?.battleRequestId,
    payload?.request?.roomId,
    payload?.request?.battleRoomId,
    payload?.request?.id,
    payload?.request?.requestId,
    payload?.request?.battleRequestId,
  ].find((value) => value != null);

  return requestId == null ? undefined : Number(requestId);
};

export const resolveBattleStatus = (payload?: BattleRequestResponse | null) => {
  return (
    payload?.battleStatus ??
    payload?.status ??
    payload?.battle?.battleStatus ??
    payload?.request?.battleStatus ??
    null
  );
};

export const resolveBattleId = (payload?: BattleRequestResponse | null) => {
  const battleId = [
    payload?.battleId,
    payload?.roomId,
    payload?.battleRoomId,
    payload?.battle?.battleId,
    payload?.battle?.roomId,
    payload?.battle?.id,
    payload?.request?.battleId,
    payload?.request?.roomId,
    payload?.request?.battleRoomId,
  ].find((value) => value != null);

  return battleId == null ? null : String(battleId);
};

export const createBattleRequest = async (targetUserId: number) => {
  const { data } = await apiClient.post<BattleRequestResponse>(
    "/battles/requests",
    { targetUserId },
    { authRequired: true },
  );

  return data;
};

export const acceptBattleRequest = async (requestId: BattleRequestIdentifier) => {
  const { data } = await apiClient.patch<AcceptBattleRequestResponse>(
    `/battles/requests/${requestId}/accept`,
    null,
    { authRequired: true },
  );

  return data;
};

export const rejectBattleRequest = async (requestId: BattleRequestIdentifier) => {
  const { data } = await apiClient.patch(
    `/battles/requests/${requestId}/reject`,
    null,
    { authRequired: true },
  );

  return data;
};

export const cancelBattleRequest = async (requestId: BattleRequestIdentifier) => {
  await apiClient.delete(`/battles/requests/${requestId}`, {
    authRequired: true,
  });
};

export const cancelBattleRequestOnExit = (requestId: BattleRequestIdentifier, cachedToken?: string | null) => {
  const token = cachedToken ?? localStorage.getItem("accessToken");
  const authorization =
    token == null ? undefined : token.startsWith("Bearer ") ? token : `Bearer ${token}`;

  void fetch(`${API_BASE_URL}/battles/requests/${requestId}`, {
    method: "DELETE",
    keepalive: true,
    credentials: "include",
    headers: authorization
      ? {
          Authorization: authorization,
        }
      : undefined,
  });
};
