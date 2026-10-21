import React, { useState } from 'react';
import { X, Check, ShoppingCart, Zap, ShieldCheck, Truck, Phone } from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { formatTaka, toBengaliNumber } from '../utils/bengaliUtils';

interface ProductDetailsModalProps {
  product: Product | null;
  settings: StoreSettings;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onDirectOrder: (product: Product, quantity: number) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  settings,
  onClose,
  onAddToCart,
  onDirectOrder
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddedRecently, setIsAddedRecently] = useState<boolean>(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1500);
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-4/3 md:aspect-auto bg-stone-950 flex items-center justify-center overflow-hidden">
            <img
              src={product.image || '/assets/aistudio/855221105_1050044634737488_7794261989616121237_n_6bf75717.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/aistudio/855221105_1050044634737488_7794261989616121237_n_6bf75717.jpg';
              }}
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-lg bg-emerald-900/90 text-amber-300 font-bold text-xs shadow-md">
                {product.category}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {product.isAvailable ? 'স্টকে বিদ্যমান' : 'স্টক সমাপ্ত'}
                </span>
                {product.isFeatured && (
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    প্রস্তাবিত পণ্য
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-stone-900 leading-snug">
                {product.name}
              </h2>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-900">
                  {formatTaka(product.price)}
                </span>
                <span className="text-xs text-stone-600 font-medium">
                  / {product.unit}
                </span>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-600 leading-relaxed space-y-2">
                <p>{product.description}</p>
                <div className="flex items-center gap-2 text-stone-700 font-medium pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>HBC PANARPUL অনুমোদিত ও খাঁটি মান।</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700 font-medium">
                  <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>সারাদেশে ট্রাকে সাইট ডেলিভারি সুবিধা।</span>
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="mt-6 pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-stone-700">পরিমাণ ({product.unit}):</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 font-bold text-stone-700 flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-stone-900">
                    {toBengaliNumber(quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 font-bold text-stone-700 flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <span className="text-xs text-emerald-900 font-medium">মোট প্রদেয় মূল্য:</span>
                <span className="text-lg font-black text-emerald-950">
                  {formatTaka(totalPrice)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAdd}
                  disabled={!product.isAvailable}
                  className={`py-3 px-4 rounded-xl border font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isAddedRecently
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300'
                  }`}
                >
                  {isAddedRecently ? (
                    <>
                      <Check className="w-4 h-4 text-amber-300" />
                      <span>যোগ হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 text-emerald-800" />
                      <span>কার্টে রাখুন</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onDirectOrder(product, quantity)}
                  disabled={!product.isAvailable}
                  className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95"
                >
                  <Zap className="w-4 h-4" />
                  <span>এখনই অর্ডার করুন</span>
                </button>
              </div>

              <div className="mt-3 text-center">
                <a
                  href={`tel:${settings.founderPhone}`}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-800 hover:text-amber-900 font-semibold"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>ফোন করে জানতে চান? {toBengaliNumber(settings.founderPhone)}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
