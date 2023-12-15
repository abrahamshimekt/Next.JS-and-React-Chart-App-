"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter, useSearchParams } from "next/navigation";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Highcharts from "highcharts/highstock";
import ChartComponent from "./data-visualizer/ChartComponent";
import BookmarkButton from "./data-visualizer/BookmarkButton";
import {
  setSelectedChart,
  setSelectedItem,
  setBookmarkLoaded,
} from "@/redux/slice/dataSlice";
import { CatagoryType } from "@/redux/slice/catagorySlice";
import { fetchFundFlows } from "@/redux/actions/fundFlowsActions";
import { AppDispatch } from "@/redux/store";
import Searchbar from "./commons/Searchbar";
import ChartTypeOptions from "./data-visualizer/ChartTypeOptions";
import { maxHeaderSize } from "http";
import { SourceAttrubution } from "./SourceAttribution";
import { loadCatagories } from "@/redux/actions/fundCategoriesActions";
import { getToken } from "@/utils/authHelper";
import useLogout from "@/hook/useLogout";
// import { DateRangePicker } from "react-date-range";

// Define an interface for selectedPlotOptions
interface SelectedPlotOptions {
  [key: string]: string; // Define an index signature
}
interface Category {
  id: number;
  name: string;
}

const HomeList = () => {
  const isMobile = true;
  const dispatch: AppDispatch = useDispatch();
  const searchParams = useSearchParams();
  const [customTitle, setCustomTitle] = useState("");
  const [sourceLabel, setSourceLabel] = useState<string>(""); // #
  const [sourceLink, setSourceLink] = useState<string>(""); // #
  const router = useRouter();
  const logout = useLogout();
  const selectedItems = useSelector(
    (state: RootState) => state.searchedData.selectedItems
  );
  const isBookmarked = useSelector(
    (state: RootState) => state.searchedData.isBookmarked
  );
  const selectedChartType = useSelector(
    (state: RootState) => state.searchedData.selectedChart
  );
  const { data, loading, error } = useSelector(
    (state: RootState) => state.fundData
  );
  const { categories: catagories, error: catagoriesError } = useSelector(
    (state: RootState) => state.category
  );
  const selectedPlotOptions: SelectedPlotOptions = useSelector(
    (state: RootState) => state.searchedData.selectedPlotOptions
  );
  const [scatterDataList, setScatterDataList] = useState<any[]>([]);

  const [navigatorEnabled, setNavigatorEnabled] = useState<boolean>(true);
  const [chartOptions, setChartOptions] = useState<any>({
    chart: {
      type: "column",
      zoomType: "x",
    },
    title: {
      text: "",
      style: {
        fontSize: "25px",
      },
    },
    credits: {
      text: "Exante Data",
      href: "https://homepage.exantedata.com/",
    },
    yAxis: [
      {
        title: {
          text: "",
          style: {
            fontSize: "14px",
          },
        },
        labels: {
          value: 5,
          style: {
            fontSize: "14px",
          },
          formatter: function (): string {
            return Highcharts.numberFormat(this.value, 0, ".", ",");
          },
        },
        opposite: false,
      },
      {
        title: {
          text: "",
          style: {
            fontSize: "14px",
          },
        },
        labels: {
          value: 5,
          style: {
            fontSize: "14px",
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
    },
    plotOptions: {
      column: {
        stacking: "normal",
      },
      series: {
        showInNavigator: true,
      },
    },
    series: [],
    navigator: {
      height: 70,
      adaptToUpdatedData: true,
      series: [],
      outlineWidth: 1,
    },
    tooltip: {
      // to truncate the decimal point to 2 sf
      valueDecimals: 2,
    },
    exporting: {
      enabled: true,
      chartOptions: {
        chart: {
          width: 750,
          height: 600,
        },
      },
    },
  });

  const getTitle = (customTitle: string, uniqueTitle: string) => {
    const windowSize = window.screen.width;
    if (windowSize <= 450) {
      // mobile phone
      return (customTitle ?? uniqueTitle ?? "No Data").length < 15
        ? customTitle ?? uniqueTitle ?? "No Data"
        : (customTitle ?? uniqueTitle ?? "No Data").substring(0, 15) + "...";
    } else if (windowSize > 450 && windowSize <= 1024) {
      // tablets and small screen computers
      return (customTitle ?? uniqueTitle ?? "No Data").length < 30
        ? customTitle ?? uniqueTitle ?? "No Data"
        : (customTitle ?? uniqueTitle ?? "No Data").substring(0, 30) + "...";
    } else {
      // large computers and desktops
      return (customTitle ?? uniqueTitle ?? "No Data").length < 70
        ? customTitle ?? uniqueTitle ?? "No Data"
        : (customTitle ?? uniqueTitle ?? "No Data").substring(0, 70) + "...";
    }
  };

  const getPlotOption = (option: string) => {
    if (selectedPlotOptions && selectedPlotOptions.hasOwnProperty(option)) {
      return (selectedPlotOptions[option] as string) === "L-axis" ? 0 : 1;
    }
    return 0;
  };

  useEffect(() => {
    dispatch(
      loadCatagories({
        logoutCallback: logout,
      })
    );
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("navigatorEnabled");
    if (storedData) {
      let existingNavOption: boolean = JSON.parse(storedData);
      setNavigatorEnabled(existingNavOption);
    }
  }, []);

  useEffect(() => {
    if (catagories.length > 0 && selectedItems.length === 0) {
      // If no selected items, default to first series
      const selected = searchParams.get("selecteditems");
      if (selected) {
        const searchList = selected
          .split(",")
          .map((itemId) => {
            const category = catagories.find(
              (category) => category.id === parseInt(itemId)
            );
            return category ? category : null;
          })
          .filter((item) => item !== null);
      } else {
        dispatch(
          fetchFundFlows({
            category: catagories[0],
            logoutCallback: logout,
          })
        );
      }
    }
  }, [catagories, dispatch]);

  useEffect(() => {
    if (data !== undefined) {
      if (selectedItems.length === 0 && catagories.length > 0) {
        const selected = searchParams.get("selecteditems");
        dispatch(setBookmarkLoaded(false));
        if (selected) {
          const searchList = selected
            .split(",")
            .map((itemId) => {
              const category = catagories.find(
                (category) => category.id === parseInt(itemId)
              );
              return category ? category : null;
            })
            .filter((item) => item !== null);
          dispatch(setSelectedItem(searchList));
          searchList.forEach((item) =>
            {
              if(item){
                dispatch(
                  fetchFundFlows({
                    category: item,
                    logoutCallback: logout,
                  })
                )
              }
            }
          );
        } else {
          dispatch(setSelectedItem([catagories[0]]));
          dispatch(
            fetchFundFlows({
              category: catagories[0],
              logoutCallback: logout,
            })
          );
        }
      }

      if (selectedItems.length === 2 && data.length == 2) {
        const dictList2 = Object.fromEntries(data[1]["data"]);
        const scatterSeries = data[0]["data"]
          .filter(([date]) => date in dictList2)
          .map(([date, value1]) => [value1, dictList2[date]]);

        scatterSeries.sort((a, b) => a[0] - b[0]);
        setScatterDataList(scatterSeries.length > 0 ? scatterSeries : []);
      } else {
        setScatterDataList([]);
      }
      const uniqueTitleValues: Set<string> = new Set();
      catagories?.forEach((name: CatagoryType) => {
        uniqueTitleValues.add(name.name);
        // }
      });
      const uniqueTitle = Array.from(uniqueTitleValues).join(", ");
      if (selectedChartType === "combinations") {
        setChartOptions((prevOptions: any) => ({
          ...prevOptions,
          title: {
            text: getTitle(customTitle, uniqueTitle),
          },
          xAxis: {
            type: "datetime",
            title: {
              text: "",
              style: {
                fontSize: "16px",
              },
            },
            labels: {
              value: null,
              style: {
                fontSize: "14px",
              },
              formatter: null,
            },
          },
          series: data.map((series: any, index: number) => ({
            name: series.name,
            yAxis: getPlotOption(series.name),
            type: index % 2 === 0 ? "column" : "spline",
            data: series.data,
          })),
          navigator: {
            ...prevOptions.navigator,
            series: [],
            enabled: navigatorEnabled,
          },
        }));
      } else if (
        selectedChartType === "scatterchart" &&
        selectedItems.length === 2 &&
        scatterDataList.length > 0
      ) {
        setChartOptions((prevOptions: any) => ({
          ...prevOptions,
          chart: {
            type: "scatter",
            zoomType: "x",
          },
          title: {
            text: getTitle(customTitle, uniqueTitle),
          },
          xAxis: {
            type: "",
            title: {
              text: "",
              style: {
                fontSize: "16px",
              },
            },
            labels: {
              value: 5,
              style: {
                fontSize: "14px",
              },
              formatter: function (): string {
                return Highcharts.numberFormat(this.value, 0, ".", ",");
              },
            },
          },
          series: [
            {
              data: scatterDataList,
              type: "scatter", // Change the type to 'scatter' for scatter chart
              color: "#7cb5ec",
              marker: {
                radius: 3,
                symbol: "circle",
              },
              tooltip: {
                valueSuffix: " units",
              },
              visible: true,
            },
          ],
          navigator: {
            ...prevOptions.navigator,
            series: [],
            enabled: navigatorEnabled,
          },
        }));
      } else {
        if (chartOptions.chart.type === "scatter") {
          setChartOptions((prevOptions: any) => ({
            ...prevOptions,
            chart: {
              type: "column",
              zoomType: "x",
            },
            plotOptions: {
              column: {
                stacking: null,
              },
              // scatter: null,
            },
            yAxis: {
              title: {
                text: "",
                style: {
                  fontSize: "14px",
                },
              },
            },
            series: data.map((series: any, index: number) => ({
              name: series.name,
              type: "column",
              data: series.data,
            })),
            tooltip: {
              // to truncate the decimal point to 2 sf
              valueDecimals: 2,
            },
            labels: {
              value: 5,
              style: {
                fontSize: "14px",
              },
              formatter: function (): string {
                return Highcharts.numberFormat(this.value, 0, ".", ",");
              },
              opposite: false,
            },
            xAxis: {
              type: "datetime",
              title: {
                text: "",
                style: {
                  fontSize: "16px",
                },
              },
              labels: {
                style: {
                  fontSize: "14px",
                },
                formatter: null,
              },
            },
          }));
          dispatch(setSelectedChart("stacked"));
        } else {
          setChartOptions((prevOptions: any) => ({
            ...prevOptions,
            chart: {
              type:
                prevOptions.chart.type === "scatter"
                  ? "column"
                  : prevOptions.chart.type,
              zoomType: "x",
            },
            title: {
              text: getTitle(customTitle, uniqueTitle),
            },
            xAxis: {
              type: "datetime",
              title: {
                text: "",
                style: {
                  fontSize: "16px",
                },
              },
              labels: {
                value: null,
                style: {
                  fontSize: "14px",
                },
                formatter: null,
              },
            },
            series: data.filter((series: any) => series !== null), // Filter out null series
            navigator: {
              ...prevOptions.navigator,
              series: [],
              enabled: navigatorEnabled,
            },
          }));
        }
      }

      localStorage.setItem(
        "navigatorEnabled",
        JSON.stringify(navigatorEnabled)
      );
    }
  }, [
    // data,
    catagories,
    data,
    selectedItems,
    dispatch,
    customTitle,
    navigatorEnabled,
  ]);

  const handleTitleChange = () => {
    //TODO: send an api request to change the custom Card title.
  };

  const toggleNavigator = () => {
    setNavigatorEnabled(!navigatorEnabled);
  };

  useEffect(() => {
    setChartOptions((options: any) => {
      const credits = {
        text: sourceLabel.trim() != "" ? sourceLabel : "Exante Data",
        href:
          sourceLink.trim() != ""
            ? sourceLink
            : "https://homepage.exantedata.com/",
      };

      const updatedOpts = {
        ...options,
        credits,
      };

      return updatedOpts;
    });
  }, [sourceLabel, sourceLink]);

  useEffect(() => {
    if (selectedPlotOptions) {
      if (selectedChartType === "combinations") {
        setChartOptions((prevOptions: any) => ({
          ...prevOptions,
          series: prevOptions.series.map((series: any, index: number) => ({
            name: series.name,
            yAxis: getPlotOption(series.name),
            type: index % 2 === 0 ? "column" : "spline",
            data: series.data,
          })),
        }));
      } else if (
        selectedChartType === "linechart" ||
        selectedChartType === "sidebyside"
      ) {
        setChartOptions((prevOptions: any) => ({
          ...prevOptions,
          series: prevOptions.series.map((series: any, index: number) => ({
            name: series.name,
            yAxis: getPlotOption(series.name),
            data: series.data,
          })),
        }));
      } else if (selectedChartType === "scatterchart") {
        setChartOptions((prevOptions: any) => ({
          ...prevOptions,
          yAxis: [
            {
              title: {
                text: "",
                style: {
                  fontSize: "14px",
                },
              },
              labels: {
                value: 5,
                style: {
                  fontSize: "14px",
                },
                formatter: function (): string {
                  return Highcharts.numberFormat(this.value, 0, ".", ",");
                },
              },
              opposite: false,
            },
            {
              title: {
                text: "",
                style: {
                  fontSize: "14px",
                },
              },
              labels: {
                value: 5,
                style: {
                  fontSize: "14px",
                },
                formatter: function (): string {
                  return Highcharts.numberFormat(this.value, 0, ".", ",");
                },
              },
              opposite: true,
            },
          ],
          series: prevOptions.series.map((series: any, index: number) => ({
            name: series.name,
            yAxis: getPlotOption(series.name),
            data: series.data,
          })),
        }));
      }
    }
  }, [selectedPlotOptions]);

  useEffect(() => {
    if (
      error == "401" ||
      error == "UnAuthorized" ||
      catagoriesError == "401" ||
      catagoriesError == "UnAuthorized"
    ) {
      // toast.error("Please login to your account")
      router.push("/auth/login");
    } else {
      // toast.error(error)
    }
  }, [error, catagoriesError]);

  useEffect(() => {
    const token = getToken();
    // if(token == undefined){
    //   toast.success("UnAuthorization, please login or create an account")
    //   router.push("/auth/login");
    // }
  }, []);

  const handleLabelUpdate = (chartOptions: any) => {
    const newchartOptions = { ...chartOptions };
    newchartOptions.legend = {
      ...newchartOptions.legend,
      labelFormatter: function () {
        // Custom formatting for legend labels
        return `${this.name} - ${
          getPlotOption(this.name) === 0 ? `LHS` : `RHS`
        }`;
      },
    };
    return newchartOptions;
  };

  return (
    <div className="md:mt-2 lg:ml-5 lg:mr-2 flex flex-col gap-8 md:p-2 mb-12 mt-[30px]">
      <div className="lg:hidden">
        <Searchbar />
      </div>

      <div>
        <div className="flex my-1 bg-white rounded-md px-1 py-1 shadow-md -mt-4 md:-mt-0 flex-col items-center md:px-12 gap-x-3 md:flex-row">
          <div className="mb-2 items-center -ml-16 md:-ml-0 lg:w-4/12">
            {data.length > 0 && (
              <ChartTypeOptions
                setChartOptions={setChartOptions}
                chartOptions={chartOptions}
                data={data}
                scatterData={scatterDataList}
              />
            )}
          </div>

          {/*  */}
          <div className="text-sm md:text-base flex-1 flex-col items-center space-x-2 md:space-x-8">
            <input
              type="text"
              className="p-1 md:p-2 outline-none text-[#019cd2] placeholder-opacity-50 placeholder-[#019cd2] focus:border-[#019cd2] border w-[60%] rounded flex-1"
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Please set a short title for your chart."
            />
            <button
              onClick={handleTitleChange}
              className="rounded-md p-1 md:p-2 bg-[#019cd2] text-[#fff] hover:bg-[#019ad2d3] border border-[#019ad2]"
            >
              Save Change
            </button>
          </div>
        </div>

        {/* {!loading && data.length == 0 && !error && ( */}
        <div className="flex items-center justify-end mb-2 mt-2">
          <div className="relative w-fit cursor-pointer">
            <div
              className="w-10 h-4 bg-gray-200  rounded-full shadow-inner"
              onClick={toggleNavigator}
            ></div>
            <div
              className={`absolute w-6 h-6 rounded-full shadow inset-y-0 left-0 top-1/2 -translate-y-1/2  overflow-hidden ${
                navigatorEnabled
                  ? "bg-[#019ad2] translate-x-6"
                  : "bg-white translate-x-0"
              } transition-transform duration-300 ease-in-out`}
              onClick={toggleNavigator}
            ></div>
          </div>
          <div className="ml-3 mr-4 font-medium text-l mb-1">Navigator</div>
        </div>
        {/* )} */}

        {loading && data.length == 0 && !isBookmarked ? (
          <SkeletonTheme baseColor="#F1F6FB" highlightColor="gray">
            <Skeleton count={1} height={300} />
          </SkeletonTheme>
        ) : error ? (
          <h3
            className="text-textColorBlueGray
          text-2xl font-bold leading-10 tracking-tight"
          >
            Error fetching data
          </h3>
        ) : (
          <div className="justify-center flex-grow h-[400px] sm:h-[300px] md:h-[550px] shadow-md rounded-lg bg-white relative">
            {/* <BookmarkButton /> */}
            <ChartComponent chartOptions={handleLabelUpdate(chartOptions)} />
            <div className="mt-3">
              <SourceAttrubution
                link={sourceLink}
                label={sourceLabel}
                setLink={setSourceLink}
                setLabel={setSourceLabel}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeList;
