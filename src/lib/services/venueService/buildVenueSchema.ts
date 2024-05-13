import { z } from 'zod';

import {
  bookingSchema,
  ownerSchema,
  venueSchema,
} from '@/lib/schema/venueSchema';

export function buildVenueSchema(options: {
  owner?: boolean;
  bookings?: boolean;
}) {
  let schema = venueSchema;

  if (options.owner) {
    schema = schema.extend({
      owner: ownerSchema,
    });
  }

  if (options.bookings) {
    schema = schema.extend({
      bookings: z.array(bookingSchema),
    });
  }

  return schema;
}
