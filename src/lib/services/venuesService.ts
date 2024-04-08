import { z } from 'zod';
import { API_BASE_URL } from '../constants';
import { useFetch } from '../hooks/useFetch';
import { createApiResponseSchema } from '../schema/apiSchema';
import { venueSchema } from '../schema/venueSchema';

export async function fetchAllVenues() {
  const { data, error } = await useFetch({
    url: `${API_BASE_URL}/holidaze/venues`,
    schema: createApiResponseSchema(z.array(venueSchema)),
  });
  return { venues: data, error };
}
