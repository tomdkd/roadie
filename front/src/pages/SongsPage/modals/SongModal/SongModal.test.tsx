import { render, screen } from '@testing-library/react';
import { SongModal } from './SongModal';

describe('SongModal', () => {
  it('renders add song header when open', () => {
    render(<SongModal isOpen={true} onClose={() => {}} onSave={() => {}} />);
    expect(screen.getByText(/Ajouter une chanson/i)).toBeInTheDocument();
  });
});
