
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface UserAvatarHeaderProps {
  user: any;
}
const UserAvatarHeader: React.FC<UserAvatarHeaderProps> = React.memo(({ user }) => {
  const isMobile = useIsMobile();
  return (
    <div
      className={cn(
        "flex mb-4 w-full",
        isMobile ? "space-x-2 items-center" : "space-x-3"
      )}
    >
      <Avatar className={cn(isMobile ? "h-8 w-8" : "h-10 w-10")}>
        <AvatarImage src={user?.user_metadata?.avatar_url} />
        <AvatarFallback className="bg-primary text-white">
          {user?.user_metadata?.full_name?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h3 className={cn("truncate font-medium text-foreground", isMobile ? "text-base" : "")}>
          {user?.user_metadata?.full_name || 'Your Name'}
        </h3>
        {!isMobile && <p className="text-sm text-muted-foreground">Professional</p>}
      </div>
    </div>
  );
});
UserAvatarHeader.displayName = "UserAvatarHeader";
export default UserAvatarHeader;
