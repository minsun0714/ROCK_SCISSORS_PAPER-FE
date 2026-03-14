import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyNickname } from "@/service/userService";
import { AxiosError } from "axios";

const MY_PROFILE_QUERY_KEY = ["myProfile"] as const;

export const useUpdateMyNicknameMutation = () => {
  const queryClient = useQueryClient();
  const [resultMessage, setResultMessage] = useState("");

  const { mutate, isPending, isError, error, reset } = useMutation({
    mutationFn: updateMyNickname,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_PROFILE_QUERY_KEY });
      setResultMessage("");
    },
    onError: (err: AxiosError) => {
      if (err.response && err.response.status >= 400 && err.response.status < 500) {
        setResultMessage("이미 사용 중인 닉네임입니다.");
      } else {
        setResultMessage("닉네임 변경에 실패했습니다.");
      }
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
