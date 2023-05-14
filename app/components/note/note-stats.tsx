/* eslint-disable react-hooks/exhaustive-deps */

import cn from "clsx";
import { useEffect, useMemo, useState } from "react";
import NoteOption from "@/app/components/note/note-option";
import type { Note } from "@/app/lib/types/note";

type TweetStatsProps = Pick<
  Note,
  "userLikes" | "userReposts" | "userReplies"
> & {
  reply?: boolean;
  userId: string;
  isOwner: boolean;
  noteId: string;
  viewNote?: boolean;
  openModal?: () => void;
};

function NoteStats({
  reply,
  userId,
  isOwner,
  noteId,
  userLikes,
  viewNote,
  userReposts,
  userReplies: totalReplies,
  openModal,
}: TweetStatsProps): JSX.Element {
  const totalLikes = userLikes.length;
  const totalReposts = userReposts.length;

  const [{ currentReplies, currentReposts, currentLikes }, setCurrentStats] =
    useState({
      currentReplies: totalReplies,
      currentLikes: totalLikes,
      currentReposts: totalReposts,
    });

  useEffect(() => {
    setCurrentStats({
      currentReplies: totalReplies,
      currentLikes: totalLikes,
      currentReposts: totalReposts,
    });
  }, [totalReplies, totalLikes, totalReposts]);

  const replyMove = useMemo(
    () => (totalReplies > currentReplies ? -25 : 25),
    [totalReplies]
  );

  const likeMove = useMemo(
    () => (totalLikes > currentLikes ? -25 : 25),
    [totalLikes]
  );

  const tweetMove = useMemo(
    () => (totalReposts > currentReposts ? -25 : 25),
    [totalReposts]
  );

  const noteIsLiked = userLikes.includes(userId);
  const noteIsReposted = userReposts.includes(userId);

  const isStatsVisible = !!(totalReplies || totalReposts || totalLikes);

  return (
    <div
      className={cn(
        "flex text-light-secondary inner:outline-none",
        viewNote ? "justify-around py-2" : "max-w-md justify-between"
      )}
    >
      <NoteOption
        className="hover:text-accent-blue focus-visible:text-accent-blue"
        iconClassName="group-hover:bg-accent-blue/10 group-active:bg-accent-blue/20
                         group-focus-visible:bg-accent-blue/10 group-focus-visible:ring-accent-blue/80"
        tip="Reply"
        move={replyMove}
        stats={currentReplies}
        iconName="ChatBubbleOvalLeftIcon"
        viewTweet={viewNote}
        onClick={openModal}
        disabled={reply}
      />
      <NoteOption
        className={cn(
          "hover:text-accent-green focus-visible:text-accent-green",
          noteIsReposted && "text-accent-green [&>i>svg]:[stroke-width:2px]"
        )}
        iconClassName="group-hover:bg-accent-green/10 group-active:bg-accent-green/20
                         group-focus-visible:bg-accent-green/10 group-focus-visible:ring-accent-green/80"
        tip={noteIsReposted ? "Undo Retweet" : "Retweet"}
        move={tweetMove}
        stats={currentReposts}
        iconName="ArrowPathRoundedSquareIcon"
        viewTweet={viewNote}
      />
      <NoteOption
        className={cn(
          "hover:text-accent-pink focus-visible:text-accent-pink",
          noteIsLiked && "text-accent-pink [&>i>svg]:fill-accent-pink"
        )}
        iconClassName="group-hover:bg-accent-pink/10 group-active:bg-accent-pink/20
                         group-focus-visible:bg-accent-pink/10 group-focus-visible:ring-accent-pink/80"
        tip={noteIsLiked ? "Unlike" : "Like"}
        move={likeMove}
        stats={currentLikes}
        iconName="HeartIcon"
        viewTweet={viewNote}
      />
    </div>
  );
}

export default NoteStats;
