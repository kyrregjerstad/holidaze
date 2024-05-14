'use server';

import type { ApiResponseBase } from '@/lib/api/types';
import type { VenueOptions } from './recursivelyGetAllVenues';

import { z } from 'zod';

import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createApiResponseSchema } from '@/lib/schema/apiSchema';
import { buildVenueSchema } from './buildVenueSchema';

interface GetVenuesBySearchTermReturn<T> extends ApiResponseBase<T> {
  venues: T[];
}

const schema = z.array(buildVenueSchema({ owner: true, bookings: true }));

export async function getVenuesBySearchTerm(
  searchTerm: string,
  options: { owner: true; bookings: true }
): Promise<GetVenuesBySearchTermReturn<z.infer<ReturnType<typeof buildVenueSchema>>>>;
export async function getVenuesBySearchTerm(
  searchTerm: string,
  options: { owner: true; bookings?: false }
): Promise<GetVenuesBySearchTermReturn<z.infer<ReturnType<typeof buildVenueSchema>>>>;
export async function getVenuesBySearchTerm(
  searchTerm: string,
  options: { owner?: false; bookings: true }
): Promise<GetVenuesBySearchTermReturn<z.infer<ReturnType<typeof buildVenueSchema>>>>;
export async function getVenuesBySearchTerm(
  searchTerm: string,
  options?: { owner?: false; bookings?: false }
): Promise<GetVenuesBySearchTermReturn<z.infer<ReturnType<typeof buildVenueSchema>>>>;

export async function getVenuesBySearchTerm(
  searchTerm: string,
  options: VenueOptions = {
    owner: true,
    bookings: true,
  }
): Promise<GetVenuesBySearchTermReturn<z.infer<typeof schema>>> {
  const { res, error, status } = await holidazeAPI({
    endpoint: '/venues/search',
    query: {
      q: searchTerm,
      _bookings: options.bookings ?? true,
      _owner: options.owner ?? true,
    },
    schema: createApiResponseSchema(z.array(buildVenueSchema({ ...options }))),
  });

  return { venues: res?.data || [], error, status };
}
