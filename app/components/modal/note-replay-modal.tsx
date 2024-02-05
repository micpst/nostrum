import Input from "@/app/components/input/input";
import Note from "@/app/components/note/note";
import type { NoteEvent } from "@/app/lib/types/event";

type NoteReplyModalProps = {
  note: NoteEvent;
  closeModal: () => void;
};

export default function NoteReplyModal({
  note,
  closeModal,
}: NoteReplyModalProps): JSX.Element {
  return (
    <Input modal replyModal parent={note} closeModal={closeModal}>
      <Note modal parentNote event={note} />
    </Input>
  );
}
