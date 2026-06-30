<?php

namespace App\Entity;

use App\Repository\EventRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EventRepository::class)]
class Event
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?\DateTime $date = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $status = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    /**
     * @var Collection<int, Context>
     */
    #[ORM\ManyToMany(targetEntity: Context::class, inversedBy: 'events')]
    private Collection $ContextId;

    #[ORM\ManyToOne(inversedBy: 'events')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Venue $venueId = null;

    public function __construct()
    {
        $this->ContextId = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): ?\DateTime
    {
        return $this->date;
    }

    public function setDate(\DateTime $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(?string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return Collection<int, Context>
     */
    public function getContextId(): Collection
    {
        return $this->ContextId;
    }

    public function addContextId(Context $contextId): static
    {
        if (!$this->ContextId->contains($contextId)) {
            $this->ContextId->add($contextId);
        }

        return $this;
    }

    public function removeContextId(Context $contextId): static
    {
        $this->ContextId->removeElement($contextId);

        return $this;
    }

    public function getVenueId(): ?Venue
    {
        return $this->venueId;
    }

    public function setVenueId(?Venue $venueId): static
    {
        $this->venueId = $venueId;

        return $this;
    }
}
