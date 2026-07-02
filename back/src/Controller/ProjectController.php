<?php

namespace App\Controller;

use App\Entity\Context;
use App\Repository\ContextRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/projects', name: 'api_projects_')]
class ProjectController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(ContextRepository $contextRepository): JsonResponse
    {
        $projects = array_map(
            fn (Context $context) => $this->serializeProject($context),
            $contextRepository->findBy([], ['name' => 'ASC'])
        );

        return $this->json(['projects' => $projects]);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, ContextRepository $contextRepository, EntityManagerInterface $em): JsonResponse
    {
        $payload = json_decode($request->getContent(), true) ?? [];
        $name = trim((string) ($payload['name'] ?? ''));
        $style = trim((string) ($payload['style'] ?? ''));
        $location = trim((string) ($payload['location'] ?? ''));

        if ($name === '' || $style === '' || $location === '') {
            return $this->json(['message' => 'Le nom, le style et la localisation sont obligatoires'], 400);
        }

        if ($contextRepository->findOneBy(['name' => $name])) {
            return $this->json(['message' => 'Un projet portant ce nom existe déjà'], 409);
        }

        $context = new Context();
        $context->setName($name);
        $context->setStyle($style);
        $context->setLocation($location);
        $context->setBio(($payload['bio'] ?? '') !== '' ? (string) $payload['bio'] : null);
        $context->setMusicBrainzArtistId(($payload['musicBrainzArtistId'] ?? '') !== '' ? (string) $payload['musicBrainzArtistId'] : null);

        $em->persist($context);
        $em->flush();

        return $this->json([
            'message' => 'Projet créé avec succès',
            'project' => $this->serializeProject($context),
        ], 201);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request, ContextRepository $contextRepository, EntityManagerInterface $em): JsonResponse
    {
        $context = $contextRepository->find($id);
        if (!$context) {
            return $this->json(['message' => 'Projet introuvable'], 404);
        }

        $payload = json_decode($request->getContent(), true) ?? [];

        if (isset($payload['name']) && trim((string) $payload['name']) !== '') {
            $name = trim((string) $payload['name']);
            $existing = $contextRepository->findOneBy(['name' => $name]);
            if ($existing && $existing->getId() !== $context->getId()) {
                return $this->json(['message' => 'Un projet portant ce nom existe déjà'], 409);
            }
            $context->setName($name);
        }
        if (isset($payload['style']) && trim((string) $payload['style']) !== '') {
            $context->setStyle(trim((string) $payload['style']));
        }
        if (isset($payload['location']) && trim((string) $payload['location']) !== '') {
            $context->setLocation(trim((string) $payload['location']));
        }
        if (array_key_exists('bio', $payload)) {
            $bio = trim((string) $payload['bio']);
            $context->setBio($bio !== '' ? $bio : null);
        }
        if (array_key_exists('musicBrainzArtistId', $payload)) {
            $mbid = trim((string) $payload['musicBrainzArtistId']);
            $context->setMusicBrainzArtistId($mbid !== '' ? $mbid : null);
        }

        $em->flush();

        return $this->json([
            'message' => 'Projet mis à jour',
            'project' => $this->serializeProject($context),
        ]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id, ContextRepository $contextRepository, EntityManagerInterface $em): JsonResponse
    {
        $context = $contextRepository->find($id);
        if (!$context) {
            return $this->json(['message' => 'Projet introuvable'], 404);
        }

        $em->remove($context);
        $em->flush();

        return $this->json(['message' => 'Projet supprimé', 'id' => $id]);
    }

    /**
     * Normalise un projet (groupe) pour la réponse JSON.
     */
    private function serializeProject(Context $context): array
    {
        return [
            'id' => $context->getId(),
            'value' => (string) $context->getId(),
            'label' => $context->getName(),
            'name' => $context->getName(),
            'style' => $context->getStyle(),
            'location' => $context->getLocation(),
            'bio' => $context->getBio() ?? '',
            'musicBrainzArtistId' => $context->getMusicBrainzArtistId() ?? '',
            'memberCount' => $context->getMembers()->count(),
        ];
    }
}
