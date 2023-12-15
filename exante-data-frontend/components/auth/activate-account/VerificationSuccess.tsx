"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'
import appLogo from '@/public/exante-blue-white-logo.png';
import axios from 'axios';
import { API_URL } from "@/utils/consts";


interface VerificationSuccessProps {
  id: string,
  token:string,
}

const VerificationSuccess: React.FC<VerificationSuccessProps> = ({id, token}) => {
  const router = useRouter();
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if(success){
      const timerId: any = setInterval(() => {
        if (secondsRemaining > 0) {
          setSecondsRemaining(secondsRemaining - 1);
        } else {
          router.push('/auth/login');
        }
      }, 1000);
  
      return () => clearInterval(timerId);
    }
  }, [secondsRemaining, success]);
  
  useEffect(() => {
    axios.post(`${API_URL}/api/auth/users/activation/`, {
      uid: id,
      token: token,
    })
      .then(response => {
        if (response.status === 204) {
          setSuccess(true)
        }
        else{
          setError(`Error: ${response.status}`);
        }
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
          {(loading && !success) && <div className='p-4 text-center'><svg
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
                  </svg>Loading...</div>}
          {success && <div className = "flex items-center justify-center flex-col">
            <div className = "w-1/2 ">
              {/* <Image src={emailSVG} alt={"Email sent successfully"}/> */}
            </div>
            <div className = "flex flex-col justify-center items-center pt-4 pb-10 w-2/3">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white w-fit text-center mb-4">
                Verification successful!
              </h1>
              <div
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white w-fit text-center"
              >
                
                {secondsRemaining == 0 ? 
                  <>
                  <div><p>redirecting...</p></div>
                    {/* <Link
                  href="/auth/login"
                  // className="w-full rounded-lg mt-2 p-1 bg-[#019cd2] text-[#fff] hover:bg-[#019ad2d3] border border-[#019ad2] "
                >
                  Login
                </Link> */}
                  </>:
                <><p className="text-center">You will be redirected to the login page in</p>
                <div className="flex flex-col items-center justify-center bg-[#e1f3fa] p-2 rounded-lg">
                  <span className="countdown text-2xl font-medium text-center flex justify-center items-center">
                    <span className="mr-1">00:</span>
                    <span className="mr-1">00:</span>
                    <span className="">{secondsRemaining.toString().padStart(2, "0")}</span>
                  </span>
                </div></>
                }
              </div>
            </div>
          </div>}
          {(!success && error) && <div className='text-red-700 p-4 text-center'>Error, please try again</div>}
        </div>
      </div>
    </section>
  );
};

export default VerificationSuccess;
