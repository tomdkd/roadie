import { render, screen } from '@testing-library/react';
import { AppRouter } from './AppRouter';

describe('AppRouter component', () => {
  it('renders the router and loads the login screen', () => {
    render(<AppRouter />);
    expect(screen.getByText(/Roadie/i)).toBeInTheDocument();
  });
});
