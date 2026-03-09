import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendFriendRequest } from "@/service/friendService";

export const useSendFriendRequestMutation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetUserId: number) => sendFriendRequest(targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      queryClient.invalidateQueries({ queryKey: ["myPendingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["myReceivedRequests"] });
      toast.success("친구 요청을 보냈습니다.");
    },
    onError: () => {
      toast.error("친구 요청에 실패했습니다.");
    },
  });
};
