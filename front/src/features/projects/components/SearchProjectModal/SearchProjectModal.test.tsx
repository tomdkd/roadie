import { render, screen } from '@testing-library/react';
import { SearchProjectModal } from './SearchProjectModal';

describe('SearchProjectModal component', () => {
  it('renders the search project modal when open', () => {
    render(
      <SearchProjectModal
        isOpen
        onClose={() => {}}
        onSelectProject={() => {}}
      />,
    );
    expect(
      screen.getByText(/Rechercher ton projet sur Roadie/i),
    ).toBeInTheDocument();
  });
});
