import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
    <html lang="zh-CN" className={cn("font-sans", inter.variable)}>
      <body className="antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
