"use client";

import Link from "next/link";
import type { FC } from "react";
import Ostrich from "@/app/icons/Ostrich";

const Logo: FC = () => (
  <h1 className="pt-1">
    <Link
      className="flex items-center justify-center p-3 rounded-full hover:bg-gray-100"
      href="/"
    >
      <Ostrich className="fill-violet-700" size="1.75rem" />
    </Link>
  </h1>
);

export default Logo;
