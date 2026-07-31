import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { Login } from './pages/Login/Login';
import './App.scss';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <div>Bienvenue sur le Dashboard de Roadie ! 🎸</div>, // En attendant ton vrai composant
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />, // Redirection par défaut si la route n'existe pas
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
