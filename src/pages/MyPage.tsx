import { useState } from "react";
import type { ChangeEvent } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FriendListSection from "@/features/friend/components/FriendListSection";
import { useMyFriendsQuery, useReceivedRequestsQuery, useSentRequestsQuery } from "@/features/friend/hooks";
import ProfileImageSection from "@/features/user/components/ProfileImageSection";
import StatusMessageEditModal from "@/features/user/components/StatusMessageEditModal";
import {
  useMyProfileQuery,
  useUploadProfileImageMutation,
} from "@/features/user/hooks";

function MyPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [friendTab, setFriendTab] = useState("friends");
  const [friendKeyword, setFriendKeyword] = useState("");

  const { data: myProfile } = useMyProfileQuery();

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

  const activeQuery =
    friendTab === "friends" ? friendsQuery :
    friendTab === "received" ? receivedQuery :
    sentQuery;

  const displayMessage = resultMessage || uploadProfileImageResultMessage;
  const { userId, profileImageUrl, statusMessage } = myProfile ?? {};

  return (
    <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-2xl flex-col items-center gap-5 px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">My 페이지</h1>

      <ProfileImageSection
        userId={userId}
        profileImageUrl={profileImageUrl}
        isPending={isUploadProfileImagePending}
        onFileChange={handleProfileImageChange}
        statusMessage={statusMessage ?? ""}
        onStatusEditClick={() => setIsEditModalOpen(true)}
      />

      {displayMessage && (
        <p className="w-full max-w-xl rounded-lg border bg-card px-4 py-2.5 text-sm">
          {displayMessage}
        </p>
      )}

      <section className="w-full max-w-xl">
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
              friends={activeQuery.friends}
              keyword={friendKeyword}
              onKeywordChange={setFriendKeyword}
              fetchNextPage={activeQuery.fetchNextPage}
              hasNextPage={activeQuery.hasNextPage ?? false}
              isFetchingNextPage={activeQuery.isFetchingNextPage}
              isPending={activeQuery.isPending}
              isError={activeQuery.isError}
              invalidateKey="me"
              emptyMessage={
                friendTab === "friends" ? "친구가 없습니다." :
                friendTab === "received" ? "받은 요청이 없습니다." :
                "보낸 요청이 없습니다."
              }
            />
          </TabsContent>
        </Tabs>
      </section>

      {isEditModalOpen && (
        <StatusMessageEditModal
          currentMessage={statusMessage ?? ""}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </main>
  );
}

export default MyPage;
