'use client';

import React, { useState, useMemo } from 'react';
import { Product } from '@/lib/types';
import { CATEGORIES, BRANDS, formatVND } from '@/lib/stationery-data';
import {
  LayoutGrid,
  List,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Store,
  Truck,
  Plus,
  Eye,
  Download,
  UploadCloud,
  FileSpreadsheet,
  Layers,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  RotateCcw,
  FileText,
  Clock
} from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  stockFilter: 'all' | 'offline_available' | 'online_available';
  onStockFilterChange: (val: 'all' | 'offline_available' | 'online_available') => void;
  searchQuery: string;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  isExpandedTo2000: boolean;
  onToggleExpand2000: () => void;
  brandPrimaryColor: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  stockFilter,
  onStockFilterChange,
  searchQuery,
  onSelectProduct,
  onAddToCart,
  isExpandedTo2000,
  onToggleExpand2000,
  brandPrimaryColor,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'name_asc'>('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);

  // Filter products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.barcode.includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Brand filter
    if (selectedBrand !== 'Tất cả') {
      list = list.filter((p) => p.brand === selectedBrand);
    }

    // Stock availability filter
    if (stockFilter === 'offline_available') {
      list = list.filter((p) => p.stockOffline > 0);
    } else if (stockFilter === 'online_available') {
      list = list.filter((p) => p.stockOnline > 0);
    }

    // Sorting
    if (sortBy === 'popular') {
      list.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    } else if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name_asc') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }

    return list;
  }, [products, searchQuery, selectedCategory, selectedBrand, stockFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleExportCsv = () => {
    const headers = ['Mã SKU', 'Mã Vạch Barcode', 'Tên Sản Phẩm', 'Danh Mục', 'Thương Hiệu', 'ĐVT', 'Giá Bán Lẻ (VNĐ)', 'Giá Sỉ (VNĐ)', 'Tồn Kho Online', 'Tồn Tại Cửa Hàng Offline', 'Vị Trí Kệ'];
    const rows = filteredProducts.slice(0, 500).map((p) => [
      `"${p.sku}"`,
      `"${p.barcode}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      `"${p.brand}"`,
      `"${p.unit}"`,
      p.price,
      p.wholesalePrice,
      p.stockOnline,
      p.stockOffline,
      `"${p.shelfLocation}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `danh_muc_vpp_2000_ma_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-4 pb-24 md:pb-12">
      {/* 4 Vietnamese Consumer Trust Badges */}
      <div className="mb-4 grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
        <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-800 text-[11px] sm:text-xs">Đồng Kiểm Khi Nhận</div>
            <div className="text-[10px] text-slate-500">Mở kiểm tra trước khi trả tiền</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-800 text-[11px] sm:text-xs">Giao Siêu Tốc 2 Giờ</div>
            <div className="text-[10px] text-slate-500">Nội thành hoặc ghé tiệm lấy 15p</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-800 text-[11px] sm:text-xs">Đổi Trả 7 Ngày</div>
            <div className="text-[10px] text-slate-500">Hàng lỗi 1 đổi 1 tận nơi</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-800 text-[11px] sm:text-xs">Hóa Đơn Đỏ VAT</div>
            <div className="text-[10px] text-slate-500">Xuất hóa đơn công ty trong ngày</div>
          </div>
        </div>
      </div>

      {/* Category Pills & Scale 2000 Toggle Banner */}
      <div className="mb-5 space-y-3">
        {/* 2000 SKU Scale Notice & Action Bar */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg border border-emerald-800/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 uppercase tracking-wider">
                Quy mô danh mục
              </span>
              <span className="text-emerald-300 text-xs font-semibold">
                Đáp ứng chỉ tiêu dự kiến ~2.000 mã hàng
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Hệ Thống Phân Loại & Tra Cứu Đa Kênh (Online & 1 Cửa Hàng Offline)
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Dữ liệu đồng bộ tức thời: tra cứu vị trí kệ hàng tại quầy (Khu A, B, C, D) và số lượng tồn kho online để giao hàng tận nơi hoặc đóng gói lấy ngay.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onToggleExpand2000}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isExpandedTo2000
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isExpandedTo2000 ? 'Đang bật 2.000 Mã Hàng' : 'Kích hoạt đủ 2.000 Mã Hàng'}</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Xuất bảng mã hàng ra file CSV / Excel"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất Excel / CSV</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{cat.name}</span>
                {cat.id !== 'all' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid with Sidebar Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar Filter */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-600" />
                Bộ Lọc Sản Phẩm
              </h3>
              {(selectedBrand !== 'Tất cả' || stockFilter !== 'all' || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    onSelectBrand('Tất cả');
                    onStockFilterChange('all');
                    onSelectCategory('all');
                    setCurrentPage(1);
                  }}
                  className="text-[11px] text-emerald-600 hover:underline font-medium"
                >
                  Xóa lọc
                </button>
              )}
            </div>

            {/* Availability Filter (Online vs Offline) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Kho Hàng & Nơi Lấy
              </label>
              <div className="space-y-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    onStockFilterChange('all');
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                    stockFilter === 'all'
                      ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span>Tất cả mặt hàng</span>
                  <span className="font-mono text-[11px] text-slate-400">{products.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onStockFilterChange('offline_available');
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                    stockFilter === 'offline_available'
                      ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-amber-600" />
                    Có sẵn tại Cửa Hàng Offline
                  </span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                    Lấy ngay
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onStockFilterChange('online_available');
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                    stockFilter === 'online_available'
                      ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    Kho Online giao tận nơi
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-medium px-1.5 py-0.2 rounded">
                    Ship toàn quốc
                  </span>
                </button>
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Thương Hiệu
              </label>
              <div className="space-y-1 max-h-52 overflow-y-auto pr-1 text-xs">
                {BRANDS.map((brand) => {
                  const isSelected = selectedBrand === brand;
                  return (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => {
                        onSelectBrand(brand);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-slate-900 text-white font-medium'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{brand}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Offline Store Info Card */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-emerald-600" />
                Cửa Hàng Trực Tiếp
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Số 168 Nguyễn Trãi, P. Bến Thành, Q.1, TP.HCM
              </p>
              <div className="text-[11px] text-emerald-700 font-semibold">
                Giờ mở cửa: 07:30 - 21:00
              </div>
            </div>
          </div>
        </div>

        {/* Right Product Grid / List Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Controls Bar: Counts, Sort, View Toggle */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              Tìm thấy <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> mã hàng{' '}
              {searchQuery && (
                <span>
                  cho từ khóa &ldquo;<strong>{searchQuery}</strong>&rdquo;
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 hidden sm:inline">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="popular">Bán chạy nhất</option>
                  <option value="price_asc">Giá: Thấp đến Cao</option>
                  <option value="price_desc">Giá: Cao đến Thấp</option>
                  <option value="name_asc">Tên sản phẩm: A-Z</option>
                </select>
              </div>

              {/* Items Per Page */}
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none"
              >
                <option value={12}>12 / trang</option>
                <option value={24}>24 / trang</option>
                <option value={48}>48 / trang</option>
                <option value={100}>100 / trang</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-xs text-emerald-600' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Xem dạng lưới hình ảnh"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'table' ? 'bg-white shadow-xs text-emerald-600' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Xem dạng bảng SKU chi tiết (phù hợp đặt sỉ / B2B)"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {paginatedItems.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Không tìm thấy mã hàng phù hợp</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Thử xóa bộ lọc tìm kiếm hoặc từ khóa để xem toàn bộ danh mục văn phòng phẩm sẵn có.
              </p>
              <button
                onClick={() => {
                  onSelectBrand('Tất cả');
                  onStockFilterChange('all');
                  onSelectCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
              >
                Xem tất cả mặt hàng
              </button>
            </div>
          )}

          {/* Grid View (Optimized 2 columns on mobile, 3 on tablet/desktop) */}
          {viewMode === 'grid' && paginatedItems.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
              {paginatedItems.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden shadow-2xs"
                >
                  <div>
                    {/* Image & Badges */}
                    <div
                      onClick={() => onSelectProduct(product)}
                      className="relative h-32 sm:h-44 bg-slate-100 cursor-pointer overflow-hidden flex items-center justify-center"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      <div className="absolute top-1.5 sm:top-2.5 left-1.5 sm:left-2.5 flex flex-col gap-1">
                        <span className="font-mono text-[9px] sm:text-[10px] font-bold bg-slate-900/85 backdrop-blur-xs text-white px-1.5 sm:px-2 py-0.5 rounded shadow-xs">
                          {product.sku.substring(0, 8)}
                        </span>
                        {product.bestSeller && (
                          <span className="text-[9px] sm:text-[10px] font-bold bg-amber-500 text-slate-950 px-1.5 sm:px-2 py-0.5 rounded shadow-xs">
                            Bán chạy
                          </span>
                        )}
                      </div>

                      {/* Stock availability indicator */}
                      <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2 flex items-center justify-between text-[9px] sm:text-[10px] bg-white/95 backdrop-blur-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg border border-slate-200">
                        <span className="text-slate-600 flex items-center gap-1 font-medium truncate">
                          <Store className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 shrink-0" />
                          <span>Tại quầy: <strong className="text-slate-900">{product.stockOffline}</strong></span>
                        </span>
                        <span className="text-slate-500 hidden sm:inline">
                          Kho: <strong className="text-slate-900">{product.stockOnline}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-2.5 sm:p-4 space-y-1.5">
                      <div className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
                        {product.brand}
                      </div>

                      <h4
                        onClick={() => onSelectProduct(product)}
                        className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-emerald-700 cursor-pointer transition-colors leading-snug min-h-[2rem] sm:min-h-[2.5rem]"
                        title={product.name}
                      >
                        {product.name}
                      </h4>

                      <div className="text-[10px] sm:text-[11px] text-slate-500 flex items-center gap-1">
                        <span className="hidden sm:inline">Vị trí:</span>
                        <span className="font-medium text-slate-700 bg-slate-100 px-1 sm:px-1.5 py-0.2 rounded text-[10px]">
                          {product.shelfLocation}
                        </span>
                      </div>

                      {/* Price Section */}
                      <div className="pt-1.5 sm:pt-2 border-t border-slate-100 flex items-baseline justify-between">
                        <div>
                          <div className="text-xs sm:text-base font-extrabold text-slate-900">
                            {formatVND(product.price)}
                          </div>
                          <span className="text-[9px] sm:text-[10px] text-slate-400">/{product.unit}</span>
                        </div>
                        {product.wholesalePrice < product.price && (
                          <div className="text-right">
                            <span className="text-[9px] sm:text-[10px] text-emerald-700 font-bold block">
                              Sỉ: {formatVND(product.wholesalePrice)}
                            </span>
                            <span className="text-[8px] sm:text-[9px] text-slate-400">từ 10 món</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-2.5 sm:p-4 pt-0 flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0"
                      title="Xem chi tiết thông số & kệ hàng"
                    >
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => onAddToCart(product, 1)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-[11px] sm:text-xs font-bold transition-colors shadow-2xs active:scale-95 min-h-[34px] sm:min-h-[38px]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="sm:hidden">Thêm</span>
                      <span className="hidden sm:inline">Thêm Vào Giỏ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table / SKU List View (Specialized for B2B procurement & store clerks) */}
          {viewMode === 'table' && paginatedItems.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3">Mã SKU / Barcode</th>
                      <th className="p-3">Tên Sản Phẩm VPP</th>
                      <th className="p-3">Hãng</th>
                      <th className="p-3">Vị Trí Kệ</th>
                      <th className="p-3 text-center">Tại Quầy</th>
                      <th className="p-3 text-center">Kho Online</th>
                      <th className="p-3 text-right">Giá Bán Lẻ</th>
                      <th className="p-3 text-right">Giá Sỉ ({'>'}10)</th>
                      <th className="p-3 text-center">Mua Nhanh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedItems.map((p) => (
                      <tr key={p.id} className="hover:bg-emerald-50/40 transition-colors">
                        <td className="p-3">
                          <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                            {p.sku}
                          </span>
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">{p.barcode}</div>
                        </td>
                        <td className="p-3">
                          <div
                            onClick={() => onSelectProduct(p)}
                            className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer line-clamp-1"
                          >
                            {p.name}
                          </div>
                          <span className="text-[10px] text-slate-400">ĐVT: {p.unit}</span>
                        </td>
                        <td className="p-3 font-semibold text-slate-700">{p.brand}</td>
                        <td className="p-3">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                            {p.shelfLocation}
                          </span>
                        </td>
                        <td className="p-3 text-center font-bold">
                          {p.stockOffline > 0 ? (
                            <span className="text-emerald-700">{p.stockOffline}</span>
                          ) : (
                            <span className="text-red-500 text-[10px]">Hết hàng</span>
                          )}
                        </td>
                        <td className="p-3 text-center font-medium text-slate-600">{p.stockOnline}</td>
                        <td className="p-3 text-right font-extrabold text-slate-900">{formatVND(p.price)}</td>
                        <td className="p-3 text-right font-semibold text-emerald-700">
                          {formatVND(p.wholesalePrice)}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => onAddToCart(p, 1)}
                            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-2xs"
                            title="Thêm 1 vào giỏ"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-500">
                Hiển thị trang <strong className="text-slate-900 font-bold">{currentPage}</strong> /{' '}
                <strong className="text-slate-900 font-bold">{totalPages}</strong> ({filteredProducts.length} mặt hàng)
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-medium"
                >
                  Đầu
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-medium"
                >
                  Trước
                </button>

                {/* Page pills */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = currentPage - 2 + i;
                  if (pageNum < 1) pageNum = i + 1;
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg font-bold transition-colors ${
                        currentPage === pageNum
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-medium"
                >
                  Sau
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-medium"
                >
                  Cuối
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
