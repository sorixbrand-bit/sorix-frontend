"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDispatch, useSelector } from "react-redux";
import { toggleCategory } from "@/lib/features/filters/filtersSlice";
import type { RootState } from "@/lib/store";

type Category = { _id?: string; name: string; slug: string; parent?: string | null | { _id: string; name: string } };

const CategoriesSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const selectedCategories = useSelector((state: RootState) => state.filters.categories);
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!api) { setLoading(false); return; }

    // Module-level cache — only fetch once per session
    if ((window as any).__categoryCache) {
      setCategories((window as any).__categoryCache);
      setLoading(false);
      return;
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${api}/category`);
        if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) {
          setCategories([]);
          return;
        }
        const data = await res.json();
        let cats: Category[] = [];
        if (Array.isArray(data)) cats = data;
        else if (Array.isArray(data.categories)) cats = data.categories;
        else if (Array.isArray(data.data)) cats = data.data;
        (window as any).__categoryCache = cats;
        setCategories(cats);
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [api]);

  const parents = categories.filter(c => !c.parent);

  return (
    <Accordion type="single" collapsible defaultValue="filter-category">
      <AccordionItem value="filter-category" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Category
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          {loading ? (
            <div className="space-y-2 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full" />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="flex flex-col space-y-3">
              {parents.map((parent) => {
                const children = categories.filter(c => {
                  const parentId = typeof c.parent === "object" && c.parent ? c.parent._id : c.parent;
                  return parentId === parent._id;
                });
                return (
                  <div key={parent.name} className="flex flex-col space-y-1">
                    <label className="flex items-center space-x-2 cursor-pointer py-1 font-semibold text-black">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(parent.name)}
                        onChange={() => dispatch(toggleCategory(parent.name))}
                        className="w-4 h-4 rounded border-black/30 cursor-pointer"
                      />
                      <span>{parent.name}</span>
                    </label>

                    {children.length > 0 && (
                      <div className="pl-5 flex flex-col space-y-1 border-l border-black/10 ml-2">
                        {children.map((sub) => (
                          <label key={sub.name} className="flex items-center space-x-2 cursor-pointer py-0.5">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(parent.name + ":" + sub.name)}
                              onChange={() => dispatch(toggleCategory(parent.name + ":" + sub.name))}
                              className="w-3.5 h-3.5 rounded border-black/30 cursor-pointer"
                            />
                            <span className="text-sm text-black/60">{sub.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-black/60">No categories found</div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CategoriesSection;
