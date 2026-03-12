import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { rejectBattleRequest } from "@/service/battleService";

export const useRejectBattleRequestMutation = () => {
  return useMutation({
    mutationFn: (requestId: string | number) => rejectBattleRequest(requestId),
    onSuccess: () => {
      toast.success("대전을 거절했습니다.");
    },
    onError: () => {
      toast.error("대전 거절에 실패했습니다.");
    },
  });
};
