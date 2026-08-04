import type { Metadata } from "next";
import { IBM_Plex_Mono, Noto_Sans_SC, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: {
    default: "攀岩鞋试穿体验平台",
    template: "%s · 攀岩鞋试穿体验平台",
  },
  description:
    "记录与分享真实的攀岩鞋试穿体验，按脚型与场景找到合脚的那双鞋。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={cn(
        "font-sans",
        spaceGrotesk.variable,
        ibmPlexMono.variable,
        notoSansSC.variable,
      )}
    >
      <body className="antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
