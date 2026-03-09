import { useContext, useEffect, useRef } from "react";
import { PresenceContext } from "@/features/presence/PresenceProvider";
import type { PresenceStatus } from "@/service/userService";

export const usePresence = <T extends Element = HTMLElement>(userId: number | null | undefined) => {
  const ref = useRef<T>(null);
  const { register, unregister, presenceMap } = useContext(PresenceContext);

  useEffect(() => {
    const element = ref.current;
    if (element == null || userId == null) return;

    register(userId, element);

    return () => unregister(userId, element);
  }, [userId, register, unregister]);

  const presenceStatus: PresenceStatus | null =
    userId != null ? (presenceMap[String(userId)] ?? null) : null;

  return { ref, presenceStatus };
};
