import { afterEach } from 'node:test';

import { describe, expect, it, vi } from 'vitest';

import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createMockErrorResponse } from '@/lib/mocks/mockUtils';
import { getVenueById } from '@/lib/services/venueService';

fetchMock.enableMocks();

vi.mock('@/lib/api/holidazeAPI', () => ({
  holidazeAPI: vi.fn(),
}));

vi.mock('server-only', () => {
  return {};
});

describe('getVenueById', () => {
  afterEach(() => {
    fetchMock.resetMocks();
    vi.resetAllMocks();
  });

  const mockId = 'venue123';
  const mockResponse = {
    data: {
      id: 'venue123',
      name: 'Test Venue',
      description: 'A nice place to stay',
      media: [
        {
          url: 'https://url.com/image.jpg',
          alt: 'A nice image',
        },
      ],
      price: 100,
      maxGuests: 4,
      rating: 4.5,
      created: '2023-01-01T00:00:00Z',
      updated: '2023-01-10T00:00:00Z',
      meta: {
        wifi: true,
        parking: true,
        breakfast: true,
        pets: true,
      },
      location: {
        address: '123 Main St',
        city: 'Example City',
        zip: '12345',
        country: 'Example Country',
        continent: 'Example Continent',
        lat: 10,
        lng: 20,
      },
    },
    meta: {},
  };

  it('should return venue data when API call is successful', async () => {
    vi.mocked(holidazeAPI).mockResolvedValue({
      res: { data: mockResponse.data, meta: mockResponse.meta },
      error: null,
      status: 200,
    });

    const result = await getVenueById(mockId);

    expect(result).toEqual({
      venue: mockResponse.data,
      error: null,
      meta: mockResponse.meta,
      status: 200,
    });
  });

  it('should return null and error when API call fails', async () => {
    const errorResponse = createMockErrorResponse(['Venue not found']);
    vi.mocked(holidazeAPI).mockResolvedValue({
      res: null,
      error: createMockErrorResponse(['Venue not found']),
      status: 404,
    });

    const result = await getVenueById(mockId);

    expect(result).toEqual({
      venue: null,
      error: errorResponse,
      meta: null,
      status: 404,
    });
  });
});
