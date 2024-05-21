import { revalidateTag } from 'next/cache';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createMockErrorResponse, createMockHeaders } from '@/lib/mocks/mockUtils';
import { updateVenue } from '@/lib/services/venueService';
import { UpdateVenueSchema } from './updateVenue';

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

describe('updateVenue', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const mockId = 'venue123';
  const mockData: UpdateVenueSchema = {
    name: 'Updated Venue Name',
    description: 'Updated description',
  };
  const mockAccessToken = 'fake-access-token';

  it('should return updated venue data when update is successful', async () => {
    const mockResponse = { data: { id: mockId, ...mockData }, meta: {} };
    vi.mocked(createAuthHeaders).mockResolvedValue(createMockHeaders());
    vi.mocked(holidazeAPI).mockResolvedValue({
      res: mockResponse,
      error: null,
      status: 200,
    });

    const result = await updateVenue(mockId, mockData, mockAccessToken);

    expect(result).toEqual({
      venue: mockResponse.data,
      error: null,
      status: 200,
    });
    expect(revalidateTag).toHaveBeenCalledWith(`venue-${mockId}`);
  });

  it('should return an error message when update fails', async () => {
    const errorResponse = createMockErrorResponse(['Update failed']);
    vi.mocked(createAuthHeaders).mockResolvedValue(createMockHeaders());
    vi.mocked(holidazeAPI).mockResolvedValue({
      res: null,
      error: errorResponse,
      status: 400,
    });

    const result = await updateVenue(mockId, mockData, mockAccessToken);

    expect(result).toEqual({
      venue: null,
      error: errorResponse,
      status: 400,
    });
    expect(revalidateTag).toHaveBeenCalledWith(`venue-${mockId}`);
  });
});
