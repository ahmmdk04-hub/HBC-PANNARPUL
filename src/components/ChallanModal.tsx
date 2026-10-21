import React from 'react';
import { X, Printer, Download, Phone, ShieldCheck, MapPin } from 'lucide-react';
import { Order, StoreSettings } from '../types';
import { formatTaka, toBengaliNumber, formatBengaliDate } from '../utils/bengaliUtils';
import { generateBanglaChallanPdf } from '../utils/challanPdf';

interface ChallanModalProps {
  order: Order | null;
  settings: StoreSettings;
  onClose: () => void;
}

export const ChallanModal: React.FC<ChallanModalProps> = ({
  order,
  settings,
  onClose
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    generateBanglaChallanPdf(order, settings);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl my-auto bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Top Control Bar (Hidden during print) */}
        <div className="p-4 bg-emerald-950 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-amber-300">ডিজিটাল চালান ও রসিদ প্রিভিউ</span>
            <span className="text-xs text-stone-300 font-mono">({order.orderNumber})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>পিডিএফ ডাউনলোড</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 cursor-pointer transition-all border border-emerald-700"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>প্রিন্ট করুন</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable A4 Container */}
        <div className="p-6 sm:p-10 overflow-y-auto print:p-8 bg-white text-stone-900 font-['Hind_Siliguri',sans-serif]">
          {/* Decorative Outer Border */}
          <div className="border-4 border-emerald-900 p-6 sm:p-8 rounded-xl relative">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b-2 border-emerald-900/40">
              {/* Founder Information (Left Side) */}
              <div className="flex items-center gap-4">
                <img
                  src={settings.founderPhoto}
                  alt={settings.founderName}
                  className="w-20 h-24 rounded-lg object-cover border-2 border-emerald-800 shadow-md ring-2 ring-amber-400"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/aistudio/01_31f695e4.png';
                  }}
                />
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                    {settings.founderTitle}
                  </span>
                  <h3 className="text-lg font-extrabold text-stone-950">
                    {settings.founderName}
                  </h3>
                  <p className="text-xs text-stone-700 font-semibold mt-0.5">
                    মোবাইল: <strong className="font-mono text-emerald-950 font-bold ml-1">{settings.founderPhone}</strong>
                  </p>
                  <p className="text-[11px] text-stone-600 mt-0.5 max-w-xs font-medium">
                    ঠিকানা: {settings.officeAddress}
                  </p>
                </div>
              </div>

              {/* Company Branding (Right Side) */}
              <div className="text-left sm:text-right">
                <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
                  {settings.storeName}
                </h1>
                <p className="text-xs font-bold text-amber-700 mt-0.5">
                  নির্মাণ সামগ্রী বিক্রয় কেন্দ্র ও সরবরাহকারী
                </p>
                <p className="text-[11px] text-stone-600 mt-1">
                  হটলাইন: <strong className="font-mono text-stone-900 font-bold">{settings.helpline}</strong>
                </p>
                <div className="inline-block mt-2 px-3 py-1 bg-emerald-900 text-amber-300 font-bold text-xs rounded-md shadow-xs">
                  ডিজিটাল সরবরাহ চালান
                </div>
              </div>
            </div>

            {/* Challan Meta & Customer Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs">
              <div className="space-y-1.5">
                <p className="font-bold text-emerald-900 text-sm mb-1">চালানের বিবরণ:</p>
                <p><span className="text-stone-500">চালান নম্বর:</span> <strong className="font-mono text-stone-900">{order.orderNumber}</strong></p>
                <p><span className="text-stone-500">অর্ডারের তারিখ ও সময়:</span> <strong className="text-stone-900">{formatBengaliDate(order.createdAt)}</strong></p>
                <p><span className="text-stone-500">পেমেন্ট ধরন:</span> <strong className="text-emerald-800 font-semibold">{order.paymentMethod === 'Cash on Delivery' ? 'ক্যাশ অন ডেলিভারি (পণ্য পেয়ে পরিশোধ)' : order.paymentMethod}</strong></p>
                <p><span className="text-stone-500">চালানের স্ট্যাটাস:</span> <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{order.status}</span></p>
              </div>

              <div className="space-y-1.5">
                <p className="font-bold text-emerald-900 text-sm mb-1">গ্রাহক ও ডেলিভারির বিবরণ:</p>
                <p><span className="text-stone-500">গ্রাহকের নাম:</span> <strong className="text-stone-900">{order.customerName}</strong></p>
                <p><span className="text-stone-500">মোবাইল নম্বর:</span> <strong className="text-stone-900 font-mono tracking-wide">{order.customerPhone}</strong></p>
                <p><span className="text-stone-500">এলাকা / থানা:</span> <strong className="text-stone-900">{order.villageArea ? order.villageArea + ', ' : ''}{order.upazila}, {order.district}</strong></p>
                <p><span className="text-stone-500">বিস্তারিত সাইট ঠিকানা:</span> <span className="text-stone-800">{order.detailedAddress}</span></p>
              </div>
            </div>

            {/* Table of Products */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-stone-200">
                <thead className="bg-emerald-900 text-white font-bold">
                  <tr>
                    <th className="p-2.5 text-center w-12 border-r border-emerald-800">নং</th>
                    <th className="p-2.5 border-r border-emerald-800">পণ্যের বিবরণ</th>
                    <th className="p-2.5 text-center border-r border-emerald-800">ক্যাটাগরি</th>
                    <th className="p-2.5 text-center border-r border-emerald-800">পরিমাণ ও একক</th>
                    <th className="p-2.5 text-right border-r border-emerald-800">একক মূল্য</th>
                    <th className="p-2.5 text-right">মোট মূল্য</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                      <td className="p-2.5 text-center font-bold text-stone-600 border-r border-stone-200">
                        {toBengaliNumber(idx + 1)}
                      </td>
                      <td className="p-2.5 font-bold text-stone-900 border-r border-stone-200">
                        {item.productName}
                      </td>
                      <td className="p-2.5 text-center text-stone-600 border-r border-stone-200">
                        {item.category}
                      </td>
                      <td className="p-2.5 text-center font-medium text-stone-800 border-r border-stone-200">
                        {toBengaliNumber(item.quantity)} {item.unit}
                      </td>
                      <td className="p-2.5 text-right text-stone-700 border-r border-stone-200">
                        {formatTaka(item.unitPrice)}
                      </td>
                      <td className="p-2.5 text-right font-bold text-emerald-900">
                        {formatTaka(item.lineTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals & Notes Section */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 mt-6">
              {/* Terms and notes */}
              <div className="sm:col-span-7 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-stone-800 text-[11px] space-y-1.5">
                <span className="font-bold text-amber-900 block text-xs">বিশেষ নির্দেশনাবলী:</span>
                <p>১. সাইটে পণ্য আনলোড করার সময় সরাসরি চালানের সাথে মিলিয়ে নিন।</p>
                <p>২. কোনো ক্ষতি বা ত্রুটি থাকলে চালানে উল্লেখ করে ডেলিভারিম্যানকে অবগত করুন।</p>
                {order.customerNotes && (
                  <p className="pt-1 text-emerald-900 font-semibold">গ্রাহকের নোট: {order.customerNotes}</p>
                )}
              </div>

              {/* Financial Summary */}
              <div className="sm:col-span-5 bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>পণ্য উপ-মোট:</span>
                  <span className="font-bold text-stone-900">{formatTaka(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>ডেলিভারি / ট্রাক ভাড়া:</span>
                  <span className="font-bold text-stone-900">{formatTaka(order.deliveryCharge)}</span>
                </div>
                <div className="pt-2 border-t border-stone-300 flex justify-between items-baseline">
                  <span className="font-extrabold text-stone-900">সর্বমোট প্রদেয়:</span>
                  <span className="text-lg font-black text-emerald-950">{formatTaka(order.grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Signature Block */}
            <div className="grid grid-cols-2 gap-8 mt-16 pt-8 text-center text-xs">
              <div>
                <div className="border-t border-stone-400 w-44 mx-auto pt-2 font-medium text-stone-600">
                  পণ্য গ্রহণকারীর স্বাক্ষর
                </div>
              </div>
              <div>
                <div className="border-t border-stone-400 w-48 mx-auto pt-2">
                  <span className="font-bold text-emerald-950 block">{settings.founderName}</span>
                  <span className="text-[11px] text-stone-500">অনুমোদিত স্বাক্ষরকারী, {settings.storeName}</span>
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="mt-8 pt-4 border-t border-stone-200 text-center text-[10px] text-stone-400">
              {settings.storeName} — এটি একটি ডিজিটাল জেনারেটেড চালান। ফোন: {toBengaliNumber(settings.founderPhone)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
