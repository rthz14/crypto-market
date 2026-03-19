import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCoins } from '../services/api';
import type { Coin } from '../types';

export default function CryptoList() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('market_cap_desc');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      try {
        const data = await getCoins();
        setCoins(data);
      } catch (error) {
        console.error('Failed to fetch coins:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, []);

  const filteredCoins = coins
    .filter(coin => 
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_desc': return b.current_price - a.current_price;
        case 'price_asc': return a.current_price - b.current_price;
        case 'change_desc': return b.price_change_percentage_24h - a.price_change_percentage_24h;
        case 'change_asc': return a.price_change_percentage_24h - b.price_change_percentage_24h;
        case 'market_cap_asc': return a.market_cap - b.market_cap;
        default: return b.market_cap - a.market_cap;
      }
    });

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return `$${price.toFixed(6)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h1 className="text-2xl font-bold">Cryptocurrency Prices</h1>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="market_cap_desc">Market Cap Desc</option>
            <option value="market_cap_asc">Market Cap Asc</option>
            <option value="price_desc">Price Desc</option>
            <option value="price_asc">Price Asc</option>
            <option value="change_desc">Change 24h Desc</option>
            <option value="change_asc">Change 24h Asc</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-4 font-medium">#</th>
                <th className="text-left py-4 px-4 font-medium">Name</th>
                <th className="text-right py-4 px-4 font-medium">Price</th>
                <th className="text-right py-4 px-4 font-medium">24h %</th>
                <th className="text-right py-4 px-4 font-medium">7d %</th>
                <th className="text-right py-4 px-4 font-medium hidden md:table-cell">Market Cap</th>
                <th className="text-right py-4 px-4 font-medium hidden lg:table-cell">Volume (24h)</th>
                <th className="text-left py-4 px-4 font-medium hidden lg:table-cell">Last 7 Days</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoins.map((coin) => (
                <tr key={coin.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{coin.market_cap_rank}</td>
                  <td className="py-4 px-4">
                    <Link to={`/coin/${coin.id}`} className="flex items-center gap-3 hover:text-blue-500 dark:hover:text-blue-400">
                      <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{coin.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 uppercase">{coin.symbol}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-right font-medium text-gray-900 dark:text-white">{formatPrice(coin.current_price)}</td>
                  <td className={`py-4 px-4 text-right font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                  </td>
                  <td className={`py-4 px-4 text-right font-medium hidden md:table-cell ${(coin as any).price_change_percentage_7d_in_currency >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {(coin as any).price_change_percentage_7d_in_currency >= 0 ? '+' : ''}{(coin as any).price_change_percentage_7d_in_currency?.toFixed(2) || 'N/A'}%
                  </td>
                  <td className="py-4 px-4 text-right text-gray-700 dark:text-gray-300 hidden md:table-cell">{formatNumber(coin.market_cap)}</td>
                  <td className="py-4 px-4 text-right text-gray-500 dark:text-gray-400 hidden lg:table-cell">{formatNumber(coin.total_volume)}</td>
                  <td className="py-4 px-4 hidden lg:table-cell">
                    {coin.sparkline_in_7d?.price && (
                      <svg className="w-32 h-12" viewBox="0 0 128 48">
                        <polyline
                          fill="none"
                          stroke={coin.price_change_percentage_24h >= 0 ? '#22c55e' : '#ef4444'}
                          strokeWidth="2"
                          points={coin.sparkline_in_7d.price.map((price, i) => {
                            const min = Math.min(...coin.sparkline_in_7d!.price);
                            const max = Math.max(...coin.sparkline_in_7d!.price);
                            const x = (i / (coin.sparkline_in_7d!.price.length - 1)) * 128;
                            const y = 48 - ((price - min) / (max - min || 1)) * 44 - 2;
                            return `${x},${y}`;
                          }).join(' ')}
                        />
                      </svg>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
