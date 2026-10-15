import { NextResponse } from 'next/server';

interface LeadPayload {
  name?: string;
  phone?: string;
  email?: string;
  channel?: 'whatsapp' | 'email' | 'phone';
  interest?: string;
  metadata?: Record<string, any>;
}

interface StoredLead {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  channel: 'whatsapp' | 'email' | 'phone';
  interest: string;
  metadata: Record<string, any>;
  createdAt: string;
  source: string;
}

// In-memory store maintaining real lead state across requests
const inMemoryLeads: StoredLead[] = [];

// International E.164 regex (e.g. +966501234567, +201012345678, +14155552671)
const E164_PHONE_REGEX = /^\+[1-9]\d{6,14}$/;

// Arabic local phone regex (Egypt: 010/011/012/015, KSA: 05, UAE: 05, GCC/Levant: 0[1-9]...)
const ARABIC_LOCAL_PHONE_REGEX = /^0(1[0125]\d{8}|5\d{8}|[2-9]\d{6,9})$/;

// Clean international digits without plus (7 to 15 digits)
const CLEAN_INT_PHONE_REGEX = /^[1-9]\d{6,14}$/;

// Standard RFC 5322 compliant email regex
const RFC5322_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  return (
    E164_PHONE_REGEX.test(cleaned) ||
    ARABIC_LOCAL_PHONE_REGEX.test(cleaned) ||
    CLEAN_INT_PHONE_REGEX.test(cleaned)
  );
}

function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return RFC5322_EMAIL_REGEX.test(email.trim());
}

export async function POST(request: Request) {
  try {
    let body: LeadPayload;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'بيانات الطلب غير صالحة. يرجى إرسال JSON سليم.' },
        { status: 400 }
      );
    }

    const {
      name,
      phone,
      email,
      channel = 'whatsapp',
      interest,
      metadata,
    } = body;

    const trimmedPhone = phone ? phone.trim() : '';
    const trimmedEmail = email ? email.trim() : '';

    // Validate that at least phone or email is provided
    if (!trimmedPhone && !trimmedEmail) {
      return NextResponse.json(
        { success: false, error: 'يرجى تقديم رقم الهاتف أو البريد الإلكتروني للتواصل.' },
        { status: 400 }
      );
    }

    // Validate phone if provided
    if (trimmedPhone && !validatePhone(trimmedPhone)) {
      return NextResponse.json(
        {
          success: false,
          error:
            'صيغة رقم الهاتف غير صالحة. يرجى إدخال رقم صحيح بتنسيق دولي E.164 (مثل +966500000000 أو +201000000000) أو محلي (مثل 0500000000 أو 01000000000).',
        },
        { status: 400 }
      );
    }

    // Validate email if provided
    if (trimmedEmail && !validateEmail(trimmedEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: 'صيغة البريد الإلكتروني غير صالحة وفقاً لمعايير RFC 5322.',
        },
        { status: 400 }
      );
    }

    // Validate channel-specific requirements
    if (channel === 'whatsapp' && !trimmedPhone) {
      return NextResponse.json(
        {
          success: false,
          error: 'قناة الواتساب تتطلب تقديم رقم هاتف صالح.',
        },
        { status: 400 }
      );
    }

    if (channel === 'email' && !trimmedEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'قناة البريد الإلكتروني تتطلب تقديم بريد إلكتروني صالح.',
        },
        { status: 400 }
      );
    }

    const leadId = `LEAD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const leadRecord: StoredLead = {
      id: leadId,
      name: (name && name.trim()) || 'عميل محتمل من منصة رَصين',
      phone: trimmedPhone || null,
      email: trimmedEmail || null,
      channel,
      interest: (interest && interest.trim()) || 'استشارة عامة في خدمات وأصول رَصين',
      metadata: metadata || {},
      createdAt: new Date().toISOString(),
      source: 'RaseenAssistant AI Bot',
    };

    inMemoryLeads.push(leadRecord);

    console.log('🌟 [NEW QUALIFIED LEAD CAPTURED]:', JSON.stringify(leadRecord, null, 2));

    return NextResponse.json(
      {
        success: true,
        leadId,
        message: 'تم تسجيل طلب التواصل بنجاح! سيتواصل معك فريق الاستشارات والتنفيذ فوراً.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing lead in /api/leads:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ غير متوقع أثناء معالجة الطلب.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    count: inMemoryLeads.length,
    leads: inMemoryLeads.slice(-20),
  });
}
