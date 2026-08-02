import { render, screen } from '@testing-library/react';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders a switch with label', () => {
    render(<Switch label="Test" checked={false} onCheckedChange={() => {}} />);
    expect(screen.getByText(/Test/i)).toBeInTheDocument();
  });
});
