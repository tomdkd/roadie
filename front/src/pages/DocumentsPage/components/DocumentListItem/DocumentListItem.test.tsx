import { render, screen, fireEvent } from '@testing-library/react';
import { DocumentListItem } from './DocumentListItem';
import type { GroupDocument } from '../../DocumentsPage';

describe('DocumentListItem', () => {
  const mockDoc: GroupDocument = {
    id: '1',
    name: 'Mon Document Test',
    type: 'tech_rider',
    format: 'pdf',
    createdAt: '2026-06-15',
    history: [
      { id: 'v1', date: '2026-06-15', author: 'Jimi Hendrix' },
    ],
  };

  const defaultProps = {
    document: mockDoc,
    isMenuOpen: false,
    menuRef: { current: null },
    onToggleMenu: vi.fn(),
    onCloseMenu: vi.fn(),
    onPreview: vi.fn(),
    onDownload: vi.fn(),
    onDelete: vi.fn(),
  };

  it('affiche le nom du document et son type', () => {
    render(<DocumentListItem {...defaultProps} />);
    expect(screen.getByText('Mon Document Test')).toBeInTheDocument();
    expect(screen.getByText('Fiche technique')).toBeInTheDocument();
  });

  it('appelle onPreview lors du clic sur le bouton aperçu', () => {
    const onPreview = vi.fn();
    render(<DocumentListItem {...defaultProps} onPreview={onPreview} />);
    fireEvent.click(screen.getByTitle('Prévisualiser le document'));
    expect(onPreview).toHaveBeenCalled();
  });
});
