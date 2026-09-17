'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store-context';
import { Product, CustomerOrder, CategoryItem, Supplier, StockImportReceipt, ReturnRequest, CustomerRecord, HomeBanner, VoucherPromo, CmsArticle, StaffUser, ShippingZoneFee, OrderStatus } from '@/lib/types';
import { PRODUCTS_CATALOG, formatVND } from '@/lib/stationery-data';
import {
  INITIAL_SUPPLIERS,
  INITIAL_STOCK_RECEIPTS,
  INITIAL_CATEGORIES_HIERARCHY,
  INITIAL_CUSTOMERS,
  INITIAL_RETURN_REQUESTS,
  INITIAL_BANNERS,
  INITIAL_VOUCHERS,
  INITIAL_FLASH_SALE,
  INITIAL_CMS_ARTICLES,
  INITIAL_STAFF_USERS,
  INITIAL_SHIPPING_ZONES
} from '@/lib/admin-data';
import {
  Package,
  Boxes,
  Truck,
  FolderTree,
  FileSpreadsheet,
  AlertTriangle,
  Plus,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  UserCheck,
  Users,
  Percent,
  Sliders,
  ShieldCheck,
  BarChart3,
  Settings,
  Store,
  ArrowUpRight,
  TrendingUp,
  Download,
  Upload,
  RefreshCw,
  Eye,
  X,
  Check,
  Phone,
  Mail,
  MapPin,
  Building,
  CreditCard,
  QrCode,
  DollarSign,
  Layers,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

type AdminTab = 'pim' | 'oms' | 'crm' | 'cms' | 'analytics' | 'settings';

export default function AdminPage() {
  const {
    orders,
    updateOrderStatus,
    createOrder,
    minOrderValue,
    minOrderEnabled,
    updateMinOrderSettings,
    storeSettings,
    updateStoreSettings,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('pim');
  const [pimSubTab, setPimSubTab] = useState<'products' | 'categories' | 'inventory' | 'suppliers'>('products');
  const [omsSubTab, setOmsSubTab] = useState<'all_orders' | 'manual_order' | 'returns'>('all_orders');
  const [cmsSubTab, setCmsSubTab] = useState<'banners' | 'vouchers' | 'articles'>('banners');
  const [settingsSubTab, setSettingsSubTab] = useState<'store_info' | 'min_order' | 'rbac' | 'shipping'>('store_info');

  // PIM State
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS_CATALOG);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // New Product Form
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(25000);
  const [newProdWholesale, setNewProdWholesale] = useState(21000);
  const [newProdStockOnline, setNewProdStockOnline] = useState(200);
  const [newProdStockOffline, setNewProdStockOffline] = useState(50);
  const [newProdCategory, setNewProdCategory] = useState('giay-in');
  const [newProdBrand, setNewProdBrand] = useState('Thiên Long');
  const [newProdUnit, setNewProdUnit] = useState('Hộp');
  const [newProdShelf, setNewProdShelf] = useState('Kệ A1 - Tầng 2');

  // Categories & Inventory State
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES_HIERARCHY);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [receipts, setReceipts] = useState<StockImportReceipt[]>(INITIAL_STOCK_RECEIPTS);
  const [showNewReceiptModal, setShowNewReceiptModal] = useState(false);

  // OMS State
  const [ordersList, setOrdersList] = useState<CustomerOrder[]>(orders);
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [selectedPrintOrder, setSelectedPrintOrder] = useState<CustomerOrder | null>(null);
  const [selectedShippingLabel, setSelectedShippingLabel] = useState<CustomerOrder | null>(null);
  const [returns, setReturns] = useState<ReturnRequest[]>(INITIAL_RETURN_REQUESTS);

  // CRM State
  const [customers, setCustomers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerSegmentFilter, setCustomerSegmentFilter] = useState('all');

  // CMS State
  const [banners, setBanners] = useState<HomeBanner[]>(INITIAL_BANNERS);
  const [vouchers, setVouchers] = useState<VoucherPromo[]>(INITIAL_VOUCHERS);
  const [articles, setArticles] = useState<CmsArticle[]>(INITIAL_CMS_ARTICLES);
  const [articleLang, setArticleLang] = useState<'vi' | 'en'>('vi');

  // Settings & RBAC State
  const [staffList, setStaffList] = useState<StaffUser[]>(INITIAL_STAFF_USERS);
  const [shippingZones, setShippingZones] = useState<ShippingZoneFee[]>(INITIAL_SHIPPING_ZONES);
  const [currentStaffRole, setCurrentStaffRole] = useState<'admin' | 'cashier' | 'warehouse' | 'cs'>('admin');

  // Manual Order Form State
  const [manualCustName, setManualCustName] = useState('');
  const [manualCustPhone, setManualCustPhone] = useState('');
  const [manualCustAddress, setManualCustAddress] = useState('');
  const [manualPayment, setManualPayment] = useState<'cod' | 'vietqr' | 'counter_cash'>('counter_cash');
  const [manualItems, setManualItems] = useState<{ product: Product; quantity: number }[]>([]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.barcode.includes(productSearch);
      const matchCat = selectedProductCategory === 'all' || p.category === selectedProductCategory;
      return matchSearch && matchCat;
    });
  }, [productsList, productSearch, selectedProductCategory]);

  // Low stock products alert
  const lowStockProducts = useMemo(() => {
    return productsList.filter((p) => (p.stockOffline < 15 || p.stockOnline < 30));
  }, [productsList]);

  // Inventory valuation
  const inventoryValuation = useMemo(() => {
    return productsList.reduce((acc, p) => {
      const totalUnits = (p.stockOnline || 0) + (p.stockOffline || 0);
      return acc + totalUnits * (p.wholesalePrice || p.price * 0.85);
    }, 0);
  }, [productsList]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    if (orderFilterStatus === 'all') return ordersList;
    return ordersList.filter((o) => o.status === orderFilterStatus);
  }, [ordersList, orderFilterStatus]);

  // Handlers for PIM
  const handleAddProduct = () => {
    if (!newProdName.trim()) {
      alert('Vui lòng nhập tên sản phẩm');
      return;
    }
    const newProd: Product = {
      id: `p-custom-${Date.now()}`,
      sku: newProdSku || `VPP-${Date.now().toString().slice(-4)}`,
      barcode: `893${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      name: newProdName,
      category: newProdCategory,
      brand: newProdBrand,
      unit: newProdUnit,
      price: Number(newProdPrice),
      wholesalePrice: Number(newProdWholesale),
      stockOnline: Number(newProdStockOnline),
      stockOffline: Number(newProdStockOffline),
      shelfLocation: newProdShelf,
      description: 'Sản phẩm văn phòng phẩm tiêu chuẩn, chính hãng.',
      specifications: { 'Thương hiệu': newProdBrand, 'Đơn vị': newProdUnit },
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=80'
    };
    setProductsList([newProd, ...productsList]);
    setShowAddProductModal(false);
    showToast(`Đã thêm sản phẩm "${newProdName}" thành công!`);
    setNewProdName('');
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa mã hàng "${name}"?`)) {
      setProductsList((prev) => prev.filter((p) => p.id !== id));
      showToast(`Đã xóa sản phẩm "${name}"`);
    }
  };

  const handleExportExcel = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      'Mã SKU,Mã Vạch,Tên Sản Phẩm,Danh Mục,Thương Hiệu,Đơn Vị,Giá Bán Lẻ,Giá Sỉ,Tồn Online,Tồn Quầy,Vị Trí Kệ\n' +
      productsList.slice(0, 100).map((p) =>
        `"${p.sku}","${p.barcode}","${p.name.replace(/"/g, '""')}","${p.category}","${p.brand}","${p.unit}",${p.price},${p.wholesalePrice},${p.stockOnline},${p.stockOffline},"${p.shelfLocation}"`
      ).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bang_Gia_2000_SKU_VPP_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất file Excel / CSV 2.000 SKU văn phòng phẩm thành công!');
  };

  const handleImportSample = () => {
    showToast('Đã đồng bộ và cập nhật thành công 2.000 mã hàng từ file Excel!');
  };

  const handleChangeOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    updateOrderStatus(orderId, newStatus);
    showToast(`Đã chuyển trạng thái đơn ${orderId} sang: ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-lg">
                VP
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-white block">TRUNG TÂM QUẢN TRỊ VPP</span>
                <span className="text-[11px] text-emerald-400 block -mt-1">PIM • OMS • CRM • CMS • ERP</span>
              </div>
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-mono">
              2.000 SKU Active
            </span>
          </div>

          {/* Role selector simulation */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
              <span>Đang đăng nhập:</span>
              <select
                aria-label="Chọn vai trò nhân sự"
                value={currentStaffRole}
                onChange={(e) => {
                  setCurrentStaffRole(e.target.value as any);
                  showToast(`Đã chuyển vai trò xem: ${e.target.value.toUpperCase()}`);
                }}
                className="bg-transparent font-semibold text-emerald-400 focus:outline-none cursor-pointer"
              >
                <option value="admin" className="bg-slate-900">Admin Toàn Quyền</option>
                <option value="cashier" className="bg-slate-900">Thu Ngân Quầy POS</option>
                <option value="warehouse" className="bg-slate-900">Thủ Kho (PIM/Kho)</option>
                <option value="cs" className="bg-slate-900">CSKH & Đơn Hàng</option>
              </select>
            </div>

            <Link
              href="/pos"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-sm transition"
            >
              <Store className="w-3.5 h-3.5" />
              Mở Quầy POS
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
            >
              Xem Web Shop
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800 flex gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveTab('pim')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'pim'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/60 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            1. Sản Phẩm & Tồn Kho (PIM)
          </button>
          <button
            onClick={() => setActiveTab('oms')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'oms'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/60 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            2. Vận Hành Đơn Hàng (OMS)
          </button>
          <button
            onClick={() => setActiveTab('crm')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'crm'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/60 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            3. Hồ Sơ Khách Hàng (CRM)
          </button>
          <button
            onClick={() => setActiveTab('cms')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'cms'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/60 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            4. Banner & Marketing (CMS)
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/60 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            5. Báo Cáo & Tồn Kho Đọng Vốn
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/60 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            6. Cài Đặt & Phân Quyền
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* ========================================================= */}
        {/* MODULE 1: PIM (Sản phẩm, Tồn kho, Danh mục, Nhà cung cấp) */}
        {/* ========================================================= */}
        {activeTab === 'pim' && (
          <div className="space-y-6">
            {/* Top Sub-tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setPimSubTab('products')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                    pimSubTab === 'products'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Danh Sách 2.000 SKU ({productsList.length})
                </button>
                <button
                  onClick={() => setPimSubTab('categories')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                    pimSubTab === 'categories'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Cây Danh Mục Đa Cấp
                </button>
                <button
                  onClick={() => setPimSubTab('inventory')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition relative ${
                    pimSubTab === 'inventory'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Kiểm Kê & Nhập Kho
                  {lowStockProducts.length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                      {lowStockProducts.length} cảnh báo
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setPimSubTab('suppliers')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                    pimSubTab === 'suppliers'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Nhà Cung Cấp ({suppliers.length})
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportExcel}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition"
                  title="Xuất file CSV / Excel bảng mã hàng và tồn kho"
                >
                  <Download className="w-4 h-4" />
                  Xuất Excel (2.000 SKU)
                </button>
                <button
                  onClick={handleImportSample}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
                  title="Nhập hàng loạt sản phẩm từ file Excel"
                >
                  <Upload className="w-4 h-4" />
                  Import Excel Hàng Loạt
                </button>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Thêm Mã Hàng Mới
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Products list */}
            {pimSubTab === 'products' && (
              <div className="space-y-4">
                {/* Search & filters */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên, mã SKU hoặc mã vạch..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <select
                      aria-label="Lọc theo ngành hàng"
                      value={selectedProductCategory}
                      onChange={(e) => setSelectedProductCategory(e.target.value)}
                      className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    >
                      <option value="all">Tất cả ngành hàng</option>
                      <option value="giay-in">Giấy In & Photo</option>
                      <option value="but-viet">Bút Viết & Mực</option>
                      <option value="bia-file">Bìa & File Hồ Sơ</option>
                      <option value="dung-cu-van-phong">Dụng Cụ Văn Phòng</option>
                      <option value="thiet-bi">Thiết Bị & Máy Tính</option>
                      <option value="so-tay">Sổ Tay & Vở Học Sinh</option>
                    </select>

                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
                    </span>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                        <tr>
                          <th className="p-3.5">Mã SKU / Vạch</th>
                          <th className="p-3.5">Sản Phẩm & Thương Hiệu</th>
                          <th className="p-3.5">Giá Bán Lẻ</th>
                          <th className="p-3.5">Giá Sỉ ({'>'}10)</th>
                          <th className="p-3.5">Tồn Kho Online</th>
                          <th className="p-3.5">Tồn Quầy 168 NT</th>
                          <th className="p-3.5">Vị Trí Kệ</th>
                          <th className="p-3.5 text-right">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredProducts.slice(0, 50).map((prod) => {
                          const isLow = prod.stockOffline < 15 || prod.stockOnline < 30;
                          return (
                            <tr key={prod.id} className="hover:bg-slate-50/70 transition">
                              <td className="p-3.5 font-mono">
                                <span className="font-bold text-slate-900 block">{prod.sku}</span>
                                <span className="text-[11px] text-slate-400">{prod.barcode}</span>
                              </td>
                              <td className="p-3.5 max-w-xs">
                                <div className="font-medium text-slate-900 line-clamp-1">{prod.name}</div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                                    {prod.brand}
                                  </span>
                                  <span>ĐVT: {prod.unit}</span>
                                </div>
                              </td>
                              <td className="p-3.5 font-semibold text-emerald-700">
                                {formatVND(prod.price)}
                              </td>
                              <td className="p-3.5 font-semibold text-blue-700">
                                {formatVND(prod.wholesalePrice)}
                              </td>
                              <td className="p-3.5">
                                <span className="font-medium">{prod.stockOnline} {prod.unit}</span>
                              </td>
                              <td className="p-3.5">
                                <span className={`inline-flex items-center gap-1 font-semibold ${
                                  prod.stockOffline < 15 ? 'text-amber-600 font-bold' : 'text-slate-700'
                                }`}>
                                  {prod.stockOffline} {prod.unit}
                                  {prod.stockOffline < 15 && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                                </span>
                              </td>
                              <td className="p-3.5 font-mono text-[11px] text-slate-600">
                                {prod.shelfLocation}
                              </td>
                              <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                                <button
                                  onClick={() => {
                                    const newPrice = prompt(`Cập nhật giá bán lẻ mới cho "${prod.name}":`, prod.price.toString());
                                    if (newPrice && !isNaN(Number(newPrice))) {
                                      setProductsList((prev) =>
                                        prev.map((p) => (p.id === prod.id ? { ...p, price: Number(newPrice) } : p))
                                      );
                                      showToast(`Đã cập nhật giá "${prod.name}" thành ${formatVND(Number(newPrice))}`);
                                    }
                                  }}
                                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition"
                                  title="Chỉnh sửa giá nhanh"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                  className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition"
                                  title="Xóa sản phẩm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {filteredProducts.length > 50 && (
                    <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
                      Đang hiển thị 50 / {filteredProducts.length} mã hàng. Dùng thanh tìm kiếm để tra cứu nhanh bất kỳ mã SKU nào trong 2.000 sản phẩm.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sub-tab 2: Categories Hierarchy */}
            {pimSubTab === 'categories' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          {cat.order}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{cat.name}</h4>
                          <span className="text-xs text-slate-400">{cat.productCount} sản phẩm trực thuộc</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-mono">
                        Ưu tiên #{cat.order}
                      </span>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <div className="text-xs font-semibold text-slate-700 mb-2">Danh mục con cấp 2 (Sub-categories):</div>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.subCategories?.map((sub, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-xs">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        onClick={() => {
                          const newSub = prompt(`Thêm danh mục con vào "${cat.name}":`);
                          if (newSub && newSub.trim()) {
                            setCategories((prev) =>
                              prev.map((c) =>
                                c.id === cat.id
                                  ? { ...c, subCategories: [...(c.subCategories || []), newSub.trim()] }
                                  : c
                              )
                            );
                            showToast(`Đã thêm danh mục con "${newSub}" vào ${cat.name}`);
                          }
                        }}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200"
                      >
                        + Thêm nhóm con
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sub-tab 3: Inventory & Receipts */}
            {pimSubTab === 'inventory' && (
              <div className="space-y-6">
                {/* Low Stock Warning Banner */}
                {lowStockProducts.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      Cảnh báo tồn kho thấp ({lowStockProducts.length} sản phẩm sắp hết hàng)
                    </div>
                    <p className="text-xs text-amber-700 mb-3 leading-relaxed">
                      Các sản phẩm dưới đây có số lượng tồn quầy dưới 15 hoặc tồn kho online dưới 30. Khuyến nghị lập phiếu nhập hàng từ Thiên Long hoặc Double A ngay.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {lowStockProducts.slice(0, 6).map((lp) => (
                        <span key={lp.id} className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-xs text-amber-900 font-medium">
                          {lp.name}: còn {lp.stockOffline} {lp.unit} tại quầy
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock Import Receipts Table */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">Lịch Sử Phiếu Nhập Kho (Stock Import)</h4>
                      <p className="text-xs text-slate-500">Quản lý nhập hàng từ nhà sản xuất, cập nhật giá vốn & tăng số lượng tồn quầy</p>
                    </div>
                    <button
                      onClick={() => setShowNewReceiptModal(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition"
                    >
                      + Lập Phiếu Nhập Kho Mới
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <tr>
                          <th className="p-3">Mã Phiếu</th>
                          <th className="p-3">Nhà Cung Cấp</th>
                          <th className="p-3">Thời Gian / Người Tạo</th>
                          <th className="p-3">Kho Đích</th>
                          <th className="p-3">Tổng Tiền Nhập</th>
                          <th className="p-3">Trạng Thái</th>
                          <th className="p-3 text-right">Ghi Chú</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {receipts.map((rec) => (
                          <tr key={rec.id} className="hover:bg-slate-50/70">
                            <td className="p-3 font-bold font-mono text-emerald-700">{rec.receiptCode}</td>
                            <td className="p-3 font-medium text-slate-900">{rec.supplierName}</td>
                            <td className="p-3 text-xs text-slate-500">
                              <div>{rec.createdAt}</div>
                              <div className="text-slate-400">{rec.createdBy}</div>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                                {rec.targetWarehouse === 'both' ? 'Cả quầy & kho' : rec.targetWarehouse === 'offline' ? 'Quầy 168 NT' : 'Kho Online'}
                              </span>
                            </td>
                            <td className="p-3 font-semibold text-slate-900">{formatVND(rec.totalAmount)}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                rec.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {rec.status === 'completed' ? 'Đã nhập kho' : 'Bản nháp'}
                              </span>
                            </td>
                            <td className="p-3 text-right text-xs text-slate-500">{rec.notes || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 4: Suppliers */}
            {pimSubTab === 'suppliers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suppliers.map((sup) => (
                  <div key={sup.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">{sup.name}</h4>
                        <span className="text-xs text-slate-500 block">Mã số thuế: {sup.taxCode}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs">
                        Đối tác chính thức
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hotline: <strong>{sup.phone}</strong> ({sup.contactPerson})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>Email đặt hàng: {sup.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Địa chỉ kho/nhà máy: {sup.address}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">Ngành hàng cung ứng:</span>
                      <div className="flex flex-wrap gap-1">
                        {sup.productLines.map((line, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">
                            {line}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE 2: OMS & CRM (Vận hành đơn hàng & Hồ sơ khách hàng) */}
        {/* ========================================================= */}
        {activeTab === 'oms' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setOmsSubTab('all_orders')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                    omsSubTab === 'all_orders'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Toàn Bộ Đơn Hàng ({ordersList.length})
                </button>
                <button
                  onClick={() => setOmsSubTab('manual_order')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                    omsSubTab === 'manual_order'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  + Tạo Đơn Thủ Công (Hotline / Quầy)
                </button>
                <button
                  onClick={() => setOmsSubTab('returns')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                    omsSubTab === 'returns'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Đổi Trả & Hoàn Tiền (RMA) ({returns.length})
                </button>
              </div>

              {omsSubTab === 'all_orders' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Lọc theo trạng thái:</span>
                  <select
                    aria-label="Lọc đơn hàng theo trạng thái"
                    value={orderFilterStatus}
                    onChange={(e) => setOrderFilterStatus(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Chờ xác nhận (Mới)</option>
                    <option value="packing">Đang đóng gói thùng</option>
                    <option value="ready_for_pickup">Sẵn sàng tại quầy</option>
                    <option value="shipping">Đang giao vận</option>
                    <option value="completed">Đã hoàn thành</option>
                  </select>
                </div>
              )}
            </div>

            {/* Orders List & Drag/Drop Status Update */}
            {omsSubTab === 'all_orders' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* Pipeline Kanban columns */}
                  {[
                    { id: 'pending', title: '1. Chờ Xác Nhận', color: 'border-amber-400 bg-amber-50/50' },
                    { id: 'packing', title: '2. Đang Đóng Gói', color: 'border-blue-400 bg-blue-50/50' },
                    { id: 'shipping', title: '3. Đang Vận Chuyển', color: 'border-indigo-400 bg-indigo-50/50' },
                    { id: 'completed', title: '4. Đã Hoàn Tất', color: 'border-emerald-400 bg-emerald-50/50' }
                  ].map((col) => {
                    const colOrders = ordersList.filter((o) => {
                      if (col.id === 'pending') return o.status === 'pending' || o.status === 'new';
                      if (col.id === 'packing') return o.status === 'packing' || o.status === 'ready_for_pickup';
                      return o.status === col.id;
                    });

                    return (
                      <div key={col.id} className={`rounded-2xl border p-4 flex flex-col space-y-3 ${col.color}`}>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{col.title}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-white text-slate-700 text-xs font-bold shadow-2xs">
                            {colOrders.length}
                          </span>
                        </div>

                        <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                          {colOrders.map((order) => (
                            <div key={order.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold font-mono text-emerald-700 text-xs">{order.id}</span>
                                <span className="text-[10px] text-slate-400">{order.createdAt.slice(0, 16)}</span>
                              </div>

                              <div>
                                <div className="font-bold text-slate-900 text-xs">{order.customerName}</div>
                                <div className="text-[11px] text-slate-500">{order.phone}</div>
                              </div>

                              <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg space-y-1">
                                <div className="flex justify-between">
                                  <span>{order.items.length} mặt hàng:</span>
                                  <strong className="text-slate-900">{formatVND(order.total)}</strong>
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  {order.orderType === 'store_pickup' ? 'Lấy tại 168 Nguyễn Trãi' : 'Giao tận nơi'} • {order.paymentMethod.toUpperCase()}
                                </div>
                              </div>

                              {/* Action buttons */}
                              <div className="pt-1 flex items-center justify-between gap-1 border-t border-slate-100 text-xs">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => setSelectedPrintOrder(order)}
                                    className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
                                    title="In hóa đơn bán lẻ"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setSelectedShippingLabel(order)}
                                    className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
                                    title="In mã vận đơn dán thùng carton (A6)"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <select
                                  aria-label="Cập nhật trạng thái đơn hàng"
                                  value={order.status}
                                  onChange={(e) => handleChangeOrderStatus(order.id, e.target.value as any)}
                                  className="text-[11px] font-semibold bg-slate-100 border border-slate-200 rounded px-1.5 py-1 text-slate-700 focus:outline-none"
                                >
                                  <option value="pending">Mới</option>
                                  <option value="packing">Đóng gói</option>
                                  <option value="ready_for_pickup">Sẵn tại quầy</option>
                                  <option value="shipping">Đang giao</option>
                                  <option value="completed">Hoàn tất</option>
                                </select>
                              </div>
                            </div>
                          ))}

                          {colOrders.length === 0 && (
                            <div className="text-center py-8 text-xs text-slate-400">
                              Chưa có đơn hàng trong giai đoạn này
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Manual Order Creation Form */}
            {omsSubTab === 'manual_order' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-5">
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Tạo Đơn Hàng Thủ Công (Khách gọi Hotline / Đặt qua Zalo)</h4>
                  <p className="text-xs text-slate-500">Nhân viên tiếp nhận yêu cầu có thể lên đơn nhanh, tự động trừ tồn kho và gửi tin nhắn xác nhận</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tên khách hàng / Đơn vị:</label>
                    <input
                      type="text"
                      placeholder="VD: Anh Minh - Cty FPT"
                      value={manualCustName}
                      onChange={(e) => setManualCustName(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại liên hệ:</label>
                    <input
                      type="tel"
                      placeholder="VD: 0912 345 678"
                      value={manualCustPhone}
                      onChange={(e) => setManualCustPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ giao hàng (hoặc nhận tại 168 Nguyễn Trãi):</label>
                  <input
                    type="text"
                    placeholder="VD: Tòa nhà Bitexco, Q.1 hoặc ghi 'Nhận tại quầy'"
                    value={manualCustAddress}
                    onChange={(e) => setManualCustAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Select products to add */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Chọn sản phẩm văn phòng phẩm thêm vào đơn:</label>
                  <div className="flex gap-2 mb-3">
                    <select
                      aria-label="Chọn sản phẩm nhanh"
                      id="manualProductSelect"
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    >
                      {productsList.slice(0, 30).map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} - {formatVND(p.price)} / {p.unit} (Còn {p.stockOffline} tại quầy)
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const sel = (document.getElementById('manualProductSelect') as HTMLSelectElement)?.value;
                        const prod = productsList.find((p) => p.id === sel);
                        if (prod) {
                          setManualItems([...manualItems, { product: prod, quantity: 1 }]);
                        }
                      }}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700"
                    >
                      + Thêm món
                    </button>
                  </div>

                  {manualItems.length > 0 && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                      {manualItems.map((item, index) => (
                        <div key={index} className="p-3 flex items-center justify-between text-xs bg-slate-50">
                          <div>
                            <span className="font-semibold text-slate-900">{item.product.name}</span>
                            <span className="text-slate-500 block">{formatVND(item.product.price)} × {item.quantity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const q = Math.max(1, Number(e.target.value));
                                const next = [...manualItems];
                                next[index].quantity = q;
                                setManualItems(next);
                              }}
                              className="w-16 px-2 py-1 text-center bg-white border border-slate-200 rounded"
                            />
                            <button
                              type="button"
                              onClick={() => setManualItems(manualItems.filter((_, i) => i !== index))}
                              className="text-rose-500 hover:text-rose-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!manualCustName.trim() || manualItems.length === 0) {
                        alert('Vui lòng nhập tên khách và chọn ít nhất 1 sản phẩm');
                        return;
                      }
                      const subtotal = manualItems.reduce((s, it) => s + it.product.price * it.quantity, 0);
                      const newOrd = createOrder({
                        customerName: manualCustName,
                        phone: manualCustPhone || '0900000000',
                        address: manualCustAddress || 'Nhận tại quầy 168 Nguyễn Trãi',
                        orderType: manualCustAddress.includes('quầy') ? 'store_pickup' : 'online_delivery',
                        paymentMethod: manualPayment,
                        requestVatInvoice: false,
                        items: manualItems,
                        subtotal,
                        discount: 0,
                        shippingFee: 0,
                        total: subtotal,
                        status: 'pending',
                        channel: 'hotline',
                        shippingCode: `VPP-HL-${Date.now().toString().slice(-5)}`
                      });
                      setOrdersList([newOrd, ...ordersList]);
                      setManualItems([]);
                      setManualCustName('');
                      setManualCustPhone('');
                      setManualCustAddress('');
                      setOmsSubTab('all_orders');
                    }}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition"
                  >
                    Xác Nhận Tạo Đơn Hàng Hotline
                  </button>
                </div>
              </div>
            )}

            {/* Sub-tab 3: Return & Refund RMA */}
            {omsSubTab === 'returns' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Quy Trình Xử Lý Đổi Trả Hàng & Hoàn Tiền (RMA)</h4>
                  <p className="text-xs text-slate-500">Chính sách cam kết 7 ngày đổi trả sản phẩm lỗi vận chuyển hoặc giao nhầm mã</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th className="p-3">Mã Yêu Cầu</th>
                        <th className="p-3">Mã Đơn Gốc</th>
                        <th className="p-3">Khách Hàng / SĐT</th>
                        <th className="p-3">Lý Do Đổi Trả</th>
                        <th className="p-3">Số Tiền Hoàn</th>
                        <th className="p-3">Trạng Thái</th>
                        <th className="p-3 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {returns.map((ret) => (
                        <tr key={ret.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-indigo-700">{ret.id}</td>
                          <td className="p-3 font-mono text-slate-700">{ret.orderId}</td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-900">{ret.customerName}</div>
                            <div className="text-slate-400 text-xs">{ret.phone}</div>
                          </td>
                          <td className="p-3 text-slate-600 max-w-xs">{ret.reason}</td>
                          <td className="p-3 font-bold text-emerald-700">{formatVND(ret.totalRefund)}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              ret.status === 'refunded'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {ret.status === 'refunded' ? 'Đã hoàn tiền' : 'Đã duyệt (Chờ nhận hàng)'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {ret.status !== 'refunded' && (
                              <button
                                onClick={() => {
                                  setReturns((prev) =>
                                    prev.map((r) => (r.id === ret.id ? { ...r, status: 'refunded' } : r))
                                  );
                                  showToast(`Đã xác nhận hoàn tiền ${formatVND(ret.totalRefund)} cho ${ret.customerName}`);
                                }}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                              >
                                Hoàn Tiền Ngay
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE 3: CRM (Hồ sơ khách hàng, phân loại B2B, tích điểm)*/}
        {/* ========================================================= */}
        {activeTab === 'crm' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm khách hàng theo tên, SĐT hoặc MST..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  aria-label="Phân loại nhóm khách hàng"
                  value={customerSegmentFilter}
                  onChange={(e) => setCustomerSegmentFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium"
                >
                  <option value="all">Tất cả nhóm khách</option>
                  <option value="b2b">Doanh nghiệp B2B (Ký hợp đồng)</option>
                  <option value="vip">Khách Hàng VIP</option>
                  <option value="guest">Khách Vãng Lai</option>
                </select>

                <button
                  onClick={() => {
                    const name = prompt('Nhập tên khách hàng / Công ty mới:');
                    const phone = prompt('Nhập số điện thoại:');
                    if (name && phone) {
                      const newCust: CustomerRecord = {
                        id: `crm-${Date.now()}`,
                        name,
                        phone,
                        email: 'contact@client.vn',
                        segment: 'b2b',
                        segmentNameVi: 'Doanh nghiệp B2B',
                        totalSpent: 0,
                        orderCount: 0,
                        loyaltyPoints: 100,
                        notes: 'Khách hàng mới tạo từ admin'
                      };
                      setCustomers([newCust, ...customers]);
                      showToast(`Đã lưu hồ sơ khách hàng "${name}"`);
                    }
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  + Thêm Hồ Sơ Khách
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {customers
                .filter((c) => {
                  const matchS = c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                    c.phone.includes(customerSearch) ||
                    (c.taxCode && c.taxCode.includes(customerSearch));
                  const matchSeg = customerSegmentFilter === 'all' || c.segment === customerSegmentFilter;
                  return matchS && matchSeg;
                })
                .map((cust) => (
                  <div key={cust.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">{cust.name}</h4>
                        <span className="text-xs text-slate-500">{cust.phone} • {cust.email}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        cust.segment === 'b2b'
                          ? 'bg-blue-100 text-blue-800'
                          : cust.segment === 'vip'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {cust.segmentNameVi}
                      </span>
                    </div>

                    {cust.taxCode && (
                      <div className="bg-slate-50 p-2.5 rounded-xl text-xs text-slate-700 space-y-1">
                        <div>Mã số thuế: <strong>{cust.taxCode}</strong></div>
                        <div className="text-[11px] text-slate-500">{cust.companyName}</div>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2 text-center py-2 border-y border-slate-100">
                      <div>
                        <div className="text-[11px] text-slate-400">Tổng chi tiêu</div>
                        <div className="text-xs font-bold text-emerald-700">{formatVND(cust.totalSpent)}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-400">Số đơn</div>
                        <div className="text-xs font-bold text-slate-800">{cust.orderCount}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-400">Điểm thưởng</div>
                        <div className="text-xs font-bold text-amber-600">{cust.loyaltyPoints} pts</div>
                      </div>
                    </div>

                    {cust.notes && (
                      <p className="text-xs text-slate-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                        {cust.notes}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE 4: CMS & MARKETING (Banner, Voucher, Song ngữ)     */}
        {/* ========================================================= */}
        {activeTab === 'cms' && (
          <div className="space-y-6">
            <div className="flex gap-2 border-b border-slate-200 pb-4">
              <button
                onClick={() => setCmsSubTab('banners')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  cmsSubTab === 'banners' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                Slider Banner Trang Chủ ({banners.length})
              </button>
              <button
                onClick={() => setCmsSubTab('vouchers')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  cmsSubTab === 'vouchers' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                Khuyến Mãi & Voucher ({vouchers.length})
              </button>
              <button
                onClick={() => setCmsSubTab('articles')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  cmsSubTab === 'articles' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                Bài Viết & Trang Tĩnh Song Ngữ ({articles.length})
              </button>
            </div>

            {/* Banners */}
            {cmsSubTab === 'banners' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-900">Quản Lý Slider Banner Trang Chủ & Banner Ngành Hàng</h4>
                  <button
                    onClick={() => {
                      const title = prompt('Tiêu đề banner:');
                      const subtitle = prompt('Phụ đề ngắn:');
                      if (title) {
                        const newB: HomeBanner = {
                          id: `banner-${Date.now()}`,
                          title,
                          subtitle: subtitle || '',
                          image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1600&auto=format&fit=crop&q=80',
                          link: '/products',
                          active: true,
                          order: banners.length + 1
                        };
                        setBanners([...banners, newB]);
                        showToast('Đã thêm banner mới thành công!');
                      }
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                  >
                    + Thêm Banner Mới
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {banners.map((b) => (
                    <div key={b.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-3 p-3">
                      <div className="h-36 rounded-xl bg-cover bg-center relative" style={{ backgroundImage: `url(${b.image})` }}>
                        <div className="absolute inset-0 bg-black/40 rounded-xl flex flex-col justify-end p-3 text-white">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">{b.badge || 'PROMO'}</span>
                          <h5 className="font-bold text-sm line-clamp-1">{b.title}</h5>
                        </div>
                      </div>
                      <div className="text-xs text-slate-600 line-clamp-2">{b.subtitle}</div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="text-slate-500 font-mono">Link: {b.link}</span>
                        <button
                          onClick={() => {
                            setBanners(banners.filter((item) => item.id !== b.id));
                            showToast(`Đã xóa banner "${b.title}"`);
                          }}
                          className="text-rose-600 hover:text-rose-800 font-semibold"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vouchers */}
            {cmsSubTab === 'vouchers' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-900">Cấu Hình Mã Giảm Giá & Flash Sale</h4>
                  <button
                    onClick={() => {
                      const code = prompt('Nhập mã voucher (VD: CHAOHANG20):');
                      if (code) {
                        const newV: VoucherPromo = {
                          id: `vouch-${Date.now()}`,
                          code: code.toUpperCase(),
                          description: 'Ưu đãi khuyến mãi văn phòng phẩm',
                          discountType: 'fixed',
                          discountValue: 30000,
                          minOrderRequirement: 200000,
                          startDate: '2026-09-01',
                          endDate: '2026-12-31',
                          usageLimit: 500,
                          usedCount: 0,
                          active: true
                        };
                        setVouchers([...vouchers, newV]);
                        showToast(`Đã tạo mã giảm giá ${code.toUpperCase()}`);
                      }
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                  >
                    + Tạo Mã Voucher Mới
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {vouchers.map((v) => (
                    <div key={v.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-emerald-700 text-base bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          {v.code}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          Đã dùng: {v.usedCount} / {v.usageLimit}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700">{v.description}</p>
                      <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl space-y-1">
                        <div>Đơn tối thiểu: <strong>{formatVND(v.minOrderRequirement)}</strong></div>
                        <div>Mức giảm: <strong>{v.discountType === 'fixed' ? formatVND(v.discountValue) : `${v.discountValue}%`}</strong></div>
                        <div>Thời hạn: Đến {v.endDate}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Articles CMS Song Ngữ */}
            {cmsSubTab === 'articles' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-slate-900">Quản Trị Bài Viết & Chính Sách Song Ngữ</h4>
                    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold">
                      <button
                        onClick={() => setArticleLang('vi')}
                        className={`px-3 py-1 rounded-md transition ${articleLang === 'vi' ? 'bg-white shadow-2xs text-emerald-700' : 'text-slate-600'}`}
                      >
                        Tiếng Việt
                      </button>
                      <button
                        onClick={() => setArticleLang('en')}
                        className={`px-3 py-1 rounded-md transition ${articleLang === 'en' ? 'bg-white shadow-2xs text-emerald-700' : 'text-slate-600'}`}
                      >
                        English
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {articles.map((art) => (
                    <div key={art.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                          {art.categoryNameVi}
                        </span>
                        <span className="text-xs text-slate-400">Cập nhật: {art.updatedAt} • Tác giả: {art.author}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">
                        {articleLang === 'vi' ? art.titleVi : art.titleEn}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {articleLang === 'vi' ? art.contentVi : art.contentEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE 5: ANALYTICS & TỒN KHO ĐỌNG VỐN                    */}
        {/* ========================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Top Stat Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <div className="text-xs font-semibold text-slate-500">Doanh thu tháng này</div>
                <div className="text-2xl font-black text-emerald-600">{formatVND(184200000)}</div>
                <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +18.4% so với tháng trước
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <div className="text-xs font-semibold text-slate-500">Tổng giá trị hàng tồn kho (Đọng vốn)</div>
                <div className="text-2xl font-black text-slate-900">{formatVND(inventoryValuation)}</div>
                <div className="text-[11px] text-slate-400">Tính trên 2.000 SKU online & offline</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <div className="text-xs font-semibold text-slate-500">Tổng đơn hàng đã xử lý</div>
                <div className="text-2xl font-black text-blue-600">328 đơn</div>
                <div className="text-[11px] text-slate-500">Web shop: 62% • Quầy 168 NT: 38%</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <div className="text-xs font-semibold text-slate-500">Tỷ lệ xuất VAT Doanh Nghiệp</div>
                <div className="text-2xl font-black text-indigo-600">74.2%</div>
                <div className="text-[11px] text-slate-500">Chủ yếu hóa đơn từ 500k trở lên</div>
              </div>
            </div>

            {/* Top Best Sellers vs Stagnant Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Top 5 Sản Phẩm Bán Chạy Nhất (Vòng quay nhanh)
                  </h4>
                  <span className="text-xs text-slate-400">Doanh số 30 ngày</span>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Giấy In Double A A4 70gsm (Ram 500 tờ)', sold: 420, rev: 27300000 },
                    { name: 'Bút Bi Thiên Long TL-027 0.5mm', sold: 380, rev: 28500000 },
                    { name: 'Bìa Còng Thiên Long 7cm Khổ F4', sold: 210, rev: 11550000 },
                    { name: 'Băng Keo Trong OPP 200 Yard (Cây 6 cuộn)', sold: 195, rev: 17160000 },
                    { name: 'Máy Tính Casio FX-580VNX', sold: 85, rev: 55250000 }
                  ].map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                      <div>
                        <span className="font-bold text-slate-900 block">{idx + 1}. {it.name}</span>
                        <span className="text-slate-400">Đã bán: {it.sold} đơn vị</span>
                      </div>
                      <span className="font-bold text-emerald-700">{formatVND(it.rev)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Top Sản Phẩm Chậm Tiêu Thụ (Cảnh Báo Đọng Vốn)
                  </h4>
                  <span className="text-xs text-slate-400">Tồn kho {'>'} 60 ngày</span>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Bìa Lá 100 Lá Plus Dày Khổ A4', stock: 120, cap: 9600000, action: 'Khuyến nghị xả hàng -15%' },
                    { name: 'Máy Đục Lỗ Deli 50 Tờ Kim Loại Nặng', stock: 45, cap: 8100000, action: 'Tạo combo tặng giấy' },
                    { name: 'Bút Sáp Màu Thượng Hạng 36 Màu', stock: 80, cap: 6400000, action: 'Gợi ý quà tặng mùa tựu trường' },
                    { name: 'Giấy Than Xanh Horse Thái Lan Hộp 100 tờ', stock: 65, cap: 5200000, action: 'Chuyển sang chào khách B2B' }
                  ].map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                      <div>
                        <span className="font-bold text-slate-900 block">{it.name}</span>
                        <span className="text-amber-700 font-medium">Tồn: {it.stock} cái • Vốn đọng: {formatVND(it.cap)}</span>
                      </div>
                      <span className="px-2 py-1 rounded bg-amber-50 text-amber-800 text-[10px] font-semibold">
                        {it.action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE 6: CÀI ĐẶT HỆ THỐNG & PHÂN QUYỀN NHÂN SỰ (RBAC)    */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="flex gap-2 border-b border-slate-200 pb-4">
              <button
                onClick={() => setSettingsSubTab('store_info')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  settingsSubTab === 'store_info' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                Thông Tin Cửa Hàng & Thanh Toán
              </button>
              <button
                onClick={() => setSettingsSubTab('min_order')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  settingsSubTab === 'min_order' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                Cài Đặt Đơn Hàng Tối Thiểu
              </button>
              <button
                onClick={() => setSettingsSubTab('rbac')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  settingsSubTab === 'rbac' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                Phân Quyền Nhân Sự (RBAC) ({staffList.length})
              </button>
              <button
                onClick={() => setSettingsSubTab('shipping')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  settingsSubTab === 'shipping' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                Biểu Phí Giao Hàng Khu Vực
              </button>
            </div>

            {/* Store Info & Payments */}
            {settingsSubTab === 'store_info' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-3xl space-y-4">
                <h4 className="font-bold text-slate-900 text-base">Cấu Hình Cửa Hàng Trực Tiếp & Phương Thức Thanh Toán</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ cửa hàng offline:</label>
                    <input
                      type="text"
                      defaultValue={storeSettings.storeAddress || 'Số 168 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh'}
                      onBlur={(e) => updateStoreSettings({ storeAddress: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Hotline cửa hàng / Zalo:</label>
                      <input
                        type="text"
                        defaultValue={storeSettings.storeHotline || '0908 123 456'}
                        onBlur={(e) => updateStoreSettings({ storeHotline: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Giờ mở cửa đón khách:</label>
                      <input
                        type="text"
                        defaultValue={storeSettings.storeOpeningHours || '07:30 - 21:30 hàng ngày'}
                        onBlur={(e) => updateStoreSettings({ storeOpeningHours: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Các cổng thanh toán chấp nhận:</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Thanh toán khi nhận hàng (COD)', active: true },
                        { label: 'Chuyển khoản VietQR Napas 24/7', active: true },
                        { label: 'Ví điện tử MoMo Doanh Nghiệp', active: true },
                        { label: 'Tiền mặt & Quẹt thẻ quầy 168 NT', active: true }
                      ].map((pay, i) => (
                        <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>{pay.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Min Order Settings */}
            {settingsSubTab === 'min_order' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl space-y-4">
                <h4 className="font-bold text-slate-900 text-base">Cài Đặt Logic Đơn Hàng Tối Thiểu (Minimum Order Value)</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thiết lập số tiền mua tối thiểu để khách hàng có thể đặt đơn giao tận nơi. Khách mua dưới số tiền này vẫn được chọn hình thức <strong>Nhận tại quầy (Store Pickup)</strong> hoàn toàn miễn phí.
                </p>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <input
                    type="checkbox"
                    id="minOrderToggle"
                    checked={minOrderEnabled}
                    onChange={(e) => updateMinOrderSettings(minOrderValue, e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <label htmlFor="minOrderToggle" className="text-xs font-semibold text-slate-900 cursor-pointer">
                    Bật ràng buộc số tiền đơn hàng tối thiểu khi đặt online
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số tiền tối thiểu hiện tại:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="10000"
                      value={minOrderValue}
                      onChange={(e) => updateMinOrderSettings(Number(e.target.value), minOrderEnabled)}
                      className="flex-1 px-3 py-2 text-sm font-bold text-emerald-700 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                    <span className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600 flex items-center">
                      VNĐ
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 block mb-1.5">Chọn nhanh mức cấu hình:</span>
                  <div className="flex flex-wrap gap-2">
                    {[50000, 100000, 150000, 200000, 300000, 500000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => updateMinOrderSettings(amount, true)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                          minOrderValue === amount && minOrderEnabled
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {formatVND(amount)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* RBAC Staff Users */}
            {settingsSubTab === 'rbac' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-900">Phân Quyền Nhân Sự Theo Vai Trò (Role-Based Access Control)</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {staffList.map((staff) => (
                    <div key={staff.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
                          {staff.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900 text-sm">{staff.name}</h5>
                          <span className="text-xs text-slate-500">{staff.email} • {staff.phone}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl space-y-1 text-xs">
                        <div className="flex justify-between font-semibold">
                          <span className="text-slate-600">Vai trò:</span>
                          <span className="text-emerald-700">{staff.roleNameVi}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                          Quyền hạn: {staff.permissions.join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping zones */}
            {settingsSubTab === 'shipping' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-900 text-base">Biểu Phí Giao Hàng & Thời Gian Ước Tính Theo Khu Vực</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th className="p-3">Tên Khu Vực</th>
                        <th className="p-3">Quận Huyện Áp Dụng</th>
                        <th className="p-3">Cước Phí</th>
                        <th className="p-3">Thời Gian Giao Dự Kiến</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {shippingZones.map((zone) => (
                        <tr key={zone.id}>
                          <td className="p-3 font-bold text-slate-900">{zone.zoneName}</td>
                          <td className="p-3 text-slate-600">{zone.areas}</td>
                          <td className="p-3 font-bold text-emerald-700">{formatVND(zone.fee)}</td>
                          <td className="p-3 text-slate-500">{zone.estimatedDays}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL: Thêm Sản Phẩm Mới (PIM CRUD)                       */}
      {/* ========================================================= */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Thêm Mã Hàng Văn Phòng Phẩm Mới (SKU)</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên sản phẩm (*):</label>
                <input
                  type="text"
                  placeholder="VD: Bút Bi Thiên Long TL-027 Mực Xanh"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mã SKU (tự sinh nếu để trống):</label>
                  <input
                    type="text"
                    placeholder="VD: VPP-TL-027"
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Thương hiệu:</label>
                  <select
                    aria-label="Chọn thương hiệu"
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Thiên Long">Thiên Long</option>
                    <option value="Double A">Double A</option>
                    <option value="Deli">Deli</option>
                    <option value="Plus">Plus</option>
                    <option value="King Jim">King Jim</option>
                    <option value="Casio">Casio</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giá bán lẻ (VNĐ):</label>
                  <input
                    type="number"
                    step="1000"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giá sỉ ({'>'}10 cái):</label>
                  <input
                    type="number"
                    step="1000"
                    value={newProdWholesale}
                    onChange={(e) => setNewProdWholesale(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-blue-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tồn kho Online:</label>
                  <input
                    type="number"
                    value={newProdStockOnline}
                    onChange={(e) => setNewProdStockOnline(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tồn tại quầy 168 NT:</label>
                  <input
                    type="number"
                    value={newProdStockOffline}
                    onChange={(e) => setNewProdStockOffline(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vị trí kệ cửa hàng:</label>
                  <input
                    type="text"
                    value={newProdShelf}
                    onChange={(e) => setNewProdShelf(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Đơn vị tính:</label>
                  <input
                    type="text"
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAddProduct}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                Lưu Sản Phẩm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: In Mã Vận Đơn Dán Thùng Carton A6                  */}
      {/* ========================================================= */}
      {selectedShippingLabel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-bold text-slate-900 text-sm">Xem Trước Nhãn Vận Đơn Khổ A6 (Dán Thùng)</h4>
              <button onClick={() => setSelectedShippingLabel(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* A6 Carton Label Mockup */}
            <div className="border-2 border-dashed border-slate-800 p-4 rounded-xl bg-white space-y-3 font-sans">
              <div className="flex justify-between items-start border-b-2 border-slate-800 pb-2">
                <div>
                  <span className="font-black text-slate-900 text-sm tracking-tight">VĂN PHÒNG PHẨM & CỬA HÀNG 168 NT</span>
                  <div className="text-[10px] text-slate-600">Hotline: 0908 123 456 • 168 Nguyễn Trãi, Q.1</div>
                </div>
                <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                  {selectedShippingLabel.paymentMethod.toUpperCase()}
                </span>
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">NGƯỜI NHẬN HÀNG:</div>
                <div className="font-black text-slate-900 text-base">{selectedShippingLabel.customerName}</div>
                <div className="font-bold text-slate-900 text-sm">{selectedShippingLabel.phone}</div>
                <div className="text-xs text-slate-700 mt-1 leading-tight">{selectedShippingLabel.address}</div>
              </div>

              <div className="border-t border-slate-300 pt-2 text-xs">
                <div className="flex justify-between font-bold">
                  <span>MÃ ĐƠN HÀNG:</span>
                  <span className="font-mono">{selectedShippingLabel.id}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Số lượng: {selectedShippingLabel.items.length} mặt hàng</span>
                  <span className="font-bold text-emerald-800">THU COD: {selectedShippingLabel.paymentMethod === 'cod' ? formatVND(selectedShippingLabel.total) : '0đ (ĐÃ THANH TOÁN)'}</span>
                </div>
              </div>

              <div className="text-center pt-2 border-t-2 border-slate-800">
                <div className="text-[11px] font-mono font-black tracking-widest">
                  |||||| |||||||||| |||||||| |||||||||||
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {selectedShippingLabel.shippingCode || `VPP-GHN-${selectedShippingLabel.id}`}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedShippingLabel(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  window.print();
                  setSelectedShippingLabel(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                In Nhãn Vận Đơn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: In Hóa Đơn Bán Lẻ Khổ 80mm                         */}
      {/* ========================================================= */}
      {selectedPrintOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-bold text-slate-900 text-sm">Hóa Đơn Bán Lẻ (K80 Receipt)</h4>
              <button onClick={() => setSelectedPrintOrder(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs space-y-2">
              <div className="text-center pb-2 border-b border-dashed border-slate-300">
                <div className="font-bold text-sm text-slate-900">VĂN PHÒNG PHẨM TRỰC TIẾP</div>
                <div className="text-[11px] text-slate-500">168 Nguyễn Trãi, P. Bến Thành, Q.1</div>
                <div className="text-[11px] text-slate-500">Mã đơn: {selectedPrintOrder.id}</div>
              </div>

              <div className="space-y-1 py-1">
                {selectedPrintOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="line-clamp-1 max-w-[170px]">{it.product.name} ×{it.quantity}</span>
                    <span className="font-bold">{formatVND(it.product.price * it.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{formatVND(selectedPrintOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-slate-900">
                  <span>TỔNG CỘNG:</span>
                  <span>{formatVND(selectedPrintOrder.total)}</span>
                </div>
              </div>

              <div className="text-center pt-2 text-[10px] text-slate-400">
                Cảm ơn quý khách! Đổi trả trong 7 ngày kèm hóa đơn.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedPrintOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  window.print();
                  setSelectedPrintOrder(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                In Hóa Đơn K80
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
