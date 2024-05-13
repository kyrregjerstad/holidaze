'use client';

import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Venue } from '@/lib/services/venueService/recursivelyGetAllVenues';
import { formatUSD } from '@/lib/utils';
import { DatePicker } from '../DatePicker';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

type Props = {
  venue: Venue;
};
export const DisabledBookingCard = ({ venue }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          ${venue.price}
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            /night
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative grid gap-6">
        <div className="absolute flex h-full w-full flex-col items-center justify-center">
          <span className="z-10">
            Please{' '}
            <Link href={`/login?ref=/venues/${venue.id}`} className="underline">
              log in
            </Link>{' '}
            or{' '}
            <Link
              href={`/register?ref=/venues/${venue.id}`}
              className="underline"
            >
              register
            </Link>{' '}
            to book this venue
          </span>
        </div>
        <div className="pointer-events-none grid gap-6 opacity-50 blur-sm">
          <div className="grid gap-4">
            <div className="flex justify-between gap-2">
              <DatePicker
                label="Check in"
                bookedDates={[]}
                setDate={() => {}}
                selectedDate={undefined}
                overlayDate={undefined}
              />
              <DatePicker
                label="Check out"
                bookedDates={[]}
                setDate={() => {}}
                selectedDate={undefined}
                overlayDate={undefined}
              />
            </div>

            <div className="flex justify-between">
              <div>
                <Label htmlFor="guests">Guests</Label>
                <Input
                  id="guests"
                  name="guests"
                  type="number"
                  defaultValue={venue.maxGuests >= 2 ? 2 : 1}
                  className="w-20"
                  max={venue.maxGuests}
                  min={1}
                />
              </div>
              <div className="self-end justify-self-end "></div>
            </div>
          </div>
          <div className="space-y-4">
            <Separator />
            <div className="flex items-center justify-between">
              <div className="font-semibold">Total</div>
            </div>
            <Separator />
          </div>
          <div>
            <Button className={'w-full'}>Reserve</Button>
          </div>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            You won't be charged yet
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
