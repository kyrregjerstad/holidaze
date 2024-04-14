import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CardTitle, CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from '@/components/ui/popover';
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { venueSchema } from '@/lib/schema/venueSchema';
import { z } from 'zod';

type Props = {
  venue: z.infer<typeof venueSchema>;
};
export const VenueDetailsCard = ({ venue }: Props) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formattedTomorrow = tomorrow.toLocaleDateString();

  const inOneWeek = new Date(today);
  inOneWeek.setDate(inOneWeek.getDate() + 7);

  const formattedInOneWeek = inOneWeek.toLocaleDateString();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          ${venue.price}
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            / night
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <form className="grid gap-6">
          <div className="grid gap-2">
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="h-auto w-full flex-col items-start"
                    variant="outline"
                  >
                    <span className="text-[0.65rem] font-semibold uppercase">
                      Check in
                    </span>
                    <span className="font-normal">{formattedTomorrow}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-[276px] p-0">
                  <Calendar />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="h-auto w-full flex-col items-start"
                    variant="outline"
                  >
                    <span className="text-[0.65rem] font-semibold uppercase">
                      Check out
                    </span>
                    <span className="font-normal">{formattedInOneWeek}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-[276px] p-0">
                  <Calendar />
                </PopoverContent>
              </Popover>
            </div>
            <Select>
              <SelectTrigger className="h-auto">
                <SelectValue
                  placeholder={
                    <div className="flex flex-col items-start">
                      <span className="text-[0.65rem] font-semibold uppercase">
                        Guests
                      </span>
                      <span className="font-normal">2 adults</span>
                    </div>
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 adult</SelectItem>
                <SelectItem value="2">2 adults</SelectItem>
                <SelectItem value="3">2 adults + 1 child</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="text-gray-500 dark:text-gray-400">
                $400 &times; 3 nights
              </div>
              <div>$1,200</div>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="font-semibold">Total before taxes</div>
            <div>$1,518</div>
          </div>
          <Separator />
          <div>
            <Button className="h-12 w-full" size="lg">
              Reserve
            </Button>
          </div>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            You won't be charged yet
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
