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

import { loginUserSchema } from '@/lib/schema/userSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Props = {
  onSuccess?: () => void;
};

export const LoginForm = ({ onSuccess }: Props) => {
  const form = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async ({
    email,
    password,
  }: z.infer<typeof loginUserSchema>) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      form.setError('root', {
        type: 'manual',
        message: 'Incorrect email or password',
      });
      return;
    }

    onSuccess?.();
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader />
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
            method="POST"
          >
            {form.formState.errors.root && (
              <p className="text-center text-red-600">
                {form.formState.errors.root.message}
              </p>
            )}
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

            <Button type="submit" disabled={form.formState.isSubmitting}>
              Log in
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
