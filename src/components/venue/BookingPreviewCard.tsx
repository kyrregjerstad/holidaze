import type { venueSchemaFull } from '@/lib/schema/venueSchema';
import type { z } from 'zod';

import Link from 'next/link';

import { differenceInDays, parseISO } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '../ui/badge';

type Props = {
  venue: z.infer<typeof venueSchemaFull>;
  booking: { dateFrom: string; dateTo: string; guests: number };
  headerLink?: boolean;
};
export const BookingPreviewCard = ({ venue, booking, headerLink }: Props) => {
  const amountOfDays = differenceInDays(parseISO(booking.dateTo), parseISO(booking.dateFrom));

  return (
    <Card>
      <CardHeader className="">
        <CardTitle>
          <span className="block text-lg font-normal">Your upcoming booking at</span>
          {headerLink ? (
            <Link href={`/venues/${venue.id}`} className="hover:underline">
              <span>{venue.name}</span>
            </Link>
          ) : (
            <span>{venue.name}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="pb-4 text-lg">
          {parseISO(booking.dateFrom).toDateString()} - {parseISO(booking.dateTo).toDateString()}
        </div>
        <div className="flex gap-2 pt-2">
          <Badge className="px-4 py-2">
            {amountOfDays} night{amountOfDays > 1 ? 's' : ''}
          </Badge>
          <Badge className="px-4 py-2">
            {booking.guests} {booking.guests > 1 ? 'guests' : 'guest'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
