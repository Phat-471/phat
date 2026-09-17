'use client';

import React from 'react';
import Link from 'next/link';

export const SiteFooter: React.FC = () => {
  return (
    <footer className="bg-[#101b2c] text-[#d7deea] mt-6 font-sans">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-5 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0c7be9] to-[#054ea7] text-white grid place-items-center text-lg font-black shrink-0">
              ✦
            </div>
            <h3 className="text-white text-base font-bold tracking-tight">Văn Phòng Xanh</h3>
          </div>
          <p className="text-xs text-[#aeb9ca] leading-relaxed">
            Dụng cụ văn phòng · Nâng tầm hiệu suất.
          </p>
          <p className="text-xs text-[#aeb9ca] leading-relaxed">
            Hơn 2.000 sản phẩm chính hãng phục vụ học tập, làm việc và kinh doanh. Đóng gói cẩn thận, giao nhanh toàn quốc.
          </p>
        </div>

        {/* Col 2 */}
        <div className="space-y-2.5">
          <h3 className="text-white text-sm font-bold uppercase tracking-wider">Mua hàng</h3>
          <ul className="space-y-2 text-xs text-[#aeb9ca]">
            <li>
              <Link href="/products" className="hover:text-white transition">
                Tất cả sản phẩm
              </Link>
            </li>
            <li>
              <Link href="/#promo" className="hover:text-white transition">
                Chương trình khuyến mãi
              </Link>
            </li>
            <li>
              <Link href="/#brands" className="hover:text-white transition">
                Thương hiệu phân phối
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-white transition">
                Tra cứu đơn hàng
              </Link>
            </li>
            <li>
              <Link href="/pos" className="hover:text-cyan-300 text-cyan-400 font-semibold transition">
                ⚡ Màn hình quầy thu ngân (POS)
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="space-y-2.5">
          <h3 className="text-white text-sm font-bold uppercase tracking-wider">Hỗ trợ khách hàng</h3>
          <ul className="space-y-2 text-xs text-[#aeb9ca]">
            <li>
              <Link href="/#guide" className="hover:text-white transition">
                Chính sách giao hàng
              </Link>
            </li>
            <li>
              <Link href="/#guide" className="hover:text-white transition">
                Chính sách đổi trả 7 ngày
              </Link>
            </li>
            <li>
              <Link href="/#trust" className="hover:text-white transition">
                Phương thức thanh toán
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-white transition">
                Câu hỏi thường gặp (FAQ)
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-amber-300 text-amber-400 font-semibold transition">
                ⚙️ Trung tâm Quản trị Admin
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4 */}
        <div className="space-y-2.5">
          <h3 className="text-white text-sm font-bold uppercase tracking-wider">Thông tin liên hệ</h3>
          <div className="space-y-2 text-xs text-[#aeb9ca]">
            <p className="flex items-center gap-2">
              <span>☎</span>
              <a href="tel:0900000000" className="hover:text-white font-semibold">
                0900 000 000 (Hotline miễn phí)
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span>✉</span>
              <a href="mailto:hello@vanphongxanh.vn" className="hover:text-white">
                hello@vanphongxanh.vn
              </a>
            </p>
            <p className="flex items-start gap-2">
              <span>⌖</span>
              <span>168 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh</span>
            </p>
            <p className="text-[11px] text-[#7f8ba0] pt-1">
              Thời gian mở cửa: 07:30 - 21:00 hàng ngày (kể cả CN)
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-[#263247] py-4 text-center text-[#7f8ba0] text-[11px]">
        <div className="max-w-[1240px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Văn Phòng Xanh. Demo giao diện thương mại điện tử chuyên nghiệp.</span>
          <div className="flex items-center gap-3">
            <Link href="/products" className="hover:text-white transition">Sản phẩm</Link>
            <span>•</span>
            <Link href="/orders" className="hover:text-white transition">Đơn hàng</Link>
            <span>•</span>
            <Link href="/pos" className="hover:text-white transition">POS</Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-white transition">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
