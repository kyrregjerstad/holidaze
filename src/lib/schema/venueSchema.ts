import { z } from 'zod';

export const locationSchema = z.object({
  address: z.string().nullable(),
  city: z.string().nullable(),
  zip: z.string().nullable(),
  country: z.string().nullable(),
  continent: z.string().nullable(),
  lat: z.number().nullish(),
  lng: z.number().nullish(),
});

export const amenitiesSchema = z.object({
  wifi: z.boolean().nullish(),
  parking: z.boolean(),
  breakfast: z.boolean(),
  pets: z.boolean(),
});

export type Amenities = z.infer<typeof amenitiesSchema>;

export const amenityEnum = z.enum(['wifi', 'parking', 'breakfast', 'pets']);

export const amenitiesKeysSchema = z.array(amenityEnum);

const mediaSchema = z.object({
  url: z.string(),
  alt: z.string(),
});

export const venueSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  media: z.array(mediaSchema),
  price: z.number(),
  maxGuests: z.number(),
  rating: z.number(),
  created: z.string(),
  updated: z.string(),
  meta: amenitiesSchema,
  location: locationSchema,
});

export const bookingSchema = z.object({
  id: z.string(),
  dateFrom: z.string(),
  dateTo: z.string(),
  guests: z.number(),
  created: z.string(),
  updated: z.string(),
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
    bio: z.string().nullable(),
    avatar: mediaSchema.nullable(),
    banner: mediaSchema.nullable(),
  }),
});

export const ownerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  bio: z.string().nullable(),
  avatar: mediaSchema.nullable(),
  banner: mediaSchema.nullable(),
});

export const venueSchemaExtended = venueSchema.extend({
  owner: ownerSchema,
  bookings: z.array(bookingSchema),
});
