import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const sessionExpiresAt = useAuthStore((state) => state.sessionExpiresAt);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  if (isInitializing) {
    return <main className="auth-page" role="status">Checking your session…</main>;
  }

  if (!user || !sessionExpiresAt) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
