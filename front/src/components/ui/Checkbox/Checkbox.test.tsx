import { fireEvent, render, screen } from '@testing-library/react';
import { Checkbox } from './Checkbox';

describe('Checkbox component', () => {
  it('renders a checkbox with a label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByLabelText(/Accept terms/i)).toBeInTheDocument();
  });

  it('toggles checked state when clicked', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Accept terms" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText(/Accept terms/i));
    expect(onChange).toHaveBeenCalled();
  });
});
