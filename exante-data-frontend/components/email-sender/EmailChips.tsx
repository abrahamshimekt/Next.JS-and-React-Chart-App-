import React from 'react'
import Image from 'next/image'

interface EmailChipProp {
    email: string,
    index : number,
    removeFromEmails : (index:number) => void
  }
  
  const EmailChips : React.FC<EmailChipProp> = ({email,index, removeFromEmails }) => {
    return (
     <div
    data-te-chip-init
    data-te-ripple-init
    className="[word-wrap: break-word] flex h-[32px] cursor-pointer items-center justify-between rounded-[16px] bg-[#eceff1] px-[12px] py-0 text-[13px] font-normal normal-case leading-loose text-[#4f4f4f] shadow-none transition-[opacity] duration-300 ease-linear hover:!shadow-none active:bg-[#cacfd1] dark:bg-neutral-600 dark:text-neutral-200">
      <Image alt='email avatar' src={"/emailAvator.png"} width={30} height={30} className='ml-[-11px] mr-1'/>
   
    <p className='font-semibold'>{email}</p>
    <span
    data-testid="remove-button" 
      data-te-chip-close
      onClick={(e) => removeFromEmails(index)}
      className="float-right w-4 cursor-pointer pl-[8px] text-[16px] text-[#afafaf] opacity-[.53] transition-all duration-200 ease-in-out hover:text-[#8b8b8b] dark:text-neutral-400 dark:hover:text-neutral-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-3 w-3">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12" />
      </svg>
    </span>
  </div>
    )
}


export default EmailChips;