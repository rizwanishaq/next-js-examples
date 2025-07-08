'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, TrendingDown, Newspaper } from 'lucide-react';

const StockCryptoNews = () => {
  const [stocks, setStocks] = useState([]);
  const [crypto, setCrypto] = useState([]);
  const [news, setNews] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
  const MARKETAUX_API_KEY = process.env.NEXT_PUBLIC_MARKETAUX_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      if (!API_KEY || !MARKETAUX_API_KEY) {
        setError("API Keys are not set. Please add NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY and NEXT_PUBLIC_MARKETAUX_API_KEY to your .env.local file.");
        setLoading(false);
        return;
      }

      try {
        // Fetch Stock Data (e.g., IBM, MSFT, GOOGL)
        const stockSymbols = ['IBM', 'MSFT', 'GOOGL', 'AMZN', 'NVDA'];
        const stockPromises = stockSymbols.map(symbol =>
          axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`)
        );
        const stockResponses = await Promise.all(stockPromises);
        const fetchedStocks = stockResponses.map(res => {
          const data = res.data['Global Quote'];
          if (data && data['01. symbol']) {
            return {
              symbol: data['01. symbol'],
              price: parseFloat(data['05. price']).toFixed(2),
              change: parseFloat(data['09. change']).toFixed(2),
              changePercent: parseFloat(data['10. change percent']).toFixed(2),
            };
          }
          return null;
        }).filter(Boolean);
        setStocks(fetchedStocks);

        // Fetch Crypto Data (e.g., BTC, ETH)
        const cryptoSymbols = ['BTC', 'ETH', 'XRP', 'LTC'];
        const cryptoPromises = cryptoSymbols.map(symbol =>
          axios.get(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=USD&apikey=${API_KEY}`)
        );
        const cryptoResponses = await Promise.all(cryptoPromises);
        const fetchedCrypto = cryptoResponses.map(res => {
          const data = res.data['Time Series (Digital Currency Daily)'];
          if (data) {
            const latestDate = Object.keys(data)[0];
            const latestData = data[latestDate];
            const price = latestData && latestData['4b. close (USD)'] ? parseFloat(latestData['4b. close (USD)']).toFixed(2) : 'N/A';
            return {
              symbol: res.config.url.split('symbol=')[1].split('&')[0], // Extract symbol from URL
              price: price,
            };
          }
          return null;
        }).filter(Boolean);
        setCrypto(fetchedCrypto);

        // Fetch News from Marketaux
        const newsResponse = await axios.get(`https://api.marketaux.com/v1/news/all?api_token=${MARKETAUX_API_KEY}&filter_entities=true&language=en&limit=10`);
        if (newsResponse.data.data) {
          setNews(newsResponse.data.data.map(article => ({
            title: article.title,
            url: article.url,
            summary: article.description,
            source: article.source,
            time_published: article.published_at,
          })));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please check your API key and network connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_KEY, MARKETAUX_API_KEY]);

  if (loading) {
    return <div className="text-center py-8">Loading market data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 md:p-8 lg:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Markets Overview</h1>

      {/* Market Ticker Bar */}
      <div className="relative w-full overflow-hidden py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg mb-8 border border-blue-100">
        <div className="flex animate-marquee whitespace-nowrap items-center">
          {stocks.concat(crypto).map((item, index) => (
            <span key={index} className="text-xl font-bold mx-6 text-gray-800 flex items-center">
              {item.symbol}: <span className={`ml-2 ${item.change && item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>${item.price}</span>
              {item.change && (
                <span className={`text-sm ml-2 ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change >= 0 ? '+' : ''}{item.change} ({item.changePercent}%)
                </span>
              )}
            </span>
          ))}
          {/* Duplicate content for seamless loop */}
          {stocks.concat(crypto).map((item, index) => (
            <span key={`duplicate-${index}`} className="text-xl font-bold mx-6 text-gray-800 flex items-center">
              {item.symbol}: <span className={`ml-2 ${item.change && item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>${item.price}</span>
              {item.change && (
                <span className={`text-sm ml-2 ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change >= 0 ? '+' : ''}{item.change} ({item.changePercent}%)
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Stocks Section */}
        <Card className="col-span-1 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" /> Stocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stocks.length > 0 ? (
              <ul className="space-y-3">
                {stocks.map((stock) => (
                  <li key={stock.symbol} className="flex justify-between items-center py-2 border-b last:border-b-0 border-gray-200">
                    <span className="font-medium text-gray-700">{stock.symbol}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">${stock.price}</span>
                      <span className={`text-sm font-medium ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
                      </span>
                      {stock.change >= 0 ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No stock data available.</p>
            )}
          </CardContent>
        </Card>

        {/* Crypto Section */}
        <Card className="col-span-1 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" /> Cryptocurrencies
            </CardTitle>
          </CardHeader>
          <CardContent>
            {crypto.length > 0 ? (
              <ul className="space-y-3">
                {crypto.map((coin) => (
                  <li key={coin.symbol} className="flex justify-between items-center py-2 border-b last:border-b-0 border-gray-200">
                    <span className="font-medium text-gray-700">{coin.symbol}/USD</span>
                    <span className="text-lg font-bold text-gray-900">${coin.price}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No cryptocurrency data available.</p>
            )}
          </CardContent>
        </Card>

        {/* News Section */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-1 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-purple-500" /> Latest News
            </CardTitle>
          </CardHeader>
          <CardContent>
            {news.length > 0 ? (
              <ul className="space-y-4">
                {news.map((article, index) => (
                  <li key={index} className="border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0 hover:bg-gray-50 transition-colors duration-200 ease-in-out rounded-md p-2 -mx-2">
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-semibold text-base">
                      {article.title}
                    </a>
                    <p className="text-sm text-gray-700 mt-1 line-clamp-3">{article.summary}</p>
                    <p className="text-xs text-gray-500 mt-2">Source: {article.source} - {new Date(article.time_published).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No news available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StockCryptoNews;
