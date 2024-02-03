import cn from "clsx";
import Link from "next/link";
import { formatDate } from "@/app/lib/utils/date";

type NoteDateProps = {
  createdAt: number;
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
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "custom-underline peer whitespace-nowrap",
            viewNote && "text-light-secondary",
          )}
        >
          {formatDate(createdAt, viewNote ? "full" : "note")}
        </Link>
      </div>
    </div>
  );
}

export default NoteDate;
