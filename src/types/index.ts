export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string; // e.g. 'প্রতি ১,০০০টি', 'প্রতি বস্তা', 'প্রতি টন', 'প্রতি সিএফটি (ঘনফুট)'
  description: string;
  image: string;
  stock: number;
  isAvailable: boolean;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  category: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  image?: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  district: string;
  upazila: string;
  villageArea: string;
  detailedAddress: string;
  customerNotes?: string;
  orderNotes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  grandTotal: number;
  status: OrderStatus;
  paymentMethod: 'Cash on Delivery' | 'bKash / Nagad' | 'Bank Transfer';
  paymentStatus?: 'unpaid' | 'partial' | 'paid';
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  order: number;
}

export interface BannerAd {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  order: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  founderName: string;
  founderPhone: string;
  founderPhoto: string;
  founderTitle: string;
  officeAddress: string;
  helpline: string;
  defaultDeliveryFee: number;
  emergencyNotice?: string;
  firebaseProjectId?: string;
}

export interface ReleaseInfo {
  version: string;
  releaseDate: string;
  notes: string[];
}
