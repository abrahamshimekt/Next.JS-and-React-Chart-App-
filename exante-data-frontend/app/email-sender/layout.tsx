"use client";
import EmailSenderSidebar from "@/components/email-sender/EmailSenderSidebar";
import Script from "next/script";
import "../globals.css";

export default function EmailSenderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.css"
        rel="stylesheet"
      />
      <EmailSenderSidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          {children}
        </div>
      </div>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.js"
        strategy="beforeInteractive"
      />
    </>
  );
}
