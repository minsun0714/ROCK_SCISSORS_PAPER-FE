import { apiClient } from "@/shared/api/apiClient";

export type BattleRoundStatResponse = {
  totalCount: number;
  winCount: number;
  loseCount: number;
  drawCount: number;
  winRate: number;
};

export type BattleResult = "WIN" | "LOSE" | "DRAW";

export type BattleRoundHistoryResponse = {
  opponentId: number;
  nickname: string;
  profileImageUrl: string | null;
  myMove: string;
  opponentMove: string;
  playedAt: string;
};

export type Paginated<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export const getMyBattleStat = async () => {
  const { data } = await apiClient.get<BattleRoundStatResponse>(
    "/battles/stats/me",
    { authRequired: true },
  );
  return data;
};

export const getOtherBattleStat = async (userId: number) => {
  const { data } = await apiClient.get<BattleRoundStatResponse>(
    `/battles/stats/${userId}`,
    { authRequired: true },
  );
  return data;
};

export const getMyBattleHistory = async (
  keyword: string,
  battleResult: BattleResult | undefined,
  page: number,
  size: number,
) => {
  const { data } = await apiClient.get<Paginated<BattleRoundHistoryResponse>>(
    "/battles/history/me",
    {
      authRequired: true,
      params: {
        keyword: keyword || undefined,
        battleResult,
        page,
        size,
      },
    },
  );
  return data;
};

export const getOtherBattleHistory = async (
  userId: number,
  keyword: string,
  battleResult: BattleResult | undefined,
  page: number,
  size: number,
) => {
  const { data } = await apiClient.get<Paginated<BattleRoundHistoryResponse>>(
    `/battles/history/${userId}`,
    {
      authRequired: true,
      params: {
        keyword: keyword || undefined,
        battleResult,
        page,
        size,
      },
    },
  );
  return data;
};
