import { parseISO, startOfDay } from 'date-fns';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { filterAndSortBookings, getNextAvailableDates } from './getNextAvailableDates';

vi.mock('server-only', () => {
  return {};
});

vi.mock('@/lib/api/holidazeAPI', () => ({
  holidazeAPI: vi.fn(),
}));

describe('getNextAvailableDates', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const mockVenueId = 'venue123';
  const mockStartDate = new Date('2024-05-21T22:00:00.000Z');
  const mockDays = 2;
  const mockBookings = [
    {
      dateFrom: '2024-05-18T22:00:00.000Z',
      dateTo: '2024-05-19T22:00:00.000Z',
    },
    {
      dateFrom: '2024-05-21T22:00:00.000Z',
      dateTo: '2024-05-22T22:00:00.000Z',
    },
    {
      dateFrom: '2024-05-23T22:00:00.000Z',
      dateTo: '2024-05-24T22:00:00.000Z',
    },
    {
      dateFrom: '2024-05-25T22:00:00.000Z',
      dateTo: '2024-05-27T22:00:00.000Z',
    },
    {
      dateFrom: '2024-05-27T22:00:00.000Z',
      dateTo: '2024-05-28T22:00:00.000Z',
    },
    {
      dateFrom: '2024-05-28T22:00:00.000Z',
      dateTo: '2024-05-29T22:00:00.000Z',
    },
  ];

  const mockVenue = {
    id: 'venue123',
    name: 'Test Venue',
    bookings: mockBookings,
  };

  it('should return the next available date when bookings are provided', async () => {
    const mockResponse = { data: mockVenue, meta: {} };
    vi.mocked(holidazeAPI).mockResolvedValue({
      res: mockResponse,
      error: null,
      status: 200,
    });

    const result = await getNextAvailableDates({
      venueId: mockVenueId,
      startDate: mockStartDate,
      days: mockDays,
    });

    expect(result).toEqual({
      availableDate: {
        from: new Date('2024-05-30T22:00:00.000Z'),
        to: new Date('2024-06-01T22:00:00.000Z'),
      },
      venue: mockVenue,
      error: null,
      status: 200,
    });
  });
});

describe('filterAndSortBookings', () => {
  it('should filter and sort bookings correctly', () => {
    const booking1 = { dateFrom: '2024-05-25T22:00:00.000Z', dateTo: '2024-05-26T22:00:00.000Z' };
    const booking2 = { dateFrom: '2024-05-22T22:00:00.000Z', dateTo: '2024-05-23T22:00:00.000Z' };
    const booking3 = { dateFrom: '2024-05-19T22:00:00.000Z', dateTo: '2024-05-20T22:00:00.000Z' };

    const startDate = new Date('2024-05-21T22:00:00.000Z');

    const result = filterAndSortBookings([booking1, booking2, booking3], startDate);

    expect(result).toEqual([
      {
        from: startOfDay(parseISO(booking2.dateFrom)),
        to: startOfDay(parseISO(booking2.dateTo)),
      },
      {
        from: startOfDay(parseISO(booking1.dateFrom)),
        to: startOfDay(parseISO(booking1.dateTo)),
      },
    ]);
  });

  it('should exclude bookings before the start date', () => {
    const bookings = [
      { dateFrom: '2024-05-19T22:00:00.000Z', dateTo: '2024-05-20T22:00:00.000Z' },
      { dateFrom: '2024-05-21T22:00:00.000Z', dateTo: '2024-05-22T22:00:00.000Z' },
      { dateFrom: '2024-05-23T22:00:00.000Z', dateTo: '2024-05-24T22:00:00.000Z' },
    ];
    const startDate = new Date('2024-05-21T22:00:00.000Z');

    const result = filterAndSortBookings(bookings, startDate);

    expect(result).toEqual([
      {
        from: startOfDay(parseISO('2024-05-21T22:00:00.000Z')),
        to: startOfDay(parseISO('2024-05-22T22:00:00.000Z')),
      },
      {
        from: startOfDay(parseISO('2024-05-23T22:00:00.000Z')),
        to: startOfDay(parseISO('2024-05-24T22:00:00.000Z')),
      },
    ]);
  });
});
