import type { ReactNode } from "react";
import Header from "@/app/components/common/header";

export const metadata = {
  title: "Settings / Nostrum",
};

function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full border-x border-light-border">
      <Header title="Settings" />
      {children}
    </div>
  );
}

export default SettingsLayout;
