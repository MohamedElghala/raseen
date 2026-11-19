import type { Metadata } from 'next';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import { mockProducts } from '@/lib/mockData';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://raseen-nine.vercel.app';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return {
      title: 'المنتج غير موجود | رَصِيـن',
      description: 'الأصل الرقمي المطلوب غير متوفر حالياً في كتالوج منصة رَصين.',
    };
  }

  const priceLabel = product.price === 0 ? 'مجاني 100%' : `${product.price} ج.م`;
  const title = `${product.title} (${priceLabel}) | رَصِيـن`;
  const description = product.description.slice(0, 155);
  const url = `${BASE_URL}/product/${product.id}`;

  return {
    title,
    description,
    keywords: product.tags,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: product.imageUrl ? [{ url: product.imageUrl, width: 800, height: 533, alt: product.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = mockProducts.find((p) => p.id === id);

  const productSchema = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: product.imageUrl,
        sku: product.id,
        brand: {
          '@type': 'Brand',
          name: product.vendorName || 'رَصين | RASEEN',
        },
        offers: {
          '@type': 'Offer',
          url: `${BASE_URL}/product/${product.id}`,
          priceCurrency: 'EGP',
          price: product.price,
          availability: 'https://schema.org/InStock',
        },
      }
    : null;

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <ProductDetailClient productId={id} />
    </>
  );
}
