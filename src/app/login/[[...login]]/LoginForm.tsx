'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { loginUserSchema } from '@/lib/schema/userSchema';
import { authService } from '@/lib/services';

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

  const { toast } = useToast();

  const onSubmit = async ({
    email,
    password,
  }: z.infer<typeof loginUserSchema>) => {
    const { user, error } = await authService.login(email, password);

    if (error) {
      form.setError('root', { message: error });
      return;
    }

    toast({
      title: `Welcome back ${user?.name || 'friend'}! 👋`,
      description: `Where will your next adventure take you?`,
    });

    onSuccess?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.25, ease: 'easeInOut' }}
      className="z-10"
    >
      <Card className="mx-auto min-w-80 sm:min-w-96">
        <div className="py-2"></div>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-2"
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
              <div className="py-2"></div>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="group w-full"
              >
                Log in
                <span className="translate-x-1 transition-transform group-hover:scale-125">
                  ☀️
                </span>
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col justify-center text-xs">
          <p>Don't have an account?</p>
          <Link href="/register" className="cursor-pointer hover:underline">
            Register
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
