import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyProfile,
  requestMyProfilePicturePresignedUrl,
  saveMyProfilePictureKey,
  sendHeartbeat,
  updateMyStatusMessage,
  uploadFileToPresignedUrl,
} from "@/service/userService";

const HEARTBEAT_INTERVAL_MS = 30_000;

export const useHeartbeat = () => {
  const { mutate } = useMutation({
    mutationFn: sendHeartbeat,
  });

  useEffect(() => {
    const hasToken = !!localStorage.getItem("accessToken");
    if (!hasToken) return;

    mutate();
    const intervalId = setInterval(() => mutate(), HEARTBEAT_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [mutate]);
};

const MY_PROFILE_QUERY_KEY = ["myProfile"] as const;

export const useMyProfileQuery = () => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: MY_PROFILE_QUERY_KEY,
    queryFn: getMyProfile,
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
  const [resultMessage, setResultMessage] = useState("");

  const { mutate, isPending, isError, error, reset } = useMutation({
    mutationFn: updateMyStatusMessage,
    onSuccess: () => {
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
