import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { toBattleRouteState } from "@/features/battle/hooks/routeState";
import { createBattleRequest, resolveBattleId, resolveBattleRequestId, resolveBattleStatus } from "@/service/battleService";

type SendBattleRequestVariables = {
  targetUserId: number;
  opponentNickname?: string;
  opponentProfileImageUrl?: string | null;
};

export const useSendBattleRequestMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ targetUserId }: SendBattleRequestVariables) => createBattleRequest(targetUserId),
    onSuccess: (data, variables) => {
      const battleId = resolveBattleId(data);
      const requestId = resolveBattleRequestId(data);

      if (!battleId) {
        toast.error("대전방 정보를 찾지 못했습니다.");
        return;
      }

      toast.success("대전을 신청했습니다.");

      navigate(`/battles/${battleId}`, {
        state: toBattleRouteState("creator", requestId, resolveBattleStatus(data) ?? undefined, {
          userId: variables.targetUserId,
          nickname: variables.opponentNickname,
          profileImageUrl: variables.opponentProfileImageUrl ?? null,
        }),
      });
    },
    onError: () => {
      toast.error("대전 신청에 실패했습니다.");
    },
  });
};