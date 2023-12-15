import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./slice/dataSlice";
import emailReducer from "./slice/emailSlice";
import templateReducer from "./slice/templateSlice";
import fundFlowsReducer from "./slice/dataLoaderSlice";
import categoryReducer from './slice/catagorySlice';
import reserPasswordReducer from "./slice/auth/resetPassswordSlice";
import forgetPasswordReducer from './slice/auth/forgetPasswordSlice';
import loginReducer from "./slice/auth/loginSlice";
import signupReducer from "./slice/auth/signupSlice";
import verifyAccountReducer from './slice/auth/verifyAccount';
import recipientGroupsSlice from './slice/email-sender/emailRecipientSlice';

export const store = () => {
  return configureStore({
    reducer: {
      searchedData: dataReducer,
      email: emailReducer,
      template: templateReducer,
      fundData: fundFlowsReducer,
      category: categoryReducer,
      loginUser:loginReducer,
      signUpUser : signupReducer,
      forgetPassword: forgetPasswordReducer,

      resetPassword : reserPasswordReducer,
      verifyAccount: verifyAccountReducer,
      emailRecipient: recipientGroupsSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof store>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
