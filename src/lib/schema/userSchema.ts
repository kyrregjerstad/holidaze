import { z } from 'zod';

import { venueBaseSchema } from './venueSchema';

export const registerUserSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(32, 'Name must be at most 32 characters')
    .regex(/^[a-zA-Z0-9_]*$/, 'Only a-z A-Z 0-9 and _ are allowed'),
  email: z
    .string()
    .email()
    .regex(/stud\.noroff\.no$/, 'Only @stud.noroff.no emails are allowed'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  venueManager: z.boolean().default(false),
  bio: z.string().min(3).nullish(),
  avatar: z
    .object({
      url: z.string().nullable(),
      alt: z.string().nullable(),
    })
    .nullish(),
  banner: z
    .object({
      url: z.string().nullable(),
      alt: z.string().nullable(),
    })
    .nullish(),
});

export const registerUserSchemaExtended = registerUserSchema
  .extend({
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Passwords must match',
    path: ['repeatPassword'],
  });

export const registerUserResponseSchema = z.object({
  name: z.string(),
  email: z.string(),
  bio: z.string().nullable(),
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

export const avatarSchema = z.object({
  url: z.string().nullable(),
  alt: z.string().nullable(),
});

export const bannerSchema = z.object({
  url: z.string().nullable(),
  alt: z.string().nullable(),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const loginUserReturnSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  avatar: avatarSchema.nullable(),
  banner: bannerSchema.nullable(),
  accessToken: z.string(),
  venueManager: z.boolean(),
});

export const userProfileSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  bio: z.string().nullable(),
  avatar: avatarSchema.nullable(),
  banner: bannerSchema.nullable(),
  venueManager: z.boolean(),
  _count: z.object({
    venues: z.number(),
    bookings: z.number(),
  }),
});

export const userProfileSchemaExtended = userProfileSchema.extend({
  venues: z.array(venueBaseSchema),
});
