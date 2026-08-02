import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "L'adresse email est requise" })
    .email({ message: 'Adresse email invalide' }),
  password: z
    .string()
    .min(1, { message: 'Le mot de passe est requis' })
    .min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
