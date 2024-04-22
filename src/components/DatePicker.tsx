'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { eachDayOfInterval } from 'date-fns';

type Props = {
  bookedDates: Date[];
  selectedDate: Date | undefined;
  setDate: (date: Date | undefined) => void;
  overlayDate: Date | undefined;
  label?: string;
  buttonText?: string;
};
export const DatePicker = ({
  label,
  bookedDates,
  selectedDate,
  setDate,
  overlayDate,
  buttonText,
}: Props) => {
  const dateRange = eachDayOfInterval({
    start: selectedDate || new Date(),
    end: overlayDate || new Date(),
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex flex-1 flex-col">
          {label && <Label className="text-sm">{label}</Label>}
          <Button
            className="h-10 w-full flex-col items-start"
            variant="outline"
          >
            <span className="font-normal">
              {selectedDate ? (
                selectedDate?.toLocaleDateString('en-UK')
              ) : (
                <span className="text-muted-foreground">
                  {buttonText ? buttonText : 'Select date'}
                </span>
              )}
            </span>
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="max-w-[276px] p-0">
        <Calendar
          selected={selectedDate}
          onSelect={setDate}
          mode="single"
          modifiers={{ booked: dateRange }}
          modifiersClassNames={{
            booked: 'bg-accent/50 font-bold',
            selected: 'bg-black text-white',
          }}
          required
          fromDate={new Date()}
          disabled={bookedDates}
          defaultMonth={selectedDate || new Date()}
          weekStartsOn={1}
        />
      </PopoverContent>
    </Popover>
  );
};
