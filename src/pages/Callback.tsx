import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  consumePostLoginRedirectPath,
  processAuthCallback,
} from "../service/authService";

function Callback() {
  const navigate = useNavigate();
  const processedCodeRef = useRef<string | null>(null);
  const location = useLocation();
  const code = new URLSearchParams(location.search).get("code");

  const { mutate } = useMutation({
    mutationFn: processAuthCallback,
    onSuccess: ({ accessToken }) => {
      if (!accessToken) {
        return;
      }

      const redirectPath = consumePostLoginRedirectPath();
      navigate(redirectPath, { replace: true });
    },
  });

  useEffect(() => {
    if (!code || processedCodeRef.current === code) {
      return;
    }

    processedCodeRef.current = code;
    mutate(code);
  }, [code, mutate]);

  return (
    <main className="home">
      <h1>{code}</h1>
    </main>
  );
}

export default Callback;
