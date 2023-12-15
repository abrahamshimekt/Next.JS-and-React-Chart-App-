import { useState } from "react";
import { useDispatch } from "react-redux";
import { setSelectedColumns } from "@/redux/slice/dataSlice";
import toast from "react-hot-toast";

const ColumnSelector = ({ columns }: { columns: string[] }) => {
  const dispatch = useDispatch();

  const [dateColumn, setDateColumn] = useState<string>("");
  const [dataColumn, setDataColumn] = useState<string>("");
  const [dataName, setDataName] = useState<string>("");

  const handleColumnSelection = () => {
    if (dateColumn && dataColumn && dataName && dateColumn !== dataColumn) {
      dispatch(
        setSelectedColumns({
          date: dateColumn,
          data: dataColumn,
          dataName: dataName,
        })
      );
      toast.success("Columns selected successfully");
    } else {
      toast.error("Please fill the form correctly");
    }
  };

  return (
    <section>
      <p className="text-black text-xl font-medium leading-normal">
        Column Selector
      </p>
      <p className="text-xl font-medium leading-normal text-neutral-600">
        Select the columns you want to visualize
      </p>

      <input
        className={
          "p-2 mt-4 mb-5 focus:outline-stone-300 min-w-full bg-white rounded-md text-black border"
        }
        type="text"
        name="Data"
        value={dataName}
        onChange={(e) => setDataName(e.target.value)}
        placeholder="Enter data name"
      />

      {columns.length > 0 && (
        <div className="flex flex-col justify-center items-center">
          <div className="flex justify-around gap-3">
            <div className="flex flex-col gap-2">
              <label htmlFor="dateColumnSelect">Date Column:</label>
              <select
                id="dateColumnSelect"
                className="border-2 border-primarySidebar rounded-md px-2 py-1"
                onChange={(e) => setDateColumn(e.target.value)}
              >
                <option value="">Select Date Column</option>
                {columns.map((column, index) => (
                  <option key={index} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="dataColumnSelect">Data Column:</label>
              <select
                id="dataColumnSelect"
                className="border-2 border-primarySidebar rounded-md px-2 py-1"
                onChange={(e) => setDataColumn(e.target.value)}
              >
                <option value="">Select Data Column</option>
                {columns.map((column, index) => (
                  <option key={index} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleColumnSelection}
            className="mt-5 text-sm p-2 bg-primaryButtonColor text-textColorLightGray border border-primaryBorderColor rounded-md hover:bg-primaryButtonHover"
          >
            Save Columns
          </button>
        </div>
      )}
    </section>
  );
};

export default ColumnSelector;
