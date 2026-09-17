'use client';

import React, { useState } from 'react';
import { Product, BrandIdentity } from '@/lib/types';
import { formatVND } from '@/lib/stationery-data';
import { LogoIcon } from './LogoIcon';
import {
  X,
  FileText,
  Sparkles,
  Building2,
  Printer,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface B2BQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: BrandIdentity;
  products: Product[];
}

interface QuoteItem {
  id: string;
  name: string;
  sku: string;
  unit: string;
  qty: number;
  unitPrice: number;
}

export const B2BQuoteModal: React.FC<B2BQuoteModalProps> = ({
  isOpen,
  onClose,
  brand,
  products,
}) => {
  const [companyName, setCompanyName] = useState('Công ty Cổ phần Thương Mại & Dịch Vụ ABC');
  const [contactPerson, setContactPerson] = useState('Nguyễn Thị Mai (Phòng Hành chính - Nhân sự)');
  const [contactPhone, setContactPhone] = useState('0987 654 321');
  const [companyHeadcount, setCompanyHeadcount] = useState('20-30');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  // Default standard office procurement items
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([
    {
      id: '1',
      sku: 'GIAY-DA-A4-70',
      name: 'Giấy in Double A A4 định lượng 70gsm',
      unit: 'Ram',
      qty: 15,
      unitPrice: 72000,
    },
    {
      id: '2',
      sku: 'BUT-TL-027-XANH',
      name: 'Bút bi Thiên Long TL-027 ngòi 0.5mm (Hộp 20 cây)',
      unit: 'Hộp',
      qty: 5,
      unitPrice: 62000,
    },
    {
      id: '3',
      sku: 'BIA-CONG-KJ-7CM',
      name: 'Bìa còng bật King Jim A4 gáy 7cm',
      unit: 'Cái',
      qty: 20,
      unitPrice: 57000,
    },
    {
      id: '4',
      sku: 'BAM-KIM-PLUS-10',
      name: 'Máy bấm kim số 10 Plus trợ lực',
      unit: 'Cái',
      qty: 5,
      unitPrice: 41000,
    },
    {
      id: '5',
      sku: 'BANG-KEO-TRONG-5CM',
      name: 'Băng keo trong dán thùng 5cm (Cây 6 cuộn)',
      unit: 'Cây',
      qty: 3,
      unitPrice: 75000,
    },
  ]);

  if (!isOpen) return null;

  const handleAskAiRecommendation = async () => {
    setIsAiLoading(true);
    setAiAdvice(null);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'suggest_office_package',
          companySize: companyHeadcount,
        }),
      });
      const data = await res.json();
      if (data.items && Array.isArray(data.items)) {
        // Map suggested items to catalog prices
        const newItems: QuoteItem[] = data.items.map((item: any, idx: number) => {
          const match = products.find((p) =>
            p.name.toLowerCase().includes(item.name.toLowerCase())
          );
          return {
            id: `ai-${idx}`,
            sku: match ? match.sku : `VPP-AUTO-${idx + 1}`,
            name: item.name,
            unit: item.unit || 'Cái',
            qty: item.suggestedQty || 10,
            unitPrice: match ? match.wholesalePrice : 45000,
          };
        });
        setQuoteItems(newItems);
        setAiAdvice(data.advice || 'Đã tối ưu danh sách theo quy mô doanh nghiệp của bạn.');
      }
    } catch {
      alert('Không thể kết nối trợ lý AI lúc này.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleUpdateItemQty = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setQuoteItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: newQty } : it))
    );
  };

  const handleRemoveItem = (id: string) => {
    setQuoteItems((prev) => prev.filter((it) => it.id !== id));
  };

  const subtotal = quoteItems.reduce((sum, it) => sum + it.qty * it.unitPrice, 0);
  const vatTax = Math.round(subtotal * 0.08); // 8% VAT
  const grandTotal = subtotal + vatTax;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Bảng Báo Giá Văn Phòng Phẩm Doanh Nghiệp (B2B)
              </h2>
              <p className="text-xs text-slate-500">
                Xuất file báo giá chính thức, tính thuế VAT 8%, chiết khấu sỉ theo hợp đồng
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* AI Helper Banner */}
          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Gợi Ý Định Mức Vật Tư Bằng AI Theo Quy Mô Nhân Sự
              </div>
              <p className="text-xs text-indigo-800 mt-0.5">
                Nhập số lượng nhân viên văn phòng, AI sẽ tự động lên danh mục và số lượng dự trù cho tháng!
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={companyHeadcount}
                onChange={(e) => setCompanyHeadcount(e.target.value)}
                className="bg-white border border-indigo-300 rounded-lg px-2.5 py-1.5 text-xs text-indigo-950 font-semibold focus:outline-none"
              >
                <option value="10-15">Quy mô 10 - 15 người</option>
                <option value="20-30">Quy mô 20 - 30 người</option>
                <option value="50-70">Quy mô 50 - 70 người</option>
                <option value="100+">Quy mô trên 100 người</option>
              </select>

              <button
                onClick={handleAskAiRecommendation}
                disabled={isAiLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-xs"
              >
                {isAiLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Đang tính...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Lập Dự Trù
                  </>
                )}
              </button>
            </div>
          </div>

          {aiAdvice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium">
              💡 <strong>Lời khuyên chuyên gia:</strong> {aiAdvice}
            </div>
          )}

          {/* Client & Supplier Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
              <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                Đơn Vị Yêu Cầu Báo Giá (Khách Hàng)
              </span>
              <div>
                <label className="block text-slate-500 mb-0.5">Tên công ty / Cơ quan:</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-0.5">Người liên hệ:</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-0.5">Điện thoại / Zalo:</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
              <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                Đơn Vị Cung Cấp (Bên Bán)
              </span>
              <div className="flex items-center gap-2">
                <LogoIcon type={brand.logoType} color={brand.primaryColor} size={28} />
                <strong className="text-slate-900">{brand.name}</strong>
              </div>
              <p className="text-slate-500 italic text-[11px]">&ldquo;{brand.tagline}&rdquo;</p>
              <p className="text-slate-600 text-[11px]">
                Địa chỉ: Số 168 Nguyễn Trãi, P. Bến Thành, Q.1, TP.HCM
              </p>
              <p className="text-slate-600 text-[11px]">
                Hotline sỉ: <strong>0908 123 456</strong> | Xuất hóa đơn VAT đầy đủ
              </p>
            </div>
          </div>

          {/* Quotation Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 text-xs font-bold text-slate-700 flex justify-between">
              <span>Bảng Chi Tiết Mặt Hàng Báo Giá ({quoteItems.length} mục)</span>
              <span className="text-emerald-700">Đã áp dụng đơn giá sỉ Doanh nghiệp</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="p-2.5">STT</th>
                  <th className="p-2.5">Mã SKU</th>
                  <th className="p-2.5">Tên Mặt Hàng</th>
                  <th className="p-2.5 text-center">ĐVT</th>
                  <th className="p-2.5 text-center">Số Lượng</th>
                  <th className="p-2.5 text-right">Đơn Giá Sỉ</th>
                  <th className="p-2.5 text-right">Thành Tiền</th>
                  <th className="p-2.5 text-center">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quoteItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-2.5 text-slate-400 font-mono text-center">{idx + 1}</td>
                    <td className="p-2.5 font-mono font-semibold text-emerald-800">{item.sku}</td>
                    <td className="p-2.5 font-medium text-slate-900">{item.name}</td>
                    <td className="p-2.5 text-center text-slate-500">{item.unit}</td>
                    <td className="p-2.5 text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => handleUpdateItemQty(item.id, Number(e.target.value))}
                        className="w-14 text-center border border-slate-300 rounded px-1 py-0.5 font-bold"
                      />
                    </td>
                    <td className="p-2.5 text-right font-medium text-slate-700">
                      {formatVND(item.unitPrice)}
                    </td>
                    <td className="p-2.5 text-right font-bold text-slate-900">
                      {formatVND(item.qty * item.unitPrice)}
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quotation Totals */}
          <div className="flex flex-col sm:flex-row items-end justify-between gap-4 text-xs">
            <div className="text-slate-500 space-y-1 text-[11px]">
              <div>• Giá đã bao gồm chiết khấu thương mại cho hợp đồng văn phòng phẩm tháng.</div>
              <div>• Miễn phí giao hàng và bốc xếp tận phòng làm việc tại TP.HCM.</div>
              <div>• Báo giá có hiệu lực trong vòng 30 ngày kể từ ngày lập.</div>
            </div>

            <div className="w-full sm:w-72 space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Cộng tiền hàng:</span>
                <span className="font-bold text-slate-900">{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Thuế GTGT (VAT 8%):</span>
                <span>{formatVND(vatTax)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
                <span>Tổng Cộng Tiền:</span>
                <span className="text-indigo-700">{formatVND(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Đóng
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors shadow-2xs"
            >
              <Printer className="w-4 h-4" />
              <span>In Bảng Báo Giá (PDF)</span>
            </button>
            <button
              onClick={() => {
                alert(`Đã lưu bảng báo giá số: BG-${Math.floor(100000 + Math.random() * 900000)}. Nhân viên hỗ trợ sẽ liên hệ SĐT ${contactPhone} trong vòng 15 phút!`);
                onClose();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Gửi Yêu Cầu Đặt Hàng B2B</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
