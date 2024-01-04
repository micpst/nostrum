import type { Metadata } from "next";
import type { ReactNode } from "react";
import Aside from "@/app/components/aside/aside";
import AsideSuggestions from "@/app/components/aside/aside-suggestions";
import AsideLogin from "@/app/components/aside/aside-login";

export const metadata: Metadata = {
  title: "Note / Nostrum",
};

function NoteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Aside>
        <AsideLogin />
        <AsideSuggestions />
      </Aside>
    </>
  );
}

export default NoteLayout;
