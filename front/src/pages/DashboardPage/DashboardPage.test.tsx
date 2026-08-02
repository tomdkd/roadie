import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DashboardPage } from './DashboardPage';

describe('DashboardPage component', () => {
  it('renders the dashboard heading', () => {
    render(<DashboardPage />, { wrapper: MemoryRouter });
    expect(screen.getByText(/Tableau de bord/i)).toBeInTheDocument();
  });
});
