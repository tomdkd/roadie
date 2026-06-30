<?php

namespace App\Controller;

use App\Repository\VenueRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/venues', name: 'api_venues_')]
class VenueController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(VenueRepository $venueRepository): JsonResponse
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
}
