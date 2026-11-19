import React, { Suspense } from 'react';
import HomeClient from '@/components/storefront/HomeClient';

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-raseen-dark" />}>
      <HomeClient />
    </Suspense>
  );
}
