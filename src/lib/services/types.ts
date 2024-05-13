import type { z } from 'zod';

export interface ServiceReturn {
  error: z.ZodError | null;
  status: number;
}

export interface Meta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}
