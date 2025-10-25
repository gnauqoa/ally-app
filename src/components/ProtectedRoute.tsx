import { Route, Redirect, RouteProps } from "react-router-dom";
import { getAuthState } from "@/lib/auth-storage";

interface ProtectedRouteProps extends RouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children, ...rest }: ProtectedRouteProps) {
  const authState = getAuthState();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        authState.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

