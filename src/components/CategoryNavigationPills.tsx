import React from 'react';
import { MarketCategory } from '../types/market';

interface CategoryNavigationPillsProps {
  categories: MarketCategory[];
  activeCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
}

export const CategoryNavigationPills: React.FC<CategoryNavigationPillsProps> = ({
  categories,
  activeCategory,
  onSelectCategory
}) => {
  return (
    <nav aria-label="Market Categories" className="px-4">
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 text-[14px] font-medium text-[#131722] dark:text-white">
        {categories.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              type="button"
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-[#131722] dark:bg-white text-white dark:text-[#131722] font-semibold shadow-xs'
                  : 'bg-gray-100 dark:bg-[#1e222d] hover:bg-gray-200 dark:hover:bg-gray-700 text-[#131722] dark:text-gray-300 font-medium'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
