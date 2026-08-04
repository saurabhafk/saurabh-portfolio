import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { SiteFooter } from "@/components/layout/SiteFooter";
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
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Saurabh Srivastava — React Native Engineer",
    template: "%s · Saurabh",
  },
  description:
    "React Native developer with 3+ years building Android & iOS apps. Redux Toolkit, APIs, deep linking, notifications, and in-app purchases.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="saurabh">
      <body className={`${syne.variable} ${dmSans.variable} bg-base-100 text-base-content antialiased`}>
        <SiteHeader />
        {children}
        <SiteFooter />
        <ChatWidget />
      </body>
    </html>
  );
}
