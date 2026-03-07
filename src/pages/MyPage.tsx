import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import ProfileImageSection from "@/features/user/components/ProfileImageSection";
import StatusMessageSection from "@/features/user/components/StatusMessageSection";
import {
  useMyProfileQuery,
  useUpdateMyStatusMessageMutation,
  useUploadProfileImageMutation,
} from "@/features/user/hooks";

function MyPage() {
  const [statusMessage, setStatusMessage] = useState("");
  const [resultMessage, setResultMessage] = useState("");

  const { data: myProfile } = useMyProfileQuery();

  const {
    mutate: updateStatus,
    isPending: isUpdateStatusPending,
    resultMessage: updateStatusResultMessage,
    setResultMessage: setUpdateStatusResultMessage,
  } = useUpdateMyStatusMessageMutation();

  const {
    mutate: uploadProfileImage,
    isPending: isUploadProfileImagePending,
    resultMessage: uploadProfileImageResultMessage,
    setResultMessage: setUploadProfileImageResultMessage,
  } = useUploadProfileImageMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = statusMessage.trim();
    if (!trimmed) {
      setResultMessage("상태 메시지를 입력해주세요.");
      return;
    }

    setResultMessage("");
    setUpdateStatusResultMessage("");
    updateStatus({ statusMessage: trimmed });
  };

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

  const displayMessage =
    resultMessage || uploadProfileImageResultMessage || updateStatusResultMessage;
  const { userId, profileImageUrl } = myProfile ?? {};
  const handleStatusMessageChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setStatusMessage(value);
  };

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
        statusMessage={statusMessage}
        isPending={isUpdateStatusPending}
        onStatusMessageChange={handleStatusMessageChange}
        onSubmit={handleSubmit}
      />

      {displayMessage && (
        <p className="w-full max-w-xl rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
          {displayMessage}
        </p>
      )}
    </main>
  );
}

export default MyPage;
