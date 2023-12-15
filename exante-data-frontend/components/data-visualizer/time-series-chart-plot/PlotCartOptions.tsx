import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "@/components/commons/Modal";
import { RootState } from "@/redux/store";
import Select from "react-select";
import { setSelectedPlotOptions } from "@/redux/slice/dataSlice";

// Define an interface for selectedPlotOptions
interface SelectedPlotOptions {
  [key: string]: string; // Define an index signature
}

function PlotChartOptionsButton() {
  const dispatch = useDispatch();
  const [seriesSelectedOption, setSeriesSelectedOption] = useState<any>({});

  const selectedPlotOptions: SelectedPlotOptions = useSelector(
    (state: RootState) => state.searchedData.selectedPlotOptions
  );

  const selectedItems = useSelector(
    (state: RootState) => state.searchedData.selectedItems
  );

  const getSelectedPlotOption = (option: string) => {
    if (selectedPlotOptions && selectedPlotOptions.hasOwnProperty(option)) {
      return (selectedPlotOptions[option] as string) === "L-axis"
        ? "Left Hand Side"
        : "Right Hand Side";
    }
    return "Left Hand Side";
  };

  const options =
    selectedItems &&
    selectedItems.map((selectedItem: any) => ({
      value: selectedItem,
      label: selectedItem,
    }));
  const xoptions = [
    { value: "L-axis", label: "Left Hand Side" },
    { value: "R-axis", label: "Right Hand Side" },
  ];

  const handleChangeTimeSeriesPlot = () => {
    const newSelectedPlotOptions = { ...selectedPlotOptions };
    if (seriesSelectedOption.serie) {
      newSelectedPlotOptions[seriesSelectedOption.serie] =
        seriesSelectedOption.axis;

      dispatch(setSelectedPlotOptions(newSelectedPlotOptions));
      toast.success("Plot applied successfully, close dialog");
    }
  };

  const handleChange = (option: any, type: string) => {
    if (type === "series") {
      setSeriesSelectedOption({
        ...seriesSelectedOption,
        serie: option.value || "",
      });
    } else {
      setSeriesSelectedOption({
        ...seriesSelectedOption,
        axis: option.value || "",
      });
    }
  };

  return (
    <Modal>
      <Modal.Open opens="bookmarks">
        <button className="rounded-lg p-1 md:p-2 bg-[#019cd2] text-[#fff] hover:bg-[#019ad2d3] border border-[#019ad2] flex gap-2 justify-center items-center">
          <svg
            fill="#fff"
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6.58900253,18.0753965 C6.5573092,17.8852365 6.54138127,17.692783 6.54138127,17.5 C6.54138127,15.5670034 8.10838464,14 10.0413813,14 L12.5,14 C12.7761424,14 13,14.2238576 13,14.5 L13,17.7267988 C13,17.8027316 13.0270017,17.8761901 13.0761794,17.9340463 C13.190639,18.0687047 13.3925891,18.085079 13.5272475,17.9706194 L20.5626572,11.9905211 C20.6161112,11.9450852 20.6657995,11.8953969 20.7112354,11.8419429 C21.1762277,11.2948932 21.1097069,10.4744711 20.5626572,10.0094789 L13.5272475,4.02938061 C13.4693913,3.98020285 13.3959328,3.95320119 13.32,3.95320119 C13.1432689,3.95320119 13,4.09647007 13,4.27320119 L13,7.5 C13,7.77614237 12.7761424,8 12.5,8 L9.5,8 C5.91014913,8 3,10.9101491 3,14.5 C3,17.3494045 4.26637093,19.0973664 6.88288761,19.8387069 L6.58900253,18.0753965 Z M10.0413813,15 C8.66066939,15 7.54138127,16.1192881 7.54138127,17.5 C7.54138127,17.6377022 7.55275836,17.7751689 7.57539646,17.9109975 L7.99319696,20.4178005 C8.0506764,20.7626772 7.74549866,21.0585465 7.40256734,20.990415 C3.83673227,20.2819767 2,18.0778979 2,14.5 C2,10.3578644 5.35786438,7 9.5,7 L12,7 L12,4.27320119 C12,3.54418532 12.5909841,2.95320119 13.32,2.95320119 C13.6332228,2.95320119 13.9362392,3.06458305 14.1748959,3.26744129 L21.2103057,9.24753957 C22.1781628,10.0702182 22.2958533,11.5217342 21.4731747,12.4895914 C21.3927882,12.5841638 21.3048781,12.6720739 21.2103057,12.7524604 L14.1748959,18.7325587 C13.6194301,19.2047047 12.7863861,19.1371606 12.3142401,18.5816947 C12.1113819,18.343038 12,18.0400216 12,17.7267988 L12,15 L10.0413813,15 Z" />
          </svg>
          <div>Change Time Series Plot</div>
        </button>
      </Modal.Open>

      <Modal.Window name="bookmarks">
        <div className="flex flex-col">
          <p className="text-black text-xl font-medium leading-normal text-neutral-800 mb-2">
            Time Series Plot
          </p>
          {selectedItems &&
            selectedItems.map((selectedItem: any, index: any) => (
              <div key={index}>
                {`${getSelectedPlotOption(selectedItem.name)} => ${
                  selectedItem.name
                }`}
              </div>
            ))}

          <div className="w-full text-sm md:text-base flex items-center gap-4 z-20 mt-4">
            <div className="font-medium">Time series</div>
            <Select
              className="w-[300px]"
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                }),
                option: (baseStyles, { isFocused, isSelected }) => ({
                  ...baseStyles,
                  backgroundColor: isSelected
                    ? "#019cd2"
                    : isFocused
                    ? "#019ad2d3"
                    : "",
                  color: isSelected ? "white" : "black",
                  position: "relative",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#019ad2d3",
                    color: "black",
                  },
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  zIndex: 20,
                }),
              }}
              options={options.map((option) => ({
                label: option.label.name,
                value: option.value.name,
              }))}
              value={
                seriesSelectedOption.serie
                  ? options.find(
                      (option) =>
                        option.value.id === seriesSelectedOption.serie.id
                    )
                  : null
              }
              onChange={(option) => handleChange(option, "series")}
            />

            <Select
              className="w-[300px]"
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                }),
                option: (baseStyles, { isFocused, isSelected }) => ({
                  ...baseStyles,
                  backgroundColor: isSelected
                    ? "#019cd2"
                    : isFocused
                    ? "#019ad2d3"
                    : "",
                  color: isSelected ? "white" : "black",
                  position: "relative",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#019ad2d3",
                    color: "black",
                  },
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  zIndex: 20,
                }),
              }}
              options={xoptions}
              value={xoptions.find(
                (option) => option.value === seriesSelectedOption.axis
              )}
              onChange={(option: any) => handleChange(option, "axis")}
            />
            <button
              onClick={() => {
                handleChangeTimeSeriesPlot();
              }}
              className="rounded-lg p-1 md:p-2 bg-[#019cd2] text-[#fff] hover:bg-[#019ad2d3] border border-[#019ad2] flex gap-2 justify-center items-center"
            >
              <div>Apply</div>
            </button>
          </div>
        </div>
      </Modal.Window>
    </Modal>
  );
}

export default PlotChartOptionsButton;