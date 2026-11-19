import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { mockProducts } from '@/lib/mockData';
import { generateDownloadToken } from '@/lib/storage';
import { issueSignedLicense } from '@/lib/licenseServer';
import { LeadSchema } from '@/lib/validations';
import { checkRateLimit, extractClientIp } from '@/lib/rateLimit';

interface LeadPayload {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  channel?: 'whatsapp' | 'email' | 'phone';
  interest?: string | null;
  metadata?: Record<string, any> | null;
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

const inMemoryLeads: StoredLead[] = [];

const E164_PHONE_REGEX = /^\+[1-9]\d{6,14}$/;
const ARABIC_LOCAL_PHONE_REGEX = /^0(1[0125]\d{8}|5\d{8}|[2-9]\d{6,9})$/;
const CLEAN_INT_PHONE_REGEX = /^[1-9]\d{6,14}$/;
const RFC5322_EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

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
  const ip = extractClientIp(request);
  // Generous limit per minute to protect against spam bursts without impacting integration tests
  const rl = checkRateLimit(`leads:${ip}`, 100, 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: 'تم إرسال عدد كبير من الطلبات، يرجى المحاولة بعد دقيقة.' },
      { status: 429 }
    );
  }

  try {
    let rawBody: LeadPayload;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'بيانات الطلب غير صالحة. يرجى إرسال JSON سليم.' },
        { status: 400 }
      );
    }

    const parsed = LeadSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'بيانات الطلب غير صالحة.' },
        { status: 400 }
      );
    }

    const { name, phone, email, channel = 'whatsapp', interest, metadata } = parsed.data;

    const trimmedPhone = phone ? phone.trim() : '';
    const trimmedEmail = email ? email.trim() : '';

    if (!trimmedPhone && !trimmedEmail) {
      return NextResponse.json(
        { success: false, error: 'يرجى تقديم رقم الهاتف أو البريد الإلكتروني للتواصل.' },
        { status: 400 }
      );
    }

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

    if (trimmedEmail && !validateEmail(trimmedEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: 'صيغة البريد الإلكتروني غير صالحة وفقاً لمعايير RFC 5322.',
        },
        { status: 400 }
      );
    }

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
      source: 'RaseenAssistant',
    };

    try {
      await prisma.lead.create({
        data: {
          id: leadId,
          name: leadRecord.name,
          phone: leadRecord.phone,
          email: leadRecord.email,
          channel: leadRecord.channel,
          interest: leadRecord.interest,
          metadata: JSON.stringify(leadRecord.metadata),
          source: leadRecord.source,
        },
      });
    } catch (dbErr) {
      console.warn('Prisma lead write bypassed, storing in buffer:', (dbErr as Error).message);
    }

    inMemoryLeads.push(leadRecord);

    // If this lead capture requested a genuinely free ($0) catalog asset, issue a signed vault download link
    let downloadUrl: string | undefined;
    let downloadToken: string | undefined;
    let licenseToken: string | undefined;
    const requestedProductId =
      typeof metadata?.productId === 'string' ? metadata.productId : undefined;

    if (requestedProductId) {
      const freeAsset = mockProducts.find(
        (p) => p.id === requestedProductId && p.price === 0
      );
      if (freeAsset) {
        const buyerId = trimmedEmail || trimmedPhone || leadId;
        downloadToken = generateDownloadToken(freeAsset.id, buyerId);
        downloadUrl = `/api/vault/${encodeURIComponent(freeAsset.id)}?token=${encodeURIComponent(downloadToken)}`;
        const signedLicense = issueSignedLicense({
          assetId: freeAsset.id,
          assetTitle: freeAsset.title,
          buyerIdentifier: buyerId,
          licenseType: freeAsset.license === 'commercial' ? 'Commercial' : 'Personal',
          orderId: leadId,
        });
        licenseToken = signedLicense.verificationToken;
      }
    }

    return NextResponse.json(
      {
        success: true,
        leadId,
        downloadUrl,
        downloadToken,
        licenseToken,
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
  let session: { user?: { role?: string } } | null = null;
  try {
    session = (await getServerSession(authOptions)) as { user?: { role?: string } } | null;
  } catch {
    // Outside Next.js request scope (e.g. unit tests) -> fail closed with 401
    session = null;
  }

  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'غير مصرح بالوصول إلى بيانات العملاء' },
      { status: 401 }
    );
  }

  try {
    const dbLeads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json({
      success: true,
      count: dbLeads.length,
      leads: dbLeads,
    });
  } catch {
    return NextResponse.json({
      success: true,
      count: inMemoryLeads.length,
      leads: inMemoryLeads.slice(-50),
    });
  }
}
