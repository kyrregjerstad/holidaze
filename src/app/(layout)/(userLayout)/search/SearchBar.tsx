'use client';

import type { KeyboardEvent } from 'react';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { DatePicker } from '@/components/DatePicker';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBookingStore } from '@/components/venue/bookingStore';

export const SearchBar = ({ prefilledTerm }: { prefilledTerm?: string }) => {
  const [searchTerm, setSearchTerm] = useState<string>(prefilledTerm || '');
  const router = useRouter();

  const { startDate, endDate, setStartDate, setEndDate } = useBookingStore((state) => state);

  const query = new URLSearchParams();

  if (searchTerm && searchTerm !== '') {
    query.set('q', searchTerm);
  }

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
    <Card className="grid grid-cols-1 gap-4 p-4 text-left md:grid-cols-3">
      <div>
        <Label className="text-sm">Keywords</Label>
        <Input
          placeholder="Search by name or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchInput}
        />
      </div>
      <div>
        <Label className="text-sm">Location</Label>
        <Input
          placeholder="City, country or region"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchInput}
        />
      </div>

      <div className="flex gap-2">
        <DatePicker
          bookedDates={[]}
          setDate={setStartDate}
          selectedDate={startDate}
          overlayDate={endDate}
          buttonText="Start Date"
          label="From"
        />
        <DatePicker
          bookedDates={[]}
          setDate={setEndDate}
          selectedDate={endDate}
          overlayDate={startDate}
          buttonText="End Date"
          label="To"
        />
      </div>
      <div className="flex flex-col justify-between">
        <Label className="text-sm">Price</Label>
        <div className="flex w-full gap-2">
          <Input type="number" className="w-full flex-1" placeholder="from" />
          <Input type="number" className="w-full flex-1" placeholder="to" />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <Label className="text-sm">Guests</Label>
          <Input type="number" />
        </div>
        <div className="flex-1">
          <Label className="text-sm">Sort By</Label>
          <Select defaultValue="asc">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Ascending" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Link
        type="submit"
        href={`/search?${query}`}
        className={buttonVariants({ className: 'w-full self-end' })}
      >
        Search
      </Link>
    </Card>
  );
};

const formatDate = (date: Date | undefined) => date?.toISOString().split('T')[0] || '';
