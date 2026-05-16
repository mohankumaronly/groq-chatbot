import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Loader } from '../shared/components/ui/Loader';
import { ROUTES } from '../constants/app.constants';

interface PublicRouteProps {
  redirectTo?: string;
}

export const PublicRoute = ({ redirectTo = ROUTES.DASHBOARD }: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loader while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render child routes
  return <Outlet />;
};