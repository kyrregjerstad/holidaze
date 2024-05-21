'use server';

import { revalidateTag } from 'next/cache';

import { z } from 'zod';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { getAccessTokenCookie } from '@/lib/api/getAccessToken';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { ServiceReturnBase } from '@/lib/api/types';
import { createApiError, createApiResponseSchema } from '@/lib/schema';

type CancelBooking = {
  venueId: string;
};

interface CancelBookingReturn<T> extends ServiceReturnBase<T> {
  res: T;
}

export async function cancelBooking(data: CancelBooking): Promise<CancelBookingReturn<string>> {
  const accessToken = await getAccessTokenCookie();

  if (!accessToken) {
    return {
      error: createApiError({
        message: 'Unauthorized',
      }).format(),
      status: 401,
      res: 'Unauthorized',
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

  return { error, status, res: 'success' };
}

const statusSchema = z.never();
