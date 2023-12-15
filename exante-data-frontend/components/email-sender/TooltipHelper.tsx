import { Tooltip, Typography } from "@material-tailwind/react";

export function TooltipHelper() {
    return (
        <Tooltip
            placement="bottom"
            className="border-blue-gray-50 bg-black px-1 py-1 shadow-sm"
            content={
                <div className="w-40">
                    <Typography
                        variant="small"
                        color="white"
                        className="font-normal opacity-80 top-0 right-0 z-10"
                        placeholder={""}
                    >
                        Start adding some by clicking the{" "}
                        <span className="font-bold text-white">Star</span> in the Above.
                    </Typography>
                </div>
            }
        >
            <svg 
            data-testid="tooltip-icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className="h-5 w-5 cursor-pointer text-white"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
            </svg>
        </Tooltip>
    );
}