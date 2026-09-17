'use client';

import React, { useState } from 'react';
import { OfflineStoreInfo, Product } from '@/lib/types';
import { LogoIcon } from './LogoIcon';
import {
  X,
  MapPin,
  Clock,
  Phone,
  Mail,
  Printer,
  FileCheck,
  Stamp,
  ShoppingBag,
  Receipt,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatVND } from '@/lib/stationery-data';

interface OfflineStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeInfo: OfflineStoreInfo;
  products: Product[];
  brandName: string;
  brandColor: string;
  onSelectProduct: (product: Product) => void;
}

export const OfflineStoreModal: React.FC<OfflineStoreModalProps> = ({
  isOpen,
  onClose,
  storeInfo,
  products,
  brandName,
  brandColor,
  onSelectProduct,
}) => {
  const [skuSearch, setSkuSearch] = useState('');

  if (!isOpen) return null;

  const filteredItems = skuSearch.trim()
    ? products.filter(
        (p) =>
          p.sku.toLowerCase().includes(skuSearch.toLowerCase()) ||
          p.name.toLowerCase().includes(skuSearch.toLowerCase()) ||
          p.barcode.includes(skuSearch)
      ).slice(0, 10)
    : products.slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Cửa Hàng Trực Tiếp - {brandName}
              </h2>
              <p className="text-xs text-slate-500">
                Mua sắm trực tiếp tại quầy hoặc Đặt online nhận hàng sau 15 phút
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Banner: Store Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 shadow-md border border-slate-700">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-2">
                    ● Đang mở cửa đón khách
                  </span>
                  <h3 className="text-xl font-black text-white">{storeInfo.name}</h3>
                  <p className="text-sm text-slate-300 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    {storeInfo.address}, {storeInfo.wardDistrictCity}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                  <LogoIcon size={38} color={brandColor} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-700/80 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{storeInfo.openingHours}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Hotline: {storeInfo.hotline}</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                <strong className="text-emerald-300">Sơ đồ vị trí kệ hàng: </strong>
                {storeInfo.shelfGuide}
              </div>
            </div>

            {/* In-Store Pickup Guide */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  Click & Collect (Lấy Tại Quầy)
                </div>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  Đặt hàng trực tiếp trên website, nhân viên sẽ gom sẵn đơn vào túi riêng tại quầy thanh toán. Bạn chỉ cần ghé đọc số điện thoại để nhận hàng ngay trong 15 phút!
                </p>
                <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Không mất phí vận chuyển
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Kiểm tra hàng trực tiếp trước khi nhận
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Hỗ trợ xuất hóa đơn VAT tại chỗ
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200/80 text-[11px] text-emerald-800 font-semibold">
                Quầy nhận: Số 01 - Tầng trệt
              </div>
            </div>
          </div>

          {/* In-Store Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <Printer className="w-4 h-4 text-emerald-600" />
              Dịch Vụ Tiện Ích Trực Tiếp Tại Cửa Hàng
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                {
                  title: 'In Ấn & Photocopy Nhanh',
                  desc: 'In tài liệu A4, A3, in màu laser độ nét cao, scan hồ sơ tài chính.',
                  icon: Printer,
                },
                {
                  title: 'Đóng Gáy Lò Xo & Mạ Vàng',
                  desc: 'Đóng sổ luận văn, báo cáo đại hội, gáy kẽm xoắn & gáy nhựa bền đẹp.',
                  icon: FileCheck,
                },
                {
                  title: 'Khắc Dấu Liền Mực 30 Phút',
                  desc: 'Khắc dấu tên, dấu chức danh, dấu tròn công ty chính hãng Shiny.',
                  icon: Stamp,
                },
                {
                  title: 'Soạn Hàng Dự Án Công Ty',
                  desc: 'Cung cấp trọn gói định kỳ cho doanh nghiệp, đóng gói phân loại từng phòng ban.',
                  icon: ShoppingBag,
                },
                {
                  title: 'Xuất Hóa Đơn Điện Tử VAT',
                  desc: 'Hỗ trợ xuất hóa đơn thuế GTGT hợp lệ trực tiếp gửi về email ngay trong ngày.',
                  icon: Receipt,
                },
                {
                  title: 'Cắt Bàn & Ép Plastic',
                  desc: 'Cắt xén giấy theo kích thước yêu cầu, ép màng bóng bảo quản bằng cấp chứng chỉ.',
                  icon: FileCheck,
                }
              ].map((srv, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-colors">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-800 mb-1">
                    <srv.icon className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{srv.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{srv.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive In-Store Shelf & Stock Lookup */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-600" />
                  Tra Cứu Vị Trí Kệ Hàng & Tồn Kho Thực Tế Tại Cửa Hàng
                </h3>
                <p className="text-xs text-slate-500">
                  Gõ mã SKU hoặc tên mặt hàng để biết ngay đang đặt tại Kệ nào và số lượng sẵn trên kệ
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={skuSearch}
                  onChange={(e) => setSkuSearch(e.target.value)}
                  placeholder="Tra cứu SKU (VD: GIAY-DA, BUT-TL)..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-600 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="p-2.5">Mã SKU</th>
                    <th className="p-2.5">Tên Sản Phẩm Văn Phòng Phẩm</th>
                    <th className="p-2.5">Vị Trí Kệ Trong Cửa Hàng</th>
                    <th className="p-2.5 text-center">Tồn Kho Tại Quầy</th>
                    <th className="p-2.5 text-right">Đơn Giá Lẻ</th>
                    <th className="p-2.5 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2.5 font-mono font-semibold text-emerald-700">
                        {item.sku}
                      </td>
                      <td className="p-2.5">
                        <div className="font-medium text-slate-800 line-clamp-1">{item.name}</div>
                        <span className="text-[10px] text-slate-400">{item.brand}</span>
                      </td>
                      <td className="p-2.5">
                        <span className="inline-block px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-medium border border-amber-200 text-[11px]">
                          📍 {item.shelfLocation}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        {item.stockOffline > 10 ? (
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {item.stockOffline} {item.unit}
                          </span>
                        ) : item.stockOffline > 0 ? (
                          <span className="inline-flex items-center gap-1 font-bold text-amber-700">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            Sắp hết ({item.stockOffline})
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold">Hết tại quầy</span>
                        )}
                      </td>
                      <td className="p-2.5 text-right font-bold text-slate-900">
                        {formatVND(item.price)}
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => {
                            onSelectProduct(item);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 font-medium transition-colors text-[11px]"
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50">
          <div className="text-xs text-slate-500">
            Khách hàng doanh nghiệp cần ký hợp đồng cung cấp VPP tháng? Liên hệ Hotline:{' '}
            <strong className="text-slate-800">{storeInfo.hotline}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs shadow transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
