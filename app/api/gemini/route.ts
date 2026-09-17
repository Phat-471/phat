import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

let aiClient: GoogleGenAI | null = null;

function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, tone, keywords, companySize, targetCustomer } = body;

    const ai = getAi();

    if (action === 'generate_slogans') {
      const prompt = `Bạn là một chuyên gia thương hiệu và marketing hàng đầu tại Việt Nam.
Người dùng đang mở một trang web bán văn phòng phẩm (văn phòng phẩm) kết hợp bán online và có 1 cửa hàng offline (khoảng 2000 mã hàng như bút viết, giấy in, bìa còng, sổ tay, máy tính Casio, thiết bị VP).
Hiện tại cửa hàng CHƯA CÓ LOGO VÀ SLOGAN.

Yêu cầu: Hãy tạo 6 phương án gợi ý Tên Thương Hiệu và Slogan tiếng Việt cực kỳ ấn tượng, chuyên nghiệp, dễ nhớ, vần điệu, đáng tin cậy.
- Định hướng phong cách: ${tone || 'Chuyên nghiệp, tin cậy, hiện đại, thân thiện'}
- Từ khóa/Mong muốn: ${keywords || '2000 mã hàng, giao nhanh online, sẵn hàng tại quầy offline, giá sỉ tốt'}
- Đối tượng khách hàng chính: ${targetCustomer || 'Công ty, văn phòng, học sinh, trường học'}

Trả về định dạng JSON thuần (không kèm markdown markdown block):
{
  "proposals": [
    {
      "brandName": "Tên thương hiệu",
      "slogan": "Câu slogan chính ấn tượng (dưới 14 từ)",
      "meaning": "Ý nghĩa ngắn gọn của tên và slogan",
      "logoConcept": "Mô tả ý tưởng biểu tượng logo (ví dụ: ngòi bút cách điệu, trang sách mở hoặc khối rubik đa năng)",
      "targetAudience": "Đối tượng phù hợp nhất"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const text = response.text || '{}';
      try {
        const parsed = JSON.parse(text);
        return NextResponse.json(parsed);
      } catch {
        return NextResponse.json({ raw: text });
      }
    }

    if (action === 'suggest_office_package') {
      const prompt = `Bạn là chuyên gia tư vấn cung cấp văn phòng phẩm trọn gói cho doanh nghiệp tại Việt Nam.
Một doanh nghiệp có quy mô khoảng ${companySize || '20-30'} nhân sự đang cần lập danh sách dự trù văn phòng phẩm định kỳ hàng tháng (hoặc mở văn phòng mới).

Hãy đưa ra danh sách các mặt hàng văn phòng phẩm thiết yếu chuẩn hóa (gồm bút, giấy A4, bìa còng, sổ ký, kẹp bấm, khay tài liệu...) cùng số lượng dự tính phù hợp và ước tính ngân sách.

Trả về JSON thuần:
{
  "packageName": "Gói đề xuất cho công ty quy mô ${companySize || '20-30'} người",
  "monthlyBudgetEstimate": "3.500.000đ - 4.500.000đ",
  "advice": "Lời khuyên tối ưu chi phí văn phòng phẩm cho doanh nghiệp",
  "items": [
    {
      "name": "Tên sản phẩm",
      "unit": "Ram / Hộp / Cái",
      "suggestedQty": 10,
      "purpose": "Mục đích sử dụng"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const text = response.text || '{}';
      try {
        const parsed = JSON.parse(text);
        return NextResponse.json(parsed);
      } catch {
        return NextResponse.json({ raw: text });
      }
    }

    return NextResponse.json({ error: 'Hành động không hợp lệ' }, { status: 400 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Lỗi xử lý AI' }, { status: 500 });
  }
}
