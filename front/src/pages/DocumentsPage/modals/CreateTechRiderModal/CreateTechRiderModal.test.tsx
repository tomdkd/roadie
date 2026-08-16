import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CreateTechRiderModal } from './CreateTechRiderModal';

describe('CreateTechRiderModal', () => {
  it('renders when open and shows create button', () => {
    const onClose = vi.fn();
    const onStart = vi.fn();

    render(<CreateTechRiderModal isOpen onClose={onClose} onStart={onStart} />);

    expect(screen.getByText(/Qu'est-ce qu'une Fiche Technique/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créer la fiche/i })).toBeInTheDocument();
  });
});
