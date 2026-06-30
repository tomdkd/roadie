<?php

namespace App\Controller;

use App\Repository\NotificationRepository;
use Doctrine\ORM\EntityManagerInterface;
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
            $items[] = [
                'id' => $n->getId(),
                'title' => $n->getTitle(),
                'description' => $n->getDescription(),
                'unread' => $n->isUnread(),
                'time' => $this->relativeTime($n->getCreatedAt()),
            ];
        }

        return $this->json([
            'items' => $items,
        ]);
    }

    #[Route('/{id}/read', name: 'mark_read', methods: ['PATCH'])]
    public function markRead(int $id, NotificationRepository $notificationRepository, EntityManagerInterface $em): JsonResponse
    {
        $notif = $notificationRepository->find($id);
        if (!$notif) {
            return $this->json(['message' => 'Notification introuvable'], 404);
        }

        $notif->setUnread(false);
        $em->flush();

        return $this->json(['message' => 'Notification marquée comme lue', 'id' => $id]);
    }

    #[Route('/read-all', name: 'mark_all_read', methods: ['POST'])]
    public function markAllRead(NotificationRepository $notificationRepository, EntityManagerInterface $em): JsonResponse
    {
        $unread = $notificationRepository->findBy(['unread' => true]);
        foreach ($unread as $notif) {
            $notif->setUnread(false);
        }
        $em->flush();

        return $this->json(['message' => 'Toutes les notifications ont été marquées comme lues', 'count' => count($unread)]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id, NotificationRepository $notificationRepository, EntityManagerInterface $em): JsonResponse
    {
        $notif = $notificationRepository->find($id);
        if (!$notif) {
            return $this->json(['message' => 'Notification introuvable'], 404);
        }

        $em->remove($notif);
        $em->flush();

        return $this->json(['message' => 'Notification supprimée', 'id' => $id]);
    }

    /**
     * Transforme une date en libellé relatif lisible (ex: "2h ago").
     */
    private function relativeTime(\DateTimeImmutable $date): string
    {
        $secondsDiff = time() - $date->getTimestamp();

        if ($secondsDiff < 60) {
            return 'Just now';
        }
        if ($secondsDiff < 3600) {
            return round($secondsDiff / 60) . 'm ago';
        }
        if ($secondsDiff < 86400) {
            return round($secondsDiff / 3600) . 'h ago';
        }

        return round($secondsDiff / 86400) . 'd ago';
    }
}
