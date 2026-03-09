import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { searchUsers } from "@/service/userService";

export const useUserSearchQuery = (keyword: string, size: number = 10) => {
  const debouncedKeyword = useDebouncedValue(keyword);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError, error } =
    useInfiniteQuery({
      queryKey: ["userSearch", debouncedKeyword, size],
      queryFn: ({ pageParam }) => searchUsers(debouncedKeyword, pageParam, size),
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
    });

  const users = data?.pages.flatMap((page) => page.content) ?? [];

  return { users, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError, error };
};
