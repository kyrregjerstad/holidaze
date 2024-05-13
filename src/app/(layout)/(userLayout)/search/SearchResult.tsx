'use client';

import { useQuery } from '@tanstack/react-query';
import { isWithinInterval, parseISO } from 'date-fns';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { VenueCard } from '@/components/VenueCard';
import { venueService } from '@/lib/services';

export const SearchResult = ({
  startDate,
  endDate,
}: {
  startDate: string | undefined;
  endDate: string | undefined;
}) => {
  const {
    data: venues,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['venues'],
    queryFn: () => venueService.recursivelyGetAllVenues(),
  });

  if (!venues || venues.length === 0) {
    return <p>Loading...</p>;
  }

  const availableVenues = filterAvailableVenues(venues, startDate, endDate);

  if (availableVenues.length === 0) {
    return (
      <div>
        <p>No results found</p>
        <Link href={`/search`} className={buttonVariants()}>
          Reset filters
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {availableVenues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
};

export const filterAvailableVenues = (
  venues: VenuesBySearchTerm,
  startDate: string | undefined,
  endDate: string | undefined
) => {
  if (!startDate || !endDate) {
    return venues;
  }
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  return venues.filter(
    (venue) =>
      !venue.bookings.some(
        (booking) =>
          isWithinInterval(start, {
            start: parseISO(booking.dateFrom),
            end: parseISO(booking.dateTo),
          }) ||
          isWithinInterval(end, {
            start: parseISO(booking.dateFrom),
            end: parseISO(booking.dateTo),
          }) ||
          isWithinInterval(parseISO(booking.dateFrom), { start, end }) ||
          isWithinInterval(parseISO(booking.dateTo), { start, end })
      )
  );
};
