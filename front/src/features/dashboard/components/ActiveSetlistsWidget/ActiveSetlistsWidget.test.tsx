import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ActiveSetlistsWidget } from './ActiveSetlistsWidget';

describe('ActiveSetlistsWidget component', () => {
  it('renders the setlists widget', () => {
    render(<ActiveSetlistsWidget />, { wrapper: MemoryRouter });
    expect(screen.getByText(/Setlists/i)).toBeInTheDocument();
    expect(screen.getByText(/Voir tout/i)).toBeInTheDocument();
  });
});
