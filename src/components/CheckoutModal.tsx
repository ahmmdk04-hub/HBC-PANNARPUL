import React, { useState, useMemo } from 'react';
import { X, CheckCircle, ShieldCheck, MapPin, Phone, User, FileText, AlertCircle, Loader2, Truck } from 'lucide-react';
import { OrderItem, Order, StoreSettings } from '../types';
import { BANGLADESH_DISTRICTS } from '../data/bangladeshGeo';
import { formatTaka, toBengaliNumber, isValidBdPhone, generateOrderNumber } from '../utils/bengaliUtils';
import { firebaseStore } from '../services/firebase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  settings: StoreSettings;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  settings,
  onOrderSuccess
}) => {
  // Form fields
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [districtId, setDistrictId] = useState<string>('dhaka');
  const [upazilaId, setUpazilaId] = useState<string>('dhanmondi');
  const [villageArea, setVillageArea] = useState<string>('');
  const [detailedAddress, setDetailedAddress] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'bKash / Nagad' | 'Bank Transfer'>('Cash on Delivery');

  // Submission state & validation
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Selected district & upazilas
  const selectedDistrict = useMemo(() => {
    return BANGLADESH_DISTRICTS.find(d => d.id === districtId) || BANGLADESH_DISTRICTS[0];
  }, [districtId]);

  const upazilas = useMemo(() => {
    return selectedDistrict ? selectedDistrict.upazilas : [];
  }, [selectedDistrict]);

  const selectedUpazila = useMemo(() => {
    return upazilas.find(u => u.id === upazilaId) || upazilas[0];
  }, [upazilas, upazilaId]);

  // Handle District Change
  const handleDistrictChange = (dId: string) => {
    setDistrictId(dId);
    const dist = BANGLADESH_DISTRICTS.find(d => d.id === dId);
    if (dist && dist.upazilas.length > 0) {
      setUpazilaId(dist.upazilas[0].id);
    }
  };

  // Calculate pricing accurately
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  }, [items]);

  // Delivery fee
  const deliveryCharge = useMemo(() => {
    return settings.defaultDeliveryFee || 1500;
  }, [settings.defaultDeliveryFee]);

  const grandTotal = subtotal + deliveryCharge;

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার নাম লিখুন।');
      return;
    }

    if (!isValidBdPhone(customerPhone)) {
      setErrorMsg('সঠিক বাংলাদেশী ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01711141576)।');
      return;
    }

    if (!detailedAddress.trim()) {
      setErrorMsg('অনুগ্রহ করে বিস্তারিত ডেলিভারি ঠিকানা বা ল্যান্ডমার্ক লিখুন।');
      return;
    }

    if (items.length === 0) {
      setErrorMsg('আপনার কার্টে কোনো পণ্য নেই।');
      return;
    }

    setIsSubmitting(true);

    try {
      const existingOrders = firebaseStore.getLocalOrders();
      const orderNumber = generateOrderNumber(existingOrders);
      const newOrderPayload: Omit<Order, 'id'> = {
        orderNumber,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        district: selectedDistrict.nameBn,
        upazila: selectedUpazila ? selectedUpazila.nameBn : upazilaId,
        villageArea: villageArea.trim(),
        detailedAddress: detailedAddress.trim(),
        customerNotes: customerNotes.trim(),
        items,
        subtotal,
        deliveryCharge,
        grandTotal,
        status: 'Pending',
        paymentMethod,
        createdAt: new Date().toISOString()
      };

      const savedOrder = await firebaseStore.createOrder(newOrderPayload);
      setIsSubmitting(false);
      onOrderSuccess(savedOrder);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg('অর্ডার সাবমিট করতে সমস্যা হয়েছে: ' + (err.message || 'আবার চেষ্টা করুন'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl my-6 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              {settings.storeName}
            </span>
            <h2 className="text-lg sm:text-xl font-bold">অর্ডার ও ডেলিভারি তথ্য ফর্ম</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Details */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2 pb-2 border-b border-stone-200">
                <User className="w-4 h-4 text-emerald-800" />
                <span>গ্রাহকের তথ্য</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  আপনার নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  মোবাইল নম্বর (১১ ডিজিট) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="01711141576"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-hidden"
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[11px] text-stone-500 mt-1 block">
                  চালান ও ডেলিভারি ট্র্যাকিংয়ের জন্য এই নম্বরে যোগাযোগ করা হবে।
                </span>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  পেমেন্ট মাধ্যম
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                      className="text-emerald-700 focus:ring-emerald-600"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-stone-900 block">ক্যাশ অন ডেলিভারি (পণ্য দেখে পরিশোধ)</span>
                      <span className="text-stone-500 text-[11px]">সাইটে পণ্য আনলোড করার সময় চালানের টাকা পরিশোধ করুন।</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  অর্ডার সংক্রান্ত বিশেষ নির্দেশ বা নোট (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  placeholder="যেমন: দ্রুত ডেলিভারি প্রয়োজন, বা সাইটে প্রবেশের বিস্তারিত..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 text-xs outline-hidden"
                />
              </div>
            </div>

            {/* Delivery Location Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2 pb-2 border-b border-stone-200">
                <MapPin className="w-4 h-4 text-emerald-800" />
                <span>ডেলিভারি ঠিকানা ও এলাকা</span>
              </h3>

              {/* Dependent District Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  জেলা নির্বাচন করুন *
                </label>
                <select
                  value={districtId}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 text-sm outline-hidden bg-white"
                >
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nameBn} ({d.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dependent Upazila / Thana Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  উপজেলা / থানা নির্বাচন করুন *
                </label>
                <select
                  value={upazilaId}
                  onChange={(e) => setUpazilaId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 text-sm outline-hidden bg-white"
                >
                  {upazilas.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nameBn} ({u.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              {/* Village / Area */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  গ্রাম / মহল্লা / রোড নম্বর (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: পানারপুল, বাড্ডা রোড"
                  value={villageArea}
                  onChange={(e) => setVillageArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 text-sm outline-hidden"
                />
              </div>

              {/* Detailed Address */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  বিস্তারিত ডেলিভারি ঠিকানা / সাইট ল্যান্ডমার্ক *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="যেমন: স্কুল সংলগ্ন নির্মানাধীন ভবন, বাড়ি নং ১২, রোড ৩..."
                  value={detailedAddress}
                  onChange={(e) => setDetailedAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 text-sm outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Live Order Summary Table */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-600 mb-2.5">
              অর্ডারকৃত সামগ্রীর তালিকা ও মূল্য হিসাব
            </h4>

            <div className="divide-y divide-stone-200 text-xs">
              {items.map((item) => (
                <div key={item.productId} className="py-2 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-stone-900">{item.productName}</span>
                    <span className="text-stone-500 ml-2">
                      ({toBengaliNumber(item.quantity)} {item.unit} × {formatTaka(item.unitPrice)})
                    </span>
                  </div>
                  <span className="font-bold text-stone-900">{formatTaka(item.lineTotal)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 mt-2 border-t border-stone-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>পণ্য উপ-মোট:</span>
                <span className="font-bold text-stone-900">{formatTaka(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-amber-600" />
                  <span>ট্রাক পরিবহন ও ডেলিভারি ফি:</span>
                </span>
                <span className="font-bold text-emerald-800">{formatTaka(deliveryCharge)}</span>
              </div>
              <div className="pt-2 border-t border-stone-300 flex justify-between items-baseline text-sm">
                <span className="font-extrabold text-stone-900">সর্বমোট প্রদেয় টাকা:</span>
                <span className="text-xl font-black text-emerald-950">{formatTaka(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Guarantee and Submit */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>অর্ডার সম্পন্ন হওয়ার পর স্বয়ংক্রিয় ডিজিটাল চালান প্রস্তুত হবে।</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold cursor-pointer"
              >
                বাতিল
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-7 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>অর্ডার সংরক্ষিত হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-amber-300" />
                    <span>অর্ডার নিশ্চিত করুন ({formatTaka(grandTotal)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
