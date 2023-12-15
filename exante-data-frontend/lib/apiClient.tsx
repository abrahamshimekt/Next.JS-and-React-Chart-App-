// import axios from "axios";
import axios from "axios";
import { API_URL } from "@/utils/consts";
import {
  JsonParser,
  csvDataParser,
  convertExcelDataToTimeSeries,
  processExcelData,
} from "../utils/commonFunctions";

import { getToken, removeToken } from "@/utils/authHelper";

let currentDomain = "";

if (typeof window !== "undefined") {
  currentDomain = window.location.origin;
}

type Response = {
  mergedSeriesData: any[];
  mergedSeriesMapData: any[];
  mergedExtractedSeriesNames: any[];
  dataSourceMap: Map<string, string>;
};

export const fetchData = async () => {
  try {
    const dataPaths: string[] = [
      "./data/suez-canal-daily-transit.csv",
      "./data/bab-el-mandeb-strait-dai.csv",
      "./data/cape-of-good-hope-daily.csv",
      "./data/Daily_Money_Market_Fund_Flows.csv",
      "./data/Thailand_Inflow_High_Frequency_Proxy.csv",
      "./data/thailand-high-frequency-spot-intervention.csv",
      "./data/saturday_equity_sum.csv",
      "./data/india_inflation_combined.csv",
      "./data/fund-category-allocation-chart-for-czech-republic-in-em-local-gbi-em.csv",
    ];
    const name = [
      "Suez Canal: Daily Transit Calls",
      "Bab El-Mandeb Strait: Daily Transit Calls",
      "Cape of Good Hope: Daily Transit Calls",
      "US Daily Money Market Fund Flows",
      "Thailand Inflow High Frequency Proxy",
      "Thailand High Frequency Spot Intervention",
      "Weekly Sum from Thailand High Frequency Proxy",
      "India Inflation",
      "Financial Allocation Trends and Benchmarks (2016-2017)",
    ];

    const excelsDataUrl = [
      "./data/China_Foreigh_Domestic_Flow.xlsx",
      "./data/central-government-bonds-and-other-tradable-instruments-issued-on-domestic-market-in-czech-republic-chart-in-czech-republic-koruna.xlsx",
      "./data/composition-of-holdings-in-czech-republic-chart-in-czech-republic-koruna.xlsx",
      "./data/EPFR_Allocations_to_Brazil_of_GBI-EM_GD_funds.xlsx",
      "./data/brazil_data/AB_SICAV_I_Emerging_Market_Local_Currency_Debt_Portfolio.xlsx",
      "./data/brazil_data/Baillie_Gifford_Emerging_Markets_Bond_Fund.xlsx",
      "./data/brazil_data/BankInvest_Emerging_Markets_Obligationer_Lokalvaluta_KL.xlsx",
      "./data/brazil_data/BlackRock_Global_Funds_Emerging_Markets_Local_Currency_Bond_Fund.xlsx",
      "./data/brazil_data/Credit_Suisse_Index_Fund_(Lux)_Bond_Government_Emerging_Markets_Local.xlsx",
      "./data/brazil_data/CSIMF_Emerging_Markets_Bonds.xlsx",
      "./data/brazil_data/CT_Emerging_Market_Local_Fund.xlsx",
      "./data/brazil_data/JPMorgan_Funds_-_Emerging_Markets_Local_Currency_Debt_Fund.xlsx",
      "./data/brazil_data/MFS_Emerging_Markets_Debt_Local_Currency_Fund.xlsx",
      "./data/brazil_data/MFS_Meridian_Funds-EM_Debt_Local_Currency_Fund.xlsx",
      "./data/brazil_data/Morgan_Stanley_Emerging_Markets_Domestic_Debt_Fund.xlsx",
      "./data/brazil_data/Morgan_Stanley_Investment_Funds-Emerging_Markets_Domestic_Debt.xlsx",
      "./data/brazil_data/Ninety_One_Funds_Series_III-Emerging_Markets_Local_Currency_Debt_Fund.xlsx",
      "./data/brazil_data/Northern_Multi-Manager_Emerging_Markets_Debt_Opportunity_Fund.xlsx",
      "./data/brazil_data/PGIM_Emerging_Market_Debt_Local_Currency_Fund.xlsx",
      "./data/brazil_data/Pictet-Emerging_Local_Currency_Debt.xlsx",
      "./data/brazil_data/PIMCO_Emerging_Markets_Local_Currency_and_Bond_Fund.xlsx",
      "./data/brazil_data/PIMCO_GIS_Emerging_Local_Bond_Fund.xlsx",
      "./data/brazil_data/SSgA_Lux_SICAV_State_Street_Emerging_Markets_Local_Currency_Government_Bond_Index_Fund.xlsx",
      "./data/brazil_data/T_Rowe_Price_Emerging_Markets_Local_Currency_Bond_Fund.xlsx",
      "./data/brazil_data/T_Rowe_Price_SICAV_Emerging_Local_Markets_Bond_Fund.xlsx",
      "./data/brazil_data/TCW_Emerging_Markets_Local_Currency_Income_Fund.xlsx",
      "./data/brazil_data/WisdomTree_Emerging_Markets_Local_Debt_Fund.xlsx",
      "./data/TIC Wrangled.xlsx",

    ];
    const excelDataName = ["China"];

    const excelDataUrl: string = `${currentDomain}/api/em-equity-flows-epfr`;

    const dataSourceMap: Map<string, string> = new Map<string, string>();
    const mergedSeriesData: any[] = [];
    const mergedSeriesMapData: any[] = [];
    const mergedExtractedSeriesNames: any[] = [];

    const [seriesData, extractedSeriesNames, seriesMapData] = await JsonParser(
      `${currentDomain}/api/stat`
    );
    mergedSeriesData.push(...seriesData);
    mergedSeriesMapData.push(...seriesMapData);
    const seriesNames1: string[] = [...extractedSeriesNames] as string[];
    mergedExtractedSeriesNames.push(...seriesNames1);
    mapNamesToDataSource(
      dataSourceMap,
      seriesNames1,
      "Daily Financial Metrics"
    );

    for (let index = 0; index < dataPaths.length; index++) {
      const path = dataPaths[index];
      const [data, names, mapData] = await csvDataParser(path, "Date");
      mergedSeriesData.push(...data);
      mergedSeriesMapData.push(...mapData);
      mergedExtractedSeriesNames.push(...names);
      mapNamesToDataSource(dataSourceMap, names, name[index]);
    }

    const [excelSeriesData, excelSeriesNames, excelSeriesMapData] =
      await convertExcelDataToTimeSeries(excelDataUrl);
    mergedSeriesData.push(...excelSeriesData);
    mergedSeriesMapData.push(...excelSeriesMapData);
    mergedExtractedSeriesNames.push(...excelSeriesNames);
    mapNamesToDataSource(
      dataSourceMap,
      excelSeriesNames,
      "Investment Flow Dynamics"
    );
    for (let index = 0; index < excelsDataUrl.length; index++) {
      const path = excelsDataUrl[index];
      const [sortedData, seriesNames, seriesMapData] = await processExcelData(path);

      mergedSeriesData.push(...sortedData);
      mergedSeriesMapData.push(...seriesMapData);
      mergedExtractedSeriesNames.push(...seriesNames);
      mapNamesToDataSource(dataSourceMap, seriesNames, excelDataName[index]);
    }

    return {
      mergedSeriesData,
      mergedSeriesMapData,
      mergedExtractedSeriesNames,
      dataSourceMap,
    } as Response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const uploadParsedDataFunction = async (parsedData: any): Promise<any> => {
  const token = getToken()
  if(token == undefined){
    throw new Error("UnAuthorized")
  }
  try {
    const data = await axios.post(`${API_URL}/api/data-importer/upload-data/`, parsedData, 
    {
      headers: {
        "Authorization": `JWT ${token}`,
      },
    }
    );
    if(data.status == 401){
      removeToken()
      throw new Error("401")
    }
    return data.data;
  } catch (error: any) {
    throw new Error("Failed to upload file: " + error);
  }
};

export function mapNamesToDataSource(
  dataSourceMap: Map<string, string>,
  columnNames: string[],
  dataSource: string
) {
  columnNames.forEach((name: string) => dataSourceMap.set(name, dataSource));
}
