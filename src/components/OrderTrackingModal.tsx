import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  FileText, 
  Download, 
  Eye, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Order, StoreSettings, OrderStatus } from '../types';
import { formatTaka, toBengaliNumber, formatBengaliDate } from '../utils/bengaliUtils';
import { generateBanglaChallanPdf } from '../utils/challanPdf';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  settings: StoreSettings;
  onViewChallan: (order: Order) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  settings,
  onViewChallan
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searched, setSearched] = useState<boolean>(false);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim().toLowerCase();
    if (!query) return;

    setSearched(true);
    // Find by exact or partial order number (e.g. HBC-2026-01 or 01) or customer phone
    const cleanPhone = query.replace(/[\s\-\+]/g, '');
    const match = orders.find(o => {
      const orderNum = o.orderNumber.toLowerCase();
      const phone = o.customerPhone.replace(/[\s\-\+]/g, '');
      return orderNum === query || 
             orderNum.includes(query) || 
             (cleanPhone.length >= 8 && phone.includes(cleanPhone));
    });

    setFoundOrder(match || null);
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Confirmed':
        return 2;
      case 'Processing':
        return 3;
      case 'Dispatched':
        return 4;
      case 'Delivered':
        return 5;
      case 'Cancelled':
        return -1;
      default:
        return 1;
    }
  };

  const currentStep = foundOrder ? getStatusStepIndex(foundOrder.status) : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">অর্ডার ট্র্যাকিং ও চালান যাচাই</h2>
              <p className="text-[11px] text-emerald-200">
                চালানের ট্র্যাকিং নম্বর (যেমন: HBC-2026-01) অথবা মোবাইল দিয়ে খোঁজ করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="যেমন: HBC-2026-01 অথবা 01711141576..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm outline-hidden font-mono uppercase"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 shrink-0"
            >
              <span>খুঁজুন</span>
            </button>
          </form>

          {/* Search Result */}
          {searched && !foundOrder && (
            <div className="text-center py-8 p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-stone-700 space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
              <h3 className="font-bold text-sm text-stone-900">কোনো চালান খুঁজে পাওয়া যায়নি</h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                অনুগ্রহ করে আপনার চালান নম্বর (যেমন: <strong>HBC-2026-01</strong>) অথবা অর্ডারে ব্যবহৃত মোবাইল নম্বরটি সঠিক কিনা পরীক্ষা করুন।
              </p>
              <div className="pt-2">
                <a
                  href={`tel:${settings.founderPhone}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-bold"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-300" />
                  <span>সাহায্যের জন্য কল করুন: <strong className="font-mono text-amber-300 ml-1">{settings.founderPhone}</strong></span>
                </a>
              </div>
            </div>
          )}

          {foundOrder && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Order Meta Header */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
                    চালান নম্বর
                  </span>
                  <span className="text-lg font-black font-mono text-emerald-950">
                    {foundOrder.orderNumber}
                  </span>
                  <span className="text-stone-500 block mt-0.5">
                    তারিখ: {formatBengaliDate(foundOrder.createdAt)}
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-stone-500 font-semibold block">সর্বমোট বিল</span>
                  <span className="text-lg font-black text-emerald-950 block">
                    {formatTaka(foundOrder.grandTotal)}
                  </span>
                  <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900 text-amber-300">
                    {foundOrder.status}
                  </span>
                </div>
              </div>

              {/* Visual Delivery Stepper */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-3">
                  ডেলিভারি অগ্রগতি ট্র্যাকার
                </h4>

                {foundOrder.status === 'Cancelled' ? (
                  <div className="p-3 rounded-xl bg-red-100 text-red-800 text-xs font-bold text-center border border-red-300">
                    এই অর্ডারটি বাতিল করা হয়েছে। বিস্তারিত জানতে অফিসে যোগাযোগ করুন।
                  </div>
                ) : (
                  <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center text-[10px] sm:text-xs">
                    {/* Step 1 */}
                    <div className="space-y-1.5">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                        currentStep >= 1 ? 'bg-emerald-800 text-white ring-4 ring-emerald-100' : 'bg-stone-200 text-stone-500'
                      }`}>
                        ১
                      </div>
                      <span className={`block font-medium ${currentStep >= 1 ? 'text-emerald-900 font-bold' : 'text-stone-400'}`}>
                        অর্ডার গৃহীত
                      </span>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-1.5">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                        currentStep >= 2 ? 'bg-emerald-800 text-white ring-4 ring-emerald-100' : 'bg-stone-200 text-stone-500'
                      }`}>
                        ২
                      </div>
                      <span className={`block font-medium ${currentStep >= 2 ? 'text-emerald-900 font-bold' : 'text-stone-400'}`}>
                        অনুমোদিত
                      </span>
                    </div>

                    {/* Step 3 */}
                    <div className="space-y-1.5">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                        currentStep >= 3 ? 'bg-emerald-800 text-white ring-4 ring-emerald-100' : 'bg-stone-200 text-stone-500'
                      }`}>
                        ৩
                      </div>
                      <span className={`block font-medium ${currentStep >= 3 ? 'text-emerald-900 font-bold' : 'text-stone-400'}`}>
                        লোডিং
                      </span>
                    </div>

                    {/* Step 4 */}
                    <div className="space-y-1.5">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                        currentStep >= 4 ? 'bg-emerald-800 text-white ring-4 ring-emerald-100' : 'bg-stone-200 text-stone-500'
                      }`}>
                        ৪
                      </div>
                      <span className={`block font-medium ${currentStep >= 4 ? 'text-emerald-900 font-bold' : 'text-stone-400'}`}>
                        ট্রাকে রওনা
                      </span>
                    </div>

                    {/* Step 5 */}
                    <div className="space-y-1.5">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                        currentStep >= 5 ? 'bg-emerald-800 text-white ring-4 ring-emerald-100' : 'bg-stone-200 text-stone-500'
                      }`}>
                        ৫
                      </div>
                      <span className={`block font-medium ${currentStep >= 5 ? 'text-emerald-900 font-bold' : 'text-stone-400'}`}>
                        ডেলিভার্ড
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Items & Address Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="font-bold text-stone-900 block mb-1">গ্রাহকের ঠিকানা:</span>
                  <p className="font-semibold text-stone-800">{foundOrder.customerName}</p>
                  <p className="text-stone-600">ফোন: {toBengaliNumber(foundOrder.customerPhone)}</p>
                  <p className="text-stone-600">{foundOrder.villageArea ? foundOrder.villageArea + ', ' : ''}{foundOrder.upazila}, {foundOrder.district}</p>
                  <p className="text-stone-500 text-[11px] pt-1">{foundOrder.detailedAddress}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                  <span className="font-bold text-stone-900 block mb-1">পণ্য সামগ্রী:</span>
                  {foundOrder.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between text-[11px]">
                      <span className="text-stone-700">{i.productName} ({toBengaliNumber(i.quantity)} {i.unit})</span>
                      <span className="font-bold text-stone-900">{formatTaka(i.lineTotal)}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-xs">
                    <span>ডেলিভারি চার্জ:</span>
                    <span>{formatTaka(foundOrder.deliveryCharge)}</span>
                  </div>
                </div>
              </div>

              {/* Challan Download & Print Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => generateBanglaChallanPdf(foundOrder, settings)}
                  className="py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>চালান ডাউনলোড (PDF)</span>
                </button>

                <button
                  onClick={() => onViewChallan(foundOrder)}
                  className="py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Eye className="w-4 h-4 text-emerald-800" />
                  <span>চালান প্রিন্ট ভিউ</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
