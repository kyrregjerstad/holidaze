import { z } from 'zod';

const locationSchema = z.object({
  address: z.string().nullable(),
  city: z.string().nullable(),
  zip: z.string().nullable(),
  country: z.string().nullable(),
  continent: z.string().nullable(),
  lat: z.number().optional(),
  long: z.number().optional(),
});

const metaSchema = z.object({
  Wifi: z.boolean().optional(),
  parking: z.boolean(),
  breakfast: z.boolean(),
  pets: z.boolean(),
});

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
  meta: metaSchema,
  location: locationSchema,
});
