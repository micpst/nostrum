import type { ReactNode } from "react";
import Aside from "@/app/components/aside/aside";
import Suggestions from "@/app/components/aside/suggestions";

export const metadata = {
  title: "Explore / Nostrum",
};

function ExploreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Aside>
        <Suggestions />
      </Aside>
    </>
  );
}

export default ExploreLayout;
