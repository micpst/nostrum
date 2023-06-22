import UserName from "@/app/components/user/user-name";
import type { User } from "@/app/lib/types/user";

type UserHeaderProps = {
  profile?: User;
  isLoading: boolean;
};

function UserHeader({ profile, isLoading }: UserHeaderProps): JSX.Element {
  return isLoading || !profile ? (
    <h2 className="text-xl font-bold">Profile</h2>
  ) : (
    <UserName
      tag="h2"
      name={profile.name || profile.displayName || profile.display_name || ""}
      className="text-xl"
      iconClassName="w-6 h-6"
      verified={profile.verified}
    />
  );
}

export default UserHeader;
