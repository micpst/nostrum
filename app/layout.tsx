import "../styles/globals.css";
import React from "react";

export const metadata = {
  title: "Nostrum",
  description: "Open web client for Nostr",
  authors: [{ name: "Michał Pstrąg" }],
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export default RootLayout;
