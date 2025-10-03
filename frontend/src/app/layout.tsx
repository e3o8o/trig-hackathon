import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StewardChain - Faithful Stewardship Made Simple",
  description: "Automate your tithing, protect your mission trips, and practice transparent Christian financial stewardship—all powered by smart contracts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
