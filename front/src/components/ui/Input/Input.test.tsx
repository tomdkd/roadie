import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input component', () => {
  it('renders input with label connected by id', () => {
    render(<Input label="Adresse email" />);
    
    const input = screen.getByLabelText(/adresse email/i);
    expect(input).toBeInTheDocument();
  });

  it('allows user typing', async () => {
    const user = userEvent.setup();
    render(<Input label="Email" />);
    
    const input = screen.getByLabelText(/email/i);
    await user.type(input, 'thomas@example.com');

    expect(input).toHaveValue('thomas@example.com');
  });

  it('displays error message and applies error styling attributes', () => {
    render(<Input label="Email" error="Email invalide" />);
    
    const errorMessage = screen.getByText(/email invalide/i);
    const input = screen.getByLabelText(/email/i);

    expect(errorMessage).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});