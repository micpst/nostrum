import type { ReactNode } from "react";
import Main from "@/app/components/common/main";
import Sidebar from "@/app/components/sidebar/sidebar";
import Providers from "@/app/lib/context/providers";
import "@/styles/globals.css";

export const metadata = {
  title: "Nostrum",
  description: "Open web client for Nostr",
  authors: [{ name: "Michał Pstrąg" }],
};

function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-chirp">
        <div className="flex w-full justify-center">
          <Providers>
            <Sidebar />
            <Main>{children}</Main>
          </Providers>
        </div>
      </body>
    </html>
  );
}

export default RootLayout;
