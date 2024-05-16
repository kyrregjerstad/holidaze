import { z } from 'zod';

import { amenitiesSchema } from '@/lib/schema';

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
