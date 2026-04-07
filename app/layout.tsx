import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from '@/components/ClientLayout';

export const metadata: Metadata = {
  title: "NextEvent",
  description: "Only One Click to Your Next Event",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
