import { NextResponse } from 'next/server';

interface LeadPayload {
  name?: string;
  phone?: string;
  email?: string;
  channel?: 'whatsapp' | 'email' | 'phone';
  interest?: string;
  metadata?: Record<string, any>;
}

// Phone validator: international E.164 or Arab local format (+966, 05, +20, 01, +971)
const PHONE_REGEX = /^(\+?[0-9]{1,4})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{6,14}$/;
// Email validator RFC 5322 simplified
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body: LeadPayload = await request.json();
    const { name, phone, email, channel = 'whatsapp', interest, metadata } = body;

    // Validate that at least phone or email is provided
    if (!phone && !email) {
      return NextResponse.json(
        { success: false, error: 'يرجى تقديم رقم الهاتف أو البريد الإلكتروني للتواصل.' },
        { status: 400 }
      );
    }

    if (phone && !PHONE_REGEX.test(phone.replace(/\s+/g, ''))) {
      return NextResponse.json(
        { success: false, error: 'صيغة رقم الهاتف غير صالحة. يرجى التأكد من كتابة الرقم بشكل صحيح.' },
        { status: 400 }
      );
    }

    if (email && !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: 'صيغة البريد الإلكتروني غير صالحة.' },
        { status: 400 }
      );
    }

    const leadId = `LEAD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const leadRecord = {
      id: leadId,
      name: name || 'عميل محتمل من الموقع',
      phone: phone || null,
      email: email || null,
      channel,
      interest: interest || 'استشارة عامة في خدمات وأصول رَصين',
      metadata: metadata || {},
      createdAt: new Date().toISOString(),
      source: 'RaseenAssistant AI Bot',
    };

    // Log the lead securely on the server console (can be piped to DB/webhook/Supabase)
    console.log('🌟 [NEW QUALIFIED LEAD CAPTURED]:', JSON.stringify(leadRecord, null, 2));

    return NextResponse.json({
      success: true,
      leadId,
      message: 'تم تسجيل طلب التواصل بنجاح! سيتواصل معك فريق الاستشارات والتنفيذ فوراً.',
    });
  } catch (error) {
    console.error('Error processing lead:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ غير متوقع أثناء معالجة الطلب.' },
      { status: 500 }
    );
  }
}
