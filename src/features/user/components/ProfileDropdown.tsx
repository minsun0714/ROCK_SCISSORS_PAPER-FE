import { LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { logout } from "@/service/authService";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

function ProfileDropdown({ profileImageUrl }: { profileImageUrl?: string | null }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none cursor-pointer ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <Avatar className="h-9 w-9">
          {profileImageUrl && <AvatarImage src={profileImageUrl} alt="프로필" />}
          <AvatarFallback className="text-xs">MY</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem>
          <Link to="/my" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            마이페이지
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
          <LogOut className="w-4 h-4" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileDropdown;
