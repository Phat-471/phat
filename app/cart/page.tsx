'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { formatVND, BASE_PRODUCTS } from '@/lib/stationery-data';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Truck,
  Store,
  ShieldCheck,
  Settings
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartWholesaleDiscount,
    shippingFee,
    cartTotal,
    minOrderValue,
    minOrderEnabled,
    isMinOrderMet,
    minOrderShortfall,
    minOrderProgress,
    addToCart
  } = useStore();

  // Quick addon suggestions for shoppers to hit minimum order value
  const quickAddons = BASE_PRODUCTS.filter(
    (p) => p.price <= 35000 && !cart.some((item) => item.product.id === p.id)
  ).slice(0, 3);

  const handleProceedToCheckout = () => {
    if (!isMinOrderMet) {
      alert(`Đơn hàng của bạn chưa đạt mức tối thiểu ${formatVND(minOrderValue)}. Vui lòng chọn thêm sản phẩm hoặc nhận trực tiếp tại quầy 168 Nguyễn Trãi!`);
      return;
    }
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <SiteHeader />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-emerald-700">Trang Chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Giỏ Hàng Của Bạn</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <ShoppingCart className="w-6 h-6 text-emerald-600" />
              <span>Giỏ Hàng Trực Tuyến</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Kiểm tra số lượng, mức chiết khấu sỉ và điều kiện đơn hàng tối thiểu
            </p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Làm trống giỏ</span>
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          /* Empty Cart View */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Giỏ hàng của bạn đang trống</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Hãy dạo qua hơn 2.000 sản phẩm giấy in, bút viết, bìa còng, máy tính và đồ dùng văn phòng chính hãng với giá tốt nhất.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors"
            >
              <span>Xem Danh Mục Sản Phẩm</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Cart Items & Minimum Order Tracker */}
            <div className="lg:col-span-2 space-y-4">
              {/* MINIMUM ORDER VALUE TRACKER BANNER */}
              {minOrderEnabled && (
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    isMinOrderMet
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                      : 'bg-amber-50/90 border-amber-300 text-amber-950'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      {isMinOrderMet ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-extrabold text-xs sm:text-sm flex items-center gap-2">
                          <span>
                            {isMinOrderMet
                              ? 'Đã đạt điều kiện đơn hàng tối thiểu!'
                              : `Cần mua thêm ${formatVND(minOrderShortfall)} để đạt đơn tối thiểu!`}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          Mức tối thiểu giao tận nơi hiện tại:{' '}
                          <strong className="text-slate-900">{formatVND(minOrderValue)}</strong>.{' '}
                          (Nhận tại quầy 168 Nguyễn Trãi không áp dụng mức tối thiểu).
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/account"
                      className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/80 border border-slate-200 hover:bg-white text-slate-700 flex items-center gap-1 shrink-0"
                      title="Chủ shop có thể điều chỉnh hạn mức này trong Admin"
                    >
                      <Settings className="w-3 h-3 text-slate-500" />
                      <span>Cài đặt Admin</span>
                    </Link>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 space-y-1">
                    <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isMinOrderMet ? 'bg-emerald-600' : 'bg-amber-500'
                        }`}
                        style={{ width: `${minOrderProgress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Hiện có: <strong>{formatVND(cartSubtotal)}</strong></span>
                      <span>Mục tiêu: <strong>{formatVND(minOrderValue)}</strong> ({minOrderProgress}%)</span>
                    </div>
                  </div>

                  {/* Quick Add Recommendations when under threshold */}
                  {!isMinOrderMet && quickAddons.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-amber-200/60 space-y-1.5">
                      <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Gợi ý thêm vào giỏ nhanh để đủ điều kiện:</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {quickAddons.map((addon) => (
                          <button
                            key={addon.id}
                            onClick={() => addToCart(addon, 1)}
                            className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 hover:border-amber-400 text-slate-800 text-[11px] font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
                          >
                            <Plus className="w-3 h-3 text-emerald-600" />
                            <span>{addon.name}</span>
                            <strong className="text-emerald-700">+{formatVND(addon.price)}</strong>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Items List Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600">
                  <span>Sản Phẩm ({cart.length})</span>
                  <span className="hidden sm:inline">Tổng Tiền</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {cart.map((item) => {
                    const isWholesale = item.quantity >= 10;
                    const unitPrice = isWholesale ? item.product.wholesalePrice : item.product.price;
                    const itemTotal = unitPrice * item.quantity;

                    return (
                      <div
                        key={item.product.id}
                        className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                      >
                        {/* Thumbnail & Info */}
                        <div className="flex items-center gap-3.5 w-full sm:w-auto">
                          <Link
                            href={`/products/${item.product.id}`}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-100 border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden"
                          >
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          </Link>

                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold bg-slate-100 px-1.5 py-0.2 rounded text-slate-600">
                                {item.product.sku}
                              </span>
                              <span className="text-[11px] font-semibold text-emerald-700 uppercase">
                                {item.product.brand}
                              </span>
                            </div>

                            <Link
                              href={`/products/${item.product.id}`}
                              className="text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-700 line-clamp-1"
                            >
                              {item.product.name}
                            </Link>

                            <div className="flex items-center gap-2 text-[11px]">
                              <span className="text-slate-500">Đơn giá:</span>
                              <strong className="text-slate-800">{formatVND(unitPrice)}</strong>
                              <span className="text-slate-400">/{item.product.unit}</span>

                              {isWholesale && (
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                  Giá sỉ ≥10
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Controls & Subtotal */}
                        <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                          {/* Stepper */}
                          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-2 hover:bg-slate-200 text-slate-600 transition-colors"
                              title="Giảm số lượng"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.product.id, parseInt(e.target.value) || 1)
                              }
                              className="w-12 text-center text-xs font-bold bg-transparent focus:outline-none"
                            />
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-2 hover:bg-slate-200 text-slate-600 transition-colors"
                              title="Tăng số lượng"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Line total */}
                          <div className="text-right min-w-[90px]">
                            <div className="text-sm sm:text-base font-extrabold text-slate-900">
                              {formatVND(itemTotal)}
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-[11px] text-rose-500 hover:text-rose-700 hover:underline font-medium mt-0.5"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trust notes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Đồng kiểm hàng trước khi trả</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Miễn phí ship đơn từ 500k</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Lấy tại tiệm sau 15 phút</span>
                </div>
              </div>
            </div>

            {/* Right: Summary Card */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs sticky top-24">
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
                  Tóm Tắt Đơn Hàng
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Tạm tính tiền hàng:</span>
                    <strong className="text-slate-900">{formatVND(cartSubtotal)}</strong>
                  </div>

                  {cartWholesaleDiscount > 0 && (
                    <div className="flex items-center justify-between text-emerald-700">
                      <span>Ưu đãi giá sỉ:</span>
                      <strong className="font-bold">-{formatVND(cartWholesaleDiscount)}</strong>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Phí vận chuyển:</span>
                    <span>
                      {shippingFee === 0 ? (
                        <strong className="text-emerald-700">Miễn phí</strong>
                      ) : (
                        <strong>{formatVND(shippingFee)}</strong>
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Tổng thanh toán:</span>
                      <span className="text-[10px] text-slate-400">Đã bao gồm VAT</span>
                    </div>
                    <div className="text-xl font-black text-emerald-700">
                      {formatVND(cartTotal)}
                    </div>
                  </div>
                </div>

                {/* Checkout CTA */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleProceedToCheckout}
                    disabled={!isMinOrderMet}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                      isMinOrderMet
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Tiến Hành Thanh Toán</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {!isMinOrderMet && (
                    <p className="text-[11px] text-amber-700 text-center font-medium">
                      ⚠️ Giỏ hàng cần đạt tối thiểu {formatVND(minOrderValue)} để đặt giao hàng.
                    </p>
                  )}

                  <Link
                    href="/products"
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center justify-center transition-colors"
                  >
                    ← Tiếp Tục Chọn Mua Thêm
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
