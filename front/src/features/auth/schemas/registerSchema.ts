import { z } from 'zod';

export const registerStep2Schema = z
  .object({
    avatarUrl: z.string().optional(),
    firstName: z.string().min(1, { message: 'register.step2.error.firstname' }),
    lastName: z.string().min(1, { message: 'register.step2.error.lastname' }),
    email: z
      .string()
      .min(1, { message: 'register.step2.error.email' })
      .email({ message: 'register.step2.error.invalidEmail' }),
    phone: z.string().optional(),
    city: z.string().min(1, { message: 'register.step2.error.city' }),
    password: z
      .string()
      .min(1, { message: 'register.step2.error.password' })
      .min(6, { message: 'register.step2.error.passwordMin' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'register.step2.error.confirmPassword' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'register.step2.error.confirmPassword',
    path: ['confirmPassword'],
  });

export type RegisterStep2FormData = z.infer<typeof registerStep2Schema>;

export const registerStep3Schema = z.object({
  projectName: z
    .string()
    .min(1, { message: 'register.step3.error.projectName' }),
  projectType: z
    .string()
    .min(1, { message: 'register.step3.error.projectType' }),
  country: z.string().min(1, { message: 'register.step3.error.country' }),
  city: z.string().min(1, { message: 'register.step3.error.city' }),
  styles: z
    .array(z.string())
    .min(1, { message: 'register.step3.error.styles' }),
});

export type RegisterStep3FormData = z.infer<typeof registerStep3Schema>;
