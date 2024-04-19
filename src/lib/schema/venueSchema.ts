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

const metaSchema = z.object({
  Wifi: z.boolean().nullish(),
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

export const venueSchemaExtended = venueSchema.extend({
  owner: z.object({
    name: z.string(),
    email: z.string().email(),
    bio: z.string().nullable(),
    avatar: mediaSchema.nullable(),
    banner: mediaSchema.nullable(),
  }),
  bookings: z.array(
    z.object({
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
    })
  ),
});
