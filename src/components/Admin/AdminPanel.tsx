import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Layers, 
  Image as ImageIcon, 
  Settings, 
  Download, 
  LogOut, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle, 
  DollarSign, 
  Search, 
  Check, 
  AlertCircle, 
  Database,
  Phone,
  FileText,
  Upload,
  Camera
} from 'lucide-react';
import { Product, Order, Category, BannerAd, StoreSettings, OrderStatus } from '../../types';
import { firebaseStore, FirebaseCustomConfig } from '../../services/firebase';
import { formatTaka, toBengaliNumber, formatBengaliDate } from '../../utils/bengaliUtils';
import { generateBanglaChallanPdf } from '../../utils/challanPdf';
import { CURRENT_RELEASE, generateSourceZip, downloadSourceZipBlob } from '../../utils/sourceZip';

export const MATERIAL_IMAGE_PRESETS = [
  { id: 'brick-red', label: '১ নম্বর লাল ইট', image: '/assets/images/red_bricks.jpg' },
  { id: 'brick-hbc', label: 'HBC মার্কা ইট', image: '/assets/aistudio/855221105_1050044634737488_7794261989616121237_n_6bf75717.jpg' },
  { id: 'rod', label: '৬০ গ্রেড রড', image: '/assets/images/rod.jpg' },
  { id: 'cement', label: 'সিমেন্ট ব্যাগ', image: '/assets/images/cement.jpg' },
  { id: 'sand', label: 'সিলেট লাল বালু', image: '/assets/images/sand.jpg' },
  { id: 'paya', label: 'আরসিসি পায়া ও পিলার', image: '/assets/images/paya.jpg' },
];

interface AdminPanelProps {
  onBackToStore: () => void;
  onLogout: () => void;
  onViewChallan: (order: Order) => void;
}

type TabType = 'overview' | 'orders' | 'products' | 'categories' | 'banners' | 'settings' | 'sourcecode' | 'firebase';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBackToStore,
  onLogout,
  onViewChallan
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Real-time state synced from firebaseStore
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<BannerAd[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(firebaseStore.getLocalSettings());
  const [isFirebaseLive, setIsFirebaseLive] = useState<boolean>(firebaseStore.getIsConfigured());

  // Filters & Search
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [productSearch, setProductSearch] = useState<string>('');

  // Modals for Products
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalProductImage, setModalProductImage] = useState<string>('/assets/images/red_bricks.jpg');

  // Modals for Categories
  const [newCatName, setNewCatName] = useState<string>('');

  // Modals for Banners
  const [isBannerModalOpen, setIsBannerModalOpen] = useState<boolean>(false);
  const [editingBanner, setEditingBanner] = useState<BannerAd | null>(null);

  // Modals for Orders (Direct Admin Edit & Delete)
  const [isOrderEditModalOpen, setIsOrderEditModalOpen] = useState<boolean>(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orderActionMsg, setOrderActionMsg] = useState<string>('');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState<boolean>(false);

  // Admin Order Edit Handler
  const handleSaveOrderEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingOrder) return;
    try {
      await firebaseStore.updateOrder(editingOrder.id, {
        customerName: editingOrder.customerName,
        customerPhone: editingOrder.customerPhone,
        district: editingOrder.district,
        upazila: editingOrder.upazila,
        detailedAddress: editingOrder.detailedAddress,
        status: editingOrder.status,
        grandTotal: editingOrder.grandTotal,
        paymentStatus: editingOrder.paymentStatus,
        paymentMethod: editingOrder.paymentMethod,
        orderNotes: editingOrder.orderNotes,
      });
      setIsOrderEditModalOpen(false);
      setEditingOrder(null);
      setOrderActionMsg('চালান ও অর্ডার সফলভাবে আপডেট করা হয়েছে!');
      setTimeout(() => setOrderActionMsg(''), 4000);
    } catch (err: any) {
      alert('অর্ডার আপডেট ব্যর্থ হয়েছে: ' + (err?.message || err));
    }
  };

  // Admin Order Delete Handler
  const handleDeleteOrder = async (order: Order) => {
    const confirmed = window.confirm(
      `আপনি কি নিশ্চিতভাবে চালান নং ${order.orderNumber} (গ্রাহক: ${order.customerName}) সম্পূর্ণভাবে ডিলিট করতে চান?\n\nএটি পার্মানেন্টলি ডিলিট হয়ে যাবে।`
    );
    if (!confirmed) return;

    try {
      await firebaseStore.deleteOrder(order.id);
      setOrderActionMsg(`চালান নং ${order.orderNumber} সফলভাবে ডিলিট করা হয়েছে!`);
      setTimeout(() => setOrderActionMsg(''), 4000);
    } catch (err: any) {
      alert('অর্ডার ডিলিট করতে ব্যর্থ: ' + (err?.message || err));
    }
  };

  // Handle direct product image file upload (converts to lightweight compressed data URL)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) return;

      const img = new Image();
      img.onload = () => {
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setModalProductImage(compressed);
        } else {
          setModalProductImage(rawDataUrl);
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Handle founder photo file upload
  const handleFounderPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) return;

      const img = new Image();
      img.onload = () => {
        const maxDim = 600;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.88);
          setSettingsForm(prev => ({ ...prev, founderPhoto: compressed }));
        } else {
          setSettingsForm(prev => ({ ...prev, founderPhoto: rawDataUrl }));
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Firebase Config form state
  const [fbConfig, setFbConfig] = useState<FirebaseCustomConfig>(
    firebaseStore.getSavedFirebaseConfig() || {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: ''
    }
  );

  // Source ZIP download state
  const [isZipping, setIsZipping] = useState<boolean>(false);

  // Subscriptions
  useEffect(() => {
    const unsubProd = firebaseStore.subscribeProducts(setProducts);
    const unsubOrders = firebaseStore.subscribeOrders(setOrders);
    const unsubCats = firebaseStore.subscribeCategories(setCategories);
    const unsubBanners = firebaseStore.subscribeBanners(setBanners);
    const unsubSettings = firebaseStore.subscribeSettings((s) => {
      setSettings(s);
      setSettingsForm(s);
    });

    return () => {
      unsubProd();
      unsubOrders();
      unsubCats();
      unsubBanners();
      unsubSettings();
    };
  }, []);

  // Compute Stats
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const confirmedOrdersCount = orders.filter(o => o.status === 'Confirmed' || o.status === 'Processing').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'Delivered').length;
  const cancelledOrdersCount = orders.filter(o => o.status === 'Cancelled').length;
  const totalSales = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  // Filtered Orders
  const filteredOrders = orders.filter(order => {
    if (orderFilter !== 'all' && order.status !== orderFilter) return false;
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      const matchNo = order.orderNumber.toLowerCase().includes(q);
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchPhone = order.customerPhone.includes(q);
      const matchDist = order.district.toLowerCase().includes(q);
      if (!matchNo && !matchName && !matchPhone && !matchDist) return false;
    }
    return true;
  });

  // Filtered Products
  const filteredProducts = products.filter(p => {
    if (!productSearch) return true;
    const q = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  // Save or update product
  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const price = parseFloat(formData.get('price') as string) || 0;
    const unit = formData.get('unit') as string;
    const description = formData.get('description') as string;
    // Use the directly added/uploaded modal image, or the editing product's existing image
    const image = modalProductImage || editingProduct?.image || '/assets/images/red_bricks.jpg';
    const stock = parseInt(formData.get('stock') as string, 10) || 0;
    const isAvailable = formData.get('isAvailable') === 'on';
    const isFeatured = formData.get('isFeatured') === 'on';

    const prodToSave: Product = {
      id: editingProduct ? editingProduct.id : `prod_${Date.now()}`,
      name,
      category,
      price,
      unit,
      description,
      image,
      stock,
      isAvailable,
      isFeatured,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString()
    };

    await firebaseStore.saveProduct(prodToSave);
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await firebaseStore.saveSettings(settingsForm);
    setSettingsSavedMsg(true);
    setTimeout(() => setSettingsSavedMsg(false), 3000);
  };

  // Download Source ZIP
  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const blob = await generateSourceZip();
      downloadSourceZipBlob(blob, `hbc-panarpul-source-${CURRENT_RELEASE.version}.zip`);
      setIsZipping(false);
    } catch (e) {
      console.error(e);
      setIsZipping(false);
      alert('সোর্স জিপ প্রস্তুতিতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-['Hind_Siliguri',sans-serif]">
      {/* Top Admin Navbar */}
      <header className="bg-emerald-950 text-white px-4 py-3 border-b border-emerald-900 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="p-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="ওয়েবসাইটে ফিরুন"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  {settings.storeName} — অ্যাডমিন প্যানেল
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  নিরাপদ মোড
                </span>
              </div>
              <p className="text-[11px] text-emerald-300">
                ফাউন্ডার: {settings.founderName} (ফোন: {toBengaliNumber(settings.founderPhone)})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Firebase Live Status */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-emerald-900/80 border border-emerald-800">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>{isFirebaseLive ? 'ফায়ারবেস লাইভ কানেক্টেড' : 'লোকাল ডাটাবেস সিঙ্ক'}</span>
            </div>

            <button
              onClick={onBackToStore}
              className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-xs font-semibold cursor-pointer transition-all"
            >
              ওয়েবসাইট দেখুন
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-lg bg-red-950 hover:bg-red-900 text-red-200 transition-colors cursor-pointer"
              title="লগআউট"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content & Tabs */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 bg-white rounded-2xl p-3 border border-stone-200 shadow-xs h-fit space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-emerald-900 text-amber-300 shadow-sm'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>ড্যাশবোর্ড ওভারভিউ</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-emerald-900 text-amber-300 shadow-sm'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4" />
              <span>অর্ডার ব্যবস্থাপনা</span>
            </div>
            {pendingOrdersCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-emerald-950 text-xs font-bold">
                {toBengaliNumber(pendingOrdersCount)}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-emerald-900 text-amber-300 shadow-sm'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>পণ্য তালিকা ও মূল্য</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-emerald-900 text-amber-300 shadow-sm'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>ক্যাটাগরি সমূহ</span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'banners'
                ? 'bg-emerald-900 text-amber-300 shadow-sm'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>বিজ্ঞাপন ব্যানার</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-emerald-900 text-amber-300 shadow-sm'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>প্রতিষ্ঠাতা ও স্টোর সেটিংস</span>
          </button>

          <button
            onClick={() => setActiveTab('sourcecode')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'sourcecode'
                ? 'bg-emerald-900 text-amber-300 shadow-sm'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>সোর্স কোড ও আপডেট (.ZIP)</span>
          </button>

          <button
            onClick={() => setActiveTab('firebase')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'firebase'
                ? 'bg-emerald-900 text-amber-300 shadow-sm'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>ফায়ারবেস ডাটাবেস সেটিংস</span>
          </button>
        </aside>

        {/* Tab Body */}
        <main className="flex-1 min-w-0">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-xs font-semibold text-stone-500">মোট বিক্রয় (রেকর্ডকৃত)</span>
                  <div className="text-2xl font-black text-emerald-950 mt-1">
                    {formatTaka(totalSales)}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">চালান ভেরিফায়েড</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-xs font-semibold text-stone-500">সর্বমোট অর্ডার</span>
                  <div className="text-2xl font-black text-stone-900 mt-1">
                    {toBengaliNumber(totalOrdersCount)}
                  </div>
                  <span className="text-[11px] text-stone-400">সকল চালান মিলিয়ে</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-xs font-semibold text-stone-500">অপেক্ষমাণ (Pending)</span>
                  <div className="text-2xl font-black text-amber-600 mt-1">
                    {toBengaliNumber(pendingOrdersCount)}
                  </div>
                  <span className="text-[11px] text-amber-700">কনফার্মেশনের অপেক্ষায়</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-xs font-semibold text-stone-500">অনুমোদিত ও প্রক্রিয়াধীন</span>
                  <div className="text-2xl font-black text-blue-600 mt-1">
                    {toBengaliNumber(confirmedOrdersCount)}
                  </div>
                  <span className="text-[11px] text-blue-700">ডেলিভারির পথে</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-xs font-semibold text-stone-500">সফলভাবে ডেলিভার্ড</span>
                  <div className="text-2xl font-black text-emerald-700 mt-1">
                    {toBengaliNumber(deliveredOrdersCount)}
                  </div>
                  <span className="text-[11px] text-emerald-700">গ্রাহক পণ্য গ্রহণ করেছেন</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-xs font-semibold text-stone-500">বাতিলকৃত অর্ডার</span>
                  <div className="text-2xl font-black text-red-600 mt-1">
                    {toBengaliNumber(cancelledOrdersCount)}
                  </div>
                  <span className="text-[11px] text-red-700">বাতিল বা ফেরত</span>
                </div>
              </div>

              {/* Founder Profile Snapshot */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={settings.founderPhoto}
                    alt={settings.founderName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-400"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/aistudio/01_31f695e4.png';
                    }}
                  />
                  <div>
                    <span className="text-xs font-bold text-amber-700">{settings.founderTitle}</span>
                    <h3 className="text-base font-extrabold text-stone-900">{settings.founderName}</h3>
                    <p className="text-xs text-stone-600">মোবাইল: {toBengaliNumber(settings.founderPhone)}</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold cursor-pointer"
                >
                  ফাউন্ডার তথ্য পরিবর্তন করুন
                </button>
              </div>

              {/* Recent Orders List */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-stone-900">সাম্প্রতিক অর্ডার সমূহ</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-emerald-800 font-bold hover:underline cursor-pointer"
                  >
                    সকল অর্ডার দেখুন →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-stone-400 text-center py-8">এখনো কোনো অর্ডার পাওয়া যায়নি।</p>
                ) : (
                  <div className="divide-y divide-stone-100 text-xs">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-emerald-900">{o.orderNumber}</span>
                            <span className="text-stone-700 font-medium">{o.customerName}</span>
                          </div>
                          <span className="text-[11px] text-stone-500">
                            {o.district}, {o.upazila} • {formatBengaliDate(o.createdAt)}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-emerald-950 block">{formatTaka(o.grandTotal)}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 font-semibold text-stone-700">
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <h3 className="font-bold text-base text-stone-900">
                  অর্ডার ও চালান ব্যবস্থাপনা ({toBengaliNumber(filteredOrders.length)})
                </h3>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="চালান নং বা ফোন..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs focus:border-emerald-700 outline-hidden"
                    />
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>

                  <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs bg-white focus:border-emerald-700 outline-hidden"
                  >
                    <option value="all">সকল স্ট্যাটাস</option>
                    <option value="Pending">Pending (অপেক্ষমাণ)</option>
                    <option value="Confirmed">Confirmed (অনুমোদিত)</option>
                    <option value="Processing">Processing (প্রক্রিয়াধীন)</option>
                    <option value="Dispatched">Dispatched (ট্রাকে প্রেরিত)</option>
                    <option value="Delivered">Delivered (ডেলিভার্ড)</option>
                    <option value="Cancelled">Cancelled (বাতিল)</option>
                  </select>
                </div>
              </div>

              {orderActionMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{orderActionMsg}</span>
                </div>
              )}

              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-xs">
                  কোনো অর্ডার খুঁজে পাওয়া যায়নি।
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-600 font-bold border-y border-stone-200">
                      <tr>
                        <th className="p-3">চালান নং ও সময়</th>
                        <th className="p-3">গ্রাহক ও মোবাইল</th>
                        <th className="p-3">ঠিকানা</th>
                        <th className="p-3">পণ্য সামগ্রী</th>
                        <th className="p-3 text-right">মোট টাকা</th>
                        <th className="p-3 text-center">স্ট্যাটাস পরিবর্তন</th>
                        <th className="p-3 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="p-3">
                            <span className="font-mono font-bold text-emerald-950 block">{order.orderNumber}</span>
                            <span className="text-[11px] text-stone-400">{formatBengaliDate(order.createdAt)}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-stone-900 block">{order.customerName}</span>
                            <a href={`tel:${order.customerPhone}`} className="text-emerald-800 hover:underline">
                              {toBengaliNumber(order.customerPhone)}
                            </a>
                          </td>
                          <td className="p-3 max-w-xs truncate">
                            <span className="font-medium text-stone-800 block">{order.upazila}, {order.district}</span>
                            <span className="text-[11px] text-stone-500">{order.detailedAddress}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-stone-800">{toBengaliNumber(order.items.length)} আইটেম:</span>
                            <div className="text-[11px] text-stone-500">
                              {order.items.map((i, idx) => (
                                <span key={idx}>{i.productName} ({toBengaliNumber(i.quantity)} {i.unit}){idx < order.items.length - 1 ? ', ' : ''}</span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3 text-right font-black text-emerald-950 text-sm">
                            {formatTaka(order.grandTotal)}
                          </td>
                          <td className="p-3 text-center">
                            <select
                              value={order.status}
                              onChange={(e) => firebaseStore.updateOrderStatus(order.id, e.target.value as OrderStatus)}
                              className="px-2 py-1 rounded-lg border border-stone-300 text-xs font-semibold bg-white cursor-pointer focus:ring-1 focus:ring-emerald-700"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Dispatched">Dispatched</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-3 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => {
                                setEditingOrder({ ...order });
                                setIsOrderEditModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300/60 cursor-pointer"
                              title="অর্ডার ও চালান সরাসরি সম্পাদনা"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-300/60 cursor-pointer"
                              title="অর্ডার সরাসরি ডিলিট করুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onViewChallan(order)}
                              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                              title="চালান প্রিভিউ ও প্রিন্ট"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => generateBanglaChallanPdf(order, settings)}
                              className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-amber-300 cursor-pointer"
                              title="পিডিএফ চালান ডাউনলোড"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <h3 className="font-bold text-base text-stone-900">
                  নির্মাণ সামগ্রী ও পণ্য তালিকা ({toBengaliNumber(filteredProducts.length)})
                </h3>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="পণ্য খুঁজুন..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs focus:border-emerald-700 outline-hidden"
                    />
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>

                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setModalProductImage('/assets/images/red_bricks.jpg');
                      setIsProductModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নতুন পণ্য যোগ করুন</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 font-bold border-y border-stone-200">
                    <tr>
                      <th className="p-3">ছবি</th>
                      <th className="p-3">পণ্যের নাম</th>
                      <th className="p-3">ক্যাটাগরি</th>
                      <th className="p-3">একক মূল্য</th>
                      <th className="p-3">একক</th>
                      <th className="p-3">মজুদ (স্টক)</th>
                      <th className="p-3 text-center">স্ট্যাটাস</th>
                      <th className="p-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="p-3">
                          <img
                            src={p.image || '/assets/aistudio/855221105_1050044634737488_7794261989616121237_n_6bf75717.jpg'}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/aistudio/855221105_1050044634737488_7794261989616121237_n_6bf75717.jpg';
                            }}
                          />
                        </td>
                        <td className="p-3 font-bold text-stone-900 max-w-xs">
                          {p.name}
                          {p.isFeatured && (
                            <span className="ml-1.5 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                              ফিচার্ড
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-3 font-black text-emerald-950 text-sm">
                          {formatTaka(p.price)}
                        </td>
                        <td className="p-3 text-stone-600 font-medium">
                          {p.unit}
                        </td>
                        <td className="p-3 text-stone-700 font-bold">
                          {toBengaliNumber(p.stock)}
                        </td>
                        <td className="p-3 text-center">
                          {p.isAvailable ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                              সক্রিয়
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-semibold">
                              স্টক শেষ
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setModalProductImage(p.image || '/assets/images/red_bricks.jpg');
                              setIsProductModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 cursor-pointer"
                            title="সম্পাদনা করুন"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`আপনি কি "${p.name}" পণ্যটি মুছে ফেলতে চান?`)) {
                                firebaseStore.deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-red-50 hover:text-red-700 text-stone-700 cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CATEGORIES MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-5">
              <h3 className="font-bold text-base text-stone-900">
                পণ্যের ক্যাটাগরি তালিকা ({toBengaliNumber(categories.length)})
              </h3>

              {/* Add category form */}
              <div className="flex gap-2 max-w-md">
                <input
                  type="text"
                  placeholder="নতুন ক্যাটাগরির নাম (যেমন: পায়া, পাইপ...)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:border-emerald-700 outline-hidden"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (newCatName.trim()) {
                      await firebaseStore.saveCategory({
                        id: `cat_${Date.now()}`,
                        name: newCatName.trim(),
                        order: categories.length + 1
                      });
                      setNewCatName('');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold text-xs cursor-pointer"
                >
                  যোগ করুন
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-800" />
                      <span className="font-bold text-sm text-stone-900">{cat.name}</span>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`আপনি কি "${cat.name}" ক্যাটাগরি মুছে ফেলতে চান?`)) {
                          firebaseStore.deleteCategory(cat.id);
                        }
                      }}
                      className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: BANNERS MANAGEMENT */}
          {activeTab === 'banners' && (
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-stone-900">
                  বিজ্ঞাপন ও প্রমোশনাল ব্যানার ({toBengaliNumber(banners.length)})
                </h3>
                <button
                  onClick={() => {
                    setEditingBanner(null);
                    setIsBannerModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন ব্যানার যোগ করুন</span>
                </button>
              </div>

              <div className="space-y-3">
                {banners.map((b) => (
                  <div key={b.id} className="p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center gap-4 bg-stone-50">
                    <img
                      src={b.imageUrl}
                      alt={b.title}
                      className="w-24 h-14 object-cover rounded-lg border border-stone-300 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/aistudio/855221105_1050044634737488_7794261989616121237_n_6bf75717.jpg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">{b.title}</h4>
                      <p className="text-[11px] text-stone-500">লিংক: {b.targetUrl || 'নেই'}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => firebaseStore.saveBanner({ ...b, isActive: !b.isActive })}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                          b.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {b.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('ব্যানারটি মুছে ফেলতে চান?')) {
                            firebaseStore.deleteBanner(b.id);
                          }
                        }}
                        className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: FOUNDER & STORE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div>
                  <h3 className="font-bold text-base text-stone-900">প্রতিষ্ঠাতা ও ব্যবসা সেটিংস</h3>
                  <p className="text-xs text-stone-500">চালান ও ওয়েবসাইটে প্রদর্শিত তথ্যাবলি পরিবর্তন করুন।</p>
                </div>
                {settingsSavedMsg && (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>সংরক্ষিত হয়েছে!</span>
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">প্রতিষ্ঠানের নাম</label>
                    <input
                      type="text"
                      value={settingsForm.storeName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">ট্যাগলাইন / স্লোগান</label>
                    <input
                      type="text"
                      value={settingsForm.tagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">ফাউন্ডারের নাম *</label>
                    <input
                      type="text"
                      value={settingsForm.founderName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, founderName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-hidden font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">পদবি</label>
                    <input
                      type="text"
                      value={settingsForm.founderTitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, founderTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">ফাউন্ডারের মোবাইল নম্বর *</label>
                    <input
                      type="text"
                      value={settingsForm.founderPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, founderPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-hidden font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">কাস্টমার সাপোর্ট হটলাইন</label>
                    <input
                      type="text"
                      value={settingsForm.helpline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, helpline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">ডিফল্ট ট্রাক ডেলিভারি চার্জ (টাকা)</label>
                    <input
                      type="number"
                      value={settingsForm.defaultDeliveryFee}
                      onChange={(e) => setSettingsForm({ ...settingsForm, defaultDeliveryFee: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-hidden font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1 flex items-center justify-between">
                      <span>ফাউন্ডারের ছবি</span>
                      <span className="text-[10px] text-emerald-700 font-bold">আপলোড অপশন</span>
                    </label>
                    <div className="flex items-center gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200">
                      <img
                        src={settingsForm.founderPhoto || '/assets/aistudio/01_31f695e4.png'}
                        alt="Founder"
                        className="w-10 h-10 rounded-full object-cover border border-amber-400 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/aistudio/01_31f695e4.png';
                        }}
                      />
                      <label className="flex-1 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFounderPhotoUpload}
                        />
                        <div className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all text-center">
                          <Upload className="w-3.5 h-3.5" />
                          <span>নতুন ছবি আপলোড করুন</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">অফিস ও ভাটার স্থায়ী ঠিকানা</label>
                  <input
                    type="text"
                    value={settingsForm.officeAddress}
                    onChange={(e) => setSettingsForm({ ...settingsForm, officeAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-hidden"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold text-xs cursor-pointer shadow-md transition-all"
                  >
                    সেটিংস সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 7: SOURCE CODE & UPDATES */}
          {activeTab === 'sourcecode' && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-stone-900">Source Code & Releases</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                      {CURRENT_RELEASE.version}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    রিলিজের তারিখ: {CURRENT_RELEASE.releaseDate}
                  </p>
                </div>

                <button
                  onClick={handleDownloadZip}
                  disabled={isZipping}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{isZipping ? 'জিপ তৈরি হচ্ছে...' : 'সম্পূর্ণ সোর্স কোড ডাউনলোড (.ZIP)'}</span>
                </button>
              </div>

              {/* Release Notes */}
              <div>
                <h4 className="font-bold text-xs text-stone-800 uppercase tracking-wider mb-2.5">
                  বর্তমান রিলিজ নোটস ({CURRENT_RELEASE.version}):
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-600 bg-stone-50 p-4 rounded-xl border border-stone-200">
                  {CURRENT_RELEASE.notes.map((n, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                <h4 className="font-bold">Netlify ডিপ্লয়মেন্ট নির্দেশিকা:</h4>
                <p>১. ডাউনলোড করা ZIP ফাইলটি আনজিপ করুন।</p>
                <p>২. টার্মিনালে রান করুন: <code className="bg-white px-2 py-0.5 rounded font-mono border">npm install</code> এবং এরপর <code className="bg-white px-2 py-0.5 rounded font-mono border">npm run build</code></p>
                <p>৩. Netlify এ বিল্ড কমান্ড দিন <code className="bg-white px-2 py-0.5 rounded font-mono border">npm run build</code> এবং Publish directory দিন <code className="bg-white px-2 py-0.5 rounded font-mono border">dist</code>।</p>
              </div>
            </div>
          )}

          {/* TAB 8: FIREBASE SETTINGS */}
          {activeTab === 'firebase' && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div>
                  <h3 className="font-bold text-base text-stone-900">ফায়ারবেস ডাটাবেস ও স্টোরেজ সংযোগ</h3>
                  <p className="text-xs text-stone-500">আপনার নিজস্ব Firebase Project এর ক্লায়েন্ট কি কনফিগার করুন।</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isFirebaseLive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isFirebaseLive ? 'লাইভ ফায়ারবেস কার্যকর' : 'অফলাইন লোকাল রেজিলিয়েন্ট মোড'}
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">API Key</label>
                    <input
                      type="text"
                      placeholder="AIzaSy..."
                      value={fbConfig.apiKey}
                      onChange={(e) => setFbConfig({ ...fbConfig, apiKey: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Project ID</label>
                    <input
                      type="text"
                      placeholder="hbc-panarpul-123"
                      value={fbConfig.projectId}
                      onChange={(e) => setFbConfig({ ...fbConfig, projectId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Auth Domain</label>
                    <input
                      type="text"
                      placeholder="hbc-panarpul-123.firebaseapp.com"
                      value={fbConfig.authDomain}
                      onChange={(e) => setFbConfig({ ...fbConfig, authDomain: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">App ID</label>
                    <input
                      type="text"
                      placeholder="1:123456789:web:abcdef"
                      value={fbConfig.appId}
                      onChange={(e) => setFbConfig({ ...fbConfig, appId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (!fbConfig.apiKey || !fbConfig.projectId) {
                        alert('API Key এবং Project ID উভয়ই প্রদান করা আবশ্যক।');
                        return;
                      }
                      firebaseStore.saveCustomFirebaseConfig(fbConfig);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold text-xs cursor-pointer shadow-md"
                  >
                    ফায়ারবেস কনফিগারেশন সংরক্ষণ ও কানেক্ট করুন
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-stone-200">
            <h3 className="font-bold text-base text-stone-900 mb-4">
              {editingProduct ? 'পণ্য তথ্য ও মূল্য সম্পাদনা' : 'নতুন নির্মাণ সামগ্রী যোগ করুন'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">পণ্যের নাম (বাংলায়) *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingProduct?.name || ''}
                  placeholder="যেমন: ১ নম্বর ইট (First Class Auto Brick)"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">ক্যাটাগরি *</label>
                  <select
                    name="category"
                    defaultValue={editingProduct?.category || 'ইট'}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white outline-hidden"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">মূল্য (টাকায়) *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    defaultValue={editingProduct?.price || 15000}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-hidden font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">পরিমাপের একক *</label>
                  <input
                    type="text"
                    name="unit"
                    required
                    defaultValue={editingProduct?.unit || 'প্রতি ১,০০০টি'}
                    placeholder="যেমন: প্রতি ১,০০০টি, প্রতি বস্তা, প্রতি টন"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">মজুদ সংখ্যা (Stock)</label>
                  <input
                    type="number"
                    name="stock"
                    defaultValue={editingProduct?.stock || 500000}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-hidden"
                  />
                </div>
              </div>

              {/* Direct Image Upload & Gallery Picker (No URL or Path required) */}
              <div className="space-y-2 pt-1 pb-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-stone-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-700" />
                    <span>পণ্যের ছবি যুক্ত করুন (ছবি আপলোড / সিলেক্ট করুন)</span>
                  </label>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                    ইউআরএল মুক্ত ডিরেক্ট ছবি
                  </span>
                </div>

                {/* Upload Box & Image Preview */}
                <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="relative group shrink-0">
                    <img
                      src={modalProductImage || '/assets/images/red_bricks.jpg'}
                      alt="Product preview"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border-2 border-emerald-700 shadow-md bg-white"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/images/red_bricks.jpg';
                      }}
                    />
                    <span className="absolute bottom-1 right-1 text-[9px] bg-emerald-900/80 text-white px-1 rounded font-bold">
                      প্রিভিউ
                    </span>
                  </div>

                  <div className="flex-1 space-y-1.5 w-full">
                    <label className="block cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageFileUpload}
                      />
                      <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 text-center cursor-pointer">
                        <Upload className="w-4 h-4 text-amber-300" />
                        <span>কম্পিউটার বা মোবাইল থেকে ছবি আপলোড করুন</span>
                      </div>
                    </label>
                    <p className="text-[10px] text-stone-500">
                      কোনো ইউআরএল বা পাথ লেখার প্রয়োজন নেই। আপনার ফোন বা গ্যালারি থেকে যেকোনো ছবি সিলেক্ট করলেই স্বয়ংক্রিয়ভাবে যুক্ত হয়ে যাবে।
                    </p>
                  </div>
                </div>

                {/* Quick Material Presets */}
                <div>
                  <span className="text-[11px] font-bold text-stone-700 block mb-1.5">
                    অথবা কালারিন নির্মাণ সামগ্রীর ছবি থেকে ক্লিক করে সিলেক্ট করুন:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {MATERIAL_IMAGE_PRESETS.map((preset) => {
                      const isSelected = modalProductImage === preset.image;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setModalProductImage(preset.image)}
                          className={`flex flex-col items-center p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/30 font-bold text-emerald-950'
                              : 'border-stone-200 bg-white hover:border-emerald-300 text-stone-700'
                          }`}
                        >
                          <img
                            src={preset.image}
                            alt={preset.label}
                            className="w-10 h-10 rounded-lg object-cover mb-1 border border-stone-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/images/red_bricks.jpg';
                            }}
                          />
                          <span className="text-[10px] leading-tight line-clamp-1">
                            {preset.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">বিস্তারিত বিবরণ</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingProduct?.description || ''}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-hidden"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    defaultChecked={editingProduct ? editingProduct.isAvailable : true}
                    className="rounded text-emerald-700"
                  />
                  <span className="font-semibold text-stone-800">স্টকে বিদ্যমান</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    defaultChecked={editingProduct ? editingProduct.isFeatured : false}
                    className="rounded text-amber-600"
                  />
                  <span className="font-semibold text-stone-800">জনপ্রিয় (Featured)</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Banner Add Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 text-xs space-y-3.5">
            <h3 className="font-bold text-base text-stone-900">বিজ্ঞাপন ব্যানার যোগ করুন</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget);
                await firebaseStore.saveBanner({
                  id: `banner_${Date.now()}`,
                  title: form.get('title') as string,
                  imageUrl: (form.get('imageUrl') as string) || '/assets/aistudio/855221105_1050044634737488_7794261989616121237_n_6bf75717.jpg',
                  targetUrl: (form.get('targetUrl') as string) || '#products',
                  isActive: true,
                  order: banners.length + 1
                });
                setIsBannerModalOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-semibold text-stone-700 mb-1">ব্যানার শিরোনাম *</label>
                <input type="text" name="title" required className="w-full px-3 py-2 rounded-xl border border-stone-300" />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">ছবি লিংক (Image URL)</label>
                <input type="text" name="imageUrl" defaultValue="/assets/aistudio/855221105_1050044634737488_7794261989616121237_n_6bf75717.jpg" className="w-full px-3 py-2 rounded-xl border border-stone-300" />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">টার্গেট লিংক (URL)</label>
                <input type="text" name="targetUrl" defaultValue="#products" className="w-full px-3 py-2 rounded-xl border border-stone-300" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsBannerModalOpen(false)} className="px-4 py-2 border rounded-xl">বাতিল</button>
                <button type="submit" className="px-5 py-2 bg-emerald-800 text-amber-300 font-bold rounded-xl">যোগ করুন</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Edit Modal (Admin Full Control) */}
      {isOrderEditModalOpen && editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 text-xs my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  সরাসরি অ্যাডমিন সম্পাদন
                </span>
                <h3 className="font-black text-base text-stone-900 mt-1">
                  চালান ও অর্ডার সম্পাদনা: <span className="font-mono text-emerald-900">{editingOrder.orderNumber}</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOrderEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOrderEdit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">গ্রাহকের নাম *</label>
                  <input
                    type="text"
                    required
                    value={editingOrder.customerName}
                    onChange={(e) => setEditingOrder({ ...editingOrder, customerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-700 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">গ্রাহকের মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={editingOrder.customerPhone}
                    onChange={(e) => setEditingOrder({ ...editingOrder, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono focus:border-emerald-700 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">জেলা *</label>
                  <input
                    type="text"
                    required
                    value={editingOrder.district}
                    onChange={(e) => setEditingOrder({ ...editingOrder, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-700 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">উপজেলা / থানা *</label>
                  <input
                    type="text"
                    required
                    value={editingOrder.upazila}
                    onChange={(e) => setEditingOrder({ ...editingOrder, upazila: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-700 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">ডেলিভারির বিস্তারিত ঠিকানা *</label>
                <textarea
                  rows={2}
                  required
                  value={editingOrder.detailedAddress}
                  onChange={(e) => setEditingOrder({ ...editingOrder, detailedAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-700 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">অর্ডার স্ট্যাটাস</label>
                  <select
                    value={editingOrder.status}
                    onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value as OrderStatus })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold bg-white focus:border-emerald-700 outline-hidden"
                  >
                    <option value="Pending">Pending (অপেক্ষমাণ)</option>
                    <option value="Confirmed">Confirmed (অনুমোদিত)</option>
                    <option value="Processing">Processing (প্রক্রিয়াধীন)</option>
                    <option value="Dispatched">Dispatched (ট্রাকে প্রেরিত)</option>
                    <option value="Delivered">Delivered (ডেলিভার্ড)</option>
                    <option value="Cancelled">Cancelled (বাতিল)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">মোট মূল্য (Grand Total - ৳)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingOrder.grandTotal}
                    onChange={(e) => setEditingOrder({ ...editingOrder, grandTotal: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold text-emerald-900 focus:border-emerald-700 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">পেমেন্ট মেথড</label>
                  <select
                    value={editingOrder.paymentMethod}
                    onChange={(e) => setEditingOrder({ ...editingOrder, paymentMethod: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white focus:border-emerald-700 outline-hidden"
                  >
                    <option value="Cash on Delivery">ক্যাশ অন ডেলিভারি (Cash on Delivery)</option>
                    <option value="bKash / Nagad">বিকাশ / নগদ (bKash / Nagad)</option>
                    <option value="Bank Transfer">ব্যাংক ট্রান্সফার (Bank Transfer)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">পেমেন্ট অবস্থা</label>
                  <select
                    value={editingOrder.paymentStatus || 'unpaid'}
                    onChange={(e) => setEditingOrder({ ...editingOrder, paymentStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white focus:border-emerald-700 outline-hidden"
                  >
                    <option value="unpaid">বকেয়া / অপরিশোধিত (Unpaid)</option>
                    <option value="partial">আংশিক পরিশোধ (Partial)</option>
                    <option value="paid">সম্পূর্ণ পরিশোধিত (Paid)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">ডেলিভারি নোট বা বিশেষ মন্তব্য</label>
                <input
                  type="text"
                  value={editingOrder.orderNotes || ''}
                  onChange={(e) => setEditingOrder({ ...editingOrder, orderNotes: e.target.value })}
                  placeholder="যেমন: দ্রুত সাইটে আনলোড করার ব্যবস্থা করতে হবে"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-700 outline-hidden"
                />
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-800 block mb-1">অর্ডারকৃত আইটেম তালিকা ({toBengaliNumber(editingOrder.items.length)}টি):</span>
                <div className="space-y-1 max-h-24 overflow-y-auto divide-y divide-stone-200">
                  {editingOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 text-[11px]">
                      <span>{it.productName} ({toBengaliNumber(it.quantity)} {it.unit})</span>
                      <span className="font-mono font-bold text-stone-900">{formatTaka(it.lineTotal)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => handleDeleteOrder(editingOrder)}
                  className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>অর্ডার ডিলিট করুন</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOrderEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-semibold cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>পরিবর্তন সংরক্ষণ করুন</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
