import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { LoginPage } from '../../pages/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { ProtectedRoute } from '../ProtectedRoute';
import { AppLayout } from '../../components/layout/AppLayout';
import { SettingsPage } from '../../pages/SettingsPage';
import { SongsPage } from '../../pages/SongsPage/SongsPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/settings',
            element: <SettingsPage />,
          },
          {
            path: '/songs',
            element: <SongsPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
