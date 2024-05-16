'use client';

import type { KeyboardEvent } from 'react';

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
import { useSearchQueryParams } from '@/lib/hooks/useQueryParams';
import type { SearchOptions } from '@/lib/services/venueService/searchOptionsSchema';

export const SearchCard = ({ prefilledSearch }: { prefilledSearch?: Partial<SearchOptions> }) => {
  const router = useRouter();
  const params = useSearchQueryParams(prefilledSearch);

  const handleSearchInput = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      router.push(`/search?${params.getSearchParams()}`);
    }
  };

  return (
    <Card className="mx-auto grid max-w-5xl grid-cols-1 gap-4 p-4 text-left md:grid-cols-3">
      <div>
        <Label className="text-sm">Keywords</Label>
        <Input
          placeholder="Search by name or description"
          value={params.searchText}
          onChange={(e) => params.setSearchText(e.target.value)}
          onKeyDown={handleSearchInput}
        />
      </div>
      <div>
        <Label className="text-sm">Location</Label>
        <Input
          placeholder="City, country or region"
          value={params.location}
          onChange={(e) => params.setLocation(e.target.value)}
          onKeyDown={handleSearchInput}
        />
      </div>

      <div className="flex gap-2">
        <DatePicker
          bookedDates={[]}
          setDate={(date) =>
            params.setAvailability((prev) => ({ ...prev, dateFrom: formatDate(date) }))
          }
          selectedDate={
            params.availability?.dateFrom ? new Date(params.availability.dateFrom) : undefined
          }
          overlayDate={undefined}
          buttonText="Start Date"
          label="From"
        />
        <DatePicker
          bookedDates={[]}
          setDate={(date) =>
            params.setAvailability((prev) => ({ ...prev, dateTo: formatDate(date) }))
          }
          selectedDate={
            params.availability?.dateTo ? new Date(params.availability.dateTo) : undefined
          }
          overlayDate={undefined}
          buttonText="End Date"
          label="To"
        />
      </div>
      <div className="flex flex-col justify-between">
        <Label className="text-sm">Price</Label>
        <div className="flex w-full gap-2">
          <Input
            type="number"
            className="w-full flex-1"
            placeholder="from"
            onChange={(e) =>
              params.setPrice((prev) => {
                const parsedValue = parseInt(e.target.value);
                return { ...prev, min: isNaN(parsedValue) ? undefined : parsedValue };
              })
            }
            value={params.price?.min}
          />
          <Input
            type="number"
            className="w-full flex-1"
            placeholder="to"
            onChange={(e) =>
              params.setPrice((prev) => {
                const parsedValue = parseInt(e.target.value);
                return { ...prev, max: isNaN(parsedValue) ? undefined : parsedValue };
              })
            }
            value={params.price?.max}
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <Label className="text-sm">Guests</Label>
          <Input
            type="number"
            onChange={(e) => {
              const parsedValue = parseInt(e.target.value);
              params.setMinGuests(isNaN(parsedValue) ? undefined : parsedValue);
            }}
            value={params.minGuests}
          />
        </div>
        <div className="flex-1">
          <Label className="text-sm">Order</Label>
          <Select
            defaultValue="asc"
            onValueChange={(value) =>
              params.setSort({ field: 'price', order: value as 'asc' | 'desc' })
            }
          >
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
        href={`/search?${params.getSearchParams()}`}
        className={buttonVariants({ className: 'w-full self-end' })}
      >
        Search
      </Link>
    </Card>
  );
};

const formatDate = (date: Date | undefined) => date?.toISOString().split('T')[0] || '';
