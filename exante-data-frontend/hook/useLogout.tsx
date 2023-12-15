"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { signOut } from "@/redux/actions/auth/loginActions";
import { AppDispatch } from "@/redux/store";

const useLogout = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const logOutUser = () => {
    dispatch(signOut());
    router.replace("/auth/login");
  };

  return logOutUser;
};

export default useLogout;
