import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { venueSchema } from '@/lib/schema/venueSchema';
import Link from 'next/link';
import { z } from 'zod';
import { VenueCardImage } from './VenueCardImage';

export const VenueCard = ({
  venue,
}: {
  venue: z.infer<typeof venueSchema>;
}) => {
  return (
    <Card>
      <Link href={`/venues/${venue.id}`} className="group cursor-pointer">
        <CardHeader>
          <div className="overflow-hidden">
            <VenueCardImage
              url={venue.media?.at(0)?.url}
              name={venue.name}
              description={venue.description}
            />
          </div>
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
