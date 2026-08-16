import { render, screen } from '@testing-library/react';
import { DocumentTypeBadge } from './DocumentTypeBadge';

describe('DocumentTypeBadge', () => {
  it('affiche le bon libellé pour tech_rider', () => {
    render(<DocumentTypeBadge type="tech_rider" />);
    expect(screen.getByText('Fiche technique')).toBeInTheDocument();
  });

  it('affiche le bon libellé pour epk', () => {
    render(<DocumentTypeBadge type="epk" />);
    expect(screen.getByText('EPK')).toBeInTheDocument();
  });
});
