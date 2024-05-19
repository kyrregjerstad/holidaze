'use server';

import { revalidateTag } from 'next/cache';

import { z } from 'zod';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { getAccessTokenCookie } from '@/lib/api/getAccessToken';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createApiError, createApiResponseSchema } from '@/lib/schema';

type CancelBooking = {
  venueId: string;
};

type CancelBookingReturn = {
  error: z.ZodError | null;
  status: number;
};

export async function cancelBooking(data: CancelBooking): Promise<CancelBookingReturn> {
  const accessToken = await getAccessTokenCookie();

  if (!accessToken) {
    return {
      error: createApiError({
        message: 'Unauthorized',
      }),
      status: 401,
    };
  }

  const { error, status } = await holidazeAPI({
    method: 'DELETE',
    endpoint: `/bookings/${data.venueId}`,
    headers: await createAuthHeaders(accessToken),
    schema: createApiResponseSchema(statusSchema),
  });

  if (status === 204) {
    revalidateTag(`venue-${data.venueId}`);
  }

  return { error, status };
}

const statusSchema = z.never();
