"use client";

import { useRouter } from "next/navigation";
import { navLinks } from "@/app/settings/[category]/page";

function Settings(): void {
  const { replace } = useRouter();
  void replace(navLinks[0].href);
}

export default Settings;
