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
  wifi: z.boolean(),
  parking: z.boolean(),
  breakfast: z.boolean(),
  pets: z.boolean(),
});

export const amenityEnum = z.enum(['wifi', 'parking', 'breakfast', 'pets']);

export const amenitiesKeysSchema = z.array(amenityEnum);

const mediaSchema = z.object({
  url: z.string(),
  alt: z.string(),
});

export const venueBaseSchema = z.object({
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

export const venueSchemaFull = venueBaseSchema.extend({
  owner: ownerSchema,
  bookings: z.array(bookingSchema),
});

export const venueSchemaWithBookings = venueBaseSchema.extend({
  bookings: z.array(bookingSchema),
});

export const venueSchemaWithOwner = venueBaseSchema.extend({
  owner: ownerSchema,
});

export const createVenueSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  maxGuests: z.number(),
  meta: amenitiesSchema,
  location: locationSchema,
  media: z.array(mediaSchema),
});

export const createVenueSchemaBase = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(255, 'Name must be at most 255 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be at most 500 characters'),
  price: z.coerce
    .number()
    .min(1, 'Price must be more than $1')
    .max(10000, 'Price must be less than $10,000'),
  maxGuests: z.coerce
    .number()
    .min(1, 'Minimum 1 guest')
    .max(100, 'Max 100 guests'),
});

export const createVenueSchemaFlattened = createVenueSchemaBase
  .merge(amenitiesSchema)
  .merge(locationSchema)
  .merge(z.object({ media: z.array(mediaSchema) }));
