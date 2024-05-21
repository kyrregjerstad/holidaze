import { afterEach } from 'node:test';

import { describe, expect, it, vi } from 'vitest';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { getAccessTokenCookie } from '@/lib/api/getAccessToken';
import { createBooking } from '@/lib/services/bookingService';
import { createMockHeaders, createMockResponse } from '../../mocks/mockUtils';

fetchMock.enableMocks();

vi.mock('@/lib/api/getAccessToken', () => ({
  getAccessTokenCookie: vi.fn(),
}));

vi.mock('@/lib/api/createAuthHeaders', () => ({
  createAuthHeaders: vi.fn(),
}));

describe('createBooking', () => {
  afterEach(() => {
    fetchMock.resetMocks();
    vi.resetAllMocks();
  });

  const mockData = {
    dateFrom: '2024-06-01',
    dateTo: '2024-06-10',
    guests: 2,
    venueId: '123',
  };

  it('should return booking data when creation is successful', async () => {
    const mockResponse = createMockResponse({
      id: 'booking123',
      dateFrom: '2024-06-01',
      dateTo: '2024-06-10',
      guests: 2,
      updated: '2024-06-01',
      created: '2024-06-01',
    });

    vi.mocked(getAccessTokenCookie).mockResolvedValue('fake-access-token');

    vi.mocked(createAuthHeaders).mockResolvedValue(createMockHeaders());

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

    const result = await createBooking(mockData);

    expect(result).toEqual({ booking: mockResponse.data, error: null, status: 200 });
  });

  it('should return an error message when user is unauthorized', async () => {
    vi.mocked(getAccessTokenCookie).mockResolvedValue(undefined);

    const result = await createBooking(mockData);

    expect(result).toEqual({
      booking: null,
      error: { _errors: ['Unauthorized'] },
      status: 401,
    });
  });

  it('should return an error message when API request fails', async () => {
    const errorResponse = { errors: [{ message: 'Invalid booking data' }] };
    vi.mocked(getAccessTokenCookie).mockResolvedValue('fake-access-token');
    vi.mocked(createAuthHeaders).mockResolvedValue(createMockHeaders());
    fetchMock.mockResponseOnce(JSON.stringify(errorResponse), { status: 400 });

    const result = await createBooking(mockData);

    expect(result.booking).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.status).toBe(400);
  });

  it('should handle network errors', async () => {
    vi.mocked(getAccessTokenCookie).mockResolvedValue('fake-access-token');
    vi.mocked(createAuthHeaders).mockResolvedValue(createMockHeaders());
    fetchMock.mockRejectOnce(new Error('Network error'));

    const result = await createBooking(mockData);

    expect(result.booking).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.status).toBe(500);
  });
});
