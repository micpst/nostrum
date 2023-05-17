"use client";

import Header from "@/app/components/common/header";
import SettingsLink from "@/app/components/settings/settings-link";
import SettingsRelays from "@/app/components/settings/settings-relays";
import { useWindow } from "@/app/lib/context/window-provider";

export type NavLink = {
  href: string;
  linkName: string;
  Component: () => JSX.Element;
};

export const navLinks: Readonly<NavLink[]> = [
  {
    href: "/settings/relays",
    linkName: "Relays",
    Component: SettingsRelays,
  },
];

function SettingsList() {
  const { width } = useWindow();

  if (width < 1024) return null;

  return (
    <section className="w-full max-w-[25rem] border-l border-light-border">
      <Header title="Settings" />
      {navLinks.map((link) => (
        <SettingsLink key={link.href} {...link} />
      ))}
    </section>
  );
}

export default SettingsList;
