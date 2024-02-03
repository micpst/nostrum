import type { Metadata } from "next";
import type { ReactNode } from "react";
import Aside from "@/app/components/aside/aside";
import AsideLogin from "@/app/components/aside/aside-login";
import AsideSearchbar from "@/app/components/aside/aside-searchbar";
import AsideSuggestions from "@/app/components/aside/aside-suggestions";

export const metadata: Metadata = {
  title: "Note / Nostrum",
};

function NoteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Aside>
        <AsideSearchbar />
        <AsideLogin />
        <AsideSuggestions />
      </Aside>
    </>
  );
}

export default NoteLayout;
