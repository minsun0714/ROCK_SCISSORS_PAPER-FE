import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  requestMyProfilePicturePresignedUrl,
  saveMyProfilePictureKey,
  uploadFileToPresignedUrl,
} from "@/service/userService";

const MY_PROFILE_QUERY_KEY = ["myProfile"] as const;

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
