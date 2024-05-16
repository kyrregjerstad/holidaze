import { notFound } from 'next/navigation';

import { venueService } from '@/lib/services';
import {
  flatSearchOptionsSchema,
  searchOptionsSchema,
  type SearchOptions,
} from '@/lib/services/venueService/searchOptionsSchema';
import { SearchCard } from './SearchCard';
import { SearchDrawer } from './SearchDrawer';
import { SearchResult } from './SearchResult';
import { z } from 'zod';

type Props = {
  searchParams?: Partial<SearchOptions>;
};

const SearchPage = async ({ searchParams }: Props) => {
  const searchOptions = flatSearchOptionsSchema.safeParse(searchParams);
  if (!searchOptions.success) return notFound();

  const transformedOptions = transformSearchParams(searchOptions.data);
  const { venues } = await venueService.search(transformedOptions);

  return (
    <section className="container">
      <div className="hidden py-8 sm:block">
        <SearchCard prefilledSearch={transformedOptions} />
      </div>

      <SearchResult venues={venues} />
      <SearchDrawer prefilledSearch={transformedOptions} />
    </section>
  );
};

export default SearchPage;

function transformSearchParams(
  params: z.infer<typeof flatSearchOptionsSchema>
): z.infer<typeof searchOptionsSchema> {
  return {
    searchText: params.searchText,
    price: {
      min: params.priceMin,
      max: params.priceMax,
    },
    location: params.location,
    amenities: {
      wifi: params.amenities?.includes('wifi'),
      parking: params.amenities?.includes('parking'),
      breakfast: params.amenities?.includes('breakfast'),
      pets: params.amenities?.includes('pets'),
    },
    availability: {
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      flexible: params.flexible,
    },
    minGuests: params.minGuests,
    sort: params.sortField
      ? { field: params.sortField, order: params.sortOrder || 'asc' }
      : undefined,
    amount: params.amount,
  };
}
