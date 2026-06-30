<?php

namespace App\Controller;

use App\Repository\NotificationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/notifications', name: 'api_notifications_')]
class NotificationController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(NotificationRepository $notificationRepository): JsonResponse
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
}
