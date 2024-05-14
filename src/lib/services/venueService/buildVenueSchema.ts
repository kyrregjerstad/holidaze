import type { VenueBase, VenueFull, VenueWithBookings, VenueWithOwner } from '@/lib/types';

import { z } from 'zod';

import { bookingSchema, ownerSchema, venueBaseSchema } from '@/lib/schema/venueSchema';

export function buildVenueSchema(options: { owner: true; bookings: true }): z.ZodSchema<VenueFull>;
export function buildVenueSchema(options: {
  owner: true;
  bookings: false;
}): z.ZodSchema<VenueWithOwner>;
export function buildVenueSchema(options: {
  owner: false;
  bookings: true;
}): z.ZodSchema<VenueWithBookings>;
export function buildVenueSchema(options: {
  owner: false;
  bookings: false;
}): z.ZodSchema<VenueBase>;
export function buildVenueSchema(options: {
  owner: boolean;
  bookings: boolean;
}): z.ZodSchema<VenueFull | VenueWithOwner | VenueWithBookings | VenueBase>;

export function buildVenueSchema(
  options: { owner?: boolean; bookings?: boolean } = {
    owner: false,
    bookings: false,
  }
): z.ZodSchema<VenueFull | VenueWithOwner | VenueWithBookings | VenueBase> {
  let schema = venueBaseSchema;

  if (options.owner === true) {
    schema = schema.extend({ owner: ownerSchema });
  }

  if (options.bookings === true) {
    schema = schema.extend({ bookings: z.array(bookingSchema) });
  }

  return schema;
}
