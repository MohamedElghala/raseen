import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const fileType = searchParams.get('fileType');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    const where: Record<string, unknown> = {
      status: 'active',
    };

    if (category && category !== 'all') {
      where.category = { slug: category };
    }

    if (fileType && fileType !== 'all') {
      where.fileType = fileType;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (search && search.trim() !== '') {
      const term = search.trim();
      where.OR = [
        { title: { contains: term } },
        { description: { contains: term } },
        { tags: { contains: term } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        vendor: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        salesCount: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب المنتجات من قاعدة البيانات' },
      { status: 500 }
    );
  }
}
