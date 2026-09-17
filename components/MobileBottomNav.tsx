'use client';

import React from 'react';
import {
  Home,
  Grid,
  Store,
  ScanBarcode,
  ShoppingCart
} from 'lucide-react';

interface MobileBottomNavProps {
  cartCount: number;
  activeTab: 'home' | 'categories' | 'store' | 'pos' | 'cart';
  onSelectTab: (tab: 'home' | 'categories' | 'store' | 'pos' | 'cart') => void;
  brandPrimaryColor: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  activeTab,
  onSelectTab,
  brandPrimaryColor,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl px-2 py-1.5 pb-safe">
      <div className="flex items-center justify-around">
        {/* 1. Trang chủ */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-colors ${
            activeTab === 'home' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Trang Chủ</span>
        </button>

        {/* 2. Danh mục sản phẩm */}
        <button
          onClick={() => onSelectTab('categories')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-colors ${
            activeTab === 'categories' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Danh Mục</span>
        </button>

        {/* 3. Cửa hàng Offline */}
        <button
          onClick={() => onSelectTab('store')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-colors ${
            activeTab === 'store' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Store className="w-5 h-5 mb-0.5 text-amber-600" />
          <span className="text-[10px] tracking-tight">Cửa Hàng</span>
        </button>

        {/* 4. Tách biệt POS Tại Quầy */}
        <button
          onClick={() => onSelectTab('pos')}
          className="flex flex-col items-center justify-center w-14 py-1 rounded-lg text-indigo-600 hover:text-indigo-800 transition-colors group"
          title="Chuyển sang màn hình thu ngân quầy POS"
        >
          <div className="relative">
            <ScanBarcode className="w-5 h-5 mb-0.5 text-indigo-600" />
            <span className="absolute -top-1 -right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          </div>
          <span className="text-[10px] font-bold text-indigo-600 tracking-tight">Tại Quầy</span>
        </button>

        {/* 5. Giỏ hàng */}
        <button
          onClick={() => onSelectTab('cart')}
          className="flex flex-col items-center justify-center w-14 py-1 rounded-lg text-slate-700 hover:text-slate-950 relative transition-colors"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 mb-0.5 text-emerald-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-xs">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight font-medium">Giỏ Hàng</span>
        </button>
      </div>
    </nav>
  );
};
