import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/service/userService";

const MY_PROFILE_QUERY_KEY = ["myProfile"] as const;

type UseMyProfileQueryOptions = {
  throwOnError?: boolean;
};

const safeGetMyProfile = async () => {
  if (!localStorage.getItem("accessToken")) {
    return null;
  }

  return getMyProfile();
};

export const useMyProfileQuery = ({ throwOnError = true }: UseMyProfileQueryOptions = {}) => {
  const { data, isPending, isFetching, isError, error, refetch } = useQuery({
    queryKey: MY_PROFILE_QUERY_KEY,
    queryFn: safeGetMyProfile,
    retry: false,
    throwOnError,
  });

  return {
    data: data ?? undefined,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  };
};
