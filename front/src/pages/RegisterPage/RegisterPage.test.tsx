import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RegisterPage } from './RegisterPage';

describe('RegisterPage component', () => {
  it('renders the register page header', () => {
    render(<RegisterPage />, { wrapper: MemoryRouter });
    expect(screen.getByText(/Roadie/i)).toBeInTheDocument();
  });
});
