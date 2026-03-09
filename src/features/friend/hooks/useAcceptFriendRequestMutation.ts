import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest } from "@/service/friendService";

export const useAcceptFriendRequestMutation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => acceptFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      queryClient.invalidateQueries({ queryKey: ["myFriends"] });
      queryClient.invalidateQueries({ queryKey: ["myPendingRequests"] });
      toast.success("친구 요청을 수락했습니다.");
    },
    onError: () => {
      toast.error("친구 요청 수락에 실패했습니다.");
    },
  });
};
