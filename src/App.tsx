import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import CryptoList from './pages/CryptoList';
import CoinDetail from './pages/CoinDetail';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<CryptoList />} />
              <Route path="/coin/:id" element={<CoinDetail />} />
            </Routes>
          </main>
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">Built by Rithesh</p>
          </footer>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
