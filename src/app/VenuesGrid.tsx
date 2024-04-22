import { VenueCard } from '@/components/VenueCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fetchAllVenues } from '@/lib/services/venuesService';
import Link from 'next/link';
import { Suspense } from 'react';

export const VenuesGrid = async () => {
  const { venues, error } = await fetchAllVenues();

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
};
