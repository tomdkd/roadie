<?php

namespace App\Entity;

use App\Repository\UserContextRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserContextRepository::class)]
class UserContext
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $UserId = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Context $contextId = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Role $roleId = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Permission $permissionId = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserId(): ?User
    {
        return $this->UserId;
    }

    public function setUserId(?User $UserId): static
    {
        $this->UserId = $UserId;

        return $this;
    }

    public function getContextId(): ?Context
    {
        return $this->contextId;
    }

    public function setContextId(?Context $contextId): static
    {
        $this->contextId = $contextId;

        return $this;
    }

    public function getRoleId(): ?Role
    {
        return $this->roleId;
    }

    public function setRoleId(?Role $roleId): static
    {
        $this->roleId = $roleId;

        return $this;
    }

    public function getPermissionId(): ?Permission
    {
        return $this->permissionId;
    }

    public function setPermissionId(?Permission $permissionId): static
    {
        $this->permissionId = $permissionId;

        return $this;
    }
}
