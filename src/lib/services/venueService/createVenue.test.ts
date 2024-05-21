import type { CreateVenue } from '@/lib/types';

import { revalidateTag } from 'next/cache';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createMockErrorResponse, createMockHeaders } from '@/lib/mocks/mockUtils';
import { createVenue } from '@/lib/services/venueService';

vi.mock('@/lib/api/holidazeAPI', () => ({
  holidazeAPI: vi.fn(),
}));

vi.mock('@/lib/api/createAuthHeaders', () => ({
  createAuthHeaders: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
}));

vi.mock('server-only', () => {
  return {};
});

describe('createVenue', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const mockData: CreateVenue = {
    name: 'Test Venue',
    description: 'A nice place to stay',
    media: [{ url: 'https://url.com/image.jpg', alt: 'A nice image' }],
    price: 100,
    maxGuests: 4,
    location: {
      address: '123 Main St',
      city: 'Example City',
      zip: '12345',
      country: 'Example Country',
      continent: 'Example Continent',
      lat: 10,
      lng: 20,
    },
    meta: {
      wifi: true,
      parking: true,
      breakfast: true,
      pets: true,
    },
  };
  const mockAccessToken = 'fake-access-token';

  it('should return venue data when creation is successful', async () => {
    vi.mocked(createAuthHeaders).mockResolvedValue(createMockHeaders());
    vi.mocked(holidazeAPI).mockResolvedValue({
      res: { data: mockData, meta: {} },
      error: null,
      status: 201,
    });

    const result = await createVenue(mockData, mockAccessToken);

    expect(result).toEqual({
      venue: mockData,
      error: null,
      meta: {},
      status: 201,
    });
    expect(revalidateTag).toHaveBeenCalledWith('venues');
  });

  it('should return an error message when creation fails', async () => {
    const errorResponse = createMockErrorResponse(['Creation failed']);
    vi.mocked(createAuthHeaders).mockResolvedValue(createMockHeaders());
    vi.mocked(holidazeAPI).mockResolvedValue({
      res: null,
      error: errorResponse,
      status: 400,
    });

    const result = await createVenue(mockData, mockAccessToken);

    expect(result).toEqual({
      venue: null,
      error: errorResponse,
      meta: null,
      status: 400,
    });
    expect(revalidateTag).toHaveBeenCalledWith('venues');
  });
});
