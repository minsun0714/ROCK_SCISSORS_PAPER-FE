import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Callback from "@/pages/Callback";
import Home from "@/pages/Home";
import MyPage from "@/pages/MyPage";
import Ping from "@/pages/Ping";
import UserPage from "@/pages/UserPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "ping",
        element: <Ping />,
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
