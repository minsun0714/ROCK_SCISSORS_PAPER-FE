import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendHeartbeat } from "@/service/userService";

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
