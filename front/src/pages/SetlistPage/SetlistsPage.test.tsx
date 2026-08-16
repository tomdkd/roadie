import { render, screen } from '@testing-library/react';
import { SetlistsPage } from './SetlistsPage';

describe('SetlistsPage', () => {
  it('renders the Setlists heading', () => {
    render(<SetlistsPage />);
    expect(screen.getByRole('heading', { name: /Setlists/i })).toBeInTheDocument();
  });
});
