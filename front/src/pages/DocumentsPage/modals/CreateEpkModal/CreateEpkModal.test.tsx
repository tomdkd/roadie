import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CreateEpkModal } from './CreateEpkModal';

describe('CreateEpkModal', () => {
  it('renders when open and shows start button', () => {
    const onClose = vi.fn();
    const onStart = vi.fn();

    render(<CreateEpkModal isOpen onClose={onClose} onStart={onStart} />);

    expect(screen.getByText(/Qu'est-ce qu'un EPK/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /commencer/i })).toBeInTheDocument();
  });
});
