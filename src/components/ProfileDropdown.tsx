import { LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/service/authService";

function ProfileDropdown({ profileImageUrl }: { profileImageUrl?: string | null }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button
          type="button"
          className="cursor-pointer rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Avatar className="h-9 w-9">
            {profileImageUrl && <AvatarImage src={profileImageUrl} alt="프로필" />}
            <AvatarFallback className="text-xs">MY</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem>
          <Link to="/my" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            마이페이지
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
          <LogOut className="h-4 w-4" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileDropdown;
