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
        <Card key={venue.id}>
          <Link href={`/venues/${venue.id}`} className="cursor-pointer">
            <CardHeader>
              <img
                alt={`Holidaze featured Home: ${venue.name} - ${venue.description}`}
                className="h-48 w-full object-cover"
                height="200"
                src={venue.media.at(0)?.url || '/placeholder.jpg'}
                style={{
                  aspectRatio: '300/200',
                  objectFit: 'cover',
                }}
                width="300"
              />
            </CardHeader>
            <CardContent>
              <CardTitle>{venue.name}</CardTitle>
              <CardDescription>{venue.description}</CardDescription>
              <span className="mt-4 inline-flex items-center font-semibold">
                View Details
              </span>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
};
