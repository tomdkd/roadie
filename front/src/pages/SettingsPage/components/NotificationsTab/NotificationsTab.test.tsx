import { render, screen } from '@testing-library/react';
import { NotificationsTab } from './NotificationsTab';

describe('NotificationsTab', () => {
  it('renders notifications heading', () => {
    render(<NotificationsTab />);
    expect(screen.getByText(/Préférences de notifications/i)).toBeInTheDocument();
  });
});
