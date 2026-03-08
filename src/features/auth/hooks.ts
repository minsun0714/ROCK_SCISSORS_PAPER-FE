import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { consumePostLoginRedirectPath, processAuthCallback } from "@/service/authService";


export const useProcessAuthCallbackMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error, reset } = useMutation({
    mutationFn: processAuthCallback,
    onSuccess: async ({ accessToken }) => {
      if (!accessToken) {
        return;
      }

      await queryClient.resetQueries({ queryKey: ["myProfile"] });

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