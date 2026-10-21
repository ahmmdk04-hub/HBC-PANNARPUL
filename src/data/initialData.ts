import { Product, Category, StoreSettings, BannerAd } from '../types';

export const FOUNDER_DEFAULT_PHOTO = '/assets/aistudio/01_31f695e4.png';
export const BRICK_HBC_PHOTO = '/assets/aistudio/855221105_1050044634737488_7794261989616121237_n_6bf75717.jpg';
export const BRICK_RED_PHOTO = '/assets/images/red_bricks.jpg';
export const ROD_PHOTO = '/assets/images/rod.jpg';
export const CEMENT_PHOTO = '/assets/images/cement.jpg';
export const SAND_PHOTO = '/assets/images/sand.jpg';
export const PAYA_PHOTO = '/assets/images/paya.jpg';

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'HBC PANARPUL',
  tagline: 'গুণগত মানসম্মত নির্মাণ সামগ্রীর বিশ্বস্ত প্রতিষ্ঠান',
  founderName: 'আলহাজ্ব মোঃ ছায়েদুর রহমান ভূঞা সবুর',
  founderPhone: '01711141576',
  founderPhoto: FOUNDER_DEFAULT_PHOTO,
  founderTitle: 'প্রতিষ্ঠাতা ও স্বত্বাধিকারী',
  officeAddress: 'পানারপুল, ভিংলাবাড়ী, কুমিল্লা-সিলেট হাইওয়ে সংলগ্ন, বাংলাদেশ',
  helpline: '01711141576',
  defaultDeliveryFee: 1500,
  emergencyNotice: 'সরাসরি ইটভাটা ও কারখানা থেকে সারাদেশে সুলভ মূল্যে দ্রুত ডেলিভারি দেওয়া হয়।'
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-bricks', name: 'ইট', icon: 'Blocks', order: 1 },
  { id: 'cat-rod', name: 'রড', icon: 'Hammer', order: 2 },
  { id: 'cat-cement', name: 'সিমেন্ট', icon: 'Package', order: 3 },
  { id: 'cat-sand', name: 'বালু', icon: 'Layers', order: 4 },
  { id: 'cat-paya', name: 'পায়া', icon: 'Columns', order: 5 }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-brick-1',
    name: '১ নম্বর ইট (First Class Auto Brick)',
    category: 'ইট',
    price: 15000,
    unit: 'প্রতি ১,০০০টি',
    description: 'উচ্চমানের রঙিন পাকা পোড়ানো ১ নম্বর অটো কিলন ব্রিক। সুষম মাপ, নিখুঁত লাল রং, সুদৃঢ় ধার ও উচ্চ কম্প্রেশন ক্ষমতা সম্পন্ন। বহুতল স্থায়ী ভবনের জন্য সর্বোত্তম।',
    image: BRICK_RED_PHOTO,
    stock: 500000,
    isAvailable: true,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-brick-2',
    name: '২ নম্বর ইট (HBC Standard Brick)',
    category: 'ইট',
    price: 13000,
    unit: 'প্রতি ১,০০০টি',
    description: 'HBC সিলযুক্ত বিশ্বস্ত ২ নম্বর ইট। বাউন্ডারি দেওয়াল, অভ্যন্তরীণ পার্টিশন দেওয়াল ও গ্রামীণ গৃহনির্মাণের জন্য অত্যন্ত উপযোগী ও সাশ্রয়ী।',
    image: BRICK_HBC_PHOTO,
    stock: 350000,
    isAvailable: true,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-brick-3',
    name: '৩ নম্বর ইট (Picket / Filling Brick)',
    category: 'ইট',
    price: 8000,
    unit: 'প্রতি ১,০০০টি',
    description: 'সাশ্রয়ী ৩ নম্বর ইট এবং খোয়া ভাঙার উপযোগী শক্ত ইট। ড্রেনেজ কাজ, সলিং, রাস্তা সংস্কার ও ফাউন্ডেশন ফিলিংয়ের জন্য আদর্শ।',
    image: BRICK_HBC_PHOTO,
    stock: 200000,
    isAvailable: true,
    isFeatured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-rod-1',
    name: '৬০ গ্রেড ৫০০ডব্লিউ টিএমটি রড (500W TMT Steel Rebar)',
    category: 'রড',
    price: 93500,
    unit: 'প্রতি টন',
    description: 'উচ্চশক্তির ৬০ গ্রেড / ৫০০ডব্লিউ খাঁটি টিএমটি রিবার স্টিল রড (৮ মিমি থেকে ২৫ মিমি)। ভূকম্পন প্রতিরোধী, সর্বোচ্চ বাঁক নেওয়ার ক্ষমতা ও ঢালাইয়ের জন্য অতুলনীয়।',
    image: ROD_PHOTO,
    stock: 250,
    isAvailable: true,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-cement-1',
    name: 'পোর্টল্যান্ড কম্পোজিট সিমেন্ট (PCC Cement Bag)',
    category: 'সিমেন্ট',
    price: 545,
    unit: 'প্রতি বস্তা (৫০ কেজি)',
    description: 'তাজা ও উচ্চমানের পোর্টল্যান্ড কম্পোজিট সিমেন্ট। পানিরোধী প্লাস্টারিং, স্ল্যাব ঢালাই ও দীর্ঘস্থায়ী কংক্রিট স্ট্রাকচারের নির্ভরযোগ্য ব্র্যান্ড।',
    image: CEMENT_PHOTO,
    stock: 2000,
    isAvailable: true,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-sand-1',
    name: 'মোটা লাল সিলেট বালু (Coarse Sylhet Sand - FM 2.5)',
    category: 'বালু',
    price: 58,
    unit: 'প্রতি সিএফটি (ঘনফুট)',
    description: 'সরাসরি সিলেট নদী থেকে সংগৃহীত পাহাড়ি মোটা লাল বালু (এফএম ২.২ - ২.৫)। ঢালাই ও আরসিসি কাজের জন্য কাদা ও আবর্জনামুক্ত ১০০% খাঁটি বালু।',
    image: SAND_PHOTO,
    stock: 15000,
    isAvailable: true,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-paya-1',
    name: 'আরসিসি বাউন্ডারি ওয়াল পিলার ও পায়া (RCC Concrete Pillar)',
    category: 'পায়া',
    price: 880,
    unit: 'প্রতি পিস (৭ ফুট)',
    description: 'মজবুত রড ও ভাইব্রেটর কংক্রিটে ঢালাইকৃত আরসিসি সীমানা পিলার ও শক্ত পায়া। বাগান, বাড়ি, কারখানা ও খামার ঘেরার কাজে অত্যন্ত দ্রুত স্থাপনযোগ্য।',
    image: PAYA_PHOTO,
    stock: 500,
    isAvailable: true,
    isFeatured: true,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_BANNERS: BannerAd[] = [
  {
    id: 'banner-1',
    title: 'HBC PANARPUL — সেরা মানের ১ নম্বর ইট, রড, সিমেন্ট ও বালু সরাসরি কারখানা থেকে কিনুন!',
    imageUrl: BRICK_RED_PHOTO,
    targetUrl: '#products',
    startDate: '2026-01-01',
    endDate: '2027-12-31',
    isActive: true,
    order: 1
  }
];
