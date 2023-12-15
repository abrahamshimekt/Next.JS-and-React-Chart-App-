import { createAsyncThunk } from "@reduxjs/toolkit";
import { getToken, removeToken, setToken } from "../../../utils/authHelper";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "@/utils/consts";

export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = getToken();
      axios.defaults.headers.Authorization = `Bearer ${accessToken}`;
      const response = await axios.get("/user");
      Cookies.set('token', response?.data.access, {expires:1})
            
      return { ...response.data, accessToken };
    } catch (e) {
      removeToken();
      return rejectWithValue("");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/api/auth/jwt/create/`, { email, password });
    setToken(response.data.access);
    return response.data;
  }
);

export const signOut = createAsyncThunk("auth/signOut", async () => {
  removeToken();
});
