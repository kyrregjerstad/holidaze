import { buttonVariants } from '@/components/ui/button';
import {
  Venue,
  VenuesBySearchTerm,
  fetchVenuesBySearchTerm,
} from '@/lib/services/venuesService';
import { isWithinInterval, parseISO } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { VenueCard } from '@/components/VenueCard';
import { SearchBar } from './SearchBar';

type Props = {
  searchParams?: {
    q?: string;
    startDate?: string;
    endDate?: string;
  };
};

const SearchResult = ({
  venues,
  startDate,
  endDate,
}: {
  venues: Venue[];
  startDate: string | undefined;
  endDate: string | undefined;
}) => {
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

const SearchPage = async ({ searchParams }: Props) => {
  const result = querySchema.safeParse(searchParams);
  if (!result.success) return notFound();

  const { q, startDate, endDate } = result.data;

  const { venues, error } = await fetchVenuesBySearchTerm(q);

  return (
    <section className="container">
      <div className="py-8">
        <SearchBar prefilledTerm={q} />
      </div>
      <SearchResult venues={venues} startDate={startDate} endDate={endDate} />
    </section>
  );
};

export default SearchPage;

const querySchema = z.object({
  q: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const filterAvailableVenues = (
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
