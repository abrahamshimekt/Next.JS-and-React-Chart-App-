import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setSelectedChart } from "@/redux/slice/dataSlice";

const ChartsViewRadio = (props: any) => {
    const dispatch = useDispatch();

    const selectedChart = useSelector(
        (state: RootState) => state.searchedData.selectedChart
    );

    function handleClick(selected: string) {
        if (selected === "sidebyside") {
            props.setChartOptions((prevOptions: any) => ({
                ...prevOptions,
                chart: {
                    type: "column",
                },
                plotOptions: {
                    column: {
                        stacking: null,
                    },
                },
            }));
        }
        else if (selected === 'stacked') {
            props.setChartOptions((prevOptions: any) => ({
                ...prevOptions,
                chart: {
                    type: "column",
                },
                plotOptions: {
                    column: {
                        stacking: "normal",
                    },
                },
            }));
        }
        else if (selected === 'linechart') {
            props.setChartOptions((prevOptions: any) => ({
                ...prevOptions,
                chart: {
                    type: "line",
                },
                plotOptions: {
                    column: {
                        stacking: null,
                    },
                },
            }));
        }
        else if (selected === 'scatterchart') {
            props.setChartOptions((prevOptions: any) => ({
                ...prevOptions,
                chart: {
                    type: "scatter",
                },
                plotOptions: {
                    column: {
                        stacking: null,
                    },
                },
            }));
        }
        dispatch(setSelectedChart(selected));
    }

    return (
        <form className="flex items-center gap-2 w-full">
            <div className="font-medium text-l">Chart Type</div>
            <div className="flex">
                <label htmlFor="stacked" className="cursor-pointer">
                    <input
                        type="radio"
                        name="chart_type"
                        value="stacked"
                        id="stacked"
                        className="hidden"
                        checked={selectedChart === "stacked"}
                        onChange={() => handleClick("stacked")}
                    />
                    <div
                        className={`text-l px-2 py-1 border border-gray-400 rounded-l-md border-r-0 ${selectedChart === "stacked"
                            ? "bg-primaryButtonColor border-blue-500 text-white"
                            : "bg-slate-100"
                            }`}
                    >
                        Stacked
                    </div>
                </label>

                <label htmlFor="sidebyside" className="cursor-pointer">
                    <input
                        type="radio"
                        name="chart_type"
                        value="sidebyside"
                        id="sidebyside"
                        className="hidden"
                        checked={selectedChart === "sidebyside"}
                        onChange={() => handleClick("sidebyside")}
                    />
                    <div
                        className={`text-l px-2 py-1 border border-gray-400 rounded-r-md border-l-0 ${selectedChart === "sidebyside"
                            ? "bg-primaryButtonColor border-blue-500 text-white"
                            : "bg-slate-100"
                            }`}
                    >
                        Side by Side
                    </div>
                </label>

                <label htmlFor="linechart" className="cursor-pointer">
                    <input
                        type="radio"
                        name="chart_type"
                        value="linechart"
                        id="linechart"
                        className="hidden"
                        checked={selectedChart === "linechart"}
                        onChange={() => handleClick("linechart")}
                    />
                    <div
                        className={`text-l px-2 py-1 border border-gray-400 rounded-r-md border-l-0 ${selectedChart === "linechart"
                            ? "bg-primaryButtonColor border-blue-500 text-white"
                            : "bg-slate-100"
                            }`}
                    >
                        Line
                    </div>
                </label>

                <label htmlFor="scatterchart" className="cursor-pointer">
                    <input
                        type="radio"
                        name="chart_type"
                        value="scatterchart"
                        id="scatterchart"
                        className="hidden"
                        checked={selectedChart === "scatterchart"}
                        onChange={() => handleClick("scatterchart")}
                    />
                    <div
                        className={`text-l px-2 py-1 border border-gray-400 rounded-r-md border-l-0 ${selectedChart === "scatterchart"
                            ? "bg-primaryButtonColor border-blue-500 text-white"
                            : "bg-slate-100"
                            }`}
                    >
                        Scatter
                    </div>
                </label>

            </div>
        </form>
    );
};

export default ChartsViewRadio;
