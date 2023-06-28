import UserName from "@/app/components/user/user-name";
import { useUser } from "@/app/lib/context/user-provider";

function UserHeader(): JSX.Element {
  const { user, isLoading } = useUser();
  const username = user?.displayName || user?.display_name || user?.name;

  return isLoading || !username ? (
    <h2 className="text-xl font-bold">Profile</h2>
  ) : (
    <UserName
      tag="h2"
      name={username}
      className="text-xl"
      iconClassName="w-6 h-6"
      verified={user.verified}
    />
  );
}

export default UserHeader;
