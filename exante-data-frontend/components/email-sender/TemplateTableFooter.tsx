'use client'
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';

interface TemplateTableFooterProps {}

const TemplateTableFooter: React.FC<TemplateTableFooterProps> = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; 


  const items = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, items.length);
  const currentItems = items.slice(startIndex, endIndex);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  return (
    <div className='flex items-center justify-between w-full'>
      <div className='flex justify-start items-center  placeholder:'>
        <p className=''>
          Showing <span className='font-bold'>{startIndex + 1}</span> to <span className='font-bold'>{endIndex}</span> of <span className='font-bold'>{items.length}</span> entries
        </p>
      </div>
     
      <ReactPaginate 
        className='flex  items-center justify-end p-5 border-1 border-gray-300'
        breakLabel="..."
        nextLabel={<MdOutlineNavigateNext />}
        previousLabel={<GrFormPrevious />}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName="pagination "
        activeClassName="active bg-gray-900 text-white"
        pageClassName="border-[1px] border-collapse border-gray-500 px-5 py-2 "
        breakClassName="border-[1px]  border-gray-500 px-5 py-2 "
        previousClassName='border-[1px] border-collapse border-gray-500 px-5 py-3 hover:bg-gray-900 hover:text-white rounded-l-lg'
        nextClassName='border-[1px] border-collapse border-gray-500 px-5 py-3 hover:bg-gray-900 hover:text-white rounded-r-lg'
        
      />
    </div>
  );
};

export default TemplateTableFooter;
