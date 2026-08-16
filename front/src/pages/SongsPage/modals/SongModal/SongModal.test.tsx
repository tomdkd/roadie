import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SongModal } from './SongModal';

describe('SongModal', () => {
  it('renders add song modal when open', () => {
    render(<SongModal isOpen={true} onClose={() => {}} onSave={() => {}} />);
    expect(screen.getByText(/Ajouter une chanson/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ex: Voodoo Child/i)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<SongModal isOpen={false} onClose={() => {}} onSave={() => {}} />);
    expect(screen.queryByText(/Ajouter une chanson/i)).not.toBeInTheDocument();
  });

  it('calls onSave and onClose upon form submission', () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    render(<SongModal isOpen={true} onClose={handleClose} onSave={handleSave} />);

    const titleInput = screen.getByPlaceholderText(/Ex: Voodoo Child/i);
    fireEvent.change(titleInput, { target: { value: 'Purple Haze' } });

    const submitButton = screen.getByRole('button', { name: /Ajouter au répertoire/i });
    fireEvent.click(submitButton);

    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Purple Haze',
      })
    );
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
