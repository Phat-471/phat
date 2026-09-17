'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { formatVND } from '@/lib/stationery-data';
import { CustomerOrder } from '@/lib/types';
import {
  ClipboardList,
  Search,
  Truck,
  Store,
  CheckCircle2,
  Clock,
  QrCode,
  RotateCcw,
  FileText,
  ChevronRight,
  PackageCheck,
  XCircle,
  ExternalLink,
  Printer
} from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();
  const { orders, addToCart, showToast } = useStore();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'ready_for_pickup' | 'shipping' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForQr, setSelectedOrderForQr] = useState<CustomerOrder | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (activeFilter !== 'all' && o.status !== activeFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: CustomerOrder['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Chờ Xác Nhận</span>
          </span>
        );
      case 'ready_for_pickup':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-0.5 rounded-full">
            <Store className="w-3 h-3 text-indigo-600" />
            <span>Sẵn Sàng Nhận Tại Tiệm</span>
          </span>
        );
      case 'shipping':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full">
            <Truck className="w-3 h-3 text-blue-600" />
            <span>Đang Giao Hàng</span>
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Đã Giao Thành Công</span>
          </span>
        );
      default:
        return null;
    }
  };

  const handleReorder = (order: CustomerOrder) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity);
    });
    showToast(`Đã thêm ${order.items.length} món từ đơn ${order.id} vào giỏ hàng`);
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-emerald-700">Trang Chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Lịch Sử Đơn Hàng Của Bạn</span>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <ClipboardList className="w-6 h-6 text-emerald-600" />
              <span>Đơn Hàng Của Bạn</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Theo dõi tình trạng đơn hàng, quét lại mã VietQR hoặc mua lại đơn nhanh chóng
            </p>
          </div>

          <Link
            href="/account"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl self-start sm:self-auto"
          >
            Quản trị đơn hệ thống trong Admin →
          </Link>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'pending', label: 'Chờ xác nhận' },
              { id: 'shipping', label: 'Đang giao' },
              { id: 'ready_for_pickup', label: 'Tại quầy' },
              { id: 'completed', label: 'Hoàn thành' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã DH-..., tên, SĐT..."
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-2xs">
            <ClipboardList className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-base text-slate-800">Không tìm thấy đơn hàng nào</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? 'Không có đơn hàng nào khớp với tìm kiếm của bạn.'
                : 'Bạn chưa có đơn hàng nào trong trạng thái này.'}
            </p>
            <Link
              href="/products"
              className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md transition-colors"
            >
              Xem Sản Phẩm Để Đặt Hàng
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all hover:border-slate-300 space-y-4 p-4 sm:p-5"
              >
                {/* Header: Code, Date & Status */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-xs sm:text-sm bg-slate-900 text-white px-2.5 py-0.5 rounded-lg">
                      {order.id}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      {order.orderType === 'online_delivery' ? (
                        <>
                          <Truck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Giao tận nơi</span>
                        </>
                      ) : (
                        <>
                          <Store className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Lấy tại tiệm (168 Nguyễn Trãi)</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Items List in this Order */}
                <div className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/products/${item.product.id}`}
                            className="font-bold text-slate-900 hover:text-emerald-700 truncate block"
                          >
                            {item.product.name}
                          </Link>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2">
                            <span>Mã: {item.product.sku}</span>
                            <span>•</span>
                            <span>SL: <strong>{item.quantity} {item.product.unit}</strong></span>
                            <span>•</span>
                            <span>{formatVND(item.quantity >= 10 ? item.product.wholesalePrice : item.product.price)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="font-extrabold text-slate-900 shrink-0">
                        {formatVND((item.quantity >= 10 ? item.product.wholesalePrice : item.product.price) * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Details Footer: Recipient, Payment, Total & Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1 text-slate-600">
                    <p>
                      Người nhận: <strong>{order.customerName}</strong> ({order.phone})
                    </p>
                    {order.address && (
                      <p className="line-clamp-1 max-w-md">
                        Địa chỉ: {order.address}
                      </p>
                    )}
                    {order.requestVatInvoice && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-800 px-1.5 py-0.2 rounded border border-indigo-200">
                        <FileText className="w-3 h-3" />
                        <span>Xuất VAT: MST {order.companyTaxCode}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-500">Tổng thanh toán:</span>
                      <span className="text-base font-black text-emerald-700">
                        {formatVND(order.total)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {order.paymentMethod === 'vietqr' && (
                        <button
                          onClick={() => setSelectedOrderForQr(order)}
                          className="px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold flex items-center gap-1 text-[11px] transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Mã VietQR</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleReorder(order)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold flex items-center gap-1 text-[11px] transition-colors shadow-2xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Mua lại</span>
                      </button>

                      <button
                        onClick={() => window.print()}
                        className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600"
                        title="In hóa đơn"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VietQR Modal */}
        {selectedOrderForQr && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>Mã Chuyển Khoản Đơn {selectedOrderForQr.id}</span>
                </h3>
                <button
                  onClick={() => setSelectedOrderForQr(null)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="w-48 h-48 bg-slate-100 p-3 rounded-2xl mx-auto flex items-center justify-center border border-slate-200">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=247-MBBANK-0908123456-${selectedOrderForQr.id}-${selectedOrderForQr.total}`}
                  alt="VietQR"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-xs text-left space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p>Số tiền: <strong className="text-emerald-700 font-extrabold">{formatVND(selectedOrderForQr.total)}</strong></p>
                <p>Số tài khoản: <strong className="font-mono">0908 123 456</strong> (MB Bank)</p>
                <p>Nội dung: <strong className="font-mono text-amber-800">{selectedOrderForQr.id}</strong></p>
              </div>

              <button
                onClick={() => setSelectedOrderForQr(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
