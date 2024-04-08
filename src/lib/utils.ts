import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
import { apiMetaSchema } from './schema/apiSchema';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
