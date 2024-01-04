"use client";

import Note from "@/app/components/note/note";
import { useThread } from "@/app/lib/context/thread-provider";

function NotePage(): JSX.Element | undefined {
  const { root } = useThread();

  if (!root) return undefined;

  return (
    <>
      <Note event={root} />
    </>
  );
}

export default NotePage;
