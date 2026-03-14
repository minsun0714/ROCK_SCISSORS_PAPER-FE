import { useQuery } from "@tanstack/react-query";
import { getMyBattleStat, getOtherBattleStat } from "@/service/battleHistoryService";

export const useMyBattleStatQuery = () => {
  return useQuery({
    queryKey: ["battleStat", "me"],
    queryFn: getMyBattleStat,
    enabled: !!localStorage.getItem("accessToken"),
    retry: false,
  });
};

export const useUserBattleStatQuery = (userId: number) => {
  return useQuery({
    queryKey: ["battleStat", userId],
    queryFn: () => getOtherBattleStat(userId),
    enabled: !!localStorage.getItem("accessToken"),
    retry: false,
  });
};
