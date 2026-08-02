import { render, screen } from '@testing-library/react';
import { PlatformsWidget } from './PlatformsWidget';

describe('PlatformsWidget component', () => {
  it('renders the platforms widget', () => {
    render(<PlatformsWidget />);
    expect(screen.getByText(/Audiences & Plateformes/i)).toBeInTheDocument();
    expect(screen.getByText(/Spotify/i)).toBeInTheDocument();
  });
});
