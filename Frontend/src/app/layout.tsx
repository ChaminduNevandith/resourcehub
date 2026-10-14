import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResourceHub | Resource booking platform",
  description: "Modern resource booking and reservation management system for employee and admin workflows.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
