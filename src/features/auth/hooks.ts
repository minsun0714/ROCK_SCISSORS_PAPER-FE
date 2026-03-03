import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { consumePostLoginRedirectPath, processAuthCallback } from "@/service/authService";

export const useProcessAuthCallbackMutation = () => {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error, reset } = useMutation({
    mutationFn: processAuthCallback,
    onSuccess: ({ accessToken }) => {
      if (!accessToken) {
        return;
      }

      const redirectPath = consumePostLoginRedirectPath();
      navigate(redirectPath, { replace: true });
    },
  });

  return {
    mutate,
    isPending,
    isError,
    error,
    reset,
  };
};
