import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyProfile,
  requestMyProfilePicturePresignedUrl,
  saveMyProfilePictureKey,
  updateMyStatusMessage,
  uploadFileToPresignedUrl,
} from "@/service/userService";

function MyPage() {
  const [statusMessage, setStatusMessage] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const queryClient = useQueryClient();

  const myProfileQuery = useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyProfile,
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateMyStatusMessage,
    onSuccess: () => {
      setResultMessage("상태 메시지가 변경되었습니다.");
    },
    onError: () => {
      setResultMessage("상태 메시지 변경에 실패했습니다.");
    },
  });

  const uploadProfileImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const { presignedUrl, key } = await requestMyProfilePicturePresignedUrl({
        fileName: file.name,
        fileType: file.type,
      });

      await uploadFileToPresignedUrl({ presignedUrl, file });
      await saveMyProfilePictureKey({ key });
    },
    onSuccess: () => {
      setResultMessage("프로필 이미지가 업로드되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
    onError: () => {
      setResultMessage("프로필 이미지 업로드에 실패했습니다.");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = statusMessage.trim();
    if (!trimmed) {
      setResultMessage("상태 메시지를 입력해주세요.");
      return;
    }

    updateStatusMutation.mutate({ statusMessage: trimmed });
  };

  const createSafeUploadFileName = (file: File) => {
    const extension = file.name.includes(".")
      ? file.name.split(".").pop()?.toLowerCase()
      : undefined;
    const fallbackExtension = file.type.split("/")[1]?.toLowerCase();
    const finalExtension = extension || fallbackExtension || "bin";

    return `profile_${Date.now()}.${finalExtension}`;
  };

  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setResultMessage("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    const uploadFile = new File([file], createSafeUploadFileName(file), {
      type: file.type,
      lastModified: file.lastModified,
    });

    uploadProfileImageMutation.mutate(uploadFile);
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <h1>My 페이지</h1>
      {myProfileQuery.data?.profileImageUrl ? (
        <img
          src={myProfileQuery.data.profileImageUrl}
          alt="프로필 이미지"
          style={{
            width: 120,
            height: 120,
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      ) : (
        <p>프로필 이미지가 없습니다.</p>
      )}
      <div>
        <input
          id="profile-image-input"
          type="file"
          accept="image/*"
          onChange={handleProfileImageChange}
          style={{ display: "none" }}
          disabled={uploadProfileImageMutation.isPending}
        />
        <button
          type="button"
          onClick={() => document.getElementById("profile-image-input")?.click()}
          disabled={uploadProfileImageMutation.isPending}
        >
          {uploadProfileImageMutation.isPending ? "업로드 중..." : "프로필 이미지 업로드"}
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={statusMessage}
          onChange={(event) => setStatusMessage(event.target.value)}
          placeholder="상태 메시지를 입력하세요"
        />
        <button type="submit" disabled={updateStatusMutation.isPending}>
          {updateStatusMutation.isPending ? "저장 중..." : "상태 메시지 저장"}
        </button>
      </form>
      {resultMessage && <p>{resultMessage}</p>}
    </main>
  );
}

export default MyPage;
