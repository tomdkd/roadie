import { render, screen } from '@testing-library/react';
import { CreateProjectForm } from './CreateProjectForm';

describe('CreateProjectForm component', () => {
  it('renders the new project form', () => {
    render(<CreateProjectForm onSubmit={() => {}} />);
    expect(
      screen.getByPlaceholderText(/The Neon Monkeys/i),
    ).toBeInTheDocument();
  });
});
