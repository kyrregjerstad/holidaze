'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { venueSchemaExtended } from '@/lib/schema/venueSchema';

import { z } from 'zod';

type Props = {
  venue: z.infer<typeof venueSchemaExtended>;
};
export const BookingPreviewCard = ({ venue }: Props) => {
  const today = new Date();
  const tomorrow = new Date(today);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          ${venue.price}
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            /night
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6"></CardContent>
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
