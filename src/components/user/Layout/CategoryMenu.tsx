
'use client'

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface SubCategory {
  name: string;
  items: string[];
}

interface Category {
  name: string;
  subcategories: SubCategory[];
}

const CATEGORIES: Category[] = [
  {
    name: "Traditional Wear",
    subcategories: [
      {
        name: "Men's Wear",
        items: ["Daura Suruwal", "Dhaka Topi", "Nepali Topi", "Waistcoats"]
      },
      {
        name: "Women's Wear",
        items: ["Kurta Suruwal", "Gunyu Cholo", "Dhaka Prints", "Shawls"]
      }
    ]
  },
  {
    name: "Handicrafts",
    subcategories: [
      {
        name: "Metal Crafts",
        items: ["Singing Bowls", "Copper Items", "Bronze Statues", "Bells"]
      },
      {
        name: "Wooden Crafts",
        items: ["Masks", "Furniture", "Decorative Items", "Frames"]
      }
    ]
  },
  {
    name: "Food & Spices",
    subcategories: [
      {
        name: "Spices",
        items: ["Himalayan Salt", "Timur", "Cardamom", "Mixed Masala"]
      },
      {
        name: "Snacks",
        items: ["Dried Foods", "Trail Mix", "Traditional Snacks"]
      }
    ]
  },
  {
    name: "Tea & Coffee",
    subcategories: [
      {
        name: "Tea Varieties",
        items: ["Orthodox Tea", "CTC Tea", "Green Tea", "Herbal Tea"]
      },
      {
        name: "Coffee",
        items: ["Himalayan Beans", "Ground Coffee", "Instant Coffee"]
      }
    ]
  },
  {
    name: "Jewelry",
    subcategories: [
      {
        name: "Traditional",
        items: ["Tilhari", "Pote", "Silver Ornaments", "Gold Plated"]
      },
      {
        name: "Modern",
        items: ["Necklaces", "Earrings", "Bracelets", "Rings"]
      }
    ]
  }
];

export function CategoryMenu() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
      <div className="absolute left-0 top-full w-[250px] bg-white shadow-lg rounded-b-lg z-50 hidden group-hover:block">
        {CATEGORIES.map((category) => (
          <div
            key={category.name}
            className="relative"
            onMouseEnter={() => setActiveCategory(category.name)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <Link
              href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer"
            >
              <span>{category.name}</span>
              <ChevronRight size={16} />
            </Link>
            
            {activeCategory === category.name && (
              <div className="absolute left-full top-0 w-[500px] bg-white shadow-lg rounded-r-lg min-h-full">
                <div className="grid grid-cols-2 gap-6 p-6">
                  {category.subcategories.map((subcat) => (
                    <div key={subcat.name}>
                      <h3 className="font-semibold text-[#ff7f2a] mb-2">{subcat.name}</h3>
                      <ul className="space-y-2">
                        {subcat.items.map((item) => (
                          <li key={item}>
                            <Link
                              href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                              className="text-sm text-gray-600 hover:text-[#ff7f2a]"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
  );
}