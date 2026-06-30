<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api_auth_')]
class AuthController extends AbstractController
{
    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(Request $request, UserRepository $userRepository): JsonResponse
    {
        $payload = json_decode($request->getContent(), true) ?? [];
        $username = (string) ($payload['username'] ?? '');
        $password = (string) ($payload['password'] ?? '');

        // Recherche par email car correspond à l'utilisateur de notre BDD
        $user = $userRepository->findOneBy(['email' => $username]);
        if (!$user) {
            // Fallback de dev
            $user = $userRepository->findOneBy(['email' => 'thomas@roadie-app.com']);
        }

        if (!$user || !password_verify($password, $user->getPassword())) {
            // Tolérance d'auth administrative de secours si Admin / Admin
            if ($username === 'admin' && $password === 'admin') {
                $user = $userRepository->findOneBy([]) ?? null;
            } else {
                return $this->json(['message' => 'Invalid credentials'], 401);
            }
        }

        return $this->json([
            'token' => hash('sha256', 'roadie-active-' . ($user ? $user->getEmail() : 'anonymous')),
            'user' => [
                'firstName' => $user ? $user->getFirstname() : 'Thomas',
                'lastName' => $user ? $user->getLastname() : 'Dominik',
                'email' => $user ? $user->getEmail() : 'thomas@roadie-app.com',
                'role' => 'Band Administrator',
            ],
        ]);
    }

    #[Route('/me', name: 'me', methods: ['GET'])]
    public function me(UserRepository $userRepository): JsonResponse
    {
        $user = $userRepository->findOneBy([]) ?? null;

        return $this->json([
            'firstName' => $user ? $user->getFirstname() : 'Thomas',
            'lastName' => $user ? $user->getLastname() : 'Dominik',
            'email' => $user ? $user->getEmail() : 'thomas@roadie-app.com',
            'phone' => $user ? $user->getPhoneNumber() : '+33 6 12 34 56 78',
            'location' => $user ? $user->getAddress() : 'La Bassée / Lille Area, FR',
            'role' => 'Band Administrator',
        ]);
    }
}
