import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  getMyFriends,
  getOtherUserFriends,
  getPendingRequests,
  getRequestedRequests,
  rejectFriendRequest,
  sendFriendRequest,
} from "@/service/friendService";

const MY_FRIENDS_QUERY_KEY = ["myFriends"] as const;

export const useMyFriendsQuery = (keyword: string, size: number = 10, enabled: boolean = true) => {
  const debouncedKeyword = useDebouncedValue(keyword);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } =
    useInfiniteQuery({
      queryKey: [...MY_FRIENDS_QUERY_KEY, debouncedKeyword, size],
      queryFn: ({ pageParam }) => getMyFriends(debouncedKeyword, pageParam, size),
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
      enabled,
    });

  const friends = data?.pages.flatMap((page) => page.content) ?? [];

  return { friends, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError };
};

export const useReceivedRequestsQuery = (keyword: string, size: number = 10, enabled: boolean = true) => {
  const debouncedKeyword = useDebouncedValue(keyword);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } =
    useInfiniteQuery({
      queryKey: ["myPendingRequests", debouncedKeyword, size],
      queryFn: ({ pageParam }) => getPendingRequests(debouncedKeyword, pageParam, size),
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
      enabled,
    });

  const friends = data?.pages.flatMap((page) => page.content) ?? [];

  return { friends, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError };
};

export const useSentRequestsQuery = (keyword: string, size: number = 10, enabled: boolean = true) => {
  const debouncedKeyword = useDebouncedValue(keyword);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } =
    useInfiniteQuery({
      queryKey: ["myReceivedRequests", debouncedKeyword, size],
      queryFn: ({ pageParam }) => getRequestedRequests(debouncedKeyword, pageParam, size),
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
      enabled,
    });

  const friends = data?.pages.flatMap((page) => page.content) ?? [];

  return { friends, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError };
};

export const useOtherUserFriendsQuery = (userId: number, keyword: string, size: number = 10) => {
  const debouncedKeyword = useDebouncedValue(keyword);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } =
    useInfiniteQuery({
      queryKey: ["userFriends", userId, debouncedKeyword, size],
      queryFn: ({ pageParam }) => getOtherUserFriends(userId, debouncedKeyword, pageParam, size),
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
    });

  const friends = data?.pages.flatMap((page) => page.content) ?? [];

  return { friends, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError };
};

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

export const useAcceptFriendRequestMutation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => acceptFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      queryClient.invalidateQueries({ queryKey: MY_FRIENDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["myPendingRequests"] });
      toast.success("친구 요청을 수락했습니다.");
    },
    onError: () => {
      toast.error("친구 요청 수락에 실패했습니다.");
    },
  });
};

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
