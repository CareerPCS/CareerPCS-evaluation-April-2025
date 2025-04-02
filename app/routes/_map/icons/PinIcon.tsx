import * as React from "react";
import type { SVGProps } from "react";
const PinIcon = ({
  strokeColor = "#000",
  ...props
}: SVGProps<SVGSVGElement> & { strokeColor?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 182 222"
    width="1em"
    height="1em"
    {...props}
  >
    {/* <title>{"Map Pin"}</title> */}
    <g
      fill="none"
      fillRule="nonzero"
      stroke={strokeColor}
      strokeWidth={20}
      transform="translate(11 11)"
    >
      <path
        fill="currentColor"
        d="M86.01 197.992a10 10 0 0 1-12.02 0C55.39 181.932 0 129.932 0 80.001 0 35.818 35.817 0 80 0s80 35.818 80 80.001c0 49.93-55.39 101.931-73.99 117.991Z"
      />
      <circle cx={80} cy={80.001} r={30} fill="#FFF" />
    </g>
  </svg>
);
export default PinIcon;
