'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store-context';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { formatVND, BRAND_PRESETS } from '@/lib/stationery-data';
import {
  User,
  Settings,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertCircle,
  Store,
  DollarSign,
  Truck,
  ScanBarcode,
  Package,
  Clock,
  Sparkles,
  ChevronRight,
  Building2,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

export default function AccountPage() {
  const {
    userProfile,
    updateUserProfile,
    minOrderValue,
    minOrderEnabled,
    updateMinOrderSettings,
    storeSettings,
    updateStoreSettings,
    currentBrand,
    setBrand,
    orders,
    updateOrderStatus,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'admin_min_order' | 'admin_orders'>('admin_min_order');

  // Local state for profile form
  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone);
  const [email, setEmail] = useState(userProfile.email);
  const [address, setAddress] = useState(userProfile.address);
  const [companyName, setCompanyName] = useState(userProfile.companyName || '');
  const [companyTaxCode, setCompanyTaxCode] = useState(userProfile.companyTaxCode || '');

  // Local state for Admin Minimum Order settings
  const [localMinOrderValue, setLocalMinOrderValue] = useState(minOrderValue);
  const [localMinOrderEnabled, setLocalMinOrderEnabled] = useState(minOrderEnabled);

  // Local state for Store settings
  const [localStoreAddress, setLocalStoreAddress] = useState(storeSettings.storeAddress);
  const [localStoreHotline, setLocalStoreHotline] = useState(storeSettings.storeHotline);
  const [localFreeShippingThreshold, setLocalFreeShippingThreshold] = useState(storeSettings.freeShippingThreshold);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      email,
      address,
      companyName,
      companyTaxCode
    });
    showToast('Đã lưu thông tin tài khoản thành công!');
  };

  const handleSaveMinOrderSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateMinOrderSettings(localMinOrderValue, localMinOrderEnabled);
    updateStoreSettings({
      storeAddress: localStoreAddress,
      storeHotline: localStoreHotline,
      freeShippingThreshold: localFreeShippingThreshold
    });
    showToast('Đã cập nhật cài đặt đơn hàng tối thiểu & cửa hàng!');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <SiteHeader />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-emerald-700">Trang Chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Tài Khoản & Quản Trị Hệ Thống</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <Settings className="w-6 h-6 text-emerald-600" />
              <span>Tài Khoản & Quản Trị Cửa Hàng</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Cài đặt mức đơn hàng tối thiểu, quản lý thông tin khách hàng và vận hành đơn trực tuyến
            </p>
          </div>

          <Link
            href="/pos"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold text-xs transition-colors shadow-2xs self-start sm:self-auto"
          >
            <ScanBarcode className="w-4 h-4 text-cyan-400" />
            <span>Màn Hình Bán Tại Quầy (POS)</span>
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('admin_min_order')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'admin_min_order'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Cài Đặt Đơn Hàng Tối Thiểu (Admin)</span>
            {minOrderEnabled && (
              <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                {formatVND(minOrderValue)}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('admin_orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'admin_orders'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Quản Trị Đơn Hàng ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Thông Tin Cá Nhân & Xuất VAT</span>
          </button>
        </div>

        {/* TAB 1: ADMIN MINIMUM ORDER CONFIGURATION */}
        {activeTab === 'admin_min_order' && (
          <div className="space-y-6">
            <form onSubmit={handleSaveMinOrderSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Minimum Order Value Config */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                        <span>Cài Đặt Mức Tiền Đơn Hàng Tối Thiểu</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Áp dụng cho đơn giao hàng trực tuyến nhằm tối ưu chi phí vận chuyển & xử lý đơn
                      </p>
                    </div>

                    {/* Enable / Disable Switch */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <span className="text-xs font-bold text-slate-700">
                        {localMinOrderEnabled ? 'Đang Bật' : 'Đang Tắt'}
                      </span>
                      <input
                        type="checkbox"
                        checked={localMinOrderEnabled}
                        onChange={(e) => setLocalMinOrderEnabled(e.target.checked)}
                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                      />
                    </label>
                  </div>

                  {/* Input Value */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-800">
                      Số tiền tối thiểu một đơn giao hàng trực tuyến (VNĐ):
                    </label>
                    <div className="relative max-w-md">
                      <input
                        type="number"
                        min={0}
                        step={10000}
                        value={localMinOrderValue}
                        onChange={(e) => setLocalMinOrderValue(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full pl-4 pr-16 py-3 rounded-xl border-2 border-slate-300 text-lg font-black text-slate-900 focus:outline-none focus:border-emerald-600 bg-slate-50/50"
                      />
                      <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-500">
                        VNĐ
                      </span>
                    </div>

                    <p className="text-xs text-emerald-700 font-bold">
                      Hiển thị định dạng: {formatVND(localMinOrderValue)}
                    </p>

                    {/* Quick Preset Buttons */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Các mức chọn nhanh gợi ý:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { val: 0, label: '0đ (Không áp dụng)' },
                          { val: 50000, label: '50.000đ' },
                          { val: 100000, label: '100.000đ' },
                          { val: 150000, label: '150.000đ' },
                          { val: 200000, label: '200.000đ (Khuyên dùng)' },
                          { val: 300000, label: '300.000đ' },
                          { val: 500000, label: '500.000đ' }
                        ].map((preset) => (
                          <button
                            key={preset.val}
                            type="button"
                            onClick={() => {
                              setLocalMinOrderValue(preset.val);
                              setLocalMinOrderEnabled(preset.val > 0);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                              localMinOrderValue === preset.val
                                ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Free shipping threshold config */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Mức miễn phí vận chuyển toàn quốc (Freeship):
                    </label>
                    <div className="relative max-w-md">
                      <input
                        type="number"
                        min={0}
                        step={50000}
                        value={localFreeShippingThreshold}
                        onChange={(e) => setLocalFreeShippingThreshold(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full pl-4 pr-16 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-600 bg-slate-50/50"
                      />
                      <span className="absolute right-4 top-3 text-xs font-bold text-slate-500">
                        VNĐ
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Hiện tại: Đơn từ <strong>{formatVND(localFreeShippingThreshold)}</strong> sẽ được miễn hoàn toàn 30.000đ tiền ship.
                    </p>
                  </div>

                  {/* Store info config */}
                  <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Địa chỉ cửa hàng trực tiếp:</label>
                      <input
                        type="text"
                        value={localStoreAddress}
                        onChange={(e) => setLocalStoreAddress(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Hotline / Zalo tư vấn:</label>
                      <input
                        type="text"
                        value={localStoreHotline}
                        onChange={(e) => setLocalStoreHotline(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-98"
                    >
                      <Save className="w-4 h-4" />
                      <span>Lưu Cài Đặt Đơn Hàng Tối Thiểu</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Explanation & Simulation */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Mô Phỏng Trải Nghiệm Khách Hàng</span>
                  </h4>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="font-bold text-slate-900">
                      Khi khách đặt hàng online:
                    </div>
                    {localMinOrderEnabled && localMinOrderValue > 0 ? (
                      <ul className="space-y-1.5 text-slate-600 list-disc pl-4 text-[11px]">
                        <li>
                          Nếu giỏ hàng <strong>dưới {formatVND(localMinOrderValue)}</strong>: Hệ thống hiện thanh tiến độ cảnh báo số tiền còn thiếu và gợi ý các sản phẩm bổ sung nhanh.
                        </li>
                        <li>
                          Trang thanh toán sẽ <strong>khóa nút Đặt Hàng Giao Tận Nơi</strong> cho đến khi đạt đủ mức {formatVND(localMinOrderValue)}.
                        </li>
                        <li>
                          Khách vẫn có thể chọn <strong>Nhận tại cửa hàng 168 Nguyễn Trãi</strong> mà không bị giới hạn số tiền.
                        </li>
                      </ul>
                    ) : (
                      <p className="text-slate-500 text-[11px]">
                        Hiện tại tính năng đơn tối thiểu đang <strong>TẮT</strong>. Khách hàng có thể đặt bất kỳ số tiền nào (kể cả 1 cây bút 4.000đ).
                      </p>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Lợi ích cho văn phòng phẩm:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Giúp cửa hàng tránh tình trạng đơn lẻ giá trị thấp không bù đắp được chi phí đóng gói, in hóa đơn và book shipper. Mức khuyên dùng là <strong>150.000đ - 200.000đ</strong>.
                    </p>
                  </div>
                </div>

                {/* Brand Preset Selector */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Nhận Diện Thương Hiệu & Logo
                  </h4>
                  <div className="space-y-1.5">
                    {BRAND_PRESETS.map((brand) => (
                      <button
                        key={brand.name}
                        type="button"
                        onClick={() => {
                          setBrand(brand);
                          showToast(`Đã đổi nhận diện: ${brand.name}`);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                          currentBrand.name === brand.name
                            ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-900'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <span>{brand.name}</span>
                          <span className="text-[10px] text-slate-400 block font-normal">&ldquo;{brand.tagline}&rdquo;</span>
                        </div>
                        {currentBrand.name === brand.name && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: ADMIN ORDERS DISPATCH */}
        {activeTab === 'admin_orders' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-600" />
                  <span>Xử Lý Đơn Hàng Toàn Hệ Thống</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Cập nhật trạng thái chuẩn bị hàng, giao hàng và xác nhận thanh toán
                </p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                Tổng cộng {orders.length} đơn
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Chưa có đơn hàng nào trong hệ thống.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <div key={order.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded text-[11px]">
                          {order.id}
                        </span>
                        <span className="font-bold text-slate-800">{order.customerName}</span>
                        <span className="text-slate-400">({order.phone})</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <p className="text-slate-600">
                        {order.orderType === 'online_delivery' ? '🚚 Giao hàng: ' + (order.address || '') : '🏪 Nhận tại tiệm 168 Nguyễn Trãi'}
                      </p>
                      <div className="text-slate-500 flex items-center gap-2">
                        <span>{order.items.length} món hàng</span>
                        <span>•</span>
                        <strong className="text-emerald-700">{formatVND(order.total)}</strong>
                        <span>•</span>
                        <span>{order.paymentMethod.toUpperCase()}</span>
                      </div>
                    </div>

                    {/* Status Changer Buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'pending')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          order.status === 'pending'
                            ? 'bg-amber-500 text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        Chờ xử lý
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready_for_pickup')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          order.status === 'ready_for_pickup'
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        Sẵn sàng tại quầy
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'shipping')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          order.status === 'shipping'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        Đang giao
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          order.status === 'completed'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        Hoàn tất
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CUSTOMER PROFILE & VAT DEFAULT INFO */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-6 shadow-2xs">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                <span>Thông Tin Khách Hàng & Doanh Nghiệp Mặc Định</span>
              </h3>
              <p className="text-xs text-slate-500">
                Thông tin này sẽ được tự động điền khi bạn tiến hành thanh toán đơn hàng
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Họ và Tên</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Nguyễn Văn Nam"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Số Điện Thoại</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="VD: 0912 345 678"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="VD: nam.nguyen@cty.vn"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-slate-700">Địa Chỉ Giao Hàng Mặc Định</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="VD: Tòa nhà Bitexco, 2 Hải Triều, P. Bến Nghé, Q.1, TP.HCM"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-2 pt-3 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 mb-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Thông Tin Xuất Hóa Đơn VAT Công Ty</span>
                </h4>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Mã Số Thuế (MST)</label>
                <input
                  type="text"
                  value={companyTaxCode}
                  onChange={(e) => setCompanyTaxCode(e.target.value)}
                  placeholder="VD: 0316892145"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tên Công Ty / Đơn Vị</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="VD: Công Ty Cổ Phần Công Nghệ..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Thay Đổi Thông Tin</span>
              </button>
            </div>
          </form>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
