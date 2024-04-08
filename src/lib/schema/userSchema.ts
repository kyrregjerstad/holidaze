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

/* 

"name": "my_username",
    "email": "first.last@stud.noroff.no",
    "avatar": {
      "url": "https://img.service.com/avatar.jpg",
      "alt": "My avatar alt text"
    },
    "banner": {
      "url": "https://img.service.com/banner.jpg",
      "alt": "My banner alt text"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."
*/
