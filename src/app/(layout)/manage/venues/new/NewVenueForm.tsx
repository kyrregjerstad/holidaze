'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  CardContent,
  CardFooter,
  Card,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createVenueSchema } from '@/lib/schema/venueSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export const NewVenueForm = () => {
  const form = useForm<z.infer<typeof createVenueSchema>>({
    resolver: zodResolver(createVenueSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      maxGuests: 0,
      meta: {
        wifi: false,
        parking: false,
        breakfast: false,
        pets: false,
      },
      location: {
        address: '',
        city: '',
        zip: '',
        country: '',
        continent: '',
        lat: 0,
        lng: 0,
      },
    },
  });

  return (
    <Card>
      <Form {...form}>
        <form>
          <CardHeader />
          <CardContent className="space-y-8">
            {form.formState.errors.root && (
              <p className="text-center text-red-600">
                {form.formState.errors.root.message}
              </p>
            )}
            <FormField
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Input type="file" {...field} />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
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

            <FormField
              name="meta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amenities</FormLabel>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="wifi" {...field} />
                      <Label htmlFor="wifi">Wifi</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="parking" {...field} />
                      <Label htmlFor="parking">Parking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="breakfast" {...field} />
                      <Label htmlFor="breakfast">Breakfast</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="pets" {...field} />
                      <Label htmlFor="pets">Pets Allowed</Label>
                    </div>
                  </div>
                </FormItem>
              )}
            />
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
