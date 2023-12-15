"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import { HiTemplate } from "react-icons/hi";

const EmailSidebarTemplatesLink = () => {
  const handleDirectionClick = () => {
    setTemplateRendered(!templateRendered);
  };

  const [templateRendered, setTemplateRendered] = useState(false);
  return (
    <Link
      href="/email-sender/#"
      className="flex items-center justify-between w-full py-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 hover:text-gray-100 dark:hover:bg-gray-700 group"
      onClick={handleDirectionClick}
    >
      <div className="flex items-center justify-start">
        <HiTemplate
          className={`mx-2 text-gray-500 hover:text-gray-100`}
          size={30}
        />
        Templates
      </div>

      {templateRendered ? (
        <FaAngleRight className="mr-2" />
      ) : (
        <FaAngleLeft className="mr-2" />
      )}
    </Link>
  );
};

export default EmailSidebarTemplatesLink;
