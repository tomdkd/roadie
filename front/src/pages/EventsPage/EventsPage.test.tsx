import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { EventsPage } from './EventsPage';

describe('EventsPage', () => {
  let uuidCounter = 0;

  beforeEach(() => {
    uuidCounter = 0;
    if (typeof globalThis.crypto === 'undefined') {
      // @ts-expect-error Mock minimal de crypto pour l'environnement de test
      globalThis.crypto = {};
    }

    // Polyfill crypto.randomUUID avec typage strict TypeScript pour éviter les erreurs lib.dom.d.ts
    globalThis.crypto.randomUUID = () => {
      uuidCounter += 1;
      const pad = uuidCounter.toString().padStart(12, '0');
      return `12345678-1234-1234-1234-${pad}` as `${string}-${string}-${string}-${string}-${string}`;
    };
  });

  it('affiche correctement le titre, les boutons de filtres et le bouton de création', () => {
    render(<EventsPage />);

    expect(screen.getByText('Planning & Événements')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /créer un événement/i })
    ).toBeInTheDocument();

    // Vérification de la présence des boutons de filtre
    expect(screen.getByRole('button', { name: /tous \(4\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^concerts$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^répétitions$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^studio$/i })).toBeInTheDocument();
  });

  it('filtre la liste des événements par catégorie (Concerts)', () => {
    render(<EventsPage />);

    // Active le filtre "Concerts"
    const concertFilterBtn = screen.getByRole('button', { name: /^concerts$/i });
    fireEvent.click(concertFilterBtn);

    // Les événements de type concert doivent être visibles
    expect(screen.getAllByText('Concert - Le Zénith').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Balance & Soundcheck').length).toBeGreaterThan(0);

    // Les autres événements doivent être masqués
    expect(screen.queryByText('Répétition Générale')).not.toBeInTheDocument();
    expect(screen.queryByText('Session Studio Enregistrement')).not.toBeInTheDocument();
  });

  it('filtre la liste des événements par catégorie (Studio)', () => {
    render(<EventsPage />);

    // Active le filtre "Studio"
    const studioFilterBtn = screen.getByRole('button', { name: /^studio$/i });
    fireEvent.click(studioFilterBtn);

    // L'événement studio doit être présent (vue mobile + desktop)
    expect(screen.getAllByText('Session Studio Enregistrement').length).toBeGreaterThan(0);
    expect(screen.queryByText('Concert - Le Zénith')).not.toBeInTheDocument();
  });

  it('affiche un toast de notification lors du clic sur "Créer un événement"', async () => {
    render(<EventsPage />);

    const createBtn = screen.getByRole('button', { name: /créer un événement/i });
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(
        screen.getByText("Modale de création d'événement à venir")
      ).toBeInTheDocument();
    });
  });

  it("affiche un toast d'information au clic sur un événement (vue mobile)", async () => {
    render(<EventsPage />);

    // Récupère tous les éléments portant ce titre et clique sur la carte mobile (le 1er)
    const rehearsalCards = screen.getAllByText('Répétition Générale');
    fireEvent.click(rehearsalCards[0]);

    await waitFor(() => {
      expect(
        screen.getByText('Sélection : Répétition Générale')
      ).toBeInTheDocument();
    });
  });
});