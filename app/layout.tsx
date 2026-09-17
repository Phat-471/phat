import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { AppProviders } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Văn Phòng Phẩm & Cửa Hàng Trực Tiếp | Văn Phòng Xanh',
  description: 'Văn Phòng Xanh - Hệ thống bán lẻ & bán sỉ văn phòng phẩm trực tuyến kết hợp cửa hàng trực tiếp, hơn 2.000 sản phẩm chính hãng từ các thương hiệu hàng đầu.',
  openGraph: {
    title: 'Văn Phòng Phẩm & Cửa Hàng Trực Tiếp | Văn Phòng Xanh',
    description: 'Văn Phòng Xanh - Hệ thống bán lẻ & bán sỉ văn phòng phẩm trực tuyến kết hợp cửa hàng trực tiếp, hơn 2.000 sản phẩm chính hãng từ các thương hiệu hàng đầu.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Văn Phòng Phẩm & Cửa Hàng Trực Tiếp | Văn Phòng Xanh',
    description: 'Văn Phòng Xanh - Hệ thống bán lẻ & bán sỉ văn phòng phẩm trực tuyến kết hợp cửa hàng trực tiếp, hơn 2.000 sản phẩm chính hãng từ các thương hiệu hàng đầu.',
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
