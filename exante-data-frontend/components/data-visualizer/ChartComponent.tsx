import React, { useRef, useEffect, useMemo } from "react";
import { FRONTEND_URL } from "@/utils/consts";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import exporting from "highcharts/modules/exporting";
import exportData from "highcharts/modules/export-data";
import PlotChartOptionsButton from "./time-series-chart-plot/PlotCartOptions";
import { RootState } from "@/redux/store";

import { useDispatch, useSelector } from "react-redux";

import { setEmailContent } from "@/redux/slice/emailSlice";
import { useRouter } from "next/navigation";
import annotations from "highcharts/modules/annotations";

// Initialize Highcharts modules if Highcharts is an object
if (typeof Highcharts === "object") {
  exporting(Highcharts);
  exportData(Highcharts);
  annotations(Highcharts);
}

interface ChartProps {
  chartOptions: Highcharts.Options;
}

const ChartComponent: React.FC<ChartProps> = ({
  chartOptions: initialChartOptions,
}) => {
  const chartOptions = useMemo(() => {
    const deepCopyChartOptions = JSON.parse(
      JSON.stringify(initialChartOptions)
    );
    return deepCopyChartOptions;
  }, [initialChartOptions]);

  const chartRef = useRef<any>(null);

  const dispatch = useDispatch();

  const router = useRouter();

  const isBookmarked: Boolean = useSelector(
    (state: RootState) => state.searchedData.isBookmarked
  );

  const bookmarkLoaded: Boolean = useSelector(
    (state: RootState) => state.searchedData.bookmarkLoaded
  );

  const emailContent = useSelector(
    (state: RootState) => state.email.emailContent
  );

  const { data, loading, error } = useSelector(
    (state: RootState) => state.fundData
  );

  const selectedItems = useSelector(
    (state: RootState) => state.searchedData.selectedItems
  );

  const selectedChartType = useSelector(
    (state: RootState) => state.searchedData.selectedChart
  );

  const selectedChart = useSelector(
    (state: RootState) => state.searchedData.selectedChart
  );

  const options = [
    { value: "stacked", label: "Stacked" },
    { value: "sidebyside", label: "Side by Side" },
    { value: "linechart", label: "Line chart" },
    { value: "", label: "Scatter chart" },
    { value: "combinations", label: "Column-and-Line Chart" },
  ];

  useEffect(() => {
    if (chartRef.current && loading) {
      if (isBookmarked && bookmarkLoaded) {
        chartRef.current.chart.showLoading("Loading Your Bookmark Data..."); // Display custom loading
      } else {
        chartRef.current.chart.showLoading("Fetching your data..."); // Display custom loading
      }
    } else if (chartRef.current && !loading) {
      chartRef.current.chart.hideLoading(); // Display custom loading
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isBookmarked]);

  useEffect(() => {
    Highcharts.setOptions({
      lang: {
        thousandsSep: ",",
      },
    });
  }, []);

  const handleCapturedScreenshot = (dataUrl: string) => {
    const selectedItemsId = selectedItems.map(
      (selectedItem) => selectedItem.id
    );

    const imageWithUrl = `<br /><a href="${FRONTEND_URL}/?selecteditems=${selectedItemsId.join(
      ","
    )}"><img src=${dataUrl} /></a> <br /><br /><br /><br /><br /><br /> . . .`;
    dispatch(setEmailContent(emailContent + imageWithUrl));
    router.push("/email-sender");
  };

  function removeParentContainingText(
    svgString: string,
    className: string
  ): string {
    // Create a temporary div element to parse the SVG string
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = svgString.trim();

    // Find and remove the element with the specified class name
    const elementsToRemove = tempDiv.querySelectorAll(`g.${className}`);
    elementsToRemove.forEach((elem: any) => elem.parentNode.removeChild(elem));

    // Get the modified SVG string from the temporary div
    const modifiedSvgStr = tempDiv.innerHTML;

    return modifiedSvgStr;
  }

  function svgString2Image(
    svgString: string,
    width: number,
    height: number,
    format: string | undefined,
    callback: (dataUrl: string) => void
  ): void {
    // Set default for format parameter
    format = format ? format : "png";
    // SVG data URL from SVG string
    const svgData =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgString)));
    // Create canvas in memory (not in DOM)
    const canvas = document.createElement("canvas");
    // Get canvas context for drawing on canvas
    const context = canvas.getContext("2d");
    if (!context) {
      console.error("Canvas context is not supported.");
      return;
    }
    // Set canvas size
    canvas.width = width;
    canvas.height = height;
    // Create image in memory (not in DOM)
    const image = new Image();
    // Later when image loads run this
    image.onload = function () {
      // async (happens later)
      // Clear canvas
      context.clearRect(0, 0, width, height);
      // Draw image with SVG data to canvas
      context.drawImage(image, 0, 0, width, height);
      // Snapshot canvas as png
      const pngData = canvas.toDataURL("image/" + format);
      // Pass png data URL to callback
      callback(pngData);
    }; // end async
    // Start loading SVG data into in memory image
    image.src = svgData;
  }

  const getChartImage = (callback: (dataUrl: string) => void) => {
    const graphImageChartOptions = {
      // ...chartOptions,
      chart: {
        // Specify the desired width here
        width: 1500,
        height: 625,
        type: "column",
        zoomType: "x",
        style: {
          fontSize: "20px",
        },
      },
      title: {
        text: chartOptions.title?.text || "",
        style: {
          fontSize: "28px",
        },
      },
      credits: {
        text: chartOptions.credits?.text || "Exante Data",
        href: chartOptions.credits?.href || "https://homepage.exantedata.com/",
        style: {
          fontSize: "15px",
        },
      },
      xAxis: {
        type: selectedChart === "scatterchart" ? null : "datetime",
        title: {
          text: "",
          style: {
            fontSize: "25px",
          },
        },
        labels: {
          style: {
            fontSize: "25px",
          },
        },
      },
      yAxis: [
        {
          title: {
            text: Array.isArray(chartOptions?.yAxis)
              ? chartOptions.yAxis[0]?.title?.text
              : chartOptions?.yAxis?.title?.text || "",
            style: {
              fontSize: "25px",
            },
          },
          labels: {
            value: 5,
            style: {
              fontSize: "25px",
            },
            formatter: function (): string {
              return Highcharts.numberFormat(this.value, 0, ".", ",");
            },
          },
          opposite: false,
        },
        {
          title: {
            text: Array.isArray(chartOptions?.yAxis)
              ? chartOptions.yAxis[1]?.title?.text
              : chartOptions?.yAxis?.title?.text || "",
            style: {
              fontSize: "25px",
            },
          },
          labels: {
            value: 5,
            style: {
              fontSize: "25px",
            },
            formatter: function (): string {
              return Highcharts.numberFormat(this.value, 0, ".", ",");
            },
          },
          opposite: true,
        },
      ],
      legend: {
        enabled: true,
        maxHeight: 80,
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
        itemStyle: {
          fontSize: "24px",
        },
      },
      plotOptions: {
        column: {
          stacking: "normal",
        },
        series: {
          showInNavigator: true,
        },
      },
      series: chartOptions.series || [],
      tooltip: {
        // to truncate the decimal point to 2 sf
        valueDecimals: 2,
      },
      exporting: {
        enabled: true,
        chartOptions: {
          chart: {
            width: 15000,
            // height: 800,
          },
        },
      },
      navigator: {
        enabled: false,
      },
    };

    if (chartRef.current) {
      const svgString: string = chartRef.current.chart.getSVG(
        graphImageChartOptions
      );

      // Remove the parent element containing the specified text
      var modifiedSvgString: string = removeParentContainingText(
        svgString,
        "highcharts-range-selector-buttons"
      );

      // Convert SVG string to Blob
      const svgBlob = new Blob([modifiedSvgString], { type: "image/svg+xml" });

      // Create a FileReader to read the Blob as a base64 encoded data URL
      const reader = new FileReader();
      reader.readAsDataURL(svgBlob);
      reader.onloadend = () => {
        var base64Image: string | null = reader.result as string;
        // console.log(base64Image);
        svgString2Image(modifiedSvgString, 1200, 500, "png", callback);
        // Call the callback function with the base64 image data
        // callback(base64Image);
      };
    }
  };

  return (
    <div>
      <div className="flex justify-between h-12 w-full mb-4">
        <button
          onClick={() => getChartImage(handleCapturedScreenshot)}
          className="rounded-lg p-1 md:p-2 bg-[#019cd2] text-[#fff] hover:bg-[#019ad2d3] border border-[#019ad2] flex gap-2 justify-center items-center"
        >
          <svg
            fill="#fff"
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6.58900253,18.0753965 C6.5573092,17.8852365 6.54138127,17.692783 6.54138127,17.5 C6.54138127,15.5670034 8.10838464,14 10.0413813,14 L12.5,14 C12.7761424,14 13,14.2238576 13,14.5 L13,17.7267988 C13,17.8027316 13.0270017,17.8761901 13.0761794,17.9340463 C13.190639,18.0687047 13.3925891,18.085079 13.5272475,17.9706194 L20.5626572,11.9905211 C20.6161112,11.9450852 20.6657995,11.8953969 20.7112354,11.8419429 C21.1762277,11.2948932 21.1097069,10.4744711 20.5626572,10.0094789 L13.5272475,4.02938061 C13.4693913,3.98020285 13.3959328,3.95320119 13.32,3.95320119 C13.1432689,3.95320119 13,4.09647007 13,4.27320119 L13,7.5 C13,7.77614237 12.7761424,8 12.5,8 L9.5,8 C5.91014913,8 3,10.9101491 3,14.5 C3,17.3494045 4.26637093,19.0973664 6.88288761,19.8387069 L6.58900253,18.0753965 Z M10.0413813,15 C8.66066939,15 7.54138127,16.1192881 7.54138127,17.5 C7.54138127,17.6377022 7.55275836,17.7751689 7.57539646,17.9109975 L7.99319696,20.4178005 C8.0506764,20.7626772 7.74549866,21.0585465 7.40256734,20.990415 C3.83673227,20.2819767 2,18.0778979 2,14.5 C2,10.3578644 5.35786438,7 9.5,7 L12,7 L12,4.27320119 C12,3.54418532 12.5909841,2.95320119 13.32,2.95320119 C13.6332228,2.95320119 13.9362392,3.06458305 14.1748959,3.26744129 L21.2103057,9.24753957 C22.1781628,10.0702182 22.2958533,11.5217342 21.4731747,12.4895914 C21.3927882,12.5841638 21.3048781,12.6720739 21.2103057,12.7524604 L14.1748959,18.7325587 C13.6194301,19.2047047 12.7863861,19.1371606 12.3142401,18.5816947 C12.1113819,18.343038 12,18.0400216 12,17.7267988 L12,15 L10.0413813,15 Z" />
          </svg>
          <div>Share chart via Email</div>
        </button>

        {selectedChartType !== "stacked" && <PlotChartOptionsButton />}
      </div>

      <HighchartsReact
        highcharts={Highcharts}
        containerProps={{
          style: {
            height: "100%",
            width: "100%",
            borderRadius: "0.5rem",
          },
        }}
        constructorType={selectedChart === "scatterchart" ? null : "stockChart"}
        options={chartOptions}
        ref={chartRef}
      />
    </div>
  );
};

export default ChartComponent;
