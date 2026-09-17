import { BrandIdentity, OfflineStoreInfo, Product } from './types';

export const BRAND_PRESETS: BrandIdentity[] = [
  {
    id: 'vanphongxanh',
    name: 'Văn Phòng Xanh',
    tagline: 'Giải pháp văn phòng toàn diện, tận tâm & tiện lợi',
    logoType: 'pen',
    primaryColor: '#059669', // Emerald
    accentColor: '#10b981',
    description: 'Phong cách thân thiện, hiện đại, tối ưu chi phí cho văn phòng và trường học.',
    suggestedSlogans: [
      'Giải pháp văn phòng toàn diện, tận tâm & tiện lợi',
      'Đầy đủ 2000+ mã hàng - Mua online nhanh, nhận tại cửa hàng 15 phút',
      'Đồng hành cùng thành công công sở và tri thức học đường',
      'Văn phòng tiện nghi, công việc hanh thông'
    ]
  },
  {
    id: 'tinhhoa',
    name: 'Văn Phòng Phẩm Tinh Hoa',
    tagline: 'Nâng tầm không gian làm việc - Tiếp bước thành công',
    logoType: 'book',
    primaryColor: '#1e3a8a', // Deep Navy
    accentColor: '#f59e0b', // Amber
    description: 'Phong cách chuyên nghiệp, uy tín cao cấp, chuyên cung cấp trọn gói cho doanh nghiệp B2B & cơ quan.',
    suggestedSlogans: [
      'Nâng tầm không gian làm việc - Tiếp bước thành công',
      'Uy tín tạo niềm tin - 2000+ sản phẩm chính hãng',
      'Chất lượng chuẩn mực - Phục vụ tận tâm',
      'Điểm tựa văn phòng phẩm chuyên nghiệp của mọi doanh nghiệp'
    ]
  },
  {
    id: 'officepro',
    name: 'OfficePro 365',
    tagline: 'Kho sỉ & lẻ văn phòng phẩm - Giá tốt mỗi ngày',
    logoType: 'geometric',
    primaryColor: '#2563eb', // Blue
    accentColor: '#06b6d4', // Cyan
    description: 'Phong cách công nghệ năng động, tốc độ giao hàng vượt trội cho cả khách lẻ và công ty.',
    suggestedSlogans: [
      'Kho sỉ & lẻ văn phòng phẩm - Giá tốt mỗi ngày',
      'Click online giao ngay, ghé cửa hàng lấy liền',
      'Mua sắm thông minh cho văn phòng hiện đại',
      'Trực tiếp tại quầy, sẵn sàng trên mạng'
    ]
  },
  {
    id: 'butvang',
    name: 'Bút Vàng & Tri Thức',
    tagline: 'Khơi nguồn cảm hứng - Đồng hành cùng tri thức',
    logoType: 'pen',
    primaryColor: '#b45309', // Amber Warm
    accentColor: '#f97316', // Orange
    description: 'Gần gũi với học sinh, sinh viên, giáo viên và khối văn phòng sáng tạo.',
    suggestedSlogans: [
      'Khơi nguồn cảm hứng - Đồng hành cùng tri thức',
      'Từng nét bút viết nên tương lai',
      'Cửa hàng thân thuộc - Đầy đủ mọi dụng cụ bạn cần'
    ]
  },
  {
    id: 'anphat',
    name: 'Văn Phòng Phẩm An Phát',
    tagline: 'Hàng chính hãng tận tâm - Phục vụ chu đáo từ 1 món đến 2000 mã',
    logoType: 'box',
    primaryColor: '#0f766e', // Teal
    accentColor: '#14b8a6',
    description: 'Truyền thống, tận tụy, cam kết xuất hóa đơn VAT đầy đủ cho mọi đơn hàng doanh nghiệp.',
    suggestedSlogans: [
      'Hàng chính hãng tận tâm - Phục vụ chu đáo từ 1 món đến 2000 mã',
      'An tâm chất lượng - Phát triển bền lâu',
      'Tiết kiệm ngân sách văn phòng tối đa mỗi tháng'
    ]
  }
];

export const DEFAULT_STORE_INFO: OfflineStoreInfo = {
  name: 'Cửa Hàng Văn Phòng Phẩm Số 1',
  address: 'Số 168 Đường Nguyễn Trãi, Phường Bến Thành',
  wardDistrictCity: 'Quận 1, TP. Hồ Chí Minh',
  hotline: '0908 123 456 - 028 3822 9999',
  zalo: '0908123456',
  email: 'lienhe@vanphongpham-store.vn',
  openingHours: '07:30 - 21:00 (Mở cửa tất cả các ngày trong tuần)',
  shelfGuide: 'Khu A: Giấy in & File hồ sơ | Khu B: Bút & Dụng cụ cắt gọt | Khu C: Sổ vở & Bàn làm việc | Khu D: Thiết bị & Máy tính',
  googleMapsUrl: 'https://maps.google.com',
  inStoreServices: [
    'In ấn & Photocopy nhanh A4, A3, in màu laser',
    'Đóng gáy lò xo, dập ghim gáy sách lấy ngay',
    'Khắc dấu tên, dấu chức danh, dấu tròn công ty trong 30 phút',
    'Nhận đơn hàng online - Soạn sẵn túi nhận tại quầy sau 15 phút',
    'Xuất hóa đơn điện tử VAT trực tiếp tại quầy thu ngân'
  ]
};

export const CATEGORIES = [
  { id: 'all', name: 'Tất Cả Danh Mục', icon: 'LayoutGrid', count: 2000 },
  { id: 'giay-in', name: 'Giấy In & Photo', icon: 'FileText', count: 280 },
  { id: 'but-viet', name: 'Bút & Viết Các Loại', icon: 'PenTool', count: 420 },
  { id: 'bia-file', name: 'Bìa Hồ Sơ & Lưu Trữ', icon: 'FolderArchive', count: 310 },
  { id: 'so-vo', name: 'Sổ Tay & Vở Học Sinh', icon: 'BookOpen', count: 260 },
  { id: 'dung-cu', name: 'Dụng Cụ Ghim, Kẹp & Cắt', icon: 'Scissors', count: 340 },
  { id: 'bang-keo', name: 'Băng Keo & Đóng Gói', icon: 'Package', count: 180 },
  { id: 'thiet-bi', name: 'Máy Tính & Thiết Bị VP', icon: 'Calculator', count: 120 },
  { id: 've-sinh', name: 'Nhu Yếu Phẩm & Vệ Sinh', icon: 'Sparkles', count: 90 },
];

export const BRANDS = [
  'Tất cả',
  'Thiên Long',
  'Double A',
  'Deli',
  'Plus Nhật Bản',
  'King Jim',
  'Casio',
  'PaperOne',
  'Hồng Hà',
  'Bến Nghé',
  'IK Plus',
  'Pentel',
  'Uni-ball',
  'Kokuyo'
];

export const BASE_PRODUCTS: Product[] = [
  // GIẤY IN
  {
    id: 'gi-001',
    sku: 'GIAY-DA-A4-70',
    barcode: '8850124001015',
    name: 'Giấy in Double A A4 định lượng 70gsm (Ram 500 tờ)',
    category: 'giay-in',
    subCategory: 'Giấy A4',
    brand: 'Double A',
    unit: 'Ram (500 tờ)',
    price: 78000,
    wholesalePrice: 72000,
    originalPrice: 85000,
    stockOnline: 1250,
    stockOffline: 85,
    shelfLocation: 'Kệ A1 - Tầng 1 (Khu Giấy in)',
    description: 'Giấy in cao cấp nhập khẩu Thái Lan, độ trắng sáng 148 CIE, không kẹt giấy, phù hợp in 2 mặt cho máy photocopy và máy in laser tốc độ cao.',
    specifications: {
      'Khổ giấy': 'A4 (210 x 297 mm)',
      'Định lượng': '70 gsm',
      'Đóng gói': '500 tờ/ram, 5 ram/thùng',
      'Xuất xứ': 'Thái Lan',
      'Độ trắng': '148 CIE'
    },
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop&q=80',
    featured: true,
    bestSeller: true
  },
  {
    id: 'gi-002',
    sku: 'GIAY-DA-A4-80',
    barcode: '8850124001022',
    name: 'Giấy in Double A A4 định lượng 80gsm (Ram 500 tờ)',
    category: 'giay-in',
    subCategory: 'Giấy A4',
    brand: 'Double A',
    unit: 'Ram (500 tờ)',
    price: 88000,
    wholesalePrice: 82000,
    originalPrice: 95000,
    stockOnline: 940,
    stockOffline: 60,
    shelfLocation: 'Kệ A1 - Tầng 1',
    description: 'Định lượng 80gsm dày dặn, sang trọng, thích hợp in hợp đồng quan trọng, hồ sơ thầu, báo cáo tài chính.',
    specifications: {
      'Khổ giấy': 'A4 (210 x 297 mm)',
      'Định lượng': '80 gsm',
      'Đóng gói': '500 tờ/ram, 5 ram/thùng',
      'Xuất xứ': 'Thái Lan'
    },
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&auto=format&fit=crop&q=80',
    bestSeller: true
  },
  {
    id: 'gi-003',
    sku: 'GIAY-IK-A4-70',
    barcode: '8992759110034',
    name: 'Giấy in IK Plus A4 định lượng 70gsm Indonesia',
    category: 'giay-in',
    subCategory: 'Giấy A4',
    brand: 'IK Plus',
    unit: 'Ram (500 tờ)',
    price: 74000,
    wholesalePrice: 68000,
    originalPrice: 80000,
    stockOnline: 1800,
    stockOffline: 110,
    shelfLocation: 'Kệ A2 - Tầng 1',
    description: 'Giấy in trắng đẹp, giá thành tiết kiệm, được hơn 80% văn phòng doanh nghiệp tin dùng cho in tài liệu hàng ngày.',
    specifications: {
      'Khổ giấy': 'A4 (210 x 297 mm)',
      'Định lượng': '70 gsm',
      'Xuất xứ': 'Indonesia'
    },
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
    featured: true
  },
  {
    id: 'gi-004',
    sku: 'GIAY-DA-A3-70',
    barcode: '8850124003019',
    name: 'Giấy in Double A A3 định lượng 70gsm',
    category: 'giay-in',
    subCategory: 'Giấy A3',
    brand: 'Double A',
    unit: 'Ram (500 tờ)',
    price: 158000,
    wholesalePrice: 148000,
    stockOnline: 420,
    stockOffline: 35,
    shelfLocation: 'Kệ A3 - Tầng 1',
    description: 'Khổ lớn chuyên dụng in bản vẽ kỹ thuật, sơ đồ dự án, biểu đồ kiến trúc sắc nét.',
    specifications: {
      'Khổ giấy': 'A3 (297 x 420 mm)',
      'Định lượng': '70 gsm',
      'Xuất xứ': 'Thái Lan'
    },
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'gi-005',
    sku: 'GIAY-BILL-K80',
    barcode: '8936012440051',
    name: 'Giấy in nhiệt bill hóa đơn K80 x 45mm (Thùng 50 cuộn)',
    category: 'giay-in',
    subCategory: 'Giấy nhiệt POS',
    brand: 'Deli',
    unit: 'Thùng (50 cuộn)',
    price: 320000,
    wholesalePrice: 295000,
    stockOnline: 210,
    stockOffline: 18,
    shelfLocation: 'Kệ A4 - Tầng 1',
    description: 'Giấy in bill cho máy POS bán lẻ, siêu thị, nhà hàng. Chữ in đậm rõ, giấy bọc bạc bảo quản chống ẩm.',
    specifications: {
      'Khổ giấy': '80mm',
      'Đường kính cuộn': '45mm',
      'Đóng gói': '50 cuộn bọc bạc/thùng'
    },
    image: 'https://images.unsplash.com/photo-1554415707-9e4426dca254?w=500&auto=format&fit=crop&q=80'
  },

  // BÚT & VIẾT
  {
    id: 'bt-001',
    sku: 'BUT-TL-027-XANH',
    barcode: '8935001800271',
    name: 'Bút bi Thiên Long TL-027 ngòi 0.5mm - Mực Xanh (Hộp 20 cây)',
    category: 'but-viet',
    subCategory: 'Bút bi',
    brand: 'Thiên Long',
    unit: 'Hộp (20 cây)',
    price: 70000,
    wholesalePrice: 62000,
    originalPrice: 80000,
    stockOnline: 3500,
    stockOffline: 240,
    shelfLocation: 'Kệ B1 - Hộc 02',
    description: 'Dòng bút bi quốc dân tại Việt Nam. Nét mảnh 0.5mm mượt mà, mực ra đều, thân bút thon gọn dễ cầm nắm.',
    specifications: {
      'Kích thước ngòi': '0.5 mm',
      'Màu mực': 'Xanh dương',
      'Quy cách': '20 cây/hộp, 60 hộp/thùng',
      'Xuất xứ': 'Thiên Long - Việt Nam'
    },
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=80',
    featured: true,
    bestSeller: true
  },
  {
    id: 'bt-002',
    sku: 'BUT-TL-079-DEN',
    barcode: '8935001800790',
    name: 'Bút bi Thiên Long TL-079 ngòi 0.5mm - Mực Đen (Hộp 20 cây)',
    category: 'but-viet',
    subCategory: 'Bút bi',
    brand: 'Thiên Long',
    unit: 'Hộp (20 cây)',
    price: 75000,
    wholesalePrice: 66000,
    stockOnline: 2200,
    stockOffline: 160,
    shelfLocation: 'Kệ B1 - Hộc 04',
    description: 'Mẫu bút thiết kế sang trọng, có đệm êm tay cao su chống mỏi khi viết văn bản dài.',
    specifications: {
      'Kích thước ngòi': '0.5 mm',
      'Màu mực': 'Đen',
      'Quy cách': '20 cây/hộp'
    },
    image: 'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'bt-003',
    sku: 'BUT-GEL-DELI-S01',
    barcode: '6921734910015',
    name: 'Bút Gel Deli ngòi 0.5mm mực khô nhanh (Hộp 12 cây)',
    category: 'but-viet',
    subCategory: 'Bút gel nước',
    brand: 'Deli',
    unit: 'Hộp (12 cây)',
    price: 68000,
    wholesalePrice: 58000,
    stockOnline: 1400,
    stockOffline: 90,
    shelfLocation: 'Kệ B2 - Hộc 01',
    description: 'Mực gel chất lượng Nhật Bản, viết êm trơn, mực khô tức thì không lo lem khi ký tên hay ghi chú.',
    specifications: {
      'Ngòi': '0.5mm',
      'Đặc tính': 'Mực gel chống nước, khô sau 0.5 giây'
    },
    image: 'https://images.unsplash.com/photo-1585336261026-4148e6584282?w=500&auto=format&fit=crop&q=80',
    bestSeller: true
  },
  {
    id: 'bt-004',
    sku: 'BUT-DA-QUANG-DELI',
    barcode: '6921734920045',
    name: 'Bộ bút dạ quang highlight Deli 6 màu Pastel',
    category: 'but-viet',
    subCategory: 'Bút dạ quang',
    brand: 'Deli',
    unit: 'Vỉ (6 cây)',
    price: 45000,
    wholesalePrice: 38000,
    originalPrice: 55000,
    stockOnline: 860,
    stockOffline: 55,
    shelfLocation: 'Kệ B2 - Hộc 05',
    description: 'Tone màu Pastel dịu mắt, không lóa mỏi mắt, ngòi vát 2 đường kẻ tiện dụng cho tài liệu và sách giáo trình.',
    specifications: {
      'Số lượng': '6 cây/vỉ (Vàng, Hồng, Xanh lá, Xanh ngọc, Tím, Cam pastel)',
      'Đầu ngòi': '1 - 5mm vát 2 nét'
    },
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500&auto=format&fit=crop&q=80',
    featured: true
  },
  {
    id: 'bt-005',
    sku: 'BUT-LONG-BANG-TL',
    barcode: '8935001820057',
    name: 'Bút lông bảng trắng Thiên Long WB-03 (Hộp 10 cây)',
    category: 'but-viet',
    subCategory: 'Bút viết bảng',
    brand: 'Thiên Long',
    unit: 'Hộp (10 cây)',
    price: 78000,
    wholesalePrice: 70000,
    stockOnline: 1100,
    stockOffline: 75,
    shelfLocation: 'Kệ B3 - Hộc 02',
    description: 'Mực tươi sáng, lau sạch dễ dàng trên bảng từ, không để lại bóng mực, không mùi độc hại.',
    specifications: {
      'Ngòi bút': 'Tròn 1.5 - 2.5 mm',
      'Màu': 'Xanh dương / Đỏ / Đen',
      'Đóng gói': '10 cây/hộp'
    },
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'bt-006',
    sku: 'BUT-KY-PENTEL-ENERGEL',
    barcode: '884851000671',
    name: 'Bút ký cao cấp Pentel Energel Metal BL407 0.7mm',
    category: 'but-viet',
    subCategory: 'Bút ký quà tặng',
    brand: 'Pentel',
    unit: 'Cây (Kèm hộp quà)',
    price: 215000,
    wholesalePrice: 190000,
    originalPrice: 250000,
    stockOnline: 320,
    stockOffline: 24,
    shelfLocation: 'Tủ Kính VIP - Quầy thu ngân',
    description: 'Thân kim loại sang trọng, nét ký mượt mà, khô ngay lập tức, là món quà ý nghĩa cho sếp, đối tác và khách hàng.',
    specifications: {
      'Chất liệu': 'Hợp kim nhôm phủ sơn tĩnh điện',
      'Ngòi': '0.7mm công nghệ EnerGel Nhật',
      'Thay ruột': 'Có bán ruột thay thế LR7'
    },
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=80',
    featured: true
  },

  // BÌA HỒ SƠ & LƯU TRỮ
  {
    id: 'ba-001',
    sku: 'BIA-CONG-KJ-7CM',
    barcode: '8936012480019',
    name: 'Bìa còng bật King Jim A4 gáy 7cm (Lưu 500 tờ)',
    category: 'bia-file',
    subCategory: 'Bìa còng',
    brand: 'King Jim',
    unit: 'Cái',
    price: 65000,
    wholesalePrice: 57000,
    originalPrice: 72000,
    stockOnline: 1500,
    stockOffline: 120,
    shelfLocation: 'Kệ C1 - Tầng 2 (Khu Bìa file)',
    description: 'Thương hiệu King Jim chuẩn Nhật. Còng kim loại trợ lực chống gỉ sét, bìa bọc PP cao cấp chống trầy xước và ẩm ướt.',
    specifications: {
      'Khổ': 'A4',
      'Độ dày gáy': '7 cm (chứa 500 - 600 tờ giấy A4)',
      'Chất liệu': 'Bìa cứng bọc nhựa PP 2 mặt',
      'Xuất xứ': 'King Jim Việt Nam'
    },
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80',
    featured: true,
    bestSeller: true
  },
  {
    id: 'ba-002',
    sku: 'BIA-CONG-KJ-5CM',
    barcode: '8936012480026',
    name: 'Bìa còng bật King Jim A4 gáy 5cm (Lưu 350 tờ)',
    category: 'bia-file',
    subCategory: 'Bìa còng',
    brand: 'King Jim',
    unit: 'Cái',
    price: 60000,
    wholesalePrice: 53000,
    stockOnline: 1200,
    stockOffline: 95,
    shelfLocation: 'Kệ C1 - Tầng 2',
    description: 'Bìa còng 5cm gọn nhẹ phù hợp sắp xếp hồ sơ các phòng ban, kế toán, nhân sự.',
    specifications: {
      'Khổ': 'A4',
      'Gáy': '5 cm',
      'Màu sắc': 'Xanh dương truyền thống'
    },
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'ba-003',
    sku: 'BIA-LA-PLUS-A4',
    barcode: '8935002010037',
    name: 'Bìa lá Plus A4 trong suốt 0.15mm (Xấp 10 cái)',
    category: 'bia-file',
    subCategory: 'Bìa lá',
    brand: 'Plus Nhật Bản',
    unit: 'Xấp (10 cái)',
    price: 32000,
    wholesalePrice: 27000,
    stockOnline: 2400,
    stockOffline: 180,
    shelfLocation: 'Kệ C2 - Tầng 1',
    description: 'Nhựa PP dẻo dai nguyên sinh, đường hàn nhiệt chắc chắn, bảo vệ tài liệu không bị nhăn rách.',
    specifications: {
      'Khổ': 'A4',
      'Độ dày': '0.15 mm',
      'Quy cách': '10 cái/xấp, 100 cái/lốc'
    },
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop&q=80',
    bestSeller: true
  },
  {
    id: 'ba-004',
    sku: 'BIA-NUT-MYCLEAR-F4',
    barcode: '8936012480040',
    name: 'Bìa nút My Clear F4 nút bấm dẻo (Xấp 12 cái)',
    category: 'bia-file',
    subCategory: 'Bìa nút',
    brand: 'Bến Nghé',
    unit: 'Xấp (12 cái)',
    price: 48000,
    wholesalePrice: 40000,
    stockOnline: 1900,
    stockOffline: 140,
    shelfLocation: 'Kệ C2 - Tầng 2',
    description: 'Nút bấm bền chắc, kích thước F4 rộng hơn A4, để vừa tài liệu giấy tờ số lượng lớn khi mang đi họp.',
    specifications: {
      'Khổ': 'F4 (260 x 360 mm)',
      'Quy cách': '12 cái/xấp'
    },
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'ba-005',
    sku: 'BIA-TRINH-KY-DON',
    barcode: '8936012480057',
    name: 'Bìa trình ký đơn A4 Simili da cao cấp',
    category: 'bia-file',
    subCategory: 'Bìa trình ký',
    brand: 'Deli',
    unit: 'Cái',
    price: 38000,
    wholesalePrice: 32000,
    stockOnline: 650,
    stockOffline: 45,
    shelfLocation: 'Kệ C3 - Tầng 1',
    description: 'Bìa cứng bọc simili lịch sự, kẹp inox mạ crom kẹp chắc 80 tờ giấy, phục vụ trình ký lãnh đạo và hội nghị.',
    specifications: {
      'Khổ': 'A4',
      'Kẹp': 'Inox chống gỉ có góc bọc cao su chống rách giấy'
    },
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500&auto=format&fit=crop&q=80'
  },

  // SỔ TAY & TẬP VỞ
  {
    id: 'so-001',
    sku: 'SO-DA-A5-DELI',
    barcode: '6921734930018',
    name: 'Sổ tay bìa da cao cấp A5 Deli 200 trang cài bút',
    category: 'so-vo',
    subCategory: 'Sổ bìa da',
    brand: 'Deli',
    unit: 'Quyển',
    price: 89000,
    wholesalePrice: 75000,
    originalPrice: 105000,
    stockOnline: 850,
    stockOffline: 65,
    shelfLocation: 'Kệ D1 - Tầng 2',
    description: 'Chất da PU mềm chống bám bẩn, giấy định lượng 80gsm kẻ ngang màu kem chống lóa, có dây đánh dấu trang và khe cài bút.',
    specifications: {
      'Khổ': 'A5 (148 x 210 mm)',
      'Số trang': '200 trang',
      'Định lượng giấy': '80 gsm chống thấm mực'
    },
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
    featured: true
  },
  {
    id: 'so-002',
    sku: 'SO-LO-XO-KOKUYO-B5',
    barcode: '4901480070025',
    name: 'Sổ lò xo kép Kokuyo Campus B5 kẻ caro 160 trang',
    category: 'so-vo',
    subCategory: 'Sổ lò xo',
    brand: 'Kokuyo',
    unit: 'Quyển',
    price: 52000,
    wholesalePrice: 44000,
    stockOnline: 920,
    stockOffline: 80,
    shelfLocation: 'Kệ D2 - Tầng 1',
    description: 'Giấy siêu mịn công nghệ Nhật, kẻ ô caro 5mm chuẩn xác hỗ trợ ghi chú Bullet Journal và mindmap sơ đồ tư duy.',
    specifications: {
      'Khổ': 'B5',
      'Kẻ ô': 'Grid Caro 5x5 mm',
      'Trang': '160 trang'
    },
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&auto=format&fit=crop&q=80',
    bestSeller: true
  },
  {
    id: 'so-003',
    sku: 'TAP-HH-200TR',
    barcode: '8934651000032',
    name: 'Tập vở học sinh Hồng Hà 4 ô ly 200 trang chống lóa',
    category: 'so-vo',
    subCategory: 'Vở học sinh',
    brand: 'Hồng Hà',
    unit: 'Quyển',
    price: 18000,
    wholesalePrice: 15500,
    stockOnline: 3800,
    stockOffline: 350,
    shelfLocation: 'Kệ D3 - Tầng 1',
    description: 'Giấy vở Hồng Hà độ trắng tự nhiên 82-84% ISO bảo vệ mắt, không nhòe mực khi viết bút máy.',
    specifications: {
      'Dòng kẻ': '4 ô ly vuông',
      'Số trang': '200 trang cả bìa',
      'Định lượng': '100 gsm'
    },
    image: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'so-004',
    sku: 'SO-PHIEU-THU-CHI-2L',
    barcode: '8936012490049',
    name: 'Quyển phiếu Thu / Chi 2 liên giấy Carbonless (100 tờ)',
    category: 'so-vo',
    subCategory: 'Biểu mẫu kế toán',
    brand: 'Thiên Long',
    unit: 'Quyển',
    price: 24000,
    wholesalePrice: 20000,
    stockOnline: 1400,
    stockOffline: 110,
    shelfLocation: 'Kệ D4 - Tầng 1',
    description: 'Giấy carbonless viết 1 liên tự in hằn sang liên 2 rõ ràng không cần kê giấy than.',
    specifications: {
      'Khổ': 'A5',
      'Số liên': '2 liên (Trắng - Hồng)',
      'Số tờ': '100 tờ (50 bộ)'
    },
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80'
  },

  // DỤNG CỤ GHIM, KẸP & CẮT
  {
    id: 'dc-001',
    sku: 'BAM-KIM-PLUS-10',
    barcode: '4977564010011',
    name: 'Máy bấm kim số 10 Plus trợ lực PS-10E Nhật Bản',
    category: 'dung-cu',
    subCategory: 'Bấm kim',
    brand: 'Plus Nhật Bản',
    unit: 'Cái',
    price: 48000,
    wholesalePrice: 41000,
    originalPrice: 56000,
    stockOnline: 950,
    stockOffline: 70,
    shelfLocation: 'Kệ E1 - Tầng 1',
    description: 'Thiết kế trợ lực 50%, bấm nhẹ êm tay, chứa tối đa 20 tờ giấy A4. Thân kim loại bọc nhựa ABS chịu va đập.',
    specifications: {
      'Cỡ kim dùng': 'Kim bấm số 10',
      'Số tờ bấm': 'Tối đa 20 tờ 70gsm',
      'Xuất xứ': 'Plus Vietnam - Công nghệ Nhật'
    },
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=80',
    featured: true,
    bestSeller: true
  },
  {
    id: 'dc-002',
    sku: 'KIM-BAM-10-PLUS',
    barcode: '4977564010028',
    name: 'Hộp kim bấm số 10 Plus (Hộp 1000 kim)',
    category: 'dung-cu',
    subCategory: 'Kim bấm',
    brand: 'Plus Nhật Bản',
    unit: 'Hộp',
    price: 6500,
    wholesalePrice: 5000,
    stockOnline: 5000,
    stockOffline: 450,
    shelfLocation: 'Kệ E1 - Hộc 02',
    description: 'Chân kim sắc bén, thép mạ kẽm không gỉ, không cong vẹo khi bấm tập tài liệu dày.',
    specifications: {
      'Quy cách': '1000 kim/hộp, 20 hộp/lốc'
    },
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'dc-003',
    sku: 'KEP-BUOM-25MM-DELI',
    barcode: '6921734940031',
    name: 'Kẹp bướm sắt 25mm Deli chống gỉ (Hộp 12 cái)',
    category: 'dung-cu',
    subCategory: 'Kẹp bướm',
    brand: 'Deli',
    unit: 'Hộp (12 cái)',
    price: 16000,
    wholesalePrice: 13000,
    stockOnline: 3200,
    stockOffline: 220,
    shelfLocation: 'Kệ E2 - Hộc 03',
    description: 'Lò xo đàn hồi thép tôi nhiệt cao, kẹp chắc không rơi rụng giấy tờ hồ sơ.',
    specifications: {
      'Kích thước': '25 mm (kẹp ~55 tờ)',
      'Quy cách': '12 cái/hộp'
    },
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'dc-004',
    sku: 'KEO-CAT-PLUS-SC175',
    barcode: '4977564020041',
    name: 'Kéo văn phòng lưỡi cong Plus SC-175F chống dính',
    category: 'dung-cu',
    subCategory: 'Kéo cắt giấy',
    brand: 'Plus Nhật Bản',
    unit: 'Cái',
    price: 49000,
    wholesalePrice: 42000,
    stockOnline: 640,
    stockOffline: 50,
    shelfLocation: 'Kệ E3 - Tầng 1',
    description: 'Lưỡi thép cong Bernoulli trợ lực cắt bén ngọt từ gốc đến mũi kéo. Phủ Fluorine chống dính băng keo.',
    specifications: {
      'Chiều dài': '175 mm',
      'Đặc điểm': 'Lưỡi cong 30 độ, phủ chống dính keo'
    },
    image: 'https://images.unsplash.com/photo-1503792501406-2c40da09e1e2?w=500&auto=format&fit=crop&q=80',
    featured: true
  },
  {
    id: 'dc-005',
    sku: 'KHAY-HO-SO-3-TANG',
    barcode: '6921734940055',
    name: 'Kệ khay đựng hồ sơ tài liệu 3 tầng sắt sơn tĩnh điện Deli',
    category: 'dung-cu',
    subCategory: 'Khay kệ tài liệu',
    brand: 'Deli',
    unit: 'Bộ',
    price: 135000,
    wholesalePrice: 115000,
    originalPrice: 160000,
    stockOnline: 480,
    stockOffline: 32,
    shelfLocation: 'Kệ E4 - Tầng 2',
    description: 'Lưới kim loại thanh lịch, chống đọng bụi, 3 ngăn kéo trượt mượt mà giúp bàn làm việc luôn ngăn nắp gọn gàng.',
    specifications: {
      'Kích thước': '350 x 295 x 270 mm',
      'Chất liệu': 'Lưới thép sơn tĩnh điện đen',
      'Số tầng': '3 tầng trượt'
    },
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80',
    bestSeller: true
  },

  // BĂNG KEO & ĐÓNG GÓI
  {
    id: 'bk-001',
    sku: 'BANG-KEO-TRONG-5CM',
    barcode: '8936012460011',
    name: 'Băng keo trong dán thùng 5cm x 100 yard (Cây 6 cuộn)',
    category: 'bang-keo',
    subCategory: 'Băng keo dán thùng',
    brand: 'Deli',
    unit: 'Cây (6 cuộn)',
    price: 85000,
    wholesalePrice: 75000,
    stockOnline: 1800,
    stockOffline: 120,
    shelfLocation: 'Kệ F1 - Tầng 1 (Khu Đóng gói)',
    description: 'Băng keo màng OPP dẻo dai, độ dính 50 mic siêu bám dính trên thùng carton, không đứt gãy giữa chừng.',
    specifications: {
      'Khổ rộng': '48 mm (5cm)',
      'Chiều dài': '100 yards (~91 mét)',
      'Quy cách': '6 cuộn/cây, 20 cây/thùng'
    },
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&auto=format&fit=crop&q=80',
    bestSeller: true
  },
  {
    id: 'bk-002',
    sku: 'BANG-KEO-2-MAT-24MM',
    barcode: '8936012460028',
    name: 'Băng keo 2 mặt trắng 24mm x 15 mét (Lốc 10 cuộn)',
    category: 'bang-keo',
    subCategory: 'Băng keo 2 mặt',
    brand: 'Deli',
    unit: 'Lốc (10 cuộn)',
    price: 55000,
    wholesalePrice: 47000,
    stockOnline: 1100,
    stockOffline: 85,
    shelfLocation: 'Kệ F1 - Tầng 2',
    description: 'Dán ảnh, thiệp, tài liệu trang trí văn phòng bám chắc hai mặt tiện lợi.',
    specifications: {
      'Khổ': '24 mm',
      'Đóng gói': '10 cuộn/lốc'
    },
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'bk-003',
    sku: 'MANG-PE-QUAN-HANG',
    barcode: '8936012460035',
    name: 'Cuộn màng PE quấn hàng bọc pallet 50cm nặng 2.4kg',
    category: 'bang-keo',
    subCategory: 'Màng PE bọc hàng',
    brand: 'Deli',
    unit: 'Cuộn',
    price: 115000,
    wholesalePrice: 98000,
    stockOnline: 620,
    stockOffline: 40,
    shelfLocation: 'Kệ F2 - Tầng trệt',
    description: 'Màng chít PE co giãn 300%, chống nước, chống bụi bẩn và xước sát khi vận chuyển đồ đạc văn phòng.',
    specifications: {
      'Khổ rộng': '50 cm',
      'Trọng lượng': '2.4 kg (lõi 300g)'
    },
    image: 'https://images.unsplash.com/photo-1554415707-9e4426dca254?w=500&auto=format&fit=crop&q=80'
  },

  // MÁY TÍNH & THIẾT BỊ VP
  {
    id: 'tb-001',
    sku: 'CASIO-FX-580VNX',
    barcode: '4549526600018',
    name: 'Máy tính khoa học Casio FX-580VN X chính hãng Bitex (Bảo hành 7 năm)',
    category: 'thiet-bi',
    subCategory: 'Máy tính học sinh',
    brand: 'Casio',
    unit: 'Cái',
    price: 685000,
    wholesalePrice: 630000,
    originalPrice: 740000,
    stockOnline: 450,
    stockOffline: 35,
    shelfLocation: 'Tủ Kính Thiết Bị - Khu trung tâm',
    description: 'Dòng máy tính 521 tính năng có ngôn ngữ Tiếng Việt, màn hình LCD độ phân giải cao, được phép mang vào phòng thi.',
    specifications: {
      'Tính năng': '521 tính năng, giải phương trình bậc 4',
      'Màn hình': 'High-resolution LCD',
      'Bảo hành': '7 năm 1 đổi 1 trong năm đầu chính hãng Bitex'
    },
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
    featured: true,
    bestSeller: true
  },
  {
    id: 'tb-002',
    sku: 'CASIO-JS-40B',
    barcode: '4549526600025',
    name: 'Máy tính để bàn kế toán Casio JS-40B 14 số phím kim loại',
    category: 'thiet-bi',
    subCategory: 'Máy tính văn phòng',
    brand: 'Casio',
    unit: 'Cái',
    price: 495000,
    wholesalePrice: 450000,
    originalPrice: 530000,
    stockOnline: 280,
    stockOffline: 22,
    shelfLocation: 'Tủ Kính Thiết Bị - Tầng 2',
    description: 'Máy tính kế toán chuyên nghiệp 14 chữ số, phím phủ kim loại bấm êm như bàn phím cơ, 2 nguồn năng lượng pin và năng lượng mặt trời.',
    specifications: {
      'Số chữ số': '14 số',
      'Chức năng': 'Tính thuế, đổi tiền tệ, tính tổng GT',
      'Bảo hành': '7 năm chính hãng'
    },
    image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500&auto=format&fit=crop&q=80',
    featured: true
  },
  {
    id: 'tb-003',
    sku: 'MAY-HUY-GIAY-DELI',
    barcode: '6921734950033',
    name: 'Máy hủy tài liệu văn phòng Deli ET117 vụn mini bảo mật',
    category: 'thiet-bi',
    subCategory: 'Máy hủy tài liệu',
    brand: 'Deli',
    unit: 'Máy',
    price: 1650000,
    wholesalePrice: 1490000,
    originalPrice: 1850000,
    stockOnline: 75,
    stockOffline: 6,
    shelfLocation: 'Khu Thiết Bị Lớn - Tầng trệt',
    description: 'Hủy vụn 4x25mm đạt tiêu chuẩn bảo mật cấp 4, hủy 6 tờ A4 một lần, dung tích thùng chứa 15 lít.',
    specifications: {
      'Kiểu hủy': 'Hủy vụn (Cross-cut)',
      'Công suất hủy': '6 tờ/lần (70gsm)',
      'Bảo hành': '12 tháng'
    },
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80'
  },

  // NHU YẾU PHẨM & VỆ SINH
  {
    id: 'vs-001',
    sku: 'GIAY-VE-SINH-CUON-LON',
    barcode: '8936012470014',
    name: 'Giấy vệ sinh cuộn lớn An An 700g cho văn phòng (Cây 10 cuộn)',
    category: 've-sinh',
    subCategory: 'Giấy vệ sinh',
    brand: 'Thiên Long',
    unit: 'Cây (10 cuộn)',
    price: 240000,
    wholesalePrice: 215000,
    stockOnline: 620,
    stockOffline: 45,
    shelfLocation: 'Kệ G1 - Kho Hàng Sau',
    description: '100% bột giấy nguyên sinh 2 lớp mềm mại, tan nhanh trong nước chống tắc nghẽn bồn cầu văn phòng.',
    specifications: {
      'Trọng lượng': '700g/cuộn',
      'Đóng gói': '10 cuộn/cây'
    },
    image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'vs-002',
    sku: 'NUOC-RUA-TAY-LIFEBUOY-4KG',
    barcode: '8934868120021',
    name: 'Nước rửa tay diệt khuẩn Lifebuoy Can 4kg hương Chanh sả',
    category: 've-sinh',
    subCategory: 'Nước rửa tay',
    brand: 'Deli',
    unit: 'Can (4kg)',
    price: 265000,
    wholesalePrice: 235000,
    stockOnline: 310,
    stockOffline: 25,
    shelfLocation: 'Kệ G2 - Kho Sau',
    description: 'Can lớn siêu tiết kiệm cho nhà vệ sinh cơ quan, công ty. Diệt 99.9% vi khuẩn với ion bạc.',
    specifications: {
      'Dung tích': '4.0 kg',
      'Mùi hương': 'Chanh sả tươi mát'
    },
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80'
  }
];

/**
 * Procedural generator to scale the product database up to 2000 SKUs seamlessly.
 * Generates realistic stationery items across categories, sizes, specs, and stock numbers.
 */
export function generateExpandedCatalog(targetCount = 2000): Product[] {
  const result: Product[] = [...BASE_PRODUCTS];
  if (result.length >= targetCount) return result.slice(0, targetCount);

  const subCatData: Record<string, { names: string[]; units: string[]; priceRange: [number, number]; brands: string[] }> = {
    'giay-in': {
      names: [
        'Giấy in A4 PaperOne định lượng',
        'Giấy note vàng phân trang 3x3 inch',
        'Giấy than Horse Thái Lan màu xanh',
        'Giấy in màu bìa thơm A4 Thái Lan',
        'Giấy in decal tem nhãn A4 Tomy',
        'Giấy in liên tục 3 liên đục lỗ',
        'Giấy vẽ mỹ thuật Bristol A3',
        'Giấy in ảnh bóng Glossy A4 200gsm'
      ],
      units: ['Ram', 'Tập', 'Xấp', 'Hộp', 'Quyển'],
      priceRange: [25000, 195000],
      brands: ['Double A', 'PaperOne', 'IK Plus', 'Deli']
    },
    'but-viet': {
      names: [
        'Bút lông dầu ngòi đôi không xóa PM-09',
        'Bút chì bấm cơ khí kỹ thuật 0.5mm',
        'Ruột chì bấm 2B 0.5mm siêu bền',
        'Bút xóa kéo Deli 12m kèm ruột thay',
        'Bút máy luyện chữ đẹp ngòi mài',
        'Bút gel nước bấm nắp kim ngòi 0.38mm',
        'Bút dạ kim viết nét thanh nét đậm',
        'Bút sơn công nghiệp Uni Paint Marker PX-20'
      ],
      units: ['Cây', 'Hộp', 'Vỉ', 'Chiếc'],
      priceRange: [8000, 120000],
      brands: ['Thiên Long', 'Deli', 'Pentel', 'Uni-ball', 'Bến Nghé']
    },
    'bia-file': {
      names: [
        'Bìa hộp simili gáy 10cm bảo quản chứng từ',
        'Bìa phân trang 10 màu nhựa PP',
        'Bìa lỗ A4 đựng hồ sơ 11 lỗ dày dặn',
        'Cặp tài liệu 12 ngăn có quai xách',
        'Bìa kẹp tài liệu rút gáy khổ A4',
        'Bìa còng nhẫn 2 vòng nhựa trong suốt',
        'Bìa accord hồ sơ giấy gấp tiện lợi'
      ],
      units: ['Cái', 'Xấp', 'Hộp', 'Bộ'],
      priceRange: [15000, 95000],
      brands: ['King Jim', 'Plus Nhật Bản', 'Deli', 'Bến Nghé']
    },
    'so-vo': {
      names: [
        'Sổ còng đa năng thay ruột được A5',
        'Ruột sổ còng giấy chấm dot 100 tờ',
        'Sổ nhật ký hành trình bìa cứng dập kim',
        'Tập bài kiểm tra cấp 2, 3 có lời phê',
        'Sổ theo dõi công văn đi đến đóng bìa mạ vàng',
        'Sổ tay bỏ túi lò xo mini A7'
      ],
      units: ['Quyển', 'Cuốn', 'Tập'],
      priceRange: [12000, 110000],
      brands: ['Kokuyo', 'Hồng Hà', 'Deli', 'Thiên Long']
    },
    'dung-cu': {
      names: [
        'Kẹp giấy tam giác kim loại chống gỉ C62',
        'Dao rọc giấy cán nhôm hợp kim xoay khóa',
        'Lưỡi dao rọc giấy 18mm hộp 10 lưỡi',
        'Máy đục lỗ giấy 2 lỗ công suất 30 tờ',
        'Bàn cắt giấy gỗ khổ A4 lưỡi gạt thép',
        'Dấu nhảy số tự động 6 số deli',
        'Khay mực dấu tròn Shiny không phai màu',
        'Cắt băng keo để bàn nặng chống trượt'
      ],
      units: ['Cái', 'Hộp', 'Bộ', 'Chiếc'],
      priceRange: [9000, 240000],
      brands: ['Plus Nhật Bản', 'Deli', 'Casio', 'Thiên Long']
    },
    'bang-keo': {
      names: [
        'Băng keo simili xanh dán gáy sách 3.6cm',
        'Băng keo giấy viết chữ ghi chú 2cm',
        'Băng keo mút xốp 2 mặt siêu dính 1.8cm',
        'Dây thừng đóng hàng gai tự nhiên cuộn 500g',
        'Màng xốp hơi bóng khí chống sốc 50cm'
      ],
      units: ['Cuộn', 'Cây', 'Lốc'],
      priceRange: [18000, 130000],
      brands: ['Deli', 'Thiên Long']
    },
    'thiet-bi': {
      names: [
        'Bút trình chiếu laser không dây thuyết trình',
        'Máy ép plastic khổ A3 Deli điều chỉnh nhiệt độ',
        'Máy đóng sách gáy xoắn lò xo kẽm và nhựa',
        'Đèn bàn làm việc LED chống cận thị đổi 3 màu sáng'
      ],
      units: ['Máy', 'Chiếc', 'Bộ'],
      priceRange: [180000, 2100000],
      brands: ['Casio', 'Deli', 'Thiên Long']
    },
    've-sinh': {
      names: [
        'Nước lau kính Sunlight chai xịt 520ml',
        'Nước lau sàn khử khuẩn đậm đặc 3.8kg',
        'Túi rác đen văn phòng tự hủy sinh học 3 cuộn',
        'Khăn lau bàn đa năng microfiber không xơ'
      ],
      units: ['Chai', 'Bịch', 'Can', 'Gói'],
      priceRange: [22000, 185000],
      brands: ['Thiên Long', 'Deli']
    }
  };

  const catKeys = Object.keys(subCatData);
  let counter = result.length + 1;

  while (result.length < targetCount) {
    const catId = catKeys[counter % catKeys.length];
    const catMeta = subCatData[catId];
    const nameIndex = (counter * 7) % catMeta.names.length;
    const baseName = catMeta.names[nameIndex];
    const brand = catMeta.brands[(counter * 3) % catMeta.brands.length];
    const unit = catMeta.units[counter % catMeta.units.length];
    const priceStep = Math.floor(Math.random() * (catMeta.priceRange[1] - catMeta.priceRange[0]) / 1000) * 1000;
    const price = catMeta.priceRange[0] + priceStep;
    const wholesalePrice = Math.round((price * 0.88) / 1000) * 1000;
    
    // SKU pattern: VPP-{CAT_PREFIX}-{ID}
    const catPrefix = catId.substring(0, 3).toUpperCase();
    const sku = `VPP-${catPrefix}-${String(counter).padStart(4, '0')}`;
    const barcode = `893${String(counter).padStart(10, '0')}`;
    const shelfZone = ['A', 'B', 'C', 'D', 'E', 'F', 'G'][counter % 7];
    const shelfTier = (counter % 4) + 1;
    const shelf = `Kệ ${shelfZone}${shelfTier} - Ô ${(counter % 20) + 1}`;

    result.push({
      id: `gen-${counter}`,
      sku,
      barcode,
      name: `${baseName} (Mã VPP #${counter} - ${brand})`,
      category: catId,
      subCategory: 'Văn phòng phẩm tổng hợp',
      brand,
      unit,
      price,
      wholesalePrice,
      originalPrice: price > 50000 ? Math.round((price * 1.15) / 1000) * 1000 : undefined,
      stockOnline: Math.floor(Math.random() * 800) + 50,
      stockOffline: Math.floor(Math.random() * 60) + 5,
      shelfLocation: shelf,
      description: `Sản phẩm văn phòng phẩm chính hãng chất lượng cao từ ${brand}. Phù hợp cho cơ quan, doanh nghiệp, trường học và cá nhân sử dụng hàng ngày.`,
      specifications: {
        'Mã SKU': sku,
        'Thương hiệu': brand,
        'Đơn vị tính': unit,
        'Vị trí kệ cửa hàng': shelf,
        'Xuất xứ': 'Việt Nam / Nhập khẩu chính ngạch'
      },
      image: BASE_PRODUCTS[counter % BASE_PRODUCTS.length].image
    });

    counter++;
  }

  return result;
}

export const PRODUCTS_CATALOG: Product[] = BASE_PRODUCTS;

export function generate2000Products(): Product[] {
  return generateExpandedCatalog(2000);
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}
