import { Metadata } from 'next';
import { VenuesGrid } from './VenuesGrid';
import { Suspense } from 'react';
import { HeroSearch } from './HeroSearch';
import { VenuesGridSkeleton } from './VenuesGridSkeleton';

export default async function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Holidaze
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                Your Gateway to Unforgettable Getaways
              </p>
            </div>
            <HeroSearch />
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Featured Homes
          </h2>
          <Suspense fallback={<VenuesGridSkeleton />}>
            <VenuesGrid />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Holidaze | Your Gateway to Unforgettable Getaways',
  description:
    'Holidaze is your gateway to unforgettable getaways. Find your perfect holiday home today.',
};

export const dynamic = 'force-dynamic';
export const runtime = 'edge';
