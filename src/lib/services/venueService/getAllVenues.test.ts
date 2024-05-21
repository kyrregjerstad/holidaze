import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createMockErrorResponse } from '@/lib/mocks/mockUtils';
import { getAllVenues } from '@/lib/services/venueService';
import { buildVenueSchema } from '@/lib/services/venueService/buildVenueSchema';
import { VenueFull } from '@/lib/types';

vi.mock('@/lib/api/holidazeAPI', () => ({
  holidazeAPI: vi.fn(),
}));

vi.mock('@/lib/services/venueService/buildVenueSchema', () => ({
  buildVenueSchema: vi.fn(),
}));

vi.mock('server-only', () => {
  return {};
});

describe('getAllVenues', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const mockVenues: VenueFull[] = [
    {
      id: 'venue1',
      name: 'Test Venue 1',
      description: 'Description 1',
      media: [{ url: 'https://url.com/image1.jpg', alt: 'Image 1' }],
      price: 100,
      maxGuests: 4,
      rating: 4.5,
      created: '2023-01-01T00:00:00Z',
      updated: '2023-01-10T00:00:00Z',
      meta: { wifi: true, parking: true, breakfast: true, pets: true },
      location: {
        address: '123 Main St',
        city: 'City 1',
        zip: '12345',
        country: 'Country 1',
        continent: 'Continent 1',
        lat: 10,
        lng: 20,
      },
      bookings: [],
      owner: {
        name: 'Owner 1',
        email: 'test@email.com',
        bio: 'A nice person',
        avatar: {
          url: 'https://url.com/avatar.jpg',
          alt: 'Avatar',
        },
        banner: {
          url: 'https://url.com/banner.jpg',
          alt: 'Banner',
        },
      },
    },
    {
      id: 'venue2',
      name: 'Test Venue 2',
      description: 'Description 2',
      media: [{ url: 'https://url.com/image2.jpg', alt: 'Image 2' }],
      price: 200,
      maxGuests: 6,
      rating: 4.8,
      created: '2023-02-01T00:00:00Z',
      updated: '2023-02-10T00:00:00Z',
      meta: { wifi: true, parking: true, breakfast: true, pets: true },
      location: {
        address: '456 Main St',
        city: 'City 2',
        zip: '54321',
        country: 'Country 2',
        continent: 'Continent 2',
        lat: 30,
        lng: 40,
      },
      bookings: [],
      owner: {
        name: 'Owner 2',
        email: 'test@email.com',
        bio: 'A nice person',
        avatar: {
          url: 'https://url.com/avatar.jpg',
          alt: 'Avatar',
        },
        banner: {
          url: 'https://url.com/banner.jpg',
          alt: 'Banner',
        },
      },
    },
  ];

  it('should return venues with owner and bookings when requested', async () => {
    const mockResponse = { data: mockVenues, meta: {} };
    const schema = z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      media: z.array(z.object({ url: z.string(), alt: z.string() })),
      price: z.number(),
      maxGuests: z.number(),
      rating: z.number(),
      created: z.string(),
      updated: z.string(),
      meta: z.object({
        wifi: z.boolean(),
        parking: z.boolean(),
        breakfast: z.boolean(),
        pets: z.boolean(),
      }),
      location: z.object({
        address: z.string(),
        city: z.string(),
        zip: z.string(),
        country: z.string(),
        continent: z.string(),
        lat: z.number(),
        lng: z.number(),
      }),
    });
    vi.mocked(buildVenueSchema).mockReturnValue(schema);
    vi.mocked(holidazeAPI).mockResolvedValue({
      res: { data: mockResponse.data, meta: mockResponse.meta },
      error: null,
      status: 200,
    });

    const result = await getAllVenues({ owner: true, bookings: true });

    expect(result).toEqual({
      venues: mockResponse.data,
      meta: mockResponse.meta,
      error: null,
      status: 200,
    });
  });

  it('should return venues without bookings when requested', async () => {
    const mockResponse = { data: mockVenues, meta: {} };
    const schema = z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      media: z.array(z.object({ url: z.string(), alt: z.string() })),
      price: z.number(),
      maxGuests: z.number(),
      rating: z.number(),
      created: z.string(),
      updated: z.string(),
      meta: z.object({
        wifi: z.boolean(),
        parking: z.boolean(),
        breakfast: z.boolean(),
        pets: z.boolean(),
      }),
      location: z.object({
        address: z.string(),
        city: z.string(),
        zip: z.string(),
        country: z.string(),
        continent: z.string(),
        lat: z.number(),
        lng: z.number(),
      }),
    });
    vi.mocked(buildVenueSchema).mockReturnValue(schema);
    vi.mocked(holidazeAPI).mockResolvedValue({
      res: { data: mockResponse.data, meta: mockResponse.meta },
      error: null,
      status: 200,
    });

    const result = await getAllVenues({ owner: true, bookings: false });

    expect(result).toEqual({
      venues: mockResponse.data,
      meta: mockResponse.meta,
      error: null,
      status: 200,
    });
  });

  it('should return an empty array and error when API call fails', async () => {
    const errorResponse = createMockErrorResponse(['Failed to fetch venues']);
    vi.mocked(holidazeAPI).mockResolvedValue({
      res: null,
      error: errorResponse,
      status: 500,
    });

    const result = await getAllVenues({ owner: true, bookings: true });

    expect(result).toEqual({
      venues: [],
      meta: null,
      error: errorResponse,
      status: 500,
    });
  });
});
