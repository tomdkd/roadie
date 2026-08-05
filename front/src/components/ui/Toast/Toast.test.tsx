import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Toast, type ToastMessage } from './Toast';

test('affiche le message et appelle onClose au clic', async () => {
	const onClose = vi.fn();
	const toast: ToastMessage = { id: '1', message: 'Bonjour', type: 'success' };

	render(<Toast toast={toast} onClose={onClose} duration={100000} />);

	// attend que le message soit rendu (entrée animée async)
	expect(await screen.findByText('Bonjour')).toBeInTheDocument();

	const btn = screen.getByRole('button');
	const user = userEvent.setup();
	await user.click(btn);

	await waitFor(() => expect(onClose).toHaveBeenCalled());
});

