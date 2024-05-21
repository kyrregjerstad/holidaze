import { afterEach } from 'node:test';

import { revalidateTag } from 'next/cache';

import { describe, expect, it, vi } from 'vitest';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { getAccessTokenCookie } from '@/lib/api/getAccessToken';
import { createMockHeaders } from '@/lib/mocks/mockUtils';
import { cancelBooking } from '@/lib/services/bookingService';

fetchMock.enableMocks();

vi.mock('@/lib/api/getAccessToken', () => ({
  getAccessTokenCookie: vi.fn(),
}));

vi.mock('@/lib/api/createAuthHeaders', () => ({
  createAuthHeaders: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
}));

describe('cancelBooking', () => {
  afterEach(() => {
    fetchMock.resetMocks();
    vi.resetAllMocks();
  });

  const mockData = {
    venueId: '123',
  };

  it('should return success when booking is canceled', async () => {
    vi.mocked(getAccessTokenCookie).mockResolvedValue('fake-access-token');
    vi.mocked(createAuthHeaders).mockResolvedValue(createMockHeaders());
    fetchMock.mockResponseOnce('', { status: 204 });

    const result = await cancelBooking(mockData);

    expect(result).toEqual({ res: 'success', error: null, status: 204 });
    expect(revalidateTag).toHaveBeenCalledWith('venue-123');
  });

  it('should return an error message when user is unauthorized', async () => {
    vi.mocked(getAccessTokenCookie).mockResolvedValue(undefined);

    const result = await cancelBooking(mockData);

    expect(result).toEqual({
      res: 'Unauthorized',
      error: { _errors: ['Unauthorized'] },
      status: 401,
    });
  });

  it('should return an error message when API request fails', async () => {
    const errorResponse = { errors: [{ message: 'Booking not found' }] };
    vi.mocked(getAccessTokenCookie).mockResolvedValue('fake-access-token');
    vi.mocked(createAuthHeaders).mockResolvedValue(createMockHeaders());
    fetchMock.mockResponseOnce(JSON.stringify(errorResponse), { status: 400 });

    const result = await cancelBooking(mockData);

    expect(result.res).toBe('success');
    expect(result.error).not.toBeNull();
    expect(result.status).toBe(400);
  });

  it('should handle network errors', async () => {
    vi.mocked(getAccessTokenCookie).mockResolvedValue('fake-access-token');
    vi.mocked(createAuthHeaders).mockResolvedValue(createMockHeaders());
    fetchMock.mockRejectOnce(new Error('Network error'));

    const result = await cancelBooking(mockData);

    expect(result.res).toBe('success');
    expect(result.error).not.toBeNull();
    expect(result.status).toBe(500);
  });
});
