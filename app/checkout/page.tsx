'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { formatVND, DEFAULT_STORE_INFO } from '@/lib/stationery-data';
import { CustomerOrder, OrderType } from '@/lib/types';
import {
  ShieldCheck,
  Truck,
  Store,
  CreditCard,
  QrCode,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Clock,
  MapPin,
  Building2,
  Settings,
  ShoppingBag
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartSubtotal,
    cartWholesaleDiscount,
    shippingFee,
    cartTotal,
    minOrderValue,
    minOrderEnabled,
    isMinOrderMet,
    minOrderShortfall,
    createOrder,
    userProfile
  } = useStore();

  const [orderType, setOrderType] = useState<OrderType>('online_delivery');
  const [customerName, setCustomerName] = useState(userProfile.name || '');
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [email, setEmail] = useState(userProfile.email || '');
  const [address, setAddress] = useState(userProfile.address || '');
  const [pickupTime, setPickupTime] = useState('Trong vòng 15-30 phút');
  const [notes, setNotes] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vietqr' | 'counter_cash'>('cod');

  // VAT Invoice
  const [requestVat, setRequestVat] = useState(false);
  const [companyTaxCode, setCompanyTaxCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');

  // Placed Order State
  const [completedOrder, setCompletedOrder] = useState<CustomerOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delivery fee logic
  const effectiveShippingFee = orderType === 'store_pickup' ? 0 : shippingFee;
  const grandTotal = cartSubtotal + effectiveShippingFee;

  // Validation
  const canProceedWithMinOrder = orderType === 'store_pickup' || isMinOrderMet;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }

    if (!canProceedWithMinOrder) {
      alert(`Đơn hàng giao tận nơi cần đạt tối thiểu ${formatVND(minOrderValue)}. Bạn cần mua thêm ${formatVND(minOrderShortfall)}!`);
      return;
    }

    if (!customerName.trim() || !phone.trim()) {
      alert('Vui lòng nhập đầy đủ Họ tên và Số điện thoại nhận hàng!');
      return;
    }

    if (orderType === 'online_delivery' && !address.trim()) {
      alert('Vui lòng nhập địa chỉ giao hàng cụ thể!');
      return;
    }

    setIsSubmitting(true);

    try {
      const newOrder = createOrder({
        orderType,
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: orderType === 'online_delivery' ? address.trim() : undefined,
        pickupTime: orderType === 'store_pickup' ? pickupTime : undefined,
        paymentMethod,
        requestVatInvoice: requestVat,
        companyName: requestVat ? companyName : undefined,
        companyTaxCode: requestVat ? companyTaxCode : undefined,
        companyAddress: requestVat ? companyAddress : undefined,
        notes: notes.trim(),
        items: [...cart],
        subtotal: cartSubtotal,
        discount: cartWholesaleDiscount,
        shippingFee: effectiveShippingFee,
        total: grandTotal,
        status: 'pending'
      });

      setCompletedOrder(newOrder);
    } catch (err) {
      console.error(err);
      alert('Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ORDER SUCCESS SCREEN
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <SiteHeader />

        <main className="max-w-3xl mx-auto px-4 py-10 flex-1 w-full space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 text-center space-y-5 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                Đặt Hàng Thành Công
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Cảm Ơn Quý Khách Đã Mua Hàng!
              </h1>
              <p className="text-xs text-slate-500">
                Mã số đơn hàng:{' '}
                <strong className="font-mono text-slate-900 text-sm">{completedOrder.id}</strong>
              </p>
            </div>

            {/* VietQR instructions if VietQR selected */}
            {completedOrder.paymentMethod === 'vietqr' && (
              <div className="p-5 rounded-2xl bg-slate-900 text-white text-left space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-sm">Mã VietQR Napas 24/7 Tự Động</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono font-bold">
                    {formatVND(completedOrder.total)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center shrink-0">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=247-MBBANK-0908123456-${completedOrder.id}-${completedOrder.total}`}
                      alt="VietQR Payment"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-xs space-y-1.5 text-slate-300">
                    <p>
                      Ngân hàng: <strong>MB Bank (Quân Đội)</strong>
                    </p>
                    <p>
                      Số tài khoản: <strong className="font-mono text-emerald-400">0908 123 456</strong>
                    </p>
                    <p>
                      Chủ tài khoản: <strong>CONG TY TNHH VAN PHONG PHAM</strong>
                    </p>
                    <p>
                      Nội dung chuyển khoản:{' '}
                      <strong className="font-mono bg-slate-800 px-2 py-0.5 rounded text-amber-300">
                        {completedOrder.id}
                      </strong>
                    </p>
                    <p className="text-[11px] text-slate-400 pt-1">
                      * Đơn hàng sẽ được xử lý và giao ngay khi hệ thống nhận được chuyển khoản.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Details Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2.5">
              <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-200 pb-2">
                <span>Hình thức:</span>
                <span>
                  {completedOrder.orderType === 'online_delivery'
                    ? '🚚 Giao tận nơi'
                    : '🏪 Lấy tại cửa hàng 168 Nguyễn Trãi'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Người nhận:</span>
                <strong className="text-slate-900">{completedOrder.customerName} ({completedOrder.phone})</strong>
              </div>
              {completedOrder.address && (
                <div className="flex items-start justify-between text-slate-600">
                  <span>Địa chỉ:</span>
                  <span className="text-slate-900 text-right max-w-xs">{completedOrder.address}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-slate-600">
                <span>Phương thức thanh toán:</span>
                <span className="font-semibold text-slate-900">
                  {completedOrder.paymentMethod === 'cod' && 'Thanh toán tiền mặt khi nhận hàng (COD)'}
                  {completedOrder.paymentMethod === 'vietqr' && 'Chuyển khoản VietQR Napas'}
                  {completedOrder.paymentMethod === 'counter_cash' && 'Thanh toán tiền mặt tại quầy'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Tổng số tiền:</span>
                <strong className="text-emerald-700 text-sm font-extrabold">{formatVND(completedOrder.total)}</strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/orders"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Xem Trang Đơn Hàng Của Tôi</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
              >
                Tiếp Tục Mua Sắm
              </Link>
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-emerald-700">Trang Chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/cart" className="hover:text-emerald-700">Giỏ Hàng</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Thanh Toán Đơn Hàng</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full space-y-6">
        {/* WARNING IF CART IS EMPTY */}
        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-base font-bold text-slate-800">Chưa có sản phẩm để thanh toán</h2>
            <p className="text-xs text-slate-500">Vui lòng chọn sản phẩm vào giỏ hàng trước khi đặt hàng.</p>
            <Link
              href="/products"
              className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              Xem Danh Mục Sản Phẩm
            </Link>
          </div>
        ) : (
          <>
            {/* MINIMUM ORDER VALUE BLOCKING ALERT */}
            {minOrderEnabled && !isMinOrderMet && orderType === 'online_delivery' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-sm sm:text-base text-rose-900">
                      Chưa đạt mức đơn hàng tối thiểu để giao tận nơi!
                    </h3>
                    <p className="text-xs text-rose-800 leading-relaxed">
                      Cửa hàng quy định mức đơn hàng tối thiểu là <strong>{formatVND(minOrderValue)}</strong> cho đơn giao hàng tận nơi. Hiện tại giỏ hàng của bạn mới đạt <strong>{formatVND(cartSubtotal)}</strong> (thiếu <strong>{formatVND(minOrderShortfall)}</strong>).
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <Link
                    href="/cart"
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
                  >
                    ← Về Giỏ Hàng Chọn Thêm
                  </Link>
                  <button
                    onClick={() => setOrderType('store_pickup')}
                    className="px-4 py-2 rounded-xl bg-white border border-rose-300 hover:bg-rose-100 text-rose-900 text-xs font-bold transition-colors"
                  >
                    Đổi Sang: Nhận Tại Quầy (Không giới hạn)
                  </button>
                  <Link
                    href="/account"
                    className="px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-medium underline flex items-center gap-1"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Cài đặt lại số tiền tối thiểu trong Admin</span>
                  </Link>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Form: Delivery & Customer Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* 1. Fulfillment Type Selection */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                  <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>1. Hình Thức Nhận Hàng</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Delivery Option */}
                    <button
                      type="button"
                      onClick={() => setOrderType('online_delivery')}
                      className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        orderType === 'online_delivery'
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <Truck className={`w-5 h-5 shrink-0 mt-0.5 ${orderType === 'online_delivery' ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                          Giao Hàng Tận Nơi
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Hỏa tốc 2 giờ nội thành TP.HCM hoặc chuyển phát nhanh.
                        </p>
                        {minOrderEnabled && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded mt-1 inline-block">
                            Tối thiểu: {formatVND(minOrderValue)}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Store Pickup Option */}
                    <button
                      type="button"
                      onClick={() => setOrderType('store_pickup')}
                      className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        orderType === 'store_pickup'
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <Store className={`w-5 h-5 shrink-0 mt-0.5 ${orderType === 'store_pickup' ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                          Nhận Tại Cửa Hàng (15 Phút)
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          168 Nguyễn Trãi, Q.1. Soạn sẵn hàng đợi bạn ghé lấy.
                        </p>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded mt-1 inline-block">
                          Không giới hạn số tiền
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. Customer Contact & Address Info */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
                  <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>2. Thông Tin Người Nhận</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Họ và Tên *</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="VD: Nguyễn Văn Nam"
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Số Điện Thoại Nhận Hàng *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="VD: 0912 345 678"
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold text-slate-700">Email (để nhận hóa đơn & xác nhận đơn)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="VD: khachhang@cty.vn"
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                      />
                    </div>

                    {orderType === 'online_delivery' ? (
                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-bold text-slate-700">Địa Chỉ Giao Hàng Cụ Thể *</label>
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                          className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-bold text-slate-700">Thời gian dự kiến ghé cửa hàng 168 Nguyễn Trãi:</label>
                        <select
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 font-medium"
                        >
                          <option value="Trong vòng 15-30 phút">Trong vòng 15-30 phút (Lấy ngay)</option>
                          <option value="Buổi trưa (11:30 - 13:30)">Buổi trưa (11:30 - 13:30)</option>
                          <option value="Buổi chiều (16:30 - 18:30)">Buổi chiều (16:30 - 18:30)</option>
                          <option value="Ngày mai">Ngày mai</option>
                        </select>
                      </div>
                    )}

                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-medium text-slate-600">Ghi chú cho nhân viên giao nhận / soạn hàng:</label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="VD: Gọi trước khi đến, giao giờ hành chính, đóng gói cẩn thận..."
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. VAT Invoice Option */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={requestVat}
                        onChange={(e) => setRequestVat(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
                      />
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        Yêu cầu xuất Hóa đơn GTGT (VAT điện tử) cho Doanh nghiệp / Trường học
                      </span>
                    </label>
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      VAT 8% - 10%
                    </span>
                  </div>

                  {requestVat && (
                    <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in fade-in">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Mã Số Thuế (MST) *</label>
                        <input
                          type="text"
                          required
                          value={companyTaxCode}
                          onChange={(e) => setCompanyTaxCode(e.target.value)}
                          placeholder="VD: 0316892145"
                          className="w-full p-2.5 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Tên Doanh Nghiệp Đầy Đủ *</label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="VD: Công Ty Cổ Phần Công Nghệ..."
                          className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-bold text-slate-700">Địa Chỉ Trụ Sở Doanh Nghiệp *</label>
                        <input
                          type="text"
                          required
                          value={companyAddress}
                          onChange={(e) => setCompanyAddress(e.target.value)}
                          placeholder="Địa chỉ ghi trên giấy phép ĐKKD..."
                          className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Payment Method Selection */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                  <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>3. Phương Thức Thanh Toán</span>
                  </h3>

                  <div className="space-y-2 text-xs">
                    {/* COD */}
                    <label
                      className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                          Thanh toán tiền mặt khi nhận hàng (COD)
                        </span>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          Đồng kiểm gói hàng trước, trả tiền mặt trực tiếp cho nhân viên giao nhận.
                        </p>
                      </div>
                    </label>

                    {/* VietQR */}
                    <label
                      className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                        paymentMethod === 'vietqr'
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'vietqr'}
                        onChange={() => setPaymentMethod('vietqr')}
                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            Chuyển khoản Ngân hàng VietQR Napas 24/7
                          </span>
                          <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.2 rounded">
                            Mã QR tự động
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          Quét mã QR từ bất kỳ ứng dụng ngân hàng nào (Vietcombank, MB, Techcombank, Momo...).
                        </p>
                      </div>
                    </label>

                    {/* Store Cash */}
                    {orderType === 'store_pickup' && (
                      <label
                        className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                          paymentMethod === 'counter_cash'
                            ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'counter_cash'}
                          onChange={() => setPaymentMethod('counter_cash')}
                          className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            Thanh toán tiền mặt hoặc quẹt thẻ tại quầy thu ngân 168 Nguyễn Trãi
                          </span>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Ghé quầy nhận hàng và thanh toán trực tiếp qua máy POS.
                          </p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Order Review & Checkout Button */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs sticky top-24">
                  <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center justify-between">
                    <span>Đơn Hàng Của Bạn</span>
                    <span className="text-slate-400 font-normal text-xs">{cart.length} món</span>
                  </h3>

                  {/* Items mini list */}
                  <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1 space-y-2">
                    {cart.map((item) => (
                      <div key={item.product.id} className="pt-2 first:pt-0 flex items-center justify-between gap-2 text-xs">
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{item.product.name}</p>
                          <span className="text-[10px] text-slate-400">
                            {item.quantity} x {formatVND(item.quantity >= 10 ? item.product.wholesalePrice : item.product.price)}
                          </span>
                        </div>
                        <span className="font-bold text-slate-900 shrink-0">
                          {formatVND((item.quantity >= 10 ? item.product.wholesalePrice : item.product.price) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Tạm tính tiền hàng:</span>
                      <strong className="text-slate-900">{formatVND(cartSubtotal)}</strong>
                    </div>

                    {cartWholesaleDiscount > 0 && (
                      <div className="flex items-center justify-between text-emerald-700">
                        <span>Chiết khấu sỉ:</span>
                        <strong className="font-bold">-{formatVND(cartWholesaleDiscount)}</strong>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-slate-600">
                      <span>Phí vận chuyển:</span>
                      <span>
                        {effectiveShippingFee === 0 ? (
                          <strong className="text-emerald-700">Miễn phí</strong>
                        ) : (
                          <strong>{formatVND(effectiveShippingFee)}</strong>
                        )}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                      <span className="text-xs font-bold text-slate-900">Tổng thanh toán:</span>
                      <span className="text-xl font-black text-emerald-700">
                        {formatVND(grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Confirm CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !canProceedWithMinOrder}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 ${
                      canProceedWithMinOrder
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>{isSubmitting ? 'Đang Xử Lý Đơn...' : 'Xác Nhận Đặt Hàng Ngay'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {!canProceedWithMinOrder && (
                    <p className="text-[11px] text-rose-600 text-center font-medium">
                      ⚠️ Cần mua thêm {formatVND(minOrderShortfall)} để đạt đơn tối thiểu hoặc chọn Nhận tại quầy!
                    </p>
                  )}

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
                    <p className="flex items-center gap-1 text-slate-700 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>An tâm mua sắm:</span>
                    </p>
                    <p>• Mở hàng đồng kiểm trước khi trả tiền.</p>
                    <p>• Đổi trả miễn phí 7 ngày nếu lỗi sản phẩm.</p>
                  </div>
                </div>
              </div>
            </form>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
