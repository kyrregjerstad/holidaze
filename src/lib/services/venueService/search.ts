'use server';

import type { ApiResponseBase } from '@/lib/api/types';
import type { VenueFull } from '@/lib/types';

import { z } from 'zod';

import { getAllVenues } from './getAllVenues';
import { constructFilters, sortVenues } from './searchFilters';
import { searchOptionsSchema } from './searchOptionsSchema';

interface SearchReturn<T> extends ApiResponseBase<T> {
  venues: T[];
}

export type SortField = 'price' | 'maxGuests' | 'name' | 'created' | 'updated';
export type SortOrder = 'asc' | 'desc';

export type SearchOptions = z.infer<typeof searchOptionsSchema>;

export async function search(options: SearchOptions): Promise<SearchReturn<VenueFull>> {
  const { venues, error, status, meta } = await getAllVenues({
    bookings: true,
    owner: true,
  });

  const filteredVenues = venues.filter((venue) =>
    constructFilters(options).every((filter) => filter?.(venue))
  );

  const sortedVenues = options.sort ? sortVenues(filteredVenues, options.sort) : filteredVenues;

  return {
    venues: sortedVenues.slice(0, options.amount ?? 100),
    error: error,
    status,
    meta,
  };
}
