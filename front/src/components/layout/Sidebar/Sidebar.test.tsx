import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from './Sidebar';

describe('Sidebar component', () => {
  it('renders the sidebar navigation', () => {
    render(<Sidebar />, { wrapper: MemoryRouter });
    expect(screen.getByText(/Roadie/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });
});
