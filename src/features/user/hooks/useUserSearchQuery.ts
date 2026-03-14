import { useInfiniteQuery } from "@tanstack/react-query";
import { searchUsers } from "@/service/userService";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";

export const useUserSearchQuery = (keyword: string, size: number = 10) => {
  const debouncedKeyword = useDebouncedValue(keyword);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError, error } =
    useInfiniteQuery({
      queryKey: ["userSearch", debouncedKeyword, size],
      queryFn: ({ pageParam }) => searchUsers(debouncedKeyword, pageParam, size),
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.content.length < size || lastPage.page + 1 >= lastPage.totalPages
          ? undefined
          : lastPage.page + 1,
      throwOnError: true,
    });

  const users = data?.pages.flatMap((page) => page.content) ?? [];

  return { users, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError, error };
};
