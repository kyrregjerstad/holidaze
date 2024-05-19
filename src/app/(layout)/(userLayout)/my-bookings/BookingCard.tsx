import Link from 'next/link';

import { differenceInDays } from 'date-fns';

import { Booking } from '@/lib/types';
import { formatUSD } from '@/lib/utils';
import { AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { VenueCardImage } from '@/components/VenueCardImage';

type Props = {
  booking: Booking;
  upcoming: boolean;
};
export const BookingCard = ({ booking, upcoming }: Props) => {
  const checkIn = new Date(booking.dateFrom).toDateString();
  const checkOut = new Date(booking.dateTo).toDateString();
  const totalDays = differenceInDays(new Date(booking.dateTo), new Date(booking.dateFrom));
  return (
    <Card className="flex max-w-md flex-col overflow-hidden">
      <Link href={`/venues/${booking.venue.id}`} className="group cursor-pointer">
        <CardHeader className=" p-0 pb-2">
          <div className="overflow-hidden">
            <VenueCardImage
              url={booking.venue.media?.at(0)?.url}
              name={booking.venue.name}
              description={booking.venue.description}
            />
          </div>
        </CardHeader>
      </Link>
      <div className="grid">
        <CardContent className="flex flex-col gap-2 truncate px-4 py-2">
          <Link href={`/venues/${booking.venue.id}`} className="group cursor-pointer">
            <CardTitle className="truncate group-hover:underline">{booking.venue.name}</CardTitle>
          </Link>
          <div className="">
            {checkIn} - {checkOut}
          </div>
          {booking.venue.location.city && booking.venue.location.country && (
            <span className="text-sm">
              {booking.venue.location.city}, {booking.venue.location.country}
            </span>
          )}
        </CardContent>
        <CardContent className="flex flex-col gap-2 px-4 py-2 text-right">
          <div className="flex flex-wrap gap-2">
            <Badge className="px-4 py-2">
              {booking.guests} {booking.guests > 1 ? 'guests' : 'guest'}
            </Badge>
            <Badge className="px-4 py-2">{formatUSD(booking.venue.price)} per night</Badge>
            <Badge className="px-4 py-2">
              {totalDays} {totalDays > 1 ? 'days' : 'day'}
            </Badge>
            <Badge className="px-4 py-2">Total: {formatUSD(booking.venue.price * totalDays)}</Badge>
          </div>
        </CardContent>
      </div>
      <div className="flex-1" />
      <CardFooter className="gap-2 p-4">
        <Link
          href={`/venues/${booking.venue.id}`}
          className={buttonVariants({ className: 'w-full' })}
        >
          View
        </Link>
        {upcoming && (
          <AlertDialogTrigger asChild>
            <Link
              className={buttonVariants({ variant: 'destructive' })}
              href={`/my-bookings?cancelBookingId=${booking.id}`}
              shallow
            >
              Cancel
            </Link>
          </AlertDialogTrigger>
        )}
      </CardFooter>
    </Card>
  );
};
