import type {
  amenitiesSchema,
  createVenueSchema,
  venueBaseSchema,
  venueSchemaFull,
  venueSchemaWithBookings,
  venueSchemaWithOwner,
} from '@/lib/schema';
import type { z } from 'zod';

export type VenueBase = z.infer<typeof venueBaseSchema>;
export type VenueWithBookings = z.infer<typeof venueSchemaWithBookings>;
export type VenueWithOwner = z.infer<typeof venueSchemaWithOwner>;
export type VenueFull = z.infer<typeof venueSchemaFull>;

export type Amenities = z.infer<typeof amenitiesSchema>;
export type CreateVenue = z.infer<typeof createVenueSchema>;

export interface ServiceReturn {
  error: z.ZodError | null;
  status: number;
}
