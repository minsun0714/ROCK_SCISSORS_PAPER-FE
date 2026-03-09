import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createBattleRequest } from "@/service/battleService";

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
