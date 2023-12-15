'use client'
import React, { useState } from 'react';
import { RiChatPrivateLine } from "react-icons/ri";
import PrivacyOptions from '../PrivacyOptions';
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaSort } from "react-icons/fa6";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";
import Modal from '../commons/Modal';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { sortTempletes } from '@/redux/slice/templateSlice';
import TemplateFiltering from './TemplateFiltering';

const TemplateTableHeader = () => {
    const [displayModal, setDisplayModal] = useState<boolean>(false);

    const dispatch = useDispatch();

    const handlePrivateOptions = () => {
        setDisplayModal(!displayModal);
    };
    
    const [isSortClicked, setIsSortClicked] = useState<boolean>(false);

    const handleSortClicked = () => {
        setIsSortClicked(!isSortClicked);
    };
    const [filtering, setFiltering] = useState(false);

    return (
    <>
    <div className='w-full  dark:bg-gray-800 relative shadow-md sm:rounded-lg py-6 px-2 md:gap-2 border-y-2 border-b-gray-300 mb-2'>
        <div className='w-full flex flex-col lg:flex-row lg:justify-between'>
        <div className="w-full flex lg:flex-row flex-col lg:gap-2 md:w-auto mb-4 md:mb-0">
            <form className="flex items-center grow">
                <label className="sr-only">Search</label>
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                            aria-hidden="true"
                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="simple-search"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Search"
                    />
                </div>
            </form>
            <button className='lg:flex flex items-center border-2 rounded-md px-2 py-1 gap-1 hover:bg-gray-900 hover:text-white'>  
                <IoMdAddCircleOutline className="h-10 w-10 sm:h-6 sm:w-6"/>                 
                <p className="">Add Template</p>
            </button>
        </div>
        <div className="w-full md:w-auto flex flex-col justify-between md:flex-row gap-2 md:items-center">
            <button className='lg:hidden flex items-center justify-center border-2 border-gray-500 rounded-md px-2 py-1 gap-1 hover:bg-gray-900 hover:text-white'>  
                <IoMdAddCircleOutline className="h-10 w-10 sm:h-6 sm:w-6"/>                      
                <p className="">Add Template</p>
            </button>
            <div className="flex flex-row  justify-end gap-2 md:ml-2">
                <div className="mb-4 md:mb-0">
                    <button
                        className='flex items-center justify-center border-2 border-gray-500 rounded-md px-2 py-2 w-full hover:bg-gray-900 hover:text-white'
                        onClick={handleSortClicked}>
                        <span>Sort by</span>
                        {isSortClicked ? <FaSortUp size={20} /> : <FaSortDown size={20} />}
                    </button>
                    {isSortClicked && 
                        <div className="absolute z-50 top-10 right-0 bg-white text-black dark:bg-gray-800 shadow-md rounded-md w-[120px]">
                            <div className="flex flex-col">
                                <Link onClick={()=>{dispatch(sortTempletes({type: "title"}))}} href="#" className='hover:bg-gray-200 w-full p-2'>Title</Link>
                                <Link href="#" className='hover:bg-gray-200 w-full p-2'>Updated time</Link>
                                <Link href="#" className='hover:bg-gray-200 w-full p-2'>Status</Link>
                                <Link href="#" className='hover:bg-gray-200 w-full p-2'>Type</Link>
                            </div>
                        </div>
}
                    </div>

                <div>
                    <button 
                        className='flex items-center justify-start gap-1 border-2 border-gray-500 rounded-md px-2 py-2 w-[80px] hover:bg-gray-900 hover:text-white'
                        onClick={() => setFiltering(!filtering)}
                        
                        >
                        <FaFilter size={20} />
                        <p>Filter</p>
                    </button>
                </div>
                </div>
        </div>
        </div>
        {
            filtering && <TemplateFiltering />
        }
    </div>  
    
    
    </>  
    );
};

export default TemplateTableHeader;