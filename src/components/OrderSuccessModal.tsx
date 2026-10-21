import React, { useState } from 'react';
import { CheckCircle2, Download, Printer, Eye, ArrowRight, Phone, ShieldCheck, FileText, Loader2 } from 'lucide-react';
import { Order, StoreSettings } from '../types';
import { formatTaka, toBengaliNumber, formatBengaliDate } from '../utils/bengaliUtils';
import { generateBanglaChallanPdf } from '../utils/challanPdf';

interface OrderSuccessModalProps {
  order: Order | null;
  settings: StoreSettings;
  onClose: () => void;
  onViewChallan: (order: Order) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  settings,
  onClose,
  onViewChallan
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!order) return null;

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      await generateBanglaChallanPdf(order, settings);
      setIsGeneratingPdf(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('PDF error:', err);
      setIsGeneratingPdf(false);
      alert('পিডিএফ তৈরিতে সমস্যা হয়েছে। সরাসরি "চালান দেখুন ও প্রিন্ট করুন" অপশনটি ব্যবহার করুন।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-center p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10 text-emerald-700" />
        </div>

        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
          অর্ডার সফলভাবে গৃহীত হয়েছে
        </span>

        <h2 className="text-2xl font-black text-stone-900 mt-2">
          ধন্যবাদ, {order.customerName}!
        </h2>

        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-md mx-auto">
          আপনার অর্ডারটি <strong className="text-emerald-950 font-bold">{settings.storeName}</strong> এ সফলভাবে রেকর্ড করা হয়েছে।
        </p>

        {/* Order Details Card */}
        <div className="mt-5 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left text-xs space-y-2">
          <div className="flex justify-between items-center pb-2 border-b border-stone-200 font-semibold">
            <span className="text-stone-500">চালান / অর্ডার নং:</span>
            <span className="text-emerald-900 font-mono font-bold text-sm">{order.orderNumber}</span>
          </div>

          <div className="flex justify-between text-stone-600">
            <span>অর্ডারের সময়:</span>
            <span>{formatBengaliDate(order.createdAt)}</span>
          </div>

          <div className="flex justify-between text-stone-600">
            <span>ডেলিভারি এলাকা:</span>
            <span>{order.upazila}, {order.district}</span>
          </div>

          <div className="flex justify-between text-stone-600">
            <span>মোট সামগ্রী:</span>
            <span>{toBengaliNumber(order.items.length)}টি আইটেম</span>
          </div>

          <div className="flex justify-between text-stone-600">
            <span>পেমেন্ট ধরন:</span>
            <span className="font-semibold text-emerald-800">ক্যাশ অন ডেলিভারি (পণ্য পেয়ে পরিশোধ)</span>
          </div>

          <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
            <span className="font-bold text-stone-900">সর্বমোট প্রদেয় বিল:</span>
            <span className="text-base font-black text-emerald-950">{formatTaka(order.grandTotal)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-2.5">
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/15 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                <span>চালান পিডিএফ প্রস্তুত হচ্ছে...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>পিডিএফ ডাউনলোড সম্পন্ন হয়েছে!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-amber-300" />
                <span>বাংলা ডিজিটাল চালান ডাউনলোড করুন (PDF)</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewChallan(order)}
              className="py-2.5 px-3 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-800" />
              <span>চালান প্রিন্ট ভিউ</span>
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>দোকানে ফিরে যান</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hotline Contact Note */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
          <Phone className="w-3.5 h-3.5 text-amber-600" />
          <span>যেকোনো প্রয়োজনে সরাসরি প্রতিষ্ঠাতা আলহাজ্ব মোঃ ছায়েদুর রহমান ভূঞা সবুর এর সাথে কথা বলুন:</span>
          <a href={`tel:${settings.founderPhone}`} className="text-emerald-800 font-bold hover:underline">
            {toBengaliNumber(settings.founderPhone)}
          </a>
        </div>
      </div>
    </div>
  );
};
