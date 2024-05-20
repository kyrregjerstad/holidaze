import { afterEach } from 'node:test';

import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { register } from '@/lib/services/authService/register';

fetchMock.enableMocks();

describe('register', () => {
  afterEach(() => {
    fetchMock.resetMocks();
  });

  const registerUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  it('should return user data when registration is successful', async () => {
    const mockResponse = {
      data: {
        name: 'john_doe',
        email: 'john@example.com',
        bio: 'test',
        avatar: {
          url: 'https://example.com/avatar.jpg',
          alt: 'John Doe',
        },
        banner: {
          url: 'https://example.com/banner.jpg',
          alt: 'John Doe',
        },
      },
      meta: {},
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

    const result = await register({
      name: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
      venueManager: false,
    });

    expect(result).toEqual({ res: mockResponse, error: null });
  });

  it('should return an error message for invalid response schema', async () => {
    const invalidResponse = { name: 'john_doe' }; // missing email
    fetchMock.mockResponseOnce(JSON.stringify(invalidResponse), { status: 200 });

    const result = await register({
      name: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
      venueManager: false,
    });

    expect(result.res).toBeNull();
    expect(result.error).not.toBeNull();
  });

  it('should return an error message for network errors', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));

    const result = await register({
      name: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
      venueManager: false,
    });

    expect(result.res).toBeNull();
    expect(result.error).not.toBeNull();
  });
});
