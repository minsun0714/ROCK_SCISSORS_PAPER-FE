import { useState } from "react";
import type { ChangeEvent } from "react";
import FriendListSection from "@/features/friend/components/FriendListSection";
import { useMyFriendsQuery } from "@/features/friend/hooks";
import ProfileImageSection from "@/features/user/components/ProfileImageSection";
import StatusMessageEditModal from "@/features/user/components/StatusMessageEditModal";
import StatusMessageSection from "@/features/user/components/StatusMessageSection";
import {
  useMyProfileQuery,
  useUploadProfileImageMutation,
} from "@/features/user/hooks";

function MyPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
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

  const { friends, fetchNextPage, hasNextPage, isFetchingNextPage, isPending: isFriendsPending, isError: isFriendsError } =
    useMyFriendsQuery(friendKeyword);

  const displayMessage = resultMessage || uploadProfileImageResultMessage;
  const { userId, profileImageUrl, statusMessage } = myProfile ?? {};

  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900">My 페이지</h1>

      <ProfileImageSection
        userId={userId}
        profileImageUrl={profileImageUrl}
        isPending={isUploadProfileImagePending}
        onFileChange={handleProfileImageChange}
      />

      <StatusMessageSection
        statusMessage={statusMessage ?? ""}
        onEditClick={() => setIsEditModalOpen(true)}
      />

      {displayMessage && (
        <p className="w-full max-w-xl rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
          {displayMessage}
        </p>
      )}

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
      />

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
