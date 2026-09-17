'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store-context';
import { LogoIcon } from './LogoIcon';
import { formatVND, DEFAULT_STORE_INFO } from '@/lib/stationery-data';
import {
  Store,
  MapPin,
  Clock,
  PhoneCall,
  Mail,
  ShieldCheck,
  RotateCcw,
  Truck,
  FileText,
  ScanBarcode,
  Settings,
  AlertCircle
} from 'lucide-react';

export const SiteFooter: React.FC = () => {
  const { currentBrand, minOrderValue, minOrderEnabled } = useStore();

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 pt-10 pb-24 md:pb-10 px-4 text-xs mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {/* Brand & Slogan */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <LogoIcon type={currentBrand.logoType} color={currentBrand.primaryColor} size={36} />
            <div>
              <div className="font-extrabold text-base text-white">{currentBrand.name}</div>
              <div className="text-slate-400 text-[11px] italic">&ldquo;{currentBrand.tagline}&rdquo;</div>
            </div>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Hệ thống cung cấp văn phòng phẩm toàn diện cho doanh nghiệp, trường học và cá nhân. Cam kết 100% hàng chính hãng, giao hỏa tốc 2 giờ nội thành hoặc ghé cửa hàng lấy sau 15 phút.
          </p>

          {/* Min Order Notice */}
          <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Chính sách đơn hàng tối thiểu</span>
            </div>
            <p className="text-[11px] text-slate-300">
              {minOrderEnabled ? (
                <>
                  Áp dụng mức tối thiểu <strong>{formatVND(minOrderValue)}</strong> khi giao hàng tận nơi.{' '}
                  <Link href="/account" className="text-amber-400 underline hover:text-white">
                    Chỉnh sửa trong Admin
                  </Link>
                </>
              ) : (
                <>Hiện đang tắt điều kiện đơn hàng tối thiểu.</>
              )}
            </p>
          </div>
        </div>

        {/* Store Info & Pickup */}
        <div className="space-y-3">
          <h5 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Cửa Hàng Trực Tiếp</span>
          </h5>
          <div className="text-slate-400 space-y-2">
            <p className="flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{DEFAULT_STORE_INFO.address}, {DEFAULT_STORE_INFO.wardDistrictCity}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{DEFAULT_STORE_INFO.openingHours}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Hotline / Zalo: {DEFAULT_STORE_INFO.hotline}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{DEFAULT_STORE_INFO.email}</span>
            </p>
          </div>
        </div>

        {/* Quick Links & Pages */}
        <div className="space-y-3">
          <h5 className="font-bold text-sm text-white uppercase tracking-wider">
            Các Trang Mua Sắm
          </h5>
          <ul className="text-slate-400 space-y-2">
            <li>
              <Link href="/" className="hover:text-emerald-400 transition-colors">
                • Trang Chủ
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-emerald-400 transition-colors">
                • Danh Mục Sản Phẩm (2.000+ mã hàng)
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-emerald-400 transition-colors">
                • Giỏ Hàng & Kiểm Tra Đơn Tối Thiểu
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="hover:text-emerald-400 transition-colors">
                • Thanh Toán & Xuất Hóa Đơn VAT
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-emerald-400 transition-colors">
                • Tra Cứu & Theo Dõi Đơn Hàng
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-emerald-400 transition-colors">
                • Tài Khoản Khách Hàng & Cài Đặt Admin
              </Link>
            </li>
          </ul>
        </div>

        {/* Admin & POS system */}
        <div className="space-y-3">
          <h5 className="font-bold text-sm text-white uppercase tracking-wider">
            Hệ Thống Quản Trị
          </h5>
          <div className="space-y-2">
            <Link
              href="/pos"
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-700 shadow-xs"
            >
              <ScanBarcode className="w-4 h-4 text-cyan-400" />
              <span>Mở Màn Hình Bán Tại Quầy (POS)</span>
            </Link>

            <Link
              href="/account"
              className="w-full py-2 px-3 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-amber-500/30"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>Cài Đặt Đơn Hàng Tối Thiểu (Admin)</span>
            </Link>

            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
              Chính sách cam kết: <strong>Đồng kiểm khi nhận hàng</strong> • <strong>Đổi trả 7 ngày</strong> • <strong>Hóa đơn VAT điện tử</strong>.
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
        <div>
          © {new Date().getFullYear()} {currentBrand.name}. Bán online toàn quốc & Cửa hàng 168 Nguyễn Trãi, Q.1.
        </div>
        <div>Cam kết hàng chính hãng 100% • Hỗ trợ B2B chiết khấu cao</div>
      </div>
    </footer>
  );
};
