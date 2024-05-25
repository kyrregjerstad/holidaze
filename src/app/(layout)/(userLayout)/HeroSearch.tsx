'use client';

import type { KeyboardEvent } from 'react';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { addDays } from 'date-fns';

import { DatePicker } from '@/components/DatePicker';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBookingStore } from '@/components/venue/bookingStore';

export const HeroSearch = ({ prefilledTerm }: { prefilledTerm?: string }) => {
  const [searchTerm, setSearchTerm] = useState<string>(prefilledTerm || '');
  const router = useRouter();

  const { startDate, endDate, setStartDate, setEndDate } = useBookingStore((state) => state);

  const query = new URLSearchParams();
  query.set('location', searchTerm);

  if (startDate) {
    query.set('dateFrom', formatDate(addDays(startDate, 1)));
  }
  if (endDate) {
    query.set('dateTo', formatDate(addDays(endDate, 1)));
  }

  function handleSearchInput(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
      router.push(`/search?${query.toString()}`);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-md gap-1">
      <label htmlFor="search-location" className="sr-only">
        Search Locations
      </label>
      <Input
        placeholder="Search location"
        id="search-location"
        name="search-location"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleSearchInput}
      />
      <div className="flex justify-between gap-2">
        <DatePicker
          bookedDates={[]}
          setDate={setStartDate}
          selectedDate={startDate}
          overlayDate={endDate}
        />
        <DatePicker
          bookedDates={[]}
          setDate={setEndDate}
          selectedDate={endDate}
          overlayDate={startDate}
        />
      </div>
      <Link
        className={buttonVariants({
          className: 'mt-2 w-full bg-black text-lg font-bold text-foreground',
        })}
        href={`/search?${query.toString()}`}
      >
        Search
      </Link>
    </div>
  );
};

const formatDate = (date: Date | undefined) => date?.toISOString().split('T')[0] || '';
