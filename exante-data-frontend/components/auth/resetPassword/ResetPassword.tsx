"use client";
import { resetPassword } from "@/redux/actions/auth/resetPassword";
import { AppDispatch } from "@/redux/store";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import logo from "@/public/exante-blue-white-logo.png";
import {useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ResetPasswordParams {
  id:string,
  token : string
}

const ResetPassword:React.FC<ResetPasswordParams> = ({id, token}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [psdError, setPsdError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { loading, resetSuccessfull, error} = useSelector((state: any) => state.resetPassword);
  const router = useRouter();
      

  useEffect(() => {
    if (resetSuccessfull) {
      toast.success('password reseted successfully')
      router.push("/auth/login");
    }
    else if (error) {
      toast.error(error)
    }
  }, [resetSuccessfull,router, error]);

  

  const dispatch: AppDispatch = useDispatch();

  const handleResetPassword = () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    if (password.length == 0){
      setPsdError("pasword is required")
      if(confirmPassword.length == 0){
        setMessage("confirm Password is required");
      }
      return
    }
    if(password.length < 8){
      setPsdError("password must be more than 8 characters")
      return
    }
    setMessage("");
    setPsdError("");
    dispatch(
      resetPassword({
        uid: id,
        token: token,
        new_password: password,
        re_new_password: confirmPassword,
      })
    );
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className=" bg-black p-5 flex items-center justify-center">
        <Image width={80} height={80} src={logo} alt="logo" />
      </div>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Reset password
          </h1>
          <form className="space-y-4 md:space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  value={password}
                  name="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-transparent border-none cursor-pointer"
                >
                  {!showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {psdError && <div className = "text-red-600 text-sm mb-1">{psdError}</div>}
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  value={confirmPassword}
                  name="confirm-password"
                  id="confirm-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="confirm password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-transparent border-none cursor-pointer"
                >
                  {!showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {message && <div className = "text-red-600 text-sm mb-1">{message}</div>}

              {/* {message && <p className="text-red-600">{message}</p>} */}
            </div>

            <button
              onClick={handleResetPassword}
              type="button"
              className="w-full  rounded-lg p-2 bg-[#019cd2] text-[#fff] hover:bg-[#019ad2d3] border border-[#019ad2]  "
            >
              {loading ? "Reseting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
