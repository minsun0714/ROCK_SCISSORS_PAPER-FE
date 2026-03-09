import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Callback from "@/pages/Callback";
import Home from "@/pages/Home";
import MyPage from "@/pages/MyPage";
import UserPage from "@/pages/UserPage";
import ApiQueryBoundary from "@/shared/components/error/ApiQueryBoundary";
import RouteErrorBoundary from "@/shared/components/error/RouteErrorBoundary";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <RouteErrorBoundary />,
    element: (
      <ApiQueryBoundary>
        <App />
      </ApiQueryBoundary>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "my",
        element: <MyPage />,
      },
      {
        path: "users/:userId",
        element: <UserPage />,
      },
      {
        path: "oauth/callback",
        element: <Callback />,
      },
    ],
  },
]);

export default router;
