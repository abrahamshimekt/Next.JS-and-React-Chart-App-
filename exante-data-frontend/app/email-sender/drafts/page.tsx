import React from "react";
import TemplateTable from "@/components/email-sender/TemplateTable";
import Drafts from "@/components/email-sender/EmailTemplateDrafts";

export default function page() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl px-0 md:px-4 lg:px-12">
        {/* <!-- Start coding here --> */}
          <Drafts />
      </div>        
    </section>
  );
}
