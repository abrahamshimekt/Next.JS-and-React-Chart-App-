"use client";
import React from "react";

interface FileChipProps {
  file: string;
  index: number;
  onRemove: (index:number) => void;
}

const FileChip: React.FC<FileChipProps> = ({ file,index, onRemove }) => {
  return (
    <div className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full flex items-center">
      <span className="mr-1">{file}</span>
      <button onClick={(e)=>onRemove(index)} className="text-red-600 hover:text-red-800">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-3 w-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default FileChip;
