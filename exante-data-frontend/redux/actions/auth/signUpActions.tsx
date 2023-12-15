import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "@/utils/consts";

export const signup = createAsyncThunk(
  "auth/signup",
  async ({
    name,
    email,
    password,
    re_password,
  }: {
    name: string;
    email: string;
    password: string;
    re_password: string;
  }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/users/`,
        { email, name, password, re_password }
      );

      if (response.status === 201) {
        return response.data.id;
      } else {
        throw new Error("Failed to register");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const { response } = error;
        if (response) {
          const { data } = response;
          // if (data.email && data.email[0] === "user account with this email already exists.") {
          //   throw new Error("User account with this email already exists.");
          // } else if (data.email && data.email[0] === "This field may not be blank.") {
          //   throw new Error("Email field is required");
          // } else if (data.name && data.name[0] === "This field may not be blank.") {
          //   throw new Error("Name field is required");
          // } else if (data.password && data.password[0] === "This field may not be blank.") {
          //   throw new Error("Password field is required");
          // }
          //  else if (data.re_password && data.re_password[0] === "This field may not be blank.") {
          //   throw new Error("Confirm password field is required");
          // }
          // else 
          if(data.name){
            throw new Error(data.name[0])
          }
          else if(data.email){
            throw new Error(data.email[0])
          }
          else if(data.password){
            throw new Error(data.password[0])
          }
          else if(data.re_password){
            throw new Error(data.re_password[0])
          }
          else {
            throw new Error("Unknown error occurred");
          }
        } else {
          throw new Error("No response received from the server");
        }
      } else {
        throw new Error(error.message);
      }
    }
  }
);
