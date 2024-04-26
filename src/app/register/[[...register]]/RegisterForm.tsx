'use client';
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
import {
  registerUserSchema,
  registerUserSchemaExtended,
} from '@/lib/schema/userSchema';
import { fetchRegisterUser, handleLoginApi } from '@/lib/services/authService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import Link from 'next/link';

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
    const { res, error: registerError } = await fetchRegisterUser({
      name,
      email,
      password,
    });

    if (registerError) {
      console.error('API RESPONSE: ', registerError);

      form.setError('root', {
        type: 'manual',
        message:
          registerError.errors.map((e) => e.message).join(', ') ||
          'Unknown error',
      });

      return;
    }

    const { user, error: loginError } = await handleLoginApi(email, password);

    if (loginError) {
      form.setError('root', { message: loginError });
      return;
    }

    await onSuccess();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.25, ease: 'easeInOut' }}
      className="z-10"
    >
      <Card className="mx-auto min-w-96">
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
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="group w-full"
              >
                register
                <span className="translate-x-1 transition-transform group-hover:scale-125">
                  ☀️
                </span>
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col justify-center text-xs">
          <p>Already have an account?</p>
          <Link href="/login" className="cursor-pointer hover:underline">
            Login
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
