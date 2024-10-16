import { FC, ReactNode } from "react";
import { Loader } from "./Loader";
import { useAuth, RedirectToSignIn } from "@clerk/clerk-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded)
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );

  if (!userId) {
    return <RedirectToSignIn />;
  }

  return <>{children}</>;
};
