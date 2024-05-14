'use server';

import type { ApiResponseBase } from '@/lib/api/types';
import type { VenueFull } from '@/lib/types';

import { getAllVenues } from './getAllVenues';
import { constructFilters, sortVenues } from './searchFilters';

interface SearchReturn<T> extends ApiResponseBase<T> {
  venues: T[];
}

export type SortField = 'price' | 'maxGuests' | 'name' | 'created' | 'updated';
export type SortOrder = 'asc' | 'desc';

export type SearchOptions = {
  searchText?: string;
  price?: {
    min?: number;
    max?: number;
  };
  location?: string;
  amenities?: {
    wifi?: boolean;
    parking?: boolean;
  };
  availability?: {
    dateFrom?: string;
    dateTo?: string;
    flexible?: boolean;
  };
  minGuests?: number;
  sort?: {
    field: SortField;
    order: SortOrder;
  };
};

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
    venues: sortedVenues,
    error: error,
    status,
    meta,
  };
}
