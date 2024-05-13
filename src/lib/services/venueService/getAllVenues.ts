import { z } from 'zod';

import { holidazeAPI } from '@/lib/api/holidazeAPI';
import {
  ApiMetaPartial,
  createApiResponseSchema,
} from '@/lib/schema/apiSchema';
import { buildVenueSchema } from './buildVenueSchema';
import {
  BaseVenue,
  VenueWithBookings,
  VenueWithOwner,
  VenueWithOwnerAndBookings,
} from './types';

type GetAllVenuesReturn<T> = {
  venues: T[];
  meta: ApiMetaPartial | null;
  error: z.ZodError<T> | null;
  status: number;
};

export function getAllVenues(options: {
  owner: true;
  bookings: true;
  limit?: number;
  page?: number;
}): Promise<GetAllVenuesReturn<VenueWithOwnerAndBookings>>;
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
  owner?: false;
  bookings?: false;
  limit?: number;
  page?: number;
}): Promise<GetAllVenuesReturn<BaseVenue>>;

export async function getAllVenues(
  options: {
    owner?: boolean;
    bookings?: boolean;
    limit?: number;
    page?: number;
  } = {}
): Promise<
  GetAllVenuesReturn<
    BaseVenue | VenueWithBookings | VenueWithOwner | VenueWithOwnerAndBookings
  >
> {
  const { res, error, status } = await holidazeAPI({
    endpoint: '/venues',
    query: {
      _owner: options.owner ?? false,
      _bookings: options.bookings ?? false,
      _limit: options.limit ?? 100,
      _page: options.page ?? 1,
    },
    schema: createApiResponseSchema(z.array(buildVenueSchema({ ...options }))),
  });

  if (!res || res.data.length === 0)
    return { venues: [], meta: null, error, status };

  return { venues: res.data, meta: res.meta, error, status };
}
