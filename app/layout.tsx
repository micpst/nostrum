import type { Metadata } from "next";
import type { ReactNode } from "react";
import BottomBar from "@/app/components/bottombar/bottombar";
import Loader from "@/app/components/common/loader";
import Main from "@/app/components/common/main";
import Sidebar from "@/app/components/sidebar/sidebar";
import Providers from "@/app/lib/context/providers";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "Nostrum",
  description: "Open web client for Nostr",
  keywords: [
    "Nostr",
    "Nostrum",
    "Social Network",
    "Social Media",
    "Decentralized",
    "Censorship-resistant",
  ],
  authors: [{ name: "Michał Pstrąg" }],
};

function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-chirp overflow-y-scroll">
        <div className="flex w-full justify-center">
          <Providers>
            <Loader>
              <Sidebar />
              <Main>{children}</Main>
              <BottomBar />
            </Loader>
          </Providers>
        </div>
      </body>
    </html>
  );
}

export default RootLayout;
