import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import BattleHistorySection from "@/features/battle/components/BattleHistorySection";
import BattleStatCard from "@/features/battle/components/BattleStatCard";
import { useUserBattleHistoryQuery } from "@/features/battle/hooks/useBattleHistoryQuery";
import { useUserBattleStatQuery } from "@/features/battle/hooks/useBattleStatQuery";
import FriendListSection from "@/features/friend/components/FriendListSection";
import { Card, CardContent } from "@/shared/components/ui/card";
import FriendStatusSection from "@/features/friend/components/FriendStatusSection";
import { useOtherUserFriendsQuery } from "@/features/friend/hooks";
import ProfileImageSection from "@/features/user/components/ProfileImageSection";
import { useMyProfileQuery, useUserProfileQuery } from "@/features/user/hooks";
import type { BattleResult } from "@/service/battleHistoryService";

function UserPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data: myProfile } = useMyProfileQuery({ throwOnError: false });
  const { data: userProfile, isPending, isError } = useUserProfileQuery(userId!);
  const [friendKeyword, setFriendKeyword] = useState("");
  const [historyKeyword, setHistoryKeyword] = useState("");
  const [historyFilter, setHistoryFilter] = useState<BattleResult | undefined>(undefined);

  const {
    userId: profileUserId,
    nickname,
    profileImageUrl,
    statusMessage,
    friendInfo,
  } = userProfile ?? {};

  const {
    friends,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isFriendsPending,
    isError: isFriendsError,
  } = useOtherUserFriendsQuery(profileUserId ?? 0, friendKeyword);

  const { data: statData, isPending: isStatPending } = useUserBattleStatQuery(profileUserId ?? 0);
  const {
    data: historyData,
    isPending: isHistoryPending,
    isError: isHistoryError,
    fetchNextPage: fetchNextHistoryPage,
    hasNextPage: hasNextHistoryPage,
    isFetchingNextPage: isFetchingNextHistoryPage,
  } = useUserBattleHistoryQuery(profileUserId ?? 0, historyKeyword, historyFilter);

  if (myProfile?.userId != null && String(myProfile.userId) === userId) {
    return <Navigate to="/my" replace />;
  }

  if (isPending) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-3xl flex-col items-center justify-center px-4 py-10">
        <p className="text-sm text-muted-foreground">프로필을 불러오는 중...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-3xl flex-col items-center justify-center px-4 py-10">
        <p className="text-sm text-destructive">프로필을 불러오지 못했습니다.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-3xl flex-col items-center gap-5 px-4 py-10">
      <ProfileImageSection
        userId={profileUserId}
        nickname={nickname}
        profileImageUrl={profileImageUrl}
        statusMessage={statusMessage ?? ""}
      >
        <BattleStatCard data={statData} isPending={isStatPending} />
      </ProfileImageSection>

      {friendInfo && profileUserId != null && (
        <FriendStatusSection
          userId={userId!}
          targetUserId={profileUserId}
          friendStatus={friendInfo.status}
          friendRequestId={friendInfo.friendRequestId}
          nickname={nickname ?? undefined}
          profileImageUrl={profileImageUrl}
        />
      )}

      {profileUserId != null && (
        <Card className="w-full">
          <CardContent className="py-5">
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
          </CardContent>
        </Card>
      )}

      {profileUserId != null && (
        <Card className="w-full">
          <CardContent className="py-5">
            <BattleHistorySection
              data={historyData}
              isPending={isHistoryPending}
              isError={isHistoryError}
              fetchNextPage={fetchNextHistoryPage}
              hasNextPage={hasNextHistoryPage ?? false}
              isFetchingNextPage={isFetchingNextHistoryPage}
              keyword={historyKeyword}
              onKeywordChange={setHistoryKeyword}
              resultFilter={historyFilter}
              onResultFilterChange={setHistoryFilter}
            />
          </CardContent>
        </Card>
      )}
    </main>
  );
}

export default UserPage;
