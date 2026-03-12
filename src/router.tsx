import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import BattleRoom from "@/pages/BattleRoom";
import Callback from "@/pages/Callback";
import Home from "@/pages/Home";
import MyPage from "@/pages/MyPage";
import UserPage from "@/pages/UserPage";
import RouteErrorBoundary from "@/shared/components/error/RouteErrorBoundary";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <RouteErrorBoundary />,
    element: <App />,
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
        path: "battles/:battleId",
        element: <BattleRoom />,
      },
      {
        path: "oauth/callback",
        element: <Callback />,
      },
    ],
  },
]);

export default router;
