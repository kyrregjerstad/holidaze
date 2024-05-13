'use server';
import { z } from 'zod';
import { createApiResponseSchema } from '@/lib/schema/apiSchema';
import {
  bookingSchema,
  ownerSchema,
  venueSchema,
} from '@/lib/schema/venueSchema';
import { holidazeAPI } from '@/lib/api/holidazeAPI';

export async function getVenueById(id: string) {
  const { res, error, status } = await holidazeAPI({
    endpoint: `/venues/${id}`,
    query: {
      _owner: true,
      _bookings: true,
    },
    schema: createApiResponseSchema(
      venueSchema.extend({
        bookings: z.array(bookingSchema),
        owner: ownerSchema,
      })
    ),
  });

  return { venue: res?.data || null, error, status };
}

export type Venue = NonNullable<
  Awaited<ReturnType<typeof getVenueById>>['venue']
>;
