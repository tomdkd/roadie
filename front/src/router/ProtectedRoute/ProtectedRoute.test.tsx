import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

describe('ProtectedRoute component', () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false, user: null, token: null });
  });

  it('redirects unauthenticated users to login', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Protected</div>} />
          </Route>
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });
});
