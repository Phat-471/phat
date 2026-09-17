'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrandIdentity, Product } from '@/lib/types';
import { LogoIcon } from './LogoIcon';
import {
  Search,
  ShoppingCart,
  Store,
  FileText,
  ScanBarcode,
  Sparkles,
  PhoneCall,
  Clock,
  MapPin,
  ChevronRight,
  Globe,
  Flame
} from 'lucide-react';
import { formatVND } from '@/lib/stationery-data';

interface StoreHeaderProps {
  brand: BrandIdentity;
  cartCount: number;
  totalCatalogCount: number;
  products: Product[];
  onOpenBrandStudio: () => void;
  onOpenStoreInfo: () => void;
  onOpenCart: () => void;
  onOpenB2BQuote: () => void;
  onOpenPos: () => void;
  onSelectProduct: (product: Product) => void;
  onSearchQueryChange: (query: string) => void;
  searchQuery: string;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  brand,
  cartCount,
  totalCatalogCount,
  products,
  onOpenBrandStudio,
  onOpenStoreInfo,
  onOpenCart,
  onOpenB2BQuote,
  onOpenPos,
  onSelectProduct,
  onSearchQueryChange,
  searchQuery,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Hot keywords for Vietnamese shoppers
  const hotKeywords = [
    'Giấy A4 Double A',
    'Bút Thiên Long',
    'Bìa còng 7cm',
    'Casio 580',
    'Băng keo',
    'Bấm kim Plus'
  ];

  // Live autocomplete results
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

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Bar: Separation of Web Online & POS Tại Quầy + Store Status */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Channel Selector: Web vs POS Quầy */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[11px] shadow-xs">
              <Globe className="w-3 h-3" />
              <span>Web Mua Sắm Online</span>
            </span>

            <Link
              href="/pos"
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 font-semibold text-[11px] transition-colors"
              title="Chuyển sang màn hình thu ngân POS tại cửa hàng"
            >
              <ScanBarcode className="w-3 h-3 text-cyan-400" />
              <span>Tại Quầy (POS)</span>
            </Link>
          </div>

          {/* Store Location & Phone Call */}
          <div className="flex items-center gap-3 text-[11px] flex-wrap">
            <button
              onClick={onOpenStoreInfo}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">Cửa hàng: <strong>168 Nguyễn Trãi, Q.1</strong></span>
              <span className="sm:hidden">168 Nguyễn Trãi, Q.1</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded border border-emerald-500/30">
                Mở cửa
              </span>
            </button>

            <span className="text-slate-700 hidden sm:inline">|</span>

            <a
              href="tel:0908123456"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold"
            >
              <PhoneCall className="w-3 h-3" />
              <span>0908 123 456 (Zalo / Hotline)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div
              onClick={onOpenBrandStudio}
              className="cursor-pointer group flex items-center gap-3 select-none"
              title="Nhấn để đổi logo hoặc slogan"
            >
              <div className="transition-transform group-hover:scale-105">
                <LogoIcon type={brand.logoType} color={brand.primaryColor} size={42} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1
                    className="text-lg sm:text-xl font-extrabold tracking-tight"
                    style={{ color: brand.primaryColor }}
                  >
                    {brand.name}
                  </h1>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-1 max-w-[280px] sm:max-w-[340px] font-medium italic">
                  &ldquo;{brand.tagline}&rdquo;
                </p>
              </div>
            </div>

            {/* Change Logo & Slogan badge */}
            <button
              onClick={onOpenBrandStudio}
              className="hidden lg:flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Đổi Logo & Slogan</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg relative hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Tìm mã SKU (VPP-..., GIAY-...), tên sản phẩm, mã vạch barcode..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => onSearchQueryChange('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {isSearchFocused && matchingResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex justify-between">
                  <span>Gợi ý mã hàng ({matchingResults.length})</span>
                  <span>Tra cứu tức thì</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {matchingResults.map((p) => (
                    <div
                      key={p.id}
                      onMouseDown={() => onSelectProduct(p)}
                      className="p-3 hover:bg-emerald-50/50 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-[10px] font-mono font-bold text-slate-500">
                          {p.sku.substring(0, 7)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 line-clamp-1">{p.name}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60 font-semibold">
                              {p.sku}
                            </span>
                            <span>•</span>
                            <span>{p.brand}</span>
                            <span>•</span>
                            <span className="text-slate-600">Tại quầy: {p.stockOffline} {p.unit}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-emerald-700">{formatVND(p.price)}</div>
                        <span className="text-[10px] text-slate-400">/{p.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Offline Store Button */}
            <button
              onClick={onOpenStoreInfo}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
              title="Xem thông tin và vị trí cửa hàng offline"
            >
              <Store className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Cửa Hàng Offline</span>
            </button>

            {/* B2B Quotation Button */}
            <button
              onClick={onOpenB2BQuote}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl transition-colors"
              title="Yêu cầu bảng báo giá sỉ cho công ty hoặc trường học"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Báo Giá Doanh Nghiệp</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 relative"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Giỏ Hàng</span>
              {cartCount > 0 ? (
                <span className="bg-amber-400 text-slate-950 text-[11px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                  {cartCount}
                </span>
              ) : (
                <span className="text-emerald-200 text-xs hidden sm:inline">0</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar & Hot Keywords */}
        <div className="mt-2.5 md:hidden space-y-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Tìm nhanh: Giấy A4, bút Thiên Long, bìa còng..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => onSearchQueryChange('')}
                className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600 p-0.5"
              >
                ✕
              </button>
            )}
          </div>

          {/* Mobile Hot Keywords Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <span className="text-slate-400 shrink-0 flex items-center gap-0.5 font-medium">
              <Flame className="w-3 h-3 text-amber-500" />
            </span>
            {hotKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => onSearchQueryChange(kw)}
                className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 whitespace-nowrap shrink-0 transition-colors border border-slate-200/60"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
