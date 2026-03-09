import { createContext, useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBulkPresence } from "@/service/userService";
import type { PresenceStatus } from "@/service/userService";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";

const PRESENCE_POLLING_INTERVAL_MS = 30_000;

type PresenceContextValue = {
  register: (userId: number, element: Element) => void;
  unregister: (userId: number, element: Element) => void;
  presenceMap: Record<string, PresenceStatus>;
};

export const PresenceContext = createContext<PresenceContextValue>({
  register: () => {},
  unregister: () => {},
  presenceMap: {},
});

function PresenceProvider({ children }: { children: ReactNode }) {
  const [visibleUserIds, setVisibleUserIds] = useState<Set<number>>(new Set());
  const elementToUserIdRef = useRef<Map<Element, number>>(new Map());

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      setVisibleUserIds((prev) => {
        const next = new Set(prev);

        for (const entry of entries) {
          const userId = elementToUserIdRef.current.get(entry.target);
          if (userId == null) continue;

          if (entry.isIntersecting) {
            next.add(userId);
          } else {
            next.delete(userId);
          }
        }

        return next;
      });
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const register = useCallback((userId: number, element: Element) => {
    elementToUserIdRef.current.set(element, userId);
    observerRef.current?.observe(element);
  }, []);

  const unregister = useCallback((_userId: number, element: Element) => {
    elementToUserIdRef.current.delete(element);
    observerRef.current?.unobserve(element);
  }, []);

  const debouncedUserIds = useDebouncedValue(visibleUserIds, 500);
  const sortedIds = [...debouncedUserIds].sort((a, b) => a - b);
  const queryKey = sortedIds.join(",");

  const { data: presenceMap = {} } = useQuery({
    queryKey: ["bulkPresence", queryKey],
    queryFn: () => getBulkPresence(sortedIds),
    refetchInterval: PRESENCE_POLLING_INTERVAL_MS,
    enabled: sortedIds.length > 0,
  });

  return (
    <PresenceContext.Provider value={{ register, unregister, presenceMap }}>
      {children}
    </PresenceContext.Provider>
  );
}

export default PresenceProvider;
