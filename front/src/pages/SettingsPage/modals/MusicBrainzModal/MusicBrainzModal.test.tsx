import { render, screen } from '@testing-library/react';
import { MusicBrainzModal } from './MusicBrainzModal';

describe('MusicBrainzModal', () => {
  it('shows MBID header when open', () => {
    render(<MusicBrainzModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText(/Identifiant MusicBrainz/i)).toBeInTheDocument();
  });
});
