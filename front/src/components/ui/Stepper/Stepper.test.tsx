import { render, screen } from '@testing-library/react';
import { Stepper } from './Stepper';

describe('Stepper component', () => {
  it('renders step labels', () => {
    render(
      <Stepper
        steps={[
          { id: 1, label: 'step.one' },
          { id: 2, label: 'step.two' },
        ]}
        currentStep={1}
      />,
    );

    expect(screen.getByText(/1/i)).toBeInTheDocument();
    expect(screen.getByText(/2/i)).toBeInTheDocument();
  });
});
