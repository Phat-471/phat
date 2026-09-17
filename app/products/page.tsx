'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { CATEGORIES, generate2000Products, formatVND } from '@/lib/stationery-data';
import { Product } from '@/lib/types';
import {
  Search,
  Filter,
  Grid,
  List,
  Store,
  Layers,
  Plus,
  Eye,
  Check,
  ChevronRight,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCat = searchParams.get('category') || 'all';

  const { products: baseProducts, addToCart, cartCount, minOrderValue, minOrderEnabled } = useStore();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState<'all' | 'under50' | '50to100' | '100to300' | 'over300'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'name'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isExpandedTo2000, setIsExpandedTo2000] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // 2000 SKU Dataset generator
  const catalogList = useMemo(() => {
    if (isExpandedTo2000) {
      return generate2000Products();
    }
    return baseProducts;
  }, [isExpandedTo2000, baseProducts]);

  // Unique brands
  const brands = useMemo(() => {
    const list = Array.from(new Set(catalogList.map((p) => p.brand))).filter(Boolean);
    return ['all', ...list];
  }, [catalogList]);

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return catalogList
      .filter((p) => {
        // Category
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        // Brand
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.barcode.includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q);
          if (!match) return false;
        }
        // Price range
        if (priceRange === 'under50' && p.price >= 50000) return false;
        if (priceRange === '50to100' && (p.price < 50000 || p.price > 100000)) return false;
        if (priceRange === '100to300' && (p.price < 100000 || p.price > 300000)) return false;
        if (priceRange === 'over300' && p.price < 300000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        // Default: featured & bestSeller first
        if (a.bestSeller && !b.bestSeller) return -1;
        if (!a.bestSeller && b.bestSeller) return 1;
        return 0;
      });
  }, [catalogList, selectedCategory, selectedBrand, searchQuery, priceRange, sortBy]);

  // Pagination (48 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setPriceRange('all');
    setSortBy('featured');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <SiteHeader />

      {/* Breadcrumb & Subheader */}
      <div className="bg-white border-b border-slate-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Link href="/" className="hover:text-emerald-700">Trang Chủ</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-semibold">Tất Cả Sản Phẩm</span>
            {selectedCategory !== 'all' && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-emerald-700 font-bold">
                  {CATEGORIES.find((c) => c.id === selectedCategory)?.name || selectedCategory}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">
              Tìm thấy <strong className="text-slate-900">{filteredProducts.length}</strong> sản phẩm
            </span>
            <button
              onClick={() => {
                setIsExpandedTo2000(!isExpandedTo2000);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
                isExpandedTo2000
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-2xs'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isExpandedTo2000 ? 'Kho 2.000 SKU (Bật)' : 'Bật Kho 2.000 SKU'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Left Filter Sidebar */}
          <aside className="hidden lg:block space-y-5 bg-white p-5 rounded-2xl border border-slate-200 h-fit sticky top-24 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-600" />
                <span>Bộ Lọc Sản Phẩm</span>
              </h3>
              {(selectedCategory !== 'all' || selectedBrand !== 'all' || priceRange !== 'all' || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-emerald-600 hover:underline font-semibold"
                >
                  Xóa lọc
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Danh Mục Ngành Hàng
              </h4>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    {selectedCategory === cat.id && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Ranges */}
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Khoảng Giá (VND)
              </h4>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'all', label: 'Tất cả mức giá' },
                  { id: 'under50', label: 'Dưới 50.000đ' },
                  { id: '50to100', label: '50.000đ - 100.000đ' },
                  { id: '100to300', label: '100.000đ - 300.000đ' },
                  { id: 'over300', label: 'Trên 300.000đ' }
                ].map((range) => (
                  <label
                    key={range.id}
                    className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange === range.id}
                      onChange={() => {
                        setPriceRange(range.id as any);
                        setCurrentPage(1);
                      }}
                      className="text-emerald-600 focus:ring-emerald-500 rounded-full"
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Thương Hiệu
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      setSelectedBrand(b);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedBrand === b
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{b === 'all' ? 'Tất cả thương hiệu' : b}</span>
                    {selectedBrand === b && <Check className="w-3 h-3 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Order Value Reminder Box */}
            {minOrderEnabled && (
              <div className="pt-3 border-t border-slate-100 bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Chính sách đơn tối thiểu</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Cửa hàng áp dụng mức tối thiểu <strong>{formatVND(minOrderValue)}</strong> cho đơn giao tận nơi. Nhận tại quầy 168 Nguyễn Trãi không giới hạn số lượng!
                </p>
              </div>
            )}
          </aside>

          {/* Right Product Grid Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Control Bar: Search Input, Sorting, View Toggle */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              {/* Search in results */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Lọc mã SKU, tên, mã vạch..."
                  className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1.5 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Lọc</span>
              </button>

              {/* Sorting and View Mode */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400 hidden sm:inline">Sắp xếp:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="py-1.5 px-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="featured">Nổi bật & Bán chạy</option>
                    <option value="price_asc">Giá: Thấp đến Cao</option>
                    <option value="price_desc">Giá: Cao đến Thấp</option>
                    <option value="name">Tên sản phẩm A-Z</option>
                  </select>
                </div>

                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-400'
                    }`}
                    title="Dạng lưới"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-400'
                    }`}
                    title="Dạng danh sách"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {paginatedItems.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-800">Không tìm thấy sản phẩm phù hợp</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Thử tìm kiếm với từ khóa khác, điều chỉnh bộ lọc hoặc bật danh mục 2.000 SKU để xem toàn bộ danh mục sản phẩm.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition-colors"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}

            {/* Products Grid View */}
            {viewMode === 'grid' && paginatedItems.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {paginatedItems.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden shadow-2xs"
                  >
                    <div>
                      {/* Image */}
                      <Link
                        href={`/products/${product.id}`}
                        className="relative h-36 sm:h-44 bg-slate-100 cursor-pointer overflow-hidden flex items-center justify-center block"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />

                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          <span className="font-mono text-[9px] font-bold bg-slate-900/85 text-white px-1.5 py-0.5 rounded shadow-2xs">
                            {product.sku.substring(0, 8)}
                          </span>
                          {product.bestSeller && (
                            <span className="text-[9px] font-bold bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded shadow-2xs">
                              Bán chạy
                            </span>
                          )}
                        </div>

                        {/* Shelf and store stock */}
                        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[9px] bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-lg border border-slate-200">
                          <span className="text-slate-600 flex items-center gap-1 font-medium truncate">
                            <Store className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                            <span>Tại quầy: <strong className="text-slate-900">{product.stockOffline}</strong></span>
                          </span>
                          <span className="text-slate-500 hidden sm:inline">
                            Kho: <strong className="text-slate-900">{product.stockOnline}</strong>
                          </span>
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="p-3 sm:p-3.5 space-y-1.5">
                        <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                          {product.brand}
                        </div>

                        <Link
                          href={`/products/${product.id}`}
                          className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-emerald-700 cursor-pointer transition-colors leading-snug min-h-[2.25rem]"
                        >
                          {product.name}
                        </Link>

                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <span className="text-slate-400">Vị trí:</span>
                          <span className="font-medium text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded text-[10px]">
                            {product.shelfLocation}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                          <div>
                            <div className="text-xs sm:text-base font-extrabold text-slate-900">
                              {formatVND(product.price)}
                            </div>
                            <span className="text-[9px] text-slate-400">/{product.unit}</span>
                          </div>
                          {product.wholesalePrice < product.price && (
                            <div className="text-right">
                              <span className="text-[9px] sm:text-[10px] text-emerald-700 font-bold block">
                                Sỉ: {formatVND(product.wholesalePrice)}
                              </span>
                              <span className="text-[8px] text-slate-400">từ 10 món</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-3 pt-0 flex items-center gap-1.5">
                      <Link
                        href={`/products/${product.id}`}
                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0"
                        title="Xem chi tiết sản phẩm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-[11px] font-bold transition-all shadow-2xs active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm Giỏ</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Products List View */}
            {viewMode === 'list' && paginatedItems.length > 0 && (
              <div className="space-y-3">
                {paginatedItems.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Link
                        href={`/products/${product.id}`}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain p-1"
                        />
                      </Link>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold bg-slate-100 px-1.5 py-0.2 rounded text-slate-600">
                            {product.sku}
                          </span>
                          <span className="text-xs font-semibold text-emerald-700 uppercase">
                            {product.brand}
                          </span>
                        </div>
                        <Link
                          href={`/products/${product.id}`}
                          className="text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-700 line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <div className="text-[11px] text-slate-500 flex items-center gap-3">
                          <span>Vị trí: <strong>{product.shelfLocation}</strong></span>
                          <span>Tại quầy: <strong>{product.stockOffline} {product.unit}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <div className="text-sm sm:text-base font-extrabold text-slate-900">
                          {formatVND(product.price)}
                        </div>
                        {product.wholesalePrice < product.price && (
                          <div className="text-[10px] text-emerald-700 font-semibold">
                            Sỉ: {formatVND(product.wholesalePrice)} /từ 10 món
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Thêm Giỏ</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs text-xs">
                <span className="text-slate-500">
                  Trang <strong>{currentPage}</strong> / {totalPages} (Tổng {filteredProducts.length} sản phẩm)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50 font-medium"
                  >
                    Trước
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50 font-medium"
                  >
                    Tiếp theo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Đang tải danh mục...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}
