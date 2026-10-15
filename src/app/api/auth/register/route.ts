import { NextResponse } from 'next/server';
import { checkPasswordStrength } from '@/lib/passwords';
import { findUserByEmail, createUser } from '@/lib/userService';

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

    // 2. Check existing user via resilient userService
    const existing = await findUserByEmail(cleanEmail);

    if (existing) {
      return NextResponse.json({ error: 'هذا البريد الإلكتروني مسجل بالفعل، يمكنك تسجيل الدخول مباشرة' }, { status: 409 });
    }

    // 3. Create user via resilient userService (Supabase + local persistent mirror)
    const newUser = await createUser({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: assignedRole,
    });

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح، مرحباً بك في رَصين!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'حدث خطأ غير متوقع أثناء تسجيل الحساب' }, { status: 500 });
  }
}
