import React, { useState } from 'react';
import { ShoppingCart, Zap, Check, Eye, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { formatTaka, toBengaliNumber } from '../utils/bengaliUtils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onDirectOrder: (product: Product, quantity: number) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onDirectOrder,
  onViewDetails
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddedRecently, setIsAddedRecently] = useState<boolean>(false);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1500);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-stone-200/90 hover:border-emerald-700/50 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Product Image & Badges */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onViewDetails(product)}>
        <img
          src={product.image || '/assets/aistudio/855221105_1050044634737488_7794261989616121237_n_6bf75717.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/aistudio/855221105_1050044634737488_7794261989616121237_n_6bf75717.jpg';
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-stone-900 text-xs font-semibold shadow-md">
            <Eye className="w-3.5 h-3.5 text-emerald-800" />
            <span>বিস্তারিত দেখুন</span>
          </span>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="px-2.5 py-1 rounded-md bg-emerald-900/90 text-amber-300 font-bold text-xs shadow-sm backdrop-blur-xs">
            {product.category}
          </span>
          {product.isFeatured && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-emerald-950 font-bold text-[10px] shadow-sm">
              জনপ্রিয়
            </span>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {product.isAvailable ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-medium text-[11px] border border-emerald-300">
              মজুদ আছে
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 font-medium text-[11px] border border-red-300 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>স্টক শেষ</span>
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            onClick={() => onViewDetails(product)}
            className="font-bold text-stone-900 text-base sm:text-lg group-hover:text-emerald-800 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="mt-1.5 text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.description || 'HBC PANARPUL উচ্চমানের নির্মাণ সামগ্রী। সরাসরি ভাটা ও কারখানা থেকে সরবরাহকৃত।'}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100">
          {/* Price & Unit Display */}
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <div>
              <span className="text-xl sm:text-2xl font-black text-emerald-900">
                {formatTaka(product.price)}
              </span>
              <span className="text-xs font-semibold text-stone-600 ml-1.5">
                / {product.unit}
              </span>
            </div>
            {product.stock > 0 && (
              <span className="text-[11px] text-stone-400">
                মজুদ: {toBengaliNumber(product.stock)}
              </span>
            )}
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-stone-100 rounded-xl p-1">
              <span className="text-xs font-medium text-stone-600 pl-2">পরিমাণ ({product.unit}):</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-stone-200 text-stone-700 font-bold text-sm hover:bg-stone-50 flex items-center justify-center cursor-pointer active:scale-95"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-stone-800">
                  {toBengaliNumber(quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-white border border-stone-200 text-stone-700 font-bold text-sm hover:bg-stone-50 flex items-center justify-center cursor-pointer active:scale-95"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleAdd}
                disabled={!product.isAvailable}
                className={`py-2 px-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isAddedRecently
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isAddedRecently ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-amber-300" />
                    <span>যোগ হয়েছে</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5 text-emerald-800" />
                    <span>কার্টে যোগ</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onDirectOrder(product, quantity)}
                disabled={!product.isAvailable}
                className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>অর্ডার করুন</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
