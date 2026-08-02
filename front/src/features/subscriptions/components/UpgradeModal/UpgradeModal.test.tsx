import { render, screen } from '@testing-library/react';
import { UpgradeModal } from './UpgradeModal';

describe('UpgradeModal component', () => {
  it('renders the upgrade modal when open', () => {
    render(<UpgradeModal isOpen onClose={() => {}} />);
    expect(screen.getByText(/Passez au niveau supérieur/i)).toBeInTheDocument();
  });
});
