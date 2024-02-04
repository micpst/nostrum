import cn from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";
import { nip19 } from "nostr-tools";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import type { Variants } from "framer-motion";
import type { ChangeEvent, FormEvent, JSX, ReactNode } from "react";
import InputForm from "@/app/components/input/input-form";
import InputOptions from "@/app/components/input/input-options";
import UserAvatar from "@/app/components/user/user-avatar";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useProfile } from "@/app/lib/context/profile-provider";
import { useRelay } from "@/app/lib/context/relay-provider";
import noteService from "@/app/lib/services/noteService";
import type { User } from "@/app/lib/types/user";

type InputProps = {
  modal?: boolean;
  reply?: boolean;
  parentId?: string;
  disabled?: boolean;
  children?: ReactNode;
  replyModal?: boolean;
  closeModal: () => void;
};

export const variants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

function Input({
  modal,
  reply,
  parentId,
  disabled,
  children,
  replyModal,
  closeModal,
}: InputProps): JSX.Element {
  const { publicKey } = useAuth();
  const { profiles } = useProfile();
  const { relays } = useRelay();

  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { picture } = profiles.get(publicKey || "") as User;

  const isReplying = reply ?? replyModal;

  const publishNote = async (): Promise<void> => {
    if (!inputValue || !publicKey) return;

    setIsLoading(true);

    inputRef.current?.blur();

    const content = inputValue.trim();
    const note =
      isReplying && parentId
        ? await noteService.createNoteReplyAsync({
            relays: Array.from(relays.values()),
            pubkey: publicKey,
            content,
            parentId,
          })
        : await noteService.createNoteAsync({
            relays: Array.from(relays.values()),
            pubkey: publicKey,
            content,
          });

    if (note.relays.length > 0) {
      if (!modal && !replyModal) {
        discardNote();
        setIsLoading(false);
      }
      if (closeModal) {
        closeModal();
      }

      toast.success(() => (
        <span className="flex gap-2">
          Your note was sent
          <Link
            className="custom-underline font-bold"
            href={`/n/${nip19.noteEncode(note.id)}`}
          >
            View
          </Link>
        </span>
      ));
    } else {
      setIsLoading(false);
      toast.error("Your note was not sent to any relay.");
    }
  };

  const discardNote = (): void => {
    setInputValue("");

    inputRef.current?.blur();
  };

  const handleChange = ({
    target: { value },
  }: ChangeEvent<HTMLTextAreaElement>): void => setInputValue(value);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    void publishNote();
  };

  if (!publicKey) return <></>;

  return (
    <form
      className={cn("flex flex-col", {
        "-mx-4": reply,
        "gap-2": replyModal,
        "cursor-not-allowed": disabled,
      })}
      onSubmit={handleSubmit}
    >
      {isLoading && (
        <motion.i className="h-1 animate-pulse bg-main-accent" {...variants} />
      )}
      {children}
      <label
        className={cn(
          "hover-animation grid w-full grid-cols-[auto,1fr] gap-3 px-4 py-3",
          reply
            ? "pt-3 pb-1"
            : replyModal
            ? "pt-0"
            : "border-b-2 border-light-border dark:border-dark-border",
          (disabled || isLoading) && "pointer-events-none opacity-50",
        )}
      >
        <UserAvatar src={picture} />
        <div className="flex w-full flex-col gap-4">
          <InputForm
            replyModal={replyModal}
            inputRef={inputRef}
            inputValue={inputValue}
            handleChange={handleChange}
          />
          <InputOptions
            reply={reply || replyModal}
            modal={modal}
            inputLength={1}
            isValidTweet={true}
          />
        </div>
      </label>
    </form>
  );
}

export default Input;
