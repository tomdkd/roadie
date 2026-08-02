import { render, screen } from '@testing-library/react';
import { LanguageToggle } from './LanguageToggle';

describe('LanguageToggle component', () => {
  it('renders the language toggle button', () => {
    render(<LanguageToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
