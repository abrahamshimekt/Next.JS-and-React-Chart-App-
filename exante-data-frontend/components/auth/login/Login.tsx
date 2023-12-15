"use client";

import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/actions/auth/loginActions";
import { AppDispatch, RootState } from "@/redux/store";
import Image from "next/image"
import Link from "next/link";
import { useRouter } from "next/navigation";
import {validPasswordCheck } from "@/utils/formValidators";
import toast from "react-hot-toast";
import { getToken } from "@/utils/authHelper";
import logo from "@/public/exante-blue-white-logo.png";
import { resetUI } from "@/redux/slice/auth/forgetPasswordSlice";

const Login: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<String>("")
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<String>("")
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const token:string = useSelector((state: RootState) => state.loginUser.token);

  const isLoading = useSelector((state: RootState) => state.loginUser.loading);
  const error = useSelector((state: RootState) => state.loginUser.error);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  useEffect(()=>{
    if (token) {
    toast.success("Signed in successfully");
    dispatch(resetUI());
    router.push("/");
    } 
  }, [token])

  useEffect(()=>{
    if(getToken()){
      router.push("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(()=>{
    if(error != ""){
      toast.error("Error, Please try again")
    }
  }, [error])

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
   const psdError = validPasswordCheck(password)
   const emailError = false
   if(email.length < 8 || emailError || psdError || password == email){
    if(email.length == 0){
      setEmailError("Email can not be empty")
    }
    else if(email.length < 8){
      setEmailError("Invalid email address")
     }
    else if(emailError){
      setEmailError("Invalid email address")
     } 
    if(psdError){
      setPasswordError(psdError)
     }
    else if(password == email){
      setPasswordError("password is too similar to email")
     }
   }
   else{
      setEmailError("")
      setPasswordError("")
      dispatch(login({ email, password }));
    }
  };


  const notVerified = ()=>{
    toast.loading("redirecting...", {duration: 1000,})
    router.push(`/auth/activateAccount?email=${email}`,);
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <Link
          href="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <div className=" bg-black p-5">
            <Image width={80} height={80} src={logo} alt="logo" />
          </div>
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="text"
                  name="username"
                  onChange={handleEmailChange}
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="username"
                  required
                />
                {emailError && <div className = "text-red-600 text-sm mb-1">{emailError}</div>}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                  <label
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
                    onClick={handleTogglePasswordVisibility}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    )}
                  </label>
                </div>
                {passwordError && <div className = "text-red-600 text-sm mb-1">{passwordError}</div>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <Link
                  href="/auth/forgetpassword"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                onClick={handleLogin}
                type="button"
                disabled={isLoading}
                className="w-full mt-2 py-2 text-white rounded-md hover:border-textColorBlack bg-primaryButtonColor font-semibold transition duration-300 w-full items-center text-lg"
              >
                {isLoading ? (
                  <svg
                    aria-hidden="true"
                    className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Sign up
              </Link>
            </p>
            {error && email && <p className="text-sm font-light dark:text-gray-500 text-white text-center bg-gray-500 dark:bg-white ">
              Didn’t verify your account?{" "}
              <button
                // href="/auth/signup"
                onClick = {notVerified}
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Verify my email
              </button>
            </p> }
            {/* {error && (
                <div className="text-sm mt-2"> didn't verify your account? click here</div>
              )} */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
