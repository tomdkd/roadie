import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MembersPage } from './MembersPage';

describe('MembersPage', () => {
  let uuidCounter = 0;

  beforeEach(() => {
    uuidCounter = 0;
    if (typeof globalThis.crypto === 'undefined') {
      // @ts-expect-error Mock minimal pour l'environnement de test
      globalThis.crypto = {};
    }

    // Un UUID unique à chaque appel pour forcer React à mettre à jour la key du Toast
    globalThis.crypto.randomUUID = () => {
      uuidCounter += 1;
      const pad = uuidCounter.toString().padStart(12, '0');
      return `12345678-1234-1234-1234-${pad}` as `${string}-${string}-${string}-${string}-${string}`;
    };
  });

  it('affiche correctement le titre et les 5 membres initiaux', () => {
    render(<MembersPage />);

    expect(screen.getByText('Membres du projet')).toBeInTheDocument();
    expect(screen.getByText('Jimi Hendrix')).toBeInTheDocument();
    expect(screen.getByText('Alex Turner')).toBeInTheDocument();
    expect(screen.getByText('Dave Grohl')).toBeInTheDocument();
    expect(screen.getByText('Flea Balzary')).toBeInTheDocument();
    expect(screen.getByText('Paul McCartney')).toBeInTheDocument();
  });

  it('filtre les membres via la barre de recherche textuelle', () => {
    render(<MembersPage />);

    const searchInput = screen.getByPlaceholderText(
      'Rechercher par nom, prénom, email...'
    );

    fireEvent.change(searchInput, { target: { value: 'Grohl' } });

    expect(screen.getByText('Dave Grohl')).toBeInTheDocument();
    expect(screen.queryByText('Jimi Hendrix')).not.toBeInTheDocument();
    expect(screen.queryByText('Alex Turner')).not.toBeInTheDocument();
  });

  it('filtre la liste des membres par niveau de droits (Admin)', () => {
    render(<MembersPage />);

    // Sélectionne le menu déroulant qui contient l'option "Tous les droits"
    const roleSelect = screen.getByDisplayValue('Tous les droits');

    fireEvent.change(roleSelect, { target: { value: 'admin' } });

    expect(screen.getByText('Jimi Hendrix')).toBeInTheDocument();
    expect(screen.getByText('Dave Grohl')).toBeInTheDocument();

    expect(screen.queryByText('Alex Turner')).not.toBeInTheDocument();
    expect(screen.queryByText('Paul McCartney')).not.toBeInTheDocument();
  });

  it("affiche un message d'état vide quand aucun membre ne correspond aux filtres", () => {
    render(<MembersPage />);

    const searchInput = screen.getByPlaceholderText(
      'Rechercher par nom, prénom, email...'
    );

    fireEvent.change(searchInput, { target: { value: 'RechercheInexistante' } });

    expect(screen.getByText('Aucun membre trouvé')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /réinitialiser les filtres/i })
    ).toBeInTheDocument();
  });

  it('ouvre la modale de confirmation et exclut un membre', async () => {
    render(<MembersPage />);

    // 1. Cliquer sur le bouton d'exclusion
    const excludeButtons = screen.getAllByTitle('Exclure du projet');
    fireEvent.click(excludeButtons[0]);

    // 2. Vérifier l'ouverture de la modale
    expect(screen.getByText('Exclure du projet ?')).toBeInTheDocument();

    // 3. Confirmer l'exclusion
    const confirmButton = screen.getByRole('button', {
      name: 'Exclure le membre',
    });
    fireEvent.click(confirmButton);

    // 4. Vérifier la suppression du membre et le message du Toast réel
    await waitFor(() => {
      expect(screen.queryByText('Jimi Hendrix')).not.toBeInTheDocument();
      expect(
        screen.getByText('Jimi Hendrix a été retiré(e) du projet.')
      ).toBeInTheDocument();
    });
  });
});