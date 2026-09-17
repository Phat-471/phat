'use client';

import React, { useState, useRef } from 'react';
import { Product, BrandIdentity } from '@/lib/types';
import { formatVND } from '@/lib/stationery-data';
import { LogoIcon } from './LogoIcon';
import {
  X,
  ScanBarcode,
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  RotateCcw,
  CheckCircle2,
  Banknote,
  QrCode,
  Store
} from 'lucide-react';

interface PosCounterModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  brand: BrandIdentity;
}

interface PosLineItem {
  product: Product;
  qty: number;
}

export const PosCounterModal: React.FC<PosCounterModalProps> = ({
  isOpen,
  onClose,
  products,
  brand,
}) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [cart, setCart] = useState<PosLineItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [cashGiven, setCashGiven] = useState('');
  const [customerName, setCustomerName] = useState('Khách mua lẻ tại quầy');
  const [paymentDone, setPaymentDone] = useState(false);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = barcodeInput.trim().toLowerCase();
    if (!query) return;

    // Find by barcode or sku or partial name
    const found = products.find(
      (p) =>
        p.barcode.toLowerCase() === query ||
        p.sku.toLowerCase() === query ||
        p.name.toLowerCase().includes(query)
    );

    if (found) {
      setCart((prev) => {
        const existing = prev.find((item) => item.product.id === found.id);
        if (existing) {
          return prev.map((item) =>
            item.product.id === found.id ? { ...item, qty: item.qty + 1 } : item
          );
        }
        return [...prev, { product: found, qty: 1 }];
      });
      setBarcodeInput('');
    } else {
      alert(`Không tìm thấy mã hàng hoặc mã vạch: "${barcodeInput}" trong hệ thống!`);
    }
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as PosLineItem[]
    );
  };

  const handleRemove = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const rawSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const discountAmount = Math.round((rawSubtotal * discountPercent) / 100);
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  const numericCash = Number(cashGiven) || 0;
  const changeDue = Math.max(0, numericCash - finalTotal);

  const handleCheckoutPos = () => {
    if (cart.length === 0) return;
    setPaymentDone(true);
  };

  const handleResetPos = () => {
    setCart([]);
    setDiscountPercent(0);
    setCashGiven('');
    setPaymentDone(false);
    setCustomerName('Khách mua lẻ tại quầy');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-3.5 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-900/50 text-cyan-400 border border-cyan-700/60">
              <ScanBarcode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Quầy Thu Ngân POS (Cửa Hàng Offline)
                </h2>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  Online Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {brand.name} • 168 Nguyễn Trãi, Q.1 • Sẵn sàng quét hơn 2000 mã hàng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetPos}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm Mới Bill</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left 7 cols: Scanner & Active Bill */}
          <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 p-5 space-y-4 overflow-hidden">
            {/* Barcode / SKU Scan Input */}
            <form onSubmit={handleScanSubmit} className="relative">
              <input
                ref={barcodeInputRef}
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Bấm vào đây để quét mã vạch Barcode hoặc gõ mã SKU (Enter)..."
                className="w-full pl-10 pr-24 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                autoFocus
              />
              <ScanBarcode className="w-5 h-5 text-cyan-400 absolute left-3.5 top-3.5" />
              <button
                type="submit"
                className="absolute right-2 top-2 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors"
              >
                + Thêm
              </button>
            </form>

            {/* Quick SKU pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] text-slate-400">
              <span className="shrink-0 text-slate-500">Mã nhanh:</span>
              {['GIAY-DA-A4-70', 'BUT-TL-027-XANH', 'BIA-CONG-KJ-7CM', 'CASIO-FX-580VNX', 'BAM-KIM-PLUS-10'].map((sku) => (
                <button
                  key={sku}
                  type="button"
                  onClick={() => {
                    const item = products.find((p) => p.sku === sku);
                    if (item) {
                      setCart((prev) => {
                        const existing = prev.find((i) => i.product.id === item.id);
                        if (existing) {
                          return prev.map((i) =>
                            i.product.id === item.id ? { ...i, qty: i.qty + 1 } : i
                          );
                        }
                        return [...prev, { product: item, qty: 1 }];
                      });
                    }
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono shrink-0 border border-slate-700"
                >
                  +{sku}
                </button>
              ))}
            </div>

            {/* Scanned Cart Table */}
            <div className="flex-1 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/60 divide-y divide-slate-800/80 text-xs">
              {cart.length === 0 ? (
                <div className="py-20 text-center text-slate-500 space-y-2">
                  <ScanBarcode className="w-8 h-8 mx-auto text-slate-600 animate-pulse" />
                  <p>Chưa có sản phẩm nào trên quầy.</p>
                  <p className="text-[11px] text-slate-600">Quét mã vạch hoặc bấm mã nhanh ở trên để bắt đầu tính tiền.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="p-3 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white line-clamp-1">{item.product.name}</div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="font-mono text-cyan-400 font-bold">{item.product.sku}</span>
                        <span>•</span>
                        <span>Đơn giá: {formatVND(item.product.price)}</span>
                        <span>•</span>
                        <span className="text-amber-300">Kệ: {item.product.shelfLocation}</span>
                      </div>
                    </div>

                    {/* Qty */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-700 rounded-lg bg-slate-900">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.product.id, -1)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-bold font-mono text-white text-xs">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.product.id, 1)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="w-24 text-right font-bold text-emerald-400">
                        {formatVND(item.product.price * item.qty)}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.product.id)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right 5 cols: Calculation, Payment & Receipt View */}
          <div className="lg:col-span-5 p-5 bg-slate-950 flex flex-col justify-between space-y-4">
            {/* Customer & Cash Details */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Tên khách hàng:</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
                />
              </div>

              {/* Totals Breakdown */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2.5">
                <div className="flex justify-between text-slate-400">
                  <span>Tổng tiền hàng ({cart.reduce((a, b) => a + b.qty, 0)} món):</span>
                  <span className="font-bold text-white">{formatVND(rawSubtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>Chiết khấu (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Math.max(0, Math.min(50, Number(e.target.value))))}
                    className="w-16 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-right text-white text-xs font-bold"
                  />
                </div>

                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                  <span>Khách Phải Trả:</span>
                  <span className="text-cyan-400 text-lg">{formatVND(finalTotal)}</span>
                </div>
              </div>

              {/* Cash & Change Calculator */}
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 space-y-2">
                <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                  Tính Tiền Thối Cho Khách
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Tiền khách đưa:</span>
                    <input
                      type="number"
                      value={cashGiven}
                      onChange={(e) => setCashGiven(e.target.value)}
                      placeholder="Nhập số tiền..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Tiền thối lại:</span>
                    <div className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 font-mono font-bold text-xs text-amber-400">
                      {formatVND(changeDue)}
                    </div>
                  </div>
                </div>

                {/* Quick cash buttons */}
                <div className="flex gap-1.5 pt-1">
                  {[100000, 200000, 500000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCashGiven(String(amt))}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 font-mono"
                    >
                      {formatVND(amt)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCashGiven(String(finalTotal))}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-emerald-400 font-mono"
                  >
                    Đủ tiền
                  </button>
                </div>
              </div>
            </div>

            {/* Checkout & Print Buttons */}
            <div className="space-y-2 pt-2">
              {paymentDone ? (
                <div className="p-3 bg-emerald-950/80 border border-emerald-600 text-emerald-300 rounded-xl text-center space-y-2">
                  <div className="font-bold flex items-center justify-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ĐÃ THANH TOÁN XONG HÓA ĐƠN!
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    In Hóa Đơn Bán Lẻ
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleCheckoutPos}
                  disabled={cart.length === 0}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-black text-sm transition-all shadow-md active:scale-98"
                >
                  XÁC NHẬN THANH TOÁN ({formatVND(finalTotal)})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
