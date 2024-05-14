import { notFound } from 'next/navigation';

import { z } from 'zod';

import { venueService } from '@/lib/services';
import { SearchBar } from './SearchBar';
import { SearchResult } from './SearchResult';

type Props = {
  searchParams?: {
    q?: string;
    startDate?: string;
    endDate?: string;
  };
};

const SearchPage = async ({ searchParams }: Props) => {
  const result = querySchema.safeParse(searchParams);
  if (!result.success) return notFound();

  const { q, startDate, endDate } = result.data;

  const { venues } = await venueService.search({
    location: q,
    minGuests: 1,
    availability: {
      dateFrom: startDate,
      dateTo: endDate,
    },
  });

  console.log(venues);

  return (
    <section className="container">
      <div className="py-8">
        <SearchBar prefilledTerm={q} />
      </div>

      <SearchResult venues={venues} />
    </section>
  );
};

export default SearchPage;

const querySchema = z.object({
  q: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
