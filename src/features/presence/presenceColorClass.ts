import type { PresenceStatus } from "@/service/userService";

export const presenceColorClass = (status: PresenceStatus) => {
  switch (status) {
    case "ONLINE":
      return "bg-green-500";
    case "IN_BATTLE":
      return "bg-orange-500";
    case "OFFLINE":
      return "bg-slate-300";
  }
};
