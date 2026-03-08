import { useEffect, useState } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  getMyProfile,
  getUserProfile,
  requestMyProfilePicturePresignedUrl,
  saveMyProfilePictureKey,
  searchUsers,
  sendHeartbeat,
  updateMyStatusMessage,
  uploadFileToPresignedUrl,
} from "@/service/userService";

const HEARTBEAT_INTERVAL_MS = 30_000;

export const useHeartbeat = (isLoggedIn: boolean) => {
  const { mutate } = useMutation({
    mutationFn: sendHeartbeat,
  });

  useEffect(() => {
    if (!isLoggedIn) return;

    mutate();
    const intervalId = setInterval(() => mutate(), HEARTBEAT_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isLoggedIn, mutate]);
};

export const useUserProfileQuery = (userId: string) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfile(userId),
  });

  return { data, isPending, isError, error };
};

const MY_PROFILE_QUERY_KEY = ["myProfile"] as const;

export const useMyProfileQuery = () => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: MY_PROFILE_QUERY_KEY,
    queryFn: getMyProfile,
    retry: false,
  });

  return {
    data,
    isPending,
    isError,
    error,
    refetch,
  };
};

export const useUpdateMyStatusMessageMutation = () => {
  const queryClient = useQueryClient();
  const [resultMessage, setResultMessage] = useState("");

  const { mutate, isPending, isError, error, reset } = useMutation({
    mutationFn: updateMyStatusMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_PROFILE_QUERY_KEY });
      setResultMessage("상태 메시지가 변경되었습니다.");
    },
    onError: () => {
      setResultMessage("상태 메시지 변경에 실패했습니다.");
    },
  });

  return {
    mutate,
    isPending,
    isError,
    error,
    reset,
    resultMessage,
    setResultMessage,
  };
};

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

export const useUploadProfileImageMutation = () => {
  const queryClient = useQueryClient();
  const [resultMessage, setResultMessage] = useState("");

  const { mutate, isPending, isError, error, reset } = useMutation({
    mutationFn: async (file: File) => {
      const { name: fileName, type: fileType } = file;
      const { presignedUrl, key } = await requestMyProfilePicturePresignedUrl({
        fileName,
        fileType,
      });

      await uploadFileToPresignedUrl({ presignedUrl, file });
      await saveMyProfilePictureKey({ key });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: MY_PROFILE_QUERY_KEY });
      setResultMessage("프로필 이미지가 업로드되었습니다.");
    },
    onError: () => {
      setResultMessage("프로필 이미지 업로드에 실패했습니다.");
    },
  });

  return {
    mutate,
    isPending,
    isError,
    error,
    reset,
    resultMessage,
    setResultMessage,
  };
};
