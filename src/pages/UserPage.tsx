import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import FriendListSection from "@/features/friend/components/FriendListSection";
import FriendStatusSection from "@/features/friend/components/FriendStatusSection";
import { useOtherUserFriendsQuery } from "@/features/friend/hooks";
import ProfileImageSection from "@/features/user/components/ProfileImageSection";
import { useMyProfileQuery, useUserProfileQuery } from "@/features/user/hooks";


function UserPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data: myProfile } = useMyProfileQuery();
  const { data: userProfile, isPending, isError } = useUserProfileQuery(userId!);
  const [friendKeyword, setFriendKeyword] = useState("");

  const { userId: profileUserId, nickname, profileImageUrl, statusMessage, friendInfo } =
    userProfile ?? {};

  const {
    friends,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isFriendsPending,
    isError: isFriendsError,
  } = useOtherUserFriendsQuery(profileUserId ?? 0, friendKeyword);

  if (myProfile?.userId != null && String(myProfile.userId) === userId) {
    return <Navigate to="/my" replace />;
  }

  if (isPending) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-2xl flex-col items-center justify-center px-4 py-10">
        <p className="text-sm text-muted-foreground">프로필을 불러오는 중...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-2xl flex-col items-center justify-center px-4 py-10">
        <p className="text-sm text-destructive">프로필을 불러오지 못했습니다.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-2xl flex-col items-center gap-5 px-4 py-10">
      <h1 className="font-display text-3xl tracking-tight text-primary">{nickname ?? "프로필"}</h1>

      <ProfileImageSection
        userId={profileUserId}
        profileImageUrl={profileImageUrl}
        statusMessage={statusMessage ?? ""}
      />

      {friendInfo && profileUserId != null && (
        <FriendStatusSection
          userId={userId!}
          targetUserId={profileUserId}
          friendStatus={friendInfo.status}
          friendRequestId={friendInfo.friendRequestId}
        />
      )}

      {profileUserId != null && (
        <FriendListSection
          friends={friends}
          keyword={friendKeyword}
          onKeywordChange={setFriendKeyword}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
          isPending={isFriendsPending}
          isError={isFriendsError}
          invalidateKey={userId!}
          title="친구 목록"
          emptyMessage="친구가 없습니다."
        />
      )}
    </main>
  );
}

export default UserPage;
