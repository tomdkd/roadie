import type { LoginFormData } from '../schemas/loginSchema';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (credentials: LoginFormData): Promise<AuthResponse> => {
    // Simulation d'un délai réseau de 1s
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulation d'une petite erreur pour tester le design si besoin
    if (credentials.password === 'wrongpassword') {
      throw new Error('Identifiants incorrects');
    }

    // Réponse fictive
    return {
      user: {
        id: 'user_123',
        name: 'Thomas',
        email: credentials.email,
        role: 'Tour Manager',
      },
      token: 'mock-jwt-bearer-token-roadie-2026',
    };
  },
};
