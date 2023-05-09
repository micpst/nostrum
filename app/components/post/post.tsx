"use client";

import Link from "next/link";

export type PostProps = {
  content: string;
};

function Post({ content }: PostProps) {
  return (
    <Link
      href=""
      className="flex w-full gap-1 truncate xs:overflow-visible xs:whitespace-normal"
    >
      <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
        <p className="whitespace-pre-line break-words">{content}</p>
      </div>
    </Link>
  );
}

export default Post;
