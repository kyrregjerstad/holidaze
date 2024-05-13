import { differenceInDays, parseISO } from 'date-fns';
import { z } from 'zod';

import { venueSchemaExtended } from '@/lib/schema/venueSchema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '../ui/badge';

type Props = {
  venue: z.infer<typeof venueSchemaExtended>;
  user: { name: string } | null;
};
export const BookingPreviewCard = ({ venue, user }: Props) => {
  if (!user?.name) return null;

  const nextUserBooking = venue.bookings.find(
    (booking) => booking.customer.name === user.name
  );

  if (!nextUserBooking) {
    return null;
  }

  const amountOfDays = differenceInDays(
    parseISO(nextUserBooking.dateTo),
    parseISO(nextUserBooking.dateFrom)
  );

  return (
    <Card>
      <CardHeader className="">
        <CardTitle>
          <span className="block text-lg font-normal">
            Your upcoming booking at
          </span>
          <span>{venue.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="pb-4 text-lg">
          {parseISO(nextUserBooking.dateFrom).toDateString()} -{' '}
          {parseISO(nextUserBooking.dateTo).toDateString()}
        </div>
        <div className="flex gap-2 pt-2">
          <Badge className="px-4 py-2">
            {amountOfDays} night{amountOfDays > 1 ? 's' : ''}
          </Badge>
          <Badge className="px-4 py-2">{nextUserBooking.guests} guests</Badge>
        </div>
      </CardContent>
    </Card>
  );
};
