import { useParams } from "react-router-dom";
import ProfileImageSection from "@/features/user/components/ProfileImageSection";
import StatusMessageSection from "@/features/user/components/StatusMessageSection";
import { useUserProfileQuery } from "@/features/user/hooks";

function UserPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data: userProfile, isPending, isError } = useUserProfileQuery(userId!);

  if (isPending) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-3xl flex-col items-center justify-center px-4 py-8">
        <p className="text-sm text-slate-500">프로필을 불러오는 중...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-3xl flex-col items-center justify-center px-4 py-8">
        <p className="text-sm text-red-500">프로필을 불러오지 못했습니다.</p>
      </main>
    );
  }

  const { nickname, profileImageUrl, statusMessage, presenceStatus } = userProfile ?? {};

  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900">{nickname ?? "프로필"}</h1>

      <ProfileImageSection profileImageUrl={profileImageUrl} presenceStatus={presenceStatus} />

      <StatusMessageSection statusMessage={statusMessage ?? ""} />
    </main>
  );
}

export default UserPage;
