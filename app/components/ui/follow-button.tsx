import Button from "@/app/components/ui/button";

function FollowButton(): JSX.Element {
  const userIsFollowed = false;

  return (
    <>
      {userIsFollowed ? (
        <Button
          className='dark-bg-tab min-w-[106px] self-start border border-light-line-reply px-4 py-1.5
                     font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red
                     hover:before:content-["Unfollow"] inner:hover:hidden'
        >
          <span>Following</span>
        </Button>
      ) : (
        <Button
          className="self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90
                     focus-visible:bg-light-primary/90 active:bg-light-border/75"
        >
          Follow
        </Button>
      )}
    </>
  );
}

export default FollowButton;
