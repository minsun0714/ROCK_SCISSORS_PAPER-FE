import { useQuery } from "@tanstack/react-query";
import { getMyBattleStat, getOtherBattleStat } from "@/service/battleHistoryService";

export const useBattleStatQuery = (userId?: number | "me") => {
  const isMe = userId === "me";

  return useQuery({
    queryKey: ["battleStat", userId],
    queryFn: () => (isMe ? getMyBattleStat() : getOtherBattleStat(userId!)),
    enabled: userId != null,
    retry: false,
  });
};
