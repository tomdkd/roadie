import { render, screen } from '@testing-library/react';
import { DocumentFormatBadge } from './DocumentFormatBadge';

describe('DocumentFormatBadge', () => {
  it('affiche le bon format pour pdf', () => {
    render(<DocumentFormatBadge format="pdf" />);
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('affiche le bon format pour docx', () => {
    render(<DocumentFormatBadge format="docx" />);
    expect(screen.getByText('DOCX')).toBeInTheDocument();
  });
});
