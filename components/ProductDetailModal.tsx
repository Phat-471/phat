'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { formatVND } from '@/lib/stationery-data';
import {
  X,
  Store,
  Truck,
  Plus,
  Minus,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Barcode,
  Share2
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenStoreInfo: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenStoreInfo,
}) => {
  const [qty, setQty] = useState(1);
  const [isCopied, setIsCopied] = useState(false);

  if (!product) return null;

  const currentPrice = qty >= 10 ? product.wholesalePrice : product.price;

  const handleCopySku = () => {
    navigator.clipboard.writeText(product.sku);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
              SKU: {product.sku}
            </span>
            <span className="text-xs text-slate-500 font-medium">| {product.brand}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Product Image & Barcode */}
            <div className="space-y-4">
              <div className="h-64 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.bestSeller && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                    Bán chạy nhất
                  </span>
                )}
              </div>

              {/* Barcode Display */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Barcode className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Mã vạch Barcode EAN</div>
                    <div className="font-mono font-bold text-slate-900">{product.barcode}</div>
                  </div>
                </div>
                <button
                  onClick={handleCopySku}
                  className="text-[11px] font-semibold text-emerald-700 hover:underline"
                >
                  {isCopied ? 'Đã sao chép!' : 'Copy SKU'}
                </button>
              </div>

              {/* Omnichannel Dual Stock Status Card */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3">
                <div className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Trạng Thái Tồn Kho Hai Kênh
                </div>

                {/* Offline Store Channel */}
                <div className="flex items-start justify-between gap-3 text-xs bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-emerald-600" />
                      Tại Cửa Hàng Offline:
                    </div>
                    <div className="text-slate-600 text-[11px]">
                      Vị trí: <strong className="text-amber-800">{product.shelfLocation}</strong>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Ghé 168 Nguyễn Trãi, Q.1 mua trực tiếp
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-emerald-700 text-sm">
                      {product.stockOffline} {product.unit}
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                      Sẵn trên kệ
                    </span>
                  </div>
                </div>

                {/* Online Warehouse Channel */}
                <div className="flex items-start justify-between gap-3 text-xs bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                      Kho Hàng Online Tổng:
                    </div>
                    <div className="text-slate-600 text-[11px]">Giao hàng hỏa tốc trong 2h tại TP.HCM</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-blue-700 text-sm">
                      {product.stockOnline} {product.unit}
                    </div>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-medium">
                      Ship toàn quốc
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Info, Price, Specs */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">{product.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{product.description}</p>
              </div>

              {/* Price Tier Box */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Đơn giá bán lẻ:</span>
                    <span className="text-2xl font-black text-emerald-700">
                      {formatVND(currentPrice)}
                    </span>
                    <span className="text-xs text-slate-400"> / {product.unit}</span>
                  </div>
                  {product.originalPrice && (
                    <div className="text-right">
                      <span className="text-xs text-slate-400 line-through">
                        {formatVND(product.originalPrice)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Wholesale Discount Note */}
                <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-600">
                    Giá sỉ số lượng lớn (từ 10 {product.unit}):
                  </span>
                  <span className="font-bold text-indigo-700">
                    {formatVND(product.wholesalePrice)} / {product.unit}
                  </span>
                </div>
                {qty >= 10 && (
                  <div className="mt-1 text-[11px] text-emerald-700 font-semibold">
                    ✓ Bạn đang được áp dụng mức giá sỉ ưu đãi!
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Thông Số Kỹ Thuật
                </h4>
                <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex py-2 px-3 justify-between">
                      <span className="text-slate-500">{key}</span>
                      <span className="font-medium text-slate-800 text-right">{val}</span>
                    </div>
                  ))}
                  <div className="flex py-2 px-3 justify-between">
                    <span className="text-slate-500">Đơn vị đóng gói</span>
                    <span className="font-semibold text-slate-900">{product.unit}</span>
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Add to Cart */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-700">Số lượng:</span>
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                      className="w-14 text-center text-xs font-bold text-slate-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQty((q) => q + 1)}
                      className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    = <strong>{formatVND(currentPrice * qty)}</strong>
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      onAddToCart(product, qty);
                      onClose();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-98"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Vào Giỏ ({qty} {product.unit})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cam kết 100% hàng chính hãng, đổi trả trong 7 ngày nếu lỗi sản xuất</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenStoreInfo();
            }}
            className="text-emerald-700 font-semibold hover:underline"
          >
            Chỉ đường tới cửa hàng offline →
          </button>
        </div>
      </div>
    </div>
  );
};
