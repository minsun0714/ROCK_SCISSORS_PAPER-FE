import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  acceptFriendRequest,
  getMyFriends,
  getOtherUserFriends,
  rejectFriendRequest,
  sendFriendRequest,
} from "@/service/friendService";

const MY_FRIENDS_QUERY_KEY = ["myFriends"] as const;

export const useMyFriendsQuery = (keyword: string, size: number = 10) => {
  const debouncedKeyword = useDebouncedValue(keyword);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } =
    useInfiniteQuery({
      queryKey: [...MY_FRIENDS_QUERY_KEY, debouncedKeyword, size],
      queryFn: ({ pageParam }) => getMyFriends(debouncedKeyword, pageParam, size),
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
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
