'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { PRODUCTS_CATALOG, CATEGORIES, formatVND } from '@/lib/stationery-data';
import {
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
  Store,
  ArrowLeft,
  Clock,
  Layers,
  ShoppingBag,
  Receipt,
  User,
  MapPin,
  Tag,
  AlertCircle
} from 'lucide-react';

interface PosLineItem {
  product: Product;
  qty: number;
}

export default function PosPage() {
  const [products] = useState<Product[]>(PRODUCTS_CATALOG);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [cart, setCart] = useState<PosLineItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [cashGiven, setCashGiven] = useState('');
  const [customerName, setCustomerName] = useState('Khách mua lẻ tại quầy');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [paymentDone, setPaymentDone] = useState(false);
  const [activeTab, setActiveTab] = useState<'sell' | 'shelf_lookup'>('sell');
  const [shelfSearchQuery, setShelfSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [orderCode, setOrderCode] = useState('HD-8291');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('vi-VN', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter products for quick shelf/POS click
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products.slice(0, 32);
    return products.filter((p) => p.category === selectedCategory).slice(0, 32);
  }, [products, selectedCategory]);

  // Handle barcode scanner input
  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = barcodeInput.trim().toLowerCase();
    if (!query) return;

    const found = products.find(
      (p) =>
        p.barcode.toLowerCase() === query ||
        p.sku.toLowerCase() === query ||
        p.name.toLowerCase().includes(query)
    );

    if (found) {
      handleAddToCart(found);
      setBarcodeInput('');
    } else {
      showToast(`Không tìm thấy mã "${barcodeInput}" trong hệ thống kho!`);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [{ product, qty: 1 }, ...prev];
    });
    setPaymentDone(false);
    showToast(`+ Đã thêm: ${product.name}`);
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

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    if (cart.length === 0) return;
    setCart([]);
    setCashGiven('');
    setPaymentDone(false);
    setOrderCode(`HD-${Math.floor(1000 + Math.random() * 9000)}`);
    showToast('Đã làm mới đơn thu ngân!');
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const totalAmount = Math.max(0, subtotal - discountAmount);

  const cashGivenNumber = parseInt(cashGiven.replace(/\D/g, ''), 10) || 0;
  const changeDue = Math.max(0, cashGivenNumber - totalAmount);

  // Denominations for Vietnamese cash payment
  const quickCashButtons = [
    { label: 'Đủ tiền', value: totalAmount },
    { label: '50.000đ', value: 50000 },
    { label: '100.000đ', value: 100000 },
    { label: '200.000đ', value: 200000 },
    { label: '500.000đ', value: 500000 },
    { label: '1.000.000đ', value: 1000000 },
  ];

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleCompletePayment = () => {
    if (cart.length === 0) {
      showToast('Chưa có sản phẩm nào trong hóa đơn!');
      return;
    }
    setPaymentDone(true);
    showToast('Thanh toán thành công! Sẵn sàng in hóa đơn.');
  };

  // Shelf lookup results
  const shelfResults = useMemo(() => {
    if (!shelfSearchQuery.trim()) return products.slice(0, 20);
    const q = shelfSearchQuery.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.shelfLocation.toLowerCase().includes(q) ||
        p.barcode.includes(q)
    );
  }, [products, shelfSearchQuery]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 border border-emerald-500/60 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 py-3 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back to Web Store & POS Station Info */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-700 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700 shadow-xs group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Về Website Bán Hàng</span>
            </Link>

            <div className="h-5 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black shadow-xs">
                <ScanBarcode className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <span>HỆ THỐNG THU NGÂN TẠI QUẦY (POS)</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Máy 01 • Trực Tiếp
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>Cửa hàng 168 Nguyễn Trãi, Q.1, TP.HCM</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right: Clock, Status & Tab Switcher */}
          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('sell')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  activeTab === 'sell'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Bán Hàng
              </button>
              <button
                onClick={() => setActiveTab('shelf_lookup')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  activeTab === 'shelf_lookup'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tra Cứu Kệ Kho ({products.length})
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentTime}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main POS Screen */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: Barcode Scanner, Quick Click Catalog OR Shelf Lookup */}
        <div className="lg:col-span-7 flex flex-col gap-3 min-h-[500px]">
          {activeTab === 'sell' ? (
            <>
              {/* Barcode & SKU Scan Box */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-md">
                <form onSubmit={handleScanSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      ref={barcodeInputRef}
                      type="text"
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      placeholder="Quét mã vạch hoặc nhập SKU (VD: VPP-893..., GIAY-A4...)..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono tracking-wide"
                      autoFocus
                    />
                    <ScanBarcode className="w-5 h-5 text-emerald-400 absolute left-3.5 top-3.5" />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-colors shrink-0 shadow-md flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nhập Quét</span>
                  </button>
                </form>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
                  <span>💡 Hỗ trợ máy quét tia laser USB / Bluetooth hoặc gõ tay</span>
                  <span className="text-emerald-400 font-medium">Tự động thêm vào hóa đơn khi Enter</span>
                </div>
              </div>

              {/* Quick Category Filter for Counter Staff */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Quick Products Grid for Counter Touchscreen */}
              <div className="bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-800 flex-1 flex flex-col shadow-md overflow-hidden">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  <span>Mặt Hàng Bán Nhanh Tại Quầy ({filteredProducts.length})</span>
                  <span>Chạm để thêm vào bill</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 overflow-y-auto max-h-[460px] pr-1">
                  {filteredProducts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleAddToCart(p)}
                      className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 p-2.5 rounded-xl text-left transition-all group flex flex-col justify-between active:scale-97"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-mono text-[9px] text-emerald-400 font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                            {p.sku.substring(0, 8)}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Kệ: {p.shelfLocation}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-200 line-clamp-2 leading-snug group-hover:text-emerald-300">
                          {p.name}
                        </p>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-baseline justify-between">
                        <span className="text-xs font-extrabold text-emerald-400">
                          {formatVND(p.price)}
                        </span>
                        <span className="text-[10px] text-slate-500">/{p.unit}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Tab: Shelf & Inventory Lookup for in-store customers */
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex-1 flex flex-col shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Store className="w-4 h-4 text-indigo-400" />
                    <span>Tra Cứu Vị Trí Kệ Hàng & Tồn Kho Cửa Hàng Offline</span>
                  </h3>
                  <p className="text-xs text-slate-400">Giúp nhân viên tìm nhanh vị trí kệ (Khu A, B, C, D) cho khách đến tiệm</p>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={shelfSearchQuery}
                  onChange={(e) => setShelfSearchQuery(e.target.value)}
                  placeholder="Tìm tên hàng, mã SKU, vị trí kệ (VD: Kệ A1, Bút bi, Giấy A4)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>

              <div className="flex-1 overflow-y-auto max-h-[500px] divide-y divide-slate-800 text-xs">
                {shelfResults.map((p) => (
                  <div
                    key={p.id}
                    className="py-3 px-2 flex items-center justify-between hover:bg-slate-900/60 rounded-lg transition-colors gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-indigo-300 bg-indigo-950/70 px-2 py-0.5 rounded border border-indigo-800/50">
                          {p.sku}
                        </span>
                        <span className="text-slate-200 font-semibold">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span>Hãng: <strong className="text-slate-300">{p.brand}</strong></span>
                        <span>•</span>
                        <span>Mã vạch: <span className="font-mono">{p.barcode}</span></span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 text-xs">
                        <MapPin className="w-3 h-3" />
                        <span>{p.shelfLocation}</span>
                      </div>
                      <div className="text-[11px] text-emerald-400 font-medium">
                        Tồn tại quầy: {p.stockOffline} {p.unit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Active Bill & Checkout Station */}
        <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col shadow-xl overflow-hidden">
          {/* Bill Header */}
          <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-extrabold text-white">HÓA ĐƠN THU NGÂN</h2>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {orderCode}
              </span>
            </div>

            <button
              onClick={handleClearCart}
              disabled={cart.length === 0}
              className="text-xs text-rose-400 hover:text-rose-300 disabled:opacity-30 flex items-center gap-1 font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Hủy đơn</span>
            </button>
          </div>

          {/* Customer Info Quick Inputs */}
          <div className="p-3 bg-slate-900/40 border-b border-slate-800 grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">Tên khách hàng:</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">Số điện thoại (tích điểm):</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Nhập SĐT khách..."
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto max-h-[300px] p-3 divide-y divide-slate-800/80 text-xs">
            {cart.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-slate-500 text-center space-y-2">
                <ScanBarcode className="w-8 h-8 text-slate-600 animate-pulse" />
                <p className="text-xs">Chưa có sản phẩm nào trong hóa đơn.</p>
                <p className="text-[11px] text-slate-600">Quét mã vạch hoặc chọn từ bảng bên trái</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-emerald-400 font-semibold bg-slate-900 px-1 py-0.2 rounded border border-slate-800">
                        {item.product.sku.substring(0, 8)}
                      </span>
                      <p className="font-semibold text-slate-200 truncate">{item.product.name}</p>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Đơn giá: <strong className="text-slate-300">{formatVND(item.product.price)}</strong>
                    </div>
                  </div>

                  {/* Quantity adjustment */}
                  <div className="flex items-center gap-1 bg-slate-900 px-1.5 py-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => handleUpdateQty(item.product.id, -1)}
                      className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center font-bold font-mono text-white text-xs">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => handleUpdateQty(item.product.id, 1)}
                      className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Line total */}
                  <div className="w-20 text-right font-extrabold text-emerald-400 text-xs font-mono">
                    {formatVND(item.product.price * item.qty)}
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.product.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Pricing & Tender Calculations */}
          <div className="p-3.5 bg-slate-900 border-t border-slate-800 space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Tổng tiền hàng ({cart.reduce((s, i) => s + i.qty, 0)} món):</span>
              <span className="font-mono font-bold text-slate-200">{formatVND(subtotal)}</span>
            </div>

            {/* Discount selector */}
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-amber-400" />
                <span>Chiết khấu khách quen (%):</span>
              </span>
              <div className="flex items-center gap-1">
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setDiscountPercent(pct)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      discountPercent === pct
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-amber-400">
                <span>Số tiền giảm:</span>
                <span className="font-mono font-bold">-{formatVND(discountAmount)}</span>
              </div>
            )}

            {/* Grand Total */}
            <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-white">KHÁCH CẦN TRẢ:</span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                {formatVND(totalAmount)}
              </span>
            </div>

            {/* Cash Given & Change Due */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between gap-2">
                <label className="text-[11px] text-slate-300 font-semibold">Tiền khách đưa (VNĐ):</label>
                <input
                  type="text"
                  value={cashGiven}
                  onChange={(e) => setCashGiven(e.target.value)}
                  placeholder="Gõ số tiền..."
                  className="w-32 px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-right font-mono text-emerald-300 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>

              {/* Quick Cash Buttons */}
              <div className="grid grid-cols-3 gap-1">
                {quickCashButtons.map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => setCashGiven(btn.value.toString())}
                    className="py-1 px-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold transition-colors"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {cashGivenNumber > 0 && (
                <div className="flex justify-between items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-xs">Tiền thối lại khách:</span>
                  <span className={`text-sm font-black font-mono ${changeDue >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {changeDue >= 0 ? formatVND(changeDue) : `Thiếu ${formatVND(Math.abs(changeDue))}`}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons: Pay & Print */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleCompletePayment}
                disabled={cart.length === 0}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>THANH TOÁN THÀNH CÔNG ({formatVND(totalAmount)})</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handlePrintReceipt}
                  disabled={cart.length === 0}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>In Hóa Đơn K80</span>
                </button>

                <button
                  onClick={() => showToast('Đang gửi tín hiệu mở cổng két đựng tiền tự động (RJ11)...')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
                  title="Mở ngăn kéo đựng tiền"
                >
                  <Banknote className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Success State / VietQR Quick Scan */}
            {paymentDone && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Đã ghi nhận thanh toán đơn hàng thành công!</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Tồn kho tại quầy đã tự động trừ <strong>{cart.reduce((s, i) => s + i.qty, 0)}</strong> sản phẩm.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Printable Thermal Receipt (Visible during Ctrl+P / Window Print) */}
      <div className="hidden print:block fixed inset-0 bg-white text-black p-4 font-mono text-xs z-50">
        <div className="max-w-[80mm] mx-auto text-center space-y-1">
          <h2 className="text-base font-black uppercase tracking-wider">VĂN PHÒNG PHẨM</h2>
          <p className="text-[11px]">168 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP.HCM</p>
          <p className="text-[11px]">Hotline / Zalo: 0908 123 456</p>
          <div className="border-b border-dashed border-black my-2" />
          <h3 className="font-bold text-sm">HÓA ĐƠN BÁN LẺ TẠI QUẦY</h3>
          <p className="text-[10px]">Thời gian: {currentTime}</p>
          <p className="text-[10px]">Khách hàng: {customerName} {customerPhone ? `(${customerPhone})` : ''}</p>
          <div className="border-b border-dashed border-black my-2" />

          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-black">
                <th className="py-1">Mặt hàng</th>
                <th className="py-1 text-center">SL</th>
                <th className="py-1 text-right">T.Tiền</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.product.id} className="border-b border-dotted border-gray-400">
                  <td className="py-1">
                    <div>{item.product.name}</div>
                    <div className="text-[9px] text-gray-600">{formatVND(item.product.price)}/{item.product.unit}</div>
                  </td>
                  <td className="py-1 text-center font-bold">{item.qty}</td>
                  <td className="py-1 text-right font-bold">{formatVND(item.product.price * item.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-b border-dashed border-black my-2" />
          <div className="space-y-0.5 text-right">
            <div className="flex justify-between">
              <span>Tổng tiền:</span>
              <span>{formatVND(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between">
                <span>Giảm giá ({discountPercent}%):</span>
                <span>-{formatVND(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black pt-1 border-t border-black">
              <span>THANH TOÁN:</span>
              <span>{formatVND(totalAmount)}</span>
            </div>
            {cashGivenNumber > 0 && (
              <>
                <div className="flex justify-between text-[10px]">
                  <span>Tiền khách đưa:</span>
                  <span>{formatVND(cashGivenNumber)}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>Tiền thối lại:</span>
                  <span>{formatVND(changeDue)}</span>
                </div>
              </>
            )}
          </div>

          <div className="border-b border-dashed border-black my-3" />
          <p className="text-[10px] italic">Cảm ơn quý khách! Hẹn gặp lại!</p>
          <p className="text-[9px] text-gray-600">Đổi trả trong 7 ngày kèm theo hóa đơn này</p>
        </div>
      </div>
    </div>
  );
}
