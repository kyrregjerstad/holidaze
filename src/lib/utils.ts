import type { ClassValue } from 'clsx';

import { clsx } from 'clsx';
import { areIntervalsOverlapping } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createUrl(baseUrl: string, params?: Record<string, boolean | string | number>) {
  const url = new URL(baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value.toString());
      }
    });
  }

  return url.toString();
}

export function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function getNoroffApiKey() {
  const apiKey = process.env.NOROFF_API_KEY;

  if (!apiKey) {
    throw new Error('Missing NOROFF_API key, did you forget to add it to your .env file?');
  }

  return apiKey;
}
export function checkAvailability(
  startDate?: Date,
  endDate?: Date,
  bookedDates: Date[] = []
): boolean {
  return !(
    startDate &&
    endDate &&
    bookedDates.some((date) =>
      areIntervalsOverlapping({ start: startDate, end: endDate }, { start: date, end: date })
    )
  );
}

export const runAsyncFnWithoutBlocking = (fn: (...args: any) => Promise<any>) => {
  fn();
};
export function extractBookedDates(bookings: { dateFrom: string; dateTo: string }[]) {
  return bookings.flatMap(({ dateFrom, dateTo }) => {
    const start = new Date(dateFrom);
    const end = new Date(dateTo);
    return generateDates(start, end);
  });
}
function generateDates(start: Date, end: Date): Date[] {
  if (start > end) {
    return [];
  } else {
    const nextDate = new Date(start);
    nextDate.setDate(nextDate.getDate() + 1);
    return [new Date(start), ...generateDates(nextDate, end)];
  }
}
