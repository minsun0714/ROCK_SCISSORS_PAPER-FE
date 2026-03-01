import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Ping from './pages/Ping';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ping" element={<Ping />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
