import { parseISO, startOfDay } from 'date-fns';

import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createApiResponseSchema, venueSchemaFull } from '@/lib/schema';
import { findNextAvailableDate } from './findNextAvailableDate';

type NextAvailableParams = {
  venueId: string;
  startDate: Date;
  days: number;
};

export async function getNextAvailableDates({ venueId, startDate, days }: NextAvailableParams) {
  const { res, error, status } = await holidazeAPI({
    endpoint: `/venues/${venueId}`,
    query: {
      _owner: true,
      _bookings: true,
    },
    schema: createApiResponseSchema(venueSchemaFull),
  });

  if (error || !res) return { availableDates: [], venue: null, error: error || 'No response' };

  const bookings = filterAndSortBookings(res.data.bookings, startDate);

  const availableDate = findNextAvailableDate(bookings, days);

  return { availableDate, venue: res.data, error, status };
}

export type Booking = {
  from: Date;
  to: Date;
};

export function filterAndSortBookings(
  bookings: { dateFrom: string; dateTo: string }[],
  startDate: Date
): Booking[] {
  return bookings
    .map((booking) => ({
      from: startOfDay(parseISO(booking.dateFrom)),
      to: startOfDay(parseISO(booking.dateTo)),
    }))
    .filter((booking) => booking.to >= startOfDay(startDate))
    .sort((a, b) => a.from.getTime() - b.from.getTime());
}
