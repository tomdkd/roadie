import { render, screen } from '@testing-library/react';
import { QuickActionsWidget } from './QuickActionsWidget';

describe('QuickActionsWidget component', () => {
  it('renders quick actions buttons', () => {
    render(<QuickActionsWidget />);
    expect(screen.getByText(/Ajouter un concert/i)).toBeInTheDocument();
  });
});
