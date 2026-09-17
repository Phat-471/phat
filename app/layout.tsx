import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { AppProviders } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Văn Phòng Phẩm & Cửa Hàng Trực Tiếp',
  description: 'Hệ thống bán lẻ & bán sỉ văn phòng phẩm online kết hợp cửa hàng offline, sẵn sàng quản lý hơn 2000 mã hàng với tra cứu tồn kho, đặt hàng và gợi ý nhận diện thương hiệu logo & slogan.',
  openGraph: {
    title: 'Văn Phòng Phẩm & Cửa Hàng Trực Tiếp',
    description: 'Hệ thống bán lẻ & bán sỉ văn phòng phẩm online kết hợp cửa hàng offline, sẵn sàng quản lý hơn 2000 mã hàng với tra cứu tồn kho, đặt hàng và gợi ý nhận diện thương hiệu logo & slogan.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Văn Phòng Phẩm & Cửa Hàng Trực Tiếp',
    description: 'Hệ thống bán lẻ & bán sỉ văn phòng phẩm online kết hợp cửa hàng offline, sẵn sàng quản lý hơn 2000 mã hàng với tra cứu tồn kho, đặt hàng và gợi ý nhận diện thương hiệu logo & slogan.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="vi">
      <body suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
