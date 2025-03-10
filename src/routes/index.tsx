import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthPage from '../page/authpage';
import HomePage from '../page/homepage';
// import SearchResult from '../page/searchResultPage';
import SearchPage from '../page/searchPage';
import { ProfilePage } from '../page/profile';

// Protected Route wrapper component
// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   // Check if user is authenticated (you can modify this based on your auth logic)
//   const isAuthenticated = !!localStorage.getItem('token');
  
//   if (!isAuthenticated) {
//     return <Navigate to="/auth" replace />;
//   }

//   return <>{children}</>;
// };

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/search',
    element: <SearchPage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]); 