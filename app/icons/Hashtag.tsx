import type { FC } from "react";
import IconProps from "@/app/icons/types/IconProps";

const Hashtag: FC<IconProps> = ({ size = "1rem", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="0"
    stroke="currentColor"
    height={size}
    width={size}
    {...props}
  >
    <path d="M10.09 3.098L9.72 7h5.99l.39-4.089 1.99.187L17.72 7h3.78v2h-3.97l-.56 6h3.53v2h-3.72l-.38 4.089-1.99-.187.36-3.902H8.78l-.38 4.089-1.99-.187L6.77 17H2.5v-2h4.46l.56-6H3.5V7h4.21l.39-4.089 1.99.187zM14.96 15l.56-6H9.53l-.56 6h5.99z" />
  </svg>
);

export default Hashtag;
