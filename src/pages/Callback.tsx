import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useProcessAuthCallbackMutation } from "@/features/auth/hooks";

function Callback() {
  const processedCodeRef = useRef<string | null>(null);
  const { search } = useLocation();
  const code = new URLSearchParams(search).get("code");

  const { mutate } = useProcessAuthCallbackMutation();

  useEffect(() => {
    if (!code || processedCodeRef.current === code) {
      return;
    }

    processedCodeRef.current = code;
    mutate(code);
  }, [code, mutate]);

  return <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4"></main>;
}

export default Callback;
