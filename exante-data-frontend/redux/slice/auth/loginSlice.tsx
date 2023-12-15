import { fetchUserData, login, signOut } from "@/redux/actions/auth/loginActions";
import { createSlice } from "@reduxjs/toolkit";

interface LoginState {
  token: any,
  userData: any,
  loading: boolean;
  error: string;
}
const initialState: LoginState = {
  token: null,
  userData:{},
  loading: false,
  error: "",
};
const authLoginSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetUI(state){
      state = {
        token: null,
        userData:{},
        loading: false,
        error: "",
      }
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(signOut.fulfilled,(state,action)=>{
      state.loading = false,
      state.userData = {},
      state.token = null
    })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = ""
      })
      .addCase(login.fulfilled, (state, action) => {
        const {refresh,access} = action.payload;
        state.token = access,
        state.error = "";
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "error occurred";
      })
      .addCase(fetchUserData.pending,(state)=>{
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled,(state,action)=>{
        const {accessToken,user} = action.payload;
        state.token = accessToken;
        state.userData = user;
        state.loading = false;
      })
      .addCase(fetchUserData.rejected,(state,action)=>{
        state.loading = false;
        state.userData = {};
        state.error = action.error.message?? "error ocurred";
      });
  },
});
export default authLoginSlice.reducer;
export const { resetUI } = authLoginSlice.actions;
