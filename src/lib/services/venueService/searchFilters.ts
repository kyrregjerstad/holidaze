import type { Amenities, VenueFull } from '@/lib/types';

import { isAfter, isBefore, parseISO } from 'date-fns';
import Fuse from 'fuse.js';

import { SearchOptions, SortField, SortOrder } from './search';

export const constructFilters = (options: SearchOptions) => {
  const { searchText, price, location, amenities, availability, minGuests } = options;

  return [
    searchText ? (venue: VenueFull) => filterBySearchText(venue, searchText) : null,
    price ? (venue: VenueFull) => filterByPrice(venue, price) : null,
    location ? (venue: VenueFull) => filterByLocation(venue, location) : null,
    amenities ? (venue: VenueFull) => filterByAmenities(venue, amenities) : null,
    availability ? (venue: VenueFull) => filterByAvailability(venue, availability) : null,
    minGuests ? (venue: VenueFull) => filterByMinGuests(venue, minGuests) : null,
  ].filter(Boolean);
};

/* Fuzzy search */
const filterBySearchText = (venue: VenueFull, searchText: string) => {
  const options = {
    keys: ['name', 'description'],
    threshold: 0.1,
  };
  const fuse = new Fuse([venue], options);
  return fuse.search(searchText).length > 0;
};

const filterByPrice = (venue: VenueFull, price: { min?: number; max?: number }) =>
  (price.min === undefined || venue.price >= price.min) &&
  (price.max === undefined || venue.price <= price.max);

/* Fuzzy search */
const filterByLocation = (venue: VenueFull, location: string) => {
  const options = {
    keys: [
      'location.address',
      'location.city',
      'location.zip',
      'location.country',
      'location.continent',
    ],
    threshold: 0.25,
  };
  const fuse = new Fuse([venue], options);
  return fuse.search(location).length > 0;
};

const filterByAmenities = (venue: VenueFull, amenities: Partial<Amenities>) =>
  (amenities.wifi === undefined || venue.meta.wifi === amenities.wifi) &&
  (amenities.parking === undefined || venue.meta.parking === amenities.parking);

const filterByMinGuests = (venue: VenueFull, minGuests: number) => venue.maxGuests >= minGuests;

const filterByAvailability = (
  venue: VenueFull,
  availability: { dateFrom?: string; dateTo?: string; flexible?: boolean }
) => {
  const dateFrom = availability.dateFrom ? parseISO(availability.dateFrom) : null;
  const dateTo = availability.dateTo ? parseISO(availability.dateTo) : null;

  if (dateFrom && dateTo && isBefore(dateTo, dateFrom)) {
    throw new Error('Date to must be after date from');
  }

  return (
    availability.flexible ||
    !dateFrom ||
    !dateTo ||
    venue.bookings.every((booking) => {
      const bookingDateFrom = parseISO(booking.dateFrom);
      const bookingDateTo = parseISO(booking.dateTo);
      return isBefore(bookingDateTo, dateFrom) || isAfter(bookingDateFrom, dateTo);
    })
  );
};

export const sortVenues = (venues: VenueFull[], sort: { field: SortField; order: SortOrder }) => {
  const { field, order } = sort;

  return venues.sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};
