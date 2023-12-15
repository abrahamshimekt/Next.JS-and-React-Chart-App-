"use client";
import { FC, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { IoIosMore } from "react-icons/io";
import Modal from "../commons/Modal";
import ConfirmDelete from "../commons/ConfirmDelete";
import toast from "react-hot-toast";

// import previousDay from "date-fns/previousDay/index";
import {
  setAttachments,
  setEmailContent,
  setEmails,
  setLetterTitle,
} from "@/redux/slice/emailSlice";
import { useDispatch } from "react-redux";
import Link from "next/link";


const Drafts: FC = () => {
  const dispatch = useDispatch();
  const isBrowser = typeof window !== "undefined";
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [draftEmails, setDraftEmails] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<number>(-1);
  const [filter, setFilter] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    right: number;
  }>({ top: 0, right: 0 });
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleDropdown = (
    index: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    const target = event.target as HTMLElement;
    const rect = target.closest("button")!.getBoundingClientRect();

    setIsDropdownOpen((prevIndex) => (prevIndex === index ? -1 : index));

    setDropdownPosition({
      top: rect.y,
      right: rect.x,
    });
  };

  useEffect(() => {
    const draftEmailsData = isBrowser
      ? JSON.parse(localStorage.getItem("draftEmails") || "[]")
      : [];

    setDraftEmails(draftEmailsData);
  }, [isBrowser]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value !== "") {
      const filteredEmails = draftEmails.filter(
        (email: any) =>
          email.title.label
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          email.letterTitle.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setDraftEmails(filteredEmails);
    } else {
      setDraftEmails(JSON.parse(localStorage.getItem("draftEmails") || "[]"));
    }
  };

  const handleEdit = (index: any) => {
    const editingEmail = draftEmails[index];

    dispatch(setAttachments(editingEmail.attachments));
    dispatch(setLetterTitle(editingEmail.letterTitle));
    dispatch(setEmailContent(editingEmail.emailContent));
    dispatch(setEmails(editingEmail.emails));
  };

  const handleCheckToggle = (index: number) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleCheckAllToggle = () => {
    const isEmpty = Object.keys(checkedItems).length === 0;

    const allChecked = isEmpty
      ? false
      : Object.values(checkedItems).every((item) => item);

    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]'
    );

    checkboxes.forEach((checkbox) => {
      checkbox.checked = !allChecked;
    });

    const newCheckedItems = {} as Record<number, boolean>;
    draftEmails.forEach((_, index) => {
      newCheckedItems[index] = !allChecked;
      setCheckedItems(newCheckedItems);
    });
  };

  const handleDelete = (index: any) => {
    if (draftEmails && index >= 0 && index < draftEmails.length) {
      draftEmails.splice(index, 1);

      localStorage.setItem("draftEmails", JSON.stringify(draftEmails));

      toast.success("Draft deleted successfully");
    }
  };

  const handleDeleteSelected = () => {
    const updatedDraftEmails = draftEmails.filter(
      (_, index) => !checkedItems[index]
    );
    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]'
    );

    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    setDraftEmails(updatedDraftEmails);
    localStorage.setItem("draftEmails", JSON.stringify(updatedDraftEmails));

    toast.success("Drafts deleted successfully");

    setCheckedItems({});
  };

  const handleOutsideClick = (event: MouseEvent) => {
    const modalOpen = document.getElementById("modal-dropdown");

    if (modalOpen) {
      return;
    }

    const dropdownMenu = document.getElementById("dropdownSkidding");
    if (dropdownMenu && !dropdownMenu.contains(event.target as Node)) {
      setIsDropdownOpen(-1);
    }
  };

  useEffect(() => {
    if (isDropdownOpen !== -1) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const isEmpty = Object.keys(checkedItems).length === 0;

    if (isEmpty) return;

    const hasCheckedItem = Object.values(checkedItems).some((item) => item);

    if (!hasCheckedItem) {
      setCheckedItems({});
    }
  }, [checkedItems]);

  return (
    <div className="relative overflow-x-auto md:shadow-md md:rounded-lg">
      <div className="flex justify-between">
        <div className="px-4 pt-4 pb-4 bg-white dark:bg-gray-900">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search"
              className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for items"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="flex justify-center items-center mr-5">
          <div className="">
            <button
              className=" px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-300"
              onClick={() => setFilter((prev) => !prev)}
            >
              {filter ? "Close Filter" : "Filter"}
            </button>
          </div>
          {Object.keys(checkedItems).length !== 0 && (
            <div className="px-4 pt-4 pb-4 bg-white dark:bg-gray-900">
              <Modal>
                <Modal.Open opens="draft">
                  <button className="border border-gray-300 rounded-lg hover:bg-gray-300">
                    <a href="#" className="block px-4 py-2 text-sm">
                      Delete Selected
                    </a>
                  </button>
                </Modal.Open>

                <Modal.Window name="draft">
                  <ConfirmDelete
                    resourceName="Draft"
                    onConfirm={() => handleDeleteSelected()}
                    disabled={false}
                  />
                </Modal.Window>
              </Modal>
            </div>
          )}
        </div>
      </div>
      {filter && (
        <div className="flex justify-between items-center">
          <div className="px-4 pt-4 pb-4 bg-white ">
            <div className="relative mt-1">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search by letter title"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="flex justify-between items-center flex-col md:flex-row ">
            <div>
              <label htmlFor="from" className="mx-2">
                Created between
              </label>
            </div>
            <div>
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                name="from"
              />
            </div>
            <div>
              <label htmlFor="to" className="mx-2">
                to
              </label>
            </div>
            <div>
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                name="to"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
          <div className="w-1/8"></div>
        </div>
      )}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              <input
                id="checkbox-all"
                onClick={() => handleCheckAllToggle()}
                type="checkbox"
                disabled={!draftEmails.length}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 disabled:cursor-not-allowed"
              />
            </th>
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3">
              Letter Title
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {draftEmails.map((draft: any, index: any) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="px-6 py-4">
                <input
                  id={`checkbox-${index}`}
                  onClick={() => handleCheckToggle(index)}
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 cursor-pointer border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </td>
              <td className="px-6 py-4">{draft.title.label}</td>
              <td className="px-6 py-4">{draft.letterTitle}</td>
              <td className="px-6 py-4 relative">
                <button
                  onClick={(e) => toggleDropdown(index, e)}
                  id={`dropdownOffsetButton-${index}`}
                  data-dropdown-toggle={`dropdownSkidding-${index}`}
                  className="border-2 border-gray-900 rounded-full hover:bg-gray-600 hover:text-white"
                >
                  <IoIosMore size={20} />
                </button>
                {isDropdownOpen === index &&
                  ReactDOM.createPortal(
                    <div
                      id="dropdownSkidding"
                      className="z-10 bg-gray-100 divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700 absolute top-full left-0"
                      style={{
                        top: Math.ceil(dropdownPosition["top"]),
                        left: Math.ceil(dropdownPosition["right"]),
                      }}
                    >
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownDefault"
                      >
                        <Link
                          href="/email-sender"
                          onClick={() => handleEdit(index)}
                          className="block px-4 py-2 hover:bg-white text-green-500 hover:text-green-700 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Edit
                        </Link>

                        <Modal>
                          <Modal.Open opens="draft">
                            <li>
                              <a
                                href="#"
                                className="block px-4 py-2 hover:bg-white text-red-500 text-bold hover:text-red-700 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Delete
                              </a>
                            </li>
                          </Modal.Open>

                          <Modal.Window name="draft">
                            <ConfirmDelete
                              resourceName="Draft"
                              onConfirm={() => handleDelete(index)}
                              disabled={false}
                            />
                          </Modal.Window>
                        </Modal>
                      </ul>
                    </div>,
                    document.body
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Drafts;