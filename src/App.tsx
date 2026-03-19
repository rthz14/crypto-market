import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import CryptoList from './pages/CryptoList';
import CoinDetail from './pages/CoinDetail';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
          <Header />
          <Routes>
            <Route path="/" element={<CryptoList />} />
            <Route path="/coin/:id" element={<CoinDetail />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
