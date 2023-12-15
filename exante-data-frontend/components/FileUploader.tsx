import React, { useState, MouseEventHandler, useEffect } from "react";
import { useMutation } from "react-query";
import { uploadParsedDataFunction } from "@/lib/apiClient";
import { LiaCloudUploadAltSolid } from "react-icons/lia";
import { MdClear } from "react-icons/md";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addTimeSeries } from "@/redux/slice/dataLoaderSlice";
import { setSelectedItem } from "@/redux/slice/dataSlice";
import { hashStringToId } from "@/utils/commonFunctions";

const sampleFilePath =
  "https://res.cloudinary.com/dnfwsbwrb/raw/upload/v1709449610/example_boglfh.csv";

const FileUploader = () => {
  const dispatch: AppDispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploadClicked, setIsUploadClicked] = useState<boolean>(false);
  const [columns, setColumns] = useState<string[] | null>(null);
  const [parsedData, setParsedData] = useState<[number, number][]>([]);
  const [columnName, setColumnName] = useState("");
  const [isUpload, setIsUpload] = useState<boolean>(false);
  const [parserLoading, setParserLoading] = useState<boolean>(false);
  const selectedItems = useSelector(
    (state: RootState) => state.searchedData.selectedItems
  );

  const {
    data,
    loading,
    error: _,
  } = useSelector((state: RootState) => state.fundData);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    toast.success(
      "Make sure your date's format is in one of these formats, DD-MM-YYYY, YYYY-MM-DD, DD/MM/YYYY, or YYYY/MM/DD."
    );
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file === selectedFile) {
        const fileInput = event.target;
        fileInput.value = "";
      } else {
        setSelectedFile(file);
        setUploadSuccess(false);
        setError(null);
      }
    }
  };

  useEffect(() => {
    if (uploadSuccess) {
      toast.success("file uploaded successfully");
    }
  }, [uploadSuccess]);
  // handlePreview()
  useEffect(() => {
    if (!isUpload) {
      handlePreview();
    }
  }, [parsedData]);

  const handleClearFile = () => {
    setSelectedFile(null);
    setError(null);
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const { mutate, isLoading } = useMutation(uploadParsedDataFunction, {
    onSuccess: () => {
      setUploadSuccess(true);
      setSelectedFile(null);
      setIsUploadClicked(false);
      setError(null);
      setParsedData([]);
    },
    onError: (error) => {
      console.error("Error uploading file:", error);
      setError("Error uploading file. Please try again.");
    },
  });

  const convertCsvRowToTuple = (csvRow: string): [number, number] | null => {
    const columns = csvRow.split(",");

    if (columns.length !== 2) {
      return null;
    }

    let dateString = columns[0];
    if (columns[0].split("/").length === 3) {
      const [dd, mm, yyyy] = columns[0].split("/");
      dateString = `${yyyy}-${mm}-${dd}`;
    }

    const date = new Date(dateString).getTime();
    const value = parseFloat(columns[1]);

    if (date === null || isNaN(date) || value === null || isNaN(value)) {
      return null;
    }

    return [date, value];
  };

  const csvFileParser = async () => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;

      // Split the content into rows
      const rows = content.split("\n");

      const columns = rows[0].split(",");
      if (columns[columns.length - 1] === "\r") {
        columns.pop();
      }
      if (columns.length !== 2) {
        toast.error(
          "The file contains more than two columns! A file with only two columns is supported"
        );
        setSelectedFile(null);
        handleClearFile();
        return null;
      }

      setColumns(columns);
      setColumnName(columns[1]);

      // Convert each row to a tuple and filter out invalid rows
      const parsedData: [number, number][] = rows
        .map((row) => convertCsvRowToTuple(row))
        .filter((tuple) => tuple !== null) as [number, number][];
      console.log("csv parsing ------");
      parsedData.sort((a, b) => {
        // Sort by date (timestamp) in ascending order
        // (default)
        if (a[0] < b[0]) {
          return -1;
        } else if (a[0] > b[0]) {
          return 1;
        } else {
          // If dates are equal, sort by value (second element) in ascending order
          return a[1] - b[1];
        }
      });
      setParsedData(parsedData);
    };

    reader.readAsText(selectedFile!);
  };

  const parseDate = (serial: number): number => {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate(),
      hours,
      minutes,
      seconds
    ).getTime();
  };

  const parseExcelFile = async () => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const binaryString = event.target?.result as string;
        const workbook = XLSX.read(binaryString, {
          type: "binary",
          cellDates: true,
          cellNF: false,
          cellText: false,
          dateNF: "dd/mm/yyyy",
        });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const headers = sheet["B1"];
        setColumnName(headers.v);

        // Get data excluding the first row (headers)
        const excelData: any[] = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          range: 1,
        });
        if (excelData[0].length > 2 || excelData.length < 2) {
          toast.error(
            "The file contains more than two columns! A file with only two columns is supported"
          );
          setSelectedFile(null);
          handleClearFile();
          return;
        }

        // Convert the data to an array of tuples with timestamps and float values
        const parsedDataRows: [number, number][] = excelData.map(
          (row, index) => {
            return [
              parseInt(row[0].getTime()), // Convert date to timestamp
              parseFloat(row[1]), // Convert value to float
            ];
          }
        );
        parsedDataRows.sort((a, b) => {
          // Sort by date (timestamp) in ascending order
          // (default)
          if (a[0] < b[0]) {
            return -1;
          } else if (a[0] > b[0]) {
            return 1;
          } else {
            // If dates are equal, sort by value (second element) in ascending order
            return a[1] - b[1];
          }
        });
        console.log("woooorking//////");
        setParsedData(parsedDataRows);
      } catch (e) {
        toast.error("Error while parsing data");
      }
    };

    reader.readAsBinaryString(selectedFile!);
  };

  const fileParser = async () => {
    setParserLoading(true);
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    if (
      selectedFile.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      await parseExcelFile();
    } else if (selectedFile.type === "text/csv") {
      await csvFileParser();
    }
    setParserLoading(false);
  };

  const handleUpload = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!selectedFile) {
      setError("Please select a file.");
      const fileInput = document.getElementById(
        "fileInput"
      ) as HTMLInputElement;

      if (fileInput) {
        fileInput.value = "";
        fileInput.click();
      }
    } else if (parsedData.length === 0) {
      setError("Please preview the file first.");
    } else {
      setIsUploadClicked(true);
      mutate({
        name: columnName,
        data: parsedData,
      });
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    toast.success(
      "Make sure your date's format is in one of these formats, DD-MM-YYYY, YYYY-MM-DD, DD/MM/YYYY, or YYYY/MM/DD., you can also download a sample file for more."
    );
    setSelectedFile(file);
  };

  const handlePreview = async () => {
    // console.log(parsedData, parsedData.length, selectedFile)
    if (parsedData && parsedData.length > 0 && selectedFile) {
      const uploadedData = { name: columnName, data: parsedData };
      const id = hashStringToId(columnName);
      const alreadySelected = selectedItems.filter(
        (item) =>
          item.id == id && item.name == columnName && item.isUploaded == true
      );
      if (alreadySelected.length == 0) {
        dispatch(addTimeSeries({ name: columnName, data: parsedData }));
        dispatch(
          setSelectedItem([{ id: id, name: columnName, isUploaded: true }])
        );
      } else {
        toast.error("File Already in Preview.");
      }
    }
  };

  const handleDownloadSample = () => {
    const link = document.createElement("a");
    link.href = sampleFilePath;
    link.download = "sample-data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <form
      className="flex flex-col items-center w-full"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex flex-col items-center w-full">
        <label
          htmlFor="fileInput"
          className="flex flex-col items-center justify-center border-solid border-2 border-gray-400 rounded-lg p-6 mb-0 cursor-pointer min-w-full"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <LiaCloudUploadAltSolid className="text-6xl text-gray-300" />
          {!selectedFile ? (
            <p className="text-center text-gray-300">
              Drag & drop your <span className="text-gray-300 mr-1">CSV </span>
              file here <br />
              or click to select
            </p>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-center text-gray-600">
                {selectedFile.name}{" "}
                {`${(selectedFile.size / 1024).toFixed(2)} KB`}
              </p>
              <button className="flext items-center jutify-center rounded-full border-[1.5px] border-[#019cd2] p-1 hover:bg-[#019cd2]">
                <MdClear
                  className="text-blue-400 hover:text-black"
                  onClick={(e: React.MouseEvent<SVGElement, MouseEvent>) => {
                    e.preventDefault();
                    setSelectedFile(null);
                    setParsedData([]);
                    setError(null);
                    const fileInput = document.getElementById(
                      "fileInput"
                    ) as HTMLInputElement;
                    if (fileInput) {
                      fileInput.value = "";
                    }
                  }}
                />
              </button>
            </div>
          )}
          <input
            id="fileInput"
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            className="hidden"
            disabled={!!selectedFile}
          />
        </label>

        {error && <p className="text-red-500 font-medium text-sm">{error}</p>}

        {uploadSuccess && (
          <div className="flex justify-center align-center text-white">
            <p>File Uploaded to Backend Successfully!</p>
          </div>
        )}
        <div className="flex flex-col-reverse gap-2">
          <button
            type="button"
            onClick={handleDownloadSample}
            className={`mt-2 px-12 py-2  text-white rounded-md hover:border-textColorBlack bg-primaryButtonColor font-semibold transition duration-300 w-full sm:w-auto flex gap-2 items-center text-lg  text-textColorLightGray hover:bg-primaryButtonHover border border-primaryBorderColor`}
            title="Sample CSV File with correct Date format DD-MM-YYYY, YYYY-MM-DD, DD/MM/YYYY, YYYY/MM/DD"
          >
            <span>Download Sample</span>
          </button>
          <div className="flex flex-col sm:flex-row justify-between gap-6 min-w-max mt-5">
            {/* {parsedData.length ? ( */}
            <button
              type="button"
              // isLoading
              disabled={isLoading}
              className={`${
                isLoading ? "px-6" : "px-12"
              } mt-2 py-2  border-primaryButtonColor border-[1.5px] text-textColorLightGray font-semibold rounded-md transition duration-300 w-full sm:w-auto flex gap-2 items-center text-lg hover:bg-primaryButtonColor`}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                handleUpload(e);
              }}
            >
              {isLoading ? (
                <>
                  <svg
                    aria-hidden="true"
                    className="inline w-6 h-6 text-white animate-spin dark:text-gray-600 fill-[#0369a1]"
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
                  uploading
                </>
              ) : (
                "Upload"
              )}
            </button>
            {
              <button
                type="button"
                disabled={parserLoading}
                onClick={async () => {
                  await fileParser();
                }}
                className={`mt-2 px-12 py-2  text-white rounded-md hover:border-textColorBlack bg-primaryButtonColor font-semibold transition duration-300 w-full sm:w-auto flex gap-2 items-center text-lg ${
                  uploadSuccess || isLoading || !selectedFile
                    ? "bg-thirdButtonColor text-textColorGray cursor-not-allowed"
                    : "bg-primaryButtonColor text-textColorLightGray hover:bg-primaryButtonHover border border-primaryBorderColor"
                }`}
              >
                <span>
                  {parserLoading ? (
                    <>
                      <svg
                        aria-hidden="true"
                        className="inline w-6 h-6 text-white animate-spin dark:text-gray-600 fill-[#0369a1]"
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
                      Loading
                    </>
                  ) : (
                    "Preview"
                  )}
                </span>
              </button>
            }
          </div>
        </div>
      </div>
    </form>
  );
};

export default FileUploader;
