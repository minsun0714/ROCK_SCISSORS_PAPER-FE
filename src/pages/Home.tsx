import { startGoogleLogin } from "@/service/authService";
import "./Home.css";

function Home() {
  const handleGoogleLogin = () => {
    startGoogleLogin();
  };

  return (
    <main className="home">
      <h1>가위바위보 게임</h1>
      <button className="google-login-btn" onClick={handleGoogleLogin}>
        Google로 로그인
      </button>
    </main>
  );
}

export default Home;
