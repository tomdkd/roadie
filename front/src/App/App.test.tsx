import { render, screen } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  it('renders the main application', () => {
    render(<App />);
    expect(screen.getByText(/Roadie/i)).toBeInTheDocument();
  });
});
