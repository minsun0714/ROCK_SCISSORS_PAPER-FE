import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { cancelBattleRequest } from "@/service/battleService";

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