import cn from "clsx";
import Link from "next/link";
import { formatDate } from "@/app/lib/utils/date";
import type { Note } from "@/app/lib/types/note";

type NoteDateProps = Pick<Note, "createdAt"> & {
  noteLink: string;
  viewNote?: boolean;
};

function NoteDate({
  createdAt,
  noteLink,
  viewNote,
}: NoteDateProps): JSX.Element {
  return (
    <div className={cn("flex gap-1", viewNote && "py-4")}>
      {!viewNote && <span>·</span>}
      <div className="group relative">
        <Link
          href={noteLink}
          className={cn(
            "custom-underline peer whitespace-nowrap",
            viewNote && "text-light-secondary"
          )}
        >
          {formatDate(createdAt, viewNote ? "full" : "note")}
        </Link>
      </div>
    </div>
  );
}

export default NoteDate;
