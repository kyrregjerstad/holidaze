import type { ApiResponseBase } from '@/lib/api/types';
import type {
  VenueBase,
  VenueFull,
  VenueWithBookings,
  VenueWithOwner,
} from '@/lib/types';

import { z } from 'zod';

import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createApiResponseSchema } from '@/lib/schema/apiSchema';
import { buildVenueSchema } from './buildVenueSchema';

interface GetAllVenuesReturn<T> extends ApiResponseBase<T> {
  venues: T[];
}

export function getAllVenues(options: {
  owner: true;
  bookings: true;
  limit?: number;
  page?: number;
}): Promise<GetAllVenuesReturn<VenueFull>>;
export function getAllVenues(options: {
  owner: true;
  bookings?: false;
  limit?: number;
  page?: number;
}): Promise<GetAllVenuesReturn<VenueWithOwner>>;
export function getAllVenues(options: {
  owner?: false;
  bookings: true;
  limit?: number;
  page?: number;
}): Promise<GetAllVenuesReturn<VenueWithBookings>>;
export function getAllVenues(options?: {
  owner?: boolean;
  bookings?: boolean;
  limit?: number;
  page?: number;
}): Promise<
  GetAllVenuesReturn<VenueBase | VenueWithBookings | VenueWithOwner | VenueFull>
>;

export async function getAllVenues(
  options: {
    owner?: boolean;
    bookings?: boolean;
    limit?: number;
    page?: number;
  } = {}
): Promise<
  GetAllVenuesReturn<VenueBase | VenueWithBookings | VenueWithOwner | VenueFull>
> {
  const schema = buildVenueSchema({
    owner: options.owner ?? false,
    bookings: options.bookings ?? false,
  });

  const { res, error, status } = await holidazeAPI({
    endpoint: '/venues',
    query: {
      _owner: options.owner ?? false,
      _bookings: options.bookings ?? false,
      _limit: options.limit ?? 100,
      _page: options.page ?? 1,
    },
    schema: createApiResponseSchema(z.array(schema)),
  });

  if (!res || res.data.length === 0)
    return { venues: [], meta: null, error, status };

  return { venues: res.data, meta: res.meta, error, status };
}
