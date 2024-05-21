import type { SearchOptions } from '../services/venueService/searchOptionsSchema';

import { useState } from 'react';

export const useSearchQueryParams = (prefilledValues?: Partial<SearchOptions>) => {
  const [searchText, setSearchText] = useState<string>(prefilledValues?.searchText || '');
  const [price, setPrice] = useState<{ min?: number; max?: number }>({
    min: prefilledValues?.price?.min,
    max: prefilledValues?.price?.max,
  });
  const [location, setLocation] = useState<string>(prefilledValues?.location || '');
  const [availability, setAvailability] = useState<{
    dateFrom?: string;
    dateTo?: string;
    flexible?: boolean;
  }>({
    dateFrom: prefilledValues?.availability?.dateFrom,
    dateTo: prefilledValues?.availability?.dateTo,
    flexible: prefilledValues?.availability?.flexible,
  });
  const [minGuests, setMinGuests] = useState<number | undefined>(prefilledValues?.minGuests);
  const [sort, setSort] = useState<{
    field: 'price' | 'maxGuests' | 'name' | 'created' | 'updated';
    order: 'asc' | 'desc';
  }>({
    field: prefilledValues?.sort?.field || 'price',
    order: prefilledValues?.sort?.order || 'asc',
  });
  const [amount, setAmount] = useState<number | undefined>(prefilledValues?.amount);

  const getSearchParams = () => {
    const query = new URLSearchParams();

    if (searchText && searchText !== '') query.set('searchText', searchText);
    if (availability.dateFrom) query.set('startDate', availability.dateFrom);
    if (availability.dateTo) query.set('endDate', availability.dateTo);
    if (location && location !== '') query.set('location', location);
    if (price.min !== undefined) query.set('priceMin', price.min.toString());
    if (price.max !== undefined) query.set('priceMax', price.max.toString());
    if (minGuests !== undefined) query.set('minGuests', minGuests.toString());
    if (sort) {
      query.set('sortField', sort.field);
      query.set('sortOrder', sort.order);
    }
    if (amount !== undefined) query.set('amount', amount.toString());

    return query.toString();
  };

  return {
    searchText,
    setSearchText,
    price,
    setPrice,
    location,
    setLocation,
    availability,
    setAvailability,
    minGuests,
    setMinGuests,
    sort,
    setSort,
    amount,
    setAmount,
    getSearchParams,
  };
};

export const formatDate = (date: Date | undefined) => date?.toISOString().split('T')[0] || '';
