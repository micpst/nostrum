"use client";

import type { IconName } from "@/app/components/ui/icon";

export type NavLink = {
  href: string;
  linkName: string;
  iconName: IconName;
};

export const navLinks: Readonly<NavLink[]> = [
  {
    href: "/settings/relays",
    linkName: "Relays",
    iconName: "HashtagIcon",
  },
];

function SettingsCategory() {
  return <div className="w-full border-x border-light-border">test</div>;
}

export default SettingsCategory;
