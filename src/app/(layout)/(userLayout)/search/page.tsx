import { notFound } from 'next/navigation';

import { z } from 'zod';

import { venueService } from '@/lib/services';
import { SearchBar } from './SearchBar';
import { SearchDrawer } from './SearchDrawer';
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

  return (
    <section className="container">
      <div className="hidden py-8 sm:block">
        <SearchBar prefilledTerm={q} />
      </div>

      <SearchResult venues={venues} />
      <SearchDrawer prefilledTerm={q} />
    </section>
  );
};

export default SearchPage;

const querySchema = z.object({
  q: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
