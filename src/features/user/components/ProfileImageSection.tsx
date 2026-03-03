import type { ChangeEvent } from "react";

type ProfileImageSectionProps = {
  profileImageUrl?: string | null;
  isPending: boolean;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function ProfileImageSection({
  profileImageUrl,
  isPending,
  onFileChange,
}: ProfileImageSectionProps) {
  return (
    <section className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-slate-800">프로필 이미지</h2>
      <div className="mb-4 flex justify-center">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="프로필 이미지"
            className="h-28 w-28 rounded-full object-cover ring-2 ring-slate-200"
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-500">
            이미지 없음
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <label
          htmlFor="profile-image-input"
          className="cursor-pointer rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          {isPending ? "업로드 중..." : "프로필 이미지 업로드"}
        </label>
        <input
          id="profile-image-input"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
          disabled={isPending}
        />
      </div>
    </section>
  );
}

export default ProfileImageSection;
