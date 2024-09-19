import { useEffect } from "react";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
// pages
import { Home } from "./pages/Home";
import { SignUpPage } from "./pages/SignUpPage";
import { LoginPage } from "./pages/LoginPage";
import { useUserStore } from "./stores/useUserStores";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) {
    return <LoadingSpinner />;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/sign-up",
      element: !user ? <SignUpPage /> : <Navigate to={"/"} />,
    },
    {
      path: "/login",
      element: !user ? <LoginPage /> : <Navigate to={"/"} />,
    },
    {
      path: "*",
      element: (
        <Navigate
          to='/'
          replace
        />
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
