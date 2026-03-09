import { useNavigate } from "react-router";
import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginModalContext } from "@/features/auth/loginModalContext";
import { consumePostLoginRedirectPath, processAuthCallback } from "@/service/authService";

export const useLoginModal = () => useContext(LoginModalContext);

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
