'use client';

import React, { useState } from 'react';
import { PhoneCall, MessageCircle, Send, X, Check, Copy } from 'lucide-react';

interface ZaloContactWidgetProps {
  hotline: string;
  zaloNumber: string;
  storeAddress: string;
}

export const ZaloContactWidget: React.FC<ZaloContactWidgetProps> = ({
  hotline,
  zaloNumber,
  storeAddress,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderListText, setOrderListText] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const cleanZalo = zaloNumber.replace(/\D/g, '');

  const handleCopyAndChatZalo = () => {
    const fullText = `[ĐƠN YÊU CẦU BÁO GIÁ VĂN PHÒNG PHẨM]\nKhách hàng: ${customerName || 'Khách hàng'}\nSĐT: ${customerPhone || 'Chưa cung cấp'}\nNhu cầu vật tư:\n${orderListText || 'Cần tư vấn báo giá trọn gói văn phòng phẩm'}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setSubmitted(true);
    setTimeout(() => {
      // Open Zalo chat link (Web Zalo / App Zalo)
      window.open(`https://zalo.me/${cleanZalo}`, '_blank');
    }, 600);
  };

  return (
    <>
      {/* Floating Action Buttons (Sticky at bottom-right, positioned above mobile bottom nav) */}
      <div className="fixed bottom-20 md:bottom-6 right-3.5 sm:right-6 z-40 flex flex-col items-end gap-2.5">
        {/* Quick Hotline Call Button */}
        <a
          href={`tel:${cleanZalo}`}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white pl-3 pr-3.5 py-2 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 group border-2 border-white"
          title="Gọi hotline đặt hàng nhanh"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
            <PhoneCall className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-bold hidden sm:inline">Gọi: {hotline}</span>
        </a>

        {/* Zalo / Fast Quote Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white pl-3 pr-4 py-2.5 rounded-full shadow-xl transition-all transform hover:scale-105 active:scale-95 border-2 border-white"
          title="Nhắn Zalo gửi danh sách báo giá"
        >
          {/* Zalo icon badge */}
          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center font-black text-blue-600 text-xs shadow-xs">
            Z
          </div>
          <div className="text-left">
            <div className="text-[10px] text-blue-100 font-medium leading-none">Tư vấn Zalo 24/7</div>
            <div className="text-xs font-extrabold leading-tight">Gửi Toa Báo Giá</div>
          </div>
        </button>
      </div>

      {/* Zalo Quick Quote Modal (Optimized for Vietnamese procurement & retail habit) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white text-blue-600 flex items-center justify-center font-black text-base shadow-xs">
                  Z
                </div>
                <div>
                  <h3 className="font-bold text-sm">Gửi Danh Sách Qua Zalo</h3>
                  <p className="text-[11px] text-blue-100">Báo giá sỉ & lẻ trong 5 - 10 phút</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 overflow-y-auto text-xs">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-900 leading-relaxed">
                👋 Bạn có danh sách vật tư văn phòng cần mua (file Excel hoặc chữ viết tay)? Nhập nhanh vào đây hoặc mở Zalo để gửi ảnh trực tiếp cho nhân viên tiệm!
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Họ tên hoặc Tên Công Ty:
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ví dụ: Chị Lan (Công ty Nam Long)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Số điện thoại Zalo của bạn:
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Ví dụ: 0912 345 678"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Danh sách sản phẩm / số lượng cần mua:
                  </label>
                  <textarea
                    rows={4}
                    value={orderListText}
                    onChange={(e) => setOrderListText(e.target.value)}
                    placeholder="Ví dụ:&#10;- 10 ram Giấy A4 Double A 70gsm&#10;- 2 hộp Bút bi Thiên Long TL-027 xanh&#10;- 5 bìa còng King Jim 7cm&#10;- 2 máy bấm kim Plus số 10..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-sans"
                  />
                </div>
              </div>

              {submitted && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Đã sao chép danh sách! Đang mở cửa sổ Zalo kết nối với tiệm...</span>
                </div>
              )}

              <div className="pt-1 space-y-2">
                <button
                  type="button"
                  onClick={handleCopyAndChatZalo}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Sao Chép & Nhắn Zalo Cho Tiệm Ngay</span>
                </button>

                <a
                  href={`https://zalo.me/${cleanZalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-300 text-blue-700 hover:bg-blue-50 font-semibold text-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chỉ mở Zalo Chat (Số: {zaloNumber})</span>
                </a>
              </div>

              <div className="text-[11px] text-slate-400 text-center pt-1 border-t border-slate-100">
                📍 Cửa hàng trực tiếp: {storeAddress} (07:30 - 21:00)
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
