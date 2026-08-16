import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SongsPage } from './SongsPage';

describe('SongsPage', () => {
  it('renders Répertoire heading and initial songs after loading', async () => {
    render(<SongsPage />);
    expect(screen.getByText(/Répertoire/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Neon Skyline')).toBeInTheDocument();
      expect(screen.getByText('Midnight Run')).toBeInTheDocument();
    });
  });

  it('filters songs via search query', async () => {
    render(<SongsPage />);

    await waitFor(() => {
      expect(screen.getByText('Neon Skyline')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Rechercher un titre, un album.../i);
    fireEvent.change(searchInput, { target: { value: 'Midnight' } });

    expect(screen.getByText('Midnight Run')).toBeInTheDocument();
    expect(screen.queryByText('Neon Skyline')).not.toBeInTheDocument();
  });

  it('filters songs by status', async () => {
    render(<SongsPage />);

    await waitFor(() => {
      expect(screen.getByText('Unreleased Jam #4')).toBeInTheDocument();
    });

    const statusSelect = screen.getByDisplayValue('Tous les statuts');
    fireEvent.change(statusSelect, { target: { value: 'draft' } });

    expect(screen.getByText('Unreleased Jam #4')).toBeInTheDocument();
    expect(screen.queryByText('Neon Skyline')).not.toBeInTheDocument();
  });

  it('opens add song modal when clicking add button', async () => {
    render(<SongsPage />);

    const addButton = screen.getByRole('button', { name: /Ajouter une chanson/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Enregistre un titre dans le répertoire du groupe.')).toBeInTheDocument();
    });
  });
});
