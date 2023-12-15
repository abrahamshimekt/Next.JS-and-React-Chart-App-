"use client";
import React, { useState } from "react";
import { LogoComponent } from "./LogoBar";
// import { NavbarProps } from "@/@types/types";

type NavbarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
};

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }: NavbarProps) => {
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="flex gap-2 items-center p-2" data-testid="navbar-header">
      <div className={`lg:hidden text-white z-50`}>
        <button onClick={toggleSidebar}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isSidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
      <div className="flex-1">
        <LogoComponent />
      </div>
    </header>
  );
};

export default Navbar;
