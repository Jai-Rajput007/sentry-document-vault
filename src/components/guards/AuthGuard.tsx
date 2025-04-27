import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthenticated = !!user;
  
  // If we require auth and user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If we don't require auth (login page) and user is authenticated, redirect to dashboard
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Otherwise, render children
  return <>{children}</>;
}
