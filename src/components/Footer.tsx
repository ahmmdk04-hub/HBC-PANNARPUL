import React from 'react';
import { Phone, MapPin, Shield, Building2, Clock, CheckCircle2, Heart } from 'lucide-react';
import { StoreSettings } from '../types';
import { toBengaliNumber } from '../utils/bengaliUtils';

interface FooterProps {
  settings: StoreSettings;
  onOpenAdmin: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdmin,
  onSelectCategory
}) => {
  return (
    <footer className="bg-emerald-950 text-stone-300 pt-12 pb-8 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-emerald-900/60">
          {/* Brand & Founder Summary */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center text-amber-400 border border-amber-500/30">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                {settings.storeName}
              </span>
            </div>

            <p className="text-xs text-emerald-100/80 leading-relaxed">
              {settings.tagline}। সরাসরি নিজস্ব ভাটা থেকে ১ নম্বর ইট, ২ নম্বর ইট, ৩ নম্বর ইট এবং রড, সিমেন্ট, বালু ও পায়া সরবরাহ করা হয়।
            </p>

            {/* Founder Mini Badge */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-900/40 border border-emerald-800/80">
              <img
                src={settings.founderPhoto}
                alt={settings.founderName}
                className="w-10 h-10 rounded-full object-cover border border-amber-400"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/aistudio/01_31f695e4.png';
                }}
              />
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase block">
                  {settings.founderTitle}
                </span>
                <span className="text-xs font-semibold text-white block">
                  {settings.founderName}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>নির্মাণ সামগ্রী সমূহ</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('ইট')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  ১ নম্বর ও ২ নম্বর অটো ব্রিকস (ইট)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('রড')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  উচ্চশক্তির ৫০২ ও ৫০০ডি রড
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('সিমেন্ট')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  ব্র্যান্ডেড সিমেন্ট (OPC / PCC)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('বালু')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  সিলেট বালু ও ভিটি বালু
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('পায়া')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  আরসিসি পায়া ও সীমানা পিলার
                </button>
              </li>
            </ul>
          </div>

          {/* Delivery & Ordering Guidelines */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>ডেলিভারি ও সেবা নীতি</span>
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>• সরাসরি ট্রাক বা পিকআপের মাধ্যমে সাইটে ডেলিভারি।</li>
              <li>• পণ্য দেখে যাচাই করে মূল্য পরিশোধ (ক্যাশ অন ডেলিভারি)।</li>
              <li>• তাৎক্ষণিক ডিজিটাল ও প্রিন্টযোগ্য বাংলা সরবরাহ চালান।</li>
              <li>• পাইকারি ও খুচরা বিক্রয় ও চুক্তিভিত্তিক বড় সরবরাহ।</li>
            </ul>
          </div>

          {/* Direct Contact & Admin Access */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              <span>সরাসরি যোগাযোগ ও ঠিকানা</span>
            </h4>

            <div className="text-xs space-y-2">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.officeAddress}</span>
              </p>

              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${settings.founderPhone}`} className="text-amber-300 font-mono font-bold text-sm tracking-wider hover:underline">
                  {settings.founderPhone}
                </a>
                <span className="text-[11px] text-stone-400">(সরাসরি কল)</span>
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="w-full py-2 px-3 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-stone-300 hover:text-white border border-emerald-800 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>অ্যাডমিন ম্যানেজমেন্ট প্যানেল</span>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright & Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <p>© {toBengaliNumber(2026)} {settings.storeName}। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1 text-[11px]">
            <span>গুণগত মানের প্রতীক</span>
            <span className="text-amber-400">•</span>
            <span>আলহাজ্ব মোঃ ছায়েদুর রহমান ভূঞা সবুর</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
