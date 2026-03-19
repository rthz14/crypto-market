import axios from 'axios';
import type { Coin, CoinDetail } from '../types';

const BASE_URL = 'https://api.coingecko.com/api/v3';

const api = axios.create({
  baseURL: BASE_URL,
});

export const getCoins = async (page = 1, perPage = 100) => {
  const response = await api.get<Coin[]>('/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: perPage,
      page,
      sparkline: true,
      price_change_percentage: '24h,7d,30d',
    },
  });
  return response.data;
};

export const getCoinDetail = async (id: string) => {
  const response = await api.get<CoinDetail>(`/coins/${id}`, {
    params: {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
    },
  });
  return response.data;
};

export const searchCoins = async (query: string) => {
  const response = await api.get('/search', {
    params: { query },
  });
  return response.data.coins;
};
