import React from 'react';
import { BannerAd } from '../types';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface BottomBannerAdProps {
  banners: BannerAd[];
}

export const BottomBannerAd: React.FC<BottomBannerAdProps> = ({ banners }) => {
  // Filter active banners within valid date ranges
  const todayStr = new Date().toISOString().slice(0, 10);
  const activeBanners = banners.filter(b => {
    if (!b.isActive) return false;
    if (b.startDate && b.startDate > todayStr) return false;
    if (b.endDate && b.endDate < todayStr) return false;
    return true;
  });

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[0];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200 bg-stone-900 text-white group">
        <div className="absolute inset-0">
          <img
            src={currentBanner.imageUrl || '/assets/aistudio/855221105_1050044634737488_7794261989616121237_n_6bf75717.jpg'}
            alt={currentBanner.title}
            className="w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/aistudio/855221105_1050044634737488_7794261989616121237_n_6bf75717.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/80 to-transparent"></div>
        </div>

        <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>বিশেষ অফার ও ঘোষণা</span>
            </span>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight">
              {currentBanner.title}
            </h3>

            <p className="text-xs sm:text-sm text-stone-300">
              অর্ডার করুন সরাসরি ভাটা থেকে এবং উপভোগ করুন দ্রুততম ট্রাক ডেলিভারি সুবিধা।
            </p>
          </div>

          {currentBanner.targetUrl && (
            <a
              href={currentBanner.targetUrl}
              target={currentBanner.targetUrl.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs sm:text-sm transition-all shadow-lg active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span>বিস্তারিত দেখুন</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
