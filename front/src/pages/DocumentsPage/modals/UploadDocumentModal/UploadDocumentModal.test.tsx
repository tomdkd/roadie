import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UploadDocumentModal } from './UploadDocumentModal';

describe('UploadDocumentModal', () => {
  it('renders when open and shows upload UI with disabled submit', () => {
    const onClose = vi.fn();
    const onUpload = vi.fn();

    render(<UploadDocumentModal isOpen onClose={onClose} onUpload={onUpload} />);

    expect(screen.getByText(/Téléverser un document/i)).toBeInTheDocument();
    const submit = screen.getByRole('button', { name: /importer le document/i });
    expect(submit).toBeInTheDocument();
    expect(submit).toBeDisabled();
  });
});
