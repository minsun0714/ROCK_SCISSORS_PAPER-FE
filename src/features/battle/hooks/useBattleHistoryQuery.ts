import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import type { BattleResult } from "@/service/battleHistoryService";
import { getMyBattleHistory, getOtherBattleHistory } from "@/service/battleHistoryService";

export const useMyBattleHistoryQuery = (
  keyword: string,
  battleResult: BattleResult | undefined,
  size = 10,
) => {
  return useInfiniteQuery({
    queryKey: ["battleHistory", "me", keyword, battleResult, size],
    queryFn: ({ pageParam = 0 }) => getMyBattleHistory(keyword, battleResult, pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.content.length < size || lastPage.page + 1 >= lastPage.totalPages
        ? undefined
        : lastPage.page + 1,
    placeholderData: keepPreviousData,
    enabled: !!localStorage.getItem("accessToken"),
    retry: false,
  });
};

export const useUserBattleHistoryQuery = (
  userId: number,
  keyword: string,
  battleResult: BattleResult | undefined,
  size = 10,
) => {
  return useInfiniteQuery({
    queryKey: ["battleHistory", userId, keyword, battleResult, size],
    queryFn: ({ pageParam = 0 }) => getOtherBattleHistory(userId, keyword, battleResult, pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.content.length < size || lastPage.page + 1 >= lastPage.totalPages
        ? undefined
        : lastPage.page + 1,
    placeholderData: keepPreviousData,
    retry: false,
  });
};
