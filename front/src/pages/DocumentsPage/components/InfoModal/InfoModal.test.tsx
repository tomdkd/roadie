import { render, screen, fireEvent } from '@testing-library/react';
import { InfoModal } from './InfoModal';

describe('InfoModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onStart: vi.fn(),
    title: 'Titre Test',
    subtitle: 'Sous-titre Test',
    icon: <span data-testid="icon" />,
    iconWrapperClassName: 'bg-blue-500',
    subtitleClassName: 'text-blue-500',
    startLabel: 'Démarrer',
    children: <div>Contenu Test</div>,
  };

  it('affiche le titre et le contenu quand isOpen est true', () => {
    render(<InfoModal {...defaultProps} />);
    expect(screen.getByText('Titre Test')).toBeInTheDocument();
    expect(screen.getByText('Contenu Test')).toBeInTheDocument();
  });

  it('appelle onStart lors du clic sur le bouton de démarrage', () => {
    const onStart = vi.fn();
    render(<InfoModal {...defaultProps} onStart={onStart} />);
    fireEvent.click(screen.getByText('Démarrer'));
    expect(onStart).toHaveBeenCalled();
  });
});
