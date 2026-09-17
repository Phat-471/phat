'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { formatVND, BASE_PRODUCTS } from '@/lib/stationery-data';
import {
  Store,
  Truck,
  ShieldCheck,
  RotateCcw,
  FileText,
  Clock,
  Plus,
  Minus,
  ShoppingCart,
  ChevronRight,
  MapPin,
  Sparkles,
  Barcode,
  CheckCircle2,
  AlertCircle,
  Share2
} from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { products, addToCart, minOrderValue, minOrderEnabled, showToast } = useStore();

  // Find product by id (or match by SKU)
  const product = products.find((p) => p.id === resolvedParams.id) ||
    BASE_PRODUCTS.find((p) => p.id === resolvedParams.id) ||
    BASE_PRODUCTS[0];

  const [quantity, setQuantity] = useState(1);
  const isWholesale = quantity >= 10;
  const currentUnitPrice = isWholesale ? product.wholesalePrice : product.price;
  const lineTotal = currentUnitPrice * quantity;

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <SiteHeader />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto">
          <Link href="/" className="hover:text-emerald-700 shrink-0">Trang Chủ</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href="/products" className="hover:text-emerald-700 shrink-0">Sản Phẩm</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href={`/products?category=${product.category}`} className="hover:text-emerald-700 shrink-0">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full space-y-8">
        {/* Main Product Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 lg:p-8 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Product Image & Barcode Info */}
            <div className="space-y-4">
              <div className="aspect-square bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center p-6 relative overflow-hidden group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg shadow-xs">
                    SKU: {product.sku}
                  </span>
                  {product.bestSeller && (
                    <span className="text-xs font-bold bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg shadow-xs">
                      Sản Phẩm Bán Chạy
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                        showToast('Đã sao chép liên kết sản phẩm!');
                      }
                    }}
                    className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-600 shadow-xs border border-slate-200"
                    title="Chia sẻ liên kết"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Barcode & Shelf Info Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Barcode className="w-3.5 h-3.5 text-slate-500" />
                    <span>Mã Vạch EAN-13:</span>
                  </span>
                  <p className="font-mono font-bold text-slate-800 text-xs">{product.barcode}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Store className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Vị Trí Kệ Hàng:</span>
                  </span>
                  <p className="font-bold text-emerald-700 text-xs">{product.shelfLocation}</p>
                </div>
              </div>
            </div>

            {/* Right: Details & Purchase Actions */}
            <div className="space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Brand & Category */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
                    {product.brand}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 font-medium">Đơn vị: {product.unit}</span>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {product.name}
                </h1>

                {/* Price Section */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-baseline gap-3">
                    <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                      {formatVND(currentUnitPrice)}
                    </div>
                    <span className="text-xs text-slate-500 font-medium">/{product.unit}</span>

                    {product.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        {formatVND(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Wholesale Tier Banner */}
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>
                        Giá sỉ doanh nghiệp (từ 10 {product.unit}):{' '}
                        <strong className="text-emerald-700 font-bold">{formatVND(product.wholesalePrice)}</strong>
                      </span>
                    </div>
                    {isWholesale ? (
                      <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                        Đang áp dụng giá sỉ!
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Mua từ 10 món để hưởng giá sỉ</span>
                    )}
                  </div>
                </div>

                {/* Store Stock & Availability */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-2.5">
                    <Store className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Tại quầy 168 Nguyễn Trãi:</span>
                      <span className="text-emerald-700 font-semibold">{product.stockOffline} {product.unit} có sẵn</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Lấy hàng sau 15 phút</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
                    <Truck className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Kho giao hàng online:</span>
                      <span className="text-slate-700 font-semibold">{product.stockOnline} {product.unit}</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Giao nhanh 2h TP.HCM</p>
                    </div>
                  </div>
                </div>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity Stepper & Buttons */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-700">Số lượng:</span>
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Giảm số lượng"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-14 text-center text-xs font-bold bg-transparent focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-2 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Tăng số lượng"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right flex-1">
                    <span className="text-xs text-slate-400 block">Thành tiền tạm tính:</span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-900">
                      {formatVND(lineTotal)}
                    </span>
                  </div>
                </div>

                {/* Minimum order reminder */}
                {minOrderEnabled && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>
                      Đơn hàng tối thiểu giao tận nơi: <strong>{formatVND(minOrderValue)}</strong>.{' '}
                      <Link href="/account" className="underline font-bold hover:text-amber-950">
                        Cài đặt trong Admin
                      </Link>
                    </span>
                  </div>
                )}

                {/* Primary Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="py-3 px-4 rounded-xl border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Thêm Vào Giỏ Hàng</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Mua Ngay (Thanh Toán)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Guarantees */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Specs Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Thông Số Kỹ Thuật Sản Phẩm</span>
            </h3>

            <div className="divide-y divide-slate-100 text-xs border border-slate-100 rounded-xl overflow-hidden">
              <div className="grid grid-cols-3 p-3 bg-slate-50/70 font-medium">
                <span className="text-slate-500">Mã SKU</span>
                <span className="col-span-2 text-slate-900 font-mono font-bold">{product.sku}</span>
              </div>
              <div className="grid grid-cols-3 p-3 font-medium">
                <span className="text-slate-500">Mã Vạch EAN-13</span>
                <span className="col-span-2 text-slate-900 font-mono">{product.barcode}</span>
              </div>
              <div className="grid grid-cols-3 p-3 bg-slate-50/70 font-medium">
                <span className="text-slate-500">Thương hiệu</span>
                <span className="col-span-2 text-emerald-700 font-bold">{product.brand}</span>
              </div>
              <div className="grid grid-cols-3 p-3 font-medium">
                <span className="text-slate-500">Danh mục</span>
                <span className="col-span-2 text-slate-900">{product.category}</span>
              </div>
              <div className="grid grid-cols-3 p-3 bg-slate-50/70 font-medium">
                <span className="text-slate-500">Đơn vị tính</span>
                <span className="col-span-2 text-slate-900">{product.unit}</span>
              </div>
              <div className="grid grid-cols-3 p-3 font-medium">
                <span className="text-slate-500">Vị trí kệ tại quầy</span>
                <span className="col-span-2 text-slate-900 font-semibold">{product.shelfLocation}</span>
              </div>
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 p-3 font-medium bg-slate-50/40">
                  <span className="text-slate-500">{key}</span>
                  <span className="col-span-2 text-slate-800">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Guarantees */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cam Kết Chất Lượng VPP</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Đồng kiểm khi nhận hàng</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Khách hàng được mở kiện kiểm tra quy cách, số lượng trước khi thanh toán.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Giao hỏa tốc 2 giờ</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Nội thành TP.HCM giao ngay hoặc ghé tiệm 168 Nguyễn Trãi lấy sau 15 phút.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Đổi trả miễn phí 7 ngày</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Đổi hàng tận nơi nếu sản phẩm lỗi nhà sản xuất hoặc giao sai mẫu.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Hóa đơn VAT điện tử</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Hỗ trợ xuất hóa đơn đỏ công ty, trường học đầy đủ và hợp lệ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Sản Phẩm Cùng Ngành Hàng
              </h3>
              <Link href="/products" className="text-xs font-semibold text-emerald-700 hover:underline">
                Xem tất cả →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-200 p-3 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <Link
                      href={`/products/${p.id}`}
                      className="h-28 sm:h-36 bg-slate-50 rounded-xl flex items-center justify-center p-2 mb-2 overflow-hidden block"
                    >
                      <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
                    </Link>
                    <div className="text-[10px] font-bold text-emerald-700">{p.brand}</div>
                    <Link
                      href={`/products/${p.id}`}
                      className="text-xs font-bold text-slate-900 line-clamp-2 hover:text-emerald-700"
                    >
                      {p.name}
                    </Link>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">{formatVND(p.price)}</span>
                    <button
                      onClick={() => addToCart(p, 1)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-emerald-600 text-white transition-colors"
                      title="Thêm vào giỏ"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
