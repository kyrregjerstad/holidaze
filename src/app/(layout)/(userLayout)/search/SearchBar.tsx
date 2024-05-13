'use client';

import { KeyboardEvent, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { RotateCcwIcon, TimerResetIcon } from 'lucide-react';

import { DatePicker } from '@/components/DatePicker';
import { Button, buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBookingStore } from '../../../../components/venue/bookingStore';

export const SearchBar = ({ prefilledTerm }: { prefilledTerm?: string }) => {
  const [searchTerm, setSearchTerm] = useState<string>(prefilledTerm || '');
  const router = useRouter();

  const { startDate, endDate, setStartDate, setEndDate } = useBookingStore(
    (state) => state
  );

  const query = new URLSearchParams();

  if (searchTerm && searchTerm !== '') {
    query.set('q', searchTerm);
  }

  console.log(query.toString());

  if (startDate) {
    query.set('startDate', formatDate(startDate));
  }
  if (endDate) {
    query.set('endDate', formatDate(endDate));
  }

  function handleSearchInput(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
      router.push(`/search?${query.toString()}`);
    } else {
      setSearchTerm(event.currentTarget.value);
    }
  }

  return (
    <div className="flex w-full justify-center gap-4 rounded-3xl border px-8 pb-10 pt-8">
      <div className="grid flex-1">
        <Label className="text-sm">Location</Label>
        <Input
          placeholder="Search location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchInput}
        />
      </div>
      <div className="flex gap-1">
        <DatePicker
          bookedDates={[]}
          setDate={setStartDate}
          selectedDate={startDate}
          overlayDate={endDate}
          buttonText="Start Date"
          label="Start Date"
        />
        <DatePicker
          bookedDates={[]}
          setDate={setEndDate}
          selectedDate={endDate}
          overlayDate={startDate}
          buttonText="End Date"
          label="End Date"
        />
      </div>
      <div className="grid">
        <Label className="text-sm">Guests</Label>
        <Input type="number" className="w-20" />
      </div>
      <div className="grid">
        <Label className="text-sm">Price</Label>
        <div className="flex gap-2">
          <Input type="number" className="w-20" placeholder="from" />
          <Input type="number" className="w-20" placeholder="to" />
        </div>
      </div>
      <div className="flex items-center self-end">
        <Link
          type="submit"
          href={`/search?${query}`}
          className={buttonVariants({ className: 'self-end' })}
        >
          Search
        </Link>
        <Link
          type="submit"
          href={`/search?${query}`}
          className={buttonVariants({
            variant: 'ghost',
            className: 'self-end',
          })}
        >
          <RotateCcwIcon />
        </Link>
      </div>
    </div>
  );
};

const formatDate = (date: Date | undefined) =>
  date?.toISOString().split('T')[0] || '';
