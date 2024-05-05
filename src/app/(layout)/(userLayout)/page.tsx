import { Metadata } from 'next';
import { VenuesGrid } from './VenuesGrid';
import { Suspense } from 'react';
import { HeroSearch } from './HeroSearch';
import { VenuesGridSkeleton } from './VenuesGridSkeleton';
import Image from 'next/image';
import { HERO_IMAGE } from '@/lib/constants';

export default async function HomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <section className="relative flex min-h-[80dvh] w-full flex-col items-center justify-center">
        <div className="absolute top-0 h-full w-full overflow-hidden">
          <Image
            src={HERO_IMAGE}
            alt="Tropical beach with palm trees and clear blue water"
            placeholder="blur"
            className="left-0 right-0 h-full w-full bg-sky-400 object-cover opacity-50 blur-sm"
          />
        </div>
        <div className="container relative z-10 px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Holidaze
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-400 md:text-xl">
                Your Gateway to Unforgettable Getaways
              </p>
            </div>
            <HeroSearch />
          </div>
        </div>
      </section>
      <section className="w-full pt-12">
        <div className="px-4">
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
