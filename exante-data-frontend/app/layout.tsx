import { Suspense } from "react";
import Providers from "@/components/providers";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Exante Data",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <head></head>
        <body>
          {" "}
          <Suspense fallback={<>Loading...</>}>{children}</Suspense>
        </body>
      </html>
    </Providers>
  );
}
