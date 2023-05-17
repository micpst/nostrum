"use client";

import type { ReactNode } from "react";
import SettingsList from "@/app/components/settings/settings-list";

function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SettingsList />
      <section className="w-full max-w-[37rem] border-x border-light-border">
        {children}
      </section>
    </>
  );
}

export default SettingsLayout;
