import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  acceptBattleRequest,
  createBattleRequest,
  rejectBattleRequest,
} from "@/service/battleService";

export const useSendBattleRequestMutation = () => {
  return useMutation({
    mutationFn: (targetUserId: number) => createBattleRequest(targetUserId),
    onSuccess: () => {
      toast.success("대전을 신청했습니다.");
    },
    onError: () => {
      toast.error("대전 신청에 실패했습니다.");
    },
  });
};

export const useAcceptBattleRequestMutation = () => {
  return useMutation({
    mutationFn: (requestId: number) => acceptBattleRequest(requestId),
    onSuccess: () => {
      toast.success("대전을 수락했습니다.");
    },
    onError: () => {
      toast.error("대전 수락에 실패했습니다.");
    },
  });
};

export const useRejectBattleRequestMutation = () => {
  return useMutation({
    mutationFn: (requestId: number) => rejectBattleRequest(requestId),
    onSuccess: () => {
      toast.success("대전을 거절했습니다.");
    },
    onError: () => {
      toast.error("대전 거절에 실패했습니다.");
    },
  });
};
