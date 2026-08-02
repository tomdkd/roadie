import { render, screen } from '@testing-library/react';
import { GeneralTab } from './GeneralTab';

describe('GeneralTab', () => {
  it('renders project identity section', () => {
    render(<GeneralTab />);
    expect(screen.getByText(/Identité du groupe/i)).toBeInTheDocument();
  });
});
