import React from 'react';
import { Category } from '../types';
import { Layers, Blocks, Hammer, Package, Columns, Sparkles } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (catName: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'ইট':
        return <Blocks className="w-4 h-4" />;
      case 'রড':
        return <Hammer className="w-4 h-4" />;
      case 'সিমেন্ট':
        return <Package className="w-4 h-4" />;
      case 'বালু':
        return <Layers className="w-4 h-4" />;
      case 'পায়া':
        return <Columns className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none py-1">
      <button
        onClick={() => onSelectCategory('all')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
          selectedCategory === 'all'
            ? 'bg-emerald-900 text-amber-300 shadow-md shadow-emerald-950/20 ring-2 ring-emerald-800'
            : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
        }`}
      >
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>সব পণ্য</span>
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.name;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              isSelected
                ? 'bg-emerald-900 text-amber-300 shadow-md shadow-emerald-950/20 ring-2 ring-emerald-800'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
            }`}
          >
            {getCategoryIcon(cat.name)}
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};
