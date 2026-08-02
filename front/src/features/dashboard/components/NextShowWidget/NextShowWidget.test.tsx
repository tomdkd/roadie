import { render, screen } from '@testing-library/react';
import { NextShowWidget } from './NextShowWidget';

describe('NextShowWidget component', () => {
  it('renders next show information', () => {
    render(<NextShowWidget />);
    expect(screen.getByText(/Prochain Concert/i)).toBeInTheDocument();
    expect(screen.getByText(/Dans 4 jours/i)).toBeInTheDocument();
  });
});
