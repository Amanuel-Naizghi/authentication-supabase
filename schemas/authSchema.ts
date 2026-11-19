
import { z } from 'zod';

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must have at least 2 characters'),

    email: z.email('Enter a valid email address'),

    password: z
      .string()
      .min(6, 'Password must contain at least 6 characters'),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type SignInFormData = z.infer<typeof signInSchema>;
