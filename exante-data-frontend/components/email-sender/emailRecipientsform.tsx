"use client";
import * as React from "react";
import toast from "react-hot-toast";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";
import EmailChips from "./EmailChips";
import * as xlsx from "xlsx";
import { ChangeEvent, FC } from "react";
import FileChip from "./FileChips";
import { AppDispatch, RootState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";

import { removebulkRecipients } from "@/redux/slice/emailSlice";
import { changeData } from "@/redux/slice/email-sender/emailRecipientSlice";
import Multiselect from "multiselect-react-dropdown";
import { loadRecipientGroups } from "@/redux/actions/email-sender/emailRecipientsActions";
import useLogout from "@/hook/useLogout";

interface EmailRecipientsProps {
  emails: string[];
  setEmails: React.Dispatch<React.SetStateAction<string[]>>;
  handleEmailFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmailRecipientsform: FC<EmailRecipientsProps> = ({
  emails,
  setEmails,
  handleEmailFileChange,
}) => {
  const [focused, setFocused] = React.useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const logout = useLogout();
  const removeEmail = (index: number) => {
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    setEmails(newEmails as string[]);
  };
  const bulkRecipients = useSelector(
    (state: RootState) => state.email.bulkRecipients
  );

  const {
    data: emailRecipientData,
    options: data,
    loading,
    error,
  } = useSelector((state: RootState) => state.emailRecipient);

  const handleValidation = (email: string) => {
    if (emails.includes(email)) {
      toast.error("Email already exists!");
      return false;
    }

    if (!isEmail(email)) {
      toast.error("Invalid email format!");
      return false;
    }

    return true;
  };

  React.useEffect(() => {
    dispatch(loadRecipientGroups({ logoutCallback: logout }));
  }, []);

  React.useEffect(() => {
    if (error == "UnAuthorized" || error == "401") {
      toast.error("please login again.");
      router.push("/auth/login");
    }
  }, [error]);

  const removeUploadFile = (index: number) => {
    dispatch(removebulkRecipients(index));
  };

  const updateIndex = (groupId: number) => {
    if (data) {
      const filteredData = data
        .filter((item: any) => item.id === groupId)
        .map((item: any) => item.data) // Extract the data
        .flat();
      dispatch(changeData({ groupId: groupId, data: filteredData }));
    }
  };

  return (
    <div className="my-4">
      <h1 className="my-2 text-sm sm:text-base font-medium text-gray-900">
        Recipients
      </h1>

      {/* <div className="border-[1px] border-gray-100 px-2 py-4 !bg-white flex justify-start items-center flex-wrap gap-2">
        {emails.slice(0, 100).map((email: string, index: number) => {
          return (
            <EmailChips
              key={`${email} ${index}`}
              email={email}
              index={index}
              removeFromEmails={removeEmail}
            />
          );
        })}
        {emails.length > 100 && (
          <span className="text-sm sm:text-base font-medium text-gray-900">
            ....
          </span>
        )}
        {emails.length === 0 && (
          <p >
            Email addresses will be here
          </p>
        )}
      </div>
          <label htmlFor="email-input" className="text-sm sm:text-base font-medium text-gray-900">Email Addresses</label>
      <ReactMultiEmail
        id="email-input"
        placeholder="Enter email addresses"
        emails={emails}
        onChange={(_emails: string[]) => {
          let mergedList = _emails;
          if (_emails.length > 0 && emails.length > 0 ) {
            mergedList = _emails.concat(emails);
            mergedList = mergedList.filter((item, index) => mergedList.indexOf(item) === index);
          }
          _emails.length > 0 && setEmails(mergedList as string[]);
        }}
        autoFocus={true}
        validateEmail={(email: string) => {
          return handleValidation(email);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        getLabel={(email, index, removeEmail) => {
          return <></>;
        }}
        // getLabel={(email, index, removeEmail) => {
        //   return (
        //     <div data-tag key={index}> 
        //       {/* <div data-tag-item> <EmailChips email={email} index={index} removeFromEmails={removeEmail}/></div> 
        //       <div data-tag-item>{email}</div>
        //       <span data-tag-handle onClick={() => removeEmail(index)}>×</span>
        //     </div>);}}
      /> */}

      <div className="border rounded px-3 pb-5 pt-2">
        {data ? (
          data.map(({ group: cat, data: groupData, id: groupId }, ind) => (
            <div key={ind}>
              <p className="my-2 text-sm sm:text-base font-small text-gray-900">
                <label className="cursor-pointer">
                  {cat} {"  "}
                  <input
                    type="checkbox"
                    checked={
                      emailRecipientData?.[groupId]?.length == groupData.length
                    }
                    onChange={() => {
                      updateIndex(groupId);
                    }}
                    className="border-blue-500 focus:ring-0 focus:ring-offset-white focus:ring-blue-500 cursor-pointer"
                  />
                </label>
              </p>
              <Multiselect
                onRemove={(selectedList, selectedItem) => {
                  dispatch(
                    changeData({ groupId: groupId, data: selectedList })
                  );
                }}
                onSearch={function noRefCheck() {}}
                onSelect={(selectedList, selectedItem) => {
                  dispatch(
                    changeData({ groupId: groupId, data: selectedList })
                  );
                }}
                // onKeyPressFn={}
                className="focus:outline-none focus:ring focus:ring-blue-500"
                selectedValues={emailRecipientData?.[groupId]}
                displayValue="email"
                options={groupData}
                disable={true}
                disablePreSelectedValues={true}
                placeholder=""
                showCheckbox
                style={{
                  multiselectContainer: {
                    zIndex: 15,
                  },
                  chips: {
                    background: "black",
                    // color: "black",
                    border: "2px solid black",
                  },
                }}
              />
            </div>
          ))
        ) : loading ? (
          <>
            <svg
              aria-hidden="true"
              className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>{" "}
            Loading Email Addresses
          </>
        ) : (
          <p className="my-2 text-sm sm:text-base font-small text-gray-900">
            {" "}
            No email found
          </p>
        )}
      </div>

      {/* <div className="col-span-full mt-5">
        <label
          htmlFor="bulk_email"
          className="block text[18px] font-medium leading-6 text-gray-900"
        >
          Upload Bulk Email Recipients
        </label>

        <div className="border-[1px] border-gray-100 px-2 py-4 !bg-white flex justify-start items-center flex-wrap gap-2">
          {bulkRecipients.slice(0, 100).map((file: any, index: number) => {
            return (
              <FileChip
                key={`${file.name}`}
                index={index}
                file={file.name}
                onRemove={removeUploadFile}
              />
            );
          })}
          {bulkRecipients.length > 100 && (
            <span className="text-sm sm:text-base font-medium text-gray-900">
              ....
            </span>
          )}
          {bulkRecipients.length === 0 && (
            <p className="text-sm sm:text-base font-medium text-gray-900">
              Upload will be here
            </p>
          )}
        </div>

        <div className="mt-2">
          <input
            className="block max-w-72 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="multiple_email"
            type="file"
            accept=".csv, .xlsx"
            onChange={handleEmailFileChange}
            name="bulk_email"
          />
        </div>
      </div> */}
    </div>
  );
};

//test emails to copy/paste
/* 
    x@gmail.com y@yahoo.com, *mike@trounce.io 
    x@gail.com y@yaoo.com mie@trounce.io x@gmail.com 
    y@yahoo.co mike@troune.io x@gail.com y@aoo.com ie@trounce.io 
*/

export default EmailRecipientsform;
