import { cn } from "@/lib/utils";
import { nasalization } from "@/styles/fonts";
import { PaymentBadge, SocialNetworks } from "./footer.types";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import LinksSection from "./LinksSection";
import LayoutSpacing from "./LayoutSpacing";

const socialsData: SocialNetworks[] = [
  {
    id: 3,
    icon: <FaInstagram />,
    url: "https://www.instagram.com/_sorix.clothing?igsh=ZWt4YjZxYmtheXVv",
  },
  {
    id: 4,
    icon: <FaWhatsapp />,
    url: "https://whatsapp.com/channel/0029Vadplzk7dmeXi7hAQt2p",
  },
];

const paymentBadgesData: PaymentBadge[] = [
  {
    id: 1,
    srcUrl: "/icons/Visa.svg",
  },
  {
    id: 2,
    srcUrl: "/icons/mastercard.svg",
  },
  {
    id: 3,
    srcUrl: "/icons/paypal.svg",
  },
  {
    id: 4,
    srcUrl: "/icons/applePay.svg",
  },
  {
    id: 5,
    srcUrl: "/icons/googlePay.svg",
  },
];

const Footer = () => {
  return (
    <footer className="mt-10 bg-[#111111] text-[#FFFFFF]">
      <div className="relative">
        <div className="absolute bottom-0 w-full h-1/2 bg-[#111111]"></div>
      </div>
      <div className="pt-8 md:pt-[50px] bg-[#111111] px-4 pb-4">
        <div className="max-w-frame mx-auto">
          <nav className="lg:grid lg:grid-cols-12 mb-8">
            <div className="flex flex-col lg:col-span-3 lg:max-w-[248px]">
              <h1
                className={cn([
                  nasalization.className,
                  "text-[28px] lg:text-[32px] mb-6 text-white font-bold",
                ])}
              >
                SORIX
              </h1>
              <p className="text-gray-600 text-sm mb-9">
                SORIX is a premium clothing brand focused on timeless design,
                superior quality, and everyday confidence. We create modern
                essentials that blend style, comfort, and simplicity
              </p>
              <div className="flex items-center">
                {socialsData.map((social) => (
                  <Link
                    href={social.url}
                    key={social.id}
                    className="bg-[#222222] text-white hover:bg-white hover:text-[#111111] transition-all mr-3 w-7 h-7 rounded-full border border-gray-800 flex items-center justify-center p-1.5"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden lg:grid col-span-9 lg:grid-cols-4 lg:pl-10">
              <LinksSection />
            </div>
            <div className="grid lg:hidden grid-cols-2 sm:grid-cols-4">
              <LinksSection />
            </div>
          </nav>

          <hr className="h-[1px] border-t-gray-800 mb-6" />
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mb-2">
          </div>
        </div>
        <LayoutSpacing />
      </div>
    </footer>
  );
};

export default Footer;
