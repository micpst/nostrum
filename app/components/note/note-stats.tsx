import cn from "clsx";
import NoteOption from "@/app/components/note/note-option";
import { useReactions } from "@/app/lib/context/reactions-provider";

type TweetStatsProps = {
  reply?: boolean;
  isOwner: boolean;
  noteId: string;
  viewNote?: boolean;
  openModal?: () => void;
};

function NoteStats({
  reply,
  noteId,
  viewNote,
  openModal,
}: TweetStatsProps): JSX.Element {
  const { reactions, like, unlike } = useReactions();

  const noteIsLiked = reactions.has(noteId);
  const noteIsReposted = false;

  const handleLike = async () => {
    if (noteIsLiked) await unlike(noteId);
    else await like(noteId);
  };

  return (
    <div
      className={cn(
        "flex text-light-secondary inner:outline-none",
        viewNote ? "justify-around py-2" : "max-w-md justify-between"
      )}
    >
      <NoteOption
        className="hover:text-main-accent focus-visible:text-main-accent"
        iconClassName="group-hover:bg-main-accent/10 group-active:bg-main-accent/20 group-hover:fill-main-accent
                       group-focus-visible:bg-main-accent/10 group-focus-visible:ring-main-accent/80 group-focus-visible:fill-main-accent"
        tip="Reply"
        iconName="ChatBubbleOvalLeftIcon"
        onClick={openModal}
        disabled={reply}
      />
      <NoteOption
        className={cn(
          "hover:text-accent-green focus-visible:text-accent-green",
          noteIsReposted && "text-accent-green [&>i>svg]:[stroke-width:2px]"
        )}
        iconClassName="group-hover:bg-accent-green/10 group-active:bg-accent-green/20 group-hover:fill-accent-green
                       group-focus-visible:bg-accent-green/10 group-focus-visible:ring-accent-green/80 group-focus-visible:fill-accent-green"
        tip={noteIsReposted ? "Undo Retweet" : "Retweet"}
        iconName="ArrowPathRoundedSquareIcon"
      />
      <NoteOption
        className={cn(
          "hover:text-accent-pink focus-visible:text-accent-pink",
          noteIsLiked && "text-accent-pink [&>i>svg]:fill-accent-pink"
        )}
        iconClassName="group-hover:bg-accent-pink/10 group-active:bg-accent-pink/20 group-hover:fill-accent-pink
                       group-focus-visible:bg-accent-pink/10 group-focus-visible:ring-accent-pink/80 group-focus-visible:fill-accent-pink"
        tip={noteIsLiked ? "Unlike" : "Like"}
        iconName="HeartIcon"
        onClick={handleLike}
      />
    </div>
  );
}

export default NoteStats;
