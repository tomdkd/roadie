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

    #[Route('/logout', name: 'logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        // Authentification stateless : la déconnexion se fait côté client en
        // supprimant le token. Cet endpoint confirme simplement l'opération.
        return $this->json(['message' => 'Déconnexion réussie']);
    }

    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(Request $request, UserRepository $userRepository, \Doctrine\ORM\EntityManagerInterface $em): JsonResponse
    {
        $payload = json_decode($request->getContent(), true) ?? [];
        $email = trim((string) ($payload['email'] ?? ''));
        $password = (string) ($payload['password'] ?? '');
        $firstName = trim((string) ($payload['firstName'] ?? ''));
        $lastName = trim((string) ($payload['lastName'] ?? ''));
        $phone = trim((string) ($payload['phone'] ?? ''));
        $location = trim((string) ($payload['location'] ?? ''));

        if (empty($email) || empty($password) || empty($firstName) || empty($lastName)) {
            return $this->json(['message' => 'Veuillez remplir tous les champs obligatoires (Prénom, Nom, Email, Mot de passe)'], 400);
        }

        $existing = $userRepository->findOneBy(['email' => $email]);
        if ($existing) {
            return $this->json(['message' => 'Cette adresse email est déjà associée à un compte administrateur'], 400);
        }

        $user = new \App\Entity\User();
        $user->setEmail($email);
        $user->setFirstname($firstName);
        $user->setLastname($lastName);
        $user->setPhoneNumber($phone);
        $user->setAddress($location);
        
        // Hachage du mot de passe sécurisé en BDD
        $hashed = password_hash($password, PASSWORD_BCRYPT);
        $user->setPassword($hashed);
        
        // Champs obligatoires de l'entité d'origine
        $user->setEmailVerified(true);
        $user->setLastLogin(new \DateTime());

        $em->persist($user);
        $em->flush();

        return $this->json([
            'message' => 'Utilisateur créé de manière persistante avec succès',
            'user' => [
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstname(),
                'lastName' => $user->getLastname(),
            ]
        ], 201);
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

    #[Route('/me', name: 'me_update', methods: ['PUT', 'POST'])]
    public function updateMe(Request $request, UserRepository $userRepository, \Doctrine\ORM\EntityManagerInterface $em): JsonResponse
    {
        $user = $userRepository->findOneBy([]) ?? null;

        if (!$user) {
            return $this->json(['message' => 'User not found'], 404);
        }

        $payload = json_decode($request->getContent(), true) ?? [];

        if (isset($payload['firstName'])) {
            $user->setFirstname((string) $payload['firstName']);
        }
        if (isset($payload['lastName'])) {
            $user->setLastname((string) $payload['lastName']);
        }
        if (isset($payload['email'])) {
            $user->setEmail((string) $payload['email']);
        }
        if (isset($payload['phone'])) {
            $user->setPhoneNumber((string) $payload['phone']);
        }
        if (isset($payload['location'])) {
            $user->setAddress((string) $payload['location']);
        }

        $em->flush();

        return $this->json([
            'message' => 'Profile updated successfully',
            'user' => [
                'firstName' => $user->getFirstname(),
                'lastName' => $user->getLastname(),
                'email' => $user->getEmail(),
                'phone' => $user->getPhoneNumber(),
                'location' => $user->getAddress(),
                'role' => 'Band Administrator',
            ]
        ]);
    }
}
