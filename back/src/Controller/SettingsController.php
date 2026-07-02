<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\ContextRepository;
use App\Repository\MemberRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/settings', name: 'api_settings_')]
class SettingsController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(
        UserRepository $userRepository,
        ContextRepository $contextRepository,
        MemberRepository $memberRepository
    ): JsonResponse {
        $allUsers = $userRepository->findAll();
        $usersList = [];

        foreach ($allUsers as $u) {
            $usersList[] = $this->serializeUser($u);
        }

        $projects = array_map(
            fn ($context) => [
                'id' => $context->getId(),
                'value' => (string) $context->getId(),
                'label' => $context->getName(),
                'style' => $context->getStyle(),
                'location' => $context->getLocation(),
                'bio' => $context->getBio() ?? '',
                'musicBrainzArtistId' => $context->getMusicBrainzArtistId() ?? '',
            ],
            $contextRepository->findBy([], ['name' => 'ASC'])
        );

        $members = array_map(
            fn ($member) => [
                'id' => $member->getId(),
                'name' => $member->getName(),
                'role' => $member->getRole(),
                'projectId' => $member->getContext()?->getId(),
                'projectName' => $member->getContext()?->getName(),
            ],
            $memberRepository->findBy([], ['id' => 'ASC'])
        );

        return $this->json([
            'projects' => $projects,
            'members' => $members,
            'users' => $usersList,
            'integrations' => [
                'spotifySecret' => $this->maskSecret('sp_sec_8f3a19c8b7d2f1a3c89f24e5b'),
                'musicBrainzId' => 'mbid-7b1a94f8-32c0-4b11-b1e2-9d83aef7c401',
                'deezerKey' => $this->maskSecret('dz_key_92bd84fa10c9e782'),
            ],
            'preferences' => [
                'theme' => 'system',
                'notificationSettings' => [
                    'syncFail' => true,
                    'rehearsalReminder' => false,
                    'weeklyDigest' => true,
                ],
            ],
        ]);
    }

    /**
     * Masque une clé secrète en ne conservant que le préfixe et les 4 derniers
     * caractères afin de ne jamais exposer le secret complet côté client.
     */
    private function maskSecret(string $secret): string
    {
        if (strlen($secret) <= 8) {
            return str_repeat('•', strlen($secret));
        }

        $visibleStart = substr($secret, 0, 7);
        $visibleEnd = substr($secret, -4);

        return $visibleStart . str_repeat('•', 8) . $visibleEnd;
    }

    #[Route('/users', name: 'users_create', methods: ['POST'])]
    public function createUser(Request $request, UserRepository $userRepository, EntityManagerInterface $em): JsonResponse
    {
        $payload = json_decode($request->getContent(), true) ?? [];
        $email = trim((string) ($payload['email'] ?? ''));
        $firstName = trim((string) ($payload['firstName'] ?? ''));
        $lastName = trim((string) ($payload['lastName'] ?? ''));
        $password = (string) ($payload['password'] ?? '');
        $phone = trim((string) ($payload['phone'] ?? ''));
        $address = trim((string) ($payload['address'] ?? ''));

        if (empty($email) || empty($firstName) || empty($lastName) || empty($password)) {
            return $this->json(['message' => 'Prénom, nom, email et mot de passe sont obligatoires'], 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->json(['message' => 'Adresse email invalide'], 400);
        }

        if ($userRepository->findOneBy(['email' => $email])) {
            return $this->json(['message' => 'Cette adresse email est déjà utilisée'], 409);
        }

        $user = new User();
        $user->setEmail($email);
        $user->setFirstname($firstName);
        $user->setLastname($lastName);
        $user->setPhoneNumber($phone !== '' ? $phone : null);
        $user->setAddress($address !== '' ? $address : null);
        $user->setPassword(password_hash($password, PASSWORD_BCRYPT));
        $user->setEmailVerified(true);
        $user->setLastLogin(new \DateTime());

        $em->persist($user);
        $em->flush();

        return $this->json([
            'message' => 'Utilisateur ajouté avec succès',
            'user' => $this->serializeUser($user),
        ], 201);
    }

    #[Route('/users/{id}', name: 'users_update', methods: ['PUT', 'PATCH'])]
    public function updateUser(int $id, Request $request, UserRepository $userRepository, EntityManagerInterface $em): JsonResponse
    {
        $user = $userRepository->find($id);
        if (!$user) {
            return $this->json(['message' => 'Utilisateur introuvable'], 404);
        }

        $payload = json_decode($request->getContent(), true) ?? [];

        if (isset($payload['firstName']) && trim((string) $payload['firstName']) !== '') {
            $user->setFirstname(trim((string) $payload['firstName']));
        }
        if (isset($payload['lastName']) && trim((string) $payload['lastName']) !== '') {
            $user->setLastname(trim((string) $payload['lastName']));
        }
        if (isset($payload['email'])) {
            $email = trim((string) $payload['email']);
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return $this->json(['message' => 'Adresse email invalide'], 400);
            }
            $existing = $userRepository->findOneBy(['email' => $email]);
            if ($existing && $existing->getId() !== $user->getId()) {
                return $this->json(['message' => 'Cette adresse email est déjà utilisée'], 409);
            }
            $user->setEmail($email);
        }
        if (array_key_exists('phone', $payload)) {
            $phone = trim((string) $payload['phone']);
            $user->setPhoneNumber($phone !== '' ? $phone : null);
        }
        if (array_key_exists('address', $payload)) {
            $address = trim((string) $payload['address']);
            $user->setAddress($address !== '' ? $address : null);
        }

        $em->flush();

        return $this->json([
            'message' => 'Utilisateur mis à jour',
            'user' => $this->serializeUser($user),
        ]);
    }

    #[Route('/users/{id}', name: 'users_delete', methods: ['DELETE'])]
    public function deleteUser(int $id, UserRepository $userRepository, EntityManagerInterface $em): JsonResponse
    {
        $user = $userRepository->find($id);
        if (!$user) {
            return $this->json(['message' => 'Utilisateur introuvable'], 404);
        }

        $em->remove($user);
        $em->flush();

        return $this->json(['message' => 'Utilisateur supprimé', 'id' => $id]);
    }

    /**
     * Normalise un utilisateur pour la réponse JSON côté paramètres.
     */
    private function serializeUser(User $user): array
    {
        return [
            'id' => $user->getId(),
            'firstName' => $user->getFirstname(),
            'lastName' => $user->getLastname(),
            'email' => $user->getEmail(),
            'project' => 'Stuck In Yesterday',
            'role' => 'Admin',
            'address' => $user->getAddress() ?? '',
            'phone' => $user->getPhoneNumber() ?? '',
        ];
    }
}
