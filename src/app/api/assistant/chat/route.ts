import { NextResponse } from 'next/server';
import {
  AssistantChatResponse,
  detectIntent,
  getRecommendedProducts,
  generateAdvisoryReply,
  tryEnhanceWithAIGateway,
} from '@/lib/assistantEngine';
import { AssistantChatSchema } from '@/lib/validations';
import { checkRateLimit, extractClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  const ip = extractClientIp(request);
  const rl = checkRateLimit(`assistant-chat:${ip}`, 25, 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'تم تجاوز الحد المسموح من الرسائل، يرجى الانتظار دقيقة قبل المحاولة مجدداً.' },
      { status: 429 }
    );
  }

  try {
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'بيانات غير صالحة. يرجى إرسال JSON سليم.' },
        { status: 400 }
      );
    }

    const parsed = AssistantChatSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'حقل الرسالة (message) مطلوب ولا يمكن أن يكون فارغاً.' },
        { status: 400 }
      );
    }

    const message = parsed.data.message;

    // 1. Detect Intent and Lead Trigger
    const { intent, triggerLeadCapture } = detectIntent(message);

    // 2. Query Catalog with Free Lead Magnet Priority
    const recommendedProducts = getRecommendedProducts(intent, message);

    // 3. Generate Articulate Advisory Reply
    let reply = generateAdvisoryReply(intent, message, recommendedProducts, triggerLeadCapture);

    // 4. Try optional AI Gateway enhancement with fallback
    if (message.length > 10 && !triggerLeadCapture) {
      const aiEnhanced = await tryEnhanceWithAIGateway(
        `المستخدم يستفسر عن: "${message}". نية العميل: ${intent}. لخص له القيمة وقدم نصيحة مهنية سريعة تشجعه على تجربة الأصول المجانية في منصة رَصين.`
      );
      if (aiEnhanced) {
        reply = `${aiEnhanced}\n\n${reply}`;
      }
    }

    const responsePayload: AssistantChatResponse = {
      reply,
      intent,
      recommendedProducts,
      triggerLeadCapture,
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error('Error in /api/assistant/chat:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في معالجة المحادثة. يرجى المحاولة لاحقاً.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    version: '2.0.0',
    service: 'RaseenAssistant AI Engine',
    intentsSupported: [
      'engineering_bim',
      'financial_accounting',
      'legal_contracts',
      'business_tools',
      'vendor_creator',
      'general_support',
    ],
    freeLeadMagnetsIncluded: ['free-p1', 'free-p2', 'free-p3', 'free-p4'],
  });
}
