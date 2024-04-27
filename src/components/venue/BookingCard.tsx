import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { venueSchemaExtended } from '@/lib/schema/venueSchema';
import { fetchCreateBooking } from '@/lib/services/bookingService';
import { z } from 'zod';
import { BookingFormContent } from './BookingFormContent';

type Props = {
  venue: z.infer<typeof venueSchemaExtended>;
};
export const BookingCard = ({ venue }: Props) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formattedTomorrow = tomorrow.toLocaleDateString();

  const inOneWeek = new Date(today);
  inOneWeek.setDate(inOneWeek.getDate() + 7);

  const formattedInOneWeek = inOneWeek.toLocaleDateString();

  const bookedDates = extractBookedDates(venue.bookings);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          ${venue.price}
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            / night
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <form
          className="grid gap-6"
          action={async () => {
            'use server';
            const res = await fetchCreateBooking({
              dateFrom: '2022-01-01T00:00:00.000Z',
              dateTo: '2022-01-03T00:00:00.000Z',
              guests: 2,
              venueId: venue.id,
            });

            console.log(res);
          }}
        >
          <BookingFormContent
            bookedDates={bookedDates}
            price={venue.price}
            maxGuests={venue.maxGuests}
          />
        </form>
      </CardContent>
    </Card>
  );
};

function extractBookedDates(bookings: { dateFrom: string; dateTo: string }[]) {
  return bookings.flatMap(({ dateFrom, dateTo }) => {
    const start = new Date(dateFrom);
    const end = new Date(dateTo);
    return generateDates(start, end);
  });
}

function generateDates(start: Date, end: Date): Date[] {
  if (start > end) {
    return [];
  } else {
    const nextDate = new Date(start);
    nextDate.setDate(nextDate.getDate() + 1);
    return [new Date(start), ...generateDates(nextDate, end)];
  }
}
