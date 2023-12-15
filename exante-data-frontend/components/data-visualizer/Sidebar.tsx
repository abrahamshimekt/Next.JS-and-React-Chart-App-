"use client";
import DataSourcesMenu from "../DataSourcesMenu";
import BookmarkList from "../data-visualizer/BookmarkList";
import FileUploader from "../FileUploader";
import Navbar from "../Navbar";
import Searchbar from "../commons/Searchbar";
import { useState } from "react";

export const SideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="lg:w-96 bg-primarySidebar lg:max-h-screen lg:pb-12 lg:overflow-y-scroll">
      <div className="lg:hidden h-[8vh] min-h-14">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
      <div
        className={`lg:flex lg:flex-col lg:items-start lg:justify-start lg:mx-4 my-8 mx-4 gap-8 transition-all duration-300 ${
          isSidebarOpen ? "flex flex-col" : "hidden"
        }`}
      >
        <div className="hidden lg:block">
          <Searchbar />
        </div>
        <BookmarkList />
        <DataSourcesMenu />
        <FileUploader />
      </div>
    </div>
  );
};
