import type { ChangeEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePresence } from "@/features/presence/usePresence";

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
  userId?: number | null;
  profileImageUrl?: string | null;
  isPending?: boolean;
  onFileChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

function ProfileImageSection({
  userId,
  profileImageUrl,
  isPending = false,
  onFileChange,
}: ProfileImageSectionProps) {
  const editable = !!onFileChange;
  const { ref, presenceStatus } = usePresence(userId);

  return (
    <Card className="w-full max-w-xl" ref={ref}>
      <CardHeader>
        <CardTitle>프로필 이미지</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar className="h-48 w-48">
            {profileImageUrl && <AvatarImage src={profileImageUrl} alt="프로필 이미지" />}
            <AvatarFallback className="text-sm text-muted-foreground">이미지 없음</AvatarFallback>
          </Avatar>
          {presenceStatus && (
            <span
              className={`absolute bottom-2 right-2 h-5 w-5 rounded-full border-[3px] border-background ${getPresenceColor(presenceStatus)}`}
            />
          )}
        </div>

        {editable && (
          <div>
            <label htmlFor="profile-image-input">
              <Button variant="secondary" asChild disabled={isPending}>
                <span>{isPending ? "업로드 중..." : "프로필 이미지 업로드"}</span>
              </Button>
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
      </CardContent>
    </Card>
  );
}

export default ProfileImageSection;
