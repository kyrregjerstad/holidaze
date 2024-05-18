'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { updateProfileSchema } from '@/lib/schema';
import { UpdateProfileReturn } from '@/lib/services/profileService/updateProfile';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

type Schema = z.infer<typeof updateProfileSchema>;
type Props = {
  profile: {
    bio: string | null;
    avatar: {
      url: string | null;
      alt: string | null;
    } | null;
    banner: {
      url: string | null;
      alt: string | null;
    } | null;
    venueManager: boolean;
  };
  updateProfile: (data: Schema) => Promise<UpdateProfileReturn>;
};
export const UpdateProfileForm = ({ profile, updateProfile }: Props) => {
  const form = useForm<Schema>({
    defaultValues: {
      bio: profile.bio || '',
      avatarUrl: profile.avatar?.url || '',
      avatarAlt: profile.avatar?.alt || '',
      bannerUrl: profile.banner?.url || '',
      bannerAlt: profile.banner?.alt || '',
      venueManager: profile.venueManager,
    },
    resolver: zodResolver(updateProfileSchema),
  });

  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (data: Schema) => {
    const { profile, status, error } = await updateProfile(data);

    if (status === 400) {
      return toast({
        title: 'Error',
        description: 'One or more of the image URLs are invalid or not publicly accessible.',
        variant: 'error',
      });
    }

    if (error) {
      return toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'error',
      });
    }

    toast({
      title: 'Success',
      description: 'Profile updated successfully.',
    });

    router.push(`/profiles/${profile?.name}`);
  };

  return (
    <Card className="w-full max-w-4xl p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <Textarea {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="avatarUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar URL</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="avatarAlt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar Description</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="bannerUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner URL</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="bannerAlt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner Description</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="venueManager"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>I'm a Venue Manager</FormLabel>
                <Switch {...field} defaultChecked={profile.venueManager} />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full items-end justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
              Update Profile
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};
