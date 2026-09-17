export interface Product {
  id: string;
  sku: string; // e.g. VPP-TL-027
  barcode: string; // 13 digits
  name: string;
  category: string;
  subCategory?: string;
  brand: string;
  unit: string; // e.g. Hộp, Cây, Cuộn, Ram, Quyển
  price: number; // Retail price (VND)
  wholesalePrice: number; // Wholesale price (VND) for > 10 units
  originalPrice?: number;
  promotionalPrice?: number;
  stockOnline: number;
  stockOffline: number; // Stock available at the physical shop
  shelfLocation: string; // e.g. Kệ A2 - Tầng 1
  description: string;
  specifications: Record<string, string>;
  image: string;
  featured?: boolean;
  bestSeller?: boolean;
  lowStockThreshold?: number; // Cảnh báo sắp hết hàng
  seoTitle?: string;
  seoDescription?: string;
  variants?: {
    type: 'color' | 'size' | 'nib';
    name: string;
    options: string[];
  }[];
}

export interface BrandIdentity {
  id: string;
  name: string;
  tagline: string;
  logoType: 'pen' | 'book' | 'building' | 'box' | 'geometric';
  primaryColor: string; // Hex or Tailwind class
  accentColor: string;
  description: string;
  suggestedSlogans: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderType = 'online_delivery' | 'store_pickup';

export type OrderStatus = 'pending' | 'ready_for_pickup' | 'shipping' | 'completed' | 'cancelled' | 'new' | 'packing' | 'refunded';

export interface CustomerOrder {
  id: string;
  orderType: OrderType;
  customerName: string;
  phone: string;
  email?: string;
  address?: string;
  pickupTime?: string;
  paymentMethod: 'cod' | 'vietqr' | 'counter_cash' | 'momo';
  requestVatInvoice: boolean;
  companyTaxCode?: string;
  companyName?: string;
  companyAddress?: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  shippingCode?: string; // Mã vận đơn (e.g. VPP-GHN-89312)
  channel?: 'web' | 'pos' | 'hotline';
}

export interface OfflineStoreInfo {
  name: string;
  address: string;
  wardDistrictCity: string;
  hotline: string;
  zalo: string;
  email: string;
  openingHours: string;
  shelfGuide: string;
  googleMapsUrl: string;
  inStoreServices: string[];
}

export interface StoreSettings {
  minOrderValue: number; // Minimum order value in VND, e.g., 100000
  minOrderEnabled: boolean;
  freeShippingThreshold: number; // e.g., 500000
  storeNotice?: string;
  standardShippingFee?: number;
  storeAddress?: string;
  storeHotline?: string;
  storeOpeningHours?: string;
  enableCod?: boolean;
  enableVietQr?: boolean;
  enableMoMo?: boolean;
  enableCash?: boolean;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  loyaltyPoints: number;
  tier: 'Thành viên mới' | 'Thân thiết' | 'VIP Doanh nghiệp';
  companyName?: string;
  companyTaxCode?: string;
  companyAddress?: string;
}

// 1. PIM: Quản lý danh mục đa cấp & Kiểm soát tồn kho
export interface CategoryItem {
  id: string;
  name: string;
  parentId?: string | null;
  order: number;
  image?: string;
  icon?: string;
  subCategories?: string[];
  productCount?: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  taxCode: string;
  productLines: string[];
}

export interface StockImportReceipt {
  id: string;
  receiptCode: string;
  supplierId: string;
  supplierName: string;
  createdAt: string;
  createdBy: string;
  targetWarehouse: 'offline' | 'online' | 'both';
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    importPrice: number;
  }[];
  totalAmount: number;
  status: 'draft' | 'completed' | 'cancelled';
  notes?: string;
}

// 2. OMS & CRM: Đổi trả RMA & Hồ sơ khách hàng
export interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  reason: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    refundAmount: number;
  }[];
  totalRefund: number;
  status: 'requested' | 'approved' | 'received' | 'refunded' | 'rejected';
  createdAt: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  segment: 'guest' | 'vip' | 'b2b';
  segmentNameVi: string;
  totalSpent: number;
  orderCount: number;
  loyaltyPoints: number;
  companyName?: string;
  taxCode?: string;
  address?: string;
  notes?: string;
  lastOrderDate?: string;
}

// 3. CMS & Marketing: Banner, Voucher, Flash Sale, Bài viết song ngữ
export interface HomeBanner {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  image: string;
  link: string;
  categoryTarget?: string;
  startDate?: string;
  endDate?: string;
  active: boolean;
  order: number;
}

export interface VoucherPromo {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderRequirement: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export interface FlashSaleConfig {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  active: boolean;
  discountPercent: number;
  productIds: string[];
}

export interface CmsArticle {
  id: string;
  slug: string;
  titleVi: string;
  titleEn: string;
  contentVi: string;
  contentEn: string;
  category: 'news' | 'guide' | 'policy' | 'about';
  categoryNameVi: string;
  published: boolean;
  updatedAt: string;
  author: string;
}

// 4. Analytics & RBAC: Phân quyền & Vùng phí vận chuyển
export type StaffRole = 'admin' | 'cashier' | 'warehouse' | 'cs';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  roleNameVi: string;
  avatar: string;
  permissions: string[];
}

export interface ShippingZoneFee {
  id: string;
  zoneName: string;
  areas: string;
  fee: number;
  estimatedDays: string;
}
