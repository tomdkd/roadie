import { render, screen } from '@testing-library/react';
import { StreamingPlatformCard } from './StreamingPlatformCard';
import type { PlatformStat } from './StreamingPlatformCard';

describe('StreamingPlatformCard', () => {
  it('renders platform name', () => {
    const platform = {
      id: 'p1',
      name: 'Spotify',
      shortName: 'SP',
      listeners: '1.2k',
      subscribers: '12',
      trend: '+3%',
      isPositive: true,
      color: 'text-white',
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
    } as PlatformStat;

    render(<StreamingPlatformCard platform={platform} />);
    expect(screen.getByText(/Spotify/i)).toBeInTheDocument();
  });
});
