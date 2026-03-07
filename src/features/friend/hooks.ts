import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  acceptFriendRequest,
  rejectFriendRequest,
  sendFriendRequest,
} from "@/service/friendService";

export const useSendFriendRequestMutation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetUserId: number) => sendFriendRequest(targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
    },
  });
};

export const useAcceptFriendRequestMutation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => acceptFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
    },
  });
};

export const useRejectFriendRequestMutation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => rejectFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
    },
  });
};
