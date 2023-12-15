import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "@/utils/consts";

interface ResetPasswordData {
  uid: string;
  token: string;
  new_password: string;
  re_new_password: string;
}

export const resetPassword = createAsyncThunk<any, ResetPasswordData>(
  "auth/reset-password",
  async (resetData) => {

    const response = await axios.post(
      `${API_URL}/api/auth/users/reset_password_confirm/`,
      {
        uid: resetData.uid,
        token: resetData.token,
        new_password: resetData.new_password,
        re_new_password: resetData.re_new_password,
      }
    );

    if (response.status == 204) {
      return response.status
    }else {
      throw new Error("Server error")
    }
  }
);
