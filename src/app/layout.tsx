import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from "./client-layout";


export const metadata: Metadata = {
  title: "课堂任务评价板管理系统",
  description: "课堂任务评价板管理系统 - 智能教学管理平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
