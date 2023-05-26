"use client";

import cn from "clsx";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import CustomIcon from "@/app/components/ui/icon";

function AsideSearchbar(): JSX.Element | null {
  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const { push } = useRouter();

  const handleChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>): void => setInputValue(value);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (inputValue) void push(`/search?q=${inputValue}`);
  };

  const clearInputValue = (focus?: boolean) => (): void => {
    if (focus) inputRef.current?.focus();
    else inputRef.current?.blur();

    setInputValue("");
  };

  const handleEscape = (event: any): void => {
    if (event.key === "Escape") clearInputValue()();
  };

  return (
    <form className="hover-animation sticky bg-white" onSubmit={handleSubmit}>
      <label
        className="group flex items-center justify-between gap-4 rounded-full
                   bg-main-search-background px-4 py-2 transition focus-within:bg-main-background
                   focus-within:ring-1 focus-within:ring-main-accent"
      >
        <i>
          <CustomIcon
            className={cn(
              "h-5 w-5 transition-colors",
              inputValue ? "fill-main-accent" : "fill-light-secondary"
            )}
            iconName="SearchIcon"
          />
        </i>
        <input
          className="peer flex-1 bg-transparent outline-none
                     placeholder:text-light-secondary dark:placeholder:text-dark-secondary"
          type="text"
          placeholder="Search Nostr"
          ref={inputRef}
          value={inputValue}
          onChange={handleChange}
          onKeyUp={handleEscape}
        />
        <button
          className={cn(
            "rounded-full scale-50 bg-main-accent fill-main-background p-1.5 opacity-0 transition hover:brightness-90 disabled:opacity-0",
            inputValue &&
              "focus:scale-100 focus:opacity-100 peer-focus:scale-100 peer-focus:opacity-100"
          )}
          onClick={clearInputValue(true)}
          disabled={!inputValue}
        >
          <CustomIcon className="h-2.5 w-2.5" iconName="CrossIcon" />
        </button>
      </label>
    </form>
  );
}

export default AsideSearchbar;
