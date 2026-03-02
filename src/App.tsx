import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Ping from "./pages/Ping";
import Callback from "./pages/Callback";
import MyPage from "./pages/MyPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ping" element={<Ping />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/oauth/callback" element={<Callback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
