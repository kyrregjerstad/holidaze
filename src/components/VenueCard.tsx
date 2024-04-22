import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { venueSchema } from '@/lib/schema/venueSchema';
import { Venue } from '@/lib/services/venuesService';
import Link from 'next/link';
import { z } from 'zod';

export const VenueCard = ({
  venue,
}: {
  venue: z.infer<typeof venueSchema>;
}) => {
  return (
    <Card>
      <Link href={`/venues/${venue.id}`} className="group cursor-pointer">
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
          <span className="mt-4 inline-flex items-center font-semibold group-hover:underline">
            View Details
          </span>
        </CardContent>
      </Link>
    </Card>
  );
};
