import { FC, ReactNode } from "react";
import { useAuth, RedirectToSignIn } from "@clerk/clerk-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;

  if (!userId) {
    return <RedirectToSignIn />;
  }

  return <>{children}</>;
};
