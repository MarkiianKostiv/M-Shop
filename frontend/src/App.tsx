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
import { AdminPage } from "./pages/AdminPage";
import { CategoryPage } from "./pages/CategoryPage";
import { CartPage } from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";
import { TaskPage } from "./pages/TaskPage";
import { TasksListPage } from "./pages/TasksListPage";
import { ThreeDEditorPage } from "./pages/ThreeDEditorPage";

function App() {
  const { user, loading, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user && !loading) {
      setTimeout(() => {
        getCartItems();
      }, 10);
    }
  }, [user, getCartItems, loading]);

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
      path: "/admin-dashboard",
      element: user?.role === "admin" ? <AdminPage /> : <Navigate to={"/"} />,
    },
    {
      path: "/admin-tasks/:id",
      element: user?.role === "admin" ? <TaskPage /> : <Navigate to={"/"} />,
    },
    {
      path: "/admin-task-dashboards",
      element:
        user?.role === "admin" ? <TasksListPage /> : <Navigate to={"/"} />,
    },
    {
      path: "/3-d-creator",
      element: <ThreeDEditorPage />,
    },
    {
      path: "/category/:category",
      element: <CategoryPage />,
    },
    {
      path: "/cart",
      element: user ? <CartPage /> : <Navigate to={"/"} />,
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
