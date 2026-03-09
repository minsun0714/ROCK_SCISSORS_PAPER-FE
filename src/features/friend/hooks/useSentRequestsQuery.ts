import { useInfiniteQuery } from "@tanstack/react-query";
import { getRequestedRequests } from "@/service/friendService";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";

export const useSentRequestsQuery = (
  keyword: string,
  size: number = 10,
  enabled: boolean = true,
) => {
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
