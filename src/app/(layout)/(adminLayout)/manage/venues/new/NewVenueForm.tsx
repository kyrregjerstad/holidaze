'use client';

import type { createVenueSchema } from '@/lib/schema/venueSchema';
import type { CreateVenueReturn } from '@/lib/services/venueService/createVenue';
import type { z } from 'zod';

import { useState } from 'react';

import Image from 'next/image';

import { zodResolver } from '@hookform/resolvers/zod';
import { APIProvider } from '@vis.gl/react-google-maps';
import { XIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { createVenueSchemaFlattened } from '@/lib/schema/venueSchema';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';
import { ImageUploader } from '@/components/ImageUploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

/* 
TODO: 
- accessibility could be improved, with keyboard navigation.
*/
type Props = {
  submitFn: (data: z.infer<typeof createVenueSchema>) => CreateVenueReturn;
  onSuccess: () => Promise<void>;
};

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  throw new Error('GOOGLE_MAPS_API_KEY is not defined');
}

export const NewVenueForm = ({ submitFn, onSuccess }: Props) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof createVenueSchemaFlattened>>({
    resolver: zodResolver(createVenueSchemaFlattened),
    defaultValues: {
      name: '',
      description: '',
      price: 50,
      maxGuests: 2,

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

      media: [],
    },
  });

  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const onSubmit = async (data: z.infer<typeof createVenueSchemaFlattened>) => {
    console.log('data', data);
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
      media: images.map((url, i) => ({ url, alt: `${data.name} ${i}` })),
    });

    if (res.error) {
      form.setError('root', { message: res.error.message });
      toast({
        title: 'Error',
        description: res.error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Venue Created',
      description: `Your venue ${data.name} has been created successfully.`,
    });

    await onSuccess();
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
          <CardHeader />
          <CardContent className="space-y-8">
            {form.formState.errors.root && (
              <p className="text-center text-red-600">{form.formState.errors.root.message}</p>
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
                      <Image
                        src={url}
                        alt="venue"
                        width={1920}
                        height={1080}
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
                  <Input placeholder="Enter a title for your venue" {...field} />
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
                      min={1}
                      max={10000}
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
                      min={1}
                      max={100}
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
                      <Switch id="wifi" {...field} onCheckedChange={field.onChange} />
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
                      <Switch id="parking" {...field} onCheckedChange={field.onChange} />
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
                      <Switch id="breakfast" {...field} onCheckedChange={field.onChange} />
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
                      <Switch id="pets" {...field} onCheckedChange={field.onChange} />
                      <Label htmlFor="pets">Pets Allowed</Label>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
              <AddressAutocomplete
                onPlaceSelect={(place) => {
                  const address = transformAddress(place?.address_components);
                  form.setValue('address', address.address);
                  form.setValue('city', address.city);
                  form.setValue('zip', address.zip);
                  form.setValue('country', address.country);
                  form.setValue('continent', address.continent);
                  form.setValue('lat', place?.geometry?.location?.lat());
                  form.setValue('lng', place?.geometry?.location?.lng());
                }}
              />
            </APIProvider>
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

type Address = {
  address: string | null;
  city: string | null;
  zip: string | null;
  country: string | null;
  continent: string | null;
};

function transformAddress(
  googleMapsAddress: google.maps.places.PlaceResult['address_components']
): Address {
  if (!googleMapsAddress) {
    return {
      address: null,
      city: null,
      zip: null,
      country: null,
      continent: null,
    };
  }

  const streetNumber = googleMapsAddress.find((address) => address.types.includes('street_number'));
  const route = googleMapsAddress.find((address) => address.types.includes('route'));

  const city = googleMapsAddress.find((address) => address.types.includes('locality'));
  const zip = googleMapsAddress.find((address) => address.types.includes('postal_code'));
  const country = googleMapsAddress.find((address) => address.types.includes('country'));

  const address = `${route?.long_name ?? ''} ${streetNumber?.long_name ?? ''}`;

  return {
    address: address || null,
    city: city?.long_name ?? null,
    zip: zip?.long_name ?? null,
    country: country?.long_name ?? null,
    continent: null,
  };
}
