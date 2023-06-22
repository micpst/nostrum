import Button from "@/app/components/ui/button";

function UserEditProfile(): JSX.Element {
  return (
    <Button
      className="dark-bg-tab self-start border border-light-line-reply px-4 py-1.5 font-bold
                 hover:bg-light-primary/10 active:bg-light-primary/20"
    >
      Edit profile
    </Button>
  );
}
export default UserEditProfile;
