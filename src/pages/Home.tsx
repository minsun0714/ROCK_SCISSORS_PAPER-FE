import './Home.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
const GOOGLE_LOGIN_URL = `${API_BASE_URL}/oauth2/authorization/google?app_redirect_uri=/ping`;

function Home() {
  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_LOGIN_URL;
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
