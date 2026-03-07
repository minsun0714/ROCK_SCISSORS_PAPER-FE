import type { ChangeEvent } from "react";
import type { PresenceStatus } from "@/service/userService";

const getPresenceColor = (status: string) => {
  switch (status) {
    case "ONLINE":
      return "bg-green-500";
    case "IN_BATTLE":
      return "bg-amber-700";
    default:
      return "bg-gray-400";
  }
};

type ProfileImageSectionProps = {
  profileImageUrl?: string | null;
  presenceStatus?: PresenceStatus | null;
  isPending?: boolean;
  onFileChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

function ProfileImageSection({
  profileImageUrl,
  presenceStatus,
  isPending = false,
  onFileChange,
}: ProfileImageSectionProps) {
  const editable = !!onFileChange;

  return (
    <section className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-slate-800">프로필 이미지</h2>
      <div className={`${editable ? "mb-4" : ""} flex justify-center`}>
        <div className="relative" style={{ width: 256, height: 256 }}>
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="프로필 이미지"
              className="h-full w-full rounded-full object-cover ring-2 ring-slate-200"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-xs text-slate-500">
              이미지 없음
            </div>
          )}
          {presenceStatus && (
            <span
              className={`absolute bottom-[12px] right-[12px] h-[24px] w-[24px] rounded-full border-[3px] border-white ${getPresenceColor(presenceStatus)}`}
            />
          )}
        </div>
      </div>

      {editable && (
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
      )}
    </section>
  );
}

export default ProfileImageSection;
