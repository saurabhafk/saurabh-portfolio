import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Saurabh Srivastava — React Native Engineer",
    template: "%s · Saurabh",
  },
  description:
    "React Native engineer & freelance content writer with 4 years shipping Android & iOS apps. Redux Toolkit, on-device ML, payments, and Anthropic / Claude certifications.",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  openGraph: {
    title: "Saurabh Srivastava — React Native Engineer",
    description:
      "React Native engineer & freelance content writer with 4 years shipping Android & iOS apps.",
    images: [{ url: "/images/avatar.jpg", width: 512, height: 512 }],
  },
};

const themeInitScript = `
(function () {
  try {
    var t = localStorage.getItem('portfolio-theme');
    document.documentElement.setAttribute('data-theme', t === 'vscode-light' ? 'vscode-light' : 'vscode-dark');
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'vscode-dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="vscode-dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${plexSans.variable} ${plexMono.variable} bg-base-100 text-base-content antialiased`}
      >
        <AppShell>{children}</AppShell>
        <ChatWidget />
      </body>
    </html>
  );
}
