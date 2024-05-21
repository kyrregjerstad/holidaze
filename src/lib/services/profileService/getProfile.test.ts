import { afterEach, describe, expect, it, vi } from 'vitest';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createMockErrorResponse, createMockHeaders } from '@/lib/mocks/mockUtils';
import { getProfile } from '@/lib/services/profileService';

vi.mock('@/lib/api/holidazeAPI', () => ({
  holidazeAPI: vi.fn(),
}));

vi.mock('@/lib/api/createAuthHeaders', () => ({
  createAuthHeaders: vi.fn(),
}));

vi.mock('server-only', () => {
  return {};
});

describe('getProfile', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const mockName = 'testuser';
  const mockAccessToken = 'fake-access-token';

  const mockProfile = {
    id: 'user1',
    name: 'testuser',
    email: 'testuser@example.com',
    venues: [],
  };

  it('should return profile data when API call is successful', async () => {
    const mockResponse = { data: mockProfile, meta: {} };
    vi.mocked(createAuthHeaders).mockResolvedValue(createMockHeaders());
    vi.mocked(holidazeAPI).mockResolvedValue({
      res: mockResponse,
      error: null,
      status: 200,
    });

    const result = await getProfile(mockName, mockAccessToken);

    expect(result).toEqual({
      profile: mockResponse.data,
      error: null,
      status: 200,
    });
  });

  it('should return null and error when API call fails', async () => {
    const errorResponse = createMockErrorResponse(['Failed to fetch profile']);
    vi.mocked(createAuthHeaders).mockResolvedValue(createMockHeaders());
    vi.mocked(holidazeAPI).mockResolvedValue({
      res: null,
      error: errorResponse,
      status: 404,
    });

    const result = await getProfile(mockName, mockAccessToken);

    expect(result).toEqual({
      profile: null,
      error: errorResponse,
      status: 404,
    });
  });
});
