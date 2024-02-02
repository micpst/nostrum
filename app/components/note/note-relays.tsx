import cn from "clsx";
import Link from "next/link";
import { RelayEvent } from "@/app/lib/types/event";

type NoteDateProps = Pick<RelayEvent, "relays"> & {
  noteLink: string;
  viewNote?: boolean;
};

function NoteRelays({
  relays,
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
          seen on {relays.length} relay{relays.length > 1 ? "s" : ""}
        </Link>
      </div>
    </div>
  );
}

export default NoteRelays;
