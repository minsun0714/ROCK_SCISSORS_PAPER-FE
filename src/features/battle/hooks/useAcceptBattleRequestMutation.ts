import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { toBattleRouteState } from "@/features/battle/hooks/routeState";
import { acceptBattleRequest, resolveBattleId, resolveBattleRequestId, resolveBattleStatus } from "@/service/battleService";

type AcceptBattleRequestVariables = {
  requestId: string | number;
  battleId?: string | null;
  opponentUserId?: number;
  opponentNickname?: string;
  opponentProfileImageUrl?: string | null;
};

export const useAcceptBattleRequestMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ requestId }: AcceptBattleRequestVariables) => acceptBattleRequest(requestId),
    onSuccess: (data, variables) => {
      const battleId = resolveBattleId(data) ?? variables.battleId ?? null;
      const requestId = resolveBattleRequestId(data) ?? variables.requestId;

      if (!battleId) {
        toast.error("대전방 입장 정보가 올바르지 않습니다.");
        return;
      }

      toast.success("대전방에 입장했습니다.");

      navigate(`/battles/${battleId}`, {
        state: toBattleRouteState("invitee", requestId, resolveBattleStatus(data) ?? undefined, {
          userId: variables.opponentUserId,
          nickname: variables.opponentNickname,
          profileImageUrl: variables.opponentProfileImageUrl ?? null,
        }),
      });
    },
    onError: () => {
      toast.error("대전 수락에 실패했습니다.");
    },
  });
};