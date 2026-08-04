import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Saurabh — React Native & Full-Stack",
    template: "%s · Saurabh",
  },
  description:
    "Portfolio of Saurabh — React Native app development with a backend and AI path.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmSans.variable} antialiased`}>
        <SiteHeader />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
