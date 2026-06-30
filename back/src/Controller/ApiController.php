<?php

namespace App\Controller;

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
            'service' => 'roadie-api',
        ]);
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $payload = json_decode($request->getContent(), true) ?? [];
        $username = (string) ($payload['username'] ?? '');
        $password = (string) ($payload['password'] ?? '');

        if ($username !== 'admin' || $password !== 'admin') {
            return $this->json(['message' => 'Invalid credentials'], 401);
        }

        return $this->json([
            'token' => hash('sha256', 'roadie-token-'.$username),
            'user' => [
                'firstName' => 'Thomas',
                'lastName' => 'Dominik',
                'email' => 'thomas@roadie-app.com',
                'role' => 'Band Administrator',
            ],
        ]);
    }

    #[Route('/api/notifications', name: 'api_notifications', methods: ['GET'])]
    public function notifications(): JsonResponse
    {
        return $this->json([
            'items' => [
                [
                    'title' => 'New Mix Available',
                    'description' => 'Pierre uploaded Youth_Collapse_Track_01_v2.wav to the cloud repository',
                    'time' => '10m ago',
                    'unread' => true,
                ],
                [
                    'title' => 'Gig Update',
                    'description' => 'The technical rider for the upcoming Paris concert has been updated',
                    'time' => '2h ago',
                    'unread' => true,
                ],
                [
                    'title' => 'System Sync',
                    'description' => 'MusicBrainz artist metadata successfully refreshed',
                    'time' => 'Yesterday',
                    'unread' => false,
                ],
                [
                    'title' => 'Storage Alert',
                    'description' => 'Google Drive connection state verified as stable',
                    'time' => '2 days ago',
                    'unread' => false,
                ],
                [
                    'title' => 'Welcome to Roadie',
                    'description' => 'Your band workspace is fully initialized and operational',
                    'time' => 'May 2026',
                    'unread' => false,
                ],
            ],
        ]);
    }

    #[Route('/api/dashboard', name: 'api_dashboard', methods: ['GET'])]
    public function dashboard(): JsonResponse
    {
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
        ]);
    }

    #[Route('/api/files', name: 'api_files', methods: ['GET'])]
    public function files(): JsonResponse
    {
        return $this->json([
            'folders' => [
                ['title' => 'Presskits & HD Photos', 'description' => 'Band assets'],
                ['title' => 'Demos & Pre-productions', 'description' => 'Audio tracks'],
                ['title' => 'Live & Backline Riders', 'description' => 'Stage logistics'],
            ],
            'recentFiles' => [
                ['type' => 'audio', 'name' => 'Youth_Collapse_Track_01_v2.wav', 'size' => '45.2 MB', 'date' => 'Today'],
                ['type' => 'image', 'name' => 'Band_Promo_Landscape_2026.jpg', 'size' => '8.4 MB', 'date' => '2 days ago'],
                ['type' => 'text', 'name' => 'Stuck_In_Yesterday_Technical_Rider.pdf', 'size' => '1.2 MB', 'date' => 'May 2026'],
            ],
        ]);
    }

    #[Route('/api/venues', name: 'api_venues', methods: ['GET'])]
    public function venues(): JsonResponse
    {
        return $this->json([
            'items' => [
                [
                    'id' => 'le-splendid',
                    'name' => 'Le Splendid',
                    'location' => 'Lille, FR',
                    'coordinates' => ['x' => 150, 'y' => 120],
                    'contact' => ['name' => 'Jean-Marc', 'role' => 'Booking', 'email' => 'jm@venue.com', 'phone' => '+33 6 12 34 56 78'],
                ],
                [
                    'id' => 'la-cartonnerie',
                    'name' => 'La Cartonnerie',
                    'location' => 'Reims, FR',
                    'coordinates' => ['x' => 280, 'y' => 190],
                    'contact' => ['name' => 'Sophie', 'role' => 'Booking', 'email' => 'sophie@venue.com', 'phone' => '+33 6 87 65 43 21'],
                ],
                [
                    'id' => 'le-point-ephemere',
                    'name' => 'Le Point Ephemere',
                    'location' => 'Paris, FR',
                    'coordinates' => ['x' => 220, 'y' => 240],
                    'contact' => ['name' => 'Aurelie', 'role' => 'Booking', 'email' => 'aurelie@venue.com', 'phone' => '+33 6 34 56 78 90'],
                ],
                [
                    'id' => 'laeronef',
                    'name' => 'L Aeronef',
                    'location' => 'Lille, FR',
                    'coordinates' => ['x' => 160, 'y' => 110],
                    'contact' => ['name' => 'Camille', 'role' => 'Booking', 'email' => 'camille@aeronef.com', 'phone' => '+33 6 11 22 33 44'],
                ],
            ],
        ]);
    }
}
