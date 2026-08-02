import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';

describe('LoginPage component', () => {
  it('renders the login page', () => {
    render(<LoginPage />, { wrapper: MemoryRouter });
    expect(screen.getByText(/Roadie/i)).toBeInTheDocument();
  });
});
