'use client'
import Image from "next/image";
import Link from "next/link";
import logo from "../public/exante-blue-white-logo.png";
import { useRouter } from "next/navigation";
import { signOut } from "@/redux/actions/auth/loginActions";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";

export const LogoComponent = () => {
  const router = useRouter()
  const dispatch: AppDispatch = useDispatch();
  
  const logOutUser = ()=>{
    dispatch(signOut());
    router.replace("/auth/login")

  }
  
  return (
    //
    <div className="flex items-center justify-between py-1 px-4   bg-primarySidebar">
      <Link href="/">
        <Image
          width={96}
          height={32}
          className="w-24 h-8 object-contain"
          src={logo}
          alt="imf-chart"
        />
      </Link>
      <button
        onClick={logOutUser}
        type="button"
        className="rounded-lg p-1 bg-[#019cd2] text-[#fff] hover:bg-[#019ad2d3] border border-[#019ad2]"
      >
        Logout
      </button>
    </div>
  );
};
