import { z } from 'zod';

import { ApiMetaPartial } from '@/lib/schema/apiSchema';
import { venueSchema, venueSchemaExtended } from '@/lib/schema/venueSchema';

export type VenueOptions = {
  owner?: boolean;
  bookings?: boolean;
};

export type BaseVenue = z.infer<typeof venueSchema>;
export type VenueWithOwnerAndBookings = z.infer<typeof venueSchemaExtended>;
export type VenueWithOwner = Omit<VenueWithOwnerAndBookings, 'bookings'>;
export type VenueWithBookings = Omit<VenueWithOwnerAndBookings, 'owner'>;

export type GetAllVenuesReturn<T> = {
  venues: T;
  meta: ApiMetaPartial | null;
  error: unknown;
  status: number;
};
