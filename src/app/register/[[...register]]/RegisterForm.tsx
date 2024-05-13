'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { useToast } from '@/components/ui/use-toast';
import {
  registerUserSchema,
  registerUserSchemaExtended,
} from '@/lib/schema/userSchema';
import { authService } from '@/lib/services';

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

  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof registerUserSchema>) => {
    const { res, error: registerError } = await authService.register(data);

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

    const { user, error: loginError } = await authService.login(
      data.email,
      data.password
    );

    if (loginError) {
      form.setError('root', { message: loginError });
      toast({
        title: 'Registration failed 😢',
        description: 'Please try again later',
        duration: 10000,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Account created 🎊',
      description: `Welcome ${user?.name || 'friend'}! ☀️`,
      duration: 10000,
    });

    await onSuccess();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.25, ease: 'easeInOut' }}
      className="z-10 w-full max-w-[500px]"
    >
      <Card className="mx-auto min-w-80 sm:min-w-96">
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
              <Label className="flex items-center gap-2">
                <Input
                  type="checkbox"
                  {...form.register('venueManager')}
                  className="size-4"
                />
                I'm a venue manager
              </Label>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="group w-full"
              >
                Register
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
