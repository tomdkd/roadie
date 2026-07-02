<?php

namespace App\Controller;

use App\Entity\Member;
use App\Repository\ContextRepository;
use App\Repository\MemberRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/members', name: 'api_members_')]
class MemberController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(MemberRepository $memberRepository): JsonResponse
    {
        $members = array_map(
            fn (Member $member) => $this->serializeMember($member),
            $memberRepository->findBy([], ['id' => 'ASC'])
        );

        return $this->json(['members' => $members]);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, ContextRepository $contextRepository, EntityManagerInterface $em): JsonResponse
    {
        $payload = json_decode($request->getContent(), true) ?? [];
        $name = trim((string) ($payload['name'] ?? ''));
        $role = trim((string) ($payload['role'] ?? ''));
        $projectId = (int) ($payload['projectId'] ?? 0);

        if ($name === '' || $role === '') {
            return $this->json(['message' => 'Le nom et le rôle du musicien sont obligatoires'], 400);
        }

        $context = $contextRepository->find($projectId);
        if (!$context) {
            return $this->json(['message' => 'Projet associé introuvable'], 404);
        }

        $member = new Member();
        $member->setName($name);
        $member->setRole($role);
        $member->setContext($context);

        $em->persist($member);
        $em->flush();

        return $this->json([
            'message' => 'Membre ajouté au lineup',
            'member' => $this->serializeMember($member),
        ], 201);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request, MemberRepository $memberRepository, ContextRepository $contextRepository, EntityManagerInterface $em): JsonResponse
    {
        $member = $memberRepository->find($id);
        if (!$member) {
            return $this->json(['message' => 'Membre introuvable'], 404);
        }

        $payload = json_decode($request->getContent(), true) ?? [];

        if (isset($payload['name']) && trim((string) $payload['name']) !== '') {
            $member->setName(trim((string) $payload['name']));
        }
        if (isset($payload['role']) && trim((string) $payload['role']) !== '') {
            $member->setRole(trim((string) $payload['role']));
        }
        if (isset($payload['projectId'])) {
            $context = $contextRepository->find((int) $payload['projectId']);
            if (!$context) {
                return $this->json(['message' => 'Projet associé introuvable'], 404);
            }
            $member->setContext($context);
        }

        $em->flush();

        return $this->json([
            'message' => 'Membre mis à jour',
            'member' => $this->serializeMember($member),
        ]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id, MemberRepository $memberRepository, EntityManagerInterface $em): JsonResponse
    {
        $member = $memberRepository->find($id);
        if (!$member) {
            return $this->json(['message' => 'Membre introuvable'], 404);
        }

        $em->remove($member);
        $em->flush();

        return $this->json(['message' => 'Membre retiré du lineup', 'id' => $id]);
    }

    /**
     * Normalise un membre du lineup pour la réponse JSON.
     */
    private function serializeMember(Member $member): array
    {
        $context = $member->getContext();

        return [
            'id' => $member->getId(),
            'name' => $member->getName(),
            'role' => $member->getRole(),
            'projectId' => $context?->getId(),
            'projectName' => $context?->getName(),
        ];
    }
}
