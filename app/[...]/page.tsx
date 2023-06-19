import type { Metadata } from "next";
import NotFound from "@/app/components/ui/not-found";

export const metadata: Metadata = {
  title: "Page not found / Nostrum",
};

function NotFoundPage(): JSX.Element {
  return <NotFound />;
}

export default NotFoundPage;
