'use server';

import 'server-only';

import type { venueBaseSchema } from '@/lib/schema';
import type { z } from 'zod';

import { getAllVenues } from './getAllVenues';

type SortOptions = 'id' | 'name' | 'price' | 'rating' | 'created' | 'maxGuests';

type QueryParams = {
  _owner?: boolean;
  _bookings?: boolean;
  limit?: number;
  page?: number;
  sort?: SortOptions;
  sortOrder?: 'asc' | 'desc';
};

type BaseVenue = z.infer<typeof venueBaseSchema>;

export async function recursivelyGetAllVenues(
  venues: BaseVenue[] = [],
  page = 1
): Promise<BaseVenue[]> {
  const { venues: newVenues, error, meta } = await getAllVenues({ page });

  if (error || !newVenues) return venues;

  const allVenues = [...venues, ...newVenues];

  if (meta?.currentPage === meta?.totalCount) return allVenues;

  return recursivelyGetAllVenues(allVenues, page + 1);
}
export type VenueOptions = {
  owner?: boolean;
  bookings?: boolean;
};
