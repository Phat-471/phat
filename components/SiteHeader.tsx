'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import { LogoIcon } from './LogoIcon';
import { formatVND } from '@/lib/stationery-data';
import {
  Search,
  ShoppingCart,
  Store,
  FileText,
  ScanBarcode,
  Sparkles,
  PhoneCall,
  MapPin,
  ChevronRight,
  Globe,
  Flame,
  Home,
  Package,
  ClipboardList,
  User,
  Settings,
  AlertCircle,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

interface SiteHeaderProps {
  onOpenBrandStudio?: () => void;
  onOpenStoreInfo?: () => void;
  onOpenB2BQuote?: () => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  onOpenBrandStudio,
  onOpenStoreInfo,
  onOpenB2BQuote
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentBrand,
    cartCount,
    cartSubtotal,
    minOrderValue,
    minOrderEnabled,
    isMinOrderMet,
    products
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hotKeywords = [
    'Giấy A4 Double A',
    'Bút Thiên Long',
    'Bìa còng 7cm',
    'Casio 580',
    'Băng keo',
    'Bấm kim Plus'
  ];

  const matchingResults = searchQuery.trim().length > 1
    ? products
        .filter((p) => {
          const q = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.barcode.includes(q) ||
            p.brand.toLowerCase().includes(q)
          );
        })
        .slice(0, 6)
    : [];

  const navLinks = [
    { label: 'Trang Chủ', href: '/', icon: Home },
    { label: 'Sản Phẩm', href: '/products', icon: Package },
    { label: 'Giỏ Hàng', href: '/cart', icon: ShoppingCart, badge: cartCount },
    { label: 'Đơn Hàng', href: '/orders', icon: ClipboardList },
    { label: 'Admin Quản Trị', href: '/admin', icon: ShieldCheck, highlight: true }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner: Min Order Notice & Channel Switcher */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Channel selector */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[11px] shadow-2xs">
              <Globe className="w-3 h-3" />
              <span>Web Mua Sắm</span>
            </span>

            <Link
              href="/pos"
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 font-semibold text-[11px] transition-colors"
              title="Chuyển sang màn hình thu ngân POS tại cửa hàng"
            >
              <ScanBarcode className="w-3 h-3 text-cyan-400" />
              <span>Tại Quầy (POS)</span>
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-amber-300 hover:text-white hover:bg-slate-800 font-semibold text-[11px] transition-colors"
              title="Trung tâm Quản trị Admin VPP"
            >
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Admin Quản Trị</span>
            </Link>
          </div>

          {/* Minimum Order Value Dynamic Pill & Link to Admin */}
          <div className="flex items-center gap-2 text-[11px]">
            {minOrderEnabled ? (
              <div className="flex items-center gap-1.5 bg-slate-800/90 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                <span>
                  Đơn hàng tối thiểu:{' '}
                  <strong className="text-white underline">{formatVND(minOrderValue)}</strong>
                </span>
                <Link
                  href="/admin"
                  className="text-[10px] text-amber-200 hover:text-white font-bold ml-1 bg-amber-900/60 px-1.5 py-0.2 rounded"
                  title="Cài đặt trong Admin"
                >
                  Sửa trong Admin →
                </Link>
              </div>
            ) : (
              <span className="text-slate-400">
                Không giới hạn đơn tối thiểu •{' '}
                <Link href="/admin" className="text-emerald-400 hover:underline">
                  Bật trong Admin
                </Link>
              </span>
            )}
          </div>

          {/* Store Location & Hotline */}
          <div className="hidden lg:flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>168 Nguyễn Trãi, Q.1</span>
            </span>
            <span className="text-slate-700">|</span>
            <a
              href="tel:0908123456"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold"
            >
              <PhoneCall className="w-3 h-3" />
              <span>0908 123 456</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Bar: Logo, Search, Navigation Links */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 select-none group">
              <div className="transition-transform group-hover:scale-105">
                <LogoIcon type={currentBrand.logoType} color={currentBrand.primaryColor} size={38} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-base sm:text-lg font-extrabold tracking-tight"
                    style={{ color: currentBrand.primaryColor }}
                  >
                    {currentBrand.name}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-1 max-w-[220px] sm:max-w-[280px] italic">
                  {currentBrand.tagline}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 220)}
                placeholder="Tìm sản phẩm, SKU (VPP-..., GIAY-...), mã vạch..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600 p-0.5"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Live Autocomplete Results */}
            {isSearchFocused && matchingResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex justify-between">
                  <span>Gợi ý ({matchingResults.length})</span>
                  <span>Nhấn để xem chi tiết</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {matchingResults.map((p) => (
                    <div
                      key={p.id}
                      onMouseDown={() => {
                        router.push(`/products/${p.id}`);
                        setSearchQuery('');
                      }}
                      className="p-2.5 hover:bg-emerald-50/50 cursor-pointer flex items-center justify-between gap-2.5 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-[9px] font-mono font-bold text-slate-500">
                          {p.sku.substring(0, 6)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800 line-clamp-1">{p.name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                            <span className="font-mono text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-semibold">
                              {p.sku}
                            </span>
                            <span>•</span>
                            <span>{p.brand}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-emerald-700">{formatVND(p.price)}</div>
                        <span className="text-[9px] text-slate-400">/{p.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Items (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {link.badge}
                    </span>
                  )}
                  {link.highlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Right Action: Cart & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors relative"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Giỏ Hàng</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {cartCount}
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 lg:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar & Hot Keywords */}
        <div className="mt-2 md:hidden space-y-1.5">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm giấy A4, bút Thiên Long, bìa còng..."
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1.5 text-xs text-slate-400"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[10px]">
            <span className="text-slate-400 shrink-0 flex items-center gap-0.5 font-medium">
              <Flame className="w-2.5 h-2.5 text-amber-500" />
            </span>
            {hotKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => {
                  setSearchQuery(kw);
                  router.push(`/products?q=${encodeURIComponent(kw)}`);
                }}
                className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-600 whitespace-nowrap shrink-0 border border-slate-200/60"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="mt-2 pt-2 border-t border-slate-200 lg:hidden space-y-1 pb-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs px-3 text-slate-500">
              <Link
                href="/pos"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-cyan-700 font-bold flex items-center gap-1"
              >
                <ScanBarcode className="w-3.5 h-3.5" />
                <span>Mở quầy POS thu ngân</span>
              </Link>
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-amber-700 font-bold flex items-center gap-1"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Cài đơn tối thiểu</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
