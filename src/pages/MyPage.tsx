import { useState } from "react";
import type { ChangeEvent } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import BattleHistorySection from "@/features/battle/components/BattleHistorySection";
import BattleStatCard from "@/features/battle/components/BattleStatCard";
import { useMyBattleHistoryQuery } from "@/features/battle/hooks/useBattleHistoryQuery";
import { useMyBattleStatQuery } from "@/features/battle/hooks/useBattleStatQuery";
import FriendListSection from "@/features/friend/components/FriendListSection";
import { useMyFriendsQuery, useReceivedRequestsQuery, useSentRequestsQuery } from "@/features/friend/hooks";
import ProfileImageSection from "@/features/user/components/ProfileImageSection";
import NicknameEditModal from "@/features/user/components/NicknameEditModal";
import StatusMessageEditModal from "@/features/user/components/StatusMessageEditModal";
import {
  useMyProfileQuery,
  useUploadProfileImageMutation,
} from "@/features/user/hooks";
import type { BattleResult } from "@/service/battleHistoryService";

function MyPage() {
  const [isStatusEditModalOpen, setIsStatusEditModalOpen] = useState(false);
  const [isNicknameEditModalOpen, setIsNicknameEditModalOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [friendTab, setFriendTab] = useState("friends");
  const [friendKeyword, setFriendKeyword] = useState("");
  const [historyKeyword, setHistoryKeyword] = useState("");
  const [historyFilter, setHistoryFilter] = useState<BattleResult | undefined>(undefined);

  const { data: myProfile, isPending: isProfilePending } = useMyProfileQuery({ throwOnError: false });

  const isLoggedIn = !!myProfile;

  const {
    mutate: uploadProfileImage,
    isPending: isUploadProfileImagePending,
    resultMessage: uploadProfileImageResultMessage,
    setResultMessage: setUploadProfileImageResultMessage,
  } = useUploadProfileImageMutation();

  const createSafeUploadFileName = (file: File) => {
    const { name, type } = file;
    const extension = name.includes(".") ? name.split(".").pop()?.toLowerCase() : undefined;
    const fallbackExtension = type.split("/")[1]?.toLowerCase();
    const finalExtension = extension || fallbackExtension || "bin";

    return `profile_${Date.now()}.${finalExtension}`;
  };

  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const { files } = target;
    const file = files?.[0];
    target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setResultMessage("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    const { type, lastModified } = file;

    const uploadFile = new File([file], createSafeUploadFileName(file), {
      type,
      lastModified,
    });

    setResultMessage("");
    setUploadProfileImageResultMessage("");
    uploadProfileImage(uploadFile);
  };

  const friendsQuery = useMyFriendsQuery(friendKeyword, 10, friendTab === "friends");
  const receivedQuery = useReceivedRequestsQuery(friendKeyword, 10, friendTab === "received");
  const sentQuery = useSentRequestsQuery(friendKeyword, 10, friendTab === "sent");

  const {
    friends,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isFriendsPending,
    isError: isFriendsError,
  } = friendTab === "friends" ? friendsQuery :
      friendTab === "received" ? receivedQuery :
      sentQuery;

  const { data: statData, isPending: isStatPending } = useMyBattleStatQuery();
  const {
    data: historyData,
    isPending: isHistoryPending,
    isError: isHistoryError,
    fetchNextPage: fetchNextHistoryPage,
    hasNextPage: hasNextHistoryPage,
    isFetchingNextPage: isFetchingNextHistoryPage,
  } = useMyBattleHistoryQuery(historyKeyword, historyFilter);

  if (!isProfilePending && !isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const displayMessage = resultMessage || uploadProfileImageResultMessage;
  const { userId, nickname, profileImageUrl, statusMessage } = myProfile ?? {};

  return (
    <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-3xl flex-col items-center gap-5 px-4 py-10">
      <h1 className="font-display text-3xl tracking-tight text-primary">마이페이지</h1>

      <ProfileImageSection
        userId={userId}
        nickname={nickname}
        profileImageUrl={profileImageUrl}
        isPending={isUploadProfileImagePending}
        onFileChange={handleProfileImageChange}
        statusMessage={statusMessage ?? ""}
        onStatusEditClick={() => setIsStatusEditModalOpen(true)}
        onNicknameEditClick={() => setIsNicknameEditModalOpen(true)}
      >
        <BattleStatCard data={statData} isPending={isStatPending} />
      </ProfileImageSection>

      {displayMessage && (
        <p className="w-full rounded-lg border bg-card px-4 py-2.5 text-sm">
          {displayMessage}
        </p>
      )}

      <Card className="w-full">
        <CardContent className="py-5">
          <h2 className="mb-3 text-lg font-semibold">친구</h2>
          <Tabs
            value={friendTab}
            onValueChange={(value) => { setFriendTab(value); setFriendKeyword(""); }}
          >
            <TabsList className="mb-3 w-full">
              <TabsTrigger value="friends" className="flex-1">친구 목록</TabsTrigger>
              <TabsTrigger value="received" className="flex-1">나에게 온 요청</TabsTrigger>
              <TabsTrigger value="sent" className="flex-1">신청 내역</TabsTrigger>
            </TabsList>

            <TabsContent value={friendTab}>
              <FriendListSection
                friends={friends}
                keyword={friendKeyword}
                onKeywordChange={setFriendKeyword}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage ?? false}
                isFetchingNextPage={isFetchingNextPage}
                isPending={isFriendsPending}
                isError={isFriendsError}
                invalidateKey="me"
                emptyMessage={
                  friendTab === "friends" ? "친구가 없습니다." :
                  friendTab === "received" ? "받은 요청이 없습니다." :
                  "보낸 요청이 없습니다."
                }
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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

      {isStatusEditModalOpen && (
        <StatusMessageEditModal
          currentMessage={statusMessage ?? ""}
          onClose={() => setIsStatusEditModalOpen(false)}
        />
      )}

      {isNicknameEditModalOpen && (
        <NicknameEditModal
          currentNickname={nickname ?? ""}
          onClose={() => setIsNicknameEditModalOpen(false)}
        />
      )}
    </main>
  );
}

export default MyPage;
