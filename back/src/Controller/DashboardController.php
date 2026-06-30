<?php

namespace App\Controller;

use App\Repository\EventRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/dashboard', name: 'api_dashboard_')]
class DashboardController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(EventRepository $eventRepository): JsonResponse
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
}
