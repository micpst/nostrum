import Input from "@/app/components/input/input";
import Note from "@/app/components/note/note";
import type { RelayEvent } from "@/app/lib/types/event";

type NoteReplyModalProps = {
  note: RelayEvent;
  closeModal: () => void;
};

export default function NoteReplyModal({
  note,
  closeModal,
}: NoteReplyModalProps): JSX.Element {
  return (
    <Input modal replyModal parentId={note.id} closeModal={closeModal}>
      <Note modal parentNote event={note} />
    </Input>
  );
}
