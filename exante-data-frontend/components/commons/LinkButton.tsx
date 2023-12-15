import React from "react";
import Link from "next/link";
import SpinnerMini from "../commons/SpinnerMini";

interface LinkButtonProps {
  to?: string;
  text: string;
  color?: "primary" | "secondary" | "danger";
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  buttonType?: "button" | "submit" | "reset";
  extraClasses?: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  to,
  text,
  color = "primary",
  onClick,
  disabled = false,
  isLoading = false,
  buttonType,
  extraClasses,
}) => {
  const className = `block py-2 px-4 text-center font-medium rounded-lg shadow-lg hover:shadow-none text-sm md:text-base ${extraClasses}`;

  let brandColor;

  if (color === "primary")
    brandColor =
      "bg-brand-500 hover:bg-brand-600 active:bg-brand-700 duration-150  text-white";
  if (color === "secondary")
    brandColor =
      "px-10 py-3.5 text-gray-500 text-center border rounded-md duration-300 hover:text-brand-600 hover:shadow block sm:w-auto";
  if (color === "danger")
    brandColor =
      "px-10 py-3.5 w-full text-red-500 border-red-500 text-center border rounded-3xl duration-300 hover:text-red-600 hover:shadow block sm:w-auto";

  if (onClick)
    return (
      <button
        onClick={onClick}
        className={`${className} ${brandColor}`}
        disabled={disabled}
        type={buttonType}
      >
        {!isLoading || disabled ? `${text}` : <SpinnerMini />}
      </button>
    );

  return (
    <Link href={to!} passHref>
      <a className={`${className} ${brandColor}`}>{text}</a>
    </Link>
  );
};

export default LinkButton;
