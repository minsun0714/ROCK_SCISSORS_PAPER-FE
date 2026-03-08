import type { ChangeEvent } from "react";
import { Camera, Loader2, Pencil, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePresence } from "@/features/presence/usePresence";
import { presenceColorClass } from "@/features/presence/presenceColorClass";

type ProfileImageSectionProps = {
  userId?: number | null;
  profileImageUrl?: string | null;
  isPending?: boolean;
  onFileChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  statusMessage?: string;
  onStatusEditClick?: () => void;
};

function ProfileImageSection({
  userId,
  profileImageUrl,
  isPending = false,
  onFileChange,
  statusMessage,
  onStatusEditClick,
}: ProfileImageSectionProps) {
  const editable = !!onFileChange;
  const { ref, presenceStatus } = usePresence(userId);

  return (
    <Card className="w-full" ref={ref}>
      <CardContent className="flex flex-col items-center gap-4 pt-6">
        <div className="relative">
          <Avatar className="h-48 w-48">
            {profileImageUrl && <AvatarImage src={profileImageUrl} alt="프로필 이미지" />}
            <AvatarFallback>
              <UserRound className="h-20 w-20 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          {presenceStatus && (
            <span
              className={`absolute bottom-2 right-2 h-5 w-5 rounded-full border-[3px] border-background ${presenceColorClass(presenceStatus)}`}
            />
          )}
          {editable && (
            <>
              <label
                htmlFor="profile-image-input"
                className="absolute bottom-1 left-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-background bg-secondary text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </label>
              <input
                id="profile-image-input"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
                disabled={isPending}
              />
            </>
          )}
        </div>

        <div className="flex w-full items-center gap-2">
          <p className="flex-1 text-center text-sm text-muted-foreground">
            {statusMessage || "상태 메시지가 없습니다."}
          </p>
          {onStatusEditClick && (
            <Button variant="ghost" size="icon" onClick={onStatusEditClick} className="h-8 w-8 shrink-0">
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileImageSection;
