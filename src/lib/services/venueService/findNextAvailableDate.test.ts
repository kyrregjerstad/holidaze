import { addDays } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { findNextAvailableDate } from './findNextAvailableDate';

type Booking = {
  from: Date;
  to: Date;
};

describe('findNextAvailableDate', () => {
  it('should return the first available date if there are no bookings', () => {
    const bookings: Booking[] = [];
    const days = 2;

    const result = findNextAvailableDate(bookings, days);

    const today = new Date();
    expect(result).toEqual({
      from: today,
      to: addDays(today, days),
    });
  });

  it('should find the next available date between bookings', () => {
    const bookingOne = {
      from: new Date('2024-05-21T22:00:00.000Z'),
      to: new Date('2024-05-22T22:00:00.000Z'),
    };

    const bookingTwo = {
      from: new Date('2024-05-25T22:00:00.000Z'),
      to: new Date('2024-05-26T22:00:00.000Z'),
    };

    const days = 2;

    const result = findNextAvailableDate([bookingOne, bookingTwo], days);

    expect(result).toEqual({
      from: addDays(bookingOne.to, 1),
      to: addDays(bookingOne.to, days + 1),
    });
  });

  it('should return the next available date after the last booking', () => {
    const booking = {
      from: new Date('2024-05-21T22:00:00.000Z'),
      to: new Date('2024-05-22T22:00:00.000Z'),
    };

    const days = 2;

    const result = findNextAvailableDate([booking], days);

    expect(result).toEqual({
      from: addDays(booking.to, 1),
      to: addDays(booking.to, days + 1),
    });
  });

  it('should handle consecutive bookings without gaps', () => {
    const bookingOne = {
      from: new Date('2024-05-21T22:00:00.000Z'),
      to: new Date('2024-05-22T22:00:00.000Z'),
    };

    const bookingTwo = {
      from: new Date('2024-05-22T22:00:00.000Z'),
      to: new Date('2024-05-23T22:00:00.000Z'),
    };

    const bookingThree = {
      from: new Date('2024-05-23T22:00:00.000Z'),
      to: new Date('2024-05-24T22:00:00.000Z'),
    };

    const days = 2;

    const result = findNextAvailableDate([bookingOne, bookingTwo, bookingThree], days);

    expect(result).toEqual({
      from: addDays(bookingThree.to, 1),
      to: addDays(bookingThree.to, days + 1),
    });
  });

  it('should find the next available date with a gap larger than needed days', () => {
    const bookingOne = {
      from: new Date('2024-05-21T22:00:00.000Z'),
      to: new Date('2024-05-22T22:00:00.000Z'),
    };

    const bookingTwo = {
      from: new Date('2024-05-25T22:00:00.000Z'),
      to: new Date('2024-05-26T22:00:00.000Z'),
    };

    const days = 1;

    const result = findNextAvailableDate([bookingOne, bookingTwo], days);

    expect(result).toEqual({
      from: addDays(bookingOne.to, 1),
      to: addDays(bookingOne.to, days + 1),
    });
  });

  it('should handle bookings that span multiple days', () => {
    const bookingOne = {
      from: new Date('2024-05-21T22:00:00.000Z'),
      to: new Date('2024-05-23T22:00:00.000Z'),
    };

    const bookingTwo = {
      from: new Date('2024-05-25T22:00:00.000Z'),
      to: new Date('2024-05-27T22:00:00.000Z'),
    };

    const days = 1;

    const result = findNextAvailableDate([bookingOne, bookingTwo], days);

    expect(result).toEqual({
      from: addDays(bookingOne.to, 1),
      to: addDays(bookingOne.to, days + 1),
    });
  });

  it('should return a date even if there are multiple overlapping bookings', () => {
    const bookingOne = {
      from: new Date('2024-05-21T22:00:00.000Z'),
      to: new Date('2024-05-23T22:00:00.000Z'),
    };

    const bookingTwo = {
      from: new Date('2024-05-23T22:00:00.000Z'),
      to: new Date('2024-05-24T22:00:00.000Z'),
    };

    const bookingThree = {
      from: new Date('2024-05-24T22:00:00.000Z'),
      to: new Date('2024-05-25T22:00:00.000Z'),
    };

    const days = 2;

    const result = findNextAvailableDate([bookingOne, bookingTwo, bookingThree], days);

    expect(result).toEqual({
      from: addDays(bookingThree.to, 1),
      to: addDays(bookingThree.to, days + 1),
    });
  });

  it('should handle the case where there is only one booking', () => {
    const bookingOne = {
      from: new Date('2024-05-21T22:00:00.000Z'),
      to: new Date('2024-05-23T22:00:00.000Z'),
    };

    const days = 2;

    const result = findNextAvailableDate([bookingOne], days);

    expect(result).toEqual({
      from: addDays(bookingOne.to, 1),
      to: addDays(bookingOne.to, days + 1),
    });
  });
});
