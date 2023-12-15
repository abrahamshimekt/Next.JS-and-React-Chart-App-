"use client";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Select, { SingleValue } from "react-select";
import EmailRecipientsform from "./emailRecipientsform";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "@/utils/consts";
import { useDispatch, useSelector } from "react-redux";
require("dotenv").config();

import {
  setAttachments,
  setEmailContent,
  setEmails,
  setLetterTitle,
  removeAttachement,
  setbulkRecipients,
} from "@/redux/slice/emailSlice";

import Image from "next/image";

import Editor from "../email-sender-quill/Editor";
import { RootState } from "@/redux/store";
import EmailChips from "./EmailChips";
import FileChip from "./FileChips";
import { getToken } from "@/utils/authHelper";
import { useRouter } from "next/navigation";

type SelectionOption = {
  value?: string;
  label?: string;
};

const EmailForm = () => {
  const options = [
    { value: "Emdept", label: "EM Debt" },
    { value: "EmEquity", label: "EM Equity" },
    { value: "ESG", label: "ESG" },
  ];

  const dispatch = useDispatch();
  const router = useRouter()

  const [title, setTitle] = useState<SelectionOption>(options[0]);

  const emails = useSelector((state: RootState) => state.email.emails);
  const letterTitle = useSelector(
    (state: RootState) => state.email.letterTitle
  );
  const emailContent = useSelector(
    (state: RootState) => state.email.emailContent
  );
  const attachments = useSelector(
    (state: RootState) => state.email.attachments
  );
  const bulkRecipients = useSelector(
    (state: RootState) => state.email.bulkRecipients
  );

  const [draftEmails, setDraftEmails] = useState<object[]>([]);
  const [status, setStatus] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const {data:emailRecipientData} = useSelector(
    (state: RootState) => state.emailRecipient
  );

  useEffect(() => {
    const draftEmails = localStorage.getItem("draftEmails");
    if (draftEmails) {
      setDraftEmails(JSON.parse(draftEmails));
    }
  }, []);

  const handleBeforeUnload = () => {
    if (!status) {
      const newDraftEmails = [
        ...draftEmails,
        { title, letterTitle, emailContent, emails, attachments, status },
      ];
      setDraftEmails(newDraftEmails);
      localStorage.setItem("draftEmails", JSON.stringify(newDraftEmails));
      return undefined;
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const token = getToken()
    if(token == undefined){
      toast.success("UnAuthorization, please login or create an account")
      router.push("/auth/login");
      return
    }
    event.preventDefault();
    event.stopPropagation();
    if(emailRecipientData == null){
      toast.error("Error, No email address found")
      return
    }
   
    const groupsList = [];
    for (const key in emailRecipientData) {
      if (Array.isArray(emailRecipientData[key]) && emailRecipientData[key].length > 0) {
        groupsList.push(key);
      }
    }
    if(groupsList.length == 0){
      toast.error("please add recipient email address")
      return
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("subject", letterTitle);
    formData.append("html_content", emailContent);
    // const default_recipients = [
    //   "mike@trounceflow.com",
    //   "trounceflow@gmail.com",
    //   "michael.trounce@exantedata.com"
    // ];
    // default_recipients.forEach((email) => {
    //   formData.append("recipient_emails", email);
    // });
    
    attachments.forEach((file) => {
      formData.append("attachments", file);
    });
    bulkRecipients.forEach((bulkRecipient:any) => {
      formData.append("bulk_recipients", bulkRecipient);
    });

    try {
      const res = await axios.post(`${API_URL}/api/send-email/?groups=${groupsList}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `JWT ${token}`,
        },
      });
      if(res.status == 401){
        toast.error("Please login to your account")
        router.push("/auth/login");
      }
      else if (res.status === 200) {
        toast.success("Email sent successfully");
        setStatus(true);
      } else {
        toast.error("Email failed to send");
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailContentChange = (content: any) => {
    dispatch(setEmailContent(content));
    setStatus(false);
  };

  const handleSelectionChange = (newValue: SingleValue<SelectionOption>) => {
    setTitle({ ...newValue });
    setStatus(false);
  };

  const handleLetterTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setLetterTitle(e.target.value));
    setStatus(false);
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      dispatch(setAttachments(Array.from(e.target.files)));
    }

    e.target.value = "";

    setStatus(false);
  };

  const removeFile = (index: number) => {
    dispatch(removeAttachement(index));
  };

  const handleEmailFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      dispatch(setbulkRecipients(Array.from(e.target.files)));
    }

    e.target.value = "";
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full mx-auto px-4 sm:px-6 my-4 sm:my-8"
    >
      <label
        htmlFor="Title"
        className="block text-sm sm:text-base font-medium text-gray-900 mb-2"
      >
        Title<span className="text-red-500">*</span>
      </label>
      <Select
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            zIndex: 20,
            fontSize: "1rem",
          }),
          option: (baseStyles, { isFocused, isSelected }) => ({
            ...baseStyles,
            backgroundColor: isSelected ? "#019cd2" : "",
            color: isSelected ? "white" : "black",
            position: "relative",
            fontSize: "1rem",
            ":hover": {
              backgroundColor: "#019cd240",
            },
          }),
          menu: (baseStyles) => ({
            ...baseStyles,
            fontSize: "1rem",
            zIndex: 20,
          }),
        }}
        options={options}
        value={title}
        onChange={handleSelectionChange}
      />
      <div className="sm:col-span-3 mt-5">
        <label
          htmlFor="letterTitle"
          className="block text-sm sm:text-base font-medium text-gray-900"
        >
          Letter Title<span className="text-red-500">*</span>
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="letterTitle"
            id="letterTitle"
            value={letterTitle}
            autoComplete="given-name"
            className="mt-2 block w-full text-sm sm:text-base block focus:bg-indigo-50 px-3 w-full rounded-sm border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
            placeholder="Title"
            onChange={handleLetterTitleChange}
          />
        </div>
      </div>
      <EmailRecipientsform
        emails={emails}
        setEmails={(newEmails) => dispatch(setEmails(newEmails))}
        handleEmailFileChange = {handleEmailFileChange}
      />
      <div className="col-span-full mt-5">
        <label
          htmlFor="attachement"
          className="block text[18px] font-medium leading-6 text-gray-900"
        >
          Attachments
        </label>

        <div className="border-[1px] border-gray-100 px-2 py-4 !bg-white flex justify-start items-center flex-wrap gap-2">
          {attachments.slice(0, 100).map((file: any, index: number) => {
            return (
              <FileChip
                key={`${file.name}`}
                index={index}
                file={file.name}
                onRemove={removeFile}
              />
            );
          })}
          {attachments.length > 100 && (
            <span className="text-sm sm:text-base font-medium text-gray-900">
              ....
            </span>
          )}
          {attachments.length === 0 && (
            <p className="text-sm sm:text-base font-medium text-gray-900">
              Attachements will be here
            </p>
          )}
        </div>

        <div className="mt-2">
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="multiple_files"
            type="file"
            multiple
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div className="mt-8 flex flex-col md:flex-row space-x-0 md:space-x-4">
        <div className="w-full md:w-1/2 mb-4">
          <div className="text-md font-semibold text-gray-900 mb-4">
            Content <span className="text-red-600">*</span>
          </div>
          <Editor
            value={emailContent}
            handleChange={handleEmailContentChange}
          />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className={`rounded-3xl bg-indigo-600 px-10 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600  ${
            ((bulkRecipients.length === 0 && (emailRecipientData == null || Object.values(emailRecipientData).every((value:any) => value.length === 0) ))  || letterTitle == "" || emailContent == "") &&
            "!bg-gray-200 cursor-not-allowed"
          } `}
          disabled={
            (bulkRecipients.length === 0 && (emailRecipientData == null || Object.values(emailRecipientData).every((value:any) => value.length === 0) ) ) || letterTitle === "" || emailContent === ""
          }
        >
          {loading ? (
            <Image src="/EllipsisLoading.gif" alt="" width={30} height={30} />
          ) : (
            "Send"
          )}
        </button>
      </div>
    </form>
  );
};

export default EmailForm;   