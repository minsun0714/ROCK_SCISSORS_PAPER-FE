import { useInfiniteQuery } from "@tanstack/react-query";
import type { BattleResult } from "@/service/battleHistoryService";
import { getMyBattleHistory, getOtherBattleHistory } from "@/service/battleHistoryService";

export const useBattleHistoryQuery = (
  userId: number | "me",
  keyword: string,
  battleResult: BattleResult | undefined,
  size = 10,
) => {
  const isMe = userId === "me";

  return useInfiniteQuery({
    queryKey: ["battleHistory", userId, keyword, battleResult, size],
    queryFn: ({ pageParam = 0 }) =>
      isMe
        ? getMyBattleHistory(keyword, battleResult, pageParam, size)
        : getOtherBattleHistory(userId, keyword, battleResult, pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
    retry: false,
  });
};
