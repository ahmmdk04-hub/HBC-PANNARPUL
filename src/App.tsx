import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product, Order, OrderItem, Category, BannerAd, StoreSettings } from './types';
import { firebaseStore } from './services/firebase';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { ChallanModal } from './components/ChallanModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { BottomBannerAd } from './components/BottomBannerAd';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/Admin/AdminLogin';
import { AdminPanel } from './components/Admin/AdminPanel';
import { Sparkles, Phone, ShieldCheck, Truck, RefreshCw, AlertCircle } from 'lucide-react';
import { toBengaliNumber } from './utils/bengaliUtils';

export default function App() {
  // Navigation / Route state
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return window.location.pathname.startsWith('/admin');
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return !!firebaseStore.getAdminSession();
  });

  // Data states subscribed in real-time
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<BannerAd[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(firebaseStore.getLocalSettings());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Shopping Cart state
  const [cartItems, setCartItems] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem('hbc_cart_items_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [directCheckoutItems, setDirectCheckoutItems] = useState<OrderItem[] | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [challanViewOrder, setChallanViewOrder] = useState<Order | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);

  const productsSectionRef = useRef<HTMLDivElement>(null);

  // Keep cart persisted
  useEffect(() => {
    localStorage.setItem('hbc_cart_items_v1', JSON.stringify(cartItems));
  }, [cartItems]);

  // Handle URL changes & popstate
  useEffect(() => {
    const handlePopState = () => {
      setIsAdminRoute(window.location.pathname.startsWith('/admin'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
  };

  const navigateToStore = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
  };

  // Real-time synchronization
  useEffect(() => {
    const unsubProd = firebaseStore.subscribeProducts((list) => {
      setProducts(list);
      setIsLoading(false);
    });
    const unsubOrders = firebaseStore.subscribeOrders(setOrders);
    const unsubCats = firebaseStore.subscribeCategories(setCategories);
    const unsubBanners = firebaseStore.subscribeBanners(setBanners);
    const unsubSettings = firebaseStore.subscribeSettings(setSettings);

    return () => {
      unsubProd();
      unsubOrders();
      unsubCats();
      unsubBanners();
      unsubSettings();
    };
  }, []);

  // Filtered Products
  const displayedProducts = useMemo(() => {
    return products.filter((prod) => {
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = prod.name.toLowerCase().includes(q);
        const matchCat = prod.category.toLowerCase().includes(q);
        const matchDesc = prod.description.toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchDesc) return false;
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.productId === product.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          unitPrice: product.price, // ensure current price
          lineTotal: newQty * product.price
        };
        return updated;
      } else {
        const newItem: OrderItem = {
          productId: product.id,
          productName: product.name,
          category: product.category,
          unit: product.unit,
          unitPrice: product.price,
          quantity,
          lineTotal: quantity * product.price,
          image: product.image
        };
        return [...prev, newItem];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              lineTotal: quantity * item.unitPrice
            }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const handleDirectOrder = (product: Product, quantity: number) => {
    const item: OrderItem = {
      productId: product.id,
      productName: product.name,
      category: product.category,
      unit: product.unit,
      unitPrice: product.price,
      quantity,
      lineTotal: quantity * product.price,
      image: product.image
    };
    setDirectCheckoutItems([item]);
    setIsCheckoutOpen(true);
  };

  const handleCartProceedCheckout = () => {
    setDirectCheckoutItems(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setIsCheckoutOpen(false);
    // If regular cart checkout, clear cart
    if (!directCheckoutItems) {
      setCartItems([]);
    }
    setDirectCheckoutItems(null);
    setCompletedOrder(newOrder);
  };

  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Total cart item count
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // If on Admin route
  if (isAdminRoute) {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={() => setIsAdminAuthenticated(true)}
          onBackToStore={navigateToStore}
        />
      );
    }
    return (
      <AdminPanel
        onBackToStore={navigateToStore}
        onLogout={async () => {
          await firebaseStore.logoutAdmin();
          setIsAdminAuthenticated(false);
          navigateToStore();
        }}
        onViewChallan={(order) => setChallanViewOrder(order)}
      />
    );
  }

  // Public Store View
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-['Hind_Siliguri',sans-serif]">
      {/* 1. Header with Founder Info & Cart */}
      <Header
        settings={settings}
        cartCount={cartItemCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={navigateToAdmin}
        onOpenTracking={() => setIsTrackingOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* 2. Hero Section */}
      <HeroBanner
        settings={settings}
        onExploreProducts={scrollToProducts}
        onOpenTracking={() => setIsTrackingOpen(true)}
      />

      {/* 3. Products Catalog Section */}
      <main ref={productsSectionRef} id="products" className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:py-12">
        {/* Section Title & Category Filter */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-emerald-800 rounded-full"></span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                নির্মাণ সামগ্রীর তালিকা
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              যাচাইকৃত গুণমান ও সরাসরি ভাটার সুলভ মূল্য তালিকা।
            </p>
          </div>

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
          />
        </div>

        {/* Search filter indicator if active */}
        {searchQuery && (
          <div className="mb-6 flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <span>
              "{searchQuery}" এর জন্য {toBengaliNumber(displayedProducts.length)}টি পণ্য পাওয়া গেছে।
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="font-bold underline cursor-pointer"
            >
              ফিল্টার মুছুন
            </button>
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-stone-200 p-4"></div>
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
            <AlertCircle className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="font-bold text-stone-800 text-base">কোনো সামগ্রী পাওয়া যায়নি</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              অনুগ্রহ করে অন্য কোনো ক্যাটাগরি বা শব্দ দিয়ে অনুসন্ধান করুন। অথবা সরাসরি কল করুন:
            </p>
            <a
              href={`tel:${settings.founderPhone}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{toBengaliNumber(settings.founderPhone)}</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onDirectOrder={handleDirectOrder}
                onViewDetails={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-14 pt-10 border-t border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900">শতভাগ নিজস্ব ভাটার তৈরি</h4>
              <p className="text-xs text-stone-500 mt-0.5">
                প্রতিটি ইটে নিখুঁত HBC সিল মুদ্রিত এবং সঠিক সাইজ ও পাকা পোড়ানোর নিশ্চয়তা।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900">দ্রুত ট্রাক ডেলিভারি</h4>
              <p className="text-xs text-stone-500 mt-0.5">
                ঢাকা, গাজীপুর, নারায়ণগঞ্জ, কুমিল্লা সহ বাংলাদেশের যে কোনো সাইটে নিজস্ব পরিবহনে সরবরাহ।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900">ডিজিটাল চালান ও ক্যাশ অন ডেলিভারি</h4>
              <p className="text-xs text-stone-500 mt-0.5">
                অর্ডারের পরপরই স্বয়ংক্রিয় বাংলা চালান ডাউনলোড করুন এবং সাইটে পণ্য পেয়ে মূল্য পরিশোধ করুন।
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 4. Bottom Promotional Banner */}
      <BottomBannerAd banners={banners} />

      {/* 5. Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={navigateToAdmin}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToProducts();
        }}
      />

      {/* --- MODALS & DRAWERS --- */}

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          settings={settings}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onDirectOrder={handleDirectOrder}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleCartProceedCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={directCheckoutItems || cartItems}
        settings={settings}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Success Modal */}
      {completedOrder && (
        <OrderSuccessModal
          order={completedOrder}
          settings={settings}
          onClose={() => setCompletedOrder(null)}
          onViewChallan={(order) => {
            setCompletedOrder(null);
            setChallanViewOrder(order);
          }}
        />
      )}

      {/* Challan View & Print Modal */}
      {challanViewOrder && (
        <ChallanModal
          order={challanViewOrder}
          settings={settings}
          onClose={() => setChallanViewOrder(null)}
        />
      )}

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
        settings={settings}
        onViewChallan={(order) => {
          setIsTrackingOpen(false);
          setChallanViewOrder(order);
        }}
      />
    </div>
  );
}
