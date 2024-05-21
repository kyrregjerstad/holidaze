import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { errorsSchema } from '../schema';
import { fetcher } from './fetcher';

const schema = z.object({
  id: z.number(),
  name: z.string(),
});

describe('fetcher', () => {
  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('should return data when response is valid', async () => {
    const mockResponse = { id: 1, name: 'Test' };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

    const result = await fetcher({ url: 'http://example.com', schema });

    expect(result).toEqual({ res: mockResponse, status: 200, error: null });
  });

  it('should return null for 204 response status', async () => {
    fetchMock.mockResponseOnce('', { status: 204 });

    const result = await fetcher({ url: 'http://example.com', schema });

    expect(result).toEqual({ res: null, status: 204, error: null });
  });

  it('should handle 401 unauthorized response', async () => {
    fetchMock.mockResponseOnce('', { status: 401 });

    const result = await fetcher({ url: 'http://example.com', schema });

    expect(result).toEqual({ res: null, status: 401, error: null });
  });

  it('should handle non-200 and non-401 error responses', async () => {
    const errorResponse = { errors: [{ message: 'Not found' }] };
    fetchMock.mockResponseOnce(JSON.stringify(errorResponse), { status: 404 });

    const result = await fetcher({ url: 'http://example.com', schema });

    expect(result.res).toBeNull();
    expect(result.status).toBe(404);
    expect(result.error).not.toBeNull();

    const parsedError = errorsSchema.safeParse(errorResponse);
    if (parsedError.success) {
      expect(result.error?.issues[0].message).toBe('Not found');
    } else {
      expect(result.error?.issues[0].message).toBe('Invalid API error structure');
    }
  });

  it('should handle invalid API error structure', async () => {
    const invalidErrorResponse = { error: 'Not found' };
    fetchMock.mockResponseOnce(JSON.stringify(invalidErrorResponse), { status: 404 });

    const result = await fetcher({ url: 'http://example.com', schema });

    expect(result.res).toBeNull();
    expect(result.status).toBe(404);
    expect(result.error?.issues[0].message).toBe('Invalid API error structure');
  });

  it('should handle invalid response schema', async () => {
    const invalidResponse = { id: 'one', name: 123 };
    fetchMock.mockResponseOnce(JSON.stringify(invalidResponse), { status: 200 });

    const result = await fetcher({ url: 'http://example.com', schema });

    expect(result.res).toBeNull();
    expect(result.status).toBe(200);
    expect(result.error).not.toBeNull();
  });

  it('should handle network errors', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));

    const result = await fetcher({ url: 'http://example.com', schema });

    expect(result.res).toBeNull();
    expect(result.status).toBe(500);
    expect(result.error).not.toBeNull();
  });
});
