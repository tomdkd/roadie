<?php

namespace App\Controller;

use App\Repository\FileRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/files', name: 'api_files_')]
class FileController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(FileRepository $fileRepository): JsonResponse
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
}
