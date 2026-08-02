import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProjectSelector } from './ProjectSelector';

describe('ProjectSelector component', () => {
  it('renders the project selector', () => {
    render(<ProjectSelector onOpenNewProjectModal={() => {}} />, {
      wrapper: MemoryRouter,
    });
    expect(screen.getByText(/The Neon Monkeys/i)).toBeInTheDocument();
  });
});
