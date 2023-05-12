import cn from "clsx";
import Link from "next/link";
import { formatDate } from "@/app/lib/date";
import type { Note } from "@/app/lib/types/note";

type TweetDateProps = Pick<Note, "createdAt"> & {
  noteLink: string;
  viewNote?: boolean;
};

function NoteDate({
  createdAt,
  noteLink,
  viewNote,
}: TweetDateProps): JSX.Element {
  return (
    <div className={cn("flex gap-1", viewNote && "py-4")}>
      {!viewNote && <i>·</i>}
      <div className="group relative">
        <Link
          href={noteLink}
          className={cn(
            "custom-underline peer whitespace-nowrap",
            viewNote && "text-light-secondary dark:text-dark-secondary"
          )}
        >
          {formatDate(createdAt, viewNote ? "full" : "note")}
        </Link>
      </div>
    </div>
  );
}

export default NoteDate;
