"use client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "@/utils/consts";
import { getToken, removeToken } from "@/utils/authHelper";
import { CatagoryType } from "../slice/catagorySlice";


export interface FundFlowsDataType {
  name: string;
  data: [number[]];
}

interface FundFlowsArgs {
  category: CatagoryType;
  logoutCallback?: () => void;
}

export const fetchFundFlows = createAsyncThunk(
  "data/fetchFundFlows",
  async ({ category, logoutCallback }: FundFlowsArgs, { rejectWithValue }) => {
    try {
      const categoryId = category.id;
      const url = category.isUploaded
        ? `${API_URL}/api/data-importer/custom-datapoints/{categoryId}/`
        : `${API_URL}/api/funds/daily-fund-flow-series/?category_id=${categoryId}`;
      const token = getToken();
      if (token == undefined) {
        throw new Error("UnAuthorized");
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });

      if (category.isUploaded === true) {
        const result = {
          name: response.data.name,
          data: response.data.time_value_pairs.map((pair: any) => [
            pair.timestamp,
            pair.value,
          ]),
        };

        const seriesData: FundFlowsDataType = {
          name: result.name,
          data: result.data
            .map((item: any) => [
              new Date(item[0]).getTime(),
              item[1] !== "" ? parseFloat(item[1]) : null,
            ])
            .filter((point: any) => !isNaN(point[1])),
        };

        return seriesData;
      } else {
        const result = response.data.results[0];
        const seriesData: FundFlowsDataType = {
          name: result.name,
          data: result.data
            .map((item: any) => [
              new Date(item[0]).getTime(),
              item[1] !== "" ? parseFloat(item[1]) : null,
            ])
            .filter((point: any) => !isNaN(point[1])),
        };

        return seriesData;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logoutCallback?.();

        return rejectWithValue("Unauthorized - Logged Out");
      }
      return rejectWithValue("something went wrong");
    }
  }
);
