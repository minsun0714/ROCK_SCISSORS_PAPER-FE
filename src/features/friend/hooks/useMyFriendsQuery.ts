import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyFriends } from "@/service/friendService";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";

export const useMyFriendsQuery = (keyword: string, size: number = 10, enabled: boolean = true) => {
  const debouncedKeyword = useDebouncedValue(keyword);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } =
    useInfiniteQuery({
      queryKey: ["myFriends", debouncedKeyword, size],
      queryFn: ({ pageParam }) => getMyFriends(debouncedKeyword, pageParam, size),
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
      enabled,
      throwOnError: true,
    });

  const friends = data?.pages.flatMap((page) => page.content) ?? [];

  return { friends, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError };
};
