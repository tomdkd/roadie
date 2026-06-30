<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/settings', name: 'api_settings_')]
class SettingsController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(UserRepository $userRepository): JsonResponse
    {
        $allUsers = $userRepository->findAll();
        $usersList = [];

        foreach ($allUsers as $u) {
            $usersList[] = [
                'id' => 'u' . $u->getId(),
                'firstName' => $u->getFirstname(),
                'lastName' => $u->getLastname(),
                'email' => $u->getEmail(),
                'project' => 'Stuck In Yesterday',
                'role' => 'Admin',
                'address' => $u->getAddress(),
                'phone' => $u->getPhoneNumber(),
            ];
        }

        return $this->json([
            'projects' => [
                ['value' => 'stuck', 'label' => 'Stuck In Yesterday'],
                ['value' => 'youth', 'label' => 'Youth Collapse'],
            ],
            'members' => [
                ['name' => 'Thomas', 'role' => 'Drums'],
                ['name' => 'Elena', 'role' => 'Vocals'],
                ['name' => 'Isaac', 'role' => 'Guitar'],
                ['name' => 'Nina', 'role' => 'Bass'],
                ['name' => 'Marc', 'role' => 'Keys'],
            ],
            'users' => $usersList,
            'integrations' => [
                'spotifySecret' => 'sp_sec_8f3a19c8b7d2f1a3c89f24e5b',
                'musicBrainzId' => 'mbid-7b1a94f8-32c0-4b11-b1e2-9d83aef7c401',
                'deezerKey' => 'dz_key_92bd84fa10c9e782',
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
}
