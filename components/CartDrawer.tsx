'use client';

import React, { useState } from 'react';
import { CartItem, CustomerOrder, OrderType, BrandIdentity } from '@/lib/types';
import { formatVND } from '@/lib/stationery-data';
import { LogoIcon } from './LogoIcon';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Truck,
  Store,
  CreditCard,
  QrCode,
  Banknote,
  FileCheck,
  CheckCircle2,
  Printer,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  brand: BrandIdentity;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  brand,
}) => {
  const [orderType, setOrderType] = useState<OrderType>('online_delivery');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pickupTime, setPickupTime] = useState('Sau 15 - 30 phút');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vietqr' | 'counter_cash'>('cod');
  const [requestVat, setRequestVat] = useState(false);
  const [companyTaxCode, setCompanyTaxCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [completedOrder, setCompletedOrder] = useState<CustomerOrder | null>(null);

  if (!isOpen) return null;

  // Calculate Subtotal with Wholesale price discount
  const subtotal = items.reduce((sum, item) => {
    const price = item.quantity >= 10 ? item.product.wholesalePrice : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const shippingFee = orderType === 'store_pickup' || subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) {
      alert('Vui lòng nhập Họ tên và Số điện thoại nhận hàng!');
      return;
    }
    if (orderType === 'online_delivery' && !address) {
      alert('Vui lòng nhập địa chỉ giao hàng tận nơi!');
      return;
    }

    const newOrder: CustomerOrder = {
      id: `DH-VPP-${Math.floor(100000 + Math.random() * 900000)}`,
      orderType,
      customerName,
      phone,
      address: orderType === 'online_delivery' ? address : 'Nhận tại Cửa hàng: 168 Nguyễn Trãi, Q.1, TP.HCM',
      pickupTime: orderType === 'store_pickup' ? pickupTime : undefined,
      paymentMethod,
      requestVatInvoice: requestVat,
      companyTaxCode: requestVat ? companyTaxCode : undefined,
      companyName: requestVat ? companyName : undefined,
      companyAddress: requestVat ? companyAddress : undefined,
      notes,
      items: [...items],
      subtotal,
      discount: 0,
      shippingFee,
      total,
      status: orderType === 'store_pickup' ? 'ready_for_pickup' : 'pending',
      createdAt: new Date().toLocaleString('vi-VN'),
    };

    setCompletedOrder(newOrder);
    onClearCart();
  };

  const handlePrintOrder = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* If Order Completed, Show Success Receipt */}
        {completedOrder ? (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Success badge */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Đặt Hàng Thành Công!</h3>
                <p className="text-xs text-slate-500">
                  Mã đơn hàng: <strong className="text-emerald-700 font-mono text-sm">{completedOrder.id}</strong>
                </p>
              </div>

              {/* Printable Invoice Card */}
              <div
                id="printable-order-receipt"
                className="rounded-2xl border border-slate-300 p-5 bg-slate-50/70 text-xs space-y-4 shadow-sm"
              >
                {/* Brand Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <LogoIcon type={brand.logoType} color={brand.primaryColor} size={32} />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{brand.name}</h4>
                      <p className="text-[10px] text-slate-500 italic">&ldquo;{brand.tagline}&rdquo;</p>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-500">
                    <div>Ngày: {completedOrder.createdAt}</div>
                    <span className="font-bold text-emerald-700">
                      {completedOrder.orderType === 'store_pickup' ? 'NHẬN TẠI CỬA HÀNG' : 'GIAO TẬN NƠI'}
                    </span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Khách hàng:</span>
                    <strong>{completedOrder.customerName}</strong> - {completedOrder.phone}
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      {completedOrder.orderType === 'store_pickup' ? 'Địa điểm nhận:' : 'Địa chỉ giao:'}
                    </span>
                    <span className="line-clamp-2">{completedOrder.address}</span>
                  </div>
                </div>

                {completedOrder.requestVatInvoice && (
                  <div className="p-2 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-0.5">
                    <strong className="block">Yêu cầu xuất hóa đơn GTGT (VAT):</strong>
                    <div>MST: {completedOrder.companyTaxCode}</div>
                    <div>Công ty: {completedOrder.companyName}</div>
                  </div>
                )}

                {/* Items Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2">Sản phẩm</th>
                        <th className="p-2 text-center">SL</th>
                        <th className="p-2 text-right">Đơn giá</th>
                        <th className="p-2 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {completedOrder.items.map((item) => {
                        const price = item.quantity >= 10 ? item.product.wholesalePrice : item.product.price;
                        return (
                          <tr key={item.product.id}>
                            <td className="p-2">
                              <div className="font-medium text-slate-800 line-clamp-1">{item.product.name}</div>
                              <span className="font-mono text-[9px] text-slate-400">{item.product.sku}</span>
                            </td>
                            <td className="p-2 text-center font-bold">{item.quantity}</td>
                            <td className="p-2 text-right text-slate-500">{formatVND(price)}</td>
                            <td className="p-2 text-right font-bold text-slate-800">
                              {formatVND(price * item.quantity)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="space-y-1 text-right text-xs pt-2 border-t border-slate-200">
                  <div className="flex justify-between text-slate-500">
                    <span>Tạm tính tiền hàng:</span>
                    <span>{formatVND(completedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Phí vận chuyển:</span>
                    <span>{completedOrder.shippingFee === 0 ? 'Miễn phí' : formatVND(completedOrder.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                    <span>Tổng thanh toán:</span>
                    <span className="text-emerald-700">{formatVND(completedOrder.total)}</span>
                  </div>
                </div>

                {/* VietQR instructions if chosen */}
                {completedOrder.paymentMethod === 'vietqr' && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-center space-y-2">
                    <div className="text-xs font-bold text-blue-950 flex items-center justify-center gap-1.5">
                      <QrCode className="w-4 h-4 text-blue-600" />
                      Mã Chuyển Khoản Ngân Hàng VietQR
                    </div>
                    <div className="w-32 h-32 bg-white rounded-lg border border-slate-300 mx-auto flex items-center justify-center font-mono text-[10px] text-slate-400 p-2 text-center shadow-2xs">
                      [Mã VietQR Tự Động: {completedOrder.id}]
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Ngân hàng: <strong>MB Bank</strong> | STK: <strong>0908123456</strong>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Nội dung CK: <strong className="font-mono text-blue-800">{completedOrder.id}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-200 flex gap-3">
              <button
                onClick={handlePrintOrder}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>In Phiếu Đơn Hàng</span>
              </button>
              <button
                onClick={() => {
                  setCompletedOrder(null);
                  onClose();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                Tiếp Tục Mua Sắm
              </button>
            </div>
          </div>
        ) : (
          /* Normal Cart & Checkout View */
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Giỏ Hàng Của Bạn</h3>
                  <span className="text-xs text-slate-500">{items.length} loại mặt hàng văn phòng phẩm</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items or Empty */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-slate-700">Giỏ hàng của bạn đang trống</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Khám phá hơn 2000 mã hàng văn phòng phẩm chất lượng cao với giá sỉ hấp dẫn.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Items list */}
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                    {items.map((item) => {
                      const isWholesale = item.quantity >= 10;
                      const price = isWholesale ? item.product.wholesalePrice : item.product.price;
                      return (
                        <div key={item.product.id} className="p-3.5 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="font-bold text-xs text-slate-900 line-clamp-1">
                                {item.product.name}
                              </h5>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                                <span className="font-mono text-emerald-700 font-semibold">
                                  {item.product.sku}
                                </span>
                                <span>•</span>
                                <span>{formatVND(price)}/{item.product.unit}</span>
                                {isWholesale && (
                                  <span className="text-emerald-600 font-bold bg-emerald-50 px-1 rounded">
                                    Giá sỉ
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quantity controls */}
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                className="p-1.5 text-slate-500 hover:text-slate-800"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-slate-900">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1.5 text-slate-500 hover:text-slate-800"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.product.id)}
                              className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                              title="Xóa món này"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Checkout Form */}
                  <form onSubmit={handleCheckout} className="space-y-4 pt-2">
                    {/* Channel Selection: Online vs Store Pickup */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Hình Thức Nhận Hàng (Đa Kênh)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setOrderType('online_delivery')}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                            orderType === 'online_delivery'
                              ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 text-emerald-950 font-bold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-xs mb-1">
                            <Truck className="w-4 h-4 text-emerald-600" />
                            <span>Giao Tận Nơi</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-normal">
                            Ship hỏa tốc hoặc toàn quốc (Freeship từ 500k)
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setOrderType('store_pickup')}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                            orderType === 'store_pickup'
                              ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20 text-amber-950 font-bold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-xs mb-1">
                            <Store className="w-4 h-4 text-amber-600" />
                            <span>Nhận Tại Cửa Hàng</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-normal">
                            168 Nguyễn Trãi, Q.1 (Soạn sẵn sau 15 phút)
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Customer details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Họ và tên người nhận <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Ví dụ: Nguyễn Văn A"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Ví dụ: 0912 345 678"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    {orderType === 'online_delivery' ? (
                      <div className="text-xs">
                        <label className="block font-semibold text-slate-700 mb-1">
                          Địa chỉ giao hàng chi tiết <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Số nhà, tên đường, phường, quận/huyện, tỉnh/thành..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    ) : (
                      <div className="text-xs p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                        <strong className="block">Địa điểm lấy hàng:</strong>
                        <p className="text-[11px] text-slate-700">
                          📍 168 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP.HCM (Quầy Số 01)
                        </p>
                        <div className="pt-1 flex items-center gap-2">
                          <span className="text-[11px] font-semibold">Thời gian dự kiến ghé:</span>
                          <select
                            value={pickupTime}
                            onChange={(e) => setPickupTime(e.target.value)}
                            className="bg-white border border-amber-300 rounded px-2 py-0.5 text-xs font-semibold"
                          >
                            <option value="Sau 15 - 30 phút">Sau 15 - 30 phút nữa</option>
                            <option value="Sáng nay (08:00 - 11:30)">Sáng nay (08:00 - 11:30)</option>
                            <option value="Chiều nay (13:30 - 17:30)">Chiều nay (13:30 - 17:30)</option>
                            <option value="Tối nay (18:00 - 21:00)">Tối nay (18:00 - 21:00)</option>
                            <option value="Ngày mai">Ngày mai</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Payment Method */}
                    <div className="text-xs space-y-2">
                      <label className="block font-bold text-slate-800 uppercase tracking-wider">
                        Phương Thức Thanh Toán
                      </label>
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                            className="text-emerald-600"
                          />
                          <Banknote className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold text-slate-800">
                            Thanh toán tiền mặt khi nhận hàng (COD / Tại quầy)
                          </span>
                        </label>

                        <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'vietqr'}
                            onChange={() => setPaymentMethod('vietqr')}
                            className="text-emerald-600"
                          />
                          <QrCode className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-slate-800">
                            Chuyển khoản VietQR mã động (Xử lý tức thì)
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* VAT Invoice Request Toggle */}
                    <div className="pt-2 border-t border-slate-200">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                        <input
                          type="checkbox"
                          checked={requestVat}
                          onChange={(e) => setRequestVat(e.target.checked)}
                          className="rounded text-emerald-600"
                        />
                        <span>Yêu cầu xuất hóa đơn điện tử VAT (Dành cho Doanh nghiệp)</span>
                      </label>

                      {requestVat && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                          <div>
                            <label className="block text-slate-600 mb-1">Mã số thuế (MST) *</label>
                            <input
                              type="text"
                              required={requestVat}
                              value={companyTaxCode}
                              onChange={(e) => setCompanyTaxCode(e.target.value)}
                              placeholder="Ví dụ: 0312345678"
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-600 mb-1">Tên công ty trên giấy phép *</label>
                            <input
                              type="text"
                              required={requestVat}
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              placeholder="Công ty TNHH..."
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-600 mb-1">Địa chỉ công ty đăng ký thuế *</label>
                            <input
                              type="text"
                              required={requestVat}
                              value={companyAddress}
                              onChange={(e) => setCompanyAddress(e.target.value)}
                              placeholder="Địa chỉ trụ sở chính..."
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Submit Button inside form for mobile convenience */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-98"
                      >
                        <span>Xác Nhận Đặt Hàng ({formatVND(total)})</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính ({items.length} món):</span>
                  <span className="font-bold text-slate-900">{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Phí giao hàng:</span>
                  <span>{shippingFee === 0 ? 'Miễn phí (0đ)' : formatVND(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-1 border-t border-slate-200">
                  <span>Tổng thanh toán:</span>
                  <span className="text-emerald-700">{formatVND(total)}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
