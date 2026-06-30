<?php

namespace App\DataFixtures;

use App\Entity\File;
use App\Entity\Event;
use App\Entity\Venue;
use App\Entity\Notification;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // 1. Ajouter l'utilisateur admin par défaut
        $user = new User();
        $user->setFirstname('Thomas');
        $user->setLastname('Dominik');
        $user->setEmail('thomas@roadie-app.com');
        $user->setPassword(password_hash('admin', PASSWORD_BCRYPT));
        $user->setAddress('La Bassée / Lille Area, FR');
        $user->setPhoneNumber('+33 6 12 34 56 78');
        $user->setEmailVerified(true);
        $user->setLastLogin(new \DateTime());
        $manager->persist($user);

        // 2. Salles de concert authentiques (Venues)
        $splendid = new Venue();
        $splendid->setName('Le Splendid');
        $splendid->setAddress('Lille, FR');
        $splendid->setContactName('Jean-Marc');
        $splendid->setContactEmail('jm@venue.com');
        $splendid->setContactPhoneNumber('+33 6 12 34 56 78');
        $manager->persist($splendid);

        $cartonnerie = new Venue();
        $cartonnerie->setName('La Cartonnerie');
        $cartonnerie->setAddress('Reims, FR');
        $cartonnerie->setContactName('Sophie');
        $cartonnerie->setContactEmail('sophie@venue.com');
        $cartonnerie->setContactPhoneNumber('+33 6 87 65 43 21');
        $manager->persist($cartonnerie);

        $pointEphemere = new Venue();
        $pointEphemere->setName('Le Point Éphémère');
        $pointEphemere->setAddress('Paris, FR');
        $pointEphemere->setContactName('Aurélie');
        $pointEphemere->setContactEmail('aurelie@venue.com');
        $pointEphemere->setContactPhoneNumber('+33 6 34 56 78 90');
        $manager->persist($pointEphemere);

        // 3. Événements (Gigs & Tour)
        $event1 = new Event();
        $event1->setTitle('Full Dress Rehearsal (Lille)');
        $event1->setStatus('confirmed');
        $event1->setDate(new \DateTime('2026-06-12 18:00:00'));
        $event1->setVenueId($splendid);
        $manager->persist($event1);

        $event2 = new Event();
        $event2->setTitle('Live Gig (Reims)');
        $event2->setStatus('in_discussion');
        $event2->setDate(new \DateTime('2026-10-15 20:30:00'));
        $event2->setVenueId($cartonnerie);
        $manager->persist($event2);

        $event3 = new Event();
        $event3->setTitle('Live Gig (Paris)');
        $event3->setStatus('pending_contract');
        $event3->setDate(new \DateTime('2026-11-20 21:00:00'));
        $event3->setVenueId($pointEphemere);
        $manager->persist($event3);

        // 4. Notifications enrichies
        $notif1 = new Notification();
        $notif1->setType('audio');
        $notif1->setName('Youth_Collapse_Track_01_v2.wav');
        $notif1->setTitle('New Mix Available');
        $notif1->setDescription('Pierre uploaded Youth_Collapse_Track_01_v2.wav to the cloud repository.');
        $notif1->setUnread(true);
        $notif1->setCreatedAt(new \DateTimeImmutable('-10 minutes'));
        $manager->persist($notif1);

        $notif2 = new Notification();
        $notif2->setType('gig');
        $notif2->setName('Paris gig doc');
        $notif2->setTitle('Gig Update');
        $notif2->setDescription('The technical rider for the upcoming Paris concert has been updated.');
        $notif2->setUnread(true);
        $notif2->setCreatedAt(new \DateTimeImmutable('-2 hours'));
        $manager->persist($notif2);

        $notif3 = new Notification();
        $notif3->setType('system');
        $notif3->setName('MusicBrainz Sync');
        $notif3->setTitle('System Sync');
        $notif3->setDescription('MusicBrainz artist metadata successfully refreshed.');
        $notif3->setUnread(false);
        $notif3->setCreatedAt(new \DateTimeImmutable('-1 day'));
        $manager->persist($notif3);

        // 5. Fichiers cloud
        $file1 = new File();
        $file1->setName('Youth_Collapse_Track_01_v2.wav');
        $file1->setSize('45.2 MB');
        $file1->setType('audio');
        $file1->setCategory('demo');
        $file1->setCreatedAt(new \DateTimeImmutable('-1 day'));
        $manager->persist($file1);

        $file2 = new File();
        $file2->setName('Band_Promo_Landscape_2026.jpg');
        $file2->setSize('8.4 MB');
        $file2->setType('image');
        $file2->setCategory('presskit');
        $file2->setCreatedAt(new \DateTimeImmutable('-2 days'));
        $manager->persist($file2);

        $file3 = new File();
        $file3->setName('Stuck_In_Yesterday_Technical_Rider.pdf');
        $file3->setSize('1.2 MB');
        $file3->setType('text');
        $file3->setCategory('live_rider');
        $file3->setCreatedAt(new \DateTimeImmutable('-10 days'));
        $manager->persist($file3);

        $manager->flush();
    }
}
