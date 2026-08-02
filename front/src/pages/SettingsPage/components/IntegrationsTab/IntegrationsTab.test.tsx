import { render, screen } from '@testing-library/react';
import { IntegrationsTab } from './IntegrationsTab';

describe('IntegrationsTab', () => {
  it('renders the integrations heading', () => {
    render(<IntegrationsTab />);
    expect(screen.getByText(/Synchronisation de l'agenda/i)).toBeInTheDocument();
  });
});
