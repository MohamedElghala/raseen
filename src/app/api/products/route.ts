import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { mockProducts } from '@/lib/mockData';

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

    return NextResponse.json(
      {
        success: true,
        source: 'database',
        count: products.length,
        products,
      },
      { headers: { 'x-data-source': 'database' } }
    );
  } catch (error) {
    console.warn(
      'Database unreachable, serving resilient catalog from mockData:',
      (error as Error).message
    );
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const fileType = searchParams.get('fileType');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    let filtered = [...mockProducts];
    if (category && category !== 'all') {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (fileType && fileType !== 'all') {
      filtered = filtered.filter((p) => p.fileType === fileType);
    }
    if (featured === 'true') {
      filtered = filtered.filter((p) => Boolean(p.featured));
    }
    if (search && search.trim() !== '') {
      const term = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.tags?.some((t) => t.toLowerCase().includes(term))
      );
    }

    return NextResponse.json(
      {
        success: true,
        source: 'resilient_fallback',
        count: filtered.length,
        products: filtered,
      },
      { headers: { 'x-data-source': 'resilient-fallback' } }
    );
  }
}
