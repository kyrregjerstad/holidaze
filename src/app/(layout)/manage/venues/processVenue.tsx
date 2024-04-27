import { VenueWithBookings } from '@/lib/schema/venueSchema';
import {
  compareAsc,
  formatDistanceToNow,
  isFuture,
  isPast,
  isToday,
  parseISO,
} from 'date-fns';

type Booking = {
  dateFrom: Date;
  dateTo: Date;
};

export const processVenue = (venue: VenueWithBookings) => {
  const sortedAndFilteredBookings = parseBookingDates(venue)
    .bookings.filter(removePastDates)
    .sort(sortDatesAsc);

  return {
    ...venue,
    bookings: sortedAndFilteredBookings,
    ...getStatusForVenue(sortedAndFilteredBookings),
  };
};

const getUpcomingBookings = (bookings: Booking[]) =>
  bookings.filter(({ dateFrom }) => isFuture(dateFrom));

const getDaysUntilNextBooking = (upcomingBookings: Booking[]) =>
  upcomingBookings.length > 0
    ? formatDistanceToNow(upcomingBookings[0].dateFrom, { addSuffix: true })
    : null;

const getStatus = (
  bookings: Booking[],
  upcomingBookings: Booking[],
  timeUntilNextBooking: string | null
) => {
  switch (true) {
    case upcomingBookings.length > 0:
      return `${timeUntilNextBooking}`;
    case isToday(bookings[0].dateFrom) ||
      (isPast(bookings[0].dateFrom) && isFuture(bookings[0].dateTo)):
      return 'Now';
    case isPast(bookings[0].dateTo) ||
      isPast(bookings[0].dateFrom) ||
      !bookings[0]:
      return 'No bookings';
    default:
      return 'Unknown';
  }
};

const getStatusForVenue = (bookings: Booking[]) => {
  if (bookings.length === 0) {
    return {
      status: 'No bookings',
      upcomingBookings: 0,
      daysUntilNextBooking: null,
    };
  }

  const upcomingBookings = getUpcomingBookings(bookings);
  const timeUntilNextBooking = getDaysUntilNextBooking(upcomingBookings);
  const status = getStatus(bookings, upcomingBookings, timeUntilNextBooking);

  return {
    status,
    upcomingBookings: upcomingBookings.length,
    timeUntilNextBooking,
  };
};

const parseBookingDates = (venue: VenueWithBookings) => ({
  ...venue,
  bookings: venue.bookings.map((booking) => ({
    ...booking,
    dateFrom: parseISO(booking.dateFrom),
    dateTo: parseISO(booking.dateTo),
  })),
});

const removePastDates = (booking: { dateTo: Date }) => !isPast(booking.dateTo);

export const sortDatesAsc = (booking: { dateFrom: Date; dateTo: Date }) =>
  compareAsc(booking.dateFrom, booking.dateTo);

export const sortDatesDesc = (booking: { dateFrom: Date; dateTo: Date }) =>
  compareAsc(booking.dateTo, booking.dateFrom);
