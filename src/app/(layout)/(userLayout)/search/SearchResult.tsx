'use client';

import type { VenueFull } from '@/lib/types';

import { VenueCard } from '@/components/VenueCard';

export const SearchResult = ({ venues }: { venues: VenueFull[] }) => {
  return (
    <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
};
