import type { PresenceStatus } from "@/service/userService";

export const presenceColorClass = (status: PresenceStatus) => {
  switch (status) {
    case "ONLINE":
      return "bg-violet-500";
    case "IN_BATTLE":
      return "bg-amber-500";
    case "OFFLINE":
      return "bg-slate-300";
  }
};
