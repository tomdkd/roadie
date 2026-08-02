import { render, screen } from '@testing-library/react';
import { NewProjectModal } from './NewProjectModal';

describe('NewProjectModal component', () => {
  it('renders the new project modal when open', () => {
    render(<NewProjectModal isOpen onClose={() => {}} />);
    expect(screen.getByText(/Ajouter un projet/i)).toBeInTheDocument();
  });
});
