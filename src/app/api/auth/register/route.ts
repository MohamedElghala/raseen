import { NextResponse } from 'next/server';
import { checkPasswordStrength } from '@/lib/passwords';
import { findUserByEmail, createUser, DatabaseUnavailableError } from '@/lib/userService';
import { RegisterSchema } from '@/lib/validations';
import { checkRateLimit, extractClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  const ip = extractClientIp(request);
  const rl = checkRateLimit(`register:${ip}`, 10, 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'تم إرسال محاولات تسجيل كثيرة، يرجى الانتظار دقيقة.' },
      { status: 429 }
    );
  }

  try {
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json({ error: 'بيانات الطلب غير صالحة' }, { status: 400 });
    }

    const parsed = RegisterSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'يرجى التحقق من البيانات المدخلة' },
        { status: 400 }
      );
    }

    const { name, email, password, role } = parsed.data;

    const strength = checkPasswordStrength(password);
    if (!strength.isValid) {
      return NextResponse.json(
        {
          error:
            strength.message ||
            'كلمة المرور ضعيفة، يجب أن تحتوي على 10 أحرف على الأقل تشمل أحرفاً كبيرة وصغيرة وأرقاماً ورموزاً',
        },
        { status: 400 }
      );
    }

    const existing = await findUserByEmail(email);

    if (existing) {
      // Generic message avoids direct account enumeration
      return NextResponse.json(
        {
          error:
            'تعذر إتمام إنشاء الحساب بهذه البيانات. إذا كان لديك حساب بالفعل يمكنك تسجيل الدخول مباشرة.',
        },
        { status: 400 }
      );
    }

    const newUser = await createUser({
      name,
      email,
      password,
      role,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'تم إنشاء الحساب بنجاح، مرحباً بك في رَصين!',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isDbError =
      error instanceof DatabaseUnavailableError ||
      /Can't reach database server|ENOTFOUND|ETIMEDOUT|ECONNREFUSED|timed out|P1001|P1002/i.test(errMsg);
    if (isDbError) {
      return NextResponse.json(
        { error: 'خدمة قاعدة البيانات غير متاحة مؤقتاً، يرجى المحاولة لاحقاً.' },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع أثناء تسجيل الحساب' },
      { status: 500 }
    );
  }
}
