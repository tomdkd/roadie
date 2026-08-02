import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './Header';

describe('Header component', () => {
  it('renders the project selector and menu button', () => {
    render(<Header />, { wrapper: MemoryRouter });
    expect(screen.getByText(/The Neon Monkeys/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Ouvrir le menu/i)).toBeInTheDocument();
  });
});
