import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { BattleParticipantPreview, BattleRouteState } from "@/features/battle/types";
import {
  acceptBattleRequest,
  cancelBattleRequest,
  createBattleRequest,
  resolveBattleId,
  resolveBattleRequestId,
  resolveBattleStatus,
} from "@/service/battleService";

type SendBattleRequestVariables = {
  targetUserId: number;
  opponentNickname?: string;
  opponentProfileImageUrl?: string | null;
};

type AcceptBattleRequestVariables = {
  requestId: string | number;
  battleId?: string | null;
  opponentUserId?: number;
  opponentNickname?: string;
  opponentProfileImageUrl?: string | null;
};

const toBattleRouteState = (
  role: BattleRouteState["role"],
  requestId: string | number | undefined,
  battleStatus: string | undefined,
  opponent?: BattleParticipantPreview,
): BattleRouteState => ({
  role,
  requestId,
  battleStatus: battleStatus ?? null,
  opponent,
});

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

export const useCancelBattleRequestMutation = () => {
  return useMutation({
    mutationFn: (requestId: string | number) => cancelBattleRequest(requestId),
    onSuccess: () => {
      toast.success("대전을 취소했습니다.");
    },
    onError: () => {
      toast.error("대전 취소에 실패했습니다.");
    },
  });
};
