import React from 'react';
import { Phone, ShieldCheck, Truck, Award, FileCheck2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { StoreSettings } from '../types';
import { toBengaliNumber } from '../utils/bengaliUtils';

interface HeroBannerProps {
  settings: StoreSettings;
  onExploreProducts: () => void;
  onOpenTracking?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ settings, onExploreProducts, onOpenTracking }) => {
  return (
    <div className="relative overflow-hidden bg-stone-950 text-white py-12 md:py-16 px-4">
      {/* Brick Kiln (ইটের ভাটা) Background Photo Uploaded by User */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none scale-105 transform origin-center transition-transform duration-1000"
        style={{
          backgroundImage: `url('/assets/aistudio/ac5f9f6c-2285-4bfd-a2c7-113f773b5638-e1735727034905_073afcda.jpeg')`
        }}
      />
      {/* Cinematic dark gradients for maximum text contrast and elegance */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-emerald-950/90 to-stone-950/85 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/70 pointer-events-none" />
      <div className="absolute inset-0 bg-amber-950/20 mix-blend-multiply pointer-events-none" />

      {/* Decorative architectural grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Call to Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold backdrop-blur-xs">
              <Award className="w-4 h-4 text-amber-400" />
              <span>১০০% অটোমেটিক কিলন ভাটা ও পরীক্ষিত নির্মাণ সামগ্রী</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              সরাসরি ভাটা থেকে সেরা মানের <br />
              <span className="text-amber-400 underline decoration-amber-500/50 underline-offset-8">
                ১ নম্বর ইট ও নির্মাণ সামগ্রী
              </span>
            </h1>

            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl">
              <strong className="text-white">{settings.storeName}</strong> — আপনার স্বপ্নের বাড়ি ও স্থায়ী অবকাঠামো নির্মাণে বিশ্বস্ত সঙ্গী। 
              সরাসরি ভাটা ও কারখানা থেকে কোনো মধ্যস্বত্বভোগী ছাড়াই ১ নম্বর ইট, ২ নম্বর ইট, ৩ নম্বর ইট, রড, সিমেন্ট, বালু ও পায়া দ্রুত সাইটে পৌঁছে দেওয়া হয়।
            </p>

            {/* Key Value Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-stone-200 bg-black/40 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>সঠিক মাপ ও নিখুঁত পোড়া</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-200 bg-black/40 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>সারাদেশে দ্রুত ডেলিভারি</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-200 bg-black/40 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                <FileCheck2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>ডিজিটাল চালান (HBC)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-4">
              <button
                onClick={onExploreProducts}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
              >
                <span>পণ্যসমূহ দেখুন ও অর্ডার করুন</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {onOpenTracking && (
                <button
                  onClick={onOpenTracking}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-amber-300 hover:text-white font-semibold text-sm border border-emerald-600/50 transition-all active:scale-95 cursor-pointer"
                >
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>অর্ডার ট্র্যাক / চালান চেক</span>
                </button>
              )}

              <a
                href={`tel:${settings.founderPhone}`}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all active:scale-95"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>সরাসরি কল: <strong className="font-mono text-amber-300 tracking-wider ml-1">{settings.founderPhone}</strong></span>
              </a>
            </div>
          </div>

          {/* Right Founder Card & Bricks Preview */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Glow Accent */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500/30 to-emerald-500/30 blur-xl opacity-75"></div>

              <div className="relative rounded-2xl bg-stone-900/90 border border-stone-800 p-5 shadow-2xl backdrop-blur-md">
                {/* Founder Presentation */}
                <div className="flex items-center gap-4 pb-4 border-b border-stone-800">
                  <img
                    src={settings.founderPhoto}
                    alt={settings.founderName}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-amber-400 shadow-lg ring-2 ring-emerald-900"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/aistudio/01_31f695e4.png';
                    }}
                  />
                  <div>
                    <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
                      {settings.founderTitle}
                    </span>
                    <h2 className="text-base font-bold text-white leading-tight">
                      {settings.founderName}
                    </h2>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {settings.storeName}
                    </p>
                  </div>
                </div>

                {/* Live Brick Quality Image */}
                <div className="mt-4 rounded-xl overflow-hidden border border-stone-800 relative group">
                  <img
                    src="/assets/aistudio/855221105_1050044634737488_7794261989616121237_n_6bf75717.jpg"
                    alt="HBC ইট"
                    className="w-full h-44 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3.5">
                    <div>
                      <span className="inline-block px-2 py-0.5 bg-emerald-700 text-white text-[10px] font-bold rounded-md mb-1">
                        HBC মার্কিং যাচাইকৃত ইট
                      </span>
                      <p className="text-xs text-stone-200 font-medium">
                        উৎকৃষ্ট অটোমেটিক কিলন ভাটার প্রতিটি ইটে HBC সিল বিদ্যমান।
                      </p>
                    </div>
                  </div>
                </div>

                {/* Guarantee Banner */}
                <div className="mt-4 flex items-center justify-between text-xs text-stone-300 bg-stone-950/60 p-3 rounded-lg border border-stone-800/80">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>১০০% আসল গুণগত মানের নিশ্চয়তা</span>
                  </div>
                  <span className="text-amber-400 font-bold">ক্যাশ অন ডেলিভারি</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
