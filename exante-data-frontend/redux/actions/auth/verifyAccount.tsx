import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "@/utils/consts";


export const resendActivationAction = createAsyncThunk(
  "resendActivation/resendActivation",
  async (email: string) => {
    const time = Date.now()
    const response = await axios.post(`${API_URL}/api/auth/users/resend_activation/`, { email });
    if(response.status == 204){
      return {status: true, time};
    }
    else{
      throw new Error("failed to fetch user data")
    }
  }
);
