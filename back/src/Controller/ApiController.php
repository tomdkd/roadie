<?php

namespace App\Controller;

use App\Repository\EventRepository;
use App\Repository\FileRepository;
use App\Repository\NotificationRepository;
use App\Repository\UserRepository;
use App\Repository\VenueRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class ApiController extends AbstractController
{
    #[Route('/api/health', name: 'api_health', methods: ['GET'])]
    public function health(): JsonResponse
    {
        return $this->json([
            'status' => 'ok',
            'service' => 'roadie-dynamic-api',
        ]);
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
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

    #[Route('/api/notifications', name: 'api_notifications', methods: ['GET'])]
    public function notifications(NotificationRepository $notificationRepository): JsonResponse
    {
        $notifs = $notificationRepository->findBy([], ['createdAt' => 'DESC']);
        $items = [];

        foreach ($notifs as $n) {
            // Transformation relative pour l'affichage textuel
            $secondsDiff = time() - $n->getCreatedAt()->getTimestamp();
            $timeText = '10m ago';
            if ($secondsDiff < 60) {
                $timeText = 'Just now';
            } elseif ($secondsDiff < 3600) {
                $timeText = round($secondsDiff / 60) . 'm ago';
            } elseif ($secondsDiff < 86400) {
                $timeText = round($secondsDiff / 3600) . 'h ago';
            } else {
                $timeText = round($secondsDiff / 86400) . 'd ago';
            }

            $items[] = [
                'title' => $n->getTitle(),
                'description' => $n->getDescription(),
                'unread' => $n->isUnread(),
                'time' => $timeText,
            ];
        }

        return $this->json([
            'items' => $items,
        ]);
    }

    #[Route('/api/dashboard', name: 'api_dashboard', methods: ['GET'])]
    public function dashboard(EventRepository $eventRepository): JsonResponse
    {
        // Gigs ordonnées par date
        $events = $eventRepository->findBy([], ['date' => 'ASC']);
        $formattedGigs = [];

        foreach ($events as $event) {
            $formattedGigs[] = [
                'title' => $event->getTitle(),
                'status' => $event->getStatus(),
                'date' => $event->getDate()->format('M d, Y'),
                'venue' => $event->getVenueId() ? $event->getVenueId()->getName() : 'Unknown Venue',
            ];
        }

        return $this->json([
            'syncServices' => [
                ['name' => 'Musicbrainz', 'status' => 'last check: 2m ago'],
                ['name' => 'Spotify', 'status' => 'last check: 5m ago'],
                ['name' => 'Deezer', 'status' => 'last check: 12m ago'],
                ['name' => 'Apple Music', 'status' => 'last check: 1h ago'],
            ],
            'metrics' => [
                'monthlyStreams' => '48.2k',
                'trend' => '+12% vs last month',
            ],
            'gigs' => $formattedGigs,
        ]);
    }

    #[Route('/api/files', name: 'api_files', methods: ['GET'])]
    public function files(FileRepository $fileRepository): JsonResponse
    {
        $files = $fileRepository->findAll();
        $foldersMap = [];
        $recent = [];

        foreach ($files as $file) {
            $category = $file->getCategory();
            // Groupement par catégorie pour valoriser les dossiers
            if (!isset($foldersMap[$category])) {
                $foldersMap[$category] = [
                    'title' => $category === 'demo' ? 'Demos & Pre-productions' : ($category === 'presskit' ? 'Presskits & HD Photos' : 'Live & Backline Riders'),
                    'description' => $category === 'demo' ? 'Audio tracks' : ($category === 'presskit' ? 'Band assets' : 'Stage logistics'),
                    'count' => 0,
                ];
            }
            $foldersMap[$category]['count']++;

            $recent[] = [
                'type' => $file->getType(),
                'name' => $file->getName(),
                'size' => $file->getSize(),
                'date' => $file->getCreatedAt()->format('M d, Y'),
            ];
        }

        return $this->json([
            'folders' => array_values($foldersMap),
            'recentFiles' => $recent,
        ]);
    }

    #[Route('/api/venues', name: 'api_venues', methods: ['GET'])]
    public function venues(VenueRepository $venueRepository): JsonResponse
    {
        $venues = $venueRepository->findAll();
        $items = [];

        // Coordonnées de projection de base pour la carte SVG
        $coordMap = [
            'Le Splendid' => ['x' => 150, 'y' => 120],
            'La Cartonnerie' => ['x' => 280, 'y' => 190],
            'Le Point Éphémère' => ['x' => 220, 'y' => 240],
        ];

        foreach ($venues as $v) {
            $name = $v->getName();
            $items[] = [
                'id' => strtolower(str_replace(' ', '-', $name)),
                'name' => $name,
                'location' => $v->getAddress(),
                'coordinates' => $coordMap[$name] ?? ['x' => 200, 'y' => 200],
                'contact' => [
                    'name' => $v->getContactName(),
                    'role' => 'Booking',
                    'email' => $v->getContactEmail(),
                    'phone' => $v->getContactPhoneNumber(),
                ],
            ];
        }

        return $this->json([
            'items' => $items,
        ]);
    }

    #[Route('/api/settings', name: 'api_settings', methods: ['GET'])]
    public function settings(UserRepository $userRepository): JsonResponse
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

    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
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
