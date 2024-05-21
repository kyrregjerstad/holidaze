import { afterEach, describe, expect, it, vi } from 'vitest';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createMockErrorResponse, createMockHeaders } from '@/lib/mocks/mockUtils';
import { getAllVenuesByProfile } from '@/lib/services/profileService';

vi.mock('server-only', () => {
  return {};
});

vi.mock('@/lib/api/holidazeAPI', () => ({
  holidazeAPI: vi.fn(),
}));

vi.mock('@/lib/api/createAuthHeaders', () => ({
  createAuthHeaders: vi.fn(),
}));

describe('getAllVenuesByProfile', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const mockName = 'testuser';
  const mockAccessToken = 'fake-access-token';

  const mockVenues = [
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
    },
    {
      id: 'venue2',
      name: 'Test Venue 2',
      description: 'Description 2',
      media: [{ url: 'https://url.com/image2.jpg', alt: 'Image 2' }],
      price: 200,
      maxGuests: 6,
      rating: 4.7,
      created: '2023-02-01T00:00:00Z',
      updated: '2023-02-10T00:00:00Z',
      meta: { wifi: true, parking: true, breakfast: true, pets: true },
      location: {
        address: '456 Elm St',
        city: 'City 2',
        zip: '67890',
        country: 'Country 2',
        continent: 'Continent 2',
        lat: 30,
        lng: 40,
      },
    },
  ];

  it('should return venues data when API call is successful', async () => {
    const mockResponse = { data: mockVenues, meta: {} };
    vi.mocked(createAuthHeaders).mockResolvedValue(createMockHeaders());
    vi.mocked(holidazeAPI).mockResolvedValue({
      res: mockResponse,
      error: null,
      status: 200,
    });

    const result = await getAllVenuesByProfile(mockName, mockAccessToken);

    expect(result).toEqual({
      venues: mockResponse.data,
      error: null,
      status: 200,
    });
  });

  it('should return empty array and error when API call fails', async () => {
    const errorResponse = createMockErrorResponse(['Failed to fetch venues']);
    vi.mocked(createAuthHeaders).mockResolvedValue(createMockHeaders());
    vi.mocked(holidazeAPI).mockResolvedValue({
      res: null,
      error: errorResponse,
      status: 404,
    });

    const result = await getAllVenuesByProfile(mockName, mockAccessToken);

    expect(result).toEqual({
      venues: [],
      error: errorResponse,
      status: 404,
    });
  });
});
