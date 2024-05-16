'use client';

import { eachDayOfInterval } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Props = {
  bookedDates: Date[];
  selectedDate: Date | undefined;
  setDate: (date: Date | undefined, bookedDates: Date[]) => void;
  overlayDate: Date | undefined;
  label?: string;
  buttonText?: string;
  className?: string;
};
export const DatePicker = ({
  label,
  bookedDates,
  selectedDate,
  setDate,
  overlayDate,
  buttonText,
  className,
}: Props) => {
  const dateRange = eachDayOfInterval({
    start: selectedDate || new Date(),
    end: overlayDate || new Date(),
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex flex-1 flex-col justify-between">
          {label && <Label className="text-sm">{label}</Label>}
          <Button className="w-full flex-col items-start" variant="outline" type="button">
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
      <PopoverContent className={cn('max-w-[276px] p-0', className)}>
        <Calendar
          selected={selectedDate}
          onSelect={(selectedDate) => setDate(selectedDate, bookedDates)}
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
