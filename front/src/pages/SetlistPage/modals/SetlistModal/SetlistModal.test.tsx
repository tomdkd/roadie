import { render, screen } from '@testing-library/react';
import { SetlistModal } from './SetlistModal';

describe('SetlistModal', () => {
  it('renders create setlist header when open', () => {
    render(
      <SetlistModal isOpen={true} onClose={() => {}} onSave={() => {}} availableSongs={[]} />
    );
    expect(screen.getByText(/Créer une setlist/i)).toBeInTheDocument();
  });
});
