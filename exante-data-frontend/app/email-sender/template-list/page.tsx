import React from "react";
import TemplateTable from "@/components/email-sender/TemplateTable";

export default function page() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-10">
          <TemplateTable />
      </div>        
    </section>
  );
}
