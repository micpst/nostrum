import cn from "clsx";
import type { JSX } from "react";
import NoteOption from "@/app/components/note/note-option";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useReactions } from "@/app/lib/context/reactions-provider";
import { useReposts } from "@/app/lib/context/reposts-provider";
import type { RelayEvent } from "@/app/lib/types/event";

interface INotesStatsProps {
  isOwner: boolean;
  note: RelayEvent;
  viewNote?: boolean;
  openModal?: () => void;
}

function NoteStats({
  note,
  viewNote,
  openModal,
}: INotesStatsProps): JSX.Element {
  const { publicKey } = useAuth();
  const {
    reactions,
    isLoading: isLoadingReactions,
    like,
    unlike,
  } = useReactions();
  const {
    reposts,
    isLoading: isLoadingReposts,
    repost,
    unrepost,
  } = useReposts();

  const reactionLoading = isLoadingReactions.has(note.id);
  const noteIsLiked = !!reactions.get(note.id)?.length;

  const repostLoading = isLoadingReposts.has(note.id);
  const noteIsReposted = !!reposts.get(note.id)?.length;

  const handleReply = (e: any): void => {
    e.stopPropagation();
    if (openModal) openModal();
  };

  const handleLike = async (e: any) => {
    e.stopPropagation();
    if (noteIsLiked) await unlike(note);
    else await like(note);
  };

  const handleRepost = async (e: any) => {
    e.stopPropagation();
    if (noteIsReposted) await unrepost(note);
    else await repost(note);
  };

  return (
    <div
      className={cn(
        "flex text-light-secondary inner:outline-none",
        viewNote ? "justify-around py-2" : "max-w-md justify-between",
      )}
    >
      <NoteOption
        className="hover:text-main-accent focus-visible:text-main-accent"
        iconClassName="group-hover:bg-main-accent/10 group-active:bg-main-accent/20 group-hover:fill-main-accent
                       group-focus-visible:bg-main-accent/10 group-focus-visible:ring-main-accent/80 group-focus-visible:fill-main-accent"
        tip="Reply"
        iconName="ChatBubbleOvalLeftIcon"
        onClick={handleReply}
        disabled={!publicKey}
      />
      <NoteOption
        className={cn(
          "hover:text-accent-green focus-visible:text-accent-green",
          noteIsReposted && "text-accent-green [&>svg]:fill-accent-green",
        )}
        iconClassName="group-hover:bg-accent-green/10 group-active:bg-accent-green/20 group-hover:fill-accent-green
                       group-focus-visible:bg-accent-green/10 group-focus-visible:ring-accent-green/80 group-focus-visible:fill-accent-green"
        tip={noteIsReposted ? "Undo Repost" : "Repost"}
        iconName="ArrowPathRoundedSquareIcon"
        solid={noteIsReposted}
        onClick={handleRepost}
        disabled={!publicKey || repostLoading}
      />
      <NoteOption
        className={cn(
          "hover:text-accent-pink focus-visible:text-accent-pink",
          noteIsLiked && "text-accent-pink [&>svg]:fill-accent-pink",
        )}
        iconClassName="group-hover:bg-accent-pink/10 group-active:bg-accent-pink/20 group-hover:fill-accent-pink
                       group-focus-visible:bg-accent-pink/10 group-focus-visible:ring-accent-pink/80 group-focus-visible:fill-accent-pink"
        tip={noteIsLiked ? "Unlike" : "Like"}
        iconName="HeartIcon"
        solid={noteIsLiked}
        onClick={handleLike}
        disabled={!publicKey || reactionLoading}
      />
    </div>
  );
}

export default NoteStats;
