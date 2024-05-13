import { notFound } from 'next/navigation';

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
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

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['venues'],
    queryFn: () => venueService.recursivelyGetAllVenues(),
  });

  // const { venues, error } = await fetchVenuesBySearchTerm(q);

  return (
    <section className="container">
      <div className="py-8">
        <SearchBar prefilledTerm={q} />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SearchResult startDate={startDate} endDate={endDate} />
      </HydrationBoundary>
    </section>
  );
};

export default SearchPage;

const querySchema = z.object({
  q: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
