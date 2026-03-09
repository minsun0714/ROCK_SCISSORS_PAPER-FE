import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/service/userService";

const MY_PROFILE_QUERY_KEY = ["myProfile"] as const;

export const useMyProfileQuery = () => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: MY_PROFILE_QUERY_KEY,
    queryFn: getMyProfile,
    retry: false,
    throwOnError: true,
  });

  return {
    data,
    isPending,
    isError,
    error,
    refetch,
  };
};
