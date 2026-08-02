import { render, screen } from '@testing-library/react';
import { SongsPage } from './SongsPage';

describe('SongsPage', () => {
  it('renders Répertoire heading', () => {
    render(<SongsPage />);
    expect(screen.getByText(/Répertoire/i)).toBeInTheDocument();
  });
});
