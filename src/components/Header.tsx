import React from 'react';
import { Phone, ShoppingCart, Shield, Search, Building2, MapPin, Truck } from 'lucide-react';
import { StoreSettings } from '../types';
import { toBengaliNumber } from '../utils/bengaliUtils';

interface HeaderProps {
  settings: StoreSettings;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenTracking: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onOpenTracking,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Founder & Contact Bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-4 border-b border-emerald-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Upper Left Founder Information */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group shrink-0">
              <img
                src={settings.founderPhoto}
                alt={settings.founderName}
                className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover border-2 border-amber-400 shadow-md ring-2 ring-emerald-800"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/aistudio/01_31f695e4.png';
                }}
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {settings.founderTitle}
                </span>
                <span className="text-white font-semibold text-sm">
                  {settings.founderName}
                </span>
              </div>
              <a
                href={`tel:${settings.founderPhone}`}
                className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors font-medium mt-0.5"
                title="সরাসরি কল করতে ক্লিক করুন"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono font-bold tracking-wider text-amber-300 text-xs">{settings.founderPhone}</span>
                <span className="text-[11px] text-emerald-200">(সরাসরি কল)</span>
              </a>
            </div>
          </div>

          {/* Quick Notice, Tracking & Admin button */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto text-[11px] text-emerald-200/90">
            <div className="hidden lg:flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings.officeAddress}</span>
            </div>

            <button
              onClick={onOpenTracking}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 hover:text-white transition-all border border-emerald-700/50 cursor-pointer"
              title="অর্ডার ট্র্যাকিং ও চালান যাচাই"
            >
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>অর্ডার ট্র্যাক</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 hover:text-white transition-all border border-emerald-700/50 cursor-pointer ml-auto md:ml-0"
              title="অ্যাডমিন প্যানেল"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>অ্যাডমিন প্রবেশ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-amber-400 shadow-md ring-2 ring-amber-500/30">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-950 font-serif">
                  {settings.storeName}
                </span>
                <span className="hidden sm:inline-block text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-300">
                  নিবন্ধিত সরবরাহকারী
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                {settings.tagline}
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="ইট, রড, সিমেন্ট, বালু বা পায়া খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm transition-all outline-hidden"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Actions: Hotline, Tracking & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenTracking}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-stone-300 hover:border-emerald-700 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
              title="অর্ডার ট্র্যাকিং"
            >
              <Truck className="w-4 h-4 text-emerald-800" />
              <span className="hidden sm:inline">অর্ডার ট্র্যাকিং</span>
            </button>

            <a
              href={`tel:${settings.founderPhone}`}
              className="hidden lg:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-950 border border-amber-300/50 text-xs font-bold transition-all"
            >
              <Phone className="w-4 h-4 text-amber-600" />
              <span>জরুরি অর্ডার: <strong className="font-mono text-emerald-950 ml-1">{settings.founderPhone}</strong></span>
            </a>

            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-sm transition-all shadow-md shadow-emerald-950/10 cursor-pointer active:scale-95"
              aria-label="শপিং কার্ট"
            >
              <ShoppingCart className="w-5 h-5 text-amber-300" />
              <span className="hidden sm:inline">কার্ট</span>
              {cartCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1 bg-amber-500 text-emerald-950 font-bold text-xs rounded-full shadow-xs">
                  {toBengaliNumber(cartCount)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="পণ্য খুঁজুন (ইট, রড, সিমেন্ট, বালু...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-stone-100 border border-stone-200 text-xs focus:bg-white focus:border-emerald-600 outline-hidden"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>
    </header>
  );
};
