import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/service/userService";

export const useUserProfileQuery = (userId: string) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfile(userId),
    throwOnError: true,
  });

  return { data, isPending, isError, error };
};
