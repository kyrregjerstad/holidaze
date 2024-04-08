import { z } from 'zod';

export const registerUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  bio: z.string().min(3).nullable(),
  avatar: z
    .object({
      url: z.string().nullable(),
      alt: z.string().nullable(),
    })
    .nullable(),
  banner: z
    .object({
      url: z.string().nullable(),
      alt: z.string().nullable(),
    })
    .nullable(),
});
