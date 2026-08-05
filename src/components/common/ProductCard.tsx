import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product.types";

type ProductCardProps = {
  data: Product;
  // pass true for above-the-fold cards (first row) to eagerly load
  priority?: boolean;
};

const ProductCard = ({ data, priority = false }: ProductCardProps) => {
  return (
    <Link
      href={`/shop/product/${data.id}/${data.title.split(" ").join("-")}`}
      className="flex flex-col items-start aspect-auto"
    >
      <div className="relative bg-[#F0EEED] rounded-[13px] lg:rounded-[20px] w-full lg:max-w-[295px] aspect-square mb-2.5 xl:mb-4 overflow-hidden">
        <Image
          src={data.srcUrl}
          fill
          sizes="(max-width: 768px) 50vw, 295px"
          className="rounded-md object-contain hover:scale-110 transition-all duration-500"
          alt={data.title}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />
      </div>
      <strong className="text-black xl:text-xl">{data.title}</strong>
      <p className="text-neutral-500 text-sm xl:text-base">{data.category}</p>
      <div className="flex items-center space-x-[5px] xl:space-x-2.5">
        <span className="font-bold text-black text-xl xl:text-2xl">
          ₹{data.price}
        </span>
      </div>
    </Link>
  );
};

// Prevent re-renders when parent re-renders but product data hasn't changed
export default React.memo(ProductCard);
