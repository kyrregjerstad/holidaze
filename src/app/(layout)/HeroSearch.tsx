'use client';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { KeyboardEvent, useState } from 'react';
import { DatePicker } from '@/components/DatePicker';
import { useBookingStore } from './venues/[id]/bookingStore';
import { useRouter } from 'next/navigation';

export const HeroSearch = ({ prefilledTerm }: { prefilledTerm?: string }) => {
  const [searchTerm, setSearchTerm] = useState<string>(prefilledTerm || '');
  const router = useRouter();

  const { startDate, endDate, setStartDate, setEndDate } = useBookingStore(
    (state) => state
  );

  const query = new URLSearchParams();
  query.set('q', searchTerm);

  if (startDate) {
    query.set('startDate', formatDate(startDate));
  }
  if (endDate) {
    query.set('endDate', formatDate(endDate));
  }

  function handleSearchInput(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
      router.push(`/search?${query.toString()}`);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-md gap-1">
      <Input
        placeholder="Search location"
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
        className={buttonVariants({ className: 'mt-2 w-full' })}
        href={`/search?${query.toString()}`}
      >
        Search
      </Link>
    </div>
  );
};

const formatDate = (date: Date | undefined) =>
  date?.toISOString().split('T')[0] || '';
