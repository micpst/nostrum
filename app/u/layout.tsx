import type { Metadata } from "next";
import type { ReactNode } from "react";
import Aside from "@/app/components/aside/aside";
import AsideSearchbar from "@/app/components/aside/aside-searchbar";
import AsideSuggestions from "@/app/components/aside/aside-suggestions";
import AsideTrends from "@/app/components/aside/aside-trends";
import AsideLogin from "@/app/components/aside/aside-login";

export const metadata: Metadata = {
  title: "Profile / Nostrum",
};

function ProfileLayout({ children }: { children: ReactNode }) {
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

export default ProfileLayout;
