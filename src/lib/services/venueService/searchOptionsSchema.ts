import { z } from 'zod';

import { amenitiesKeysSchema, amenitiesSchema } from '@/lib/schema';

export const searchOptionsSchema = z.object({
  searchText: z
    .string()
    .optional()
    .describe('Fuzzy searches the name and description of the venue'),
  price: z
    .object({
      min: z.number().optional().describe('Minimum price per night, in USD'),
      max: z.number().optional().describe('Maximum price per night, in USD'),
    })
    .optional()
    .describe('Price range per night'),
  location: z
    .string()
    .optional()
    .describe('Fuzzy searches the location of the venue, can match city, country, etc.'),
  amenities: amenitiesSchema.partial().optional(),
  availability: z
    .object({
      dateFrom: z.string().optional().describe('Date as a string in DD-MM-YYYY format'),
      dateTo: z.string().optional().describe('Date as a string in DD-MM-YYYY format'),
      flexible: z.boolean().optional().describe('If true, the date range is flexible'),
    })
    .optional(),
  minGuests: z.number().optional().describe('Minimum number of guests'),
  sort: z
    .object({
      field: z
        .enum(['price', 'maxGuests', 'name', 'created', 'updated'])
        .describe('Field to sort by'),
      order: z.enum(['asc', 'desc']).describe('Sort order'),
    })
    .optional(),
  amount: z.number().optional().describe('Amount of venues to return'),
});

export type SearchOptions = z.infer<typeof searchOptionsSchema>;

/* This is used for query params, since we cannot have nested objects */
export const flatSearchOptionsSchema = z.object({
  searchText: z
    .string()
    .optional()
    .describe('Fuzzy searches the name and description of the venue'),
  priceMin: z.coerce.number().optional().describe('Minimum price per night, in USD'),
  priceMax: z.coerce.number().optional().describe('Maximum price per night, in USD'),
  location: z
    .string()
    .optional()
    .describe('Fuzzy searches the location of the venue, can match city, country, etc.'),
  dateFrom: z.string().optional().describe('Date as a string in DD-MM-YYYY format'),
  dateTo: z.string().optional().describe('Date as a string in DD-MM-YYYY format'),
  flexible: z.coerce.boolean().optional().describe('If true, the date range is flexible'),
  minGuests: z.coerce.number().optional().describe('Minimum number of guests'),
  amenities: amenitiesKeysSchema.optional(),
  sortField: z
    .enum(['price', 'maxGuests', 'name', 'created', 'updated'])
    .optional()
    .describe('Field to sort by'),
  sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order'),
});

export type FlatSearchOptions = z.infer<typeof flatSearchOptionsSchema>;
