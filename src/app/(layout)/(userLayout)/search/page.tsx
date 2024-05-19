import type { SearchOptions } from '@/lib/services/venueService/searchOptionsSchema';

import { notFound } from 'next/navigation';

import { NonUndefined } from 'react-hook-form';
import { z } from 'zod';

import { venueService } from '@/lib/services';
import {
  flatSearchOptionsSchema,
  searchOptionsSchema,
} from '@/lib/services/venueService/searchOptionsSchema';
import { SearchCard } from './SearchCard';
import { SearchDrawer } from './SearchDrawer';
import { SearchResult } from './SearchResult';

type Props = {
  searchParams?: Partial<SearchOptions>;
};

const SearchPage = async ({ searchParams }: Props) => {
  const searchOptions = flatSearchOptionsSchema.safeParse(searchParams);

  if (!searchOptions.success) return notFound();

  const transformedOptions = transformSearchParams(searchOptions.data);

  const cleanedOptions = removeUndefinedAndEmpty(transformedOptions);

  const { venues } = await venueService.search(cleanedOptions);

  return (
    <section className="max-w-7xl pb-16">
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
  };
}

// TODO: improve the return type of this function to correctly remove undefined values
const removeUndefinedAndEmpty = <T extends Record<string, any>>(obj: T): Partial<T> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      if (isObject(value)) {
        const cleanedValue = removeUndefinedAndEmpty(value);
        if (!isEmptyObject(cleanedValue)) {
          acc[key as keyof T] = cleanedValue as NonUndefined<T[keyof T]>;
        }
      } else {
        acc[key as keyof T] = value;
      }
    }
    return acc;
  }, {} as Partial<T>);
};

const isEmptyObject = (value: unknown): boolean =>
  isObject(value) && Object.keys(value).length === 0;

const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
