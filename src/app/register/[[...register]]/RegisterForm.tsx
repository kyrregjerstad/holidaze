'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  registerUserSchema,
  registerUserSchemaExtended,
} from '@/lib/schema/userSchema';
import { fetchRegisterUser } from '@/lib/services/authService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Props = {
  onSuccess: () => Promise<void>;
};

export const RegisterForm = ({ onSuccess }: Props) => {
  const form = useForm<z.infer<typeof registerUserSchemaExtended>>({
    resolver: zodResolver(registerUserSchemaExtended),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
    },
  });

  const onSubmit = async ({
    name,
    email,
    password,
  }: z.infer<typeof registerUserSchema>) => {
    const { res, error } = await fetchRegisterUser({ name, email, password });

    if (error) {
      console.error('API RESPONSE: ', error);

      form.setError('root', {
        type: 'manual',
        message:
          error.errors.map((e) => e.message).join(', ') || 'Unknown error',
      });

      return;
    } else {
      await onSuccess();
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader />
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {form.formState.errors.root && (
              <p className="text-center text-red-600">
                {form.formState.errors.root.message}
              </p>
            )}

            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Input placeholder="name" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input placeholder="email" type="email" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input placeholder="password" type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="repeatPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repeat Password</FormLabel>
                  <Input
                    placeholder="repeat password"
                    type="password"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
