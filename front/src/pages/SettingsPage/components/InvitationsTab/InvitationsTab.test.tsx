import { render, screen } from '@testing-library/react';
import { InvitationsTab } from './InvitationsTab';

describe('InvitationsTab', () => {
  it('renders invitation generator', () => {
    render(<InvitationsTab />);
    expect(screen.getByText(/Générer un code d'invitation/i)).toBeInTheDocument();
  });
});
