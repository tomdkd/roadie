import { fireEvent, render, screen } from '@testing-library/react';
import { MultiSelect } from './MultiSelect';

describe('MultiSelect component', () => {
  it('renders the multi-select placeholder when no option is selected', () => {
    render(
      <MultiSelect
        label="Genres"
        options={['Rock', 'Jazz']}
        selected={[]}
        onChange={() => {}}
      />,
    );

    expect(screen.getByText(/Sélectionner/i)).toBeInTheDocument();
  });

  it('opens the options list when clicked', () => {
    render(
      <MultiSelect
        label="Genres"
        options={['Rock', 'Jazz']}
        selected={[]}
        onChange={() => {}}
      />,
    );

    fireEvent.click(screen.getByText(/Sélectionner/i));
    expect(screen.getByText(/Rock/i)).toBeInTheDocument();
  });
});
