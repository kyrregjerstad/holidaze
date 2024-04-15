import { z } from 'zod';

export const registerUserSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(32, 'Name must be at most 32 characters')
    .regex(/^[a-zA-Z0-9_]*$/, 'Only a-z A-Z 0-9 and _ are allowed'),
  email: z
    .string()
    .email()
    .regex(/@noroff.no$/, 'Only @noroff.no emails are allowed'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
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

/* 

{
    "data": {
        "name": "asdfsdfasdf",
        "email": "asdfasdf@noroff.no",
        "bio": null,
        "avatar": {
            "url": "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=400&w=400",
            "alt": "A blurry multi-colored rainbow background"
        },
        "banner": {
            "url": "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=500&w=1500",
            "alt": "A blurry multi-colored rainbow background"
        }
    },
    "meta": {}
}
*/

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
});
