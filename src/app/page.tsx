import ProductListSec from "@/components/common/ProductListSec";
import HeroBanner from "@/components/homepage/Header";
import { Product } from "@/types/product.types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";

export const revalidate = 60;

const api = process.env.NEXT_PUBLIC_API_URL;

type Category = {
  _id: string;
  name: string;
  image?: string;
  parent?: any;
};

async function getCategories(): Promise<Category[]> {
  if (!api) return [];
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(`${api}/category`, {
      next: { revalidate: 60 },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return [];
    const data = await res.json();
    const cats = data.categories || data || [];
    return cats.filter((c: any) => !c.parent && c.isActive !== false);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function getProducts(): Promise<Product[]> {
  if (!api) return [];
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(`${api}/product`, {
      next: { revalidate: 60 },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return [];
    const data = await res.json();
    if (!data.products) return [];

    return data.products.map((p: any) => {
      const defaultVariant =
        p.variants?.find((v: any) => v.isDefault) || p.variants?.[0];
      return {
        id: p._id,
        title: p.name,
        category: p.category?.name || "General",
        srcUrl: defaultVariant?.images?.[0] || "/images/pic1.png",
        gallery: defaultVariant?.images || [],
        price: defaultVariant?.price || 0,
        discount: { amount: 0, percentage: 0 },
        rating: 4,
      };
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Server component — no "use client", no useEffect, no client-side waterfall
export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  return (
    <>
      <HeroBanner />
      <main className="my-[50px] sm:my-[72px]">
        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="max-w-frame mx-auto mb-16 px-4 xl:px-0">
            <h2 className={cn([integralCF.className, "text-[32px] md:text-5xl text-center mb-8 md:mb-14 capitalize"])}>
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/shop?categories=${encodeURIComponent(cat.name)}`}
                  className="group relative h-[180px] sm:h-[220px] md:h-[280px] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-[#FFFFFF] border border-black/5 flex flex-col justify-end"
                >
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#E5E5E5] flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Category Name */}
                  <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 text-left z-10">
                    <h3 className="font-bold text-sm sm:text-lg md:text-2xl text-white tracking-wide uppercase">
                      {cat.name}
                    </h3>
                    <span className="text-white/80 text-xs md:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 block mt-1">
                      Shop Now &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="max-w-frame mx-auto px-4 xl:px-0">
              <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
            </div>
          </section>
        )}

        <ProductListSec
          title="Explore for More"
          data={products}
          viewAllLink="/shop#new-arrivals"
        />
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
        </div>
      </main>
    </>
  );
}
