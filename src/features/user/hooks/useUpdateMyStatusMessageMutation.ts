import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyStatusMessage } from "@/service/userService";

const MY_PROFILE_QUERY_KEY = ["myProfile"] as const;

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
