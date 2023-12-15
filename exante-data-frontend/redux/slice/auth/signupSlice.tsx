import { signup } from "@/redux/actions/auth/signUpActions";
import { createSlice } from "@reduxjs/toolkit";

interface signUpState {
  id: number | null;
  loading: boolean;
  error: string;
}

const initialState: signUpState = {
  id: null,
  loading: false,
  error: "",
};

const authSignUpSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    updateRegisteredStatus(state, action) {
      state.id = action.payload;
    },
    resetUI(state){
      state = {
        id: null,
        loading: false,
        error: "",
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.id = action.payload;
        state.error = "";
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Error occurred while registering";
      });
  },
});

export default authSignUpSlice.reducer;
export const { updateRegisteredStatus, resetUI } = authSignUpSlice.actions;
