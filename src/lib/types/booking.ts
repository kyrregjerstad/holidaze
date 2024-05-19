import type { getAllBookingsSchema } from '@/lib/schema';
import type { z } from 'zod';

export type Booking = z.infer<typeof getAllBookingsSchema>[number];
