import { render, screen } from '@testing-library/react';
import { SettingsPage } from './SettingsPage';

describe('SettingsPage', () => {
  it('renders settings header', () => {
    render(<SettingsPage />);
    expect(screen.getByText(/Paramètres du projet/i)).toBeInTheDocument();
  });
});
