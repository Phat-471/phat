'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { B2BQuoteModal } from '@/components/B2BQuoteModal';
import { Product } from '@/lib/types';
import { formatVND } from '@/lib/stationery-data';

interface FeaturedProductItem {
  id: string;
  emoji: string;
  name: string;
  priceFormatted: string;
  price: number;
  oldPrice?: string;
  reviews: number;
  tag: string;
  meta1: string;
  meta2: string;
}

export default function HomePage() {
  const router = useRouter();
  const {
    products,
    addToCart,
    showToast,
    currentBrand
  } = useStore();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isB2BQuoteOpen, setIsB2BQuoteOpen] = useState(false);
  const [activeCompareFilter, setActiveCompareFilter] = useState<string | null>(null);

  // 10 Featured Products matching the reference
  const featuredList: FeaturedProductItem[] = [
    {
      id: 'prod-tl027',
      emoji: '🖊️',
      name: 'Bút bi Thiên Long TL-027',
      priceFormatted: '10.000đ',
      price: 10000,
      oldPrice: '12.000đ',
      reviews: 124,
      tag: 'Bán chạy',
      meta1: '0.5mm',
      meta2: 'Mực xanh · 0.7g'
    },
    {
      id: 'prod-giaya4-doublea',
      emoji: '📄',
      name: 'Giấy A4 Double A 70gsm',
      priceFormatted: '95.000đ',
      price: 95000,
      reviews: 98,
      tag: 'Chính hãng',
      meta1: '70gsm · 500 tờ',
      meta2: 'A4 · trắng sáng'
    },
    {
      id: 'prod-so-campus',
      emoji: '📒',
      name: 'Sổ lò xo Campus A5',
      priceFormatted: '25.000đ',
      price: 25000,
      reviews: 76,
      tag: 'Mới',
      meta1: 'A5 · 120 trang',
      meta2: 'Kẻ ngang'
    },
    {
      id: 'prod-file-nhua-3ngan',
      emoji: '📁',
      name: 'File nhựa 3 ngăn',
      priceFormatted: '45.000đ',
      price: 45000,
      oldPrice: '50.000đ',
      reviews: 52,
      tag: 'Bán chạy',
      meta1: 'A4 · PP',
      meta2: '3 ngăn · trong'
    },
    {
      id: 'prod-muc-canon',
      emoji: '🖨️',
      name: 'Mực in Canon GI-790',
      priceFormatted: '180.000đ',
      price: 180000,
      reviews: 41,
      tag: 'Chính hãng',
      meta1: 'Đen · 135ml',
      meta2: 'Canon Pixma'
    },
    {
      id: 'prod-casio-580',
      emoji: '🧮',
      name: 'Máy tính Casio fx-580VN X',
      priceFormatted: '320.000đ',
      price: 320000,
      oldPrice: '350.000đ',
      reviews: 36,
      tag: 'Chính hãng',
      meta1: '552 chức năng',
      meta2: 'Bảo hành 2 năm'
    },
    {
      id: 'prod-keo-18cm',
      emoji: '✂️',
      name: 'Kéo văn phòng 18cm',
      priceFormatted: '35.000đ',
      price: 35000,
      reviews: 67,
      tag: 'Bán chạy',
      meta1: 'Thép không gỉ',
      meta2: 'Tay cầm nhựa'
    },
    {
      id: 'prod-bangkeo-48',
      emoji: '📌',
      name: 'Băng keo trong 48mm',
      priceFormatted: '22.000đ',
      price: 22000,
      reviews: 31,
      tag: 'Giá tốt',
      meta1: '48mm × 100Y',
      meta2: 'Đóng gói'
    },
    {
      id: 'prod-daquang-tl',
      emoji: '🖍️',
      name: 'Bút dạ quang Thiên Long',
      priceFormatted: '8.000đ',
      price: 8000,
      oldPrice: '10.000đ',
      reviews: 115,
      tag: 'Giá tốt',
      meta1: 'Đầu 4mm',
      meta2: 'Màu vàng'
    },
    {
      id: 'prod-giaynote-3x3',
      emoji: '🗒️',
      name: 'Giấy note 3x3 màu',
      priceFormatted: '15.000đ',
      price: 15000,
      reviews: 83,
      tag: 'Bán chạy',
      meta1: '76 × 76mm',
      meta2: '100 tờ'
    }
  ];

  // Helper to resolve or mock a store product
  const getResolvedProduct = (item: FeaturedProductItem): Product => {
    const existing = products.find(
      (p) =>
        p.id === item.id ||
        p.name.toLowerCase().includes(item.name.toLowerCase().split(' ')[0])
    );
    if (existing) return existing;

    return {
      id: item.id,
      name: item.name,
      sku: `SKU-${item.id.replace('prod-', '').toUpperCase()}`,
      barcode: `89360099${item.id.length.toString().padStart(4, '0')}`,
      category: 'Dụng Cụ Văn Phòng',
      brand: 'Văn Phòng Xanh',
      unit: 'cái',
      price: item.price,
      wholesalePrice: Math.round(item.price * 0.85),
      stockOffline: 120,
      stockOnline: 350,
      shelfLocation: 'Kệ A1 - Tầng 1',
      image: `https://picsum.photos/seed/${item.id}/400/400`,
      description: `${item.name}. ${item.meta1}, ${item.meta2}. Sản phẩm chính hãng, bảo hành rõ ràng, giao nhanh toàn quốc.`,
      specifications: { 'Quy cách': item.meta1, 'Đặc tính': item.meta2 },
      bestSeller: true
    };
  };

  const handleAddToCart = (item: FeaturedProductItem) => {
    const p = getResolvedProduct(item);
    addToCart(p, 1);
    showToast(`Đã thêm "${item.name}" vào giỏ hàng`);
  };

  const handleOpenDetail = (item: FeaturedProductItem) => {
    const p = getResolvedProduct(item);
    setSelectedProduct(p);
  };

  return (
    <div className="min-h-screen bg-white text-[#162235] flex flex-col font-sans">
      <SiteHeader onOpenB2BQuote={() => setIsB2BQuoteOpen(true)} />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <div className="py-4 sm:py-[18px] bg-[#f6f8fb]">
          <div className="max-w-[1240px] mx-auto px-3 sm:px-5">
            <div className="grid grid-cols-1 lg:grid-cols-[245px_1fr_235px] gap-3.5">
              {/* Category Sidebar */}
              <aside className="hidden lg:block bg-white border border-[#e7edf5] rounded-[12px] overflow-hidden shadow-2xs">
                <div className="p-[15px_17px] font-extrabold text-[14px] text-[#162235] border-b border-[#e7edf5] bg-[#fafcff]">
                  Danh mục sản phẩm
                </div>
                <div className="divide-y divide-[#e7edf5]/60">
                  <Link href="/products?cat=Bút+Viết" className="flex items-center justify-between px-[17px] py-[10px] text-[13px] text-[#162235] hover:bg-[#f1f7ff] hover:text-[#0969d7] transition">
                    <span>🖊️ Bút viết</span>
                    <b className="font-bold text-slate-400">›</b>
                  </Link>
                  <Link href="/products?cat=Giấy+In" className="flex items-center justify-between px-[17px] py-[10px] text-[13px] text-[#162235] hover:bg-[#f1f7ff] hover:text-[#0969d7] transition">
                    <span>📄 Giấy · Sổ · Vở</span>
                    <b className="font-bold text-slate-400">›</b>
                  </Link>
                  <Link href="/products?cat=Học+Sinh" className="flex items-center justify-between px-[17px] py-[10px] text-[13px] text-[#162235] hover:bg-[#f1f7ff] hover:text-[#0969d7] transition">
                    <span>✏️ Dụng cụ học sinh</span>
                    <b className="font-bold text-slate-400">›</b>
                  </Link>
                  <Link href="/products?cat=Văn+Phòng" className="flex items-center justify-between px-[17px] py-[10px] text-[13px] text-[#162235] hover:bg-[#f1f7ff] hover:text-[#0969d7] transition">
                    <span>📎 Dụng cụ văn phòng</span>
                    <b className="font-bold text-slate-400">›</b>
                  </Link>
                  <Link href="/products?cat=Bàn+Làm+Việc" className="flex items-center justify-between px-[17px] py-[10px] text-[13px] text-[#162235] hover:bg-[#f1f7ff] hover:text-[#0969d7] transition">
                    <span>🗄️ Đồ dùng bàn làm việc</span>
                    <b className="font-bold text-slate-400">›</b>
                  </Link>
                  <Link href="/products?cat=Thiết+Bị" className="flex items-center justify-between px-[17px] py-[10px] text-[13px] text-[#162235] hover:bg-[#f1f7ff] hover:text-[#0969d7] transition">
                    <span>🖨️ Thiết bị văn phòng</span>
                    <b className="font-bold text-slate-400">›</b>
                  </Link>
                  <Link href="/products?cat=Mực+In" className="flex items-center justify-between px-[17px] py-[10px] text-[13px] text-[#162235] hover:bg-[#f1f7ff] hover:text-[#0969d7] transition">
                    <span>🖋️ Mực · Toner</span>
                    <b className="font-bold text-slate-400">›</b>
                  </Link>
                  <Link href="/products?cat=Quà+Tặng" className="flex items-center justify-between px-[17px] py-[10px] text-[13px] text-[#162235] hover:bg-[#f1f7ff] hover:text-[#0969d7] transition">
                    <span>🎁 Quà tặng</span>
                    <b className="font-bold text-slate-400">›</b>
                  </Link>
                  <Link href="/products?cat=Đặc+Biệt" className="flex items-center justify-between px-[17px] py-[10px] text-[13px] text-[#162235] hover:bg-[#f1f7ff] hover:text-[#0969d7] transition">
                    <span>✨ Hàng đặc biệt</span>
                    <b className="font-bold text-slate-400">›</b>
                  </Link>
                  <Link href="/products" className="flex items-center justify-between px-[17px] py-[11px] text-[13px] text-[#0969d7] font-bold hover:bg-[#f1f7ff] transition bg-[#fafcff]">
                    <span>Xem tất cả danh mục</span>
                    <b>›</b>
                  </Link>
                </div>
              </aside>

              {/* Main Hero Banner */}
              <div className="relative min-h-[300px] sm:min-h-[310px] rounded-[12px] border border-[#e7edf5] overflow-hidden p-7 sm:p-[39px_42px] text-white flex flex-col justify-center bg-gradient-to-r from-[#0758b8] via-[#1685ee] to-[#dcefff]">
                {/* Decorative background stationery icons */}
                <div className="absolute right-4 sm:right-6 bottom-6 sm:bottom-8 text-[44px] sm:text-[58px] tracking-[10px] opacity-85 select-none pointer-events-none transform -rotate-6">
                  ✎ 📒 ✂ 📐
                </div>

                <div className="relative z-10 max-w-[520px]">
                  <h1 className="text-[28px] sm:text-[36px] lg:text-[38px] font-black leading-[1.15] mb-3.5 tracking-tight text-white drop-shadow-xs">
                    Đầy đủ văn phòng phẩm.<br />
                    Gọn gàng cho mọi công việc.
                  </h1>
                  <p className="text-[13px] sm:text-[15px] max-w-[510px] leading-[1.6] opacity-95 text-blue-50 font-normal">
                    Hơn 2.000 sản phẩm từ những thương hiệu quen thuộc — từ chiếc bút nhỏ đến thiết bị văn phòng.
                  </p>
                  <div className="mt-3.5 flex flex-wrap items-center gap-3">
                    <a
                      href="#products"
                      className="inline-flex items-center gap-1.5 px-5 py-3 bg-[#ffb300] hover:bg-[#ffa000] text-[#142033] rounded-[8px] font-extrabold text-sm transition shadow-sm active:scale-98"
                    >
                      Mua sắm ngay →
                    </a>
                    <button
                      onClick={() => setIsB2BQuoteOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-[8px] font-bold text-xs sm:text-sm backdrop-blur-xs transition"
                    >
                      🏢 Báo giá Doanh nghiệp
                    </button>
                  </div>
                </div>

                {/* Dots */}
                <div className="absolute bottom-3.5 left-7 sm:left-[42px] flex items-center gap-1.5">
                  <span className="w-[22px] h-[7px] bg-white rounded-[8px] opacity-100"></span>
                  <span className="w-[7px] h-[7px] bg-white rounded-full opacity-55"></span>
                  <span className="w-[7px] h-[7px] bg-white rounded-full opacity-55"></span>
                </div>
              </div>

              {/* Right Side Cards */}
              <aside className="flex flex-col gap-3.5">
                <div className="bg-white border border-[#e7edf5] rounded-[12px] p-[18px] shadow-2xs">
                  <strong className="block text-[14px] font-bold text-[#162235] mb-2">
                    🚚 Giao hàng nhanh
                  </strong>
                  <p className="text-[12px] text-[#6b778c] m-0 leading-[1.5]">
                    Đóng gói cẩn thận · Theo dõi đơn hàng theo thời gian thực.
                  </p>
                </div>

                <div className="bg-white border border-[#e7edf5] rounded-[12px] p-[18px] shadow-2xs">
                  <strong className="block text-[14px] font-bold text-[#162235] mb-2">
                    🛡️ Sản phẩm chính hãng
                  </strong>
                  <p className="text-[12px] text-[#6b778c] m-0 leading-[1.5]">
                    Thông tin rõ ràng, hỗ trợ đổi trả trong vòng 7 ngày.
                  </p>
                </div>

                <div className="rounded-[12px] border border-[#e7edf5] p-[18px] shadow-2xs bg-gradient-to-br from-[#fff0d2] to-white min-h-[145px] flex flex-col justify-between">
                  <div>
                    <strong className="block text-[14px] font-bold text-[#162235] mb-1">
                      Ưu đãi trong tuần
                    </strong>
                    <p className="text-[12px] text-[#6b778c] m-0 leading-[1.5]">
                      <b className="text-[#e53935] text-[23px] font-extrabold block leading-tight">
                        Giảm đến 20%
                      </b>
                      Cho nhóm dụng cụ học sinh &amp; văn phòng.
                    </p>
                  </div>
                  <Link
                    href="/products?discount=true"
                    className="text-[12px] text-[#0969d7] font-bold hover:underline self-start mt-2"
                  >
                    Xem chi tiết →
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* 2. TRUST BAR */}
        <div className="bg-white border-b border-[#e7edf5]">
          <div className="max-w-[1240px] mx-auto px-3 sm:px-5">
            <div className="grid grid-cols-2 md:grid-cols-4 py-4 divide-y sm:divide-y-0 sm:divide-x divide-[#e7edf5]">
              <div className="flex items-center gap-3 px-3 sm:px-[18px] py-1">
                <span className="text-[24px]">🚚</span>
                <div>
                  <b className="text-[13px] font-bold text-[#162235] block">Giao hàng toàn quốc</b>
                  <small className="text-[#6b778c] text-[11px] block">Nhanh chóng · An toàn</small>
                </div>
              </div>
              <div className="flex items-center gap-3 px-3 sm:px-[18px] py-1">
                <span className="text-[24px] text-[#159447] font-bold">✓</span>
                <div>
                  <b className="text-[13px] font-bold text-[#162235] block">Hàng chính hãng</b>
                  <small className="text-[#6b778c] text-[11px] block">Kiểm tra trước khi nhận</small>
                </div>
              </div>
              <div className="flex items-center gap-3 px-3 sm:px-[18px] py-1">
                <span className="text-[24px]">💳</span>
                <div>
                  <b className="text-[13px] font-bold text-[#162235] block">Thanh toán linh hoạt</b>
                  <small className="text-[#6b778c] text-[11px] block">COD · Chuyển khoản · QR</small>
                </div>
              </div>
              <div className="flex items-center gap-3 px-3 sm:px-[18px] py-1">
                <span className="text-[24px]">☎</span>
                <div>
                  <b className="text-[13px] font-bold text-[#162235] block">Hỗ trợ tận tâm</b>
                  <small className="text-[#6b778c] text-[11px] block">Tư vấn nhanh chóng</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. MUA SẮM THEO NHU CẦU */}
        <section className="py-7 bg-white">
          <div className="max-w-[1240px] mx-auto px-3 sm:px-5">
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[#162235] m-0">
                Mua sắm theo nhu cầu
              </h2>
              <Link href="/products" className="text-[13px] text-[#0969d7] font-bold hover:underline">
                Xem tất cả →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <Link href="/products?cat=Bút" className="border border-[#e7edf5] rounded-[10px] p-4 text-center bg-white hover:border-[#0969d7] hover:shadow-xs transition group">
                <div className="text-[32px] group-hover:scale-110 transition">🖊️</div>
                <b className="block text-[13px] font-bold text-[#162235] mt-2">Bút viết</b>
                <small className="text-[#6b778c] text-[11px]">Từ 2.000đ</small>
              </Link>
              <Link href="/products?cat=Giấy" className="border border-[#e7edf5] rounded-[10px] p-4 text-center bg-white hover:border-[#0969d7] hover:shadow-xs transition group">
                <div className="text-[32px] group-hover:scale-110 transition">📄</div>
                <b className="block text-[13px] font-bold text-[#162235] mt-2">Giấy · Sổ · Vở</b>
                <small className="text-[#6b778c] text-[11px]">Đa dạng kích thước</small>
              </Link>
              <Link href="/products?cat=Học+Sinh" className="border border-[#e7edf5] rounded-[10px] p-4 text-center bg-white hover:border-[#0969d7] hover:shadow-xs transition group">
                <div className="text-[32px] group-hover:scale-110 transition">✏️</div>
                <b className="block text-[13px] font-bold text-[#162235] mt-2">Dụng cụ học sinh</b>
                <small className="text-[#6b778c] text-[11px]">Đủ đồ dùng</small>
              </Link>
              <Link href="/products?cat=Văn+Phòng" className="border border-[#e7edf5] rounded-[10px] p-4 text-center bg-white hover:border-[#0969d7] hover:shadow-xs transition group">
                <div className="text-[32px] group-hover:scale-110 transition">📎</div>
                <b className="block text-[13px] font-bold text-[#162235] mt-2">Văn phòng</b>
                <small className="text-[#6b778c] text-[11px]">Tiện lợi mỗi ngày</small>
              </Link>
              <Link href="/products?cat=Thiết+Bị" className="border border-[#e7edf5] rounded-[10px] p-4 text-center bg-white hover:border-[#0969d7] hover:shadow-xs transition group">
                <div className="text-[32px] group-hover:scale-110 transition">🖨️</div>
                <b className="block text-[13px] font-bold text-[#162235] mt-2">Thiết bị</b>
                <small className="text-[#6b778c] text-[11px]">Máy & phụ kiện</small>
              </Link>
              <Link href="/products?cat=Quà+Tặng" className="border border-[#e7edf5] rounded-[10px] p-4 text-center bg-white hover:border-[#0969d7] hover:shadow-xs transition group">
                <div className="text-[32px] group-hover:scale-110 transition">🎁</div>
                <b className="block text-[13px] font-bold text-[#162235] mt-2">Quà tặng</b>
                <small className="text-[#6b778c] text-[11px]">Gợi ý dễ chọn</small>
              </Link>
            </div>
          </div>
        </section>

        {/* 4. SẢN PHẨM NỔI BẬT (Featured 10 Products) */}
        <section id="products" className="py-7 bg-[#f6f8fb]">
          <div className="max-w-[1240px] mx-auto px-3 sm:px-5">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="text-[20px] sm:text-[22px] font-bold text-[#162235] m-0">
                  Sản phẩm nổi bật
                </h2>
                <p className="text-[12px] text-[#6b778c] mt-0.5">
                  Văn phòng phẩm bán chạy và được tin dùng nhất
                </p>
              </div>
              <Link href="/products" className="text-[13px] text-[#0969d7] font-bold hover:underline">
                Xem tất cả sản phẩm →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {featuredList.map((item, idx) => (
                <article
                  key={item.id}
                  className="border border-[#e7edf5] rounded-[11px] overflow-hidden bg-white relative transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between group"
                >
                  {/* Tag */}
                  <span className="absolute top-[9px] left-[9px] bg-[#eaf4ff] text-[#0969d7] text-[10px] font-extrabold px-[7px] py-[4px] rounded-[5px] z-10">
                    {item.tag}
                  </span>

                  {/* Product Image Box */}
                  <div
                    onClick={() => handleOpenDetail(item)}
                    className="h-[155px] sm:h-[175px] bg-[#f5f7fa] grid place-items-center text-[64px] sm:text-[72px] cursor-pointer select-none group-hover:bg-[#f0f4f9] transition"
                  >
                    {item.emoji}
                  </div>

                  {/* Body */}
                  <div className="p-3 flex flex-col flex-1 justify-between">
                    <div>
                      <div
                        onClick={() => handleOpenDetail(item)}
                        className="text-[13px] font-semibold text-[#162235] leading-[1.4] h-[37px] line-clamp-2 cursor-pointer hover:text-[#0969d7] transition"
                      >
                        {item.name}
                      </div>
                      <div className="text-[11px] text-[#6b778c] mt-1 truncate">
                        {item.meta1} · {item.meta2}
                      </div>
                      <div className="text-[#e53935] text-[16px] font-extrabold mt-2 flex items-baseline">
                        <span>{item.priceFormatted}</span>
                        {item.oldPrice && (
                          <span className="line-through text-[#9aa4b2] text-[11px] ml-1.5 font-normal">
                            {item.oldPrice}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#f5a400] mt-1 flex items-center gap-1">
                        <span>★★★★★</span>
                        <span className="text-[#9aa4b2]">({item.reviews})</span>
                      </div>
                      <div className="text-[11px] text-[#159447] mt-1 font-medium">
                        ✓ Còn hàng · Giao nhanh
                      </div>
                    </div>

                    {/* Buy row */}
                    <div className="flex gap-2 mt-3 pt-1">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 border border-[#cfe0f5] bg-white text-[#0969d7] hover:bg-[#f1f7ff] rounded-[7px] py-1.5 text-[11px] font-bold cursor-pointer transition active:scale-95"
                      >
                        + Giỏ hàng
                      </button>
                      <button
                        onClick={() => handleOpenDetail(item)}
                        className="flex-1 bg-[#0969d7] hover:bg-[#0758b8] text-white rounded-[7px] py-1.5 text-[11px] font-bold cursor-pointer transition active:scale-95"
                      >
                        Xem
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 5. DUAL BANNERS (Combo & Back to school) */}
        <section id="promo" className="py-7 bg-white">
          <div className="max-w-[1240px] mx-auto px-3 sm:px-5">
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-3.5">
              <div className="rounded-[12px] min-h-[145px] p-6 sm:p-[25px_30px] overflow-hidden relative bg-gradient-to-r from-[#e8f4ff] to-white border border-[#e7edf5] flex flex-col justify-center">
                <h3 className="text-[20px] sm:text-[24px] font-bold text-[#162235] m-0 mb-2">
                  Combo văn phòng tiết kiệm
                </h3>
                <p className="m-0 text-[#536074] text-[13px] max-w-md">
                  Chọn sẵn những sản phẩm cần thiết cho bàn làm việc, tối ưu chi phí công ty.
                </p>
                <div className="mt-3">
                  <Link
                    href="/products?cat=Combo"
                    className="inline-flex items-center text-xs font-bold text-[#0969d7] hover:underline"
                  >
                    Xem bộ sản phẩm combo →
                  </Link>
                </div>
                <span className="absolute right-4 sm:right-6 bottom-1 text-[60px] sm:text-[76px] opacity-85 select-none pointer-events-none">
                  📎📒
                </span>
              </div>

              <div className="rounded-[12px] min-h-[145px] p-6 sm:p-[25px_30px] overflow-hidden relative bg-gradient-to-r from-[#fff2db] to-white border border-[#e7edf5] flex flex-col justify-center">
                <h3 className="text-[20px] sm:text-[24px] font-bold text-[#162235] m-0 mb-2">
                  Back to school
                </h3>
                <p className="m-0 text-[#536074] text-[13px] max-w-xs">
                  Ưu đãi dụng cụ học sinh theo bộ cho năm học mới.
                </p>
                <div className="mt-3">
                  <Link
                    href="/products?cat=Học+Sinh"
                    className="inline-flex items-center text-xs font-bold text-amber-800 hover:underline"
                  >
                    Khám phá đồ dùng học sinh →
                  </Link>
                </div>
                <span className="absolute right-4 sm:right-6 bottom-1 text-[60px] sm:text-[76px] opacity-85 select-none pointer-events-none">
                  🎒✏️
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CHỌN ĐÚNG SẢN PHẨM CHO NHU CẦU (4 Info Cards) */}
        <section className="py-7 bg-white">
          <div className="max-w-[1240px] mx-auto px-3 sm:px-5">
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[#162235] m-0">
                Chọn đúng sản phẩm cho nhu cầu
              </h2>
              <a href="#guide" className="text-[13px] text-[#0969d7] font-bold hover:underline">
                Xem hướng dẫn →
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="border border-[#e7edf5] rounded-[11px] bg-white p-[17px] hover:border-[#0969d7] transition shadow-2xs">
                <div className="text-[28px]">🏫</div>
                <h3 className="text-[14px] font-bold text-[#162235] my-2">Học sinh · Sinh viên</h3>
                <p className="text-[12px] text-[#6b778c] leading-[1.55] m-0">
                  Bút, vở, giấy note, dụng cụ học tập. Có combo theo lớp và ngân sách phù hợp.
                </p>
              </div>

              <div className="border border-[#e7edf5] rounded-[11px] bg-white p-[17px] hover:border-[#0969d7] transition shadow-2xs">
                <div className="text-[28px]">💼</div>
                <h3 className="text-[14px] font-bold text-[#162235] my-2">Văn phòng</h3>
                <p className="text-[12px] text-[#6b778c] leading-[1.55] m-0">
                  Giấy in, file hồ sơ, bút, ghim, băng keo và đồ dùng bàn làm việc đầy đủ.
                </p>
              </div>

              <div className="border border-[#e7edf5] rounded-[11px] bg-white p-[17px] hover:border-[#0969d7] transition shadow-2xs">
                <div className="text-[28px]">🖨️</div>
                <h3 className="text-[14px] font-bold text-[#162235] my-2">In ấn</h3>
                <p className="text-[12px] text-[#6b778c] leading-[1.55] m-0">
                  Lọc theo loại máy, mã mực, dung tích và loại giấy để tránh mua nhầm.
                </p>
              </div>

              <div className="border border-[#e7edf5] rounded-[11px] bg-white p-[17px] hover:border-[#0969d7] transition shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="text-[28px]">🏢</div>
                  <h3 className="text-[14px] font-bold text-[#162235] my-2">Mua cho doanh nghiệp</h3>
                  <p className="text-[12px] text-[#6b778c] leading-[1.55] m-0">
                    Đặt số lượng lớn, xuất hóa đơn VAT và hỗ trợ tư vấn danh sách văn phòng phẩm.
                  </p>
                </div>
                <button
                  onClick={() => setIsB2BQuoteOpen(true)}
                  className="mt-3 text-[12px] text-[#0969d7] font-bold hover:underline text-left cursor-pointer"
                >
                  Yêu cầu báo giá B2B →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 7. VĂN PHÒNG PHẨM BÁN CHẠY (5 Mini Products) */}
        <section className="py-7 bg-[#f6f8fb]">
          <div className="max-w-[1240px] mx-auto px-3 sm:px-5">
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[#162235] m-0">
                Văn phòng phẩm bán chạy
              </h2>
              <Link href="/products" className="text-[13px] text-[#0969d7] font-bold hover:underline">
                Xem thêm →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              <div
                onClick={() => handleAddToCart(featuredList[0])}
                className="border border-[#e7edf5] rounded-[10px] bg-white p-3 hover:border-[#0969d7] cursor-pointer transition shadow-2xs group"
              >
                <div className="h-[100px] bg-[#f6f8fb] rounded-[8px] grid place-items-center text-[48px] group-hover:scale-105 transition">
                  🖊️
                </div>
                <b className="block text-[12px] font-bold text-[#162235] mt-2 truncate">Bút bi TL-027</b>
                <small className="block text-[#6b778c] text-[11px] mt-1">0.5mm · mực xanh/đỏ/đen</small>
                <strong className="block text-[#e53935] text-[13px] font-extrabold mt-1.5">10.000đ</strong>
              </div>

              <div
                onClick={() => handleAddToCart(featuredList[1])}
                className="border border-[#e7edf5] rounded-[10px] bg-white p-3 hover:border-[#0969d7] cursor-pointer transition shadow-2xs group"
              >
                <div className="h-[100px] bg-[#f6f8fb] rounded-[8px] grid place-items-center text-[48px] group-hover:scale-105 transition">
                  📄
                </div>
                <b className="block text-[12px] font-bold text-[#162235] mt-2 truncate">Giấy A4 Double A</b>
                <small className="block text-[#6b778c] text-[11px] mt-1">70gsm · 500 tờ/ream</small>
                <strong className="block text-[#e53935] text-[13px] font-extrabold mt-1.5">95.000đ</strong>
              </div>

              <div
                onClick={() => handleAddToCart(featuredList[6])}
                className="border border-[#e7edf5] rounded-[10px] bg-white p-3 hover:border-[#0969d7] cursor-pointer transition shadow-2xs group"
              >
                <div className="h-[100px] bg-[#f6f8fb] rounded-[8px] grid place-items-center text-[48px] group-hover:scale-105 transition">
                  📎
                </div>
                <b className="block text-[12px] font-bold text-[#162235] mt-2 truncate">Ghim bấm Deli</b>
                <small className="block text-[#6b778c] text-[11px] mt-1">26/6 · hộp 1.000 kim</small>
                <strong className="block text-[#e53935] text-[13px] font-extrabold mt-1.5">12.000đ</strong>
              </div>

              <div
                onClick={() => handleAddToCart(featuredList[2])}
                className="border border-[#e7edf5] rounded-[10px] bg-white p-3 hover:border-[#0969d7] cursor-pointer transition shadow-2xs group"
              >
                <div className="h-[100px] bg-[#f6f8fb] rounded-[8px] grid place-items-center text-[48px] group-hover:scale-105 transition">
                  📒
                </div>
                <b className="block text-[12px] font-bold text-[#162235] mt-2 truncate">Sổ Campus A5</b>
                <small className="block text-[#6b778c] text-[11px] mt-1">120 trang · kẻ ngang</small>
                <strong className="block text-[#e53935] text-[13px] font-extrabold mt-1.5">25.000đ</strong>
              </div>

              <div
                onClick={() => handleAddToCart(featuredList[3])}
                className="border border-[#e7edf5] rounded-[10px] bg-white p-3 hover:border-[#0969d7] cursor-pointer transition shadow-2xs group"
              >
                <div className="h-[100px] bg-[#f6f8fb] rounded-[8px] grid place-items-center text-[48px] group-hover:scale-105 transition">
                  📁
                </div>
                <b className="block text-[12px] font-bold text-[#162235] mt-2 truncate">Bìa nút A4</b>
                <small className="block text-[#6b778c] text-[11px] mt-1">PP trong · nhiều màu</small>
                <strong className="block text-[#e53935] text-[13px] font-extrabold mt-1.5">6.000đ</strong>
              </div>
            </div>
          </div>
        </section>

        {/* 8. SO SÁNH NHANH TRƯỚC KHI MUA (Chips) */}
        <section className="py-7 bg-white">
          <div className="max-w-[1240px] mx-auto px-3 sm:px-5">
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[#162235] m-0">
                So sánh nhanh trước khi mua
              </h2>
              <a href="#guide" className="text-[13px] text-[#0969d7] font-bold hover:underline">
                Xem tất cả bảng so sánh →
              </a>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { label: '📄 Giấy A4', highlight: '70gsm', desc: '· 500 tờ' },
                { label: '📄 Giấy A4', highlight: '80gsm', desc: '· 500 tờ' },
                { label: '🖊️ Bút', highlight: '0.5mm', desc: '· nét nhỏ' },
                { label: '🖊️ Bút', highlight: '0.7mm', desc: '· nét vừa' },
                { label: '📒 Sổ', highlight: 'A5', desc: '· 120 trang' }
              ].map((chip, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveCompareFilter(chip.highlight);
                    showToast(`Đang lọc so sánh: ${chip.highlight}`);
                  }}
                  className={`flex-none border rounded-[9px] px-3.5 py-2 text-[12px] transition cursor-pointer ${
                    activeCompareFilter === chip.highlight
                      ? 'border-[#0969d7] bg-[#f1f7ff] text-[#0969d7] font-bold'
                      : 'border-[#e7edf5] bg-white text-[#162235] hover:border-[#0969d7]'
                  }`}
                >
                  {chip.label} <b className="text-[#0969d7]">{chip.highlight}</b> {chip.desc}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 9. HƯỚNG DẪN CHỌN SẢN PHẨM (2 Guide Cards) */}
        <section id="guide" className="py-7 bg-[#f6f8fb]">
          <div className="max-w-[1240px] mx-auto px-3 sm:px-5">
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[#162235] m-0">
                Hướng dẫn chọn sản phẩm
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Guide Card 1: Giấy in A4 */}
              <div className="border border-[#e7edf5] rounded-[12px] p-5 sm:p-[22px] bg-white shadow-2xs">
                <h3 className="m-0 mb-3 text-[17px] font-bold text-[#162235]">
                  📄 Chọn giấy in A4 như thế nào?
                </h3>
                <ul className="pl-[18px] m-0 space-y-1.5 text-[13px] leading-[1.75] text-[#526075]">
                  <li>
                    <b className="text-[#162235]">70gsm:</b> phù hợp in tài liệu, văn bản hằng ngày.
                  </li>
                  <li>
                    <b className="text-[#162235]">80gsm:</b> dày hơn, phù hợp tài liệu cần cảm giác chắc tay, hợp đồng.
                  </li>
                  <li>
                    <b className="text-[#162235]">In 2 mặt:</b> nên ưu tiên giấy có độ đục và định lượng phù hợp để không bị thấu mực.
                  </li>
                  <li>
                    <b className="text-[#162235]">Máy in:</b> kiểm tra loại máy laser/inkjet trước khi mua giấy đặc thù.
                  </li>
                </ul>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-1">
                  <div className="bg-[#f7faff] rounded-[8px] p-2.5 text-[12px] text-[#162235] font-medium border border-blue-100/50">
                    ✓ 500 tờ/ream
                  </div>
                  <div className="bg-[#f7faff] rounded-[8px] p-2.5 text-[12px] text-[#162235] font-medium border border-blue-100/50">
                    ✓ Khổ A4 210×297mm
                  </div>
                  <div className="bg-[#f7faff] rounded-[8px] p-2.5 text-[12px] text-[#162235] font-medium border border-blue-100/50">
                    ✓ Chọn theo định lượng
                  </div>
                  <div className="bg-[#f7faff] rounded-[8px] p-2.5 text-[12px] text-[#162235] font-medium border border-blue-100/50">
                    ✓ Có sản phẩm theo thùng
                  </div>
                </div>
              </div>

              {/* Guide Card 2: Bút theo nhu cầu */}
              <div className="border border-[#e7edf5] rounded-[12px] p-5 sm:p-[22px] bg-white shadow-2xs">
                <h3 className="m-0 mb-3 text-[17px] font-bold text-[#162235]">
                  🖊️ Chọn bút theo nhu cầu
                </h3>
                <ul className="pl-[18px] m-0 space-y-1.5 text-[13px] leading-[1.75] text-[#526075]">
                  <li>
                    <b className="text-[#162235]">0.5mm:</b> nét nhỏ, thanh mảnh, phù hợp ghi chép chi tiết, sổ tay nhỏ.
                  </li>
                  <li>
                    <b className="text-[#162235]">0.7mm:</b> nét vừa, viết êm tay, phù hợp viết hàng ngày và ký văn bản.
                  </li>
                  <li>
                    <b className="text-[#162235]">Bút gel:</b> nét mực mượt, màu đậm, viết chữ đẹp.
                  </li>
                  <li>
                    <b className="text-[#162235]">Bút bi:</b> khô nhanh, không lem mực, phù hợp công việc văn phòng tốc độ cao.
                  </li>
                </ul>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-1">
                  <div className="bg-[#f7faff] rounded-[8px] p-2.5 text-[12px] text-[#162235] font-medium border border-blue-100/50">
                    ✓ Lọc theo ngòi bút
                  </div>
                  <div className="bg-[#f7faff] rounded-[8px] p-2.5 text-[12px] text-[#162235] font-medium border border-blue-100/50">
                    ✓ Lọc theo màu mực
                  </div>
                  <div className="bg-[#f7faff] rounded-[8px] p-2.5 text-[12px] text-[#162235] font-medium border border-blue-100/50">
                    ✓ Xem ruột thay thế
                  </div>
                  <div className="bg-[#f7faff] rounded-[8px] p-2.5 text-[12px] text-[#162235] font-medium border border-blue-100/50">
                    ✓ Mua theo hộp tiết kiệm
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. THÔNG TIN GIÚP BẠN MUA ĐÚNG (Spec Table) */}
        <section className="py-7 bg-white">
          <div className="max-w-[1240px] mx-auto px-3 sm:px-5">
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[#162235] m-0">
                Thông tin giúp bạn mua đúng
              </h2>
            </div>
            <div className="border border-[#e7edf5] rounded-[11px] overflow-hidden">
              <table className="w-full border-collapse text-[12px] sm:text-[13px]">
                <tbody className="divide-y divide-[#e7edf5]">
                  <tr className="hover:bg-[#fafcff] transition">
                    <td className="p-3 sm:p-3.5 w-[35%] text-[#6b778c] font-medium">Đơn vị bán</td>
                    <td className="p-3 sm:p-3.5 font-semibold text-[#162235]">
                      Cây · Hộp · Xấp · Ream · Thùng tùy sản phẩm
                    </td>
                  </tr>
                  <tr className="hover:bg-[#fafcff] transition">
                    <td className="p-3 sm:p-3.5 w-[35%] text-[#6b778c] font-medium">Mã sản phẩm</td>
                    <td className="p-3 sm:p-3.5 font-semibold text-[#162235]">
                      Mỗi sản phẩm có SKU; sản phẩm có barcode sẽ hiển thị mã vạch quét máy POS
                    </td>
                  </tr>
                  <tr className="hover:bg-[#fafcff] transition">
                    <td className="p-3 sm:p-3.5 w-[35%] text-[#6b778c] font-medium">Tình trạng kho</td>
                    <td className="p-3 sm:p-3.5 font-semibold text-[#162235]">
                      Hiển thị còn hàng, sắp hết hoặc hết hàng theo tồn kho thực tế tại quầy và kho online
                    </td>
                  </tr>
                  <tr className="hover:bg-[#fafcff] transition">
                    <td className="p-3 sm:p-3.5 w-[35%] text-[#6b778c] font-medium">Thông số</td>
                    <td className="p-3 sm:p-3.5 font-semibold text-[#162235]">
                      Kích thước, định lượng, số trang, màu, dung tích, quy cách đóng gói...
                    </td>
                  </tr>
                  <tr className="hover:bg-[#fafcff] transition">
                    <td className="p-3 sm:p-3.5 w-[35%] text-[#6b778c] font-medium">Đối tượng sử dụng</td>
                    <td className="p-3 sm:p-3.5 font-semibold text-[#162235]">
                      Học sinh · Sinh viên · Văn phòng · Doanh nghiệp · Gia đình
                    </td>
                  </tr>
                  <tr className="hover:bg-[#fafcff] transition">
                    <td className="p-3 sm:p-3.5 w-[35%] text-[#6b778c] font-medium">Sản phẩm liên quan</td>
                    <td className="p-3 sm:p-3.5 font-semibold text-[#162235]">
                      Ruột thay thế, phụ kiện, sản phẩm tương thích và sản phẩm mua cùng
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 11. CÂU HỎI THƯỜNG GẶP (FAQ) */}
        <section id="faq" className="py-7 bg-[#f6f8fb]">
          <div className="max-w-[1240px] mx-auto px-3 sm:px-5">
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[#162235] m-0">
                Câu hỏi thường gặp
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <details className="border border-[#e7edf5] rounded-[9px] p-3.5 bg-white shadow-2xs group cursor-pointer">
                <summary className="text-[13px] font-bold text-[#162235] select-none list-none flex items-center justify-between">
                  <span>Giá trên website có phải giá bán thực tế không?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-[12px] text-[#6b778c] leading-[1.55] mt-2 mb-0 pt-1 border-t border-slate-100">
                  Website luôn hiển thị giá bán thực tế đã bao gồm VAT và giá khuyến mãi nếu có. Với đơn mua số lượng lớn hoặc doanh nghiệp hợp đồng, quý khách sẽ được hưởng thêm chiết khấu sỉ hấp dẫn.
                </p>
              </details>

              <details className="border border-[#e7edf5] rounded-[9px] p-3.5 bg-white shadow-2xs group cursor-pointer">
                <summary className="text-[13px] font-bold text-[#162235] select-none list-none flex items-center justify-between">
                  <span>Làm sao biết sản phẩm còn hàng?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-[12px] text-[#6b778c] leading-[1.55] mt-2 mb-0 pt-1 border-t border-slate-100">
                  Mỗi sản phẩm đều hiển thị trạng thái tồn kho thực tế. Hệ thống đồng bộ giữa quầy 168 Nguyễn Trãi và kho online, đảm bảo quý khách đặt là có hàng ngay.
                </p>
              </details>

              <details className="border border-[#e7edf5] rounded-[9px] p-3.5 bg-white shadow-2xs group cursor-pointer">
                <summary className="text-[13px] font-bold text-[#162235] select-none list-none flex items-center justify-between">
                  <span>Mua số lượng lớn có được tư vấn và xuất hóa đơn không?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-[12px] text-[#6b778c] leading-[1.55] mt-2 mb-0 pt-1 border-t border-slate-100">
                  Có! Bạn có thể nhấn vào nút &ldquo;Báo giá Doanh nghiệp&rdquo; trên website để gửi danh sách cần mua. Chúng tôi xuất hóa đơn điện tử VAT đầy đủ và giao hàng tận nơi.
                </p>
              </details>

              <details className="border border-[#e7edf5] rounded-[9px] p-3.5 bg-white shadow-2xs group cursor-pointer">
                <summary className="text-[13px] font-bold text-[#162235] select-none list-none flex items-center justify-between">
                  <span>Có thể mua theo hộp hoặc theo thùng không?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-[12px] text-[#6b778c] leading-[1.55] mt-2 mb-0 pt-1 border-t border-slate-100">
                  Có. Mỗi trang sản phẩm đều ghi rõ quy cách đóng gói (hộp 20 cây, ream 500 tờ, thùng 5 ream...). Mua theo hộp/thùng luôn có giá ưu đãi hơn mua lẻ.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* 12. THƯƠNG HIỆU PHỔ BIẾN */}
        <section id="brands" className="py-7 bg-white">
          <div className="max-w-[1240px] mx-auto px-3 sm:px-5">
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[#162235] m-0">
                Thương hiệu phổ biến
              </h2>
              <Link href="/products" className="text-[13px] text-[#0969d7] font-bold hover:underline">
                Tất cả thương hiệu →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { name: 'THIÊN LONG', cat: 'Thiên Long' },
                { name: 'DOUBLE A', cat: 'Double A' },
                { name: 'CAMPUS', cat: 'Kokuyo Campus' },
                { name: 'CASIO', cat: 'Casio' },
                { name: 'DELI', cat: 'Deli' },
                { name: 'PENTEL', cat: 'Pentel' }
              ].map((brand) => (
                <Link
                  key={brand.name}
                  href={`/products?brand=${encodeURIComponent(brand.cat)}`}
                  className="border border-[#e7edf5] rounded-[9px] h-[62px] grid place-items-center font-black text-[#697487] hover:text-[#0969d7] hover:border-[#0969d7] bg-white transition shadow-2xs hover:shadow-xs tracking-wider text-sm"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 13. GÓC VĂN PHÒNG (News & Articles) */}
        <section id="news" className="py-7 bg-[#f6f8fb]">
          <div className="max-w-[1240px] mx-auto px-3 sm:px-5">
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[#162235] m-0">
                Góc văn phòng
              </h2>
              <Link href="/#news" className="text-[13px] text-[#0969d7] font-bold hover:underline">
                Xem tin tức →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <article className="border border-[#e7edf5] rounded-[11px] overflow-hidden bg-white shadow-2xs hover:shadow-md transition group">
                <div className="h-[120px] bg-gradient-to-br from-[#dfeeff] to-[#f8fbff] grid place-items-center text-[46px] group-hover:scale-105 transition">
                  🗂️
                </div>
                <div className="p-3.5">
                  <h3 className="text-[14px] font-bold text-[#162235] m-0 mb-1.5 group-hover:text-[#0969d7] transition">
                    7 món đồ giúp bàn làm việc gọn gàng hơn
                  </h3>
                  <p className="text-[12px] text-[#6b778c] leading-[1.5] m-0 line-clamp-2">
                    Gợi ý những vật dụng nhỏ như khay tài liệu, hộp bút, kẹp dây cáp nhưng tạo khác biệt lớn cho không gian làm việc.
                  </p>
                </div>
              </article>

              <article className="border border-[#e7edf5] rounded-[11px] overflow-hidden bg-white shadow-2xs hover:shadow-md transition group">
                <div className="h-[120px] bg-gradient-to-br from-[#dfeeff] to-[#f8fbff] grid place-items-center text-[46px] group-hover:scale-105 transition">
                  📚
                </div>
                <div className="p-3.5">
                  <h3 className="text-[14px] font-bold text-[#162235] m-0 mb-1.5 group-hover:text-[#0969d7] transition">
                    Cách chọn giấy in phù hợp cho văn phòng
                  </h3>
                  <p className="text-[12px] text-[#6b778c] leading-[1.5] m-0 line-clamp-2">
                    Phân biệt định lượng 70gsm, 80gsm, độ trắng và loại giấy chuyên dụng cho từng nhu cầu in ấn tài liệu.
                  </p>
                </div>
              </article>

              <article className="border border-[#e7edf5] rounded-[11px] overflow-hidden bg-white shadow-2xs hover:shadow-md transition group">
                <div className="h-[120px] bg-gradient-to-br from-[#dfeeff] to-[#f8fbff] grid place-items-center text-[46px] group-hover:scale-105 transition">
                  ✏️
                </div>
                <div className="p-3.5">
                  <h3 className="text-[14px] font-bold text-[#162235] m-0 mb-1.5 group-hover:text-[#0969d7] transition">
                    Checklist văn phòng phẩm cho nhân viên mới
                  </h3>
                  <p className="text-[12px] text-[#6b778c] leading-[1.5] m-0 line-clamp-2">
                    Danh sách cơ bản gồm sổ tay, bút ký, giấy note, kẹp bướm để người mới bắt đầu ngày làm việc đầu tiên hiệu quả.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>

      {/* 14. FOOTER */}
      <SiteFooter />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product, qty) => {
            addToCart(product, qty);
            showToast(`Đã thêm ${qty} "${product.name}" vào giỏ hàng`);
            setSelectedProduct(null);
          }}
          onOpenStoreInfo={() => {
            showToast('Cửa hàng: 168 Nguyễn Trãi, Q.1 - Mở cửa 07:30 - 21:00');
          }}
        />
      )}

      {/* B2B Quote Modal */}
      <B2BQuoteModal
        isOpen={isB2BQuoteOpen}
        onClose={() => setIsB2BQuoteOpen(false)}
        brand={currentBrand}
        products={products}
      />
    </div>
  );
}
