import {
  CategoryItem,
  Supplier,
  StockImportReceipt,
  ReturnRequest,
  CustomerRecord,
  HomeBanner,
  VoucherPromo,
  FlashSaleConfig,
  CmsArticle,
  StaffUser,
  ShippingZoneFee
} from './types';

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-tl',
    name: 'Công ty Cổ phần Tập đoàn Thiên Long',
    contactPerson: 'Nguyễn Văn Hùng (Trưởng phòng phân phối)',
    phone: '028 3750 5555',
    email: 'phanphoi@thienlong.vn',
    address: 'Lô 6-8-10-12, Đường số 3, KCN Tân Tạo, Q. Bình Tân, TP.HCM',
    taxCode: '0301464830',
    productLines: ['Bút bi', 'Bút gel', 'Bút lông bảng', 'Bút dạ quang', 'Dụng cụ học tập']
  },
  {
    id: 'sup-doublea',
    name: 'Công ty TNHH Double A (Việt Nam)',
    contactPerson: 'Trần Thị Bích Ngọc (Quản lý Đại lý)',
    phone: '028 3823 8888',
    email: 'sales.vn@doublea.com',
    address: 'Tầng 15, Tòa nhà Bitexco, Bến Nghé, Q.1, TP.HCM',
    taxCode: '0303891024',
    productLines: ['Giấy A4 70gsm', 'Giấy A4 80gsm', 'Giấy A3', 'Vở ghi chép Double A']
  },
  {
    id: 'sup-deli',
    name: 'Deli Stationery Vietnam Co., Ltd',
    contactPerson: 'Hoàng Minh Quân',
    phone: '024 3974 6688',
    email: 'order@delivietnam.com',
    address: 'Khu Công Nghiệp Yên Phong, Tỉnh Bắc Ninh & VPĐD tại Q. Tân Bình, TP.HCM',
    taxCode: '0108923412',
    productLines: ['Máy dập ghim', 'Kéo cắt giấy', 'Dao rọc giấy', 'Băng keo', 'Máy tính Casio & Deli']
  },
  {
    id: 'sup-kingjim',
    name: 'King Jim (Vietnam) Co., Ltd',
    contactPerson: 'Vũ Đình Toàn',
    phone: '0274 374 3415',
    email: 'support@kingjim.com.vn',
    address: 'KCN Mỹ Phước 3, Bến Cát, Tỉnh Bình Dương',
    taxCode: '3700778901',
    productLines: ['Bìa còng 5F - 7F', 'Bìa lá nhiều ngăn', 'Cặp hộp lưu trữ hồ sơ', 'File tài liệu']
  },
  {
    id: 'sup-plus',
    name: 'Công ty TNHH Công Nghiệp Plus Việt Nam',
    contactPerson: 'Phạm Hồng Nhung',
    phone: '0251 383 6200',
    email: 'contact@plus.co.jp',
    address: 'KCN Biên Hòa II, TP. Biên Hòa, Đồng Nai',
    taxCode: '3600267711',
    productLines: ['Băng xóa Plus kéo mini', 'Gôm tẩy bôi', 'Bấm kim trợ lực không dùng kim']
  }
];

export const INITIAL_STOCK_RECEIPTS: StockImportReceipt[] = [
  {
    id: 'PNK-2026-089',
    receiptCode: 'PNK-089',
    supplierId: 'sup-doublea',
    supplierName: 'Công ty TNHH Double A (Việt Nam)',
    createdAt: '2026-09-14 09:30',
    createdBy: 'Phạm Văn Dũng (Thủ kho)',
    targetWarehouse: 'both',
    items: [
      { productId: 'sp-01', productName: 'Giấy In Double A A4 70gsm (Ram 500 tờ)', sku: 'VPP-GIAY-001', quantity: 300, importPrice: 59000 },
      { productId: 'sp-04', productName: 'Giấy In Double A A4 80gsm (Ram 500 tờ)', sku: 'VPP-GIAY-004', quantity: 200, importPrice: 71000 }
    ],
    totalAmount: 31900000,
    status: 'completed',
    notes: 'Nhập bổ sung cho hợp đồng cấp văn phòng phẩm Quý 3'
  },
  {
    id: 'PNK-2026-090',
    receiptCode: 'PNK-090',
    supplierId: 'sup-tl',
    supplierName: 'Công ty Cổ phần Tập đoàn Thiên Long',
    createdAt: '2026-09-15 14:15',
    createdBy: 'Phạm Văn Dũng (Thủ kho)',
    targetWarehouse: 'offline',
    items: [
      { productId: 'sp-02', productName: 'Bút Bi Thiên Long TL-027 Ngòi 0.5mm (Hộp 20 cây)', sku: 'VPP-BUT-002', quantity: 150, importPrice: 62000 },
      { productId: 'sp-03', productName: 'Bút Gel Thiên Long B-01 Nét Mịn (Hộp 12 cây)', sku: 'VPP-BUT-003', quantity: 100, importPrice: 55000 }
    ],
    totalAmount: 14800000,
    status: 'completed',
    notes: 'Cung cấp cho quầy 168 Nguyễn Trãi và kho giao nhanh'
  },
  {
    id: 'PNK-2026-091',
    receiptCode: 'PNK-091',
    supplierId: 'sup-kingjim',
    supplierName: 'King Jim (Vietnam) Co., Ltd',
    createdAt: '2026-09-16 11:00',
    createdBy: 'Nguyễn Quốc Hưng (Admin)',
    targetWarehouse: 'online',
    items: [
      { productId: 'sp-07', productName: 'Bìa Còng Thiên Long / King Jim 7cm Khổ F4', sku: 'VPP-BIA-007', quantity: 120, importPrice: 48000 }
    ],
    totalAmount: 5760000,
    status: 'draft',
    notes: 'Chờ đối chiếu số lượng thực nhận tại kho tổng'
  }
];

export const INITIAL_CATEGORIES_HIERARCHY: CategoryItem[] = [
  {
    id: 'giay-in',
    name: 'Giấy In & Photo',
    parentId: null,
    order: 1,
    icon: 'FileText',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop&q=80',
    subCategories: ['Giấy A4 Double A', 'Giấy A3 Ik Plus', 'Giấy in nhiệt bill K80', 'Giấy bìa màu dạ quang', 'Giấy note vàng 3M'],
    productCount: 420
  },
  {
    id: 'but-viet',
    name: 'Bút Viết & Mực',
    parentId: null,
    order: 2,
    icon: 'PenTool',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=80',
    subCategories: ['Bút bi Thiên Long', 'Bút gel xóa được', 'Bút dạ quang nhớ dòng', 'Bút lông viết bảng', 'Mực dấu Shiny', 'Ruột bút thay thế'],
    productCount: 580
  },
  {
    id: 'bia-file',
    name: 'Bìa & File Lưu Trữ',
    parentId: null,
    order: 3,
    icon: 'FolderKanban',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80',
    subCategories: ['Bìa còng 5cm - 7cm', 'Bìa lá A4 10-100 lá', 'Bìa nút My Clear', 'Cặp tài liệu nhiều ngăn', 'Hộp lưu trữ hồ sơ'],
    productCount: 310
  },
  {
    id: 'dung-cu-van-phong',
    name: 'Dụng Cụ Văn Phòng',
    parentId: null,
    order: 4,
    icon: 'Briefcase',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&auto=format&fit=crop&q=80',
    subCategories: ['Máy dập ghim Deli', 'Kim bấm số 10 & 24/6', 'Kẹp bướm các cỡ 15-51mm', 'Kéo cắt giấy văn phòng', 'Dao rọc giấy SDI', 'Băng keo trong OPP'],
    productCount: 390
  },
  {
    id: 'thiet-bi',
    name: 'Thiết Bị & Máy Tính',
    parentId: null,
    order: 5,
    icon: 'Cpu',
    image: 'https://images.unsplash.com/photo-1585336261026-4148e6584282?w=500&auto=format&fit=crop&q=80',
    subCategories: ['Máy tính Casio FX-580VNX', 'Máy tính để bàn Casio JS-120B', 'Bảng từ trắng treo tường', 'Máy đục lỗ Deli 20-50 tờ', 'Khay đựng hồ sơ 3 tầng'],
    productCount: 160
  },
  {
    id: 'so-tay',
    name: 'Sổ Tay & Vở Học Sinh',
    parentId: null,
    order: 6,
    icon: 'BookOpen',
    image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=500&auto=format&fit=crop&q=80',
    subCategories: ['Sổ da bìa còng cao cấp', 'Sổ lò xo A4/A5', 'Vở học sinh 96-200 trang', 'Tập chép kẻ ngang', 'Sổ thu chi kế toán'],
    productCount: 140
  }
];

export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'crm-001',
    name: 'Công ty Cổ phần Công nghệ VinaTech',
    phone: '0903 892 110',
    email: 'ketoan@vinatech-group.vn',
    segment: 'b2b',
    segmentNameVi: 'Doanh nghiệp B2B (Hợp đồng)',
    totalSpent: 42850000,
    orderCount: 14,
    loyaltyPoints: 1850,
    companyName: 'Công ty Cổ phần Công nghệ VinaTech',
    taxCode: '0314892110',
    address: 'Tòa nhà Landmark 81, P.22, Q. Bình Thạnh, TP.HCM',
    notes: 'Ký hợp đồng cung cấp giấy A4 & bút viết hàng tháng, yêu cầu xuất hóa đơn điện tử trong ngày',
    lastOrderDate: '2026-09-14'
  },
  {
    id: 'crm-002',
    name: 'Trường THPT Nguyễn Thị Minh Khai',
    phone: '028 3930 4524',
    email: 'vanphong@minhkhai.edu.vn',
    segment: 'b2b',
    segmentNameVi: 'Trường học & Cơ quan',
    totalSpent: 28400000,
    orderCount: 8,
    loyaltyPoints: 1200,
    companyName: 'Trường THPT Nguyễn Thị Minh Khai',
    taxCode: '0308291044',
    address: 'Số 275 Điện Biên Phủ, Phường 7, Quận 3, TP.HCM',
    notes: 'Thanh toán chuyển khoản VietQR, nhận tại quầy hoặc giao vào đầu giờ sáng',
    lastOrderDate: '2026-09-12'
  },
  {
    id: 'crm-003',
    name: 'Chị Hoàng Mai Anh',
    phone: '0918 726 339',
    email: 'maianh.hoang@designstudio.com',
    segment: 'vip',
    segmentNameVi: 'Khách hàng VIP Cá nhân',
    totalSpent: 6250000,
    orderCount: 7,
    loyaltyPoints: 480,
    address: 'Chung cư Masteri Thảo Điền, TP. Thủ Đức',
    notes: 'Hay mua sổ tay cao cấp, bút vẽ artline và giấy note chất lượng cao',
    lastOrderDate: '2026-09-15'
  },
  {
    id: 'crm-004',
    name: 'Anh Lê Minh Trí',
    phone: '0982 114 789',
    email: 'minhtri.architect@gmail.com',
    segment: 'vip',
    segmentNameVi: 'Khách hàng Thân thiết',
    totalSpent: 3820000,
    orderCount: 5,
    loyaltyPoints: 290,
    address: '142 Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM',
    notes: 'Thường ghé quầy 168 Nguyễn Trãi lấy hàng vào giờ tan tầm',
    lastOrderDate: '2026-09-10'
  },
  {
    id: 'crm-005',
    name: 'Trần Tuấn Kiệt',
    phone: '0937 662 901',
    email: 'tuankiet.tran@outlook.com',
    segment: 'guest',
    segmentNameVi: 'Khách vãng lai',
    totalSpent: 420000,
    orderCount: 1,
    loyaltyPoints: 30,
    address: '58 Pasteur, Bến Nghé, Quận 1, TP.HCM',
    notes: 'Mua online thanh toán COD',
    lastOrderDate: '2026-09-16'
  }
];

export const INITIAL_RETURN_REQUESTS: ReturnRequest[] = [
  {
    id: 'RMA-014',
    orderId: 'DH-89214',
    customerName: 'Nguyễn Văn Nam',
    phone: '0912 345 678',
    reason: 'Đặt nhầm kích thước giấy A3 thay vì A4 cho máy in văn phòng',
    items: [
      { productId: 'sp-04', productName: 'Giấy In Double A A4 80gsm (Ram 500 tờ)', quantity: 2, refundAmount: 184000 }
    ],
    totalRefund: 184000,
    status: 'approved',
    createdAt: '2026-09-15 16:40'
  },
  {
    id: 'RMA-015',
    orderId: 'DH-89215',
    customerName: 'Công ty CP Công Nghệ VinaTech',
    phone: '0903 892 110',
    reason: 'Vận chuyển làm móp 1 góc hộp kẹp bướm và chảy mực 2 cây bút',
    items: [
      { productId: 'sp-06', productName: 'Kẹp Bướm Echo / SDI Đủ Cỡ 19mm - 51mm', quantity: 1, refundAmount: 32000 }
    ],
    totalRefund: 32000,
    status: 'refunded',
    createdAt: '2026-09-16 08:20'
  }
];

export const INITIAL_BANNERS: HomeBanner[] = [
  {
    id: 'banner-01',
    title: 'Đại Tiệc Văn Phòng Phẩm 2026',
    subtitle: 'Ưu đãi đến 30% cho doanh nghiệp, cơ quan & trường học - Giao nhanh 2h TP.HCM',
    badge: 'MÙA TỰU TRƯỜNG & QUÝ 3',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1600&auto=format&fit=crop&q=80',
    link: '/products',
    categoryTarget: 'all',
    startDate: '2026-09-01',
    endDate: '2026-10-31',
    active: true,
    order: 1
  },
  {
    id: 'banner-02',
    title: 'Giấy In Double A & Thiên Long Chính Hãng',
    subtitle: 'Giá sỉ tốt nhất từ 5 thùng - Xuất hóa đơn đỏ điện tử tức thì 8-10%',
    badge: 'KHO GIÁ SỈ TỔNG',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1600&auto=format&fit=crop&q=80',
    link: '/products?category=giay-in',
    categoryTarget: 'giay-in',
    startDate: '2026-09-05',
    endDate: '2026-12-31',
    active: true,
    order: 2
  },
  {
    id: 'banner-03',
    title: 'Quầy Trực Tiếp 168 Nguyễn Trãi, Q.1',
    subtitle: 'Mua online nhận tại quầy sau 15 phút - Miễn phí đóng gói & gửi xe',
    badge: 'TRẢI NGHIỆM TẠI QUẦY',
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1600&auto=format&fit=crop&q=80',
    link: '/pos',
    categoryTarget: 'pos',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    active: true,
    order: 3
  }
];

export const INITIAL_VOUCHERS: VoucherPromo[] = [
  {
    id: 'vouch-01',
    code: 'VPPXANH50',
    description: 'Giảm 50.000đ cho đơn hàng văn phòng phẩm từ 500.000đ',
    discountType: 'fixed',
    discountValue: 50000,
    minOrderRequirement: 500000,
    startDate: '2026-09-01',
    endDate: '2026-10-31',
    usageLimit: 500,
    usedCount: 142,
    active: true
  },
  {
    id: 'vouch-02',
    code: 'B2BVIP10',
    description: 'Giảm 10% tối đa 300.000đ cho khách hàng mua số lượng lớn hoặc doanh nghiệp',
    discountType: 'percentage',
    discountValue: 10,
    maxDiscount: 300000,
    minOrderRequirement: 1000000,
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    usageLimit: 200,
    usedCount: 48,
    active: true
  },
  {
    id: 'vouch-03',
    code: 'FREESHIP',
    description: 'Miễn phí vận chuyển toàn TP.HCM cho đơn từ 200.000đ',
    discountType: 'fixed',
    discountValue: 30000,
    minOrderRequirement: 200000,
    startDate: '2026-09-10',
    endDate: '2026-10-15',
    usageLimit: 1000,
    usedCount: 319,
    active: true
  }
];

export const INITIAL_FLASH_SALE: FlashSaleConfig = {
  id: 'flash-today',
  title: 'Giờ Vàng Văn Phòng - Deal Sốc Trưa Nay (11:30 - 14:00)',
  startTime: '11:30',
  endTime: '14:00',
  active: true,
  discountPercent: 20,
  productIds: ['sp-01', 'sp-02', 'sp-03', 'sp-06', 'sp-07']
};

export const INITIAL_CMS_ARTICLES: CmsArticle[] = [
  {
    id: 'art-01',
    slug: 'top-loai-giay-in-a4-ban-chay-nhat',
    titleVi: 'Top 5 Loại Giấy In A4 Văn Phòng Bán Chạy Nhất & Bảng Định Lượng GSM Chuẩn',
    titleEn: 'Top 5 Best-Selling A4 Office Paper Types & Standard GSM Weight Guide',
    contentVi: `Giấy in A4 là vật tư tiêu hao không thể thiếu của mọi văn phòng. Khi lựa chọn giấy in cho công ty, hai tiêu chí quan trọng nhất là định lượng (GSM) và độ trắng (CIE). Định lượng 70gsm phù hợp cho việc in ấn nháp, tài liệu lưu hành nội bộ hàng ngày. Trong khi đó, định lượng 80gsm như Double A giúp in 2 mặt không bị thấu mực, chống kẹt giấy tối đa trong máy in công nghiệp và máy photocopy tốc độ cao. Tại cửa hàng 168 Nguyễn Trãi, chúng tôi luôn sẵn sàng lưu kho hơn 500 ram mỗi ngày.`,
    contentEn: `A4 printing paper is an essential consumable for every office. When choosing paper, the two most critical metrics are paper weight (GSM) and brightness (CIE). 70gsm is optimal for internal draft printouts, while 80gsm (such as Double A) prevents ink bleed-through on double-sided printouts and minimizes printer jams in high-speed copiers. At our 168 Nguyen Trai store, we stock over 500 reams daily ready for instant pickup or 2-hour dispatch.`,
    category: 'guide',
    categoryNameVi: 'Cẩm nang chọn mua',
    published: true,
    updatedAt: '2026-09-15',
    author: 'Nguyễn Quốc Hưng'
  },
  {
    id: 'art-02',
    slug: 'thu-tuc-xuat-hoa-don-vat-dien-tu',
    titleVi: 'Quy Định & Thủ Tục Xuất Hóa Đơn Điện Tử VAT 8-10% Nhanh Chóng Cho Doanh Nghiệp',
    titleEn: 'Regulations & Streamlined e-Invoice VAT Issuance for Corporate Clients',
    contentVi: `Nhằm hỗ trợ phòng kế toán các cơ quan và doanh nghiệp quyết toán chi phí công tác thuận lợi, hệ thống của chúng tôi tự động xuất hóa đơn điện tử hợp lệ của Tổng cục Thuế ngay khi đơn hàng hoàn tất. Quý khách chỉ cần nhập Mã số thuế, tên công ty và địa chỉ tại bước thanh toán hoặc lưu sẵn trong mục Hồ Sơ Tài Khoản. File XML và bản PDF hóa đơn sẽ được gửi tự động về email đăng ký.`,
    contentEn: `To assist corporate accounting departments in bookkeeping, our platform automatically issues official General Department of Taxation-compliant electronic VAT invoices as soon as orders complete. Simply enter your Corporate Tax ID, Legal Name, and Registered Address at checkout or save it in your Account Profile. PDF and XML files are dispatched straight to your registered corporate email.`,
    category: 'policy',
    categoryNameVi: 'Chính sách & Hóa đơn',
    published: true,
    updatedAt: '2026-09-12',
    author: 'Ban Kế Toán VPP'
  },
  {
    id: 'art-03',
    slug: 'chinh-sach-doi-tra-bao-hanh-7-ngay',
    titleVi: 'Chính Sách Đổi Trả Miễn Phí Trong 7 Ngày Tại Cửa Hàng 168 Nguyễn Trãi',
    titleEn: '7-Day Free Return & Exchange Policy at 168 Nguyen Trai Physical Store',
    contentVi: `Cam kết 100% hàng chính hãng từ các thương hiệu hàng đầu: Thiên Long, Double A, King Jim, Plus, Casio. Quý khách có quyền kiểm tra hàng khi nhận (đồng kiểm COD) và đổi trả hoàn tiền 100% trong 7 ngày đối với các sản phẩm lỗi do nhà sản xuất hoặc giao sai mẫu mã, quy cách.`,
    contentEn: `We guarantee 100% authentic stationery supplies from top brands. Customers are entitled to open-box inspection upon delivery (COD) and 100% refund/replacement within 7 days for any manufacturer defects or incorrect specifications.`,
    category: 'about',
    categoryNameVi: 'Giới thiệu & Cam kết',
    published: true,
    updatedAt: '2026-09-10',
    author: 'Đội ngũ Hỗ trợ KH'
  }
];

export const INITIAL_STAFF_USERS: StaffUser[] = [
  {
    id: 'staff-01',
    name: 'Nguyễn Quốc Hưng',
    email: 'admin@vanphongxanh.vn',
    phone: '0908 123 456',
    role: 'admin',
    roleNameVi: 'Admin Quản Trị Viên (Toàn quyền)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    permissions: ['all', 'products_crud', 'inventory_manage', 'orders_ops', 'crm_view', 'cms_edit', 'settings_rbac', 'reports_view']
  },
  {
    id: 'staff-02',
    name: 'Trần Thúy Ngân',
    email: 'ngan.tran@vanphongxanh.vn',
    phone: '0938 555 789',
    role: 'cashier',
    roleNameVi: 'Thu Ngân Quầy 168 Nguyễn Trãi',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    permissions: ['pos_sell', 'orders_create', 'orders_view_receipt', 'scan_barcode']
  },
  {
    id: 'staff-03',
    name: 'Phạm Văn Dũng',
    email: 'dung.kho@vanphongxanh.vn',
    phone: '0979 334 112',
    role: 'warehouse',
    roleNameVi: 'Thủ Kho & Quản Lý Tồn',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    permissions: ['inventory_manage', 'stock_receipts_create', 'low_stock_adjust', 'shelf_location_edit']
  },
  {
    id: 'staff-04',
    name: 'Lê Thu Trang',
    email: 'trang.cskh@vanphongxanh.vn',
    phone: '0912 667 890',
    role: 'cs',
    roleNameVi: 'Chăm Sóc Khách Hàng & Hotline',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    permissions: ['orders_ops', 'orders_create_manual', 'rma_returns', 'crm_view', 'chat_zalo']
  }
];

export const INITIAL_SHIPPING_ZONES: ShippingZoneFee[] = [
  {
    id: 'zone-01',
    zoneName: 'Nội thành TP.HCM (Giao hỏa tốc 2H)',
    areas: 'Quận 1, Quận 3, Quận 5, Quận 10, Bình Thạnh, Phú Nhuận',
    fee: 20000,
    estimatedDays: 'Trong 2 giờ'
  },
  {
    id: 'zone-02',
    zoneName: 'Ngoại thành TP.HCM (Giao trong ngày)',
    areas: 'Quận 12, Gò Vấp, Tân Phú, Tân Bình, TP. Thủ Đức, Bình Tân',
    fee: 30000,
    estimatedDays: 'Trong ngày (4 - 6 giờ)'
  },
  {
    id: 'zone-03',
    zoneName: 'Huyện ngoại thành & Vùng phụ cận',
    areas: 'Hóc Môn, Bình Chánh, Nhà Bè, Củ Chi, Cần Giờ, Bình Dương, Đồng Nai',
    fee: 35000,
    estimatedDays: '1 ngày'
  },
  {
    id: 'zone-04',
    zoneName: 'Liên tỉnh toàn quốc',
    areas: 'Hà Nội, Đà Nẵng, Cần Thơ, Hải Phòng và tất cả các tỉnh thành khác',
    fee: 45000,
    estimatedDays: '2 - 3 ngày'
  }
];
