'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import { formatVND } from '@/lib/stationery-data';
import {
  Search,
  ShoppingCart,
  PhoneCall,
  MapPin,
  Flame,
  Home,
  Package,
  ClipboardList,
  User,
  ShieldCheck,
  ScanBarcode,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

interface SiteHeaderProps {
  onOpenBrandStudio?: () => void;
  onOpenStoreInfo?: () => void;
  onOpenB2BQuote?: () => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  onOpenB2BQuote
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    cartCount,
    products,
    showToast
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const matchingResults = searchQuery.trim().length > 1
    ? products
        .filter((p) => {
          const q = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.barcode.includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
          );
        })
        .slice(0, 6)
    : [];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) {
      showToast('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }
    showToast(`Đang tìm kiếm: ${q}`);
    router.push(`/products?q=${encodeURIComponent(q)}`);
    setIsSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white font-sans">
      {/* 1. Top Bar */}
      <div className="bg-[#0758b8] text-white text-[13px] border-b border-blue-800/30">
        <div className="max-w-[1240px] mx-auto px-3 sm:px-5 h-[38px] flex items-center justify-between">
          <span className="opacity-95 flex items-center gap-1.5 truncate">
            <span>🚚</span>
            <span className="truncate">Giao hàng nhanh • Hỗ trợ tư vấn tận tâm</span>
          </span>
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-xs sm:text-[13px]">
            <a href="tel:0900000000" className="hover:underline flex items-center gap-1">
              <span>Hotline: 0900 000 000</span>
            </a>
            <span className="opacity-50">|</span>
            <Link href="/orders" className="hover:underline">
              Theo dõi đơn hàng
            </Link>
            <span className="opacity-50 hidden md:inline">|</span>
            <Link
              href="/pos"
              className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-800/80 hover:bg-blue-900 text-cyan-200 text-xs font-semibold"
            >
              <span>⚡ POS Thu Ngân</span>
            </Link>
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold"
            >
              <span>⚙️ Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Head */}
      <div className="border-b border-[#e7edf5] bg-white">
        <div className="max-w-[1240px] mx-auto px-3 sm:px-5 h-[76px] sm:h-[82px] flex items-center gap-3 sm:gap-6 justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 select-none group">
            <div className="w-[42px] sm:w-[43px] h-[42px] sm:h-[43px] rounded-[13px] bg-gradient-to-br from-[#0c7be9] to-[#054ea7] text-white grid place-items-center text-[22px] sm:text-[23px] font-black shadow-xs group-hover:opacity-95 transition">
              ✦
            </div>
            <div>
              <strong className="block text-[17px] sm:text-[19px] font-extrabold text-[#162235] tracking-tight leading-tight">
                Văn Phòng Xanh
              </strong>
              <small className="text-[#6b778c] text-[10px] sm:text-[11px] block font-medium">
                Dụng cụ văn phòng · Nâng tầm hiệu suất
              </small>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="flex h-[45px] border border-[#d7e1ee] rounded-[9px] overflow-hidden bg-[#fafcff] focus-within:border-[#0969d7] focus-within:ring-2 focus-within:ring-blue-100 transition">
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 220)}
                placeholder="Tìm kiếm sản phẩm, mã SKU, thương hiệu..."
                className="flex-1 border-0 outline-none px-4 text-sm bg-transparent text-[#162235] placeholder:text-[#8d99ae]"
              />
              <button
                type="submit"
                className="w-[55px] border-0 bg-[#0969d7] hover:bg-[#0758b8] text-white text-[18px] grid place-items-center transition cursor-pointer"
                title="Tìm kiếm"
              >
                ⌕
              </button>
            </form>

            {/* Search Dropdown */}
            {isSearchFocused && matchingResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#e7edf5] rounded-xl shadow-xl overflow-hidden z-50">
                <div className="px-3 py-2 bg-[#f6f8fb] border-b border-[#e7edf5] text-[11px] font-bold uppercase tracking-wider text-[#6b778c] flex justify-between">
                  <span>Gợi ý nhanh ({matchingResults.length})</span>
                  <span>Nhấn để xem</span>
                </div>
                <div className="divide-y divide-[#e7edf5] max-h-72 overflow-y-auto">
                  {matchingResults.map((p) => (
                    <div
                      key={p.id}
                      onMouseDown={() => {
                        router.push(`/products/${p.id}`);
                        setSearchQuery('');
                      }}
                      className="p-2.5 hover:bg-[#f1f7ff] cursor-pointer flex items-center justify-between gap-2.5 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                          {p.sku.substring(0, 5)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#162235] line-clamp-1">{p.name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-[#6b778c]">
                            <span className="font-mono text-[#0969d7]">{p.sku}</span>
                            <span>•</span>
                            <span>{p.brand}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-[#e53935]">{formatVND(p.price)}</div>
                        <span className="text-[10px] text-[#6b778c]">/{p.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Head Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Link
              href="/account"
              className="border border-[#e7edf5] h-[45px] rounded-[9px] px-3 sm:px-3.5 flex items-center gap-2 bg-white hover:bg-[#f6f8fb] transition text-xs font-semibold text-[#162235] shadow-2xs"
            >
              <span className="text-base">♙</span>
              <span className="leading-tight text-left">
                Đăng nhập<br />
                <small className="text-[#6b778c] text-[10px] font-normal">Tài khoản</small>
              </span>
            </Link>

            <Link
              href="/cart"
              className="relative border border-[#e7edf5] h-[45px] rounded-[9px] px-3 sm:px-3.5 flex items-center gap-2 bg-white hover:bg-[#f6f8fb] transition text-xs font-semibold text-[#162235] shadow-2xs"
            >
              <span className="text-base">🛒</span>
              <span className="hidden sm:inline">Giỏ hàng</span>
              <span className="absolute -top-1.5 -right-1.5 bg-[#e53935] text-white rounded-full min-w-[18px] h-[18px] px-1 text-center text-[11px] leading-[18px] font-bold shadow-xs">
                {cartCount}
              </span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden border border-[#e7edf5] h-[45px] w-[45px] rounded-[9px] flex items-center justify-center bg-white hover:bg-slate-50 text-[#162235]"
              title="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar on small screens */}
        <div className="sm:hidden px-3 pb-3">
          <form onSubmit={handleSearchSubmit} className="flex h-[40px] border border-[#d7e1ee] rounded-[8px] overflow-hidden bg-[#fafcff]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm sản phẩm, SKU, thương hiệu..."
              className="flex-1 border-0 outline-none px-3 text-xs bg-transparent text-[#162235]"
            />
            <button
              type="submit"
              className="w-[45px] border-0 bg-[#0969d7] text-white text-base grid place-items-center"
            >
              ⌕
            </button>
          </form>
        </div>
      </div>

      {/* 3. Navigation Bar */}
      <nav className="bg-[#0758b8] text-white">
        <div className="max-w-[1240px] mx-auto px-3 sm:px-5 flex h-[46px] items-center overflow-x-auto scrollbar-none text-sm">
          <Link
            href="/products"
            className="font-bold bg-[#064b9d] hover:bg-[#053f85] px-4 sm:px-5 h-full flex items-center gap-2 shrink-0 transition"
          >
            <span>☰</span>
            <span>DANH MỤC</span>
          </Link>
          <Link
            href="/"
            className={`px-3 sm:px-4 h-full flex items-center shrink-0 transition hover:bg-[#064b9d] ${pathname === '/' ? 'bg-[#064b9d] font-bold' : ''}`}
          >
            Trang chủ
          </Link>
          <Link
            href="/products"
            className={`px-3 sm:px-4 h-full flex items-center shrink-0 transition hover:bg-[#064b9d] ${pathname === '/products' ? 'bg-[#064b9d] font-bold' : ''}`}
          >
            Sản phẩm
          </Link>
          <Link
            href="/#brands"
            className="px-3 sm:px-4 h-full flex items-center shrink-0 transition hover:bg-[#064b9d]"
          >
            Thương hiệu
          </Link>
          <Link
            href="/#promo"
            className="px-3 sm:px-4 h-full flex items-center shrink-0 transition hover:bg-[#064b9d]"
          >
            Khuyến mãi
          </Link>
          <Link
            href="/#news"
            className="px-3 sm:px-4 h-full flex items-center shrink-0 transition hover:bg-[#064b9d]"
          >
            Tin tức
          </Link>
          <Link
            href="/#faq"
            className="px-3 sm:px-4 h-full flex items-center shrink-0 transition hover:bg-[#064b9d]"
          >
            Hỏi đáp
          </Link>
          <Link
            href="/orders"
            className="px-3 sm:px-4 h-full flex items-center shrink-0 transition hover:bg-[#064b9d]"
          >
            Đơn hàng
          </Link>

          {/* Quick Channels */}
          <div className="ml-auto flex items-center gap-2 shrink-0 pl-3">
            <Link
              href="/pos"
              className="px-2.5 py-1 rounded bg-[#064b9d] hover:bg-[#053f85] text-cyan-300 text-xs font-bold transition flex items-center gap-1"
            >
              <span>⚡ POS Thu Ngân</span>
            </Link>
            <Link
              href="/admin"
              className="px-2.5 py-1 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition flex items-center gap-1"
            >
              <span>⚙️ Admin</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-[#e7edf5] bg-white px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-[#f6f8fb] text-[#162235] hover:bg-blue-50"
            >
              🏠 Trang chủ
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-[#f6f8fb] text-[#162235] hover:bg-blue-50"
            >
              📦 Danh mục sản phẩm
            </Link>
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-[#f6f8fb] text-[#162235] hover:bg-blue-50 flex items-center justify-between"
            >
              <span>🛒 Giỏ hàng</span>
              <span className="bg-[#e53935] text-white px-1.5 py-0.2 rounded-full text-[10px]">
                {cartCount}
              </span>
            </Link>
            <Link
              href="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-[#f6f8fb] text-[#162235] hover:bg-blue-50"
            >
              📋 Tra cứu đơn hàng
            </Link>
            <Link
              href="/pos"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-blue-50 text-[#0758b8] font-bold"
            >
              ⚡ Màn hình POS Quầy
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-amber-50 text-amber-900 font-bold"
            >
              ⚙️ Quản trị Admin VPP
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
