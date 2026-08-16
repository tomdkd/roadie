import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DocumentsPage } from './DocumentsPage';

describe('DocumentsPage', () => {
  it('renders sample document from initial data', async () => {
    render(<DocumentsPage />);
    expect(await screen.findByText(/EPK Presse & Festivités - The Neon Monkeys/i)).toBeInTheDocument();
  });
});
