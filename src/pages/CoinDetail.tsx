import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCoinDetail } from '../services/api';
import type { CoinDetail } from '../types';

export default function CoinDetail() {
  const { id } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoin = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getCoinDetail(id);
        setCoin(data);
      } catch (error) {
        console.error('Failed to fetch coin:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoin();
  }, [id]);

  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return 'N/A';
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

  if (!coin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Coin not found</p>
        <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
          Back to list
        </Link>
      </div>
    );
  }

  const { market_data } = coin;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/" className="text-blue-500 dark:text-blue-400 hover:underline mb-6 inline-block">
        ← Back to list
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <img src={coin.image.large} alt={coin.name} className="w-16 h-16 rounded-full" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              {coin.name}
              <span className="text-xl text-gray-500 dark:text-gray-400 uppercase">{coin.symbol}</span>
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(market_data.current_price.usd)}</span>
              <span className={`px-3 py-1 rounded-lg ${market_data.price_change_percentage_24h >= 0 ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400'}`}>
                {market_data.price_change_percentage_24h >= 0 ? '+' : ''}{market_data.price_change_percentage_24h?.toFixed(2)}%
              </span>
              <span className="text-gray-500 dark:text-gray-400">Rank #{coin.market_cap_rank}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <StatCard label="Market Cap" value={formatNumber(market_data.market_cap.usd)} />
          <StatCard label="Volume (24h)" value={formatNumber(market_data.total_volume.usd)} />
          <StatCard label="24h High" value={formatPrice(market_data.high_24h.usd)} />
          <StatCard label="24h Low" value={formatPrice(market_data.low_24h.usd)} />
          <StatCard label="Circulating Supply" value={market_data.circulating_supply?.toLocaleString() || 'N/A'} />
          <StatCard label="Max Supply" value={market_data.max_supply?.toLocaleString() || '∞'} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Price Change</h2>
          <div className="space-y-3">
            <ChangeRow label="24h" value={market_data.price_change_percentage_24h} />
            <ChangeRow label="7d" value={market_data.price_change_percentage_7d} />
            <ChangeRow label="30d" value={market_data.price_change_percentage_30d} />
            <ChangeRow label="1y" value={market_data.price_change_percentage_1y} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">All Time High & Low</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900/50">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm">All Time High</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatPrice(market_data.ath.usd)}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{new Date(market_data.ath_date.usd).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900/50">
              <div>
                <p className="text-red-600 dark:text-red-400 text-sm">All Time Low</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatPrice(market_data.atl.usd)}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{new Date(market_data.atl_date.usd).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {coin.description.en && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mt-8 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">About {coin.name}</h2>
          <div 
            className="text-gray-600 dark:text-gray-300 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: coin.description.en }}
          />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
      <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
      <p className="text-lg font-semibold mt-1 text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

function ChangeRow({ label, value }: { label: string; value: number | null | undefined }) {
  if (value === null || value === undefined) return null;
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className={`font-medium ${value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {value >= 0 ? '+' : ''}{value.toFixed(2)}%
      </span>
    </div>
  );
}
