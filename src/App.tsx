import { Link, Outlet } from "react-router-dom";
import { startGoogleLogin } from "@/service/authService";

function App() {
  return (
    <>
      <header
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          boxSizing: "border-box",
        }}
      >
        <Link to="/" style={{ fontWeight: 700, textDecoration: "none" }}>
          RSP
        </Link>
        <button type="button" onClick={startGoogleLogin}>
          Google로 로그인
        </button>
      </header>
      <Outlet />
    </>
  );
}

export default App;
