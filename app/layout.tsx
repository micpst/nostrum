import type { ReactNode } from "react";
import Providers from "@/app/context/providers";
import Header from "@/app/components/Header";
import "@/styles/globals.css";

export const metadata = {
  title: "Nostrum",
  description: "Open web client for Nostr",
  authors: [{ name: "Michał Pstrąg" }],
};

function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Providers>
        <body className="font-chirp">
          <div className="flex w-full justify-center">
            <Header />
            {children}
          </div>
        </body>
      </Providers>
    </html>
  );
}

export default RootLayout;
