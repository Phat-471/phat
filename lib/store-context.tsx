'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, CustomerOrder, BrandIdentity, UserProfile, StoreSettings } from '@/lib/types';
import { BASE_PRODUCTS, BRAND_PRESETS, DEFAULT_STORE_INFO } from '@/lib/stationery-data';

interface StoreContextType {
  // Products
  products: Product[];
  getProductById: (id: string) => Product | undefined;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartWholesaleDiscount: number;
  freeShippingThreshold: number;
  shippingFee: number;
  cartTotal: number;

  // Minimum Order Logic
  minOrderValue: number;
  minOrderEnabled: boolean;
  setMinOrderValue: (val: number) => void;
  setMinOrderEnabled: (enabled: boolean) => void;
  updateMinOrderSettings: (val: number, enabled: boolean) => void;
  isMinOrderMet: boolean;
  minOrderShortfall: number;
  minOrderProgress: number;

  // Store Settings (Offline store & shipping threshold)
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;

  // Orders
  orders: CustomerOrder[];
  createOrder: (orderData: Omit<CustomerOrder, 'id' | 'createdAt'>) => CustomerOrder;
  updateOrderStatus: (orderId: string, status: CustomerOrder['status']) => void;

  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Brand identity
  currentBrand: BrandIdentity;
  setCurrentBrand: (brand: BrandIdentity) => void;
  setBrand: (brand: BrandIdentity) => void;

  // UI Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const INITIAL_ORDERS: CustomerOrder[] = [
  {
    id: 'DH-89214',
    orderType: 'online_delivery',
    customerName: 'Nguyễn Văn Nam',
    phone: '0912 345 678',
    email: 'nam.nguyen@cty-tech.vn',
    address: 'Tầng 5, Tòa nhà Bitexco, Số 2 Hải Triều, Bến Nghé, Quận 1, TP.HCM',
    paymentMethod: 'vietqr',
    requestVatInvoice: true,
    companyName: 'Công Ty Cổ Phần Công Nghệ & Dịch Vụ VinaTech',
    companyTaxCode: '0316892145',
    companyAddress: 'Tầng 5 Bitexco, Hải Triều, Q.1, TP.HCM',
    notes: 'Giao giờ hành chính, gọi trước 15 phút khi đến sảnh',
    items: [
      { product: BASE_PRODUCTS[0], quantity: 5 }, // Giấy A4 Double A
      { product: BASE_PRODUCTS[2], quantity: 20 }, // Bút bi TL-027 (Wholesale applied)
      { product: BASE_PRODUCTS[4], quantity: 3 }  // Bìa còng King Jim
    ],
    subtotal: 785000,
    discount: 30000,
    shippingFee: 0,
    total: 755000,
    status: 'shipping',
    createdAt: '2026-09-16T14:30:00Z'
  },
  {
    id: 'DH-76520',
    orderType: 'store_pickup',
    customerName: 'Trần Thị Mai',
    phone: '0988 776 655',
    pickupTime: '16:00 Hôm nay',
    paymentMethod: 'counter_cash',
    requestVatInvoice: false,
    notes: 'Đóng gói vào túi quai xách màu trắng giúp mình',
    items: [
      { product: BASE_PRODUCTS[1], quantity: 2 }, // Giấy A4 IK Plus
      { product: BASE_PRODUCTS[7], quantity: 1 }  // Máy tính Casio fx-580VN X
    ],
    subtotal: 825000,
    discount: 0,
    shippingFee: 0,
    total: 825000,
    status: 'completed',
    createdAt: '2026-09-15T09:15:00Z'
  }
];

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(BASE_PRODUCTS);

  // Cart state with localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vpp_cart');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load cart from localStorage', e);
      }
    }
    // Default demo items
    return [
      { product: BASE_PRODUCTS[0], quantity: 2 },
      { product: BASE_PRODUCTS[2], quantity: 10 }
    ];
  });

  // Minimum order settings (can be configured in Admin)
  const [minOrderValue, setMinOrderValueState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vpp_min_order_value');
        if (saved) return Number(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return 100000; // Default 100,000 VND
  });

  const [minOrderEnabled, setMinOrderEnabledState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vpp_min_order_enabled');
        if (saved !== null) return saved === 'true';
      } catch (e) {
        console.error(e);
      }
    }
    return true;
  });

  // Orders state
  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vpp_orders');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ORDERS;
  });

  // Current Brand Identity
  const [currentBrand, setCurrentBrandState] = useState<BrandIdentity>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vpp_brand');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return BRAND_PRESETS[0];
  });

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vpp_user_profile');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      name: 'Nguyễn Văn Nam',
      phone: '0912 345 678',
      email: 'nam.nguyen@cty-tech.vn',
      address: 'Số 168 Nguyễn Trãi',
      ward: 'Phường Bến Thành',
      district: 'Quận 1',
      city: 'TP. Hồ Chí Minh',
      loyaltyPoints: 350,
      tier: 'Thân thiết'
    };
  });

  // Store Settings (offline store & shipping)
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vpp_store_settings');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      minOrderValue: 100000,
      minOrderEnabled: true,
      freeShippingThreshold: 500000,
      standardShippingFee: 30000,
      storeAddress: DEFAULT_STORE_INFO.address,
      storeHotline: DEFAULT_STORE_INFO.hotline,
      storeOpeningHours: DEFAULT_STORE_INFO.openingHours
    };
  });

  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('vpp_store_settings', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const updateMinOrderSettings = (val: number, enabled: boolean) => {
    setMinOrderValueState(val);
    setMinOrderEnabledState(enabled);
    updateStoreSettings({ minOrderValue: val, minOrderEnabled: enabled });
    showToast(`Đã lưu mức tối thiểu: ${new Intl.NumberFormat('vi-VN').format(val)}đ (${enabled ? 'Bật' : 'Tắt'})`);
  };

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vpp_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('vpp_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('vpp_min_order_value', minOrderValue.toString());
    } catch (e) {
      console.error(e);
    }
  }, [minOrderValue]);

  useEffect(() => {
    try {
      localStorage.setItem('vpp_min_order_enabled', minOrderEnabled.toString());
    } catch (e) {
      console.error(e);
    }
  }, [minOrderEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('vpp_brand', JSON.stringify(currentBrand));
    } catch (e) {
      console.error(e);
    }
  }, [currentBrand]);

  useEffect(() => {
    try {
      localStorage.setItem('vpp_user_profile', JSON.stringify(userProfile));
    } catch (e) {
      console.error(e);
    }
  }, [userProfile]);

  const setMinOrderValue = (val: number) => {
    setMinOrderValueState(val);
    showToast(`Đã cập nhật mức đơn hàng tối thiểu: ${new Intl.NumberFormat('vi-VN').format(val)}đ`);
  };

  const setMinOrderEnabled = (enabled: boolean) => {
    setMinOrderEnabledState(enabled);
    showToast(enabled ? 'Đã kích hoạt điều kiện đơn hàng tối thiểu' : 'Đã tắt điều kiện đơn hàng tối thiểu');
  };

  const setCurrentBrand = (b: BrandIdentity) => {
    setCurrentBrandState(b);
    showToast(`Đã áp dụng mẫu thương hiệu: ${b.name}`);
  };

  const updateUserProfile = (profileUpdate: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profileUpdate }));
    showToast('Đã lưu thông tin tài khoản thành công');
  };

  // Product helper
  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: next[idx].quantity + quantity
        };
        return next;
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Đã thêm ${quantity} ${product.unit} "${product.name}" vào giỏ hàng`);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const removedItem = prev.find((item) => item.product.id === productId);
      if (removedItem) {
        showToast(`Đã xóa "${removedItem.product.name}" khỏi giỏ hàng`);
      }
      return prev.filter((item) => item.product.id !== productId);
    });
  };

  const clearCart = () => {
    setCart([]);
    showToast('Đã làm trống giỏ hàng');
  };

  // Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Subtotal taking wholesale discount into consideration when qty >= 10
  const cartSubtotal = cart.reduce((sum, item) => {
    const unitPrice = item.quantity >= 10 ? item.product.wholesalePrice : item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const cartRegularTotal = cart.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const cartWholesaleDiscount = Math.max(0, cartRegularTotal - cartSubtotal);

  const freeShippingThreshold = 500000; // Free shipping from 500k
  const shippingFee = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 30000;
  const cartTotal = cartSubtotal + shippingFee;

  // Minimum order logic
  const isMinOrderMet = !minOrderEnabled || cartSubtotal >= minOrderValue;
  const minOrderShortfall = Math.max(0, minOrderValue - cartSubtotal);
  const minOrderProgress = minOrderValue > 0
    ? Math.min(100, Math.round((cartSubtotal / minOrderValue) * 100))
    : 100;

  // Order operations
  const createOrder = (orderData: Omit<CustomerOrder, 'id' | 'createdAt'>): CustomerOrder => {
    const newOrder: CustomerOrder = {
      ...orderData,
      id: `DH-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString()
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast(`Đặt hàng thành công! Mã đơn của bạn là ${newOrder.id}`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: CustomerOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Đã cập nhật trạng thái đơn ${orderId}`);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        getProductById,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartWholesaleDiscount,
        freeShippingThreshold,
        shippingFee,
        cartTotal,
        minOrderValue,
        minOrderEnabled,
        setMinOrderValue,
        setMinOrderEnabled,
        updateMinOrderSettings,
        isMinOrderMet,
        minOrderShortfall,
        minOrderProgress,
        storeSettings,
        updateStoreSettings,
        orders,
        createOrder,
        updateOrderStatus,
        userProfile,
        updateUserProfile,
        currentBrand,
        setCurrentBrand,
        setBrand: setCurrentBrand,
        toastMessage,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
