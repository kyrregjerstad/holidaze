import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { venueSchema } from '@/lib/schema/venueSchema';
import { formatUSD } from '@/lib/utils';
import Link from 'next/link';
import { z } from 'zod';
import { VenueCardImage } from './VenueCardImage';

export const VenueCard = ({
  venue,
}: {
  venue: z.infer<typeof venueSchema>;
}) => {
  return (
    <Card className="overflow-hidden">
      <Link href={`/venues/${venue.id}`} className="group cursor-pointer">
        <CardHeader className=" p-0 pb-2">
          <div className="overflow-hidden">
            <VenueCardImage
              url={venue.media?.at(0)?.url}
              name={venue.name}
              description={venue.description}
            />
          </div>
        </CardHeader>
        <CardContent className="truncate px-4 py-2">
          <CardTitle className="truncate group-hover:underline">
            {venue.name}
          </CardTitle>
          {venue.location.city && venue.location.country ? (
            <span className="text-sm">
              {venue.location.city}, {venue.location.country}
            </span>
          ) : (
            <div className="py-3"></div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex flex-col items-center justify-between">
            <span className="max-w-[150px] truncate">
              {formatUSD(venue.price)} per night
            </span>
          </div>
          <div></div>
        </CardFooter>
      </Link>
    </Card>
  );
};
