import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setSelectedChart } from "@/redux/slice/dataSlice";
import Select from "react-select";
import Highcharts from "highcharts";
import { calculateRegression } from "@/utils/regression";

// Define an interface for selectedPlotOptions
interface SelectedPlotOptions {
  [key: string]: string; // Define an index signature
}

const ChartTypeOptions = (props: any) => {
  const dispatch = useDispatch();

  const selectedPlotOptions: SelectedPlotOptions = useSelector(
    (state: RootState) => state.searchedData.selectedPlotOptions
  );

  const selectedChart = useSelector(
    (state: RootState) => state.searchedData.selectedChart
  );

  const options = [
    { value: "stacked", label: "Stacked" },
    { value: "sidebyside", label: "Side by Side" },
    { value: "linechart", label: "Line chart" },
    { value: "scatterchart", label: "Scatter chart" },
    { value: "combinations", label: "Column-and-Line Chart" },
  ];

  const getPlotOption = (option: string) => {
    if (selectedPlotOptions && selectedPlotOptions.hasOwnProperty(option)) {
      return (selectedPlotOptions[option] as string) === "L-axis" ? 0 : 1;
    }
    return 0;
  };

  const handleChange = (selectedOption: any) => {
    if (selectedOption.value === "sidebyside") {
      if (props.data?.length > 0) {
        const seriesData = props.data;
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
            dateTimeLabelFormats: {
              day: '%e %b' // Display 'dd MMM' format when zoomed into days
            }
          },
          series: seriesData.map((series: any, index: number) => ({
            name: series.name,
            type: "column",
            yAxis: getPlotOption(series.name),
            data: series.data,
          })),
          tooltip: {
            // to truncate the decimal point to 2 sf
            valueDecimals: 2,
          },
        }));
      }
    } else if (selectedOption.value === "stacked") {
      if (props.data?.length > 0) {
        const seriesData = props.data;

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
          series: seriesData.map((series: any, index: number) => ({
            name: series.name,
            type: "column",
            yAxis: 0,
            data: series.data,
          })),
          tooltip: {
            // to truncate the decimal point to 2 sf
            valueDecimals: 2,
          },
        }));
      }
    } else if (selectedOption.value === "linechart") {
      if (props.data?.length > 0) {
        const seriesData = props.data;
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
          series: seriesData.map((series: any, index: number) => ({
            name: series.name,
            type: "line",
            yAxis: getPlotOption(series.name),
            data: series.data,
          })),
          tooltip: {
            // to truncate the decimal point to 2 sf
            valueDecimals: 2,
          },
        }));
      }
    } else if (selectedOption.value === "scatterchart") {
      const { slope, intercept, rSquared } = calculateRegression(
        props.scatterData
      );
      const regData = props.scatterData.map(([x, _]: any) => [
        x,
        slope * x + intercept,
      ]);
      const midPointIndex = Math.floor(regData.length / 2);
      const midPoint = regData[midPointIndex];
      const [midX, midY] = midPoint;
      if (props.scatterData?.length > 0) {
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
          yAxis: [
            {
              title: {
                text: props.data[1].name,
                style: {
                  fontSize: "12px",
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
          xAxis: {
            type: null,
            title: {
              text: props.data[0].name,
              style: {
                fontSize: "12px",
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
              name: props.data[0].name + " vs " + props.data[1].name,
              data: props.scatterData,
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
            {
              type: "line",
              name: `Regression Line (Slope: ${slope.toFixed(
                2
              )}, R²: ${rSquared.toFixed(2)})`,
              data: regData,
              marker: {
                enabled: false,
              },
              enableMouseTracking: true,
              color: "#f28e2b",
            },
          ],
          tooltip: {
            // to truncate the decimal point to 2 sf
            valueDecimals: 2,
          },
          annotations: [
            {
              labels: [
                {
                  point: {
                    x: midX,
                    y: midY,
                    xAxis: 0,
                    yAxis: 0,
                  },
                  shadow: true,
                  text: `Slope: ${slope.toFixed(2)}, R²: ${rSquared.toFixed(
                    2
                  )}`,
                },
              ],
              labelOptions: {
                borderRadius: 5,
                backgroundColor: "rgba(252, 255, 197, 0.7)",
                borderWidth: 1,
                borderColor: "#AAA",
              },
            },
          ],
        }));
      }
    } else if (selectedOption.value === "combinations") {
      if (props.data?.length > 0) {
        const seriesData = props.data;
        props.setChartOptions((prevOptions: any) => ({
          ...prevOptions,
          plotOptions: {
            column: {
              stacking: null,
            },
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

          chart: {
            zoomType: "xy",
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
          series: seriesData.map((series: any, index: number) => ({
            name: series.name,
            yAxis: getPlotOption(series.name),
            type: index % 2 === 0 ? "column" : "spline",
            marker: {
              symbol: "diamond",
            },

            data: series.data,
          })),
          tooltip: {
            // to truncate the decimal point to 2 sf
            valueDecimals: 2,
          },
        }));
      }
    }

    dispatch(setSelectedChart(selectedOption.value));
  };

  return (
    <div className="w-full text-sm md:text-base flex items-center gap-4 z-20">
      <div className="font-medium">Chart Type</div>
      <div className="lg:w-3/5 relative">
        <Select
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
          options={options.filter(
            (option) =>
              option.value !== "scatterchart" || props.scatterData?.length > 0
          )}
          value={options.find((option) => option.value === selectedChart)}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default ChartTypeOptions;
