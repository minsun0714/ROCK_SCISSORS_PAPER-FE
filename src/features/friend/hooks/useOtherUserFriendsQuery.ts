import { useInfiniteQuery } from "@tanstack/react-query";
import { getOtherUserFriends } from "@/service/friendService";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";

export const useOtherUserFriendsQuery = (userId: number, keyword: string, size: number = 10) => {
  const debouncedKeyword = useDebouncedValue(keyword);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } =
    useInfiniteQuery({
      queryKey: ["userFriends", userId, debouncedKeyword, size],
      queryFn: ({ pageParam }) => getOtherUserFriends(userId, debouncedKeyword, pageParam, size),
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
      throwOnError: true,
    });

  const friends = data?.pages.flatMap((page) => page.content) ?? [];

  return { friends, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError };
};
