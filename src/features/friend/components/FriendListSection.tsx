import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CircleUserRound, Swords, UserCheck, UserPlus } from "lucide-react";
import { useLoginModal } from "@/features/auth/LoginModalContext";
import { useMyProfileQuery } from "@/features/user/hooks";
import type { FriendResponse } from "@/service/friendService";
import type { PresenceStatus } from "@/service/userService";
import {
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useSendFriendRequestMutation,
} from "@/features/friend/hooks";

const presenceColorClass = (status: PresenceStatus) => {
  switch (status) {
    case "ONLINE":
      return "bg-green-500";
    case "IN_BATTLE":
      return "bg-orange-500";
    case "OFFLINE":
      return "bg-slate-300";
  }
};

type FriendListSectionProps = {
  friends: FriendResponse[];
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isPending: boolean;
  isError: boolean;
  invalidateKey: string;
};

function FriendActionButtons({
  friend,
  invalidateKey,
}: {
  friend: FriendResponse;
  invalidateKey: string;
}) {
  const { isLoggedIn, requireLogin } = useLoginModal();
  const { data: myProfile } = useMyProfileQuery();
  const { mutate: sendRequest, isPending: isSending } =
    useSendFriendRequestMutation(invalidateKey);
  const { mutate: accept, isPending: isAccepting } =
    useAcceptFriendRequestMutation(invalidateKey);
  const { mutate: reject, isPending: isRejecting } =
    useRejectFriendRequestMutation(invalidateKey);

  const { friendStatus, friendRequestId, userId } = friend;

  if (myProfile?.userId === userId) {
    return null;
  }

  if (friendStatus === "FRIEND") {
    return <UserCheck className="h-4 w-4 shrink-0 text-green-600" />;
  }

  if (friendStatus === "REQUESTED") {
    return <span className="shrink-0 text-xs text-slate-400">요청됨</span>;
  }

  if (friendStatus === "PENDING" && friendRequestId != null) {
    return (
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (!isLoggedIn) return requireLogin();
            accept(friendRequestId);
          }}
          disabled={isAccepting}
          className="rounded bg-green-600 px-2 py-0.5 text-xs text-white hover:bg-green-500 disabled:opacity-50"
        >
          수락
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (!isLoggedIn) return requireLogin();
            reject(friendRequestId);
          }}
          disabled={isRejecting}
          className="rounded bg-red-600 px-2 py-0.5 text-xs text-white hover:bg-red-500 disabled:opacity-50"
        >
          거절
        </button>
      </div>
    );
  }

  if (friendStatus === "NONE") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          if (!isLoggedIn) return requireLogin();
          sendRequest(userId);
        }}
        disabled={isSending}
        className="shrink-0 rounded bg-indigo-600 p-1 text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        <UserPlus className="h-3.5 w-3.5" />
      </button>
    );
  }

  return null;
}

function FriendListSection({
  friends,
  keyword,
  onKeywordChange,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isPending,
  isError,
  invalidateKey,
}: FriendListSectionProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node) return;

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });

      observerRef.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <section className="w-full max-w-xl">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">친구 목록</h2>

      <input
        type="text"
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        placeholder="친구 검색"
        className="mb-3 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />

      {isPending && <p className="text-center text-sm text-slate-500">불러오는 중...</p>}

      {isError && <p className="text-center text-sm text-red-500">목록을 불러오지 못했습니다.</p>}

      {!isPending && !isError && friends.length === 0 && (
        <p className="text-center text-sm text-slate-500">친구가 없습니다.</p>
      )}

      {friends.length > 0 && (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200">
          {friends.map((friend) => (
            <li key={friend.userId}>
              <Link
                to={`/users/${friend.userId}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50"
              >
                <div className="relative">
                  {friend.profileImageUrl ? (
                    <img
                      src={friend.profileImageUrl}
                      alt={friend.nickname}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <CircleUserRound className="h-10 w-10 text-slate-400" />
                  )}
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${presenceColorClass(friend.presenceStatus)}`}
                  />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <span className="text-sm font-medium text-slate-900">{friend.nickname}</span>
                  <div className="flex items-center gap-1.5">
                    {friend.presenceStatus === "IN_BATTLE" && (
                      <Swords className="h-4 w-4 text-orange-500" />
                    )}
                    <FriendActionButtons friend={friend} invalidateKey={invalidateKey} />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {isFetchingNextPage && (
        <p className="mt-2 text-center text-sm text-slate-500">더 불러오는 중...</p>
      )}

      <div ref={bottomRef} />
    </section>
  );
}

export default FriendListSection;
