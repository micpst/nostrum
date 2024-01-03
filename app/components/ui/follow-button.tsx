import Button from "@/app/components/ui/button";
import { useFollowing } from "@/app/lib/context/following-provider";

type FollowButtonProps = {
  userTargetPubkey: string;
};

function FollowButton({ userTargetPubkey }: FollowButtonProps): JSX.Element {
  const { following, follow, unfollow } = useFollowing();
  const userIsFollowed = following.has(userTargetPubkey);

  return (
    <>
      {userIsFollowed ? (
        <Button
          className='dark-bg-tab min-w-[106px] border border-light-line-reply px-4 py-1.5
                     font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red
                     hover:before:content-["Unfollow"] inner:hover:hidden'
          onClick={() => unfollow(userTargetPubkey)}
        >
          <span>Following</span>
        </Button>
      ) : (
        <Button
          className="border border-black bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90
                     focus-visible:bg-light-primary/90 active:bg-light-border/75"
          onClick={() => follow(userTargetPubkey)}
        >
          Follow
        </Button>
      )}
    </>
  );
}

export default FollowButton;
