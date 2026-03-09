import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectFriendRequest } from "@/service/friendService";

export const useRejectFriendRequestMutation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => rejectFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      queryClient.invalidateQueries({ queryKey: ["myPendingRequests"] });
      toast.success("친구 요청을 거절했습니다.");
    },
    onError: () => {
      toast.error("친구 요청 거절에 실패했습니다.");
    },
  });
};
