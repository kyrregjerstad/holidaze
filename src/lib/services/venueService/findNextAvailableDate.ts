import { addDays, differenceInCalendarDays } from 'date-fns';

type Booking = {
  from: Date;
  to: Date;
};

export function findNextAvailableDate(existingBookings: Booking[], days: number) {
  if (existingBookings.length === 0) {
    return {
      from: new Date(),
      to: addDays(new Date(), days),
    };
  }

  for (let i = 0; i < existingBookings.length; i++) {
    const booking = existingBookings[i];
    const nextBooking = existingBookings[i + 1];

    const nextAvailableFrom = addDays(booking.to, 1);
    const nextAvailableTo = addDays(nextAvailableFrom, days);

    if (!nextBooking) {
      return {
        from: nextAvailableFrom,
        to: nextAvailableTo,
      };
    }

    const daysBetween = differenceInCalendarDays(nextBooking.from, booking.to);

    if (daysBetween > days) {
      return {
        from: nextAvailableFrom,
        to: nextAvailableTo,
      };
    }
  }

  return {
    from: addDays(existingBookings[existingBookings.length - 1].to, 1),
    to: addDays(addDays(existingBookings[existingBookings.length - 1].to, 1), days),
  };
}
