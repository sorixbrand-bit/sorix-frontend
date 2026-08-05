"use client";

import { cn } from "@/lib/utils";
import { nasalization } from "@/styles/fonts";
import Link from "next/link";
import React, { Suspense, useState } from "react";
import Image from "next/image";
import CartBtn from "./CartBtn";
import SearchInput from "../SearchInput";

const TopNavbar = () => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 bg-[#111111] border-b border-[#222222] z-20">
      <div className="flex relative max-w-frame mx-auto items-center justify-between md:justify-start py-3 md:py-4 px-4 xl:px-0">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-4 mr-3 lg:mr-10"
          >
            <Image
              src="/images/logo.png"
              alt="Sorix Logo"
              width={20}
              height={20}
              className="rounded-full"
              priority
            />
            <span
              className={cn([
                nasalization.className,
                "text-2xl text-white tracking-wide uppercase font-bold",
              ])}
            >
              SORIX
            </span>
          </Link>
        </div>

        {/* Desktop Search Bar (Hidden on Mobile) */}
        <div className="hidden md:block flex-1">
          <Suspense fallback={<div className="w-full md:mr-3 lg:mr-10 h-10 bg-[#F0F0F0] rounded-full animate-pulse" />}>
            <SearchInput />
          </Suspense>
        </div>

        {/* Mobile controls & Cart */}
        <div className="flex items-center gap-4">
          {/* Mobile Search Toggle Icon */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden text-white p-1 hover:opacity-80 transition-opacity"
            aria-label="Toggle search"
          >
            <Image
              src="/icons/search.svg"
              height={20}
              width={20}
              alt="search"
              className="filter brightness-0 invert min-w-5 min-h-5"
            />
          </button>

          <Suspense fallback={<div className="w-6 h-6 mr-[14px]" />}>
            <CartBtn />
          </Suspense>
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {mobileSearchOpen && (
        <div className="md:hidden bg-[#111111] border-t border-[#222222] px-4 py-3 animate-in slide-in-from-top duration-200">
          <Suspense fallback={<div className="w-full h-10 bg-[#222222] rounded-full animate-pulse" />}>
            <SearchInput autoFocus />
          </Suspense>
        </div>
      )}
    </nav>
  );
};

export default TopNavbar;
