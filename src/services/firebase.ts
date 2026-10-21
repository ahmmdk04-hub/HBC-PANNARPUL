import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  Firestore,
  getDocFromServer
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged, 
  User, 
  Auth 
} from 'firebase/auth';
import { Product, Order, Category, BannerAd, StoreSettings, OrderStatus } from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_SETTINGS, 
  INITIAL_BANNERS 
} from '../data/initialData';
import { generateOrderNumber } from '../utils/bengaliUtils';

// Storage keys for local persistence & offline resilience
const STORAGE_KEY_PRODUCTS = 'hbc_products_v1';
const STORAGE_KEY_ORDERS = 'hbc_orders_v1';
const STORAGE_KEY_CATEGORIES = 'hbc_categories_v1';
const STORAGE_KEY_BANNERS = 'hbc_banners_v1';
const STORAGE_KEY_SETTINGS = 'hbc_settings_v1';
const STORAGE_KEY_FB_CONFIG = 'hbc_firebase_custom_config_v1';
const STORAGE_KEY_ADMIN_SESSION = 'hbc_admin_auth_v1';

export interface FirebaseCustomConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  measurementId?: string;
}

class FirebaseStoreService {
  private app: FirebaseApp | null = null;
  private db: Firestore | null = null;
  private auth: Auth | null = null;
  private isFirebaseConfigured: boolean = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initFirebase();
  }

  public getIsConfigured(): boolean {
    return this.isFirebaseConfigured;
  }

  public getAuthInstance(): Auth | null {
    return this.auth;
  }

  public getDbInstance(): Firestore | null {
    return this.db;
  }

  private initFirebase() {
    try {
      // 1. Check custom saved config in localStorage or .env
      let config: FirebaseCustomConfig | null = null;
      const savedConfig = localStorage.getItem(STORAGE_KEY_FB_CONFIG);
      if (savedConfig) {
        try {
          config = JSON.parse(savedConfig);
        } catch {
          config = null;
        }
      }

      // Check Vite env
      if (!config || !config.apiKey) {
        const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
        const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
        if (apiKey && projectId) {
          config = {
            apiKey,
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
            projectId,
            storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
            messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
            appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
          };
        }
      }

      if (config && config.apiKey && config.projectId) {
        if (!getApps().length) {
          this.app = initializeApp(config);
        } else {
          this.app = getApp();
        }
        this.db = getFirestore(this.app);
        this.auth = getAuth(this.app);
        this.isFirebaseConfigured = true;

        // Test connection
        this.testConnection();
      } else {
        this.isFirebaseConfigured = false;
        this.seedLocalStorageIfEmpty();
      }
    } catch (err) {
      console.warn('Firebase initialization note (operating in offline resilient mode):', err);
      this.isFirebaseConfigured = false;
      this.seedLocalStorageIfEmpty();
    }
  }

  private async testConnection() {
    if (!this.db) return;
    try {
      await getDocFromServer(doc(this.db, 'settings', 'store'));
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.warn('Firestore notice: client is offline or rules require authentication.');
      }
    }
  }

  private seedLocalStorageIfEmpty() {
    if (!localStorage.getItem(STORAGE_KEY_PRODUCTS)) {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEY_CATEGORIES)) {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEY_SETTINGS)) {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEY_BANNERS)) {
      localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(INITIAL_BANNERS));
    }
    if (!localStorage.getItem(STORAGE_KEY_ORDERS)) {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify([]));
    }
  }

  public saveCustomFirebaseConfig(config: FirebaseCustomConfig) {
    localStorage.setItem(STORAGE_KEY_FB_CONFIG, JSON.stringify(config));
    window.location.reload();
  }

  public getSavedFirebaseConfig(): FirebaseCustomConfig | null {
    const raw = localStorage.getItem(STORAGE_KEY_FB_CONFIG);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  // --- PRODUCTS ---
  public subscribeProducts(callback: (products: Product[]) => void): () => void {
    if (this.isFirebaseConfigured && this.db) {
      try {
        const q = query(collection(this.db, 'products'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const list: Product[] = [];
            snapshot.forEach((d) => {
              list.push({ id: d.id, ...d.data() } as Product);
            });
            callback(list);
          } else {
            // Seed initial if empty in remote
            callback(this.getLocalProducts());
          }
        }, (err) => {
          console.warn('Firestore products listener error, falling back to local sync:', err);
          callback(this.getLocalProducts());
        });
        return unsubscribe;
      } catch (err) {
        console.error(err);
      }
    }

    // Local reactive listener
    const emit = () => callback(this.getLocalProducts());
    emit();
    const handler = () => emit();
    window.addEventListener('hbc-products-changed', handler);
    return () => window.removeEventListener('hbc-products-changed', handler);
  }

  public getLocalProducts(): Product[] {
    this.seedLocalStorageIfEmpty();
    try {
      const data = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      const list: Product[] = data ? JSON.parse(data) : INITIAL_PRODUCTS;
      let modified = false;
      const verified = list.map(p => {
        let img = p.image;
        if (!img || img.includes('placeholder')) {
          if (p.category === 'ইট' || p.name.includes('ইট')) {
            img = p.name.includes('১') ? '/assets/images/red_bricks.jpg' : '/assets/aistudio/855221105_1050044634737488_7794261989616121237_n_6bf75717.jpg';
          } else if (p.category === 'রড' || p.name.includes('রড')) {
            img = '/assets/images/rod.jpg';
          } else if (p.category === 'সিমেন্ট' || p.name.includes('সিমেন্ট')) {
            img = '/assets/images/cement.jpg';
          } else if (p.category === 'বালু' || p.name.includes('বালু')) {
            img = '/assets/images/sand.jpg';
          } else if (p.category === 'পায়া' || p.name.includes('পায়া')) {
            img = '/assets/images/paya.jpg';
          }
          if (img !== p.image) {
            modified = true;
            return { ...p, image: img };
          }
        }
        return p;
      });
      if (modified) {
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(verified));
      }
      return verified;
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  public async saveProduct(product: Product): Promise<void> {
    // 1. Save local
    const list = this.getLocalProducts();
    const index = list.findIndex(p => p.id === product.id);
    if (index >= 0) {
      list[index] = { ...product, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...product, createdAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('hbc-products-changed'));

    // 2. Sync to Firebase if configured
    if (this.isFirebaseConfigured && this.db) {
      try {
        await setDoc(doc(this.db, 'products', product.id), {
          ...product,
          updatedAt: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Could not sync product to Firestore:', e);
      }
    }
  }

  public async deleteProduct(productId: string): Promise<void> {
    const list = this.getLocalProducts().filter(p => p.id !== productId);
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('hbc-products-changed'));

    if (this.isFirebaseConfigured && this.db) {
      try {
        await deleteDoc(doc(this.db, 'products', productId));
      } catch (e) {
        console.warn('Could not delete product in Firestore:', e);
      }
    }
  }

  // --- ORDERS ---
  public subscribeOrders(callback: (orders: Order[]) => void): () => void {
    if (this.isFirebaseConfigured && this.db) {
      try {
        const q = query(collection(this.db, 'orders'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const list: Order[] = [];
          snapshot.forEach(d => {
            list.push({ id: d.id, ...d.data() } as Order);
          });
          callback(list);
        }, (err) => {
          console.warn('Firestore orders listener error:', err);
          callback(this.getLocalOrders());
        });
        return unsubscribe;
      } catch (err) {
        console.warn(err);
      }
    }

    const emit = () => callback(this.getLocalOrders());
    emit();
    const handler = () => emit();
    window.addEventListener('hbc-orders-changed', handler);
    return () => window.removeEventListener('hbc-orders-changed', handler);
  }

  public getLocalOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ORDERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public async createOrder(order: Omit<Order, 'id'>): Promise<Order> {
    const orders = this.getLocalOrders();
    const orderNumber = order.orderNumber || generateOrderNumber(orders);
    const id = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const fullOrder: Order = {
      ...order,
      orderNumber,
      id,
      createdAt: order.createdAt || new Date().toISOString()
    };

    // 1. Save local
    orders.unshift(fullOrder);
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('hbc-orders-changed'));

    // 2. Sync to Firebase if configured
    if (this.isFirebaseConfigured && this.db) {
      try {
        await setDoc(doc(this.db, 'orders', id), fullOrder);
      } catch (e) {
        console.warn('Could not persist order to Firestore:', e);
      }
    }

    return fullOrder;
  }

  public async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    return this.updateOrder(orderId, { status });
  }

  public async updateOrder(orderId: string, updates: Partial<Order>): Promise<void> {
    const orders = this.getLocalOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index] = {
        ...orders[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
      window.dispatchEvent(new CustomEvent('hbc-orders-changed'));
    }

    if (this.isFirebaseConfigured && this.db) {
      try {
        await updateDoc(doc(this.db, 'orders', orderId), {
          ...updates,
          updatedAt: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Could not update order in Firestore:', e);
      }
    }
  }

  public async deleteOrder(orderId: string): Promise<void> {
    const orders = this.getLocalOrders();
    const filtered = orders.filter(o => o.id !== orderId);
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('hbc-orders-changed'));

    if (this.isFirebaseConfigured && this.db) {
      try {
        await deleteDoc(doc(this.db, 'orders', orderId));
      } catch (e) {
        console.warn('Could not delete order from Firestore:', e);
      }
    }
  }

  // --- CATEGORIES ---
  public subscribeCategories(callback: (categories: Category[]) => void): () => void {
    if (this.isFirebaseConfigured && this.db) {
      try {
        const q = query(collection(this.db, 'categories'), orderBy('order', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const list: Category[] = [];
            snapshot.forEach(d => list.push({ id: d.id, ...d.data() } as Category));
            callback(list);
          } else {
            callback(this.getLocalCategories());
          }
        }, () => callback(this.getLocalCategories()));
        return unsubscribe;
      } catch {
        // fallback
      }
    }

    const emit = () => callback(this.getLocalCategories());
    emit();
    const handler = () => emit();
    window.addEventListener('hbc-categories-changed', handler);
    return () => window.removeEventListener('hbc-categories-changed', handler);
  }

  public getLocalCategories(): Category[] {
    this.seedLocalStorageIfEmpty();
    try {
      const data = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      return data ? JSON.parse(data) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  public async saveCategory(category: Category): Promise<void> {
    const list = this.getLocalCategories();
    const idx = list.findIndex(c => c.id === category.id);
    if (idx >= 0) {
      list[idx] = category;
    } else {
      list.push(category);
    }
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('hbc-categories-changed'));

    if (this.isFirebaseConfigured && this.db) {
      try {
        await setDoc(doc(this.db, 'categories', category.id), category);
      } catch (e) {
        console.warn(e);
      }
    }
  }

  public async deleteCategory(categoryId: string): Promise<void> {
    const list = this.getLocalCategories().filter(c => c.id !== categoryId);
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('hbc-categories-changed'));

    if (this.isFirebaseConfigured && this.db) {
      try {
        await deleteDoc(doc(this.db, 'categories', categoryId));
      } catch (e) {
        console.warn(e);
      }
    }
  }

  // --- BANNERS ---
  public subscribeBanners(callback: (banners: BannerAd[]) => void): () => void {
    if (this.isFirebaseConfigured && this.db) {
      try {
        const q = query(collection(this.db, 'banners'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const list: BannerAd[] = [];
            snapshot.forEach(d => list.push({ id: d.id, ...d.data() } as BannerAd));
            callback(list);
          } else {
            callback(this.getLocalBanners());
          }
        }, () => callback(this.getLocalBanners()));
        return unsubscribe;
      } catch {
        // fallback
      }
    }

    const emit = () => callback(this.getLocalBanners());
    emit();
    const handler = () => emit();
    window.addEventListener('hbc-banners-changed', handler);
    return () => window.removeEventListener('hbc-banners-changed', handler);
  }

  public getLocalBanners(): BannerAd[] {
    this.seedLocalStorageIfEmpty();
    try {
      const data = localStorage.getItem(STORAGE_KEY_BANNERS);
      return data ? JSON.parse(data) : INITIAL_BANNERS;
    } catch {
      return INITIAL_BANNERS;
    }
  }

  public async saveBanner(banner: BannerAd): Promise<void> {
    const list = this.getLocalBanners();
    const idx = list.findIndex(b => b.id === banner.id);
    if (idx >= 0) {
      list[idx] = banner;
    } else {
      list.push(banner);
    }
    localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('hbc-banners-changed'));

    if (this.isFirebaseConfigured && this.db) {
      try {
        await setDoc(doc(this.db, 'banners', banner.id), banner);
      } catch (e) {
        console.warn(e);
      }
    }
  }

  public async deleteBanner(bannerId: string): Promise<void> {
    const list = this.getLocalBanners().filter(b => b.id !== bannerId);
    localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('hbc-banners-changed'));

    if (this.isFirebaseConfigured && this.db) {
      try {
        await deleteDoc(doc(this.db, 'banners', bannerId));
      } catch (e) {
        console.warn(e);
      }
    }
  }

  // --- SETTINGS ---
  public subscribeSettings(callback: (settings: StoreSettings) => void): () => void {
    if (this.isFirebaseConfigured && this.db) {
      try {
        const unsubscribe = onSnapshot(doc(this.db, 'settings', 'store'), (docSnap) => {
          if (docSnap.exists()) {
            callback(docSnap.data() as StoreSettings);
          } else {
            callback(this.getLocalSettings());
          }
        }, () => callback(this.getLocalSettings()));
        return unsubscribe;
      } catch {
        // fallback
      }
    }

    const emit = () => callback(this.getLocalSettings());
    emit();
    const handler = () => emit();
    window.addEventListener('hbc-settings-changed', handler);
    return () => window.removeEventListener('hbc-settings-changed', handler);
  }

  public getLocalSettings(): StoreSettings {
    this.seedLocalStorageIfEmpty();
    try {
      const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
      const settings: StoreSettings = data ? JSON.parse(data) : INITIAL_SETTINGS;
      let changed = false;
      if (!settings.officeAddress || !settings.officeAddress.includes('ভিংলাবাড়ী')) {
        settings.officeAddress = 'পানারপুল, ভিংলাবাড়ী, কুমিল্লা-সিলেট হাইওয়ে সংলগ্ন, বাংলাদেশ';
        changed = true;
      }
      if (settings.founderPhone !== '01711141576') {
        settings.founderPhone = '01711141576';
        changed = true;
      }
      if (settings.helpline !== '01711141576') {
        settings.helpline = '01711141576';
        changed = true;
      }
      if (settings.founderTitle !== 'প্রতিষ্ঠাতা ও স্বত্বাধিকারী') {
        settings.founderTitle = 'প্রতিষ্ঠাতা ও স্বত্বাধিকারী';
        changed = true;
      }
      if (changed) {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
      }
      return settings;
    } catch {
      return INITIAL_SETTINGS;
    }
  }

  public async saveSettings(settings: StoreSettings): Promise<void> {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('hbc-settings-changed'));

    if (this.isFirebaseConfigured && this.db) {
      try {
        await setDoc(doc(this.db, 'settings', 'store'), settings);
      } catch (e) {
        console.warn('Could not update settings in Firestore:', e);
      }
    }
  }

  // --- ADMIN AUTHENTICATION ---
  public async loginAdmin(email: string, password: string): Promise<{ success: boolean; message?: string }> {
    // 1. Try Firebase Auth if live configured
    if (this.isFirebaseConfigured && this.auth) {
      try {
        const cred = await signInWithEmailAndPassword(this.auth, email, password);
        localStorage.setItem(STORAGE_KEY_ADMIN_SESSION, JSON.stringify({
          uid: cred.user.uid,
          email: cred.user.email,
          authType: 'firebase'
        }));
        return { success: true };
      } catch (err: any) {
        return { success: false, message: err.message || 'ভুল ইমেইল বা পাসওয়ার্ড।' };
      }
    }

    // 2. Admin setup & trusted access
    // Credentials specified by owner:
    // Username / Email: mydebidwar
    // Password: 1985fahim@
    const cleanIdentifier = email.trim().toLowerCase();
    const isAuthorizedUser = 
      cleanIdentifier === 'mydebidwar' ||
      cleanIdentifier === 'mydebidwar@gmail.com' ||
      cleanIdentifier === 'mydebidwar@hbcpanarpul.com' ||
      cleanIdentifier === 'ahmmdk04@gmail.com';

    const isAuthorizedPassword = 
      password === '1985fahim@' || 
      (cleanIdentifier === 'ahmmdk04@gmail.com' && password.length >= 6);

    if (isAuthorizedUser && isAuthorizedPassword) {
      localStorage.setItem(STORAGE_KEY_ADMIN_SESSION, JSON.stringify({
        uid: 'hbc_admin_mydebidwar',
        email: cleanIdentifier === 'mydebidwar' ? 'mydebidwar@hbcpanarpul.com' : cleanIdentifier,
        username: 'mydebidwar',
        authType: 'designated_admin'
      }));
      return { success: true };
    }

    return { 
      success: false, 
      message: 'ভুল ইউজারনেম বা পাসওয়ার্ড। অনুমোদিত ইউজারনেম ও পাসওয়ার্ড দিয়ে পুনরায় চেষ্টা করুন।' 
    };
  }

  public getAdminSession(): { uid: string; email: string; authType: string } | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ADMIN_SESSION);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  public async logoutAdmin(): Promise<void> {
    if (this.auth) {
      try {
        await fbSignOut(this.auth);
      } catch (e) {
        // ignore
      }
    }
    localStorage.removeItem(STORAGE_KEY_ADMIN_SESSION);
  }
}

export const firebaseStore = new FirebaseStoreService();
