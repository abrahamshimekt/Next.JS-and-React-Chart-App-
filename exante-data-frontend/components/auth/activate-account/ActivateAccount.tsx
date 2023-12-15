"use client";
import React, { FC, useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { resendActivationAction } from "@/redux/actions/auth/verifyAccount";
import {resetUI, updateStatus} from '@/redux/slice/auth/verifyAccount'
import toast from "react-hot-toast";
import { isPossibleEmail } from "@/utils/formValidators";
import Countdown, { CountdownApi } from 'react-countdown';
import appLogo from '@/public/exante-blue-white-logo.png';
import { useSearchParams } from 'next/navigation'

const ActivateAccount: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {loading, status, error} = useSelector(
    (state: RootState) => state.verifyAccount
  );
  const [formError, setFormError] = useState<string>("")
  const [countdownApi, setCountDownApi] = useState<CountdownApi | null>()
  const [remainingTime, setRemainingTime] = useState<number>(300_00);
  const [isResend,setIsResend] = useState<boolean>(false);
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  useEffect(() => {
    if(status != null){
      localStorage.setItem(
        "accountActivationTime",
        JSON.stringify(status.time)
      );
      const newRemainingTime = status.time + 300_00;
      setRemainingTime(newRemainingTime);
      if(isResend){
        toast.success("Email Re-Sent Successfully")
      }
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const resendEmail = async() =>{
    if(email == null){
      toast.error("Email address not found")
      dispatch(resetUI())
    }
    else{
      setIsResend(true)
      dispatch(resendActivationAction(email))
    }
  }

  const setRef = (countdown: Countdown | null): void => {
    if (countdown) {
      setCountDownApi(countdown.getApi());
    }
  };

  useEffect(()=>{
    if(isResend && error){
      toast.error("Error resending, please try again later.")
    }
    else if(error){
      toast.error(error)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <div className = "bg-black p-4">
            <Image width ={80} height = {80} src={appLogo} alt="logo" />
          </div>
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className = "flex items-center justify-center flex-col">
            <div className = "w-1/2 ">
              {/* <Image src={emailSVG} alt={"Email sent successfully"}/> */}
            </div>
            <div className = "flex flex-col justify-center items-center pt-4 pb-10 w-2/3">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white w-fit text-center mb-4">
                Verify Your Email Address To Activate Your Account
              </h1>
              <div
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white w-fit text-center"
              >
                Verification email has been sent, please check your email address.
              </div>
              <div>
              {remainingTime > Date.now() ? (
                  <>
                  {/* <p>Resend in:</p> */}
                  <Countdown
                    ref={setRef}
                    date={remainingTime}
                    // onTick={(e) => { console.log(e) }}
                    renderer = {({ hours, minutes, seconds, completed }) => {
                      if (completed) {
                        // Render a completed state
                        return (
                          <button
                            onClick={resendEmail}
                            // disabled = {loading}
                            type="button"
                            // disabled={loading}
                            className="w-full rounded-lg p-2 bg-[#019cd2] text-[#fff] hover:bg-[#019ad2d3] border border-[#019ad2] "
                          >
                            {/* {loading ? <>Loading...</>: */}
                             <>Resend Email</>
                             {/* } */}
                          </button>
                        );
                      } else {
                        // Render a countdown
                        return (
                          <>
                            <div className="flex flex-col items-center justify-center bg-[#e1f3fa] p-2 rounded-lg">
                              <p className="text-base text-gray-500">Resend in:</p>
                              <span className="countdown text-2xl font-medium text-center flex justify-center items-center">
                                <span className="mr-1">{hours.toString().padStart(2, "0")}:</span>
                                <span className="mr-1">{minutes.toString().padStart(2, "0")}:</span>
                                <span className="">{seconds.toString().padStart(2, "0")}</span>
                              </span>
                            </div>
                          </>
                          );
                      }
                    }}
                  >
                  </Countdown>
                  </>
                ) :
                <button
                            onClick={resendEmail}
                            disabled = {loading}
                            type="button"
                            className="w-full rounded-lg p-2 bg-[#019cd2] text-[#fff] hover:bg-[#019ad2d3] border border-[#019ad2] "
                          >
                            {loading ? 
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
                          </svg>:
                             <>Resend Email</>
                            } 
                          </button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivateAccount;
