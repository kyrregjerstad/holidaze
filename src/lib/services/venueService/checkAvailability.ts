'use server';

import { isAfter, isBefore, isWithinInterval, parseISO } from 'date-fns';

import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createApiResponseSchema } from '@/lib/schema/apiSchema';
import { venueSchemaFull } from '@/lib/schema/venueSchema';

type Params = {
  venueId: string;
  startDate: Date;
  endDate: Date;
};
export async function checkAvailability({ venueId, startDate, endDate }: Params) {
  const { res, error, status } = await holidazeAPI({
    endpoint: `/venues/${venueId}`,
    query: {
      _owner: true,
      _bookings: true,
    },
    schema: createApiResponseSchema(venueSchemaFull),
    cacheTags: [`venue-${venueId}`],
  });

  if (!res?.data || error) {
    return { available: false, venue: null, error, status };
  }

  const isAvailable = checkDateDateRangeAvailability(startDate, endDate, res.data.bookings);

  return { available: isAvailable, venue: res.data, error, status };
}

function checkDateDateRangeAvailability(
  startDate: Date,
  endDate: Date,
  bookings: { dateFrom: string; dateTo: string }[]
) {
  for (const booking of bookings) {
    const bookedDateStart = parseISO(booking.dateFrom);
    const bookedDateEnd = parseISO(booking.dateTo);

    if (
      isWithinInterval(startDate, { start: bookedDateStart, end: bookedDateEnd }) ||
      isWithinInterval(endDate, { start: bookedDateStart, end: bookedDateEnd }) ||
      (isBefore(startDate, bookedDateStart) && isAfter(endDate, bookedDateEnd))
    ) {
      return false;
    }
  }
  return true;
}
