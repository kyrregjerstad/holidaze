import type { VenueBase, VenueFull } from '@/lib/types';

import Link from 'next/link';

import { formatUSD } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { VenueCardImage } from '../VenueCardImage';

export const VenueCardChat = ({ venue }: { venue: VenueBase }) => {
  return (
    <Card className="overflow-hidden">
      <Link href={`/venues/${venue.id}`} className="group cursor-pointer">
        <CardHeader className="p-0">
          <div className="aspect-square overflow-hidden">
            <VenueCardImage
              url={venue.media?.at(0)?.url}
              name={venue.name}
              description={venue.description}
            />
          </div>
        </CardHeader>
        <CardContent className="truncate p-0 px-2">
          <CardTitle className="truncate p-0 text-lg group-hover:underline">{venue.name}</CardTitle>
          {venue.location.city && venue.location.country ? (
            <span className="text-sm">
              {venue.location.city}, {venue.location.country}
            </span>
          ) : (
            <div className="py-1"></div>
          )}
        </CardContent>
        <CardFooter className="p-2 pt-0">
          <div className="flex flex-col items-center justify-between">
            <span className="max-w-[150px] truncate">{formatUSD(venue.price)} per night</span>
          </div>
          <div></div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export const VenueDetailsCardChat = ({ venue }: { venue: VenueFull }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="overflow-hidden">
          <Link href={`/venues/${venue.id}`} className="cursor-pointer">
            <VenueCardImage
              url={venue.media?.at(0)?.url}
              name={venue.name}
              description={venue.description}
            />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="truncate p-0 px-2">
        <Link href={`/venues/${venue.id}`} className="group cursor-pointer">
          <CardTitle className="truncate p-0 text-lg group-hover:underline">{venue.name}</CardTitle>
        </Link>
        <div>
          {venue.location.city && venue.location.country ? (
            <span className="text-sm">
              {venue.location.city}, {venue.location.country}
            </span>
          ) : (
            <div className="py-1"></div>
          )}
        </div>
        <div>
          <span className="text-sm">{venue.maxGuests} guests</span>
        </div>

        <span className="max-w-[150px] truncate">{formatUSD(venue.price)} per night</span>
      </CardContent>
      <CardFooter className="flex flex-col p-2">
        <Button className="w-full">Reserve</Button>
        <span className="py-2 text-sm text-neutral-400">You won't be charged yet</span>
      </CardFooter>
    </Card>
  );
};

export const VenueCardChatSkeleton = () => {
  return (
    <Card className="grid gap-2">
      <Skeleton className="aspect-square" />
      <div className="grid gap-2 p-2">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>
    </Card>
  );
};
