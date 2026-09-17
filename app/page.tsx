'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { CATEGORIES, BASE_PRODUCTS, formatVND, DEFAULT_STORE_INFO } from '@/lib/stationery-data';
import {
  Store,
  Truck,
  ShieldCheck,
  FileText,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Plus,
  Eye,
  ScanBarcode,
  Layers,
  Settings,
  AlertCircle,
  CheckCircle2,
  PhoneCall,
  Printer,
  ChevronRight,
  ShoppingCart
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const {
    currentBrand,
    products,
    addToCart,
    cartCount,
    cartSubtotal,
    minOrderValue,
    minOrderEnabled,
    isMinOrderMet,
    minOrderShortfall,
    minOrderProgress,
    storeSettings
  } = useStore();

  // Bestsellers & featured items
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 6);
  const paperProducts = products.filter((p) => p.category === 'Giấy In & Photo').slice(0, 4);
  const penProducts = products.filter((p) => p.category === 'Bút Viết & Mực').slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 py-8 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kho Văn Phòng Phẩm Online & Cửa Hàng 168 Nguyễn Trãi, Q.1</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              Giải Pháp Văn Phòng Phẩm Toàn Diện Cho{' '}
              <span className="text-emerald-700 underline decoration-emerald-300 underline-offset-6">
                Doanh Nghiệp & Cá Nhân
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              Hơn 2.000 mã sản phẩm chính hãng từ Thiên Long, Double A, Plus, Kokuyo, Casio. Đặt giao hàng hỏa tốc 2 giờ hoặc ghé trực tiếp tiệm lấy ngay sau 15 phút.
            </p>

            {/* Minimum Order Value Alert / Callout in Hero */}
            <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-3 text-xs text-amber-950 shadow-2xs">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-extrabold block">
                  {minOrderEnabled ? (
                    <>Mức đơn hàng tối thiểu giao tận nơi: <strong className="text-emerald-800 text-sm font-black">{formatVND(minOrderValue)}</strong></>
                  ) : (
                    <>Không áp dụng đơn tối thiểu (Đặt bất kỳ số lượng)</>
                  )}
                </span>
                <p className="text-[11px] text-amber-800">
                  Nhận trực tiếp tại quầy 168 Nguyễn Trãi không giới hạn số tiền • Miễn phí ship cho đơn từ <strong>{formatVND(storeSettings.freeShippingThreshold)}</strong>.{' '}
                  <Link href="/account" className="underline font-bold text-amber-900 hover:text-black">
                    Cài đặt hạn mức trong Admin
                  </Link>
                </p>
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/products"
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-98"
              >
                <Layers className="w-4 h-4" />
                <span>Xem Danh Mục 2.000+ Sản Phẩm</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/cart"
                className="px-5 py-3.5 rounded-xl border-2 border-slate-300 hover:border-slate-400 bg-white text-slate-800 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
              >
                <ShoppingCart className="w-4 h-4 text-emerald-600" />
                <span>Giỏ Hàng ({cartCount})</span>
              </Link>

              <Link
                href="/pos"
                className="px-4 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-2xs"
              >
                <ScanBarcode className="w-4 h-4 text-cyan-400" />
                <span>Màn Hình Thu Ngân POS</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Card: Quick Cart / Min Order Preview & Store Info */}
          <div className="lg:col-span-5 space-y-4">
            {/* Real-time Min Order Progress Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900">Giỏ Hàng Của Bạn</h3>
                    <p className="text-[10px] text-slate-400">{cartCount} sản phẩm đang chọn</p>
                  </div>
                </div>

                <Link
                  href="/cart"
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <span>Chi tiết giỏ</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Progress bar */}
              {minOrderEnabled && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Tình trạng đơn tối thiểu:</span>
                    <span className="font-bold text-slate-900">
                      {isMinOrderMet ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đã đạt ({minOrderProgress}%)
                        </span>
                      ) : (
                        <span className="text-amber-700">Thiếu {formatVND(minOrderShortfall)}</span>
                      )}
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isMinOrderMet ? 'bg-emerald-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${minOrderProgress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Đang có: {formatVND(cartSubtotal)}</span>
                    <span>Mục tiêu: {formatVND(minOrderValue)}</span>
                  </div>
                </div>
              )}

              {/* Offline Store Quick Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-emerald-600" />
                    <span>Cửa Hàng Trực Tiếp</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Mở Cửa
                  </span>
                </div>
                <p className="text-slate-600 flex items-start gap-1.5 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{DEFAULT_STORE_INFO.address}, {DEFAULT_STORE_INFO.wardDistrictCity}</span>
                </p>
                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 border-t border-slate-200/60">
                  <span>Giờ mở: {DEFAULT_STORE_INFO.openingHours}</span>
                  <span className="text-emerald-700 font-bold">Lấy sau 15p</span>
                </div>
              </div>

              {/* Direct Checkout button if items in cart */}
              {cartCount > 0 ? (
                <Link
                  href="/checkout"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Đi Đến Trang Thanh Toán ({formatVND(cartSubtotal)})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <Link
                  href="/products"
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200"
                >
                  <span>Khám Phá Sản Phẩm Ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4 Guarantees */}
      <section className="border-b border-slate-200 bg-white py-4 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Giao Hỏa Tốc 2 Giờ</h4>
              <p className="text-slate-500 text-[11px]">Nội thành TP.HCM nhanh chóng</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Đồng Kiểm Khi Nhận</h4>
              <p className="text-slate-500 text-[11px]">Kiểm tra trước khi trả tiền</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Xuất Hóa Đơn VAT</h4>
              <p className="text-slate-500 text-[11px]">Điện tử hợp lệ cho doanh nghiệp</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Nhận Tại Cửa Hàng</h4>
              <p className="text-slate-500 text-[11px]">168 Nguyễn Trãi sau 15 phút</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="py-8 sm:py-10 px-4 max-w-7xl mx-auto w-full space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Danh Mục Ngành Hàng Nổi Bật
            </h2>
            <p className="text-xs text-slate-500">
              Chọn ngành hàng cần mua sắm hoặc tìm kiếm theo hơn 2.000 mã sản phẩm
            </p>
          </div>

          <Link
            href="/products"
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>Xem tất cả danh mục</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-4 text-center hover:border-emerald-600 hover:shadow-md transition-all group shadow-2xs flex flex-col items-center justify-center gap-2"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center text-xl transition-colors">
                {cat.id === 'Giấy In & Photo' && '📄'}
                {cat.id === 'Bút Viết & Mực' && '✒️'}
                {cat.id === 'Bìa & Hồ Sơ Lưu Trữ' && '📁'}
                {cat.id === 'Dụng Cụ Văn Phòng' && '✂️'}
                {cat.id === 'Sổ & Tập Vở' && '📓'}
                {cat.id === 'Thiết Bị & Máy VP' && '🧮'}
              </div>
              <span className="font-bold text-xs text-slate-800 group-hover:text-emerald-700 transition-colors">
                {cat.name}
              </span>
              <span className="text-[10px] text-slate-400">
                {cat.count} sản phẩm
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers Showcase */}
      <section className="py-8 px-4 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  Top Bán Chạy
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Văn Phòng Phẩm Doanh Nghiệp Ưa Chuộng
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Các sản phẩm luôn có sẵn số lượng lớn tại quầy và kho giao hàng
              </p>
            </div>

            <Link
              href="/products"
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>Xem thêm</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {bestSellers.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden shadow-2xs group"
              >
                <div>
                  <Link
                    href={`/products/${product.id}`}
                    className="h-32 sm:h-36 bg-slate-50 flex items-center justify-center p-3 relative overflow-hidden block"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 text-[9px] font-mono font-bold bg-slate-900 text-white px-1.5 py-0.2 rounded">
                      {product.sku.substring(0, 8)}
                    </span>
                  </Link>

                  <div className="p-3 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">
                      {product.brand}
                    </span>
                    <Link
                      href={`/products/${product.id}`}
                      className="text-xs font-bold text-slate-900 line-clamp-2 hover:text-emerald-700 min-h-[2rem]"
                    >
                      {product.name}
                    </Link>
                    <div className="pt-1 flex items-baseline justify-between">
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                        {formatVND(product.price)}
                      </span>
                      <span className="text-[9px] text-slate-400">/{product.unit}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 pt-0 flex items-center gap-1">
                  <Link
                    href={`/products/${product.id}`}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offline Store & Services Section */}
      <section className="py-8 sm:py-10 px-4 max-w-7xl mx-auto w-full space-y-6">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <Store className="w-3.5 h-3.5" />
                <span>Cửa Hàng Trực Tiếp 168 Nguyễn Trãi, Q.1</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black">
                Ghé Thăm Tiệm Trực Tiếp Hoặc Nhận Hàng Sau 15 Phút
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Đến trải nghiệm trực tiếp hàng ngàn mẫu văn phòng phẩm, dùng thử bút viết, máy tính Casio chính hãng và nhận tư vấn mua sỉ chiết khấu cao cho doanh nghiệp.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Mở cửa: <strong>{DEFAULT_STORE_INFO.openingHours}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Hotline: <strong>{DEFAULT_STORE_INFO.hotline}</strong></span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-3">
                <Link
                  href="/pos"
                  className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all"
                >
                  <ScanBarcode className="w-4 h-4" />
                  <span>Mở Giao Diện Bán Hàng Tại Quầy (POS)</span>
                </Link>
                <Link
                  href="/account"
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700"
                >
                  <Settings className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cài Đặt Đơn Tối Thiểu (Admin)</span>
                </Link>
              </div>
            </div>

            {/* Services Box */}
            <div className="bg-slate-800/90 rounded-2xl p-5 sm:p-6 border border-slate-700 space-y-4">
              <h3 className="font-bold text-sm text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Printer className="w-4 h-4" />
                <span>Dịch Vụ Tại Cửa Hàng 168 Nguyễn Trãi</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-start gap-3">
                  <span className="text-lg">🖨️</span>
                  <div>
                    <strong className="text-white block">In ấn - Photocopy - Scan màu tài liệu</strong>
                    <span className="text-slate-400 text-[11px]">In hồ sơ thầu, tài liệu hội thảo, bản vẽ chất lượng cao</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-start gap-3">
                  <span className="text-lg">🖋️</span>
                  <div>
                    <strong className="text-white block">Khắc dấu tên - Chức danh lấy liền 15 phút</strong>
                    <span className="text-slate-400 text-[11px]">Dấu chữ ký, dấu tròn công ty, mực Trodat chính hãng</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-start gap-3">
                  <span className="text-lg">📚</span>
                  <div>
                    <strong className="text-white block">Đóng gáy lò xo kẽm & Bìa còng lưu trữ</strong>
                    <span className="text-slate-400 text-[11px]">Gia công sổ tay, báo cáo tài chính đẹp mắt và bền bỉ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
