"use client";
import React, { useState } from "react";
import { IoIosMore } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { FaSortNumericUp } from "react-icons/fa";

import TemplateStatusBadge from "./TemplateStatusBadge";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import Select, { SingleValue } from "react-select";
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

type SelectionOption = {
    value?: string;
    label?: string;
  };
const TemplateTableBody = () => {
    
    const { templates } = useSelector((state: RootState) => state.template);
    const [title, setTitle] = useState("");
    const [type, setType] = useState<SelectionOption>({label : "", value : ""});
    const [status, setStatus] = useState<SelectionOption>({label : "", value : ""});

  const [isDropdownOpen, setIsDropdownOpen] = useState<number>(-1);
  const [open, setOpen] = useState(false);
  const onOpenModal = (template: any) => {
    setOpen(true);
    setTitle(template.title);
    setType(template.type);
    setStatus(template.status);
  };
  const onCloseModal = () => setOpen(false);
  const handleEditTemplate = (template: any) => {
    const dataToSubmit = {
        title: title,
        type: typeof(type) !== typeof ("") ? type.value : type,
        status: typeof(status) !== typeof ("") ? status.value : status
        // status: status
        
    }
    // TODO: Implement
    // send the newly edited template data to the server
  };

  const toggleDropdown = (index: number) => {
    if (index === isDropdownOpen) {
      setIsDropdownOpen(-1);
    } else {
      setIsDropdownOpen(index);
    }
  };

  const type_options = [
    { value: "Other Page", label: "Other Page" },
    { value: "Country Page", label: "Country Page" }
  ];
  const status_options = [
    { value: "Live", label: "Live" },
    { value: "Closed", label: "Closed" }
  ];

  return (
    <div className="relative z-10 overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3 ">
              <div className="flex gap-1">Title</div>
            </th>
            <th scope="col" className="px-6 py-3 ">
              <div className="flex gap-1">Updated</div>
            </th>
            <th scope="col" className="px-6 py-3 ">
              <div className="flex gap-1">Type</div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex gap-1">Status</div>
            </th>
            <th scope="col" className="px-6 py-3"></th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {templates.map((item, index) => {
            return (
              <tr
                key={index}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {item.title}
                </th>
                <td className="px-6 py-4">{item.updated}</td>
                <td className="px-6 py-4">{item.type}</td>
                <td className="px-6 py-4">
                  <TemplateStatusBadge status={item.status} />
                </td>
                <td className="px-6 py-4">
                  <MdEdit
                    className="font-medium text-blue-600 dark:text-blue-500 hover:cursor-pointer"
                    size={20}
                    onClick={() => onOpenModal(item)}
                  />
                  <Modal
                    open={open}
                    onClose={onCloseModal}
                    center
                    classNames={{
                      overlayAnimationIn: "customEnterOverlayAnimation",
                      overlayAnimationOut: "customLeaveOverlayAnimation",
                      modalAnimationIn: "customEnterModalAnimation",
                      modalAnimationOut: "customLeaveModalAnimation",
                      overlay: "customOverlay",
                      modal: "customModal"
                    }}
                    animationDuration={400}>
                    <form className="w-full mx-auto px-4 sm:px-6 my-4 sm:my-8" method="post">
                      <label
                        htmlFor="title"
                        className="block text-sm sm:text-base font-medium text-gray-900 mb-2">
                        Title
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="title"
                          value={title}
                          required
                          autoComplete="given-name"
                          className="mt-2 block w-full text-sm sm:text-base block focus:bg-indigo-50 px-3 w-full rounded-sm border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                          placeholder="Title"
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      <div className="sm:col-span-3 mt-5">
                        <label
                          htmlFor="type"
                          className="block text-sm sm:text-base font-medium text-gray-900">
                          Type
                        </label>
                        <div className="mt-2">
                          <Select
                            styles={{
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                zIndex: 30,
                                fontSize: "1rem"
                              }),
                              option: (
                                baseStyles,
                                { isFocused, isSelected }
                              ) => ({
                                ...baseStyles,
                                backgroundColor: isSelected ? "#019cd2" : "",
                                color: isSelected ? "white" : "black",
                                position: "relative",
                                fontSize: "1rem",
                                ":hover": {
                                  backgroundColor: "#019cd240"
                                }
                              }),
                              menu: (baseStyles) => ({
                                ...baseStyles,
                                fontSize: "1rem",
                                zIndex: 30
                              })
                            }}
                            options={type_options}
                            value={type}
                            onChange={(newValue) => {
                              setType(newValue || {value : "", label : ""});
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-span-full mt-5">
                        <label
                          htmlFor="status"
                          className="block text[18px] font-medium leading-6 text-gray-900">
                          Status
                        </label>
                        <div className="mt-2">
                          <Select
                            styles={{
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                zIndex: 20,
                                fontSize: "1rem"
                              }),
                              option: (
                                baseStyles,
                                { isFocused, isSelected }
                              ) => ({
                                ...baseStyles,
                                backgroundColor: isSelected ? "#019cd2" : "",
                                color: isSelected ? "white" : "black",
                                position: "relative",
                                fontSize: "1rem",
                                ":hover": {
                                  backgroundColor: "#019cd240"
                                }
                              }),
                              menu: (baseStyles) => ({
                                ...baseStyles,
                                fontSize: "1rem",
                                zIndex: 20
                              })
                            }}
                            options={status_options}
                            value={status}
                            onChange={(newValue) => {
                              setStatus(newValue || {value : "", label : ""});
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                          type="button"
                          onClick={() =>
                            {
                              handleEditTemplate({
                                title: title,
                                type: type,
                                status: status
                              })
                              setOpen(false)
                            }
                          }
                          className={`rounded-3xl bg-indigo-600 px-10 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}>
                          Submit
                        </button>
                      </div>
                    </form>
                  </Modal>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleDropdown(index)}
                    id="dropdownOffsetButton"
                    data-dropdown-toggle="dropdownSkidding"
                    data-dropdown-offset-distance="10"
                    data-dropdown-offset-skidding="100"
                    data-dropdown-placement="left"
                    className="border-2 border-gray-900 rounded-full hover:bg-gray-600 hover:text-white">
                    <IoIosMore size={20} />
                  </button>
                  {isDropdownOpen === index && (
                    <div
                      id="dropdownSkidding"
                      className="z-10 bg-gray-100 divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700 absolute left-[85%] ">
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownDefault">
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-white dark:hover:bg-gray-600 dark:hover:text-white">
                            Move
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-white dark:hover:bg-gray-600 dark:hover:text-white">
                            Copy
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-white dark:hover:bg-gray-600 dark:hover:text-white">
                            Delete
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-white dark:hover:bg-gray-600 dark:hover:text-white">
                            Unpublish
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-white dark:hover:bg-gray-600 dark:hover:text-white">
                            History
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-white dark:hover:bg-gray-600 dark:hover:text-white">
                            Add Child Template
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TemplateTableBody;
