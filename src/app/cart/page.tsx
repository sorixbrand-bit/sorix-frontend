"use client";

import BreadcrumbCart from "@/components/cart-page/BreadcrumbCart";
import ProductCard from "@/components/cart-page/ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { FaArrowRight } from "react-icons/fa6";
import { TbBasketExclamation } from "react-icons/tb";
import React, { useState, useEffect } from "react";
import { RootState } from "@/lib/store";
import { useAppSelector } from "@/lib/hooks/redux";
import Link from "next/link";

// WhatsApp configuration
const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE; // Make sure to set this in .env.local
const WHATSAPP_MESSAGE = "Hi! I'd like to place an order through WhatsApp.";

interface AddressDetails {
  fullName: string;
  phone: string;
  shippingAddress: string;
  city: string;
  pincode: string;
}

export default function CartPage() {
  const { cart, totalPrice, adjustedTotalPrice } = useAppSelector(
    (state: RootState) => state.carts
  );

  const [address, setAddress] = useState<AddressDetails>({
    fullName: "",
    phone: "",
    shippingAddress: "",
    city: "",
    pincode: "",
  });

  const [tempAddress, setTempAddress] = useState<AddressDetails>({
    fullName: "",
    phone: "",
    shippingAddress: "",
    city: "",
    pincode: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load address from localStorage after component mounts (client-side only)
  useEffect(() => {
    const savedAddress = localStorage.getItem("sorix_delivery_address");
    if (savedAddress) {
      try {
        const parsed = JSON.parse(savedAddress);
        setAddress(parsed);
        setTempAddress(parsed);
      } catch (e) {
        console.error("Error parsing saved address", e);
      }
    }
  }, []);

  const openAddressModal = () => {
    setTempAddress(address);
    setIsModalOpen(true);
  };

  const handleConfirmAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempAddress.fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }
    if (!tempAddress.phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }
    if (!tempAddress.shippingAddress.trim()) {
      alert("Please enter your shipping address.");
      return;
    }
    if (!tempAddress.city.trim()) {
      alert("Please enter your city.");
      return;
    }
    if (!tempAddress.pincode.trim()) {
      alert("Please enter your pincode.");
      return;
    }

    setAddress(tempAddress);
    localStorage.setItem("sorix_delivery_address", JSON.stringify(tempAddress));
    setIsModalOpen(false);
  };

  const handleCheckout = () => {
    try {
      // Check if cart has items
      if (!cart || !cart.items || cart.items.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      // Check if address is filled
      if (
        !address.fullName.trim() ||
        !address.phone.trim() ||
        !address.shippingAddress.trim() ||
        !address.city.trim() ||
        !address.pincode.trim()
      ) {
        // Automatically open modal if address is not set
        openAddressModal();
        return;
      }

      // Build message with all order details
      let messageText = `${WHATSAPP_MESSAGE}\n\n`;
      
      // Add order items details
      messageText += `📦 *Order Details:*\n`;
      messageText += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      
      cart.items.forEach((item, index) => {
        messageText += `\n${index + 1}. *${item.name}*\n`;
        messageText += `   • Quantity: ${item.quantity}\n`;
        messageText += `   • Color: ${item.attributes[0] || "N/A"}\n`;
        messageText += `   • Size: ${item.attributes[1] || "N/A"}\n`;
        messageText += `   • Price: ₹${Math.round(item.price * item.quantity)}\n`;
      });
      
      messageText += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
      messageText += `💰 *Order Total:* ₹${Math.round(adjustedTotalPrice)}\n`;
      messageText += `📊 *Total Items:* ${cart.items.length}\n\n`;

      // Add delivery details
      messageText += `📍 *Delivery Address:*\n`;
      messageText += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      messageText += `• *Name:* ${address.fullName}\n`;
      messageText += `• *Phone:* ${address.phone}\n`;
      messageText += `• *Address:* ${address.shippingAddress}\n`;
      messageText += `• *City:* ${address.city}\n`;
      messageText += `• *Pincode:* ${address.pincode}\n`;
      
      const message = encodeURIComponent(messageText);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${message}`;
      
      // Redirect
      window.location.href = whatsappUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Error processing checkout. Please try again.");
    }
  };

  const isAddressFilled =
    address.fullName.trim() &&
    address.phone.trim() &&
    address.shippingAddress.trim() &&
    address.city.trim() &&
    address.pincode.trim();

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        {cart && cart.items.length > 0 ? (
          <>
            <BreadcrumbCart />
            <h2
              className={cn([
                integralCF.className,
                "font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6",
              ])}
            >
              your cart
            </h2>
            <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5 items-start">
              {/* Left Column: Cart Items */}
              <div className="w-full p-3.5 md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black/10 bg-white">
                {cart?.items.map((product, idx, arr) => (
                  <React.Fragment key={idx}>
                    <ProductCard data={product} />
                    {arr.length - 1 !== idx && (
                      <hr className="border-t-black/10" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Right Column: Order Summary & Address Block */}
              <div className="w-full lg:max-w-[505px] flex flex-col space-y-4">
                {/* Order Summary Block */}
                <div className="p-5 md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black/10 bg-white">
                  <h6 className="text-xl md:text-2xl font-bold text-black">
                    Order Summary
                  </h6>
                  <div className="flex flex-col space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="md:text-xl text-neutral-500" style={{ color: '#666666' }}>Subtotal</span>
                      <span className="md:text-xl font-bold">₹{totalPrice}</span>
                    </div>
                    <hr className="border-t-black/10" />
                    <div className="flex items-center justify-between">
                      <span className="md:text-xl text-black">Total</span>
                      <span className="text-xl md:text-2xl font-bold">
                        ₹{Math.round(adjustedTotalPrice)}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleCheckout}
                    className="text-sm md:text-base font-medium bg-[#4A3525] text-white hover:opacity-90 transition-opacity rounded-full w-full py-4 h-[54px] md:h-[60px] group flex items-center justify-center gap-2"
                  >
                    Order on WhatsApp{" "}
                    <FaArrowRight className="text-xl group-hover:translate-x-1 transition-all" />
                  </Button>
                  <div className="text-center text-[10px] tracking-widest text-neutral-400 font-semibold uppercase mt-2">
                    Secure WhatsApp Checkout
                  </div>
                </div>

                {/* Delivery Address Block */}
                <div className="p-5 flex items-center justify-between rounded-[20px] border border-black/10 bg-white">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#4A3525] text-white flex items-center justify-center font-bold mr-4 shrink-0">
                      2
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#4A3525]">Delivery Address</span>
                      <span className="text-neutral-500 text-xs md:text-sm mt-0.5 line-clamp-1">
                        {isAddressFilled
                          ? `${address.fullName}, ${address.shippingAddress}`
                          : "No delivery details added yet."}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={openAddressModal}
                    className="px-5 py-2 bg-[#FAF5EE] text-[#4A3525] hover:bg-[#FAF0E4] font-medium rounded-full text-sm transition-all whitespace-nowrap cursor-pointer border border-[#EBE5D9]"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center flex-col text-black/40 mt-32">
            <TbBasketExclamation strokeWidth={1} className="text-6xl" />
            <span className="block mb-4">Your shopping cart is empty.</span>
            <Button className="rounded-full w-24" asChild>
              <Link href="/shop">Shop</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Delivery Address Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 md:p-8 max-w-[550px] w-full relative shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-black transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h2 className="text-2xl md:text-3xl font-bold text-[#4A3525] mb-6">
              Delivery Address
            </h2>

            <form onSubmit={handleConfirmAddress} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={tempAddress.fullName}
                    onChange={(e) =>
                      setTempAddress({ ...tempAddress, fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#FAF5EE] border-0 rounded-2xl text-[#4A3525] placeholder:text-neutral-300 outline-none focus:ring-2 focus:ring-[#4A3525] transition-all text-sm"
                  />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 00000 00000"
                    value={tempAddress.phone}
                    onChange={(e) =>
                      setTempAddress({ ...tempAddress, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#FAF5EE] border-0 rounded-2xl text-[#4A3525] placeholder:text-neutral-300 outline-none focus:ring-2 focus:ring-[#4A3525] transition-all text-sm"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Shipping Address
                </label>
                <textarea
                  required
                  placeholder="House No, Street, Locality"
                  value={tempAddress.shippingAddress}
                  onChange={(e) =>
                    setTempAddress({ ...tempAddress, shippingAddress: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#FAF5EE] border-0 rounded-2xl text-[#4A3525] placeholder:text-neutral-300 outline-none focus:ring-2 focus:ring-[#4A3525] transition-all text-sm min-h-[100px] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* City */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Kochi"
                    value={tempAddress.city}
                    onChange={(e) =>
                      setTempAddress({ ...tempAddress, city: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#FAF5EE] border-0 rounded-2xl text-[#4A3525] placeholder:text-neutral-300 outline-none focus:ring-2 focus:ring-[#4A3525] transition-all text-sm"
                  />
                </div>

                {/* Pincode */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="682001"
                    value={tempAddress.pincode}
                    onChange={(e) =>
                      setTempAddress({ ...tempAddress, pincode: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#FAF5EE] border-0 rounded-2xl text-[#4A3525] placeholder:text-neutral-300 outline-none focus:ring-2 focus:ring-[#4A3525] transition-all text-sm"
                  />
                </div>
              </div>

              {/* Confirm Button */}
              <button
                type="submit"
                className="w-full py-4 bg-[#4A3525] text-white rounded-2xl font-bold hover:opacity-90 transition-opacity mt-6 cursor-pointer text-center block"
              >
                Confirm Address
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
