"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { navLinks } from "@/app/components/settings/settings-list";

function SettingsPage(): void {
  const { replace } = useRouter();

  useEffect(() => {
    void replace(navLinks[0].href);
  }, []);
}

export default SettingsPage;
