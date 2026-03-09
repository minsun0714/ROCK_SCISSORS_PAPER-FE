import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelFriendRequest } from "@/service/friendService";

export const useCancelFriendRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => cancelFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myReceivedRequests"] });
      toast.success("친구 요청을 취소했습니다.");
    },
    onError: () => {
      toast.error("친구 요청 취소에 실패했습니다.");
    },
  });
};
