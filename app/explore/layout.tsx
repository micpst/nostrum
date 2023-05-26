import type { Metadata } from "next";
import type { ReactNode } from "react";
import Aside from "@/app/components/aside/aside";
import AsideLogin from "@/app/components/aside/aside-login";
import AsideSuggestions from "@/app/components/aside/aside-suggestions";
import AsideTrends from "@/app/components/aside/aside-trends";
import AsideSearchbar from "@/app/components/aside/aside-searchbar";

export const metadata: Metadata = {
  title: "Explore / Nostrum",
};

function ExploreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Aside>
        <AsideSearchbar />
        <AsideLogin />
        <AsideTrends />
        <AsideSuggestions />
      </Aside>
    </>
  );
}

export default ExploreLayout;
