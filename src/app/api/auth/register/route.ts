import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, checkPasswordStrength } from '@/lib/passwords';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    // 1. Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'الاسم مطلوب ويجب أن يكون حرفين على الأقل' }, { status: 400 });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'يرجى إدخال عنوان بريد إلكتروني صحيح' }, { status: 400 });
    }

    const strength = checkPasswordStrength(password);
    if (!strength.isValid) {
      return NextResponse.json({ 
        error: strength.message || 'كلمة المرور ضعيفة، يجب أن تحتوي على 8 أحرف وأرقام ورموز' 
      }, { status: 400 });
    }

    const assignedRole = role === 'vendor' ? 'vendor' : 'buyer';
    const cleanEmail = email.toLowerCase().trim();

    // 2. Check existing user
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json({ error: 'هذا البريد الإلكتروني مسجل بالفعل، يمكنك تسجيل الدخول مباشرة' }, { status: 409 });
    }

    // 3. Hash password
    const hashedPassword = hashPassword(password);

    // 4. Create in Supabase PostgreSQL
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role: assignedRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح في قاعدة البيانات',
      user: newUser,
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'حدث خطأ في السيرفر أثناء تسجيل الحساب' }, { status: 500 });
  }
}
