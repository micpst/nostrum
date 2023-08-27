import Link from "next/link";
import cn from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect, useRef, useId } from "react";
import type { ReactNode, FormEvent, ChangeEvent, ClipboardEvent } from "react";
import type { Variants } from "framer-motion";
import UserAvatar from "@/app/components/user/user-avatar";
import { useAuth } from "@/app/lib/context/auth-provider";
import { User } from "@/app/lib/types/user";
import { useProfile } from "@/app/lib/context/profile-provider";
import InputForm from "@/app/components/input/input-form";
import InputOptions from "@/app/components/input/input-options";
import NostrService from "@/app/lib/services/nostr";
import { Kind } from "nostr-tools";
import { useRelay } from "@/app/lib/context/relay-provider";

type InputProps = {
  disabled?: boolean;
  children?: ReactNode;
  closeModal: () => void;
};

export const variants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

function Input({
  disabled,
  children,
  closeModal,
}: InputProps): JSX.Element | null {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [visited, setVisited] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { publicKey } = useAuth();
  const { profiles, isLoading, addProfiles, removeProfiles } = useProfile();
  const { publish } = useRelay();

  if (!publicKey) return null;

  const user = profiles.get(publicKey);

  const { about, name, picture, banner, nip05 } = user as User;

  const publishNote = async (): Promise<void> => {
    if (!inputValue || !user) return;

    inputRef.current?.blur();

    const event = await NostrService.createEvent(
      1,
      user.pubkey,
      inputValue.trim()
    );

    if (event) {
      await publish(event);
      closeModal();
    }
  };

  const discardNote = (): void => {
    setInputValue("");
    setVisited(false);

    inputRef.current?.blur();
  };

  const handleChange = ({
    target: { value },
  }: ChangeEvent<HTMLTextAreaElement>): void => setInputValue(value);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    void publishNote();
  };

  return (
    <form
      className={cn("flex flex-col", {
        "cursor-not-allowed": disabled,
      })}
      onSubmit={handleSubmit}
    >
      {loading && (
        <motion.i className="h-1 animate-pulse bg-main-accent" {...variants} />
      )}
      {children}
      <label
        className={cn(
          "hover-animation grid w-full grid-cols-[auto,1fr] gap-3 p-4 border-b-2 border-light-border",
          (disabled || loading) && "pointer-events-none opacity-50"
        )}
      >
        <UserAvatar src={picture} />
        <div className="flex w-full flex-col gap-4">
          <InputForm
            inputRef={inputRef}
            inputValue={inputValue}
            handleChange={handleChange}
          />
          <InputOptions inputLength={1} isValidTweet={true} />
        </div>
      </label>
    </form>
  );
}

export default Input;
