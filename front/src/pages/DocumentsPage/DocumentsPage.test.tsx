import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DocumentsPage } from './DocumentsPage';

describe('DocumentsPage', () => {
  it('renders sample document from initial data', () => {
    render(<DocumentsPage />);
    expect(screen.getByText(/EPK Presse & Festivités - The Neon Monkeys/i)).toBeInTheDocument();
  });
});
