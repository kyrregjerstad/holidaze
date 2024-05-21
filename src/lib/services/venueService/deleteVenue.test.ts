import { revalidateTag } from 'next/cache';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createMockErrorResponse, createMockHeaders } from '@/lib/mocks/mockUtils';
import { deleteVenue } from '@/lib/services/venueService';

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

describe('deleteVenue', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const mockId = 'venue123';
  const mockAccessToken = 'fake-access-token';

  it('should return null and no error when deletion is successful', async () => {
    vi.mocked(createAuthHeaders).mockResolvedValue(createMockHeaders());
    vi.mocked(holidazeAPI).mockResolvedValue({
      res: null,
      error: null,
      status: 204,
    });

    const result = await deleteVenue(mockId, mockAccessToken);

    expect(result).toEqual({ venue: null, error: null, status: 204 });
    expect(revalidateTag).toHaveBeenCalledWith(`venue-${mockId}`);
  });

  it('should return an error message when deletion fails', async () => {
    const errorResponse = createMockErrorResponse(['Deletion failed']);
    vi.mocked(createAuthHeaders).mockResolvedValue(createMockHeaders());
    vi.mocked(holidazeAPI).mockResolvedValue({
      res: null,
      error: errorResponse,
      status: 400,
    });

    const result = await deleteVenue(mockId, mockAccessToken);

    expect(result).toEqual({ venue: null, error: errorResponse, status: 400 });
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
