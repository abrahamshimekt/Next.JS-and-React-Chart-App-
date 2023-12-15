import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "@/utils/consts";
import { getToken, removeToken } from "@/utils/authHelper";

interface LoadCategoriesArgs {
  logoutCallback?: () => void;
}

export const loadCatagories = createAsyncThunk(
  "categories/loadCategory",
  async ({ logoutCallback }: LoadCategoriesArgs, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (token == undefined) {
        throw new Error("UnAuthorized");
      }
      const response = await axios.get(
        `${API_URL}/api/funds/fund-categories/`,
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );

      const data = response.data.results;
      const categotyData = data.map((item: any) => ({
        ...item,
        isUploaded: false,
      }));

    // add user uploaded data
    const userCategory = await axios.get(`${API_URL}/api/data-importer/custom-dimensions/`, {
      headers: {
        "Authorization": `JWT ${token}`,
      },
    });
    const user = userCategory.data.results;
    const userData = user.map((item:any) => ({ ...item, isUploaded: true }));

      const mergedList = categotyData.concat(userData);

      return mergedList;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logoutCallback?.();

        return rejectWithValue("Unauthorized - Logged Out");
      }
      return rejectWithValue("something went wrong");
    }
  }
);
