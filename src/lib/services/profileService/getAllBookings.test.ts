import { afterEach, describe, expect, it, vi } from 'vitest';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createMockErrorResponse, createMockHeaders } from '@/lib/mocks/mockUtils';
import { getAllBookings } from '@/lib/services/profileService';

vi.mock('server-only', () => {
  return {};
});

vi.mock('@/lib/api/holidazeAPI', () => ({
  holidazeAPI: vi.fn(),
}));

vi.mock('@/lib/api/createAuthHeaders', () => ({
  createAuthHeaders: vi.fn(),
}));

describe('getAllBookings', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const mockName = 'testuser';
  const mockAccessToken = 'fake-access-token';

  const mockBookings = [
    {
      id: 'booking1',
      venue: {
        id: 'venue1',
        name: 'Test Venue 1',
      },
      startDate: '2024-06-01',
      endDate: '2024-06-10',
      status: 'confirmed',
    },
  ];

  it('should return bookings data when API call is successful', async () => {
    const mockResponse = { data: mockBookings, meta: {} };
    vi.mocked(createAuthHeaders).mockResolvedValue(createMockHeaders());
    vi.mocked(holidazeAPI).mockResolvedValue({
      res: mockResponse,
      error: null,
      status: 200,
    });

    const result = await getAllBookings(mockName, mockAccessToken);

    expect(result).toEqual({
      bookings: mockResponse.data,
      error: null,
      status: 200,
    });
  });

  it('should return null and error when API call fails', async () => {
    const errorResponse = createMockErrorResponse(['Failed to fetch bookings']);
    vi.mocked(createAuthHeaders).mockResolvedValue(createMockHeaders());
    vi.mocked(holidazeAPI).mockResolvedValue({
      res: null,
      error: errorResponse,
      status: 404,
    });

    const result = await getAllBookings(mockName, mockAccessToken);

    expect(result).toEqual({
      bookings: null,
      error: errorResponse,
      status: 404,
    });
  });
});
