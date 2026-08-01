import { z } from 'zod';

export const registerStep2Schema = z
  .object({
    avatarUrl: z.string().optional(),
    firstName: z.string().min(1, { message: 'Le prénom est requis' }),
    lastName: z.string().min(1, { message: 'Le nom est requis' }),
    email: z.string().min(1, { message: "L'email est requis" }).email({ message: 'Email invalide' }),
    phone: z.string().optional(),
    city: z.string().min(1, { message: 'La ville est requise' }),
    password: z
      .string()
      .min(1, { message: 'Le mot de passe est requis' })
      .min(6, { message: 'Au moins 6 caractères requis' }),
    confirmPassword: z.string().min(1, { message: 'Veuillez confirmer le mot de passe' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type RegisterStep2FormData = z.infer<typeof registerStep2Schema>;

export const registerStep3Schema = z.object({
  projectName: z.string().min(1, { message: 'Le nom du projet est requis' }),
  projectType: z.string().min(1, { message: 'Le type de projet est requis' }),
  country: z.string().min(1, { message: 'Le pays est requis' }),
  city: z.string().min(1, { message: 'La ville est requise' }),
  styles: z.array(z.string()).min(1, { message: 'Sélectionnez au moins un style' }),
});

export type RegisterStep3FormData = z.infer<typeof registerStep3Schema>;