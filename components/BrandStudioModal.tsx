'use client';

import React, { useState } from 'react';
import { BrandIdentity } from '@/lib/types';
import { BRAND_PRESETS } from '@/lib/stationery-data';
import { LogoIcon } from './LogoIcon';
import { X, Sparkles, Check, Store, FileSpreadsheet, RefreshCw } from 'lucide-react';

interface BrandStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBrand: BrandIdentity;
  onSelectBrand: (brand: BrandIdentity) => void;
}

interface AiProposal {
  brandName: string;
  slogan: string;
  meaning: string;
  logoConcept: string;
}

export const BrandStudioModal: React.FC<BrandStudioModalProps> = ({
  isOpen,
  onClose,
  currentBrand,
  onSelectBrand,
}) => {
  const [activeBrand, setActiveBrand] = useState<BrandIdentity>(currentBrand);
  const [customName, setCustomName] = useState(currentBrand.name);
  const [customSlogan, setCustomSlogan] = useState(currentBrand.tagline);
  const [customLogoType, setCustomLogoType] = useState<BrandIdentity['logoType']>(currentBrand.logoType);
  const [customColor, setCustomColor] = useState(currentBrand.primaryColor);

  const [aiTone, setAiTone] = useState('Chuyên nghiệp, tin cậy, 2000 mã hàng, giao nhanh');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiProposals, setAiProposals] = useState<AiProposal[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: BrandIdentity) => {
    setActiveBrand(preset);
    setCustomName(preset.name);
    setCustomSlogan(preset.tagline);
    setCustomLogoType(preset.logoType);
    setCustomColor(preset.primaryColor);
  };

  const handleSaveBrand = () => {
    const updated: BrandIdentity = {
      ...activeBrand,
      name: customName.trim() || activeBrand.name,
      tagline: customSlogan.trim() || activeBrand.tagline,
      logoType: customLogoType,
      primaryColor: customColor,
    };
    onSelectBrand(updated);
    onClose();
  };

  const handleGenerateAiSlogans = async () => {
    setIsGenerating(true);
    setAiError(null);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_slogans',
          keywords: aiTone,
          tone: 'Hiện đại, uy tín, bán online và có 1 cửa hàng trực tiếp',
        }),
      });
      const data = await res.json();
      if (data.proposals && Array.isArray(data.proposals)) {
        setAiProposals(data.proposals);
      } else {
        setAiError('Không thể tạo gợi ý lúc này, vui lòng thử lại.');
      }
    } catch {
      setAiError('Có lỗi xảy ra khi kết nối trợ lý AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Thiết Kế Logo & Khẩu Hiệu (Slogan)</h2>
              <p className="text-sm text-slate-500">
                Lựa chọn phương án nhận diện cho chuỗi online & 1 cửa hàng offline (2000 mã hàng)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Presets */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
              1. Các Phương Án Nhận Diện Thương Hiệu Đã Thiết Kế Sẵn
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {BRAND_PRESETS.map((preset) => {
                const isSelected = activeBrand.id === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    className={`cursor-pointer rounded-xl p-4 border transition-all relative ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-sm ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 p-1 rounded-full bg-emerald-600 text-white">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <div className="flex items-center gap-3 mb-2.5">
                      <LogoIcon type={preset.logoType} color={preset.primaryColor} size={36} />
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight">{preset.name}</h4>
                        <span className="text-xs text-slate-500">{preset.description.slice(0, 45)}...</span>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-emerald-800 bg-emerald-100/70 p-2 rounded-lg italic">
                      &ldquo;{preset.tagline}&rdquo;
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: AI Slogan Suggestions */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Gợi Ý Slogan & Tên Mới Từ AI Gemini
                </h3>
                <p className="text-xs text-indigo-700">
                  Tự động sáng tạo thêm slogan phù hợp với văn phòng phẩm, 2000 mã hàng, bán lẻ & sỉ
                </p>
              </div>
              <button
                onClick={handleGenerateAiSlogans}
                disabled={isGenerating}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium text-xs hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Đang sáng tạo...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Tạo Gợi Ý Mới Bằng AI
                  </>
                )}
              </button>
            </div>

            {aiError && <p className="text-xs text-red-600 mb-3">{aiError}</p>}

            {aiProposals.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {aiProposals.map((prop, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-lg border border-indigo-200 text-xs hover:border-indigo-400 transition-colors cursor-pointer group"
                    onClick={() => {
                      setCustomName(prop.brandName);
                      setCustomSlogan(prop.slogan);
                    }}
                  >
                    <div className="flex items-center justify-between font-bold text-indigo-900 mb-1">
                      <span>{prop.brandName}</span>
                      <span className="text-[10px] text-indigo-600 uppercase font-semibold group-hover:underline">
                        Dùng mẫu này →
                      </span>
                    </div>
                    <p className="italic font-medium text-slate-700 mb-1">&ldquo;{prop.slogan}&rdquo;</p>
                    <p className="text-slate-500 text-[11px]">{prop.meaning}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Fine-tune & Customizer */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 mb-4">
              2. Tinh Chỉnh Logo, Tên & Slogan Trực Tiếp
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Cửa Hàng / Thương Hiệu</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="Ví dụ: Văn Phòng Xanh, OfficePro..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Khẩu Hiệu (Slogan)</label>
                <input
                  type="text"
                  value={customSlogan}
                  onChange={(e) => setCustomSlogan(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="Ví dụ: Giải pháp văn phòng toàn diện, tận tâm & tiện lợi"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Biểu Tượng Logo</label>
                <div className="flex gap-2">
                  {(['pen', 'book', 'geometric', 'box', 'building'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCustomLogoType(type)}
                      className={`p-2 rounded-lg border flex items-center justify-center transition-colors ${
                        customLogoType === type
                          ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-100'
                      }`}
                    >
                      <LogoIcon type={type} color={customColor} size={28} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Màu Sắc Chủ Đạo</label>
                <div className="flex items-center gap-3">
                  {['#059669', '#1e3a8a', '#2563eb', '#b45309', '#0f766e', '#dc2626'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCustomColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        customColor === c ? 'border-slate-900 scale-110 shadow-sm' : 'border-white'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-8 h-8 rounded border p-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Live Mockup Previews */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 mb-3">
              3. Xem Trước Hiển Thị Thực Tế
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mockup 1: Biển Hiệu Cửa Hàng Offline */}
              <div className="rounded-xl border border-slate-300 p-4 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] text-slate-300 mb-2 border-b border-slate-700 pb-1.5">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Store className="w-3.5 h-3.5 text-emerald-400" />
                    Biển Hiệu Cửa Hàng Thực Tế (Offline Shop)
                  </span>
                  <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-300">Quận 1, TP.HCM</span>
                </div>
                <div className="flex items-center gap-3 py-2">
                  <div className="p-2 rounded-xl bg-white shadow">
                    <LogoIcon type={customLogoType} color={customColor} size={40} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black tracking-tight uppercase" style={{ color: '#ffffff' }}>
                      {customName || 'Văn Phòng Phẩm'}
                    </h4>
                    <p className="text-xs text-amber-300 font-medium italic mt-0.5">
                      &ldquo;{customSlogan || 'Đồng hành cùng công việc thành công'}&rdquo;
                    </p>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Bán Lẻ & Bán Sỉ | 2000+ Mã Hàng | In Ấn - Photocopy - Khắc Dấu Lấy Liền
                    </p>
                  </div>
                </div>
              </div>

              {/* Mockup 2: Hóa Đơn VAT / Giấy Giao Hàng */}
              <div className="rounded-xl border border-slate-200 p-4 bg-amber-50/40 text-slate-800 shadow-sm relative text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 border-b border-amber-200/60 pb-1.5">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                    Hóa Đơn / Phiếu Xuất Kho Văn Phòng Phẩm
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Mẫu số: 01GTKT</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <LogoIcon type={customLogoType} color={customColor} size={32} />
                  <div>
                    <div className="font-bold text-sm text-slate-900">{customName}</div>
                    <div className="text-[10px] text-slate-600 italic">&ldquo;{customSlogan}&rdquo;</div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Địa chỉ: Số 168 Nguyễn Trãi, P. Bến Thành, Q.1, TP.HCM
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Đóng
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveBrand}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-md transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              Áp Dụng Nhận Diện Này Cho Toàn Bộ Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
