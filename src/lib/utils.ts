import type { ClassValue } from 'clsx';

import { clsx } from 'clsx';
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
