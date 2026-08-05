import { Montserrat } from "next/font/google";
import localFont from "next/font/local";

const integralCF = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-integralCF",
  display: "swap",
});

const satoshi = localFont({
  src: [
    {
      path: "./Satoshi-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Satoshi-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Satoshi-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  fallback: ["sans-serif"],
  variable: "--font-satoshi",
});

const nasalization = localFont({
  src: [
    {
      path: "./nasalization-rg.otf",
      weight: "400",
      style: "normal",
    },
  ],
  fallback: ["sans-serif"],
  variable: "--font-nasalization",
});

export { integralCF, satoshi, nasalization };
