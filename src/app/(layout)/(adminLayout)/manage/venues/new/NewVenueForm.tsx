'use client';

import { ImageUploader } from '@/components/ImageUploader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  createVenueSchema,
  createVenueSchemaFlattened,
} from '@/lib/schema/venueSchema';
import { CreateVenue } from '@/lib/services/venuesService';
import { zodResolver } from '@hookform/resolvers/zod';
import { XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Props = {
  submitFn: (data: z.infer<typeof createVenueSchema>) => Promise<CreateVenue>;
};

export const NewVenueForm = ({ submitFn }: Props) => {
  const form = useForm<z.infer<typeof createVenueSchemaFlattened>>({
    resolver: zodResolver(createVenueSchemaFlattened),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      maxGuests: 0,

      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,

      address: '',
      city: '',
      zip: '',
      country: '',
      continent: '',
      lat: 0,
      lng: 0,
    },
  });

  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const onSubmit = async (data: z.infer<typeof createVenueSchemaFlattened>) => {
    const res = await submitFn({
      ...data,
      meta: {
        wifi: data.wifi,
        parking: data.parking,
        breakfast: data.breakfast,
        pets: data.pets,
      },
      location: {
        address: data.address,
        city: data.city,
        zip: data.zip,
        country: data.country,
        continent: data.continent,
        lat: data.lat,
        lng: data.lng,
      },
    });

    if (res.error) {
      form.setError('root', { message: res.error.message });
      return;
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
          <CardHeader />
          <CardContent className="space-y-8">
            {form.formState.errors.root && (
              <p className="text-center text-red-600">
                {form.formState.errors.root.message}
              </p>
            )}
            {images.length < 8 && (
              <ImageUploader
                files={files}
                setFiles={setFiles}
                uploadedImages={images}
                setUploadedImages={setImages}
              />
            )}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                <>
                  {images.map((url) => (
                    <div
                      key={url}
                      className="group relative aspect-square overflow-hidden rounded-sm"
                    >
                      <Button
                        variant="ghost"
                        className="absolute right-0 top-0 size-8 p-0 opacity-50 group-hover:bg-background group-hover:opacity-100"
                        type="button"
                        onClick={() => {
                          setImages(images.filter((img) => img !== url));
                        }}
                      >
                        <XIcon className="text-red-600" />
                      </Button>
                      <img
                        src={url}
                        alt="venue"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </>
              </div>
            )}
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <Input
                    placeholder="Enter a title for your venue"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <Textarea placeholder="Describe your venue" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                name="price"
                render={({ field }) => (
                  <FormItem className="max-w-32">
                    <FormLabel>Price per Night</FormLabel>
                    <Input
                      placeholder="Enter price per night"
                      type="number"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="maxGuests"
                render={({ field }) => (
                  <FormItem className="max-w-32">
                    <FormLabel>Max Guests</FormLabel>
                    <Input
                      placeholder="Enter maximum number of guests"
                      type="number"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid w-fit grid-cols-2 gap-y-8">
              <FormField
                name="wifi"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="wifi"
                        {...field}
                        onCheckedChange={field.onChange}
                      />
                      <Label htmlFor="wifi">Wifi</Label>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                name="parking"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="parking"
                        {...field}
                        onCheckedChange={field.onChange}
                      />
                      <Label htmlFor="parking">Parking</Label>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                name="breakfast"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="breakfast"
                        {...field}
                        onCheckedChange={field.onChange}
                      />
                      <Label htmlFor="breakfast">Breakfast</Label>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="pets"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="pets"
                        {...field}
                        onCheckedChange={field.onChange}
                      />
                      <Label htmlFor="pets">Pets Allowed</Label>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Input
                    placeholder="Enter the location of your venue"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button className="ml-auto" disabled={form.formState.isSubmitting}>
              Create Venue
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};