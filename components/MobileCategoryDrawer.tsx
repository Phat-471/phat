'use client';

import React from 'react';
import { CATEGORIES, BRANDS } from '@/lib/stationery-data';
import { X, ChevronRight, Layers, Check } from 'lucide-react';

interface MobileCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  totalCatalogCount: number;
}

export const MobileCategoryDrawer: React.FC<MobileCategoryDrawerProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  totalCatalogCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-fade-in md:hidden">
      <div className="w-full bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden pb-6">
        {/* Handle / Header */}
        <div className="pt-3 pb-2 px-5 flex flex-col items-center border-b border-slate-100 relative">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full mb-3" />
          <div className="w-full flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Danh Mục Văn Phòng Phẩm</h3>
              <p className="text-[11px] text-slate-500">Hệ thống sẵn sàng {totalCatalogCount.toLocaleString('vi-VN')} mã hàng</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Nhóm Sản Phẩm Chính
            </span>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                        : 'hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-emerald-600' : 'bg-slate-300'
                        }`}
                      />
                      <span className="text-sm">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {cat.id !== 'all' && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-mono">
                          {cat.count}
                        </span>
                      )}
                      {isSelected ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brands Quick Filter */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Thương Hiệu Phổ Biến Tại Việt Nam
            </span>
            <div className="flex flex-wrap gap-1.5">
              {BRANDS.map((b) => {
                const isSelected = selectedBrand === b;
                return (
                  <button
                    key={b}
                    onClick={() => {
                      onSelectBrand(b);
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
