import type { Metadata } from "next";
import type { ReactNode } from "react";
import Aside from "@/app/components/aside/aside";
import AsideSearchbar from "@/app/components/aside/aside-searchbar";
import AsideSuggestions from "@/app/components/aside/aside-suggestions";
import AsideTrends from "@/app/components/aside/aside-trends";

export const metadata: Metadata = {
  title: "Home / Nostrum",
};

function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Aside>
        <AsideSearchbar />
        <AsideTrends />
        <AsideSuggestions />
      </Aside>
    </>
  );
}

export default HomeLayout;
