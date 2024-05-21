import { afterEach } from 'node:test';

import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { login } from './login';

fetchMock.enableMocks();

describe('login', () => {
  afterEach(() => {
    fetchMock.resetMocks();
  });

  const loginApiResponseSchema = z.object({
    name: z.string(),
    email: z.string(),
  });

  it('should return user data when login is successful', async () => {
    const mockResponse = { name: 'John Doe', email: 'john@example.com' };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

    const result = await login('john@example.com', 'password');

    expect(result).toEqual({ user: mockResponse, error: null });
  });

  it('should return an error message for 401 status', async () => {
    fetchMock.mockResponseOnce('', { status: 401 });

    const result = await login('john@example.com', 'password');

    expect(result).toEqual({ user: null, error: 'Invalid username or password' });
  });

  it('should return an error message when fetcher returns an error', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ error: 'Fetch error' }), { status: 500 });

    const result = await login('john@example.com', 'password');

    expect(result).toEqual({ user: null, error: 'Failed to fetch' });
  });

  it('should return an error message when response is invalid', async () => {
    const invalidResponse = { name: 'John Doe' }; // missing email
    fetchMock.mockResponseOnce(JSON.stringify(invalidResponse), { status: 200 });

    const result = await login('john@example.com', 'password');

    expect(result).toEqual({ user: null, error: 'Failed to fetch' });
  });

  it('should return an error message for network errors', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));

    const result = await login('john@example.com', 'password');

    expect(result).toEqual({ user: null, error: 'Failed to fetch' });
  });
});
